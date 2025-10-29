import { useState, useEffect } from 'react';
<<<<<<< HEAD
import { Link } from 'react-router-dom';
=======
>>>>>>> origin/main

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

<<<<<<< HEAD
  // Mock weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setWeather({
=======
  // Mock weather data (in real app, you'd call a weather API)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock weather data for Zimbabwe
        const mockWeather = {
>>>>>>> origin/main
          location: "Harare, ZW",
          temperature: 24,
          condition: "Sunny",
          humidity: 65,
          icon: "☀️"
<<<<<<< HEAD
        });
      } catch (error) {
        console.error('Failed to fetch weather:', error);
=======
        };
        
        setWeather(mockWeather);
      } catch (error) {
        console.error('Failed to fetch weather:', error);
        // Fallback weather data
>>>>>>> origin/main
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

<<<<<<< HEAD
  const formatTime = (date) =>
    date.toLocaleTimeString('en-ZW', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

  const formatDate = (date) =>
    date.toLocaleDateString('en-ZW', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
=======
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
>>>>>>> origin/main

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
<<<<<<< HEAD
            
=======
>>>>>>> origin/main
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

<<<<<<< HEAD
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
=======
            {/* Copyright & Links */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-4 text-sm">
                <span>© 2024 DugOut Zimbabwe</span>
                <span className="text-gray-400">•</span>
                <a href="#" className="text-gray-300 hover:text-white transition">Privacy</a>
                <span className="text-gray-400">•</span>
                <a href="#" className="text-gray-300 hover:text-white transition">Terms</a>
              </div>
              <p className="text-xs text-gray-400 mt-1">Multi-Vendor Platform</p>
>>>>>>> origin/main
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
<<<<<<< HEAD

=======
>>>>>>> origin/main
          </div>
        </div>
      </div>
    </footer>
  );
};

<<<<<<< HEAD
export default Footer;
=======
export default Footer;
>>>>>>> origin/main
