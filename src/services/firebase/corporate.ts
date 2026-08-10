/**
 * Corporativo B2B — Empresa, Contrato, Alocação
 * Faturas/pagamentos entram na fase 2.
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
    DocumentSnapshot,
    DocumentData,
} from 'firebase/firestore';
import { getFirestoreInstance, cleanData, getFirebaseAuth } from './config';
import { Company, Contract, Allocation, Invoice, Reservation } from '../../types';
import { logAction } from './logs';
import { mapFirestoreDocs } from './mappers';
import { deriveInvoiceStatus, invoiceBalance } from '../../utils/corporateBilling';
import { isValidCnpj } from '../../utils/corporateValidation';

const nowIso = () => new Date().toISOString();

async function currentUserEmail(): Promise<string> {
    const auth = await getFirebaseAuth();
    return auth?.currentUser?.email || 'admin';
}

// --- Companies ---

export const subscribeToCompanies = (callback: (companies: Company[]) => void): (() => void) => {
    let unsub: Unsubscribe | undefined;
    let cancelled = false;

    getFirestoreInstance()
        .then((db) => {
            if (cancelled) return;
            const q = query(collection(db, 'companies'));
            unsub = onSnapshot(
                q,
                (snap) => {
                    const list = mapFirestoreDocs<Company>(snap);
                    list.sort((a, b) => a.legalName.localeCompare(b.legalName, 'pt-BR'));
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

export const getCompany = async (id: string): Promise<Company | null> => {
    const db = await getFirestoreInstance();
    const snap = await getDoc(doc(db, 'companies', id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as Omit<Company, 'id'>) };
};

export type CompanyInput = Omit<Company, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>;

export const createCompany = async (input: CompanyInput): Promise<string> => {
    const cnpj = input.cnpj.replace(/\D/g, '');
    if (!isValidCnpj(cnpj)) throw new Error('CNPJ inválido');
    const email = await currentUserEmail();
    const data = cleanData({
        ...input,
        cnpj,
        openBalance: input.openBalance ?? 0,
        activeFlatCount: input.activeFlatCount ?? 0,
        createdAt: nowIso(),
        updatedAt: nowIso(),
        createdBy: email,
    });
    const db = await getFirestoreInstance();
    const existing = await getDocs(query(collection(db, 'companies'), where('cnpj', '==', cnpj)));
    if (!existing.empty) throw new Error('Já existe uma empresa com este CNPJ');

    const ref = doc(collection(db, 'companies'));
    const identifierRef = doc(db, 'company_identifiers', cnpj);
    await runTransaction(db, async (transaction) => {
        const identifier = await transaction.get(identifierRef);
        if (identifier.exists()) throw new Error('Já existe uma empresa com este CNPJ');
        transaction.set(ref, data);
        transaction.set(identifierRef, {
            companyId: ref.id,
            propertyId: 'integracao',
            createdAt: nowIso(),
        });
    });
    await logAction('create', email, `Empresa: ${input.legalName}`, ref.id, input.legalName);
    return ref.id;
};

export const updateCompany = async (id: string, patch: Partial<CompanyInput>): Promise<void> => {
    if (patch.cnpj && !isValidCnpj(patch.cnpj)) throw new Error('CNPJ inválido');
    const email = await currentUserEmail();
    const normalizedCnpj = patch.cnpj?.replace(/\D/g, '');
    const data = cleanData({
        ...patch,
        ...(normalizedCnpj ? { cnpj: normalizedCnpj } : {}),
        updatedAt: nowIso(),
    });
    const db = await getFirestoreInstance();
    const companyRef = doc(db, 'companies', id);

    if (normalizedCnpj) {
        await runTransaction(db, async (transaction) => {
            const companySnap = await transaction.get(companyRef);
            if (!companySnap.exists()) throw new Error('Empresa não encontrada');
            const currentCnpj = String(companySnap.data().cnpj || '');
            if (currentCnpj !== normalizedCnpj) {
                const newIdentifierRef = doc(db, 'company_identifiers', normalizedCnpj);
                const identifier = await transaction.get(newIdentifierRef);
                if (identifier.exists() && identifier.data().companyId !== id) {
                    throw new Error('Já existe uma empresa com este CNPJ');
                }
                transaction.set(newIdentifierRef, {
                    companyId: id,
                    propertyId: 'integracao',
                    createdAt: nowIso(),
                });
                if (currentCnpj) {
                    transaction.delete(doc(db, 'company_identifiers', currentCnpj));
                }
            }
            transaction.update(companyRef, data);
        });
    } else {
        const company = await getCompany(id);
        if (!company) throw new Error('Empresa não encontrada');
        await updateDoc(companyRef, data);
    }
    await logAction(
        'update',
        email,
        `Empresa atualizada`,
        id,
        patch.legalName || patch.tradeName || 'Empresa'
    );
};

export const archiveCompany = async (id: string): Promise<void> => {
    await updateCompany(id, { status: 'archived' });
};

/** Reativa conta arquivada (chame refreshCompanyOpenBalance depois para status financeiro) */
export const unarchiveCompany = async (id: string): Promise<void> => {
    const email = await currentUserEmail();
    await updateCompany(id, { status: 'active' });
    await logAction('update', email, `Empresa desarquivada`, id, 'Empresa');
};

