import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { ReactNode } from 'react';

interface GlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export default function GlowButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  className,
  type = 'button',
  disabled
}: GlowButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={cn(
        "relative px-8 py-3 rounded-md font-medium tracking-wide transition-all duration-300",
        variant === 'primary' 
          ? "bg-black text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.5),0_0_20px_rgba(255,255,255,0.35)]" 
          : "bg-transparent text-black border border-brand-gray-light hover:shadow-[0_0_10px_rgba(0,0,0,0.1),0_0_20px_rgba(0,0,0,0.05)]",
        disabled && "opacity-50 cursor-not-allowed grayscale",
        className
      )}
    >
      {children}
    </motion.button>
  );
}
