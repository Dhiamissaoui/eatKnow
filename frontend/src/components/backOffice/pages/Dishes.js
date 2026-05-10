import { useState } from "react";

const CATEGORIES = ["Entrées", "Plats", "Desserts", "Boissons"];

const RESTAURANTS = [
  { id: 1, nom: "Le Gourmet" },
  { id: 2, nom: "Pizza Palace" },
  { id: 3, nom: "Sushi Bar" },
  { id: 4, nom: "Burger King" },
];

const INITIAL_DISHES = [
  {
    id: 1,
    restaurant_id: 1,
    nom: "Salade César",
    description: "Salade fraîche avec sauce césar maison",
    prix: 8.5,
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=80&h=80&fit=crop",
    categorie: "Entrées",
    is_available: true,
  },
  {
    id: 2,
    restaurant_id: 1,
    nom: "Poulet Rôti",
    description: "Poulet rôti aux herbes de Provence",
    prix: 14.9,
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=80&h=80&fit=crop",
    categorie: "Plats",
    is_available: true,
  },
  {
    id: 3,
    restaurant_id: 2,
    nom: "Pizza Margherita",
    description: "Tomate, mozzarella, basilic frais",
    prix: 11.5,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=80&h=80&fit=crop",
    categorie: "Plats",
    is_available: false,
  },
  {
    id: 4,
    restaurant_id: 3,
    nom: "Tiramisu",
    description: "Tiramisu traditionnel au mascarpone",
    prix: 6.0,
    image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=80&h=80&fit=crop",
    categorie: "Desserts",
    is_available: true,
  },
  {
    id: 5,
    restaurant_id: 4,
    nom: "Jus d'Orange",
    description: "Jus d'orange pressé frais",
    prix: 3.5,
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=80&h=80&fit=crop",
    categorie: "Boissons",
    is_available: true,
  },
];

const EMPTY_FORM = {
  restaurant_id: "",
  nom: "",
  description: "",
  prix: "",
  image: "",
  categorie: "Plats",
  is_available: true,
};

const categoryColors = {
  Entrées: "bg-amber-100 text-amber-700",
  Plats: "bg-green-100 text-green-700",
  Desserts: "bg-pink-100 text-pink-700",
  Boissons: "bg-blue-100 text-blue-700",
};

