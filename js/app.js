/**
 * Research Project Dashboard
 * Fetches project data from a public Google Sheet and renders filterable cards
 */

// ============================================================================
// CONFIGURATION - Update these values with your Google Sheet details
// ============================================================================

const CONFIG = {
    // Your Google Sheet ID (from the URL: https://docs.google.com/spreadsheets/d/SHEET_ID/edit)
    SHEET_ID: '1wC57FDGLijnPiXQ6NIpGmiVWicnuOT1HwMBlnh-W_PY',
    
    // The sheet/tab name (default is usually "Form Responses 1" for form-linked sheets)
    SHEET_NAME: 'Form Responses 1',
    
    // Your Google Form URL for submissions
    FORM_URL: 'https://docs.google.com/forms/d/e/1FAIpQLSe8guiY6444i5NTC86ROLXzd5kWNUZmhLqUrWWXFvfQzpw1sw/viewform',
    
    // Google Sheets API key (optional - only needed if sheet is not published to web)
    // For published sheets, we use the CSV export which doesn't need an API key
    API_KEY: '',
    
    // Use demo data from local CSV file (set to false once Google Sheet is configured)
    USE_DEMO_DATA: false,
    DEMO_DATA_URL: 'data/seed_projects.csv'
};

// ============================================================================
// Column mapping - maps sheet columns to data fields
// Update these if your form questions are in a different order
// ============================================================================

const COLUMNS = {
    TIMESTAMP: 0,
    NAME: 1,
    DESCRIPTION: 2,
    KEYWORDS: 3,
    DISCIPLINE: 4,
    METHODOLOGY: 5,
    DATA_COLLECTED: 6,
    STATUS: 7,
    SEEKING: 8,
    TARGET_JOURNALS: 9,
    LINK: 10,
    CONTACT: 11
};

// ============================================================================
// Application State
// ============================================================================

let allProjects = [];
let filteredProjects = [];

// ============================================================================
// DOM Elements
// ============================================================================

const elements = {
    search: document.getElementById('search'),
    filterDiscipline: document.getElementById('filter-discipline'),
    filterStatus: document.getElementById('filter-status'),
    filterData: document.getElementById('filter-data'),
    filterSeeking: document.getElementById('filter-seeking'),
    clearFilters: document.getElementById('clear-filters'),
    submitLink: document.getElementById('submit-link'),
    submitLinkFooter: document.getElementById('submit-link-footer'),
    projectsGrid: document.getElementById('projects'),
    resultsCount: document.getElementById('results-count'),
    loading: document.getElementById('loading'),
    error: document.getElementById('error')
};

// ============================================================================
// Data Fetching
// ============================================================================

