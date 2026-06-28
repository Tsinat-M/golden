# Golden Lounge – admin & meny via Firebase

Med dette kan du logge inn på en egen admin-side og endre priser / legge til
retter. Endringene lagres i Firebase og vises automatisk på `meny.html`.

## Bilder (gratis-løsningen)

Bildene legges i mappen `image` (samme mappe du allerede har). I admin skriver
du bare inn *stien* til bildet – ingen opplasting, ingen Blaze/kredittkort.

**Rettbilder:** Legg bildefilen i `image`-mappen (f.eks. `image/kitfo.jpg`).
Åpne retten i admin → skriv `image/kitfo.jpg` i bildefeltet → *Lagre*. Bildet
vises øverst i menykortet. Lar du feltet stå tomt, vises retten uten bilde.

**Bakgrunnsbilder (lysbildevisning):** Nederst i admin er det en egen seksjon.
Klikk *+ Legg til bilde*, skriv stien (f.eks. `image/slide1.jpg`), bruk ↑/↓ for
rekkefølge, og *Lagre bakgrunnsbilder*. Disse vises på alle tre sidene. Tom liste
= standardbildene som allerede ligger i sidene beholdes.

> Tips: bruk gjerne nettvennlige bilder (helst under ~300 KB) så siden laster raskt.

## Filer
| Fil | Hva den gjør |
|-----|--------------|
| `firebase-config.js` | Dine Firebase-nøkler. **Den eneste filen du må fylle ut.** |
| `admin.html` | Innlogging + redigering av menyen (priser, retter, merker). |
| `meny-loader.js` | Henter menyen fra databasen til `meny.html`. |
| `backgrounds-loader.js` | Henter bakgrunnsbildene (lysbildevisning) fra admin til alle sidene. |
| `meny.html` | Din meny – nå koblet til databasen (gamle retter ligger som reserve). |
| `firestore.rules` | Sikkerhet: alle kan lese, bare innlogget admin kan endre. |
| `reservasjon.html` | Reservasjonsskjema – nå koblet til e-postutsending. |
| `reservasjon-mail.js` | Sender bekreftelse til kunde + varsel til admin (EmailJS). |

## Engangsoppsett (ca. 10 min)

1. **Lag prosjekt:** Gå til https://console.firebase.google.com → *Add project*.
   Gi det navn (f.eks. `golden-lounge`). Spark-planen (gratis) holder.

2. **Registrer web-app:** I prosjektet → klikk web-ikonet **`</>`** →
   gi appen et kallenavn → *Register app*. Kopier `firebaseConfig`-objektet.

3. **Lim inn nøklene:** Åpne `firebase-config.js` og bytt ut verdiene
   (`apiKey`, `authDomain`, `projectId` osv.) med dine.

4. **Slå på innlogging:** Venstremeny → *Authentication* → *Get started* →
   fanen *Sign-in method* → aktiver **Email/Password**.
   Deretter fanen *Users* → *Add user* → skriv inn DIN e-post og et passord.
   (Det er denne kontoen du logger inn på admin-siden med.)

5. **Lag database:** Venstremeny → *Firestore Database* → *Create database* →
   velg en lokasjon i Europa (f.eks. `eur3`) → start i *production mode*.

6. **Sett sikkerhetsregler:** I Firestore → fanen *Rules* → erstatt alt med
   innholdet i `firestore.rules` → *Publish*.

## Bruk

1. Last opp alle filene til der nettsiden ligger (samme mappe).
2. Åpne `admin.html` i nettleseren og logg inn.
3. Første gang: klikk **«Importer startmeny»** for å legge inn dagens retter.
4. Klikk på en rett for å endre pris/tekst → **Lagre**. Eller **«+ Legg til rett»**.
5. Endringene vises på `meny.html` med en gang.

## E-post ved reservasjon (reservasjon.html)

Når en kunde fyller ut reservasjonsskjemaet, sendes detaljene (navn, e-post,
telefon, dato, tid, antall, ønsker) rett til din innboks. Dette bruker
**Web3Forms** – gratis, ingen server, 250 reservasjoner/måned.

1. Gå til https://web3forms.com → skriv inn restaurantens e-postadresse →
   du får en **Access Key** på e-post (det er hit reservasjonene kommer).
