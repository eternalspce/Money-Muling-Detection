export function scoreAccounts(rings, smurf){

  const map={};

  rings.forEach(r=>{
    r.member_accounts.forEach(acc=>{
      if(!map[acc]) map[acc]={score:0,patterns:new Set(),ring:r.ring_id};
      map[acc].score+=40;
      map[acc].patterns.add("cycle");
    });
  });

  smurf.forEach(s=>{
    if(!map[s.account]) map[s.account]={score:0,patterns:new Set(),ring:null};
    map[s.account].score+=25;
    map[s.account].patterns.add(s.pattern);
  });

  return Object.entries(map).map(([acc,v])=>({
    account_id:acc,
    suspicion_score:Math.min(100,v.score),
    detected_patterns:[...v.patterns],
    ring_id:v.ring
  })).sort((a,b)=>b.suspicion_score-a.suspicion_score);
}
