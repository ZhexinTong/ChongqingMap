let virtualScroll = 0;
let targetScroll = 0;
let hasEnteredFirstMap = false;

const SCROLL_SPEED = 0.08;
const LANDING_END = 20; // px — deterministic landing cutoff



// ---------------- VIRTUAL SCROLL ----------------
window.addEventListener(
  "wheel",
  e => {
    e.preventDefault();

    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;

    targetScroll += e.deltaY;
    targetScroll = Math.max(0, Math.min(maxScroll, targetScroll));
  },
  { passive: false }
);

function animateScroll() {
  virtualScroll += (targetScroll - virtualScroll) * SCROLL_SPEED;
  window.scrollTo(0, virtualScroll);
  requestAnimationFrame(animateScroll);
}
animateScroll();


// ---------------- MAP SETUP ----------------
const map = L.map("map", {
  zoomControl: false,
  scrollWheelZoom: false,
  touchZoom: false,
  doubleClickZoom: false
}).setView([29.56, 106.55], 14);

map.dragging.enable();

L.control.zoom({
  position: "topright"
}).addTo(map);

// basemap
L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  { opacity: 0.2 }
).addTo(map);

// panes
map.createPane("historic");
map.getPane("historic").style.zIndex = 400;

map.createPane("features");
map.getPane("features").style.zIndex = 450;


// ---------------- DATA ----------------
const baseStep = mapSteps.find(s => s.isBase);
const scrollSteps = mapSteps.filter(s => !s.isBase);

// ---------------- TEXT INJECTION ----------------
const textContainer = document.getElementById("text");
textContainer.innerHTML = ""; // clear placeholder content

scrollSteps.forEach(step => {
  const section = document.createElement("section");
  section.className = "step";

  section.innerHTML = `
    <div class="step-content">
      <h2>${step.year}</h2>
      <h4 class="title-cn">${step.titleCN}</h4>
      <h3 class="title-en">${step.titleEN}</h3>
      ${step.subtitle ? `<h4 class="subtitle">${step.subtitle}</h4>` : ""}
      <p>${step.text}</p>
    </div>
  `;

  textContainer.appendChild(section);
});



// ---------------- OPACITY STATE (MAPS ONLY) ----------------
const layerOpacity = {
  0: 0.8,
  1: 0.8,
  2: 0.8
};


// ---------------- BASE MAP ----------------
const baseOverlay = L.imageOverlay(
  baseStep.image,
  baseStep.bounds,
  { pane: "historic", opacity: layerOpacity.base }
).addTo(map);


// ---------------- BASE FEATURES (DO NOT ADD YET) ----------------
const baseFeatures = (baseStep.features || []).map(f =>
  L.imageOverlay(f.image, f.bounds, {
    pane: "features",
    opacity: 1
  })
);


// ---------------- SCROLL MAP OVERLAYS ----------------
const overlays = scrollSteps.map(step =>
  L.imageOverlay(step.image, step.bounds, {
    pane: "historic",
    opacity: 0
  }).addTo(map)
);


// ---------------- SCROLL FEATURE OVERLAYS (DO NOT ADD YET) ----------------
const featureOverlays = scrollSteps.map(step => {
  if (!step.features) return [];
  return step.features.map(f =>
    L.imageOverlay(f.image, f.bounds, {
      pane: "features",
      opacity: 1
    })
  );
});

function updateFeatureToggle(activeIndex) {
  if (!hasEnteredFirstMap) {
    featureToggle.style.display = "none";
    return;
  }

  featureToggle.style.display = "block";
  featureCheckbox.checked = true;

  let currentFeatures = null;

  if (activeIndex === 0) {
    currentFeatures = baseFeatures; // 1886 shows 1735 feature
  } else {
    currentFeatures = featureOverlays[activeIndex - 1];
  }

  featureCheckbox.onchange = () => {
    currentFeatures.forEach(f => {
      if (featureCheckbox.checked) {
        if (!map.hasLayer(f)) f.addTo(map);
      } else {
        if (map.hasLayer(f)) map.removeLayer(f);
      }
    });
  };
}

