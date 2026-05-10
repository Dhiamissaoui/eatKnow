// Overview.js
import { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// ── Mock data ────────────────────────────────────────────────────────────────

const caData = [
  { mois: 'Jan', ca: 1200000 },
  { mois: 'Fév', ca: 1850000 },
  { mois: 'Mar', ca: 1600000 },
  { mois: 'Avr', ca: 2100000 },
  { mois: 'Mai', ca: 1900000 },
  { mois: 'Jun', ca: 2450000 },
  { mois: 'Jul', ca: 2800000 },
  { mois: 'Aoû', ca: 2600000 },
  { mois: 'Sep', ca: 3100000 },
  { mois: 'Oct', ca: 2900000 },
  { mois: 'Nov', ca: 3400000 },
  { mois: 'Déc', ca: 3800000 },
];

const commandesData = [
  { periode: 'Sem 1', commandes: 34 },
  { periode: 'Sem 2', commandes: 48 },
  { periode: 'Sem 3', commandes: 41 },
  { periode: 'Sem 4', commandes: 67 },
  { periode: 'Sem 5', commandes: 53 },
  { periode: 'Sem 6', commandes: 72 },
  { periode: 'Sem 7', commandes: 89 },
  { periode: 'Sem 8', commandes: 78 },
];

const ventesParResto = [
  { name: 'Le Gourmet',    value: 35, color: '#f97316' },
  { name: 'Pizza House',   value: 25, color: '#fb923c' },
  { name: 'Délice Asie',   value: 20, color: '#fdba74' },
  { name: 'Burger King',   value: 12, color: '#fed7aa' },
  { name: 'Autres',        value: 8,  color: '#ffedd5' },
];

const top5 = [
  { rang: 1, nom: 'Thiéboudienne Royal',  resto: 'Le Gourmet',  vendus: 312, prix: '8 500 FCFA' },
  { rang: 2, nom: 'Pizza Margherita',     resto: 'Pizza House', vendus: 278, prix: '6 000 FCFA' },
  { rang: 3, nom: 'Sushi Deluxe',         resto: 'Délice Asie', vendus: 241, prix: '12 000 FCFA' },
  { rang: 4, nom: 'Yassa Poulet',         resto: 'Le Gourmet',  vendus: 198, prix: '7 000 FCFA' },
  { rang: 5, nom: 'Burger Classic',       resto: 'Burger King', vendus: 175, prix: '4 500 FCFA' },
];

const flop5 = [
  { rang: 1, nom: 'Salade Niçoise',       resto: 'Le Gourmet',  vendus: 12,  prix: '5 000 FCFA' },
  { rang: 2, nom: 'Soupe Miso',           resto: 'Délice Asie', vendus: 18,  prix: '3 500 FCFA' },
  { rang: 3, nom: 'Pizza Végétarienne',   resto: 'Pizza House', vendus: 23,  prix: '5 500 FCFA' },
  { rang: 4, nom: 'Jus de Bissap',        resto: 'Le Gourmet',  vendus: 27,  prix: '1 500 FCFA' },
  { rang: 5, nom: 'Wrap Thon',            resto: 'Burger King', vendus: 31,  prix: '4 000 FCFA' },
];

const recentActivity = [
  { color: 'bg-green-500',  text: 'Nouvelle commande #1238 — Jean Dupont',       time: 'Il y a 3 min' },
  { color: 'bg-orange-500', text: 'Restaurant "Délice Asie" mis à jour',          time: 'Il y a 28 min' },
  { color: 'bg-blue-500',   text: 'Nouvel utilisateur inscrit — marie@mail.com',  time: 'Il y a 1h' },
  { color: 'bg-purple-500', text: 'Commande #1237 livrée',                        time: 'Il y a 2h' },
  { color: 'bg-red-400',    text: 'Commande #1236 annulée',                       time: 'Il y a 3h' },
];

// ── Helper ───────────────────────────────────────────────────────────────────

const fmt = (n) => n.toLocaleString('fr-FR') + ' FCFA';

const CustomTooltipCA = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-orange-100 rounded-xl px-4 py-3 shadow-lg text-sm">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        <p className="text-orange-500 font-bold">{fmt(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const CustomTooltipBar = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-orange-100 rounded-xl px-4 py-3 shadow-lg text-sm">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        <p className="text-orange-500 font-bold">{payload[0].value} commandes</p>
      </div>
    );
  }
  return null;
};

// ── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, subPositive, icon, iconBg }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-extrabold text-gray-800 mt-1 leading-tight">{value}</p>
        </div>
        <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
      </div>
      <p className={`text-xs font-medium ${subPositive ? 'text-green-500' : 'text-gray-400'}`}>{sub}</p>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
      <span className="w-1 h-5 bg-orange-500 rounded-full inline-block" />
      {children}
    </h2>
  );
}

