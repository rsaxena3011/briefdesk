import { defineAppConfig } from "@agent-native/core/server";

export default defineAppConfig({
  app: {
    // This name appears in transactional emails. Change it to your product name.
    name: "BriefDesk",
    // The source template keeps a renamed app from inheriting first-party email branding.
    sourceTemplate: "chat",
    // BriefDesk's domain home is the briefs board.
    homePath: "/briefs",
  },
});
