// ===================================================================
//  Henter bakgrunnsbildene som er valgt i admin (settings/site →
//  feltet "backgrounds") og sender dem til lysbildevisningen.
//  Trygt: hvis ingen er valgt – eller Firebase ikke er satt opp –
//  beholdes standardbildene som ligger i siden.
// ===================================================================

import { db } from "./firebase-config.js";
import {
  doc, getDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

async function loadBackgrounds() {
  try {
    const snap = await getDoc(doc(db, "settings", "site"));
    if (!snap.exists()) return;
    const list = snap.data().backgrounds;
    if (Array.isArray(list) && list.length && typeof window.__setBackgrounds === "function") {
      window.__setBackgrounds(list);
    }
  } catch (err) {
    console.warn("Kunne ikke hente bakgrunnsbilder, beholder standard:", err);
  }
}

loadBackgrounds();
