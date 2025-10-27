"use client";

import { useEffect, useState } from "react";
import { getChatbotSetting } from "@/services/firebase/utils";

// Declare chatbase on the window object for TypeScript
declare global {
  interface Window {
    chatbase?: ((...args: unknown[]) => void) & { q?: unknown[] };
  }
}

export default function ChatbotWidget() {
  const [enabled, setEnabled] = useState(false);

  // Fetch setting from Firebase
  useEffect(() => {
    async function fetchSetting() {
      try {
        const isEnabled = await getChatbotSetting();
        setEnabled(isEnabled);
      } catch (error) {
        console.error("Failed to fetch chatbot setting:", error);
      }
    }
    fetchSetting();
  }, []);

  // Load Chatbase script when enabled
  useEffect(() => {
    if (!enabled) return;

    const script = document.createElement("script");
    script.id = "AT1GbhR0aEHYZk2omhFbp"; 
    script.src = "https://www.chatbase.co/embed.min.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      // Remove the script if disabled
      document.getElementById("AT1GbhR0aEHYZk2omhFbp")?.remove();

      // Remove chatbase object if needed
      if (window.chatbase) {
        delete window.chatbase;
      }
    };
  }, [enabled]);

  return null;
}
