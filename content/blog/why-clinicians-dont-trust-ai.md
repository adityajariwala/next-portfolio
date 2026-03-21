---
title: "In Healthcare, Trust Is the Product"
date: "2026-03-20"
excerpt: "The biggest barrier to AI in healthcare isn't the model - it's the room. Here's what actually earns clinical trust."
author: "Aditya Jariwala"
tags: ["Healthcare", "AI/ML", "Agentic AI", "Trust", "Enterprise"]
published: true
---

When I mention AI to my wife, who is a physician assistant, I don't get curiosity anymore. I get a sigh. The sound of someone who has been promised "this will change everything" enough times to develop some strong antibodies against it.

Here's my thesis, and I'm going to spend the rest of this post making the case: **in healthcare, trust is the product. The AI is just the delivery mechanism.** The companies that win in this space won't be the ones with the best models or the longest feature lists. They'll be the ones that understand why clinicians sigh, and build accordingly.

I don’t believe clinicians don't distrust AI because they're skeptical of technology. They distrust it because they're experts at pattern recognition - and the pattern they've recognized is that health IT usually over-promises and under-delivers.

I haven't deployed AI in a hospital yet. But I've spent enough time studying this space (and listening to the person who lives it) to see some patterns myself. Here's my 2¢:

## The Demo Problem

Here's a scene that plays out constantly in healthcare AI sales.

A vendor walks into a health system, proceeds to set up a demo. The AI agent handles a scripted patient call flawlessly! It's empathetic, it follows the protocol, it captures structured data, it even identifies a risk factor and flags it for follow-up. The room is impressed.

Then someone asks: "What happens when the patient speaks Tagalog and has three comorbidities and their insurance just changed and they're calling from a number that isn't in the system?"

The demo doesn't have an answer for that. Because the demo was never designed for that. It was designed for the projector.

Therein lies the fundamental trust gap. Clinicians and operations staff evaluate technology based on edge cases, because edge cases are their entire job. A surgeon doesn't care that the OR scheduling system works 95% of the time - she cares about the 5% where a case gets shuffled, the patient has been NPO for 18 hours with nowhere to go, and the anesthesiologist doesn't have the H&P because it's buried in the wrong encounter. A pharmacist doesn't care that the CDS system catches most interactions, he cares about the one it missed because the patient's allergy was documented in free text, not the structured field.

And here's the thing: they're right to evaluate this way. In healthcare, the edge case isn’t just an edge case. It's the entire waiting room on a Thursday afternoon.

