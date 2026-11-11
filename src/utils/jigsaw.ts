export interface JigsawEdge {
  top: number; // 0, 1, or -1
  right: number;
  bottom: number;
  left: number;
}

export interface JigsawPieceConfig {
  id: number;
  row: number;
  col: number;
  edges: JigsawEdge;
  path: string; // SVG path data for the piece
  viewBox: string;
  width: number;
  height: number;
  margin: number;
  cellW: number;
  cellH: number;
}

// Generate the edge interlocking map for an NxN grid deterministically
export function generateJigsawEdges(gridSize: number, seed: number = 42): JigsawEdge[][] {
  // Simple pseudo-random generator
  let state = seed;
  const nextRand = () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };

  // Horizontal edges between row r and r+1 (gridSize - 1 rows, gridSize cols)
  // +1 means (r, c) bottom has tab, (r+1, c) top has blank
  const hEdges: number[][] = [];
  for (let r = 0; r < gridSize - 1; r++) {
    hEdges[r] = [];
    for (let c = 0; c < gridSize; c++) {
      hEdges[r][c] = nextRand() > 0.5 ? 1 : -1;
    }
  }

  // Vertical edges between col c and c+1 (gridSize rows, gridSize - 1 cols)
  // +1 means (r, c) right has tab, (r, c+1) left has blank
  const vEdges: number[][] = [];
  for (let r = 0; r < gridSize; r++) {
    vEdges[r] = [];
    for (let c = 0; c < gridSize - 1; c++) {
      vEdges[r][c] = nextRand() > 0.5 ? 1 : -1;
    }
  }

  const result: JigsawEdge[][] = [];
  for (let r = 0; r < gridSize; r++) {
    result[r] = [];
    for (let c = 0; c < gridSize; c++) {
      result[r][c] = {
        top: r === 0 ? 0 : -hEdges[r - 1][c],
        bottom: r === gridSize - 1 ? 0 : hEdges[r][c],
        left: c === 0 ? 0 : -vEdges[r][c - 1],
        right: c === gridSize - 1 ? 0 : vEdges[r][c],
      };
    }
  }

  return result;
}

// Generates SVG path string for a piece given cell size and edge flags
export function createJigsawPath(
  x: number,
  y: number,
  w: number,
  h: number,
  edges: JigsawEdge,
  tabSize: number
): string {
  // Helper to draw edge with tab/blank
  // Edge from (x1, y1) to (x2, y2)
  const drawEdge = (x1: number, y1: number, x2: number, y2: number, sign: number): string => {
    if (sign === 0) {
      return `L ${x2.toFixed(2)} ${y2.toFixed(2)}`;
    }

    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    // Unit vector along edge
    const ux = dx / len;
    const uy = dy / len;
    // Unit normal vector (pointing outward when sign = 1)
    const nx = -uy * sign;
    const ny = ux * sign;

    const pt = (s: number, normalDist: number) => {
      const px = x1 + s * dx + normalDist * tabSize * nx;
      const py = y1 + s * dy + normalDist * tabSize * ny;
      return `${px.toFixed(2)} ${py.toFixed(2)}`;
    };

    // Beautiful smooth tab with neck and circular bulb
    const p1 = pt(0.35, 0);
    const cp1a = pt(0.38, 0.05);
    const cp1b = pt(0.33, 0.45);
    const p2 = pt(0.40, 0.75);

    const cp2a = pt(0.44, 1.15);
    const cp2b = pt(0.56, 1.15);
    const p3 = pt(0.60, 0.75);

    const cp3a = pt(0.67, 0.45);
    const cp3b = pt(0.62, 0.05);
    const p4 = pt(0.65, 0);

    return `L ${p1} C ${cp1a}, ${cp1b}, ${p2} C ${cp2a}, ${cp2b}, ${p3} C ${cp3a}, ${cp3b}, ${p4} L ${x2.toFixed(2)} ${y2.toFixed(2)}`;
  };

  // Corners
  const cTopLeft = `${x.toFixed(2)} ${y.toFixed(2)}`;
  const topEdge = drawEdge(x, y, x + w, y, edges.top);
  const rightEdge = drawEdge(x + w, y, x + w, y + h, edges.right);
  const bottomEdge = drawEdge(x + w, y + h, x, y + h, edges.bottom);
  const leftEdge = drawEdge(x, y + h, x, y, edges.left);

  return `M ${cTopLeft} ${topEdge} ${rightEdge} ${bottomEdge} ${leftEdge} Z`;
}
