import { useRef, useEffect } from 'react';

const MarkerContainer = ({ map, maps, location, setLocation }) => {
  const markerRef = useRef(null);

  useEffect(() => {
    if (!map || !maps) return;

    const marker = new maps.Marker({
      position: location,
      map: map,
      draggable: true
    });

    marker.addListener('dragend', event => {
      setLocation({
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      });
    });

    markerRef.current = marker;

    return () => {
      // Clean up when the component unmounts
      markerRef.current.setMap(null);
    };
  }, [map, maps, location, setLocation]);

  return null;
};

export default MarkerContainer;
