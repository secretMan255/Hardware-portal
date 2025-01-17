export function loadGoogleApi() {
  return new Promise<void>((resolve, reject) => {
    if (document.getElementById("google-api")) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id = "google-api";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (error) => reject(error);
    document.head.appendChild(script);
  });
}

export function loadRecaptcha(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (document.getElementById("recaptcha-api")) {
      resolve();
      return;
    }

    const siteKey = import.meta.env.VITE_SITE_KEY;
    if (!siteKey) {
      reject(new Error("reCAPTCHA site key is missing"));
      return;
    }

    const script = document.createElement("script");
    script.id = "recaptcha-api";
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (error) => reject(error);

    document.head.appendChild(script);
  });
}

export const executeRecaptcha = async (action: string): Promise<string> => {
  if (typeof grecaptcha === "undefined") {
    throw new Error("reCAPTCHA is not loaded");
  }

  const siteKey = import.meta.env.VITE_SITE_KEY;
  return await grecaptcha.execute(siteKey, { action });
};
