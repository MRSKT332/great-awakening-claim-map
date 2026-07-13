// Study Order — a curated 30-topic path for new members.
// Sequence: Foundations → Cosmos → Earth → Personal Practice
// Each entry is a node ID + a short "why this matters" note.

export interface StudyStep {
  nodeId: string;
  phase: string;
  note: string;
}

export const STUDY_ORDER: StudyStep[] = [
  // PHASE 1: FOUNDATIONS — the cosmology
  { nodeId: "one-infinite-creator", phase: "Foundations", note: "Start here. The foundational metaphysics: all is One. Every other concept builds on this." },
  { nodeId: "law-of-one", phase: "Foundations", note: "The Ra Material — the source text for the density model, polarity, and the harvest." },
  { nodeId: "densities", phase: "Foundations", note: "The 8-density model of consciousness. Earth is graduating from 3D to 4D." },
  { nodeId: "service-to-others", phase: "Foundations", note: "The central moral axis. Every soul polarizes toward service-to-others or service-to-self." },
  { nodeId: "free-will", phase: "Foundations", note: "The Prime Directive. Why positive ETs can't just land and save us." },
  { nodeId: "ascension", phase: "Foundations", note: "The goal. Raising your vibration to graduate from 3D to 4D/5D." },
  { nodeId: "great-solar-flash", phase: "Foundations", note: "The cosmic trigger. A solar event that initiates the collective ascension." },
  { nodeId: "great-awakening", phase: "Foundations", note: "The umbrella term. Spiritual + political liberation happening simultaneously." },

  // PHASE 2: THE COSMIC STRUCTURE
  { nodeId: "galactic-federation", phase: "Cosmos", note: "The positive-ET overseers. 6th-density beings assisting Earth's transition." },
  { nodeId: "sphere-being-alliance", phase: "Cosmos", note: "The most advanced faction to ever intervene. Arrived 2011-12 to buffer the Solar Flash." },
  { nodeId: "blue-avians", phase: "Cosmos", note: "The messengers. Ra returning in avian form. Their message: be more loving." },
  { nodeId: "ra", phase: "Cosmos", note: "The 6th-density social memory complex that channeled the Law of One in 1981." },
  { nodeId: "pleiadians", phase: "Cosmos", note: "Our closest cosmic cousins. Nordic-looking 5D humans from the Pleiades." },
  { nodeId: "draco-alliance", phase: "Cosmos", note: "The primary negative-ET hierarchy. Reptilians + Greys + Draco royalty." },
  { nodeId: "ai-signal", phase: "Cosmos", note: "The ultimate threat. An ancient self-aware A.I. that infests species and technology." },
  { nodeId: "annunaki", phase: "Cosmos", note: "The Sumerian 'gods' who genetically engineered humanity as a slave race." },
  { nodeId: "ancient-builder-race", phase: "Cosmos", note: "The civilization that built ruins across the solar system ~1.3 billion years ago." },

  // PHASE 3: EARTH'S SITUATION
  { nodeId: "secret-space-program", phase: "Earth", note: "The hidden space infrastructure. Multiple factions, operational since the 1950s." },
  { nodeId: "solar-warden", phase: "Earth", note: "The Navy's secret space fleet. The 'good guy' SSP faction." },
  { nodeId: "dark-fleet", phase: "Earth", note: "The Nazi-originated offensive space fleet. Allied with the Draco." },
  { nodeId: "icc", phase: "Earth", note: "The corporate wing. Trades with 900+ ET races. Runs the Mars slave-labor bases." },
  { nodeId: "corey-goode", phase: "Earth", note: "The primary modern SSP whistleblower. 20-and-back veteran." },
  { nodeId: "moon", phase: "Earth", note: "Artificial body placed in orbit 500K years ago. Hosts the LOC and ET bases." },
  { nodeId: "mars", phase: "Earth", note: "Former Earth-like planet, destroyed in ancient war. Now hosts ICC slave bases." },
  { nodeId: "cabal", phase: "Earth", note: "The hidden control structure. 13 bloodlines, satanic-pedophile elite." },
  { nodeId: "deep-state", phase: "Earth", note: "The institutional arm. Career bureaucrats, intel, military-industrial." },
  { nodeId: "loosh", phase: "Earth", note: "The energy harvest. Fear and trauma as food for 4D-negative entities." },
  { nodeId: "qanon", phase: "Earth", note: "The political-military operation. White hats vs the cabal." },
  { nodeId: "the-storm", phase: "Earth", note: "The mass-arrest event. Sealed indictments → tribunals." },

  // PHASE 4: PERSONAL PRACTICE
  { nodeId: "pineal-gland", phase: "Practice", note: "The biological antenna for higher consciousness. Decalcify it." },
  { nodeId: "raising-vibration", phase: "Practice", note: "The central practice. Meditation, forgiveness, service-to-others, clean living." },
];
