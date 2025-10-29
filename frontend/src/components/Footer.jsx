import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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

  // Mock weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setWeather({
          location: "Harare, ZW",
          temperature: 24,
          condition: "Sunny",
          humidity: 65,
          icon: "☀️"
        });
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

  const formatTime = (date) =>
    date.toLocaleTimeString('en-ZW', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

  const formatDate = (date) =>
    date.toLocaleDateString('en-ZW', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

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

            {/* Quick Links & Copyright */}
            <div className="text-center">
              <div className="flex flex-col items-center space-y-1">
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <Link to="/about" className="text-gray-400 hover:text-white transition">About Us</Link>
                  <Link to="/privacy" className="text-gray-400 hover:text-white transition">Privacy</Link>
                  <Link to="/terms" className="text-gray-400 hover:text-white transition">Terms</Link>
                  <Link to="/contact" className="text-gray-400 hover:text-white transition">Contact</Link>
                </div>
                <p className="text-xs text-gray-400 mt-1">© 2025 DugOut Zimbabwe • Multi-Vendor Platform</p>
              </div>
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
