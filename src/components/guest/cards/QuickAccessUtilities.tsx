import { Check, Copy, MapPin, Navigation, Wifi } from 'lucide-react';
import { PropertyId } from '../../../types';
import { PROPERTIES } from '../../../config/properties';
import { useLanguage } from '../../../hooks/useLanguage';
import { useAccessClipboard } from '../../../hooks/useAccessClipboard';
import './QuickAccess.css';

interface Props {
    propertyId: PropertyId;
    wifiSSID: string;
    wifiPass: string;
    isLoadingWifi?: boolean;
    onOpenDriverMode: () => void;
}

export default function QuickAccessUtilities({
    propertyId,
    wifiSSID,
    wifiPass,
    isLoadingWifi,
    onOpenDriverMode,
}: Props) {
    const { t } = useLanguage();
    const address = PROPERTIES[propertyId].address;
    const { copy, feedback } = useAccessClipboard(`${propertyId}:${wifiSSID}:${wifiPass}`);
    const copied = (field: string) => feedback?.field === field && feedback.state === 'success';
    return (
        <div className="guest-quick-utilities" data-property={propertyId}>
            <div className="qa-utility">
                <h4>
                    <Wifi size={18} aria-hidden="true" />
                    Wi-Fi
                </h4>
                <p className="qa-utility-value">
                    {isLoadingWifi
                        ? t('Carregando rede…', 'Loading network…', 'Cargando red…')
                        : wifiSSID ||
                          t('Consulte o anfitrião', 'Contact your host', 'Consulta al anfitrión')}
                </p>
                <button
                    type="button"
                    disabled={
                        isLoadingWifi ||
                        !wifiPass ||
                        !wifiSSID ||
                        wifiPass === '----' ||
                        feedback?.state === 'pending'
                    }
                    onClick={() => void copy(wifiPass, 'wifi')}
                >
                    {copied('wifi') ? <Check size={15} /> : <Copy size={15} />}
                    {copied('wifi')
                        ? t('Senha copiada', 'Password copied', 'Contraseña copiada')
                        : t('Copiar senha', 'Copy password', 'Copiar contraseña')}
                </button>
            </div>
            <div className="qa-utility">
                <h4>
                    <MapPin size={18} aria-hidden="true" />
                    {t('Endereço', 'Address', 'Dirección')}
                </h4>
                <p className="qa-utility-value" title={address}>
                    {address.split(' - ')[0]}
                </p>
                <button
                    type="button"
                    disabled={feedback?.state === 'pending'}
                    onClick={() => void copy(address, 'address')}
                >
                    {copied('address') ? <Check size={15} /> : <Copy size={15} />}
                    {copied('address')
                        ? t('Copiado', 'Copied', 'Copiado')
                        : t('Copiar endereço', 'Copy address', 'Copiar dirección')}
                </button>
                <button type="button" onClick={onOpenDriverMode}>
                    <Navigation size={15} />
                    {t('Motorista', 'Show driver', 'Conductor')}
                </button>
            </div>
            {feedback?.state === 'error' && (
                <p className="qa-utility-error" role="alert">
                    {t(
                        'Não foi possível copiar. Tente novamente ou consulte as instruções de entrada.',
                        'Could not copy. Try again or check the arrival instructions.',
                        'No se pudo copiar. Inténtalo de nuevo o consulta las instrucciones de entrada.'
                    )}
                </p>
            )}
            <span className="sr-only" role="status">
                {feedback?.state === 'success'
                    ? t(
                          'Copiado para a área de transferência.',
                          'Copied to clipboard.',
                          'Copiado al portapapeles.'
                      )
                    : ''}
            </span>
        </div>
    );
}
