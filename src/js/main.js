// Entry module: mounts the calculator wiring on the page's calculator root.
// No locale is passed, so formatting follows the runtime's default locale.
import { mount } from "./app.js";

mount(document.querySelector(".calculator"));

// Offline support: register the service worker only where supported, and never
// let a registration failure affect the calculator.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {
    // Registration failed (for example an insecure origin); the app still works online.
  });
}
