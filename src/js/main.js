// Entry module: mounts the calculator wiring on the page's calculator root.
// No locale is passed, so formatting follows the runtime's default locale.
import { mount } from "./app.js";

mount(document.querySelector(".calculator"));
