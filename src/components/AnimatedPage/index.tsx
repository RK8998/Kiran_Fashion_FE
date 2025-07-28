import { motion } from 'framer-motion';
import React from 'react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const AnimatedPage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      animate="animate"
      className="h-full w-full"
      exit="exit"
      initial="initial"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      variants={pageVariants}
    >
      {children}
    </motion.div>
  );
};