async function fetchProjects() {
    let csvUrl;
    
    if (CONFIG.USE_DEMO_DATA) {
        // Use local demo data
        csvUrl = CONFIG.DEMO_DATA_URL;
    } else {
        // Construct the CSV export URL for the published Google Sheet
        csvUrl = `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(CONFIG.SHEET_NAME)}`;
    }
    
    try {
        const response = await fetch(csvUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        return parseCSV(csvText);
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
}

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const projects = [];
    
    // Skip header row (index 0)
    for (let i = 1; i < lines.length; i++) {
        const row = parseCSVRow(lines[i]);
        
        if (row.length > 1 && row[COLUMNS.NAME]) {
            projects.push({
                timestamp: row[COLUMNS.TIMESTAMP] || '',
                name: row[COLUMNS.NAME] || '',
                description: row[COLUMNS.DESCRIPTION] || '',
                keywords: row[COLUMNS.KEYWORDS] || '',
                discipline: row[COLUMNS.DISCIPLINE] || '',
                methodology: row[COLUMNS.METHODOLOGY] || '',
                dataCollected: row[COLUMNS.DATA_COLLECTED] || '',
                status: row[COLUMNS.STATUS] || '',
                seeking: row[COLUMNS.SEEKING] || '',
                targetJournals: row[COLUMNS.TARGET_JOURNALS] || '',
                link: row[COLUMNS.LINK] || '',
                contact: row[COLUMNS.CONTACT] || ''
            });
        }
    }
    
    return projects;
}

function parseCSVRow(row) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        
        if (char === '"') {
            if (inQuotes && row[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current.trim());
    return result;
}

// ============================================================================
// Filtering
// ============================================================================

function applyFilters() {
    const searchTerm = elements.search.value.toLowerCase();
    const disciplineFilter = elements.filterDiscipline.value;
    const statusFilter = elements.filterStatus.value;
    const dataFilter = elements.filterData.value;
    const seekingFilter = elements.filterSeeking.value;
    
    filteredProjects = allProjects.filter(project => {
        // Search filter
        if (searchTerm) {
            const searchableText = `${project.name} ${project.description} ${project.keywords}`.toLowerCase();
            if (!searchableText.includes(searchTerm)) {
                return false;
            }
        }
        
        // Discipline filter
        if (disciplineFilter && project.discipline !== disciplineFilter) {
            return false;
        }
        
        // Status filter
        if (statusFilter && project.status !== statusFilter) {
            return false;
        }
        
        // Data collected filter
        if (dataFilter && project.dataCollected !== dataFilter) {
            return false;
        }
        
        // Seeking filter
        if (seekingFilter && !project.seeking.includes(seekingFilter)) {
            return false;
        }
        
        return true;
    });
    
    renderProjects();
    updateResultsCount();
}

function clearFilters() {
    elements.search.value = '';
    elements.filterDiscipline.value = '';
    elements.filterStatus.value = '';
    elements.filterData.value = '';
    elements.filterSeeking.value = '';
    applyFilters();
}

// ============================================================================
// Rendering
// ============================================================================

function renderProjects() {
    if (filteredProjects.length === 0) {
        elements.projectsGrid.innerHTML = `
            <div class="empty-state">
                <p>No projects match your filters.</p>
            </div>
        `;
        return;
    }
    
    // Sort by date (newest first)
    const sorted = [...filteredProjects].sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    elements.projectsGrid.innerHTML = sorted.map(project => renderProjectCard(project)).join('');
}

function renderProjectCard(project) {
    const statusClass = getStatusClass(project.status);
    const keywordsHtml = renderKeywords(project.keywords);
    const dateFormatted = formatDate(project.timestamp);
    
    const titleHtml = project.link 
        ? `<a href="${escapeHtml(project.link)}" target="_blank">${escapeHtml(project.name)}</a>`
        : escapeHtml(project.name);
    
    return `
        <article class="project-card">
            <h2>${titleHtml}</h2>
            <p class="project-description">${escapeHtml(project.description)}</p>
            
            <div class="project-meta">
                <div class="meta-row">
                    <span class="meta-label">Status:</span>
                    <span class="meta-value"><span class="status-badge ${statusClass}">${escapeHtml(project.status)}</span></span>
                </div>
                <div class="meta-row">
                    <span class="meta-label">Discipline:</span>
                    <span class="meta-value">${escapeHtml(project.discipline)}</span>
                </div>
                <div class="meta-row">
                    <span class="meta-label">Methodology:</span>
                    <span class="meta-value">${escapeHtml(project.methodology)}</span>
                </div>
                <div class="meta-row">
                    <span class="meta-label">Data:</span>
                    <span class="meta-value">${escapeHtml(project.dataCollected)}</span>
                </div>
                ${project.seeking ? `
                <div class="meta-row">
                    <span class="meta-label">Seeking:</span>
                    <span class="meta-value">${escapeHtml(project.seeking)}</span>
                </div>
                ` : ''}
                ${project.targetJournals ? `
                <div class="meta-row">
                    <span class="meta-label">Targets:</span>
                    <span class="meta-value">${escapeHtml(project.targetJournals)}</span>
                </div>
                ` : ''}
            </div>
            
            ${keywordsHtml}
            
            <div class="project-footer">
                <a href="mailto:${escapeHtml(project.contact)}" class="contact-link">Contact</a>
                <span class="date-added">Added ${dateFormatted}</span>
            </div>
        </article>
    `;
}

function renderKeywords(keywordsStr) {
    if (!keywordsStr) return '';
    
    const keywords = keywordsStr.split(',').map(k => k.trim()).filter(k => k);
    if (keywords.length === 0) return '';
    
    return `
        <div class="keywords">
            ${keywords.map(k => `<span class="keyword">${escapeHtml(k)}</span>`).join('')}
        </div>
    `;
}

function getStatusClass(status) {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('idea')) return 'status-idea';
    if (statusLower.includes('data')) return 'status-data';
    if (statusLower.includes('draft')) return 'status-draft';
    if (statusLower.includes('stalled')) return 'status-stalled';
    return '';
}

function updateResultsCount() {
    const total = allProjects.length;
    const showing = filteredProjects.length;
    
    if (showing === total) {
        elements.resultsCount.textContent = `Showing all ${total} projects`;
    } else {
        elements.resultsCount.textContent = `Showing ${showing} of ${total} projects`;
    }
}

function populateDynamicFilters() {
    // Get unique disciplines
    const disciplines = [...new Set(allProjects.map(p => p.discipline).filter(d => d))].sort();
    disciplines.forEach(d => {
        const option = document.createElement('option');
        option.value = d;
        option.textContent = d;
        elements.filterDiscipline.appendChild(option);
    });
    
    // Get unique "seeking" values
    const seekingValues = new Set();
    allProjects.forEach(p => {
        if (p.seeking) {
            p.seeking.split(',').forEach(s => seekingValues.add(s.trim()));
        }
    });
    [...seekingValues].sort().forEach(s => {
        const option = document.createElement('option');
        option.value = s;
        option.textContent = s;
        elements.filterSeeking.appendChild(option);
    });
}

// ============================================================================
// Utilities
// ============================================================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateStr) {
    if (!dateStr) return 'Unknown';
    
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    } catch {
        return dateStr;
    }
}

