const RecentOrders = ({ orders = [] }) => {
  // Use provided orders or fallback to default
  const orderData = orders.length > 0 ? orders : [
    { id: '#ORD-001', customer: 'John Smith', date: '2024-01-15', amount: 150.00, status: 'Completed' },
    { id: '#ORD-002', customer: 'Sarah Johnson', date: '2024-01-14', amount: 89.99, status: 'Pending' },
    { id: '#ORD-003', customer: 'Mike Wilson', date: '2024-01-14', amount: 245.50, status: 'Completed' },
    { id: '#ORD-004', customer: 'Emily Davis', date: '2024-01-13', amount: 67.25, status: 'Shipped' },
    { id: '#ORD-005', customer: 'Robert Brown', date: '2024-01-13', amount: 189.99, status: 'Completed' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orderData.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.id}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{order.customer}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{order.date}</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                  ${typeof order.amount === 'number' ? order.amount.toFixed(2) : order.amount}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;