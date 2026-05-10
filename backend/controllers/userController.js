const User = require('../models/User');
const Commande = require('../models/Commande');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user orders
    const orders = await Commande.find({ user_id: req.params.id })
      .populate('restaurant_id', 'nom')
      .sort({ date: -1 });
    
    const total_depense = orders.reduce((sum, order) => sum + order.total, 0);
    const nombre_commandes = orders.length;
    
    res.json({ 
      success: true, 
      data: {
        ...user._doc,
        historique_achat: orders,
        total_depense,
        nombre_commandes
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};