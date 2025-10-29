import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

// @desc    Initiate payment
// @route   POST /api/payments/initiate
// @access  Private
export const initiatePayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, phoneNumber, notes } = req.body;

    // Get order
    const order = await Order.findById(orderId)
      .populate('customer', 'name phoneNumber')
      .populate('vendor', 'businessName');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order
    if (order.customer._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay for this order'
      });
    }

    // Check if order is already paid
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Order is already paid'
      });
    }

    // Create payment record
    const payment = new Payment({
      order: orderId,
      customer: req.user.id,
      vendor: order.vendor._id,
      amount: order.total,
      paymentMethod,
      phoneNumber: phoneNumber || req.user.phoneNumber,
      proofOfPayment: { notes }
    });

    await payment.save();

    // For EcoCash/OneMoney - simulate API call
    if (['ecocash', 'onemoney'].includes(paymentMethod)) {
      // In production, integrate with actual payment gateway
      // For now, simulate payment initiation
      const simulatedResponse = await simulateMobilePayment(payment);
      
      payment.gatewayResponse = simulatedResponse;
      payment.status = 'processing';
      await payment.save();
    }

    await payment.populate('customer', 'name phoneNumber');
    await payment.populate('vendor', 'businessName');
    await payment.populate('order');

    res.json({
      success: true,
      message: 'Payment initiated successfully',
      payment,
      // For mobile money, provide payment instructions
      instructions: getPaymentInstructions(paymentMethod, payment.amount, payment.reference)
    });

  } catch (error) {
    console.error('Initiate payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate payment'
    });
  }
};

// @desc    Verify payment (for manual verification common in Zim)
// @route   POST /api/payments/:id/verify
// @access  Private/Admin/Vendor
export const verifyPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { verified, adminNotes } = req.body;

    const payment = await Payment.findById(id)
      .populate('order')
      .populate('customer', 'name phoneNumber')
      .populate('vendor', 'businessName');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check if user is admin or vendor
    if (req.user.role !== 'admin' && payment.vendor._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to verify payments'
      });
    }

    payment.proofOfPayment.verified = verified;
    payment.proofOfPayment.verifiedBy = req.user.id;
    payment.proofOfPayment.verifiedAt = new Date();
    
    if (adminNotes) {
      payment.proofOfPayment.notes = adminNotes;
    }

    if (verified) {
      payment.status = 'completed';
      
      // Update order payment status
      const order = await Order.findById(payment.order._id);
      order.paymentStatus = 'paid';
      await order.save();
    } else {
      payment.status = 'failed';
    }

    await payment.save();

    res.json({
      success: true,
      message: `Payment ${verified ? 'verified' : 'rejected'} successfully`,
      payment
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment'
    });
  }
};

// @desc    Upload proof of payment
// @route   POST /api/payments/:id/proof
// @access  Private
export const uploadProofOfPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl, notes } = req.body;

    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check if user owns the payment
    if (payment.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this payment'
      });
    }

    payment.proofOfPayment.image = imageUrl;
    payment.proofOfPayment.notes = notes;
    payment.status = 'processing'; // Move to processing for verification

    await payment.save();

    res.json({
      success: true,
      message: 'Proof of payment uploaded successfully',
      payment
    });

  } catch (error) {
    console.error('Upload proof error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload proof of payment'
    });
  }
};

// @desc    Get payment status
// @route   GET /api/payments/:id
// @access  Private
export const getPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id)
      .populate('customer', 'name phoneNumber')
      .populate('vendor', 'businessName')
      .populate('order');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check if user is authorized
    if (payment.customer._id.toString() !== req.user.id && 
        payment.vendor._id.toString() !== req.user.id && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this payment'
      });
    }

    res.json({
      success: true,
      payment
    });

  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment status'
    });
  }
};

// @desc    Get user's payment history
// @route   GET /api/payments/history/my-payments
// @access  Private
export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ customer: req.user.id })
      .populate('order')
      .populate('vendor', 'businessName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      payments
    });

  } catch (error) {
    console.error('Get my payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history'
    });
  }
};

// Helper function to simulate mobile payment
const simulateMobilePayment = async (payment) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    gateway: 'simulated',
    transactionId: `TXN-${Date.now()}`,
    status: 'pending',
    message: 'Payment request sent to mobile money provider'
  };
};

// Helper function for payment instructions
const getPaymentInstructions = (method, amount, reference) => {
  const instructions = {
    ecocash: {
      title: 'EcoCash Payment Instructions',
      steps: [
        `Dial *151# on your EcoCash registered phone`,
        `Select "Send Money"`,
        `Select "To Business"`,
        `Enter Merchant Code: 123456`, // This would be your actual merchant code
        `Enter Amount: $${amount}`,
        `Enter Reference: ${reference}`,
        `Confirm payment with your PIN`
      ],
      note: 'Keep the transaction confirmation message as proof of payment.'
    },
    onemoney: {
      title: 'OneMoney Payment Instructions',
      steps: [
        `Dial *111# on your OneMoney registered phone`,
        `Select "Pay Bill"`,
        `Enter Business Number: 12345`, // Your actual business number
        `Enter Amount: $${amount}`,
        `Enter Reference: ${reference}`,
        `Confirm payment with your PIN`
      ],
      note: 'Save the transaction confirmation for your records.'
    },
    cash: {
      title: 'Cash Payment',
      steps: [
        'Pay with cash on delivery',
        'Have exact amount ready',
        `Reference: ${reference}`
      ],
      note: 'Payment will be collected when your order is delivered.'
    }
  };

  return instructions[method] || { title: 'Payment Instructions', steps: [] };
};