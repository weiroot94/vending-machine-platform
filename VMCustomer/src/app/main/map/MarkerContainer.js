import {useRef, useEffect} from 'react';

const MarkerContainer = ({ map, maps, machines }) => {
    const markerRef = useRef([]);
  
    useEffect(() => {
      markerRef.current.forEach((marker) => marker.setMap(null)); // Clear existing markers
      markerRef.current = machines.map((machine) =>
        new maps.Marker({
          position: machine.location,
          map: map,
          draggable: false,
          icon: { url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png" },
        })
      );
    }, [map, maps, machines]);
  
    return null
  };

  export default MarkerContainer;