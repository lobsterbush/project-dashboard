# Research Backlog

**URL**: https://researchbacklog.org  
**Repo**: https://github.com/lobsterbush/project-dashboard  
**Created**: February 11, 2026  
**Password**: `erdosrules`

## Overview

A filterable dashboard for sharing dormant research ideas and fallow datasets with potential collaborators. Built for Monash University Political Science and International Relations staff.

## Architecture

```
Google Form → Google Sheets → GitHub Pages (fetches CSV on load)
```

- **Form**: https://docs.google.com/forms/d/e/1FAIpQLSe8guiY6444i5NTC86ROLXzd5kWNUZmhLqUrWWXFvfQzpw1sw/viewform
- **Sheet ID**: `1wC57FDGLijnPiXQ6NIpGmiVWicnuOT1HwMBlnh-W_PY`
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
5. Type of paper (Empirical/Theoretical/Empirical and Theoretical)
6. (Sub-)discipline (Political Science/Comparative Politics/International Relations/Political Theory/Other)
7. Methodological Approach
8. Data Collected (Yes/No/Partial/N/A)
9. Status (Idea only/Outline/Data collected/Partial draft/Stalled)
10. Help needed (comma-separated)
11. Target journals
12. Project link
13. Contact email

## Files

```
project-dashboard/
├── index.html          # Main page with password overlay
├── CNAME               # Custom domain (researchbacklog.org)
├── css/
│   └── style.css       # Styling (charlescrabtree.org inspired)
├── js/
│   ├── app.js          # Data fetching, filtering, rendering
│   └── auth.js         # Client-side password protection
├── data/
│   └── seed_projects.csv   # Backup/reference data
└── README.md           # Setup instructions
```

## Configuration

Edit `js/app.js` CONFIG object:

```javascript
const CONFIG = {
    SHEET_ID: '1wC57FDGLijnPiXQ6NIpGmiVWicnuOT1HwMBlnh-W_PY',
    SHEET_NAME: 'Form Responses 1',
    FORM_URL: 'https://docs.google.com/forms/d/e/.../viewform',
    USE_DEMO_DATA: false,  // Set true to use local CSV instead
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

## Deployment

GitHub Pages auto-deploys on push. To manually trigger:

```bash
gh api repos/lobsterbush/project-dashboard/pages/builds -X POST
```

---

**Co-Authored-By**: Warp <agent@warp.dev>
