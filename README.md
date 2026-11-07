# BriefDesk

Messy client enquiry in, structured production brief out.

Production teams lose the first hour of every job to the same chore: a client
sends a rambling WhatsApp message or email ("partners meet, sometime in
January, Lonavala, need coverage and an aftermovie, budget tight-ish…"), and a
producer has to turn it into a brief the crew can actually work from — client,
event, date, venue, deliverables, budget signal, contact — plus the list of
things the client never said and somebody now has to chase.

BriefDesk does that extraction once, properly, and then keeps the brief where
every surface can work on it.

## How it works

BriefDesk is built on the agent-native pattern: the capabilities are defined
ONCE as actions, and the same actions — over the same SQL state — serve the
human UI, the agent chat, plain HTTP callers, and MCP clients.

**Four domain actions** (`actions/`, all `defineAction` + Zod):

| Action | Method | What it does |
| --- | --- | --- |
| `save-brief` | POST | Save one structured brief extracted from an enquiry. Anything the enquiry does not state goes into `missingInfo` as a question — never invented. |
| `list-briefs` | GET | List all briefs, newest first. |
| `get-brief` | GET | One brief by id, plus a ready-to-send formatted summary. |
| `update-brief` | POST | Patch fields, or mark a brief `approved` once a producer has reviewed it. |

Briefs live in a Drizzle `briefs` table on PGlite (`server/db/`), so a brief
saved by the agent in chat is the same row the board renders and an MCP client
reads back. There is no second copy to drift.

## The surfaces

- **Board UI — `/briefs`.** The producer's desk: every brief as a card with
  its status, a manual add-brief form, one-click approve, and the formatted
  summary view. This is the app's home screen.
- **Agent chat — `/chat`.** Paste a raw client enquiry and the agent calls
  `save-brief` exactly once with the extracted fields, then confirms. The new
  brief appears on the board immediately.
- **HTTP.** `GET`/`POST /_agent-native/actions/<action>` — the same endpoints
  the UI itself calls.
- **MCP.** Every action is also an MCP tool on `/mcp` (OAuth-protected), so an
  external agent host can file and read briefs with the producer's identity.

## Stack

- [agent-native](https://github.com/BuilderIO/agent-native) framework
  (`@agent-native/core`) — actions, agent chat, MCP server, auth.
- React Router UI, Drizzle ORM over PGlite for shared SQL state.
- The agent runs against a live LLM. In this build the model is a local
  Ollama model (`qwen2.5:3b`) — zero spend, fully self-contained; any
  framework-supported engine can be selected in Settings instead.

## Run it locally

```bash
# Node 22.22+
npx --yes pnpm@10.29.1 install
# .env: point the framework at a running Ollama
#   OLLAMA_BASE_URL=http://localhost:11434
npx --yes pnpm@10.29.1 dev   # http://localhost:8080
```

On a loopback dev server the framework offers its "Continue as local dev"
sign-in; that session owns the briefs you create locally.

## Disclosure

Built for the Builder.io Agent-Native hackathon (C155). The app was
scaffolded on 2026-11-07 from the framework's `chat` starter template; the
template provided the app shell, auth, chat and framework plumbing. The
BriefDesk concept, the four brief actions, the `briefs` schema and migration,
the `/briefs` board, and the agent's extraction behaviour are original work
for this hackathon. Template sample content (the starter README, the sample
`hello` action, vendor deploy config) was removed before submission.
