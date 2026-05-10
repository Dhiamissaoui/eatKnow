import { useState } from "react";

// ─── Mock initial data ────────────────────────────────────────────────────────

const INITIAL_PROFILE = {
  nom: "Admin Principal",
  email: "admin@foodmarketplace.tn",
  telephone: "+216 71 000 001",
  adresse: "Siège Social, Tunis",
};

const INITIAL_PLATFORM = {
  nom_plateforme: "Food Marketplace",
  frais_livraison: "3.000",
  delai_livraison_defaut: "30",
  devise: "TND",
  maintenance: false,
};

const INITIAL_NOTIFS = {
  nouvelle_commande: true,
  commande_annulee: true,
  nouveau_client: false,
  rapport_hebdo: true,
};

// ─── Reusable field components ────────────────────────────────────────────────

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, type = "text", placeholder = "" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 transition bg-white"
    />
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
          checked ? "bg-orange-500" : "bg-gray-200"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <h2 className="text-sm font-bold text-gray-800">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function SaveButton({ onClick, saved }) {
  return (
    <div className="flex items-center justify-end gap-3 pt-2">
      {saved && (
        <span className="text-xs text-green-500 font-medium flex items-center gap-1">
          <span>✓</span> Enregistré
        </span>
      )}
      <button
        onClick={onClick}
        className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition shadow-sm shadow-orange-200"
      >
        Enregistrer
      </button>
    </div>
  );
}

// ─── Password Change Modal ────────────────────────────────────────────────────

