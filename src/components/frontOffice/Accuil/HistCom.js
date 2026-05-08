import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function HistCom() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [visibleCount, setVisibleCount] = useState(4);
  const sectionRef = useRef(null);

  const commandes = [
    {
      id: "#1234",
      restaurant: "Le Gourmet",
      date: "12 Mai 2024",
      montant: "15 500 FCFA",
      statut: "Livrée",
      statutColor: "text-green-600",
      statutBg: "bg-green-100",
      icon: "✅",
      items: 3,
      time: "19:30"
    },
    {
      id: "#1233",
      restaurant: "Pizza House",
      date: "10 Mai 2024",
      montant: "8 000 FCFA",
      statut: "Livrée",
      statutColor: "text-green-600",
      statutBg: "bg-green-100",
      icon: "✅",
      items: 2,
      time: "20:15"
    },
    {
      id: "#1232",
      restaurant: "Délice d'Asie",
      date: "08 Mai 2024",
      montant: "12 000 FCFA",
      statut: "En livraison",
      statutColor: "text-orange-500",
      statutBg: "bg-orange-100",
      icon: "🚚",
      items: 4,
      time: "18:45"
    },
    {
      id: "#1231",
      restaurant: "Burger King",
      date: "05 Mai 2024",
      montant: "6 500 FCFA",
      statut: "Annulée",
      statutColor: "text-red-500",
      statutBg: "bg-red-100",
      icon: "❌",
      items: 2,
      time: "21:00"
    },
    {
      id: "#1230",
      restaurant: "Sushi Shop",
      date: "01 Mai 2024",
      montant: "22 000 FCFA",
      statut: "Livrée",
      statutColor: "text-green-600",
      statutBg: "bg-green-100",
      icon: "✅",
      items: 5,
      time: "20:30"
    },
    {
      id: "#1229",
      restaurant: "McDonald's",
      date: "28 Avr 2024",
      montant: "9 500 FCFA",
      statut: "Livrée",
      statutColor: "text-green-600",
      statutBg: "bg-green-100",
      icon: "✅",
      items: 3,
      time: "13:15"
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

  const getStatutAnimation = (statut) => {
    if (statut === "En livraison") return "animate-pulse";
    return "";
  };

  const loadMore = () => {
    setVisibleCount(prev => prev + 2);
  };

  const displayedCommandes = commandes.slice(0, visibleCount);
  const hasMore = visibleCount < commandes.length;

  return (
    <div ref={sectionRef} className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-400 rounded-full animate-float-particle"
            style={{
              left: `${Math.random()  * 100}%`,
              top: `${Math.random()  * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 5}s`,
              opacity: 0.2 + Math.random() * 0.3,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Bouton Retour à la page principale */}
        <div className={`mb-6 transition-all duration-700 transform ${
          isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
        }`}>
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-xl text-gray-700 hover:border-orange-500 hover:text-orange-500 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Retour à l'accueil</span>
          </button>
        </div>

        {/* Header avec animation */}
        <div className={`text-center mb-10 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Historique
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Mes{' '}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Commandes
            </span>
          </h1>
          <p className="text-gray-600 text-lg">Retrouvez l'historique de toutes vos commandes</p>
        </div>

        {/* Stats Cards */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 transition-all duration-700 delay-200 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="bg-white rounded-2xl p-4 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-3xl mb-2">📦</div>
            <div className="text-2xl font-bold text-gray-800">{commandes.length}</div>
            <div className="text-sm text-gray-500">Total commandes</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-600">
              {commandes.filter(c => c.statut === "Livrée").length}
            </div>
            <div className="text-sm text-gray-500">Livrées</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-3xl mb-2">🚚</div>
            <div className="text-2xl font-bold text-orange-500">
              {commandes.filter(c => c.statut === "En livraison").length}
            </div>
            <div className="text-sm text-gray-500">En cours</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-gray-800">
              {commandes.reduce((sum, c) => sum + parseInt(c.montant.replace(/[^\d]/g, '')), 0).toLocaleString()} FCFA
            </div>
            <div className="text-sm text-gray-500">Total dépensé</div>
          </div>
        </div>

        {/* Liste des commandes */}
        <div className="space-y-4">
          {displayedCommandes.map((commande, idx) => (
            <div
              key={commande.id}
              onMouseEnter={() => setHoveredCard(commande.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-500 transform ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              } ${hoveredCard === commande.id ? 'shadow-2xl -translate-y-1' : ''}`}
              style={{
                transitionDelay: `${idx * 0.1}s`,
                transitionProperty: 'all'
              }}
            >
              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  {/* Left side - Commande info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-xl">
                        {commande.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {commande.restaurant}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {commande.date} • {commande.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="text-gray-500">Commande {commande.id}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500">{commande.items} articles</span>
                    </div>
                  </div>

                  {/* Center - Montant */}
                  <div className="text-left sm:text-center">
                    <p className="text-xs text-gray-500 mb-1">Montant total</p>
                    <p className="text-xl font-bold text-gray-800">{commande.montant}</p>
                  </div>

                  {/* Right side - Statut */}
                  <div className="flex flex-col items-start sm:items-end gap-2">
                    <div className={`px-3 py-1 rounded-full ${commande.statutBg} flex items-center gap-1 ${getStatutAnimation(commande.statut)}`}>
                      <span className="text-sm">{commande.icon}</span>
                      <span className={`text-sm font-semibold ${commande.statutColor}`}>
                        {commande.statut}
                      </span>
                    </div>
                    
                    {/* Action buttons - only show on hover */}
                    {hoveredCard === commande.id && (
                      <button className="text-xs text-orange-500 hover:text-orange-600 font-medium transition-all duration-300 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Commander à nouveau
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar for delivery */}
                {commande.statut === "En livraison" && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Commande confirmée</span>
                      <span>Préparation</span>
                      <span>En livraison</span>
                      <span>Livrée</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full animate-progress"
                        style={{ width: '65%' }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Divider with animation */}
              <div className={`h-0.5 bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500 ${
                hoveredCard === commande.id ? 'scale-x-100' : 'scale-x-0'
              } origin-left`}></div>
            </div>
          ))}
        </div>

        {/* Voir plus button */}
        {hasMore && (
          <div className={`mt-8 text-center transition-all duration-700 delay-500 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <button
              onClick={loadMore}
              className="group px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 mx-auto shadow-lg"
            >
              <span>Voir plus de commandes</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}

        {/* Empty state message */}
        {commandes.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucune commande</h3>
            <p className="text-gray-500 mb-6">Vous n'avez pas encore passé de commande</p>
            <Link
              to="/ListResto"
              className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Commander maintenant →
            </Link>
          </div>
        )}

        {/* Footer note */}
        <div className={`mt-8 text-center text-sm text-gray-400 transition-all duration-700 delay-700 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <p>Besoin d'aide ? Contactez notre service client au <span className="text-orange-500">+225 07 00 00 00 00</span></p>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
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
        
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 65%;
          }
        }
        
        .animate-float-particle {
          animation: floatParticle 4s ease-in-out infinite;
        }
        
        .animate-progress {
          animation: progress 2s ease-out;
        }
      `}</style>
    </div>
  );
}

export default HistCom;