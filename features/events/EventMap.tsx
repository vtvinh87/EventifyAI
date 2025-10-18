import React from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import { Spinner } from '../../components/UI';

const containerStyle = {
  width: '100%',
  height: '300px',
};

// A custom dark theme for the map from Snazzy Maps (Midnight Commander)
const mapStyles = [
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [ { "color": "#ffffff" } ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [ { "color": "#000000" }, { "lightness": 13 } ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [ { "color": "#000000" } ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [ { "color": "#144b53" }, { "lightness": 14 }, { "weight": 1.4 } ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [ { "color": "#08304b" } ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [ { "color": "#0c4152" }, { "lightness": 5 } ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [ { "color": "#000000" } ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [ { "color": "#0b434f" }, { "lightness": 25 } ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [ { "color": "#000000" } ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [ { "color": "#0b3d51" }, { "lightness": 16 } ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [ { "color": "#000000" } ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [ { "color": "#146474" } ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [ { "color": "#021019" } ]
    }
];

interface EventMapProps {
  center: {
    lat: number;
    lng: number;
  };
}

const EventMap: React.FC<EventMapProps> = ({ center }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  if (loadError) {
    return <div className="text-red-400">Không thể tải bản đồ. Vui lòng kiểm tra API key.</div>;
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[300px] w-full bg-white/5 rounded-2xl">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-white/20">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        options={{
            styles: mapStyles,
            disableDefaultUI: true,
            zoomControl: true,
            scrollwheel: false,
        }}
      >
        <MarkerF position={center} />
      </GoogleMap>
    </div>
  );
};

export default EventMap;