function RankBadge({ n, good }) {
  const colors = good
    ? ['bg-yellow-400 text-yellow-900', 'bg-gray-200 text-gray-600', 'bg-orange-300 text-orange-900', 'bg-gray-100 text-gray-500', 'bg-gray-100 text-gray-500']
    : ['bg-red-100 text-red-600', 'bg-red-50 text-red-400', 'bg-gray-50 text-gray-400', 'bg-gray-50 text-gray-400', 'bg-gray-50 text-gray-400'];
  return (
    <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center flex-shrink-0 ${colors[n - 1]}`}>
      {n}
    </span>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

function Overview() {
  const [caRange, setCaRange] = useState('annee');

  const kpis = [
    {
      label: 'Ventes du jour',
      value: '124 500 FCFA',
      sub: '↑ 18% vs hier',
      subPositive: true,
      iconBg: 'bg-green-100',
      icon: (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Ventes du mois',
      value: '2 450 000 FCFA',
      sub: '↑ 12% vs mois dernier',
      subPositive: true,
      iconBg: 'bg-orange-100',
      icon: (
        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      label: "Ventes de l'année",
      value: '29 400 000 FCFA',
      sub: '↑ 34% vs année préc.',
      subPositive: true,
      iconBg: 'bg-yellow-100',
      icon: (
        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      label: 'Commandes',
      value: '156',
      sub: '↑ 8% vs mois dernier',
      subPositive: true,
      iconBg: 'bg-blue-100',
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      label: 'Clients',
      value: '1 234',
      sub: '↑ 5% nouveaux ce mois',
      subPositive: true,
      iconBg: 'bg-purple-100',
      icon: (
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      label: 'Restaurants actifs',
      value: '10 / 12',
      sub: '+2 nouveaux ce mois',
      subPositive: true,
      iconBg: 'bg-red-100',
      icon: (
        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">

      {/* ── KPI cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      {/* ── Charts row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* CA evolution */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <SectionTitle>Évolution du chiffre d'affaires</SectionTitle>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1 text-xs">
              {['mois', 'trimestre', 'annee'].map((r) => (
                <button
                  key={r}
                  onClick={() => setCaRange(r)}
                  className={`px-3 py-1 rounded-md font-medium transition-all ${caRange === r ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {r === 'mois' ? 'Mois' : r === 'trimestre' ? 'Trimestre' : 'Année'}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={caData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="caGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f97316" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
              <Tooltip content={<CustomTooltipCA />} />
              <Line
                type="monotone"
                dataKey="ca"
                stroke="#f97316"
                strokeWidth={2.5}
                dot={{ fill: '#f97316', r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#f97316' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sales by restaurant — Pie */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <SectionTitle>Ventes par restaurant</SectionTitle>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={ventesParResto}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {ventesParResto.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <ul className="mt-3 space-y-2">
            {ventesParResto.map((r) => (
              <li key={r.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: r.color }} />
                  <span className="text-gray-600 truncate max-w-[130px]">{r.name}</span>
                </div>
                <span className="font-semibold text-gray-700">{r.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Orders histogram ───────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <SectionTitle>Commandes par période</SectionTitle>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={commandesData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="periode" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltipBar />} cursor={{ fill: '#fff7ed' }} />
            <Bar dataKey="commandes" fill="#f97316" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Product performance + recent activity ──────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Top 5 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <SectionTitle>🏆 Top 5 — Plats les plus vendus</SectionTitle>
          <ul className="space-y-3">
            {top5.map((p) => (
              <li key={p.rang} className="flex items-center gap-3">
                <RankBadge n={p.rang} good />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{p.nom}</p>
                  <p className="text-xs text-gray-400 truncate">{p.resto}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-orange-500">{p.vendus}</p>
                  <p className="text-xs text-gray-400">vendus</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Flop 5 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <SectionTitle>📉 Flop 5 — Plats les moins vendus</SectionTitle>
          <ul className="space-y-3">
            {flop5.map((p) => (
              <li key={p.rang} className="flex items-center gap-3">
                <RankBadge n={p.rang} good={false} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{p.nom}</p>
                  <p className="text-xs text-gray-400 truncate">{p.resto}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-red-400">{p.vendus}</p>
                  <p className="text-xs text-gray-400">vendus</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <SectionTitle>Activité récente</SectionTitle>
          <ul className="space-y-4">
            {recentActivity.map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 leading-snug">{a.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}

export default Overview;