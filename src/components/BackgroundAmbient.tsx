import { motion } from "motion/react";
import { AppState } from "../types";

interface Props {
  appState: AppState;
}

export function BackgroundAmbient({ appState }: Props) {
  const isNeutral = appState === "feedback";

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{
          opacity: isNeutral ? 0 : 1,
        }}
        className="absolute inset-0 bg-background transition-colors duration-1000"
      />

      <motion.div
        animate={{
          opacity: isNeutral ? 1 : 0,
        }}
        className="absolute inset-0 bg-surface transition-colors duration-1000"
      />

      <motion.div
        animate={{
          opacity: isNeutral ? 0 : 1,
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute inset-0"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{
            background:
              "radial-gradient(ellipse at center, var(--color-primary) 0%, transparent 50%)",
            opacity: 0.12,
          }}
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, -60, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{
            background:
              "radial-gradient(ellipse at center, var(--color-accent) 0%, transparent 50%)",
            opacity: 0.08,
          }}
          className="absolute -bottom-1/2 -right-1/2 w-[200%] h-[200%] blur-[100px]"
        />
      </motion.div>
    </div>
  );
}
