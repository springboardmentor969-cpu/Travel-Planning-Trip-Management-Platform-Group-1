import { useEffect, useMemo, useState } from 'react';
import { BadgeCheck, Mail, MapPinned, Shield, Sparkles, UserCircle2 } from 'lucide-react';
import { getErrorMessage } from '../api/client';
import { userApi } from '../api/tripService';
import Button from '../components/Button';
import Card from '../components/Card';
import FormInput from '../components/FormInput';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

function buildInitials(name) {
  return (name || 'T')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user?.id) return;

    userApi.get(user.id)
      .then(setProfile)
      .catch((err) => setError(getErrorMessage(err)));
  }, [user?.id]);

  const initials = useMemo(() => buildInitials(profile?.name || user?.name), [profile?.name, user?.name]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData(event.currentTarget);
      const payload = {
        name: formData.get('name'),
        email: formData.get('email')
      };
      const updated = await userApi.update(user.id, payload);
      setProfile(updated);
      updateUser({
        ...user,
        name: updated.name,
        email: updated.email
      });
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (!profile && !error) return <LoadingSpinner label="Loading profile" />;

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-slate-950 via-slate-900 to-fuchsia-900 p-6 text-white shadow-soft md:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-fuchsia-100 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" />
          Profile studio
        </div>
        <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold md:text-5xl">Your travel identity, elevated.</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300 md:text-base">A cleaner profile workspace for keeping your account details and planning identity aligned.</p>
          </div>
          <div className="flex items-center gap-3 rounded-[1.75rem] border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-slate-950 shadow-lg">
              <span className="text-xl font-bold">{initials}</span>
            </div>
            <div>
              <p className="text-sm text-slate-300">Signed in as</p>
              <p className="text-lg font-semibold">{profile?.name || user?.name}</p>
              <p className="text-sm text-slate-300">{profile?.role || user?.role || 'Traveler'}</p>
            </div>
          </div>
        </div>
      </div>

      {error && <Card><p className="text-sm text-red-600">{error}</p></Card>}

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Account overview</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">A focused control center for your profile.</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-4">
              <UserCircle2 className="h-5 w-5 text-blue-600" />
              <p className="mt-3 text-sm text-slate-500">Display name</p>
              <p className="mt-1 text-lg font-semibold text-slate-950">{profile?.name || user?.name}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <Mail className="h-5 w-5 text-emerald-600" />
              <p className="mt-3 text-sm text-slate-500">Email address</p>
              <p className="mt-1 text-lg font-semibold text-slate-950 break-all">{profile?.email || user?.email}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <Shield className="h-5 w-5 text-indigo-600" />
              <p className="mt-3 text-sm text-slate-500">Role</p>
              <p className="mt-1 text-lg font-semibold text-slate-950">{profile?.role || user?.role || 'Traveler'}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <MapPinned className="h-5 w-5 text-fuchsia-600" />
              <p className="mt-3 text-sm text-slate-500">Planning style</p>
              <p className="mt-1 text-lg font-semibold text-slate-950">Organized traveler</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <BadgeCheck className="h-4 w-4 text-emerald-600" />
              Account status
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-500">This profile uses your authenticated account and can be updated without leaving TripNest.</p>
          </div>
        </Card>

        <Card>
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Edit profile</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">Update the details you want the app to show.</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Changes are saved to your account and reflected across the app shell.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput label="Full Name" name="name" defaultValue={profile?.name || user?.name || ''} required />
            <FormInput label="Email" name="email" type="email" defaultValue={profile?.email || user?.email || ''} required />

            {success && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}

            <Button type="submit" disabled={saving} className="w-full sm:w-auto">
              {saving ? 'Saving...' : 'Save changes'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}