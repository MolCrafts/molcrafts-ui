import { createRoot } from "react-dom/client";
import { VegaView } from "@molcrafts/ui-vega";
import "@molcrafts/ui-tokens/runtime.css";
createRoot(document.getElementById("root")!).render(<VegaView label="Native only" spec={{ marks: [] }} />);
