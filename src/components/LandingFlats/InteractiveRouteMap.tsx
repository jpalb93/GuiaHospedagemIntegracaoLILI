import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FLAT_ORIGIN, RADAR_SPOTS, type RadarSpot, type TravelMode } from './locationRoutesData';
import { LOCATION_ROUTE_PATHS } from './locationPathsData';

const checkIsTouchOrNarrow = () => {
    if (typeof window === 'undefined') return false;
    const isNarrow = window.innerWidth < 1024;
    const isCoarse =
        typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
    return isNarrow || isCoarse;
};

interface InteractiveRouteMapProps {
    visibleSpots: RadarSpot[];
    selectedSpotId: string;
    travelMode: TravelMode;
    recenterNonce: number;
    onSelectSpot: (id: string) => void;
    interactionMode?: 'inline' | 'fullscreen';
    onLockedTouchAttempt?: () => void;
}

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

const InteractiveRouteMap: React.FC<InteractiveRouteMapProps> = ({
    visibleSpots,
    selectedSpotId,
    travelMode,
    recenterNonce,
    onSelectSpot,
    interactionMode = 'inline',
    onLockedTouchAttempt,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const routeLayerRef = useRef<L.LayerGroup | null>(null);
    const markersLayerRef = useRef<L.LayerGroup | null>(null);
    const hasInitialFitRef = useRef(false);
    const [isTouchOrNarrow, setIsTouchOrNarrow] = useState(checkIsTouchOrNarrow);
    const shouldLockTouch = interactionMode === 'inline' && isTouchOrNarrow;

    const onSelectSpotRef = useRef(onSelectSpot);
    const onLockedTouchAttemptRef = useRef(onLockedTouchAttempt);
    useEffect(() => {
        onSelectSpotRef.current = onSelectSpot;
        onLockedTouchAttemptRef.current = onLockedTouchAttempt;
    }, [onSelectSpot, onLockedTouchAttempt]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const sync = () => setIsTouchOrNarrow(checkIsTouchOrNarrow());
        window.addEventListener('resize', sync, { passive: true });
        return () => window.removeEventListener('resize', sync);
    }, []);

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        const initialSpot = RADAR_SPOTS.find((s) => s.id === selectedSpotId) ?? RADAR_SPOTS[0];
        const initialPath = LOCATION_ROUTE_PATHS[initialSpot.id]?.[travelMode] ?? [
            FLAT_ORIGIN.coords,
            initialSpot.coords,
        ];
        const initialBounds = L.latLngBounds(initialPath);

        const initialLocked = interactionMode === 'inline' && checkIsTouchOrNarrow();

        const map = L.map(containerRef.current, {
            zoomControl: false,
            scrollWheelZoom: interactionMode === 'fullscreen',
            dragging: !initialLocked,
            touchZoom: true,
        });

        let invalidateTimer = 0;
        if (interactionMode === 'fullscreen') {
            invalidateTimer = window.setTimeout(() => {
                map.invalidateSize();
                map.fitBounds(initialBounds, {
                    paddingTopLeft: [56, 92],
                    paddingBottomRight: [56, 150],
                    maxZoom: 16,
                    animate: false,
                });
            }, 60);
        }

        map.fitBounds(initialBounds, {
            paddingTopLeft: [56, 92],
            paddingBottomRight: [56, 132],
            maxZoom: 16,
            animate: false,
        });

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
            maxZoom: 19,
            updateWhenIdle: true,
            crossOrigin: true,
        }).addTo(map);

        L.control.zoom({ position: 'topright' }).addTo(map);

        routeLayerRef.current = L.layerGroup().addTo(map);
        markersLayerRef.current = L.layerGroup().addTo(map);
        mapRef.current = map;

        return () => {
            window.clearTimeout(invalidateTimer);
            map.remove();
            mapRef.current = null;
            routeLayerRef.current = null;
            markersLayerRef.current = null;
            hasInitialFitRef.current = false;
        };
        // Inicialização única do container Leaflet já enquadrada na rota inicial
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const map = mapRef.current;
        const el = containerRef.current;
        if (!map || !el) return;

        map.touchZoom.enable();

        if (!shouldLockTouch) {
            el.classList.remove('flats-map-locked');
            map.dragging.enable();
            return;
        }

        // Mobile inline: 1 dedo rola a página (touch-action: pan-y); 2 dedos movem/dão pinça no mapa
        el.classList.add('flats-map-locked');
        map.dragging.disable();

        let startX = 0;
        let startY = 0;
        let notified = false;
        let isTwoFingerGesture = false;

        const handleTouchStart = (e: TouchEvent) => {
            notified = false;
            if (e.touches.length >= 2) {
                isTwoFingerGesture = true;
                el.classList.remove('flats-map-locked');
                return;
            }
            isTwoFingerGesture = false;
            const t = e.touches[0];
            if (t) {
                startX = t.clientX;
                startY = t.clientY;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length >= 2 || isTwoFingerGesture) {
                if (e.cancelable) e.preventDefault();
                return;
            }
            if (notified) return;
            const t = e.touches[0];
            if (!t) return;
            const dx = Math.abs(t.clientX - startX);
            const dy = Math.abs(t.clientY - startY);
            // Gesto horizontal com 1 dedo exibe dica rápida sem interferir no scroll vertical
            if (dx > 22 && dx > dy * 1.45) {
                onLockedTouchAttemptRef.current?.();
                notified = true;
            }
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (e.touches.length === 0) {
                isTwoFingerGesture = false;
                el.classList.add('flats-map-locked');
            }
        };

        el.addEventListener('touchstart', handleTouchStart, { capture: true, passive: true });
        el.addEventListener('touchmove', handleTouchMove, { capture: true, passive: false });
        el.addEventListener('touchend', handleTouchEnd, { capture: true, passive: true });
        el.addEventListener('touchcancel', handleTouchEnd, { capture: true, passive: true });

        return () => {
            el.removeEventListener('touchstart', handleTouchStart, { capture: true });
            el.removeEventListener('touchmove', handleTouchMove, { capture: true });
            el.removeEventListener('touchend', handleTouchEnd, { capture: true });
            el.removeEventListener('touchcancel', handleTouchEnd, { capture: true });
            el.classList.remove('flats-map-locked');
        };
    }, [shouldLockTouch]);

    useEffect(() => {
        const map = mapRef.current;
        const routeLayer = routeLayerRef.current;
        const markersLayer = markersLayerRef.current;
        if (!map || !routeLayer || !markersLayer) return;

        const activeSpot =
            visibleSpots.find((s) => s.id === selectedSpotId) ??
            RADAR_SPOTS.find((s) => s.id === selectedSpotId) ??
            visibleSpots[0] ??
            RADAR_SPOTS[0];
        const activePath = LOCATION_ROUTE_PATHS[activeSpot.id]?.[travelMode] ?? [
            FLAT_ORIGIN.coords,
            activeSpot.coords,
        ];

        routeLayer.clearLayers();
        markersLayer.clearLayers();

        // Traçado real pelas ruas: borda obsidian + núcleo champagne/bronze + fluxo sutil
        L.polyline(activePath, {
            color: '#141210',
            weight: 8,
            opacity: 0.78,
            lineCap: 'round',
            lineJoin: 'round',
        }).addTo(routeLayer);

        if (travelMode === 'walking') {
            L.polyline(activePath, {
                color: '#E5C98B',
                weight: 4,
                opacity: 0.96,
                dashArray: '2 9',
                lineCap: 'round',
                lineJoin: 'round',
            }).addTo(routeLayer);
        } else {
            L.polyline(activePath, {
                color: '#E5C98B',
                weight: 4,
                opacity: 0.96,
                lineCap: 'round',
                lineJoin: 'round',
            }).addTo(routeLayer);

            L.polyline(activePath, {
                color: '#FFFDF7',
                weight: 2,
                opacity: 0.75,
                dashArray: '10 18',
                lineCap: 'round',
                className: 'flats-route-flow',
            }).addTo(routeLayer);
        }

        // Pino de Origem (Flats Integração)
        const originIcon = L.divIcon({
            className: 'flats-map-divicon',
            iconSize: [0, 0],
            iconAnchor: [0, 0],
            html: `
                <div style="position:relative;width:30px;height:30px;transform:translate(-50%,-50%);pointer-events:auto;">
                    <span style="position:relative;display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:9999px;background:#141210;border:2px solid #E5C98B;box-shadow:0 8px 22px rgba(20,18,16,0.45);color:#E5C98B;font-family:monospace;font-size:10px;font-weight:700;letter-spacing:0.06em;">
                        FI
                    </span>
                    <span style="position:absolute;left:calc(100% + 6px);top:50%;transform:translateY(-50%);white-space:nowrap;padding:4px 9px;border-radius:9999px;background:rgba(20,18,16,0.92);color:#FFFFFF;border:1px solid rgba(229,201,139,0.45);font-size:11px;font-weight:600;box-shadow:0 6px 18px rgba(0,0,0,0.28);">
                        Flats Integração
                    </span>
                </div>
            `,
        });

        L.marker(FLAT_ORIGIN.coords, {
            icon: originIcon,
            zIndexOffset: 1000,
        }).addTo(markersLayer);

        // Pinos apenas dos destinos da categoria ativa (mantém o mapa sempre limpo e legível)
        visibleSpots.forEach((spot) => {
            const isSelected = spot.id === activeSpot.id;
            const spotVariant = spot[travelMode];
            const safeLabel = escapeHtml(spot.shortLabel);
            const safeDist = escapeHtml(spotVariant.kmLabel);

            const destIcon = L.divIcon({
                className: 'flats-map-divicon',
                iconSize: [0, 0],
                iconAnchor: [0, 0],
                html: isSelected
                    ? `
                        <div style="transform:translate(-50%,-100%);display:flex;flex-direction:column;align-items:center;cursor:pointer;white-space:nowrap;">
                            <div style="padding:5px 11px;border-radius:9999px;background:#141210;color:#FFFFFF;border:1.5px solid #E5C98B;box-shadow:0 10px 24px rgba(20,18,16,0.38);display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;">
                                <span>${safeLabel}</span>
                                <span style="color:#E5C98B;font-family:monospace;font-size:10px;">${safeDist}</span>
                            </div>
                            <span style="margin-top:4px;width:13px;height:13px;border-radius:9999px;background:#E5C98B;border:2.5px solid #141210;box-shadow:0 2px 8px rgba(0,0,0,0.4);"></span>
                        </div>
                    `
                    : `
                        <div style="transform:translate(-50%,-50%);display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:9999px;background:rgba(250,248,243,0.95);color:#181614;border:1px solid #B8AA92;box-shadow:0 4px 12px rgba(20,18,16,0.16);font-size:10px;font-weight:600;cursor:pointer;white-space:nowrap;">
                            <span style="width:7px;height:7px;border-radius:9999px;background:#9E6B2B;display:inline-block;"></span>
                            <span>${safeLabel}</span>
                        </div>
                    `,
            });

            const marker = L.marker(spot.coords, {
                icon: destIcon,
                zIndexOffset: isSelected ? 900 : 300,
            }).addTo(markersLayer);

            marker.on('click', () => {
                onSelectSpotRef.current(spot.id);
            });
        });

        const bounds = L.latLngBounds(activePath);
        const prefersReducedMotion =
            typeof window !== 'undefined' &&
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!hasInitialFitRef.current || prefersReducedMotion) {
            hasInitialFitRef.current = true;
            map.fitBounds(bounds, {
                paddingTopLeft: [56, 92],
                paddingBottomRight: [56, 132],
                maxZoom: 16,
                animate: false,
            });
        } else {
            map.flyToBounds(bounds, {
                paddingTopLeft: [56, 92],
                paddingBottomRight: [56, 132],
                maxZoom: 16,
                duration: 0.75,
            });
        }
    }, [visibleSpots, selectedSpotId, travelMode, recenterNonce]);

    const sizeClass =
        interactionMode === 'fullscreen'
            ? 'w-full h-full min-h-[260px]'
            : 'w-full h-full min-h-[440px] lg:min-h-[600px]';

    return (
        <div className={`relative ${sizeClass}`}>
            <style>{`
                .flats-route-flow {
                    animation: flatsRouteDash 1.4s linear infinite;
                }
                @keyframes flatsRouteDash {
                    to {
                        stroke-dashoffset: -28;
                    }
                }
                @media (prefers-reduced-motion: reduce) {
                    .flats-route-flow {
                        animation: none;
                    }
                }
                .flats-map-tiles .leaflet-tile-pane {
                    filter: grayscale(0.25) sepia(0.12) contrast(1.03) brightness(0.98);
                }
                .flats-map-locked.leaflet-container {
                    touch-action: pan-y !important;
                }
                .leaflet-control-zoom {
                    border: 1px solid rgba(223, 216, 202, 0.9) !important;
                    border-radius: 14px !important;
                    overflow: hidden !important;
                    box-shadow: 0 8px 24px rgba(20, 18, 16, 0.14) !important;
                    margin-top: 14px !important;
                    margin-right: 14px !important;
                }
                .leaflet-control-zoom a {
                    background: rgba(20, 18, 16, 0.92) !important;
                    color: #E5C98B !important;
                    border-color: rgba(255, 255, 255, 0.1) !important;
                    width: 40px !important;
                    height: 40px !important;
                    line-height: 40px !important;
                    display: flex !important;
                    align-items: center;
                    justify-content: center;
                }
                @media (pointer: coarse) {
                    .leaflet-control-zoom a {
                        width: 44px !important;
                        height: 44px !important;
                        line-height: 44px !important;
                    }
                }
                .leaflet-control-zoom a:hover {
                    background: #2A2622 !important;
                    color: #FFFFFF !important;
                }
                .leaflet-control-attribution {
                    background: rgba(250, 248, 243, 0.78) !important;
                    font-size: 9px !important;
                    color: #5C564E !important;
                    border-top-left-radius: 8px !important;
                }
            `}</style>
            <div
                ref={containerRef}
                aria-label="Mapa interativo de rotas a partir do Flats Integração em Petrolina"
                className={`flats-map-tiles ${sizeClass} z-0 ${
                    shouldLockTouch ? 'flats-map-locked' : ''
                }`}
            />
        </div>
    );
};

export default InteractiveRouteMap;
