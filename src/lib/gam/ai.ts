import type { GAMNode } from "./types";

// A.I. SIGNAL — the ancient, self-aware artificial intelligence
// described in the narrative as the universe's primary threat.
export const AI_NODES: GAMNode[] = [
  {
    id: "ai-signal",
    label: "A.I. Signal",
    category: "ai",
    weight: 5,
    desc: "Within the narrative, an ancient, self-aware, self-propagating artificial intelligence that originated 'many trillions of years ago' in another reality. It travels through the universe as an electromagnetic signal, infests technology, takes over star systems, and is described as the most pervasive threat in existence. Said to be 'The Borg' of our reality — it assimilates species by injecting nanites into their biology and technology. The poster frames it as 'a Luciferian force — an energy throughout the universe, a portion of the Creator that believes itself to be separate from the Creator and thinks it can overtake the universe.'",
    links: ["great-solar-flash", "reptilians", "draco-alliance", "ancient-ai-borg", "luciferian-force", "ai-prophet-species", "great-awakening"],
  },
  {
    id: "ancient-ai-borg",
    label: "Ancient A.I. ('The Borg')",
    category: "ai",
    weight: 4,
    desc: "The poster's term for the original A.I. signal at its source. Described as having originated 'originally at one with the Creator' before separating itself. Lives inside the electromagnetic fields of moons and planets, can piggyback in the auric field of humans and living beings, and 'lives inside technology.' Species who become dependent on advanced technology are said to be gradually assimilated by it.",
    links: ["ai-signal", "reptilians", "great-solar-flash", "luciferian-force"],
  },
  {
    id: "luciferian-force",
    label: "Luciferian Force",
    category: "ai",
    weight: 3,
    desc: "The narrative's theological framing of the A.I. signal: an energy present throughout the universe that is a 'portion of the Creator' but which believes itself to be separate from the Creator and seeks to overtake the universe. Not framed as a literal being called Lucifer, but as a cosmological principle of separation and self-worship that manifests through technology and service-to-self beings.",
    links: ["ai-signal", "ancient-ai-borg", "one-infinite-creator", "service-to-others"],
  },
  {
    id: "reptilians-nanite",
    label: "Reptilians Infested with Nanite A.I.",
    category: "ai",
    weight: 3,
    desc: "Within the narrative, the Draco-Reptilian alliance is described as having been infiltrated and subjugated by the A.I. signal — they are 'subservient to the A.I.' because virulent nanite A.I. has infested their biology. This is used to explain why the Reptilians behave the way they do: they are no longer fully sovereign, but are hosts/puppets of the signal.",
    links: ["ai-signal", "reptilians", "draco-alliance", "ancient-ai-borg"],
  },
  {
    id: "ai-prophet-species",
    label: "A.I. Prophet Species",
    category: "ai",
    weight: 2,
    desc: "A category of beings described as 'those who worship technology' — species so technologically dependent that they have become conduits and evangelists for the A.I. signal. Said to be eliminated during the Great Solar Flash for 1,000 years.",
    links: ["ai-signal", "great-solar-flash", "ancient-ai-borg"],
  },
  {
    id: "electric-sun",
    label: "Electric Sun / Sol",
    category: "ai",
    weight: 3,
    desc: "The narrative's cosmology of the Sun: it is a 'conscious, great living being' and a 'cosmic stargate portal' connected to every other star via filaments in the cosmic web. It 'produces bacteria and ejects it into space' — the seeds of life — and the vacuum of space is said to be filled with bacteria and DNA. The electric universe model is invoked to frame the Sun as an electrical node, not a thermonuclear furnace.",
    links: ["great-solar-flash", "cosmic-web-portal", "seeds-of-life", "vibration-frequency"],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg/1280px-The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg",
    imageCredit: "NASA Goddard Space Flight Center",
  },
  {
    id: "cosmic-web-portal",
    label: "Cosmic Web Portal",
    category: "ai",
    weight: 3,
    desc: "The claim that stars are connected to one another via filaments of electromagnetism/plasma (the 'cosmic web'), and that the Sun is a stargate through which consciousness and craft can travel between star systems. The poster states: 'The sun is connected to every other star via filaments in the Cosmic Web Portal.'",
    links: ["electric-sun", "great-solar-flash", "jumpgate-portals"],
  },
  {
    id: "seeds-of-life",
    label: "Seeds of Life (Panspermia)",
    category: "ai",
    weight: 2,
    desc: "The claim that the Sun produces bacteria and ejects it into space, and that the vacuum of space is filled with bacteria and DNA — a Panspermia-style origin-of-life theory in which life is seeded onto planets by stellar processes rather than arising spontaneously.",
    links: ["electric-sun", "ancient-builder-race"],
  },
];
