"use client";

import { useEffect, useRef } from "react";
import type { GAMNode, GAMLink } from "@/lib/gam/types";
import { CATEGORY_MAP } from "@/lib/gam/groups";

interface Props {
  nodes: GAMNode[];
  links: GAMLink[];
  selectedId: string | null;
  activeCategories: Set<string>;
  searchQuery: string;
  onSelect: (node: GAMNode) => void;
  /** Imperative ref handle for parent to call resetView / focusNode. */
  onReady?: (api: GraphAPI) => void;
}

export interface GraphAPI {
  resetView: () => void;
  focusNode: (id: string) => void;
}

/**
 * Arkham-style 3D force-directed graph built on 3d-force-graph.
 *
 * - Each node is a colored sphere sized by `weight`.
 * - Nodes are connected by translucent lines.
 * - Clicking a node centers it and notifies the parent via onSelect.
 * - Category filtering and search dimming are supported via props.
 */
export default function Graph3D({
  nodes,
  links,
  selectedId,
  activeCategories,
  searchQuery,
  onSelect,
  onReady,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  // Keep latest props in refs so the init effect can stay mount-only
  const selectedRef = useRef(selectedId);
  const activeCatsRef = useRef(activeCategories);
  const searchRef = useRef(searchQuery);
  const onSelectRef = useRef(onSelect);

  useEffect(() => { selectedRef.current = selectedId; }, [selectedId]);
  useEffect(() => { activeCatsRef.current = activeCategories; }, [activeCategories]);
  useEffect(() => { searchRef.current = searchQuery; }, [searchQuery]);
  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);

  useEffect(() => {
    if (!containerRef.current) return;
    if ((containerRef.current as any).__graphInited) return;
    (containerRef.current as any).__graphInited = true;

    let cancelled = false;
    (async () => {
      const ForceGraph3DModule = await import("3d-force-graph");
      const ForceGraph3D = ForceGraph3DModule.default || ForceGraph3DModule;
      const SpriteTextModule = await import("three-spritetext");
      const SpriteText = SpriteTextModule.default || SpriteTextModule;
      if (cancelled || !containerRef.current) return;

      // Build the initial graph data
      const gNodes = nodes.map((n) => {
        const cat = CATEGORY_MAP[n.category];
        return {
          id: n.id,
          label: n.label,
          category: n.category,
          color: cat.color,
          weight: n.weight,
          val: Math.max(1, n.weight * 1.6),
          __node: n,
        };
      });
      const gLinks = links.map((l) => ({ source: l.source, target: l.target }));

      const computeNodeColor = (node: any) => {
        const sel = selectedRef.current;
        const cats = activeCatsRef.current;
        const q = searchRef.current;
        if (sel && node.id === sel) return "#ffffff";
        if (q && !node.label.toLowerCase().includes(q.toLowerCase())) return "rgba(70,72,95,0.4)";
        if (!cats.has(node.category)) return "rgba(70,72,95,0.3)";
        return node.color;
      };

      const computeLinkColor = (link: any) => {
        const sel = selectedRef.current;
        if (sel && (link.source.id === sel || link.target.id === sel)) {
          return "rgba(255,255,255,0.75)";
        }
        return "rgba(120,130,180,0.22)";
      };

      const graph = ForceGraph3D()(containerRef.current!)
        .graphData({ nodes: gNodes, links: gLinks })
        .backgroundColor("#06070d")
        .showNavInfo(false)
        .nodeRelSize(4.5)
        .nodeColor(computeNodeColor)
        .nodeOpacity(0.95)
        .nodeLabel((node: any) => {
          const cat = CATEGORY_MAP[node.category as string];
          return `<div style="background:rgba(10,11,18,0.95);border:1px solid ${cat.color};padding:7px 11px;border-radius:6px;font:12px -apple-system,Inter,sans-serif;color:#e7e6f0;max-width:260px;"><b style="color:${cat.color};">${node.label}</b><br/><span style="color:#8a8ba3;font-size:10px;text-transform:uppercase;letter-spacing:.5px;">${cat.label}</span></div>`;
        })
        .nodeThreeObject((node: any) => {
          const cat = CATEGORY_MAP[node.category as string];
          const sprite = new SpriteText(node.label);
          sprite.color = "#e7e6f0";
          sprite.backgroundColor = "rgba(10,11,18,0.78)";
          sprite.padding = 3;
          sprite.borderRadius = 3;
          sprite.borderColor = cat.color;
          sprite.borderWidth = 0.6;
          sprite.textHeight = 4.5;
          sprite.position.y = -10;
          return sprite;
        })
        .nodeThreeObjectExtend(true)
        .linkColor(computeLinkColor)
        .linkWidth(0.4)
        .linkDirectionalParticles(0)
        .linkDirectionalArrowLength(0)
        .linkCurvature(0.06)
        // STABILITY: settle fast and stay still
        .cooldownTicks(120)
        .d3AlphaDecay(0.08)   // higher = cools down faster
        .d3VelocityDecay(0.55) // higher = more friction = less jitter
        .warmupTicks(60)       // pre-compute layout before first render
        .onNodeClick((node: any) => {
          onSelectRef.current(node.__node as GAMNode);
          const distance = 220;
          graph.cameraPosition(
            { x: node.x + distance, y: node.y + distance * 0.4, z: node.z + distance },
            { x: node.x, y: node.y, z: node.z },
            900,
          );
        })
        .onNodeDragEnd((node: any) => {
          // Pin node in place after drag
          node.fx = node.x;
          node.fy = node.y;
          node.fz = node.z;
        })
        .onEngineStop(() => {
          // Fully freeze nodes once the simulation settles — no more drifting
          const data = graph.graphData();
          data.nodes.forEach((n: any) => {
            n.vx = 0; n.vy = 0; n.vz = 0;
          });
        })
        .onBackgroundClick(() => {
          // Release all pinned nodes on background click
          const data = graph.graphData();
          data.nodes.forEach((n: any) => { n.fx = null; n.fy = null; n.fz = null; });
        });

      // GENTLE forces for 284 nodes — minimal floating
      const charge = graph.d3Force("charge");
      if (charge) charge.strength(-90).distanceMax(320);  // was -220, way too strong
      const link = graph.d3Force("link");
      if (link) { link.distance(38); link.strength(0.18); }
      const center = graph.d3Force("center");
      if (center) center.strength(0.003);  // very gentle pull to center
      // Remove the default x/y/z forces that cause drifting
      graph.d3Force("x", null);
      graph.d3Force("y", null);
      graph.d3Force("z", null);

      graphRef.current = graph;

      // Initial camera position — tilted top-down for a nice overview
      graph.cameraPosition({ x: 0, y: -150, z: 700 });

      // Expose API to parent for reset / focus controls
      if (onReady) {
        onReady({
          resetView: () => {
            graph.cameraPosition({ x: 0, y: -150, z: 700 }, { x: 0, y: 0, z: 0 }, 800);
          },
          focusNode: (id: string) => {
            const data = graph.graphData();
            const target = data.nodes.find((n: any) => n.id === id);
            if (!target) return;
            const distance = 220;
            graph.cameraPosition(
              { x: target.x + distance, y: target.y + distance * 0.4, z: target.z + distance },
              { x: target.x, y: target.y, z: target.z },
              900,
            );
          },
        });
      }

      // Re-render colors when props change (without rebuilding the graph)
      (graph as any).__refreshColors = () => {
        graph.nodeColor(computeNodeColor);
        graph.linkColor(computeLinkColor);
        graph.nodeRelSize(4.5);
      };
    })();

    return () => {
      cancelled = true;
      if (graphRef.current) {
        try { graphRef.current._destructor(); } catch {}
        graphRef.current = null;
      }
      if (containerRef.current) {
        (containerRef.current as any).__graphInited = false;
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  // Refresh colors when selection / filter / search changes
  useEffect(() => {
    const graph = graphRef.current;
    if (graph && (graph as any).__refreshColors) {
      (graph as any).__refreshColors();
    }
  }, [selectedId, activeCategories, searchQuery]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        inset: 0,
        background: "#06070d",
      }}
    />
  );
}
