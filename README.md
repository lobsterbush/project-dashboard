# Research Project Dashboard

A public, filterable dashboard for researchers to share semi-abandoned paper ideas and fallow datasets seeking collaborators.

## Features

- **Searchable**: Full-text search across project names, descriptions, and keywords
- **Filterable**: Filter by discipline, status, data availability, and what collaborators are seeking
- **Low barrier**: Researchers submit via Google Form (no GitHub account needed)
- **Auto-updating**: Dashboard pulls data directly from Google Sheets

## Setup Instructions

### 1. Create the Google Form

Create a new Google Form with the following questions (in this exact order):

1. **Project Name** (Short answer, required)
2. **Description** (Paragraph) - Brief summary of the project idea
3. **Keywords** (Short answer) - Comma-separated tags
4. **Type of Paper** (Dropdown: Empirical / Theoretical / Empirical and Theoretical)
5. **(Sub-)discipline** (Dropdown) - Options: Political Science, Comparative Politics, International Relations, Political Theory, Other: Please Specify (...........)
6. **Methodological Approach** (Dropdown or Short answer) - e.g., Survey experiment, Archival, Qualitative
7. **Data Collected** (Multiple choice: Yes / No / Partial / N/A)
8. **Status** (Dropdown: Idea only / Outline / Data collected / Partial draft / Stalled)
9. **Help needed** (Checkboxes) - Coauthors, Methods expertise, Funding, Data access, etc.
10. **Target Journals** (Short answer) - Potential outlets
11. **Link** (Short answer) - GitHub repo or Google Drive link (optional)
12. **Contact Email** (Short answer, required)

### 2. Link Form to Google Sheet

1. In Google Forms, go to **Responses** tab
2. Click the green Sheets icon to create a linked spreadsheet
3. This creates a sheet called "Form Responses 1"

### 3. Publish the Google Sheet

1. Open the linked Google Sheet
2. Go to **File → Share → Publish to web**
3. Select "Entire Document" and "Web page"
4. Click **Publish**
5. Copy the **Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
   ```

### 4. Configure the Dashboard

Edit `js/app.js` and update the `CONFIG` object:

```javascript
const CONFIG = {
    SHEET_ID: 'your-actual-sheet-id-here',
    SHEET_NAME: 'Form Responses 1',
    FORM_URL: 'https://docs.google.com/forms/d/e/your-form-id/viewform',
    API_KEY: ''
};
```

### 5. Deploy to GitHub Pages

1. Push this repository to GitHub
2. Go to repository **Settings → Pages**
3. Under "Source", select **main** branch and **/ (root)**
4. Click **Save**
5. Your dashboard will be live at `https://username.github.io/project-dashboard/`

## Customization

### Changing Column Order

If your form questions are in a different order, update the `COLUMNS` object in `js/app.js`:

```javascript
const COLUMNS = {
    TIMESTAMP: 0,        // Always column 0 for Google Forms
    NAME: 1,
    DESCRIPTION: 2,
    KEYWORDS: 3,
    TYPE_OF_PAPER: 4,
    DISCIPLINE: 5,
    METHODOLOGY: 6,
    DATA_COLLECTED: 7,
    STATUS: 8,
    SEEKING: 9,
    TARGET_JOURNALS: 10,
    LINK: 11,
    CONTACT: 12
};
```

### Adding New Fields

1. Add the question to your Google Form
2. Add the column index to `COLUMNS`
3. Update `parseCSV()` to include the new field
4. Update `renderProjectCard()` to display it

### Styling

Edit `css/style.css` to customize colors, fonts, and layout. The design uses CSS custom properties for easy theming:

```css
:root {
    --bg-color: #fffff8;
    --text-color: #111;
    --accent-color: #a00;
    /* ... */
}
```

## File Structure

```
project-dashboard/
├── index.html          # Main page
├── css/
│   └── style.css       # Styling
├── js/
│   └── app.js          # Application logic
└── README.md           # This file
```

## License

MIT
