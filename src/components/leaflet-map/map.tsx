'use client';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

type MapProps = {
  chilren?: React.ReactNode;
};
export default function MyPage({ chilren }: MapProps) {
  const Map = useMemo(() => dynamic(
    () => import('./leaflet-map'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false,
    },
  ), []);

  return (
    <div className="mx-auto my-5 h-[480px] w-[98%] bg-white">
      <Map posix={[4.79029, -75.69003]}>
        {chilren}
      </Map>
    </div>
  );
}