function PasswordModal({ onClose }) {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.current) e.current = "Requis";
    if (form.next.length < 6) e.next = "6 caractères minimum";
    if (form.next !== form.confirm) e.confirm = "Les mots de passe ne correspondent pas";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    setDone(true);
    setTimeout(onClose, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-gray-800">Changer le mot de passe</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        {done ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-sm font-semibold text-green-600">Mot de passe mis à jour !</p>
          </div>
        ) : (
          <div className="space-y-4">
            {[
              { key: "current", label: "Mot de passe actuel" },
              { key: "next",    label: "Nouveau mot de passe" },
              { key: "confirm", label: "Confirmer le nouveau" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                  {label}
                </label>
                <input
                  type="password"
                  value={form[key]}
                  onChange={(e) => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: "" }); }}
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition ${
                    errors[key] ? "border-red-300" : "border-gray-200"
                  }`}
                />
                {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
              </div>
            ))}
            <div className="flex gap-3 pt-1">
              <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                Annuler
              </button>
              <button onClick={handleSubmit} className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition">
                Confirmer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function Settings() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [platform, setPlatform] = useState(INITIAL_PLATFORM);
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);

  const [savedProfile, setSavedProfile] = useState(false);
  const [savedPlatform, setSavedPlatform] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const save = (setter) => {
    setter(true);
    setTimeout(() => setter(false), 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {showPasswordModal && <PasswordModal onClose={() => setShowPasswordModal(false)} />}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-5">

        {/* Header */}
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-400 text-sm mt-0.5">Gérez votre compte et la configuration de la plateforme</p>
        </div>

        {/* ── Profile ── */}
        <Section title="Profil administrateur" icon="👤">
          <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-50">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center text-2xl font-bold flex-shrink-0">
              {profile.nom.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{profile.nom}</p>
              <p className="text-xs text-gray-400">{profile.email}</p>
              <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                Admin
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Field label="Nom complet">
              <Input
                value={profile.nom}
                onChange={(e) => setProfile({ ...profile, nom: e.target.value })}
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </Field>
            <Field label="Téléphone">
              <Input
                value={profile.telephone}
                onChange={(e) => setProfile({ ...profile, telephone: e.target.value })}
              />
            </Field>
            <Field label="Adresse">
              <Input
                value={profile.adresse}
                onChange={(e) => setProfile({ ...profile, adresse: e.target.value })}
              />
            </Field>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="text-xs font-semibold text-orange-500 hover:text-orange-600 underline underline-offset-2 transition"
            >
              🔒 Changer le mot de passe
            </button>
            <SaveButton onClick={() => save(setSavedProfile)} saved={savedProfile} />
          </div>
        </Section>

        {/* ── Platform ── */}
        <Section title="Configuration de la plateforme" icon="⚙️">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Field label="Nom de la plateforme">
              <Input
                value={platform.nom_plateforme}
                onChange={(e) => setPlatform({ ...platform, nom_plateforme: e.target.value })}
              />
            </Field>
            <Field label="Devise">
              <select
                value={platform.devise}
                onChange={(e) => setPlatform({ ...platform, devise: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
              >
                <option value="TND">TND — Dinar Tunisien</option>
                <option value="EUR">EUR — Euro</option>
                <option value="USD">USD — Dollar américain</option>
                <option value="MAD">MAD — Dirham marocain</option>
              </select>
            </Field>
            <Field label="Frais de livraison (TND)">
              <Input
                type="number"
                value={platform.frais_livraison}
                onChange={(e) => setPlatform({ ...platform, frais_livraison: e.target.value })}
              />
            </Field>
            <Field label="Délai de livraison par défaut (min)">
              <Input
                type="number"
                value={platform.delai_livraison_defaut}
                onChange={(e) => setPlatform({ ...platform, delai_livraison_defaut: e.target.value })}
              />
            </Field>
          </div>

          {/* Maintenance toggle */}
          <div className="border border-red-100 bg-red-50/50 rounded-xl px-4 py-3 mb-4">
            <Toggle
              checked={platform.maintenance}
              onChange={(v) => setPlatform({ ...platform, maintenance: v })}
              label="Mode maintenance"
              description="Désactive l'accès au front-office pour les clients"
            />
          </div>

          <SaveButton onClick={() => save(setSavedPlatform)} saved={savedPlatform} />
        </Section>

        {/* ── Notifications ── */}
        <Section title="Notifications" icon="🔔">
          <Toggle
            checked={notifs.nouvelle_commande}
            onChange={(v) => setNotifs({ ...notifs, nouvelle_commande: v })}
            label="Nouvelle commande"
            description="Recevoir une alerte à chaque nouvelle commande passée"
          />
          <Toggle
            checked={notifs.commande_annulee}
            onChange={(v) => setNotifs({ ...notifs, commande_annulee: v })}
            label="Commande annulée"
            description="Être notifié lorsqu'une commande est annulée"
          />
          <Toggle
            checked={notifs.nouveau_client}
            onChange={(v) => setNotifs({ ...notifs, nouveau_client: v })}
            label="Nouveau client inscrit"
            description="Recevoir une alerte à chaque nouvelle inscription"
          />
          <Toggle
            checked={notifs.rapport_hebdo}
            onChange={(v) => setNotifs({ ...notifs, rapport_hebdo: v })}
            label="Rapport hebdomadaire"
            description="Recevoir un résumé des performances chaque semaine"
          />
        </Section>

        {/* ── Danger zone ── */}
        <Section title="Zone de danger" icon="⚠️">
          <p className="text-sm text-gray-500 mb-4">
            Ces actions sont irréversibles. Veuillez procéder avec précaution.
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition">
              <div>
                <p className="text-sm font-medium text-gray-700">Réinitialiser les statistiques</p>
                <p className="text-xs text-gray-400">Efface toutes les données de ventes et commandes</p>
              </div>
              <button className="px-3 py-2 text-xs font-semibold text-orange-500 border border-orange-200 rounded-lg hover:bg-orange-50 transition flex-shrink-0 ml-4">
                Réinitialiser
              </button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-red-100 bg-red-50/30 hover:bg-red-50 transition">
              <div>
                <p className="text-sm font-medium text-red-600">Supprimer le compte admin</p>
                <p className="text-xs text-gray-400">Supprime définitivement ce compte administrateur</p>
              </div>
              <button className="px-3 py-2 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition flex-shrink-0 ml-4">
                Supprimer
              </button>
            </div>
          </div>
        </Section>

      </div>
    </div>
  );
}

export default Settings;