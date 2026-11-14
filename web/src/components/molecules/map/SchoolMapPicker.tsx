'use client';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import type { GeoPlace } from '@/types/service';

export interface SchoolMapPickerProps {
  selectedPosition?: { lat: number; lng: number } | null;
  selectedLabel?: string;
  candidates?: GeoPlace[];
  flyToTarget?: { lat: number; lng: number; zoom?: number } | null;
  onMapClick?: (lat: number, lng: number) => void;
  onSelectCandidate?: (place: GeoPlace) => void;
  isReversing?: boolean;
  heightClassName?: string;
}

const DEFAULT_CENTER: [number, number] = [-2.5, 118];
const DEFAULT_ZOOM = 5;

const resolveAssetUrl = (asset: string | { src: string }): string =>
  typeof asset === 'string' ? asset : asset.src;

let leafletIconsPatched = false;

function ensureLeafletIcons() {
  if (leafletIconsPatched) return;
  leafletIconsPatched = true;
  delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: resolveAssetUrl(markerIcon2x),
    iconUrl: resolveAssetUrl(markerIcon),
    shadowUrl: resolveAssetUrl(markerShadow),
  });
}

function createCandidateIcon() {
  return L.divIcon({
    className: 'simantik-candidate-marker',
    html: '<span style="display:block;width:14px;height:14px;border-radius:9999px;background:#0d9488;border:2px solid #ffffff;box-shadow:0 2px 6px rgba(15,23,42,0.35);"></span>',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

function MapClickListener({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event) {
      onMapClick?.(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

function MapFlyController({
  target,
}: {
  target?: { lat: number; lng: number; zoom?: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!target) return;
    map.invalidateSize({ pan: false });
    map.flyTo([target.lat, target.lng], target.zoom ?? 16, {
      duration: 0.7,
    });
  }, [map, target]);

  return null;
}

/** Ensures Leaflet recalculates bounds after CSS/layout settle and responsive resizes. */
function MapResizeObserver() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const rafId = window.requestAnimationFrame(() => {
      map.invalidateSize({ pan: false });
    });

    if (typeof ResizeObserver === 'undefined') {
      return () => window.cancelAnimationFrame(rafId);
    }

    const observer = new ResizeObserver(() => {
      map.invalidateSize({ pan: false });
    });
    observer.observe(container);

    return () => {
      window.cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [map]);

  return null;
}

export default function SchoolMapPicker({
  selectedPosition,
  selectedLabel,
  candidates = [],
  flyToTarget,
  onMapClick,
  onSelectCandidate,
  isReversing = false,
  heightClassName = 'h-[360px] md:h-[520px]',
}: SchoolMapPickerProps) {
  ensureLeafletIcons();

  const hostRef = useRef<HTMLDivElement | null>(null);
  const tileErrorCountRef = useRef(0);
  const [mapKey, setMapKey] = useState(0);
  const [hasTileError, setHasTileError] = useState(false);

  const candidateIcon = useMemo(() => createCandidateIcon(), []);

  useEffect(() => {
    if (mapKey >= 2) return;
    const rafId = window.requestAnimationFrame(() => {
      const host = hostRef.current;
      if (!host) return;
      if (!host.querySelector('.leaflet-pane')) {
        setMapKey((prev) => (prev < 2 ? prev + 1 : prev));
      }
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [mapKey]);

  const visibleCandidates = useMemo(() => {
    if (!selectedPosition) return candidates;
    return candidates.filter(
      (place) =>
        Math.abs(place.latitude - selectedPosition.lat) > 0.00005 ||
        Math.abs(place.longitude - selectedPosition.lng) > 0.00005
    );
  }, [candidates, selectedPosition]);

  const initialCenter: [number, number] = selectedPosition
    ? [selectedPosition.lat, selectedPosition.lng]
    : DEFAULT_CENTER;
  const initialZoom = selectedPosition ? 15 : DEFAULT_ZOOM;

  return (
    <div
      ref={hostRef}
      style={{ minHeight: 360 }}
      className={`relative isolate z-0 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 ${heightClassName}`}
    >
      <MapContainer
        key={mapKey}
        center={initialCenter}
        zoom={initialZoom}
        scrollWheelZoom
        style={{ height: '100%', width: '100%', minHeight: 360 }}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          eventHandlers={{
            tileload: () => {
              tileErrorCountRef.current = 0;
              setHasTileError((prev) => (prev ? false : prev));
            },
            tileerror: () => {
              tileErrorCountRef.current += 1;
              if (tileErrorCountRef.current >= 3) {
                setHasTileError((prev) => (prev ? prev : true));
              }
            },
          }}
        />
        <MapResizeObserver />
        <MapClickListener onMapClick={onMapClick} />
        <MapFlyController target={flyToTarget} />

        {visibleCandidates.map((place, index) => (
          <Marker
            key={`${place.latitude}-${place.longitude}-${index}`}
            position={[place.latitude, place.longitude]}
            icon={candidateIcon}
            eventHandlers={{
              click: () => onSelectCandidate?.(place),
            }}
          >
            <Popup>
              <div className="space-y-1 text-xs">
                <p className="font-semibold text-slate-900">{place.name}</p>
                <p className="text-slate-600 line-clamp-2">{place.displayName}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {selectedPosition && (
          <Marker position={[selectedPosition.lat, selectedPosition.lng]}>
            <Popup>
              <div className="space-y-0.5 text-xs">
                <p className="font-semibold text-slate-900">
                  {selectedLabel || 'Lokasi Sekolah Dipilih'}
                </p>
                <p className="font-mono text-[11px] text-slate-600">
                  {selectedPosition.lat.toFixed(6)}, {selectedPosition.lng.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {hasTileError && (
        <div className="pointer-events-none absolute bottom-3 left-3 z-[400] max-w-xs inline-flex items-start gap-1.5 rounded-lg border border-amber-200 bg-amber-50/95 px-3 py-2 text-[11px] font-medium text-amber-900 shadow-md">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
          <span>
            Sebagian ubin peta OpenStreetMap gagal dimuat. Pencarian &amp; klik koordinat tetap
            berfungsi.
          </span>
        </div>
      )}

      {isReversing && (
        <div className="pointer-events-none absolute top-3 right-3 z-[400] inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-md border border-slate-200">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-teal-600" />
          Mengambil wilayah dari koordinat...
        </div>
      )}
    </div>
  );
}
