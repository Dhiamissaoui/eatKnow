import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoImage from "../../../images/LastLogo.png";

function NavBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Tunis Centre');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const locationDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Locations en Tunisie
  const tunisiaLocations = [
    { city: 'Tunis Centre', area: 'Tunis', zones: ['Centre Ville', 'Mutuelleville', 'Belvédère', 'El Menzah'] },
    { city: 'Carthage', area: 'Tunis', zones: ['Carthage Byrsa', 'Carthage Hannibal', 'Carthage Dermech'] },
    { city: 'La Marsa', area: 'Tunis', zones: ['Marsa Plage', 'Marsa Corniche', 'Sidi Bou Saïd'] },
    { city: 'Sidi Bou Saïd', area: 'Tunis', zones: ['Centre', 'Bord de Mer'] },
    { city: 'Sfax', area: 'Sfax', zones: ['Centre Ville', 'Route de la Mer', 'El Ain'] },
    { city: 'Sousse', area: 'Sousse', zones: ['Sousse Médina', 'Sousse Boujaafar', 'Sahloul'] },
    { city: 'Monastir', area: 'Monastir', zones: ['Centre', 'Bord de Mer', 'Route de la Falaise'] },
    { city: 'Hammamet', area: 'Nabeul', zones: ['Hammamet Nord', 'Hammamet Sud', 'Yasmine Hammamet'] },
    { city: 'Nabeul', area: 'Nabeul', zones: ['Centre Ville', 'Dar Chaabane'] },
    { city: 'Bizerte', area: 'Bizerte', zones: ['Centre', 'Corniche', 'Zarzouna'] },
    { city: 'Gabès', area: 'Gabès', zones: ['Centre Ville', 'Sidi Boulbaba'] },
    { city: 'Kairouan', area: 'Kairouan', zones: ['Médina', 'Cité la Mosquée'] },
  ];

  useEffect(() => {
    // Vérifier connexion
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    
    // Récupérer la localisation sauvegardée
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setSelectedLocation(savedLocation);
    }
    
    // Effet de scroll pour la navbar
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Fermer le dropdown au clic en dehors
    const handleClickOutside = (event) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
        setIsLocationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/ListResto?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userLocation');
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location.city);
    localStorage.setItem('userLocation', location.city);
    setIsLocationOpen(false);
    // Optionnel: recharger les restaurants près de cette zone
    window.dispatchEvent(new CustomEvent('locationChange', { detail: location }));
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' 
        : 'bg-white shadow-md py-0'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section avec animation */}
          <Link to="/" className="flex-shrink-0 group">
            <div className="flex items-center">
              <img 
                className="h-12 w-auto transition-transform duration-300 group-hover:scale-105" 
                src={LogoImage}
                alt="Logo"
              />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-gray-800 to-orange-500 bg-clip-text text-transparent hidden sm:inline-block">
                eatKnow
              </span>
            </div>
          </Link>

          {/* Location Section avec dropdown */}
          <div className="hidden md:block relative" ref={locationDropdownRef}>
            <button
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="flex items-center space-x-2 bg-gradient-to-r from-orange-50 to-gray-50 hover:from-orange-100 hover:to-gray-100 rounded-lg px-4 py-2 transition-all duration-300 group"
            >
              <svg className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <div className="text-left">
                <p className="text-xs text-gray-500">Livraison à</p>
                <p className="text-sm font-semibold text-gray-700 group-hover:text-orange-500 transition-colors">
                  {selectedLocation}
                </p>
              </div>
              <svg className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isLocationOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown avec animations */}
            {isLocationOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-slide-down">
                <div className="max-h-96 overflow-y-auto">
                  {/* Search in dropdown */}
                  <div className="p-3 border-b border-gray-100">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Rechercher une ville..."
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                      />
                      <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Locations list */}
                  {tunisiaLocations.map((location, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleLocationSelect(location)}
                      className="w-full text-left px-4 py-3 hover:bg-orange-50 transition-all duration-200 group border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800 group-hover:text-orange-600">
                            {location.city}
                          </p>
                          <p className="text-xs text-gray-500">{location.area}</p>
                        </div>
                        {selectedLocation === location.city && (
                          <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex gap-2 mt-1">
                        {location.zones.slice(0, 3).map((zone, i) => (
                          <span key={i} className="text-xs text-gray-400">• {zone}</span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search Bar animée */}
          <div className="flex-1 max-w-lg mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Rechercher un restaurant ou un plat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`w-full px-4 py-2 pl-10 pr-12 text-gray-700 bg-gray-100 border-2 rounded-full transition-all duration-300 ${
                  isSearchFocused 
                    ? 'border-orange-500 bg-white shadow-lg' 
                    : 'border-transparent hover:bg-gray-50'
                } focus:outline-none`}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className={`w-5 h-5 transition-colors duration-300 ${isSearchFocused ? 'text-orange-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button 
                type="submit"
                className="absolute inset-y-0 right-0 pr-3 flex items-center group"
              >
                <svg className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </form>
          </div>

          {/* Right Section avec animations */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <button 
              onClick={() => navigate('/Cart')}
              className="relative p-2 text-gray-600 hover:text-orange-500 transition-all duration-300 hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 21v-8" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                0
              </span>
            </button>

            {/* Notification Button */}
            {isLoggedIn && (
              <button className="relative p-2 text-gray-600 hover:text-orange-500 transition-all duration-300 hover:scale-110 group">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-ping"></span>
              </button>
            )}

            {/* Auth Buttons avec animations */}
            {!isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-orange-500 border-2 border-orange-500 rounded-lg hover:bg-orange-50 font-medium text-sm transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 font-medium text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Inscription
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold text-sm">
                  JD
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-50 font-medium text-sm transition-all duration-300 hover:scale-105"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-down {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
}

export default NavBar;