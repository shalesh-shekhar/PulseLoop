import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { NormalizedRating, AppConfig } from "../types";
import { renderContent as t } from "../utils/content";
import { RatingRenderer } from "./RatingRenderer";

import { getPageVariants } from "../utils/animations";

interface Props {
  onSelect: (rating: NormalizedRating) => void;
  config: AppConfig;
  content: AppConfig["content"]["welcome"];
}

export const WelcomeScreen: React.FC<Props> = ({
  onSelect,
  config,
  content,
}) => {
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowCard(true), 600); // reduced since logo delay handled it
    return () => clearTimeout(timer);
  }, []);

  const variants = getPageVariants(config);

  return (
    <motion.div
      {...variants}
      className="flex flex-col items-center justify-center w-full relative z-10 min-h-[50vh]"
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          ease: "easeOut",
          layout: { type: "spring", damping: 25, stiffness: 120 },
        }}
        className="text-center mb-12"
      >
        <h2 className="text-[2rem] md:text-5xl font-display font-medium text-charcoal tracking-tight leading-tight px-4 max-w-[500px]">
          {t(content.feedbackMessage)
            .split("\n")
            .map((line, i, arr) => (
              <React.Fragment key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
        </h2>
      </motion.div>

      <AnimatePresence>
        {showCard && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="w-full bg-surface/60 backdrop-blur-2xl border border-text/10 rounded-[2rem] p-6 lg:p-8 shadow-[0_8px_40px_rgba(44,44,42,0.06)]"
          >
            <motion.h3
              layout
              className="text-center text-lg font-medium text-charcoal/80 mb-8 font-display"
            >
              {t(content.ratingQuestion)}
            </motion.h3>

            <motion.div layout className="w-full pt-4 -mt-4">
              <RatingRenderer config={config} onSelect={onSelect} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
