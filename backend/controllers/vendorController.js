// vendorController.js

import Vendor from '../models/Vendor.js';
import MenuItem from '../models/MenuItem.js';
import User from '../models/User.js';



export const getVendors = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      vendorTypes,
      categories,
      search,
      lat,
      lng,
      maxDistance = 10 // in kilometers
    } = req.query;

    const query = { verificationStatus: 'verified', isActive: true };

    // Filter by vendor types
    if (vendorTypes) {
      const typesArray = Array.isArray(vendorTypes) ? vendorTypes : vendorTypes.split(',');
      query.vendorTypes = { $in: typesArray };
    }

    // Filter by categories
    if (categories) {
      const categoriesArray = Array.isArray(categories) ? categories : categories.split(',');
      query.categories = { $in: categoriesArray };
    }

    // Search filter
    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { categories: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Geo-spatial query
    let geoQuery = {};
    if (lat && lng) {
      geoQuery = {
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: maxDistance * 1000 // Convert to meters
          }
        }
      };
    }

    const vendors = await Vendor.find({ ...query, ...geoQuery })
      .populate('userId', 'firstName lastName phoneNumber')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Vendor.countDocuments({ ...query, ...geoQuery });

    res.json({
      success: true,
      vendors,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get vendors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vendors'
    });
  }
};

export const getVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await Vendor.findById(id)
      .populate('userId', 'firstName lastName phoneNumber email');

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      vendor
    });
  } catch (error) {
    console.error('Get vendor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vendor'
    });
  }
};

export const createVendor = async (req, res) => {
  try {
    const {
      businessName,
      description,
      vendorTypes,
      categories,
      location,
      address,
      contactPhone,
      contactEmail,
      logo,
      banner,
      payoutMethod,
      payoutDetails
    } = req.body;

    // Check if user already has a vendor profile
    const existingVendor = await Vendor.findOne({ userId: req.user._id });
    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: 'Vendor profile already exists for this user'
      });
    }

    const vendor = await Vendor.create({
      userId: req.user._id,
      businessName,
      description,
      vendorTypes,
      categories,
      location: {
        type: 'Point',
        coordinates: location.coordinates
      },
      address,
      contactPhone,
      contactEmail,
      logo,
      banner,
      payoutMethod,
      payoutDetails
    });

    // Update user role to vendor
    await User.findByIdAndUpdate(req.user._id, { role: 'vendor' });

    const populatedVendor = await Vendor.findById(vendor._id)
      .populate('userId', 'firstName lastName phoneNumber');

    res.status(201).json({
      success: true,
      message: 'Vendor profile created successfully. Awaiting verification.',
      vendor: populatedVendor
    });
  } catch (error) {
    console.error('Create vendor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create vendor profile'
    });
  }
};

export const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const vendor = await Vendor.findOne({ _id: id, userId: req.user._id });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found or access denied'
      });
    }

    // Only allow certain fields to be updated
    const allowedUpdates = [
      'businessName', 'description', 'vendorTypes', 'categories',
      'location', 'address', 'contactPhone', 'contactEmail',
      'logo', 'banner', 'payoutMethod', 'payoutDetails'
    ];

    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        vendor[key] = updates[key];
      }
    });

    // Reset verification status if important details change
    if (updates.businessName || updates.location) {
      vendor.verificationStatus = 'pending';
    }

    await vendor.save();

    const populatedVendor = await Vendor.findById(vendor._id)
      .populate('userId', 'firstName lastName phoneNumber');

    res.json({
      success: true,
      message: 'Vendor profile updated successfully',
      vendor: populatedVendor
    });
  } catch (error) {
    console.error('Update vendor error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update vendor profile'
    });
  }
};

export const getVendorMenuItems = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, itemType, available } = req.query;

    const query = { vendorId: id };

    if (category) query.category = category;
    if (itemType) query.itemType = itemType;
    if (available !== undefined) query.isAvailable = available === 'true';

    const menuItems = await MenuItem.find(query).sort({ category: 1, name: 1 });

    res.json({
      success: true,
      menuItems
    });
  } catch (error) {
    console.error('Get vendor menu items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu items'
    });
  }
};