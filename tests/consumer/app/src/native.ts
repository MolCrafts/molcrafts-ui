import { registerMolcraftsComponents } from "@molcrafts/ui-web-components";
import "@molcrafts/ui-web-components/theme.css";

async function start() {
  await registerMolcraftsComponents();
  document.getElementById("root")!.innerHTML = `
    <main data-mol-theme="dark" style="padding:24px;background:var(--background);color:var(--foreground)">
      <h1>Native package consumer</h1>
      <fluent-button id="native-primary" appearance="primary" type="button">Increment native</fluent-button>
      <output id="native-count" aria-label="Native count">0</output>
    </main>`;
  let count = 0;
  document.getElementById("native-primary")!.addEventListener("click", () => {
    document.getElementById("native-count")!.textContent = String(++count);
  });
}
void start();
