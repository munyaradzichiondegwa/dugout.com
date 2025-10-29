import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // ✅ Added this import

const Footer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock weather data (in real app, you'd call a weather API)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        const mockWeather = {
          location: "Harare, ZW",
          temperature: 24,
          condition: "Sunny",
          humidity: 65,
          icon: "☀️"
        };
        setWeather(mockWeather);
      } catch (error) {
        console.error('Failed to fetch weather:', error);
        setWeather({
          location: "Zimbabwe",
          temperature: 25,
          condition: "Clear",
          humidity: 60,
          icon: "🌤️"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-ZW', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-ZW', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* Date & Time */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <span className="text-gray-400">📅</span>
                <div>
                  <div className="text-sm font-medium">{formatDate(currentTime)}</div>
                  <div className="text-xs text-gray-400">{formatTime(currentTime)}</div>
                </div>
              </div>
            </div>

            {/* Copyright & Links */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-4 text-sm">
                <span>© 2024 DugOut Zimbabwe</span>
                <span className="text-gray-400">•</span>
                <Link to="/about" className="text-gray-400 hover:text-white transition">
                  About Us
                </Link> {/* ✅ Added About Us link using React Router */}
                <span className="text-gray-400">•</span>
                <a href="#" className="text-gray-300 hover:text-white transition">Privacy</a>
                <span className="text-gray-400">•</span>
                <a href="#" className="text-gray-300 hover:text-white transition">Terms</a>
              </div>
              <p className="text-xs text-gray-400 mt-1">Multi-Vendor Platform</p>
            </div>

            {/* Weather */}
            <div className="text-center md:text-right">
              {loading ? (
                <div className="flex items-center justify-center md:justify-end space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span className="text-sm">Loading weather...</span>
                </div>
              ) : weather ? (
                <div className="flex items-center justify-center md:justify-end space-x-2">
                  <span className="text-xl">{weather.icon}</span>
                  <div>
                    <div className="text-sm font-medium">
                      {weather.temperature}°C • {weather.condition}
                    </div>
                    <div className="text-xs text-gray-400">
                      {weather.location} • 💧 {weather.humidity}%
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-400">Weather unavailable</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
