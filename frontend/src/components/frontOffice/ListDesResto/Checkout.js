import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addCommande } from '../../../redux/Actions/commandeActions';

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);

  const [currentStep, setCurrentStep] = useState(1);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const [cartItems, setCartItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('checkoutCart');
    const savedRestaurantId = localStorage.getItem('checkoutRestaurantId');
    if (savedCart) setCartItems(JSON.parse(savedCart));
    if (savedRestaurantId) setRestaurantId(savedRestaurantId);
  }, []);

  const [deliveryData, setDeliveryData] = useState({
    address: user?.adresse || '',
    phone: '',
    comment: ''
  });

  // ENUM backend : 'carte' | 'livraison' | 'mobile_money'
  const [paymentMethod, setPaymentMethod] = useState('livraison');

  const deliveryFee = 1000;
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const total = subtotal + deliveryFee;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
    setDeliveryData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (currentStep === 1 && (!deliveryData.address || !deliveryData.phone)) {
      alert('Veuillez remplir toutes les informations de livraison');
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePreviousStep = () => setCurrentStep(prev => prev - 1);

  const handleConfirmOrder = async () => {
    if (!isAuthenticated) {
      alert('Vous devez être connecté pour passer une commande.');
      navigate('/Login');
      return;
    }
    if (cartItems.length === 0) {
      alert('Votre panier est vide.');
      return;
    }
    if (!restaurantId) {
      setErrorMsg('Restaurant introuvable. Veuillez recommencer depuis le menu du restaurant.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const payload = {
        restaurant_id: restaurantId,
        adresse_livraison: deliveryData.address,
        mode_paiement: paymentMethod,
        items: cartItems.map(item => ({
          plat_id: item.id,
          quantite: item.quantity
        }))
      };

      await dispatch(addCommande(payload));

      // Vider le panier
      localStorage.removeItem('cart');
      localStorage.removeItem('checkoutCart');
      localStorage.removeItem('checkoutRestaurantId');
      window.dispatchEvent(new Event('cartUpdated'));

      setOrderConfirmed(true);
      setTimeout(() => navigate('/HistCom'), 3000);
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || 'Erreur lors de la commande. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Commande confirmée ! 🎉</h2>
          <p className="text-gray-600 mb-6">Merci pour votre commande. Suivez son avancement dans votre historique.</p>
          <div className="flex items-center justify-center gap-2 text-orange-500">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="ml-2">Redirection en cours...</span>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🛒</p>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Votre panier est vide</h2>
          <button onClick={() => navigate('/ListResto')} className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600">
            Voir les restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        <div className={`text-center mb-8 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Validation de{' '}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">commande</span>
          </h1>
          <p className="text-gray-600 text-lg">Finalisez votre commande en 3 étapes simples</p>
        </div>

        {/* Indicateur d'étapes */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex-1 flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                  currentStep >= step ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-110' : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : step}
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-3 rounded-full transition-all duration-500 ${currentStep > step ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gray-200'}`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 px-2">
            <span className="text-sm font-medium text-gray-600">📦 Livraison</span>
            <span className="text-sm font-medium text-gray-600">💳 Paiement</span>
            <span className="text-sm font-medium text-gray-600">✅ Récapitulatif</span>
          </div>
        </div>

        {/* Étape 1 : Livraison */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800">1. Livraison</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">🏠 Adresse de livraison *</label>
                <textarea name="address" rows="3" value={deliveryData.address} onChange={handleDeliveryChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
                  placeholder="Votre adresse complète" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">📞 Téléphone *</label>
                <input type="tel" name="phone" value={deliveryData.phone} onChange={handleDeliveryChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
                  placeholder="Votre numéro de téléphone" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">💬 Commentaire (optionnel)</label>
                <textarea name="comment" rows="2" value={deliveryData.comment} onChange={handleDeliveryChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all"
                  placeholder="Instructions pour le livreur..." />
              </div>
            </div>
          </div>
        )}

        {/* Étape 2 : Paiement */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800">2. Mode de paiement</h2>
            </div>
            <div className="p-6 space-y-4">
              {[
                { value: 'livraison', icon: '💰', label: 'Paiement à la livraison', desc: 'Payez en espèces à la réception' },
                { value: 'carte', icon: '💳', label: 'Carte bancaire', desc: 'Paiement sécurisé (Visa, Mastercard)' },
                { value: 'mobile_money', icon: '📱', label: 'Mobile Money', desc: 'Paiement via Mobile Money' }
              ].map(option => (
                <label key={option.value} className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === option.value ? 'border-orange-500 bg-orange-50 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                  <input type="radio" name="payment" value={option.value} checked={paymentMethod === option.value} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-orange-500" />
                  <div className="ml-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{option.icon}</span>
                      <span className="font-semibold text-gray-800">{option.label}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{option.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Étape 3 : Récapitulatif */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800">3. Récapitulatif</h2>
            </div>
            <div className="p-6">
              <div className="mb-6 pb-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">📍 Informations de livraison</h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700">📦 {deliveryData.address}</p>
                  <p className="text-gray-600 text-sm mt-1">📞 {deliveryData.phone}</p>
                  {deliveryData.comment && <p className="text-gray-500 text-sm mt-1">💬 {deliveryData.comment}</p>}
                </div>
              </div>
              <div className="mb-6 pb-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">💳 Mode de paiement</h3>
                <div className="bg-green-50 rounded-xl p-3 inline-block">
                  <p className="text-green-700 font-medium">
                    {paymentMethod === 'livraison' && '💰 Paiement à la livraison'}
                    {paymentMethod === 'carte' && '💳 Carte bancaire'}
                    {paymentMethod === 'mobile_money' && '📱 Mobile Money'}
                  </p>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">🍽️ Articles commandés</h3>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">🍽️</div>
                        )}
                        <div>
                          <span className="font-medium text-gray-800">{item.name}</span>
                          <span className="text-orange-500 text-sm ml-2">x{item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-800">{(item.price * item.quantity).toLocaleString()} DT</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t-2 border-gray-200 pt-5">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="text-gray-700">{subtotal.toLocaleString()} DT</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Frais de livraison</span>
                  <span className="text-gray-700">{deliveryFee.toLocaleString()} DT</span>
                </div>
                <div className="flex justify-between pt-3 mt-2 border-t-2 border-orange-200">
                  <span className="text-xl font-bold text-gray-900">Total à payer</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    {total.toLocaleString()} DT
                  </span>
                </div>
              </div>
              {errorMsg && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  ⚠️ {errorMsg}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-between gap-4">
          {currentStep > 1 && (
            <button onClick={handlePreviousStep}
              className="px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-semibold flex items-center gap-2">
              ← Retour
            </button>
          )}
          <button
            onClick={currentStep < 3 ? handleNextStep : handleConfirmOrder}
            disabled={isLoading}
            className={`px-8 py-3 rounded-xl text-white font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2 ${
              currentStep < 3 ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:scale-105 ml-auto' : 'bg-gradient-to-r from-green-500 to-emerald-600 w-full justify-center text-lg'
            } ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {isLoading ? '⏳ Traitement...' : currentStep < 3 ? 'Continuer →' : '✅ Confirmer la commande'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;