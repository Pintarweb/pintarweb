# Manual Lead Insertion — Pipeline Tab

**Date:** 2026-07-17
**Project:** pintarweb/packages/scraper

## Summary

Add a button + modal in the Pipeline tab to manually insert leads into the pipeline, bypassing the scraper engine.

## Changes

### 1. PipelineView.html
- Add "+ Add Lead" button next to "Export to CRM" button in the header
- Add modal markup (hidden by default) with form fields:
  - Business Name (text, required)
  - Phone (text, required)
  - Category (dropdown, required — populated from existing leads)
  - Website URL (text, optional)
  - Address (text, optional)
- Style consistent with existing intake/config-preview modals

### 2. dashboard.js.txt
- `openAddLeadModal()` / `closeAddLeadModal()` — show/hide the modal
- `submitManualLead()` — read form, POST to `/api/leads/manual`, refresh, close
- Category dropdown populated from the same category list as the filter
- Phone normalization via `normalizePhone` client-side (simple digit stripping)

### 3. worker.ts
- Add `POST /api/leads/manual` handler:
  - Validate required fields (business_name, phone, category)
  - Normalize phone
  - Generate UUID, set source_origin="Manual", lead_score=1, pipeline_stage="new"
  - Direct INSERT (no upsert score filter, no background audits)
  - Return created lead info

### 4. Source filter
- Add "Manual" option to the source filter dropdown
