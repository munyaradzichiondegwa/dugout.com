import { useState, useEffect } from 'react';

const SearchAndFilters = ({ filters, onFilterChange, viewMode, onViewModeChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchChange = (value) => {
    handleFilterChange('searchQuery', value);
  };

  const toggleVendorType = (type) => {
    const currentTypes = localFilters.vendorTypes;
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    handleFilterChange('vendorTypes', newTypes);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      vendorTypes: [],
      categories: [],
      maxDistance: 10,
      searchQuery: ''
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = 
    localFilters.vendorTypes.length > 0 ||
    localFilters.categories.length > 0 ||
    localFilters.searchQuery ||
    localFilters.maxDistance !== 10;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      {/* Search Bar and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Search vendors, categories..."
            value={localFilters.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">⏹️</span>
            </button>
            <button
              onClick={() => onViewModeChange('map')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'map'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">🗺️</span>
            </button>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 border rounded-lg transition-colors relative ${
              showFilters || hasActiveFilters
                ? 'bg-blue-50 border-blue-200 text-blue-600'
                : 'border-gray-300 text-gray-600 hover:border-gray-400'
            }`}
          >
            <span className="text-lg">⚙️</span>
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full"></span>
            )}
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="border-t pt-4 space-y-4">
          {/* Vendor Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vendor Types
            </label>
            <div className="flex flex-wrap gap-2">
              {['food', 'beverage', 'grocery'].map(type => (
                <button
                  key={type}
                  onClick={() => toggleVendorType(type)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    localFilters.vendorTypes.includes(type)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Distance Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Distance: {localFilters.maxDistance} km
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={localFilters.maxDistance}
              onChange={(e) => handleFilterChange('maxDistance', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 km</span>
              <span>50 km</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Clear all filters
            </button>
            
            <button
              onClick={() => setShowFilters(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && !showFilters && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {localFilters.vendorTypes.map(type => (
                <span
                  key={type}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                  <button
                    onClick={() => toggleVendorType(type)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
              
              {localFilters.searchQuery && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Search: "{localFilters.searchQuery}"
                  <button
                    onClick={() => handleSearchChange('')}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {localFilters.maxDistance !== 10 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Within {localFilters.maxDistance}km
                  <button
                    onClick={() => handleFilterChange('maxDistance', 10)}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
            
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;