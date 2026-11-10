/* SOPIMUSTIEDOT – päivitä tämä tiedosto, kun hinnat muuttuvat.
   Hinnat c/kWh sis. alv 25,5 %. Kuukausimaksut €/kk.
   tyyppi: "kiintea12" | "toistaiseksi" | "porssi" | "hybridi"
   alku: tarjousjakso { kk, maksu?, marginaali? } – voimassa ensimmäiset kk kuukautta
   linkki: lisää affiliate-linkki tähän (tyhjä = nappia ei näytetä)
   Lähde: julkiset vertailusivustot (parassahko.fi, sahkovertaaja.fi, halpasahko.com), tarkistettu alla olevana päivänä.
   TARKISTA hinnat tarjoajan omilta sivuilta ennen julkaisua. */
window.SOPIMUKSET_PAIVITETTY = "2026-11-10";
window.OLETUS_POSSI_KESKIHINTA = 6.88; // c/kWh, 12 kk keskiarvo (lähde: parassahko.fi 9.11.2026); alv-käsittely tarkistettava
window.SOPIMUKSET = [
  // Kiinteä 12 kk
  {id:"oomi-kiintea-12", tarjoaja:"Oomi", nimi:"Oomi Kiinteä 12 kk", tyyppi:"kiintea12", hinta:11.29, maksu:5.90, kesto:"12 kk", linkki:""},
  {id:"hehku-kiintea-12", tarjoaja:"Hehku Energia", nimi:"Hehku Kiinteä 12 kk", tyyppi:"kiintea12", hinta:11.59, maksu:4.90, alku:{kk:4, maksu:0}, kesto:"12 kk", linkki:""},
  {id:"nge-kiintea-12", tarjoaja:"Nordic Green Energy", nimi:"Kiinteä Sähkö 12 kk", tyyppi:"kiintea12", hinta:11.41, maksu:5.98, kesto:"12 kk", linkki:""},
  {id:"vattenfall-ilmastomix-12", tarjoaja:"Vattenfall", nimi:"Ilmasto Mix 12 kk", tyyppi:"kiintea12", hinta:11.61, maksu:5.95, kesto:"12 kk", linkki:""},
  {id:"cheap-pikku-12", tarjoaja:"Cheap Energy", nimi:"Pikku Cheap 12 kk", tyyppi:"kiintea12", hinta:11.79, maksu:2.95, kesto:"12 kk", linkki:""},
  {id:"via-vankka-12", tarjoaja:"Vihreä Älyenergia", nimi:"Vankka 12 kk", tyyppi:"kiintea12", hinta:11.49, maksu:4.99, kesto:"12 kk", huom:"Kulutusraja alle 10 000 kWh/v", maxKwh:10000, linkki:""},
  // Toistaiseksi voimassa oleva kiinteä (hinta voi muuttua ilmoituksella)
  {id:"vattenfall-kesto", tarjoaja:"Vattenfall", nimi:"Kesto", tyyppi:"toistaiseksi", hinta:13.96, maksu:4.55, kesto:"Toistaiseksi", huom:"Myyjä voi muuttaa hintaa ilmoituksella", linkki:""},
  {id:"oomi-vakaa", tarjoaja:"Oomi", nimi:"Oomi Vakaa", tyyppi:"toistaiseksi", hinta:13.90, maksu:4.96, kesto:"Toistaiseksi", huom:"Myyjä voi muuttaa hintaa ilmoituksella", linkki:""},
  {id:"hehku-jatkuva", tarjoaja:"Hehku Energia", nimi:"Hehku Jatkuva", tyyppi:"toistaiseksi", hinta:14.90, maksu:4.90, kesto:"Toistaiseksi", huom:"Myyjä voi muuttaa hintaa ilmoituksella", linkki:""},
  // Pörssisähkö (spot + marginaali)
  {id:"via-verraton", tarjoaja:"Vihreä Älyenergia", nimi:"Verraton", tyyppi:"porssi", marginaali:0.59, maksu:4.99, alku:{kk:12, maksu:0}, kesto:"Toistaiseksi", linkki:""},
  {id:"oomi-aktiivinen", tarjoaja:"Oomi", nimi:"Aktiivinen", tyyppi:"porssi", marginaali:0.60, maksu:4.96, alku:{kk:6, maksu:0}, kesto:"Toistaiseksi", linkki:""},
  {id:"vattenfall-optimi", tarjoaja:"Vattenfall", nimi:"Optimi Pörssisähkö", tyyppi:"porssi", marginaali:0.50, maksu:5.95, alku:{kk:12, maksu:2.98}, kesto:"Toistaiseksi", linkki:""},
  {id:"nge-porssi", tarjoaja:"Nordic Green Energy", nimi:"Pörssisähkö", tyyppi:"porssi", marginaali:0.68, maksu:5.98, kesto:"Toistaiseksi", linkki:""},
  {id:"cheap-porssi", tarjoaja:"Cheap Energy", nimi:"Cheap Pörssisähkö", tyyppi:"porssi", marginaali:0.78, maksu:4.90, alku:{kk:6, maksu:0, marginaali:0.39}, kesto:"Toistaiseksi", linkki:""},
  {id:"fortum-tarkka", tarjoaja:"Fortum", nimi:"Tarkka", tyyppi:"porssi", marginaali:0.59, maksu:5.99, alku:{kk:3, maksu:0}, kesto:"Toistaiseksi", linkki:""},
  {id:"helen-porssi", tarjoaja:"Helen", nimi:"Pörssisähkö", tyyppi:"porssi", marginaali:0.49, maksu:4.96, kesto:"Toistaiseksi", linkki:""},
  // Hybridi: talvella kiinteä, kesällä pörssi
  {id:"oomi-sesonki", tarjoaja:"Oomi", nimi:"Sesonki 12 kk", tyyppi:"hybridi", talviHinta:14.29, marginaali:0.50, maksu:5.90, talviOsuus:0.5, kesto:"12 kk", huom:"Talvella kiinteä hinta, kesällä pörssi + marginaali. Laskuri olettaa 50 % kulutuksesta talvikaudelle.", linkki:""}
];
