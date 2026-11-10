(function () {
  var $ = function (id) { return document.getElementById(id); };
  var TYYPIT = {kiintea12:"Kiinteä 12 kk", toistaiseksi:"Toistaiseksi voimassa", porssi:"Pörssisähkö", hybridi:"Hybridi"};
  var suodatin = "kaikki";

  function fmt(n) { return Math.round(n).toLocaleString("fi-FI"); }
  function fmt2(n) { return n.toLocaleString("fi-FI", {minimumFractionDigits:2, maximumFractionDigits:2}); }

  function vuosikulutus(c, kwh, spot) {
    var kk = kwh / 12, summa = 0;
    for (var m = 1; m <= 12; m++) {
      var a = c.alku && m <= c.alku.kk ? c.alku : null;
      var maksu = a && a.maksu !== undefined ? a.maksu : c.maksu;
      var marg = a && a.marginaali !== undefined ? a.marginaali : c.marginaali;
      var hinta;
      if (c.tyyppi === "porssi") hinta = spot + marg;
      else if (c.tyyppi === "hybridi") hinta = c.talviOsuus * c.talviHinta + (1 - c.talviOsuus) * (spot + marg);
      else hinta = c.hinta;
      summa += kk * hinta / 100 + maksu;
    }
    return summa;
  }

  function arvioiKulutus() {
    var tyyppi = $("asuntotyyppi").value;
    var m2 = Math.max(10, +$("neliot").value || 0);
    var hlo = Math.max(1, +$("henkilot").value || 1);
    var kwh = 0;
    if (tyyppi === "kerrostalo") kwh = 1100 + 20 * m2;
    if (tyyppi === "rivi-kauko") kwh = 1500 + 30 * m2;
    if (tyyppi === "rivi-sahko") kwh = 130 * m2;
    if (tyyppi === "oktalo-kauko") kwh = 2500 + 25 * m2;
    if (tyyppi === "oktalo-pumppu") kwh = 100 * m2;
    if (tyyppi === "oktalo-sahko") kwh = 160 * m2;
    kwh += Math.max(0, hlo - 2) * 300;
    if ($("sauna").checked) kwh += (+$("saunaKerrat").value || 0) * 7.5 * 52;
    if ($("lattia").checked) kwh += 400;
    if ($("auto").checked) kwh += (+$("autoKm").value || 0) * 0.2;
    return Math.round(kwh / 50) * 50;
  }

  function nykyinenKulutus() {
    return $("tapa").value === "oma" ? (+$("kulutus").value || 0) : arvioiKulutus();
  }

  function paivitaTapa() {
    var oma = $("tapa").value === "oma";
    $("omaosio").hidden = !oma;
    $("arvioosio").hidden = oma;
    $("saunaosio").hidden = !$("sauna").checked;
    $("autoosio").hidden = !$("auto").checked;
  }

  function laske() {
    paivitaTapa();
    var kwh = nykyinenKulutus();
    var spot = +$("spot").value;
    if (isNaN(spot)) spot = window.OLETUS_POSSI_KESKIHINTA;
    $("kulutusNaytto").textContent = fmt(kwh) + " kWh / vuosi";
    var tulokset = [];
    window.SOPIMUKSET.forEach(function (c) {
      if (c.maxKwh && kwh > c.maxKwh) return;
      if (suodatin !== "kaikki" && c.tyyppi !== suodatin) return;
      tulokset.push({c:c, hinta:vuosikulutus(c, kwh, spot)});
    });
    tulokset.sort(function (a, b) { return a.hinta - b.hinta; });
    var lista = $("tulokset");
    lista.innerHTML = "";
    if (!kwh || !tulokset.length) {
      lista.innerHTML = '<p class="tyhja">Syötä kulutus nähdäksesi vertailun.</p>';
      return;
    }
    var halvin = tulokset[0].hinta;
    tulokset.forEach(function (t, i) {
      var c = t.c;
      var li = document.createElement("article");
      li.className = "tulos" + (i === 0 ? " halvin" : "");
      var cta = c.linkki ? '<a class="nappi" href="' + c.linkki + '" target="_blank" rel="sponsored nofollow noopener">Siirry tarjoajalle →</a>' : "";
      var kuvaus = c.tyyppi === "porssi" ? "Marginaali " + fmt2(c.marginaali).replace(",", ",") + " c/kWh + pörssihinta" :
                   c.tyyppi === "hybridi" ? "Talvi " + fmt2(c.talviHinta) + " c/kWh, kesä pörssi + " + fmt2(c.marginaali) + " c/kWh" :
                   fmt2(c.hinta) + " c/kWh";
      var alkuTxt = c.alku ? '<li>Tarjousjakso ensimmäiset ' + c.alku.kk + ' kk (sisältyy laskelmaan)</li>' : "";
      li.innerHTML =
        '<div class="tulos-ylä">' +
          (i === 0 ? '<span class="merkki">Halvin</span>' : '<span class="sija">' + (i + 1) + '.</span>') +
          '<div class="tulos-nimi"><strong>' + c.tarjoaja + '</strong><span>' + c.nimi + '</span></div>' +
          '<div class="tulos-hinta"><strong>' + fmt(t.hinta) + ' €</strong><span>/ vuosi · ' + fmt(t.hinta / 12) + ' €/kk</span></div>' +
        '</div>' +
        '<ul class="tiedot">' +
          '<li>' + TYYPIT[c.tyyppi] + ' · ' + c.kesto + '</li>' +
          '<li>' + kuvaus + ' + ' + fmt2(c.maksu) + ' €/kk perusmaksu</li>' +
          alkuTxt +
          (c.huom ? '<li>' + c.huom + '</li>' : "") +
          (i > 0 ? '<li>+' + fmt(t.hinta - halvin) + ' € / vuosi halvimpaan verrattuna</li>' : "") +
        '</ul>' + cta;
      lista.appendChild(li);
    });
  }

  document.querySelectorAll("[data-suodatin]").forEach(function (b) {
    b.addEventListener("click", function () {
      suodatin = b.getAttribute("data-suodatin");
      document.querySelectorAll("[data-suodatin]").forEach(function (x) { x.classList.toggle("aktiivinen", x === b); });
      laske();
    });
  });
  document.querySelectorAll("#lomake input, #lomake select").forEach(function (e) {
    e.addEventListener("input", laske);
    e.addEventListener("change", laske);
  });
  $("spot").value = window.OLETUS_POSSI_KESKIHINTA;
  $("paivitetty").textContent = new Date(window.SOPIMUKSET_PAIVITETTY).toLocaleDateString("fi-FI");
  laske();
})();
