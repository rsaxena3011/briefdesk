import { defineAction } from "@agent-native/core/action";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "../server/db/index.js";

function formatSummary(b: typeof schema.briefs.$inferSelect): string {
  const line = (label: string, value: string) =>
    value ? `${label}: ${value}` : null;
  return [
    `CLIENT BRIEF — ${b.clientName}`,
    line("Event", [b.eventType, b.eventDate].filter(Boolean).join(" · ")),
    line("Venue", b.venue),
    line("Deliverables", b.deliverables),
    line("Budget signal", b.budgetSignal),
    line("Contact", b.contact),
    line("Still to confirm", b.missingInfo),
    `Status: ${b.status}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export default defineAction({
  description:
    "Get one client brief by id, including a ready-to-send formatted summary of the brief.",
  mcpTool: true,
  deferLoading: false,
  schema: z.object({
    id: z.string().describe("The brief id, from save-brief or list-briefs"),
  }),
  http: { method: "GET" },
  run: async ({ id }) => {
    const db = getDb();
    const rows = await db
      .select()
      .from(schema.briefs)
      .where(eq(schema.briefs.id, id));
    const brief = rows[0];
    if (!brief) {
      throw new Error(`No brief found with id ${id}`);
    }
    return { brief, summary: formatSummary(brief) };
  },
});
