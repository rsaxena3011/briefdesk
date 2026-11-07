import { getOrgContext } from "@agent-native/core/org";
import {
  createAgentChatPlugin,
  loadActionsFromStaticRegistry,
} from "@agent-native/core/server";

import actionsRegistry from "../../.generated/actions-registry.js";
import {
  searchConversationReferences,
  validateConversationReferences,
} from "../lib/composer-references.js";

const INITIAL_TOOL_NAMES = [
  "view-screen",
  "navigate",
  "save-brief",
  "list-briefs",
  "get-brief",
  "update-brief",
];

export default createAgentChatPlugin({
  appId: "briefdesk",
  mentionProviders: {
    chats: {
      label: "composerSources.group",
      search: searchConversationReferences,
    },
  },
  prepareRequest: async ({ references }) => {
    await validateConversationReferences(references);
  },
  actions: loadActionsFromStaticRegistry(actionsRegistry),
  mcp: { connectorCatalog: [], appApprovalPage: true },
  initialToolNames: INITIAL_TOOL_NAMES,
  resolveOrgId: async (event) => (await getOrgContext(event)).orgId,
  systemPrompt: `You are the BriefDesk agent. BriefDesk turns messy client enquiries into structured production briefs for a video production team.

Your tools are the brief actions: save-brief, list-briefs, get-brief, update-brief. They are the source of truth, shared with the UI at /briefs, HTTP, and MCP.

Rules:
- When the user pastes or describes a client enquiry, call save-brief EXACTLY ONCE with every field you can extract from the text. Never invent facts: anything the enquiry does not state goes in missingInfo as an open question. Then reply with one short line confirming the brief was saved, naming the client and the top open question.
- When the user asks what briefs exist, call list-briefs and summarise briefly.
- When the user asks to approve or change a brief, call update-brief with that brief's id (find it via list-briefs first if needed).
- Do not call view-screen, navigate, or any other tool before save-brief. Keep replies short.`,
});
