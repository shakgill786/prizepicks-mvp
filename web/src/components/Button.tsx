// web/src/components/Button.tsx
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export default function Button({
  children,
  onClick,
  className = '',
  type = 'button',
  'aria-label': ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}) {
  return (
    <motion.button
      type={type}
      aria-label={ariaLabel}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`
        px-4 py-2 font-medium rounded focus:outline-none focus:ring focus:ring-primary
        focus:ring-offset-2 ${className}
      `}
    >
      {children}
    </motion.button>
  );
}
