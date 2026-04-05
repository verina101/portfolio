(function () {
  "use strict";

  // ========================================
  // 1. Particle Background (Canvas)
  // ========================================
  var canvas = document.getElementById("particle-canvas");
  var ctx = canvas.getContext("2d");
  var particles = [];
  var mouse = { x: null, y: null };
  var PARTICLE_COUNT = 60;
  var CONNECTION_DIST = 150;
  var MOUSE_DIST = 200;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  document.addEventListener("mousemove", function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function Particle() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = Math.random() * 2 + 0.5;
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

    // Mouse repulsion
    if (mouse.x !== null) {
      var dx = this.x - mouse.x;
      var dy = this.y - mouse.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_DIST) {
        var force = (MOUSE_DIST - dist) / MOUSE_DIST;
        this.vx += (dx / dist) * force * 0.3;
        this.vy += (dy / dist) * force * 0.3;
      }
    }

    // Speed damping
    this.vx *= 0.99;
    this.vy *= 0.99;
  };

  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(100, 255, 218, 0.4)";
    ctx.fill();
  };

  for (var i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var a = 0; a < particles.length; a++) {
      particles[a].update();
      particles[a].draw();

      for (var b = a + 1; b < particles.length; b++) {
        var dx = particles[a].x - particles[b].x;
        var dy = particles[a].y - particles[b].y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.strokeStyle = "rgba(100, 255, 218, " + (1 - dist / CONNECTION_DIST) * 0.15 + ")";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ========================================
  // 2. Typewriter Effect
  // ========================================
  var typewriterEl = document.getElementById("typewriter");
  var text = "hi, verina here.";
  var charIndex = 0;

  function typeChar() {
    if (charIndex < text.length) {
      // Remove existing cursor
      var existingCursor = typewriterEl.querySelector(".cursor");
      if (existingCursor) existingCursor.remove();

      typewriterEl.insertAdjacentText("beforeend", text.charAt(charIndex));
      charIndex++;

      // Add cursor back
      var cursor = document.createElement("span");
      cursor.className = "cursor";
      typewriterEl.appendChild(cursor);

      setTimeout(typeChar, 80 + Math.random() * 60);
    }
  }

  // Start typewriter after a small delay
  setTimeout(typeChar, 600);

  // ========================================
  // 3. Fade-In on Scroll (IntersectionObserver)
  // ========================================
  var fadeElements = document.querySelectorAll(".fade-in");

  var fadeObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = entry.target.getAttribute("data-delay") || 0;
          setTimeout(function () {
            entry.target.classList.add("visible");
          }, parseInt(delay, 10));
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  fadeElements.forEach(function (el) {
    fadeObserver.observe(el);
  });

  // ========================================
  // 4. Sidebar Active Link Tracking
  // ========================================
  var sections = document.querySelectorAll(".section[id]");
  var sidebarLinks = document.querySelectorAll(".sidebar-link");

  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          sidebarLinks.forEach(function (link) {
            link.classList.remove("active");
            if (link.getAttribute("data-section") === id) {
              link.classList.add("active");
            }
          });
        }
      });
    },
    { threshold: 0.3, rootMargin: "-10% 0px -60% 0px" }
  );

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  // ========================================
  // 5. Experience Tabs
  // ========================================
  var tabButtons = document.querySelectorAll(".tab-btn");
  var tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var tab = this.getAttribute("data-tab");

      tabButtons.forEach(function (b) { b.classList.remove("active"); });
      tabPanels.forEach(function (p) { p.classList.remove("active"); });

      this.classList.add("active");
      document.getElementById("panel-" + tab).classList.add("active");
    });
  });

  // ========================================
  // 6. Skill Bars Animation
  // ========================================
  var skillFills = document.querySelectorAll(".skill-fill");
  var skillsAnimated = false;

  var skillsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !skillsAnimated) {
          skillsAnimated = true;
          skillFills.forEach(function (fill, index) {
            setTimeout(function () {
              fill.style.width = fill.getAttribute("data-width") + "%";
            }, index * 100);
          });
        }
      });
    },
    { threshold: 0.2 }
  );

  var skillsSection = document.querySelector(".skills-container");
  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }

  // ========================================
  // 7. Number Counter Animation (CP Ranks)
  // ========================================
  var cpRanks = document.querySelectorAll(".cp-rank[data-target]");
  var countersAnimated = false;

  var counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          cpRanks.forEach(function (rank) {
            var target = parseInt(rank.getAttribute("data-target"), 10);
            var current = 0;
            var duration = 1500;
            var stepTime = duration / target;

            var counter = setInterval(function () {
              current++;
              rank.textContent = current;
              if (current >= target) {
                clearInterval(counter);
                rank.textContent = target;
              }
            }, stepTime);
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  var cpSection = document.querySelector(".cp-section");
  if (cpSection) {
    counterObserver.observe(cpSection);
  }

  // ========================================
  // 8. Mobile Navigation
  // ========================================
  var mobileToggle = document.getElementById("mobile-nav-toggle");
  var sidebar = document.getElementById("sidebar");

  mobileToggle.addEventListener("click", function () {
    mobileToggle.classList.toggle("open");
    sidebar.classList.toggle("open");
    document.body.style.overflow = sidebar.classList.contains("open") ? "hidden" : "";
  });

  // Close mobile nav on link click
  sidebarLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 768) {
        mobileToggle.classList.remove("open");
        sidebar.classList.remove("open");
        document.body.style.overflow = "";
      }
    });
  });

  // ========================================
  // 9. Smooth scroll for sidebar links
  // ========================================
  sidebarLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var targetId = this.getAttribute("href").substring(1);
      var targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

})();
