import { defineAction } from "@agent-native/core/action";
import { z } from "zod";

import { getDb, schema } from "../server/db/index.js";

export default defineAction({
  description:
    "Save ONE structured client brief extracted from a client enquiry. Call this exactly once per enquiry, with every field you can extract from the text. Anything the enquiry does not state goes in missingInfo as a question, never invented.",
  mcpTool: true,
  deferLoading: false,
  schema: z.object({
    clientName: z.string().describe("Client or company name from the enquiry"),
    eventType: z
      .string()
      .default("")
      .describe("Type of event or production, e.g. 'product launch', 'wedding', 'conference'"),
    eventDate: z
      .string()
      .default("")
      .describe("Event date exactly as stated, e.g. '2026-12-05' or 'mid December'"),
    venue: z.string().default("").describe("Venue or city, if stated"),
    deliverables: z
      .string()
      .default("")
      .describe("What the client wants delivered, comma separated"),
    budgetSignal: z
      .string()
      .default("")
      .describe("Any budget figure or budget signal stated, verbatim if possible"),
    contact: z
      .string()
      .default("")
      .describe("Contact person, phone or email, if stated"),
    missingInfo: z
      .string()
      .default("")
      .describe("Important questions the enquiry leaves unanswered, comma separated"),
    rawEnquiry: z
      .string()
      .default("")
      .describe("The original enquiry text, verbatim"),
  }),
  http: { method: "POST" },
  run: async (args, ctx) => {
    const db = getDb();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await db.insert(schema.briefs).values({
      id,
      clientName: args.clientName,
      eventType: args.eventType,
      eventDate: args.eventDate,
      venue: args.venue,
      deliverables: args.deliverables,
      budgetSignal: args.budgetSignal,
      contact: args.contact,
      missingInfo: args.missingInfo,
      rawEnquiry: args.rawEnquiry,
      status: "draft",
      ownerEmail: ctx?.userEmail ?? "",
      createdAt: now,
      updatedAt: now,
    });
    return { ok: true, id, status: "draft" };
  },
});
