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
    
    // The sheet/tab name for projects
    SHEET_NAME: 'Project responses',
    
    // The sheet/tab name for grants (created by the grants Google Form)
    GRANTS_SHEET_NAME: 'Grant responses',
    
    // Google Form URLs
    FORM_URL: 'https://docs.google.com/forms/d/e/1FAIpQLSe8guiY6444i5NTC86ROLXzd5kWNUZmhLqUrWWXFvfQzpw1sw/viewform',
    GRANTS_FORM_URL: 'https://docs.google.com/forms/d/e/1FAIpQLSe1cSgiZ2YjQC7ahZ4DkK6B4BmhG9oGd_KCO4qMFOV_44drrA/viewform',
    
    // Google Sheets API key (optional - only needed if sheet is not published to web)
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
    CONTACT: 11,
    TYPE_OF_PAPER: 12,
    COLLABORATOR_AUDIENCE: 13
};

const GRANT_COLUMNS = {
    TIMESTAMP: 0,
    NAME: 1,
    DESCRIPTION: 2,
    KEYWORDS: 3,
    DISCIPLINE: 4,
    TYPE: 5,           // "Reviving past application" or "New idea"
    PREV_FUNDER: 6,
    PREV_YEAR: 7,
    TARGET_FUNDER: 8,
    AMOUNT: 9,
    SEEKING: 10,
    COLLABORATOR_AUDIENCE: 11,
    LINK: 12,
    CONTACT: 13
};

// ============================================================================
// Application State
// ============================================================================

let activeTab = 'projects';
let allProjects = [];
let filteredProjects = [];
let allGrants = [];
let filteredGrants = [];

// ============================================================================
// DOM Elements
// ============================================================================

const elements = {
    search: document.getElementById('search'),
    subtitle: document.getElementById('subtitle'),
    filterTypeOfPaper: document.getElementById('filter-type-of-paper'),
    filterDiscipline: document.getElementById('filter-discipline'),
    filterStatus: document.getElementById('filter-status'),
    filterData: document.getElementById('filter-data'),
    filterSeeking: document.getElementById('filter-seeking'),
    filterCollaboratorAudience: document.getElementById('filter-collaborator-audience'),
    filterGrantType: document.getElementById('filter-grant-type'),
    filterTargetFunder: document.getElementById('filter-target-funder'),
    clearFilters: document.getElementById('clear-filters'),
    submitLinkHeader: document.getElementById('submit-link-header'),
    projectsGrid: document.getElementById('projects'),
    resultsCount: document.getElementById('results-count'),
    lastUpdated: document.getElementById('last-updated'),
    loading: document.getElementById('loading'),
    error: document.getElementById('error'),
    tabButtons: document.querySelectorAll('.tab-btn'),
    projectFilters: document.querySelectorAll('.project-filter'),
    grantFilters: document.querySelectorAll('.grant-filter')
};

// ============================================================================
// Data Fetching
// ============================================================================

async function fetchSheetCSV(sheetName) {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
    const response = await fetch(csvUrl);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.text();
}

async function fetchProjects() {
    if (CONFIG.USE_DEMO_DATA) {
        const response = await fetch(CONFIG.DEMO_DATA_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return parseCSV(await response.text());
    }
    const csvText = await fetchSheetCSV(CONFIG.SHEET_NAME);
    return parseCSV(csvText);
}

async function fetchGrants() {
    const csvText = await fetchSheetCSV(CONFIG.GRANTS_SHEET_NAME);
    return parseGrantCSV(csvText);
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
                typeOfPaper: row[COLUMNS.TYPE_OF_PAPER] || '',
                discipline: row[COLUMNS.DISCIPLINE] || '',
                methodology: row[COLUMNS.METHODOLOGY] || '',
                dataCollected: row[COLUMNS.DATA_COLLECTED] || '',
                status: row[COLUMNS.STATUS] || '',
                seeking: row[COLUMNS.SEEKING] || '',
                targetJournals: row[COLUMNS.TARGET_JOURNALS] || '',
                link: row[COLUMNS.LINK] || '',
                contact: row[COLUMNS.CONTACT] || '',
                collaboratorAudience: row[COLUMNS.COLLABORATOR_AUDIENCE] || ''
            });
        }
    }
    
    return projects;
}

