import { useId, useState } from 'react';
import { Bell, Check, Copy, Eye, EyeOff, KeyRound } from 'lucide-react';
import { PropertyId } from '../../../types';
import { ThemeColors } from '../../../hooks/useGuestTheme';
import { useLanguage } from '../../../hooks/useLanguage';
import { useAccessClipboard } from '../../../hooks/useAccessClipboard';
import './QuickAccess.css';

interface AccessTicketProps {
    propertyId: PropertyId;
    code: string;
    safeCode?: string;
    label: string;
    subLabel?: string;
    theme: ThemeColors;
    alwaysVisible?: boolean;
    variant?: 'default' | 'small';
}

const hasValue = (value?: string) => Boolean(value?.trim() && !/^[-—\s]+$/.test(value));

export default function AccessTicket({
    propertyId,
    code,
    safeCode,
    label,
    subLabel,
    theme,
    alwaysVisible = false,
    variant = 'default',
}: AccessTicketProps) {
    const { t } = useLanguage();
    const contentId = useId();
    const credentialKey = `${propertyId}:${code}:${safeCode || ''}`;
    const [revealedFor, setRevealedFor] = useState<string | null>(null);
    const { copy, feedback } = useAccessClipboard(credentialKey);
    const isIntegracao = propertyId === 'integracao';
    const hasSafe = hasValue(safeCode);
    const isRevealed = alwaysVisible || (isIntegracao && !hasSafe) || revealedFor === credentialKey;

    const copyButton = (value: string, field: string, name: string) => (
        <button
            type="button"
            className="qa-copy"
            disabled={!hasValue(value) || feedback?.state === 'pending'}
            aria-label={`${t('Copiar', 'Copy', 'Copiar')} ${name}`}
            onClick={() => void copy(value, field)}
        >
            {feedback?.field === field && feedback.state === 'success' ? (
                <Check size={15} />
            ) : (
                <Copy size={15} />
            )}
            {feedback?.field === field && feedback.state === 'success'
                ? t('Copiado', 'Copied', 'Copiado')
                : t('Copiar', 'Copy', 'Copiar')}
        </button>
    );

    return (
        <section
            className={`guest-access-ticket ${theme.border}`}
            data-property={propertyId}
            data-size={variant}
            aria-label={t('Informações de acesso', 'Access information', 'Información de acceso')}
        >
            <div className="qa-ticket-header">
                <h4>
                    <KeyRound size={16} aria-hidden="true" />
                    {hasSafe
                        ? t('Como entrar', 'Getting in', 'Cómo entrar')
                        : isIntegracao
                          ? label
                          : t('Acesso ao flat', 'Flat access', 'Acceso al flat')}
                </h4>
                {!alwaysVisible && !(isIntegracao && !hasSafe) && isRevealed && (
                    <button
                        type="button"
                        className="qa-hide"
                        onClick={() => setRevealedFor(null)}
                        aria-controls={contentId}
                    >
                        <EyeOff size={15} />
                        {t('Ocultar', 'Hide', 'Ocultar')}
                    </button>
                )}
            </div>
            {!isRevealed ? (
                <button
                    type="button"
                    className="qa-reveal"
                    onClick={() => setRevealedFor(credentialKey)}
                    aria-controls={contentId}
                    aria-expanded={false}
                >
                    <Eye size={17} />
                    {t(
                        'Mostrar senhas de acesso',
                        'Show access codes',
                        'Mostrar códigos de acceso'
                    )}
                </button>
            ) : (
                <div id={contentId} className="qa-access-steps">
                    {isIntegracao && (
                        <div className="qa-unit">
                            <span>{t('Unidade', 'Unit', 'Unidad')}</span>
                            <strong>
                                {code || t('A confirmar', 'To be confirmed', 'Por confirmar')}
                            </strong>
                        </div>
                    )}
                    {hasSafe && (
                        <div className="qa-access-step">
                            <div className="qa-step-label">
                                {!isIntegracao && (
                                    <span className="qa-step-number" aria-hidden="true">
                                        1
                                    </span>
                                )}
                                <span>
                                    {isIntegracao
                                        ? t('Cofre das chaves', 'Key safe', 'Caja de llaves')
                                        : t(
                                              'Cofre da entrada',
                                              'Entrance key safe',
                                              'Caja de llaves de la entrada'
                                          )}
                                </span>
                            </div>
                            <div className="qa-code-row">
                                <strong className="qa-code">{safeCode}</strong>
                                {copyButton(
                                    safeCode!,
                                    'safe',
                                    t(
                                        'senha do cofre',
                                        'key safe code',
                                        'código de la caja de llaves'
                                    )
                                )}
                            </div>
                            <p className="qa-step-help">
                                {isIntegracao
                                    ? t(
                                          'Pegue as duas chaves.',
                                          'Collect both keys.',
                                          'Recoge las dos llaves.'
                                      )
                                    : t(
                                          'Pegue a chave do portão.',
                                          'Collect the gate key.',
                                          'Recoge la llave del portón.'
                                      )}
                            </p>
                        </div>
                    )}
                    {!isIntegracao && (
                        <div className="qa-access-step">
                            <div className="qa-step-label">
                                {hasSafe && (
                                    <span className="qa-step-number" aria-hidden="true">
                                        2
                                    </span>
                                )}
                                <span>{t('Porta do flat', 'Flat door', 'Puerta del flat')}</span>
                            </div>
                            <div className="qa-code-row">
                                <strong className="qa-code" data-testid="door-access-code">
                                    {hasValue(code)
                                        ? code
                                        : t('A confirmar', 'To be confirmed', 'Por confirmar')}
                                </strong>
                                {copyButton(
                                    code,
                                    'door',
                                    t('senha da porta', 'door code', 'código de la puerta')
                                )}
                            </div>
                            <p className="qa-step-help qa-bell-help">
                                <Bell size={15} aria-hidden="true" />
                                {t(
                                    'Após digitar, toque no sino da fechadura.',
                                    'After entering the code, tap the bell on the lock.',
                                    'Después de introducir el código, toca el timbre de la cerradura.'
                                )}
                            </p>
                        </div>
                    )}
                    {isIntegracao && !hasSafe && subLabel && (
                        <p className="qa-step-help">{subLabel}</p>
                    )}
                </div>
            )}
            <p
                className={`qa-copy-status ${feedback?.state === 'error' ? 'qa-copy-error' : ''}`}
                role="status"
                aria-live="polite"
            >
                {feedback?.state === 'error'
                    ? t(
                          'Não foi possível copiar. Selecione o código ou tente novamente.',
                          'Could not copy. Select the code or try again.',
                          'No se pudo copiar. Selecciona el código o inténtalo de nuevo.'
                      )
                    : feedback?.state === 'success'
                      ? t('Código copiado.', 'Code copied.', 'Código copiado.')
                      : ''}
            </p>
        </section>
    );
}
