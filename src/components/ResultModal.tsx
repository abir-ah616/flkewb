import React from 'react';
import { X, CheckCircle, AlertCircle, User, Hash, TrendingUp, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InfoCard from './InfoCard';
import StyledButton from './StyledButton';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: {
    status: number;
    player?: string;
    uid?: string;
    likes_before?: number;
    likes_after?: number;
    likes_added?: number;
  } | null;
}

const ResultModal: React.FC<ResultModalProps> = ({ isOpen, onClose, result }) => {
  if (!result) return null;

  const isSuccess = result.status === 1;

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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-2xl my-4 sm:my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative" style={{ perspective: '1000px' }}>
                <div className="absolute -inset-2 overflow-hidden rounded-[28px] pointer-events-none" style={{ filter: 'blur(30px)', opacity: 0.4 }}>
                  <div className="absolute inset-0" style={{
                    background: 'conic-gradient(from 60deg at 50% 50%, #000, #402fb5 5%, #000 38%, #000 50%, #cf30aa 60%, #000 87%)',
                    animation: 'rotate 4s linear infinite',
                    width: '200%',
                    height: '200%',
                    left: '-50%',
                    top: '-50%'
                  }} />
                </div>
                <div className="absolute -inset-1 overflow-hidden rounded-[26px] pointer-events-none" style={{ filter: 'blur(3px)' }}>
                  <div className="absolute inset-0" style={{
                    background: 'conic-gradient(from 83deg at 50% 50%, rgba(0,0,0,0) 0%, #a099d8, rgba(0,0,0,0) 8%, rgba(0,0,0,0) 50%, #dfa2da, rgba(0,0,0,0) 58%)',
                    animation: 'rotate 2s linear infinite',
                    width: '150%',
                    height: '150%',
                    left: '-25%',
                    top: '-25%'
                  }} />
                </div>
                <div className="absolute -inset-0.5 overflow-hidden rounded-3xl pointer-events-none" style={{ filter: 'blur(2px)' }}>
                  <div className="absolute inset-0" style={{
                    background: 'conic-gradient(from 70deg at 50% 50%, #1c191c, #402fb5 5%, #1c191c 14%, #1c191c 50%, #cf30aa 60%, #1c191c 64%)',
                    animation: 'rotate 2s linear infinite reverse',
                    width: '150%',
                    height: '150%',
                    left: '-25%',
                    top: '-25%'
                  }} />
                </div>
                <div className="absolute -inset-1 overflow-hidden rounded-[26px] pointer-events-none" style={{ filter: 'blur(0.5px)' }}>
                  <div className="absolute inset-0" style={{
                    background: 'conic-gradient(from 82deg at 50% 50%, rgba(0,0,0,0), #18116a, rgba(0,0,0,0) 10%, rgba(0,0,0,0) 50%, #6e1b60, rgba(0,0,0,0) 60%)',
                    animation: 'rotate 2s linear infinite',
                    width: '150%',
                    height: '150%',
                    left: '-25%',
                    top: '-25%'
                  }} />
                </div>
              <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-2xl w-full shadow-2xl">
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 z-10"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <div className="text-center mb-6 sm:mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4 rounded-full"
                  >
                    {isSuccess ? (
                      <div className="relative">
                        <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse" />
                        <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-green-400 relative" />
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full animate-pulse" />
                        <AlertCircle className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-400 relative" />
                      </div>
                    )}
                  </motion.div>

                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-2 px-2">
                    {isSuccess ? 'Likes Sent Successfully!' : 'Already Claimed Today'}
                  </h2>

                  <p className="text-gray-400 text-sm sm:text-base px-2">
                    {isSuccess
                      ? 'Your Free Fire likes were sent!'
                      : 'This UID has already claimed likes today. Try again tomorrow!'}
                  </p>
                </div>

                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3 sm:space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <InfoCard
                        icon={<User className="w-6 h-6" />}
                        title="Player Name"
                        value={result.player || 'Unknown'}
                        color="blue"
                      />
                      <InfoCard
                        icon={<Hash className="w-6 h-6" />}
                        title="UID"
                        value={result.uid || ''}
                        color="cyan"
                      />
                      <InfoCard
                        icon={<TrendingUp className="w-6 h-6" />}
                        title="Likes Journey"
                        value={
                          <div className="flex items-center gap-2">
                            <span>{result.likes_before?.toLocaleString()}</span>
                            <span className="text-green-400">→</span>
                            <span className="text-green-400">{result.likes_after?.toLocaleString()}</span>
                          </div>
                        }
                        color="green"
                      />
                      <InfoCard
                        icon={<Award className="w-6 h-6" />}
                        title="Likes Added"
                        value={`+${result.likes_added}`}
                        color="yellow"
                      />
                    </div>

                    <div className="relative overflow-hidden bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/30 rounded-xl p-4 sm:p-6">
                      <p className="text-center text-gray-300 text-xs sm:text-sm">
                        Come back tomorrow for more likes!
                      </p>
                    </div>
                  </motion.div>
                )}

                {!isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative overflow-hidden bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4 sm:p-6"
                  >
                    <div className="text-center">
                      <p className="text-gray-300 text-sm sm:text-base mb-2">
                        You can only claim likes once per day for each UID.
                      </p>
                      <p className="text-xs sm:text-sm text-gray-400">
                        Please try again after 24 hours or use a different UID.
                      </p>
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center mt-5 sm:mt-6"
                >
                  <StyledButton onClick={onClose}>
                    Close
                  </StyledButton>
                </motion.div>
              </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ResultModal;
