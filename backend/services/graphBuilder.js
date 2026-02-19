export function buildGraph(transactions){
  const adj={};
  const nodes=new Set();
  const edges=[];

  for(const t of transactions){
    nodes.add(t.sender);
    nodes.add(t.receiver);

    if(!adj[t.sender]) adj[t.sender]=[];
    adj[t.sender].push(t.receiver);

    edges.push({source:t.sender,target:t.receiver});
  }

  return {
  adj,
  nodes: Array.from(nodes),   
  edges
};
}
