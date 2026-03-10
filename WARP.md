# Research Backlog

**URL**: https://researchbacklog.org  
**Repo**: https://github.com/lobsterbush/project-dashboard  
**Created**: February 11, 2026  
**Last Updated**: March 10, 2026
**Password**: `erdosrules`

## Overview

A filterable dashboard for sharing dormant research ideas, fallow datasets, and grant applications with potential collaborators. Built for Monash University Political Science and International Relations staff. The dashboard has two tabs: **Projects** (research ideas/data) and **Grants** (grant applications for collaboration).

## Architecture

```
Google Forms (×2) → Google Sheets (2 tabs) → GitHub Pages (fetches CSV on load)
```

- **Projects Form**: https://docs.google.com/forms/d/e/1FAIpQLSe8guiY6444i5NTC86ROLXzd5kWNUZmhLqUrWWXFvfQzpw1sw/viewform
- **Grants Form**: TODO — create per `FORM_UPDATE_INSTRUCTIONS.md`
- **Sheet ID**: `1wC57FDGLijnPiXQ6NIpGmiVWicnuOT1HwMBlnh-W_PY`
  - Tab "Form Responses 1" → projects
  - Tab "Grant Responses" → grants
- **Domain**: researchbacklog.org (Namecheap → GitHub Pages)

## Managing Projects

### Add a project
1. Submit via Google Form, OR
2. Add row directly to Google Sheet

### Edit/delete a project
1. Open Google Sheet
2. Edit or delete the row
3. Changes appear on next page load (no deploy needed)

### Sheet columns (in order)
1. Timestamp
2. Project name
3. Description
4. Keywords (comma-separated)
5. (Sub-)discipline (Political Science/International Relations/Political theory/Methodology/Sociology/Economics/Other)
6. Methodological Approach
7. Data Collected (Yes/No/Partial/N/A)
8. Status (Idea only/Data collected/Partial draft/Outline/Stalled)
9. Help needed (Writing help/Methods expertise/Funding/Data/Area expertise/Theory development)
10. Target journals
11. Project link
12. Contact email
13. Type of paper (Empirical/Theoretical/Empirical and theoretical)
14. Seeking collaborators from (Anyone/Senior staff/HDRs/Early career staff)

**Note**: Google Forms adds new questions to existing linked sheets at the end, regardless of where they appear in the form.

## Managing Grants

### Add a grant
1. Submit via Grants Google Form, OR
2. Add row directly to "Grant Responses" tab in Google Sheet

### Edit/delete a grant
1. Open Google Sheet → "Grant Responses" tab
2. Edit or delete the row
3. Changes appear on next page load (no deploy needed)

### Grant sheet columns (in order)
1. Timestamp
2. Grant title
3. Description
4. Keywords (comma-separated)
5. (Sub-)discipline
6. Type (Reviving past application / New idea)
7. Previous funder (optional)
8. Previous submission year (optional)
9. Target funder
10. Funding amount (approx., optional)
11. Help needed (CI/co-investigator, Methods expertise, Area expertise, Budget/admin support, Writing help, Industry partner, Other)
12. Seeking collaborators from (Anyone/Senior staff/HDRs/Early career staff)
13. Project link (optional)
14. Contact email

## Files

```
project-dashboard/
├── index.html                      # Main page with password overlay
├── CNAME                           # Custom domain (researchbacklog.org)
├── WARP.md                         # This file - project documentation
├── FORM_UPDATE_INSTRUCTIONS.md    # Guide for updating Google Form
├── README.md                       # Setup instructions
├── css/
│   └── style.css                   # Styling (charlescrabtree.org inspired)
├── js/
│   ├── app.js                      # Data fetching, filtering, rendering
│   └── auth.js                     # Client-side password protection
└── data/
    └── seed_projects.csv           # Backup/reference data
```

## Configuration

Edit `js/app.js` CONFIG object:

