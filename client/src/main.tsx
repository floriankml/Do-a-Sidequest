import { inject } from "@vercel/analytics";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

inject();

createRoot(document.getElementById("root")!).render(<App />);
