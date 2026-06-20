import React from "react";
import { motion } from "motion/react";
import { AppConfig } from "../types";
import { renderContent as t } from "../utils/content";
import { getPageVariants } from "../utils/animations";

interface Props {
  isPositive: boolean;
  config: AppConfig;
  content: AppConfig["content"]["finalScreen"];
  isOffline?: boolean;
}

export const FinalThankYou: React.FC<Props> = ({
  isPositive,
  config,
  content,
  isOffline,
}) => {
  const pageVariants = getPageVariants(config);

  return (
    <motion.div
      {...pageVariants}
      className="flex flex-col items-center justify-center text-center w-full px-6 relative z-10"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        <h2 className="text-3xl md:text-[2.5rem] font-display font-medium text-charcoal mb-6 leading-tight">
          {isOffline
            ? "Thanks for your feedback."
            : isPositive
              ? t(content.positiveHeadline)
              : t(content.negativeHeadline)}
        </h2>
        <p className="text-charcoal/50 text-[17px] font-medium tracking-wide">
          {isOffline
            ? "We'll send it as soon as your connection is available."
            : isPositive
              ? t(content.positiveSubtext)
              : t(content.negativeSubtext)}
        </p>
      </motion.div>
    </motion.div>
  );
};
