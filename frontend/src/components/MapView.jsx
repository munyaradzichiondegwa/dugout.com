// src/components/MapView.jsx

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper to recenter map
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 13);
  }, [center]);
  return null;
};

const MapView = ({ vendors = [], onVendorSelect }) => {
  const { user } = useAuth();
  const [userLocation, setUserLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => console.error('Geolocation error:', err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const defaultCenter = [-17.8292, 31.0333]; // Harare

  if (!mapLoaded) return <div>Loading map...</div>;

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        whenReady={() => setMapLoaded(true)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Center map when user location available */}
        {userLocation && <RecenterMap center={[userLocation.lat, userLocation.lng]} />}

        {/* User Marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* Vendor Markers */}
        {vendors.map((vendor) => (
          <Marker
            key={vendor._id}
            position={[vendor.location.lat, vendor.location.lng]}
            eventHandlers={{
              click: () => onVendorSelect?.(vendor),
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-bold">{vendor.businessName}</h3>
                <p>{vendor.description}</p>
                <p className="text-sm text-gray-600 mt-2">
                  {vendor.vendorTypes?.join(', ')}
                </p>
                <button
                  onClick={() => window.open(`/vendor/${vendor._id}`, '_blank')}
                  className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm"
                >
                  View Store
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Controls Overlay */}
      <div className="absolute top-4 right-4 space-y-2 z-[1000]">
        <button
          onClick={() => {
            if (userLocation) {
              const map = L.map('map');
              map.flyTo([userLocation.lat, userLocation.lng], 14, {
                animate: true,
              });
            }
          }}
          className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          title="Center on my location"
        >
          📍
        </button>

        <div className="bg-white p-3 rounded-lg shadow-md text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span>Vendors</span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span>Your Location</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
