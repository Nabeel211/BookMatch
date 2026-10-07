// public/assets/js/pages/perbandingan/perbandingan.js
let currentCriteria = JSON.parse(JSON.stringify(DEFAULT_CRITERIA));

function initPerbandingan(){
  const sel=document.getElementById('pbBookSel');
  BOOKS.forEach(b=>{const o=document.createElement('option');o.value=b.id;o.textContent=`${b.cover} ${b.title}`;sel.appendChild(o);});
  renderWeights();
  document.getElementById('pbRunBtn').addEventListener('click',runComparison);
}

function renderWeights(){
  const grid=document.getElementById('weightGrid'); grid.innerHTML='';
  currentCriteria.forEach((cr,i)=>{
    const d=document.createElement('div'); d.className='weight-item';
    d.innerHTML=`<label>${cr.label}</label><input type="number" step="0.05" min="0" max="1" value="${cr.weight}" data-idx="${i}"/>`;
    d.querySelector('input').addEventListener('input',e=>{
      currentCriteria[i].weight=parseFloat(e.target.value)||0;
      const total=currentCriteria.reduce((s,c)=>s+c.weight,0);
      const el=document.getElementById('weightTotal');
      el.textContent=total.toFixed(2);
      el.style.color=Math.abs(total-1)<0.01?'var(--green)':'var(--red)';
    });
    grid.appendChild(d);
  });
}

function runComparison(){
  const bookId=parseInt(document.getElementById('pbBookSel').value);
  const book=BOOKS.find(b=>b.id===bookId);
  const cbfResults=cbf.rec(bookId,15);
  const candidates=buildCandidates(cbfResults);
  const topsisResults=topsis.calculate(candidates,currentCriteria);
  const sawResults=saw.calculate(candidates,currentCriteria);
  renderDecisionMatrix(candidates,currentCriteria);
  renderMethodResult('topsisResult',topsisResults,'topsis');
  renderMethodResult('sawResult',sawResults,'saw');
  renderAnalysis(topsisResults,sawResults,book);
  document.getElementById('pbResults').style.display='block';
  document.getElementById('pbResults').scrollIntoView({behavior:'smooth'});
}

function renderDecisionMatrix(candidates,criteria){
  const wrap=document.getElementById('decisionMatrix');
  const t=document.createElement('table'); t.className='pb-table';
  t.innerHTML=`<thead><tr><th>Buku</th>${criteria.map(c=>`<th>${c.label}<br/><small>w=${c.weight}</small></th>`).join('')}</tr></thead><tbody>${candidates.map(c=>`<tr><td>${c.book.cover} ${c.book.title.slice(0,22)}</td>${criteria.map(cr=>`<td>${c.values[cr.key].toFixed(3)}</td>`).join('')}</tr>`).join('')}</tbody>`;
  wrap.innerHTML=''; wrap.appendChild(t);
}

function renderMethodResult(id,results,method){
  const container=document.getElementById(id);
  const scoreKey=method==='topsis'?'ci':'vi';
  const scoreLabel=method==='topsis'?'Nilai Ci (TOPSIS)':'Nilai Vi (SAW)';
  container.innerHTML=`<table class="pb-table"><thead><tr><th>Rank</th><th>Buku</th><th>${scoreLabel}</th><th>Skor CBF</th></tr></thead><tbody>${results.slice(0,10).map((r,i)=>`<tr class="${i===0?'rank-first':i<3?'rank-top':''}"><td><strong>#${r.rank}</strong></td><td>${r.book.cover} ${r.book.title.slice(0,22)}</td><td><strong>${r[scoreKey].toFixed(4)}</strong></td><td>${(r.cbfScore*100).toFixed(1)}%</td></tr>`).join('')}</tbody></table>`;
}

function renderAnalysis(topsisRes,sawRes,sourceBook){
  const container=document.getElementById('analysisResult');
  const n=Math.min(topsisRes.length,sawRes.length,10);
  const tIds=topsisRes.slice(0,n).map(r=>r.book.id);
  const sIds=sawRes.slice(0,n).map(r=>r.book.id);
  const commonIds=tIds.filter(id=>sIds.includes(id));
  let d2=0;
  commonIds.forEach(id=>{const rt=tIds.indexOf(id)+1,rs=sIds.indexOf(id)+1;d2+=Math.pow(rt-rs,2);});
  const spearman=commonIds.length>1?1-(6*d2)/(commonIds.length*(Math.pow(commonIds.length,2)-1)):0;
  const bothTop3=commonIds.filter(id=>tIds.indexOf(id)<3&&sIds.indexOf(id)<3).map(id=>BOOKS.find(b=>b.id===id));

  container.innerHTML=`
  <div class="analysis-stats">
    <div class="as-card"><div class="as-num">${(spearman*100).toFixed(1)}%</div><div class="as-lbl">Korelasi Spearman</div><div class="as-desc">Kemiripan urutan ranking antara TOPSIS dan SAW</div></div>
    <div class="as-card"><div class="as-num">${commonIds.length}/${n}</div><div class="as-lbl">Buku yang Sama</div><div class="as-desc">Buku yang muncul di top-${n} kedua metode</div></div>
    <div class="as-card"><div class="as-num">${bothTop3.length}</div><div class="as-lbl">Konsensus Top-3</div><div class="as-desc">Buku yang masuk top-3 di KEDUA metode</div></div>
  </div>
  ${bothTop3.length?`<div style="margin-top:16px"><h4 style="font-family:'Lora',serif;font-size:.95rem;margin-bottom:10px">🏆 Rekomendasi Terbaik (Konsensus)</h4><div style="display:flex;gap:12px;flex-wrap:wrap">${bothTop3.map(b=>`<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;overflow:hidden;width:150px;flex-shrink:0"><div style="height:70px;background:${b.color};display:flex;align-items:center;justify-content:center;font-size:2rem">${b.cover}</div><div style="padding:10px"><div style="font-family:'Lora',serif;font-size:.82rem;font-weight:600">${b.title.slice(0,22)}</div><div style="font-size:.7rem;color:var(--ink3)">${b.author}</div></div></div>`).join('')}</div></div>`:''}
  <div style="margin-top:20px">
    <h4 style="font-family:'Lora',serif;font-size:.95rem;margin-bottom:10px">📋 Tabel Perbandingan Ranking</h4>
    <table class="pb-table"><thead><tr><th>Buku</th><th>Rank TOPSIS</th><th>Rank SAW</th><th>Selisih |d|</th></tr></thead>
    <tbody>${commonIds.map(id=>{const b=BOOKS.find(x=>x.id===id);const rt=tIds.indexOf(id)+1,rs=sIds.indexOf(id)+1,diff=Math.abs(rt-rs);return`<tr><td>${b.cover} ${b.title.slice(0,22)}</td><td>#${rt}</td><td>#${rs}</td><td class="${diff===0?'diff-zero':diff<=2?'diff-low':'diff-high'}">${diff}</td></tr>`;}).join('')}</tbody></table>
  </div>`;
}

document.addEventListener('state-loaded', initPerbandingan);