function parseGrantCSV(csvText) {
    const lines = csvText.split('\n');
    const grants = [];
    
    for (let i = 1; i < lines.length; i++) {
        const row = parseCSVRow(lines[i]);
        
        if (row.length > 1 && row[GRANT_COLUMNS.NAME]) {
            grants.push({
                timestamp: row[GRANT_COLUMNS.TIMESTAMP] || '',
                name: row[GRANT_COLUMNS.NAME] || '',
                description: row[GRANT_COLUMNS.DESCRIPTION] || '',
                keywords: row[GRANT_COLUMNS.KEYWORDS] || '',
                discipline: row[GRANT_COLUMNS.DISCIPLINE] || '',
                type: row[GRANT_COLUMNS.TYPE] || '',
                prevFunder: row[GRANT_COLUMNS.PREV_FUNDER] || '',
                prevYear: row[GRANT_COLUMNS.PREV_YEAR] || '',
                targetFunder: row[GRANT_COLUMNS.TARGET_FUNDER] || '',
                amount: row[GRANT_COLUMNS.AMOUNT] || '',
                seeking: row[GRANT_COLUMNS.SEEKING] || '',
                collaboratorAudience: row[GRANT_COLUMNS.COLLABORATOR_AUDIENCE] || '',
                link: row[GRANT_COLUMNS.LINK] || '',
                contact: row[GRANT_COLUMNS.CONTACT] || ''
            });
        }
    }
    
    return grants;
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
    const seekingFilter = elements.filterSeeking.value;
    const collaboratorAudienceFilter = elements.filterCollaboratorAudience.value;
    
    if (activeTab === 'projects') {
        const typeOfPaperFilter = elements.filterTypeOfPaper.value;
        const statusFilter = elements.filterStatus.value;
        const dataFilter = elements.filterData.value;
        
        filteredProjects = allProjects.filter(project => {
            if (searchTerm) {
                const searchableText = `${project.name} ${project.description} ${project.keywords}`.toLowerCase();
                if (!searchableText.includes(searchTerm)) return false;
            }
            if (typeOfPaperFilter && project.typeOfPaper !== typeOfPaperFilter) return false;
            if (disciplineFilter && project.discipline !== disciplineFilter) return false;
            if (statusFilter && project.status !== statusFilter) return false;
            if (dataFilter && project.dataCollected !== dataFilter) return false;
            if (seekingFilter && !project.seeking.includes(seekingFilter)) return false;
            if (collaboratorAudienceFilter && !project.collaboratorAudience.includes(collaboratorAudienceFilter)) return false;
            return true;
        });
        renderProjects();
    } else {
        const grantTypeFilter = elements.filterGrantType.value;
        const targetFunderFilter = elements.filterTargetFunder.value;
        
        filteredGrants = allGrants.filter(grant => {
            if (searchTerm) {
                const searchableText = `${grant.name} ${grant.description} ${grant.keywords} ${grant.targetFunder}`.toLowerCase();
                if (!searchableText.includes(searchTerm)) return false;
            }
            if (disciplineFilter && grant.discipline !== disciplineFilter) return false;
            if (grantTypeFilter && grant.type !== grantTypeFilter) return false;
            if (targetFunderFilter && grant.targetFunder !== targetFunderFilter) return false;
            if (seekingFilter && !grant.seeking.includes(seekingFilter)) return false;
            if (collaboratorAudienceFilter && !grant.collaboratorAudience.includes(collaboratorAudienceFilter)) return false;
            return true;
        });
        renderGrants();
    }
    
    updateResultsCount();
}

function clearFilters() {
    elements.search.value = '';
    elements.filterDiscipline.value = '';
    elements.filterSeeking.value = '';
    elements.filterCollaboratorAudience.value = '';
    elements.filterTypeOfPaper.value = '';
    elements.filterStatus.value = '';
    elements.filterData.value = '';
    elements.filterGrantType.value = '';
    elements.filterTargetFunder.value = '';
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
    
    const sorted = [...filteredProjects].sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    elements.projectsGrid.innerHTML = sorted.map(project => renderProjectCard(project)).join('');
}

function renderGrants() {
    if (filteredGrants.length === 0) {
        elements.projectsGrid.innerHTML = `
            <div class="empty-state">
                <p>No grants match your filters.</p>
            </div>
        `;
        return;
    }
    
    const sorted = [...filteredGrants].sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    elements.projectsGrid.innerHTML = sorted.map(grant => renderGrantCard(grant)).join('');
}

