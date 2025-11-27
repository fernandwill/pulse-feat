import { useMemo, useState } from "react"
import "./App.css"
import { IoClose } from "react-icons/io5"

type Meeting = { 
  id: string; 
  title: string; 
  start: string; 
  end: string; 
  location?: string; 
  attendees: number; 
  type: "internal" | "external" 
}

type Task = { 
  id: string; 
  title: string; 
  due: string; 
  priority: "high" | "medium" | "low"; 
  status: "open" | "in-progress" | "done" 
}

type Email = { 
  id: string; 
  from: string; 
  subject: string; 
  received: string; 
  flagged: boolean; 
  unread: boolean; 
  urgency: "high" | "normal" 
}

type PriorityItem = { 
  id: string; 
  label: string; 
  rationale: string; 
  category: "meeting" | "task" | "email"; 
  time?: string 
}

const meetings: Meeting[] = [
  { 
    id: "m1", 
    title: "Product Standup", 
    start: "09:00", 
    end: "09:30", 
    location: "Zoom", 
    attendees: 8, 
    type: "internal" 
  },
  { 
    id: "m2", 
    title: "Client Sync - Nova", 
    start: "11:00", 
    end: "11:45", 
    location: "Room 3", 
    attendees: 4, 
    type: "external" 
  },
  { 
    id: "m3", 
    title: "Design Review", 
    start: "15:00", 
    end: "16:00", 
    location: "Figma", 
    attendees: 5, 
    type: "internal" 
  },
]

const tasks: Task[] = [
  { 
    id: "t1", 
    title: "Ship homepage hero", 
    due: "Today 14:00", 
    priority: "high", 
    status: "in-progress" 
  },
  { 
    id: "t2", 
    title: "Refine notification copy", 
    due: "Today 17:00", 
    priority: "medium", 
    status: "open" 
  },
  { 
    id: "t3", 
    title: "QA 'Reschedule' flow", 
    due: "Tomorrow 10:00", 
    priority: "high", 
    status: "open" 
  },
]

const emails: Email[] = [
  { 
    id: "e1", 
    from: "CEO", 
    subject: "Launch checklist sign-off", 
    received: "08:05", 
    flagged: true, 
    unread: true, 
    urgency: "high" 
  },
  { 
    id: "e2", 
    from: "Client - Nova", 
    subject: "Agenda + materials", 
    received: "07:40", 
    flagged: false, 
    unread: true, 
    urgency: "normal" 
  },
  { 
    id: "e3", 
    from: "Finance", 
    subject: "Budget unlock confirmation", 
    received: "Yesterday", 
    flagged: true, 
    unread: false, 
    urgency: "normal" 
  },
]

const sortByTime = (items: Meeting[]) => [...items].sort((a, b) => a.start.localeCompare(b.start))

const sortTasks = (items: Task[]) =>
  [...items].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    const statusOrder = { open: 0, "in-progress": 1, done: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority] || statusOrder[a.status] - statusOrder[b.status]
  })

const attentionEmails = (items: Email[]) => items.filter((e) => e.flagged || e.unread || e.urgency === "high")

const generatePlan = (ms: Meeting[], ts: Task[], es: Email[]): PriorityItem[] => {
  const orderedMeetings = sortByTime(ms)
    .slice(0, 2)
    .map((m) => ({
      id: `pm-${m.id}`,
      label: `${m.start}  -  ${m.title}`,
      rationale: m.type === "external" ? "Prep 10m early" : "Internal alignment",
      category: "meeting" as const,
      time: m.start,
    }))

  const orderedTasks = sortTasks(ts)
    .slice(0, 3)
    .map((t) => ({
      id: `pt-${t.id}`,
      label: t.title,
      rationale: `${t.priority === "high" ? "High priority" : "Due soon"}  -  ${t.due}`,
      category: "task" as const,
    }))

  const orderedEmails = attentionEmails(es)
    .slice(0, 2)
    .map((e) => ({
      id: `pe-${e.id}`,
      label: e.subject,
      rationale: `${e.from}  -  ${e.urgency === "high" ? "Respond ASAP" : "Reply today"}`,
      category: "email" as const,
      time: e.received,
    }))

  return [...orderedMeetings, ...orderedTasks, ...orderedEmails]
}

