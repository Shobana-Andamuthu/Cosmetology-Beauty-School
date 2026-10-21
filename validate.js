const fs = require('fs');

const pages = [
  'index.html',
  'home-2.html',
  'programs.html',
  'instructors.html',
  'about.html',
  'contact.html',
  'dashboard.html',
  'login.html',
  'register.html'
];

let hasErrors = false;

pages.forEach(file => {
  if (!fs.existsSync(file)) {
    console.error('MISSING FILE:', file);
    hasErrors = true;
    return;
  }
  const content = fs.readFileSync(file, 'utf8');

  // Check referenced images
  const regex = /src=["'](assets\/images\/[^"']+)["']/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const imgPath = match[1];
    if (!fs.existsSync(imgPath)) {
      console.error(file + ': Missing image -> ' + imgPath);
      hasErrors = true;
    }
  }

  // Check section count for main content pages
  if (file !== 'login.html' && file !== 'register.html') {
    let sectionCount = 0;
    if (file === 'dashboard.html') {
      const m = content.match(/<section class="dash-section"/g);
      sectionCount = m ? m.length : 0;
    } else {
      const m = content.match(/<section class="[^"]*"/g);
      sectionCount = m ? m.length : 0;
    }
    console.log(file + ' -> Section count: ' + sectionCount);
    if (sectionCount !== 6) {
      console.error(file + ' ERROR: Expected exactly 6 sections, got ' + sectionCount);
      hasErrors = true;
    }
  }

  // Check RTL toggle & Theme toggle presence on public pages with nav
  if (file !== 'login.html' && file !== 'register.html') {
    if (!content.includes('rtl-toggle')) {
      console.error(file + ' ERROR: Missing rtl-toggle');
      hasErrors = true;
    }
    if (!content.includes('theme-toggle')) {
      console.error(file + ' ERROR: Missing theme-toggle');
      hasErrors = true;
    }
    if (!content.includes('dashboard.html')) {
      console.error(file + ' ERROR: Missing dashboard link in nav');
      hasErrors = true;
    }
  }
});

console.log('=== Validation Complete ===');
console.log('Has errors:', hasErrors);
process.exit(hasErrors ? 1 : 0);
