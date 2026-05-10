// Restaurants.js
import { useState } from 'react';

// ── Mock data ────────────────────────────────────────────────────────────────
const initialRestaurants = [
  {
    id: 1,
    nom: 'Le Gourmet',
    description: 'Cuisine africaine et européenne raffinée au cœur de la ville.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=80&h=80&fit=crop',
    adresse: '12 Rue des Almadies, Dakar',
    horaires: '08:00 – 23:00',
    type_cuisine: 'Africain / Européen',
    note_moyenne: 4.6,
    temps_livraison_estime: 30,
    is_active: true,
  },
  {
    id: 2,
    nom: 'Pizza House',
    description: 'Les meilleures pizzas artisanales cuites au feu de bois.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=80&h=80&fit=crop',
    adresse: '5 Avenue Cheikh Anta Diop, Dakar',
    horaires: '10:00 – 22:00',
    type_cuisine: 'Italien',
    note_moyenne: 4.3,
    temps_livraison_estime: 25,
    is_active: true,
  },
  {
    id: 3,
    nom: 'Délice Asie',
    description: 'Voyage culinaire en Asie : sushis, woks et dim sum.',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=80&h=80&fit=crop',
    adresse: '88 Boulevard de la République, Dakar',
    horaires: '11:00 – 22:30',
    type_cuisine: 'Asiatique',
    note_moyenne: 4.7,
    temps_livraison_estime: 35,
    is_active: true,
  },
  {
    id: 4,
    nom: 'Burger King',
    description: 'Fast food américain, burgers généreux et frites croustillantes.',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=80&h=80&fit=crop',
    adresse: '3 Place de l\'Indépendance, Dakar',
    horaires: '09:00 – 01:00',
    type_cuisine: 'Fast Food',
    note_moyenne: 4.2,
    temps_livraison_estime: 20,
    is_active: false,
  },
  {
    id: 5,
    nom: 'Saveurs du Sahel',
    description: 'Cuisine traditionnelle sahélienne revisitée avec modernité.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=80&h=80&fit=crop',
    adresse: '27 Rue Vincens, Dakar',
    horaires: '07:00 – 21:00',
    type_cuisine: 'Africain',
    note_moyenne: 4.5,
    temps_livraison_estime: 40,
    is_active: true,
  },
];

const cuisineTypes = [
  'Africain', 'Africain / Européen', 'Asiatique', 'Fast Food',
  'Italien', 'Méditerranéen', 'Mexicain', 'Libanais', 'Français', 'Autre',
];

const emptyForm = {
  nom: '',
  description: '',
  image: '',
  adresse: '',
  horaires: '',
  type_cuisine: cuisineTypes[0],
  note_moyenne: 0,
  temps_livraison_estime: 30,
  is_active: true,
};

// ── Star rating display ──────────────────────────────────────────────────────
function Stars({ note }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-3.5 h-3.5 ${s <= Math.round(note) ? 'text-yellow-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-xs font-semibold text-gray-600">{note}</span>
    </span>
  );
}

// ── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ active }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500' : 'bg-red-500'}`} />
      {active ? 'Actif' : 'Inactif'}
    </span>
  );
}

// ── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto z-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ── Confirm delete dialog ────────────────────────────────────────────────────
function ConfirmDelete({ nom, onConfirm, onCancel }) {
  return (
    <Modal title="Confirmer la suppression" onClose={onCancel}>
      <p className="text-gray-600 mb-6">
        Voulez-vous vraiment supprimer <span className="font-semibold text-gray-900">«&nbsp;{nom}&nbsp;»</span> ? Cette action est irréversible.
      </p>
      <div className="flex gap-3 justify-end">
        <button onClick={onCancel} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium">
          Annuler
        </button>
        <button onClick={onConfirm} className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors text-sm font-medium">
          Supprimer
        </button>
      </div>
    </Modal>
  );
}

