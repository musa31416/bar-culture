/* Bar Culture shared script: nav, footer, location sorting, gallery, lightbox, quote form */
(function(){
const PAGE = document.body.dataset.page || 'home';
const PHONE = '512.844.5233', TEL = '+15128445233', EMAIL = 'barculturenow@gmail.com';

/* ---------- nav + footer ---------- */
const pages=[['index.html','Home','home'],['about.html','About','about'],['services.html','Services','services'],['gallery.html','Gallery','gallery'],['faq.html','FAQ','faq']];
document.body.insertAdjacentHTML('afterbegin',`
<nav id="nav"><div class="wrap nav-in">
  <a href="index.html" class="brand">BAR CULTURE</a>
  <button class="burger" id="burger" aria-label="Menu">&#9776;</button>
  <div class="links" id="links">
    ${pages.map(p=>`<a href="${p[0]}" class="${p[2]===PAGE?'active':''}">${p[1]}</a>`).join('')}
    <a href="contact.html" class="btn btn-gold">Get a Quote</a>
  </div>
</div></nav>`);
document.body.insertAdjacentHTML('beforeend',`
<footer>
  <img src="img/logo-gold.png" alt="Bar Culture">
  <p>Bartending &amp; Event Staffing &nbsp;|&nbsp; <span data-cities-inline>Austin &middot; San Antonio &middot; Dallas &middot; Houston &middot; Destin</span></p>
  <p style="margin-top:8px"><a href="tel:${TEL}">${PHONE}</a> &nbsp;|&nbsp; <a href="mailto:${EMAIL}">${EMAIL}</a></p>
  <p style="margin-top:18px;font-size:12px">&copy; ${new Date().getFullYear()} Bar Culture. All rights reserved.</p>
</footer>
<div class="lb" id="lb"><button class="lb-x" aria-label="Close">&times;</button><button class="lb-nav lb-p" aria-label="Previous">&#8249;</button><img alt=""><button class="lb-nav lb-n" aria-label="Next">&#8250;</button><div class="lb-count"></div></div>`);

const nav=document.getElementById('nav'), links=document.getElementById('links');
const solid=()=>nav.classList.toggle('solid',scrollY>40||PAGE!=='home');
addEventListener('scroll',solid); solid();
document.getElementById('burger').onclick=()=>links.classList.toggle('open');

const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.fade').forEach(el=>io.observe(el));

/* ---------- location: nearest city first ---------- */
const CITIES={ // default order = Texas first, Austin home base
  'Austin':[30.2672,-97.7431],'San Antonio':[29.4241,-98.4936],'Dallas':[32.7767,-96.7970],
  'Houston':[29.7604,-95.3698],'Destin':[30.3935,-86.4958]};
const miles=(a,b)=>{const R=3959,r=Math.PI/180,dLa=(b[0]-a[0])*r,dLo=(b[1]-a[1])*r;
  const h=Math.sin(dLa/2)**2+Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(dLo/2)**2;return 2*R*Math.asin(Math.sqrt(h));};
function applyLocation(lat,lon){
  const me=[lat,lon];
  const order=Object.keys(CITIES).map(c=>[c,miles(me,CITIES[c])]).sort((a,b)=>a[1]-b[1]);
  if(order[0][1]>400) return;           // too far from every city: keep default order
  const rank=Object.fromEntries(order.map((o,i)=>[o[0],i]));
  document.querySelectorAll('[data-cities]').forEach(box=>{
    [...box.children].sort((a,b)=>rank[a.dataset.city]-rank[b.dataset.city]).forEach(el=>box.appendChild(el));
  });
  const first=order[0][0];
  document.querySelectorAll('[data-cities] [data-city="'+first+'"]').forEach(el=>el.classList.add('closest'));
  document.querySelectorAll('[data-cities-inline]').forEach(el=>el.innerHTML=order.map(o=>o[0]).join(' &middot; '));
  document.querySelectorAll('[data-near]').forEach(el=>{el.textContent='Now serving '+first+' & surrounding areas';el.classList.add('show')});
}
(async()=>{
  try{const c=sessionStorage.getItem('bc_geo');if(c){const g=JSON.parse(c);return applyLocation(g[0],g[1]);}}catch(e){}
  const srcs=[['https://get.geojs.io/v1/ip/geo.json','latitude','longitude'],['https://ipapi.co/json/','latitude','longitude']];
  for(const [u,la,lo] of srcs){
    try{const r=await fetch(u);if(!r.ok)continue;const d=await r.json();const g=[+d[la],+d[lo]];
      if(isNaN(g[0]))continue;try{sessionStorage.setItem('bc_geo',JSON.stringify(g))}catch(e){}
      return applyLocation(g[0],g[1]);}catch(e){}
  }
})();

/* ---------- gallery images ---------- */
const GALLERY=['tablescape','bartender','celebrate','wedding','cart','party','ceremony','punch','outdoor-bar',
  'tables','gala','wine-station','welcome','buffet','team','branded-bar','outdoor-bar2','hero'];
const src=n=>'img/'+n+'.jpg';

/* ---------- lightbox ---------- */
const lb=document.getElementById('lb'), lbImg=lb.querySelector('img'), lbCount=lb.querySelector('.lb-count');
let li=0;
const show=i=>{li=(i+GALLERY.length)%GALLERY.length;lbImg.style.opacity=0;
  setTimeout(()=>{lbImg.src=src(GALLERY[li]);lbImg.onload=()=>lbImg.style.opacity=1;},150);
  lbCount.textContent=(li+1)+' / '+GALLERY.length;};
const openLB=i=>{show(i);lb.classList.add('on');document.body.style.overflow='hidden';};
const closeLB=()=>{lb.classList.remove('on');document.body.style.overflow='';};
lb.querySelector('.lb-x').onclick=closeLB;
lb.querySelector('.lb-p').onclick=()=>show(li-1);
lb.querySelector('.lb-n').onclick=()=>show(li+1);
lb.onclick=e=>{if(e.target===lb)closeLB();};
addEventListener('keydown',e=>{if(!lb.classList.contains('on'))return;
  if(e.key==='Escape')closeLB();if(e.key==='ArrowLeft')show(li-1);if(e.key==='ArrowRight')show(li+1);});
let tx=0;lb.addEventListener('touchstart',e=>tx=e.touches[0].clientX,{passive:true});
lb.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)show(li+(d<0?1:-1));});

