export interface NormalizedRating {
  id: string;
  score: number;
  label: string;
}

export type AppState =
  | "welcome"
  | "positive_redirect"
  | "feedback"
  | "final_thanks";

export type ConfigContentValue = string | Record<string, string>;

export interface AppConfig {
  meta: {
    slug: string;
    version?: string;
    redirectDelay: number;
  };
  business: {
    id: string;
    name: string;
  };
  ratings: {
    type: "emoji" | "stars" | "score";
    items?: { id: string; emoji: string; label: string; score: number }[];
    maxStars?: number;
    min?: number;
    max?: number;
    positiveRatings: (string | number)[];
  };
  branding: {
    brandName: string;
    tagline: string;
    logoType: "image" | "svg" | "icon" | "none";
    logoUrl?: string;
    logo?: string;
  };
  theme: {
    fontPrimary: string;
    fontHeading: string;
    colors: {
      primary: string;
      background: string;
      surface: string;
      text: string;
      mutedText: string;
      accent: string;
    };
  };
  content: {
    welcome: {
      feedbackMessage: ConfigContentValue;
      ratingQuestion: ConfigContentValue;
    };
    positiveFlow: {
      headline: ConfigContentValue;
      subtext: ConfigContentValue;
      countdownText: ConfigContentValue;
      continueButton: ConfigContentValue;
      loadingMessage: ConfigContentValue;
    };
    feedbackFlow: {
      goodHeading: ConfigContentValue;
      neutralHeading: ConfigContentValue;
      negativeHeading: ConfigContentValue;
      categoryHeading: ConfigContentValue;
      additionalThoughtsLabel: ConfigContentValue;
      textareaPlaceholder: ConfigContentValue;
      submitButton: ConfigContentValue;
    };
    finalScreen: {
      positiveHeadline: ConfigContentValue;
      positiveSubtext: ConfigContentValue;
      negativeHeadline: ConfigContentValue;
      negativeSubtext: ConfigContentValue;
    };
  };
  feedback: {
    headings?: {
      good?: ConfigContentValue;
      neutral?: ConfigContentValue;
      negative?: ConfigContentValue;
    };
    categoryHeading?: ConfigContentValue;
    categories: string[];
    textInputLabel?: ConfigContentValue;
    placeholder?: ConfigContentValue;
    submitButton?: ConfigContentValue;
    required: boolean;
    minimumCharacters: number;
    maximumCharacters: number;
    requireTextWhenOtherSelected: boolean;
    allowMultipleCategories: boolean;
  };
  integrations: {
    review: {
      googleReviewUrl?: string;
    };
    feedback: {
      type: "webhook" | "google-sheet" | "email" | "none";
      url?: string;
      webhook?: string;
      endpoint?: string;
    };
    notifications: {
      enabled: boolean;
    };
  };
  animations: {
    enabled: boolean;
    pageTransition: "fade" | "slideUp" | "scale" | "none";
    transitionDuration: number;
    buttonHoverScale: number;
    buttonTapScale: number;
  };
}
