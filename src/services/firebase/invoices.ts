/**
 * Faturas e pagamentos corporativos (ledger manual)
 */
import {
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc,
    onSnapshot,
    query,
    where,
    Unsubscribe,
    runTransaction,
} from 'firebase/firestore';
import { getFirestoreInstance, cleanData, getFirebaseAuth } from './config';
import { Invoice, Payment, PaymentMethod, Allocation, Contract } from '../../types';
import { logAction } from './logs';
import { mapFirestoreDocs } from './mappers';
import { getContract, updateCompany } from './corporate';
import {
    buildInvoiceItems,
    competenceBounds,
    currentCompetence,
    deriveInvoiceStatus,
    dueDateForCompetence,
    invoiceBalance,
    roundMoney,
} from '../../utils/corporateBilling';

const nowIso = () => new Date().toISOString();
const todayYmd = () => nowIso().slice(0, 10);

async function currentUserEmail(): Promise<string> {
    const auth = await getFirebaseAuth();
    return auth?.currentUser?.email || 'admin';
}

async function getAllocationsForContract(contractId: string): Promise<Allocation[]> {
    const db = await getFirestoreInstance();
    const q = query(collection(db, 'allocations'), where('contractId', '==', contractId));
    const snap = await getDocs(q);
    return mapFirestoreDocs<Allocation>(snap);
}

async function findInvoiceByUniqueKey(uniqueKey: string): Promise<Invoice | null> {
    const db = await getFirestoreInstance();
    const q = query(collection(db, 'invoices'), where('uniqueKey', '==', uniqueKey));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...(d.data() as Omit<Invoice, 'id'>) };
}

export const subscribeToInvoicesByCompany = (
    companyId: string,
    callback: (invoices: Invoice[]) => void
): (() => void) => {
    let unsub: Unsubscribe | undefined;
    let cancelled = false;

    getFirestoreInstance()
        .then((db) => {
            if (cancelled) return;
            const q = query(collection(db, 'invoices'), where('companyId', '==', companyId));
            unsub = onSnapshot(
                q,
                (snap) => {
                    const list = mapFirestoreDocs<Invoice>(snap);
                    // Atualiza overdue em memória (sem write) para UI
                    const today = todayYmd();
                    const enriched = list.map((inv) => {
                        if (
                            inv.status === 'issued' ||
                            inv.status === 'partial' ||
                            inv.status === 'overdue'
                        ) {
                            return {
                                ...inv,
                                status: deriveInvoiceStatus(
                                    inv.total,
                                    inv.amountPaid,
                                    inv.status,
                                    inv.dueDate,
                                    today
                                ),
                            };
                        }
                        return inv;
                    });
                    enriched.sort((a, b) => b.competence.localeCompare(a.competence));
                    callback(enriched);
                },
                () => callback([])
            );
        })
        .catch(() => callback([]));

    return () => {
        cancelled = true;
        unsub?.();
    };
};

export const subscribeToInvoicesByContract = (
    contractId: string,
    callback: (invoices: Invoice[]) => void
): (() => void) => {
    let unsub: Unsubscribe | undefined;
    let cancelled = false;

    getFirestoreInstance()
        .then((db) => {
            if (cancelled) return;
            const q = query(collection(db, 'invoices'), where('contractId', '==', contractId));
            unsub = onSnapshot(
                q,
                (snap) => {
                    const list = mapFirestoreDocs<Invoice>(snap);
                    const today = todayYmd();
                    const enriched = list.map((inv) => {
                        if (
                            inv.status === 'issued' ||
                            inv.status === 'partial' ||
                            inv.status === 'overdue'
                        ) {
                            return {
                                ...inv,
                                status: deriveInvoiceStatus(
                                    inv.total,
                                    inv.amountPaid,
                                    inv.status,
                                    inv.dueDate,
                                    today
                                ),
                            };
                        }
                        return inv;
                    });
                    enriched.sort((a, b) => b.competence.localeCompare(a.competence));
                    callback(enriched);
                },
                () => callback([])
            );
        })
        .catch(() => callback([]));

    return () => {
        cancelled = true;
        unsub?.();
    };
};

export const getInvoice = async (id: string): Promise<Invoice | null> => {
    const db = await getFirestoreInstance();
    const snap = await getDoc(doc(db, 'invoices', id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as Omit<Invoice, 'id'>) };
};

