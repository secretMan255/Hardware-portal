import mitt from "mitt";

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
  return new Promise((resolve, reject) => {
    grecaptcha.ready(() => {
      grecaptcha
        .execute(siteKey, { action })
        .then((token) => {
          resolve(token);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
};

export function emailValidate(email: string) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.com)$/.test(email);
}

export function validatePassword(pass: string) {
  return (
    pass.length >= 8 &&
    pass.length <= 16 &&
    /[A-Z]/.test(pass) &&
    /[a-z]/.test(pass) &&
    /\d/.test(pass) &&
    /[!_@#$%^&*(),.?":{}|<>]/.test(pass)
  );
}

export function validateOtp(otp: string) {
  return otp.length === 6;
}

export function validateName(name: string) {
  return name.length >= 1 && name.length <= 45;
}

export function validatePhone(phone: string) {
  return /^\d{8,15}$/.test(phone);
}

export function validateAddress(address: string) {
  return address.length >= 1 && address.length <= 255;
}

export function validatePostcode(postcode: string) {
  return postcode.length === 5;
}

export const EventBus = mitt();

export function priceDecimal(price: number, currency?: string) {
  return (
    `${currency || ""} ` +
    price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

export function parseProductDescribe(raw: any) {
  const cleaned = raw.replace(/^\{|\}$/g, "").replace(/\\/g, "");

  const splitValues = cleaned.split(",").map((value: any) =>
    value
      .trim() // Trim spaces
      .replace(/^"|"$/g, "")
      .replace(/^\{|\}$/g, "")
      .replace('"', "")
  );

  return splitValues;
}

export function getProductImage(productName: string) {
  return new URL(
    `https://storage.googleapis.com/veryhardware/${productName}.jpeg`
  ).href;
}
