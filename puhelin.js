(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  if (!$("liittymatulokset")) return;
  var tila = { tarve: "kaikki", nMin: 0, nMax: 500, verkko: "kaikki", rajatonPuhe: false, eiMaaraaikaa: false, operaattorit: {}, jarjestys: "k12", kaikki: false };
  var NAYTA = 8;
  var TARPEET = {
    kaikki: { min: 0, max: 500 },
    perus: { min: 0, max: 50 },
    paljon: { min: 50, max: 300 },
    nopein: { min: 300, max: 500 }
  };
  function e(n) { return Math.round(n).toLocaleString("fi-FI"); }
  function d2(n) { return n.toLocaleString("fi-FI", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function hinta(n) { return n % 1 === 0 ? e(n) : d2(n); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function kokonais(l, kk) {
    var k = l.kampanja ? Math.min(kk, l.kampanja.kk) : 0;
    return (l.avaus || 0) + k * (l.kampanja ? l.kampanja.hinta : 0) + (kk - k) * l.hinta;
  }

  var operaattorit = [];
  window.LIITTYMAT.forEach(function (l) { if (operaattorit.indexOf(l.operaattori) < 0) operaattorit.push(l.operaattori); });
  $("operaattorit").innerHTML = operaattorit.map(function (o) {
    return '<label class="valintanappi"><input type="checkbox" value="' + esc(o) + '" checked><span>' + esc(o) + '</span></label>';
  }).join("");
  operaattorit.forEach(function (o) { tila.operaattorit[o] = true; });

  function paivita() {
    var rivit = window.LIITTYMAT.filter(function (l) {
      if (!tila.operaattorit[l.operaattori]) return false;
      if (l.nopeus < tila.nMin || (tila.nMax < 500 && l.nopeus > tila.nMax)) return false;
      if (tila.verkko !== "kaikki" && l.verkko !== tila.verkko) return false;
      if (tila.rajatonPuhe && !l.rajatonPuhe) return false;
      if (tila.eiMaaraaikaa && l.sopimus && l.sopimus !== "Toistaiseksi") return false;
      return true;
    }).map(function (l) { return { l: l, k12: kokonais(l, 12), k24: kokonais(l, 24) }; });
    var j = tila.jarjestys;
    rivit.sort(function (a, b) {
      if (j === "k24") return a.k24 - b.k24;
      if (j === "nopein") return b.l.nopeus - a.l.nopeus || a.k12 - b.k12;
      if (j === "kk") return a.l.hinta - b.l.hinta;
      return a.k12 - b.k12;
    });
    $("liittymamaara").textContent = rivit.length + " liittymää";
    var el = $("liittymatulokset");
    if (!rivit.length) { el.innerHTML = '<div class="tyhja">Valinnoillasi ei löytynyt liittymiä. Kokeile poistaa jokin rajaus.</div>'; return; }
    var nayta = tila.kaikki ? rivit : rivit.slice(0, NAYTA);
    var avain = j === "k24" ? "k24" : "k12";
    el.innerHTML = nayta.map(function (r, i) {
      var l = r.l;
      var kuukausi = l.kampanja
        ? '<span class="kampanjahinta">' + d2(l.kampanja.hinta) + ' €/kk</span><span class="jatkohinta">' + l.kampanja.kk + ' kk, sen jälkeen ' + d2(l.hinta) + ' €/kk</span>'
        : '<span class="kampanjahinta">' + d2(l.hinta) + ' €/kk</span><span class="jatkohinta">Sama hinta myös jatkossa</span>';
      var cta = l.linkki
        ? '<a class="cta" href="' + esc(l.linkki) + '" target="_blank" rel="sponsored nofollow noopener">Katso tarjous <span aria-hidden="true">→</span></a>'
        : '<a class="cta toissij" href="' + esc(l.url) + '" target="_blank" rel="nofollow noopener">Operaattorin sivuille <span aria-hidden="true">↗</span></a>';
      var merkit = '<span class="merkki ' + (l.verkko === "5G" ? "porssi" : "kiintea") + '">' + l.verkko + '</span>' +
        (l.sopimus && l.sopimus !== "Toistaiseksi" ? '<span class="merkki varoitus">Määräaikainen ' + esc(l.sopimus) + '</span>' : '<span class="merkki">Ei määräaikaa</span>') +
        (!l.rajatonPuhe ? '<span class="merkki varoitus">Puhelut käytön mukaan</span>' : "") +
        (l.avaus === 0 ? '<span class="merkki kiintea">Ei avausmaksua</span>' : "") +
        (l.eSIM ? '<span class="merkki">eSIM</span>' : "");
      return '<article class="tulos liittyma' + (i === 0 ? " paras" : "") + '">' + (i === 0 && (j === "k12" || j === "k24") ? '<span class="nauha">Edullisin valinnoillasi</span>' : "") +
        '<div class="liittyma-paa"><div><div class="tarjoaja">' + esc(l.operaattori) + '</div><div class="sopimus">' + esc(l.nimi) + '</div></div>' +
        '<div class="hinta"><strong>' + d2(l.kampanja ? l.kampanja.hinta : l.hinta) + ' €<small>/kk</small></strong>' + (l.kampanja ? '<span>' + l.kampanja.kk + ' kk, sen jälkeen ' + d2(l.hinta) + ' €/kk</span>' : '<span>sama hinta jatkossa</span>') + '<em class="kk-hinta vuosi">' + e(r[avain]) + ' € / ' + (avain === "k24" ? "24" : "12") + ' kk</em></div></div>' +
        '<div class="ominaisuudet">' +
          '<div><span>Nopeus</span><b>' + e(l.nopeus) + ' Mbit/s</b></div>' +
          '<div><span>Data</span><b>' + (l.data === "rajaton" ? "Rajaton" : l.data + " GB/kk") + '</b></div>' +
          '<div><span>Puhelut ja viestit</span><b>' + (l.rajatonPuhe ? "Rajaton" : esc(l.puhelut)) + '</b></div>' +
          '<div><span>EU-data</span><b>' + (l.euData ? l.euData + " GB/kk" : "–") + '</b></div>' +
        '</div>' +
        '<div class="merkit">' + merkit + '</div>' +
        '<details><summary>Lisätiedot</summary><ul>' +
          '<li>Avausmaksu: ' + (l.avaus ? d2(l.avaus) + " €" : (l.avaus === 0 ? "0 €" : "ei tiedossa")) + '</li>' +
          '<li>Sopimus: ' + esc(l.sopimus || "tarkista operaattorilta") + '</li>' +
          '<li>Kokonaishinta 12 kk: ' + hinta(Math.round(r.k12 * 100) / 100) + ' €, 24 kk: ' + hinta(Math.round(r.k24 * 100) / 100) + ' € (sis. avausmaksun)</li>' +
          (!l.rajatonPuhe ? '<li>Puhelut ja viestit eivät sisälly hintaan: ' + esc(l.puhelut) + '</li>' : "") +
          (l.huom ? '<li>' + esc(l.huom) + '</li>' : "") +
        '</ul></details>' +
        '<div class="tulos-ala"><span class="ero">Keskimäärin ' + d2(r[avain] / (avain === "k24" ? 24 : 12)) + ' €/kk, sis. avausmaksun</span>' + cta + '</div></article>';
    }).join("") + (rivit.length > NAYTA ? '<button type="button" class="nayta-lisaa" id="naytaLisaaL">' + (tila.kaikki ? "Näytä vähemmän" : "Näytä kaikki " + rivit.length + " liittymää") + '</button>' : "");
  }

  var nMin = $("nopeusMin"), nMax = $("nopeusMax");
  function nopeusTeksti(v) { return v >= 500 ? "500+" : String(v); }
  function asetaNopeus(min, max, lahde) {
    if (min > max) { if (lahde === "min") max = min; else min = max; }
    tila.nMin = min; tila.nMax = max;
    nMin.style.zIndex = min >= 450 ? 3 : 1; nMax.style.zIndex = 2;
    nMin.value = min; nMax.value = max;
    $("nopeusArvo").textContent = (min === 0 && max >= 500) ? "Kaikki nopeudet" : nopeusTeksti(min) + "–" + nopeusTeksti(max) + " Mbit/s";
    $("nopeusTaytto").style.left = (min / 5) + "%";
    $("nopeusTaytto").style.right = (100 - max / 5) + "%";
    document.querySelectorAll("[data-tarve]").forEach(function (x) {
      var t = TARPEET[x.dataset.tarve], on = t.min === min && t.max === max;
      x.classList.toggle("valittu", on); x.setAttribute("aria-pressed", on);
    });
  }
  nMin.addEventListener("input", function () { asetaNopeus(+nMin.value, +nMax.value, "min"); paivita(); });
  nMax.addEventListener("input", function () { asetaNopeus(+nMin.value, +nMax.value, "max"); paivita(); });
  document.querySelectorAll("[data-tarve]").forEach(function (b) {
    b.addEventListener("click", function () {
      tila.tarve = b.dataset.tarve;
      asetaNopeus(TARPEET[tila.tarve].min, TARPEET[tila.tarve].max);
      document.querySelectorAll("[data-tarve]").forEach(function (x) { x.classList.toggle("valittu", x === b); x.setAttribute("aria-pressed", x === b); });
      paivita();
    });
  });
  document.querySelectorAll("[data-verkko]").forEach(function (b) {
    b.addEventListener("click", function () {
      tila.verkko = b.dataset.verkko;
      document.querySelectorAll("[data-verkko]").forEach(function (x) { x.classList.toggle("aktiivinen", x === b); x.setAttribute("aria-pressed", x === b); });
      paivita();
    });
  });
  $("rajatonPuhe").addEventListener("change", function () { tila.rajatonPuhe = this.checked; paivita(); });
  $("eiMaaraaikaa").addEventListener("change", function () { tila.eiMaaraaikaa = this.checked; paivita(); });
  $("operaattorit").addEventListener("change", function (ev) { tila.operaattorit[ev.target.value] = ev.target.checked; paivita(); });
  $("ljarjestys").addEventListener("change", function () { tila.jarjestys = this.value; paivita(); });
  $("liittymatulokset").addEventListener("click", function (ev) {
    if (ev.target.id !== "naytaLisaaL") return;
    tila.kaikki = !tila.kaikki; paivita();
  });
  var pv = new Date(window.LIITTYMAT_PAIVITETTY).toLocaleDateString("fi-FI");
  document.querySelectorAll("[data-lpaivitetty]").forEach(function (x) { x.textContent = pv; });
  asetaNopeus(0, 500);
  paivita();
})();
