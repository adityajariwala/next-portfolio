---
title: "Agentic AI Is Not a Chatbot"
date: "2026-02-11"
excerpt: "What it actually takes to deploy AI agents in complex enterprise environments. And some rambling on the state of AI today."
author: "Aditya Jariwala"
tags: ["Agentic AI", "LLMs", "AI", "Healthcare"]
published: true
---

Everyone seems to be building "AI agents" right now. Annndd... most of them are chatbots with a for-loop.

There's a meaningful architectural distinction between a language model that generates text and an agentic system that
perceives its environment, reasons about goals, takes actions, and learns from outcomes. That distinction matters
everywhere, but it matters most in healthcare — where the stakes are higher, the systems are
messier (don't get me started on this one), and the margin for error is thinner than in any other industry.

My wife is a Physician Assistant here in Chicago, and I hear the in-and-outs of the daily challenges that healthcare
providers face. Whether it is last minute rescheduling, appointment no-shows, insurance claim denials (again, I have
some thoughts about peer-to-peers), or preventable surgery cancellations, these tasks add a significant weight to
a provider's responsibilities ON TOP of an already stressful job. The professional in charge of your health should not also
have to be an executive assistant, scheduling and insurance liaison, and HR.

All this to say, I've been spending a lot of time lately thinking about what it actually takes to deploy agentic AI in
an enterprise healthcare environment. Not the conference-talk version. The version where you're staring at an HL7v2 feed
from a 15-year-old EHR and trying to figure out how to make an AI agent do something useful with it.

Here's what I've learned.

## First, let's kill the buzzword

The term "agentic AI" has been stretched to meaninglessness. Vendors slap it on anything that makes more than one API
(read: OpenAI) call. So let's be precise about what we're talking about.

A chatbot takes a prompt, generates a response, and waits. It's stateless. It's reactive. It's a function: input → output.

An agent operates in a loop. It perceives the state of its environment, plans a sequence of actions toward a goal,
executes those actions using tools, observes the results, and adapts. It maintains state across interactions. It can
decide _not_ to act. It can escalate to a human when it's uncertain. And critically, it operates over time — not just in
the moment of a single request.

The architecture could look something like this:

```
┌──────────────────────────────────────────────────┐
│                   AGENT LOOP                     │
│                                                  │
│   Perceive → Plan → Act → Observe → Adapt        │
│      ↑                                 ↓         │
│      └─────────────────────────────────┘         │
│                                                  │
│   Tools:  [EHR Query] [Schedule API] [Notify]    │
│   Memory: [Patient Context] [Action History]     │
│   Guard:  [HIPAA Filter] [Confidence Threshold]  │
└──────────────────────────────────────────────────┘
```

The LLM is the reasoning engine inside the loop, but the loop itself is the agent. This is not a semantic distinction.
It has massive implications for how you build, deploy, and trust these systems. And in the healthcare space, that trust
is critical, and AI explainability is key.

## Why healthcare is the hardest environment for agents

Most agentic AI demos run against clean APIs with predictable schemas. Healthcare is the opposite of that. Here's what
makes it uniquely difficult:

**The data is fragmented and dirty.** A single patient's information might live across an EHR, a claims system, a pharmacy
benefits manager, a lab information system, and a paper fax (yes really, my wife did this just last week). These systems speak
different languages: HL7v2, FHIR, X12 EDI, proprietary CSV exports, and sometimes literally just PDFs. An agent that needs
to "understand a patient's current state" might need to reconcile data from five systems that disagree with each other.

**The compliance surface is enormous.** HIPAA isn't just a checkbox. Every action an agent takes, every data query, every
notification sent, every record accessed, needs to happen within a framework of minimum necessary access, audit logging,
and de-identification rules (similar to dealing with Credit NPI in the financial sector). An agent that autonomously queries
patient records needs to demonstrate _why_ it accessed that data for that purpose. This means your agent architecture needs
a compliance layer that's not just an afterthought.

**The cost of errors is asymmetric.** If a scheduling agent at a SaaS company double-books a conference room, someone gets
mildly annoyed. If a healthcare operations agent misroutes a critical lab result or drops a patient from a follow-up queue,
someone might get hurt. This doesn't mean you can't deploy agents in healthcare, but it means your confidence thresholds,
fallback behaviors, and human-in-the-loop patterns need to be engineered from the ground-up with this in mind.

**The users are skeptical and busy.** Clinicians and hospital operations staff have been burned by bad health IT for decades.
They don't trust new systems. They don't have time to learn new interfaces. Just switching from one EMR to another is
a monumental task. An agent that requires behavior change will fail. The best healthcare agents are invisible — they work
behind the scenes, surface results through existing workflows, and only interrupt humans when it genuinely matters.
Side note: forget switching EMRs (though that is a real-example), just moving or renaming a button can cause significant distress!

And no ChatGPT wrapper, no matter how polished, can do that.

## The architecture that actually works

Upon studying how successful healthcare AI deployments work in practice, a clearer picture emerges:
**"digital twin + specialized agents + human-in-the-loop."** Here's how the pieces fit:

### Layer 1: The Digital Twin

Before you can deploy agents, you need a synchronized, queryable representation of the operational reality. In healthcare,
this means ingesting data from EHRs, scheduling systems, claims feeds, staffing databases, supply chain systems, and external
data sources into a unified model that updates in real-time (or near-real-time).

This is the hard, unsexy engineering work. It's ETL pipelines, schema reconciliation, entity resolution, and data quality
monitoring. It's figuring out that Hospital A's "encounter" maps to Hospital B's "visit" maps to the payer's "claim." It's
handling the fact that the EHR data is 4 hours stale but the ADT feed is real-time.

Without this layer, agents will hallucinate (not in the LLM sense, but in the operational sense). They're reasoning about
a world that doesn't match reality.

### Layer 2: Specialized Agents

The temptation is to build one general-purpose agent that does everything. Resist it. The pattern that works is narrow,
specialized agents each with a well-defined scope, a specific set of tools, and clear boundaries on what they can and cannot do.
This particular idea is not unique to healthcare! A single agent may be able to fix your code and write your tests, but
creating an entire compiler or browser from scratch? That takes an army.

An OR scheduling agent has to know about surgical case types, historical duration distributions, surgeon preferences, equipment
availability, and recovery bed constraints. It doesn't know or care about supply chain management.

Meanwhile, a patient outreach agent knows about appointment schedules, communication preferences, contact history, and no-show
risk models. It doesn't touch clinical data.

This separation isn't just good engineering, it's a compliance strategy. Each agent has a defined data access scope, a clear
audit trail, and a containable blast radius if something goes wrong.

### Layer 3: The Guardrail Stack

This is where most demos fall apart in production. The guardrail stack includes:

- **Confidence thresholds:** The agent should know when it doesn't know. If an OR scheduling recommendation has low confidence (unusual case type, incomplete surgeon history), it escalates to a human scheduler instead of acting autonomously.
- **Action classification:** Not all agent actions are equal. Reading data is low-risk. Sending a patient communication is medium-risk. Modifying a clinical schedule is high-risk. Each class gets a different approval workflow.
- **HIPAA-aware data access:** Every tool invocation that touches PHI (Protected Health Information) has to be logged with the purpose, the minimum necessary data accessed, and the requesting context.
- **Human-in-the-loop patterns:** The goal isn't full autonomy — it's _appropriate_ autonomy. For routine actions with high confidence (sending an appointment reminder to a patient who has confirmed their contact preferences), the agent acts. For novel situations or high-stakes decisions, the agent recommends and a human approves.

### Layer 4: Measurement

Here's the part that separates real deployments from POCs that die on the vine: you need to prove the agent is working.
Not with anecdotes, but rather rigorous, control-group-benchmarked measurement.

This means deploying agents against a subset of operations while maintaining a control group that runs the existing workflow.
It means defining success metrics _before_ deployment (OR utilization rate, no-show reduction, time-to-fill for open shifts)
and tracking them continuously. It means building dashboards that non-technical stakeholders can actually read. Concisely.

If you can't quantify the ROI, the deployment doesn't survive the next budget cycle!

## What this means if you're building in this space

A few takeaways I keep coming back to:

**The hard part isn't the model, it's the integration.** The LLM reasoning capability is a commodity at this point.
GPT-5, Claude Opus, Gemini... they can all do it. What's scarce is the ability to connect that reasoning to messy,
real-world healthcare data systems and make it work reliably at scale. The value is in the pipes, not the brain.

**Start with operations, not clinical.** Clinical AI (diagnosis, treatment recommendations) is a regulatory minefield.
Operational AI (scheduling, staffing, supply chain, patient communications, revenue cycle) has a clearer path to deployment,
faster ROI, and lower regulatory risk. The best healthcare AI companies understand this.

**"Agentic" is a spectrum, not a binary.** You don't need to go from zero to fully autonomous. Start with agents that surface
recommendations for human review. Pilot the project. Measure accuracy. Build trust. Remember the scientific method! Gradually
expand the scope of autonomous action as confidence grows. This is how you get buy-in from skeptical healthcare operators
who've seen a hundred IT projects fail.

**The FDE model exists for a reason.** Enterprise healthcare deployments can't be done from a product team in a different
city. Each health system has different EHRs, different data models, different operational workflows, different political
dynamics. The companies that win in this space embed technical people with clients. They need engineers who understand the
product deeply enough to customize it; and understand the client's environment deeply enough to deploy it. If you're an engineer
who's excited about this space, the most impactful place to be is at the intersection of product and client. Not in your
dark room in the basement :)

---

Healthcare is messy, regulated, high-stakes, and resistant to change. It's also where agentic AI has the potential to create
the most value. That's not done by replacing human judgment, but by automating the operational drudgery that burns out staff
and delays care. The gap between the conference-talk version of "AI agents" and the reality of deploying them in a hospital
is enormous. But that gap is exactly where the interesting engineering problems live.

Thanks for coming to my TED Talk!
