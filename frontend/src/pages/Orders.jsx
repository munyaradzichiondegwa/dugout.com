import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer'; // Add this import

const Orders = () => {
  const { user } = useAuth();

  // Mock orders data - replace with actual API call
  const orders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      vendor: "Fresh Groceries",
      status: "Delivered",
      total: "$45.99",
      items: 5
    },
    {
      id: "ORD-002",
      date: "2024-01-12",
      vendor: "Tech Gadgets ZW",
      status: "Processing",
      total: "$129.99",
      items: 1
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col"> {/* Add flex-col */}
      <Navigation />
      
      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 w-full">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">View your order history and track current orders</p>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {orders.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {orders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{order.id}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">Vendor: {order.vendor}</p>
                      <p className="text-gray-600 text-sm">Date: {new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div className="mt-4 md:mt-0 md:text-right">
                      <p className="text-lg font-semibold text-gray-900">{order.total}</p>
                      <p className="text-gray-600 text-sm">{order.items} item{order.items !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-3">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details
                    </button>
                    <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                      Track Order
                    </button>
                    {order.status === 'Delivered' && (
                      <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                        Reorder
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
              <p className="text-gray-600 mb-6">Start shopping to see your orders here.</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                Browse Vendors
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Add Footer */}
      <Footer />
    </div>
  );
};

export default Orders;