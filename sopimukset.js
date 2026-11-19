/* SÄHKÖSOPIMUKSET – vain yhteistyökumppanit. Päivitä, kun hinnat muuttuvat.
   Hinnat snt/kWh sis. alv 25,5 %. Perusmaksut €/kk.
   tyyppi: "porssi" | "kiintea12" (määräaikainen enintään 12 kk) | "kiintea24" (24–36 kk) | "toistaiseksi" | "hybridi" | "kulutusvaikutteinen"
   vaiheet: tarjousjaksot [{ asti: kuukausi (mukaan lukien), maksu?, marginaali?, hinta? }]
   ilmainenKk: kWh/kk, joihin ei lisätä marginaalia (Vattenfall Helppo).
   Lähteet: VAIN kumppanin omat sivut tai Adtraction-ohjelmakuvaus, ei koskaan kilpailijoiden vertailusivuja.
   Tarkistettu 18.11.2026: fortum.com, oomi.fi, cheapenergy.fi, vihreaenergia.fi, hehkuenergia.fi, vattenfall.fi, aaltoenergia.com, nordicgreen.fi. */
window.SOPIMUKSET_PAIVITETTY = "2026-11-18";
window.OLETUS_POSSI_KESKIHINTA = 6.88; // 12 kk keskiarvo 11/2025–10/2026, sis. alv
var L = function (a) { return "https://go.adt246.net/t/t?a=" + a + "&as=2130009455&t=2&tk=1"; };
var A = {
  fortum: function (a) { return "https://ion.fortum.com/t/t?a=" + a + "&as=2130009455&t=2&tk=1"; },
  vf: function (a) { return "https://go.adt267.com/t/t?a=" + a + "&as=2130009455&t=2&tk=1"; },
  via: function (a) { return "https://go.adt212.net/t/t?a=" + a + "&as=2130009455&t=2&tk=1"; },
  oomi: "https://go.adt253.net/t/t?a=1867103627&as=2130009455&t=2&tk=1",
  cheap: L(1914907838), hehku: L(1893918387), aalto: L(1875124667),
  nge: "https://go.adt246.net/t/t?a=1795805764&as=2130009455&t=2&tk=1"
};
window.LOGOT = {
  "Fortum": "fortum", "Oomi": "oomi", "Cheap Energy": "cheap-energy", "Vihreä Älyenergia": "vihrea-alyenergia",
  "Hehku": "hehku", "Vattenfall": "vattenfall", "Aalto Energia": "aalto-energia", "Nordic Green Energy": "nordic-green-energy",
  "Moi": "moi", "Telia": "telia"
};
var NGES = "/sahkoyhtiot/nordic-green-energy/";
window.SOPIMUKSET = [
  // Fortum
  {tarjoaja:"Fortum", nimi:"Tarkka", tyyppi:"porssi", marginaali:0.59, maksu:5.99, vaiheet:[{asti:3, maksu:0}], kesto:"Toistaiseksi", huom:"Perusmaksu 0 € kolme ensimmäistä kuukautta (Fortumin kumppanikampanja). Tuntihinnat Fortum-sovelluksessa.", linkki:A.fortum(2025963582)},
  {tarjoaja:"Fortum", nimi:"Duo 24 kk", tyyppi:"kulutusvaikutteinen", hinta:9.79, maksu:5.99, kesto:"24 kk", huom:"Pääosin kiinteä hinta, johon kulutuksen ajoittuminen vaikuttaa.", linkki:A.fortum(1874973852)},
  {tarjoaja:"Fortum", nimi:"Duo 12 kk", tyyppi:"kulutusvaikutteinen", hinta:11.39, maksu:5.99, kesto:"12 kk", huom:"Pääosin kiinteä hinta, johon kulutuksen ajoittuminen vaikuttaa.", linkki:A.fortum(1874973852)},
  {tarjoaja:"Fortum", nimi:"Latauspaketti", tyyppi:"porssi", marginaali:0.59, maksu:9.99, kesto:"Toistaiseksi", huom:"Sähköautoilijoille: joustohyvitys 2 snt jokaisesta kotona ladatusta kWh:sta ja 20 % alennus pikalatauksesta Charge & Drive -verkossa (ei huomioitu laskelmassa).", linkki:A.fortum(2075360449)},
  {tarjoaja:"Fortum", nimi:"Kesto", tyyppi:"toistaiseksi", hinta:19.99, maksu:4.96, kesto:"Toistaiseksi", huom:"Hinta seuraa markkinoita maltillisesti, ja myyjä voi muuttaa sitä.", linkki:A.fortum(1874973852)},
  {tarjoaja:"Fortum", nimi:"Takuu 24 kk", tyyppi:"kiintea24", hinta:10.59, maksu:5.99, kesto:"24 kk", huom:"Hinta 100 % kiinteä koko sopimuskauden.", linkki:A.fortum(1874973852)},
  // Oomi
  {tarjoaja:"Oomi", nimi:"Aktiivinen", tyyppi:"porssi", marginaali:0.60, maksu:4.96, vaiheet:[{asti:9, maksu:0}], kesto:"Toistaiseksi", huom:"Perusmaksu 0 € yhdeksän kuukautta. Hinnan voi kiinnittää 50 % tai 100 % ilman lisämaksua.", linkki:A.oomi},
  {tarjoaja:"Oomi", nimi:"Jousto 24 kk", tyyppi:"kulutusvaikutteinen", hinta:9.09, maksu:5.90, vaiheet:[{asti:9, maksu:0}], kesto:"24 kk", huom:"Kiinteä hinta + kulutusvaikutus. Perusmaksu 0 € yhdeksän kuukautta.", linkki:A.oomi},
  {tarjoaja:"Oomi", nimi:"Jousto 12 kk", tyyppi:"kulutusvaikutteinen", hinta:10.49, maksu:5.90, kesto:"12 kk", huom:"Kiinteä hinta + kulutusvaikutus.", linkki:A.oomi},
  {tarjoaja:"Oomi", nimi:"Kiinteä 24 kk", tyyppi:"kiintea24", hinta:9.89, maksu:5.90, vaiheet:[{asti:9, maksu:0}], kesto:"24 kk", huom:"Perusmaksu 0 € yhdeksän kuukautta.", linkki:A.oomi},
  {tarjoaja:"Oomi", nimi:"Kiinteä 12 kk", tyyppi:"kiintea12", hinta:11.29, maksu:5.90, kesto:"12 kk", linkki:A.oomi},
  {tarjoaja:"Oomi", nimi:"Sesonki 12 kk", tyyppi:"hybridi", talviHinta:14.49, marginaali:0.50, maksu:5.90, talviOsuus:0.5, kesto:"12 kk", huom:"Talvella (1.11.–31.3.) kiinteä hinta, kesällä pörssi + marginaali. Laskuri olettaa 50 % kulutuksesta talvikaudelle.", linkki:A.oomi},
  {tarjoaja:"Oomi", nimi:"Vakaa", tyyppi:"toistaiseksi", hinta:13.90, maksu:4.96, kesto:"Toistaiseksi", huom:"Myyjä voi muuttaa hintaa ilmoittamalla.", linkki:A.oomi},
  // Cheap Energy
  {tarjoaja:"Cheap Energy", nimi:"Pörssisähkö", tyyppi:"porssi", marginaali:0.78, maksu:4.90, vaiheet:[{asti:6, maksu:0, marginaali:0.39}], maxKwh:50000, kesto:"Toistaiseksi", huom:"Tarjoushinta uusille asiakkaille 6 kk.", linkki:A.cheap},
  {tarjoaja:"Cheap Energy", nimi:"Määräaikainen 36 kk", tyyppi:"kiintea24", hinta:10.19, maksu:4.65, vaiheet:[{asti:3, maksu:0}], maxKwh:50000, kesto:"36 kk", huom:"Perusmaksu 0 € kolme kuukautta.", linkki:A.cheap},
  {tarjoaja:"Cheap Energy", nimi:"Määräaikainen 24 kk", tyyppi:"kiintea24", hinta:10.38, maksu:4.45, vaiheet:[{asti:4, maksu:0}], maxKwh:50000, kesto:"24 kk", huom:"Perusmaksu 0 € neljä kuukautta.", linkki:A.cheap},
  // Vihreä Älyenergia
  {tarjoaja:"Vihreä Älyenergia", nimi:"Verraton", tyyppi:"porssi", marginaali:0.59, maksu:4.99, vaiheet:[{asti:12, maksu:0, marginaali:0.42}], kesto:"Toistaiseksi", huom:"Fossiiliton sähkö. Perusmaksu 0 € ja marginaali 0,42 snt 12 kk.", linkki:A.via(1902900993)},
  {tarjoaja:"Vihreä Älyenergia", nimi:"Voima", tyyppi:"porssi", marginaali:0.79, maksu:5.99, vaiheet:[{asti:4, maksu:0, marginaali:0.27}], kesto:"Toistaiseksi", huom:"Fossiiliton sähkö.", linkki:A.via(1902900993)},
  {tarjoaja:"Vihreä Älyenergia", nimi:"Hintalukko", tyyppi:"porssi", marginaali:0.59, maksu:4.99, kesto:"Toistaiseksi", huom:"Pörssihinnan voi kiinnittää.", linkki:A.via(1902900993)},
  {tarjoaja:"Vihreä Älyenergia", nimi:"Vire Tuuli Pörssisähkö", tyyppi:"porssi", marginaali:0.99, maksu:5.99, vaiheet:[{asti:6, maksu:1.99, marginaali:0.39}], kesto:"Toistaiseksi", huom:"100 % tuulisähköä.", linkki:A.via(1902900993)},
  {tarjoaja:"Vihreä Älyenergia", nimi:"Vakaa Valinta", tyyppi:"toistaiseksi", hinta:15.90, maksu:5.99, kesto:"Toistaiseksi", huom:"Hinta pohjautuu markkinahinnan avulla ennustettavaan hintaan ja voi muuttua.", linkki:A.via(1902900993)},
  {tarjoaja:"Vihreä Älyenergia", nimi:"Vankka 24 kk", tyyppi:"kiintea24", hinta:11.14, maksu:4.99, kesto:"24 kk", linkki:A.via(2030810856)},
  {tarjoaja:"Vihreä Älyenergia", nimi:"Vankka 12 kk", tyyppi:"kiintea12", hinta:11.49, maksu:4.99, kesto:"12 kk", linkki:A.via(2030810585)},
  {tarjoaja:"Vihreä Älyenergia", nimi:"Vire Tuuli 24 kk", tyyppi:"kiintea24", hinta:11.64, maksu:5.99, kesto:"24 kk", huom:"100 % tuulisähköä.", linkki:A.via(2030811273)},
  {tarjoaja:"Vihreä Älyenergia", nimi:"Vire Tuuli 12 kk", tyyppi:"kiintea12", hinta:11.99, maksu:5.99, kesto:"12 kk", huom:"100 % tuulisähköä.", linkki:A.via(2030811055)},
  // Hehku
  {tarjoaja:"Hehku", nimi:"Pörssi", tyyppi:"porssi", marginaali:0.99, maksu:4.90, vaiheet:[{asti:4, maksu:0, marginaali:0.29}], maxKwh:50000, kesto:"Toistaiseksi", huom:"Tarjoushinta uusille asiakkaille 4 kk.", linkki:L(2034103803)},
  {tarjoaja:"Hehku", nimi:"Jousto 24 kk", tyyppi:"kulutusvaikutteinen", hinta:9.85, maksu:4.90, vaiheet:[{asti:3, maksu:0}], kesto:"24 kk", huom:"Kiinteä hinta + kulutusvaikutus.", linkki:A.hehku},
  {tarjoaja:"Hehku", nimi:"Jousto 12 kk", tyyppi:"kulutusvaikutteinen", hinta:11.09, maksu:5.49, vaiheet:[{asti:3, maksu:0}], kesto:"12 kk", huom:"Kiinteä hinta + kulutusvaikutus.", linkki:A.hehku},
  {tarjoaja:"Hehku", nimi:"Kiinteä 36 kk", tyyppi:"kiintea24", hinta:10.29, maksu:4.50, kesto:"36 kk", huom:"Kaksi ensimmäistä vuotta määräaikainen, kolmas vuosi toistaiseksi voimassa.", linkki:A.hehku},
  {tarjoaja:"Hehku", nimi:"Kiinteä 24 kk", tyyppi:"kiintea24", hinta:10.35, maksu:4.90, vaiheet:[{asti:6, maksu:0}], kesto:"24 kk", linkki:L(2034099617)},
  {tarjoaja:"Hehku", nimi:"Kiinteä 12 kk", tyyppi:"kiintea12", hinta:11.35, maksu:4.90, vaiheet:[{asti:4, maksu:0}], kesto:"12 kk", linkki:L(2034099817)},
  // Vattenfall
  {tarjoaja:"Vattenfall", nimi:"Optimi Pörssisähkö", tyyppi:"porssi", marginaali:0.50, maksu:5.95, vaiheet:[{asti:12, maksu:2.98}], kesto:"Toistaiseksi", linkki:A.vf(2027550605)},
  {tarjoaja:"Vattenfall", nimi:"Helppo Pörssisähkö", tyyppi:"porssi", marginaali:0.50, ilmainenKk:350, maksu:8.95, vaiheet:[{asti:3, maksu:4.48}], kesto:"Toistaiseksi", huom:"Ei marginaalia 350 kWh:iin asti kuukaudessa, sen ylittävältä osalta 0,50 snt/kWh.", linkki:A.vf(1884560810)},
  {tarjoaja:"Vattenfall", nimi:"Ilmasto Mix 12 kk", tyyppi:"kiintea12", hinta:11.61, maksu:5.95, vaiheet:[{asti:3, maksu:0}], kesto:"12 kk", huom:"Fossiiliton sähkö.", linkki:A.vf(2027551069)},
  {tarjoaja:"Vattenfall", nimi:"Kesto", tyyppi:"toistaiseksi", hinta:13.96, maksu:4.55, kesto:"Toistaiseksi", huom:"Saatavilla vain Elenian jakeluverkkoalueella. Myyjä voi muuttaa hintaa ilmoittamalla.", linkki:A.vf(1884560810)},
  // Aalto Energia
  {tarjoaja:"Aalto Energia", nimi:"Pörssisähkö", tyyppi:"porssi", marginaali:1.99, maksu:5.95, vaiheet:[{asti:3, maksu:0, marginaali:0.28},{asti:5, marginaali:0.68}], kesto:"Toistaiseksi", huom:"Marginaali 0,28 snt 3 kk, sitten 0,68 snt 30.4.2027 asti, sen jälkeen 1,99 snt.", linkki:A.aalto},
  {tarjoaja:"Aalto Energia", nimi:"Ankkuri Kiinteä 24 kk", tyyppi:"kiintea24", hinta:10.69, maksu:5.95, vaiheet:[{asti:3, maksu:0}], maxKwh:10000, kesto:"24 kk", linkki:A.aalto},
  {tarjoaja:"Aalto Energia", nimi:"Ankkuri Kiinteä 12 kk", tyyppi:"kiintea12", hinta:11.89, maksu:5.95, vaiheet:[{asti:1, maksu:0}], maxKwh:10000, kesto:"12 kk", linkki:A.aalto},
  {tarjoaja:"Aalto Energia", nimi:"Ankkuri Kiinteä 9 kk", tyyppi:"kiintea12", hinta:12.69, maksu:5.95, vaiheet:[{asti:1, maksu:0}], maxKwh:10000, kesto:"9 kk", linkki:A.aalto},
  // Nordic Green Energy (nordicgreen.fi/sahkosopimus 18.11.2026)
  {tarjoaja:"Nordic Green Energy", nimi:"Pörssisähkö", tyyppi:"porssi", marginaali:0.68, maksu:5.98, vaiheet:[{asti:6, maksu:0, marginaali:0.34}], kesto:"Toistaiseksi", huom:"Kampanja voimassa 19.11.2026 asti: kuukausimaksu 0 € ja marginaali 0,34 snt/kWh ensimmäiset 6 kuukautta. Alkuperätodennettua fossiilivapaata ydinvoimaa. 14 vuorokauden irtisanomisaika.", linkki:A.nge, sivu:NGES},
  {tarjoaja:"Nordic Green Energy", nimi:"Pörssisähkö ilman kuukausimaksua", tyyppi:"porssi", marginaali:1.49, maksu:0, kesto:"Toistaiseksi", huom:"Eri sopimus kuin kampanjan Pörssisähkö: ei kuukausimaksua lainkaan, marginaali 1,49 snt/kWh. Alkuperätodennettua fossiilivapaata ydinvoimaa.", linkki:L(1138376807), sivu:NGES},
  {tarjoaja:"Nordic Green Energy", nimi:"Kiinteä Sähkö 12 kk", tyyppi:"kiintea12", hinta:11.41, maksu:5.98, vaiheet:[{asti:2, maksu:0}], maxKwh:20000, kesto:"12 kk", huom:"Kuukausimaksu 0 € kaksi ensimmäistä kuukautta. Vuosikulutus alle 20 000 kWh.", linkki:L(1138376807), sivu:NGES},
  {tarjoaja:"Nordic Green Energy", nimi:"Hybridi 24 kk", tyyppi:"kulutusvaikutteinen", hinta:9.99, maksu:5.98, maxKwh:3000, kesto:"24 kk", huom:"Kiinteä hinta + kulutusvaikutus. Vuosikulutus alle 3 000 kWh.", linkki:L(1138376807), sivu:NGES},
  {tarjoaja:"Nordic Green Energy", nimi:"Älylataajan pörssisähkö", tyyppi:"porssi", marginaali:0.59, maksu:12.99, kesto:"Toistaiseksi", huom:"Sähköautoilijoille: jokaisen kuukauden ensimmäiset 175 kWh yölatausta ilman spot-hintaa ja marginaalia (ei huomioitu laskelmassa). Sisältää Nordic Green Plus -ominaisuudet. Tarjous voimassa 15.12.2026 asti.", linkki:L(1138376807), sivu:NGES}
];
