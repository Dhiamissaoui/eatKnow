import MainImage from "../../../images/LastLogo.png";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Main() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Calcul pour l'effet de parallaxe
  const parallaxOffset = scrollY * 0.5;
  const rotateX = (mousePosition.y / window.innerHeight - 0.5) * 10;
  const rotateY = (mousePosition.x / window.innerWidth - 0.5) * 10;

  return (
    <div className="relative bg-gradient-to-br from-orange-50 via-white to-orange-100 overflow-hidden min-h-screen">
      
      {/* Particules animées */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-orange-400 rounded-full opacity-60 animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
            }}
          />
        ))}
      </div>

      {/* Effet de mouse follower */}
      <div 
        className="fixed w-32 h-32 bg-orange-400 rounded-full filter blur-3xl opacity-20 pointer-events-none transition-transform duration-300 ease-out z-0"
        style={{
          transform: `translate(${mousePosition.x - 64}px, ${mousePosition.y - 64}px)`,
        }}
      />

      {/* Background effects avec animation */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full filter blur-3xl opacity-30 animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-200 rounded-full filter blur-3xl opacity-30 animate-pulse-slow animation-delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-300 rounded-full filter blur-3xl opacity-10 animate-spin-slow"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Text Content avec animations au scroll */}
          <div 
            className="flex-1 text-center lg:text-left animate-slide-up"
            style={{
              transform: `translateY(${Math.max(0, parallaxOffset * 0.3)}px)`,
              opacity: Math.max(0, 1 - scrollY / 500)
            }}
          >
            {/* Badge animé */}
            <div className="inline-block mb-6 animate-slide-down">
              <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                </span>
                🍕 Livraison gratuite
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight animate-slide-right">
              Vos plats préférés,{' '}
              <span className="text-orange-500 relative inline-block group">
                livrés chez vous
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-orange-300 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 animate-slide-left">
              Découvrez les meilleurs restaurants et faites-vous livrer en un clic.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up">
              <Link 
                to="/ListResto"
                className="group bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl inline-flex items-center gap-2"
              >
                <span>Commander maintenant</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
              <button className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-8 rounded-full transition-all duration-300 border border-gray-300 shadow-md hover:shadow-lg hover:scale-105 group">
                En savoir plus
                <span className="inline-block ml-1 group-hover:ml-2 transition-all duration-300">→</span>
              </button>
            </div>
            
            {/* Statistiques */}
            <div className="flex gap-8 justify-center lg:justify-start mt-12 pt-8 border-t border-gray-200">
              <div className="text-center animate-fade-in-stagger-1">
                <div className="text-3xl font-bold text-orange-500">50+</div>
                <div className="text-sm text-gray-500">Restaurants</div>
              </div>
              <div className="text-center animate-fade-in-stagger-2">
                <div className="text-3xl font-bold text-orange-500">1000+</div>
                <div className="text-sm text-gray-500">Clients satisfaits</div>
              </div>
              <div className="text-center animate-fade-in-stagger-3">
                <div className="text-3xl font-bold text-orange-500">30min</div>
                <div className="text-sm text-gray-500">Livraison rapide</div>
              </div>
            </div>
          </div>

          {/* Animated Image Section avec effet 3D */}
          <div 
            className="flex-1 flex justify-center perspective-1000"
            style={{
              transform: `translateY(${parallaxOffset * 0.5}px)`,
            }}
          >
            <div 
              className="relative group"
              style={{
                transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              {/* Rotating rings */}
              <div className="absolute inset-0 rounded-full border-4 border-orange-300 opacity-50 animate-ping-slow"></div>
              <div className="absolute inset-0 rounded-full border-4 border-orange-400 opacity-50 animate-pulse-slow"></div>
              <div className="absolute inset-0 rounded-full border-2 border-orange-200 animate-spin-slow"></div>
              
              {/* Main Image with floating animation */}
              <div className="relative rounded-full overflow-hidden shadow-2xl">
                <img 
                  src={MainImage}
                  alt="Food Delivery"
                  className="relative w-80 h-80 md:w-96 md:h-96 object-contain animate-float"
                  style={{
                    filter: 'drop-shadow(0 20px 15px rgba(0,0,0,0.15))'
                  }}
                />
              </div>
              
              {/* Floating labels */}
              <div className="absolute -top-4 -right-4 bg-white rounded-full px-3 py-1 shadow-lg animate-bounce-slow">
                <span className="text-orange-500 text-sm font-semibold">⭐ 4.8</span>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-green-500 rounded-full px-3 py-1 shadow-lg animate-pulse">
                <span className="text-white text-sm font-semibold">-20%</span>
              </div>
              
              {/* Floating food items */}
              <div className="absolute -top-8 -left-8 animate-float-delayed">
                <div className="bg-white rounded-full p-2 shadow-lg">
                  <span className="text-2xl">🍔</span>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 animate-float-delayed-2">
                <div className="bg-white rounded-full p-2 shadow-lg">
                  <span className="text-2xl">🍕</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-right {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slide-left {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fade-in-stagger {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes ping-slow {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes particle {
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
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
        }
        
        .animate-float-delayed-2 {
          animation: float-delayed 3.5s ease-in-out infinite reverse;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.8s ease-out;
        }
        
        .animate-slide-right {
          animation: slide-right 0.8s ease-out;
        }
        
        .animate-slide-left {
          animation: slide-left 0.8s ease-out;
        }
        
        .animate-fade-in-stagger-1 {
          animation: fade-in-stagger 0.6s ease-out 0.2s both;
        }
        
        .animate-fade-in-stagger-2 {
          animation: fade-in-stagger 0.6s ease-out 0.4s both;
        }
        
        .animate-fade-in-stagger-3 {
          animation: fade-in-stagger 0.6s ease-out 0.6s both;
        }
        
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-particle {
          animation: particle 4s ease-in-out infinite;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}

export default Main;