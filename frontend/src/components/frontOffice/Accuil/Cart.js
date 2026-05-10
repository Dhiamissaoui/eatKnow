// Cart.js - Version corrigée
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [isCartOpen, setIsCartOpen] = useState(true); // Changé à true pour que le panier s'ouvre par défaut
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Charger le panier depuis localStorage au démarrage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

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
    // Sauvegarder les données pour la page checkout
    localStorage.setItem('checkoutCart', JSON.stringify(cartItems));
    localStorage.setItem('checkoutTotal', total.toString());
    localStorage.setItem('checkoutSubtotal', subtotal.toString());
    
    // Fermer le panier
    setIsCartOpen(false);
    
    // Naviguer vers la page checkout
    navigate('/Checkout');
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <>
      {/* Overlay avec flou */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Panier coulissant depuis la droite */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isCartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* En-tête du panier */}
        <div className="flex justify-between items-center p-6 border-b bg-orange-500 text-white">
          <h2 className="text-2xl font-bold">Votre Panier</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenu du panier */}
        <div className="flex-1 overflow-y-auto p-6" style={{ height: 'calc(100% - 280px)' }}>
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 21v-8" />
              </svg>
              <p className="text-gray-500 text-lg">Votre panier est vide</p>
              <p className="text-gray-400 text-sm mt-2">Ajoutez des plats pour commencer</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Découvrir les restaurants
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
                      <p className="text-orange-500 font-medium mt-1">
                        {item.price.toLocaleString()} FCFA
                      </p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-600 transition-colors"
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
                        className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center font-bold text-xl"
                      >
                        −
                      </button>
                      <span className="font-semibold text-gray-700 w-8 text-center text-lg">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors flex items-center justify-center font-bold text-xl"
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

        {/* Résumé et validation */}
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
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Valider la commande
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;