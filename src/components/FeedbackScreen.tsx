import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { NormalizedRating, AppConfig } from "../types";
import { Check } from "lucide-react";
import { renderContent as t } from "../utils/content";
import { getPageVariants, getButtonVariants } from "../utils/animations";

interface Props {
  rating: NormalizedRating;
  onSubmit: (categories: string[], message: string) => Promise<void> | void;
  config: AppConfig;
  content: AppConfig["content"]["feedbackFlow"];
}

export const FeedbackScreen: React.FC<Props> = ({
  rating,
  onSubmit,
  config,
  content,
}) => {
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promptedEmptyOther, setPromptedEmptyOther] = useState(false);

  const fConfig = config.feedback;
  const pageVariants = getPageVariants(config);
  const buttonVariants = getButtonVariants(config);

  const toggleChip = (chip: string) => {
    setSelectedChips((prev) => {
      if (fConfig.allowMultipleCategories) {
        const next = prev.includes(chip)
          ? prev.filter((c) => c !== chip)
          : [...prev, chip];
        if (!next.includes("Other")) {
          setPromptedEmptyOther(false);
        }
        return next;
      } else {
        if (prev.includes(chip)) return [];
        setPromptedEmptyOther(false);
        return [chip];
      }
    });
  };

  const getHeading = () => {
    let typeStr: "good" | "neutral" | "negative" = "good";

    if (rating.id === "good") typeStr = "good";
    else if (rating.id === "neutral") typeStr = "neutral";
    else if (rating.id === "bad" || rating.id === "terrible")
      typeStr = "negative";
    else {
      const { type, maxStars = 5, min = 1, max = 10 } = config.ratings;
      let minScore = 1,
        maxScore = 5;

      if (type === "stars") {
        minScore = 1;
        maxScore = maxStars;
      } else if (type === "score") {
        minScore = min;
        maxScore = max;
      } else if (type === "emoji" && config.ratings.items) {
        minScore = config.ratings.items[0]?.score ?? 1;
        maxScore =
          config.ratings.items[config.ratings.items.length - 1]?.score ?? 5;
      }

      const ratio =
        (rating.score - minScore) / Math.max(1, maxScore - minScore);

      if (ratio >= 0.66) typeStr = "good";
      else if (ratio >= 0.33) typeStr = "neutral";
      else typeStr = "negative";
    }

    const fallbackHeading = {
      good: content.goodHeading,
      neutral: content.neutralHeading,
      negative: content.negativeHeading,
    }[typeStr];

    return t(fConfig.headings?.[typeStr] || fallbackHeading);
  };

  const isSubmitDisabled = () => {
    if (isSubmitting) return true;

    const textLen = feedbackText.trim().length;

    if (selectedChips.length === 0 && textLen === 0) {
      return true;
    }

    if (
      textLen > 0 &&
      fConfig.minimumCharacters > 0 &&
      textLen < fConfig.minimumCharacters
    ) {
      return true;
    }

    if (fConfig.maximumCharacters > 0 && textLen > fConfig.maximumCharacters) {
      return true;
    }

    return false;
  };

  const handleSubmit = async () => {
    const trimmedText = feedbackText.trim().substring(0, 2000);

    if (
      fConfig.requireTextWhenOtherSelected &&
      selectedChips.includes("Other") &&
      trimmedText === "" &&
      !promptedEmptyOther
    ) {
      setPromptedEmptyOther(true);
      return;
    }

    setIsSubmitting(true);
    await onSubmit(selectedChips, trimmedText);
  };

  const categoriesWithOther = [...fConfig.categories];
  if (!categoriesWithOther.includes("Other")) {
    categoriesWithOther.push("Other");
  }

  return (
    <motion.div
      {...pageVariants}
      className="flex flex-col w-full max-w-lg mx-auto bg-surface/70 backdrop-blur-[32px] rounded-[2.5rem] p-8 md:p-10 shadow-[0_16px_40px_rgba(0,0,0,0.03)] border border-text/5 relative z-10"
    >
      <h2 className="text-2xl md:text-[1.75rem] font-display font-medium text-charcoal/90 mb-10 leading-tight">
        {getHeading()}
      </h2>

      {categoriesWithOther.length > 0 && (
        <div className="mb-10">
          <p className="text-xs font-medium text-charcoal/40 mb-4 uppercase tracking-[0.15em]">
            {t(fConfig.categoryHeading || content.categoryHeading)}
          </p>
          <div className="flex flex-wrap gap-2.5">
            {categoriesWithOther.map((chip) => {
              const isSelected = selectedChips.includes(chip);
              return (
                <motion.button
                  key={chip}
                  {...buttonVariants}
                  onClick={() => toggleChip(chip)}
                  className={`px-5 py-2.5 rounded-full text-[13px] font-medium transition-all duration-300 border ${
                    isSelected
                      ? "bg-text text-background border-text shadow-md"
                      : "bg-surface/50 text-text/70 border-text/10 hover:border-text/30 hover:bg-surface"
                  }`}
                >
                  {chip}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedChips.includes("Other") && (
          <motion.div
            initial={{ opacity: 0, height: 0, overflow: "hidden" }}
            animate={{ opacity: 1, height: "auto", overflow: "visible" }}
            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-10 flex-grow"
          >
            <p
              className={`text-xs font-medium mb-4 uppercase tracking-[0.15em] transition-colors ${promptedEmptyOther ? "text-orange" : "text-charcoal/40"}`}
            >
              {t(fConfig.textInputLabel || content.additionalThoughtsLabel)}
            </p>
            <div className="relative">
              <motion.textarea
                animate={promptedEmptyOther ? { x: [-4, 4, -4, 4, 0] } : {}}
                transition={{ duration: 0.4 }}
                maxLength={2000}
                value={feedbackText}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.length <= 2000) {
                    setFeedbackText(val);
                  }
                  if (promptedEmptyOther) setPromptedEmptyOther(false);
                }}
                placeholder={
                  promptedEmptyOther
                    ? "Are you sure? We'd love to know what went wrong..."
                    : t(fConfig.placeholder || content.textareaPlaceholder)
                }
                className={`w-full bg-surface/50 border rounded-2xl p-5 pb-10 text-text text-[15px] focus:outline-none focus:ring-2 focus:ring-text/10 focus:border-text/40 transition-colors resize-none min-h-[140px] shadow-inner ${
                  promptedEmptyOther
                    ? "border-accent/50 placeholder:text-accent/70"
                    : "border-text/15 placeholder:text-text/30"
                }`}
              />
              <div className="pointer-events-none absolute bottom-4 right-4 text-[10px] font-medium text-text/40">
                {feedbackText.length} / 2000
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        {...buttonVariants}
        onClick={handleSubmit}
        disabled={isSubmitDisabled()}
        className="w-full py-4.5 rounded-2xl bg-text text-background text-[15px] font-medium shadow-[0_8px_20px_rgba(44,44,42,0.15)] disabled:opacity-40 disabled:shadow-none flex items-center justify-center gap-3 transition-all active:shadow-none"
      >
        {isSubmitting ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-5 h-5 border-[2px] border-background/30 border-t-background rounded-full"
          />
        ) : (
          <>
            {t(fConfig.submitButton || content.submitButton)}
            <Check className="w-4 h-4 opacity-80" />
          </>
        )}
      </motion.button>
    </motion.div>
  );
};
