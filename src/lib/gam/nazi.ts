import type { GAMNode } from "./types";

// NAZI BREAKAWAY — post-WWII escape, Vril, Haunebu, Antarctic bases
export const NAZI_NODES: GAMNode[] = [
  {
    id: "nazi-breakaway",
    label: "Nazi Breakaway Civilization",
    category: "nazi",
    weight: 4,
    desc: "Within the narrative, elements of Nazi Germany (specifically the SS, the Vril Society, and the Ahnenerbe) did not surrender in 1945 — instead, they escaped to Antarctica (Neu-Schwabenland), Argentina (Bariloche), and the Moon, taking with them their advanced antigravity technology (the Vril and Haunebu craft) and continuing their civilization in secret. Said to have negotiated a treaty with the U.S. (Operation Highjump, 1947) that allowed them to operate independently in exchange for not openly attacking, and to have evolved into the Dark Fleet SSP faction. Tied to the 1947 Roswell crash (described as a Dark Fleet craft, not an ET craft).",
    links: ["dark-fleet", "vril-society", "haunebu", "nazi-bell", "operation-highjump", "antarctica", "argentina-bariloche", "hitler-hideout"],
  },
  {
    id: "vril-society",
    label: "Vril Society",
    category: "nazi",
    weight: 3,
    desc: "Within the narrative, an occult Nazi-era secret society (allegedly founded by Maria Orsic and the mediumistic 'Vril Maidens') that channeled information from an Aldebaran civilization, received technical schematics for antigravity craft, and built the first Vril flying disks (Vril-1, Vril-7, Vril-Odin) in the 1920s–40s. Said to be the spiritual-occult wing of the Nazi breakaway — the source of the esoteric ideology and the channeling-derived technology that powered the Haunebu program. Sometimes conflated with the Thule Society.",
    sources: [
      { label: "Vril — Wikipedia (occult)", url: "https://en.wikipedia.org/wiki/Vril" },
    ],
    links: ["nazi-breakaway", "haunebu", "nazi-bell", "antigravity", "channeling"],
  },
  {
    id: "haunebu",
    label: "Haunebu III (Nazi Antigravity Craft)",
    category: "nazi",
    weight: 3,
    desc: "Within the narrative, the Haunebu series (Haunebu I, II, III, and the 'Vril-Odin') were the operational antigravity saucer craft built by the SS's E-IV development group in the 1940s, using the Vril-derived tachyonator / mercury-vortex propulsion. The Haunebu III — said to be 70 meters in diameter, capable of Mach 17, and operational from 1944 — was the craft used by the Nazi breakaway to escape to Antarctica and the Moon. Said to be the basis of all subsequent SSP saucer designs. Plans and photos circulate in the community as primary evidence.",
    links: ["nazi-breakaway", "vril-society", "nazi-bell", "antigravity", "vimanas"],
  },
  {
    id: "nazi-bell",
    label: "Nazi Bell (Die Glocke)",
    category: "nazi",
    weight: 4,
    desc: "Within the narrative, 'Die Glocke' (the Bell) was a secret Nazi Wunderwaffe developed at the Riese complex in Lower Silesia — a bell-shaped device ~3 meters tall, containing a mercury-red-mercury-thorium 'Xerum 525' liquid, that, when spun at high speed, produced antigravity, time-distortion, and (in variants) interdimensional effects. The project was revealed by Polish journalist Igor Witkowski (2000) and popularized by Nick Cook's 'The Hunt for Zero Point.' Said to be the basis for the post-war American antigravity programs (via Operation Paperclip) and for the SSP's mercury-vortex propulsion.",
    sources: [
      { label: "Die Glocke — Wikipedia", url: "https://en.wikipedia.org/wiki/Die_Glocke" },
    ],
    links: ["nazi-breakaway", "antigravity", "haunebu", "vril-society", "reverse-engineering-ufos"],
  },
  {
    id: "operation-paperclip",
    label: "Operation Paperclip",
    category: "nazi",
    weight: 3,
    desc: "The real U.S. program (1945–59) that brought ~1,600 German scientists (including Wernher von Braun) to the U.S. after WWII. Within the narrative, Paperclip was the public-facing version of a much larger operation that also brought over Nazi occult, antigravity, and mind-control scientists — seeding NASA, the CIA (via the Gehlen Organization), MKUltra, and the early SSP. Treated as the moment the Nazi breakaway infrastructure was partially absorbed into the U.S. deep state.",
    sources: [
      { label: "Operation Paperclip — Wikipedia", url: "https://en.wikipedia.org/wiki/Operation_Paperclip" },
    ],
    links: ["nazi-breakaway", "mkultra", "cia-clowns", "nasa-coverup", "deep-state"],
  },
  {
    id: "argentina-bariloche",
    label: "Argentina / Bariloche (Nazi Escape)",
    category: "nazi",
    weight: 2,
    desc: "Within the narrative, the South American (especially Argentine, particularly the Bariloche region) Nazi escape route — enabled by the Vatican 'ratlines,' the Red Cross, and Perón's government — was the surface component of the Nazi breakaway. Hitler, Bormann, Mengele, Eichmann, and (variants) Eva Braun are said to have lived out their lives in Argentina. The 2017 declassification of FBI/ CIA Hitler-sighting files is cited as partial confirmation. Bariloche is described as the surface-parallel to the Antarctic breakaway.",
    sources: [
      { label: "Ratlines (World War II) — Wikipedia", url: "https://en.wikipedia.org/wiki/Ratlines_(World_War_II)" },
    ],
    links: ["nazi-breakaway", "hitler-hideout", "antarctica", "operation-paperclip"],
  },
  {
    id: "hitler-hideout",
    label: "Hitler's Hideout (Survival)",
    category: "nazi",
    weight: 3,
    desc: "Within the narrative, Hitler did not die in the Berlin bunker in April 1945 — he and Eva Braun escaped via submarine to Argentina (and variants: Antarctica, the Moon), lived into old age, and (variants) had daughters. The skull fragment the Russians keep as 'proof' is alleged to be a young woman's, not Hitler's. The FBI's declassified Hitler-sighting files (1945–1970s) are cited as primary evidence. Treated as the founding premise of the Nazi breakaway narrative.",
    sources: [
      { label: "Death of Adolf Hitler — Wikipedia (conspiracy theories)", url: "https://en.wikipedia.org/wiki/Death_of_Adolf_Hitler" },
    ],
    links: ["nazi-breakaway", "argentina-bariloche", "antarctica"],
  },
  {
    id: "secret-mexico-pact",
    label: "Nazi / SSP / Antigravity Origins",
    category: "nazi",
    weight: 2,
    desc: "Within the narrative, the post-WWII merger of the Nazi breakaway technology with the U.S. aerospace industry (via Paperclip and the early MJ-12) is described as the operational origin of the SSP — the moment when antigravity went from a Nazi project to an American black program, and when the Dark Fleet split off as the unrepentant Nazi remnant that would not integrate. The Tompkins / Salla framing of this period is the canonical version.",
    links: ["nazi-breakaway", "operation-paperclip", "secret-space-program", "william-tompkins", "mj12"],
  },
];
