import { AppConfig } from "../types";

export const DEFAULT_THEME = {
  fontPrimary: "Inter",
  fontHeading: "Space Grotesk",
  colors: {
    primary: "#D4A017",
    background: "#111111",
    surface: "#1A1A1A",
    text: "#FFFFFF",
    mutedText: "#999999",
    accent: "#F5D06F",
  },
};

export const DEFAULT_CONTENT = {
  welcome: {
    feedbackMessage: "We'd love your feedback.",
    ratingQuestion: "How was your experience today?",
  },
  positiveFlow: {
    headline: "Thank you 💛",
    subtext: "It means a lot to us.",
    countdownText: "Redirecting to Google Reviews in {seconds}...",
    continueButton: "Leave Review on Google",
    loadingMessage: "Opening Google...",
  },
  feedbackFlow: {
    goodHeading: "How can we improve your experience?",
    neutralHeading: "What was missing from your experience?",
    negativeHeading: "We're genuinely sorry your experience wasn't great.",
    categoryHeading: "What could be better?",
    additionalThoughtsLabel: "Additional thoughts",
    textareaPlaceholder: "Tell us more about your experience...",
    submitButton: "Submit Feedback",
  },
  finalScreen: {
    positiveHeadline: "Thank you for supporting us.",
    positiveSubtext: "We appreciate you taking the time.",
    negativeHeadline: "Thank you for helping us improve.",
    negativeSubtext: "We'll work on making the experience better.",
  },
};

export const DEFAULT_RATINGS: AppConfig["ratings"] = {
  type: "emoji",
  items: [
    { id: "terrible", emoji: "😡", label: "Terrible", score: 1 },
    { id: "bad", emoji: "😞", label: "Bad", score: 2 },
    { id: "neutral", emoji: "😐", label: "Neutral", score: 3 },
    { id: "good", emoji: "🙂", label: "Good", score: 4 },
    { id: "amazing", emoji: "😍", label: "Amazing", score: 5 },
  ],
  positiveRatings: ["amazing"],
};

export const DEFAULT_FEEDBACK: AppConfig["feedback"] = {
  headings: {
    good: "How can we improve your experience?",
    neutral: "What was missing from your experience?",
    negative: "We're genuinely sorry your experience wasn't great.",
  },
  categoryHeading: "What could be better?",
  categories: ["Service", "Staff", "Wait Time", "Pricing", "Other"],
  textInputLabel: "Additional Thoughts",
  placeholder: "Tell us more about your experience...",
  submitButton: "Submit Feedback",
  required: false,
  minimumCharacters: 0,
  maximumCharacters: 1000,
  requireTextWhenOtherSelected: true,
  allowMultipleCategories: true,
};

export const DEFAULT_INTEGRATIONS: AppConfig["integrations"] = {
  review: {
    googleReviewUrl: "https://g.page/r/example/review",
  },
  feedback: {
    type: "none",
  },
  notifications: {
    enabled: false,
  },
};

export const DEFAULT_ANIMATIONS: AppConfig["animations"] = {
  enabled: true,
  pageTransition: "slideUp",
  transitionDuration: 0.5,
  buttonHoverScale: 1.05,
  buttonTapScale: 0.95,
};

export const DEFAULT_CONFIG: AppConfig = {
  meta: {
    slug: "default",
    version: "1.0",
    redirectDelay: 3,
  },
  business: {
    id: "default",
    name: "Feedback Hub",
  },
  ratings: DEFAULT_RATINGS,
  branding: {
    brandName: "Feedback Hub",
    tagline: "We value your feedback",
    logoType: "none",
    logoUrl: "",
    logo: "",
  },
  theme: DEFAULT_THEME,
  content: DEFAULT_CONTENT,
  feedback: DEFAULT_FEEDBACK,
  integrations: DEFAULT_INTEGRATIONS,
  animations: DEFAULT_ANIMATIONS,
};

