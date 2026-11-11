(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  if (!$("tulokset")) return;

  var TYYPIT = { kiintea12: "Kiinteä 12 kk", toistaiseksi: "Kiinteä, toistaiseksi", porssi: "Pörssisähkö", hybridi: "Hybridi" };
  var MIN = 500, MAX = 30000;
  var tila = { kwh: 2000, suodatin: "kaikki", jarjestys: "eka" };

  function e(n) { return Math.round(n).toLocaleString("fi-FI"); }
  function d2(n) { return n.toLocaleString("fi-FI", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* Liukusäädin: neliöllinen asteikko, jotta pienet kulutukset ovat tarkkoja */
  function liukuKwh(v) { var t = v / 1000; return Math.round((MIN + (MAX - MIN) * t * t) / 100) * 100; }
  function kwhLiuku(k) { var t = Math.sqrt(Math.max(0, (k - MIN) / (MAX - MIN))); return Math.round(Math.min(1, t) * 1000); }

  function kuukausihinta(c, kk, spot, alkuKaytossa) {
    var a = alkuKaytossa && c.alku && kk <= c.alku.kk ? c.alku : null;
    var maksu = a && a.maksu !== undefined ? a.maksu : c.maksu;
    var marg = a && a.marginaali !== undefined ? a.marginaali : c.marginaali;
    var snt;
    if (c.tyyppi === "porssi") snt = spot + marg;
    else if (c.tyyppi === "hybridi") snt = c.talviOsuus * c.talviHinta + (1 - c.talviOsuus) * (spot + marg);
    else snt = c.hinta;
    return { snt: snt, maksu: maksu };
  }

  function laskeVuosi(c, kwh, spot, alku) {
    var energia = 0, maksut = 0;
    for (var m = 1; m <= 12; m++) {
      var h = kuukausihinta(c, m, spot, alku);
      energia += (kwh / 12) * h.snt / 100;
      maksut += h.maksu;
    }
    return { energia: energia, maksut: maksut, yht: energia + maksut };
  }

  function arvioiKulutus() {
    var t = $("asunto").value, m2 = Math.max(10, +$("m2").value || 0), hlo = Math.max(1, +$("hlo").value || 1), k = 0;
    if (t === "kerrostalo") k = 1100 + 20 * m2;
    if (t === "rivi-kauko") k = 1500 + 30 * m2;
    if (t === "rivi-sahko") k = 130 * m2;
    if (t === "okt-kauko") k = 2500 + 25 * m2;
    if (t === "okt-pumppu") k = 100 * m2;
    if (t === "okt-sahko") k = 160 * m2;
    k += Math.max(0, hlo - 2) * 300;
    if ($("sauna").checked) k += (+$("saunaKerrat").value || 0) * 7.5 * 52;
    if ($("lattia").checked) k += 400;
    if ($("auto").checked) k += (+$("autoKm").value || 0) * 0.2;
    return Math.round(k / 100) * 100;
  }

  function asetaKwh(k, lahde) {
    k = Math.max(0, Math.min(100000, Math.round(+k || 0)));
    tila.kwh = k;
    var liuku = $("liuku");
    if (lahde !== "liuku") liuku.value = kwhLiuku(k);
    liuku.style.setProperty("--tayttö", (liuku.value / 10) + "%");
    if (lahde !== "kentta") $("kwh").value = k;
    $("kuukausittain").textContent = "≈ " + e(k / 12) + " kWh kuukaudessa";
    document.querySelectorAll(".esivalinnat button").forEach(function (b) {
      b.classList.toggle("valittu", +b.dataset.kwh === k);
    });
    paivita();
  }

  function paivita() {
    var kwh = tila.kwh;
    var spot = parseFloat(String($("spot").value).replace(",", "."));
    if (isNaN(spot)) spot = window.OLETUS_POSSI_KESKIHINTA;
    var piilotetut = 0, rivit = [];
    window.SOPIMUKSET.forEach(function (c) {
      if (tila.suodatin !== "kaikki" && c.tyyppi !== tila.suodatin) return;
      if (c.maxKwh && kwh > c.maxKwh) { piilotetut++; return; }
      rivit.push({ c: c, eka: laskeVuosi(c, kwh, spot, true), jatko: laskeVuosi(c, kwh, spot, false) });
    });
    var avain = tila.jarjestys;
    rivit.sort(function (a, b) {
      if (avain === "jatko") return a.jatko.yht - b.jatko.yht;
      if (avain === "maksu") return a.c.maksu - b.c.maksu || a.eka.yht - b.eka.yht;
      return a.eka.yht - b.eka.yht;
    });

    var el = $("tulokset");
    $("tulosmaara").textContent = rivit.length + " sopimusta · " + e(kwh) + " kWh/v";
    if (!kwh || !rivit.length) { el.innerHTML = '<div class="tyhja">Valitse kulutus nähdäksesi vertailun.</div>'; return; }
    var halvin = Math.min.apply(null, rivit.map(function (r) { return avain === "jatko" ? r.jatko.yht : r.eka.yht; }));

    el.innerHTML = rivit.map(function (r, i) {
      var c = r.c, paaHinta = avain === "jatko" ? r.jatko : r.eka;
      var tyyppiLuokka = c.tyyppi === "porssi" || c.tyyppi === "hybridi" ? "porssi" : "kiintea";
      var hintaTxt = c.tyyppi === "porssi" ? "Pörssihinta + " + d2(c.marginaali) + " snt/kWh"
        : c.tyyppi === "hybridi" ? "Talvi " + d2(c.talviHinta) + " snt, kesä pörssi + " + d2(c.marginaali) + " snt"
        : d2(c.hinta) + " snt/kWh";
      var merkit = '<span class="merkki ' + tyyppiLuokka + '">' + TYYPIT[c.tyyppi] + '</span>' +
        '<span class="merkki">Kesto: ' + esc(c.kesto) + '</span>' +
        (c.alku ? '<span class="merkki">Tarjousjakso ' + c.alku.kk + ' kk</span>' : "") +
        (c.tyyppi === "toistaiseksi" ? '<span class="merkki varoitus">Hinta voi muuttua</span>' : "") +
        (c.maxKwh ? '<span class="merkki">Max ' + e(c.maxKwh) + ' kWh/v</span>' : "");
      var ero = paaHinta.yht - halvin;
      var eroTxt = i === 0 || ero < 1 ? "Edullisin valinnoillasi" : "+" + e(ero) + " €/v edullisimpaan verrattuna";
      var jatkoEro = Math.abs(r.jatko.yht - r.eka.yht) >= 1;
      var cta = c.linkki
        ? '<a class="cta" href="' + esc(c.linkki) + '" target="_blank" rel="sponsored nofollow noopener">Katso tarjous <span aria-hidden="true">→</span></a>'
        : '<span class="ei-linkkia">Tilaus tarjoajan omilta sivuilta</span>';
      var tiedot = [];
      tiedot.push("Energian hinta: " + hintaTxt);
      tiedot.push("Perusmaksu: " + d2(c.maksu) + " €/kk" + (c.alku && c.alku.maksu !== undefined ? " (tarjousjaksolla " + d2(c.alku.maksu) + " €/kk)" : ""));
      if (c.alku && c.alku.marginaali !== undefined) tiedot.push("Marginaali tarjousjaksolla " + d2(c.alku.marginaali) + " snt/kWh");
      if (c.tyyppi === "porssi" || c.tyyppi === "hybridi") tiedot.push("Laskelmassa pörssihinnan keskiarvo " + d2(spot) + " snt/kWh");
      if (jatkoEro) tiedot.push("Tarjousjakson jälkeen arviolta " + e(r.jatko.yht) + " €/v");
      if (c.huom) tiedot.push(esc(c.huom));
      return '<article class="tulos' + (i === 0 ? " paras" : "") + '">' +
        (i === 0 ? '<span class="nauha">Edullisin</span>' : "") +
        '<div class="tulos-paa"><div><div class="tarjoaja">' + esc(c.tarjoaja) + '</div><div class="sopimus">' + esc(c.nimi) + '</div><div class="merkit">' + merkit + '</div></div>' +
        '<div class="hinta"><strong>' + e(paaHinta.yht) + ' €</strong><span>' + (avain === "jatko" ? "vuodessa jatkossa" : "ensimmäinen vuosi") + '<br>≈ ' + e(paaHinta.yht / 12) + ' €/kk</span></div></div>' +
        '<div class="erittely"><div>Energia<b>' + e(paaHinta.energia) + ' €/v</b></div><div>Perusmaksut<b>' + e(paaHinta.maksut) + ' €/v</b></div><div>Keskihinta<b>' + d2(paaHinta.yht / kwh * 100) + ' snt/kWh</b></div></div>' +
        '<details><summary>Näin hinta laskettiin</summary><ul><li>' + tiedot.join("</li><li>") + '</li></ul></details>' +
        '<div class="tulos-ala"><span class="ero">' + eroTxt + '</span>' + cta + '</div></article>';
    }).join("") + (piilotetut ? '<p class="pieni">' + piilotetut + ' sopimusta piilotettu, koska niillä on kulutusraja, jonka kulutuksesi ylittää.</p>' : "");
  }

  /* Tapahtumat */
  $("liuku").addEventListener("input", function () { asetaKwh(liukuKwh(+this.value), "liuku"); });
  $("kwh").addEventListener("input", function () { asetaKwh(this.value, "kentta"); });
  document.querySelectorAll(".esivalinnat button").forEach(function (b) {
    b.addEventListener("click", function () { asetaKwh(+b.dataset.kwh); });
  });
  document.querySelectorAll("[data-suodatin]").forEach(function (b) {
    b.addEventListener("click", function () {
      tila.suodatin = b.dataset.suodatin;
      document.querySelectorAll("[data-suodatin]").forEach(function (x) {
        x.classList.toggle("aktiivinen", x === b); x.setAttribute("aria-pressed", x === b);
      });
      paivita();
    });
  });
  $("jarjestys").addEventListener("change", function () { tila.jarjestys = this.value; paivita(); });
  $("spot").addEventListener("input", paivita);
  ["sauna", "auto"].forEach(function (id) {
    $(id).addEventListener("change", function () { $(id + "Osio").hidden = !this.checked; });
  });
  $("kayta-arvio").addEventListener("click", function () {
    asetaKwh(arvioiKulutus());
    $("arvioTulos").textContent = "Arvio: " + e(tila.kwh) + " kWh/v. Arvo siirrettiin laskuriin.";
    if (window.innerWidth < 900) $("tulosalue").scrollIntoView({ behavior: "smooth" });
  });

  $("spot").value = String(window.OLETUS_POSSI_KESKIHINTA).replace(".", ",");
  var pv = new Date(window.SOPIMUKSET_PAIVITETTY).toLocaleDateString("fi-FI");
  document.querySelectorAll("[data-paivitetty]").forEach(function (x) { x.textContent = pv; });
  asetaKwh(tila.kwh);
})();
