import { runMigrations } from "@agent-native/core/db";

export default runMigrations(
  [
    {
      version: 1,
      name: "briefdesk-briefs-table",
      sql: `CREATE TABLE IF NOT EXISTS briefs (
        id TEXT PRIMARY KEY,
        client_name TEXT NOT NULL,
        event_type TEXT NOT NULL DEFAULT '',
        event_date TEXT NOT NULL DEFAULT '',
        venue TEXT NOT NULL DEFAULT '',
        deliverables TEXT NOT NULL DEFAULT '',
        budget_signal TEXT NOT NULL DEFAULT '',
        contact TEXT NOT NULL DEFAULT '',
        missing_info TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'draft',
        raw_enquiry TEXT NOT NULL DEFAULT '',
        owner_email TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`,
    },
  ],
  { table: "briefdesk_migrations" },
);
