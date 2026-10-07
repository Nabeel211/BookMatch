// public/assets/js/pages/quiz/quiz.js
const QUESTIONS=[
  {q:'📖 Suasana cerita seperti apa yang paling kamu suka?',opts:[{icon:'🏰',text:'Dunia ajaib penuh keajaiban & sihir',scores:{fantasy:3,adventure:1}},{icon:'🌌',text:'Alam semesta masa depan yang canggih',scores:{'sci-fi':3,dystopia:1}},{icon:'🏛️',text:'Cerita berdasarkan sejarah nyata',scores:{historical:3,literary:2}},{icon:'🌆',text:'Kehidupan modern sehari-hari',scores:{romance:2,'self-help':2,indonesia:1}}]},
  {q:'🎭 Tokoh utama seperti apa yang paling menarik?',opts:[{icon:'⚔️',text:'Pahlawan yang berjuang melawan kejahatan',scores:{fantasy:2,adventure:2,dystopia:1}},{icon:'🔍',text:'Detektif atau pemecah misteri',scores:{mystery:3,thriller:2}},{icon:'💕',text:'Karakter yang mencari cinta sejati',scores:{romance:3,drama:1}},{icon:'🧠',text:'Pemikir yang mengubah dunia',scores:{'sci-fi':2,'non-fiction':2,'self-help':1}}]},
  {q:'😊 Perasaan apa yang ingin kamu rasakan setelah membaca?',opts:[{icon:'🤩',text:'Terpesona dan penuh imajinasi',scores:{fantasy:3,'sci-fi':2}},{icon:'😱',text:'Deg-degan dan penasaran',scores:{mystery:2,thriller:2,dystopia:1}},{icon:'🥹',text:'Terharu dan terinspirasi',scores:{indonesia:2,inspirational:2,literary:1}},{icon:'💪',text:'Termotivasi dan lebih produktif',scores:{'self-help':3,'non-fiction':2}}]},
  {q:'⏱️ Berapa lama kamu membaca dalam sekali duduk?',opts:[{icon:'⚡',text:'Kurang dari 30 menit',scores:{'self-help':2,romance:1}},{icon:'☕',text:'30–60 menit',scores:{indonesia:2,literary:1}},{icon:'🌙',text:'1–2 jam',scores:{fantasy:2,mystery:2}},{icon:'🔥',text:'Sampai lupa waktu!',scores:{dystopia:2,thriller:2}}]},
  {q:'🌍 Latar tempat yang paling kamu sukai?',opts:[{icon:'🇮🇩',text:'Indonesia — budaya nusantara',scores:{indonesia:4}},{icon:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',text:'Eropa klasik / Inggris',scores:{fantasy:1,mystery:2,romance:1,classic:2}},{icon:'🚀',text:'Luar angkasa / planet lain',scores:{'sci-fi':3,dystopia:1}},{icon:'🌏',text:'Tidak penting, ceritanya yang utama',scores:{literary:2,philosophy:2,'non-fiction':1}}]},
  {q:'📚 Buku yang sudah pernah kamu baca dan suka?',opts:[{icon:'⚡',text:'Harry Potter / Lord of the Rings',scores:{fantasy:4,adventure:2}},{icon:'😱',text:'The Hunger Games / Divergent',scores:{dystopia:4,'young-adult':2}},{icon:'🔍',text:'Sherlock Holmes / Da Vinci Code',scores:{mystery:4,thriller:2}},{icon:'🌈',text:'Laskar Pelangi / Negeri 5 Menara',scores:{indonesia:4,inspirational:2}}]},
];

const PROFILES={
  fantasy:{label:'Pecinta Fantasy & Petualangan',badge:'🧙',desc:'Kamu suka dunia penuh imajinasi dan keajaiban.',features:['fantasy','adventure','epic','magic']},
  'sci-fi':{label:'Penggemar Fiksi Ilmiah',badge:'🚀',desc:'Kamu tertarik pada masa depan dan teknologi.',features:['sci-fi','dystopia','adventure','classic']},
  mystery:{label:'Detektif Berbakat',badge:'🔍',desc:'Kamu suka teka-teki dan mengikuti petunjuk.',features:['mystery','thriller','detective','crime']},
  dystopia:{label:'Pembaca Bertema Kritis',badge:'😱',desc:'Kamu suka buku yang menantang tatanan sosial.',features:['dystopia','sci-fi','thriller','social-critique']},
  romance:{label:'Pencinta Kisah Cinta',badge:'💕',desc:'Hatimu hangat untuk kisah cinta dan emosi.',features:['romance','drama','literary','classic']},
  'self-help':{label:'Pengembang Diri Sejati',badge:'💡',desc:'Kamu membaca untuk tumbuh dan menjadi lebih baik.',features:['self-help','non-fiction','psychology','productivity']},
  indonesia:{label:'Pecinta Sastra Indonesia',badge:'🇮🇩',desc:'Kamu bangga dengan karya sastra lokal Indonesia!',features:['indonesia','inspirational','literary','drama']},
  'non-fiction':{label:'Pembaca Faktual & Analitis',badge:'📊',desc:'Kamu lebih suka buku berbasis fakta dan riset.',features:['non-fiction','history','science','philosophy']},
};

let qIdx=0,answers=[],scores={};

function initQuiz(){
  document.getElementById('startQuiz').addEventListener('click',startQuiz);
  document.getElementById('retakeQuiz').addEventListener('click',()=>location.reload());
  document.getElementById('quizBack').addEventListener('click',()=>{if(qIdx>0){qIdx--;answers.pop();showQ();}});
}

function startQuiz(){
  document.getElementById('quizIntro').style.display='none';
  document.getElementById('quizMain').style.display='block';
  showQ();
}

function showQ(){
  const q=QUESTIONS[qIdx];
  document.getElementById('quizFill').style.width=`${(qIdx/QUESTIONS.length)*100}%`;
  document.getElementById('quizProgLabel').textContent=`Pertanyaan ${qIdx+1} dari ${QUESTIONS.length}`;
  document.getElementById('quizQ').textContent=q.q;
  document.getElementById('quizBack').style.display=qIdx>0?'block':'none';
  const opts=document.getElementById('quizOpts'); opts.innerHTML='';
  q.opts.forEach(opt=>{
    const btn=document.createElement('button'); btn.className='quiz-opt';
    btn.innerHTML=`<span class="quiz-opt-icon">${opt.icon}</span><span>${opt.text}</span>`;
    btn.addEventListener('click',()=>{opts.querySelectorAll('.quiz-opt').forEach(b=>b.classList.remove('selected'));btn.classList.add('selected');setTimeout(()=>pick(opt.scores),300);});
    opts.appendChild(btn);
  });
  document.getElementById('quizCard').style.animation='none';
  void document.getElementById('quizCard').offsetWidth;
  document.getElementById('quizCard').style.animation='slideIn .28s ease';
}

function pick(sc){
  Object.entries(sc).forEach(([k,v])=>{scores[k]=(scores[k]||0)+v;});
  answers.push(sc); qIdx++;
  if(qIdx<QUESTIONS.length)showQ(); else showResult();
}

async function showResult(){
  document.getElementById('quizMain').style.display='none';
  document.getElementById('quizResult').style.display='block';
  const top=Object.entries(scores).sort((a,b)=>b[1]-a[1])[0][0];
  const p=PROFILES[top]||PROFILES.fantasy;
  document.getElementById('qrBadge').textContent=p.badge;
  document.getElementById('qrTitle').textContent=p.label;
  document.getElementById('qrDesc').textContent=p.desc;
  document.getElementById('qrTags').innerHTML=p.features.map(f=>`<span class="qr-tag">${f}</span>`).join('');
  const qv={};
  cbf.allF.forEach(f=>{qv[f]=p.features.includes(f)?1:0;});
  const m=Math.sqrt(Object.values(qv).reduce((s,v)=>s+v*v,0));
  if(m>0)cbf.allF.forEach(f=>qv[f]/=m);
  const recs=BOOKS.map((b,i)=>({book:b,score:cbf.cos(qv,cbf.vecs[i])})).sort((a,b)=>b.score-a.score).slice(0,6);
  const grid=document.getElementById('qrGrid'); grid.innerHTML='';
  recs.forEach(({book,score})=>grid.appendChild(mkCard(book,score)));
  // Simpan hasil ke DB
  try { await apiPost('/quiz-result',{genre:top,profile:p.label}); } catch(e){}
}

document.addEventListener('state-loaded', initQuiz);
