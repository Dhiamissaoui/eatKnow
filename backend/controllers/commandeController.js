const Commande = require('../models/Commande');
const CommandeItem = require('../models/CommandeItem');
const Plat = require('../models/Plat');

// Create order (client)
exports.createCommande = async (req, res) => {
  try {
    const { restaurant_id, items, adresse_livraison, mode_paiement } = req.body;
    const user_id = req.user.id;
    
    let total = 0;
    const commandeItems = [];
    
    // Calculate total and create items
    for (const item of items) {
      const plat = await Plat.findById(item.plat_id);
      if (!plat) {
        return res.status(404).json({ message: `Plat ${item.plat_id} not found` });
      }
      
      const sous_total = plat.prix * item.quantite;
      total += sous_total;
      
      commandeItems.push({
        plat_id: item.plat_id,
        quantite: item.quantite,
        prix_unitaire: plat.prix,
        sous_total: sous_total
      });
    }
    
    // Create order
    const commande = new Commande({
      user_id,
      restaurant_id,
      date: new Date(),
      total,
      adresse_livraison,
      mode_paiement,
      statut_livraison: 'en_attente'
    });
    
    await commande.save();
    
    // Create order items
    for (const item of commandeItems) {
      const commandeItem = new CommandeItem({
        commande_id: commande._id,
        ...item
      });
      await commandeItem.save();
    }
    
    res.status(201).json({ 
      success: true, 
      data: commande,
      message: 'Order created successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (admin) or user orders (client)
exports.getAllCommandes = async (req, res) => {
  try {
    const { statut, restaurant_id, date } = req.query;
    let query = {};
    
    // If not admin, only show user's orders
    if (req.user.role !== 'admin') {
      query.user_id = req.user.id;
    }
    
    if (statut) query.statut_livraison = statut;
    if (restaurant_id) query.restaurant_id = restaurant_id;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }
    
    const commandes = await Commande.find(query)
      .populate('user_id', 'nom email')
      .populate('restaurant_id', 'nom')
      .sort({ date: -1 });
    
    res.json({ success: true, data: commandes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order with items
exports.getCommandeById = async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id)
      .populate('user_id', 'nom email telephone')
      .populate('restaurant_id', 'nom adresse');
    
    if (!commande) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check permission
    if (req.user.role !== 'admin' && commande.user_id._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const items = await CommandeItem.find({ commande_id: req.params.id })
      .populate('plat_id', 'nom image prix');
    
    res.json({ 
      success: true, 
      data: { ...commande._doc, items } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (admin only)
exports.updateCommandeStatus = async (req, res) => {
  try {
    const { statut } = req.body;
    const commande = await Commande.findByIdAndUpdate(
      req.params.id,
      { statut_livraison: statut },
      { new: true }
    );
    
    if (!commande) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ 
      success: true, 
      data: commande,
      message: 'Order status updated'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};