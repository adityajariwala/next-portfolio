---
title: "When AI Is Not the Solution"
date: "2026-02-18"
excerpt: "This topic has been on my mind a lot lately, so I decided to get on my soapbox and see what happened. (sorry!) (not sorry)"
author: "Aditya Jariwala"
tags: ["AI/ML", "Theory", "Work", "Decision-Making", "Research"]
published: true
---

_Imagine this._

The CEO comes back from a conference energized. This year’s budget includes a meaningful increase in AI spend. The company is going to be “AI-forward,” on the bleeding edge, signaling innovation to customers and investors alike.

The first visible result is an LLM-powered chatbot on the customer website.

It answers questions quickly. It sounds confident. It also makes things up.

_Sound familiar?_

It suggests discounts that don’t exist, recommends workflows that aren’t supported, and occasionally promises outcomes the company legally cannot offer. In one case I heard about recently, a chatbot for a car-dealership effectively agreed to sell a car for close to nothing (I do wonder what ended up happening there). The model did exactly what it was trained to do: produce plausible language, not enforce business invariants.

Customers become frustrated. Support tickets go up. Engineers are asked to “just tweak the prompt” to fix structural problems. The business side looks at the fallout and quietly concludes that “AI is a bubble.”

And yet, on paper, the metrics look fine. Engagement is up. Chat sessions are long. The bot is “used.”

This is the failure mode I worry about most. Not that AI doesn’t work, but that it is applied in places where correctness, constraints, and accountability matter, and where language fluency is mistaken for decision-making.

I’ve written about this elsewhere, but it bears repeating: an LLM chatbot is not a decision system, and treating it like one is a category error.
(If this sounds familiar, see [Agentic AI Is Not a Chatbot](./agentic-ai-is-not-a-chatbot).)

The result is not just a bad product. It’s organizational whiplash. Engineers become cynical. Leaders lose trust. And future, genuinely valuable AI initiatives become harder to justify because the first one failed loudly.

#### And so the thesis of my essay is... No matter whether you are a founder, entrepreneur, product manager, or engineer, you NEED to know when AI is not the answer.

AI is often introduced when a problem feels ambiguous, messy, or politically difficult. Requirements are unclear, stakeholders disagree on what “good” looks like, and the system has to operate under uncertainty. Reaching for machine learning in those moments is understandable. It is also frequently a mistake.

This post is not anti-AI. It is about **choosing AI deliberately**. In many systems, learning-based approaches introduce cost, risk, and operational burden without solving the underlying problem. Saying “not yet” or “not here” is often the more responsible engineering decision.

The goal of this post is to give founders and engineers a shared framework for deciding when AI is the _wrong_ solution, what to do instead, and what conditions need to be true before AI becomes justified.

---

## What I mean by “AI” in this post

I am specifically talking about **deployed learning systems**: predictive models, ranking systems, and LLM-backed features that influence user-facing behavior or business decisions.

This is not about autocomplete, simple heuristics, or automation in general. It is about systems that learn from data, generalize beyond explicit rules, and therefore introduce new classes of failure modes.

A useful mental model is to separate solutions into three categories:

1. Deterministic systems (rules, workflows, invariants)
2. Statistical heuristics (simple scoring, thresholds, linear models)
3. Learned systems (ML models, neural networks, LLMs)

The mistake is jumping directly to category (3) when (1) or (2) would solve the problem in a safer and cheaper way.

---

## A Practical Decision Framework

Before introducing AI into a system, walk through the following questions in order. If you answer “no” at any step, stop and fix that first.

