/* ==========================================================================
   NEXUS CODEX - Main Interactive Application Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeroCanvas();
  initThemeToggle();
  initNavbarScroll();
  initTechStackFilters();
  initCostEstimator();
  initTerminalDemo();
  initCaseStudyModal();
  initChatWidget();
  initContactForm();
});

/* --------------------------------------------------------------------------
   1. Interactive Canvas Particle Matrix Background
   -------------------------------------------------------------------------- */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 150 };

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    createParticles();
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((width * height) / 14000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? '#00f2fe' : '#7f00ff'
      });
    }
  }

  window.addEventListener('resize', resize);
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw particles & links
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Draw particle dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Connect near particles
      for (let j = i + 1; j < particles.length; j++) {
        let p2 = particles[j];
        let dx = p.x - p2.x;
        let dy = p.y - p2.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${1 - dist / 110 * 0.8})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Mouse interactive links
      if (mouse.x !== null) {
        let mdx = p.x - mouse.x;
        let mdy = p.y - mouse.y;
        let mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < mouse.radius) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${1 - mdist / mouse.radius})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  resize();
  animate();
}

/* --------------------------------------------------------------------------
   2. Theme Switcher (Dark / Light)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('nexus-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  toggleBtn.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nexus-theme', theme);
    updateThemeIcon(theme);
  });

  function updateThemeIcon(theme) {
    toggleBtn.innerHTML = theme === 'dark' 
      ? '<i class="fa-solid fa-sun"></i>' 
      : '<i class="fa-solid fa-moon"></i>';
  }
}

/* --------------------------------------------------------------------------
   3. Navbar Scroll Effect
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* --------------------------------------------------------------------------
   4. Tech Stack Filtering
   -------------------------------------------------------------------------- */
function initTechStackFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const techCards = document.querySelectorAll('.tech-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      techCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. Interactive AI Project Cost Estimator
   -------------------------------------------------------------------------- */
function initCostEstimator() {
  const groups = ['#opt-scope', '#opt-model', '#opt-infra'];
  const priceEl = document.getElementById('calc-price');
  const timeEl = document.getElementById('calc-time');

  groups.forEach(groupId => {
    const container = document.querySelector(groupId);
    if (!container) return;

    const cards = container.querySelectorAll('.option-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        calculateTotal();
      });
    });
  });

  function calculateTotal() {
    let totalCost = 0;
    let totalWeeks = 0;

    const selectedCards = document.querySelectorAll('.option-card.selected');
    selectedCards.forEach(card => {
      totalCost += parseInt(card.getAttribute('data-cost')) || 0;
      totalWeeks += parseInt(card.getAttribute('data-weeks')) || 0;
    });

    animateValue(priceEl, totalCost);
    timeEl.innerHTML = `<i class="fa-regular fa-clock"></i> Estimated Timeline: ${totalWeeks} Weeks`;
  }

  function animateValue(element, end) {
    const start = parseInt(element.textContent.replace(/[^0-9]/g, '')) || 0;
    const duration = 400;
    let startTimestamp = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = Math.floor(progress * (end - start) + start);
      element.textContent = '$' + current.toLocaleString();
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
}

/* --------------------------------------------------------------------------
   6. Live Terminal Code Integration
   -------------------------------------------------------------------------- */
