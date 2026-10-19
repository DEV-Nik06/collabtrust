# ADR-005: Cloud Deployment and Hosting Strategy

> **Status:** Proposed  
> **Date:** 2026-10-12  
> **Deciders:** Engineering Team  
> **Consulted:** [`system-architecture.md`](../system-architecture.md), [`mvp-scope.md`](../../01-product/mvp-scope.md)  

---

## 1. Context & Problem Statement

CollabTrust needs a simple, reliable cloud deployment strategy for hosting the web client, API server, and PostgreSQL database for MVP demonstration and initial user testing. The deployment must avoid high infrastructure costs, complex Kubernetes cluster administration, and manual operational overhead.

---

## 2. Decision

We propose deploying CollabTrust to a **Platform-as-a-Service (PaaS)** environment (such as **Railway, Render, or Fly.io**) utilizing:
* A static site hosting or lightweight container service for the React web application.
* A single container service running the Node.js/Express API.
* A managed PostgreSQL database instance with automated daily snapshots.
* Automated CI/CD deployment triggered from the GitHub repository `main` branch via GitHub Actions.

---

## 3. Rationale

1. **Operational Simplicity:** Zero server management, built-in TLS certificate provisioning, and unified environment variable configuration.
2. **Cost-Effective:** Minimal initial footprint with predictable pricing suitable for MVP and hackathon budgets.
3. **Turnkey Database Management:** Managed PostgreSQL eliminates manual database backups and OS security patching.
4. **Developer Velocity:** Automatic preview environments and rapid git-push deployments allow the team to focus on documentation and code quality rather than infrastructure operations.

---

## 4. Consequences & Trade-offs

* **Positive:** Fast deployment turnaround; zero devops overhead for MVP.
* **Negative:** Not designed for massive multi-region traffic (acceptable for MVP validation). Migration to AWS/GCP container services (ECS/Cloud Run) remains straightforward if scaling demands emerge post-MVP.
