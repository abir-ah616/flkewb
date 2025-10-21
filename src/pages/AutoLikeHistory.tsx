import React, { useEffect, useState } from 'react';
import { Calendar, User, Hash, TrendingUp, Award, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { supabase, AutoLikeHistory } from '../lib/supabase';
import Loader from '../components/Loader';
import GlowCard from '../components/GlowCard';
import Pagination from '../components/Pagination';
import { motion, AnimatePresence } from 'framer-motion';

const AutoLikeHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<AutoLikeHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    fetchHistory();
  }, [currentPage]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_auto_like_history_paginated', {
        p_page: currentPage,
        p_page_size: pageSize,
      });

      if (error) throw error;

      if (data && data.length > 0) {
        setHistory(data || []);
        const totalCount = data[0].total_count || 0;
        setTotalPages(Math.ceil(totalCount / pageSize));
      } else {
        setHistory([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full relative bg-black">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139, 92, 246, 0.25), transparent 70%), #000000",
        }}
      />

      <div className="relative z-10 w-full min-h-screen px-3 sm:px-4 py-20 sm:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 sm:mb-12 text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-violet-400 via-fuchsia-300 to-violet-500 bg-clip-text text-transparent mb-3 sm:mb-4 px-2"
            >
              Auto-Likes History
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 text-sm sm:text-base lg:text-lg px-4 mb-3"
            >
              View all automated like requests executed by the system
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-2 text-xs sm:text-sm text-violet-400/80 px-4"
            >
              <Info className="w-4 h-4" />
              <span>History is kept for the last 24 hours</span>
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 sm:py-20 gap-4"
              >
                <Loader />
                <p className="text-gray-400 text-sm sm:text-base">Loading history...</p>
              </motion.div>
            ) : history.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex justify-center"
              >
                <GlowCard glowColor="purple" customSize={true} width="100%" height="auto" className="max-w-2xl">
                  <div className="text-center py-8 sm:py-12 px-4">
                    <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                    <p className="text-gray-400 text-base sm:text-lg">No auto-like history in the last 24 hours</p>
                    <p className="text-gray-500 text-xs sm:text-sm mt-2">
                      Successful auto-like requests from the last 24 hours will appear here
                    </p>
                  </div>
                </GlowCard>
              </motion.div>
            ) : (
              <motion.div
                key={`history-${currentPage}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid gap-4 sm:gap-6"
              >
              {history.map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlowCard
                    glowColor={record.status === 1 ? 'green' : 'orange'}
                    customSize={true}
                    width="100%"
                    height="auto"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                          record.status === 1 ? 'bg-green-500/20 border border-green-500/30' :
                          'bg-orange-500/20 border border-orange-500/30'
                        }`}>
                          {record.status === 1 ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-orange-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Status</p>
                          <p className={`text-sm font-bold ${
                            record.status === 1 ? 'text-green-400' : 'text-orange-400'
                          }`}>
                            {record.status === 1 ? 'SUCCESS' : 'CLAIMED'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30">
                          <User className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Player</p>
                          <p className="text-sm font-bold text-white truncate max-w-[150px]">{record.player_name || 'Unknown'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                          <Hash className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">UID</p>
                          <p className="text-sm font-bold text-white">{record.uid}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-violet-500/20 border border-violet-500/30">
                          <Calendar className="w-5 h-5 text-violet-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Executed</p>
                          <p className="text-sm font-bold text-white">
                            {new Date(record.executed_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {record.status === 1 && (
                      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-700/50 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/20 border border-green-500/30">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Likes Journey</p>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-gray-300">{record.likes_before}</span>
                              <span className="text-green-400">→</span>
                              <span className="text-sm font-bold text-green-400">{record.likes_after}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
                            <Award className="w-5 h-5 text-yellow-400" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Likes Added</p>
                            <p className="text-sm font-bold text-yellow-400">+{record.likes_added}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </GlowCard>
                </motion.div>
              ))}
              </motion.div>
            )}
          </AnimatePresence>

          {!loading && history.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoLikeHistoryPage;
