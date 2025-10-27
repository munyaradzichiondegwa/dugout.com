const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
    const sizeClasses = {
      small: 'w-6 h-6',
      medium: 'w-8 h-8',
      large: 'w-12 h-12'
    };
  
    return (
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className={`animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}></div>
        {text && <p className="text-gray-600 text-sm">{text}</p>}
      </div>
    );
  };
  
  export default LoadingSpinner;