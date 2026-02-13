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

## After Making Changes

1. The Google Sheet will automatically update with new columns
2. Wait for at least one new submission OR manually add a test row to verify column order
3. Verify that the column order matches:
   1. Timestamp
   2. Project name
   3. Description
   4. Keywords
   5. Type of paper
   6. (Sub-)discipline
   7. Methodological Approach
   8. Data Collected
   9. Status
   10. Help needed
   11. Target journals
   12. Project link
   13. Contact email

4. The website will automatically fetch the updated data on next page load

## Important Notes

- The code has already been updated to handle the new fields
- Make sure questions are in the exact order listed above
- If you reorder questions, you'll need to update the `COLUMNS` object in `js/app.js`
