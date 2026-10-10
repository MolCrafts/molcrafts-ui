import { createRoot } from "react-dom/client";
import { VegaView } from "@molcrafts/design-vega";
import "@molcrafts/design-tokens/runtime.css";
createRoot(document.getElementById("root")!).render(<VegaView label="Native only" spec={{ marks: [] }} />);
