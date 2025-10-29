const RevenueChart = ({ data = [] }) => {
  // Use provided data or fallback to default
  const revenueData = data.length > 0 ? data : [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 19000 },
    { month: 'Mar', revenue: 15000 },
    { month: 'Apr', revenue: 25000 },
    { month: 'May', revenue: 22000 },
    { month: 'Jun', revenue: 30000 },
    { month: 'Jul', revenue: 28000 },
    { month: 'Aug', revenue: 35000 },
    { month: 'Sep', revenue: 32000 },
    { month: 'Oct', revenue: 40000 },
    { month: 'Nov', revenue: 38000 },
    { month: 'Dec', revenue: 45000 },
  ];

  const maxRevenue = Math.max(...revenueData.map(item => item.revenue));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
      
      {/* Simple bar chart using CSS */}
      <div className="flex items-end justify-between h-64 mt-8 space-x-2">
        {revenueData.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-all duration-300"
              style={{ height: `${(item.revenue / maxRevenue) * 80}%` }}
            ></div>
            <span className="text-xs text-gray-500 mt-2">{item.month}</span>
            <span className="text-xs text-gray-700 font-medium mt-1">
              ${(item.revenue / 1000).toFixed(0)}k
            </span>
          </div>
        ))}
      </div>

      {/* Revenue summary */}
      <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-lg font-bold text-gray-900">
            ${revenueData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Growth</p>
          <p className="text-lg font-bold text-green-600">+24.5%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Avg. Monthly</p>
          <p className="text-lg font-bold text-gray-900">
            ${(revenueData.reduce((sum, item) => sum + item.revenue, 0) / revenueData.length).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;