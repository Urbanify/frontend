'use client';

import type { LatLngExpression, LatLngTuple } from 'leaflet';
import { Marker as Pin, Popup } from 'react-leaflet';
import 'leaflet-defaulticon-compatibility';

export type MarkerProps = {
  posix: LatLngExpression | LatLngTuple;
  popupMsg?: string;
};

export default function Marker(props: MarkerProps) {
  return (
    <Pin position={props.posix} draggable>
      {props.popupMsg ? <Popup>{props.popupMsg}</Popup> : null}
    </Pin>
  );
};