// ============================================================================
// Event Listeners
// ============================================================================

function setupEventListeners() {
    // Search with debounce
    let searchTimeout;
    elements.search.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(applyFilters, 300);
    });
    
    // Filter dropdowns
    elements.filterDiscipline.addEventListener('change', applyFilters);
    elements.filterStatus.addEventListener('change', applyFilters);
    elements.filterData.addEventListener('change', applyFilters);
    elements.filterSeeking.addEventListener('change', applyFilters);
    
    // Clear filters button
    elements.clearFilters.addEventListener('click', clearFilters);
    
    // Set form URLs
    elements.submitLink.href = CONFIG.FORM_URL;
    elements.submitLinkFooter.href = CONFIG.FORM_URL;
}

// ============================================================================
// Initialization
// ============================================================================

async function init() {
    setupEventListeners();
    
    // Check if configuration is set (skip check if using demo data)
    if (!CONFIG.USE_DEMO_DATA && CONFIG.SHEET_ID === 'YOUR_SHEET_ID_HERE') {
        elements.loading.style.display = 'none';
        elements.error.style.display = 'block';
        elements.error.innerHTML = `
            <p><strong>Configuration Required</strong></p>
            <p>Please update the CONFIG object in js/app.js with your Google Sheet ID and Form URL.</p>
            <p>See README.md for setup instructions.</p>
        `;
        return;
    }
    
    try {
        allProjects = await fetchProjects();
        filteredProjects = [...allProjects];
        
        elements.loading.style.display = 'none';
        
        populateDynamicFilters();
        renderProjects();
        updateResultsCount();
    } catch (error) {
        elements.loading.style.display = 'none';
        elements.error.style.display = 'block';
        console.error('Failed to initialize:', error);
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
