'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  className?: string;
}

export function PriceDisplay({ price, className }: PriceDisplayProps) {
  return (
    <motion.div
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={cn(
        'relative inline-block',
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-lg blur-sm" />
      <div className="relative px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg shadow-lg">
        <span className="text-white font-bold text-lg">
          ${price.toLocaleString()}
        </span>
      </div>
    </motion.div>
  );
} 