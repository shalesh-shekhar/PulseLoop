import { AppConfig, NormalizedRating } from "../types";
import { enqueueFeedback } from "./offlineQueue";

export interface FeedbackPayload {
  businessId: string;
  businessName: string;
  rating: {
    score: number;
    label: string;
  };
  categories: string[];
  message: string;
}

export async function submitFeedback(
  config: AppConfig,
  rating: NormalizedRating,
  categories: string[],
  message: string,
): Promise<boolean> {
  const trimmedMessage = message.trim().substring(0, 2000);

  const payload: FeedbackPayload = {
    businessId: config.business.id,
    businessName: config.business.name,
    rating: {
      score: rating.score,
      label: rating.label,
    },
    categories,
    message: trimmedMessage,
  };

  const integration = config.integrations.feedback;

  if (!integration || integration.type === "none") {
    console.log(
      "Feedback submitted locally (no integration configured):",
      payload,
    );
    return true;
  }

  const endpointUrl =
    integration.url || integration.webhook || integration.endpoint;

  if (!endpointUrl) {
    console.warn(
      `Feedback integration is set to '${integration.type}' but no endpoint URL is configured.`,
    );
    return false;
  }

  if (!navigator.onLine) {
    console.log("Device is offline. Queuing feedback locally.");
    await enqueueFeedback(config, rating, categories, message);
    return true; // We accept the feedback and queue it
  }

  try {
    if (integration.type === "google-sheet") {
      console.log("Google Sheet Payload", payload);
      await fetch(endpointUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify(payload),
      });
      console.log("Google Sheet request sent");
      return true;
    }

    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(
        `Feedback submission failed with status: ${response.status}`,
      );
      // It reached the server but failed, so we probably shouldn't queue it
      return false;
    }

    return true;
  } catch (error) {
    console.error("Feedback submission error:", error);
    // Network error (fetch threw), queue it locally
    console.log("Network error occurred. Queuing feedback locally.");
    await enqueueFeedback(config, rating, categories, message);
    return true;
  }
}
