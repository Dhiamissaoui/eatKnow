// Dashboard.js
import { useState } from 'react';
import { useNavigate, Outlet, useLocation, NavLink } from 'react-router-dom';

// ── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  Overview: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
    </svg>
  ),
  Restaurants: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Dishes: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Orders: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  Users: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Stats: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Settings: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Logout: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  Menu: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
    </svg>
  ),
  Bell: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
};

// ── Navigation items — paths match App.js nested routes ──────────────────────
const menuItems = [
  { id: 'overview',    label: 'Aperçu',        path: '/Dashboard',             Icon: Icons.Overview    },
  { id: 'restaurants', label: 'Restaurants',   path: '/Dashboard/restaurants', Icon: Icons.Restaurants },
  { id: 'dishes',      label: 'Plats',          path: '/Dashboard/dishes',      Icon: Icons.Dishes      },
  { id: 'orders',      label: 'Commandes',     path: '/Dashboard/orders',      Icon: Icons.Orders      },
  { id: 'users',       label: 'Utilisateurs',  path: '/Dashboard/users',       Icon: Icons.Users       },
  { id: 'stats',       label: 'Statistiques',  path: '/Dashboard/stats',       Icon: Icons.Stats       },
  { id: 'settings',    label: 'Paramètres',    path: '/Dashboard/settings',    Icon: Icons.Settings    },
];

// ── Page title derived from current URL ──────────────────────────────────────
const pageTitles = {
  '/Dashboard':             'Aperçu',
  '/Dashboard/restaurants': 'Restaurants',
  '/Dashboard/dishes':      'Plats',
  '/Dashboard/orders':      'Commandes',
  '/Dashboard/users':       'Utilisateurs',
  '/Dashboard/stats':       'Statistiques',
  '/Dashboard/settings':    'Paramètres',
};

// ── Dashboard shell ───────────────────────────────────────────────────────────
function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  const currentTitle = pageTitles[location.pathname] ?? 'Dashboard';

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside
        className={`
          fixed left-0 top-0 h-full bg-white shadow-lg z-30
          flex flex-col border-r border-gray-100
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-[72px]' : 'w-60'}
        `}
      >
        {/* Logo + collapse toggle */}
        <div className="flex items-center justify-between px-4 border-b border-gray-100 min-h-[72px]">
          {!collapsed && (
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent select-none whitespace-nowrap">
              eatKnow Admin
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl hover:bg-orange-50 text-gray-400 hover:text-orange-500 transition-colors ml-auto flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            <Icons.Menu />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
          <ul className="space-y-1 px-2">
            {menuItems.map(({ id, label, path, Icon }) => (
              <li key={id} className="relative">
                <NavLink
                  to={path}
                  end={path === '/Dashboard'} // exact match only for the index route
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative
                     ${isActive
                       ? 'bg-orange-50 text-orange-600 font-semibold'
                       : 'text-gray-500 hover:bg-gray-50 hover:text-orange-500'
                     }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Left active indicator bar */}
                      {isActive && (
                        <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-500 rounded-r-full" />
                      )}

                      {/* Icon */}
                      <span className={`flex-shrink-0 transition-colors ${isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-orange-400'}`}>
                        <Icon />
                      </span>

                      {/* Label or tooltip when collapsed */}
                      {!collapsed ? (
                        <span className="text-sm truncate">{label}</span>
                      ) : (
                        <span className="
                          absolute left-full ml-3 px-2 py-1 rounded-lg
                          bg-gray-800 text-white text-xs whitespace-nowrap
                          opacity-0 group-hover:opacity-100
                          pointer-events-none transition-opacity duration-150 z-50
                        ">
                          {label}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Admin profile + logout */}
        <div className="px-2 py-4 border-t border-gray-100 space-y-1">
          {/* Profile info (visible only when expanded) */}
          {!collapsed && (
            <div className="flex items-center gap-3 px-3 py-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                A
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-700 truncate">Admin</p>
                <p className="text-xs text-gray-400 truncate">admin@eatknow.com</p>
              </div>
            </div>
          )}

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors group relative"
          >
            <span className="flex-shrink-0"><Icons.Logout /></span>
            {!collapsed ? (
              <span className="text-sm font-medium">Déconnexion</span>
            ) : (
              <span className="
                absolute left-full ml-3 px-2 py-1 rounded-lg
                bg-gray-800 text-white text-xs whitespace-nowrap
                opacity-0 group-hover:opacity-100
                pointer-events-none transition-opacity duration-150 z-50
              ">
                Déconnexion
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* ── Main area ────────────────────────────────────────────────────── */}
      <div
        className={`
          flex-1 flex flex-col min-h-screen
          transition-all duration-300 ease-in-out
          ${collapsed ? 'ml-[72px]' : 'ml-60'}
        `}
      >
        {/* Top header bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-6 flex items-center justify-between shadow-sm min-h-[72px]">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{currentTitle}</h1>
            <p className="text-xs text-gray-400 mt-0.5">Espace administration · eatKnow</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <button className="relative p-2 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors">
              <Icons.Bell />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
            </button>

            {/* Show avatar in header when sidebar is collapsed */}
            {collapsed && (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-sm shadow">
                A
              </div>
            )}
          </div>
        </header>

        {/* ── Page content: child route renders here ── */}
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;