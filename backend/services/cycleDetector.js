export function detectCycles(adj){

  const rings=[];
  const seen=new Set();
  let id=1;

  function dfs(start,node,path,visited){

    if(path.length>5) return;

    visited.add(node);
    path.push(node);

    for(const next of adj[node]||[]){

      if(next===start && path.length>=3){

        const sorted=[...path].sort().join("-");
        if(!seen.has(sorted)){
          seen.add(sorted);
          rings.push({
            ring_id:"RING_"+String(id++).padStart(3,"0"),
            member_accounts:[...path],
            pattern_type:"cycle",
            risk_score:90
          });
        }
      }

      if(!visited.has(next)) dfs(start,next,path,visited);
    }

    path.pop();
    visited.delete(node);
  }

  Object.keys(adj).forEach(n=>dfs(n,n,[],new Set()));

  return rings;
}
