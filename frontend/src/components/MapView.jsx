// src/components/MapView.jsx

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = ({ vendors, onVendorSelect }) => {
  const { user } = useAuth();
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error('Geolocation error:', error),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    if (mapRef.current && vendors.length > 0) {
      // Center on first vendor or user location
      const center = userLocation || vendors[0]?.location || [-17.8292, 31.0333];
      mapRef.current.setView(center, 12);
    }
  }, [vendors, userLocation]);

  const handleMapLoad = () => setMapLoaded(true);

  if (!mapLoaded) return <div>Loading map...</div>;

  return (
    <MapContainer
      center={[-17.8292, 31.0333]} // Harare default
      zoom={12}
      style={{ height: '100%', width: '100%' }}
      whenCreated={(map) => { mapRef.current = map; }}
      whenReady={handleMapLoad}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* User Location Marker */}
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
            click: () => onVendorSelect(vendor)
          }}
        >
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-bold">{vendor.businessName}</h3>
              <p>{vendor.description}</p>
              <p className="text-sm text-gray-600 mt-2">
                {vendor.vendorTypes.join(', ')}
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
  );
};

export default MapView;