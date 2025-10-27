import MenuItem from '../models/MenuItem.js';
import Vendor from '../models/Vendor.js';

export const getMenuItems = async (req, res) => {
  try {
    const { vendorId, category, itemType, available, page = 1, limit = 50 } = req.query;

    const query = {};
    if (vendorId) query.vendorId = vendorId;
    if (category) query.category = category;
    if (itemType) query.itemType = itemType;
    if (available !== undefined) query.isAvailable = available === 'true';

    const menuItems = await MenuItem.find(query)
      .populate('vendorId', 'businessName logo')
      .sort({ category: 1, name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MenuItem.countDocuments(query);

    res.json({
      success: true,
      menuItems,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu items'
    });
  }
};

export const getMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await MenuItem.findById(id).populate('vendorId');

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      menuItem
    });
  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu item'
    });
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      currency,
      category,
      itemType,
      unit,
      stockQuantity,
      images,
      preparationTime,
      tags
    } = req.body;

    // Check if user owns the vendor
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) {
      return res.status(403).json({
        success: false,
        message: 'Vendor profile required to create menu items'
      });
    }

    const menuItem = await MenuItem.create({
      vendorId: vendor._id,
      name,
      description,
      price,
      currency: currency || 'USD',
      category,
      itemType,
      unit: itemType === 'grocery' ? unit : undefined,
      stockQuantity: itemType === 'grocery' ? stockQuantity || 0 : undefined,
      images: images || [],
      preparationTime,
      tags: tags || []
    });

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      menuItem
    });
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create menu item'
    });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if user owns the vendor that owns this menu item
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) {
      return res.status(403).json({
        success: false,
        message: 'Vendor profile required'
      });
    }

    const menuItem = await MenuItem.findOne({ _id: id, vendorId: vendor._id });
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found or access denied'
      });
    }

    const allowedUpdates = [
      'name', 'description', 'price', 'currency', 'category', 'itemType',
      'unit', 'stockQuantity', 'images', 'preparationTime', 'tags', 'isAvailable'
    ];

    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        menuItem[key] = updates[key];
      }
    });

    await menuItem.save();

    res.json({
      success: true,
      message: 'Menu item updated successfully',
      menuItem
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update menu item'
    });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user owns the vendor that owns this menu item
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) {
      return res.status(403).json({
        success: false,
        message: 'Vendor profile required'
      });
    }

    const menuItem = await MenuItem.findOneAndDelete({ 
      _id: id, 
      vendorId: vendor._id 
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found or access denied'
      });
    }

    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete menu item'
    });
  }
};