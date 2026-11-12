# Golden Lounge Oslo 🍽️

A full-stack website and self-service admin panel for an Eritrean & Ethiopian restaurant in Oslo, Norway. Built from scratch with vanilla JavaScript and Firebase — no framework, no build step.

🔗 **Live site:** [golden-lounge-oslo.web.app](https://golden-lounge-oslo.web.app)

---

## Overview

Golden Lounge Oslo is a production website that the restaurant owners run themselves. Beyond the public pages, it includes a password-protected admin panel where staff edit the menu, upload dish photos, manage the homepage slideshow, and reset their own password — all without touching code. Table reservations are confirmed automatically by email to both the guest and the restaurant.

The project covers the full stack of a small real-world product: frontend, database, authentication, file storage, transactional email, security rules, hosting, and SEO.

## Features

**Public site**
- Responsive, hand-crafted design (gold-on-black) with an animated background slideshow
- Dynamic menu loaded live from the database, grouped by category
- Two-level collapsible drinks menu (Non-alcoholic / Alcohol → Shots, Mixed drinks, Beer)
- Reservation form that emails a confirmation to the guest and a notification to the restaurant

**Admin panel** (`admin.html`)
- Email/password login with a self-service "forgot password" flow
- Full menu management: add, edit, delete dishes, prices, descriptions and tags
- Upload dish images directly from the computer
- Manage the homepage slideshow backgrounds (add, remove, reorder)
- Changes appear on the live site instantly — no redeploy needed

**Extras**
- Printable QR-code generator for table menus
- Graceful fallback: if the database is unreachable, the site still shows its built-in content, so it is never empty

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, vanilla JavaScript (ES modules) |
| Database | Cloud Firestore |
| Authentication | Firebase Authentication (email/password) |
| File storage | Firebase Storage (dish & background images) |
| Email | EmailJS (client-side transactional email) |
| Hosting | Firebase Hosting |
| SEO | Google Search Console, Google Business Profile |

## Architecture notes

- **No framework / no build tooling.** The site uses the Firebase modular SDK loaded straight from the CDN, which keeps the project approachable and dependency-free.
- **Progressive enhancement.** Each page ships with hardcoded content as a fallback; the loaders replace it with live data only after a successful fetch.
- **Security is enforced server-side.** The Firebase client config is public by design — read access is open, while writes (editing the menu, uploading images) require an authenticated admin. See `firestore.rules` and the Storage rules.

## Project structure

```
index.html            Homepage
meny.html             Menu (reads from Firestore)
reservasjon.html      Reservation form (EmailJS)
admin.html            Admin panel (auth + CRUD + uploads)
firebase-config.js    Firebase initialization
meny-loader.js        Renders the menu from Firestore
backgrounds-loader.js Loads admin-managed slideshow images
reservasjon-mail.js   Sends reservation emails
firestore.rules       Database security rules
qr-meny.html          Printable QR-code tool
image/                Site images
```

## Run locally

Because the site uses ES modules, it must be served over HTTP (not opened as a file):

```bash
# any static server works, e.g.
python -m http.server
# then open http://localhost:8000
```

To connect your own backend, create a Firebase project and fill in your keys in `firebase-config.js`, enable Email/Password auth and Firestore, and (for image upload) Firebase Storage with the included rules. EmailJS keys go in `reservasjon-mail.js`.

## Deployment

```bash
firebase deploy
```

---

Built by [Tsinat Misghina](https://github.com/Tsinat-M) — data engineering student at Høgskolen i Østfold.