function renderProjectCard(project) {
    const statusClass = getStatusClass(project.status);
    const keywordsHtml = renderKeywords(project.keywords);
    const dateFormatted = formatDate(project.timestamp);
    
    const titleHtml = project.link 
        ? `<a href="${escapeHtml(project.link)}" target="_blank">${escapeHtml(project.name)}</a>`
        : escapeHtml(project.name);
    
    const helpNeededTags = project.seeking ? project.seeking.split(',').map(s => s.trim()).filter(s => s) : [];
    const targetJournalsList = project.targetJournals ? project.targetJournals.split(',').map(j => j.trim()).filter(j => j) : [];
    const audienceTags = project.collaboratorAudience ? project.collaboratorAudience.split(',').map(a => a.trim()).filter(a => a) : [];
    
    return `
        <article class="project-card">
            <h2>${titleHtml}</h2>
            <p class="project-description">${escapeHtml(project.description)}</p>
            
            <div class="project-meta-grid">
                <div class="meta-item">
                    <span class="meta-icon">📊</span>
                    <span class="meta-content">
                        <span class="meta-label">Status</span>
                        <span class="status-badge ${statusClass}">${escapeHtml(project.status)}</span>
                    </span>
                </div>
                ${project.typeOfPaper ? `
                <div class="meta-item">
                    <span class="meta-icon">📄</span>
                    <span class="meta-content">
                        <span class="meta-label">Type</span>
                        <span class="meta-value">${escapeHtml(project.typeOfPaper)}</span>
                    </span>
                </div>
                ` : ''}
                <div class="meta-item">
                    <span class="meta-icon">🎯</span>
                    <span class="meta-content">
                        <span class="meta-label">(Sub-)discipline</span>
                        <span class="meta-value">${escapeHtml(project.discipline)}</span>
                    </span>
                </div>
                <div class="meta-item">
                    <span class="meta-icon">🔬</span>
                    <span class="meta-content">
                        <span class="meta-label">Methods</span>
                        <span class="meta-value">${escapeHtml(project.methodology)}</span>
                    </span>
                </div>
                <div class="meta-item">
                    <span class="meta-icon">💾</span>
                    <span class="meta-content">
                        <span class="meta-label">Data</span>
                        <span class="meta-value data-${project.dataCollected.toLowerCase().replace(/\//, '-')}">${escapeHtml(project.dataCollected)}</span>
                    </span>
                </div>
            </div>
            
            ${helpNeededTags.length > 0 ? `
            <div class="info-section">
                <div class="info-header">
                    <span class="meta-icon">🤝</span>
                    <span class="meta-label">Help needed</span>
                </div>
                <div class="info-tags">
                    ${helpNeededTags.map(s => `<span class="info-tag help-tag">${escapeHtml(s)}</span>`).join('')}
                </div>
            </div>
            ` : ''}
            
            ${audienceTags.length > 0 ? `
            <div class="info-section">
                <div class="info-header">
                    <span class="meta-icon">👥</span>
                    <span class="meta-label">Seeking collaborators from</span>
                </div>
                <div class="info-tags">
                    ${audienceTags.map(a => `<span class="info-tag audience-tag">${escapeHtml(a)}</span>`).join('')}
                </div>
            </div>
            ` : ''}
            
            ${targetJournalsList.length > 0 ? `
            <div class="info-section">
                <div class="info-header">
                    <span class="meta-icon">📚</span>
                    <span class="meta-label">Target journals</span>
                </div>
                <div class="info-tags">
                    ${targetJournalsList.map(j => `<span class="info-tag journal-tag">${escapeHtml(j)}</span>`).join('')}
                </div>
            </div>
            ` : ''}
            
            ${keywordsHtml}
            
            <div class="project-footer">
                <span class="contact-label">Contact:</span> <a href="mailto:${escapeHtml(project.contact)}" class="contact-link">${escapeHtml(project.contact)}</a>
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

function renderGrantCard(grant) {
    const keywordsHtml = renderKeywords(grant.keywords);
    const dateFormatted = formatDate(grant.timestamp);
    const typeClass = grant.type.toLowerCase().includes('reviv') ? 'grant-type-revival' : 'grant-type-new';
    const typeLabel = grant.type.toLowerCase().includes('reviv') ? 'Revival' : 'New idea';
    
    const titleHtml = grant.link 
        ? `<a href="${escapeHtml(grant.link)}" target="_blank">${escapeHtml(grant.name)}</a>`
        : escapeHtml(grant.name);
    
    const helpNeededTags = grant.seeking ? grant.seeking.split(',').map(s => s.trim()).filter(s => s) : [];
    const audienceTags = grant.collaboratorAudience ? grant.collaboratorAudience.split(',').map(a => a.trim()).filter(a => a) : [];
    
    return `
        <article class="project-card grant-card">
            <h2>${titleHtml}</h2>
            <p class="project-description">${escapeHtml(grant.description)}</p>
            
            <div class="project-meta-grid">
                <div class="meta-item">
                    <span class="meta-icon">🏷️</span>
                    <span class="meta-content">
                        <span class="meta-label">Type</span>
                        <span class="status-badge ${typeClass}">${escapeHtml(typeLabel)}</span>
                    </span>
                </div>
                <div class="meta-item">
                    <span class="meta-icon">🎯</span>
                    <span class="meta-content">
                        <span class="meta-label">(Sub-)discipline</span>
                        <span class="meta-value">${escapeHtml(grant.discipline)}</span>
                    </span>
                </div>
                ${grant.targetFunder ? `
                <div class="meta-item">
                    <span class="meta-icon">🏦</span>
                    <span class="meta-content">
                        <span class="meta-label">Target funder</span>
                        <span class="meta-value">${escapeHtml(grant.targetFunder)}</span>
                    </span>
                </div>
                ` : ''}
                ${grant.amount ? `
                <div class="meta-item">
                    <span class="meta-icon">💰</span>
                    <span class="meta-content">
                        <span class="meta-label">Amount (approx.)</span>
                        <span class="meta-value">${escapeHtml(grant.amount)}</span>
                    </span>
                </div>
                ` : ''}
            </div>
            
            ${grant.prevFunder || grant.prevYear ? `
            <div class="info-section grant-history">
                <div class="info-header">
                    <span class="meta-icon">📋</span>
                    <span class="meta-label">Previous submission</span>
                </div>
                <p class="grant-history-text">
                    ${grant.prevFunder ? `Submitted to <strong>${escapeHtml(grant.prevFunder)}</strong>` : ''}
                    ${grant.prevYear ? `(${escapeHtml(grant.prevYear)})` : ''}
                </p>
            </div>
            ` : ''}
            
            ${helpNeededTags.length > 0 ? `
            <div class="info-section">
                <div class="info-header">
                    <span class="meta-icon">🤝</span>
                    <span class="meta-label">Help needed</span>
                </div>
                <div class="info-tags">
                    ${helpNeededTags.map(s => `<span class="info-tag help-tag">${escapeHtml(s)}</span>`).join('')}
                </div>
            </div>
            ` : ''}
            
            ${audienceTags.length > 0 ? `
            <div class="info-section">
                <div class="info-header">
                    <span class="meta-icon">👥</span>
                    <span class="meta-label">Seeking collaborators from</span>
                </div>
                <div class="info-tags">
                    ${audienceTags.map(a => `<span class="info-tag audience-tag">${escapeHtml(a)}</span>`).join('')}
                </div>
            </div>
            ` : ''}
            
            ${keywordsHtml}
            
            <div class="project-footer">
                <span class="contact-label">Contact:</span> <a href="mailto:${escapeHtml(grant.contact)}" class="contact-link">${escapeHtml(grant.contact)}</a>
                <span class="date-added">Added ${dateFormatted}</span>
            </div>
        </article>
    `;
}

function getStatusClass(status) {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('idea')) return 'status-idea';
    if (statusLower.includes('data')) return 'status-data';
    if (statusLower.includes('draft')) return 'status-draft';
    if (statusLower.includes('outline')) return 'status-outline';
    if (statusLower.includes('stalled')) return 'status-stalled';
    return '';
}

function updateResultsCount() {
    const label = activeTab === 'projects' ? 'projects' : 'grants';
    const items = activeTab === 'projects' ? allProjects : allGrants;
    const filtered = activeTab === 'projects' ? filteredProjects : filteredGrants;
    const total = items.length;
    const showing = filtered.length;
    
    if (showing === total) {
        elements.resultsCount.textContent = `Showing all ${total} ${label}`;
    } else {
        elements.resultsCount.textContent = `Showing ${showing} of ${total} ${label}`;
    }
    
    if (items.length > 0) {
        const timestamps = items.map(p => new Date(p.timestamp)).filter(d => !isNaN(d));
        if (timestamps.length > 0) {
            const mostRecent = new Date(Math.max(...timestamps));
            const formattedDate = mostRecent.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            elements.lastUpdated.textContent = `Last updated: ${formattedDate}`;
        }
    }
}

function populateDynamicFilters() {
    // Get unique type of paper values
    const typeOfPapers = [...new Set(allProjects.map(p => p.typeOfPaper).filter(t => t))].sort();
    typeOfPapers.forEach(t => {
        const option = document.createElement('option');
        option.value = t;
        option.textContent = t;
        elements.filterTypeOfPaper.appendChild(option);
    });
    
    // Get unique disciplines from both projects and grants
    const allItems = [...allProjects, ...allGrants];
    const disciplines = [...new Set(allItems.map(p => p.discipline).filter(d => d))].sort();
    disciplines.forEach(d => {
        const option = document.createElement('option');
        option.value = d;
        option.textContent = d;
        elements.filterDiscipline.appendChild(option);
    });
    
    // Get unique "help needed" values from both
    const helpNeededValues = new Set();
    allItems.forEach(p => {
        if (p.seeking) {
            p.seeking.split(',').forEach(s => helpNeededValues.add(s.trim()));
        }
    });
    [...helpNeededValues].sort().forEach(s => {
        const option = document.createElement('option');
        option.value = s;
        option.textContent = s;
        elements.filterSeeking.appendChild(option);
    });
    
    // Get unique "collaborator audience" values from both
    const audienceValues = new Set();
    allItems.forEach(p => {
        if (p.collaboratorAudience) {
            p.collaboratorAudience.split(',').forEach(a => audienceValues.add(a.trim()));
        }
    });
    [...audienceValues].sort().forEach(a => {
        const option = document.createElement('option');
        option.value = a;
        option.textContent = a;
        elements.filterCollaboratorAudience.appendChild(option);
    });
    
    // Get unique target funders from grants
    const funders = [...new Set(allGrants.map(g => g.targetFunder).filter(f => f))].sort();
    funders.forEach(f => {
        const option = document.createElement('option');
        option.value = f;
        option.textContent = f;
        elements.filterTargetFunder.appendChild(option);
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

function switchTab(tab) {
    activeTab = tab;
    
    // Update tab button styles
    elements.tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    
    // Toggle filter visibility
    elements.projectFilters.forEach(el => el.style.display = tab === 'projects' ? '' : 'none');
    elements.grantFilters.forEach(el => el.style.display = tab === 'grants' ? '' : 'none');
    
    // Update dynamic text
    if (tab === 'projects') {
        elements.subtitle.textContent = 'Dormant ideas and fallow data seeking collaborators';
        elements.search.placeholder = 'Search projects...';
        elements.submitLinkHeader.textContent = 'Submit a Project';
        elements.submitLinkHeader.href = CONFIG.FORM_URL;
    } else {
        elements.subtitle.textContent = 'Grant ideas and past applications seeking collaborators';
        elements.search.placeholder = 'Search grants...';
        elements.submitLinkHeader.textContent = 'Submit a Grant';
        elements.submitLinkHeader.href = CONFIG.GRANTS_FORM_URL || '#';
    }
    
    clearFilters();
}

function setupEventListeners() {
    // Tab switching
    elements.tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // Search with debounce
    let searchTimeout;
    elements.search.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(applyFilters, 300);
    });
    
    // Filter dropdowns
    elements.filterTypeOfPaper.addEventListener('change', applyFilters);
    elements.filterDiscipline.addEventListener('change', applyFilters);
    elements.filterStatus.addEventListener('change', applyFilters);
    elements.filterData.addEventListener('change', applyFilters);
    elements.filterSeeking.addEventListener('change', applyFilters);
    elements.filterCollaboratorAudience.addEventListener('change', applyFilters);
    elements.filterGrantType.addEventListener('change', applyFilters);
    elements.filterTargetFunder.addEventListener('change', applyFilters);
    
    // Clear filters button
    elements.clearFilters.addEventListener('click', clearFilters);
    
    // Set form URL
    elements.submitLinkHeader.href = CONFIG.FORM_URL;
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
        // Fetch projects (always available)
        allProjects = await fetchProjects();
        filteredProjects = [...allProjects];
        
        // Fetch grants (may not exist yet — fail gracefully)
        try {
            allGrants = await fetchGrants();
            filteredGrants = [...allGrants];
        } catch (e) {
            console.warn('Grants sheet not available yet:', e.message);
            allGrants = [];
            filteredGrants = [];
        }
        
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
