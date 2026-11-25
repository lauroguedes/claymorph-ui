# For AI

Machine-readable docs, a skill, and an agent bridge.

- `/llms.txt`: the rules and an index of every page.
- `/llms-full.txt`: every page in one file.
- `/docs/<page>.md`: each page as Markdown, demos inlined.
- `skills/clay-ui/SKILL.md`: tells an agent which element to use and to wrap ui-sdk parts instead of drawing clay by hand.

## Agents on the page

Clay elements only add a body; the ui-sdk parts inside them stay what an agent sees. `createAgent` from `@ui-sdk/web/agent` lists and operates every Claymorph UI control by its name, and `registerTools` publishes the same tools over WebMCP. This site registers them, so a browser agent can press the demos.

```ts
import { createAgent, registerTools } from "@ui-sdk/web/agent"

const agent = createAgent()
registerTools(agent, { allow: () => true })
```

## A prompt that works

```text
Read /llms.txt. Build a settings panel with Claymorph UI: a Slide for the theme,
a Flip for notifications, a Stretch for volume and a Roll to save.
```