/* ---------- carousel: 3 at a time, auto-advance ---------- */
document.querySelectorAll('[data-carousel]').forEach(root=>{
  root.innerHTML=`<button class="c-btn c-prev" aria-label="Previous">&#8249;</button>
    <div class="c-view"><div class="c-track">${GALLERY.map((n,i)=>`<div class="c-item" data-i="${i}"><img src="${src(n)}" alt="Bar Culture event photo"></div>`).join('')}</div></div>
    <button class="c-btn c-next" aria-label="Next">&#8250;</button><div class="c-dots"></div>`;
  const track=root.querySelector('.c-track'), dots=root.querySelector('.c-dots');
  let page=0,timer;
  const per=()=>innerWidth<=900?1:3, pagesN=()=>Math.ceil(GALLERY.length/per());
  function go(p){
    page=(p+pagesN())%pagesN();
    const item=track.children[0], step=item.getBoundingClientRect().width+18;
    track.style.transform=`translateX(${-page*per()*step}px)`;
    [...dots.children].forEach((d,i)=>d.classList.toggle('on',i===page));
  }
  function buildDots(){dots.innerHTML='';for(let i=0;i<pagesN();i++){const b=document.createElement('button');b.onclick=()=>{go(i);restart()};dots.appendChild(b);}go(Math.min(page,pagesN()-1));}
  const restart=()=>{clearInterval(timer);timer=setInterval(()=>go(page+1),4500);};
  root.querySelector('.c-prev').onclick=()=>{go(page-1);restart()};
  root.querySelector('.c-next').onclick=()=>{go(page+1);restart()};
  root.addEventListener('mouseenter',()=>clearInterval(timer));
  root.addEventListener('mouseleave',restart);
  let sx=0;root.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;clearInterval(timer)},{passive:true});
  root.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>40)go(page+(d<0?1:-1));restart();});
  track.querySelectorAll('.c-item').forEach(el=>el.onclick=()=>openLB(+el.dataset.i));
  addEventListener('resize',buildDots);
  buildDots();restart();
});

/* ---------- full grid (gallery page) ---------- */
document.querySelectorAll('[data-grid]').forEach(g=>{
  g.innerHTML=GALLERY.map((n,i)=>`<div data-i="${i}" class="fade in"><img src="${src(n)}" alt="Bar Culture event photo" loading="lazy"></div>`).join('');
  g.querySelectorAll('div').forEach(el=>el.onclick=()=>openLB(+el.dataset.i));
});

/* ---------- quote form (demo: opens email app) ---------- */
const q=document.getElementById('quote');
if(q) q.onsubmit=e=>{e.preventDefault();const f=new FormData(q);
  const body=[...f.entries()].map(([k,v])=>k+': '+v).join('\n');
  location.href='mailto:'+EMAIL+'?subject='+encodeURIComponent('Quote request: '+f.get('type'))+'&body='+encodeURIComponent(body);};
})();
