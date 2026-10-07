// public/assets/js/core/cbf.js
// Sama persis dengan versi vanilla, tapi inisialisasi CBF ditunda
// sampai BOOKS terisi dari API (event 'books-loaded')

class ContentBasedFiltering {
  constructor(books) {
    this.books = books;
    this.allF = [...new Set(books.flatMap(b => b.features))].sort();
    const N = books.length;
    this.idf = {};
    this.allF.forEach(f => {
      const df = books.filter(b => b.features.includes(f)).length;
      this.idf[f] = Math.log((N + 1) / (df + 1)) + 1;
    });
    this.vecs = books.map(bk => {
      const tf = {};
      bk.features.forEach(f => { tf[f] = (tf[f] || 0) + 1 / bk.features.length; });
      const v = {};
      this.allF.forEach(f => { v[f] = (tf[f] || 0) * this.idf[f]; });
      const mag = Math.sqrt(Object.values(v).reduce((s, x) => s + x * x, 0));
      this.allF.forEach(f => { v[f] = mag > 0 ? v[f] / mag : 0; });
      return v;
    });
  }

  cos(a, b) { return this.allF.reduce((s, f) => s + (a[f]||0)*(b[f]||0), 0); }

  rec(id, n = 8) {
    const i = this.books.findIndex(b => b.id === id);
    if (i < 0) return [];
    return this.books.map((b, j) => ({ book: b, score: this.cos(this.vecs[i], this.vecs[j]) }))
      .filter(x => x.book.id !== id).sort((a, b) => b.score - a.score).slice(0, n);
  }

  recFromMultiple(ids, n = 8) {
    const validIdxs = ids.map(id => this.books.findIndex(b => b.id === id)).filter(i => i >= 0);
    if (!validIdxs.length) return [];
    const merged = {};
    this.allF.forEach(f => merged[f] = 0);
    validIdxs.forEach(i => this.allF.forEach(f => merged[f] += this.vecs[i][f]));
    const mag = Math.sqrt(Object.values(merged).reduce((s, v) => s + v * v, 0));
    if (mag > 0) this.allF.forEach(f => merged[f] /= mag);
    return this.books.filter(b => !ids.includes(b.id))
      .map(b => { const i = this.books.findIndex(x => x.id === b.id); return { book: b, score: this.cos(merged, this.vecs[i]) }; })
      .sort((a, b) => b.score - a.score).slice(0, n);
  }

  getSim(idA, idB) {
    const i = this.books.findIndex(b => b.id === idA);
    const j = this.books.findIndex(b => b.id === idB);
    return i < 0 || j < 0 ? 0 : this.cos(this.vecs[i], this.vecs[j]);
  }

  smartSearch(query, n = 8) {
    const q = query.trim(); if (!q) return { exactMatches:[], partialMatches:[], recommendations:[] };
    const ql = q.toLowerCase();
    const words = ql.split(/\s+/).filter(w => w.length > 1);
    const exactMatches=[], partialMatches=[], recommendations=[];
    const usedIds = new Set();

    this.books.forEach(b => { if(b.title.toLowerCase()===ql){exactMatches.push({book:b,score:1,matchType:'exact'});usedIds.add(b.id);} });
    this.books.forEach(b => { if(usedIds.has(b.id))return; if(b.title.toLowerCase().startsWith(ql)){exactMatches.push({book:b,score:.97,matchType:'starts'});usedIds.add(b.id);} });
    this.books.forEach(b => { if(usedIds.has(b.id))return; if(b.title.toLowerCase().includes(ql)){partialMatches.push({book:b,score:.9,matchType:'title-contains'});usedIds.add(b.id);} });
    this.books.forEach(b => { if(usedIds.has(b.id))return; const tl=b.title.toLowerCase(); if(words.length>1&&words.every(w=>tl.includes(w))){partialMatches.push({book:b,score:.85,matchType:'all-words'});usedIds.add(b.id);} });
    this.books.forEach(b => { if(usedIds.has(b.id))return; const al=b.author.toLowerCase(); if(al.includes(ql)||words.some(w=>al.includes(w))){partialMatches.push({book:b,score:.8,matchType:'author'});usedIds.add(b.id);} });
    this.books.forEach(b => { if(usedIds.has(b.id))return; const tl=b.title.toLowerCase(); if(words.some(w=>tl.includes(w))){partialMatches.push({book:b,score:.7,matchType:'partial-word'});usedIds.add(b.id);} });

    const qv={};
    this.allF.forEach(f=>{qv[f]=f.includes(ql)||ql.includes(f)||words.some(w=>f.includes(w))?1:0;});
    const m=Math.sqrt(Object.values(qv).reduce((s,v)=>s+v*v,0));
    if(m>0) this.allF.forEach(f=>qv[f]/=m);
    this.books.filter(b=>!usedIds.has(b.id)).map(b=>{const i=this.books.findIndex(x=>x.id===b.id);return{book:b,score:this.cos(qv,this.vecs[i]),matchType:'genre-cbf'};})
      .filter(x=>x.score>.05).sort((a,b)=>b.score-a.score).slice(0,n).forEach(x=>{recommendations.push(x);usedIds.add(x.book.id);});

    if(exactMatches.length||partialMatches.length){
      const foundIds=[...exactMatches,...partialMatches].map(x=>x.book.id);
      if(foundIds.length&&!recommendations.length){
        this.recFromMultiple(foundIds,n).forEach(x=>{if(!usedIds.has(x.book.id)){recommendations.push({...x,matchType:'cbf'});usedIds.add(x.book.id);}});
      }
    }
    return {exactMatches,partialMatches:partialMatches.sort((a,b)=>b.score-a.score),recommendations:recommendations.sort((a,b)=>b.score-a.score).slice(0,n)};
  }
}

// CBF diinisialisasi setelah BOOKS terisi
let cbf;
document.addEventListener('books-loaded', () => {
  cbf = new ContentBasedFiltering(BOOKS);
  document.dispatchEvent(new Event('cbf-ready'));
});
