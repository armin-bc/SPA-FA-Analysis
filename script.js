/**
 * BlueNova Bank Variance Assistant
 * Main JavaScript file for the SPA
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded');
  
  // Initialize page navigation
  initPageNavigation();
  
  // Initialize tool functionality
  initToolFunctionality();
  
  // Initialize language toggle
  initLanguageToggle();
  
  // Initialize FAQ items
  initFaqItems();
});

/**
 * Initialize simple page navigation
 */
function initPageNavigation() {
  console.log('Initializing page navigation');
  
  // Add click handlers to all navigation links
  const navLinks = document.querySelectorAll('.nav-link, .page-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetPageId = this.getAttribute('data-page');
      if (!targetPageId) {
        console.error('Navigation link missing data-page attribute');
        return;
      }
      
      // Update active nav link
      document.querySelectorAll('.nav-link').forEach(navLink => {
        navLink.classList.remove('active');
      });
      
      // Find and activate the corresponding nav link
      const correspondingNavLink = document.querySelector(`.nav-link[data-page="${targetPageId}"]`);
      if (correspondingNavLink) {
        correspondingNavLink.classList.add('active');
      }
      
      // Show the target page
      showPage(targetPageId);
      
      // Update URL hash (without causing another navigation)
      const hash = this.getAttribute('href');
      window.history.pushState(null, '', hash);
    });
  });
  
  // Handle browser back/forward navigation
  window.addEventListener('popstate', function() {
    handleHashChange();
  });
  
  // Initial navigation based on URL hash
  handleHashChange();
}

/**
 * Handle hash change for page navigation
 */
function handleHashChange() {
  console.log('Handling hash change:', window.location.hash);
  
  let hash = window.location.hash;
  if (!hash) {
    hash = '#home'; // Default page
  }
  
  // Remove the hash symbol
  hash = hash.substring(1);
  
  // Map hash to page ID
  let pageId;
  switch (hash) {
    case 'home':
      pageId = 'homePage';
      break;
    case 'how-to':
      pageId = 'howToPage';
      break;
    case 'testimonials':
      pageId = 'testimonialsPage';
      break;
    case 'tool':
      pageId = 'toolPage';
      break;
    default:
      pageId = 'homePage'; // Default to home for unknown hashes
  }
  
  // Update active nav link
  document.querySelectorAll('.nav-link').forEach(navLink => {
    navLink.classList.remove('active');
  });
  
  const activeNavLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
  if (activeNavLink) {
    activeNavLink.classList.add('active');
  }
  
  // Show the page
  showPage(pageId);
}

/**
 * Show a specific page and hide others
 */
function showPage(pageId) {
  console.log('Showing page:', pageId);
  
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  // Show the target page
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
    
    // If showing the tool page, reset to first step
    if (pageId === 'toolPage') {
      showToolStep(0);
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
  } else {
    console.error('Page not found:', pageId);
  }
}

/**
 * Initialize language toggle functionality
 */
function initLanguageToggle() {
  const langToggle = document.getElementById('languageToggle');
  const langLabel = document.querySelector('.lang-label');
  
  if (langToggle && langLabel) {
    langToggle.addEventListener('click', function() {
      const currentLang = langLabel.textContent;
      langLabel.textContent = currentLang === 'DE' ? 'EN' : 'DE';
      console.log('Language switched to:', langLabel.textContent);
    });
  }
}

/**
 * Initialize FAQ item toggles
 */
function initFaqItems() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      const isVisible = answer.style.display === 'block';
      
      if (isVisible) {
        answer.style.display = 'none';
        this.classList.remove('active');
        this.setAttribute('aria-expanded', 'false');
      } else {
        answer.style.display = 'block';
        this.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
      }
    });
    
    // Hide answers initially
    const answer = question.nextElementSibling;
    answer.style.display = 'none';
    question.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Initialize all tool functionality
 */
