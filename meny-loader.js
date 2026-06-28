// ===================================================================
//  Henter menyen fra databasen og viser den på meny.html.
//  Trygt: hvis Firebase ikke er satt opp (eller er nede), beholdes
//  de eksisterende rettene i HTML-en – siden står aldri tom.
//  Drikke vises gruppert: Alkoholfri / Alkohol (Shot, Miksedrikker, Øl).
// ===================================================================

import { db } from "./firebase-config.js";
import {
  collection, getDocs, query, orderBy
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const BADGES = {
  veg:   ["badge-veg",   "Vegetar"],
  vegan: ["badge-vegan", "Vegan"],
  spicy: ["badge-spicy", "Sterk"]
};

// Drikke-undergrupper. "group" = overskrift den ligger under (eller null = egen toppseksjon)
const DRINK_SUBS = [
  { key: "alkoholfri", label: "Alkoholfri",   group: null },
  { key: "shot",       label: "Shot",         group: "Alkohol" },
  { key: "miks",       label: "Miksedrikker", group: "Alkohol" },
  { key: "ol",         label: "Øl",           group: "Alkohol" }
];

function esc(s) {
  return String(s ?? "").replace(/[&<>"]/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function itemHTML(d) {
  const badges = (d.badges || [])
    .map(b => {
      const m = BADGES[b];
      return m ? `<span class="menu-badge ${m[0]}">${m[1]}</span>` : "";
    })
    .join("");
  return `<div class="menu-item">
      ${d.image ? `<img class="menu-item-img" src="${esc(d.image)}" alt="${esc(d.name)}" loading="lazy">` : ""}
      <div class="menu-item-header">
        <div>
          <div class="menu-item-name">${esc(d.name)}</div>
          ${d.geez ? `<div class="menu-item-ge-ez">${esc(d.geez)}</div>` : ""}
        </div>
        <div class="menu-item-price">${esc(d.price)} kr</div>
      </div>
      ${d.desc ? `<p class="menu-item-desc">${esc(d.desc)}</p>` : ""}
      ${badges}
    </div>`;
}

function gridHTML(items) {
  return `<div class="menu-grid">${items.map(itemHTML).join("")}</div>`;
}

// Spesialvisning for drikke: grupper kunden kan trykke på for å åpne
function renderDrikke(panel, drinks) {
  const grid = panel.querySelector(".menu-grid");
  if (!grid) return;

  const by = {};
  DRINK_SUBS.forEach(s => (by[s.key] = []));
  const other = [];
  drinks.forEach(d => {
    if (by[d.subcat]) by[d.subcat].push(d);
    else other.push(d);
  });

  const acc = (label, items, cls) =>
    `<details class="drikke-acc ${cls}">
       <summary><span class="acc-lbl">${label}</span><span class="acc-count">${items.length}</span></summary>
       ${gridHTML(items)}
     </details>`;

  let html = "";

  // Alkoholfri (egen gruppe)
  if (by.alkoholfri.length) html += acc("Alkoholfri", by.alkoholfri, "top");

  // Alkohol – klikkbar, med undergrupper (Shot/Miksedrikker/Øl) nestet inni
  const alko = DRINK_SUBS.filter(s => s.group === "Alkohol" && by[s.key].length);
  if (alko.length) {
    let inner = "";
    alko.forEach(s => (inner += acc(s.label, by[s.key], "sub")));
    const total = alko.reduce((n, s) => n + by[s.key].length, 0);
    html += `<details class="drikke-acc top">
       <summary><span class="acc-lbl">Alkohol</span><span class="acc-count">${total}</span></summary>
       <div class="drikke-sub-wrap">${inner}</div>
     </details>`;
  }

  // Drikke uten gruppe ennå
  if (other.length) html += acc("Andre", other, "top");

  if (!html) html = `<p style="color:var(--muted);padding:1.8rem">Ingen drikke ennå.</p>`;

  const wrap = document.createElement("div");
  wrap.className = "drikke-wrap";
  wrap.innerHTML = html;
  grid.replaceWith(wrap);
}

async function loadMenu() {
  const panels = {};
  document.querySelectorAll(".menu-panel").forEach(panel => {
    panels[panel.id.replace("tab-", "")] = panel;
  });

  let snap;
  try {
    snap = await getDocs(query(collection(db, "menu"), orderBy("order")));
  } catch (err) {
    console.warn("Kunne ikke hente meny fra databasen, beholder reserve:", err);
    return;
  }

  const byCat = {};
  Object.keys(panels).forEach(c => (byCat[c] = []));
  snap.forEach(doc => {
    const d = doc.data();
    if (byCat[d.category]) byCat[d.category].push(d);
  });

  Object.entries(panels).forEach(([cat, panel]) => {
    if (cat === "drikke") {
      renderDrikke(panel, byCat.drikke);
      return;
    }
    const grid = panel.querySelector(".menu-grid");
    if (!grid) return;
    grid.innerHTML = byCat[cat].length
      ? byCat[cat].map(itemHTML).join("")
      : `<p style="color:var(--muted);padding:1.8rem">Ingen retter i denne kategorien ennå.</p>`;
  });
}

loadMenu();
