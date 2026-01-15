# Urbanify Frontend Maintenance Guide

This document explains how to extend the app safely (issues, translations, cities, sidebar, and common UI flows).

## Add or change issue categories/types

Files to update:
- src/types/Issue/index.ts
- src/locales/br.json
- src/locales/en.json
- src/locales/es.json

Steps:
1) Add the new IssueType to the IssueType union.
2) If it is a new category, add it to IssueCategory.
3) Append to issueCategories in the correct section, using a label key in the format: Issues.types.YOUR_KEY.
4) Add translations for Issues.types.YOUR_KEY in all locale files.
5) If you add a new IssueStatus, update Issues.status translations in all locales.
6) If the API expects different keys, keep IssueType values aligned with backend enums.

Notes:
- issueCategories drives the report form combobox and category grouping logic.
- The combobox treats entries with isHeading: true as category headings.

## Add translations

Where translations live:
- src/locales/br.json
- src/locales/en.json
- src/locales/es.json

Process:
1) Add keys to all locale files (keep the same JSON path across all locales).
2) Use the exact namespace used by the component (check useTranslations calls).
3) Avoid removing keys; if you must rename, update both code and translations.

Locale config:
- src/utils/AppConfig.ts defines supported locales.
- src/components/LocaleSelect/index.tsx maps locales to display labels and flags.

## Create a city (admin)

UI flow:
- Page: src/app/(protected)/(admin)/cities/create/page.tsx
- Form: src/components/Cities/CreateCityForm.tsx

What happens:
- The form posts to api.city.create in src/services/api/city.ts
- The API URL is set by API_URL or NEXT_PUBLIC_API_URL

When adding fields:
1) Update City type in src/types/City/index.ts
2) Update create/edit schemas in src/schemas/city
3) Update CreateCityForm and EditCityForm
4) Confirm backend API accepts the new fields

## Create or edit issue types

Common places to verify:
- src/types/Issue/index.ts (IssueType, IssueCategory, issueCategories)
- src/schemas/issues/report.schema.ts (validation)
- src/components/Issues/report-issue-form.tsx (form behavior)
- src/locales/* (Issues.types translations)

If the backend changes the payload keys, update:
- src/services/api/issues.ts
- src/components/Issues/report-issue-form.tsx (payload mapping)

## Sidebar navigation

Sidebar layout:
- src/components/app-sidebar/index.tsx

Nav groups:
- src/components/app-sidebar/nav-general.tsx
- src/components/app-sidebar/nav-admin.tsx
- src/components/app-sidebar/nav-manager.tsx
- src/components/app-sidebar/nav-owner.tsx
- src/components/app-sidebar/nav-financial.tsx

User menu:
- src/components/app-sidebar/nav-user.tsx (also contains theme toggle)

Translations:
- src/locales/* under Components.Sidebar

Tips:
- Prefer translations for labels and tooltips (see Components.Sidebar.*)
- Keep new routes consistent with access control (roles from JWT)

## Tables and forms UX patterns

Tables:
- Use Card + header + filter + empty state
- See: src/app/(protected)/issues/components/table.tsx
- See: src/app/(protected)/(admin)/cities/components/table.tsx

Forms:
- Use Card sections with muted blocks for inputs
- See: src/components/Issues/report-issue-form.tsx
- See: src/components/Cities/CreateCityForm.tsx
- See: src/components/Cities/EditCityForm.tsx
- See: src/components/Features/FeatureForm.tsx

## Ads and placement

- Follow the usage and placement rules in docs/ADS.md

## Environment variables

Validated in:
- src/libs/Env.ts

Examples:
- NEXT_PUBLIC_APP_URL
- NEXT_PUBLIC_API_URL
- API_URL
- NEXT_PUBLIC_IMGBB_KEY
- NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

Keep .env.example updated when adding new vars.

## Useful files and entry points

- src/app/(protected)/layout.tsx (global protected layout)
- src/components/ui/sidebar/sidebar.tsx (sidebar behavior)
- src/components/ui/sheet/sheet.tsx (mobile drawer behavior)
- src/styles/global.css (design tokens)
