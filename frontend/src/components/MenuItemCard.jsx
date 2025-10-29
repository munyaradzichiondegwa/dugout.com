const MenuItemCard = ({ item, onAddToCart }) => {
    const formatPrice = (amount, currency) => {
      return new Intl.NumberFormat('en-ZW', {
        style: 'currency',
        currency: currency === 'ZWL' ? 'ZWL' : 'USD'
      }).format(amount / 100);
    };
  
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
            {item.itemType === 'grocery' && item.unit && (
              <p className="text-xs text-gray-500 mt-1">Unit: {item.unit}</p>
            )}
          </div>
          
          {item.images?.[0] && (
            <img
              src={item.images[0]}
              alt={item.name}
              className="w-16 h-16 rounded-lg object-cover ml-4"
            />
          )}
        </div>
  
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(item.price, item.currency)}
            </span>
            {item.itemType === 'grocery' && item.stockQuantity !== undefined && (
              <span className="text-sm text-gray-500 ml-2">
                {item.stockQuantity > 0 ? `${item.stockQuantity} in stock` : 'Out of stock'}
              </span>
            )}
          </div>
          
          <button
            onClick={onAddToCart}
            disabled={!item.isAvailable || (item.itemType === 'grocery' && item.stockQuantity === 0)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            Add to Cart
          </button>
        </div>
      </div>
    );
  };
  
  export default MenuItemCard;