import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer'; // Add this import

const Profile = () => {
  const { user } = useAuth();
  
  console.log('Profile user data:', user); // Debug log

  // Format date properly
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col"> {/* Add flex-col */}
      <Navigation />
      
      <div className="flex-1 max-w-4xl mx-auto py-8 px-4"> {/* Add flex-1 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
          
          {/* Personal Information */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  First Name
                </label>
                <div className="p-3 bg-gray-50 rounded border">
                  {user?.firstName || user?.name?.split(' ')[0] || 'Not set'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Last Name
                </label>
                <div className="p-3 bg-gray-50 rounded border">
                  {user?.lastName || user?.name?.split(' ')[1] || 'Not set'}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email Address
                </label>
                <div className="p-3 bg-gray-50 rounded border">
                  {user?.email || 'Not set'}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Phone Number
                </label>
                <div className="p-3 bg-gray-50 rounded border">
                  {user?.phoneNumber || 'Not set'}
                </div>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Account Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Phone Verification
                </label>
                <div className={`p-3 rounded border ${
                  user?.isVerified ? 'bg-green-50 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                }`}>
                  {user?.isVerified ? 'Verified' : 'Pending'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Account Type
                </label>
                <div className="p-3 bg-gray-50 rounded border capitalize">
                  {user?.role || 'customer'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Member since
                </label>
                <div className="p-3 bg-gray-50 rounded border">
                  {formatDate(user?.createdAt)}
                </div>
              </div>
              {user?.businessName && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Business Name
                  </label>
                  <div className="p-3 bg-gray-50 rounded border">
                    {user.businessName}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                View Order History
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                Payment Methods
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
                Security Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Footer */}
      <Footer />
    </div>
  );
};

export default Profile;