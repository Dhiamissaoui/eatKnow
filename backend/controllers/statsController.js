const Commande = require('../models/Commande');
const CommandeItem = require('../models/CommandeItem');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Plat = require('../models/Plat');

exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    
    // Ventes du jour, mois, année
    const ventesJour = await Commande.aggregate([
      { $match: { date: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    const ventesMois = await Commande.aggregate([
      { $match: { date: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    const ventesAnnee = await Commande.aggregate([
      { $match: { date: { $gte: startOfYear } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    // Nombre de commandes, clients, restaurants actifs
    const nombreCommandes = await Commande.countDocuments();
    const nombreClients = await User.countDocuments({ role: 'client' });
    const nombreRestaurantsActifs = await Restaurant.countDocuments({ is_active: true });
    
    // Top 5 plats les plus vendus
    const topPlats = await CommandeItem.aggregate([
      {
        $group: {
          _id: '$plat_id',
          quantiteTotale: { $sum: '$quantite' },
          revenuTotal: { $sum: '$sous_total' }
        }
      },
      { $sort: { quantiteTotale: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'plats',
          localField: '_id',
          foreignField: '_id',
          as: 'plat'
        }
      },
      { $unwind: '$plat' },
      {
        $project: {
          nom: '$plat.nom',
          quantiteTotale: 1,
          revenuTotal: 1
        }
      }
    ]);
    
    // Flop 5 plats les moins vendus
    const flopPlats = await CommandeItem.aggregate([
      {
        $group: {
          _id: '$plat_id',
          quantiteTotale: { $sum: '$quantite' }
        }
      },
      { $sort: { quantiteTotale: 1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'plats',
          localField: '_id',
          foreignField: '_id',
          as: 'plat'
        }
      },
      { $unwind: '$plat' },
      {
        $project: {
          nom: '$plat.nom',
          quantiteTotale: 1
        }
      }
    ]);
    
    // Répartition des ventes par restaurant
    const ventesParRestaurant = await Commande.aggregate([
      {
        $group: {
          _id: '$restaurant_id',
          totalVentes: { $sum: '$total' },
          nombreCommandes: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'restaurants',
          localField: '_id',
          foreignField: '_id',
          as: 'restaurant'
        }
      },
      { $unwind: '$restaurant' },
      {
        $project: {
          nom: '$restaurant.nom',
          totalVentes: 1,
          nombreCommandes: 1
        }
      },
      { $sort: { totalVentes: -1 } }
    ]);
    
    // Évolution du chiffre d'affaires (derniers 7 jours)
    const evolutionCA = await Commande.aggregate([
      {
        $match: {
          date: { $gte: new Date(today.setDate(today.getDate() - 7)) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          total: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        kpi: {
          ventes_jour: ventesJour[0]?.total || 0,
          ventes_mois: ventesMois[0]?.total || 0,
          ventes_annee: ventesAnnee[0]?.total || 0,
          nombre_commandes: nombreCommandes,
          nombre_clients: nombreClients,
          nombre_restaurants_actifs: nombreRestaurantsActifs
        },
        top_plats: topPlats,
        flop_plats: flopPlats,
        ventes_par_restaurant: ventesParRestaurant,
        evolution_ca: evolutionCA
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};