// ---------------- OPACITY SLIDERS (MAPS ONLY) ----------------
document.querySelectorAll("#opacity-controls input").forEach(slider => {
  slider.addEventListener("input", e => {
    const key = e.target.dataset.layer;
    const value = parseFloat(e.target.value);

    layerOpacity[key] = value;


    const i = Number(key);
    if (overlays[i]) {
      overlays[i].setOpacity(i === activeIndex ? value : 0);
    }
  });
});

const featureToggle = document.getElementById("feature-toggle");
const featureCheckbox = document.getElementById("feature-checkbox");

// ---------------- DOM ----------------
const sections = document.querySelectorAll(".step");
const title = document.getElementById("landing-title");
const landingBg = document.getElementById("landing-bg");

let activeIndex = -1;
let inScrollMode = false;


// ---------------- SCROLL HANDLER ----------------
window.addEventListener("scroll", () => {
  const y = virtualScroll;
  const t = y < 20 ? y / 20 : 1;

/* -------- LANDING -------- */
if (y <= LANDING_END) {
  inScrollMode = false;
  activeIndex = -1;
  hasEnteredFirstMap = false;
  featureToggle.style.display = "none";
  featureCheckbox.checked = false;
  
  const t = Math.min(y / LANDING_END, 1);

  document.body.classList.add("landing-mode");
  document.body.classList.remove("scroll-mode");

  landingBg.style.display = "block";
  landingBg.style.opacity = 1 - t;

  title.style.opacity = 1 - t;
  title.style.transform = `translateY(${-200 * t}px)`;

  overlays.forEach(o => o.setOpacity(0));
  return;
}

  /* -------- ENTER SCROLL MODE -------- */
  if (!inScrollMode) {
    inScrollMode = true;
    hasEnteredFirstMap = true;

    document.body.classList.remove("landing-mode");
    document.body.classList.add("scroll-mode");

    landingBg.style.display = "none";
    title.style.opacity = 0;

    activeIndex = 0;
    updateFeatureToggle(0);

    overlays.forEach((o, i) =>
      o.setOpacity(i === 0 ? layerOpacity[i] : 0)
    );

    baseOverlay.setOpacity(0);

    // show base feature ONLY on first scroll map
    baseFeatures.forEach(f => f.addTo(map));

    map.invalidateSize();
    map.fitBounds(scrollSteps[0].bounds, { animate: false });
    return;
  }

  /* -------- SCROLLY MODE -------- */
  let newIndex = activeIndex;

  sections.forEach((section, i) => {
    const r = section.getBoundingClientRect();
    if (
      r.top <= window.innerHeight * 0.6 &&
      r.bottom >= window.innerHeight * 0.4
    ) {
      newIndex = i;
    }
  });

  if (newIndex !== activeIndex && overlays[newIndex]) {
    activeIndex = newIndex;
    updateFeatureToggle(activeIndex);

    // maps
    overlays.forEach((o, i) =>
      o.setOpacity(i === activeIndex ? layerOpacity[i] : 0)
    );

    // remove all scroll features first
    featureOverlays.flat().forEach(f => {
      if (map.hasLayer(f)) map.removeLayer(f);
    });

    // add correct feature set
    if (activeIndex === 0) {
      baseFeatures.forEach(f => {
        if (!map.hasLayer(f)) f.addTo(map);
      });
    } else if (featureOverlays[activeIndex - 1]) {
      featureOverlays[activeIndex - 1].forEach(f => {
        if (!map.hasLayer(f)) f.addTo(map);
      });
    }

    // base feature only on first scroll map
    baseFeatures.forEach(f => {
      if (activeIndex === 0) {
        if (!map.hasLayer(f)) f.addTo(map);
      } else {
        if (map.hasLayer(f)) map.removeLayer(f);
      }
    });

    map.fitBounds(scrollSteps[activeIndex].bounds, {
      animate: true,
      duration: 0.6
    });
  }
});
