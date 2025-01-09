'use client';

import type { LatLngExpression, LatLngTuple } from 'leaflet';
import type { ReactNode } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

export type MapProps = {
  posix: LatLngExpression | LatLngTuple;
  zoom?: number;
  children?: ReactNode;
};

const defaults = {
  zoom: 13,
};

const Map = (props: MapProps) => {
  const { zoom = defaults.zoom, posix, children } = props;

  return (
    <MapContainer
      center={posix}
      zoom={zoom}
      scrollWheelZoom
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
};

export default Map;
