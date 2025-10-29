import { useState, useEffect } from 'react';
import { api } from '../services/api';

const ConnectionTest = () => {
  const [status, setStatus] = useState('testing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setStatus('testing');
      const response = await fetch(`${api.baseUrl}/health`);
      
      if (response.ok) {
        const data = await response.json();
        setStatus('connected');
        setMessage(`Backend is running: ${data.status}`);
      } else {
        setStatus('error');
        setMessage('Backend responded with error');
      }
    } catch (error) {
      setStatus('error');
      setMessage(`Cannot connect to backend: ${error.message}`);
    }
  };

  return (
    <div className="p-4 border rounded-lg mb-4">
      <h3 className="font-semibold mb-2">Backend Connection Test</h3>
      <div className={`inline-block px-3 py-1 rounded-full text-sm ${
        status === 'connected' ? 'bg-green-100 text-green-800' :
        status === 'testing' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        {status === 'connected' ? '✅ Connected' :
         status === 'testing' ? '🔄 Testing...' :
         '❌ Connection Failed'}
      </div>
      <p className="mt-2 text-sm text-gray-600">{message}</p>
      <button
        onClick={testConnection}
        className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
      >
        Test Again
      </button>
    </div>
  );
};

export default ConnectionTest;