function initTerminalDemo() {
  const tabBtns = document.querySelectorAll('.terminal-tabs .tab-btn');
  const codeEl = document.querySelector('#code-content code');
  const runBtn = document.getElementById('run-code-btn');
  const outputEl = document.getElementById('terminal-output');

  const snippets = {
    python: `<span style="color:#7f00ff">from</span> nexus_codex <span style="color:#7f00ff">import</span> NexusAIClient, AgentWorkflow

<span style="color:#64748b"># Initialize Nexus AI Agent Client</span>
client = NexusAIClient(api_key=<span style="color:#00f5d4">"nx_live_99f2a01d"</span>)

<span style="color:#64748b"># Execute Enterprise RAG Query</span>
response = client.rag.query(
    knowledge_base_id=<span style="color:#00f5d4">"engineering-docs"</span>,
    prompt=<span style="color:#00f5d4">"Summarize microservice security protocols"</span>,
    temperature=<span style="color:#00f2fe">0.2</span>
)

<span style="color:#7f00ff">print</span>(f<span style="color:#00f5d4">"[SUCCESS] Retrieved Answer: {response.answer}"</span>)
<span style="color:#7f00ff">print</span>(f<span style="color:#00f5d4">"[METRIC] Search Latency: {response.latency_ms}ms"</span>)`,

    typescript: `<span style="color:#7f00ff">import</span> { NexusAgent } <span style="color:#7f00ff">from</span> <span style="color:#00f5d4">'@nexus-codex/ai-sdk'</span>;

<span style="color:#7f00ff">const</span> agent = <span style="color:#7f00ff">new</span> NexusAgent({
  apiKey: process.env.NEXUS_API_KEY,
  model: <span style="color:#00f5d4">'gpt-4o-nexus-v2'</span>
});

<span style="color:#7f00ff">async function</span> runAgentTask() {
  <span style="color:#7f00ff">const</span> result = <span style="color:#7f00ff">await</span> agent.executeTask({
    goal: <span style="color:#00f5d4">'Audit WebGL performance bottlenecks'</span>,
    streaming: <span style="color:#00f2fe">true</span>
  });
  console.log(<span style="color:#00f5d4">'[AGENT COMPLETE]:'</span>, result.summary);
}`,

    curl: `<span style="color:#64748b"># Execute Query via HTTP REST API</span>
curl -X POST https://api.nexuscodex.ai/v1/rag/query \\
  -H <span style="color:#00f5d4">"Authorization: Bearer nx_live_99f2a01d"</span> \\
  -H <span style="color:#00f5d4">"Content-Type: application/json"</span> \\
  -d <span style="color:#00f5d4">'{
    "kb_id": "engineering-docs",
    "prompt": "Summarize microservice security protocols"
  }'</span>`
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const lang = btn.getAttribute('data-lang');
      codeEl.innerHTML = snippets[lang] || snippets.python;
      outputEl.style.display = 'none';
    });
  });

  if (runBtn) {
    runBtn.addEventListener('click', () => {
      outputEl.style.display = 'block';
      outputEl.style.opacity = '0';
      setTimeout(() => { outputEl.style.opacity = '1'; }, 50);
    });
  }
}

/* --------------------------------------------------------------------------
   7. Case Study Modal Launcher
   -------------------------------------------------------------------------- */
function initCaseStudyModal() {
  const modal = document.getElementById('case-study-modal');
  const closeBtn = document.getElementById('close-modal-btn');
  const modalContent = document.getElementById('modal-content');
  const openBtns = document.querySelectorAll('.open-modal-btn');

  const caseData = {
    1: {
      title: 'Nexus AI Enterprise Studio',
      category: 'Generative AI Platform',
      image: 'assets/hero.jpg',
      description: 'An all-in-one AI platform engineered for enterprise teams to deploy autonomous AI agents, fine-tune models, and manage API token budgets.',
      architecture: ['Next.js 14 Web App', 'OpenAI GPT-4o API', 'LangChain Workflow Orchestration', 'PostgreSQL & Redis Cache'],
      results: ['+450% Boost in Team Productivity', 'Sub-20ms Agent Task Scheduling', '$1.2M Saved in Annual SaaS Expenses']
    },
    2: {
      title: 'CogniSearch Enterprise Knowledge Engine',
      category: 'RAG Search Engine',
      image: 'assets/rag.jpg',
      description: 'Enterprise-grade vector search system indexing over 10 million technical files, PDF specs, and customer support logs with zero hallucination guarantee.',
      architecture: ['Qdrant High-Scale Vector Database', 'FastAPI Microservice Backend', 'Python Async Pipeline', 'Tailwind & React UI'],
      results: ['99.4% Semantic Precision', '14ms Search Latency SLA', 'Fully SOC2 & HIPAA Compliant']
    },
    3: {
      title: 'OmniData AI Vision Inspection System',
      category: 'Computer Vision',
      image: 'assets/vision.jpg',
      description: 'High-throughput computer vision edge system for industrial automated quality assurance and real-time defect detection.',
      architecture: ['YOLOv8 & TensorRT Acceleration', 'PyTorch ML Pipeline', 'WebSocket Real-Time Telemetry', 'WebGL Canvas Dashboard'],
      results: ['99.9% Defect Detection Accuracy', '<15ms Processing Time Per Frame', '300 FPS Multi-Stream Video Ingestion']
    },
    4: {
      title: 'SynthFlow Visual AI Agent Builder',
      category: 'Agentic SaaS',
      image: 'assets/builder.jpg',
      description: 'A visual drag-and-drop web application empowering non-developers to build, test, and publish custom AI agent workflows.',
      architecture: ['ReactFlow Interactive Canvas', 'TypeScript & Node.js', 'FastAPI Execution Engine', 'Redis Task Queue'],
      results: ['Over 50,000 AI Workflows Run', 'Zero-Code Deployment Engine', '4.9/5 User Rating']
    }
  };

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const item = caseData[id];
      if (!item) return;

      modalContent.innerHTML = `
        <div style="margin-bottom:20px;">
          <span class="portfolio-overlay" style="position:static; display:inline-block; margin-bottom:12px;">${item.category}</span>
          <h2 style="font-size:2rem; margin-bottom:12px;">${item.title}</h2>
          <p style="color:var(--text-secondary);">${item.description}</p>
        </div>

        <div style="width:100%; height:320px; border-radius:16px; overflow:hidden; margin-bottom:24px;">
          <img src="${item.image}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover;">
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-bottom:32px;">
          <div style="background:var(--bg-primary); padding:20px; border-radius:12px; border:1px solid var(--border-color);">
            <h4 style="font-size:1.1rem; margin-bottom:12px; color:var(--accent-cyan);"><i class="fa-solid fa-code-branch"></i> Technology Stack</h4>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:8px; font-size:0.9rem; color:var(--text-secondary);">
              ${item.architecture.map(a => `<li><i class="fa-solid fa-check" style="color:var(--accent-teal);"></i> ${a}</li>`).join('')}
            </ul>
          </div>

          <div style="background:var(--bg-primary); padding:20px; border-radius:12px; border:1px solid var(--border-color);">
            <h4 style="font-size:1.1rem; margin-bottom:12px; color:var(--accent-teal);"><i class="fa-solid fa-chart-line"></i> Verified Outcomes</h4>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:8px; font-size:0.9rem; color:var(--text-secondary);">
              ${item.results.map(r => `<li><i class="fa-solid fa-star" style="color:var(--accent-cyan);"></i> ${r}</li>`).join('')}
            </ul>
          </div>
        </div>

        <div style="text-align:right;">
          <a href="#contact" class="btn btn-primary" onclick="document.getElementById('case-study-modal').classList.remove('open')">Schedule Project Discovery</a>
        </div>
      `;

      modal.classList.add('open');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.remove('open'));
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }
}

