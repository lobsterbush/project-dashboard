# Google Form Update Instructions

To complete the Research Backlog updates, you need to manually update the Google Form:

**Form URL**: https://docs.google.com/forms/d/e/1FAIpQLSe8guiY6444i5NTC86ROLXzd5kWNUZmhLqUrWWXFvfQzpw1sw/viewform

## Required Changes

### 1. Add new question after "Keywords"
**Question 4: Type of Paper**
- Question type: Multiple choice (dropdown)
- Options:
  - Empirical
  - Theoretical
  - Empirical and Theoretical

### 2. Update existing "Discipline" question
**Question 5: (Sub-)discipline** (update the label)
- Question type: Multiple choice (dropdown)
- Update options to include:
  - Political Science
  - Comparative Politics
  - International Relations
  - Political Theory
  - Other: Please Specify (...........)

### 3. Update "Data Collected" question
**Question 7: Data Collected**
- Add option: **N/A**
- Full list should be: Yes, No, Partial, N/A

### 4. Update "Status" question
**Question 8: Status**
- Add option: **Outline**
- Full list should be: Idea only, Outline, Data collected, Partial draft, Stalled

### 5. Rename "Seeking" question
**Question 9: Help needed** (update the label from "Seeking")
- Keep all existing checkbox options (Coauthors, Methods expertise, Funding, Data access, etc.)
- Only change the question label/title

### 6. Add new question before "Target journals"
**Question 10: Seeking collaborators from**
- Question type: Checkboxes (multiple selection)
- Options:
  - Anyone
  - Senior staff
  - HDRs
  - Early career staff

## After Making Changes

1. The Google Sheet will automatically update with new columns
2. Wait for at least one new submission OR manually add a test row to verify column order
3. Verify that the column order in the sheet is:
   1. Timestamp
   2. Project name
   3. Description
   4. Keywords
   5. (Sub-)discipline
   6. Methodological Approach
   7. Data Collected
   8. Status
   9. Help needed
   10. Target journals
   11. Project link
   12. Contact email
   13. Type of paper
   14. Seeking collaborators from
   
   Note: Google Forms adds new questions to existing linked sheets at the END,
   regardless of where they appear in the form.

4. The website will automatically fetch the updated data on next page load

## Important Notes

- The code has already been updated to handle the new fields
- Make sure questions are in the exact order listed above
- If you reorder questions, you'll need to update the `COLUMNS` object in `js/app.js`

---

# Creating the Grants Google Form

A separate Google Form is needed for grant applications. This form should be linked to a **new tab** in the existing Google Sheet.

## Step 1: Create a new Google Form

Create a new form with the title **"Research Backlog: Grant Applications"** and add these fields in order:

### Question 1: Grant title
- Type: Short answer
- Required: Yes

### Question 2: Description
- Type: Paragraph
- Required: Yes
- Description hint: "Describe the grant idea. If reviving a past application, explain what was submitted and what could be improved."

### Question 3: Keywords
- Type: Short answer
- Required: No
- Description hint: "Comma-separated keywords"

### Question 4: (Sub-)discipline
- Type: Dropdown
- Required: Yes
- Options:
  - Political Science
  - Comparative Politics
  - International Relations
  - Political Theory
  - Methodology
  - Sociology
  - Economics
  - Other

### Question 5: Type
- Type: Dropdown
- Required: Yes
- Options:
  - Reviving past application
  - New idea

### Question 6: Previous funder
- Type: Short answer
- Required: No
- Description hint: "If reviving a past application, which funder was it submitted to?"

### Question 7: Previous submission year
- Type: Short answer
- Required: No
- Description hint: "If reviving, what year was it submitted?"

### Question 8: Target funder
- Type: Short answer
- Required: No
- Description hint: "e.g. ARC Discovery, DECRA, Endeavour, etc."

### Question 9: Funding amount (approx.)
- Type: Short answer
- Required: No

### Question 10: Help needed
- Type: Checkboxes (multiple selection)
- Required: No
- Options:
  - CI/co-investigator
  - Methods expertise
  - Area expertise
  - Budget/admin support
  - Writing help
  - Industry partner
  - Other

### Question 11: Seeking collaborators from
- Type: Checkboxes (multiple selection)
- Required: No
- Options:
  - Anyone
  - Senior staff
  - HDRs
  - Early career staff

### Question 12: Project link
- Type: Short answer
- Required: No

### Question 13: Contact email
- Type: Short answer
- Required: Yes

## Step 2: Link to the existing Google Sheet

1. In the form, click the **Responses** tab
2. Click the green Sheets icon ("Link to Sheets")
3. Choose **"Select existing spreadsheet"**
4. Select the Research Backlog spreadsheet (`1wC57FDGLijnPiXQ6NIpGmiVWicnuOT1HwMBlnh-W_PY`)
5. A new tab called **"Grant Responses"** will be created automatically

## Step 3: Update the dashboard config

1. Copy the form's shareable link
2. Open `js/app.js`
3. Update `CONFIG.GRANTS_FORM_URL` with the new form URL
4. If the sheet tab name differs from "Grant Responses", update `CONFIG.GRANTS_SHEET_NAME`

## Step 4: Verify column order

The Grant Responses sheet columns should be (in order):
1. Timestamp
2. Grant title
3. Description
4. Keywords
5. (Sub-)discipline
6. Type
7. Previous funder
8. Previous submission year
9. Target funder
10. Funding amount (approx.)
11. Help needed
12. Seeking collaborators from
13. Project link
14. Contact email

If columns are in a different order, update `GRANT_COLUMNS` in `js/app.js`.
