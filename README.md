# Lead Response Desk

**AI-assisted lead qualification and follow-up automation**

Lead Response Desk is an independent portfolio project exploring how AI can support the operational side of B2B sales. It combines a Next.js web interface with an n8n workflow that researches incoming leads, evaluates their commercial relevance, stores them in a CRM, and triggers appropriate follow-up actions.

The project was developed as a practical exercise in AI integration, workflow orchestration, and business process automation.

**[Live website](https://lead-response-desk.vercel.app)** | **Demo video: [https://youtu.be/xT_r8rsnPJ8]**

*The live AI processing component may be temporarily unavailable due to free API quota limits. The recorded demonstration shows a successful end-to-end execution.*

## 1. The problem

Not every incoming business inquiry represents the same opportunity. Some leads have an immediate need, a defined budget, and strong commercial fit. Others may be exploratory, outside the company's target market, or irrelevant altogether.

Researching and qualifying each inquiry manually can be repetitive, particularly when the information needed for a decision is scattered across messages, company websites, and CRM records.

Lead Response Desk explores how these steps can be coordinated through a single automated process.

## 2. How it works

The workflow follows five main stages:

1. **Capture and validate:** A visitor submits a lead through the Next.js interface. The submission is validated before entering the workflow.
2. **Research:** If a company website is provided and accessible, the workflow extracts relevant information and uses Gemini to structure the findings. Missing or inaccessible websites trigger fallback paths.
3. **Qualify:** Gemini evaluates the lead against a weighted scoring framework. A JavaScript node parses and validates the model's structured output.
4. **Store and route:** The lead is recorded in Airtable and routed according to its qualification category.
5. **Respond:** n8n triggers the corresponding Gmail action and updates the lead's CRM status.

### Technology stack

| Technology | Purpose |
|---|---|
| Next.js 15, React 19, TypeScript | Web interface and server-side API |
| Tailwind CSS v4 | Interface styling |
| Vercel | Website deployment |
| n8n | Workflow orchestration and conditional routing |
| Google Gemini API | Company research and lead qualification |
| JavaScript | Structured output parsing and validation |
| Airtable | Lead storage and status management |
| Gmail | Automated follow-ups and internal notifications |

## 3. Lead qualification

Rather than asking Gemini to assign an arbitrary priority, I designed a weighted scoring rubric based on five criteria.

| Criterion | Maximum points |
|---|---:|
| Firmographic fit | 25 |
| Business need / use-case fit | 25 |
| Urgency | 20 |
| Budget | 15 |
| Contact quality | 15 |
| **Total** | **100** |

The resulting categories are:

- **Hot (75–100):** High-priority opportunity requiring sales attention.
- **Warm (45–74):** Relevant inquiry suitable for follow-up.
- **Cold (0–44):** Low-priority or commercially misaligned inquiry.
- **Spam:** Separate classification for clearly unsolicited or malicious submissions.

The AI is instructed not to invent missing budget, urgency, or company information. The scoring framework is heuristic and has not been calibrated against actual conversion outcomes.

## 4. Automated actions

Each qualification category produces a different operational outcome.

| Category | Action | CRM status |
|---|---|---|
| Hot | Internal Gmail notification to the sales team | Needs Follow-up |
| Warm | Personalized follow-up email | Contacted |
| Cold | Acknowledgment email | Contacted |
| Spam | No outgoing email | Spam |

The prototype supports English and French email templates.

For demonstration purposes, outbound emails are directed to a controlled test inbox rather than the submitted addresses.

## 5. Reliability and design decisions

Several implementation decisions emerged during testing.

**Optional company research.** Initially, missing or inaccessible websites interrupted the workflow. I introduced separate fallback paths so lead qualification could continue using the submitted information.

**Structured AI output.** Gemini returns qualification results in JSON format. A JavaScript validation step checks the scoring structure and ensures the subscores add up to the total.

**Evidence-based scoring.** The model distinguishes between explicitly provided information and missing details, avoiding assumptions about budgets or deadlines.

**CRM status updates.** Airtable statuses are updated after the corresponding workflow action, rather than simply when a lead is created.

**Authenticated webhook.** The Next.js server forwards submissions to n8n using a server-side authentication header, keeping the webhook credential out of browser code.

These choices were made to keep the prototype understandable, testable, and resilient to common input problems.

## 6. Testing

I tested the workflow with fictional leads representing four different scenarios:

| Scenario | Expected behavior | Result |
|---|---|---|
| High-fit B2B lead with urgent needs and budget | Hot classification and internal notification | Passed |
| Relevant B2B inquiry without confirmed purchasing details | Warm classification and follow-up | Passed |
| Business inquiry unrelated to sales automation | Cold classification and acknowledgment | Passed |
| Unsolicited promotional submission | Spam classification without outgoing email | Passed |

Additional tests covered missing websites, inaccessible websites, and bilingual responses.

The recorded demonstration shows an actual Hot lead being processed through the website, n8n, Airtable, and Gmail.

## 7. Limitations

This is a portfolio prototype, not a production-ready sales platform.

Current limitations include dependence on free-tier Gemini API quotas, a heuristic rather than empirically calibrated scoring framework, and the absence of real sales-conversion data.

Production deployment would also require stronger abuse prevention, safe outbound website-fetch controls, and appropriate email-delivery and data-protection practices.

## 8. Running the website locally

```bash
npm install
npm run dev
```

To test the production build:

```bash
npm run build
```

The Next.js server-side route requires two environment variables:

```env
N8N_WEBHOOK_URL=your_n8n_production_webhook_url
N8N_WEBHOOK_SECRET=your_webhook_header_secret
```

Store these in `.env.local` for local development or in Vercel's server-side environment settings. Do not commit credentials to GitHub.

A working n8n instance with the corresponding workflow and connected services is required for live processing.

---

**Independent portfolio project, 2026.** Developed using fictional business scenarios for demonstration and learning purposes. Not an official Brixon product.
