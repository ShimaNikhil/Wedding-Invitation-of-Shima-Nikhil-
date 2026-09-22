/**
 * SHIMA & NIKHIL WEDDING INVITATION
 * Kerala Hindu Wedding Storytelling Experience
 * GSAP 3 + ScrollTrigger + Lenis Smooth Scroll
 */

/* ==========================================================================
   CENTRAL CONFIGURATION (ALL EDITABLE CONTENT)
   ========================================================================== */
const CONFIG = {
  couple: {
    groom: {
      name: "Nikhil",
      fullName: "Nikhil Unnikrishnan",
      parents: "Mr. Unnikrishnan N & Mrs. Geetha N",
      house: "Nambala House",
      address: "Thozhuvanoor P.O, Valanchery, Malappuram",
      contact: ""
    },
    bride: {
      name: "Shima",
      fullName: "Shima Sekharan",
      parents: "Mr. Sekharan N K & Mrs. Sheeja V",
      house: "S S Home",
      address: "27/536, 2, Kadamkode, Palakkad",
      contacts: ["9847806401", "9747416187"]
    },
    hashtag: "#SHIGOTHERNIK",
    compliments: "Hi-Style Tailoring, Prabha Fashions & Googie 🐾"
  },
  event: {
    title: "Wedding of Shima & Nikhil",
    dateFormatted: "Saturday, 21 November 2026",
    muhurtham: "11:00 AM to 11:30 AM",
    venueName: "C Cube Cosmopolitan Club",
    venueAddress: "N H Bypass Road, Palakkad, Kerala",
    // 21 Nov 2026, 11:00 AM IST (UTC+05:30)
    targetIsoDate: "2026-11-21T11:00:00+05:30",
    icsStart: "20261121T053000Z", // 11:00 AM IST in UTC
    icsEnd: "20261121T090000Z",   // 2:30 PM IST in UTC
    mapsUrl: "https://share.google/g1x7QTccdnutxeB2h",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=C+Cube+Cosmopolitan+Club+N+H+Bypass+Road+Palakkad",
    invitationLine: "Cordially invite your esteemed presence with family on the auspicious occasion of the wedding of our daughter",
    giftNote: "Presents in Blessings only"
  },
  audio: {
    // Optional custom MP3 URL (e.g. 'assets/music.mp3'). If empty, uses native Web Audio classical synthesizer!
    customAudioUrl: "assets/music.mp3"
  },
  gallery: [
    { src: "assets/gallery-1.jpg", title: "" },
    { src: "assets/gallery-2.jpg", title: "" },
    { src: "assets/gallery-3.jpg", title: "" },
    { src: "assets/gallery-4.jpg", title: "" }
  ]
};

/* ==========================================================================
   INITIALIZATION & SMOOTH SCROLL (LENIS + GSAP SCROLLTRIGGER SYNC)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // Check for prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Initialize Lenis Smooth Scroll
  let lenis = null;
  if (!prefersReducedMotion && typeof Lenis !== "undefined") {
    lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  // Register GSAP Plugins
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Populate dynamic text from CONFIG
  populateConfigData();

  // Run Subsystems
  initPreloader();
  initCanvasParticles();
  initAudioSystem();
  initEntryTapToOpen();
  initCountdownTimer();
  initMapInteractivity();
  initCalendarDownload();
  initLightbox();
  initBackToTop(lenis);

  // Initialize ScrollTrigger Animations
  if (!prefersReducedMotion && typeof gsap !== "undefined") {
    initScrollAnimations();
  } else {
    document.querySelectorAll(".scene, .curtain-panel, .preloader").forEach(el => {
      el.style.opacity = "1";
    });
  }
});

/* ==========================================================================
   CONFIG DATA INJECTION
   ========================================================================== */
function populateConfigData() {
  const elements = {
    "hero-groom": CONFIG.couple.groom.name,
    "hero-bride": CONFIG.couple.bride.name,
    "card-bride-name": CONFIG.couple.bride.name,
    "card-groom-name": CONFIG.couple.groom.name,
    "bride-parents": CONFIG.couple.bride.parents,
    "groom-parents": CONFIG.couple.groom.parents,
    "bride-address": `"${CONFIG.couple.bride.house}", ${CONFIG.couple.bride.address}`,
    "groom-address": `"${CONFIG.couple.groom.house}", ${CONFIG.couple.groom.address}`,
    "invitation-line": CONFIG.event.invitationLine,
    "venue-name": CONFIG.event.venueName,
    "venue-address": CONFIG.event.venueAddress,
    "muhurtham-time": CONFIG.event.muhurtham
  };

  for (const [id, value] of Object.entries(elements)) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }
}

