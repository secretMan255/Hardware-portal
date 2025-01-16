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
