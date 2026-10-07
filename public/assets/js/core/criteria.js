// public/assets/js/core/criteria.js
const DEFAULT_CRITERIA = [
  { key:'cbfScore',   label:'Kemiripan Konten', weight:0.40, type:'benefit' },
  { key:'rating',     label:'Rating Buku',      weight:0.25, type:'benefit' },
  { key:'yearScore',  label:'Tahun Terbit',     weight:0.15, type:'benefit' },
  { key:'genreMatch', label:'Kecocokan Genre',  weight:0.20, type:'benefit' },
];

function buildCandidates(cbfResults, queryGenre='') {
  const years = cbfResults.map(r=>r.book.year);
  const minY = Math.min(...years), maxY = Math.max(...years);
  const rangeY = maxY - minY || 1;
  return cbfResults.map(({book,score})=>({
    book, score,
    values:{
      cbfScore:   score,
      rating:     book.rating/5,
      yearScore:  (book.year-minY)/rangeY,
      genreMatch: queryGenre ? book.features.filter(f=>f===queryGenre).length : book.features.length/10,
    }
  }));
}
