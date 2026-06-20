import { AppConfig } from "../types";

export const getPageVariants = (config: AppConfig) => {
  if (
    !config.animations.enabled ||
    config.animations.pageTransition === "none"
  ) {
    return {
      initial: { opacity: 1, y: 0, scale: 1 },
      animate: { opacity: 1, y: 0, scale: 1 },
      transition: { duration: 0 },
    };
  }

  const duration = config.animations.transitionDuration;

  if (config.animations.pageTransition === "slideUp") {
    return {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration, ease: "easeOut" },
    };
  }

  if (config.animations.pageTransition === "fade") {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration, ease: "easeInOut" },
    };
  }

  if (config.animations.pageTransition === "scale") {
    return {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.05 },
      transition: { duration, ease: "easeOut" },
    };
  }

  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration, ease: "easeOut" },
  };
};

export const getButtonVariants = (config: AppConfig) => {
  if (!config.animations.enabled) {
    return {
      whileHover: {},
      whileTap: {},
    };
  }

  return {
    whileHover: { scale: config.animations.buttonHoverScale },
    whileTap: { scale: config.animations.buttonTapScale },
  };
};
