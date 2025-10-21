import React, { useState } from 'react';
import { X, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import GlowCard from './GlowCard';
import AuthInput from './AuthInput';
import StyledButton from './StyledButton';
import Loader from './Loader';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      onClose();
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <GlowCard glowColor="purple" customSize={true} width="100%" height="auto">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full animate-pulse" />
                      <LogIn className="w-12 h-12 text-violet-400 relative" />
                    </div>
                  </motion.div>

                  <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-2">
                    Welcome Back
                  </h2>

                  <p className="text-gray-400">
                    Sign in to start boosting your profile
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex flex-col items-center gap-4">
                    <AuthInput
                      value={email}
                      onChange={setEmail}
                      placeholder="you@example.com"
                      type="email"
                      icon={<Mail className="w-5 h-5" />}
                    />
                    <AuthInput
                      value={password}
                      onChange={setPassword}
                      placeholder="••••••••"
                      type="password"
                      icon={<Lock className="w-5 h-5" />}
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                    >
                      <p className="text-red-400 text-sm text-center">{error}</p>
                    </motion.div>
                  )}

                  <div className="flex justify-center">
                    <StyledButton type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader />
                          <span>Please wait...</span>
                        </>
                      ) : (
                        <>
                          <LogIn className="w-5 h-5" />
                          <span>Sign In</span>
                        </>
                      )}
                    </StyledButton>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    Only admins can create new accounts
                  </p>
                </div>
              </GlowCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
