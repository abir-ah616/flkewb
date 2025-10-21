import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Home, History, Shield, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface MenuBarProps {
  onAuthClick?: () => void;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  gradient: string;
  iconColor: string;
  onClick?: () => void;
  isButton?: boolean;
}

const itemVariants: Variants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
};

const backVariants: Variants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
};

const glowVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 2,
    transition: {
      opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
      scale: { duration: 0.5, type: "spring", stiffness: 300, damping: 25 },
    },
  },
};

const navGlowVariants: Variants = {
  initial: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const sharedTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
  duration: 0.5,
};

function MenuBar({ onAuthClick }: MenuBarProps): React.JSX.Element {
  const { user, signOut } = useAuth();

  const menuItems: MenuItem[] = [
    {
      icon: <Home className="h-4 w-4 sm:h-5 sm:w-5" />,
      label: "Home",
      href: "/",
      gradient: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)",
      iconColor: "group-hover:text-blue-500",
    },
    {
      icon: <History className="h-4 w-4 sm:h-5 sm:w-5" />,
      label: "History",
      href: "/history",
      gradient: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)",
      iconColor: "group-hover:text-orange-500",
    },
  ];

  if (user?.email === 'admin@admin.com') {
    menuItems.push({
      icon: <Shield className="h-4 w-4 sm:h-5 sm:w-5" />,
      label: "Admin",
      href: "/admin",
      gradient: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)",
      iconColor: "group-hover:text-green-500",
    });
  }

  const authItem: MenuItem = user ? {
    icon: <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />,
    label: "Logout",
    href: "#",
    gradient: "radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.06) 50%, rgba(185,28,28,0) 100%)",
    iconColor: "group-hover:text-red-500",
    onClick: signOut,
    isButton: true,
  } : {
    icon: <LogIn className="h-4 w-4 sm:h-5 sm:w-5" />,
    label: "Login",
    href: "#",
    gradient: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)",
    iconColor: "group-hover:text-green-500",
    onClick: onAuthClick,
    isButton: true,
  };

  return (
    <motion.nav
      className="p-2 rounded-2xl bg-white/5 backdrop-blur-lg border border-gray-800/80 shadow-lg relative overflow-hidden"
      initial="initial"
      whileHover="hover"
    >
      <motion.div
        className="absolute -inset-2 rounded-3xl z-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.1) 50%, rgba(239,68,68,0.1) 100%)"
        }}
        variants={navGlowVariants}
      />
      <ul className="flex items-center gap-1 sm:gap-2 relative z-10">
        {menuItems.map((item: MenuItem) => (
          <motion.li key={item.label} className="relative">
            <motion.div
              className="block rounded-xl overflow-visible group relative"
              style={{ perspective: "600px" }}
              whileHover="hover"
              initial="initial"
            >
              <motion.div
                className="absolute inset-0 z-0 pointer-events-none rounded-2xl"
                variants={glowVariants}
                style={{
                  background: item.gradient,
                  opacity: 0,
                }}
              />
              <motion.div
                variants={itemVariants}
                transition={sharedTransition}
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin: "center bottom"
                }}
              >
                <Link
                  to={item.href}
                  className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 relative z-10 bg-transparent text-gray-300 group-hover:text-white transition-colors rounded-xl"
                >
                  <span className={`transition-colors duration-300 ${item.iconColor}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium text-sm sm:text-base">{item.label}</span>
                </Link>
              </motion.div>
              <motion.div
                variants={backVariants}
                transition={sharedTransition}
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin: "center top",
                  transform: "rotateX(90deg)"
                }}
                className="absolute inset-0"
              >
                <Link
                  to={item.href}
                  className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 relative z-10 bg-transparent text-gray-300 group-hover:text-white transition-colors rounded-xl"
                >
                  <span className={`transition-colors duration-300 ${item.iconColor}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium text-sm sm:text-base">{item.label}</span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.li>
        ))}
        <motion.li className="relative">
          <motion.div
            className="block rounded-xl overflow-visible group relative"
            style={{ perspective: "600px" }}
            whileHover="hover"
            initial="initial"
          >
            <motion.div
              className="absolute inset-0 z-0 pointer-events-none rounded-2xl"
              variants={glowVariants}
              style={{
                background: authItem.gradient,
                opacity: 0,
              }}
            />
            <motion.div
              variants={itemVariants}
              transition={sharedTransition}
              style={{
                transformStyle: "preserve-3d",
                transformOrigin: "center bottom"
              }}
            >
              <button
                onClick={authItem.onClick}
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 relative z-10 bg-transparent text-gray-300 group-hover:text-white transition-colors rounded-xl"
              >
                <span className={`transition-colors duration-300 ${authItem.iconColor}`}>
                  {authItem.icon}
                </span>
                <span className="font-medium text-sm sm:text-base">{authItem.label}</span>
              </button>
            </motion.div>
            <motion.div
              variants={backVariants}
              transition={sharedTransition}
              style={{
                transformStyle: "preserve-3d",
                transformOrigin: "center top",
                transform: "rotateX(90deg)"
              }}
              className="absolute inset-0"
            >
              <button
                onClick={authItem.onClick}
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 relative z-10 bg-transparent text-gray-300 group-hover:text-white transition-colors rounded-xl"
              >
                <span className={`transition-colors duration-300 ${authItem.iconColor}`}>
                  {authItem.icon}
                </span>
                <span className="font-medium text-sm sm:text-base">{authItem.label}</span>
              </button>
            </motion.div>
          </motion.div>
        </motion.li>
      </ul>
    </motion.nav>
  );
}

export default MenuBar;
