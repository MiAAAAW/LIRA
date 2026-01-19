/**
 * @fileoverview Framer Motion Wrapper Components
 * @description Reusable animation components for Pandilla Landing
 */

import { motion } from 'framer-motion';
import { forwardRef } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fade in variants with direction
 */
export const fadeInVariants = {
  up: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  },
  down: {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  none: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
};

/**
 * Scale variants
 */
export const scaleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

/**
 * Stagger container variants
 */
export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * Stagger item variants
 */
export const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// MOTION WRAPPER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * MotionWrapper - Animates children on scroll into view
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child elements
 * @param {'up'|'down'|'left'|'right'|'none'} [props.direction='up'] - Animation direction
 * @param {number} [props.delay=0] - Animation delay in seconds
 * @param {number} [props.duration=0.6] - Animation duration in seconds
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.once=true] - Animate only once
 * @param {number} [props.amount=0.3] - Viewport amount to trigger (0-1)
 * @param {string} [props.as='div'] - HTML element to render
 */
export const MotionWrapper = forwardRef(function MotionWrapper(
  {
    children,
    direction = 'up',
    delay = 0,
    duration = 0.6,
    className = '',
    once = true,
    amount = 0.3,
    as = 'div',
    ...props
  },
  ref
) {
  const Component = motion[as] || motion.div;
  const variants = fadeInVariants[direction] || fadeInVariants.up;

  return (
    <Component
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// STAGGER CONTAINER
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * StaggerContainer - Container for staggered child animations
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child elements (should be StaggerItem)
 * @param {string} [props.className] - Additional CSS classes
 * @param {number} [props.staggerDelay=0.1] - Delay between children
 * @param {boolean} [props.once=true] - Animate only once
 * @param {string} [props.as='div'] - HTML element to render
 */
export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
  once = true,
  as = 'div',
  ...props
}) {
  const Component = motion[as] || motion.div;

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STAGGER ITEM
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * StaggerItem - Individual item within StaggerContainer
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child elements
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.as='div'] - HTML element to render
 */
export function StaggerItem({
  children,
  className = '',
  as = 'div',
  ...props
}) {
  const Component = motion[as] || motion.div;

  return (
    <Component
      variants={staggerItemVariants}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOVER SCALE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * HoverScale - Scales element on hover
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child elements
 * @param {string} [props.className] - Additional CSS classes
 * @param {number} [props.scale=1.02] - Scale amount on hover
 */
export function HoverScale({
  children,
  className = '',
  scale = 1.02,
  ...props
}) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FADE IN
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * FadeIn - Simple fade in on mount
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child elements
 * @param {string} [props.className] - Additional CSS classes
 * @param {number} [props.delay=0] - Animation delay
 * @param {number} [props.duration=0.5] - Animation duration
 */
export function FadeIn({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCROLL PROGRESS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ScrollProgress - Shows scroll progress bar
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.color] - Progress bar color
 */
export function ScrollProgress({
  className = '',
  color = 'bg-primary',
}) {
  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-1 ${color} origin-left z-50 ${className}`}
      style={{ scaleX: 0 }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.3 }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PARALLAX
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Parallax - Creates parallax scrolling effect
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child elements
 * @param {string} [props.className] - Additional CSS classes
 * @param {number} [props.offset=50] - Parallax offset amount
 */
export function Parallax({
  children,
  className = '',
  offset = 50,
  ...props
}) {
  return (
    <motion.div
      initial={{ y: offset }}
      whileInView={{ y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default MotionWrapper;
