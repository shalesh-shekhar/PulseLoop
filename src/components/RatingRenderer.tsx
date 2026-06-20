import React from "react";
import { AppConfig, NormalizedRating } from "../types";
import { motion } from "motion/react";
import { getButtonVariants } from "../utils/animations";

interface Props {
  config: AppConfig;
  onSelect: (rating: NormalizedRating) => void;
}

export const RatingRenderer: React.FC<Props> = ({ config, onSelect }) => {
  const { type, items, maxStars = 5, min = 1, max = 10 } = config.ratings;
  const buttonVariants = getButtonVariants(config);

  const emojiHover = config.animations.enabled
    ? { scale: config.animations.buttonHoverScale, y: -6 }
    : {};
  const tapVariant = config.animations.enabled
    ? { scale: config.animations.buttonTapScale }
    : {};

  if (type === "emoji") {
    // If somehow items are missing, use defaults
    const emojiItems = items || [
      { id: "terrible", emoji: "😡", label: "Terrible", score: 1 },
      { id: "bad", emoji: "😞", label: "Bad", score: 2 },
      { id: "neutral", emoji: "😐", label: "Neutral", score: 3 },
      { id: "good", emoji: "🙂", label: "Good", score: 4 },
      { id: "amazing", emoji: "😍", label: "Amazing", score: 5 },
    ];

    return (
      <div className="flex justify-between items-center w-full">
        {emojiItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={emojiHover}
            whileTap={tapVariant}
            onClick={() =>
              onSelect({ id: item.id, score: item.score, label: item.label })
            }
            className="flex flex-col items-center gap-2 md:gap-3 group py-2 md:py-3 px-1 rounded-2xl hover:bg-surface/60 transition-colors flex-1 min-w-0 w-0"
          >
            <span className="text-3xl md:text-4xl filter transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(212,175,55,0.5)] leading-none origin-bottom">
              {item.emoji}
            </span>
            <span className="text-[9px] md:text-[11px] uppercase tracking-tight md:tracking-wider text-charcoal/40 font-medium group-hover:text-charcoal/90 transition-colors truncate w-full text-center">
              {item.label}
            </span>
          </motion.button>
        ))}
      </div>
    );
  }

  if (type === "stars") {
    const stars = Array.from({ length: maxStars }, (_, i) => i + 1);
    const [hoveredStar, setHoveredStar] = React.useState<number | null>(null);

    return (
      <div
        className="flex justify-center w-full gap-1 md:gap-2 flex-nowrap"
        onMouseLeave={() => setHoveredStar(null)}
      >
        {stars.map((star) => {
          const isActive = hoveredStar !== null && star <= hoveredStar;
          return (
            <button
              key={star}
              onMouseEnter={() => setHoveredStar(star)}
              onClick={() =>
                onSelect({
                  id: "star-" + star,
                  score: star,
                  label: star + " Stars",
                })
              }
              className={`text-4xl md:text-5xl transition-colors duration-200 ${
                isActive ? "text-primary" : "text-muted"
              }`}
            >
              ★
            </button>
          );
        })}
      </div>
    );
  }

  if (type === "score") {
    const scores = Array.from({ length: max - min + 1 }, (_, i) => min + i);
    const scoreHover = config.animations.enabled
      ? { scale: config.animations.buttonHoverScale, y: -4 }
      : {};

    return (
      <div className="flex flex-wrap justify-center w-full gap-1.5 md:gap-2">
        {scores.map((score) => (
          <motion.button
            key={score}
            whileHover={scoreHover}
            whileTap={tapVariant}
            onClick={() =>
              onSelect({
                id: "score-" + score,
                score,
                label: score + "/" + max,
              })
            }
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-surface text-charcoal border border-charcoal/10 text-base md:text-lg font-medium hover:bg-gold hover:text-white hover:border-gold transition-all shadow-sm hover:shadow-md"
          >
            {score}
          </motion.button>
        ))}
      </div>
    );
  }

  return null;
};
