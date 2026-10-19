# CollabTrust — Monitoring & Operational Logging

> **Status:** Draft (Proposed)  
> **Phase:** Phase G — Deployment and Operations  
> **Depends on:** [`system-architecture.md`](../03-architecture/system-architecture.md), [`deployment-guide.md`](./deployment-guide.md)  
> **Source of truth:** [`PROJECT_CONTEXT.md`](../../PROJECT_CONTEXT.md)  

---

## 1. Overview & Monitoring Strategy

CollabTrust implements lightweight, structured logging and health checking designed for high visibility during MVP validation without requiring costly enterprise observability infrastructure.

### Primary Objectives
1. **Application Availability:** Detect API downtime or container crashes instantly.
2. **AI Inference Visibility:** Log AI token usage, request latency, and structured parsing failures.
3. **Security Auditing:** Log authentication failures, role violations, and unauthorized resource access attempts.
4. **Data Privacy in Logs:** Strictly prevent logging of user passwords, full authentication tokens, or personally identifiable financial data.

---

## 2. Structured Logging Standards

Backend logs use structured JSON format (via **Pino** or **Winston**):

```json
{
  "timestamp": "2026-10-12T10:15:30.123Z",
  "level": "info", // "debug" | "info" | "warn" | "error"
  "correlationId": "req-uuid-v4",
  "userId": "user-uuid",
  "role": "brand",
  "method": "POST",
  "route": "/api/v1/campaigns/ai-draft",
  "statusCode": 200,
  "durationMs": 4250,
  "aiMetrics": {
    "agent": "CampaignBriefAgent",
    "promptTokens": 320,
    "completionTokens": 185,
    "schemaValid": true
  }
}
```

### Log Levels Policy
* `ERROR`: Unhandled exceptions, database query failures, and persistent AI client connection failures.
* `WARN`: AI fallback events triggered (e.g., fallback to manual brief form), token expiry rejections, rate-limit thresholds approached.
* `INFO`: Successful registrations, campaign publications, collaboration creations, and completed AI inferences.
* `DEBUG`: Detailed prompt inputs and internal state transitions (strictly disabled in production).

---

## 3. Health Checks & Synthetic Probes

### 3.1 Endpoint: `GET /api/v1/health`
* **Access:** Public
* **Purpose:** Heartbeat probe for PaaS container orchestration and external uptime monitors.
* **Response (200 OK):**
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-10-12T10:15:30Z",
    "uptimeSeconds": 14502,
    "database": "connected",
    "version": "0.1.0-mvp"
  }
  ```
* **Failure Response (503 Service Unavailable):** Returns if database connection pool is unhealthy.

---

## 4. Operational Alerting

For the MVP deployment:
* **Uptime Monitoring:** External free ping monitor (e.g., UptimeRobot or BetterStack) polling `/api/v1/health` every 5 minutes with email alert notifications.
* **Crash Alerts:** PaaS platform (Railway/Render) automated email notification upon unexpected container exit or restart loop.

---

## 5. Related Documents

| Document | Purpose |
|---|---|
| [`deployment-guide.md`](./deployment-guide.md) | Deployment and rollback operations |
| [`environment-configuration.md`](./environment-configuration.md) | Logging level environment variables |
| [`docs/04-ai/evaluation-plan.md`](../04-ai/evaluation-plan.md) | AI quality benchmarking |