```
                                When AI is NOT the solution (yet)

                START
                  │
                  ▼
┌─────────────────────────────────────────┐
│ 1. Can rules solve it acceptably?       │
└─────────────────────────────────────────┘
                  │ YES → Use rules/config + logging. Stop.
                  │ NO
                  ▼
┌─────────────────────────────────────────┐
│ 2. Can you define "good" and measure it?│
└─────────────────────────────────────────┘
                  │ NO  → Fix evaluation first. Stop.
                  │ YES
                  ▼
┌─────────────────────────────────────────┐
│ 3. Do you have data that matches reality│
└─────────────────────────────────────────┘
                  │ NO  → Invest in data collection. Stop.
                  │ YES
                  ▼
┌─────────────────────────────────────────┐
│ 4. What is the cost of being wrong?     │
└─────────────────────────────────────────┘
                  │ HIGH → Prefer deterministic or human review.
                  │ LOW
                  ▼
┌─────────────────────────────────────────┐
│ 5. Can you operate it reliably?         │
└─────────────────────────────────────────┘
                  │ NO  → Reduce scope or use simpler system.
                  │ YES
                  ▼
 Congrats! ML/LLM justified
 Ship a baseline first. Add learning only if it clearly beats it.
```

This framework mirrors long-standing guidance from production ML teams: start simple, measure relentlessly, and treat ML as a last-mile optimization rather than a starting point ([Google Rules of ML](https://developers.google.com/machine-learning/guides/rules-of-ml)).

#### Sidebar: A personal anecdote

I’ve spent time in large financial institutions, including work on line-management for proprietary internal credit decisioning platforms. In that environment, there is no tolerance for unexplained behavior.

When customers request a credit line increase or a balance transfer, the system must be able to answer very clearly:

- Who is eligible.
- Who is not.
- Why.

These platforms are almost entirely heuristic-based by design. Not because ML is unavailable, but because the cost of being wrong, or of being unable to explain why a decision was made, is simply too high. Deterministic logic, versioned rules, and auditability are not technical preferences. They are regulatory and ethical requirements.

Now contrast that with the space I work in today: prescreened customer acquisition.

Here, the constraints are different. There is room for prediction. There is room to explore richer customer profiles, to incorporate data beyond traditional credit bureaus, and to ask probabilistic questions about risk and opportunity.
But even here, ML is introduced carefully.

Models are run in shadow deployments. They are evaluated repeatedly against rule-based control groups. Performance is measured not just in lift, but in stability, bias, and failure modes. Trust is earned over time, not assumed on day one.

This is the version of AI that actually works in high-stakes domains. It is boring, methodical, and slower than hype-driven rollouts. It is also the version that survives contact with reality.

---

## Step-by-step: why each question matters

### 1. Can rules solve it acceptably?

If the behavior can be expressed as deterministic logic, start there. Eligibility checks, policy enforcement, routing, pricing rules, and validation logic all benefit from being explicit and testable.

Machine learning systems accumulate **hidden technical debt** that traditional software does not. Data dependencies, feedback loops, and tightly coupled components make failures harder to diagnose and fix ([Sculley et al., 2015](https://papers.neurips.cc/paper/5656-hidden-technical-debt-in-machine-learning-systems.pdf)).

Founder lens: rules give predictable behavior and simpler QA.

Engineer lens: rules give debuggability, clear invariants, and fast incident response.

If you can write acceptance tests for the behavior, write the tests before you write a model.

---

### 2. Can you define “good” and measure it?

Many AI projects fail before the first model is trained because no one can articulate what success means. Accuracy, relevance, helpfulness, and safety are all vague until they are tied to metrics and evaluation procedures.

Without a measurable definition of success, you cannot detect regressions, diagnose failures, or justify continued investment. This is why production ML guidance emphasizes metrics and baselines before modeling ([Google Rules of ML](https://developers.google.com/machine-learning/guides/rules-of-ml)).

Founder lens: no metric means no credible ROI story.

Engineer lens: no metric means you are flying blind.

---

### 3. Do you have data that matches reality?

Better models cannot compensate for missing, biased, or stale data. In many real-world systems, performance is dominated by data quality and coverage rather than algorithmic sophistication ([Halevy, Norvig, Pereira, 2009](https://research.google.com/pubs/archive/35179.pdf)).

If your data does not reflect current user behavior, edge cases, and failure modes, your model will fail in production regardless of offline results.

A useful discipline here is documenting datasets: how they were collected, what they represent, and what they should not be used for ([Datasheets for Datasets](https://arxiv.org/abs/1803.09010)).

Founder lens: you cannot learn what you do not observe.

Engineer lens: data quality sets the ceiling on model performance.

---

### 4. What is the cost of being wrong?

In low-stakes domains, approximate behavior may be acceptable. In high-stakes domains, it often is not.

When decisions affect finances, access, safety, or compliance, systems need transparency, auditability, and contestability. Black-box models make these properties harder to guarantee, even when accuracy looks good on paper ([de Laat, 2017](https://link.springer.com/article/10.1007/s13347-017-0293-z)).

If ML is used in these contexts, its scope should be narrow and its limitations explicit. Model Cards provide a practical framework for documenting intended use and known failure modes ([Mitchell et al., 2019](https://arxiv.org/abs/1810.03993)).

Founder lens: a single failure can permanently damage trust.

Engineer lens: guardrails and human review are often mandatory.

---

### 5. Can you operate it reliably?

A model that cannot be monitored, debugged, and rolled back safely should not be a core dependency. ML systems are tightly coupled to data pipelines and changing environments, which makes them fragile over time ([Sculley et al., 2015](https://papers.neurips.cc/paper/5656-hidden-technical-debt-in-machine-learning-systems.pdf)).

Operational readiness includes monitoring, drift detection, incident response, and clear ownership. The NIST AI Risk Management Framework is useful here, not as a checklist to comply with, but as a shared vocabulary for risk and responsibility ([NIST AI RMF](https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-1.pdf)).

Founder lens: operational burden compounds as the product scales.

Engineer lens: on-call reality matters more than offline metrics.

---

### 6. ML is justified, but ship a baseline first

Even when ML is the right tool, it should beat a strong baseline to justify its cost. Research in applied recommendation systems shows that complex models frequently underperform simpler, well-tuned baselines and are harder to reproduce ([Dacrema et al., 2019](https://arxiv.org/abs/1907.06902)).

Baselines provide a control group, a rollback option, and a sanity check on whether learning is actually adding value.

---

## Three scenarios where AI is often the wrong tool

### Eligibility, policy, and compliance logic

These systems require consistency, explainability, and audit trails. Rules and workflows outperform ML here, with ML serving at most as a supporting signal.

### Answer engines without ground truth

LLM-based answers feel authoritative but are difficult to evaluate and debug. If correctness cannot be defined, the system should be constrained to retrieval, summarization with citations, or guided workflows rather than free-form answers.

### Recommendation without strong baselines

If you have not beaten simple heuristics with careful measurement, adding model complexity is premature. Instrumentation and data quality usually matter more.

---

## What to do instead

When AI is not the solution, there are still plenty of productive options:

1. Rules engines with configuration and audit logs
2. Simple statistical models that are interpretable and stable
3. Better instrumentation and data collection
4. Human-in-the-loop workflows for high-cost decisions
5. Narrow automation that assists rather than decides

These approaches often deliver most of the value with a fraction of the risk.

---

## The responsible “yes” checklist

Before saying yes to AI, you should be able to answer all of the following:

1. Do we have a metric that correlates with real user value?
2. Do we understand where the data comes from and its limitations?
3. Is the system’s intended use clearly scoped and documented?
4. Can we monitor, rollback, and recover from failures?
5. Do we understand and accept the risk profile?

If any answer is unclear, the correct response is not more modeling, but more clarity.

---

## In Closing...

AI is powerful when it is constrained, measured, and justified. It is dangerous when it is used as a substitute for clear requirements and product decisions.

If you cannot specify correctness and you cannot measure outcomes, AI will not give you intelligence. It will give you plausible output with hidden failure modes.

Saying “not yet” to AI is not a lack of ambition. It is disciplined engineering.
