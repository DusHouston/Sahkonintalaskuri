/* SÄHKÖSOPIMUKSET – päivitä tämä tiedosto, kun hinnat muuttuvat.
   Hinnat snt/kWh sis. alv 25,5 %. Perusmaksut €/kk.
   tyyppi: "porssi" | "kiintea12" | "kiintea24" | "toistaiseksi" | "hybridi" | "kulutusvaikutteinen"
   vaiheet: tarjousjaksot [{ asti: kuukausi (mukaan lukien), maksu?, marginaali?, hinta? }]
   url: tarjoajan sivu · linkki: affiliate-linkki (kun saatu, korvaa url:n napissa)
   Lähde: parassahko.fi ja sahkovertaaja.fi, 11.11.2026. Ristiriitaisista tarjousjaksoista käytetty varovaisempaa. */
window.SOPIMUKSET_PAIVITETTY = "2026-11-11";
window.OLETUS_POSSI_KESKIHINTA = 6.88; // 12 kk keskiarvo 11/2025–10/2026, sis. alv (sahkovertaaja.fi)
var NGE = "https://go.adt246.net/t/t?a=1795805764&as=2130009455&t=2&tk=1";
var U = { fortum: "https://www.fortum.fi", oomi: "https://oomi.fi", cheap: "https://cheapenergy.fi", via: "https://vihreaalyenergia.fi", hehku: "https://hehkuenergia.fi", vattenfall: "https://www.vattenfall.fi", aalto: "https://aaltoenergia.fi", nge: "https://www.nordicgreen.fi/sahkosopimus/" };
window.SOPIMUKSET = [
  // Fortum
  {tarjoaja:"Fortum", nimi:"Tarkka", tyyppi:"porssi", marginaali:0.59, maksu:5.99, kesto:"Toistaiseksi", url:U.fortum, linkki:""},
  {tarjoaja:"Fortum", nimi:"Takuu 24 kk", tyyppi:"kiintea24", hinta:10.39, maksu:5.99, kesto:"24 kk", url:U.fortum, linkki:""},
  // Oomi
  {tarjoaja:"Oomi", nimi:"Aktiivinen", tyyppi:"porssi", marginaali:0.60, maksu:4.96, vaiheet:[{asti:6, maksu:0}], kesto:"Toistaiseksi", url:U.oomi, linkki:""},
  {tarjoaja:"Oomi", nimi:"Kiinteä 12 kk", tyyppi:"kiintea12", hinta:11.29, maksu:5.90, kesto:"12 kk", url:U.oomi, linkki:""},
  {tarjoaja:"Oomi", nimi:"Kiinteä 24 kk", tyyppi:"kiintea24", hinta:10.39, maksu:5.90, vaiheet:[{asti:9, maksu:0}], kesto:"24 kk", url:U.oomi, linkki:""},
  {tarjoaja:"Oomi", nimi:"Sesonki 12 kk", tyyppi:"hybridi", talviHinta:14.29, marginaali:0.50, maksu:5.90, talviOsuus:0.5, kesto:"12 kk", huom:"Talvella kiinteä hinta, kesällä pörssi + marginaali. Laskuri olettaa 50 % kulutuksesta talvikaudelle.", url:U.oomi, linkki:""},
  {tarjoaja:"Oomi", nimi:"Vakaa", tyyppi:"toistaiseksi", hinta:13.90, maksu:4.96, kesto:"Toistaiseksi", huom:"Myyjä voi muuttaa hintaa ilmoittamalla.", url:U.oomi, linkki:""},
  // Cheap Energy
  {tarjoaja:"Cheap Energy", nimi:"Pörssisähkö", tyyppi:"porssi", marginaali:0.78, maksu:4.90, vaiheet:[{asti:6, maksu:0, marginaali:0.39}], kesto:"Toistaiseksi", url:U.cheap, linkki:""},
  {tarjoaja:"Cheap Energy", nimi:"Pikku Cheap 12 kk", tyyppi:"kiintea12", hinta:11.79, maksu:2.95, kesto:"12 kk", url:U.cheap, linkki:""},
  {tarjoaja:"Cheap Energy", nimi:"Määräaikainen 24 kk", tyyppi:"kiintea24", hinta:10.38, maksu:4.45, vaiheet:[{asti:4, maksu:0}], kesto:"24 kk", url:U.cheap, linkki:""},
  // Vihreä Älyenergia
  {tarjoaja:"Vihreä Älyenergia", nimi:"Verraton", tyyppi:"porssi", marginaali:0.59, maksu:4.99, vaiheet:[{asti:12, maksu:0}], kesto:"Toistaiseksi", url:U.via, linkki:""},
  {tarjoaja:"Vihreä Älyenergia", nimi:"Vire Tuuli Pörssisähkö", tyyppi:"porssi", marginaali:0.99, maksu:5.99, vaiheet:[{asti:6, maksu:1.99, marginaali:0.39}], kesto:"Toistaiseksi", huom:"100 % tuulisähköä.", url:U.via, linkki:""},
  {tarjoaja:"Vihreä Älyenergia", nimi:"Vankka 12 kk", tyyppi:"kiintea12", hinta:11.49, maksu:4.99, maxKwh:7000, kesto:"12 kk", url:U.via, linkki:""},
  {tarjoaja:"Vihreä Älyenergia", nimi:"Vankka 24 kk", tyyppi:"kiintea24", hinta:11.14, maksu:4.99, maxKwh:7000, kesto:"24 kk", url:U.via, linkki:""},
  {tarjoaja:"Vihreä Älyenergia", nimi:"Vakaa Valinta", tyyppi:"toistaiseksi", hinta:15.90, maksu:5.99, maxKwh:7000, kesto:"Toistaiseksi", huom:"Myyjä voi muuttaa hintaa ilmoittamalla.", url:U.via, linkki:""},
  // Hehku Energia
  {tarjoaja:"Hehku Energia", nimi:"Flex Pörssisähkö", tyyppi:"porssi", marginaali:0.58, maksu:5.90, vaiheet:[{asti:12, maksu:0}], kesto:"Toistaiseksi", url:U.hehku, linkki:""},
  {tarjoaja:"Hehku Energia", nimi:"Pörssi", tyyppi:"porssi", marginaali:0.99, maksu:4.90, vaiheet:[{asti:4, maksu:0, marginaali:0.29}], maxKwh:50000, kesto:"Toistaiseksi", url:U.hehku, linkki:""},
  {tarjoaja:"Hehku Energia", nimi:"Kiinteä 12 kk", tyyppi:"kiintea12", hinta:11.59, maksu:4.90, vaiheet:[{asti:4, maksu:0}], kesto:"12 kk", url:U.hehku, linkki:""},
  {tarjoaja:"Hehku Energia", nimi:"Kiinteä 24 kk", tyyppi:"kiintea24", hinta:10.59, maksu:4.90, vaiheet:[{asti:6, maksu:0}], kesto:"24 kk", url:U.hehku, linkki:""},
  {tarjoaja:"Hehku Energia", nimi:"Jatkuva", tyyppi:"toistaiseksi", hinta:14.90, maksu:4.90, vaiheet:[{asti:1, maksu:0}], kesto:"Toistaiseksi", huom:"Myyjä voi muuttaa hintaa ilmoittamalla.", url:U.hehku, linkki:""},
  // Vattenfall
  {tarjoaja:"Vattenfall", nimi:"Optimi Pörssisähkö", tyyppi:"porssi", marginaali:0.50, maksu:5.95, vaiheet:[{asti:12, maksu:2.98}], kesto:"Toistaiseksi", url:U.vattenfall, linkki:""},
  {tarjoaja:"Vattenfall", nimi:"Ilmasto Mix 12 kk", tyyppi:"kiintea12", hinta:11.61, maksu:5.95, kesto:"12 kk", huom:"Fossiiliton sähkö.", url:U.vattenfall, linkki:""},
  {tarjoaja:"Vattenfall", nimi:"Ilmasto Mix 24 kk", tyyppi:"kiintea24", hinta:10.64, maksu:5.95, kesto:"24 kk", huom:"Fossiiliton sähkö.", url:U.vattenfall, linkki:""},
  {tarjoaja:"Vattenfall", nimi:"Kesto", tyyppi:"toistaiseksi", hinta:13.96, maksu:4.55, kesto:"Toistaiseksi", huom:"Myyjä voi muuttaa hintaa ilmoittamalla.", url:U.vattenfall, linkki:""},
  // Aalto Energia
  {tarjoaja:"Aalto Energia", nimi:"Luotsi Pörssisähkö", tyyppi:"porssi", marginaali:1.99, maksu:5.95, vaiheet:[{asti:3, maksu:0, marginaali:0.28},{asti:5, marginaali:0.68}], kesto:"Toistaiseksi", huom:"Marginaali 0,28 snt 3 kk, sitten 0,68 snt 30.4.2027 asti, sen jälkeen 1,99 snt.", url:U.aalto, linkki:""},
  {tarjoaja:"Aalto Energia", nimi:"Ankkuri Kiinteä 12 kk", tyyppi:"kiintea12", hinta:11.39, maksu:5.95, vaiheet:[{asti:1, maksu:0}], maxKwh:10000, kesto:"12 kk", url:U.aalto, linkki:""},
  {tarjoaja:"Aalto Energia", nimi:"Ankkuri Kiinteä 24 kk", tyyppi:"kiintea24", hinta:10.39, maksu:5.95, vaiheet:[{asti:3, maksu:0}], maxKwh:10000, kesto:"24 kk", url:U.aalto, linkki:""},
  {tarjoaja:"Aalto Energia", nimi:"Tyyni Vakiohinta", tyyppi:"toistaiseksi", hinta:15.90, maksu:5.95, vaiheet:[{asti:1, maksu:0, hinta:10.79}], kesto:"Toistaiseksi", huom:"Myyjä voi muuttaa hintaa ilmoittamalla.", url:U.aalto, linkki:""},
  // Nordic Green Energy – hinnat tarkistettu nordicgreen.fi 13.11.2026 (sis. alv 25,5 %)
  {tarjoaja:"Nordic Green Energy", nimi:"Pörssisähkö", tyyppi:"porssi", marginaali:0.68, maksu:5.98, vaiheet:[{asti:6, maksu:0, marginaali:0.34}], kesto:"Toistaiseksi", huom:"Kampanja: kuukausimaksu 0 € ja marginaali 0,34 snt/kWh ensimmäiset 6 kuukautta. Alkuperätodennettua fossiilivapaata ydinvoimaa.", url:U.nge, linkki:NGE, sivu:"/sahkoyhtiot/nordic-green-energy/"},
  {tarjoaja:"Nordic Green Energy", nimi:"Pörssisähkö ilman kuukausimaksua", tyyppi:"porssi", marginaali:1.49, maksu:0, kesto:"Toistaiseksi", huom:"Ei kuukausimaksua.", url:U.nge, linkki:NGE, sivu:"/sahkoyhtiot/nordic-green-energy/"},
  {tarjoaja:"Nordic Green Energy", nimi:"Kiinteä Sähkö 12 kk", tyyppi:"kiintea12", hinta:11.41, maksu:5.98, vaiheet:[{asti:2, maksu:0}], maxKwh:20000, kesto:"12 kk", huom:"Kuukausimaksu 0 € kaksi ensimmäistä kuukautta. Vuosikulutus alle 20 000 kWh.", url:U.nge, linkki:NGE, sivu:"/sahkoyhtiot/nordic-green-energy/"},
  {tarjoaja:"Nordic Green Energy", nimi:"Hybridi 24 kk", tyyppi:"kulutusvaikutteinen", hinta:9.99, maksu:5.98, maxKwh:3000, kesto:"24 kk", huom:"Kiinteä hinta + kulutusvaikutus (+/-). Laskelmassa kulutusvaikutus 0. Vuosikulutus alle 3 000 kWh.", url:U.nge, linkki:NGE, sivu:"/sahkoyhtiot/nordic-green-energy/"},
  {tarjoaja:"Nordic Green Energy", nimi:"Älylataajan pörssisähkö", tyyppi:"porssi", marginaali:0.59, maksu:12.99, kesto:"Toistaiseksi", huom:"Sähköautoilijoille: jokaisen kuukauden ensimmäiset 175 kWh yölatausta ilman spot-hintaa ja marginaalia (ei huomioitu laskelmassa). Sisältää sovelluksen Plus-ominaisuudet. Tarjous voimassa 15.12.2026 asti.", url:U.nge, linkki:NGE, sivu:"/sahkoyhtiot/nordic-green-energy/"}
];
