// public/assets/js/pages/tentang/tentang.js
function initTentang(){
  ['demoA','demoB','barSel'].forEach(id=>{
    const sel=document.getElementById(id);if(!sel)return;
    BOOKS.forEach(b=>{const o=document.createElement('option');o.value=b.id;o.textContent=`${b.cover} ${b.title}`;sel.appendChild(o);});
  });
  if(document.getElementById('demoB'))document.getElementById('demoB').value=2;
  function updateDemo(){
    const idA=parseInt(document.getElementById('demoA').value),idB=parseInt(document.getElementById('demoB').value);
    const bA=BOOKS.find(b=>b.id===idA),bB=BOOKS.find(b=>b.id===idB);
    const score=cbf.getSim(idA,idB),pct=Math.round(score*100);
    const col=pct>=70?'var(--green)':pct>=40?'var(--amber)':'var(--ink3)';
    const common=bA.features.filter(f=>bB.features.includes(f));
    const onlyA=bA.features.filter(f=>!bB.features.includes(f));
    const onlyB=bB.features.filter(f=>!bA.features.includes(f));
    document.getElementById('demoResult').innerHTML=`<div class="dr-score-big"><div class="dr-pct" style="color:${col}">${pct}%</div><div class="dr-lbl">Tingkat Kemiripan Cosine Similarity</div></div><div class="dr-section"><div class="dr-stitle">✅ Fitur yang SAMA (${common.length})</div><div>${common.length?common.map(f=>`<span class="tag" style="background:var(--green-bg);color:var(--green)">${f}</span>`).join(' '):'<span style="font-size:.78rem;color:var(--ink3)">Tidak ada</span>'}</div></div><div class="dr-section" style="margin-top:10px"><div class="dr-stitle">🔵 Hanya di "${bA.title.slice(0,20)}"</div><div>${onlyA.map(f=>`<span class="tag">${f}</span>`).join(' ')||'—'}</div></div><div class="dr-section" style="margin-top:8px"><div class="dr-stitle">🟠 Hanya di "${bB.title.slice(0,20)}"</div><div>${onlyB.map(f=>`<span class="tag">${f}</span>`).join(' ')||'—'}</div></div>`;
  }
  document.getElementById('demoA').addEventListener('change',updateDemo);
  document.getElementById('demoB').addEventListener('change',updateDemo);
  updateDemo();
  function updateBar(){
    const id=parseInt(document.getElementById('barSel').value);
    const results=cbf.rec(id,8);
    document.getElementById('barChart').innerHTML=results.map(({book,score})=>{const p=Math.round(score*100);return`<div class="bc-row"><span class="bc-name">${book.cover} ${book.title}</span><div class="bc-bar-w"><div class="bc-bar" style="width:${p}%"></div></div><span class="bc-pct">${p}%</span></div>`;}).join('');
  }
  document.getElementById('barSel').addEventListener('change',updateBar);
  updateBar();
}
document.addEventListener('state-loaded', initTentang);