export const subscribeToPaymentsByInvoice = (
    invoiceId: string,
    callback: (payments: Payment[]) => void
): (() => void) => {
    let unsub: Unsubscribe | undefined;
    let cancelled = false;

    getFirestoreInstance()
        .then((db) => {
            if (cancelled) return;
            const q = query(collection(db, 'payments'), where('invoiceId', '==', invoiceId));
            unsub = onSnapshot(
                q,
                (snap) => {
                    const list = mapFirestoreDocs<Payment>(snap);
                    list.sort((a, b) => b.paidAt.localeCompare(a.paidAt));
                    callback(list);
                },
                () => callback([])
            );
        })
        .catch(() => callback([]));

    return () => {
        cancelled = true;
        unsub?.();
    };
};

/**
 * Gera fatura draft para o contrato + competência.
 * Se já existir draft com o mesmo uniqueKey, regenera itens.
 * Se existir issued/paid/etc, lança erro.
 */
export const generateInvoiceDraft = async (
    contractId: string,
    competence: string = currentCompetence()
): Promise<string> => {
    if (!/^\d{4}-\d{2}$/.test(competence)) {
        throw new Error('Competência inválida (use YYYY-MM)');
    }

    const contract = await getContract(contractId);
    if (!contract) throw new Error('Contrato não encontrado');

    const uniqueKey = `${contractId}_${competence}`;
    const existing = await findInvoiceByUniqueKey(uniqueKey);

    const allocations = await getAllocationsForContract(contractId);
    const items = buildInvoiceItems(contract, allocations, competence);
    if (items.length === 0) {
        throw new Error('Nenhuma alocação ativa nesta competência');
    }

    const subtotal = roundMoney(items.reduce((s, i) => s + i.amount, 0));
    const discount = existing?.status === 'draft' ? existing.discount || 0 : 0;
    const total = roundMoney(Math.max(0, subtotal - discount));
    const dueDate = dueDateForCompetence(competence, contract.billingDay || 10);
    const email = await currentUserEmail();
    const db = await getFirestoreInstance();
    const invoiceRef = doc(db, 'invoices', existing?.id || uniqueKey);

    const data = cleanData({
        companyId: contract.companyId,
        companyName: contract.companyName,
        contractId,
        competence,
        issueDate: todayYmd(),
        dueDate,
        status: 'draft' as const,
        items,
        subtotal,
        discount: 0,
        total,
        amountPaid: 0,
        uniqueKey,
        createdAt: nowIso(),
        updatedAt: nowIso(),
    });

    const operation = await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(invoiceRef);
        if (snap.exists()) {
            const current = { id: snap.id, ...(snap.data() as Omit<Invoice, 'id'>) };
            if (current.status !== 'draft') {
                throw new Error(
                    `Já existe fatura ${current.status} para ${competence}. Cancele-a antes de regenerar.`
                );
            }
            transaction.update(
                invoiceRef,
                cleanData({
                    items,
                    subtotal,
                    discount: current.discount || 0,
                    total: roundMoney(Math.max(0, subtotal - (current.discount || 0))),
                    dueDate,
                    companyName: contract.companyName,
                    updatedAt: nowIso(),
                })
            );
            return 'updated' as const;
        }
        transaction.set(invoiceRef, data);
        return 'created' as const;
    });

    if (operation === 'updated') {
        await logAction('update', email, `Fatura draft regenerada ${competence}`, invoiceRef.id);
        return invoiceRef.id;
    }
    await logAction(
        'create',
        email,
        `Fatura draft ${competence} — ${contract.companyName}`,
        invoiceRef.id,
        contract.companyName
    );
    return invoiceRef.id;
};

export type BatchInvoiceItem = {
    contractId: string;
    companyId: string;
    companyName: string;
    invoiceId?: string;
    reason?: string;
    message?: string;
};

export type BatchInvoiceResult = {
    competence: string;
    created: BatchInvoiceItem[];
    skipped: BatchInvoiceItem[];
    errors: BatchInvoiceItem[];
};

/**
 * Gera rascunhos de fatura para todos os contratos ativos na competência.
 * Não sobrescreve faturas já emitidas/pagas — essas entram em skipped.
 */
