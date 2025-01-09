'use client';
import type { LatLngLiteral } from 'leaflet';
import { useMapEvents } from 'react-leaflet';

type SetViewOnClickProps = {
  setPosition: (position: LatLngLiteral) => void;
};

export default function SetViewOnClick({ setPosition }: SetViewOnClickProps) {
  const map = useMapEvents({
    click: (e) => {
      setPosition(e.latlng);
      map.setView(e.latlng, map.getZoom(), {
        animate: true,
      });
    },
    locationfound: (e) => {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return null;
}
