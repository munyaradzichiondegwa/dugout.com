import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { productId, orderId, rating, title, comment, images } = req.body;

    // Validate order ownership and completion
    const order = await Order.findOne({
      _id: orderId,
      customer: req.user.id,
      status: 'delivered'
    });

    if (!order) {
      return res.status(400).json({
        success: false,
        message: 'You can only review delivered orders'
      });
    }

    // Check if product exists in order
    const productInOrder = order.items.some(
      item => item.product.toString() === productId
    );

    if (!productInOrder) {
      return res.status(400).json({
        success: false,
        message: 'Product not found in this order'
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      product: productId,
      customer: req.user.id,
      order: orderId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const review = new Review({
      product: productId,
      vendor: product.vendor,
      customer: req.user.id,
      order: orderId,
      rating,
      title,
      comment,
      images,
      isVerified: true // Auto-verify for delivered orders
    });

    await review.save();
    await review.populate('customer', 'name');
    await review.populate('product', 'name images');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review
    });

  } catch (error) {
    console.error('Create review error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to submit review'
    });
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, rating } = req.query;

    let query = { product: productId, isVerified: true };

    // Filter by rating if provided
    if (rating) {
      query.rating = parseInt(rating);
    }

    const reviews = await Review.find(query)
      .populate('customer', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(query);

    // Get rating distribution
    const ratingStats = await Review.aggregate([
      { $match: { product: mongoose.Types.ObjectId(productId), isVerified: true } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    res.json({
      success: true,
      count: reviews.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      reviews,
      ratingStats
    });

  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
};

// @desc    Get vendor reviews
// @route   GET /api/reviews/vendor/:vendorId
// @access  Public
export const getVendorReviews = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ vendor: vendorId, isVerified: true })
      .populate('customer', 'name')
      .populate('product', 'name images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ vendor: vendorId, isVerified: true });

    // Calculate vendor average rating
    const vendorStats = await Review.aggregate([
      { $match: { vendor: mongoose.Types.ObjectId(vendorId), isVerified: true } },
      {
        $group: {
          _id: '$vendor',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      count: reviews.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      reviews,
      vendorStats: vendorStats[0] || { averageRating: 0, reviewCount: 0 }
    });

  } catch (error) {
    console.error('Get vendor reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vendor reviews'
    });
  }
};

// @desc    Add response to review (Vendor)
// @route   PUT /api/reviews/:id/response
// @access  Private/Vendor
export const addReviewResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user is the vendor
    if (review.vendor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to respond to this review'
      });
    }

    review.response = {
      text: response,
      respondedBy: req.user.id,
      respondedAt: new Date()
    };

    await review.save();
    await review.populate('customer', 'name');
    await review.populate('product', 'name');

    res.json({
      success: true,
      message: 'Response added successfully',
      review
    });

  } catch (error) {
    console.error('Add review response error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add response'
    });
  }
};

// @desc    Mark review as helpful
// @route   PUT /api/reviews/:id/helpful
// @access  Private
export const markHelpful = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const hasMarkedHelpful = review.helpful.users.includes(req.user.id);

    if (hasMarkedHelpful) {
      // Remove helpful mark
      review.helpful.users = review.helpful.users.filter(
        userId => userId.toString() !== req.user.id
      );
      review.helpful.count = Math.max(0, review.helpful.count - 1);
    } else {
      // Add helpful mark
      review.helpful.users.push(req.user.id);
      review.helpful.count += 1;
    }

    await review.save();

    res.json({
      success: true,
      message: hasMarkedHelpful ? 'Removed helpful mark' : 'Marked as helpful',
      helpfulCount: review.helpful.count,
      hasMarkedHelpful: !hasMarkedHelpful
    });

  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update helpful status'
    });
  }
};