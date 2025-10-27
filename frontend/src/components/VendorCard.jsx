import { Link } from 'react-router-dom';

const VendorCard = ({ vendor }) => {
  const formatDistance = (distance) => {
    return `${distance} km away`;
  };

  return (
    <Link
      to={`/vendor/${vendor._id}`}
      className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 block"
    >
      {vendor.banner && (
        <img
          src={vendor.banner}
          alt={vendor.businessName}
          className="w-full h-32 object-cover rounded-t-lg"
        />
      )}
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-3">
            {vendor.logo && (
              <img
                src={vendor.logo}
                alt={vendor.businessName}
                className="w-12 h-12 rounded-full object-cover border"
              />
            )}
            <div>
              <h3 className="font-semibold text-gray-900">{vendor.businessName}</h3>
              <p className="text-sm text-gray-600 line-clamp-1">{vendor.description}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Verified
            </span>
            <span className="text-xs text-gray-500">
              {vendor.vendorTypes.map(type => type.charAt(0).toUpperCase() + type.slice(1)).join(', ')}
            </span>
          </div>
          
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {formatDistance(1.2)}
            </div>
            <div className="text-xs text-gray-500">Open now</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VendorCard;