/* ==========================================================================
   SCENE 1: PRELOADER (GOLD LOTUS DRAWING)
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById("preloader");
  const fill = document.getElementById("preloader-fill");
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 20) + 10;
    if (progress > 100) progress = 100;
    if (fill) fill.style.width = progress + "%";

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        if (preloader) {
          preloader.classList.add("is-done");
          document.body.classList.remove("is-loading");
          setTimeout(() => {
            preloader.style.display = "none";
            ScrollTrigger.refresh();
          }, 1200);
        }
      }, 400);
    }
  }, 120);
}

/* ==========================================================================
   TAP-TO-OPEN INVITATION
   ========================================================================== */
function initEntryTapToOpen() {
  const entry = document.getElementById("scene-entry");
  const openButton = document.getElementById("entry-open-button");
  const entryContent = entry?.querySelector(".entry-center-content");
  if (!entry || !openButton || !entryContent) return;

  let hasOpened = false;
  const preventScroll = (event) => {
    if (!hasOpened) event.preventDefault();
  };
  const preventScrollKey = (event) => {
    if (!hasOpened && ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) {
      event.preventDefault();
    }
  };

  document.addEventListener("wheel", preventScroll, { passive: false });
  document.addEventListener("touchmove", preventScroll, { passive: false });
  document.addEventListener("keydown", preventScrollKey);

  const openInvitation = () => {
    if (hasOpened) return;
    hasOpened = true;
    openButton.disabled = true;
    document.body.classList.remove("is-gated");
    document.removeEventListener("wheel", preventScroll);
    document.removeEventListener("touchmove", preventScroll);
    document.removeEventListener("keydown", preventScrollKey);
    if (typeof window.startWeddingMusic === "function") window.startWeddingMusic();

    if (typeof gsap === "undefined") {
      document.querySelector(".curtain-panel-left").style.transform = "translateX(-102%)";
      document.querySelector(".curtain-panel-right").style.transform = "translateX(102%)";
      entryContent.style.opacity = "1";
      entryContent.style.transform = "translateY(0)";
      openButton.style.display = "none";
      return;
    }

    gsap.timeline({
      onComplete: () => {
        openButton.style.display = "none";
        if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
      }
    })
      .to(openButton, { opacity: 0, scale: 0.92, duration: 0.25, ease: "power1.out" }, 0)
      .to(".curtain-panel-left", { xPercent: -102, duration: 1.15, ease: "power2.inOut" }, 0.08)
      .to(".curtain-panel-right", { xPercent: 102, duration: 1.15, ease: "power2.inOut" }, 0.08)
      .to(".garland-left", { x: window.innerWidth <= 768 ? -60 : -140, duration: 1, ease: "power2.out" }, 0.08)
      .to(".garland-right", { x: window.innerWidth <= 768 ? 60 : 140, duration: 1, ease: "power2.out" }, 0.08)
      .to(entryContent, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0.42)
      .fromTo(".scroll-indicator", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" }, 0.95);
  };

  // The entire opening screen is the invitation's tap target, including its text.
  entry.addEventListener("click", openInvitation);
}

/* ==========================================================================
   SCROLLTRIGGER ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  // --- SCENE 3: HERO SECTION ---
  const heroTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#scene-hero",
      start: "top 75%",
      toggleActions: "play none none reverse"
    }
  });

  heroTl
    .from(".hero-malayalam", { opacity: 0, y: 20, duration: 0.8, ease: "power3.out" })
    .from(".hero-couple-names .name-part", {
      opacity: 0,
      y: 40,
      stagger: 0.2,
      duration: 1.1,
      ease: "power3.out"
    }, "-=0.4")
    .from(".hero-couple-names .name-ampersand", {
      opacity: 0,
      scale: 0.5,
      duration: 0.8,
      ease: "back.out(1.7)"
    }, "-=0.7")
    .from(".hero-container .ornate-divider", {
      scaleX: 0,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.4")
    .from(".hero-tagline", { opacity: 0, y: 15, duration: 0.7, ease: "power2.out" }, "-=0.3")
    .from(".hero-date-badge", { opacity: 0, scale: 0.9, duration: 0.8, ease: "back.out(1.4)" }, "-=0.2")
    .from(".hero-venue-pill", { opacity: 0, y: 15, duration: 0.6, ease: "power2.out" }, "-=0.3");

  // Corner lotuses bloom on scroll
  gsap.fromTo(".cluster-bottom-left", 
    { y: 60, scale: 0.8, opacity: 0 },
    {
      y: 0,
      scale: 1,
      opacity: 1,
      scrollTrigger: {
        trigger: "#scene-hero",
        start: "top 60%",
        end: "bottom 80%",
        scrub: 1
      }
    }
  );

  gsap.fromTo(".cluster-bottom-right", 
    { y: 60, scale: 0.8, opacity: 0 },
    {
      y: 0,
      scale: 1,
      opacity: 1,
      scrollTrigger: {
        trigger: "#scene-hero",
        start: "top 60%",
        end: "bottom 80%",
        scrub: 1
      }
    }
  );

  // --- SCENE 4: COUPLE REVEAL (PINNED ARCH TEMPLE REVEAL) ---
  const coupleTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#scene-couple",
      start: "top top",
      end: "+=100%",
      pin: true,
      scrub: 1.2,
      anticipatePin: 1
    }
  });

  coupleTl
    .from(".couple-heading-wrap", { opacity: 0, y: -30, ease: "power2.out" }, 0)
    .fromTo(".temple-arch-outer", 
      { y: 80, scale: 0.88, opacity: 0.5 },
      { y: 0, scale: 1, opacity: 1, ease: "power3.out" },
      0.1
    )
    .fromTo("#couple-img",
      { yPercent: 12, scale: 1.15 },
      { yPercent: -4, scale: 1.02, ease: "none" },
      0.1
    )
    .from(".couple-caption-badge", { opacity: 0, y: 25, ease: "back.out(1.5)" }, 0.4)
    .from(".couple-quote-text", { opacity: 0, y: 30, ease: "power2.out" }, 0.5);

  // --- SCENE 5: FAMILY INVITATION (ROYAL CARD PANEL) ---
  gsap.from(".royal-card-panel", {
    scrollTrigger: {
      trigger: "#scene-invitation",
      start: "top 75%",
      toggleActions: "play none none reverse"
    },
    y: 50,
    opacity: 0,
    duration: 1.1,
    ease: "power3.out"
  });

  gsap.from(".ganesha-emblem-wrap, .parents-block, .invitation-lead-block, .invitation-couple-centerpiece, .invitation-actions", {
    scrollTrigger: {
      trigger: "#scene-invitation",
      start: "top 65%",
      toggleActions: "play none none reverse"
    },
    y: 30,
    opacity: 0,
    stagger: 0.12,
    duration: 0.9,
    ease: "power3.out"
  });

  // --- SCENE 6: DATE BADGE & MUHURTHAM ---
  const dateTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#scene-datetime",
      start: "top 70%",
      toggleActions: "play none none reverse"
    }
  });

  dateTl
    .from(".badge-path-frame", {
      strokeDasharray: 900,
      strokeDashoffset: 900,
      duration: 1.5,
      ease: "power3.inOut"
    })
    .from(".badge-center-roundel", {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      ease: "back.out(1.8)"
    }, "-=1.1")
    .from(".badge-ribbon-left, .badge-ribbon-right", {
      opacity: 0,
      y: 15,
      stagger: 0.2,
      duration: 0.7,
      ease: "power2.out"
    }, "-=0.7")
    .from("#muhurtham-pill-wrap", {
      scaleX: 0.7,
      opacity: 0,
      duration: 0.8,
      ease: "back.out(1.5)"
    }, "-=0.3")
    .from(".datetime-venue-line", {
      opacity: 0,
      y: 20,
      duration: 0.7,
      ease: "power2.out"
    }, "-=0.4");

  // --- SCENE 7: COUNTDOWN ---
  gsap.from(".countdown-card", {
    scrollTrigger: {
      trigger: "#scene-countdown",
      start: "top 75%",
      toggleActions: "play none none reverse"
    },
    y: 40,
    opacity: 0,
    scale: 0.85,
    stagger: 0.12,
    duration: 0.8,
    ease: "back.out(1.5)"
  });

  // --- SCENE 8: VENUE & MAP SECTION ---
  const mapTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#scene-venue",
      start: "top 68%",
      toggleActions: "play none none reverse"
    }
  });

  mapTl
    .from("#map-card-wrapper", {
      y: 60,
      scale: 0.94,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out"
    })
    .fromTo("#map-pin-indicator", 
      { y: -120, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "bounce.out" },
      "-=0.5"
    )
    .from(".venue-actions-row .btn-venue-action", {
      y: 25,
      opacity: 0,
      stagger: 0.12,
      duration: 0.7,
      ease: "power2.out"
    }, "-=0.3");

  // --- SCENE 9: GALLERY ITEMS ---
  gsap.from(".gallery-item", {
    scrollTrigger: {
      trigger: "#gallery-grid",
      start: "top 80%",
      toggleActions: "play none none reverse"
    },
    y: 35,
    opacity: 0,
    stagger: 0.12,
    duration: 0.8,
    ease: "power3.out"
  });

  // --- SCENE 10: DETAILS ---
  gsap.from(".detail-card", {
    scrollTrigger: {
      trigger: "#scene-details",
      start: "top 75%",
      toggleActions: "play none none reverse"
    },
    y: 40,
    opacity: 0,
    stagger: 0.18,
    duration: 0.85,
    ease: "power3.out"
  });

  // --- SCENE 11: CLOSING BLESSINGS ---
  gsap.from(".closing-ganesha-mini, .closing-benediction, .closing-signatures, .closing-hashtag, .compliments-footer-note", {
    scrollTrigger: {
      trigger: "#scene-closing",
      start: "top 75%",
      toggleActions: "play none none reverse"
    },
    y: 30,
    opacity: 0,
    stagger: 0.14,
    duration: 0.9,
    ease: "power3.out"
  });
}

/* ==========================================================================
   COUNTDOWN TIMER ENGINE (Target: 21 Nov 2026, 11:00 AM IST)
   ========================================================================== */
function initCountdownTimer() {
  const targetDate = new Date(CONFIG.event.targetIsoDate).getTime();

  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minEl = document.getElementById("cd-minutes");
  const secEl = document.getElementById("cd-seconds");

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = "00";
      if (hoursEl) hoursEl.textContent = "00";
      if (minEl) minEl.textContent = "00";
      if (secEl) secEl.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, "0");

    if (daysEl && daysEl.textContent !== pad(days)) daysEl.textContent = pad(days);
    if (hoursEl && hoursEl.textContent !== pad(hours)) hoursEl.textContent = pad(hours);
    if (minEl && minEl.textContent !== pad(minutes)) minEl.textContent = pad(minutes);
    if (secEl && secEl.textContent !== pad(seconds)) secEl.textContent = pad(seconds);
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   VENUE & MAP INTERACTIVITY (MOBILE SCROLL FIX)
   ========================================================================== */
function initMapInteractivity() {
  const overlay = document.getElementById("map-touch-overlay");
  const container = document.getElementById("map-card-wrapper");

  if (!overlay || !container) return;

  overlay.addEventListener("click", () => {
    overlay.classList.add("is-active");
  });

  document.addEventListener("click", (e) => {
    if (!container.contains(e.target)) {
      overlay.classList.remove("is-active");
    }
  });

  window.addEventListener("scroll", () => {
    if (overlay.classList.contains("is-active")) {
      overlay.classList.remove("is-active");
    }
  }, { passive: true });
}

/* ==========================================================================
   CALENDAR .ICS GENERATOR (IST TIMEZONE & REMINDERS)
   ========================================================================== */
function initCalendarDownload() {
  const btn = document.getElementById("btn-add-calendar");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const title = `${CONFIG.couple.bride.name} & ${CONFIG.couple.groom.name}'s Wedding`;
    const description = `Auspicious Wedding Ceremony of ${CONFIG.couple.bride.name} & ${CONFIG.couple.groom.name}\\n\\nMuhurtham: ${CONFIG.event.muhurtham} IST\\n\\nVenue: ${CONFIG.event.venueName}, ${CONFIG.event.venueAddress}\\n\\nNote: ${CONFIG.event.giftNote}\\n\\nLocation: ${CONFIG.event.mapsUrl}`;
    const location = `${CONFIG.event.venueName}, ${CONFIG.event.venueAddress}`;

    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Shima and Nikhil//Kerala Wedding Invitation//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:wedding-${Date.now()}@shimanikhil2026.com`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `DTSTART:${CONFIG.event.icsStart}`,
      `DTEND:${CONFIG.event.icsEnd}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      "STATUS:CONFIRMED",
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "ACTION:DISPLAY",
      `DESCRIPTION:Reminder: ${title} is tomorrow!`,
      "END:VALARM",
      "BEGIN:VALARM",
      "TRIGGER:-PT2H",
      "ACTION:DISPLAY",
      `DESCRIPTION:Reminder: ${title} starts in 2 hours at ${CONFIG.event.venueName}`,
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", "Shima-and-Nikhil-Wedding.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

/* ==========================================================================
   LIGHTBOX MODAL FOR PHOTOS & FORMAL INVITATION CARD
   ========================================================================== */
function initLightbox() {
  const modal = document.getElementById("lightbox-modal");
  const backdrop = document.getElementById("lightbox-backdrop");
  const closeBtn = document.getElementById("lightbox-close");
  const imgEl = document.getElementById("lightbox-img");
  const captionEl = document.getElementById("lightbox-caption");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");
  const downloadLink = document.getElementById("lightbox-download");
  const btnViewCard = document.getElementById("btn-view-card");

  if (!modal || !imgEl) return;

  let currentIndex = 0;
  let isSingleCardMode = false;
  const items = CONFIG.gallery;

  function openGalleryLightbox(src, title) {
    isSingleCardMode = false;
    if (prevBtn) prevBtn.classList.remove("is-hidden");
    if (nextBtn) nextBtn.classList.remove("is-hidden");

    const foundIdx = items.findIndex(item => item.src === src);
    currentIndex = foundIdx !== -1 ? foundIdx : 0;
    updateLightbox();
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  // Opens strictly the Formal Parents' Invitation Card without navigation
  function openFormalCardOnly() {
    isSingleCardMode = true;
    if (prevBtn) prevBtn.classList.add("is-hidden");
    if (nextBtn) nextBtn.classList.add("is-hidden");

    imgEl.src = "assets/invite-1.jpg";
    imgEl.alt = "Formal Parents' Invitation Card";
    if (captionEl) captionEl.textContent = "Formal Parents' Invitation Card";
    if (downloadLink) {
      downloadLink.href = "assets/invite-1.jpg";
      downloadLink.download = "Formal-Wedding-Invitation-Card.jpg";
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function updateLightbox() {
    if (isSingleCardMode) return;
    const item = items[currentIndex];
    imgEl.src = item.src;
    imgEl.alt = item.title;
    if (captionEl) captionEl.textContent = item.title;
    if (downloadLink) {
      downloadLink.href = item.src;
      downloadLink.download = item.src.split("/").pop();
    }
  }

  function showNext() {
    if (isSingleCardMode) return;
    currentIndex = (currentIndex + 1) % items.length;
    updateLightbox();
  }

  function showPrev() {
    if (isSingleCardMode) return;
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateLightbox();
  }

  // Trigger from invitation card button: ONLY opens the Formal Card
  if (btnViewCard) {
    btnViewCard.addEventListener("click", openFormalCardOnly);
  }

  // Bind clicks on gallery items
  document.querySelectorAll("[data-lightbox-src]").forEach(el => {
    el.addEventListener("click", () => {
      const src = el.getAttribute("data-lightbox-src");
      const title = el.getAttribute("data-lightbox-title") || "Wedding Gallery";
      openGalleryLightbox(src, title);
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (backdrop) backdrop.addEventListener("click", closeLightbox);
  if (nextBtn) nextBtn.addEventListener("click", showNext);
  if (prevBtn) prevBtn.addEventListener("click", showPrev);

  window.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (!isSingleCardMode) {
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    }
  });
}

/* ==========================================================================
   3D HOVER TILT FOR GALLERY CARDS
   ========================================================================== */
document.querySelectorAll("[data-tilt]").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / rect.height) * 12;
    const rotateY = (x / rect.width) * 12;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
  });
});

/* ==========================================================================
   CANVAS PARTICLES (LOTUS PETALS & GOLDEN SPARKLES)
   ========================================================================== */
function initCanvasParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const isMobile = window.innerWidth <= 768;
  const particleCount = isMobile ? 24 : 50;
  const particles = [];

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.isPetal = Math.random() > 0.4;
      this.size = this.isPetal ? Math.random() * 8 + 6 : Math.random() * 2.5 + 1.2;
      this.speedY = Math.random() * 0.9 + 0.5;
      this.speedX = Math.sin(Math.random() * Math.PI * 2) * 0.6;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.03;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.swayAngle = Math.random() * Math.PI * 2;
      this.swaySpeed = Math.random() * 0.02 + 0.01;
    }

    update() {
      this.y += this.speedY;
      this.swayAngle += this.swaySpeed;
      this.x += Math.sin(this.swayAngle) * 0.75 + this.speedX;
      this.rotation += this.rotSpeed;

      if (this.y > height + 25 || this.x < -30 || this.x > width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      if (this.isPetal) {
        ctx.fillStyle = "#F4B8BE";
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.bezierCurveTo(this.size * 0.8, -this.size * 0.5, this.size * 0.8, this.size * 0.5, 0, this.size);
        ctx.bezierCurveTo(-this.size * 0.8, this.size * 0.5, -this.size * 0.8, -this.size * 0.5, 0, -this.size);
        ctx.fill();

        ctx.strokeStyle = "#E86A92";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 0.7);
        ctx.lineTo(0, this.size * 0.7);
        ctx.stroke();
      } else {
        ctx.fillStyle = "#E5BF6A";
        ctx.shadowBlur = 6;
        ctx.shadowColor = "#FDF0CD";
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  let animFrameId = null;
  function render() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    animFrameId = requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   AMBIENT AUDIO ENGINE (WEB AUDIO SYNTHESIZER / CUSTOM TRACK)
   ========================================================================== */
function initAudioSystem() {
  const toggleBtn = document.getElementById("audio-toggle");
  const audioLabel = document.getElementById("audio-label");
  if (!toggleBtn) return;

  // The invitation should begin with music. The control mutes/unmutes it rather
  // than stopping the track, so it resumes exactly where it left off.
  let isPlaying = false;
  let autoplayBlocked = false;
  let playbackAttemptInProgress = false;
  let customAudioEl = document.getElementById("wedding-audio");
  if (!customAudioEl && CONFIG.audio.customAudioUrl) {
    customAudioEl = new Audio(CONFIG.audio.customAudioUrl);
  }
  if (customAudioEl) {
    customAudioEl.loop = true;
    customAudioEl.volume = 0.85;
  }
  let audioCtx = null;
  let synthInterval = null;
  let droneGain = null;

  function updateAudioControl(isAudible, unavailable = false) {
    toggleBtn.classList.toggle("is-playing", isAudible);
    toggleBtn.setAttribute("aria-pressed", String(isAudible));
    toggleBtn.setAttribute(
      "aria-label",
      unavailable ? "Play traditional wedding music" : isAudible ? "Mute traditional wedding music" : "Unmute traditional wedding music"
    );
    toggleBtn.title = unavailable ? "Play traditional music" : isAudible ? "Mute traditional music" : "Unmute traditional music";
    if (audioLabel) audioLabel.textContent = unavailable ? "Play music" : isAudible ? "Mute" : "Unmute";
  }

  function startIndianClassicalSynth() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    droneGain = audioCtx.createGain();
    droneGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    droneGain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 3);
    droneGain.connect(audioCtx.destination);

    const droneFreqs = [146.83, 147.2, 220.0, 293.66];
    droneFreqs.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = idx % 2 === 0 ? "sawtooth" : "sine";
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      const filter = audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, audioCtx.currentTime);

      oscGain.gain.setValueAtTime(0.04 / droneFreqs.length, audioCtx.currentTime);
      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(droneGain);
      osc.start();
    });

    const ragaNotes = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33, 739.99];

    synthInterval = setInterval(() => {
      if (!isPlaying || !audioCtx) return;
      const noteFreq = ragaNotes[Math.floor(Math.random() * ragaNotes.length)];
      playVeenaPluck(noteFreq);
    }, 3200);
  }

  function playVeenaPluck(freq) {
    if (!audioCtx || audioCtx.state !== "running") return;
    const now = audioCtx.currentTime;

    const pluckOsc = audioCtx.createOscillator();
    const pluckGain = audioCtx.createGain();
    const pluckFilter = audioCtx.createBiquadFilter();

    pluckOsc.type = "triangle";
    pluckOsc.frequency.setValueAtTime(freq, now);

    pluckFilter.type = "bandpass";
    pluckFilter.frequency.setValueAtTime(freq * 1.5, now);
    pluckFilter.Q.setValueAtTime(3.5, now);

    pluckGain.gain.setValueAtTime(0.001, now);
    pluckGain.gain.exponentialRampToValueAtTime(0.08, now + 0.08);
    pluckGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

    pluckOsc.connect(pluckFilter);
    pluckFilter.connect(pluckGain);
    pluckGain.connect(audioCtx.destination);

    pluckOsc.start(now);
    pluckOsc.stop(now + 3.0);
  }

  function stopIndianClassicalSynth() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
    if (audioCtx && droneGain) {
      droneGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
      setTimeout(() => {
        if (audioCtx && audioCtx.state === "running") {
          audioCtx.suspend();
        }
      }, 850);
    }
  }

  function playTrack() {
    if (customAudioEl) {
      if (isPlaying || playbackAttemptInProgress) return;

      // This also restores sound after the visitor has muted it.
      customAudioEl.muted = false;
      playbackAttemptInProgress = true;
      const p = customAudioEl.play();
      if (p !== undefined) {
        p.then(() => {
          isPlaying = true;
          autoplayBlocked = false;
          playbackAttemptInProgress = false;
          updateAudioControl(true);
        });
        p.catch((err) => {
          console.warn("Audio play blocked by browser policy:", err);
          isPlaying = false;
          autoplayBlocked = true;
          playbackAttemptInProgress = false;
          updateAudioControl(false, true);
        });
      } else {
        isPlaying = true;
        autoplayBlocked = false;
        playbackAttemptInProgress = false;
        updateAudioControl(true);
      }
    } else {
      if (isPlaying) return;
      isPlaying = true;
      updateAudioControl(true);
      startIndianClassicalSynth();
    }
  }

  function muteTrack() {
    isPlaying = false;
    updateAudioControl(false);

    if (customAudioEl) {
      customAudioEl.muted = true;
    } else {
      stopIndianClassicalSynth();
    }
  }

  // The opening screen calls this directly from its click handler, preserving
  // the browser's user-activation permission needed for audible playback.
  window.startWeddingMusic = playTrack;

  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (isPlaying) {
      muteTrack();
    } else {
      playTrack();
    }
  });

  // Keep the control truthful before the invitation has been opened.
  updateAudioControl(false, true);

  // A tap anywhere starts music in Chrome and Safari, where an audible track
  // must be initiated by a real user interaction.
  const onFirstTap = () => {
    if (!isPlaying) {
      playTrack();
    }
  };
  document.addEventListener("pointerdown", onFirstTap, { once: true, passive: true });
}

/* ==========================================================================
   BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop(lenis) {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  btn.addEventListener("click", () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.8 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}


/* Map fallback: the embedded Google Map is blocked on some preview hosts, so show a tap-to-open card there */
(function () {
  if (!/claude/i.test(location.hostname) && location.search.indexOf("nomap") === -1) return;
  const box = document.getElementById("map-iframe-container");
  if (!box) return;
  const frame = document.getElementById("venue-map-iframe");
  const overlay = document.getElementById("map-touch-overlay");
  const pin = document.getElementById("map-pin-indicator");
  if (frame) frame.style.display = "none";
  if (overlay) overlay.style.display = "none";
  if (pin) pin.style.display = "none";
  const a = document.createElement("a");
  a.className = "map-fallback";
  a.href = CONFIG.event.mapsUrl;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.innerHTML = '<svg viewBox="0 0 32 48" width="40" height="58" aria-hidden="true"><path d="M16 0 C7.16 0 0 7.16 0 16 C0 26 16 48 16 48 C16 48 32 26 32 16 C32 7.16 24.84 0 16 0 Z" fill="#6B2A2E" stroke="#B8893A" stroke-width="2"/><circle cx="16" cy="16" r="6" fill="#FDF0CD"/></svg>' +
    '<strong class="serif-font">' + CONFIG.event.venueName + '</strong>' +
    '<span>' + CONFIG.event.venueAddress + '</span>' +
    '<em>Tap to open in Google Maps</em>';
  box.appendChild(a);
})();
