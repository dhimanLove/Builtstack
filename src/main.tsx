import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Signal static prerender (vite-plugin-prerender) when the app has mounted
requestAnimationFrame(() => {
  document.dispatchEvent(new Event("render-event"));
});
