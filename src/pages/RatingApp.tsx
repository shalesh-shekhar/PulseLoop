import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { AppState, NormalizedRating, AppConfig } from "../types";
import { BackgroundAmbient } from "../components/BackgroundAmbient";
import { LogoHeader } from "../components/LogoHeader";
import { WelcomeScreen } from "../components/WelcomeScreen";
import { PositiveRedirect } from "../components/PositiveRedirect";
import { FeedbackScreen } from "../components/FeedbackScreen";
import { FinalThankYou } from "../components/FinalThankYou";
import { Loader2, ChevronLeft } from "lucide-react";
import { validateConfig } from "../utils/configValidator";
import { applyTheme } from "../utils/theme";

import { submitFeedback } from "../services/submitFeedback";

export function RatingApp() {
  const { slug } = useParams<{ slug?: string }>();

  const [appState, setAppState] = useState<AppState>("welcome");
  const [rating, setRating] = useState<NormalizedRating | null>(null);
  const [introFinished, setIntroFinished] = useState(false);

  const [config, setConfig] = useState<AppConfig | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [configError, setConfigError] = useState(false);
  const [isOfflineSubmit, setIsOfflineSubmit] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      if (!slug || slug.trim() === "") {
        setConfigError(true);
        setIsLoadingConfig(false);
        return;
      }

      try {
        const res = await fetch(`/configs/${slug}.json`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        const validConfig = validateConfig(data, `${slug}.json`);
        setConfig(validConfig);
        applyTheme(validConfig.theme);
      } catch (err) {
        console.warn("Failed to load config for slug:", slug);
        setConfigError(true);
      } finally {
        setIsLoadingConfig(false);
      }
    };
    fetchConfig();
  }, [slug]);

  useEffect(() => {
    let timer: number;
    if (!isLoadingConfig) {
      timer = window.setTimeout(() => {
        setIntroFinished(true);
      }, 2000); // 2 seconds intro
    }
    return () => clearTimeout(timer);
  }, [isLoadingConfig]);

  const handleRatingSelect = (selectedRating: NormalizedRating) => {
    setRating(selectedRating);

    // Check if the rating is positive
    const isPositive =
      config?.ratings.positiveRatings.includes(selectedRating.id) ||
      config?.ratings.positiveRatings.includes(selectedRating.score);

    if (isPositive) {
      setAppState("positive_redirect");
    } else {
      setAppState("feedback");
    }
  };

  const handleFeedbackSubmit = async (
    categories: string[],
    message: string,
  ) => {
    if (config && rating) {
      if (!navigator.onLine) {
        setIsOfflineSubmit(true);
      }
      await submitFeedback(config, rating, categories, message);
    }
    setAppState("final_thanks");
  };

  const handleBack = () => {
    setRating(null);
    setAppState("welcome");
  };

  const handleRedirectComplete = () => {
    setAppState("final_thanks");
  };

  if (configError) {
    return (
      <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-cream px-6 font-sans text-center text-charcoal">
        <h1 className="text-2xl font-semibold mb-3">Business Not Found</h1>
        <p className="text-charcoal/80 mb-2">We couldn't find this business.</p>
        <p className="text-charcoal/80">Please scan the QR code again.</p>
      </div>
    );
  }

  if (isLoadingConfig || !config) {
    return (
      <div className="min-h-[100dvh] w-full flex items-center justify-center bg-cream">
        <Loader2 className="w-8 h-8 animate-spin text-charcoal/30" />
      </div>
    );
  }

  const showBranding =
    appState === "welcome" || appState === "positive_redirect";

  const isPositive = rating
    ? config?.ratings.positiveRatings.includes(rating.id) ||
      config?.ratings.positiveRatings.includes(rating.score)
    : false;

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col overflow-hidden selection:bg-gold/20">
      <BackgroundAmbient appState={appState} />

      <div className="relative z-10 flex flex-col flex-grow w-full max-w-md mx-auto px-6">
        {/* Header Navigation Area */}
        <div className="w-full h-16 lg:h-20 flex items-center shrink-0">
          <AnimatePresence>
            {(appState === "positive_redirect" || appState === "feedback") && (
              <motion.button
                key="global-back"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={handleBack}
                className="p-2 -ml-2 rounded-full text-text/50 hover:text-text/90 hover:bg-text/5 transition-colors focus:outline-none flex items-center justify-center"
                aria-label="Go back"
              >
                <ChevronLeft className="w-8 h-8" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {showBranding && (
            <motion.div
              layout
              key="branding"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{
                opacity: 0,
                height: 0,
                filter: "blur(10px)",
                transition: { duration: 0.5, ease: "easeIn" },
              }}
              className={`flex flex-col w-full ${!introFinished && appState === "welcome" ? "flex-grow justify-center pb-20" : "pb-8"}`}
            >
              <LogoHeader branding={config.branding} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.main
          layout
          className={`flex flex-col justify-center pb-12 w-full ${!introFinished && appState === "welcome" ? "hidden" : "flex-grow"}`}
        >
          <AnimatePresence mode="wait">
            {appState === "welcome" && introFinished && (
              <WelcomeScreen
                key="welcome"
                config={config}
                onSelect={handleRatingSelect}
                content={config.content.welcome}
              />
            )}

            {appState === "positive_redirect" && (
              <PositiveRedirect
                key="positive"
                onComplete={handleRedirectComplete}
                config={config}
                content={config.content.positiveFlow}
              />
            )}

            {appState === "feedback" && rating && (
              <FeedbackScreen
                key="feedback"
                rating={rating}
                onSubmit={handleFeedbackSubmit}
                config={config}
                content={config.content.feedbackFlow}
              />
            )}

            {appState === "final_thanks" && (
              <FinalThankYou
                key="thanks"
                isPositive={!!isPositive}
                config={config}
                content={config.content.finalScreen}
                isOffline={isOfflineSubmit}
              />
            )}
          </AnimatePresence>
        </motion.main>
      </div>
    </div>
  );
}
