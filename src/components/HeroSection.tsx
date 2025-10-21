import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import SearchInput from './SearchInput';
import Loader from './Loader';
import GlowCard from './GlowCard';
import StyledButton from './StyledButton';
import { AnimatedGradientBadge } from './AnimatedGradientText';
import { Shield, Zap } from 'lucide-react';

interface HeroSectionProps {
  onSubmit: (uid: string) => void;
  loading: boolean;
  refreshTrigger?: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSubmit, loading, refreshTrigger }) => {
  const [uid, setUid] = useState('');
  const { user } = useAuth();
  const [requestsRemaining, setRequestsRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      fetchRequestsRemaining();
    } else {
      setRequestsRemaining(null);
    }
  }, [user, refreshTrigger]);

  const fetchRequestsRemaining = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_request_limits')
        .select('daily_requests, extra_requests, requests_used_today')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching requests remaining:', error);
        return;
      }

      if (data) {
        const remaining = (data.daily_requests + data.extra_requests) - data.requests_used_today;
        setRequestsRemaining(Math.max(0, remaining));
      } else {
        setRequestsRemaining(3);
      }
    } catch (error) {
      console.error('Error fetching requests remaining:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uid.trim() && user && requestsRemaining !== null && requestsRemaining > 0) {
      onSubmit(uid.trim());
    }
  };

  return (
    <div className="min-h-screen w-full relative bg-black">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139, 92, 246, 0.25), transparent 70%), #000000",
        }}
      />

      <div className="relative z-10 w-full min-h-screen flex items-center justify-center px-4 sm:px-6 py-20 sm:py-24">
        <div className="w-full max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 space-y-4 sm:space-y-6">
            <AnimatedGradientBadge />

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black bg-gradient-to-r from-violet-400 via-fuchsia-300 to-violet-500 bg-clip-text text-transparent leading-tight px-2">
              GET FREE LIKES
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 max-w-2xl mx-auto px-4">
              Boost your Free Fire profile with instant likes. Safe, fast, and completely free.
            </p>
          </div>

          <div className="flex justify-center mb-8 sm:mb-16">
            <GlowCard
              glowColor="purple"
              customSize={true}
              width="100%"
              height="auto"
              className="max-w-2xl w-full"
            >
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                <div className="space-y-4">
                  <label htmlFor="uid" className="block text-sm font-semibold text-gray-300">
                    Enter Your Free Fire UID
                  </label>
                  <div className="flex justify-center">
                    <SearchInput
                      value={uid}
                      onChange={setUid}
                      placeholder={requestsRemaining === 0 ? "No requests remaining" : "Enter UID"}
                      disabled={!user || loading || requestsRemaining === 0}
                    />
                  </div>
                </div>

                {!user && (
                  <div className="text-center py-3 px-2">
                    <p className="text-yellow-400 text-xs sm:text-sm font-medium">Please login to send likes requests</p>
                  </div>
                )}

                {user && requestsRemaining !== null && requestsRemaining > 0 && (
                  <div className="text-center py-3 px-2">
                    <p className="text-violet-400 text-xs sm:text-sm font-medium">
                      Daily Requests Remaining: <span className="text-white font-bold text-base sm:text-lg">{requestsRemaining}</span>
                    </p>
                  </div>
                )}

                {user && requestsRemaining === 0 && (
                  <div className="text-center py-4 px-2">
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 sm:p-4">
                      <p className="text-red-400 font-bold text-base sm:text-lg mb-1">No Requests Remaining</p>
                      <p className="text-gray-400 text-xs sm:text-sm">You've used all your daily requests. Come back tomorrow!</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-center">
                  <StyledButton
                    type="submit"
                    disabled={!user || loading || !uid.trim() || requestsRemaining === 0}
                  >
                    {loading ? (
                      <>
                        <Loader />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-6 h-6" />
                        <span>Send Likes</span>
                      </>
                    )}
                  </StyledButton>
                </div>
              </form>

              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-700/50">
                <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm font-medium">100% Safe</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm font-medium">Instant Delivery</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <div className="w-3 h-3 bg-violet-400 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm font-medium">No Ban Risk</p>
                  </div>
                </div>
              </div>
            </GlowCard>
          </div>

          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-gray-500 text-xs sm:text-sm px-4">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <p className="text-center">Daily limit applies. One request per UID every 24 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
