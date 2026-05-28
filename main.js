// main.js
// Handles theme toggle, loads notebook for problem statement, loads CSV data, and renders Plotly charts.

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  setTheme(next);
}
if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
  // Initialize from stored preference
  const stored = localStorage.getItem('theme');
  if (stored) setTheme(stored);
}

// Load problem statement from the notebook (markdown cell containing "Problem")
async function loadProblemStatement() {
  try {
    const txtResponse = await fetch('pdf_text.txt');
    const txtData = await txtResponse.text();
    // Extract lines containing the executive summary (lines 75-83 in the original text)
    const lines = txtData.split(/\r?\n/);
    const summaryLines = lines.filter(line => line.match(/Executive  Summary|project analyzes the sales performance|Two core business problems were|low average basket size|significant variability/));
    const problemText = summaryLines.join(' ');
    document.getElementById('problem-text').innerHTML = problemText || 'Problem statement not found.';
  } catch (e) {
    console.error('Failed to load problem statement:', e);
    document.getElementById('problem-text').innerHTML = 'Error loading problem statement.';
  }
}

// Load CSV data and render Plotly charts
async function loadDataAndRender() {
  // Using D3 to fetch CSV
  const csvUrl = 'bakery_sales_revised.csv';
  const data = await d3.csv(csvUrl, d => {
    // Parse numeric fields if needed
    return {
      Transaction: +d.Transaction,
      Item: d.Item,
      date_time: d.date_time,
      period_day: d.period_day,
      weekday_weekend: d.weekday_weekend,
    };
  });

  // Example chart: Top 10 items by count
  const itemCounts = d3.rollup(data, v => v.length, d => d.Item);
  const sorted = Array.from(itemCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const items = sorted.map(d => d[0]);
  const counts = sorted.map(d => d[1]);

  const trace = {
    x: items,
    y: counts,
    type: 'bar',
    marker: { color: '#1967D2' }
  };
  const layout = {
    title: 'Top 10 Sold Items',
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: getComputedStyle(document.body).color }
  };
  Plotly.newPlot('chartContainer', [trace], layout, { responsive: true });
    // Basket size distribution chart
    const basketCounts = d3.rollup(data, v => v.length, d => d.Basket_Size);
    const basketSorted = Array.from(basketCounts.entries()).sort((a,b)=>a[0]-b[0]);
    const basketX = basketSorted.map(d=>`Size ${d[0]}`);
    const basketY = basketSorted.map(d=>d[1]);
    const basketTrace = { x: basketX, y: basketY, type: 'bar', marker: {color: '#4A90E2'} };
    const basketLayout = {title: 'Basket Size Distribution', paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: {color: getComputedStyle(document.body).color}};
    Plotly.addTraces('chartContainer', basketTrace);
    Plotly.relayout('chartContainer', basketLayout);
}

// GSAP entry animation
function animateEntrance() {
  gsap.from('.hero-section', { opacity: 0, y: -50, duration: 1, ease: 'power2.out' });
  gsap.from('.problem-section', { opacity: 0, x: -50, duration: 0.8, delay: 0.3, ease: 'power2.out' });
  gsap.from('.charts-section', { opacity: 0, y: 50, duration: 0.8, delay: 0.5, ease: 'power2.out' });
}

// Initialize all
(async function init() {
  await loadProblemStatement();
  await loadDataAndRender();
  animateEntrance();
})();
// Theme handling
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  const toggleBtn = document.getElementById('themeToggle');
  if (toggleBtn) {
    toggleBtn.textContent = savedTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const newTheme = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  const toggleBtn = document.getElementById('themeToggle');
  if (toggleBtn) {
    toggleBtn.textContent = newTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }
}

// Attach event listener for theme toggle button
document.getElementById('themeToggle').addEventListener('click', toggleTheme);

// Initialize theme on load
initTheme();
