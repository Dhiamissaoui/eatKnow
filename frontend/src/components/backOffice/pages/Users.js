import { useState } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_USERS = [
  {
    id: 1,
    nom: "Amir Benali",
    email: "amir.benali@email.com",
    telephone: "+216 55 123 456",
    adresse: "12 Rue de la Liberté, Tunis",
    role: "client",
    created_at: "2024-01-15T10:30:00",
    orders: [
      { id: "CMD-4521", restaurant: "Le Gourmet", date: "2025-05-09", total: 38.5, statut: "livree" },
      { id: "CMD-4380", restaurant: "Pizza Palace", date: "2025-04-20", total: 22.0, statut: "livree" },
      { id: "CMD-4210", restaurant: "Sushi Bar", date: "2025-03-14", total: 54.75, statut: "annulee" },
    ],
  },
  {
    id: 2,
    nom: "Sonia Trabelsi",
    email: "sonia.trabelsi@email.com",
    telephone: "+216 98 765 432",
    adresse: "7 Avenue Habib Bourguiba, Sfax",
    role: "client",
    created_at: "2024-03-02T09:00:00",
    orders: [
      { id: "CMD-4520", restaurant: "Pizza Palace", date: "2025-05-09", total: 22.0, statut: "livree" },
      { id: "CMD-4410", restaurant: "Burger House", date: "2025-04-05", total: 17.9, statut: "livree" },
    ],
  },
  {
    id: 3,
    nom: "Karim Jomaa",
    email: "karim.jomaa@email.com",
    telephone: "+216 22 333 444",
    adresse: "3 Rue Ibn Khaldoun, Sousse",
    role: "client",
    created_at: "2024-06-18T14:20:00",
    orders: [
      { id: "CMD-4519", restaurant: "Sushi Bar", date: "2025-05-09", total: 54.75, statut: "en_preparation" },
    ],
  },
  {
    id: 4,
    nom: "Rania Chaouachi",
    email: "rania.chaouachi@email.com",
    telephone: "+216 71 234 567",
    adresse: "Résidence Les Jasmins, Nabeul",
    role: "client",
    created_at: "2024-08-25T11:10:00",
    orders: [
      { id: "CMD-4518", restaurant: "Burger House", date: "2025-05-09", total: 17.9, statut: "annulee" },
      { id: "CMD-4300", restaurant: "Le Gourmet", date: "2025-03-01", total: 31.2, statut: "livree" },
      { id: "CMD-4100", restaurant: "Pizza Palace", date: "2025-01-22", total: 11.5, statut: "livree" },
      { id: "CMD-3980", restaurant: "Sushi Bar", date: "2024-12-10", total: 42.0, statut: "livree" },
    ],
  },
  {
    id: 5,
    nom: "Mehdi Ouali",
    email: "mehdi.ouali@email.com",
    telephone: "+216 50 987 654",
    adresse: "18 Avenue de la Paix, Tunis",
    role: "client",
    created_at: "2024-11-03T16:45:00",
    orders: [
      { id: "CMD-4517", restaurant: "Le Gourmet", date: "2025-05-08", total: 31.2, statut: "confirmee" },
    ],
  },
  {
    id: 6,
    nom: "Yasmine Bouzid",
    email: "yasmine.bouzid@email.com",
    telephone: "+216 23 456 789",
    adresse: "5 Rue Moknine, Monastir",
    role: "client",
    created_at: "2025-01-10T08:00:00",
    orders: [
      { id: "CMD-4516", restaurant: "Sushi Bar", date: "2025-05-08", total: 42.0, statut: "en_attente" },
    ],
  },
  {
    id: 7,
    nom: "Admin Principal",
    email: "admin@foodmarketplace.tn",
    telephone: "+216 71 000 001",
    adresse: "Siège Social, Tunis",
    role: "admin",
    created_at: "2023-12-01T00:00:00",
    orders: [],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

const statusMeta = {
  livree:         { label: "Livrée",          color: "bg-green-100 text-green-700" },
  annulee:        { label: "Annulée",          color: "bg-red-100 text-red-500" },
  en_attente:     { label: "En attente",       color: "bg-yellow-100 text-yellow-700" },
  confirmee:      { label: "Confirmée",        color: "bg-blue-100 text-blue-700" },
  en_preparation: { label: "En préparation",   color: "bg-purple-100 text-purple-700" },
  en_livraison:   { label: "En livraison",     color: "bg-orange-100 text-orange-700" },
};

const avatarGradients = [
  "from-orange-400 to-rose-500",
  "from-violet-400 to-indigo-500",
  "from-teal-400 to-cyan-500",
  "from-amber-400 to-orange-500",
  "from-pink-400 to-fuchsia-500",
  "from-green-400 to-emerald-500",
  "from-sky-400 to-blue-500",
];

const getGradient = (id) => avatarGradients[id % avatarGradients.length];

// ─── User Profile Drawer ───────────────────────────────────────────────────────

function ProfileDrawer({ user, onClose }) {
  const totalSpent = user.orders
    .filter((o) => o.statut === "livree")
    .reduce((sum, o) => sum + o.total, 0);

  const deliveredCount = user.orders.filter((o) => o.statut === "livree").length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md shadow-2xl flex flex-col overflow-hidden">

        {/* Hero Header */}
        <div className={`bg-gradient-to-br ${getGradient(user.id)} px-6 pt-10 pb-6 text-white`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition text-white text-sm"
          >
            ✕
          </button>
          <div className="flex items-end gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold shadow-lg">
              {user.nom.charAt(0)}
            </div>
            <div className="pb-1">
              <h2 className="text-xl font-bold leading-tight">{user.nom}</h2>
              <p className="text-white/70 text-xs mt-0.5">{user.email}</p>
              <span className={`inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                user.role === "admin" ? "bg-white/30 text-white" : "bg-white/20 text-white/90"
              }`}>
                {user.role === "admin" ? "👑 Admin" : "👤 Client"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Stats row */}
          <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
            {[
              { label: "Commandes", value: user.orders.length },
              { label: "Livrées", value: deliveredCount },
              { label: "Total TND", value: totalSpent.toFixed(1) },
            ].map((s) => (
              <div key={s.label} className="px-4 py-4 text-center">
                <p className="text-xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="px-6 py-4 border-b border-gray-100 space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Informations personnelles</p>
            {[
              { icon: "📞", label: user.telephone },
              { icon: "📍", label: user.adresse || "—" },
              { icon: "📅", label: `Inscrit le ${formatDate(user.created_at)}` },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <span className="text-base w-6 text-center">{row.icon}</span>
                <span className="text-sm text-gray-600">{row.label}</span>
              </div>
            ))}
          </div>

          {/* Order history */}
          <div className="px-6 py-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Historique d'achats
            </p>
            {user.orders.length === 0 ? (
              <div className="text-center py-8 text-gray-300">
                <div className="text-4xl mb-2">🛍</div>
                <p className="text-sm">Aucune commande</p>
              </div>
            ) : (
              <div className="space-y-2">
                {user.orders.map((o) => {
                  const meta = statusMeta[o.statut] || { label: o.statut, color: "bg-gray-100 text-gray-500" };
                  return (
                    <div key={o.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">
                            {o.id}
                          </span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${meta.color}`}>
                            {meta.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{o.restaurant} · {o.date}</p>
                      </div>
                      <p className="font-bold text-gray-800 text-sm whitespace-nowrap">
                        {o.total.toFixed(3)} <span className="text-gray-400 font-normal text-xs">TND</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────

function ConfirmModal({ user, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 text-center">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🗑</div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Supprimer l'utilisateur</h3>
        <p className="text-gray-500 text-sm mb-6">
          Êtes-vous sûr de vouloir supprimer{" "}
          <span className="font-semibold text-gray-700">{user.nom}</span> ?
          Cette action supprimera également toutes ses commandes.
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

// ─── Main Component ───────────────────────────────────────────────────────────

function Users() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("Tous");
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [view, setView] = useState("grid"); // "grid" | "table"

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      u.nom.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.telephone.includes(q);
    const matchRole = filterRole === "Tous" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const handleDelete = () => {
    setUsers(users.filter((u) => u.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const stats = {
    total: users.length,
    clients: users.filter((u) => u.role === "client").length,
    admins: users.filter((u) => u.role === "admin").length,
    newThisMonth: users.filter((u) => {
      const d = new Date(u.created_at);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {selectedUser && (
        <ProfileDrawer user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
      {deleteTarget && (
        <ConfirmModal
          user={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
            <p className="text-gray-400 text-sm mt-0.5">Consultez et gérez tous les comptes</p>
          </div>
          {/* View toggle */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 self-start sm:self-auto">
            {[{ k: "grid", icon: "▦" }, { k: "table", icon: "☰" }].map(({ k, icon }) => (
              <button
                key={k}
                onClick={() => setView(k)}
                className={`px-3 py-1.5 rounded-lg text-sm transition font-medium ${
                  view === k ? "bg-slate-800 text-white shadow" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total utilisateurs", value: stats.total, bg: "bg-white", text: "text-gray-900" },
            { label: "Clients", value: stats.clients, bg: "bg-orange-50", text: "text-orange-500" },
            { label: "Admins", value: stats.admins, bg: "bg-slate-50", text: "text-slate-700" },
            { label: "Nouveaux ce mois", value: stats.newThisMonth, bg: "bg-green-50", text: "text-green-600" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-2xl border border-gray-100 p-4`}>
              <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Rechercher par nom, email, téléphone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg self-start sm:self-auto">
            {["Tous", "client", "admin"].map((r) => (
              <button
                key={r}
                onClick={() => setFilterRole(r)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition capitalize ${
                  filterRole === r ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {r === "Tous" ? "Tous" : r === "admin" ? "👑 Admins" : "👤 Clients"}
              </button>
            ))}
          </div>
        </div>

        {/* ── GRID VIEW ── */}
        {view === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.length === 0 ? (
              <div className="col-span-3 text-center py-16 text-gray-300">
                <div className="text-5xl mb-3">👥</div>
                <p className="text-sm font-medium">Aucun utilisateur trouvé</p>
              </div>
            ) : (
              filtered.map((user) => {
                const totalSpent = user.orders
                  .filter((o) => o.statut === "livree")
                  .reduce((sum, o) => sum + o.total, 0);
                return (
                  <div
                    key={user.id}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                  >
                    {/* Card top strip */}
                    <div className={`h-2 bg-gradient-to-r ${getGradient(user.id)}`} />

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${getGradient(user.id)} flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0`}>
                            {user.nom.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm leading-tight">{user.nom}</p>
                            <p className="text-gray-400 text-xs mt-0.5 truncate max-w-36">{user.email}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${
                          user.role === "admin"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-orange-50 text-orange-500"
                        }`}>
                          {user.role === "admin" ? "👑 Admin" : "Client"}
                        </span>
                      </div>

                      <div className="space-y-1.5 mb-4">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>📞</span><span>{user.telephone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>📍</span><span className="truncate">{user.adresse || "—"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>📅</span><span>Inscrit le {formatDate(user.created_at)}</span>
                        </div>
                      </div>

                      {/* Mini stats */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                          <p className="text-base font-bold text-gray-800">{user.orders.length}</p>
                          <p className="text-xs text-gray-400">Commandes</p>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-2.5 text-center">
                          <p className="text-base font-bold text-orange-500">{totalSpent.toFixed(1)}</p>
                          <p className="text-xs text-gray-400">TND dépensés</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition"
                        >
                          Voir le profil
                        </button>
                        <button
                          onClick={() => setDeleteTarget(user)}
                          className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-xl transition border border-gray-100"
                          title="Supprimer"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── TABLE VIEW ── */}
        {view === "table" && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    {["Utilisateur", "Téléphone", "Adresse", "Rôle", "Inscription", "Commandes", "Total dépensé", ""].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-16">
                        <div className="text-5xl mb-3">👥</div>
                        <p className="text-sm font-medium text-gray-300">Aucun utilisateur trouvé</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((user) => {
                      const totalSpent = user.orders
                        .filter((o) => o.statut === "livree")
                        .reduce((sum, o) => sum + o.total, 0);
                      return (
                        <tr
                          key={user.id}
                          className="hover:bg-orange-50/20 transition-colors cursor-pointer"
                          onClick={() => setSelectedUser(user)}
                        >
                          {/* User */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getGradient(user.id)} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                                {user.nom.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800 whitespace-nowrap">{user.nom}</p>
                                <p className="text-gray-400 text-xs">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{user.telephone}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs max-w-xs truncate">{user.adresse || "—"}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                              user.role === "admin"
                                ? "bg-slate-100 text-slate-600"
                                : "bg-orange-50 text-orange-500"
                            }`}>
                              {user.role === "admin" ? "👑 Admin" : "👤 Client"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{formatDate(user.created_at)}</td>
                          <td className="px-4 py-3 font-semibold text-gray-700 text-center">{user.orders.length}</td>
                          <td className="px-4 py-3 font-bold text-gray-800 whitespace-nowrap">
                            {totalSpent.toFixed(3)} <span className="text-gray-400 font-normal text-xs">TND</span>
                          </td>
                          <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setSelectedUser(user)}
                                className="p-2 text-gray-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition"
                                title="Voir le profil"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => setDeleteTarget(user)}
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
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {filtered.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  {filtered.length} utilisateur{filtered.length > 1 ? "s" : ""}
                  {users.length !== filtered.length && ` sur ${users.length}`}
                </p>
                <p className="text-xs text-gray-400">Cliquer sur une ligne pour voir le profil</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;