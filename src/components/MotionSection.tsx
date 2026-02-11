'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { PropsWithChildren } from 'react';

export function MotionSection({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  const reduce = useReducedMotion();
  const variants = reduce ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } } : {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
  } as const;
  return (
    <motion.section
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={variants}
    >
      {children}
    </motion.section>
  );
}
