import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FLAT_ORIGIN, RADAR_SPOTS, type RadarSpot, type TravelMode } from './locationRoutesData';
import { LOCATION_ROUTE_PATHS } from './locationPathsData';

interface InteractiveRouteMapProps {
    visibleSpots: RadarSpot[];
    selectedSpotId: string;
    travelMode: TravelMode;
    recenterNonce: number;
    onSelectSpot: (id: string) => void;
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
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const routeLayerRef = useRef<L.LayerGroup | null>(null);
    const markersLayerRef = useRef<L.LayerGroup | null>(null);
    const hasInitialFitRef = useRef(false);
    const onSelectSpotRef = useRef(onSelectSpot);
    useEffect(() => {
        onSelectSpotRef.current = onSelectSpot;
    }, [onSelectSpot]);

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        const initialSpot = RADAR_SPOTS.find((s) => s.id === selectedSpotId) ?? RADAR_SPOTS[0];
        const initialPath = LOCATION_ROUTE_PATHS[initialSpot.id]?.[travelMode] ?? [
            FLAT_ORIGIN.coords,
            initialSpot.coords,
        ];
        const initialBounds = L.latLngBounds(initialPath);

        const map = L.map(containerRef.current, {
            zoomControl: false,
            scrollWheelZoom: false,
        });

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
        if (!hasInitialFitRef.current) {
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

    return (
        <div className="relative w-full h-full min-h-[440px] lg:min-h-[600px]">
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
                    width: 34px !important;
                    height: 34px !important;
                    line-height: 34px !important;
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
                className="flats-map-tiles w-full h-full min-h-[440px] lg:min-h-[600px] z-0"
            />
        </div>
    );
};

export default InteractiveRouteMap;
