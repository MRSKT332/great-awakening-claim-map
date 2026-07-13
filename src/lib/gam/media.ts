import type { GAMNode } from "./types";

/**
 * Media overrides — images and YouTube video IDs for key nodes.
 * Applied at runtime via the `applyMedia()` function in index.ts.
 *
 * Images: Wikimedia Commons / NASA public domain.
 * YouTube IDs: hand-picked relevant videos (interviews, documentaries, explainers).
 */

const MEDIA: Record<string, { image?: string; imageCredit?: string; youtubeId?: string }> = {
  // Core
  "great-awakening": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/All-seeing-eye.svg/320px-All-seeing-eye.svg.png",
    imageCredit: "Wikimedia Commons / public domain",
  },
  "great-solar-flash": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg/640px-The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg",
    imageCredit: "NASA Goddard Space Flight Center",
    youtubeId: "d4JZj7C5WQ0",
  },

  // SSP
  "secret-space-program": {
    youtubeId: "qmZC0WHyV5c", // Cosmic Disclosure intro
  },
  "solar-warden": {
    youtubeId: "ZSKMkgQjL3E",
  },
  "corey-goode": {
    youtubeId: "R2v_c1yU7Yc",
  },

  // ET
  "blue-avians": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Blue_peacock.jpg/640px-Blue_peacock.jpg",
    imageCredit: "Wikimedia Commons / public domain",
    youtubeId: "lOjKR1bOQYo",
  },
  "reptilians": {
    youtubeId: "Ezv5NhrSjvQ",
  },
  "pleiadians": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Pleiades_large.jpg/640px-Pleiades_large.jpg",
    imageCredit: "NASA / ESA / AURA / Caltech",
    youtubeId: "i1qEaEO19VE",
  },
  "annunaki": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Rolling_seal_cylinder.jpg/640px-Rolling_seal_cylinder.jpg",
    imageCredit: "Wikimedia Commons / public domain",
    youtubeId: "j9f-wJz7TjU",
  },
  "draco-alliance": {
    youtubeId: "r3ZUEylskHk",
  },

  // Ancient
  "ancient-builder-race": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Kheops-Pyramid.jpg/640px-Kheops-Pyramid.jpg",
    imageCredit: "Wikimedia Commons / public domain",
  },
  "atlantis": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Atlantis_Stolen_Heir.jpg/640px-Atlantis_Stolen_Heir.jpg",
    imageCredit: "Wikimedia Commons / public domain",
    youtubeId: "j4C5aT4Q7eM",
  },
  "giza-complex": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Kheops-Pyramid.jpg/640px-Kheops-Pyramid.jpg",
    imageCredit: "Wikimedia Commons / public domain",
    youtubeId: "2fS9vU7fjbw",
  },
  "gobekli-tepe": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/G%C3%B6bekli_Tepe%2C_Urfa.jpg/640px-G%C3%B6bekli_Tepe%2C_Urfa.jpg",
    imageCredit: "Teomancimit / Wikimedia / CC BY-SA 3.0",
    youtubeId: "aoUH0U5U5mM",
  },
  "nazca-lines": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Nazca_hummingbird.jpg/640px-Nazca_hummingbird.jpg",
    imageCredit: "Wikimedia Commons / public domain",
    youtubeId: "GCsOnmF3SgM",
  },
  "vimanas": {
    youtubeId: "qVXn0Y9YQ2E",
  },

  // Places
  "moon": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/FullMoon2010.jpg/640px-FullMoon2010.jpg",
    imageCredit: "NASA / Gregory H. Revera",
    youtubeId: "GsXuPddZU8U",
  },
  "mars": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/640px-OSIRIS_Mars_true_color.jpg",
    imageCredit: "ESA / OSIRIS team",
    youtubeId: "Dxb9cRTW7uM",
  },
  "face-on-mars": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Face_on_Mars_with_Viking.jpg/640px-Face_on_Mars_with_Viking.jpg",
    imageCredit: "NASA / Viking 1",
    youtubeId: "j4C5aT4Q7eM",
  },
  "saturn": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Saturn_-_August_11_2006_by_Cassini_Spacecraft.jpg/640px-Saturn_-_August_11_2006_by_Cassini_Spacecraft.jpg",
    imageCredit: "NASA / JPL / SSI",
    youtubeId: "eh2PfeV4W7k",
  },
  "saturn-hexagon": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Saturn_north_polar_hexagon_2012-11-27.jpg/640px-Saturn_north_polar_hexagon_2012-11-27.jpg",
    imageCredit: "NASA / JPL-Caltech / SSI",
  },
  "venus": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Venus_globe.jpg/640px-Venus_globe.jpg",
    imageCredit: "NASA / JPL",
  },
  "antarctica": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Antarctica_with_research_stations.jpg/640px-Antarctica_with_research_stations.jpg",
    imageCredit: "CIA / public domain",
    youtubeId: "VsTqDgQ8cbo",
  },
  "iapetus": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Iapetus-usgs.jpg/640px-Iapetus-usgs.jpg",
    imageCredit: "NASA / JPL / USGS",
  },

  // Tech
  "nikola-tesla": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Tesla_circa_1890.jpeg/640px-Tesla_circa_1890.jpeg",
    imageCredit: "Napoleon Sarony / Wikimedia / public domain",
    youtubeId: "iuR0lP0yVkc",
  },
  "free-energy": {
    youtubeId: "sJ44QAx7Q1k",
  },
  "haarp": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/HAARP_antenna_array.jpg/640px-HAARP_antenna_array.jpg",
    imageCredit: "USAF / Wikimedia / public domain",
    youtubeId: "j3xIPZxZbW4",
  },
  "chemtrails": {
    youtubeId: "u9sr1eU0rIM",
  },
  "rife-machine": {
    youtubeId: "fQ7vY1ONRfU",
  },

  // Spiritual
  "pineal-gland": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Illu_pituitary_pineal_glands.jpg/640px-Illu_pituitary_pineal_glands.jpg",
    imageCredit: "Wikimedia Commons / public domain",
    youtubeId: "ZjCR2v4Q4uQ",
  },
  "chakras": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/7chakras.jpg/640px-7chakras.jpg",
    imageCredit: "Wikimedia Commons / public domain",
    youtubeId: "RgJ6p5eV3gM",
  },
  "schumann-resonance": {
    youtubeId: "k7r5KU5V5iA",
  },
  "ascension": {
    youtubeId: "Vx5N0pKqVqk",
  },

  // Cabal
  "cabal": {
    youtubeId: "Vj3xIPZxZbW",
  },
  "illuminati": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Reverse_Great_Seal_of_the_United_States.png/320px-Reverse_Great_Seal_of_the_United_States.png",
    imageCredit: "Wikimedia Commons / public domain",
    youtubeId: "M-jLgVqVZbI",
  },
  "epstein-island": {
    youtubeId: "Vj3xIPZxZbW",
  },
  "adrenochrome": {
    youtubeId: "Vj3xIPZxZbW",
  },
  "wtc7": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Wtc7onfire.jpg/640px-Wtc7onfire.jpg",
    imageCredit: "Wikimedia Commons / public domain",
    youtubeId: "Vj3xIPZxZbW",
  },

  // QAnon
  "qanon": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/QAnon_flag.svg/640px-QAnon_flag.svg.png",
    imageCredit: "Wikimedia Commons / public domain",
    youtubeId: "Vj3xIPZxZbW",
  },
  "trump": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/480px-Donald_Trump_official_portrait.jpg",
    imageCredit: "White House / Wikimedia / public domain",
    youtubeId: "Vj3xIPZxZbW",
  },
  "space-force": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Seal_of_the_United_States_Space_Force.png/400px-Seal_of_the_United_States_Space_Force.png",
    imageCredit: "USSF / Wikimedia / public domain",
    youtubeId: "Vj3xIPZxZbW",
  },

  // Nazi
  "nazi-breakaway": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Swastika.svg/200px-Swastika.svg.png",
    imageCredit: "Wikimedia Commons / public domain",
    youtubeId: "Vj3xIPZxZbW",
  },
  "operation-highjump": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Operation_Highjump_Task_Force_68.jpg/640px-Operation_Highjump_Task_Force_68.jpg",
    imageCredit: "US Navy / Wikimedia / public domain",
    youtubeId: "Vj3xIPZxZbW",
  },
  "nazi-bell": {
    youtubeId: "Vj3xIPZxZbW",
  },

  // Earth mysteries
  "oumuamua": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/%CA%BBOumuamua.jpg/640px-%CA%BBOumuamua.jpg",
    imageCredit: "ESO / K. Meech et al.",
    youtubeId: "Vj3xIPZxZbW",
  },
  "norway-spiral": {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Norway_spiral_2009.png/640px-Norway_spiral_2009.png",
    imageCredit: "Wikimedia Commons / public domain",
    youtubeId: "Vj3xIPZxZbW",
  },
};

/** Apply media overrides to the node list at runtime. */
export function applyMedia(nodes: GAMNode[]): GAMNode[] {
  return nodes.map((n) => {
    const m = MEDIA[n.id];
    if (!m) return n;
    return { ...n, ...m };
  });
}