// ── Restaurant form (create / edit) ──────────────────────────────────────────
function RestaurantForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nom.trim() || !form.adresse.trim()) return;
    onSave(form);
  };

  const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition';
  const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nom */}
      <div>
        <label className={labelCls}>Nom du restaurant *</label>
        <input
          className={inputCls}
          value={form.nom}
          onChange={(e) => set('nom', e.target.value)}
          placeholder="Ex: Le Gourmet"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className={labelCls}>Description</label>
        <textarea
          className={`${inputCls} resize-none`}
          rows={2}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Courte description du restaurant…"
        />
      </div>

      {/* Image URL */}
      <div>
        <label className={labelCls}>URL de l'image / logo</label>
        <input
          className={inputCls}
          value={form.image}
          onChange={(e) => set('image', e.target.value)}
          placeholder="https://…"
        />
      </div>

      {/* Adresse */}
      <div>
        <label className={labelCls}>Adresse *</label>
        <input
          className={inputCls}
          value={form.adresse}
          onChange={(e) => set('adresse', e.target.value)}
          placeholder="Ex: 12 Rue des Almadies, Dakar"
          required
        />
      </div>

      {/* Horaires + Type cuisine */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Horaires</label>
          <input
            className={inputCls}
            value={form.horaires}
            onChange={(e) => set('horaires', e.target.value)}
            placeholder="Ex: 08:00 – 23:00"
          />
        </div>
        <div>
          <label className={labelCls}>Type de cuisine</label>
          <select
            className={inputCls}
            value={form.type_cuisine}
            onChange={(e) => set('type_cuisine', e.target.value)}
          >
            {cuisineTypes.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Temps livraison */}
      <div>
        <label className={labelCls}>Temps de livraison estimé (minutes)</label>
        <input
          type="number"
          min={5}
          max={120}
          className={inputCls}
          value={form.temps_livraison_estime}
          onChange={(e) => set('temps_livraison_estime', Number(e.target.value))}
        />
      </div>

      {/* Statut */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
        <div>
          <p className="text-sm font-semibold text-gray-700">Statut</p>
          <p className="text-xs text-gray-400">Le restaurant apparaît sur la plateforme</p>
        </div>
        <button
          type="button"
          onClick={() => set('is_active', !form.is_active)}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${form.is_active ? 'bg-orange-500' : 'bg-gray-300'}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${form.is_active ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-colors text-sm font-semibold shadow-sm"
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
function Restaurants() {
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [search, setSearch]           = useState('');
  const [filterType, setFilterType]   = useState('Tous');
  const [filterStatus, setFilterStatus] = useState('Tous');
  const [modal, setModal]             = useState(null); // null | 'create' | 'edit' | 'delete'
  const [selected, setSelected]       = useState(null);
  const [nextId, setNextId]           = useState(100);

  // ── Filtered list
  const filtered = restaurants.filter((r) => {
    const matchSearch = r.nom.toLowerCase().includes(search.toLowerCase()) ||
      r.type_cuisine.toLowerCase().includes(search.toLowerCase());
    const matchType   = filterType === 'Tous' || r.type_cuisine === filterType;
    const matchStatus = filterStatus === 'Tous' ||
      (filterStatus === 'Actif' && r.is_active) ||
      (filterStatus === 'Inactif' && !r.is_active);
    return matchSearch && matchType && matchStatus;
  });

  const allTypes = ['Tous', ...Array.from(new Set(restaurants.map((r) => r.type_cuisine)))];

  // ── CRUD handlers
  const handleCreate = (form) => {
    setRestaurants((prev) => [...prev, { ...form, id: nextId, note_moyenne: 0 }]);
    setNextId((n) => n + 1);
    setModal(null);
  };

  const handleEdit = (form) => {
    setRestaurants((prev) => prev.map((r) => r.id === selected.id ? { ...r, ...form } : r));
    setModal(null);
    setSelected(null);
  };

  const handleDelete = () => {
    setRestaurants((prev) => prev.filter((r) => r.id !== selected.id));
    setModal(null);
    setSelected(null);
  };

  const toggleStatus = (id) => {
    setRestaurants((prev) => prev.map((r) => r.id === id ? { ...r, is_active: !r.is_active } : r));
  };

  const openEdit = (r) => { setSelected(r); setModal('edit'); };
  const openDelete = (r) => { setSelected(r); setModal('delete'); };

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Gestion des restaurants</h2>
          <p className="text-sm text-gray-400 mt-0.5">{restaurants.length} restaurants · {restaurants.filter(r => r.is_active).length} actifs</p>
        </div>
        <button
          onClick={() => setModal('create')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors text-sm font-semibold shadow-sm flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter un restaurant
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            placeholder="Rechercher un restaurant…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Type filter */}
        <select
          className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-600"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          {allTypes.map((t) => <option key={t}>{t}</option>)}
        </select>

        {/* Status filter */}
        <select
          className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-600"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option>Tous</option>
          <option>Actif</option>
          <option>Inactif</option>
        </select>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Restaurant</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Cuisine</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Note</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Livraison</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Statut</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400 text-sm">
                    Aucun restaurant trouvé
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-orange-50/30 transition-colors group">
                    {/* Name + image */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                          {r.image
                            ? <img src={r.image} alt={r.nom} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">🍽️</div>
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 text-sm truncate">{r.nom}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[180px]">{r.adresse}</p>
                        </div>
                      </div>
                    </td>

                    {/* Cuisine */}
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 bg-orange-50 text-orange-700 rounded-lg text-xs font-medium">
                        {r.type_cuisine}
                      </span>
                    </td>

                    {/* Rating */}
                    <td className="px-5 py-4">
                      <Stars note={r.note_moyenne} />
                    </td>

                    {/* Delivery time */}
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {r.temps_livraison_estime} min
                      </span>
                    </td>

                    {/* Status toggle */}
                    <td className="px-5 py-4">
                      <button onClick={() => toggleStatus(r.id)} className="focus:outline-none">
                        <StatusBadge active={r.is_active} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(r)}
                          className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Modifier"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => openDelete(r)}
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          title="Supprimer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

        {/* Table footer */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
              {filtered.length !== restaurants.length && ` sur ${restaurants.length}`}
            </p>
            <p className="text-xs text-gray-400">
              {restaurants.filter(r => r.is_active).length} actifs · {restaurants.filter(r => !r.is_active).length} inactifs
            </p>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {modal === 'create' && (
        <Modal title="Ajouter un restaurant" onClose={() => setModal(null)}>
          <RestaurantForm
            initial={emptyForm}
            onSave={handleCreate}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {modal === 'edit' && selected && (
        <Modal title="Modifier le restaurant" onClose={() => { setModal(null); setSelected(null); }}>
          <RestaurantForm
            initial={selected}
            onSave={handleEdit}
            onCancel={() => { setModal(null); setSelected(null); }}
          />
        </Modal>
      )}

      {modal === 'delete' && selected && (
        <ConfirmDelete
          nom={selected.nom}
          onConfirm={handleDelete}
          onCancel={() => { setModal(null); setSelected(null); }}
        />
      )}
    </div>
  );
}

export default Restaurants;