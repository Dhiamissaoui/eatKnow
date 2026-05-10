import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function CatPage() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const categories = [
    { name: 'Pizza', emoji: '🍕', items: '128 plats', color: 'from-red-500 to-orange-500', bgColor: 'bg-red-50', link: '/categorie/pizza' },
    { name: 'Burgers', emoji: '🍔', items: '96 plats', color: 'from-orange-500 to-yellow-500', bgColor: 'bg-orange-50', link: '/categorie/burgers' },
    { name: 'Africain', emoji: '🦁', items: '64 plats', color: 'from-yellow-600 to-orange-600', bgColor: 'bg-yellow-50', link: '/categorie/africain' },
    { name: 'Asiatique', emoji: '🥢', items: '156 plats', color: 'from-green-500 to-teal-500', bgColor: 'bg-green-50', link: '/categorie/asiatique' },
    { name: 'Salades', emoji: '🥗', items: '48 plats', color: 'from-green-600 to-emerald-500', bgColor: 'bg-emerald-50', link: '/categorie/salades' },
    { name: 'Desserts', emoji: '🍰', items: '87 plats', color: 'from-pink-500 to-rose-500', bgColor: 'bg-pink-50', link: '/categorie/desserts' },
    { name: 'Boissons', emoji: '🥤', items: '112 plats', color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50', link: '/categorie/boissons' },
    { name: 'Tacos', emoji: '🌮', items: '73 plats', color: 'from-amber-500 to-orange-500', bgColor: 'bg-amber-50', link: '/categorie/tacos' },
    { name: 'Sandwichs', emoji: '🥪', items: '89 plats', color: 'from-lime-500 to-green-500', bgColor: 'bg-lime-50', link: '/categorie/sandwichs' },
    { name: 'Petit-déjeuner', emoji: '🍳', items: '56 plats', color: 'from-yellow-400 to-orange-400', bgColor: 'bg-yellow-50', link: '/categorie/petit-dejeuner' },
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

  return (
    <div ref={sectionRef} className="py-20 bg-gradient-to-br from-orange-50 via-white to-orange-100 overflow-hidden relative">
      {/* Background animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-400 rounded-full animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 5}s`,
              opacity: 0.3 + Math.random() * 0.3,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header avec animation */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {/* Badge */}
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-2 animate-pulse-slow">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Découvrez nos catégories
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Catégories{' '}
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 bg-clip-text text-transparent animate-gradient">
              Populaires
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explorez nos différentes catégories et trouvez votre bonheur parmi des centaines de plats délicieux
          </p>
          
          {/* Animated underline */}
          <div className="relative inline-block mt-4">
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-expand-width"></div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category, idx) => (
            <Link
              key={idx}
              to={category.link}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`group relative bg-white rounded-2xl p-6 text-center cursor-pointer transition-all duration-500 hover:shadow-2xl border border-white/50 ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{
                animationDelay: `${idx * 0.05}s`,
                animationFillMode: 'forwards',
                transform: hoveredIndex === idx ? 'translateY(-8px)' : 'translateY(0)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            >
              {/* Background gradient effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${category.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              {/* Icon avec animation */}
              <div className="relative z-10">
                <div className="text-6xl mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 inline-block">
                  {category.emoji}
                </div>
                
                {/* Nombre d'items en badge */}
                <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                  {category.items.split(' ')[0]}
                </div>
                
                {/* Nom */}
                <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-orange-500 transition-colors">
                  {category.name}
                </h3>
                
                {/* Item Count */}
                <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                  {category.items}
                </p>
              </div>
              
              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-orange-300 transition-all duration-300 pointer-events-none"></div>
              
              {/* Animated shine effect */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="absolute inset-0 transform translate-x-full group-hover:translate-x-0 transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats Section */}
        <div className={`mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-1000 delay-500 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="text-center group cursor-pointer">
            <div className="text-4xl font-bold text-orange-500 group-hover:scale-110 transition-transform inline-block">500+</div>
            <div className="text-gray-600 mt-2">Plats disponibles</div>
          </div>
          <div className="text-center group cursor-pointer">
            <div className="text-4xl font-bold text-orange-500 group-hover:scale-110 transition-transform inline-block">50+</div>
            <div className="text-gray-600 mt-2">Restaurants partenaires</div>
          </div>
          <div className="text-center group cursor-pointer">
            <div className="text-4xl font-bold text-orange-500 group-hover:scale-110 transition-transform inline-block">30min</div>
            <div className="text-gray-600 mt-2">Livraison rapide</div>
          </div>
          <div className="text-center group cursor-pointer">
            <div className="text-4xl font-bold text-orange-500 group-hover:scale-110 transition-transform inline-block">10000+</div>
            <div className="text-gray-600 mt-2">Clients satisfaits</div>
          </div>
        </div>

        
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
        
        @keyframes expandWidth {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: 100%;
            opacity: 1;
          }
        }
        
        @keyframes floatParticle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100px) translateX(50px);
            opacity: 0;
          }
        }
        
        @keyframes pulseSlow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-expand-width {
          animation: expandWidth 0.8s ease-out;
        }
        
        .animate-float-particle {
          animation: floatParticle 4s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulseSlow 2s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default CatPage;