import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, History } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onAuthClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAuthClick }) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg">
                <span className="text-white font-bold text-xl">FF Likes</span>
              </div>
            </div>
          </button>

          <nav className="flex items-center gap-2">
            <button
              onClick={() => navigate('/history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                location.pathname === '/history'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Auto Likes History</span>
              <span className="sm:hidden">History</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2 ml-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg border border-slate-700">
                  <User className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-slate-300">{profile?.email}</span>
                  {profile?.is_admin && (
                    <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded border border-cyan-500/30">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 border border-red-500/30 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="relative group/btn overflow-hidden rounded-lg ml-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-500 group-hover/btn:scale-105"></div>
                <div className="relative flex items-center gap-2 px-4 py-2 text-white font-medium">
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </div>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
