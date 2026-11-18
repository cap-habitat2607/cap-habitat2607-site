// Terrains
const T=[
 ["Romans-sur-Isère","Centre-ville","2 100 m²","139 000 €","Constructible en plein centre, cadre verdoyant et calme, proche commerces, écoles, bus et gare."],
 ["Tournon-sur-Rhône","Sur les hauteurs · 15 min","650 / 1 000 m²","dès 43 000 €","Cadre calme et proche de la nature. 1 000 m² à 59 500 €."],
 ["Romans-sur-Isère","Ouest · Quartier des Ors","440 m²","70 000 €","Proche de tous les commerces. Idéal premier projet ou maison de retraite."],
 ["Saint-Christophe-et-le-Laris","20 min de Romans","567 m²","50 000 €","Terrain plat hors lotissement, parfait pour un premier achat."],
 ["Vion","Entre Sarras et Tournon","809 m²","86 000 €","Hors lotissement, vue sur les collines ardéchoises et drômoises."],
 ["Peyrins","3 min du village","1 125 m²","Prix sur demande","Environnement calme et vue dégagée."]
];
const hills=(i)=>{const h=[["#e9dcbc","#d6bf86","#C29E4E"],["#e4ddd0","#c9b896","#a8843a"],["#efe6d2","#cdb27a","#8a6d33"]][i%3];
 return `<svg viewBox="0 0 400 150" preserveAspectRatio="none"><rect width="400" height="150" fill="${h[0]}"/><circle cx="${300-i*30}" cy="50" r="22" fill="#fff" opacity=".7"/><path d="M0 95 C80 ${70+i*4} 150 100 230 80 C300 62 360 90 400 78 V150 H0Z" fill="${h[1]}"/><path d="M0 125 C100 105 200 128 300 110 C350 101 380 108 400 106 V150 H0Z" fill="${h[2]}"/></svg>`};
const tg=document.getElementById('tgrid'); if(tg) tg.innerHTML=T.map((t,i)=>`<div class="terrain reveal"><div class="top">${hills(i)}<span class="surf">${t[2]}</span></div><div class="b"><h3>${t[0]}</h3><div class="loc">${t[1]}</div><p>${t[4]}</p><div class="price">${t[3]} <small>terrain nu</small></div></div></div>`).join('');

// Partenaires
const ic={
 notaire:'<path d="M5 20h14M7 20V10m5 10V10m5 10V10M4 10h16L12 4z"/>',
 courtier:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/>',
 diag:'<path d="M9 3h6v4l4 12H5L9 7z"/><path d="M8 13h8"/>',
 photo:'<rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13" r="3.5"/><path d="M8 7l2-3h4l2 3"/>',
 archi:'<path d="M12 3l3 18M12 3L9 21M7 14h10"/>',
 moe:'<path d="M3 21h18M5 21V11l7-6 7 6v10"/><path d="M10 21v-6h4v6"/>',
 cuisine:'<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M4 10h16M8 6h1M12 6h1M8 14v4"/>',
 moeuvre:'<rect x="3" y="4" width="18" height="14" rx="1"/><path d="M3 9h7v9M10 13h11M14 4v5"/><path d="M6 21h12"/>'
};
const P=[["notaire","Notaire"],["courtier","Courtier"],["diag","Diagnostiqueur"],["photo","Photographe"],["archi","Architecte"],["moe","Constructeur"],["cuisine","Cuisiniste"],["moeuvre","Maître d'œuvre"]];
const pg=document.getElementById('pgrid'); if(pg) pg.innerHTML=P.map(p=>`<div class="p"><svg viewBox="0 0 24 24">${ic[p[0]]}</svg><div>${p[1]}</div></div>`).join('');


// Compteur de caractères du message
(()=>{const m=document.getElementById('f-msg'),c=document.getElementById('f-cpt');if(!m)return;
m.addEventListener('input',()=>{const n=m.value.trim().length;c.textContent=n<100?`(encore ${100-n} caractères minimum)`:'✓';c.style.color=n<100?'':'var(--gold-d)';});})();
// Formulaire : envoi vers contact.php (hébergement OVH)
const cf=document.getElementById('cform'); if(cf) cf.addEventListener('submit',async e=>{
  e.preventDefault();const f=e.target,ok=document.getElementById('cok');
  try{const r=await fetch(f.action,{method:'POST',body:new FormData(f)});const t=await r.text();
    if(!r.ok||!t.includes('OK'))throw 0;ok.textContent='Merci, votre message est bien envoyé. Je vous réponds rapidement.';f.reset();ok.style.display='block';}
  catch(_){document.getElementById('cerr').hidden=false;}
});

// Avis Google : lit avis-google.php (mis à jour automatiquement depuis la fiche Google)
(async()=>{
  if(!document.getElementById('g-badge')&&!$('g-list'))return;
  const $=id=>document.getElementById(id)||{style:{}};
  const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const etoiles=n=>'★'.repeat(Math.round(n))+'☆'.repeat(5-Math.round(n));
  try{
    const r=await fetch('avis-google.php',{cache:'no-store'}); const d=await r.json();
    if(d.erreur||!d.note) throw 0;
    const nt=Number(d.note).toFixed(1).replace('.',',');
    $('g-note').textContent=nt;
    $('gb-note').textContent=nt;
    $('gb-stars').textContent=etoiles(d.note);
    $('gb-txt').textContent=d.nombre+' avis Google';
    $('g-stars').textContent=etoiles(d.note);
    $('g-count').textContent=d.nombre+(d.nombre>1?' avis':' avis');
    if(d.lienFiche) $('g-fiche').href=d.lienFiche;
    $('g-list').innerHTML=(d.avis||[]).map(a=>`<div class="grev">
      <div class="who"><div class="av">${a.photo?`<img src="${esc(a.photo)}" alt="" referrerpolicy="no-referrer">`:esc(a.auteur[0]||'G')}</div>
      <div><b>${esc(a.auteur)}</b><small>${esc(a.date)} · Google</small></div></div>
      <div class="st">${etoiles(a.note)}</div>
      <p class="cut">${esc(a.texte)}</p>${a.texte.length>320?'<button onclick="this.previousElementSibling.classList.remove(\'cut\');this.remove()">Lire la suite</button>':''}</div>`).join('');
  }catch(_){ /* aperçu ou clé absente : on affiche la note de la fiche et les liens Google */ 
    const gs=document.querySelector('.gsum'); if(gs) gs.style.display='none';
  }
})();
// Header + reveal
const hd=document.getElementById('top');
const onS=()=>hd.classList.toggle('solid',scrollY>60);onS();addEventListener('scroll',onS);
document.querySelectorAll('.menu a').forEach(a=>a.addEventListener('click',()=>document.querySelector('.menu').classList.remove('open')));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
