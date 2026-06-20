import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";

import { AppConfig } from "../types";
import { renderContent as t } from "../utils/content";
import { getPageVariants, getButtonVariants } from "../utils/animations";

interface Props {
  onComplete: () => void;
  config: AppConfig;
  content: AppConfig["content"]["positiveFlow"];
}

export const PositiveRedirect: React.FC<Props> = ({
  onComplete,
  config,
  content,
}) => {
  const redirectDelay = config.meta.redirectDelay || 3;
  const [countdown, setCountdown] = useState(redirectDelay);
  const [redirected, setRedirected] = useState(false);

  const pageVariants = getPageVariants(config);
  const buttonVariants = getButtonVariants(config);

  const targetUrl = config.integrations.review.googleReviewUrl;

  const isValidReviewUrl = (url: string | undefined): boolean => {
    if (!url || url.trim() === "") return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const hasValidUrl = isValidReviewUrl(targetUrl);

  useEffect(() => {
    if (!hasValidUrl) {
      console.warn("Review URL missing. Redirect disabled.");
      onComplete();
      return;
    }

    if (countdown > 0 && !redirected) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !redirected) {
      handleRedirect();
    }
  }, [countdown, redirected, hasValidUrl, onComplete]);

  const handleRedirect = () => {
    setRedirected(true);

    // Open google review in a new window/tab
    if (targetUrl) {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }

    // Smoothly transition the original tab into the final thank you state after a brief delay
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  if (!hasValidUrl) {
    return null;
  }

  return (
    <motion.div
      {...pageVariants}
      className="flex flex-col items-center text-center w-full bg-surface/50 backdrop-blur-2xl rounded-[2.5rem] p-10 md:p-12 border border-text/10 shadow-[0_16px_40px_rgba(212,175,55,0.08)] relative z-10"
    >
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", delay: 0.2, damping: 15 }}
        className="text-[5rem] mb-8 drop-shadow-xl"
      >
        😍
      </motion.div>

      <h2 className="text-4xl font-display font-medium text-charcoal mb-3">
        {t(content.headline)}
      </h2>
      <p className="text-charcoal/70 mb-12 text-lg">{t(content.subtext)}</p>

      <AnimatePresence mode="wait">
        {!redirected ? (
          <motion.div
            key="countdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center space-y-6 w-full max-w-[240px]"
          >
            <p className="text-sm font-medium text-charcoal/50">
              {t(content.countdownText).replace(
                "{seconds}",
                countdown.toString(),
              )}
            </p>

            <motion.div className="h-1.5 w-full bg-charcoal/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: redirectDelay, ease: "linear" }}
                className="h-full bg-gold/70 rounded-full"
              />
            </motion.div>

            <motion.button
              {...buttonVariants}
              onClick={handleRedirect}
              className="w-full py-3.5 rounded-full bg-text text-background text-[15px] font-medium hover:bg-text/90 transition-all shadow-[0_8px_20px_rgba(44,44,42,0.15)] active:scale-95 active:shadow-none"
            >
              {t(content.continueButton)}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center text-charcoal/50 py-4"
          >
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-gold/60" />
            <p className="text-sm font-medium uppercase tracking-wider">
              {t(content.loadingMessage)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