The [foundational architecture paper for AI agents in healthcare](<https://www.cell.com/cell-reports-medicine/fulltext/S2666-3791(25)00073-1>) published in Cell Reports Medicine (2025) makes this point explicitly: medical AI agents must demonstrate "adaptability", or the ability to handle novel and complex multi-step scenarios. That's not a nice-to-have - it's the prerequisite for clinical trust.

And a clinician who is wowed in a conference room but disappointed in practice doesn't just stop using your product. They become a vocal detractor, at every conference, in every group chat, on every committee. Healthcare is a small world, and word travels fast.

## The Scar Tissue Problem

To understand why clinicians react the way they do to AI, you have to understand the history. There's a decade of scar tissue here, and each layer makes the next technology harder to adopt.

EHR implementations were supposed to revolutionize medicine. Instead, they created "pajama time" - hours of after-shift documentation that didn't exist before. For every hour physicians spent with patients, they spent [nearly two on EHR and desk work](https://www.acpjournals.org/doi/10.7326/M18-3684). Clinical decision support was supposed to fix the signal problem; instead it created alert fatigue. Override rates for drug-drug interactions [range from 49% to 96%](https://academic.oup.com/jamia/article/26/5/476/5355920), with the most frequent alerts almost universally ignored. Nurses, the heaviest EHR users by volume, were forced into workflows designed around physician billing instead of nursing care. The people who spend the most time in these systems often had the least input into how they were built.

Then came the patient portals. Then the telemedicine mandates during COVID. Then the prior authorization automation tools that still required manual follow-up. Layer after layer, each promising to reduce burden, but instead each adding its own.

My wife told me about many days in ortho-spine where she spent more time fighting the EHR's referral workflow than seeing patients. Seven screens to complete a single referral, hopping between multiple systems. Now she's moving into psychiatry, where the concerns are different but equally visceral; clinicians worry about ambient documentation capturing sensitive therapeutic conversations or about note generation that flattens the nuance of a psychiatric encounter into structured fields. The scar tissue isn't the same across specialties, but it's everywhere.

That's the competition. Not other AI products, but the memory of every broken promise along a long road filled with "improvements".

## What Consistently Fails

Here are the patterns that don't work. I keep seeing them across competitor research, academic literature, and clinician conversations.

### Feature-First Positioning

"Our AI can do 47 things!" Cool. Clinicians want it to do _one thing_ well, reliably, every single time, without requiring them to change their workflow. The ambient AI scribe market is a case study: 90+ vendors, [~$600M in 2025 revenue](https://deepscribe.ai/blog/ambient-ai-in-healthcare-2025), and commoditizing fast, because "transcribe the encounter" is now table stakes. The companies pulling ahead, like Abridge ($5.3B valuation across 150+ health systems), are winning because they do the one thing in a way that fits the workflow the best, not because they have the longest feature list.

### Replacing Clinical Judgment

Any AI product positioned as a replacement for clinical decision-making is dead on arrival. This is why the smartest companies in the space explicitly position as _non-diagnostic_. [Hippocratic AI](https://www.hippocraticai.com/), with $404M in funding and (per their published figures) 115 million+ patient interactions, handles staffing, scheduling, follow-ups, chronic care check-ins - operations, not diagnosis. They've built a constellation of 22 specialized models specifically to ensure clinical safety, and they still won't touch diagnostic territory.

That doesn't point to timidity in the market, it shows real understanding of the trust landscape.

### Ignoring the Workflow

The fastest way to kill adoption is to require clinicians to change how they work. A new tab to open. A new login to remember. A new screen to navigate between patients. Every additional step is friction, and friction in a time-pressured clinical environment is a death sentence.

As I wrote in my [previous post on agentic AI](./agentic-ai-is-not-a-chatbot): "An agent that requires behavior change will fail. The best healthcare agents are invisible." The research since then has only reinforced that.

## What Actually Drives Change

So what works? Here's the pattern I see in the companies that have actually achieved clinical adoption at scale.

### 1. Start With Operations, Not Clinical Care

The single most important strategic decision is where you deploy first. And the answer is: as far from clinical judgment as possible.

OR scheduling. Appointment reminders. Insurance verification. Staffing optimization. Post-discharge follow-up calls. These are high-value, data-rich problems where the cost of being wrong is measured in dollars and inconvenience, not patient safety. They're also the problems that operations staff are desperate to solve, and operations staff are often more open to new technology than clinical staff because they don't carry the same scar tissue.

This isn't just theory - an IBM Research / Cleveland Clinic / Morehouse School of Medicine collaboration [published findings](https://arxiv.org/abs/2411.12740) at the IEEE International Conference on Digital Health (2025) showing that LLM-powered voice agents achieved a 70% patient acceptance rate for health monitoring tasks. Notably, 37% of patients _preferred_ the AI agent over traditional monitoring. Though the other 63% didn't, a reminder that patient acceptance isn't monolithic and has to be earned, not assumed.

The key? These were non-diagnostic, operational interactions. The AI wasn't playing doctor. It was just being helpful and truly listening to the patients' problems.

Once you've proven value in operations (measurably, with control groups and hard ROI numbers) you've earned the right to expand. But you have to earn it. Which brings me to my net point...

### 2. Measure Everything, With Control Groups

This is the part that separates real deployments from POCs that go to an early grave: rigorous measurement with proper experimental design.

If you can't run a controlled pilot, you shouldn't be deploying AI in healthcare.

The companies I've seen succeed run 3-month pilots where a subset of operations uses the AI while a matched control group runs the existing workflow. Success metrics are defined _before deployment_, not retrofitted to whatever number looks good afterward. OR utilization rate, no-show reduction, cost per activation, time-to-fill for open shifts, patient satisfaction scores. All hard numbers for solid, grounded comparisons.

ROI-based pricing models reinforce this; in some companies in the space price their product as a fraction of the incremental value they create. If the AI doesn't measurably improve outcomes, the customer doesn't pay. That kind of skin-in-the-game alignment is what earns trust from health system CFOs, which is what gets you past the pilot and into a multi-year contract.

### 3. Make the AI Invisible

The best AI in healthcare is AI that clinicians never have to think about.

Abridge is the clearest example that I've seen so far. Their innovation is evidence-linked notes: every span of generated text links back to the exact moment in the source conversation transcript. When a clinician reads an AI-generated note and thinks "did the patient really say that?", they can click through and hear it. That's an anti-hallucination architecture that addresses the trust problem at the design level, not the prompt level.

Regard takes a different approach; rather than starting from conversation, their AI agent starts from the full patient chart (labs, meds, history) and proactively surfaces missed diagnoses and coding opportunities. The output shows up in the clinician's existing workflow instead of a separate dashboard. The AI does its work in the background and surfaces results where the clinician is already looking.

The same principle extends to voice agents, though the pipeline has its own engineering demands like medical ASR, sub-300ms latency, clean endpointing, multilingual support. The most effective patient-facing voice agents don't feel like talking to a "virtual healthcare assistant". They feel like talking to a competent person who happens to have perfect recall of your medical history and never puts you on hold.

### 4. Build Safety Architectures, Not Safety Features

A "safety feature" is a checkbox. A "safety architecture" is a design philosophy.

The most architecturally impressive approach I've encountered is Hippocratic AI's Polaris constellation. Instead of relying on a single model with guardrails bolted on, they run a primary conversational model supervised by 20+ specialist models that fire in parallel: medication safety, lab interpretation, clinical escalation logic, compliance, and more, each independently verifying the primary model's output before it reaches the patient. Specialist models can vote or veto in parallel, asynchronously. Each patient interaction gets twenty independent experts watching every move.

Is it expensive? Yes - there are 4.2 trillion total parameters across the constellation. Is it slower? Also yes. But per their own reporting, it has processed 115 million+ patient interactions with no publicly reported safety incidents. That kind of track record (even acknowledging it's self-reported) earns trust in a way that no feature list can. Health system compliance teams want to see structural safety guarantees, not prompt magic tricks.

You don't need Hippocratic's scale to apply this principle. The core idea is that safety should be structural, not bolted-on:

- A separate model (or even a rules-based system) that independently validates actions before they reach a patient or clinician.
- Deterministic guardrails for the things that must never happen like wrong medication dosage, wrong patient record, unauthorized data access.
- Confidence thresholds that route to human review when the system isn't sure. (In practice: a confidence score below a tuned threshold on medication-related intent should route to a pharmacist, not autonomous action.)
- Action classification: reading a patient record is low-risk; sending a patient communication is medium-risk; modifying a clinical schedule is high-risk. Each class gets a different approval workflow.

The goal isn't full autonomy, it's appropriate autonomy. The AI acts when it's confident and the stakes are low. It recommends and defers when either condition isn't met.

### 5. Embed Engineers, Don't Just Ship Software

You can build the best AI product in the world, and if you ship it to a health system and walk away, it will fail. Healthcare environments are too heterogeneous, too workflow-specific, too politically complex for one-size-fits-all deployment.

The forward-deployed engineering model, which embeds engineers directly at customer sites alongside clinical and operations teams, is how you bridge the gap between what the technology can do and what the environment needs.

This level of commitment is the crux of a trust-building mechanism. When a health system's operations team sees an engineer show up, learn their specific workflows, adapt the AI to their specific EHR configuration, and stay to fix things when they break, that builds trust in a way that no sales deck can. It also creates a powerful feedback loop: the engineer learns what actually matters in practice (not what the PM assumed mattered), and that learning flows back into the product.

Most healthcare AI deployments aren't failing because the models aren't good enough. They're failing because the companies shipping them still think they're selling software. (They're not, they're selling a relationship.)

The [Cell Reports Medicine framework](<https://www.cell.com/cell-reports-medicine/fulltext/S2666-3791(25)00073-1>) identifies "reflection" as a core component of medical AI agents; the ability to learn from outcomes and adapt. But the most important reflection loop isn't inside the model. It's between the humans who deploy the system and the humans who use it.

## The Bigger Picture

The healthcare AI voice agent market is projected to reach [$11.6 billion by 2034](https://www.futuremarketinsights.com/reports/healthcare-voice-ai-market) (37.9% CAGR from a $468M base in 2024). But the companies that capture that market won't be the ones with the best demos.

Ambient scribes are already commoditizing. The next frontier is agentic AI - systems that don't just document what happened, but take action. Systems that schedule the follow-up, flag the risk, call the patient, and optimize the OR. But that frontier is only accessible to companies that have first earned the right to act by proving they can be trusted.

The pattern:

1. **Start with operations.** Low clinical risk, high measurable value.
2. **Prove ROI with rigor.** Control groups, hard metrics, skin in the game.
3. **Disappear into the workflow.** The best AI is the AI nobody has to think about.
4. **Build safety into the architecture.** Not a feature. A design philosophy.
5. **Show up in person.** Embed with the customer. Learn their world. Earn their trust.

None of this is technically glamorous. There's no breakthrough architecture here, no flashy demo moment.

My wife's reaction to the OR scheduling use case wasn't excitement. It was: "If that worked, like, _actually_ worked every time... I would have cried at my last job."

That's the bar.

---

_I'm currently transitioning from Capital One to a forward-deployed engineering role at a healthcare AI company. If you're building in this space or thinking about it, I'd love to hear what you're seeing. Find me on [LinkedIn](https://linkedin.com/in/adityajariwala) here._
