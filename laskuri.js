(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  if (!$("tulokset")) return;

  var TYYPIT = { kiintea12: "Kiinteä 12 kk", kiintea24: "Kiinteä 24 kk", kulutusvaikutteinen: "Hybridi (kulutusvaikutteinen)", toistaiseksi: "Kiinteä, toistaiseksi", porssi: "Pörssisähkö", hybridi: "Hybridi" };
  var MIN = 500, MAX = 30000;
  var tila = { kwh: 2000, suodatin: "kaikki", jarjestys: "eka", kaikki: false };
  var NAYTA = 6;

  function logo(t) { var f = window.LOGOT && window.LOGOT[t]; return f ? '<img class="tulos-logo" src="/kuvat/logot/' + f + '.png" alt="' + t + '" width="150" height="50" loading="lazy">' : ""; }
  function e(n) { return Math.round(n).toLocaleString("fi-FI"); }
  function d2(n) { return n.toLocaleString("fi-FI", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* Liukusäädin: neliöllinen asteikko, jotta pienet kulutukset ovat tarkkoja */
  function liukuKwh(v) { var t = v / 1000; return Math.round((MIN + (MAX - MIN) * t * t) / 100) * 100; }
  function kwhLiuku(k) { var t = Math.sqrt(Math.max(0, (k - MIN) / (MAX - MIN))); return Math.round(Math.min(1, t) * 1000); }

  /* Tarjousjaksot: vaiheet [{asti, maksu?, marginaali?, hinta?}] */
  window.SOPIMUKSET.forEach(function (c) {
    if (c.vaiheet && c.vaiheet.length) {
      var v = c.vaiheet[0];
      c.alku = { kk: c.vaiheet[c.vaiheet.length - 1].asti, maksu: v.maksu, marginaali: v.marginaali, ekaKk: v.asti };
    }
  });

  /* Kulutusprofiili: pörssihinta painotettuna sen mukaan, milloin sähköä käytetään */
  var T = window.SPOT_TAULU || [];
  var PROFIILIT = {
    tasainen: { h: [0.6,0.5,0.5,0.5,0.5,0.6,0.8,1,1,0.9,0.9,0.9,0.9,0.9,0.9,1,1.2,1.5,1.6,1.5,1.4,1.2,1,0.8], m: [1.15,1.05,1,0.95,0.9,0.85,0.85,0.9,0.95,1.05,1.15,1.2] },
    lammitys: { h: [0.9,0.85,0.85,0.85,0.85,0.9,1,1.1,1.1,1,1,1,1,1,1,1,1.1,1.2,1.25,1.2,1.15,1.1,1,0.95], m: [1.75,1.6,1.35,0.95,0.6,0.35,0.3,0.35,0.6,0.95,1.35,1.7] },
    ajoitettu: { h: [2,2,2,2,2,1.6,0.7,0.5,0.5,0.5,0.6,0.6,0.6,0.6,0.6,0.6,0.5,0.5,0.5,0.5,0.6,0.9,1.5,2], m: [1.15,1.05,1,0.95,0.9,0.85,0.85,0.9,0.95,1.05,1.15,1.2] }
  };
  function painotettu(f) { // f(kk, vkl, tunti) -> paino
    var sw = 0, sp = 0;
    for (var m = 0; m < 12; m++) for (var w = 0; w < 2; w++) for (var h = 0; h < 24; h++) {
      var p = f(m, w, h) * (w ? 2 : 5); var i = m * 48 + w * 24 + h;
      if (T[i] === undefined) continue; sw += p; sp += p * T[i];
    }
    return sw ? sp / sw : window.OLETUS_POSSI_KESKIHINTA;
  }
  function profiiliSpot(nimi) { var P = PROFIILIT[nimi]; return painotettu(function (m, w, h) { return P.m[m] * P.h[h]; }); }
  var PERUS_SPOT = T.length ? profiiliSpot("tasainen") : window.OLETUS_POSSI_KESKIHINTA;
  function kuukausihinta(c, kk, spot, alkuKaytossa) {
    var a = null;
    if (alkuKaytossa && c.vaiheet) for (var i = 0; i < c.vaiheet.length; i++) { if (kk <= c.vaiheet[i].asti) { a = c.vaiheet[i]; break; } }
    var maksu = a && a.maksu !== undefined ? a.maksu : c.maksu;
    var marg = a && a.marginaali !== undefined ? a.marginaali : c.marginaali;
    var snt;
    if (c.tyyppi === "porssi") {
      if (c.ilmainenKk) { var kkKwh = Math.max(1, tila.kwh / 12); marg = marg * Math.max(0, kkKwh - c.ilmainenKk) / kkKwh; }
      snt = spot + marg;
    }
    else if (c.tyyppi === "kulutusvaikutteinen") snt = (a && a.hinta !== undefined ? a.hinta : c.hinta) + (spot - PERUS_SPOT);
    else if (c.tyyppi === "hybridi") snt = c.talviOsuus * c.talviHinta + (1 - c.talviOsuus) * (spot + marg);
    else snt = a && a.hinta !== undefined ? a.hinta : c.hinta;
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
      if (tila.suodatin !== "kaikki" && c.tyyppi !== tila.suodatin && !(tila.suodatin === "hybridi" && c.tyyppi === "kulutusvaikutteinen")) return;
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

    var naytettavat = tila.kaikki ? rivit : rivit.slice(0, NAYTA);
    var hinnat = rivit.map(function (r) { return avain === "jatko" ? r.jatko.yht : r.eka.yht; }).sort(function (a, b) { return a - b; });
    var kallein = hinnat[hinnat.length - 1], mediaani = hinnat[Math.floor(hinnat.length / 2)];
    var eka = rivit[0], ekaH = avain === "jatko" ? eka.jatko : eka.eka;
    var yhteenveto = '<div class="yhteenveto"><div><span class="yv-otsake">Halvin sinulle</span><strong>' + esc(eka.c.tarjoaja) + ' ' + esc(eka.c.nimi) + '</strong><span>≈ ' + e(ekaH.yht / 12) + ' €/kk · ' + e(ekaH.yht) + ' €/v</span></div>' +
      (kallein - halvin >= 10 ? '<div class="yv-saasto"><span class="yv-otsake">Ero kalleimpaan</span><strong>' + e(kallein - halvin) + ' €</strong><span>vuodessa</span></div>' : '') + '</div>';
    el.innerHTML = yhteenveto + naytettavat.map(function (r, i) {
      var c = r.c, paaHinta = avain === "jatko" ? r.jatko : r.eka;
      var tyyppiLuokka = c.tyyppi === "porssi" || c.tyyppi === "hybridi" ? "porssi" : "kiintea";
      var hintaTxt = c.tyyppi === "porssi" ? "Pörssihinta + " + d2(c.marginaali) + " snt/kWh"
        : c.tyyppi === "hybridi" ? "Talvi " + d2(c.talviHinta) + " snt, kesä pörssi + " + d2(c.marginaali) + " snt"
        : d2(c.hinta) + " snt/kWh";
      var alkuMarg = c.alku && c.alku.marginaali !== undefined;
      var hintarivi = c.tyyppi === "porssi"
        ? '<div class="hintarivi"><span class="hr-otsake">Marginaali</span><b>' + d2(alkuMarg ? c.alku.marginaali : c.marginaali) + ' snt/kWh</b>' + (alkuMarg ? '<span class="hr-lisa">ensimmäiset ' + c.alku.ekaKk + ' kk, sen jälkeen ' + d2(c.marginaali) + ' snt</span>' : '<span class="hr-lisa">+ pörssihinta</span>') + '</div>'
        : c.tyyppi === "hybridi"
        ? '<div class="hintarivi"><span class="hr-otsake">Marginaali</span><b>' + d2(c.marginaali) + ' snt/kWh</b><span class="hr-lisa">kesällä + pörssihinta, talvella kiinteä ' + d2(c.talviHinta) + ' snt</span></div>'
        : '<div class="hintarivi"><span class="hr-otsake">Energian hinta</span><b>' + d2(c.hinta) + ' snt/kWh</b><span class="hr-lisa">' + (c.tyyppi === "kulutusvaikutteinen" ? "+/- kulutusvaikutus" : "kiinteä") + '</span></div>';
      var merkit = '<span class="merkki ' + tyyppiLuokka + '">' + TYYPIT[c.tyyppi] + '</span>' +
        '<span class="merkki">Kesto: ' + esc(c.kesto) + '</span>' +
        (c.alku ? '<span class="merkki">Tarjousjakso ' + c.alku.kk + ' kk</span>' : "") +
        (c.tyyppi === "toistaiseksi" ? '<span class="merkki varoitus">Hinta voi muuttua</span>' : "") +
        (c.maxKwh ? '<span class="merkki">Max ' + e(c.maxKwh) + ' kWh/v</span>' : "");
      var ero = paaHinta.yht - halvin;
      var saasto = mediaani - paaHinta.yht;
      var eroTxt = i === 0 || ero < 1 ? "Edullisin valinnoillasi" + (saasto >= 10 ? " · " + e(saasto) + " €/v halvempi kuin vertailun keskitaso" : "") : (saasto >= 10 ? e(saasto) + " €/v halvempi kuin keskitaso" : "+" + e(ero) + " €/v edullisimpaan verrattuna");
      var jatkoEro = Math.abs(r.jatko.yht - r.eka.yht) >= 1;
      var cta = c.linkki
        ? '<span class="cta-ryhma">' + (c.sivu ? '<a class="lisaa-linkki" href="' + esc(c.sivu) + '">Lue lisää</a>' : '') + '<a class="cta" href="' + esc(c.linkki) + '" target="_blank" rel="sponsored nofollow noopener">Katso tarjous <span aria-hidden="true">→</span></a></span>'
        : (c.url ? '<a class="cta toissij" href="' + esc(c.url) + '" target="_blank" rel="nofollow noopener">Tarjoajan sivuille <span aria-hidden="true">↗</span></a>' : '<span class="ei-linkkia">Tilaus tarjoajan omilta sivuilta</span>');
      var tiedot = [];
      tiedot.push("Energian hinta: " + hintaTxt);
      tiedot.push("Perusmaksu: " + d2(c.maksu) + " €/kk" + (c.alku && c.alku.maksu !== undefined ? " (tarjousjaksolla " + d2(c.alku.maksu) + " €/kk)" : ""));
      if (c.alku && c.alku.marginaali !== undefined) tiedot.push("Marginaali tarjousjaksolla " + d2(c.alku.marginaali) + " snt/kWh");
      if (c.tyyppi === "kulutusvaikutteinen") tiedot.push("Arvioitu kulutusvaikutus kulutusprofiilillasi " + (spot - PERUS_SPOT >= 0 ? "+" : "") + d2(spot - PERUS_SPOT) + " snt/kWh");
      if (c.tyyppi === "porssi" || c.tyyppi === "hybridi") tiedot.push("Laskelmassa pörssihinta kulutusprofiilillasi " + d2(spot) + " snt/kWh");
      if (jatkoEro) tiedot.push("Tarjousjakson jälkeen arviolta " + e(r.jatko.yht) + " €/v");
      if (c.huom) tiedot.push(esc(c.huom));
      return '<article class="tulos' + (i === 0 ? " paras" : "") + '">' +
        (i === 0 ? '<span class="nauha">Edullisin</span>' : "") +
        '<div class="tulos-paa"><div>' + logo(c.tarjoaja) + '<div class="tarjoaja">' + esc(c.tarjoaja) + '</div><div class="sopimus">' + esc(c.nimi) + '</div>' + hintarivi + '<div class="merkit">' + merkit + '</div></div>' +
        '<div class="hinta"><strong>' + e(paaHinta.yht) + ' €</strong><span>' + (avain === "jatko" ? "vuodessa jatkossa" : "ensimmäinen vuosi") + '</span><em class="kk-hinta">≈ ' + e(paaHinta.yht / 12) + ' €/kk</em></div></div>' +
        '<div class="erittely"><div>Energia<b>' + e(paaHinta.energia) + ' €/v</b></div><div>Perusmaksut<b>' + e(paaHinta.maksut) + ' €/v</b></div><div>Keskihinta<b>' + d2(paaHinta.yht / kwh * 100) + ' snt/kWh</b></div></div>' +
        '<details><summary>Näin hinta laskettiin</summary><ul><li>' + tiedot.join("</li><li>") + '</li></ul></details>' +
        '<div class="tulos-ala"><span class="ero">' + eroTxt + '</span>' + cta + '</div></article>';
    }).join("") + (rivit.length > NAYTA ? '<button type="button" class="nayta-lisaa" id="naytaLisaa">' + (tila.kaikki ? "Näytä vähemmän" : "Näytä kaikki " + rivit.length + " sopimusta") + '</button>' : "") + (piilotetut ? '<p class="pieni">' + piilotetut + ' sopimusta piilotettu, koska niillä on kulutusraja, jonka kulutuksesi ylittää.</p>' : "");
  }

  /* Tapahtumat */
  $("tulokset").addEventListener("click", function (ev) {
    if (ev.target.id !== "naytaLisaa") return;
    tila.kaikki = !tila.kaikki; paivita();
    if (!tila.kaikki) $("tulosalue").scrollIntoView({ behavior: "smooth" });
  });
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
  /* Kulutusprofiili ja Datahub-tiedosto */
  function asetaSpot(v, teksti) {
    $("spot").value = d2(v).replace(/\s/g, "");
    var t = $("profiiliTulos"); if (t) t.innerHTML = teksti;
    paivita();
  }
  function profiiliTeksti(v) {
    var ero = v - window.OLETUS_POSSI_KESKIHINTA;
    return 'Pörssisähkön hinta kulutuksellasi: <b>' + d2(v) + ' snt/kWh</b> (12 kk keskiarvo ' + d2(window.OLETUS_POSSI_KESKIHINTA) + ' snt, ' + (ero >= 0 ? "+" : "") + d2(ero) + ' snt).';
  }
  document.querySelectorAll("[data-profiili]").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll("[data-profiili]").forEach(function (x) { x.classList.toggle("valittu", x === b); x.setAttribute("aria-pressed", x === b); });
      var v = profiiliSpot(b.dataset.profiili); asetaSpot(v, profiiliTeksti(v));
    });
  });
  function lueAika(t) {
    t = t.replace(/^"|"$/g, "").trim();
    var m = t.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/);
    if (m) {
      if (/Z$|[+-]\d{2}:?\d{2}$/.test(t)) { var d = new Date(t); if (isNaN(d)) return null; var l = new Date(d.toLocaleString("en-US", { timeZone: "Europe/Helsinki" })); return { m: l.getMonth(), d: l.getDay(), h: l.getHours(), t: d.getTime() }; }
      var d2_ = new Date(+m[1], +m[2] - 1, +m[3], +m[4]); return { m: d2_.getMonth(), d: d2_.getDay(), h: d2_.getHours(), t: d2_.getTime() };
    }
    m = t.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})\s+(\d{1,2})[:.](\d{2})/);
    if (m) { var d3 = new Date(+m[3], +m[2] - 1, +m[1], +m[4]); return { m: d3.getMonth(), d: d3.getDay(), h: d3.getHours(), t: d3.getTime() }; }
    return null;
  }
  function lueCsv(teksti) {
    var rivit = teksti.split(/\r?\n/), erotin = (rivit[0] || "").indexOf(";") >= 0 ? ";" : ",";
    var kerta = [], min = Infinity, max = -Infinity, yht = 0;
    var kwh = new Array(576).fill(0);
    rivit.forEach(function (r) {
      var osat = r.split(erotin); if (osat.length < 2) return;
      var aika = null, ai = -1;
      for (var i = 0; i < osat.length; i++) { aika = lueAika(osat[i]); if (aika) { ai = i; break; } }
      if (!aika) return;
      var arvo = NaN;
      for (var j = osat.length - 1; j > ai; j--) { var v = parseFloat(osat[j].replace(/"/g, "").replace(",", ".")); if (!isNaN(v) && /^\s*"?-?\d+([.,]\d+)?"?\s*$/.test(osat[j])) { arvo = v; break; } }
      if (isNaN(arvo) || arvo < 0) return;
      var w = aika.d === 0 || aika.d === 6 ? 1 : 0;
      kwh[aika.m * 48 + w * 24 + aika.h] += arvo; yht += arvo;
      if (aika.t < min) min = aika.t; if (aika.t > max) max = aika.t;
    });
    if (yht <= 0) return null;
    var paivat = Math.max(1, (max - min) / 864e5 + 1 / 24);
    var sp = 0; for (var k = 0; k < 576; k++) sp += kwh[k] * (T[k] || 0);
    return { kwh: yht, paivat: paivat, spot: sp / yht, vuosi: paivat >= 360 ? yht * 365 / paivat : yht * 365 / paivat };
  }
  var tiedosto = $("datahubTiedosto");
  if (tiedosto) tiedosto.addEventListener("change", function () {
    var f = this.files && this.files[0]; if (!f) return;
    var lukija = new FileReader();
    lukija.onload = function () {
      var r = lueCsv(String(lukija.result));
      var tulos = $("datahubTulos");
      if (!r) { tulos.textContent = "Tiedostosta ei löytynyt kulutustietoja. Tarkista, että lataat Datahubin CSV-tiedoston tunti- tai varttiarvoilla."; return; }
      document.querySelectorAll("[data-profiili]").forEach(function (x) { x.classList.remove("valittu"); x.setAttribute("aria-pressed", "false"); });
      asetaKwh(Math.round(r.vuosi / 100) * 100);
      asetaSpot(r.spot, profiiliTeksti(r.spot));
      tulos.innerHTML = "Luettu " + e(r.kwh) + " kWh " + e(r.paivat) + " päivältä" + (r.paivat < 360 ? ", muunnettu vuositasolle" : "") + ". Tiedosto käsiteltiin vain selaimessasi, eikä sitä lähetetty minnekään.";
    };
    lukija.readAsText(f);
  });

  function paivitaPikkuliuku(id, ulos, muoto) {
    var el = $(id), max = +el.max || 1;
    el.style.setProperty("--tayttö", (el.value / max * 100) + "%");
    $(ulos).textContent = muoto(+el.value);
  }
  var saunaMuoto = function (v) { return v === 1 ? "1 kerta" : v + " kertaa"; };
  var autoMuoto = function (v) { return e(v) + " km"; };
  $("saunaKerrat").addEventListener("input", function () { paivitaPikkuliuku("saunaKerrat", "saunaArvo", saunaMuoto); });
  $("autoKm").addEventListener("input", function () { paivitaPikkuliuku("autoKm", "autoArvo", autoMuoto); });
  paivitaPikkuliuku("saunaKerrat", "saunaArvo", saunaMuoto);
  paivitaPikkuliuku("autoKm", "autoArvo", autoMuoto);
  ["sauna", "auto"].forEach(function (id) {
    $(id).addEventListener("change", function () { $(id + "Osio").hidden = !this.checked; });
  });
  $("kayta-arvio").addEventListener("click", function () {
    asetaKwh(arvioiKulutus());
    $("arvioTulos").textContent = "Arvio: " + e(tila.kwh) + " kWh/v. Arvo siirrettiin laskuriin.";
    if (window.innerWidth < 900) $("tulosalue").scrollIntoView({ behavior: "smooth" });
  });

  $("spot").value = d2(T.length ? PERUS_SPOT : window.OLETUS_POSSI_KESKIHINTA).replace(/\s/g, "");
  if ($("profiiliTulos") && T.length) $("profiiliTulos").innerHTML = profiiliTeksti(PERUS_SPOT);
  var pv = new Date(window.SOPIMUKSET_PAIVITETTY).toLocaleDateString("fi-FI");
  document.querySelectorAll("[data-paivitetty]").forEach(function (x) { x.textContent = pv; });
  asetaKwh(tila.kwh);

  /* Mobiilin kelluva painike: näkyy, kun laskuri ei ole näkyvissä */
  var tarra = $("tarra"), osio = $("laskuri");
  if (tarra && osio && "IntersectionObserver" in window) {
    var nakyvissa = true, ohitettu = false;
    new IntersectionObserver(function (m) { nakyvissa = m[0].isIntersecting; paivitaTarra(); }).observe(osio);
    window.addEventListener("scroll", function () { ohitettu = window.scrollY > 400; paivitaTarra(); }, { passive: true });
    function paivitaTarra() { tarra.classList.toggle("nakyy", !nakyvissa && ohitettu); }
  }
})();
