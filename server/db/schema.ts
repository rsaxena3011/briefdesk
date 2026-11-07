import { pgTable, text } from "drizzle-orm/pg-core";

/**
 * BriefDesk domain table. One row = one structured client brief, extracted
 * from a messy client enquiry. Written by the agent (via save-brief), by the
 * UI form, and by HTTP/MCP callers — all through the same actions.
 */
export const briefs = pgTable("briefs", {
  id: text("id").primaryKey(),
  clientName: text("client_name").notNull(),
  eventType: text("event_type").notNull().default(""),
  eventDate: text("event_date").notNull().default(""),
  venue: text("venue").notNull().default(""),
  deliverables: text("deliverables").notNull().default(""),
  budgetSignal: text("budget_signal").notNull().default(""),
  contact: text("contact").notNull().default(""),
  missingInfo: text("missing_info").notNull().default(""),
  status: text("status").notNull().default("draft"),
  rawEnquiry: text("raw_enquiry").notNull().default(""),
  ownerEmail: text("owner_email").notNull().default(""),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
