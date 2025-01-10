// eslint-disable-next-line ts/no-unsafe-function-type
export const animateMarker = (currentPosition: google.maps.LatLngLiteral, targetPosition: google.maps.LatLngLiteral, setPosition: Function) => {
  const totalFrames = 10; // Aumente ou diminua para ajustar a suavidade (mais frames = mais suave)
  const duration = 100; // Duração total da animação em milissegundos (reduza para tornar mais rápido)
  const interval = duration / totalFrames; // Calcula o intervalo com base na duração e frames

  const deltaLat = (targetPosition.lat - currentPosition.lat) / totalFrames;
  const deltaLng = (targetPosition.lng - currentPosition.lng) / totalFrames;

  let step = 0;

  const easing = (t: number) => t * (2 - t); // Função de easing (ease-out)

  const intervalId = setInterval(() => {
    step++;
    const progress = step / totalFrames; // Progresso atual (entre 0 e 1)
    const easeProgress = easing(progress); // Aplicar easing

    const lat = currentPosition.lat + deltaLat * step * easeProgress;
    const lng = currentPosition.lng + deltaLng * step * easeProgress;

    setPosition({ lat, lng });

    if (step >= totalFrames) {
      clearInterval(intervalId);
    }
  }, interval); // Aproximadamente 60 frames por segundo
};