2. Åpne `reservasjon.html`, finn linjen:
   `<input type="hidden" name="access_key" value="DIN_WEB3FORMS_NOKKEL" />`
   og bytt `DIN_WEB3FORMS_NOKKEL` med nøkkelen din.
3. Ferdig. Test ved å sende en reservasjon – du skal få e-post i løpet av sekunder.

Tips: Vil du sende kunden en automatisk «takk for reservasjonen»-bekreftelse
også, kan det slås på i Web3Forms (Autoresponder). Si fra om du vil ha hjelp.

## Viktig
- Filer med `type="module"` (admin/loader) virker **ikke** ved å dobbeltklikke
  fra harddisken (`file://`). De må ligge på en webserver / Firebase Hosting.
  Til testing lokalt: kjør `python3 -m http.server` i mappen og åpne
  `http://localhost:8000/admin.html`.
- Ikke aktiver offentlig registrering i Authentication – opprett kun din egen
  bruker. Da er det bare du som kan endre menyen.
- Ekstra sikring (valgfritt): i `firestore.rules` kan `request.auth != null`
  byttes til `request.auth.uid == "DIN_BRUKER_UID"` for å låse skriving til
  nøyaktig én konto (UID-en finner du under Authentication → Users).

---

## Reservasjon på e-post (EmailJS)

Når en kunde sender reservasjonsskjemaet, sendes **to** e-poster automatisk:
ett varsel til deg (admin) og én bekreftelse til kunden. Dette bruker EmailJS,
som sender e-post rett fra nettleseren (passer for statiske sider). Gratisplanen
holder ca. 200 e-poster/måned (= ca. 100 reservasjoner).

### Oppsett (engang, ca. 10 min)

1. **Lag konto:** https://www.emailjs.com → registrer deg (gratis).

2. **Koble til e-post:** *Email Services* → *Add New Service* → velg f.eks. Gmail
   og logg inn med restaurantens e-post. Noter **Service ID**.

3. **Lag to maler** under *Email Templates* → *Create New Template*:

   **Mal A – varsel til deg (admin)**
   - I fanen *Settings*: sett **To Email** = `{{admin_epost}}`
     (eller skriv inn din egen adresse direkte).
   - Emne: `Ny bordreservasjon – {{navn}}`
   - Innhold:
     ```
     Ny reservasjon mottatt:

     Navn:     {{navn}}
     E-post:   {{epost}}
     Telefon:  {{telefon}}
     Dato:     {{dato}}
     Tid:      {{tid}}
     Antall:   {{antall}}
     Melding:  {{melding}}
     ```
   - Noter **Template ID** → dette er `TEMPLATE_TIL_ADMIN`.

   **Mal B – bekreftelse til kunden**
   - I fanen *Settings*: sett **To Email** = `{{epost}}` (kundens adresse).
   - Emne: `Bekreftelse på din reservasjon – Golden Lounge Oslo`
   - Innhold:
     ```
     Hei {{fornavn}}!

     Tusen takk for din reservasjon hos Golden Lounge Oslo.
     Vi har mottatt følgende:

     Dato:   {{dato}}
     Tid:    {{tid}}
     Antall: {{antall}}

     Har du spørsmål, bare svar på denne e-posten.
     Vi gleder oss til å se deg!

     Vennlig hilsen,
     Golden Lounge Oslo
     ```
   - Noter **Template ID** → dette er `TEMPLATE_TIL_KUNDE`.

4. **Hent Public Key:** *Account* → *General* → kopier **Public Key**.

5. **Fyll inn i `reservasjon-mail.js`** (øverst i filen):
   - `EMAILJS_PUBLIC_KEY`  = din Public Key
   - `EMAILJS_SERVICE_ID`  = Service ID fra steg 2
   - `EMAILJS_TEMPLATE_ADMIN` = Template ID for Mal A
   - `EMAILJS_TEMPLATE_KUNDE` = Template ID for Mal B
   - `ADMIN_EPOST` = e-posten du vil ha varsler til

Det var alt – test ved å sende en reservasjon til deg selv.

### Tilgjengelige variabler i malene
`{{navn}}`, `{{fornavn}}`, `{{etternavn}}`, `{{epost}}`, `{{telefon}}`,
`{{dato}}`, `{{tid}}`, `{{antall}}`, `{{melding}}`, `{{admin_epost}}`
