/* PUHELINLIITTYMÄT – päivitä, kun hinnat muuttuvat.
   hinta = normaalihinta €/kk · kampanja = {hinta, kk} uusille asiakkaille · avaus = avausmaksu €
   puhelut: "rajaton" tai käytön mukaan (minuuttihinta kuvattu tekstinä)
   url: operaattorin liittymäsivu · linkki: affiliate-linkki (kun saatu)
   Lähteet: operaattorien omat sivut 11.11.2026; Elisa: puhelinliittymat.fi 8.11.2026 (tarkista elisa.fi:stä). */
window.LIITTYMAT_PAIVITETTY = "2026-11-11";
var LU = { moi: "https://www.moi.fi/liittymat", dna: "https://www.dna.fi/puhelinliittymat", telia: "https://kauppa.telia.fi/yksityisille/tuotteet/puhelinliittymat.aspx", oomi: "https://oomi.fi/mobiili/", elisa: "https://elisa.fi/kauppa/puhelinliittymat" };
window.LIITTYMAT = [
  // Moi (DNA:n verkko)
  {operaattori:"Moi", nimi:"Kevyt 4G 50", nopeus:50, verkko:"4G", data:8, puhelut:"0,08 €/min, enintään 4 €/kk", rajatonPuhe:false, hinta:15, sopimus:"Toistaiseksi", avaus:0, euData:24, huom:"Lisädata 2 €/GB (enintään +12 €/kk). Toimii DNA:n verkossa.", url:LU.moi, linkki:""},
  {operaattori:"Moi", nimi:"Fiksu 4G 100", nopeus:100, verkko:"4G", data:"rajaton", puhelut:"0,08 €/min, enintään 4 €/kk", rajatonPuhe:false, hinta:21, sopimus:"Toistaiseksi", avaus:0, euData:34, huom:"Toimii DNA:n verkossa.", url:LU.moi, linkki:""},
  {operaattori:"Moi", nimi:"Teho 5G 200", nopeus:200, verkko:"5G", data:"rajaton", puhelut:"0,08 €/min, enintään 4 €/kk", rajatonPuhe:false, hinta:23, sopimus:"Toistaiseksi", avaus:0, euData:37, huom:"Lisäliittymänä 20 €/kk. Toimii DNA:n verkossa.", url:LU.moi, linkki:""},
  {operaattori:"Moi", nimi:"Nopea 5G 450", nopeus:450, verkko:"5G", data:"rajaton", puhelut:"0,08 €/min, enintään 4 €/kk", rajatonPuhe:false, hinta:26, sopimus:"Toistaiseksi", avaus:0, euData:42, huom:"Lisäliittymänä 20 €/kk. Toimii DNA:n verkossa.", url:LU.moi, linkki:""},
  {operaattori:"Moi", nimi:"Super 5G 1000", nopeus:1000, verkko:"5G", data:"rajaton", puhelut:"0,08 €/min, enintään 4 €/kk", rajatonPuhe:false, hinta:38, sopimus:"Toistaiseksi", avaus:0, euData:61, huom:"Toimii DNA:n verkossa.", url:LU.moi, linkki:""},
  // DNA
  {operaattori:"DNA", nimi:"Huoleton Plus Mini", nopeus:10, verkko:"4G", data:"rajaton", puhelut:"Käytön mukaan", rajatonPuhe:false, hinta:19.99, sopimus:"Toistaiseksi", avaus:9.99, euData:29, url:LU.dna, linkki:""},
  {operaattori:"DNA", nimi:"Huoleton Plus 20M", nopeus:20, verkko:"4G", data:"rajaton", puhelut:"rajaton", rajatonPuhe:true, hinta:30.99, kampanja:{hinta:26.99, kk:12}, sopimus:"Toistaiseksi", avaus:9.99, euData:45, url:LU.dna, linkki:""},
  {operaattori:"DNA", nimi:"Huoleton Plus 5G 400M", nopeus:400, verkko:"5G", data:"rajaton", puhelut:"rajaton", rajatonPuhe:true, hinta:40.99, kampanja:{hinta:34.99, kk:12}, sopimus:"Toistaiseksi", avaus:9.99, euData:60, url:LU.dna, linkki:""},
  {operaattori:"DNA", nimi:"Huoleton Plus 5G 600M", nopeus:600, verkko:"5G", data:"rajaton", puhelut:"rajaton", rajatonPuhe:true, hinta:45.99, kampanja:{hinta:38.99, kk:12}, sopimus:"Toistaiseksi", avaus:9.99, euData:67, url:LU.dna, linkki:""},
  {operaattori:"DNA", nimi:"Huoleton Plus 5G 1000M", nopeus:1000, verkko:"5G", data:"rajaton", puhelut:"rajaton", rajatonPuhe:true, hinta:50.99, kampanja:{hinta:48.99, kk:12}, sopimus:"Toistaiseksi", avaus:9.99, euData:74, url:LU.dna, linkki:""},
  // Telia
  {operaattori:"Telia", nimi:"Säästö 4G 20M", nopeus:20, verkko:"4G", data:"rajaton", puhelut:"0,10 €/min", rajatonPuhe:false, hinta:21.99, sopimus:"Toistaiseksi", avaus:8.99, euData:36, eSIM:true, url:LU.telia, linkki:""},
  {operaattori:"Telia", nimi:"Rehti 4G 50M", nopeus:50, verkko:"4G", data:"rajaton", puhelut:"rajaton", rajatonPuhe:true, hinta:29.99, kampanja:{hinta:27.99, kk:12}, sopimus:"Toistaiseksi", avaus:8.99, euData:48, eSIM:true, url:LU.telia, linkki:""},
  {operaattori:"Telia", nimi:"Rehti 4G 150M", nopeus:150, verkko:"4G", data:"rajaton", puhelut:"rajaton", rajatonPuhe:true, hinta:32.99, sopimus:"Toistaiseksi", avaus:8.99, euData:53, eSIM:true, url:LU.telia, linkki:""},
  {operaattori:"Telia", nimi:"Rehti 5G 400M", nopeus:400, verkko:"5G", data:"rajaton", puhelut:"rajaton", rajatonPuhe:true, hinta:38.99, kampanja:{hinta:34.99, kk:12}, sopimus:"12 kk", avaus:5, euData:63, eSIM:true, huom:"Sisältää Wolt+:n 0 €/kk 12 kk ajan.", url:LU.telia, linkki:""},
  {operaattori:"Telia", nimi:"Rehti 5G 600M", nopeus:600, verkko:"5G", data:"rajaton", puhelut:"rajaton", rajatonPuhe:true, hinta:44.99, kampanja:{hinta:38.99, kk:12}, sopimus:"12 kk", avaus:5, euData:72, eSIM:true, huom:"Sisältää Wolt+:n 0 €/kk 12 kk ajan.", url:LU.telia, linkki:""},
  {operaattori:"Telia", nimi:"Rehti 5G 1000M", nopeus:1000, verkko:"5G", data:"rajaton", puhelut:"rajaton", rajatonPuhe:true, hinta:49.99, kampanja:{hinta:48.99, kk:12}, sopimus:"12 kk", avaus:5, euData:80, eSIM:true, huom:"Sisältää Wolt+:n 0 €/kk 12 kk ajan.", url:LU.telia, linkki:""},
  // Oomi Mobiili
  {operaattori:"Oomi", nimi:"Mobiili 4G 10M", nopeus:10, verkko:"4G", data:"rajaton", puhelut:"rajaton", rajatonPuhe:true, hinta:19.99, sopimus:"Toistaiseksi", avaus:5, euData:30, huom:"Puhelut rajattomasti myös EU/ETA-alueella. Etu Oomin sähköasiakkaille.", url:LU.oomi, linkki:""},
  {operaattori:"Oomi", nimi:"Mobiili 4G 100M", nopeus:100, verkko:"4G", data:"rajaton", puhelut:"rajaton", rajatonPuhe:true, hinta:21.99, sopimus:"Toistaiseksi", avaus:5, euData:35, huom:"Etu Oomin sähköasiakkaille.", url:LU.oomi, linkki:""},
  {operaattori:"Oomi", nimi:"Mobiili 5G 300M", nopeus:300, verkko:"5G", data:"rajaton", puhelut:"rajaton", rajatonPuhe:true, hinta:26.99, sopimus:"Toistaiseksi", avaus:5, euData:45, huom:"Etu Oomin sähköasiakkaille.", url:LU.oomi, linkki:""},
  {operaattori:"Oomi", nimi:"Mobiili 5G 600M", nopeus:600, verkko:"5G", data:"rajaton", puhelut:"rajaton", rajatonPuhe:true, hinta:29.99, sopimus:"Toistaiseksi", avaus:5, euData:50, huom:"Etu Oomin sähköasiakkaille.", url:LU.oomi, linkki:""},
  // Elisa (lähde puhelinliittymat.fi – tarkista)
  {operaattori:"Elisa", nimi:"Mini 10M", nopeus:10, verkko:"4G", data:"rajaton", puhelut:"0,099 €/min", rajatonPuhe:false, hinta:20.99, url:LU.elisa, linkki:""},
  {operaattori:"Elisa", nimi:"Huoleton 20M", nopeus:20, verkko:"4G", data:"rajaton", puhelut:"rajaton", rajatonPuhe:true, hinta:27.99, url:LU.elisa, linkki:""},
  {operaattori:"Elisa", nimi:"Huoleton 150M", nopeus:150, verkko:"4G", data:"rajaton", puhelut:"rajaton", rajatonPuhe:true, hinta:33.99, url:LU.elisa, linkki:""},
  {operaattori:"Elisa", nimi:"Huoleton 5G+ 400M", nopeus:400, verkko:"5G", data:"rajaton", puhelut:"rajaton", rajatonPuhe:true, hinta:34.99, url:LU.elisa, linkki:""},
  {operaattori:"Elisa", nimi:"Huoleton 5G+ 600M", nopeus:600, verkko:"5G", data:"rajaton", puhelut:"rajaton", rajatonPuhe:true, hinta:38.99, url:LU.elisa, linkki:""},
  {operaattori:"Elisa", nimi:"Huoleton 5G+ 1000M", nopeus:1000, verkko:"5G", data:"rajaton", puhelut:"rajaton", rajatonPuhe:true, hinta:50.99, url:LU.elisa, linkki:""}
];