/* --------------------------------------------------------------------------
   8. Floating AI Assistant Chatbot
   -------------------------------------------------------------------------- */
function initChatWidget() {
  const toggleBtn = document.getElementById('chat-widget-toggle');
  const chatBox = document.getElementById('chat-box');
  const closeBtn = document.getElementById('close-chat');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');

  if (!toggleBtn || !chatBox) return;

  toggleBtn.addEventListener('click', () => {
    chatBox.classList.toggle('open');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => chatBox.classList.remove('open'));
  }

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    // Append user message
    appendMessage(text, 'user');
    chatInput.value = '';

    // Generate intelligent bot response simulation
    setTimeout(() => {
      const botResponse = generateBotResponse(text);
      appendMessage(botResponse, 'bot');
    }, 600);
  });

  function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function generateBotResponse(input) {
    const q = input.toLowerCase();
    if (q.includes('cost') || q.includes('price') || q.includes('quote')) {
      return "Our typical AI project sprints start around $25,000 for enterprise RAG setups and custom web apps. Try our interactive Cost Estimator section on this page for an instant calculation!";
    } else if (q.includes('stack') || q.includes('technology') || q.includes('python')) {
      return "We build with Python, FastAPI, PyTorch, OpenAI, Claude 3.5, React, Next.js, and Vector DBs like Qdrant & Pinecone. What tech stack does your team prefer?";
    } else if (q.includes('contact') || q.includes('call') || q.includes('meeting')) {
      return "You can book a 30-minute discovery call directly via the contact form on this page, or email our lead team at engineering@nexuscodex.ai!";
    } else {
      return "Thank you for reaching out! Nexus CODEX specializes in Generative AI Products, Enterprise RAG Search, and Intelligent Web SaaS. Would you like to schedule a discovery call with our engineering leads?";
    }
  }
}

/* --------------------------------------------------------------------------
   9. Contact Form Handler
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('main-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Submitting Request...`;
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Consult Scheduled Successfully!`;
      btn.style.background = '#00f5d4';
      btn.style.color = '#070a12';
      form.reset();

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.style.background = '';
        btn.style.color = '';
      }, 5000);
    }, 1200);
  });
}
