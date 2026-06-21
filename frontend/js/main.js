/* =============================================
   PORTFOLIO — main.js
   Handles: API calls, project rendering,
   contact form, nav scroll, filter, reveal
   ============================================= */

const API = '';  // same origin; change to http://localhost:3000 for dev if needed

/* ── NAVBAR SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

/* ── MOBILE BURGER ── */
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

/* ── REVEAL ON SCROLL ── */
const revealEls = document.querySelectorAll('.section, .project-card, .skill-group, .cert-item, .about-stats .stat');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.section > .container, .skill-group, .cert-item, .stat').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

/* ── PROJECTS ── */
let allProjects = [];
let activeFilter = 'all';

async function fetchProjects() {
  const grid = document.getElementById('projectsGrid');
  try {
    const res = await fetch(`${API}/api/projects`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    allProjects = json.data;
    renderProjects(allProjects);
  } catch (err) {
    grid.innerHTML = `<div class="loader">⚠️ Could not load projects. Is the server running?</div>`;
    console.error('Projects fetch error:', err);
  }
}

function renderProjects(projects) {
  const grid = document.getElementById('projectsGrid');
  const filtered = activeFilter === 'all' ? projects : projects.filter(p => p.category === activeFilter);

  if (!filtered.length) {
    grid.innerHTML = `<div class="loader">No projects in this category yet.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const techs = (p.tech_stack || '').split(',').map(t => `<span class="tech-chip">${t.trim()}</span>`).join('');
    const ghLink = p.github_url
      ? `<a href="${p.github_url}" target="_blank" class="project-link">
           <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
           GitHub
         </a>` : '';
    const liveLink = p.live_url
      ? `<a href="${p.live_url}" target="_blank" class="project-link">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
           Live
         </a>` : '';
    return `
      <div class="project-card reveal">
        <div class="project-card-top">
          <span class="project-category">${p.category || 'Project'}</span>
          ${p.featured ? '<span class="project-featured" title="Featured">⭐</span>' : ''}
        </div>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.description}</p>
        <div class="project-tech">${techs}</div>
        <div class="project-links">${ghLink}${liveLink}</div>
      </div>
    `;
  }).join('');

  // Re-observe new cards
  document.querySelectorAll('.project-card.reveal').forEach(el => {
    observer.observe(el);
  });
}

/* ── PROJECT FILTER ── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderProjects(allProjects);
  });
});

/* ── CONTACT FORM ── */
const sendBtn = document.getElementById('sendBtn');
const formMsg = document.getElementById('formMsg');

function showMsg(text, type) {
  formMsg.textContent = text;
  formMsg.className = `form-msg ${type}`;
}

sendBtn.addEventListener('click', async () => {
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    showMsg('Please fill in all fields.', 'error');
    return;
  }

  sendBtn.textContent = 'Sending...';
  sendBtn.disabled = true;

  try {
    const res = await fetch(`${API}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });
    const json = await res.json();

    if (json.success) {
      showMsg('✅ ' + json.message, 'success');
      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
      document.getElementById('message').value = '';
    } else {
      showMsg('❌ ' + json.error, 'error');
    }
  } catch (err) {
    showMsg('❌ Could not send message. Is the server running?', 'error');
  } finally {
    sendBtn.textContent = 'Send Message';
    sendBtn.disabled = false;
  }
});

/* ── SMOOTH ACTIVE NAV LINK ── */
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.getAttribute('id');
  });
  navLinkEls.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--text)' : '';
  });
});

/* ── INIT ── */
fetchProjects();