```javascript
const CONFIG = {
    SHEET_ID: '1wC57FDGLijnPiXQ6NIpGmiVWicnuOT1HwMBlnh-W_PY',
    SHEET_NAME: 'Form Responses 1',
    GRANTS_SHEET_NAME: 'Grant Responses',
    FORM_URL: 'https://docs.google.com/forms/d/e/.../viewform',
    GRANTS_FORM_URL: '',  // TODO: Add after creating grants form
    USE_DEMO_DATA: false,
    DEMO_DATA_URL: 'data/seed_projects.csv'
};
```

## Password Protection

Client-side only (not secure, just a barrier). Password hash stored in `js/auth.js`. To change password:

1. Run in browser console: `simpleHash('newpassword')`
2. Update `PASS_HASH` in `js/auth.js`
3. Commit and push

## DNS (Namecheap)

A records pointing to GitHub Pages:
- 185.199.108.153
- 185.199.109.153
- 185.199.110.153
- 185.199.111.153

CNAME: www → lobsterbush.github.io

## Current Projects (13)

1. Green Book and Contemporary Police Violence
2. Chicago Police Complaints (FOIA)
3. SPLC Hate Groups and Confederate Monuments
4. HRO Communications Dataset (1996-2019)
5. Japanese Public Opinion on US-Japan Security
6. UN Human Rights Documents Analysis
7. Public Demand for Human Rights
8. Belarus 2017 Protests
9. Self-Censorship Under Autocracy (Belarus journalists)
10. Formal vs. Informal Repression (Belarus/Ukraine)
11. European Protest Event Data (Francisco dataset)
12. Dynamics of Contentious Politics (ML on Francisco data)

## Scaling Roadmap

Discussed March 10, 2026. Core concern for broader adoption: **idea theft**.

### Phase 1 — Trust architecture (priority)
- Tiered visibility: title only (public) → summary (verified) → full details (owner-approved)
- Restrict access to institutional email accounts (replace client-side password with real auth)
- Auto-display submission timestamp on every card (priority protection)
- Audit log: record who views/requests each idea
- Optional OSF pre-registration link field for formal priority claim
- Clear terms of use: viewing ≠ right to execute independently

### Phase 2 — Multi-institution rollout
- Package as a deployable template ("department-in-a-box")
- Each institution runs its own instance (own data, branding, access control)
- Cross-institution federation only for entries explicitly opted in

### Phase 3 — Productization (only if demand proven)
- Migrate from static/Sheets to proper backend (Supabase or Firebase)
- Request/approval workflows for accessing full project details
- Institutional admin panel

## Recent Updates

### March 10, 2026
- Assessed scaling potential and IP protection requirements (see Scaling Roadmap above)
- Visual design: experimented with greyscale design system and animated gradients; reverted to original color scheme

### March 8, 2026
- Added **Grants tab** to dashboard (Projects / Grants toggle)
- Grants support: separate Google Form, separate sheet tab, dedicated card layout
- Grant cards show type (Revival / New idea), target funder, funding amount, previous submission history
- Grant-specific filters: Type, Target Funder
- Shared filters work across both tabs: Discipline, Help needed, Seeking from
- Grants fetch fails gracefully if sheet tab doesn't exist yet
- Updated `FORM_UPDATE_INSTRUCTIONS.md` with full grants form creation guide

### February 15, 2026
- Added "Seeking collaborators from" field (Anyone/Senior staff/HDRs/Early career staff)
- Multi-select checkboxes, displayed as purple tags on project cards
- New filter dropdown for collaborator audience

### February 13, 2026
- Added "Type of paper" field (Empirical/Theoretical/Empirical and theoretical)
- Changed "Discipline" to "(Sub-)discipline" with expanded options
- Added "N/A" option to Data Collected field
- Added "Outline" option to Status field
- Renamed "Seeking" to "Help needed"
- Fixed column mapping to match Google Sheet structure (Type of paper at position 13)

## Deployment

GitHub Pages auto-deploys on push. To manually trigger:

```bash
gh api repos/lobsterbush/project-dashboard/pages/builds -X POST
```

---

**Co-Authored-By**: Warp <agent@warp.dev>
