import { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Button, Input, NumberField, Checkbox, Card, CardContent,
  Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger,
} from "@molcrafts/design";
import "@molcrafts/design-tokens/runtime.css";
import "@molcrafts/design/styles.css";
import "./page.css";
import { Themes } from "./themes";

function App() {
  const [count, setCount] = useState(0);
  const [number, setNumber] = useState(2);
  return <main>
    <h1>Built-package consumer</h1>
    <p>Rsbuild loads public exports and compiled CSS without Tailwind configuration.</p>
    <Button onClick={() => document.documentElement.classList.toggle("dark")}>Toggle theme</Button>
    <Card><CardContent>
      <Button id="primary" onClick={() => setCount(value => value + 1)}>Increment</Button>
      <output aria-label="Count">{count}</output>
      <label htmlFor="name">Name</label><Input id="name" defaultValue="MolCrafts" />
      <label htmlFor="number">Quantity</label><NumberField id="number" value={number} min={0} max={10} onChange={setNumber} />
      <output aria-label="Quantity value">{number}</output>
      <label><Checkbox aria-label="Enable notifications" /> Enable notifications</label>
      <Dialog><DialogTrigger asChild><Button variant="secondary">Open dialog</Button></DialogTrigger>
        <DialogContent><DialogTitle>Package dialog</DialogTitle><DialogDescription>Focus and theme inheritance work through the public package.</DialogDescription></DialogContent>
      </Dialog>
    </CardContent></Card>
    <section className="mol-product-theme product-brand" aria-label="Product theme">
      <Button>Product action</Button>
    </section>
  </main>;
}
createRoot(document.getElementById("root")!).render(location.pathname === "/themes" ? <Themes /> : <App />);
