import React from "react";
import { Session } from "@supabase/supabase-js";
import { Product } from "../types";

interface ProfileViewProps {
  myProducts: Product[];
  savedCount: number;
  session: Session | null;
  profileName: string;
  authError: string | null;
  onSignIn: (email: string, password: string) => void;
  onSignUp: (email: string, password: string, fullName: string) => void;
  onGoogleSignIn: () => void;
  onSignOut: () => void;
  onUpdateProfile: (fullName: string) => void;
  onViewListing: (id: string) => void;
  onDeleteListing: (id: string) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({
  myProducts,
  savedCount,
  session,
  profileName,
  authError,
  onSignIn,
  onSignUp,
  onGoogleSignIn,
  onSignOut,
  onUpdateProfile,
  onViewListing,
  onDeleteListing,
}) => {
  const [mode, setMode] = React.useState<'login' | 'signup'>('login');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [fullName, setFullName] = React.useState(profileName || '');

  const isAuthed = !!session;

  const handleSubmit = () => {
    if (mode === 'login') onSignIn(email, password);
    else onSignUp(email, password, fullName);
  };

  const handleProfileSave = () => {
    onUpdateProfile(fullName);
  };

  return (
    <div className="pb-32 bg-background-light dark:bg-background-dark min-h-screen">
      <header className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 pb-2 justify-between">
        <h2 className="text-2xl font-bold leading-tight tracking-tight flex-1 pl-1">Profile</h2>
        {isAuthed && (
          <button onClick={onSignOut} className="text-sm font-semibold text-primary">Sign out</button>
        )}
      </header>

      <main className="flex flex-col px-5 pt-2 gap-6 relative z-10">
        {!isAuthed ? (
          <section className="bg-white dark:bg-surface-dark rounded-3xl p-5 shadow-sm border border-black/5 dark:border-white/5">
            <div className="flex gap-3 mb-4">
              <button onClick={() => setMode('login')} className={`flex-1 py-2 rounded-xl font-bold ${mode === 'login' ? 'bg-primary text-black' : 'bg-gray-100 dark:bg-white/5 text-slate-600 dark:text-slate-300'}`}>Sign in</button>
              <button onClick={() => setMode('signup')} className={`flex-1 py-2 rounded-xl font-bold ${mode === 'signup' ? 'bg-primary text-black' : 'bg-gray-100 dark:bg-white/5 text-slate-600 dark:text-slate-300'}`}>Sign up</button>
            </div>
            <div className="flex flex-col gap-3">
              {mode === 'signup' && (
                <Field label="Full name" type="text" value={fullName} onChange={setFullName} />
              )}
              <Field label="Email" type="email" value={email} onChange={setEmail} />
              <Field label="Password" type="password" value={password} onChange={setPassword} />
              {authError && <div className="text-red-500 text-sm font-semibold">{authError}</div>}
              <button onClick={handleSubmit} className="w-full py-3 rounded-xl bg-primary text-black font-bold">{mode === 'login' ? 'Sign in' : 'Create account'}</button>
              <div className="flex items-center gap-2 my-2">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                <span className="text-xs text-slate-500">or</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
              </div>
              <button
                onClick={onGoogleSignIn}
                className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark flex items-center justify-center gap-3 font-semibold text-slate-700 dark:text-slate-200 hover:border-primary/60"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                <span>Continue with Google</span>
              </button>
            </div>
          </section>
        ) : (
          <>
            <section className="bg-white dark:bg-surface-dark rounded-3xl p-5 shadow-sm border border-black/5 dark:border-white/5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-slate-400 font-semibold">Signed in</p>
                  <p className="text-lg font-bold">{session.user.email}</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Active</span>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">Display name</label>
                <input
                  className="w-full rounded-xl bg-gray-100 dark:bg-white/5 border-transparent focus:bg-white dark:focus:bg-slate-900 px-3 py-3 text-sm"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                />
                <button onClick={handleProfileSave} className="self-start px-4 py-2 rounded-lg bg-primary text-black font-bold">Save</button>
              </div>
              {authError && <div className="text-red-500 text-sm font-semibold">{authError}</div>}
            </section>

            <section className="bg-white dark:bg-surface-dark rounded-3xl p-5 shadow-sm border border-black/5 dark:border-white/5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">My Listings</h3>
                <span className="text-sm text-slate-500">{myProducts.length} total</span>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {myProducts.map((p) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(${p.image})` }}></div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{p.title}</p>
                      <p className="text-xs text-slate-500">$ {p.price.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => onViewListing(p.id)} className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:border-primary">View</button>
                      <button onClick={() => onDeleteListing(p.id)} className="px-3 py-2 rounded-lg bg-red-500 text-white text-xs font-semibold">Delete</button>
                    </div>
                  </div>
                ))}
                {!myProducts.length && <div className="text-sm text-slate-500">No listings yet. Add one from List.</div>}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

const Field: React.FC<{ label: string; type: string; value: string; onChange: (v: string) => void }> = ({ label, type, value, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-slate-500 uppercase">{label}</label>
    <input
      className="w-full rounded-xl bg-gray-100 dark:bg-white/5 border-transparent focus:bg-white dark:focus:bg-slate-900 px-3 py-3 text-sm"
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default ProfileView;
