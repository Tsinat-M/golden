// ===================================================================
//  Reservasjonsbekreftelse på e-post (EmailJS)
//  Når en kunde sender skjemaet, sendes TO e-poster:
//    1) Varsel til DEG (admin) om at noen har reservert bord
//    2) Bekreftelse til KUNDEN
//
//  Fyll inn de fem verdiene under (se README for hvor du finner dem).
// ===================================================================

const EMAILJS_PUBLIC_KEY     = "C0GPbarMA4Ro-iaXD";       // Account → General → Public Key
const EMAILJS_SERVICE_ID     = "service_zivgp6g";       // Email Services → Service ID
const EMAILJS_TEMPLATE_ADMIN = "template_co8rqku";   // mal som sendes til deg
const EMAILJS_TEMPLATE_KUNDE = "template_7q4lb9q";   // mal som sendes til kunden
const ADMIN_EPOST            = "goldenlounge2026@gmail.com"; // hvor varselet skal sendes

// ===================================================================

(function () {
  if (typeof emailjs === "undefined") {
    console.error("EmailJS er ikke lastet inn – sjekk at CDN-skriptet ligger før denne filen.");
    return;
  }
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  const form    = document.getElementById("reservationForm");
  const success = document.getElementById("formSuccess");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const btn = form.querySelector(".form-submit");
    const params = {
      navn:        (form.fornavn.value.trim() + " " + form.etternavn.value.trim()).trim(),
      fornavn:     form.fornavn.value.trim(),
      etternavn:   form.etternavn.value.trim(),
      epost:       form.epost.value.trim(),
      telefon:     form.telefon.value.trim() || "—",
      dato:        form.dato.value,
      tid:         form.tid.value,
      antall:      form.gjester.value,
      melding:     form.melding.value.trim() || "—",
      admin_epost: ADMIN_EPOST
    };

    const oldText = btn ? btn.textContent : "";
    if (btn) { btn.disabled = true; btn.textContent = "Sender …"; }

    try {
      // 1) Varsel til admin
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ADMIN, params);
      // 2) Bekreftelse til kunden
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_KUNDE, params);

      form.style.display = "none";
      if (success) success.style.display = "block";
    } catch (err) {
      console.error("EmailJS feilet:", err);
      if (btn) { btn.disabled = false; btn.textContent = oldText; }
      var status  = (err && err.status) ? err.status : "?";
      var detalj  = (err && (err.text || err.message)) ? (err.text || err.message) : JSON.stringify(err);
      alert("Sending feilet.\nStatus: " + status + "\nDetalj: " + detalj);
    }
  });
})();
