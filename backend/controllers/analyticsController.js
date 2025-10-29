// backend/controllers/analyticsController.js
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const getVendorDashboardStats = async (req, res) => {
  try {
    const vendorId = req.user.id;
    
    // Get total products
    const totalProducts = await Product.countDocuments({ vendor: vendorId });
    
    // Get total orders and revenue
    const totalOrders = await Order.countDocuments({ vendor: vendorId });
    const totalRevenueResult = await Order.aggregate([
      { $match: { vendor: vendorId } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;
    
    // Get today's revenue
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRevenueResult = await Order.aggregate([
      { 
        $match: { 
          vendor: vendorId,
          createdAt: { $gte: today }
        } 
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const todayRevenue = todayRevenueResult[0]?.total || 0;
    
    // Get inventory status
    const products = await Product.find({ vendor: vendorId });
    const totalStock = products.reduce((sum, product) => sum + (product.stockQuantity || 0), 0);
    const lowStockItems = products.filter(product => 
      product.stockQuantity <= (product.lowStockThreshold || 5)
    ).length;
    
    // Get order status breakdown
    const orderStatusBreakdown = await Order.aggregate([
      { $match: { vendor: vendorId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Get pending orders count
    const pendingOrders = await Order.countDocuments({ 
      vendor: vendorId, 
      status: 'pending' 
    });
    
    res.json({
      success: true,
      stats: {
        totals: {
          products: totalProducts,
          orders: totalOrders,
          revenue: totalRevenue
        },
        today: {
          revenue: todayRevenue
        },
        inventory: {
          totalStock,
          lowStockItems
        },
        orders: {
          statusBreakdown: orderStatusBreakdown,
          pending: pendingOrders
        }
      },
      trends: {
        monthlyRevenue: []
      }
    });
    
  } catch (error) {
    console.error('Get vendor dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
};