function initToolFunctionality() {
  console.log('Initializing tool functionality');
  
  let currentToolStep = 0;
  let selectedSegment = null;
  let selectedKPIs = new Set();
  
  // Step indicators click handling
  const stepIndicators = document.querySelectorAll('.step[data-tool-step]');
  stepIndicators.forEach(indicator => {
    indicator.addEventListener('click', function() {
      const stepIndex = parseInt(this.getAttribute('data-tool-step'));
      showToolStep(stepIndex);
    });
  });
  
  // Next/Previous button handling
  const nextButtons = document.querySelectorAll('.next-step-button');
  nextButtons.forEach(button => {
    button.addEventListener('click', function() {
      nextToolStep();
    });
  });
  
  const prevButtons = document.querySelectorAll('.prev-step-button');
  prevButtons.forEach(button => {
    button.addEventListener('click', function() {
      prevToolStep();
    });
  });
  
  // Download result button
  const downloadBtn = document.getElementById('downloadResultBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function() {
      downloadResult();
    });
  }
  
  // Step 1 segment selection
  const step1Options = document.querySelectorAll('#step1 .option');
  step1Options.forEach(option => {
    option.addEventListener('click', function() {
      // Handle deselection
      if (this.classList.contains('selected')) {
        this.classList.remove('selected');
        selectedSegment = null;
        document.getElementById('step1Next').disabled = true;
        return;
      }
      
      // Handle selection
      step1Options.forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
      selectedSegment = this.textContent;
      document.getElementById('step1Next').disabled = false;
      
      // Clear any validation messages
      document.getElementById('step1ValidationMsg').textContent = '';
    });
  });
  
  // Step 1 Next button validation
  const step1Next = document.getElementById('step1Next');
  if (step1Next) {
    step1Next.addEventListener('click', function() {
      if (!selectedSegment) {
        document.getElementById('step1ValidationMsg').textContent = 'Bitte wählen Sie ein Segment aus.';
        return;
      }
      
      nextToolStep();
    });
  }
  
  // Step 2 KPI selection
  const step2Options = document.querySelectorAll('#step2 .option');
  step2Options.forEach(option => {
    option.addEventListener('click', function() {
      const kpiName = this.textContent;
      this.classList.toggle('selected');
      
      if (this.classList.contains('selected')) {
        selectedKPIs.add(kpiName);
      } else {
        selectedKPIs.delete(kpiName);
      }
      
      updateKpiCounter();
      document.getElementById('step2Next').disabled = selectedKPIs.size === 0;
      
      // Clear any validation messages
      document.getElementById('step2ValidationMsg').textContent = '';
    });
  });
  
  // Step 2 Next button validation
  const step2Next = document.getElementById('step2Next');
  if (step2Next) {
    step2Next.addEventListener('click', function() {
      if (selectedKPIs.size === 0) {
        document.getElementById('step2ValidationMsg').textContent = 'Bitte wählen Sie mindestens eine KPI aus.';
        return;
      }
      
      nextToolStep();
    });
  }
  
  // Dropzone functionality
  const dropzones = document.querySelectorAll('.dropzone');
  dropzones.forEach(dropzone => {
    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, function(e) {
        e.preventDefault();
        this.classList.add('dragover');
      });
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
      });
    });
    
    // File input change
    const fileInput = dropzone.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.addEventListener('change', function() {
        const fileCount = this.files.length;
        console.log(`${fileCount} files selected`);
        
        // Update dropzone appearance to show file count
        const dropzoneText = this.parentElement.querySelector('p');
        if (dropzoneText && fileCount > 0) {
          const originalText = dropzoneText.getAttribute('data-original-text') || dropzoneText.textContent;
          
          if (!dropzoneText.getAttribute('data-original-text')) {
            dropzoneText.setAttribute('data-original-text', originalText);
          }
          
          dropzoneText.textContent = `${fileCount} ${fileCount === 1 ? 'Datei' : 'Dateien'} ausgewählt`;
        } else if (dropzoneText) {
          const originalText = dropzoneText.getAttribute('data-original-text');
          if (originalText) {
            dropzoneText.textContent = originalText;
          }
        }
      });
    }
  });
  
  /**
   * Show a specific tool step
   */
  function showToolStep(stepIndex) {
    console.log('Showing tool step:', stepIndex);
    
    // Update step indicators
    stepIndicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === stepIndex);
    });
    
    // Show the correct form step
    const formSteps = document.querySelectorAll('.form-step');
    formSteps.forEach((step, index) => {
      step.classList.toggle('active', index === stepIndex);
    });
    
    currentToolStep = stepIndex;
  }
  
  /**
   * Move to the next tool step
   */
  function nextToolStep() {
    if (currentToolStep < 3) {
      showToolStep(currentToolStep + 1);
    }
  }
  
  /**
   * Move to the previous tool step
   */
  function prevToolStep() {
    if (currentToolStep > 0) {
      showToolStep(currentToolStep - 1);
    }
  }
  
  /**
   * Update KPI counter display
   */
  function updateKpiCounter() {
    const count = selectedKPIs.size;
    const countDisplay = document.getElementById('kpiCount');
    
    if (countDisplay) {
      if (count === 1) {
        countDisplay.textContent = 'eine KPI ausgewählt';
      } else {
        countDisplay.textContent = `${count} KPIs ausgewählt`;
      }
    }
  }
  
  /**
   * Handle result download
   */
  function downloadResult() {
    console.log('Downloading result');
    
    const content = `BlueNova Bank Variance Analysis Results
Segment: ${selectedSegment || 'Not selected'}
KPIs: ${Array.from(selectedKPIs).join(', ') || 'None selected'}
Date: ${new Date().toLocaleDateString()}

This is a placeholder for actual analysis results.
In a production environment, this would contain the full variance analysis report.`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'variance-analysis-results.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
