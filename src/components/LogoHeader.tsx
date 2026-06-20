import React, { useState } from "react";
import { motion } from "motion/react";
import { Coffee } from "lucide-react";
import { AppConfig } from "../types";

interface Props {
  branding: AppConfig["branding"];
}

export const LogoHeader: React.FC<Props> = ({ branding }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center z-10 relative"
    >
      <motion.div
        layout
        className="w-14 h-14 bg-charcoal rounded-full flex items-center justify-center mb-4 shadow-[0_4px_20px_rgba(44,44,42,0.15)] overflow-hidden"
      >
        {!imgError &&
        (branding.logoType === "image" || branding.logoType === "svg") &&
        branding.logoUrl ? (
          <img
            src={branding.logoUrl}
            alt={branding.brandName}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : branding.logoType === "icon" && branding.logo ? (
          <span className="text-3xl">{branding.logo}</span>
        ) : branding.logoType === "icon" ||
          imgError ||
          branding.logoType === "none" ? (
          <Coffee className="w-7 h-7 text-cream" />
        ) : null}
      </motion.div>
      <motion.h1
        layout
        className="text-2xl font-display font-medium text-charcoal tracking-widest uppercase text-center"
      >
        {branding.brandName}
      </motion.h1>
      <motion.p
        layout
        className="text-[10px] text-charcoal/50 uppercase tracking-[0.3em] mt-2 font-medium text-center"
      >
        {branding.tagline}
      </motion.p>
    </motion.div>
  );
};
