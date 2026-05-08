// Checkout.js
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Checkout() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedItem, setAnimatedItem] = useState(null);
  const sectionRef = useRef(null);

  // Données de livraison
  const [deliveryData, setDeliveryData] = useState({
    address: 'Cocody, Angré 7ᵉ tranche, Abidjan',
    phone: '07 12 34 56 78',
    comment: ''
  });

  // Mode de paiement
  const [paymentMethod, setPaymentMethod] = useState('livraison');
  const [mobileNumber, setMobileNumber] = useState('');

  // Panier (simulé)
  const [cartItems] = useState([
    { id: 1, name: 'Poulet DG', price: 4500, quantity: 2, image: '🍗' },
    { id: 2, name: 'Attiéké Poisson', price: 4000, quantity: 1, image: '🐟' },
    { id: 3, name: 'Jus de Bissap', price: 1500, quantity: 1, image: '🥤' }
  ]);

  const deliveryFee = 1000;
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const total = subtotal + deliveryFee;

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

  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
    setDeliveryData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (currentStep === 1 && (!deliveryData.address || !deliveryData.phone)) {
      alert('Veuillez remplir toutes les informations de livraison');
      return;
    }
    if (currentStep === 2 && !paymentMethod) {
      alert('Veuillez choisir un mode de paiement');
      return;
    }
    if (currentStep === 2 && paymentMethod === 'mobile' && !mobileNumber) {
      alert('Veuillez entrer votre numéro Mobile Money');
      return;
    }
    setAnimatedItem(currentStep + 1);
    setTimeout(() => setAnimatedItem(null), 500);
    setCurrentStep(prev => prev + 1);
  };

  const handlePreviousStep = () => {
    setAnimatedItem(currentStep - 1);
    setTimeout(() => setAnimatedItem(null), 500);
    setCurrentStep(prev => prev - 1);
  };

  const handleConfirmOrder = () => {
    setOrderConfirmed(true);
    setTimeout(() => {
      navigate('/HistCom');
    }, 3000);
  };

  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center transform animate-scale-up">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce-slow">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Commande confirmée ! 🎉</h2>
          <p className="text-gray-600 mb-6">Merci pour votre commande. Vous recevrez bientôt une confirmation par SMS et email.</p>
          <div className="flex items-center justify-center gap-2 text-orange-500">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse animation-delay-200"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse animation-delay-400"></div>
            <span className="ml-2">Redirection en cours...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* En-tête avec animation */}
        <div className={`text-center mb-8 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Commande sécurisée
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Validation de{' '}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              commande
            </span>
          </h1>
          <p className="text-gray-600 text-lg">Finalisez votre commande en 3 étapes simples</p>
        </div>

        {/* Indicateur d'étapes amélioré */}
        <div className={`mb-12 transition-all duration-700 delay-200 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex-1 flex items-center">
                <div className="relative group">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    currentStep >= step 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-110' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step
                    )}
                  </div>
                  {currentStep === step && (
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <span className="text-xs font-semibold text-orange-500 animate-pulse">
                        {step === 1 && 'En cours'}
                        {step === 2 && 'En cours'}
                        {step === 3 && 'En cours'}
                      </span>
                    </div>
                  )}
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-3 rounded-full transition-all duration-500 ${
                    currentStep > step ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gray-200'
                  }`}></div>
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

        {/* Étape 1: Livraison avec animation */}
        <div className={`transition-all duration-500 transform ${
          currentStep === 1 ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 hidden'
        }`}>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📍</span>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">1. Livraison</h2>
                  <p className="text-sm text-gray-600">Où souhaitons-nous livrer ?</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Adresse */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <span>🏠</span> Adresse de livraison *
                </label>
                <textarea
                  name="address"
                  rows="3"
                  value={deliveryData.address}
                  onChange={handleDeliveryChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:shadow-lg transition-all duration-300 group-hover:border-gray-300"
                  placeholder="Votre adresse complète"
                />
              </div>

              {/* Téléphone */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <span>📞</span> Téléphone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={deliveryData.phone}
                  onChange={handleDeliveryChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:shadow-lg transition-all duration-300"
                  placeholder="Votre numéro de téléphone"
                />
              </div>

              {/* Commentaire optionnel */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <span>💬</span> Commentaire (optionnel)
                </label>
                <textarea
                  name="comment"
                  rows="2"
                  value={deliveryData.comment}
                  onChange={handleDeliveryChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:shadow-lg transition-all duration-300"
                  placeholder="Instructions pour la livraison, code d'accès, etc..."
                />
                <p className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                  <span>ℹ️</span> Ces informations aident notre livreur à vous trouver plus facilement
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Étape 2: Paiement avec animation */}
        <div className={`transition-all duration-500 transform ${
          currentStep === 2 ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 hidden'
        }`}>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💳</span>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">2. Paiement</h2>
                  <p className="text-sm text-gray-600">Choisissez votre mode de paiement</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Paiement à la livraison */}
              <label className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                paymentMethod === 'livraison' 
                  ? 'border-orange-500 bg-orange-50 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="livraison"
                  checked={paymentMethod === 'livraison'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-orange-500 focus:ring-orange-400"
                />
                <div className="ml-4 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💰</span>
                    <span className="font-semibold text-gray-800">Paiement à la livraison</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Payez en espèces à la réception de votre commande</p>
                </div>
              </label>

              {/* Carte bancaire */}
              <label className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                paymentMethod === 'carte' 
                  ? 'border-orange-500 bg-orange-50 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="carte"
                  checked={paymentMethod === 'carte'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-orange-500 focus:ring-orange-400"
                />
                <div className="ml-4 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💳</span>
                    <span className="font-semibold text-gray-800">Carte bancaire</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Paiement sécurisé par carte bancaire (Visa, Mastercard)</p>
                </div>
              </label>

              {/* Mobile Money */}
              <label className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                paymentMethod === 'mobile' 
                  ? 'border-orange-500 bg-orange-50 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="mobile"
                  checked={paymentMethod === 'mobile'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-orange-500 focus:ring-orange-400"
                />
                <div className="ml-4 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📱</span>
                    <span className="font-semibold text-gray-800">Mobile Money</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Paiement via Orange Money ou MTN Mobile Money</p>
                </div>
              </label>

              {/* Informations supplémentaires pour mobile money */}
              {paymentMethod === 'mobile' && (
                <div className="mt-4 p-5 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200 animate-fade-in">
                  <p className="text-sm text-gray-700 mb-3 flex items-center gap-2">
                    <span>📱</span> Vous recevrez une demande de paiement sur votre téléphone
                  </p>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="Numéro Mobile Money (ex: 07 XX XX XX XX)"
                    className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-500 focus:shadow-lg transition-all duration-300"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Étape 3: Récapitulatif avec animation */}
        <div className={`transition-all duration-500 transform ${
          currentStep === 3 ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 hidden'
        }`}>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">3. Récapitulatif</h2>
                  <p className="text-sm text-gray-600">Vérifiez votre commande avant validation</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {/* Informations de livraison */}
              <div className="mb-6 pb-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span>📍</span> Informations de livraison
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700">📦 {deliveryData.address}</p>
                  <p className="text-gray-600 text-sm mt-1">📞 Tel: {deliveryData.phone}</p>
                  {deliveryData.comment && (
                    <p className="text-gray-500 text-sm mt-1">💬 Note: {deliveryData.comment}</p>
                  )}
                </div>
              </div>

              {/* Mode de paiement */}
              <div className="mb-6 pb-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span>💳</span> Mode de paiement
                </h3>
                <div className="bg-green-50 rounded-xl p-3 inline-block">
                  <p className="text-green-700 font-medium">
                    {paymentMethod === 'livraison' && '💰 Paiement à la livraison'}
                    {paymentMethod === 'carte' && '💳 Carte bancaire'}
                    {paymentMethod === 'mobile' && '📱 Mobile Money'}
                  </p>
                </div>
                {paymentMethod === 'mobile' && mobileNumber && (
                  <p className="text-sm text-gray-500 mt-2">Numéro: {mobileNumber}</p>
                )}
              </div>

              {/* Récapitulatif des articles */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span>🍽️</span> Articles commandés
                </h3>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.image}</span>
                        <div>
                          <span className="font-medium text-gray-800">{item.name}</span>
                          <span className="text-orange-500 text-sm ml-2">x{item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-800">
                        {(item.price * item.quantity).toLocaleString()} FCFA
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t-2 border-gray-200 pt-5 mt-3">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="text-gray-700">{subtotal.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Frais de livraison</span>
                  <span className="text-gray-700">{deliveryFee.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between pt-3 mt-2 border-t-2 border-orange-200">
                  <span className="text-xl font-bold text-gray-900">Total à payer</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    {total.toLocaleString()} FCFA
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons de navigation améliorés */}
        <div className="mt-8 flex justify-between gap-4">
          {currentStep > 1 && (
            <button
              onClick={handlePreviousStep}
              className="group px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center gap-2 font-semibold"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour
            </button>
          )}
          
          <button
            onClick={currentStep < 3 ? handleNextStep : handleConfirmOrder}
            className={`group px-8 py-3 rounded-xl text-white font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl ${
              currentStep < 3 
                ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:scale-105 ml-auto' 
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 w-full justify-center text-lg'
            }`}
          >
            {currentStep < 3 ? (
              <>
                Continuer
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Confirmer la commande
              </>
            )}
          </button>
        </div>

        {/* Sécurité badge */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 text-sm text-gray-400 bg-white px-4 py-2 rounded-full shadow">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A10 10 0 0010 19a10 10 0 007.834-14.001l.043-.077c.108-.195.248-.379.398-.544a10.008 10.008 0 00-8.708-2.348 10.007 10.007 0 00-4.57 2.232c.14.17.269.362.383.57l.047.09z" clipRule="evenodd" />
            </svg>
            Paiement 100% sécurisé
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-scale-up {
          animation: scaleUp 0.5s ease-out;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </div>
  );
}

export default Checkout;