function App() {
  const [plan] = useState(() => generatePlan(meetings, tasks, emails))
  const [rescheduleOpen, setRescheduleOpen] = useState(false)

  const organizedMeetings = useMemo(() => sortByTime(meetings), [])
  const organizedTasks = useMemo(() => sortTasks(tasks), [])
  const criticalEmails = useMemo(() => attentionEmails(emails), [])

  const reschedulePlan = useMemo(
    () => [
      {
        id: "r1",
        title: "Move Design Review to 13:00",
        detail: "Opens a 15:00-17:00 deep work block while keeping attendees aligned.",
      },
      {
        id: "r2",
        title: "Start Standup at 09:10",
        detail: "Gives 10 minutes buffer for overnight emails and context switch.",
      },
      {
        id: "r3",
        title: "Shift Client Sync to 11:15",
        detail: "Keeps prep time immediately before and reduces context thrash.",
      },
    ], [])

  const handleSend = (channel: "push" | "email" | "notification") => {
    console.log(`Sending summary via ${channel}`)
  }

  const handleReschedule = () => {
    setRescheduleOpen(true)
  }

  return (
    <div className="min-h-screen bg-black text-slate-100">
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-50 blur-3xl">
          <div className="absolute -left-24 top-10 h-56 w-56 rounded-full bg-cyan-500/40" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-indigo-500/30" />
          <div className="absolute bottom-0 left-10 h-64 w-64 rounded-full bg-emerald-500/20" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-10 lg:py-14">
          <header className="mb-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pulse / Today</p>
                <h1 className="text-3xl font-semibold leading-tight text-slate-50 sm:text-4xl">
                  All your meetings, tasks, and inbox in one page.
                </h1>
                <p className="text-base text-slate-300">
                  Auto-organized day view. Clear priorities. Quick actions to notify or reschedule intelligently.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    className="rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-indigo-500/30 transition hover:-translate-y-0.5 hover:shadow-indigo-500/50"
                    onClick={() => handleSend("notification")}
                  >
                    Send Summary
                  </button>
                  <button
                    className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-white/30 hover:bg-white/5"
                    onClick={() => handleReschedule()}
                  >
                    Reschedule everything intelligently
                  </button>
                </div>
              </div>
            </div>
          </header>

          <main className="grid gap-4 md:grid-cols-2">
            <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-white">Today's Meetings</h2>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate">Auto-organized</span>
              </div>
              <div className="space-y-3">
                {organizedMeetings.map((m) => (
                  <div
                    key={m.id}
                    className="grid grid-cols-[96px,1fr] gap-3 rounded-xl border border-white/10 bg-slate p-3 text-sm shadow-sm"
                  >
                    <div className="font-semibold text-cyan-300">
                      {m.start}-{m.end}
                    </div>
                    <div className="space-y-1">
                      <div className="font-semibold text-white">{m.title}</div>
                      <div className="text-slate">
                        {m.location}  -  {m.attendees} attending  -  {m.type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-white">Key Tasks & Deadlines</h2>
                <span className="rounded-full border border-blue-200/30 px-3 py-1 text-xs text-blue-100">By priority</span>
              </div>
              <div className="space-y-3">
                {organizedTasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-slate p-3 text-sm shadow-sm"
                  >
                    <div className="space-y-1">
                      <div className="font-semibold text-white">{t.due}</div>
                      <div className="text-slate-400">
                        {t.title}  -  {t.status}
                      </div>
                    </div>
                    <span
                      className={`mt-1 h-3 w-3 rounded-full shadow-[0_0_0_6px_rgba(255,255,255,0.07)] translate-y-2.5 ${
                        t.priority === "high" ? "bg-rose-400" : t.priority === "medium" ? "bg-amber-300" : "bg-emerald-300"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-white">Important Emails</h2>
                <span className="rounded-full border border-amber-200/40 px-3 py-1 text-xs text-amber-100">Needs attention</span>
              </div>
              <div className="space-y-3">
                {criticalEmails.map((e) => (
                  <div
                    key={e.id}
                    className="grid grid-cols-[90px,1fr] gap-3 rounded-xl border border-white/10 bg-slate p-3 text-sm"
                  >
                    <div className="font-semibold text-amber-200">{e.received}</div>
                    <div className="space-y-1">
                      <div className="font-semibold text-white">{e.subject}</div>
                      <div className="text-slate-400">
                        {e.from}  -  {e.flagged ? "Flagged" : "Inbox"}  -  {e.urgency}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold text-white">My Plan</h2>
                <span className="rounded-full border border-indigo-200/40 px-3 py-1 text-xs text-indigo-100">Auto-generated</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {plan.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-col gap-2 rounded-xl border border-white/10 bg-slate p-3 text-sm shadow-sm"
                  >
                    <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
                      <span className="rounded-full border border-white/10 px-2 py-0.5">{p.category}</span>
                      {p.time && <span className="font-semibold text-cyan-300">{p.time}</span>}
                    </div>
                    <div className="text-base font-semibold text-white">{p.label}</div>
                    <div className="text-slate-400">{p.rationale}</div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
      <div
        className={`fixed inset-0 z-40 transition ${
          rescheduleOpen ? "pointer-events-auto bg-black/50 backdrop-blur-sm" : "pointer-events-none bg-transparent"
        }`}
        aria-hidden="true"
        onClick={() => setRescheduleOpen(false)}
      />
      <div
        className={`fixed inset-0 z-100 flex transform items-center justify-center px-4 pb-6 transition duration-300 ${
          rescheduleOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Reschedule suggestions"
        onClick={() => setRescheduleOpen(false)}
      >
        <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-black shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <div className="text-sm font-semibold text-white">Reschedule everything intelligently</div>
              <div className="text-xs text-slate-400">Proposed adjustments to open deep work and reduce context switch.</div>
            </div>
            <button
              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-slate-100 transition hover:border-white/30 hover:bg-white/5"
              onClick={() => setRescheduleOpen(false)}
            >
              <IoClose /> 
            </button>
          </div>
          <div className="divide-y divide-white/5">
            {reschedulePlan.map((item) => (
              <div key={item.id} className="flex items-start gap-3 px-4 py-3">
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-white">{item.title}</div>
                  <div className="text-xs text-slate-400">{item.detail}</div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button className="rounded-lg border border-white/10 px-3 py-1 text-xs font-semibold text-slate-100 transition hover:border-white/30 hover:bg-white/5">
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
