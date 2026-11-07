import { defineAction } from "@agent-native/core/action";
import { desc } from "drizzle-orm";
import { z } from "zod";

import { getDb, schema } from "../server/db/index.js";

export default defineAction({
  description:
    "List all saved client briefs, newest first. Use this to answer 'what briefs do we have' and to find a brief's id before get-brief or update-brief.",
  mcpTool: true,
  deferLoading: false,
  schema: z.object({}),
  http: { method: "GET" },
  run: async () => {
    const db = getDb();
    const rows = await db
      .select()
      .from(schema.briefs)
      .orderBy(desc(schema.briefs.createdAt));
    return { count: rows.length, briefs: rows };
  },
});
