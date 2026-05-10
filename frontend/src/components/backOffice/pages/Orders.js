import { useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUSES = [
  { key: "en_attente",     label: "En attente",      color: "bg-yellow-100 text-yellow-700 border-yellow-200",  dot: "bg-yellow-400" },
  { key: "confirmee",      label: "Confirmée",        color: "bg-blue-100 text-blue-700 border-blue-200",        dot: "bg-blue-400" },
  { key: "en_preparation", label: "En préparation",   color: "bg-purple-100 text-purple-700 border-purple-200",  dot: "bg-purple-400" },
  { key: "en_livraison",   label: "En livraison",     color: "bg-orange-100 text-orange-700 border-orange-200",  dot: "bg-orange-400" },
  { key: "livree",         label: "Livrée",           color: "bg-green-100 text-green-700 border-green-200",     dot: "bg-green-500" },
  { key: "annulee",        label: "Annulée",          color: "bg-red-100 text-red-500 border-red-200",           dot: "bg-red-400" },
];

const STATUS_FLOW = {
  en_attente:     ["confirmee", "annulee"],
  confirmee:      ["en_preparation", "annulee"],
  en_preparation: ["en_livraison", "annulee"],
  en_livraison:   ["livree", "annulee"],
  livree:         [],
  annulee:        [],
};

const RESTAURANTS = ["Le Gourmet", "Pizza Palace", "Sushi Bar", "Burger House"];

const INITIAL_ORDERS = [
  {
    id: "CMD-4521",
    client: { nom: "Amir Benali", email: "amir@email.com", tel: "+216 55 123 456" },
    restaurant: "Le Gourmet",
    date: "2025-05-09T14:32:00",
    total: 38.5,
    statut: "en_livraison",
    adresse_livraison: "12 Rue de la Liberté, Tunis",
    mode_paiement: "carte",
    items: [
      { nom: "Poulet Rôti", quantite: 2, prix_unitaire: 14.9, sous_total: 29.8 },
      { nom: "Salade César", quantite: 1, prix_unitaire: 8.7, sous_total: 8.7 },
    ],
  },
  {
    id: "CMD-4520",
    client: { nom: "Sonia Trabelsi", email: "sonia@email.com", tel: "+216 98 765 432" },
    restaurant: "Pizza Palace",
    date: "2025-05-09T13:10:00",
    total: 22.0,
    statut: "livree",
    adresse_livraison: "7 Avenue Habib Bourguiba, Sfax",
    mode_paiement: "livraison",
    items: [
      { nom: "Pizza Margherita", quantite: 2, prix_unitaire: 11.0, sous_total: 22.0 },
    ],
  },
  {
    id: "CMD-4519",
    client: { nom: "Karim Jomaa", email: "karim@email.com", tel: "+216 22 333 444" },
    restaurant: "Sushi Bar",
    date: "2025-05-09T11:55:00",
    total: 54.75,
    statut: "en_preparation",
    adresse_livraison: "3 Rue Ibn Khaldoun, Sousse",
    mode_paiement: "mobile_money",
    items: [
      { nom: "Sushi Mix 24 pcs", quantite: 1, prix_unitaire: 38.0, sous_total: 38.0 },
      { nom: "Edamame", quantite: 2, prix_unitaire: 5.0, sous_total: 10.0 },
      { nom: "Miso Soupe", quantite: 3, prix_unitaire: 2.25, sous_total: 6.75 },
    ],
  },
  {
    id: "CMD-4518",
    client: { nom: "Rania Chaouachi", email: "rania@email.com", tel: "+216 71 234 567" },
    restaurant: "Burger House",
    date: "2025-05-09T10:20:00",
    total: 17.9,
    statut: "annulee",
    adresse_livraison: "Résidence Les Jasmins, Nabeul",
    mode_paiement: "carte",
    items: [
      { nom: "Double Smash Burger", quantite: 1, prix_unitaire: 14.9, sous_total: 14.9 },
      { nom: "Frites", quantite: 1, prix_unitaire: 3.0, sous_total: 3.0 },
    ],
  },
  {
    id: "CMD-4517",
    client: { nom: "Mehdi Ouali", email: "mehdi@email.com", tel: "+216 50 987 654" },
    restaurant: "Le Gourmet",
    date: "2025-05-08T19:45:00",
    total: 31.2,
    statut: "confirmee",
    adresse_livraison: "18 Avenue de la Paix, Tunis",
    mode_paiement: "livraison",
    items: [
      { nom: "Tajine d'Agneau", quantite: 2, prix_unitaire: 15.6, sous_total: 31.2 },
    ],
  },
  {
    id: "CMD-4516",
    client: { nom: "Yasmine Bouzid", email: "yasmine@email.com", tel: "+216 23 456 789" },
    restaurant: "Sushi Bar",
    date: "2025-05-08T17:30:00",
    total: 42.0,
    statut: "en_attente",
    adresse_livraison: "5 Rue Moknine, Monastir",
    mode_paiement: "carte",
    items: [
      { nom: "Sashimi Saumon", quantite: 2, prix_unitaire: 18.0, sous_total: 36.0 },
      { nom: "Green Tea", quantite: 3, prix_unitaire: 2.0, sous_total: 6.0 },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getStatus = (key) => STATUSES.find((s) => s.key === key) || STATUSES[0];

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) +
    " · " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
};

const paymentIcons = {
  carte: { icon: "💳", label: "Carte bancaire" },
  livraison: { icon: "💵", label: "À la livraison" },
  mobile_money: { icon: "📱", label: "Mobile Money" },
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ statusKey }) {
  const s = getStatus(statusKey);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

// ─── Detail Drawer ─────────────────────────────────────────────────────────────

function DetailDrawer({ order, onClose, onStatusChange }) {
  const nextStatuses = STATUS_FLOW[order.statut] || [];
  const fraisLivraison = 3.0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 px-6 py-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <button onClick={onClose} className="text-white/60 hover:text-white transition text-xl leading-none">←</button>
            <span className="text-xs font-mono text-white/50">Détail commande</span>
            <div />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">{order.id}</h2>
          <p className="text-white/50 text-xs mt-1">{formatDate(order.date)}</p>
          <div className="mt-3">
            <StatusBadge statusKey={order.statut} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Client */}
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Client</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {order.client.nom.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{order.client.nom}</p>
                <p className="text-gray-400 text-xs">{order.client.email}</p>
                <p className="text-gray-400 text-xs">{order.client.tel}</p>
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Livraison</p>
            <div className="flex gap-2">
              <span className="text-lg mt-0.5">📍</span>
              <div>
                <p className="text-sm text-gray-700">{order.adresse_livraison}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span>{paymentIcons[order.mode_paiement]?.icon}</span>
                  <span className="text-xs text-gray-400">{paymentIcons[order.mode_paiement]?.label}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Restaurant */}
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Restaurant</p>
            <p className="text-sm font-medium text-gray-700">🍽 {order.restaurant}</p>
          </div>

          {/* Items */}
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Articles commandés</p>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 text-xs flex items-center justify-center font-bold">
                      {item.quantite}
                    </span>
                    <span className="text-sm text-gray-700">{item.nom}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-800">{item.sous_total.toFixed(3)}</span>
                    <span className="text-xs text-gray-400 ml-0.5">TND</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="px-6 py-4 border-b border-gray-100 space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Sous-total</span>
              <span>{(order.total - fraisLivraison).toFixed(3)} TND</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Frais de livraison</span>
              <span>{fraisLivraison.toFixed(3)} TND</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-dashed border-gray-200">
              <span>Total</span>
              <span className="text-orange-500">{order.total.toFixed(3)} TND</span>
            </div>
          </div>

          {/* Status change */}
          {nextStatuses.length > 0 && (
            <div className="px-6 py-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Changer le statut</p>
              <div className="flex flex-col gap-2">
                {nextStatuses.map((key) => {
                  const s = getStatus(key);
                  return (
                    <button
                      key={key}
                      onClick={() => { onStatusChange(order.id, key); onClose(); }}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition hover:opacity-80 ${s.color}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                      Marquer comme « {s.label} »
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

function Orders() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tous");
  const [filterRestaurant, setFilterRestaurant] = useState("Tous");
  const [filterDate, setFilterDate] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, statut: newStatus } : o)));
  };

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch =
      o.id.toLowerCase().includes(q) ||
      o.client.nom.toLowerCase().includes(q) ||
      o.restaurant.toLowerCase().includes(q);
    const matchStatus = filterStatus === "Tous" || o.statut === filterStatus;
    const matchRest = filterRestaurant === "Tous" || o.restaurant === filterRestaurant;
    const matchDate = !filterDate || o.date.startsWith(filterDate);
    return matchSearch && matchStatus && matchRest && matchDate;
  });

  // Stats
  const statCounts = STATUSES.reduce((acc, s) => {
    acc[s.key] = orders.filter((o) => o.statut === s.key).length;
    return acc;
  }, {});
  const totalRevenue = orders.filter((o) => o.statut === "livree").reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {selectedOrder && (
        <DetailDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Commandes</h1>
          <p className="text-gray-400 text-sm mt-0.5">Suivez et gérez toutes les commandes en temps réel</p>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">Total commandes</p>
          </div>
          <div className="bg-orange-50 rounded-2xl border border-orange-100 p-4">
            <p className="text-2xl font-bold text-orange-500">
              {(statCounts["en_attente"] || 0) + (statCounts["confirmee"] || 0) + (statCounts["en_preparation"] || 0) + (statCounts["en_livraison"] || 0)}
            </p>
            <p className="text-xs text-orange-400 mt-0.5">En cours</p>
          </div>
          <div className="bg-green-50 rounded-2xl border border-green-100 p-4">
            <p className="text-2xl font-bold text-green-600">{statCounts["livree"] || 0}</p>
            <p className="text-xs text-green-400 mt-0.5">Livrées</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-2xl font-bold text-gray-900">{totalRevenue.toFixed(1)}</p>
            <p className="text-xs text-gray-400 mt-0.5">Revenu TND</p>
          </div>
        </div>

        {/* Status quick-filter pills */}
        <div className="flex gap-2 flex-wrap mb-4">
          <button
            onClick={() => setFilterStatus("Tous")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
              filterStatus === "Tous"
                ? "bg-slate-800 text-white border-slate-800"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
            }`}
          >
            Tous ({orders.length})
          </button>
          {STATUSES.map((s) => (
            <button
              key={s.key}
              onClick={() => setFilterStatus(filterStatus === s.key ? "Tous" : s.key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                filterStatus === s.key ? `${s.color} opacity-100` : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
              {s.label} ({statCounts[s.key] || 0})
            </button>
          ))}
        </div>

        {/* Search & filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="N° commande, client, restaurant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <select
            value={filterRestaurant}
            onChange={(e) => setFilterRestaurant(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <option value="Tous">Tous les restaurants</option>
            {RESTAURANTS.map((r) => <option key={r}>{r}</option>)}
          </select>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          />
          {(search || filterRestaurant !== "Tous" || filterDate || filterStatus !== "Tous") && (
            <button
              onClick={() => { setSearch(""); setFilterRestaurant("Tous"); setFilterDate(""); setFilterStatus("Tous"); }}
              className="text-xs text-gray-400 hover:text-gray-600 px-3 py-2 border border-gray-200 rounded-lg whitespace-nowrap"
            >
              Réinitialiser
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  {["N° Commande", "Client", "Restaurant", "Date", "Total", "Paiement", "Statut", ""].map((h) => (
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
                      <div className="text-5xl mb-3">📦</div>
                      <p className="text-sm font-medium text-gray-300">Aucune commande trouvée</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-orange-50/20 transition-colors cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      {/* ID */}
                      <td className="px-4 py-3">
                        <span className="font-mono font-semibold text-slate-700 text-xs bg-slate-100 px-2 py-1 rounded">
                          {order.id}
                        </span>
                      </td>

                      {/* Client */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {order.client.nom.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-700 whitespace-nowrap">{order.client.nom}</span>
                        </div>
                      </td>

                      {/* Restaurant */}
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{order.restaurant}</td>

                      {/* Date */}
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{formatDate(order.date)}</td>

                      {/* Total */}
                      <td className="px-4 py-3 font-bold text-gray-800 whitespace-nowrap">
                        {order.total.toFixed(3)} <span className="text-gray-400 font-normal text-xs">TND</span>
                      </td>

                      {/* Payment */}
                      <td className="px-4 py-3">
                        <span className="text-base" title={paymentIcons[order.mode_paiement]?.label}>
                          {paymentIcons[order.mode_paiement]?.icon}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <StatusDropdown
                          order={order}
                          onStatusChange={handleStatusChange}
                        />
                      </td>

                      {/* Detail arrow */}
                      <td className="px-4 py-3 text-right">
                        <span className="text-gray-300 group-hover:text-orange-400 transition text-lg">›</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                {filtered.length} commande{filtered.length > 1 ? "s" : ""}
                {orders.length !== filtered.length && ` sur ${orders.length}`}
              </p>
              <p className="text-xs text-gray-400">
                Cliquer sur une ligne pour voir le détail
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Inline Status Dropdown ───────────────────────────────────────────────────

function StatusDropdown({ order, onStatusChange }) {
  const [open, setOpen] = useState(false);
  const next = STATUS_FLOW[order.statut] || [];

  if (next.length === 0) {
    return <StatusBadge statusKey={order.statut} />;
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="group"
      >
        <StatusBadge statusKey={order.statut} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-gray-100 rounded-xl shadow-xl py-1 min-w-max">
            {next.map((key) => {
              const s = getStatus(key);
              return (
                <button
                  key={key}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(order.id, key);
                    setOpen(false);
                  }}
                  className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-medium hover:bg-gray-50 transition text-left`}
                >
                  <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                  <span className="text-gray-700">{s.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default Orders;