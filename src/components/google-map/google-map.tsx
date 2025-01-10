'use client';
import { GoogleMap, type GoogleMapProps } from '@react-google-maps/api';
import type { ReactNode } from 'react';

export type MapProps = {
  children?: ReactNode;
} & GoogleMapProps;

export function GoogleMaps({ children, ...props }: MapProps) {
  return (
    <GoogleMap
      zoom={16}
      mapContainerClassName="map-container"
      {...props}
      mapContainerStyle={{
        height: '100%',
        width: '100%',
        ...props.mapContainerStyle,
      }}
      options={{
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        ...props.options,
      }}
    >
      {children}
    </GoogleMap>
  );
}
