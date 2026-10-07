// public/assets/js/core/saw.js
class SAW {
  calculate(candidates, criteria) {
    if (!candidates.length) return [];
    const norm = candidates.map(c=>({book:c.book,score:c.score,values:{...c.values}}));
    criteria.forEach(cr=>{
      const col=candidates.map(c=>c.values[cr.key]);
      const maxV=Math.max(...col)||1, minV=Math.min(...col)||1;
      norm.forEach((row,i)=>{
        const raw=candidates[i].values[cr.key];
        row.values[cr.key]=cr.type==='benefit'?raw/maxV:minV/(raw||1);
      });
    });
    return norm.map((row,i)=>{
      const vi=criteria.reduce((sum,cr)=>sum+cr.weight*row.values[cr.key],0);
      return {book:row.book,cbfScore:row.score,vi,rawValues:candidates[i].values,normValues:row.values};
    }).sort((a,b)=>b.vi-a.vi).map((r,i)=>({...r,rank:i+1}));
  }
}
const saw=new SAW();