export const generateInvoicesBatchForCompetence = async (
    competence: string = currentCompetence()
): Promise<BatchInvoiceResult> => {
    if (!/^\d{4}-\d{2}$/.test(competence)) {
        throw new Error('Competência inválida (use YYYY-MM)');
    }

    const db = await getFirestoreInstance();
    const snap = await getDocs(query(collection(db, 'contracts'), where('status', '==', 'active')));
    const contracts = mapFirestoreDocs<Contract>(snap);
    const { first, last } = competenceBounds(competence);

    const result: BatchInvoiceResult = {
        competence,
        created: [],
        skipped: [],
        errors: [],
    };

    for (const contract of contracts) {
        if (!contract.id) continue;
        const base = {
            contractId: contract.id,
            companyId: contract.companyId,
            companyName: contract.companyName,
        };

        if (contract.startDate > last) {
            result.skipped.push({
                ...base,
                reason: 'Contrato ainda não iniciado nesta competência',
            });
            continue;
        }
        if (contract.endDate && contract.endDate < first) {
            result.skipped.push({
                ...base,
                reason: 'Contrato já encerrado antes desta competência',
            });
            continue;
        }

        const uniqueKey = `${contract.id}_${competence}`;
        const existing = await findInvoiceByUniqueKey(uniqueKey);
        if (existing && existing.status !== 'draft') {
            result.skipped.push({
                ...base,
                invoiceId: existing.id,
                reason: `Já existe fatura ${existing.status}`,
            });
            continue;
        }

        try {
            const invoiceId = await generateInvoiceDraft(contract.id, competence);
            result.created.push({ ...base, invoiceId });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Erro ao gerar';
            if (message.includes('Nenhuma alocação')) {
                result.skipped.push({ ...base, reason: message });
            } else {
                result.errors.push({ ...base, message });
            }
        }
    }

    const email = await currentUserEmail();
    await logAction(
        'create',
        email,
        `Lote faturas ${competence}: ${result.created.length} criadas, ${result.skipped.length} ignoradas, ${result.errors.length} erros`,
        undefined,
        `Competência ${competence}`
    );

    return result;
};

export const issueInvoice = async (invoiceId: string): Promise<void> => {
    const email = await currentUserEmail();
    const db = await getFirestoreInstance();
    const invoiceRef = doc(db, 'invoices', invoiceId);
    let inv: Invoice | undefined;
    await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(invoiceRef);
        if (!snapshot.exists()) throw new Error('Fatura não encontrada');
        inv = { id: snapshot.id, ...(snapshot.data() as Omit<Invoice, 'id'>) };
        if (inv.status !== 'draft') throw new Error('Só é possível emitir faturas em rascunho');
        transaction.update(
            invoiceRef,
            cleanData({
                status: 'issued',
                issueDate: todayYmd(),
                issuedAt: nowIso(),
                updatedAt: nowIso(),
            })
        );
    });
    if (!inv) throw new Error('Fatura não encontrada');
    await refreshCompanyOpenBalance(inv.companyId);
    await logAction(
        'update',
        email,
        `Fatura emitida ${inv.competence}`,
        invoiceId,
        inv.companyName
    );
};

export const cancelInvoice = async (invoiceId: string): Promise<void> => {
    const email = await currentUserEmail();
    const db = await getFirestoreInstance();
    const invoiceRef = doc(db, 'invoices', invoiceId);
    let inv: Invoice | undefined;
    let alreadyCancelled = false;
    await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(invoiceRef);
        if (!snapshot.exists()) throw new Error('Fatura não encontrada');
        inv = { id: snapshot.id, ...(snapshot.data() as Omit<Invoice, 'id'>) };
        if (inv.status === 'cancelled') {
            alreadyCancelled = true;
            return;
        }
        if (inv.amountPaid > 0) {
            throw new Error('Cancele ou estorne os pagamentos antes de cancelar a fatura');
        }
        transaction.update(
            invoiceRef,
            cleanData({
                status: 'cancelled',
                cancelledAt: nowIso(),
                updatedAt: nowIso(),
            })
        );
    });
    if (!inv || alreadyCancelled) return;
    await refreshCompanyOpenBalance(inv.companyId);
    await logAction(
        'update',
        email,
        `Fatura cancelada ${inv.competence}`,
        invoiceId,
        inv.companyName
    );
};

