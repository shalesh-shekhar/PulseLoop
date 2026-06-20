import { openDB, DBSchema, IDBPDatabase } from "idb";
import { v4 as uuidv4 } from "uuid";
import { AppConfig, NormalizedRating } from "../types";
import { FeedbackPayload } from "./submitFeedback";

export interface QueuedFeedback extends FeedbackPayload {
  id: string;
  config: AppConfig;
  createdAt: string;
  retryCount: number;
}

interface FeedbackQueueDB extends DBSchema {
  feedbackQueue: {
    key: string;
    value: QueuedFeedback;
    indexes: { "by-date": string };
  };
}

const DB_NAME = "feedback-queue-db";
const DB_VERSION = 1;
const STORE_NAME = "feedbackQueue";

let dbPromise: Promise<IDBPDatabase<FeedbackQueueDB>> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<FeedbackQueueDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
        });
        store.createIndex("by-date", "createdAt");
      },
    });
  }
  return dbPromise;
}

export async function enqueueFeedback(
  config: AppConfig,
  rating: NormalizedRating,
  categories: string[],
  message: string,
): Promise<void> {
  const db = await getDb();
  const id = uuidv4();

  const payload: QueuedFeedback = {
    id,
    config,
    businessId: config.business.id,
    businessName: config.business.name,
    rating: {
      score: rating.score,
      label: rating.label,
    },
    categories,
    message: message.trim().substring(0, 2000),
    createdAt: new Date().toISOString(),
    retryCount: 0,
  };

  await db.add(STORE_NAME, payload);
  console.log("Feedback queued locally:", id);
  // Attempt to trigger sync immediately if online
  if (navigator.onLine) {
    processQueue();
  }
}

export async function processQueue(): Promise<void> {
  if (!navigator.onLine) return;

  const db = await getDb();
  let items = await db.getAll(STORE_NAME);

  // Sort by date created
  items.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  if (items.length === 0) return;

  console.log(`Processing ${items.length} queued feedback items...`);

  for (const item of items) {
    try {
      const success = await sendFeedbackRequest(item);
      if (success) {
        await db.delete(STORE_NAME, item.id);
        console.log(`Successfully sent queued feedback: ${item.id}`);
      } else {
        // Increment retry count, maybe save it
        item.retryCount++;
        await db.put(STORE_NAME, item);
      }
    } catch (error) {
      console.error(`Error sending queued feedback ${item.id}:`, error);
      item.retryCount++;
      await db.put(STORE_NAME, item);
      // If one fails due to network, we should probably stop processing the rest and wait for next online event
      break;
    }
  }
}

async function sendFeedbackRequest(item: QueuedFeedback): Promise<boolean> {
  const integration = item.config.integrations.feedback;

  if (!integration || integration.type === "none") {
    return true; // Pretend we sent it, it's local only
  }

  const endpointUrl =
    integration.url || integration.webhook || integration.endpoint;
  if (!endpointUrl) return false;

  const payload: FeedbackPayload = {
    businessId: item.businessId,
    businessName: item.businessName,
    rating: item.rating,
    categories: item.categories,
    message: item.message,
  };

  if (integration.type === "google-sheet") {
    await fetch(endpointUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(payload),
    });
    return true;
  }

  const response = await fetch(endpointUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return response.ok;
}

// Setup listeners
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    console.log("Network online. Processing queue...");
    processQueue();
  });
}