function Modal({ dish, onClose, onSave }) {
  const [form, setForm] = useState(
    dish
      ? { ...dish, restaurant_id: String(dish.restaurant_id) }
      : { ...EMPTY_FORM }
  );
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.nom.trim()) e.nom = "Le nom est requis";
    if (!form.restaurant_id) e.restaurant_id = "Le restaurant est requis";
    if (!form.prix || isNaN(Number(form.prix)) || Number(form.prix) <= 0)
      e.prix = "Prix invalide";
    if (!form.categorie) e.categorie = "La catégorie est requise";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) return setErrors(e2);
    onSave({ ...form, prix: Number(form.prix), restaurant_id: Number(form.restaurant_id) });
  };

  const Field = ({ label, name, type = "text", children }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        {label}
      </label>
      {children || (
        <input
          type={type}
          value={form[name]}
          onChange={(e) => {
            setForm({ ...form, [name]: e.target.value });
            setErrors({ ...errors, [name]: "" });
          }}
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition ${
            errors[name] ? "border-red-400" : "border-gray-200"
          }`}
        />
      )}
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">{dish ? "✏️" : "+"}</span>
            </div>
            <h2 className="font-bold text-gray-800 text-lg">
              {dish ? "Modifier le plat" : "Nouveau plat"}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-light leading-none">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Image preview */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
              {form.image ? (
                <img src={form.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300">🍽</div>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                URL de l'image
              </label>
              <input
                type="text"
                placeholder="https://..."
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Field label="Nom du plat" name="nom" />
            </div>

            <Field label="Restaurant" name="restaurant_id">
              <select
                value={form.restaurant_id}
                onChange={(e) => {
                  setForm({ ...form, restaurant_id: e.target.value });
                  setErrors({ ...errors, restaurant_id: "" });
                }}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white ${
                  errors.restaurant_id ? "border-red-400" : "border-gray-200"
                }`}
              >
                <option value="">— Sélectionner —</option>
                {RESTAURANTS.map((r) => (
                  <option key={r.id} value={r.id}>{r.nom}</option>
                ))}
              </select>
              {errors.restaurant_id && (
                <p className="text-red-500 text-xs mt-1">{errors.restaurant_id}</p>
              )}
            </Field>

            <Field label="Catégorie" name="categorie">
              <select
                value={form.categorie}
                onChange={(e) => setForm({ ...form, categorie: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              />
            </div>

            <Field label="Prix (TND)" name="prix" type="number" />

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Disponibilité
              </label>
              <button
                type="button"
                onClick={() => setForm({ ...form, is_available: !form.is_available })}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  form.is_available
                    ? "bg-green-50 border-green-300 text-green-700"
                    : "bg-gray-50 border-gray-200 text-gray-500"
                }`}
              >
                <span className={`w-3 h-3 rounded-full ${form.is_available ? "bg-green-500" : "bg-gray-300"}`} />
                {form.is_available ? "Disponible" : "Indisponible"}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-orange-200"
            >
              {dish ? "Enregistrer" : "Créer le plat"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmModal({ dish, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 text-center">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🗑</div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Supprimer le plat</h3>
        <p className="text-gray-500 text-sm mb-6">
          Êtes-vous sûr de vouloir supprimer <span className="font-semibold text-gray-700">{dish.nom}</span> ? Cette action est irréversible.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            Annuler
          </button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

function Dishes() {
  const [dishes, setDishes] = useState(INITIAL_DISHES);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("Tous");
  const [filterRestaurant, setFilterRestaurant] = useState("Tous");
  const [modal, setModal] = useState(null); // null | { type: "create" | "edit" | "delete", dish? }

  // Filtered list
  const filtered = dishes.filter((d) => {
    const matchSearch =
      d.nom.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "Tous" || d.categorie === filterCategory;
    const matchRest =
      filterRestaurant === "Tous" || d.restaurant_id === Number(filterRestaurant);
    return matchSearch && matchCat && matchRest;
  });

  const getRestaurantName = (id) =>
    RESTAURANTS.find((r) => r.id === id)?.nom || "—";

  const handleSave = (formData) => {
    if (modal.dish) {
      setDishes(dishes.map((d) => (d.id === modal.dish.id ? { ...d, ...formData } : d)));
    } else {
      setDishes([...dishes, { ...formData, id: Date.now() }]);
    }
    setModal(null);
  };

  const handleDelete = () => {
    setDishes(dishes.filter((d) => d.id !== modal.dish.id));
    setModal(null);
  };

  const toggleAvailability = (id) => {
    setDishes(dishes.map((d) => (d.id === id ? { ...d, is_available: !d.is_available } : d)));
  };

  const stats = {
    total: dishes.length,
    available: dishes.filter((d) => d.is_available).length,
    unavailable: dishes.filter((d) => !d.is_available).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Modals */}
      {(modal?.type === "create" || modal?.type === "edit") && (
        <Modal dish={modal.dish} onClose={() => setModal(null)} onSave={handleSave} />
      )}
      {modal?.type === "delete" && (
        <ConfirmModal dish={modal.dish} onClose={() => setModal(null)} onConfirm={handleDelete} />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Plats</h1>
            <p className="text-gray-400 text-sm mt-0.5">Gérez tous les plats de vos restaurants</p>
          </div>
          <button
            onClick={() => setModal({ type: "create" })}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-orange-200 self-start sm:self-auto"
          >
            <span className="text-lg leading-none">+</span> Nouveau plat
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total", value: stats.total, color: "text-gray-700", bg: "bg-white" },
            { label: "Disponibles", value: stats.available, color: "text-green-600", bg: "bg-green-50" },
            { label: "Indisponibles", value: stats.unavailable, color: "text-red-500", bg: "bg-red-50" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-gray-100 text-center`}>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Rechercher un plat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Category filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="Tous">Toutes catégories</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>

          {/* Restaurant filter */}
          <select
            value={filterRestaurant}
            onChange={(e) => setFilterRestaurant(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="Tous">Tous les restaurants</option>
            {RESTAURANTS.map((r) => (
              <option key={r.id} value={r.id}>{r.nom}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Plat</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Restaurant</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Catégorie</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Prix</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Statut</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-gray-300">
                      <div className="text-5xl mb-3">🍽</div>
                      <p className="text-sm font-medium">Aucun plat trouvé</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((dish) => (
                    <tr key={dish.id} className="hover:bg-orange-50/30 transition-colors group">
                      {/* Dish info */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {dish.image ? (
                              <img src={dish.image} alt={dish.nom} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">🍽</div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{dish.nom}</p>
                            <p className="text-xs text-gray-400 line-clamp-1 max-w-48">{dish.description}</p>
                          </div>
                        </div>
                      </td>

                      {/* Restaurant */}
                      <td className="px-4 py-3 text-gray-600">{getRestaurantName(dish.restaurant_id)}</td>

                      {/* Category badge */}
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[dish.categorie] || "bg-gray-100 text-gray-600"}`}>
                          {dish.categorie}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3 font-semibold text-gray-800">
                        {Number(dish.prix).toFixed(3)} <span className="font-normal text-gray-400 text-xs">TND</span>
                      </td>

                      {/* Toggle availability */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleAvailability(dish.id)}
                          title="Changer disponibilité"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                            dish.is_available
                              ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                              : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${dish.is_available ? "bg-green-500" : "bg-gray-300"}`} />
                          {dish.is_available ? "Disponible" : "Indisponible"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setModal({ type: "edit", dish })}
                            className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition"
                            title="Modifier"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setModal({ type: "delete", dish })}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                            title="Supprimer"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer count */}
          {filtered.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-50 bg-gray-50/50">
              <p className="text-xs text-gray-400">
                {filtered.length} plat{filtered.length > 1 ? "s" : ""} affiché{filtered.length > 1 ? "s" : ""}
                {dishes.length !== filtered.length && ` sur ${dishes.length}`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dishes;