export const updateInvoiceDiscount = async (invoiceId: string, discount: number): Promise<void> => {
    const d = roundMoney(Math.max(0, discount));
    const db = await getFirestoreInstance();
    const invoiceRef = doc(db, 'invoices', invoiceId);
    await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(invoiceRef);
        if (!snapshot.exists()) throw new Error('Fatura não encontrada');
        const inv = snapshot.data() as Invoice;
        if (inv.status !== 'draft') throw new Error('Desconto só em rascunho');
        const total = roundMoney(Math.max(0, inv.subtotal - d));
        transaction.update(invoiceRef, cleanData({ discount: d, total, updatedAt: nowIso() }));
    });
};

export const updateInvoiceNf = async (invoiceId: string, nf: Invoice['nf']): Promise<void> => {
    const invoice = await getInvoice(invoiceId);
    if (!invoice) throw new Error('Fatura não encontrada neste tenant');
    const db = await getFirestoreInstance();
    await updateDoc(doc(db, 'invoices', invoiceId), cleanData({ nf, updatedAt: nowIso() }));
};

export const registerInvoicePayment = async (input: {
    invoiceId: string;
    amount: number;
    method: PaymentMethod;
    paidAt?: string;
    note?: string;
}): Promise<string> => {
    const amount = roundMoney(input.amount);
    if (amount <= 0) throw new Error('Valor inválido');

    const email = await currentUserEmail();
    const db = await getFirestoreInstance();
    const invoiceRef = doc(db, 'invoices', input.invoiceId);
    const paymentRef = doc(collection(db, 'payments'));
    const committedInvoice = await runTransaction(db, async (transaction) => {
        const invoiceSnap = await transaction.get(invoiceRef);
        if (!invoiceSnap.exists()) throw new Error('Fatura não encontrada');
        const inv = { id: invoiceSnap.id, ...(invoiceSnap.data() as Omit<Invoice, 'id'>) };
        if (inv.status === 'draft') throw new Error('Emita a fatura antes de registrar pagamento');
        if (inv.status === 'cancelled') throw new Error('Fatura cancelada');

        const balance = invoiceBalance(inv.total, inv.amountPaid);
        if (amount > balance + 0.01) {
            throw new Error(`Valor acima do saldo (R$ ${balance.toFixed(2)})`);
        }

        const newPaid = roundMoney(inv.amountPaid + amount);
        const newStatus = deriveInvoiceStatus(inv.total, newPaid, 'issued', inv.dueDate);
        transaction.set(
            paymentRef,
            cleanData({
                invoiceId: inv.id,
                companyId: inv.companyId,
                amount,
                method: input.method,
                paidAt: input.paidAt || todayYmd(),
                note: input.note,
                createdAt: nowIso(),
                createdBy: email,
            })
        );
        transaction.update(
            invoiceRef,
            cleanData({ amountPaid: newPaid, status: newStatus, updatedAt: nowIso() })
        );
        return inv;
    });

    await refreshCompanyOpenBalance(committedInvoice.companyId);
    await logAction(
        'create',
        email,
        `Pagamento R$ ${amount.toFixed(2)} — fatura ${committedInvoice.competence}`,
        paymentRef.id,
        committedInvoice.companyName
    );
    return paymentRef.id;
};

export const deleteInvoicePayment = async (paymentId: string): Promise<void> => {
    const email = await currentUserEmail();
    const db = await getFirestoreInstance();
    const paymentRef = doc(db, 'payments', paymentId);
    const companyId = await runTransaction(db, async (transaction) => {
        const paymentSnap = await transaction.get(paymentRef);
        if (!paymentSnap.exists()) return null;
        const payment = { id: paymentSnap.id, ...(paymentSnap.data() as Omit<Payment, 'id'>) };
        if (!payment.invoiceId) {
            transaction.delete(paymentRef);
            return null;
        }

        const invoiceRef = doc(db, 'invoices', payment.invoiceId);
        const invoiceSnap = await transaction.get(invoiceRef);
        transaction.delete(paymentRef);
        if (!invoiceSnap.exists()) return null;
        const inv = { id: invoiceSnap.id, ...(invoiceSnap.data() as Omit<Invoice, 'id'>) };
        const newPaid = roundMoney(Math.max(0, inv.amountPaid - payment.amount));
        const baseStatus = inv.status === 'cancelled' ? 'cancelled' : 'issued';
        const newStatus = deriveInvoiceStatus(
            inv.total,
            newPaid,
            baseStatus === 'cancelled' ? 'cancelled' : 'issued',
            inv.dueDate
        );
        transaction.update(
            invoiceRef,
            cleanData({
                amountPaid: newPaid,
                status: newStatus,
                updatedAt: nowIso(),
            })
        );
        return inv.companyId;
    });

    if (companyId) await refreshCompanyOpenBalance(companyId);

    await logAction('delete', email, `Pagamento removido`, paymentId);
};

