export function detectSmurfing(transactions){

  const fanIn={};
  const fanOut={};

  for(const t of transactions){

    if(!fanIn[t.receiver]) fanIn[t.receiver]=new Set();
    fanIn[t.receiver].add(t.sender);

    if(!fanOut[t.sender]) fanOut[t.sender]=new Set();
    fanOut[t.sender].add(t.receiver);
  }

  const suspicious=[];

  Object.entries(fanIn).forEach(([acc,set])=>{
    if(set.size>=10) suspicious.push({account:acc,pattern:"fan_in"});
  });

  Object.entries(fanOut).forEach(([acc,set])=>{
    if(set.size>=10) suspicious.push({account:acc,pattern:"fan_out"});
  });

  return suspicious;
}
