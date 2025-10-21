import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage && !isLoading) {
      onPageChange(page);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center gap-2 mt-8 px-4"
    >
      <motion.button
        whileHover={{ scale: isLoading || currentPage === 1 ? 1 : 1.05 }}
        whileTap={{ scale: isLoading || currentPage === 1 ? 1 : 0.95 }}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
          currentPage === 1 || isLoading
            ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:shadow-lg hover:shadow-violet-500/50'
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>

      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-10 h-10 flex items-center justify-center text-gray-500"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <motion.button
              key={pageNum}
              whileHover={{ scale: isActive || isLoading ? 1 : 1.1 }}
              whileTap={{ scale: isActive || isLoading ? 1 : 0.9 }}
              onClick={() => handlePageChange(pageNum)}
              disabled={isActive || isLoading}
              className={`relative w-10 h-10 rounded-xl font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/50'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700 hover:border-violet-500/50'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activePage"
                  className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl"
                  style={{ zIndex: -1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{pageNum}</span>
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(139, 92, 246, 0.5)',
                      '0 0 40px rgba(139, 92, 246, 0.7)',
                      '0 0 20px rgba(139, 92, 246, 0.5)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <motion.button
        whileHover={{ scale: isLoading || currentPage === totalPages ? 1 : 1.05 }}
        whileTap={{ scale: isLoading || currentPage === totalPages ? 1 : 0.95 }}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
          currentPage === totalPages || isLoading
            ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:shadow-lg hover:shadow-violet-500/50'
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
};

export default Pagination;
