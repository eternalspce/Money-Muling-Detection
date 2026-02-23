export function detectCycles(adj) {
  let index = 0;
  const stack = [];
  const onStack = new Set();
  const indices = {};
  const lowlink = {};
  const rings = [];
  let id = 1;

  function strongconnect(v) {
    indices[v] = index;
    lowlink[v] = index;
    index++;

    stack.push(v);
    onStack.add(v);

    for (const w of (adj[v] || [])) {

      if (indices[w] === undefined) {
        strongconnect(w);
        lowlink[v] = Math.min(lowlink[v], lowlink[w]);
      }

      else if (onStack.has(w)) {
        lowlink[v] = Math.min(lowlink[v], indices[w]);
      }
    }

    // root of SCC
    if (lowlink[v] === indices[v]) {
      const component = [];
      let w;

      do {
        w = stack.pop();
        onStack.delete(w);
        component.push(w);
      } while (w !== v);

      // only rings with >=3 accounts
      if (component.length >= 3) {
        rings.push({
          ring_id: "RING_" + String(id++).padStart(3, "0"),
          member_accounts: component,
          pattern_type: "cycle",
          risk_score: 90
        });
      }
    }
  }

  for (const v of Object.keys(adj)) {
    if (indices[v] === undefined) strongconnect(v);
  }

  return rings;
}