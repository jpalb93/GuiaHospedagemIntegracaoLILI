import React, { useState } from 'react';
import {
    ArrowRight,
    CalendarDays,
    CalendarHeart,
    Compass,
    DoorOpen,
    Home,
    Lightbulb,
    LogOut,
    MessageCircle,
    Sparkles,
} from 'lucide-react';
import type { GuestConfig } from '../../../types';
import { PROPERTIES } from '../../../config/properties';
import { useLanguage } from '../../../hooks/useLanguage';
import { dayUsePhase } from '../../../utils/reservationStay';
import './DesktopStayOverview.css';

export interface DesktopStayOverviewProps {
    config: GuestConfig;
    stayStage: 'pre_checkin' | 'checkin' | 'middle' | 'pre_checkout' | 'checkout' | 'post_checkout';
    isPasswordReleased: boolean;
    heroImage?: string;
    onCheckin: () => void;
    onCheckout: () => void;
    onExplore: () => void;
    onFlat: () => void;
    onSupport: () => void;
    onStories: (type: 'agenda' | 'curiosities' | 'tips') => void;
    hasTips: boolean;
    eventCount: number;
}

/** Render date-only reservation values without converting them to the browser's time zone. */
function parseStayDate(value?: string): Date | null {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const date = new Date(`${value}T12:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
        ? date
        : null;
}

const DesktopStayOverview: React.FC<DesktopStayOverviewProps> = ({
    config,
    stayStage,
    isPasswordReleased,
    heroImage,
    onCheckin,
    onCheckout,
    onExplore,
    onFlat,
    onSupport,
    onStories,
    hasTips,
    eventCount,
}) => {
    const { t, currentLang } = useLanguage();
    const property = PROPERTIES[config.propertyId || 'lili'];
    const isDayUse = config.stayType === 'day_use';
    const arrival = parseStayDate(config.checkInDate);
    const departure = parseStayDate(config.checkoutDate);
    const checkInTime = config.checkInTime || (isDayUse ? '08:00' : property.defaults.checkInTime);
    const checkOutTime =
        config.checkOutTime || (isDayUse ? '12:00' : property.defaults.checkOutTime);
    const locale = currentLang === 'en' ? 'en-US' : currentLang === 'es' ? 'es' : 'pt-BR';
    const formatDate = (date: Date | null) =>
        date
            ? new Intl.DateTimeFormat(locale, {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  timeZone: 'UTC',
              }).format(date)
            : t('Data a confirmar', 'Date to be confirmed', 'Fecha por confirmar');
    const dayPhase = dayUsePhase(config);
    const isArrival = isDayUse
        ? dayPhase === 'upcoming' || (dayPhase === null && stayStage === 'pre_checkin')
        : stayStage === 'pre_checkin' || stayStage === 'checkin';
    const isDeparture = !isDayUse && (stayStage === 'pre_checkout' || stayStage === 'checkout');
    const isFinished = stayStage === 'post_checkout' || dayPhase === 'finished';
    const headline = isFinished
        ? t(
              'Obrigado por ficar com a gente.',
              'Thank you for staying with us.',
              'Gracias por hospedarte con nosotros.'
          )
        : isArrival
          ? t(
                'Sua chegada, com tudo à mão.',
                'Everything you need for arrival.',
                'Todo a mano para tu llegada.'
            )
          : isDeparture
            ? t(
                  'Uma saída tranquila, até a próxima.',
                  'An easy departure. Until next time.',
                  'Una salida tranquila. Hasta la próxima.'
              )
            : t(
                  'Sua estadia, no seu ritmo.',
                  'Your stay, at your own pace.',
                  'Tu estadía, a tu ritmo.'
              );
    const description = isFinished
        ? t(
              'As informações do guia continuam aqui para você consultar.',
              'The guide is still here for you to browse.',
              'La información de la guía sigue aquí para consultar.'
          )
        : isArrival
          ? t(
                'Encontre as orientações para chegar e entrar no flat. Depois, descubra o que há por perto.',
                'Find directions and arrival instructions for your flat. Then discover the neighborhood.',
                'Encuentra las indicaciones para llegar y entrar al flat. Después, descubre los alrededores.'
            )
          : isDeparture
            ? t(
                  'Confira seu horário de saída e as orientações para devolver as chaves.',
                  'Check your departure time and instructions for returning the keys.',
                  'Consulta tu hora de salida y las instrucciones para devolver las llaves.'
              )
            : t(
                  'Tenha as informações do flat à mão e encontre boas ideias para aproveitar Petrolina.',
                  'Keep your flat information handy and find ideas for enjoying Petrolina.',
                  'Ten a mano la información del flat y encuentra ideas para disfrutar de Petrolina.'
              );
    const ActionIcon = isArrival ? DoorOpen : isDeparture ? LogOut : Compass;
    const action = isArrival ? onCheckin : isDeparture ? onCheckout : onExplore;
    const actionLabel = isArrival
        ? t('Ver como entrar', 'View arrival instructions', 'Ver cómo entrar')
        : isDeparture
          ? t(
                'Ver orientações de saída',
                'View checkout instructions',
                'Ver instrucciones de salida'
            )
          : t('Explorar a região', 'Explore the area', 'Explorar la zona');
    const image = heroImage || property.assets.heroImage;
    const [failedImage, setFailedImage] = useState<string | null>(null);

    return (
        <div className="gd-stay-overview">
            <section className="gd-stay-welcome" aria-labelledby="gd-stay-heading">
                <div className="gd-stay-welcome-copy">
                    <p className="gd-stay-greeting">
                        {t('Olá', 'Hello', 'Hola')}
                        {config.guestName ? `, ${config.guestName}` : ''}.
                    </p>
                    <h2 id="gd-stay-heading">{headline}</h2>
                    <p className="gd-stay-description">{description}</p>
                    <button type="button" className="gd-stay-primary" onClick={action}>
                        <ActionIcon size={17} aria-hidden="true" />
                        {actionLabel}
                        <ArrowRight size={16} aria-hidden="true" />
                    </button>
                    {isDayUse && dayPhase === 'active' && (
                        <button
                            type="button"
                            className="gd-stay-checkout-link"
                            onClick={onCheckout}
                        >
                            <LogOut size={16} aria-hidden="true" />
                            {t(
                                'Ver orientações de saída',
                                'View checkout instructions',
                                'Ver instrucciones de salida'
                            )}
                        </button>
                    )}
                    {isArrival && !isPasswordReleased && (
                        <p className="gd-stay-release-note">
                            {t(
                                'As credenciais serão exibidas quando o acesso for liberado.',
                                'Access credentials will appear once access is released.',
                                'Las credenciales se mostrarán cuando se habilite el acceso.'
                            )}
                        </p>
                    )}
                </div>
                <div className="gd-stay-photo">
                    {image && failedImage !== image ? (
                        <img
                            src={image}
                            alt={property.name}
                            onError={() => setFailedImage(image)}
                        />
                    ) : (
                        <div className="gd-stay-photo-fallback">
                            <Home size={42} aria-hidden="true" />
                            <span>{property.name}</span>
                        </div>
                    )}
                </div>
            </section>

            <section
                className="gd-stay-reservation"
                aria-label={t('Resumo da estadia', 'Stay summary', 'Resumen de la estadía')}
            >
                <div className="gd-stay-reservation-property">
                    <Home size={20} aria-hidden="true" />
                    <div>
                        <strong>{property.name}</strong>
                        <span>
                            {config.flatNumber
                                ? `${t('Unidade', 'Unit', 'Unidad')} ${config.flatNumber}`
                                : t('Sua hospedagem', 'Your accommodation', 'Tu alojamiento')}
                            {isDayUse ? ' · Day use' : ''}
                        </span>
                    </div>
                </div>
                <dl className="gd-stay-dates">
                    <div>
                        <dt>{t('Entrada', 'Arrival', 'Entrada')}</dt>
                        <dd>
                            {arrival ? (
                                <time dateTime={config.checkInDate}>{formatDate(arrival)}</time>
                            ) : (
                                formatDate(arrival)
                            )}
                            <span>{checkInTime}</span>
                        </dd>
                    </div>
                    <ArrowRight size={18} className="gd-stay-date-arrow" aria-hidden="true" />
                    <div>
                        <dt>{t('Saída', 'Departure', 'Salida')}</dt>
                        <dd>
                            {departure ? (
                                <time dateTime={config.checkoutDate}>{formatDate(departure)}</time>
                            ) : (
                                formatDate(departure)
                            )}
                            <span>{checkOutTime}</span>
                        </dd>
                    </div>
                </dl>
            </section>

            <section className="gd-stay-discover" aria-labelledby="gd-stay-discover-heading">
                <div className="gd-stay-section-heading">
                    <h3 id="gd-stay-discover-heading">
                        {t('Faça o guia ser seu.', 'Make the guide yours.', 'Haz tuya esta guía.')}
                    </h3>
                    <p>
                        {t(
                            'Tudo o que ajuda a aproveitar melhor a estadia.',
                            'Everything to help you enjoy your stay.',
                            'Todo para disfrutar mejor de tu estadía.'
                        )}
                    </p>
                </div>
                <div className="gd-stay-feature-links">
                    <button type="button" onClick={onFlat}>
                        <Home size={22} aria-hidden="true" />
                        <span>
                            <strong>
                                {t('Conheça o seu flat', 'Get to know your flat', 'Conoce tu flat')}
                            </strong>
                            <span>
                                {t(
                                    'Comodidades e informações para o dia a dia.',
                                    'Amenities and information for everyday life.',
                                    'Comodidades e información para el día a día.'
                                )}
                            </span>
                        </span>
                        <ArrowRight size={18} aria-hidden="true" />
                    </button>
                    <button type="button" onClick={onExplore}>
                        <Compass size={22} aria-hidden="true" />
                        <span>
                            <strong>
                                {t(
                                    'Descubra Petrolina',
                                    'Discover Petrolina',
                                    'Descubre Petrolina'
                                )}
                            </strong>
                            <span>
                                {t(
                                    'Lugares para comer, passear e salvar nos favoritos.',
                                    'Places to eat, explore and save to your favorites.',
                                    'Lugares para comer, pasear y guardar como favoritos.'
                                )}
                            </span>
                        </span>
                        <ArrowRight size={18} aria-hidden="true" />
                    </button>
                </div>
            </section>

            <div className="gd-stay-bottom-row">
                <section
                    className="gd-stay-story-links"
                    aria-label={t(
                        'Mais sobre a estadia',
                        'More about your stay',
                        'Más sobre tu estadía'
                    )}
                >
                    <button type="button" onClick={() => onStories('curiosities')}>
                        <Sparkles size={17} aria-hidden="true" />
                        {t(
                            'Curiosidades da cidade',
                            'City curiosities',
                            'Curiosidades de la ciudad'
                        )}
                        <ArrowRight size={14} aria-hidden="true" />
                    </button>
                    {hasTips && property.features.hasTipsStories && (
                        <button type="button" onClick={() => onStories('tips')}>
                            <Lightbulb size={17} aria-hidden="true" />
                            {t('Dicas do flat', 'Flat tips', 'Consejos del flat')}
                            <ArrowRight size={14} aria-hidden="true" />
                        </button>
                    )}
                    {eventCount > 0 && (
                        <button type="button" onClick={() => onStories('agenda')}>
                            <CalendarHeart size={17} aria-hidden="true" />
                            {t('Agenda da cidade', 'City events', 'Agenda de la ciudad')}
                            <ArrowRight size={14} aria-hidden="true" />
                        </button>
                    )}
                </section>
                <button type="button" className="gd-stay-support" onClick={onSupport}>
                    <MessageCircle size={17} aria-hidden="true" />
                    {t('Falar com o anfitrião', 'Contact your host', 'Contactar al anfitrión')}
                </button>
            </div>
            {isDayUse && (
                <p className="gd-stay-day-use">
                    <CalendarDays size={16} aria-hidden="true" />
                    {t(
                        'Day use: entrada e saída no mesmo dia, nos horários da sua reserva.',
                        'Day use: arrival and departure on the same day, at your booked times.',
                        'Day use: entrada y salida el mismo día, en los horarios de tu reserva.'
                    )}
                </p>
            )}
        </div>
    );
};

export default DesktopStayOverview;
