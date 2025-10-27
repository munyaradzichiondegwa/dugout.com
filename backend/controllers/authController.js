import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Register user
export const register = async (req, res) => {
  try {
    const { firstName, lastName, name, email, phoneNumber, password, role, businessName, businessType, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { phoneNumber },
        { email: email || '' } // Handle empty email
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this phone number or email'
      });
    }

    // Create new user - ensure all required fields are included
    const user = new User({
      firstName,
      lastName,
      name: name || `${firstName} ${lastName}`, // Fallback if name not provided
      email: email || undefined, // Set to undefined if empty to avoid empty string
      phoneNumber,
      password,
      role: role || 'customer',
      businessName,
      businessType,
      address
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        phoneNumber: user.phoneNumber,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data without password
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      businessName: user.businessName,
      businessType: user.businessType,
      address: user.address,
      isVerified: user.isVerified,
      createdAt: user.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Register error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Phone number or email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Find user by phone number
    const user = await User.findOne({ phoneNumber });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number or password'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        phoneNumber: user.phoneNumber,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data without password
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      businessName: user.businessName,
      businessType: user.businessType,
      address: user.address,
      isVerified: user.isVerified,
      createdAt: user.createdAt
    };

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    console.log('Get profile request for user:', req.user.id);

    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        businessName: user.businessName,
        businessType: user.businessType,
        address: user.address,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get profile'
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, name, email, phoneNumber, businessName, businessType, address, preferences } = req.body;
    
    console.log('Update profile request for user:', req.user.id);
    console.log('Update data:', req.body);

    // Find the user by ID from the authenticated user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user fields (only if provided)
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (name !== undefined) {
      user.name = name;
    } else if (firstName !== undefined || lastName !== undefined) {
      // Auto-update name if first/last changed
      user.name = `${user.firstName || firstName} ${user.lastName || lastName}`.trim();
    }
    if (email !== undefined) user.email = email;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (businessName !== undefined) user.businessName = businessName;
    if (businessType !== undefined) user.businessType = businessType;
    if (address !== undefined) user.address = address;
    if (preferences !== undefined) user.preferences = preferences;

    // Save the updated user
    const updatedUser = await user.save();

    // Return the updated user without password
    const userResponse = {
      id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      name: updatedUser.name,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      role: updatedUser.role,
      businessName: updatedUser.businessName,
      businessType: updatedUser.businessType,
      address: updatedUser.address,
      isVerified: updatedUser.isVerified,
      preferences: updatedUser.preferences,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Phone number or email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile'
    });
  }
};

// Send OTP
export const sendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Find user or create if registering (for verification flow)
    let user = await User.findOne({ phoneNumber });
    if (!user) {
      // If no user, create a temporary one or handle registration flow
      return res.status(404).json({
        success: false,
        message: 'User not found. Please register first.'
      });
    }

    // Generate and save OTP using schema method
    const otp = user.generateOTP();
    
    // In a real app, send OTP via SMS (e.g., Twilio/AfroTwilio for Zimbabwe)
    // For demo, log it
    console.log(`OTP sent to ${phoneNumber}: ${otp}`);

    // Save user with OTP
    await user.save();

    res.json({
      success: true,
      message: 'OTP sent successfully'
      // In production, don't expose OTP
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send OTP'
    });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otpCode } = req.body;

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify using schema method
    const isValid = user.verifyOTP(otpCode);
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Save verified user
    await user.save();

    res.json({
      success: true,
      message: 'OTP verified successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        phoneNumber: user.phoneNumber,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify OTP'
    });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { phoneNumber, newPassword } = req.body;

    const user = await User.findOne({ phoneNumber });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Hash the new password (schema pre-save will handle, but ensure)
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reset password'
    });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    // In a real app, blacklist the token in Redis or DB
    // For JWT stateless, client-side handling is sufficient
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Logout failed'
    });
  }
};