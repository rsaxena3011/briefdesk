import { defineAction } from "@agent-native/core/action";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "../server/db/index.js";

export default defineAction({
  description:
    "Update fields of an existing client brief, or change its status. Status 'approved' means the producer has reviewed the brief and it is ready to act on. Only the fields you pass are changed.",
  mcpTool: true,
  deferLoading: false,
  schema: z.object({
    id: z.string().describe("The brief id to update"),
    clientName: z.string().optional(),
    eventType: z.string().optional(),
    eventDate: z.string().optional(),
    venue: z.string().optional(),
    deliverables: z.string().optional(),
    budgetSignal: z.string().optional(),
    contact: z.string().optional(),
    missingInfo: z.string().optional(),
    status: z
      .enum(["draft", "approved"])
      .optional()
      .describe("Set to 'approved' once the brief has been reviewed"),
  }),
  http: { method: "POST" },
  run: async ({ id, ...fields }) => {
    const db = getDb();
    const patch: Record<string, string> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (typeof value === "string") patch[key] = value;
    }
    if (Object.keys(patch).length === 0) {
      throw new Error("Nothing to update: pass at least one field.");
    }
    patch.updatedAt = new Date().toISOString();
    await db
      .update(schema.briefs)
      .set(patch)
      .where(eq(schema.briefs.id, id));
    const rows = await db
      .select()
      .from(schema.briefs)
      .where(eq(schema.briefs.id, id));
    if (!rows[0]) {
      throw new Error(`No brief found with id ${id}`);
    }
    return { ok: true, brief: rows[0] };
  },
});
