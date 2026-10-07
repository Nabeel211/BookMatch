// public/assets/js/core/topsis.js
class TOPSIS {
  calculate(candidates, criteria) {
    if (!candidates.length) return [];
    const matrix = candidates.map(c=>({book:c.book,score:c.score,values:criteria.map(cr=>c.values[cr.key])}));
    // Normalisasi vektor
    const norm = matrix.map(row=>({...row,values:[...row.values]}));
    criteria.forEach((cr,j)=>{
      const denom=Math.sqrt(matrix.map(r=>r.values[j]).reduce((s,v)=>s+v*v,0))||1;
      norm.forEach((row,i)=>{row.values[j]=matrix[i].values[j]/denom;});
    });
    // Bobot
    const weighted=norm.map(row=>({...row,values:row.values.map((v,j)=>v*criteria[j].weight)}));
    // Ideal positif & negatif
    const A_pos=criteria.map((cr,j)=>{const col=weighted.map(r=>r.values[j]);return cr.type==='benefit'?Math.max(...col):Math.min(...col);});
    const A_neg=criteria.map((cr,j)=>{const col=weighted.map(r=>r.values[j]);return cr.type==='benefit'?Math.min(...col):Math.max(...col);});
    // Jarak & preferensi
    return weighted.map((row,i)=>{
      const dPos=Math.sqrt(row.values.reduce((s,v,j)=>s+Math.pow(v-A_pos[j],2),0));
      const dNeg=Math.sqrt(row.values.reduce((s,v,j)=>s+Math.pow(v-A_neg[j],2),0));
      const ci=(dPos+dNeg)===0?0:dNeg/(dPos+dNeg);
      return {book:row.book,cbfScore:row.score,dPos,dNeg,ci,
        normValues:norm[i].values,weightedValues:row.values,rawValues:matrix[i].values};
    }).sort((a,b)=>b.ci-a.ci).map((r,i)=>({...r,rank:i+1}));
  }
}
const topsis=new TOPSIS();
