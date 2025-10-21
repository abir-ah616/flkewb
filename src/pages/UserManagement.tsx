import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Plus, Edit, Trash2, Mail, Calendar, Hash, ShieldAlert } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import StyledButton from '../components/StyledButton';
import Loader from '../components/Loader';

interface User {
  id: string;
  email: string;
  created_at: string;
}

interface UserLimits {
  user_id: string;
  daily_requests: number;
  extra_requests: number;
  requests_used_today: number;
  last_reset_date: string;
}

interface UserWithLimits extends User {
  limits?: UserLimits;
}

const UserManagement: React.FC = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserWithLimits[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithLimits[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'email' | 'created_at'>('created_at');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithLimits | null>(null);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    if (!profile) return;

    if (profile.is_admin) {
      fetchUsers();
    }
  }, [user, profile, authLoading]);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchQuery, sortBy]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, created_at')
        .order('created_at', { ascending: false });

      if (profileError) throw profileError;

      const usersWithLimits = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: limits } = await supabase
            .from('user_request_limits')
            .select('*')
            .eq('user_id', profile.id)
            .maybeSingle();

          return {
            id: profile.id,
            email: profile.email || '',
            created_at: profile.created_at,
            limits: limits || undefined,
          };
        })
      );

      setUsers(usersWithLimits);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users. Make sure you are logged in as admin.');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortUsers = () => {
    let filtered = [...users];

    if (searchQuery) {
      filtered = filtered.filter((user) =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === 'email') {
        return a.email.localeCompare(b.email);
      } else {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    setFilteredUsers(filtered);
  };

  const createUser = async () => {
    if (!newUserEmail || !newUserPassword) {
      alert('Please provide both email and password');
      return;
    }

    setCreating(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        alert('You must be logged in to create users');
        return;
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          email: newUserEmail,
          password: newUserPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create user');
      }

      alert('User created successfully!');
      setShowCreateModal(false);
      setNewUserEmail('');
      setNewUserPassword('');
      await fetchUsers();
    } catch (error: any) {
      console.error('Error creating user:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setCreating(false);
    }
  };

  const updateUserLimits = async (userId: string, dailyRequests: number, extraRequests: number) => {
    try {
      const { error } = await supabase
        .from('user_request_limits')
        .update({
          daily_requests: dailyRequests,
          extra_requests: extraRequests,
        })
        .eq('user_id', userId);

      if (error) throw error;

      alert('User limits updated successfully!');
      setEditingUser(null);
      fetchUsers();
    } catch (error: any) {
      console.error('Error updating user limits:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!user || !profile || !profile.is_admin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black pt-32 pb-12 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <ShieldAlert className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">You need admin privileges to access this page.</p>
          <StyledButton onClick={() => navigate('/')}>Go to Home</StyledButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black pt-32 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-10 h-10 text-blue-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
              User Management
            </h1>
          </div>
          <p className="text-gray-400 text-lg">Manage users and their request limits</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between"
        >
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'email' | 'created_at')}
              className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="created_at">Sort by Date</option>
              <option value="email">Sort by Email</option>
            </select>

            <StyledButton onClick={() => setShowCreateModal(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Create User
            </StyledButton>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-white font-semibold">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-xs text-gray-500">Created</p>
                        <p className="text-white font-semibold">{formatDate(user.created_at)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Hash className="w-5 h-5 text-yellow-400" />
                      <div>
                        <p className="text-xs text-gray-500">Requests</p>
                        <p className="text-white font-semibold">
                          {user.limits
                            ? `${user.limits.requests_used_today}/${user.limits.daily_requests + user.limits.extra_requests}`
                            : 'Not initialized'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Limits
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-20">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No users found</p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-3xl p-8 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Create New User</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Password</label>
                <input
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <StyledButton onClick={createUser} disabled={creating}>
                {creating ? 'Creating...' : 'Create User'}
              </StyledButton>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewUserEmail('');
                  setNewUserPassword('');
                }}
                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
                disabled={creating}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-3xl p-8 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-white mb-2">Edit User Limits</h2>
            <p className="text-gray-400 mb-6">{editingUser.email}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Daily Requests</label>
                <input
                  type="number"
                  defaultValue={editingUser.limits?.daily_requests || 3}
                  id="daily-requests"
                  min="0"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Extra Requests (expires today)</label>
                <input
                  type="number"
                  defaultValue={editingUser.limits?.extra_requests || 0}
                  id="extra-requests"
                  min="0"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                <p className="text-sm text-gray-400">
                  <span className="font-semibold text-white">Current Usage:</span>{' '}
                  {editingUser.limits?.requests_used_today || 0} requests used today
                </p>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <StyledButton
                onClick={() => {
                  const dailyRequests = parseInt(
                    (document.getElementById('daily-requests') as HTMLInputElement).value
                  );
                  const extraRequests = parseInt(
                    (document.getElementById('extra-requests') as HTMLInputElement).value
                  );
                  updateUserLimits(editingUser.id, dailyRequests, extraRequests);
                }}
              >
                Save Changes
              </StyledButton>
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
