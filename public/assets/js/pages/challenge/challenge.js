// public/assets/js/pages/challenge/challenge.js
function initChallenge(){
  if(ST.challenge){
    document.getElementById('chSetup').style.display='none';
    document.getElementById('chDashboard').style.display='block';
    renderDash();
  }
  document.querySelectorAll('.tp-btn').forEach(b=>b.addEventListener('click',()=>setTarget(parseInt(b.dataset.val))));
  document.getElementById('setCustom').addEventListener('click',()=>{
    const n=parseInt(document.getElementById('customTarget').value);
    if(n>0&&n<=365)setTarget(n); else showToast('Masukkan angka 1–365','warn');
  });
  document.getElementById('openAdd').addEventListener('click',()=>{document.getElementById('abmOverlay').style.display='flex';renderAbmList('');});
  document.getElementById('closeAdd').addEventListener('click',()=>document.getElementById('abmOverlay').style.display='none');
  document.getElementById('abmOverlay').addEventListener('click',e=>{if(e.target===document.getElementById('abmOverlay'))document.getElementById('abmOverlay').style.display='none';});
  document.getElementById('abmSearch').addEventListener('input',e=>renderAbmList(e.target.value));
  document.getElementById('abmAdd').addEventListener('click',addCustomBook);
  document.getElementById('resetCh').addEventListener('click',async()=>{
    if(!confirm('Reset semua data challenge?'))return;
    await apiPost('/api/challenge/reset');
    ST.challenge=null; ST.readBooks=[];
    document.getElementById('chDashboard').style.display='none';
    document.getElementById('chSetup').style.display='flex';
    showToast('Challenge direset','success');
  });
}

async function setTarget(n){
  const data=await apiPost('/api/challenge',{target:n});
  ST.challenge=data.challenge;
  document.getElementById('chSetup').style.display='none';
  document.getElementById('chDashboard').style.display='block';
  renderDash();
}

function renderDash(){
  const ch=ST.challenge; const rl=ST.readBooks;
  const done=rl.length, target=ch.target;
  const pct=Math.min(100,Math.round(done/target*100));
  const C=2*Math.PI*50;
  document.getElementById('ringDone').textContent=done;
  document.getElementById('ringTotal').textContent=target;
  document.getElementById('ringFill').style.strokeDashoffset=C-(pct/100)*C;
  document.getElementById('chTitle').textContent=`Challenge ${ch.year}`;
  document.getElementById('ovDone').textContent=done;
  document.getElementById('ovLeft').textContent=Math.max(0,target-done);
  document.getElementById('ovPct').textContent=pct+'%';
  const ml=Math.max(1,12-new Date().getMonth());
  document.getElementById('ovPM').textContent=Math.ceil(Math.max(0,target-done)/ml);
  const badges=[];
  if(done>=1)badges.push('🎉 Buku Pertama!');
  if(done>=5)badges.push('📚 Pembaca Aktif');
  if(done>=10)badges.push('🔥 10 Buku!');
  if(done>=Math.round(target/2))badges.push('⚡ Setengah Jalan!');
  if(done>=target)badges.push('🏆 SELESAI!');
  document.getElementById('chBadges').innerHTML=badges.map(b=>`<span class="ch-badge">${b}</span>`).join('');
  renderMonthBars(rl); renderReadList(rl); renderNextRecs(rl);
}

function renderMonthBars(rl){
  const months=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  const counts=Array(12).fill(0);
  rl.forEach(r=>{if(r.month>=0&&r.month<12)counts[r.month]++;});
  const max=Math.max(...counts,1);
  const wrap=document.getElementById('monthBars'); wrap.innerHTML='';
  months.forEach((m,i)=>{const col=document.createElement('div');col.className='mb-col';const h=Math.round(counts[i]/max*76);col.innerHTML=`<div class="mb-bar-wrap"><div class="mb-bar ${counts[i]===0?'empty':''}" style="height:${Math.max(3,h)}px"></div></div><div class="mb-val">${counts[i]||''}</div><div class="mb-label">${m}</div>`;wrap.appendChild(col);});
}

function renderReadList(rl){
  const list=document.getElementById('readList');
  document.getElementById('readCount').textContent=rl.length;
  list.innerHTML='';
  document.getElementById('emptyRead').style.display=rl.length?'none':'block';
  [...rl].reverse().forEach(r=>{
    const d=document.createElement('div'); d.className='read-item';
    d.innerHTML=`<div class="ri-icon">${r.cover||'📖'}</div><div class="ri-info"><div class="ri-title">${r.title}</div><div class="ri-meta">${r.author||''}</div></div><div class="ri-date">${r.date||''}</div><button class="ri-rm" data-id="${r.dbId||''}">✕</button>`;
    d.querySelector('.ri-rm').addEventListener('click',async()=>{
      if(r.dbId){await apiDelete(`/readbooks/${r.dbId}`);}
      ST.readBooks=ST.readBooks.filter(x=>x!==r);
      renderDash();
    });
    list.appendChild(d);
  });
}

function renderNextRecs(rl){
  const row=document.getElementById('nextRow'); row.innerHTML='';
  const ids=rl.map(r=>r.id).filter(Boolean);
  const recs=ids.length?cbf.recFromMultiple(ids,6):[...BOOKS].sort((a,b)=>b.rating-a.rating).slice(0,6).map(b=>({book:b,score:null}));
  recs.forEach(({book,score})=>row.appendChild(mkCard(book,score)));
}

function renderAbmList(q){
  const list=document.getElementById('abmList'); list.innerHTML='';
  const readIds=ST.readBooks.map(r=>r.id).filter(Boolean);
  let books=BOOKS;
  if(q){const ql=q.toLowerCase();books=books.filter(b=>b.title.toLowerCase().includes(ql)||b.author.toLowerCase().includes(ql));}
  books.slice(0,15).forEach(b=>{
    const added=readIds.includes(b.id);
    const d=document.createElement('div'); d.className='abm-item'+(added?' added':'');
    d.innerHTML=`<div class="abm-item-icon">${b.cover}</div><div class="abm-item-info"><div class="abm-item-title">${b.title}</div><div class="abm-item-author">${b.author}</div></div><button class="abm-item-add">${added?'✓':'+ Tambah'}</button>`;
    if(!added)d.querySelector('.abm-item-add').addEventListener('click',async()=>{
      const data=await apiPost('/api/readbooks',{book_id:b.id});
      if(data.error==='already_added'){showToast('Sudah ada di daftar');return;}
      if(data.readBook){ST.readBooks.push(data.readBook);showToast(`✅ "${b.title}" ditambahkan!`,'success');renderAbmList(document.getElementById('abmSearch').value);renderDash();}
    });
    list.appendChild(d);
  });
}

async function addCustomBook(){
  const title=document.getElementById('abmTitle').value.trim();
  const author=document.getElementById('abmAuthor').value.trim();
  if(!title){showToast('Masukkan judul buku!','warn');return;}
  const data=await apiPost('/api/readbooks',{custom_title:title,custom_author:author});
  if(data.readBook){ST.readBooks.push(data.readBook);showToast(`✅ "${title}" ditambahkan!`,'success');document.getElementById('abmTitle').value='';document.getElementById('abmAuthor').value='';document.getElementById('abmOverlay').style.display='none';renderDash();}
}

document.addEventListener('state-loaded', initChallenge);
