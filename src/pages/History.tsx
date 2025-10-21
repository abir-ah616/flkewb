import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History as HistoryIcon, Clock, User, Hash, TrendingUp, Award, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';

interface LikeHistoryEntry {
  id: string;
  uid: string;
  player_name: string;
  likes_added: number;
  likes_before: number;
  likes_after: number;
  created_at: string;
  total_count?: number;
}

interface AutoLikeHistoryEntry {
  id: string;
  uid: string;
  player_name: string;
  likes_added: number;
  likes_before: number;
  likes_after: number;
  sent_at: string;
  created_at: string;
  total_count?: number;
}

const History: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'likes' | 'autoLikes'>('likes');
  const [likeHistory, setLikeHistory] = useState<LikeHistoryEntry[]>([]);
  const [autoLikeHistory, setAutoLikeHistory] = useState<AutoLikeHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    fetchHistory();
  }, [activeTab, currentPage]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      if (activeTab === 'likes') {
        const { data, error } = await supabase.rpc('get_like_history_paginated', {
          p_page: currentPage,
          p_page_size: pageSize,
        });

        if (error) throw error;

        if (data && data.length > 0) {
          setLikeHistory(data);
          const totalCount = data[0].total_count || 0;
          setTotalPages(Math.ceil(totalCount / pageSize));
        } else {
          setLikeHistory([]);
          setTotalPages(1);
        }
      } else {
        const { data, error } = await supabase.rpc('get_auto_like_history_paginated', {
          p_page: currentPage,
          p_page_size: pageSize,
        });

        if (error) throw error;

        if (data && data.length > 0) {
          setAutoLikeHistory(data);
          const totalCount = data[0].total_count || 0;
          setTotalPages(Math.ceil(totalCount / pageSize));
        } else {
          setAutoLikeHistory([]);
          setTotalPages(1);
        }
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black pt-24 sm:pt-32 pb-8 sm:pb-12 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <HistoryIcon className="w-8 h-8 sm:w-10 sm:h-10 text-violet-400" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
              Server History
            </h1>
          </div>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg px-4 mb-3">
            View all like requests and auto-like activity across the server
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 text-xs sm:text-sm text-violet-400/80 px-4"
          >
            <Info className="w-4 h-4" />
            <span>History is kept for the last 24 hours</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex gap-2 sm:gap-4 p-1.5 sm:p-2 bg-gray-900/50 rounded-2xl border border-gray-800 max-w-md mx-auto">
            <button
              onClick={() => setActiveTab('likes')}
              className={`flex-1 py-2 sm:py-3 px-3 sm:px-6 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 ${
                activeTab === 'likes'
                  ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/50'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              Like History
            </button>
            <button
              onClick={() => setActiveTab('autoLikes')}
              className={`flex-1 py-2 sm:py-3 px-3 sm:px-6 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 ${
                activeTab === 'autoLikes'
                  ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/50'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              Auto Like History
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-20"
            >
              <Loader />
            </motion.div>
          ) : (
            <motion.div
              key={`${activeTab}-${currentPage}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 sm:space-y-4"
            >
            {activeTab === 'likes' && likeHistory.length === 0 && (
              <div className="text-center py-12 sm:py-20 px-4">
                <HistoryIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-3 sm:mb-4" />
                <p className="text-gray-400 text-base sm:text-lg">No like history in the last 24 hours</p>
                <p className="text-gray-500 text-xs sm:text-sm mt-2">
                  Successful like requests from the last 24 hours will appear here
                </p>
              </div>
            )}

            {activeTab === 'autoLikes' && autoLikeHistory.length === 0 && (
              <div className="text-center py-12 sm:py-20 px-4">
                <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-3 sm:mb-4" />
                <p className="text-gray-400 text-base sm:text-lg">No auto-like history in the last 24 hours</p>
                <p className="text-gray-500 text-xs sm:text-sm mt-2">
                  Successful auto-like requests from the last 24 hours will appear here
                </p>
              </div>
            )}

            {activeTab === 'likes' && likeHistory.length > 0 &&
              likeHistory.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-violet-500/50 transition-all duration-300"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-violet-400" />
                      <div>
                        <p className="text-xs text-gray-500">Player Name</p>
                        <p className="text-white font-semibold">{entry.player_name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Hash className="w-5 h-5 text-fuchsia-400" />
                      <div>
                        <p className="text-xs text-gray-500">UID</p>
                        <p className="text-white font-semibold">{entry.uid}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-yellow-400" />
                      <div>
                        <p className="text-xs text-gray-500">Likes Added</p>
                        <p className="text-green-400 font-semibold">+{entry.likes_added}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-xs text-gray-500">Journey</p>
                        <p className="text-white font-semibold">
                          {entry.likes_before.toLocaleString()} → {entry.likes_after.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="text-white font-semibold text-sm">{formatDate(entry.created_at)}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

            {activeTab === 'autoLikes' && autoLikeHistory.length > 0 &&
              autoLikeHistory.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-violet-500/50 transition-all duration-300"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-violet-400" />
                      <div>
                        <p className="text-xs text-gray-500">Player Name</p>
                        <p className="text-white font-semibold">{entry.player_name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Hash className="w-5 h-5 text-fuchsia-400" />
                      <div>
                        <p className="text-xs text-gray-500">UID</p>
                        <p className="text-white font-semibold">{entry.uid}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-yellow-400" />
                      <div>
                        <p className="text-xs text-gray-500">Likes Added</p>
                        <p className="text-green-400 font-semibold">+{entry.likes_added}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-xs text-gray-500">Journey</p>
                        <p className="text-white font-semibold">
                          {entry.likes_before.toLocaleString()} → {entry.likes_after.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Sent At</p>
                        <p className="text-white font-semibold text-sm">{formatDate(entry.sent_at)}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default History;
