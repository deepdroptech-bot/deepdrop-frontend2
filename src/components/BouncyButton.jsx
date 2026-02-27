import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export function BouncyButton({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-bold rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary:
      'bg-gradient-to-r from-red-500 to-blue-600 text-white shadow-lg hover:shadow-xl focus:ring-red-300 border-none',
    secondary:
      'bg-white text-blue-600 shadow-md hover:shadow-lg focus:ring-blue-200 border-2 border-transparent',
    outline:
      'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-200',
    ghost:
      'bg-transparent text-blue-600 hover:bg-blue-100/50 focus:ring-blue-200',
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </motion.button>
  );
}
