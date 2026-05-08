import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function RestoList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const sectionRef = useRef(null);

  const categories = ['Toutes', 'Africain', 'Européen', 'Asiatique', 'Fast Food', 'Desserts', 'Pizzas', 'Burgers'];

  const restaurants = [
    {
      id: 1,
      name: 'Le Gourmet',
      categories: ['Africain', 'Européen'],
      rating: 4.6,
      deliveryTime: '25-35 min',
      priceRange: 'DT',
      image: '/images/resto1.jpg',
      promo: '-20%'
    },
    {
      id: 2,
      name: 'Pizza House',
      categories: ['Italien', 'Pizza'],
      rating: 4.3,
      deliveryTime: '20-30 min',
      priceRange: 'DT',
      image: '/images/resto2.jpg',
      promo: null
    },
    {
      id: 3,
      name: "Délice d'Asie",
      categories: ['Asiatique'],
      rating: 4.7,
      deliveryTime: '30-40 min',
      priceRange: 'DT',
      image: '/images/resto3.jpg',
      promo: '-15%'
    },
    {
      id: 4,
      name: 'Burger King',
      categories: ['Fast Food', 'Burgers'],
      rating: 4.2,
      deliveryTime: '15-25 min',
      priceRange: 'DT',
      image: '/images/resto4.jpg',
      promo: null
    },
    {
      id: 5,
      name: 'Chez Fatou',
      categories: ['Africain'],
      rating: 4.5,
      deliveryTime: '30-40 min',
      priceRange: 'DT',
      image: '/images/resto5.jpg',
      promo: '-10%'
    },
    {
      id: 6,
      name: 'Sweet Cake',
      categories: ['Desserts'],
      rating: 4.8,
      deliveryTime: '20-30 min',
      priceRange: 'DT',
      image: '/images/resto6.jpg',
      promo: null
    },
    {
      id: 7,
      name: 'El Mediterranean',
      categories: ['Européen', 'Méditerranéen'],
      rating: 4.4,
      deliveryTime: '25-35 min',
      priceRange: 'DT',
      image: '/images/resto7.jpg',
      promo: null
    },
    {
      id: 8,
      name: 'Taj Mahal',
      categories: ['Asiatique', 'Indien'],
      rating: 4.5,
      deliveryTime: '30-40 min',
      priceRange: 'DT',
      image: '/images/resto8.jpg',
      promo: '-25%'
    },
    {
      id: 9,
      name: 'Le Parisien',
      categories: ['Européen', 'Français'],
      rating: 4.9,
      deliveryTime: '20-30 min',
      priceRange: 'DT',
      image: '/images/resto9.jpg',
      promo: null
    }
  ];

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

  const filteredRestaurants = restaurants.filter(resto => {
    const matchesSearch = resto.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Toutes' || resto.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">½</span>);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={i} className="text-gray-300">★</span>);
    }
    return stars;
  };

  return (
    <div ref={sectionRef} className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 py-8">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-400 rounded-full animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 5}s`,
              opacity: 0.2 + Math.random() * 0.3,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header avec animation */}
        <div className={`text-center mb-12 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="inline-block mb-4">
           
              
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Découvrez nos{' '}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Restaurants
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Trouvez le restaurant parfait près de chez vous et profitez de nos offres exclusives
          </p>
        </div>
        
        {/* Barre de recherche animée */}
        <div className={`mb-8 transition-all duration-700 delay-200 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Rechercher un restaurant par nom ou par spécialité..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pl-14 pr-4 text-gray-700 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-orange-500 focus:shadow-lg transition-all duration-300"
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Filtres par catégorie avec animation */}
        <div className={`flex flex-wrap gap-3 mb-12 justify-center transition-all duration-700 delay-400 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {categories.map((category, idx) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-md border border-gray-200'
              }`}
              style={{
                animationDelay: `${idx * 0.05}s`,
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Liste des restaurants */}
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map((restaurant, idx) => (
              <Link
                key={restaurant.id}
                to={`/DetailResto/${restaurant.id}`}
                onMouseEnter={() => setHoveredCard(restaurant.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{
                  animationDelay: `${idx * 0.1}s`,
                  animationFillMode: 'forwards'
                }}
              >
                {/* Image Section */}
                <div className="relative h-52 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                    <span className="text-white text-2xl font-bold">{restaurant.name}</span>
                  </div>
                  
                  {/* Promo Badge */}
                  {restaurant.promo && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold animate-pulse">
                      {restaurant.promo}
                    </div>
                  )}
                  
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-md">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-semibold text-sm">{restaurant.rating}</span>
                  </div>
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                {/* Content Section */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-orange-500 transition-colors">
                      {restaurant.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">{restaurant.priceRange}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-500 text-sm mb-3">
                    {restaurant.categories.join(' • ')}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        {renderStars(restaurant.rating)}
                      </div>
                      <span className="text-gray-600 text-sm ml-1">({restaurant.rating})</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded-full">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {restaurant.deliveryTime}
                    </div>
                  </div>
                  
                  {/* Animated border on hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-gray-500 text-xl mb-2">Aucun restaurant trouvé</p>
            <p className="text-gray-400">Essayez de modifier vos critères de recherche</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Toutes');
              }}
              className="mt-4 text-orange-500 hover:text-orange-600 font-semibold"
            >
              Réinitialiser les filtres →
            </button>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes floatParticle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-100px) translateX(50px);
            opacity: 0;
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
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-float-particle {
          animation: floatParticle 4s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default RestoList;