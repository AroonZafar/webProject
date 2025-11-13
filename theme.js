/*
  Theme Toggle Script
  - Reads 'theme' from localStorage (defaults to 'dark')
  - Toggles between 'light' and 'dark' modes
  - Applies 'light' class to <html> when in light mode
  - Persists preference to localStorage
  - Smooth transitions between themes
*/

(function initTheme() {
  const html = document.documentElement;
  
  // Load theme from localStorage or default to 'dark'
  let theme = localStorage.getItem('theme') || 'dark';
  
  // Apply saved theme on page load
  applyTheme(theme);

  function applyTheme(newTheme) {
    theme = newTheme;
    
    if (theme === 'light') {
      html.classList.add('light');
    } else {
      html.classList.remove('light');
    }
    
    localStorage.setItem('theme', theme);
    
    // Update toggle button icon
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.innerHTML = theme === 'dark' 
        ? '☀️'
        : '🌙';
    }
  }

  function toggleTheme() {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  }

  function setupThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (btn) {
      // Set initial icon
      btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      // Wire click event
      btn.addEventListener('click', toggleTheme);
    }
  }

  // Try to setup button immediately
  setTimeout(setupThemeToggle, 0);
  
  // Also wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupThemeToggle);
  } else {
    setupThemeToggle();
  }

  // Expose globally for debugging
  window.toggleTheme = toggleTheme;
  window.getCurrentTheme = () => theme;
})();

// Light mode styles (added to document when 'light' class is on <html>)
const styleLight = document.createElement('style');
styleLight.textContent = `
  html.light {
    color-scheme: light;
  }
  
  html.light body {
    background-color: #f3f4f6;
    color: #1f2937;
  }
  
  html.light .bg-gray-900 {
    background-color: #ffffff;
  }
  
  html.light .bg-gray-800 {
    background-color: #e5e7eb;
  }
  
  html.light .bg-gray-700 {
    background-color: #d1d5db;
  }
  
  html.light .bg-gray-950 {
    background-color: #f9fafb;
  }
  
  html.light .text-gray-100 {
    color: #1f2937;
  }
  
  html.light .text-gray-300 {
    color: #4b5563;
  }
  
  html.light .text-gray-400 {
    color: #6b7280;
  }
  
  html.light .border-gray-700 {
    border-color: #d1d5db;
  }
  
  html.light .border-gray-800 {
    border-color: #e5e7eb;
  }
  
  html.light .bg-gradient-to-r {
    background: linear-gradient(to right, #3b82f6, #1e40af);
  }
  
  html.light .bg-blue-600 {
    background-color: #2563eb;
  }
  
  html.light .bg-blue-800 {
    background-color: #1e40af;
  }
  
  /* Theme toggle button styling */
  .theme-toggle {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.375rem;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  
  .theme-toggle:hover {
    background-color: rgba(59, 130, 246, 0.1);
    transform: rotate(20deg);
  }
  
  .theme-toggle-wrapper {
    display: inline-block;
    margin-left: 1rem;
  }
`;
document.head.appendChild(styleLight);
