import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function DetailResto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedCategory, setSelectedCategory] = useState('entrees');
  const [isVisible, setIsVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedItem, setAddedItem] = useState(null);
  const sectionRef = useRef(null);

  const restaurant = {
    id: id,
    name: 'Le Gourmet',
    categories: ['Africain', 'Européen'],
    rating: 4.6,
    reviewCount: 128,
    deliveryTime: '25-35 min',
    address: 'Avenue Lambin, Cocody, Abidjan',
    hours: '08:00 - 23:00',
    status: 'Ouvert',
    coverImage: '/images/restaurant-cover.jpg'
  };

  const menuItems = {
    entrees: [
      {
        id: 1,
        name: 'Poulet DG',
        description: 'Poulet sauté avec plantain, légumes et épices.',
        price: 4500,
        popularity: '⭐ Populaire',
        spicy: '🌶️ Moyen'
      },
      {
        id: 2,
        name: 'Attiéké Poisson',
        description: 'Attiéké servi avec poisson braisé et sauce.',
        price: 4000,
        popularity: '🔥 Très demandé',
        spicy: '🌿 Doux'
      },
      {
        id: 3,
        name: 'Yassa Poulet',
        description: 'Poulet mariné au citron et oignons.',
        price: 4000,
        popularity: '⭐ Populaire',
        spicy: '🌶️🌶️ Épicé'
      }
    ],
    plats: [
      {
        id: 4,
        name: 'Mafé Riz',
        description: 'Riz accompagné de sauce mafé au bœuf et légumes.',
        price: 5000,
        popularity: '🔥 Très demandé',
        spicy: '🌶️ Doux'
      },
      {
        id: 5,
        name: 'Kedjenou Poulet',
        description: 'Poulet mijoté avec légumes et épices locales.',
        price: 5500,
        popularity: '⭐ Populaire',
        spicy: '🌶️ Moyen'
      }
    ],
    desserts: [
      {
        id: 6,
        name: 'Tarte aux fruits',
        description: 'Tarte fraîche avec fruits de saison.',
        price: 2500,
        popularity: '🍰 Sucré',
        spicy: '🍬 Doux'
      },
      {
        id: 7,
        name: 'Glace Vanille',
        description: 'Glace artisanale à la vanille de Madagascar.',
        price: 1500,
        popularity: '❄️ Frais',
        spicy: '🍬 Doux'
      }
    ],
    boissons: [
      {
        id: 8,
        name: 'Jus de Bissap',
        description: 'Jus traditionnel à base de fleurs d\'hibiscus.',
        price: 1000,
        popularity: '🥤 Rafraîchissant',
        spicy: '🍹 Fruité'
      },
      {
        id: 9,
        name: 'Coca-Cola',
        description: '33cl - Bien frais.',
        price: 800,
        popularity: '🥤 Classique',
        spicy: '🥤 Pétillant'
      }
    ]
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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
    setAddedItem(item.id);
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
    setCartItems([]);
    setIsCartOpen(false);
    navigate('/Checkout');
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return stars;
  };

  const categories = [
    { id: 'entrees', label: 'Entrées', icon: '🍽️' },
    { id: 'plats', label: 'Plats', icon: '🍲' },
    { id: 'desserts', label: 'Desserts', icon: '🍰' },
    { id: 'boissons', label: 'Boissons', icon: '🥤' }
  ];

  const getCurrentMenuItems = () => {
    return menuItems[selectedCategory] || [];
  };

  return (
    <div ref={sectionRef} className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section avec image de fond et animation */}
      <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transform scale-105 animate-zoom-slow"
          style={{
            backgroundImage: `url(${restaurant.coverImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
        </div>

        {/* Bouton Retour avec animation */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2 transition-all duration-300 shadow-lg hover:scale-110 group"
        >
          <svg className="w-6 h-6 text-gray-800 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        {/* Bouton Favori */}
        <button 
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2 transition-all duration-300 shadow-lg hover:scale-110"
        >
          <svg 
            className={`w-6 h-6 transition-all duration-300 ${isFavorite ? 'text-red-500 fill-current scale-110' : 'text-gray-800'}`} 
            fill={isFavorite ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Informations du restaurant avec animation */}
        <div className={`absolute bottom-0 left-0 right-0 p-6 text-white transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-orange-500 px-2 py-1 rounded-lg text-xs font-semibold">🔥 Hot Deal</span>
              <span className="bg-green-500 px-2 py-1 rounded-lg text-xs font-semibold">✓ Certifié</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2 animate-slide-up">{restaurant.name}</h1>
            <p className="text-lg mb-3 opacity-90">{restaurant.categories.join(' • ')}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                {renderStars(restaurant.rating)}
                <span className="ml-1 font-semibold">{restaurant.rating}</span>
                <span className="ml-1 text-gray-300">({restaurant.reviewCount} avis)</span>
              </div>
              <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {restaurant.deliveryTime}
              </div>
              <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {restaurant.address.split(',')[0]}
              </div>
              <div className="flex items-center bg-green-500/80 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-300"></span>
                </span>
                {restaurant.status} • {restaurant.hours}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu du restaurant */}
      <div className="w-full relative z-10 -mt-6 bg-white rounded-t-3xl shadow-lg">
        {/* Onglets avec animation */}
        <div className="border-b border-gray-200 bg-white rounded-t-3xl sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-8 overflow-x-auto">
              {['menu', 'avis', 'infos'].map((tab, idx) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 font-semibold transition-all duration-300 relative ${
                    activeTab === tab
                      ? 'text-orange-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  style={{
                    animationDelay: `${idx * 0.1}s`,
                  }}
                >
                  <span className="flex items-center gap-2">
                    {tab === 'menu' && '📖'}
                    {tab === 'avis' && '⭐'}
                    {tab === 'infos' && 'ℹ️'}
                    {tab === 'menu' ? 'Menu' : tab === 'avis' ? 'Avis' : 'Infos'}
                  </span>
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-expand-width"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contenu Menu avec animations */}
        {activeTab === 'menu' && (
          <div className="w-full">
            {/* Catégories avec animation */}
            <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex gap-2 py-4 overflow-x-auto scrollbar-hide">
                  {categories.map((category, idx) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-5 py-2 rounded-full whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${
                        selectedCategory === category.id
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      style={{
                        animationDelay: `${idx * 0.05}s`,
                      }}
                    >
                      <span className="mr-1">{category.icon}</span>
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Liste des items avec animation */}
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="space-y-4">
                {getCurrentMenuItems().map((item, idx) => (
                  <div 
                    key={item.id} 
                    className={`bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 transform hover:-translate-y-1 ${
                      addedItem === item.id ? 'animate-pulse-green' : ''
                    }`}
                    style={{
                      animationDelay: `${idx * 0.1}s`,
                    }}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                            {item.popularity && (
                              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                                {item.popularity}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-500 mb-3">{item.description}</p>
                          {item.spicy && (
                            <p className="text-xs text-gray-400 mb-3">{item.spicy}</p>
                          )}
                          <div className="flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-orange-500">{item.price.toLocaleString()} FCFA</span>
                              {item.price > 4000 && (
                                <span className="text-xs line-through text-gray-400">5,000 FCFA</span>
                              )}
                            </div>
                            <button 
                              onClick={() => addToCart(item)}
                              className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-xl flex items-center gap-2"
                            >
                              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              Ajouter
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Progress bar animation */}
                    <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contenu Avis amélioré */}
        {activeTab === 'avis' && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
                <span className="text-3xl">⭐</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Avis des clients</h3>
              <p className="text-gray-500 mb-4">Soyez le premier à donner votre avis sur ce restaurant</p>
              <button className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-all transform hover:scale-105">
                Donner mon avis
              </button>
            </div>
          </div>
        )}

        {/* Contenu Infos amélioré */}
        {activeTab === 'infos' && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">🕐 Horaires d'ouverture</h3>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Lundi - Vendredi</span>
                    <span className="font-semibold">08:00 - 22:00</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Samedi</span>
                    <span className="font-semibold">09:00 - 23:00</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Dimanche</span>
                    <span className="font-semibold text-orange-500">10:00 - 21:00</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">✅ Informations supplémentaires</h3>
                <div className="space-y-3">
                  <p className="flex items-center gap-2">✓ Livraison gratuite à partir de 10 000 FCFA</p>
                  <p className="flex items-center gap-2">✓ Paiement en ligne accepté</p>
                  <p className="flex items-center gap-2">✓ Cuisine authentique africaine et européenne</p>
                  <p className="flex items-center gap-2">✓ Parking gratuit disponible</p>
                  <p className="flex items-center gap-2">✓ WiFi gratuit</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Panier coulissant avec animations */}
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
                <div key={item.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 animate-slide-in-right">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
                      <p className="text-orange-500 font-medium mt-1">
                        {item.price.toLocaleString()} FCFA
                      </p>
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
                      >
                        −
                      </button>
                      <span className="font-semibold text-gray-700 w-8 text-center text-lg">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all flex items-center justify-center font-bold hover:scale-110"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-semibold text-gray-800 text-lg">
                      {(item.price * item.quantity).toLocaleString()} FCFA
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t shadow-lg animate-slide-up">
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

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes zoomSlow {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.05);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes expandWidth {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes pulseGreen {
          0%, 100% {
            background-color: white;
          }
          50% {
            background-color: #dcfce7;
          }
        }
        
        .animate-zoom-slow {
          animation: zoomSlow 20s ease-out infinite alternate;
        }
        
        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.4s ease-out;
        }
        
        .animate-expand-width {
          animation: expandWidth 0.3s ease-out;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-pulse-green {
          animation: pulseGreen 0.5s ease-out;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default DetailResto;