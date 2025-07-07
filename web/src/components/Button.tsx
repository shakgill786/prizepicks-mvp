import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export default function Button({
  children,
  onClick,
  className = ''
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`px-4 py-2 font-medium rounded ${className}`}
    >
      {children}
    </motion.button>
  );
}
