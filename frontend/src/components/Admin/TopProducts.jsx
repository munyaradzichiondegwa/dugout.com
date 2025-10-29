const TopProducts = ({ products = [] }) => {
  // Use provided products or fallback to default
  const productData = products.length > 0 ? products : [
    { name: 'Wireless Headphones', sales: 1243, revenue: 24860 },
    { name: 'Smart Watch', sales: 987, revenue: 39480 },
    { name: 'Laptop Backpack', sales: 756, revenue: 15120 },
    { name: 'Phone Case', sales: 654, revenue: 6540 },
    { name: 'USB-C Cable', sales: 543, revenue: 2715 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {productData.map((product, index) => (
          <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-500">{product.sales.toLocaleString()} sales</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                ${product.revenue.toLocaleString()}
              </p>
              <p className="text-xs text-green-600">+12%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;