const Plat = require('../models/Plat');

exports.getAllPlats = async (req, res) => {
  try {
    const { restaurant_id, categorie } = req.query;
    let query = {};
    
    if (restaurant_id) {
      query.restaurant_id = restaurant_id;
    }
    
    if (categorie) {
      query.categorie = categorie;
    }
    
    const plats = await Plat.find(query).populate('restaurant_id', 'nom');
    res.json({ success: true, data: plats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPlatById = async (req, res) => {
  try {
    const plat = await Plat.findById(req.params.id).populate('restaurant_id', 'nom');
    if (!plat) {
      return res.status(404).json({ message: 'Plat not found' });
    }
    res.json({ success: true, data: plat });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPlat = async (req, res) => {
  try {
    const plat = new Plat(req.body);
    await plat.save();
    res.status(201).json({ success: true, data: plat });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePlat = async (req, res) => {
  try {
    const plat = await Plat.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!plat) {
      return res.status(404).json({ message: 'Plat not found' });
    }
    res.json({ success: true, data: plat });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePlat = async (req, res) => {
  try {
    const plat = await Plat.findByIdAndDelete(req.params.id);
    if (!plat) {
      return res.status(404).json({ message: 'Plat not found' });
    }
    res.json({ success: true, message: 'Plat deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};