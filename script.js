(() => {
  const CA = "0x282baf42b2a50bffd00d0b8755146d2ebb8a957b";
  const toast = document.getElementById("toast");
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const cursorGlow = document.getElementById("cursorGlow");
  const canvas = document.getElementById("stars");
  const ctx = canvas.getContext("2d");

  /* ---------- toast / copy ---------- */
  function showToast(msg = "Copied!") {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 1600);
  }

  async function copyCA() {
    try {
      await navigator.clipboard.writeText(CA);
      showToast("CA copied");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = CA;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      showToast("CA copied");
    }
  }

  document.getElementById("copyCa")?.addEventListener("click", copyCA);
  document.getElementById("copyCaHero")?.addEventListener("click", copyCA);

  /* ---------- nav ---------- */
  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  navToggle?.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
  });

  mobileMenu?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => mobileMenu.classList.remove("open"));
  });

  /* ---------- cursor glow ---------- */
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let cx = mx;
  let cy = my;

  window.addEventListener(
    "mousemove",
    (e) => {
      mx = e.clientX;
      my = e.clientY;
      const hot = e.target.closest("a, button, .tilt, .btn");
      cursorGlow?.classList.toggle("hot", Boolean(hot));
    },
    { passive: true }
  );

  function tickCursor() {
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    if (cursorGlow) {
      cursorGlow.style.left = `${cx}px`;
      cursorGlow.style.top = `${cy}px`;
    }
    requestAnimationFrame(tickCursor);
  }
  tickCursor();

  /* ---------- starfield ---------- */
  let stars = [];
  let w = 0;
  let h = 0;
  let dpr = 1;

  function resizeStars() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = Array.from({ length: Math.floor((w * h) / 14000) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 0.8 + 0.2,
      r: Math.random() * 1.6 + 0.3,
      tw: Math.random() * Math.PI * 2,
    }));
  }

  function drawStars(t) {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      const flicker = 0.45 + Math.sin(t * 0.002 + s.tw) * 0.35;
      const green = Math.random() > 0.92;
      ctx.beginPath();
      ctx.fillStyle = green
        ? `rgba(200,255,0,${0.35 + flicker * 0.5})`
        : `rgba(232,255,232,${0.25 + flicker * 0.5})`;
      ctx.arc(s.x, s.y, s.r * s.z, 0, Math.PI * 2);
      ctx.fill();
      s.y += 0.05 * s.z;
      if (s.y > h) {
        s.y = -2;
        s.x = Math.random() * w;
      }
    }
    requestAnimationFrame(drawStars);
  }

  resizeStars();
  window.addEventListener("resize", resizeStars);
  requestAnimationFrame(drawStars);

  /* ---------- reveal on scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  reveals.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 6) * 60}ms`;
    io.observe(el);
  });

  /* ---------- 3D tilt cards ---------- */
  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - y) * 12;
      const ry = (x - 0.5) * 14;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });

  /* ---------- magnetic buttons ---------- */
  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
    });
    btn.addEventListener("pointerleave", () => {
      btn.style.transform = "";
    });
  });

  /* ---------- parallax hero banner ---------- */
  const heroBanner = document.querySelector(".hero-banner");
  window.addEventListener(
    "scroll",
    () => {
      if (!heroBanner) return;
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroBanner.style.transform = `scale(1.08) translateY(${y * 0.18}px)`;
      }
    },
    { passive: true }
  );

  /* ---------- floating dust particles in DOM ---------- */
  const dustHost = document.querySelector(".dust");
  if (dustHost) {
    for (let i = 0; i < 28; i++) {
      const p = document.createElement("span");
      p.style.cssText = `
        position:absolute;width:${2 + Math.random() * 4}px;height:${2 + Math.random() * 4}px;
        border-radius:50%;left:${Math.random() * 100}%;top:${Math.random() * 100}%;
        background:${Math.random() > 0.5 ? "rgba(200,255,0,0.55)" : "rgba(0,200,5,0.45)"};
        box-shadow:0 0 10px rgba(200,255,0,0.4);
        animation:floatParticle ${8 + Math.random() * 12}s linear infinite;
        animation-delay:-${Math.random() * 10}s;
      `;
      dustHost.appendChild(p);
    }
    const style = document.createElement("style");
    style.textContent = `
      @keyframes floatParticle {
        0% { transform: translateY(20vh) translateX(0) scale(0.6); opacity: 0; }
        15% { opacity: 0.9; }
        85% { opacity: 0.7; }
        100% { transform: translateY(-30vh) translateX(40px) scale(1.2); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
})();