export function validateConfig(
  config: any,
  filename: string = "config.json",
): AppConfig {
  const safeConfig: AppConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));

  if (!config || typeof config !== "object") {
    console.warn(
      `Config object is completely invalid or missing for ${filename}. Using default config.`,
    );
    return safeConfig;
  }

  // meta.slug
  if (config?.meta && "slug" in config.meta) {
    const slug = config.meta.slug;
    if (typeof slug === "string" && slug.trim() !== "") {
      safeConfig.meta.slug = slug.trim();
    } else {
      console.warn(`Invalid slug in ${filename}. Using default value.`);
    }
  } else {
    console.warn(`Missing slug in ${filename}. Using default value.`);
  }

  // meta.redirectDelay
  if (config?.meta && "redirectDelay" in config.meta) {
    const redirectDelay = config.meta.redirectDelay;
    if (typeof redirectDelay === "number" && redirectDelay > 0) {
      safeConfig.meta.redirectDelay = redirectDelay;
    } else {
      console.warn(
        `Invalid redirectDelay in ${filename}. Using default value.`,
      );
    }
  } else {
    console.warn(`Missing redirectDelay in ${filename}. Using default value.`);
  }

  // business
  if (config?.business && typeof config.business === "object") {
    if (
      typeof config.business.id === "string" &&
      config.business.id.trim() !== ""
    ) {
      safeConfig.business.id = config.business.id.trim();
    } else {
      console.warn(`Invalid business.id in ${filename}. Using default value.`);
    }

    if (
      typeof config.business.name === "string" &&
      config.business.name.trim() !== ""
    ) {
      safeConfig.business.name = config.business.name.trim();
    } else {
      console.warn(
        `Invalid business.name in ${filename}. Using default value.`,
      );
    }
  } else {
    console.warn(
      `Missing business object in ${filename}. Using default value.`,
    );
  }

  // ratings
  if (config?.ratings && typeof config.ratings === "object") {
    const rType = config.ratings.type;
    if (rType === "emoji" || rType === "stars" || rType === "score") {
      safeConfig.ratings.type = rType;

      if (Array.isArray(config.ratings.positiveRatings)) {
        safeConfig.ratings.positiveRatings = config.ratings.positiveRatings;
      }

      if (
        rType === "emoji" &&
        Array.isArray(config.ratings.items) &&
        config.ratings.items.length > 0
      ) {
        safeConfig.ratings.items = config.ratings.items;
      } else if (
        rType === "stars" &&
        typeof config.ratings.maxStars === "number"
      ) {
        safeConfig.ratings.maxStars = config.ratings.maxStars;
      } else if (
        rType === "score" &&
        typeof config.ratings.min === "number" &&
        typeof config.ratings.max === "number"
      ) {
        safeConfig.ratings.min = config.ratings.min;
        safeConfig.ratings.max = config.ratings.max;
      }
    } else {
      console.warn(
        `Invalid or missing ratings.type in ${filename}. Fallback to emoji.`,
      );
    }
  } else {
    console.warn(`Missing ratings config in ${filename}. Using default value.`);
  }

  // branding.brandName
  if (config?.branding && "brandName" in config.branding) {
    const brandName = config.branding.brandName;
    if (typeof brandName === "string" && brandName.trim() !== "") {
      safeConfig.branding.brandName = brandName.trim();
    } else {
      console.warn(`Invalid brandName in ${filename}. Using default value.`);
    }
  } else {
    console.warn(`Missing brandName in ${filename}. Using default value.`);
  }

  // branding.tagline
  if (config?.branding && "tagline" in config.branding) {
    const tagline = config.branding.tagline;
    if (typeof tagline === "string" && tagline.trim() !== "") {
      safeConfig.branding.tagline = tagline.trim();
    } else {
      console.warn(`Invalid tagline in ${filename}. Using default value.`);
    }
  } else {
    console.warn(`Missing tagline in ${filename}. Using default value.`);
  }

  // branding.logoType and logoUrl
  if (config?.branding) {
    if ("logoType" in config.branding) {
      const type = config.branding.logoType;
      if (
        type === "image" ||
        type === "svg" ||
        type === "icon" ||
        type === "none"
      ) {
        safeConfig.branding.logoType = type;
      } else {
        console.warn(`Invalid logoType in ${filename}. Using default "none".`);
      }
    }

    if ("logoUrl" in config.branding) {
      const url = config.branding.logoUrl;
      if (typeof url === "string") {
        safeConfig.branding.logoUrl = url.trim();
      }
    }

    if ("logo" in config.branding) {
      const logo = config.branding.logo;
      if (typeof logo === "string" && logo.trim() !== "") {
        safeConfig.branding.logo = logo.trim();
      }
    }
  }

  // theme
  if (config?.theme && typeof config.theme === "object") {
    if (
      typeof config.theme.fontPrimary === "string" &&
      config.theme.fontPrimary.trim() !== ""
    ) {
      safeConfig.theme.fontPrimary = config.theme.fontPrimary.trim();
    } else {
      console.warn(`Invalid fontPrimary in ${filename}. Using default value.`);
    }

    if (
      typeof config.theme.fontHeading === "string" &&
      config.theme.fontHeading.trim() !== ""
    ) {
      safeConfig.theme.fontHeading = config.theme.fontHeading.trim();
    } else {
      console.warn(`Invalid fontHeading in ${filename}. Using default value.`);
    }

    if (config.theme.colors && typeof config.theme.colors === "object") {
      const colors = [
        "primary",
        "background",
        "surface",
        "text",
        "mutedText",
        "accent",
      ] as const;
      colors.forEach((color) => {
        if (
          typeof config.theme.colors[color] === "string" &&
          config.theme.colors[color].trim() !== ""
        ) {
          safeConfig.theme.colors[color] = config.theme.colors[color].trim();
        } else {
          console.warn(
            `Invalid colors.${color} in ${filename}. Using default value.`,
          );
        }
      });
    } else {
      console.warn(
        `Missing or invalid theme.colors in ${filename}. Using default value.`,
      );
    }
  } else {
    console.warn(`Missing theme in ${filename}. Using default value.`);
  }

  // content
  if (config?.content && typeof config.content === "object") {
    // welcome
    if (config.content.welcome && typeof config.content.welcome === "object") {
      const welcomeFields = ["feedbackMessage", "ratingQuestion"] as const;
      welcomeFields.forEach((field) => {
        const val = config.content.welcome[field];
        if (typeof val === "string" && val.trim() !== "") {
          safeConfig.content.welcome[field] = val.trim();
        } else if (typeof val === "object" && val !== null) {
          safeConfig.content.welcome[field] = val;
        } else if (val !== undefined) {
          console.warn(
            `Invalid content.welcome.${field} in ${filename}. Using default value.`,
          );
        }
      });
    }

    // positiveFlow
    if (
      config.content.positiveFlow &&
      typeof config.content.positiveFlow === "object"
    ) {
      const positiveFields = [
        "headline",
        "subtext",
        "countdownText",
        "continueButton",
        "loadingMessage",
      ] as const;
      positiveFields.forEach((field) => {
        const val = config.content.positiveFlow[field];
        if (typeof val === "string" && val.trim() !== "") {
          safeConfig.content.positiveFlow[field] = val.trim();
        } else if (typeof val === "object" && val !== null) {
          safeConfig.content.positiveFlow[field] = val;
        } else if (val !== undefined) {
          console.warn(
            `Invalid content.positiveFlow.${field} in ${filename}. Using default value.`,
          );
        }
      });
    }

    // feedbackFlow
    if (
      config.content.feedbackFlow &&
      typeof config.content.feedbackFlow === "object"
    ) {
      const feedbackFields = [
        "goodHeading",
        "neutralHeading",
        "negativeHeading",
        "categoryHeading",
        "additionalThoughtsLabel",
        "textareaPlaceholder",
        "submitButton",
      ] as const;
      feedbackFields.forEach((field) => {
        const val = config.content.feedbackFlow[field];
        if (typeof val === "string" && val.trim() !== "") {
          safeConfig.content.feedbackFlow[field] = val.trim();
        } else if (typeof val === "object" && val !== null) {
          safeConfig.content.feedbackFlow[field] = val;
        } else if (val !== undefined) {
          console.warn(
            `Invalid content.feedbackFlow.${field} in ${filename}. Using default value.`,
          );
        }
      });
    }

    // finalScreen
    if (
      config.content.finalScreen &&
      typeof config.content.finalScreen === "object"
    ) {
      const finalFields = [
        "positiveHeadline",
        "positiveSubtext",
        "negativeHeadline",
        "negativeSubtext",
      ] as const;
      finalFields.forEach((field) => {
        const val = config.content.finalScreen[field];
        if (typeof val === "string" && val.trim() !== "") {
          safeConfig.content.finalScreen[field] = val.trim();
        } else if (typeof val === "object" && val !== null) {
          safeConfig.content.finalScreen[field] = val;
        } else if (val !== undefined) {
          console.warn(
            `Invalid content.finalScreen.${field} in ${filename}. Using default value.`,
          );
        }
      });
    }
  }

  // feedback
  if (config?.feedback && typeof config.feedback === "object") {
    // validation for headings
    if (
      config.feedback.headings &&
      typeof config.feedback.headings === "object"
    ) {
      safeConfig.feedback.headings = safeConfig.feedback.headings || {};
      const headingFields = ["good", "neutral", "negative"] as const;
      headingFields.forEach((field) => {
        const val = config.feedback.headings[field];
        if (typeof val === "string" && val.trim() !== "") {
          safeConfig.feedback.headings![field] = val.trim();
        } else if (typeof val === "object" && val !== null) {
          safeConfig.feedback.headings![field] = val;
        }
      });
    }

    if (Array.isArray(config.feedback.categories)) {
      let validCats: string[] = [];
      for (const cat of config.feedback.categories) {
        if (typeof cat === "string") {
          let trimmedCat = cat.trim();
          if (trimmedCat !== "") {
            if (trimmedCat.length > 40) {
              console.warn(
                `Category exceeds 40 characters and will be trimmed: "${trimmedCat}"`,
              );
              trimmedCat = trimmedCat.substring(0, 40).trim();
            }
            validCats.push(trimmedCat);
          }
        }
      }
      if (validCats.length > 15) {
        console.warn(
          `More than 15 categories provided. Discarding excess categories.`,
        );
        validCats = validCats.slice(0, 15);
      }
      safeConfig.feedback.categories = validCats;
    }

    const tContentFields = [
      "categoryHeading",
      "textInputLabel",
      "placeholder",
      "submitButton",
    ] as const;
    tContentFields.forEach((field) => {
      const val = config.feedback[field];
      if (typeof val === "string" && val.trim() !== "") {
        safeConfig.feedback[field] = val.trim();
      } else if (typeof val === "object" && val !== null) {
        safeConfig.feedback[field] = val;
      }
    });

    const booleanFields = [
      "required",
      "requireTextWhenOtherSelected",
      "allowMultipleCategories",
    ] as const;
    booleanFields.forEach((field) => {
      if (typeof config.feedback[field] === "boolean") {
        safeConfig.feedback[field] = config.feedback[field];
      }
    });

    const numberFields = ["minimumCharacters", "maximumCharacters"] as const;
    numberFields.forEach((field) => {
      if (typeof config.feedback[field] === "number") {
        safeConfig.feedback[field] = config.feedback[field];
      }
    });
  }

  // integrations
  if (config?.integrations && typeof config.integrations === "object") {
    // review
    if (
      config.integrations.review &&
      typeof config.integrations.review === "object"
    ) {
      if (typeof config.integrations.review.googleReviewUrl === "string") {
        safeConfig.integrations.review.googleReviewUrl =
          config.integrations.review.googleReviewUrl.trim();
      }
    }

    // feedback
    if (
      config.integrations.feedback &&
      typeof config.integrations.feedback === "object"
    ) {
      const type = config.integrations.feedback.type;
      if (
        type === "webhook" ||
        type === "google-sheet" ||
        type === "email" ||
        type === "none"
      ) {
        safeConfig.integrations.feedback.type = type;
      }

      const endpointOptions = ["url", "webhook", "endpoint"] as const;
      endpointOptions.forEach((opt) => {
        if (typeof config.integrations.feedback[opt] === "string") {
          safeConfig.integrations.feedback[opt] =
            config.integrations.feedback[opt].trim();
        }
      });
    }

    // notifications
    if (
      config.integrations.notifications &&
      typeof config.integrations.notifications === "object"
    ) {
      if (typeof config.integrations.notifications.enabled === "boolean") {
        safeConfig.integrations.notifications.enabled =
          config.integrations.notifications.enabled;
      }
    }
  }

  // animations
  if (config?.animations && typeof config.animations === "object") {
    if (typeof config.animations.enabled === "boolean") {
      safeConfig.animations.enabled = config.animations.enabled;
    }
    const transition = config.animations.pageTransition;
    if (
      transition === "fade" ||
      transition === "slideUp" ||
      transition === "scale" ||
      transition === "none"
    ) {
      safeConfig.animations.pageTransition = transition;
    }
    if (typeof config.animations.transitionDuration === "number") {
      safeConfig.animations.transitionDuration =
        config.animations.transitionDuration;
    }
    if (typeof config.animations.buttonHoverScale === "number") {
      safeConfig.animations.buttonHoverScale =
        config.animations.buttonHoverScale;
    }
    if (typeof config.animations.buttonTapScale === "number") {
      safeConfig.animations.buttonTapScale = config.animations.buttonTapScale;
    }
  }

  return safeConfig;
}
