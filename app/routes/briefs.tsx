import {
  useActionMutation,
  useActionQuery,
} from "@agent-native/core/client/hooks";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_TITLE } from "@/lib/app-config";

export function meta() {
  return [{ title: `${APP_TITLE} — Client Briefs` }];
}

interface Brief {
  id: string;
  clientName: string;
  eventType: string;
  eventDate: string;
  venue: string;
  deliverables: string;
  budgetSignal: string;
  contact: string;
  missingInfo: string;
  status: string;
  rawEnquiry: string;
  createdAt: string;
}

const EMPTY_FORM = {
  clientName: "",
  eventType: "",
  eventDate: "",
  venue: "",
  deliverables: "",
  budgetSignal: "",
  contact: "",
  missingInfo: "",
  rawEnquiry: "",
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function BriefCard({
  brief,
  onApprove,
  onShowSummary,
  approving,
}: {
  brief: Brief;
  onApprove: (id: string) => void;
  onShowSummary: (id: string) => void;
  approving: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <span>{brief.clientName}</span>
          <span
            className={
              brief.status === "approved"
                ? "rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
                : "rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800"
            }
          >
            {brief.status}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 text-sm">
        {(brief.eventType || brief.eventDate) && (
          <p>
            <strong>Event:</strong>{" "}
            {[brief.eventType, brief.eventDate].filter(Boolean).join(" · ")}
          </p>
        )}
        {brief.venue && (
          <p>
            <strong>Venue:</strong> {brief.venue}
          </p>
        )}
        {brief.deliverables && (
          <p>
            <strong>Deliverables:</strong> {brief.deliverables}
          </p>
        )}
        {brief.budgetSignal && (
          <p>
            <strong>Budget:</strong> {brief.budgetSignal}
          </p>
        )}
        {brief.contact && (
          <p>
            <strong>Contact:</strong> {brief.contact}
          </p>
        )}
        {brief.missingInfo && (
          <p className="text-amber-700">
            <strong>Still to confirm:</strong> {brief.missingInfo}
          </p>
        )}
        <div className="mt-2 flex gap-2">
          {brief.status !== "approved" && (
            <Button
              size="sm"
              disabled={approving}
              onClick={() => onApprove(brief.id)}
            >
              Approve brief
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onShowSummary(brief.id)}
          >
            View summary
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function BriefsRoute() {
  const { data, isLoading } = useActionQuery("list-briefs", {});
  const saveBrief = useActionMutation("save-brief");
  const updateBrief = useActionMutation("update-brief");
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const summaryQuery = useActionQuery(
    "get-brief",
    { id: selectedId ?? "" },
    { enabled: !!selectedId },
  );

  const briefs: Brief[] =
    (data as { briefs?: Brief[] } | undefined)?.briefs ?? [];

  const set = (key: keyof typeof EMPTY_FORM) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">BriefDesk</h1>
        <p className="text-sm text-muted-foreground">
          Messy client enquiry in, structured production brief out. Paste an
          enquiry into the agent chat and it saves the brief here — or add one
          manually below. Same actions, same data, every surface.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add a brief manually</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              saveBrief.mutate(form, {
                onSuccess: () => setForm(EMPTY_FORM),
              });
            }}
          >
            <Field label="Client name *">
              <Input
                required
                value={form.clientName}
                onChange={(e) => set("clientName")(e.target.value)}
              />
            </Field>
            <Field label="Event type">
              <Input
                value={form.eventType}
                onChange={(e) => set("eventType")(e.target.value)}
                placeholder="Product launch, wedding, conference…"
              />
            </Field>
            <Field label="Event date">
              <Input
                value={form.eventDate}
                onChange={(e) => set("eventDate")(e.target.value)}
              />
            </Field>
            <Field label="Venue / city">
              <Input
                value={form.venue}
                onChange={(e) => set("venue")(e.target.value)}
              />
            </Field>
            <Field label="Deliverables">
              <Input
                value={form.deliverables}
                onChange={(e) => set("deliverables")(e.target.value)}
                placeholder="Highlight film, same-day edit…"
              />
            </Field>
            <Field label="Budget signal">
              <Input
                value={form.budgetSignal}
                onChange={(e) => set("budgetSignal")(e.target.value)}
              />
            </Field>
            <Field label="Contact">
              <Input
                value={form.contact}
                onChange={(e) => set("contact")(e.target.value)}
              />
            </Field>
            <Field label="Still to confirm">
              <Input
                value={form.missingInfo}
                onChange={(e) => set("missingInfo")(e.target.value)}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Original enquiry">
                <textarea
                  className="min-h-20 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={form.rawEnquiry}
                  onChange={(e) => set("rawEnquiry")(e.target.value)}
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={saveBrief.isPending}>
                {saveBrief.isPending ? "Saving…" : "Save brief"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">
          Briefs {isLoading ? "" : `(${briefs.length})`}
        </h2>
        {isLoading && <p className="text-sm">Loading briefs…</p>}
        {!isLoading && briefs.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No briefs yet. Ask the agent in chat to file one from a client
            enquiry, or add one above.
          </p>
        )}
        {briefs.map((b) => (
          <BriefCard
            key={b.id}
            brief={b}
            approving={updateBrief.isPending}
            onApprove={(id) =>
              updateBrief.mutate({ id, status: "approved" })
            }
            onShowSummary={(id) => setSelectedId(id)}
          />
        ))}
      </section>

      {selectedId && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Brief summary</CardTitle>
          </CardHeader>
          <CardContent>
            {summaryQuery.isLoading ? (
              <p className="text-sm">Loading…</p>
            ) : (
              <pre className="whitespace-pre-wrap text-sm">
                {(summaryQuery.data as { summary?: string } | undefined)
                  ?.summary ?? "No summary available."}
              </pre>
            )}
            <Button
              className="mt-3"
              size="sm"
              variant="outline"
              onClick={() => setSelectedId(null)}
            >
              Close
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
