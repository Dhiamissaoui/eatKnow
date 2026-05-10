import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const revenueData = [
  { mois: "Jan", ca: 3200 },
  { mois: "Fév", ca: 4100 },
  { mois: "Mar", ca: 3750 },
  { mois: "Avr", ca: 5200 },
  { mois: "Mai", ca: 4800 },
  { mois: "Jun", ca: 6100 },
  { mois: "Jul", ca: 7400 },
  { mois: "Aoû", ca: 6900 },
  { mois: "Sep", ca: 5600 },
  { mois: "Oct", ca: 7100 },
  { mois: "Nov", ca: 8200 },
  { mois: "Déc", ca: 9500 },
];

const ordersData = [
  { periode: "Lun", commandes: 42 },
  { periode: "Mar", commandes: 58 },
  { periode: "Mer", commandes: 35 },
  { periode: "Jeu", commandes: 67 },
  { periode: "Ven", commandes: 91 },
  { periode: "Sam", commandes: 110 },
  { periode: "Dim", commandes: 74 },
];

const restaurantSales = [
  { name: "Le Gourmet",    value: 32, color: "#f97316" },
  { name: "Pizza Palace",  value: 25, color: "#fb923c" },
  { name: "Sushi Bar",     value: 22, color: "#fdba74" },
  { name: "Burger House",  value: 13, color: "#fed7aa" },
  { name: "Autres",        value: 8,  color: "#ffedd5" },
];

const topDishes = [
  { nom: "Double Smash Burger", restaurant: "Burger House", ventes: 312, image: "🍔" },
  { nom: "Pizza Margherita",    restaurant: "Pizza Palace",  ventes: 287, image: "🍕" },
  { nom: "Poulet Rôti",         restaurant: "Le Gourmet",    ventes: 241, image: "🍗" },
  { nom: "Sushi Mix 24 pcs",    restaurant: "Sushi Bar",     ventes: 198, image: "🍱" },
  { nom: "Tajine d'Agneau",     restaurant: "Le Gourmet",    ventes: 174, image: "🥘" },
];

const flopDishes = [
  { nom: "Salade Niçoise",   restaurant: "Le Gourmet",   ventes: 12, image: "🥗" },
  { nom: "Soupe de Poisson", restaurant: "Sushi Bar",    ventes: 9,  image: "🍲" },
  { nom: "Bruschetta",       restaurant: "Pizza Palace", ventes: 7,  image: "🥖" },
  { nom: "Tarte Tatin",      restaurant: "Le Gourmet",   ventes: 5,  image: "🥧" },
  { nom: "Jus de Céleri",    restaurant: "Burger House", ventes: 3,  image: "🥤" },
];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label, unit = "TND" }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2 text-sm">
        <p className="text-gray-500 text-xs mb-1">{label}</p>
        <p className="font-bold text-gray-800">
          {payload[0].value.toLocaleString("fr-FR")}{" "}
          <span className="font-normal text-gray-400 text-xs">{unit}</span>
        </p>
      </div>
    );
  }
  return null;
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ label, value, unit, icon, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 leading-tight">
          {typeof value === "number" ? value.toLocaleString("fr-FR") : value}
          {unit && <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h2 className="text-sm font-bold text-gray-700 mb-4">{title}</h2>
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function Stats() {
  const [revenueFilter, setRevenueFilter] = useState("année");
  const [ordersFilter, setOrdersFilter] = useState("semaine");

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Statistiques</h1>
          <p className="text-gray-400 text-sm mt-0.5">Vue d'ensemble des performances de la plateforme</p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <KpiCard label="Ventes du jour"         value={1240}   unit="TND" icon="📅" color="bg-orange-50" />
          <KpiCard label="Ventes du mois"          value={38500}  unit="TND" icon="📆" color="bg-amber-50" />
          <KpiCard label="Ventes de l'année"       value={71200}  unit="TND" icon="📊" color="bg-green-50" />
          <KpiCard label="Commandes totales"        value={1842}   unit=""    icon="🧾" color="bg-blue-50" />
          <KpiCard label="Clients inscrits"         value={326}    unit=""    icon="👥" color="bg-violet-50" />
          <KpiCard label="Restaurants actifs"       value={12}     unit=""    icon="🍽" color="bg-rose-50" />
        </div>

        {/* Revenue Line Chart */}
        <div className="mb-4">
          <Section title="Évolution du chiffre d'affaires">
            <div className="flex items-center gap-2 mb-4">
              {["semaine", "mois", "année"].map((f) => (
                <button
                  key={f}
                  onClick={() => setRevenueFilter(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition capitalize ${
                    revenueFilter === f
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={revenueData} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="mois" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip unit="TND" />} />
                <Line
                  type="monotone"
                  dataKey="ca"
                  stroke="#f97316"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#f97316", strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: "#f97316" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Section>
        </div>

        {/* Orders Bar + Pie side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

          {/* Bar Chart – orders by period */}
          <Section title="Commandes par période">
            <div className="flex items-center gap-2 mb-4">
              {["semaine", "mois"].map((f) => (
                <button
                  key={f}
                  onClick={() => setOrdersFilter(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition capitalize ${
                    ordersFilter === f
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ordersData} margin={{ top: 4, right: 8, bottom: 0, left: -10 }} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="periode" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip unit="cmd" />} />
                <Bar dataKey="commandes" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Section>

          {/* Pie Chart – sales by restaurant */}
          <Section title="Répartition des ventes par restaurant">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie
                    data={restaurantSales}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {restaurantSales.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v}%`, "Part"]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2 w-full">
                {restaurantSales.map((r) => (
                  <div key={r.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: r.color }} />
                      <span className="text-xs text-gray-600 truncate">{r.name}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${r.value}%`, backgroundColor: r.color }} />
                      </div>
                      <span className="text-xs font-semibold text-gray-700 w-8 text-right">{r.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </div>

        {/* Top 5 / Flop 5 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Top 5 */}
          <Section title="🏆 Top 5 — Plats les plus vendus">
            <div className="space-y-2">
              {topDishes.map((dish, i) => (
                <div key={dish.nom} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    i === 0 ? "bg-yellow-400 text-white" :
                    i === 1 ? "bg-gray-300 text-white" :
                    i === 2 ? "bg-amber-600 text-white" :
                    "bg-gray-100 text-gray-500"
                  }`}>
                    {i + 1}
                  </span>
                  <span className="text-xl">{dish.image}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{dish.nom}</p>
                    <p className="text-xs text-gray-400">{dish.restaurant}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-orange-500">{dish.ventes}</p>
                    <p className="text-xs text-gray-400">ventes</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Flop 5 */}
          <Section title="📉 Flop 5 — Plats les moins vendus">
            <div className="space-y-2">
              {flopDishes.map((dish, i) => (
                <div key={dish.nom} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition">
                  <span className="w-6 h-6 rounded-full bg-red-50 text-red-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-xl">{dish.image}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{dish.nom}</p>
                    <p className="text-xs text-gray-400">{dish.restaurant}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-red-400">{dish.ventes}</p>
                    <p className="text-xs text-gray-400">ventes</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

        </div>
      </div>
    </div>
  );
}

export default Stats;