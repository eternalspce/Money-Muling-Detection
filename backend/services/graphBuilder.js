export function buildGraph(transactions){

  const adj = new Map();
  const nodes = new Set();
  const edges = [];

  for(const t of transactions){

    const s = t.sender;     // already trimmed in upload.js
    const r = t.receiver;   // already trimmed in upload.js

    nodes.add(s);
    nodes.add(r);

    let list = adj.get(s);
    if(list === undefined){
      list = [];
      adj.set(s,list);
    }

    list.push(r);
    edges.push({ source: s, target: r });
  }

  // convert Map → plain object for JSON serialization
  const adjObj = Object.create(null);
  for(const [k,v] of adj) adjObj[k]=v;

  return {
    adj: adjObj,
    nodes: Array.from(nodes), // convert to array for JSON serialization
    edges,
  };
}