import { NODES, LINKS, STATS } from "../src/lib/gam/index";
console.log("Total nodes:", NODES.length);
console.log("Total links:", LINKS.length);
console.log("By category:");
STATS.nodesPerCategory.forEach(c => console.log(`  ${c.label}: ${c.count}`));
// Check for any links pointing to non-existent ids
const idSet = new Set(NODES.map(n => n.id));
const broken = [];
NODES.forEach(n => (n.links || []).forEach(l => {
  if (!idSet.has(l)) broken.push(`${n.id} -> ${l}`);
}));
console.log("\nBroken links:", broken.length);
if (broken.length > 0) console.log(broken.slice(0, 20));
