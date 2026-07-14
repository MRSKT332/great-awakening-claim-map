"use client";

import { useEffect, useRef } from "react";
import type { GAMNode, GAMLink } from "@/lib/gam/types";
import { CATEGORY_MAP } from "@/lib/gam/groups";

interface Props {
  nodes: (GAMNode & { x: number; y: number; z: number })[];
  links: GAMLink[];
  selectedId: string | null;
  activeCategories: Set<string>;
  searchQuery: string;
  searchMatches: Set<string>; // node ids that match the current search
  pathHighlight: Set<string> | null; // node ids on the path to highlight
  onSelect: (node: GAMNode) => void;
  onReady?: (api: GraphAPI) => void;
}

export interface GraphAPI {
  resetView: () => void;
  focusNode: (id: string) => void;
  getNodePosition: (id: string) => { x: number; y: number; z: number } | null;
}

export default function Graph3D({
  nodes,
  links,
  selectedId,
  activeCategories,
  searchQuery,
  searchMatches,
  pathHighlight,
  onSelect,
  onReady,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const selectedRef = useRef(selectedId);
  const activeCatsRef = useRef(activeCategories);
  const searchRef = useRef(searchQuery);
  const searchMatchesRef = useRef(searchMatches);
  const pathRef = useRef(pathHighlight);
  const onSelectRef = useRef(onSelect);

  useEffect(() => { selectedRef.current = selectedId; }, [selectedId]);
  useEffect(() => { activeCatsRef.current = activeCategories; }, [activeCategories]);
  useEffect(() => { searchRef.current = searchQuery; }, [searchQuery]);
  useEffect(() => { searchMatchesRef.current = searchMatches; }, [searchMatches]);
  useEffect(() => { pathRef.current = pathHighlight; }, [pathHighlight]);
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

      // Use the pre-positioned nodes directly — no physics
      const gNodes = nodes.map((n) => {
        const cat = CATEGORY_MAP[n.category];
        return {
          id: n.id,
          label: n.label,
          category: n.category,
          color: cat.color,
          weight: n.weight,
          val: Math.max(1, n.weight * 1.5),
          x: n.x,
          y: n.y,
          z: n.z,
          fx: n.x,  // fix position — no movement
          fy: n.y,
          fz: n.z,
          __node: n,
        };
      });
      const gLinks = links.map((l) => ({ source: l.source, target: l.target }));

      const computeNodeColor = (node: any) => {
        const sel = selectedRef.current;
        const cats = activeCatsRef.current;
        const q = searchRef.current;
        const matches = searchMatchesRef.current;
        const path = pathRef.current;
        if (sel && node.id === sel) return "#ffffff";
        if (path && path.has(node.id)) return "#ffea00"; // path highlight = yellow
        if (q) {
          if (matches.has(node.id)) return node.color;
          return "rgba(50,52,75,0.25)";
        }
        if (!cats.has(node.category)) return "rgba(50,52,75,0.2)";
        return node.color;
      };

      const computeLinkColor = (link: any) => {
        const sel = selectedRef.current;
        const path = pathRef.current;
        if (path && path.has(link.source.id) && path.has(link.target.id)) {
          return "rgba(255,234,0,0.9)"; // path links = bright yellow
        }
        if (sel && (link.source.id === sel || link.target.id === sel)) {
          return "rgba(255,255,255,0.85)"; // selected node links = white
        }
        return "rgba(140,150,200,0.45)"; // default links — much more visible than before
      };

      const graph = ForceGraph3D()(containerRef.current!)
        .graphData({ nodes: gNodes, links: gLinks })
        .backgroundColor("#06070d")
        .showNavInfo(false)
        .nodeRelSize(5)
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
          sprite.textHeight = 5;
          sprite.position.y = -11;
          return sprite;
        })
        .nodeThreeObjectExtend(true)
        .linkColor(computeLinkColor)
        .linkWidth(1.0)          // was 0.4 — much thicker
        .linkOpacity(0.6)        // was 0.22
        .linkDirectionalParticles(0)
        .linkDirectionalArrowLength(0)
        .linkCurvature(0)
        // NO simulation — positions are fixed
        .d3Force("charge", null as any)
        .d3Force("link", null as any)
        .d3Force("center", null as any)
        .d3Force("x", null as any)
        .d3Force("y", null as any)
        .d3Force("z", null as any)
        .cooldownTicks(0)
        .onNodeClick((node: any) => {
          // Camera animation is handled by the parent's focusNode() —
          // don't call cameraPosition here to avoid double-animation conflicts.
          onSelectRef.current(node.__node as GAMNode);
        })
        .onNodeDrag((node: any) => {
          // Allow dragging but don't release the fixed position
        })
        .onNodeDragEnd((node: any) => {
          node.fx = node.x;
          node.fy = node.y;
          node.fz = node.z;
        });

      graphRef.current = graph;

      // Initial camera — top-down overview
      graph.cameraPosition({ x: 0, y: 0, z: 750 });

      // ROBUST RAYCASTER WARM-UP — 3d-force-graph's internal raycaster only
      // updates its mouse position on pointermove. If the user clicks without
      // first moving the mouse (e.g. page loads, user immediately clicks a
      // bubble), the raycaster has stale/zero coordinates and the click misses.
      // We fix this in two ways:
      //  (a) dispatch a synthetic pointermove at center after init
      //  (b) intercept ALL pointerdown events on the canvas and dispatch a
      //      pointermove at the same coordinates BEFORE the click is processed.
      //      This guarantees the raycaster always has the correct mouse position
      //      when a click fires, so the first click always hits the right node.
      setTimeout(() => {
        if (!containerRef.current) return;
        const canvas = containerRef.current.querySelector('canvas');
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const moveEvent = new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: rect.left + rect.width / 2,
          clientY: rect.top + rect.height / 2,
        });
        canvas.dispatchEvent(moveEvent);
      }, 100);

      // Intercept pointerdown AND click: fire a pointermove at the same
      // coordinates BEFORE the event is processed by 3d-force-graph's
      // raycaster. This guarantees the raycaster always has the correct mouse
      // position, so every click — first or otherwise — hits the right node.
      const canvas = containerRef.current.querySelector('canvas');
      if (canvas) {
        const primingHandler = (e: PointerEvent | MouseEvent) => {
          // Dispatch a pointermove at the exact same coordinates right before
          // the event is processed. This ensures the raycaster has the current
          // mouse position, so the node-hit-test succeeds on the first click.
          const moveEvent = new PointerEvent('pointermove', {
            bubbles: true,
            cancelable: true,
            clientX: e.clientX,
            clientY: e.clientY,
            pointerId: (e as PointerEvent).pointerId ?? 1,
            pointerType: (e as PointerEvent).pointerType ?? 'mouse',
          });
          canvas.dispatchEvent(moveEvent);
        };
        // Use capture phase + both pointerdown and mousedown to cover all
        // browsers and event pathways. The capture phase fires before any
        // other handlers, ensuring the raycaster is primed first.
        canvas.addEventListener('pointerdown', primingHandler as EventListener, { capture: true });
        canvas.addEventListener('mousedown', primingHandler as EventListener, { capture: true });
        // Store for cleanup
        (graph as any).__primingHandler = primingHandler;
        (graph as any).__primingCanvas = canvas;
      }

      if (onReady) {
        onReady({
          resetView: () => {
            graph.cameraPosition({ x: 0, y: 0, z: 750 }, { x: 0, y: 0, z: 0 }, 600);
          },
          focusNode: (id: string) => {
            const data = graph.graphData();
            const target = data.nodes.find((n: any) => n.id === id);
            if (!target) return;
            const distance = 200;
            // Shorter duration (400ms) so consecutive clicks don't overlap
            // animations. The 3d-force-graph library handles cancellation
            // internally when a new cameraPosition is called.
            graph.cameraPosition(
              { x: target.x + distance, y: target.y + distance * 0.4, z: target.z + distance },
              { x: target.x, y: target.y, z: target.z },
              400,
            );
          },
          getNodePosition: (id: string) => {
            const data = graph.graphData();
            const target = data.nodes.find((n: any) => n.id === id);
            if (!target) return null;
            return { x: target.x, y: target.y, z: target.z };
          },
        });
      }

      (graph as any).__refreshColors = () => {
        graph.nodeColor(computeNodeColor);
        graph.linkColor(computeLinkColor);
      };
    })();

    return () => {
      cancelled = true;
      // Clean up the priming handler
      if (graphRef.current) {
        const handler = (graphRef.current as any).__primingHandler as EventListener | undefined;
        const primingCanvas = (graphRef.current as any).__primingCanvas as HTMLCanvasElement | undefined;
        if (handler && primingCanvas) {
          primingCanvas.removeEventListener('pointerdown', handler, { capture: true } as any);
          primingCanvas.removeEventListener('mousedown', handler, { capture: true } as any);
        }
        try { graphRef.current._destructor(); } catch {}
        graphRef.current = null;
      }
      if (containerRef.current) {
        (containerRef.current as any).__graphInited = false;
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  useEffect(() => {
    const graph = graphRef.current;
    if (graph && (graph as any).__refreshColors) {
      (graph as any).__refreshColors();
    }
  }, [selectedId, activeCategories, searchQuery, searchMatches, pathHighlight]);

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
