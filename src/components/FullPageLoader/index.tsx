import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Spinner } from '@heroui/spinner';

/**
 * FullPageCoverLoader
 * ------------------------------------------------------------
 * A full-viewport blocking loader overlay with optional text, subtext,
 * and progress. Uses a React portal to render at <body> level.
 *
 * Props:
 * - open: boolean — controls visibility
 * - text?: string — main heading
 * - subtext?: string — helper text
 * - progress?: number — 0..100 to show a progress bar
 * - blurBackground?: boolean — apply backdrop blur
 * - zIndex?: number — custom stacking context (default 50)
 * - onEsc?: () => void — optional: called when user presses Escape
 * - logo?: React.ReactNode — optional logo element rendered above spinner
 */
export default function FullPageLoader({
  open,
  text = 'Loading...',
  subtext,
  progress,
  blurBackground = true,
  zIndex = 50,
  onEsc,
  logo,
}: {
  open: boolean;
  text?: string;
  subtext?: string;
  progress?: number;
  blurBackground?: boolean;
  zIndex?: number;
  onEsc?: () => void;
  logo?: React.ReactNode;
}) {
  // Handle Escape key (optional cancel/notify)
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && onEsc) onEsc();
    }
    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onEsc]);

  // Prevent background scroll when open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const overlay = (
    <AnimatePresence>
      {open ? (
        <motion.div
          animate={{ opacity: 1 }}
          aria-busy={true}
          aria-live="polite"
          className={['fixed inset-0 flex items-center justify-center', 'px-6'].join(' ')}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          role="status"
          style={{ zIndex }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            animate={{ opacity: 1 }}
            className={[
              'absolute inset-0',
              blurBackground ? 'backdrop-blur-md' : '',
              'bg-black/10',
            ].join(' ')}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Loader Card */}
          <motion.div
            animate={{ y: 0, scale: 1, opacity: 1 }}
            // className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-black/5 p-6 text-center"
            className="relative w-full max-w-sm rounded-2xl  p-6 text-center"
            exit={{ y: 6, scale: 0.98, opacity: 0 }}
            initial={{ y: 10, scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          >
            {logo ? <div className="mb-3 flex items-center justify-center">{logo}</div> : null}

            {/* Spinner */}
            {/* <div className="mx-auto mb-4 h-12 w-12 rounded-full border-4 border-gray-200 border-t-transparent animate-spin" /> */}
            <Spinner />

            {/* Text */}
            <div className="space-y-1">
              <h2 className="text-base sm:text-2xl font-semibold text-gray-900">{text}</h2>
              {subtext ? <p className="text-xs sm:text-lg text-gray-600">{subtext}</p> : null}
            </div>

            {/* Progress */}
            {typeof progress === 'number' ? (
              <div className="mt-4">
                <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gray-900 transition-[width] duration-300"
                    style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                  />
                </div>
                <div className="mt-1 text-xs text-gray-600">{Math.round(progress)}%</div>
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  // Render via portal for proper stacking
  if (typeof document !== 'undefined') {
    return createPortal(overlay, document.body);
  }

  return overlay;
}

/**
 * Usage example:
 *
 * const [loading, setLoading] = useState(false);
 *
 * <FullPageCoverLoader
 *   open={loading}
 *   text="Saving your sale"
 *   subtext="Please wait while we process your request"
 *   progress={42}
 *   logo={<img src="/logo.svg" alt="Logo" className="h-6" />}
 * />
 */
