import { useEffect } from "react";
import mixpanel from "mixpanel-browser";
import useAppState from "./useAppState";

function useAnalytics() {
  const isDevelopment = process.env.APP_ENV === "development";
  const { userId } = useAppState();

  useEffect(() => {
    // Setup Mixpanel logging
    mixpanel.init(process.env.MIXPANEL_PROJECT_TOKEN || "", {
      debug: isDevelopment,
      ignore_dnt: true,
    });

    // Set this to a unique identifier for the user performing the event
    mixpanel.identify(userId);

    // Set user properties, including the username
    mixpanel.people.set({
      $name: userId,
      $app: process.env.APP_NAME,
    });
  }, []);

  function trackEvent(eventName: string, tags: Record<string, string> = {}) {
    const allTags = {
      enviroment: process.env.APP_ENV,
      app: process.env.APP_NAME,
      ...tags,
    };
    mixpanel.track(eventName, allTags);

    if (isDevelopment) {
      console.log("tracked", eventName, allTags);
    }
  }

  return { trackEvent };
}

export default useAnalytics;
