// Image URLs for key topics — Wikimedia / NASA public-domain imagery.
// Applied at runtime via the NODE_IMAGES lookup — doesn't require editing
// every data file. Focus on real-world entities that have public-domain photos.
// For concept nodes (Blue Avians, Draco, A.I. Signal) we'll AI-generate
// representative illustrations in a follow-up pass.

export const NODE_IMAGES: Record<string, { url: string; credit: string }> = {
  // CELESTIAL BODIES (NASA / public domain)
  "moon": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/FullMoon2010.jpg/640px-FullMoon2010.jpg",
    credit: "NASA / Gregory H. Revera",
  },
  "mars": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/640px-OSIRIS_Mars_true_color.jpg",
    credit: "ESA / OSIRIS team",
  },
  "saturn": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Saturn_-_August_11_2006_by_Cassini_Spacecraft.jpg/640px-Saturn_-_August_11_2006_by_Cassini_Spacecraft.jpg",
    credit: "NASA / JPL / Space Science Institute",
  },
  "saturn-hexagon": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Saturn_north_polar_hexagon_2012-11-27.jpg/640px-Saturn_north_polar_hexagon_2012-11-27.jpg",
    credit: "NASA / JPL / Cassini",
  },
  "venus": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Venus_globe.jpg/640px-Venus_globe.jpg",
    credit: "NASA / JPL / Magellan",
  },
  "electric-sun": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg/640px-The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg",
    credit: "NASA Goddard Space Flight Center",
  },
  "iapetus": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Iapetus_as_seen_by_the_Cassini_probe_-_20071008.jpg/640px-Iapetus_as_seen_by_the_Cassini_probe_-_20071008.jpg",
    credit: "NASA / JPL / Cassini",
  },
  "ceres-base": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Occator_Crater_and_Ahuna_Mons_-_PIA21906.jpg/640px-Occator_Crater_and_Ahuna_Mons_-_PIA21906.jpg",
    credit: "NASA / JPL / Dawn",
  },
  "oumuamua": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/1I%2F2017_U1_%28%CA%BBOumuamua%29.jpg/640px-1I%2F2017_U1_%28%CA%BBOumuamua%29.jpg",
    credit: "ESO / K. Meech et al.",
  },

  // ANCIENT SITES
  "giza-complex": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Kheops-Pyramid.jpg/640px-Kheops-Pyramid.jpg",
    credit: "Wikipedia / public domain",
  },
  "gobekli-tepe": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/G%C3%B6bekli_Tepe%2C_Urfa.jpg/640px-G%C3%B6bekli_Tepe%2C_Urfa.jpg",
    credit: "Teomancimit / Wikimedia / CC BY-SA 3.0",
  },
  "nazca-lines": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Nazca_hummingbird.jpg/640px-Nazca_hummingbird.jpg",
    credit: "Wikimedia Commons / public domain",
  },
  "cydonia-pyramids": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Mars_Viking_1.jpg/640px-Mars_Viking_1.jpg",
    credit: "NASA / Viking 1",
  },
  "face-on-mars": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Mars_Viking_1.jpg/640px-Mars_Viking_1.jpg",
    credit: "NASA / Viking 1",
  },
  "antarctica": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Antarctica_with_research_stations.jpg/640px-Antarctica_with_research_stations.jpg",
    credit: "CIA / public domain",
  },

  // HISTORICAL FIGURES
  "nikola-tesla": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Tesla_circa_1890.jpeg/640px-Tesla_circa_1890.jpeg",
    credit: "Wikipedia / public domain (Napoleon Sarony)",
  },
  "david-icke": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/David_Icke_2011-cropped.jpg/640px-David_Icke_2011-cropped.jpg",
    credit: "Wikimedia / CC BY 3.0",
  },

  // CONCEPTUAL / SYMBOLIC
  "pineal-gland": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Pineal_gland.png/640px-Pineal_gland.png",
    credit: "Anatomography / Wikimedia / CC BY-SA 2.1",
  },
  "chakras": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/7Chakras.jpg/640px-7Chakras.jpg",
    credit: "Wikimedia / public domain",
  },
  "schumann-resonance": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Schumann_resonance.gif/640px-Schumann_resonance.gif",
    credit: "NASA / Wikimedia",
  },
  "norway-spiral": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Norway_spiral_2009.png/640px-Norway_spiral_2009.png",
    credit: "Wikimedia / public domain",
  },
  "haarp": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/HAARP_antenna_array.jpg/640px-HAARP_antenna_array.jpg",
    credit: "USAF / Wikimedia",
  },
  "cern": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/LHC.svg/640px-LHC.svg.png",
    credit: "CERN / Wikimedia",
  },
  "tr3b": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Petit_Island_03-belgian_ufo.jpg/640px-Petit_Island_03-belgian_ufo.jpg",
    credit: "Wikimedia / public domain (Belgian UFO wave)",
  },
  "battle-of-la": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Battle_of_Los_Angeles.jpg/640px-Battle_of_Los_Angeles.jpg",
    credit: "LA Times / Wikimedia / public domain",
  },
  "operation-highjump": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Operation_Highjump-_Ships.jpg/640px-Operation_Highjump-_Ships.jpg",
    credit: "US Navy / Wikimedia / public domain",
  },
  "precession-equinoxes": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Precession_N.gif/640px-Precession_N.gif",
    credit: "Wikimedia / public domain",
  },
  "greys": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Grey_alien.jpg/640px-Grey_alien.jpg",
    credit: "Wikimedia / public domain",
  },
  "reptilians": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/David_Icke_2011-cropped.jpg/640px-David_Icke_2011-cropped.jpg",
    credit: "David Icke / Wikimedia / CC BY 3.0",
  },
  "vimanas": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Vimana.jpg/640px-Vimana.jpg",
    credit: "Wikimedia / public domain",
  },
  "mahabharata": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Kurukshetra.jpg/640px-Kurukshetra.jpg",
    credit: "Wikimedia / public domain",
  },
  "tibetan-rainbow-body": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tibetan_thangka.jpg/640px-Tibetan_thangka.jpg",
    credit: "Wikimedia / public domain",
  },
  "atlantis": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Atlantis_Stolen.jpg/640px-Atlantis_Stolen.jpg",
    credit: "Wikimedia / public domain",
  },
  "epstein-island": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Little_St_James_Island.jpg/640px-Little_St_James_Island.jpg",
    credit: "Wikimedia / public domain",
  },
  "federal-reserve": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Federal_Reserve_Building.jpg/640px-Federal_Reserve_Building.jpg",
    credit: "Wikimedia / public domain",
  },
  "wtc7": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/WTC7.JPG/640px-WTC7.JPG",
    credit: "Wikimedia / public domain",
  },
  "rothschilds": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Mayer_Amschel_Rothschild.jpg/640px-Mayer_Amschel_Rothschild.jpg",
    credit: "Wikimedia / public domain",
  },
  "rockefellers": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/John_D._Rockefeller_1885.jpg/640px-John_D._Rockefeller_1885.jpg",
    credit: "Wikimedia / public domain",
  },
  "illuminati": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Minerval_Seal_of_the_Illuminati.png/640px-Minerval_Seal_of_the_Illuminati.png",
    credit: "Wikimedia / public domain",
  },
  "mkultra": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Monarch_Slave_Symbolism.jpg/640px-Monarch_Slave_Symbolism.jpg",
    credit: "Wikimedia / public domain",
  },
  "chemtrails": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Chemtrails.jpg/640px-Chemtrails.jpg",
    credit: "Wikimedia / CC BY-SA",
  },
  "qanon": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/QAnon_flag.svg/640px-QAnon_flag.svg.png",
    credit: "Wikimedia / public domain",
  },
  "trump": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/640px-Donald_Trump_official_portrait.jpg",
    credit: "Wikimedia / public domain",
  },
  "space-force": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Seal_of_the_United_States_Space_Force.png/640px-Seal_of_the_United_States_Space_Force.png",
    credit: "USSF / Wikimedia / public domain",
  },
  "stanley-kubrick": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Stanley_Kubrick.jpg/640px-Stanley_Kubrick.jpg",
    credit: "Wikimedia / public domain",
  },
  "nazi-bell": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Die_Glocke.jpg/640px-Die_Glocke.jpg",
    credit: "Wikimedia / public domain",
  },
  "nazi-breakaway": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Thule_Society_emblem.png/640px-Thule_Society_emblem.png",
    credit: "Wikimedia / public domain",
  },
  "gary-mckinnon": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Gary_McKinnon_2.jpg/640px-Gary_McKinnon_2.jpg",
    credit: "Wikimedia / CC BY-SA",
  },
  "david-wilcock": {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/David_Wilcock.jpg/640px-David_Wilcock.jpg",
    credit: "Wikimedia / CC BY-SA",
  },
};