/** Soma em aberto (issued/partial/overdue) e atualiza empresa */
export const refreshCompanyOpenBalance = async (companyId: string): Promise<void> => {
    const db = await getFirestoreInstance();
    const q = query(collection(db, 'invoices'), where('companyId', '==', companyId));
    const snap = await getDocs(q);
    const today = todayYmd();
    let open = 0;
    let hasOverdue = false;

    snap.docs.forEach((d) => {
        const inv = d.data() as Invoice;
        if (inv.status === 'draft' || inv.status === 'cancelled' || inv.status === 'paid') return;
        const status = deriveInvoiceStatus(
            inv.total,
            inv.amountPaid || 0,
            inv.status,
            inv.dueDate,
            today
        );
        const bal = invoiceBalance(inv.total, inv.amountPaid || 0);
        if (bal > 0) open += bal;
        if (status === 'overdue') hasOverdue = true;
    });

    // Preserva status archived
    const companySnap = await getDoc(doc(db, 'companies', companyId));
    const currentStatus = companySnap.exists()
        ? (companySnap.data() as { status?: string }).status
        : 'active';

    await updateCompany(companyId, {
        openBalance: roundMoney(open),
        ...(currentStatus === 'archived' ? {} : { status: hasOverdue ? 'delinquent' : 'active' }),
    });
};

/** Todas as faturas (relatório financeiro) */
export const subscribeToAllInvoices = (callback: (invoices: Invoice[]) => void): (() => void) => {
    let unsub: Unsubscribe | undefined;
    let cancelled = false;

    getFirestoreInstance()
        .then((db) => {
            if (cancelled) return;
            unsub = onSnapshot(
                collection(db, 'invoices'),
                (snap) => {
                    const today = todayYmd();
                    const list = mapFirestoreDocs<Invoice>(snap).map((inv) => {
                        if (
                            inv.status === 'issued' ||
                            inv.status === 'partial' ||
                            inv.status === 'overdue'
                        ) {
                            return {
                                ...inv,
                                status: deriveInvoiceStatus(
                                    inv.total,
                                    inv.amountPaid,
                                    inv.status,
                                    inv.dueDate,
                                    today
                                ),
                            };
                        }
                        return inv;
                    });
                    list.sort((a, b) => b.competence.localeCompare(a.competence));
                    callback(list);
                },
                () => callback([])
            );
        })
        .catch(() => callback([]));

    return () => {
        cancelled = true;
        unsub?.();
    };
};

/** Faturas em aberto de todas as empresas (para alertas do CRM) */
export const subscribeToOpenInvoices = (callback: (invoices: Invoice[]) => void): (() => void) => {
    let unsub: Unsubscribe | undefined;
    let cancelled = false;

    getFirestoreInstance()
        .then((db) => {
            if (cancelled) return;
            unsub = onSnapshot(
                query(
                    collection(db, 'invoices'),
                    where('status', 'in', ['issued', 'partial', 'overdue'])
                ),
                (snap) => {
                    const today = todayYmd();
                    const list = mapFirestoreDocs<Invoice>(snap)
                        .map((inv) => {
                            if (
                                inv.status === 'issued' ||
                                inv.status === 'partial' ||
                                inv.status === 'overdue'
                            ) {
                                return {
                                    ...inv,
                                    status: deriveInvoiceStatus(
                                        inv.total,
                                        inv.amountPaid,
                                        inv.status,
                                        inv.dueDate,
                                        today
                                    ),
                                };
                            }
                            return inv;
                        })
                        .filter((inv) => {
                            if (
                                inv.status === 'draft' ||
                                inv.status === 'cancelled' ||
                                inv.status === 'paid'
                            )
                                return false;
                            return invoiceBalance(inv.total, inv.amountPaid) > 0.01;
                        });
                    list.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
                    callback(list);
                },
                () => callback([])
            );
        })
        .catch(() => callback([]));

    return () => {
        cancelled = true;
        unsub?.();
    };
};

// Re-export helper used by UI
export { currentCompetence };