// --- Contracts ---

export const subscribeToContractsByCompany = (
    companyId: string,
    callback: (contracts: Contract[]) => void
): (() => void) => {
    let unsub: Unsubscribe | undefined;
    let cancelled = false;

    getFirestoreInstance()
        .then((db) => {
            if (cancelled) return;
            const q = query(collection(db, 'contracts'), where('companyId', '==', companyId));
            unsub = onSnapshot(
                q,
                (snap) => {
                    const list = mapFirestoreDocs<Contract>(snap);
                    list.sort((a, b) => b.startDate.localeCompare(a.startDate));
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

export const getContract = async (id: string): Promise<Contract | null> => {
    const db = await getFirestoreInstance();
    const snap = await getDoc(doc(db, 'contracts', id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as Omit<Contract, 'id'>) };
};

export type ContractInput = Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>;

export const createContract = async (input: ContractInput): Promise<string> => {
    const email = await currentUserEmail();
    const data = cleanData({
        ...input,
        endDate: input.endDate || undefined,
        createdAt: nowIso(),
        updatedAt: nowIso(),
    });
    const db = await getFirestoreInstance();
    const ref = doc(collection(db, 'contracts'));
    await runTransaction(db, async (transaction) => {
        const companyRef = doc(db, 'companies', input.companyId);
        const company = await transaction.get(companyRef);
        if (!company.exists()) throw new Error('Empresa não encontrada');
        transaction.set(ref, data);
    });
    await logAction(
        'create',
        email,
        `Contrato para ${input.companyName}`,
        ref.id,
        input.companyName
    );
    return ref.id;
};

export const updateContract = async (id: string, patch: Partial<ContractInput>): Promise<void> => {
    const email = await currentUserEmail();
    const data = cleanData({
        ...patch,
        ...(patch.endDate === '' ? { endDate: undefined } : {}),
        updatedAt: nowIso(),
    });
    // Firestore rejeita undefined — cleanData já remove
    const db = await getFirestoreInstance();
    const contractRef = doc(db, 'contracts', id);
    await runTransaction(db, async (transaction) => {
        const contract = await transaction.get(contractRef);
        if (!contract.exists()) throw new Error('Contrato não encontrado');
        transaction.update(contractRef, data);
    });
    await logAction('update', email, `Contrato atualizado`, id, patch.companyName || 'Contrato');
};

export type EndContractChecklist = {
    contract: Contract;
    activeAllocations: Allocation[];
    openInvoiceCount: number;
    openBalance: number;
    activeCorporateReservations: number;
};

/** Prévia do que será afetado ao encerrar o contrato */
export const getEndContractChecklist = async (
    contractId: string
): Promise<EndContractChecklist> => {
    const contract = await getContract(contractId);
    if (!contract) throw new Error('Contrato não encontrado');

    const db = await getFirestoreInstance();
    const today = nowIso().slice(0, 10);

    const allocSnap = await getDocs(
        query(collection(db, 'allocations'), where('contractId', '==', contractId))
    );
    const activeAllocations = mapFirestoreDocs<Allocation>(allocSnap).filter(
        (a) => a.status === 'active'
    );

    const invSnap = await getDocs(
        query(collection(db, 'invoices'), where('contractId', '==', contractId))
    );
    let openInvoiceCount = 0;
    let openBalance = 0;
    invSnap.docs.forEach((d) => {
        const inv = { id: d.id, ...(d.data() as Omit<Invoice, 'id'>) };
        if (inv.status === 'draft' || inv.status === 'cancelled' || inv.status === 'paid') return;
        const status = deriveInvoiceStatus(
            inv.total,
            inv.amountPaid || 0,
            inv.status,
            inv.dueDate,
            today
        );
        const bal = invoiceBalance(inv.total, inv.amountPaid || 0);
        if (bal > 0 && status !== 'cancelled') {
            openInvoiceCount += 1;
            openBalance += bal;
        }
    });

    let activeCorporateReservations = 0;
    try {
        const resSnap = await getDocs(
            query(collection(db, 'reservations'), where('contractId', '==', contractId))
        );
        mapFirestoreDocs<Reservation>(resSnap).forEach((r) => {
            if (r.status === 'cancelled') return;
            const out = r.checkoutDate || '';
            if (out >= today) activeCorporateReservations += 1;
        });
    } catch {
        // índice ausente — ignora contagem de reservas
    }

    return {
        contract,
        activeAllocations,
        openInvoiceCount,
        openBalance,
        activeCorporateReservations,
    };
};

/**
 * Encerra contrato: encerra alocações ativas e marca contrato como ended.
 * Bloqueia se houver faturas em aberto (saldo > 0).
 */
export const endContract = async (contractId: string, endDate?: string): Promise<void> => {
    const checklist = await getEndContractChecklist(contractId);
    if (checklist.openInvoiceCount > 0) {
        throw new Error(
            `Há ${checklist.openInvoiceCount} fatura(s) em aberto (R$ ${checklist.openBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}). Quite ou cancele antes de encerrar.`
        );
    }

    const date = endDate || nowIso().slice(0, 10);
    for (const a of checklist.activeAllocations) {
        if (a.id) await endAllocation(a.id, date);
    }

    await updateContract(contractId, {
        status: 'ended',
        endDate: date,
        companyName: checklist.contract.companyName,
    });
    await refreshCompanyActiveFlatCount(checklist.contract.companyId);

    const email = await currentUserEmail();
    await logAction(
        'update',
        email,
        `Contrato encerrado (${checklist.activeAllocations.length} flats)`,
        contractId,
        checklist.contract.companyName
    );
};

// --- Allocations ---

export const subscribeToAllocationsByContract = (
    contractId: string,
    callback: (allocations: Allocation[]) => void
): (() => void) => {
    let unsub: Unsubscribe | undefined;
    let cancelled = false;

    getFirestoreInstance()
        .then((db) => {
            if (cancelled) return;
            const q = query(collection(db, 'allocations'), where('contractId', '==', contractId));
            unsub = onSnapshot(
                q,
                (snap) => {
                    const list = mapFirestoreDocs<Allocation>(snap);
                    list.sort((a, b) =>
                        (a.flatNumber || '').localeCompare(b.flatNumber || '', 'pt-BR')
                    );
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

export const getAllocationsByCompany = async (companyId: string): Promise<Allocation[]> => {
    const db = await getFirestoreInstance();
    const q = query(collection(db, 'allocations'), where('companyId', '==', companyId));
    const snap = await getDocs(q);
    return mapFirestoreDocs<Allocation>(snap).filter((a) => a.status === 'active');
};

export type AllocationInput = Omit<Allocation, 'id' | 'createdAt' | 'updatedAt'>;

type AllocationLockPeriod = {
    allocationId: string;
    contractId: string;
    startDate: string;
    endDate: string | null;
};

const periodsOverlap = (
    left: Pick<AllocationLockPeriod, 'startDate' | 'endDate'>,
    right: Pick<AllocationLockPeriod, 'startDate' | 'endDate'>
) =>
    left.startDate < (right.endDate || '9999-12-31') &&
    (left.endDate || '9999-12-31') > right.startDate;

const allocationLockId = (input: Pick<AllocationInput, 'propertyId' | 'flatNumber'>) =>
    `${input.propertyId}_${input.flatNumber || 'single'}`;

export const createAllocation = async (input: AllocationInput): Promise<string> => {
    const [id] = await createAllocationsBatch([input]);
    return id;
};

/** Cria várias alocações (ex.: 5 flats de uma vez) */
export const createAllocationsBatch = async (inputs: AllocationInput[]): Promise<string[]> => {
    if (inputs.length === 0) return [];
    const email = await currentUserEmail();
    const lockIds = inputs.map(allocationLockId);
    if (new Set(lockIds).size !== lockIds.length) {
        throw new Error('O mesmo flat foi selecionado mais de uma vez');
    }
    for (const input of inputs) {
        if (input.propertyId !== 'integracao' || !input.flatNumber) {
            throw new Error('Alocações corporativas exigem um flat do Integração');
        }
        if (!input.startDate || (input.endDate && input.endDate <= input.startDate)) {
            throw new Error('A saída da alocação deve ser posterior à entrada');
        }
    }

    const db = await getFirestoreInstance();
    const activeSnap = await getDocs(
        query(
            collection(db, 'allocations'),
            where('propertyId', '==', 'integracao'),
            where('status', '==', 'active')
        )
    );
    const active = mapFirestoreDocs<Allocation>(activeSnap).filter(
        (allocation) => allocation.propertyId === 'integracao'
    );
    const allocationRefs = inputs.map(() => doc(collection(db, 'allocations')));
    const lockRefs = lockIds.map((id) => doc(db, 'allocation_locks', id));
    const timestamp = nowIso();

    await runTransaction(db, async (transaction) => {
        const lockSnapshots: DocumentSnapshot<DocumentData>[] = [];
        for (const lockRef of lockRefs) {
            lockSnapshots.push(await transaction.get(lockRef));
        }

        inputs.forEach((input, index) => {
            const lockSnapshot = lockSnapshots[index];
            const seeded = active
                .filter((allocation) => allocation.flatNumber === input.flatNumber && allocation.id)
                .map((allocation) => ({
                    allocationId: allocation.id!,
                    contractId: allocation.contractId,
                    startDate: allocation.startDate,
                    endDate: allocation.endDate || null,
                }));
            const stored = lockSnapshot.exists()
                ? ((lockSnapshot.data().periods || []) as AllocationLockPeriod[])
                : seeded;
            const nextPeriod: AllocationLockPeriod = {
                allocationId: allocationRefs[index].id,
                contractId: input.contractId,
                startDate: input.startDate,
                endDate: input.endDate || null,
            };
            if (stored.some((period) => periodsOverlap(period, nextPeriod))) {
                throw new Error(`O flat ${input.flatNumber} foi alocado por outro operador`);
            }

            transaction.set(
                allocationRefs[index],
                cleanData({ ...input, createdAt: timestamp, updatedAt: timestamp })
            );
            transaction.set(lockRefs[index], {
                propertyId: input.propertyId,
                flatNumber: input.flatNumber,
                periods: [...stored, nextPeriod],
                updatedAt: timestamp,
            });
        });
    });

    await Promise.all(
        inputs.map((input, index) =>
            logAction(
                'create',
                email,
                `Alocação ${input.propertyId} #${input.flatNumber}`,
                allocationRefs[index].id
            )
        )
    );
    return allocationRefs.map((ref) => ref.id);
};

export type AllocationDraft = Omit<AllocationInput, 'contractId' | 'companyId'>;

/**
 * Converte uma cotação em contrato + alocações numa única transação. Se algum
 * flat entrar em conflito, nenhum contrato ou alocação é persistido.
 */
export const createContractWithAllocations = async (
    contractInput: ContractInput,
    allocationDrafts: AllocationDraft[]
): Promise<{ contractId: string; allocationIds: string[] }> => {
    if (allocationDrafts.length === 0) throw new Error('Selecione ao menos um flat');
    const email = await currentUserEmail();
    const lockIds = allocationDrafts.map(allocationLockId);
    if (new Set(lockIds).size !== lockIds.length) {
        throw new Error('O mesmo flat foi selecionado mais de uma vez');
    }
    allocationDrafts.forEach((input) => {
        if (input.propertyId !== 'integracao' || !input.flatNumber) {
            throw new Error('Alocações corporativas exigem um flat do Integração');
        }
        if (!input.startDate || (input.endDate && input.endDate <= input.startDate)) {
            throw new Error('A saída da alocação deve ser posterior à entrada');
        }
    });

    const db = await getFirestoreInstance();
    const activeSnapshot = await getDocs(
        query(
            collection(db, 'allocations'),
            where('propertyId', '==', 'integracao'),
            where('status', '==', 'active')
        )
    );
    const active = mapFirestoreDocs<Allocation>(activeSnapshot);
    const contractRef = doc(collection(db, 'contracts'));
    const allocationRefs = allocationDrafts.map(() => doc(collection(db, 'allocations')));
    const lockRefs = lockIds.map((id) => doc(db, 'allocation_locks', id));
    const timestamp = nowIso();

    await runTransaction(db, async (transaction) => {
        const companyRef = doc(db, 'companies', contractInput.companyId);
        const companySnapshot = await transaction.get(companyRef);
        if (!companySnapshot.exists()) throw new Error('Empresa não encontrada');

        const lockSnapshots: DocumentSnapshot<DocumentData>[] = [];
        for (const lockRef of lockRefs) lockSnapshots.push(await transaction.get(lockRef));

        allocationDrafts.forEach((draft, index) => {
            const seeded = active
                .filter((allocation) => allocation.flatNumber === draft.flatNumber && allocation.id)
                .map((allocation) => ({
                    allocationId: allocation.id!,
                    contractId: allocation.contractId,
                    startDate: allocation.startDate,
                    endDate: allocation.endDate || null,
                }));
            const stored = lockSnapshots[index].exists()
                ? ((lockSnapshots[index].data()?.periods || []) as AllocationLockPeriod[])
                : seeded;
            const nextPeriod: AllocationLockPeriod = {
                allocationId: allocationRefs[index].id,
                contractId: contractRef.id,
                startDate: draft.startDate,
                endDate: draft.endDate || null,
            };
            if (stored.some((period) => periodsOverlap(period, nextPeriod))) {
                throw new Error(`Flat ${draft.flatNumber} já está alocado no período informado`);
            }

            transaction.set(
                allocationRefs[index],
                cleanData({
                    ...draft,
                    contractId: contractRef.id,
                    companyId: contractInput.companyId,
                    createdAt: timestamp,
                    updatedAt: timestamp,
                })
            );
            transaction.set(lockRefs[index], {
                propertyId: draft.propertyId,
                flatNumber: draft.flatNumber,
                periods: [...stored, nextPeriod],
                updatedAt: timestamp,
            });
        });

        transaction.set(
            contractRef,
            cleanData({
                ...contractInput,
                endDate: contractInput.endDate || undefined,
                createdAt: timestamp,
                updatedAt: timestamp,
            })
        );
    });

    await logAction(
        'create',
        email,
        `Contrato e ${allocationRefs.length} alocação(ões) para ${contractInput.companyName}`,
        contractRef.id,
        contractInput.companyName
    );
    return { contractId: contractRef.id, allocationIds: allocationRefs.map((ref) => ref.id) };
};

export const updateAllocation = async (
    id: string,
    patch: Partial<AllocationInput>
): Promise<void> => {
    const editableFields = new Set(['guestName', 'guestPhone', 'notes']);
    const invalidField = Object.keys(patch).find((field) => !editableFields.has(field));
    if (invalidField) {
        throw new Error(
            'Datas, flat, contrato e status devem ser alterados pelo fluxo de alocação'
        );
    }
    const email = await currentUserEmail();
    const data = cleanData({ ...patch, updatedAt: nowIso() });
    const db = await getFirestoreInstance();
    const allocationRef = doc(db, 'allocations', id);
    await runTransaction(db, async (transaction) => {
        const allocation = await transaction.get(allocationRef);
        if (!allocation.exists()) throw new Error('Alocação não encontrada');
        transaction.update(allocationRef, data);
    });
    await logAction('update', email, `Alocação atualizada`, id);
};

export const endAllocation = async (id: string, endDate?: string): Promise<void> => {
    const db = await getFirestoreInstance();
    const allocationRef = doc(db, 'allocations', id);
    await runTransaction(db, async (transaction) => {
        const allocationSnap = await transaction.get(allocationRef);
        if (!allocationSnap.exists()) throw new Error('Alocação não encontrada');
        const allocation = {
            id: allocationSnap.id,
            ...(allocationSnap.data() as Omit<Allocation, 'id'>),
        };
        const lockRef = doc(db, 'allocation_locks', allocationLockId(allocation));
        const lockSnap = await transaction.get(lockRef);
        transaction.update(allocationRef, {
            status: 'ended',
            endDate: endDate || nowIso().slice(0, 10),
            updatedAt: nowIso(),
        });
        if (lockSnap.exists()) {
            const periods = ((lockSnap.data().periods || []) as AllocationLockPeriod[]).filter(
                (period) => period.allocationId !== id
            );
            transaction.update(lockRef, { periods, updatedAt: nowIso() });
        }
    });
};

export const deleteAllocation = async (id: string): Promise<void> => {
    const email = await currentUserEmail();
    const db = await getFirestoreInstance();
    const allocationRef = doc(db, 'allocations', id);
    await runTransaction(db, async (transaction) => {
        const allocationSnap = await transaction.get(allocationRef);
        if (!allocationSnap.exists()) return;
        const allocation = {
            id: allocationSnap.id,
            ...(allocationSnap.data() as Omit<Allocation, 'id'>),
        };
        const lockRef = doc(db, 'allocation_locks', allocationLockId(allocation));
        const lockSnap = await transaction.get(lockRef);
        transaction.delete(allocationRef);
        if (lockSnap.exists()) {
            const periods = ((lockSnap.data().periods || []) as AllocationLockPeriod[]).filter(
                (period) => period.allocationId !== id
            );
            transaction.update(lockRef, { periods, updatedAt: nowIso() });
        }
    });
    await logAction('delete', email, `Alocação removida`, id);
};

/** Atualiza contador denormalizado de flats ativos na empresa */
export const refreshCompanyActiveFlatCount = async (companyId: string): Promise<void> => {
    const active = await getAllocationsByCompany(companyId);
    await updateCompany(companyId, { activeFlatCount: active.length });
};

/** Todas as alocações ativas (para checar conflito entre contratos) */
export const subscribeToActiveAllocations = (
    callback: (allocations: Allocation[]) => void
): (() => void) => {
    let unsub: Unsubscribe | undefined;
    let cancelled = false;

    getFirestoreInstance()
        .then((db) => {
            if (cancelled) return;
            const q = query(
                collection(db, 'allocations'),
                where('propertyId', '==', 'integracao'),
                where('status', '==', 'active')
            );
            unsub = onSnapshot(
                q,
                (snap) => callback(mapFirestoreDocs<Allocation>(snap)),
                () => callback([])
            );
        })
        .catch(() => callback([]));

    return () => {
        cancelled = true;
        unsub?.();
    };
};
