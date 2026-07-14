"use client";

import { useRef, useEffect, useCallback, useState } from "react";

interface HashtagGraphProps {
  tags: string[];
  activeTag: string | null;
  onTagClick: (tag: string) => void;
}

interface GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  label: string;
  radius: number;
  isCenter: boolean;
  hovered: boolean;
  scale: number;
  targetScale: number;
}

export default function HashtagGraph({
  tags,
  activeTag,
  onTagClick,
}: HashtagGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const animFrameRef = useRef<number>(0);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const initializedRef = useRef(false);

  // Compute target positions in a force-directed style layout
  const computeLayout = useCallback(
    (width: number, height: number) => {
      const centerX = width / 2;
      const centerY = height / 2;
      const padding = 50;
      const usableW = width - padding * 2;
      const usableH = height - padding * 2;

      // Center node
      const centerNode: GraphNode = {
        x: centerX,
        y: centerY,
        vx: 0,
        vy: 0,
        targetX: centerX,
        targetY: centerY,
        label: "__center__",
        radius: 7,
        isCenter: true,
        hovered: false,
        scale: 1,
        targetScale: 1,
      };

      const nodes: GraphNode[] = [centerNode];

      if (tags.length === 0) return nodes;

      // Arrange nodes in concentric rings based on count
      const maxPerRing = 8;
      const rings: GraphNode[][] = [[]];

      tags.forEach((tag, i) => {
        const ringIdx = Math.floor(i / maxPerRing);
        while (rings.length <= ringIdx) rings.push([]);
        rings[ringIdx].push(tag as unknown as GraphNode);
      });

      let nodeIndex = 0;
      rings.forEach((ring, ringIdx) => {
        const ringRadius = 55 + ringIdx * 55;
        const count = ring.length;
        const startAngle = -Math.PI / 2;

        ring.forEach((_, i) => {
          const angle = startAngle + (2 * Math.PI * i) / count;
          const tx = centerX + ringRadius * Math.cos(angle);
          const ty = centerY + ringRadius * Math.sin(angle);

          const isActive = activeTag === tags[nodeIndex];
          const isHovered = hoveredTag === tags[nodeIndex];
          const isRelated = activeTag !== null && !isActive;

          // If a tag is active, pull non-active nodes outward and fade them
          let finalX = tx;
          let finalY = ty;
          if (isRelated) {
            const pushAngle = Math.atan2(ty - centerY, tx - centerX);
            finalX = tx + 15 * Math.cos(pushAngle);
            finalY = ty + 15 * Math.sin(pushAngle);
          }

          // Check if this node already exists (keep animation state)
          const existing = nodesRef.current[nodeIndex + 1];
          nodes.push({
            x: existing ? existing.x : centerX + (Math.random() - 0.5) * 20,
            y: existing ? existing.y : centerY + (Math.random() - 0.5) * 20,
            vx: 0,
            vy: 0,
            targetX: finalX,
            targetY: finalY,
            label: tags[nodeIndex],
            radius: isActive ? 7 : 5,
            isCenter: false,
            hovered: isHovered,
            scale: existing ? existing.scale : 0.1,
            targetScale: isActive ? 1.3 : isRelated ? 0.7 : 1,
          });
          nodeIndex++;
        });
      });

      return nodes;
    },
    [tags, activeTag, hoveredTag]
  );

  // Main animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const nodes = nodesRef.current;
    const springStrength = 0.06;
    const damping = 0.75;
    let allSettled = true;

    // Update physics
    nodes.forEach((node) => {
      const dx = node.targetX - node.x;
      const dy = node.targetY - node.y;
      node.vx = (node.vx + dx * springStrength) * damping;
      node.vy = (node.vy + dy * springStrength) * damping;
      node.x += node.vx;
      node.y += node.vy;

      // Animate scale
      const scaleDiff = node.targetScale - node.scale;
      node.scale += scaleDiff * 0.08;

      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1 || Math.abs(scaleDiff) > 0.001) {
        allSettled = false;
      }
    });

    // Clear
    ctx.clearRect(0, 0, width, height);

    const centerNode = nodes[0];
    if (!centerNode) return;

    // Read theme colors from CSS variables
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const lineColor = isDark ? '120, 120, 120' : '200, 200, 200';
    const inactiveFill = isDark ? '#555555' : '#bbbbbb';
    const fadedFill = isDark ? '#444444' : '#dddddd';
    const labelColor = isDark ? '180, 180, 180' : '130, 130, 130';

    // Draw connections from center to each tag
    nodes.slice(1).forEach((node) => {
      const isActive = activeTag === node.label;
      const isAnyActive = activeTag !== null;
      const opacity = isAnyActive && !isActive ? 0.15 : isActive ? 0.6 : 0.25;

      ctx.beginPath();
      ctx.moveTo(centerNode.x, centerNode.y);
      ctx.lineTo(node.x, node.y);
      ctx.strokeStyle = isActive
        ? `rgba(184, 51, 255, ${opacity})`
        : `rgba(${lineColor}, ${opacity})`;
      ctx.lineWidth = isActive ? 1.5 : 0.8;
      ctx.stroke();
    });

    // Draw inter-tag connections (tags that share posts could be linked)
    // For visual richness, connect adjacent tags in each ring
    for (let i = 1; i < nodes.length; i++) {
      const next = i + 1 < nodes.length ? i + 1 : 1;
      if (next <= i) continue;

      const nodeA = nodes[i];
      const nodeB = nodes[next];
      const isAActive = activeTag === nodeA.label;
      const isBActive = activeTag === nodeB.label;
      const isAnyActive = activeTag !== null;
      const opacity = isAnyActive && !isAActive && !isBActive ? 0.05 : 0.1;

      ctx.beginPath();
      ctx.moveTo(nodeA.x, nodeA.y);
      ctx.lineTo(nodeB.x, nodeB.y);
      ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Draw center node
    const centerScale = centerNode.scale;
    ctx.beginPath();
    ctx.arc(
      centerNode.x,
      centerNode.y,
      centerNode.radius * centerScale,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "#b833ff";
    ctx.fill();

    // Center glow
    const gradient = ctx.createRadialGradient(
      centerNode.x,
      centerNode.y,
      0,
      centerNode.x,
      centerNode.y,
      centerNode.radius * 3
    );
    gradient.addColorStop(0, "rgba(184, 51, 255, 0.15)");
    gradient.addColorStop(1, "rgba(184, 51, 255, 0)");
    ctx.beginPath();
    ctx.arc(centerNode.x, centerNode.y, centerNode.radius * 3, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw tag nodes
    nodes.slice(1).forEach((node) => {
      const isActive = activeTag === node.label;
      const isHovered = hoveredTag === node.label;
      const isAnyActive = activeTag !== null && !isActive;
      const r = node.radius * node.scale;

      // Node glow for active
      if (isActive) {
        const glow = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          r * 3
        );
        glow.addColorStop(0, "rgba(184, 51, 255, 0.2)");
        glow.addColorStop(1, "rgba(184, 51, 255, 0)");
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = isActive
        ? "#b833ff"
        : isHovered
        ? "#d4a0ff"
        : isAnyActive
        ? fadedFill
        : inactiveFill;
      ctx.fill();

      if (isActive || isHovered) {
        ctx.strokeStyle = isActive
          ? "rgba(184, 51, 255, 0.4)"
          : "rgba(184, 51, 255, 0.2)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Label
      const labelOpacity = isAnyActive ? (isActive ? 1 : 0.3) : 1;
      ctx.font = `${isActive ? 600 : 400} 11px Inter, sans-serif`;
      ctx.fillStyle = isActive
        ? `rgba(184, 51, 255, ${labelOpacity})`
        : `rgba(${labelColor}, ${labelOpacity})`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Position label radially outward
      const angle = Math.atan2(node.y - centerNode.y, node.x - centerNode.x);
      const labelDist = r + 14;
      const lx = node.x + labelDist * Math.cos(angle);
      const ly = node.y + labelDist * Math.sin(angle);

      ctx.fillText(`#${node.label}`, lx, ly);
    });

    // Keep animating if not settled
    if (!allSettled) {
      animFrameRef.current = requestAnimationFrame(animate);
    }
  }, [activeTag, hoveredTag]);

  // Rebuild layout when tags/activeTag change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const newNodes = computeLayout(rect.width, rect.height);
    nodesRef.current = newNodes;

    // Kick off animation
    cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(animate);
    initializedRef.current = true;

    return () => cancelAnimationFrame(animFrameRef.current);
  }, [computeLayout, animate, tags]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const newNodes = computeLayout(rect.width, rect.height);
      // Preserve current positions for smooth transition, just update targets
      newNodes.forEach((node, i) => {
        if (nodesRef.current[i]) {
          node.x = nodesRef.current[i].x;
          node.y = nodesRef.current[i].y;
          node.scale = nodesRef.current[i].scale;
        }
      });
      nodesRef.current = newNodes;
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(animate);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [computeLayout, animate]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerNode = nodesRef.current[0];
    if (!centerNode) return;

    // Check center click → deselect
    const centerDist = Math.sqrt(
      (x - centerNode.x) ** 2 + (y - centerNode.y) ** 2
    );
    if (centerDist <= centerNode.radius * centerNode.scale + 8) {
      if (activeTag) {
        onTagClick(activeTag); // toggle off
      }
      return;
    }

    // Check tag nodes
    for (let i = 1; i < nodesRef.current.length; i++) {
      const node = nodesRef.current[i];
      const dist = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      if (dist <= (node.radius * node.scale) + 10) {
        onTagClick(node.label);
        return;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let found: string | null = null;
    for (let i = 1; i < nodesRef.current.length; i++) {
      const node = nodesRef.current[i];
      const dist = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      if (dist <= (node.radius * node.scale) + 10) {
        found = node.label;
        break;
      }
    }

    if (found !== hoveredTag) {
      setHoveredTag(found);
      canvas.style.cursor = found ? "pointer" : "default";
    }
  };

  const handleMouseLeave = () => {
    if (hoveredTag) {
      setHoveredTag(null);
      if (canvasRef.current) canvasRef.current.style.cursor = "default";
    }
  };

  // Calculate height based on tag count
  const rings = Math.ceil((tags.length || 1) / 8);
  const graphHeight = Math.max(200, 120 + rings * 55 + 40);

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        width: "100%",
        height: `${graphHeight}px`,
        display: "block",
        cursor: "pointer",
      }}
    />
  );
}