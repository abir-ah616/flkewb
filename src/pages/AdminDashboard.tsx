import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Play, Pause, Calendar, Hash, Loader2, RefreshCw, Users, ShieldAlert } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, AutoLike } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import StyledButton from '../components/StyledButton';

const AdminDashboard: React.FC = () => {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [autoLikes, setAutoLikes] = useState<AutoLike[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUID, setNewUID] = useState('');
  const [addingUID, setAddingUID] = useState(false);

  useEffect(() => {
    refreshProfile();
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    if (!profile) return;

    if (profile.is_admin) {
      fetchAutoLikes();
    }
  }, [user, profile, authLoading]);

  const fetchAutoLikes = async () => {
    try {
      const { data, error } = await supabase
        .from('auto_likes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAutoLikes(data || []);
    } catch (error) {
      console.error('Error fetching auto likes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAutoLike = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUID.trim()) return;

    setAddingUID(true);
    try {
      const nextRun = new Date();
      nextRun.setDate(nextRun.getDate() + 1);
      nextRun.setHours(5, 0, 0, 0);

      const { error } = await supabase.from('auto_likes').insert({
        uid: newUID.trim(),
        is_active: true,
        next_run_at: nextRun.toISOString(),
        created_by: profile?.id,
      });

      if (error) throw error;

      setNewUID('');
      setShowAddModal(false);
      fetchAutoLikes();
    } catch (error: any) {
      alert(error.message || 'Error adding auto like');
    } finally {
      setAddingUID(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('auto_likes')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchAutoLikes();
    } catch (error) {
      console.error('Error toggling auto like:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this auto-like?')) return;

    try {
      const { error } = await supabase.from('auto_likes').delete().eq('id', id);

      if (error) throw error;
      fetchAutoLikes();
    } catch (error) {
      console.error('Error deleting auto like:', error);
    }
  };

  if (!profile?.is_admin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-2">Access Denied</h2>
          <p className="text-slate-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!user || !profile || !profile.is_admin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-32 pb-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <ShieldAlert className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">You need admin privileges to access this page.</p>
          <StyledButton onClick={() => navigate('/')}>Go to Home</StyledButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-400">Manage auto-like configurations for daily execution</p>
        </div>

        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="relative group/btn overflow-hidden rounded-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 transition-all duration-500 group-hover/btn:scale-105"></div>
            <div className="relative flex items-center gap-2 px-6 py-3 text-white font-bold">
              <Plus className="w-5 h-5" />
              <span>Add New Auto-Like UID</span>
            </div>
          </button>

          <Link
            to="/user-management"
            className="relative group/btn overflow-hidden rounded-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 group-hover/btn:scale-105"></div>
            <div className="relative flex items-center gap-2 px-6 py-3 text-white font-bold">
              <Users className="w-5 h-5" />
              <span>Manage Users</span>
            </div>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        ) : autoLikes.length === 0 ? (
          <div className="relative overflow-hidden bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center">
            <p className="text-slate-400 text-lg">No auto-likes configured yet. Add your first UID!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {autoLikes.map((autoLike) => (
              <div
                key={autoLike.id}
                className="group relative overflow-hidden bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-300"></div>

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-6 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                        <Hash className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">UID</p>
                        <p className="text-xl font-bold text-white">{autoLike.uid}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <Calendar className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Next Run</p>
                        <p className="text-sm font-medium text-white">
                          {new Date(autoLike.next_run_at).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {autoLike.last_run_at && (
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-sm text-slate-400">Last Run</p>
                          <p className="text-sm font-medium text-slate-300">
                            {new Date(autoLike.last_run_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${
                        autoLike.is_active
                          ? 'bg-green-500/10 text-green-400 border-green-500/30'
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                      }`}
                    >
                      {autoLike.is_active ? 'Active' : 'Paused'}
                    </div>

                    <button
                      onClick={() => handleToggleActive(autoLike.id, autoLike.is_active)}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        autoLike.is_active
                          ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/30'
                          : 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30'
                      }`}
                      title={autoLike.is_active ? 'Pause' : 'Resume'}
                    >
                      {autoLike.is_active ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(autoLike.id)}
                      className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-all duration-300"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          ></div>

          <div className="relative w-full max-w-md animate-scale-up">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-50 animate-gradient"></div>

            <div className="relative bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl p-8">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-6">
                Add New Auto-Like UID
              </h3>

              <form onSubmit={handleAddAutoLike} className="space-y-4">
                <div>
                  <label htmlFor="uid" className="block text-sm font-medium text-slate-300 mb-2">
                    Free Fire UID
                  </label>
                  <input
                    type="text"
                    id="uid"
                    value={newUID}
                    onChange={(e) => setNewUID(e.target.value)}
                    placeholder="1234567890"
                    className="w-full px-4 py-3 bg-slate-950/50 border-2 border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                    required
                  />
                </div>

                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-blue-300 text-sm">
                    This UID will be processed automatically every day at 11 AM GMT+6 (5 AM UTC).
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-3 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingUID}
                    className="flex-1 relative overflow-hidden rounded-xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600"></div>
                    <div className="relative flex items-center justify-center gap-2 px-4 py-3 text-white font-bold">
                      {addingUID ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Adding...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5" />
                          <span>Add</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
