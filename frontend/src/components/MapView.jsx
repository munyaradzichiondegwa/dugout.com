// src/components/MapView.jsx
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const MapView = ({ vendors, onVendorSelect }) => {
  const { user } = useAuth();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Your existing MapView component code here
    // (copy from your original MapView component)
  }, []);

  // ... rest of your MapView component code

  return (
    <div className="h-full w-full relative">
      <div ref={mapContainer} className="h-full w-full rounded-lg" />
      
      {/* Map Controls Overlay */}
      <div className="absolute top-4 right-4 space-y-2">
        <button
          onClick={() => {
            if (map.current && userLocation) {
              map.current.flyTo({
                center: [userLocation.lng, userLocation.lat],
                zoom: 14,
                essential: true
              });
            }
          }}
          className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          title="Center on my location"
        >
          <span className="w-6 h-6 block">📍</span>
        </button>
        
        <div className="bg-white p-3 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Vendors</span>
          </div>
          <div className="flex items-center space-x-2 text-sm mt-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Your Location</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;