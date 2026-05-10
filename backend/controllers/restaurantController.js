const Restaurant = require('../models/Restaurant');
const Plat = require('../models/Plat');

exports.getAllRestaurants = async (req, res) => {
  try {
    const { type_cuisine, search, min_note } = req.query;
    let query = { is_active: true };
    
    if (type_cuisine) {
      query.type_cuisine = type_cuisine;
    }
    
    if (search) {
      query.nom = { $regex: search, $options: 'i' };
    }
    
    if (min_note) {
      query.note_moyenne = { $gte: parseFloat(min_note) };
    }
    
    const restaurants = await Restaurant.find(query).sort({ note_moyenne: -1 });
    res.json({ success: true, data: restaurants });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    // Get plats for this restaurant
    const plats = await Plat.find({ 
      restaurant_id: req.params.id, 
      is_available: true 
    });
    
    res.json({ 
      success: true, 
      data: { ...restaurant._doc, plats } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createRestaurant = async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json({ success: true, message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};