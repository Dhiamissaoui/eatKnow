import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantById } from '../../../redux/Actions/restaurantActions';
import { fetchPlats } from '../../../redux/Actions/platActions';

function DetailResto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedItem, setAddedItem] = useState(null);
  const sectionRef = useRef(null);

  const { selected: restaurant, loading: restaurantLoading, error: restaurantError } = useSelector(state => state.restaurants);
  const { list: plats, loading: platsLoading } = useSelector(state => state.plats);

  // Reset selectedCategory when restaurant changes
  useEffect(() => {
    setSelectedCategory('');
  }, [id]);

  useEffect(() => {
    if (id) {
      dispatch(fetchRestaurantById(id));
      dispatch(fetchPlats({ restaurant_id: id }));
    }
  }, [dispatch, id]);

  // Organize plats by category
  const groupedPlats = (plats || []).reduce((acc, plat) => {
    const category = plat.categorie || 'Plats';
    if (!acc[category]) acc[category] = [];
    acc[category].push(plat);
    return acc;
  }, {});

  const categories = Object.keys(groupedPlats).map(cat => ({
    id: cat,
    label: cat,
    icon: cat === 'Entrées' ? '🍽️' : cat === 'Plats' ? '🍲' : cat === 'Desserts' ? '🍰' : cat === 'Boissons' ? '🥤' : '📋',
    count: groupedPlats[cat].length
  }));

  // ✅ FIX 1: removed selectedCategory from deps so it sets on first load correctly
useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories.length,categories,selectedCategory]);

  // ✅ FIX 2: show all plats if no category selected yet (fallback)
  const getCurrentMenuItems = () => {
    if (!selectedCategory) return plats || [];
    return groupedPlats[selectedCategory] || [];
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item._id);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { 
        id: item._id, 
        name: item.nom, 
        price: item.prix, 
        quantity: 1,
        image: item.image 
      }];
    });
    setAddedItem(item._id);
    setTimeout(() => setAddedItem(null), 1000);
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 0 ? 1000 : 0;
    return { subtotal, deliveryFee, total: subtotal + deliveryFee };
  };

  const { subtotal, deliveryFee, total } = getTotalPrice();

  const handleValidateOrder = () => {
    localStorage.setItem('checkoutCart', JSON.stringify(cartItems));
    localStorage.setItem('checkoutTotal', total.toString());
    localStorage.setItem('checkoutRestaurant', JSON.stringify({
      id: restaurant?._id,
      name: restaurant?.nom,
      deliveryTime: restaurant?.temps_livraison_estime
    }));
    setCartItems([]);
    setIsCartOpen(false);
    navigate('/Checkout');
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    for (let i = 0; i < fullStars; i++) stars.push(<span key={i} className="text-yellow-400">★</span>);
    for (let i = stars.length; i < 5; i++) stars.push(<span key={i} className="text-gray-300">★</span>);
    return stars;
  };

  if (restaurantLoading || platsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Chargement du menu...</p>
        </div>
      </div>
    );
  }

  if (restaurantError || !restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600 text-lg mb-2">Restaurant non trouvé</p>
          <button onClick={() => navigate('/ListResto')} className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
            Retour aux restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[350px] w-full overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
        </div>

        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2 transition-all duration-300 shadow-lg hover:scale-110"
        >
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <button 
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2 transition-all duration-300 shadow-lg hover:scale-110"
        >
          <svg 
            className={`w-6 h-6 transition-all duration-300 ${isFavorite ? 'text-red-500 fill-current scale-110' : 'text-gray-800'}`} 
            fill={isFavorite ? 'currentColor' : 'none'} 
            stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        <div className={`absolute bottom-0 left-0 right-0 p-6 text-white transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {restaurant.is_active ? (
                <span className="bg-green-500 px-2 py-1 rounded-lg text-xs font-semibold">✓ Ouvert</span>
              ) : (
                <span className="bg-red-500 px-2 py-1 rounded-lg text-xs font-semibold">✗ Fermé</span>
              )}
              <span className="bg-orange-500 px-2 py-1 rounded-lg text-xs font-semibold">⭐ {restaurant.note_moyenne?.toFixed(1) || 'Nouveau'}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.nom}</h1>
            <p className="text-md mb-3 opacity-90">{restaurant.type_cuisine}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                {renderStars(restaurant.note_moyenne || 0)}
                <span className="ml-1 font-semibold">{restaurant.note_moyenne?.toFixed(1) || 'Nouveau'}</span>
              </div>
              <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {restaurant.temps_livraison_estime || 30} min
              </div>
              <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {restaurant.adresse?.split(',')[0] || restaurant.adresse}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="w-full relative z-10 -mt-6 bg-white rounded-t-3xl shadow-lg">
        <div className="w-full">
          {/* Cart Button */}
          <div className="sticky top-0 z-20 bg-white border-b border-gray-200 rounded-t-3xl">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between items-center py-3">
                <h2 className="text-xl font-bold text-gray-800">Notre Menu</h2>
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="relative bg-orange-500 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-orange-600 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 21v-8" />
                  </svg>
                  Panier
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Categories + Plats */}
          {categories.length > 0 ? (
            <>
              <div className="bg-white border-b border-gray-200 sticky top-[60px] z-10">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="flex gap-2 py-4 overflow-x-auto scrollbar-hide">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-5 py-2 rounded-full whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${
                          selectedCategory === category.id
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span className="mr-1">{category.icon}</span>
                        {category.label}
                        <span className="ml-1 text-xs opacity-75">({category.count})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="max-w-7xl mx-auto px-4 py-8">
                {getCurrentMenuItems().length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getCurrentMenuItems().map((item) => (
                      <div 
                        key={item._id} 
                        className={`bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:-translate-y-1 ${
                          addedItem === item._id ? 'animate-pulse-green' : ''
                        }`}
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} 
                            alt={item.nom}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                            <span className="text-orange-500 font-bold text-lg">{item.prix.toLocaleString()} FCFA</span>
                          </div>
                          {item.is_available === false && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">Indisponible</span>
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{item.nom}</h3>
                          <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                            {item.description || 'Découvrez ce délicieux plat préparé avec soin.'}
                          </p>
                          <button 
                            onClick={() => addToCart(item)}
                            disabled={item.is_available === false}
                            className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                              item.is_available === false 
                                ? 'bg-gray-300 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white hover:scale-105 shadow-md'
                            }`}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Ajouter au panier
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-gray-500 text-lg">Aucun plat dans cette catégorie</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-gray-500 text-lg">Aucun plat disponible</p>
              <p className="text-gray-400 text-sm mt-2">Ce restaurant n'a pas encore de plats</p>
            </div>
          )}
        </div>
      </div>

      {/* Panier coulissant */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-all duration-500 animate-fade-in"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-all duration-500 ease-out ${
        isCartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span>🛒</span> Votre Panier
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="text-white hover:text-gray-200 transition-colors hover:rotate-90 transform duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6" style={{ height: 'calc(100% - 280px)' }}>
          {cartItems.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 21v-8" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">Votre panier est vide</p>
              <p className="text-gray-400 text-sm mt-2">Ajoutez des plats pour commencer</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
                      <p className="text-orange-500 font-medium mt-1">{item.price.toLocaleString()} FCFA</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-600 transition-colors hover:scale-110 transform duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition-all flex items-center justify-center font-bold hover:scale-110"
                      >−</button>
                      <span className="font-semibold text-gray-700 w-8 text-center text-lg">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all flex items-center justify-center font-bold hover:scale-110"
                      >+</button>
                    </div>
                    <p className="font-semibold text-gray-800 text-lg">{(item.price * item.quantity).toLocaleString()} FCFA</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t shadow-lg">
            <div className="p-6">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span className="font-medium">{subtotal.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Frais de livraison</span>
                  <span className="font-medium">{deliveryFee.toLocaleString()} FCFA</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-gray-800">Total</span>
                    <span className="text-orange-500">{total.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleValidateOrder}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg group"
              >
                <span className="flex items-center justify-center gap-2">
                  Valider la commande
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulseGreen {
          0%, 100% { background-color: white; }
          50% { background-color: #dcfce7; }
        }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-pulse-green { animation: pulseGreen 0.5s ease-out; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default DetailResto;