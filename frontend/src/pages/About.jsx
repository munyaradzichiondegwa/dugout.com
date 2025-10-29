import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const About = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: 'Takudzwa Chiota',
      role: 'Founder & CEO',
      bio: 'Visionary leader with 8+ years in e-commerce and technology innovation focused on Zimbabwean market solutions.',
      avatar: '👨‍💼'
    },
    {
      name: 'Sarah Moyo',
      role: 'Head of Operations',
      bio: 'Expert in logistics and Zimbabwean market dynamics with deep knowledge of local payment systems.',
      avatar: '👩‍💼'
    },
    {
      name: 'David Ndlovu',
      role: 'CTO',
      bio: 'Full-stack developer specializing in scalable solutions for African businesses using React + Next.js.',
      avatar: '👨‍💻'
    },
    {
      name: 'Grace Chiweshe',
      role: 'Vendor Relations Manager',
      bio: 'Building strong partnerships with restaurants, bars, and grocery stores across Zimbabwe.',
      avatar: '👩‍🤝‍👩'
    }
  ];

  const vendorTypes = [
    {
      icon: '🍽️',
      title: 'Restaurants & Food Vendors',
      description: 'Discover local cuisine, order meals for delivery or pickup, and make table reservations.'
    },
    {
      icon: '🍻',
      title: 'Bars & Beverage Providers',
      description: 'Order drinks for delivery, reserve tables, and discover local beverage offerings.'
    },
    {
      icon: '🛒',
      title: 'Grocery Shops & Supermarkets',
      description: 'Shop for fresh produce, household items, and groceries with flexible scheduling options.'
    }
  ];

  const platformFeatures = [
    {
      icon: '💰',
      title: 'Multi-Currency Wallet',
      description: 'Secure ZWL & USD wallet with support for EcoCash, OneMoney, ZIPIT, and voucher payments.'
    },
    {
      icon: '🛍️',
      title: 'Unified Shopping Cart',
      description: 'Single cart per vendor allowing you to mix food, drinks, and groceries in one order.'
    },
    {
      icon: '🗺️',
      title: 'Geospatial Mapping',
      description: 'Mapbox-powered discovery of verified vendors near you, filterable by type and category.'
    },
    {
      icon: '⚡',
      title: 'Mobile-First Platform',
      description: 'Built with React + Next.js 14+ for fast performance and optimal mobile experience.'
    },
    {
      icon: '🔒',
      title: 'Vendor Verification & KYC',
      description: 'All vendors undergo strict verification to ensure trust and quality service.'
    },
    {
      icon: '📊',
      title: 'Real-Time Order Tracking',
      description: 'Track your orders from confirmation to delivery with status updates at every stage.'
    }
  ];

  const technicalMilestones = [
    { year: '2024', event: 'Platform Architecture', description: 'Built on React + Next.js 14+ with MongoDB Atlas for scalability' },
    { year: '2024', event: 'Payment Integrations', description: 'EcoCash, OneMoney, Telecash, ZIPIT, and voucher systems' },
    { year: '2024', event: 'Vendor Onboarding', description: 'Multi-type vendor system with comprehensive KYC verification' },
    { year: '2024', event: 'Unified Cart Launch', description: 'Single cart system supporting food, beverages, and groceries' }
  ];

  const paymentMethods = [
    { name: 'EcoCash', icon: '📱' },
    { name: 'OneMoney', icon: '💳' },
    { name: 'Telecash', icon: '📞' },
    { name: 'ZIPIT', icon: '🏦' },
    { name: 'Vouchers', icon: '🎫' },
    { name: 'Agent Cash', icon: '👨‍💼' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About DugOut</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Zimbabwe's Premier Multi-Vendor Platform
            </p>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Connecting restaurants, bars, and grocery stores with customers through innovative mobile-first technology
            </p>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Revolutionizing Commerce in Zimbabwe</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                To become Zimbabwe's leading multi-vendor platform, driving digital transformation 
                and creating opportunities for businesses of all sizes to thrive in the digital economy.
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Zimbabwe-First Approach</h3>
              <p className="text-blue-800 leading-relaxed">
                Built specifically for Zimbabwean market dynamics with multi-currency support, 
                local payment integrations, and understanding of unique logistical challenges.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Types */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Three Vendor Types, One Platform</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive coverage of your daily needs through verified local businesses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {vendorTypes.map((vendor, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-blue-100">
                <div className="text-4xl mb-4 text-center">{vendor.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">{vendor.title}</h3>
                <p className="text-gray-600 text-center">{vendor.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Features */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced Platform Features</h2>
            <p className="text-xl text-gray-600">
              Built with cutting-edge technology for seamless user experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Local Payment Solutions</h2>
            <p className="text-blue-100 text-xl">
              Supporting all major Zimbabwean payment methods
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {paymentMethods.map((method, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-3">{method.icon}</div>
                <p className="font-semibold">{method.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technical Stack */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Built on Modern Technology</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-blue-600 mb-2">Frontend</div>
            <p className="text-gray-600">React + Next.js 14+</p>
            <p className="text-sm text-gray-500">App Router, SSR, SEO</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-green-600 mb-2">Database</div>
            <p className="text-gray-600">MongoDB Atlas</p>
            <p className="text-sm text-gray-500">Geospatial Indexes</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-purple-600 mb-2">Maps</div>
            <p className="text-gray-600">Mapbox GL JS</p>
            <p className="text-sm text-gray-500">Interactive Discovery</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-orange-600 mb-2">State</div>
            <p className="text-gray-600">React Context/Redux</p>
            <p className="text-sm text-gray-500">Complex Cart Management</p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Leadership Team</h2>
            <p className="text-xl text-gray-600">
              Passionate individuals dedicated to transforming Zimbabwean commerce
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-5xl mb-4">{member.avatar}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Development Timeline */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Technical Milestones</h2>
          <p className="text-xl text-gray-600">
            Our journey in building Zimbabwe's most advanced multi-vendor platform
          </p>
        </div>
        
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-blue-200 h-full"></div>
          
          <div className="space-y-12">
            {technicalMilestones.map((milestone, index) => (
              <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                  <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                    <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.event}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
                
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">3</div>
              <div className="text-blue-100">Vendor Types</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">6+</div>
              <div className="text-blue-100">Payment Methods</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">2</div>
              <div className="text-blue-100">Currencies (ZWL & USD)</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">10-14</div>
              <div className="text-blue-100">Weeks MVP Timeline</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the DugOut Revolution</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Experience the future of commerce in Zimbabwe with our multi-vendor platform supporting 
            restaurants, bars, and grocery stores in one unified app.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <button 
                  onClick={() => navigate('/register')}
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition duration-200"
                >
                  Sign Up Free
                </button>
                <button 
                  onClick={() => navigate('/vendors')}
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-3 px-8 rounded-lg transition duration-200"
                >
                  Browse Vendors
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/vendors')}
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition duration-200"
                >
                  Start Shopping
                </button>
                <button 
                  onClick={() => navigate('/vendor/dashboard')}
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-3 px-8 rounded-lg transition duration-200"
                >
                  Vendor Dashboard
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;