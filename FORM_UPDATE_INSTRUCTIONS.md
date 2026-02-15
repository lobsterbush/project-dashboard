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
