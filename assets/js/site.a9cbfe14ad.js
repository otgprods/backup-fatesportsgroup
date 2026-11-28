
(function(){
'use strict';
const $=(s,r)=>(r||document).querySelector(s), $$=(s,r)=>Array.from((r||document).querySelectorAll(s));
const root=document.documentElement, RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const el=(t,c,txt)=>{const e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e};
/* smooth wheel scrolling, as on the Jamie Chadwick site (Lenis, same settings); mouse and trackpad only, never with reduced motion, touch stays native */
let lenis=null;
if(!RM&&window.Lenis&&matchMedia('(hover:hover) and (pointer:fine)').matches){lenis=new Lenis({lerp:.085,smoothWheel:true,wheelMultiplier:1,prevent:n=>!!(n.closest&&n.closest('#sheet,.menu'))});window.__lenis=lenis;const lr=t=>{lenis.raf(t);requestAnimationFrame(lr)};requestAnimationFrame(lr)}
const F_MASK="url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 496.38 613.27'%3E%3Cpath d='"+$('#curtain path').getAttribute('d')+"'/%3E%3Cpath d='"+$$('#curtain path')[1].getAttribute('d')+"'/%3E%3C/svg%3E\")";
root.style.setProperty('--fmask',F_MASK);

/* ---------- intro: the live site's first-load motion graphic, same timeline and values ---------- */
let afterLogo=null;
const flatIntro=()=>{
  const overlay=$('#intro');let fin=false;
  const reveal=()=>root.classList.add('ready');
  const end=()=>{if(fin)return;fin=true;root.classList.add('lg');if(afterLogo)afterLogo();reveal();root.classList.remove('intro');try{sessionStorage.setItem('fsg-intro','1')}catch(e){}};
  const onHome=!/^\/(athletes|brand-partnerships|services|contact)(\/|$)/.test(location.pathname);
  const run=()=>{if(fin)return;const gsap=window.gsap;
    const fullLogo=overlay.querySelector('#FSG_x5F_Logo'),logoLeft=overlay.querySelector('#logo_x5F_f'),logoRight=overlay.querySelector('#logo_x5F_inv_x5F_f'),logoText=overlay.querySelector('#logo_x5F_text');
    const fullLogoWidth=fullLogo.getBBox().width;
    const a=logoLeft.getBBox(),b=logoRight.getBBox(),combinedWidth=Math.max(a.x+a.width,b.x+b.width)-Math.min(a.x,b.x);
    const logoTarget=fullLogoWidth/2-combinedWidth/2,rightInitial=logoTarget-window.innerWidth/2,leftInitial=logoTarget+window.innerWidth/2;
    const tl=gsap.timeline({delay:0.8});
    gsap.set(logoLeft,{x:rightInitial,opacity:0,scale:3.0});
    gsap.set(logoRight,{x:leftInitial,opacity:0,scale:3.0});
    gsap.set(logoText,{opacity:0});gsap.set(overlay,{opacity:1});gsap.set(fullLogo,{opacity:1});
    tl.to(logoLeft,{x:logoTarget,scale:1.0,opacity:1,duration:1,ease:'power2.out'});
    tl.to(logoRight,{x:logoTarget,scale:1.0,opacity:1,duration:1,ease:'power2.out'},'<');
    tl.to(logoLeft,{x:0,opacity:1,duration:1,ease:'power2.out'},'+=0.5');
    tl.to(logoRight,{x:0,opacity:1,duration:1,ease:'power2.out'},'<');
    tl.to(logoText,{opacity:1,duration:1,ease:'power2.out'},'<=0.2');
    tl.call(end);reveal()};
  if(!onHome)end();
  else{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';s.onload=run;s.onerror=end;document.head.appendChild(s);setTimeout(()=>{if(!window.gsap)end()},5000)}
};
/* ---------- option 2 opening ----------
   The logo animates on black, then the background dissolves into the client film (clean, no logo of its own) and the bronze logo stays on top.
   Without it: the logo animates over the stand-in video and stays.
   The 3D logo film is used where the browser can play it and its file is present; otherwise the flat logo animates instead. */
/* both films are carried inside this file */
const FILM=window.__FILM,L3D='fate-3d-logo-alpha.webm',L3DP='fate-3d-logo-alpha.png',L3DO=window.__L3DO;
const isSafari=/^((?!chrome|android|crios|fxios|edg).)*safari/i.test(navigator.userAgent);
const can3d=()=>!isSafari&&!RM&&!!document.createElement('video').canPlayType('video/webm; codecs="vp9"');
const probeImg=(src,ok,no)=>{const i=new Image();i.onload=ok;i.onerror=no;i.src=src};
const play3d=(landed,at,src,fail)=>{const box=$('#intro3d'),v=$('#l3d'),pre=window.__fsgOpen;let done=false,started=!!(pre&&pre.started);const fin=()=>{if(done)return;done=true;landed()},bad=()=>{if(done)return;if(!started&&fail){done=true;root.classList.remove('has3d');box.hidden=true;fail()}else fin()};
  v.addEventListener('error',bad,true);v.addEventListener('ended',fin);v.addEventListener('playing',()=>{started=true;root.classList.add('has3d');box.hidden=false});v.addEventListener('timeupdate',()=>{if(v.currentTime>at)fin()});
  if(pre&&fail){if(pre.failed){bad();return}if(v.ended||v.currentTime>at){fin();return}setTimeout(()=>{if(!started)bad()},5000);return}
  if(!fail){root.classList.add('has3d');box.hidden=false}
  /* a slow connection is not a failure: fall back only if no data at all has arrived for 10s */
  const stall=()=>{let last=Date.now();v.addEventListener('progress',()=>{last=Date.now()});const chk=()=>{if(started||done)return;if(Date.now()-last>10000)bad();else setTimeout(chk,1000)};setTimeout(chk,5000)};
  const start=()=>{v.src=src||L3D;const p=v.play();if(p&&p.catch)p.catch(bad);if(fail)stall()};if(fail)whenHome(start);else start()};
const fitFlat=()=>{try{const svg=$('#intro svg'),vb=svg.viewBox.baseVal,bb=svg.getBBox(),hero=$('#home').getBoundingClientRect(),frameW=innerWidth<=700?innerWidth*3.04:Math.max(hero.width,hero.height*16/9),k=frameW*.2766/bb.width;
  svg.style.width=(vb.width*k).toFixed(1)+'px';svg.style.height='auto';svg.style.maxWidth='none';svg.style.transform='translate('+((vb.x+vb.width/2-(bb.x+bb.width/2))*k).toFixed(1)+'px,'+((vb.y+vb.height/2-(bb.y+bb.height/2))*k).toFixed(1)+'px)'}catch(e){}};
const fbSync=()=>{root.classList.remove('fbgo');const i=$('.fbopen');let k=false;const go=()=>{if(k)return;k=true;root.classList.add('fbgo')};if(!i){go();return}i.addEventListener('load',()=>{(i.decode?i.decode():Promise.resolve()).then(go,go)},{once:true});i.addEventListener('error',go,{once:true});setTimeout(go,9000)};
const fb=()=>{if(root.classList.contains('fb'))return;root.classList.remove('filmmode','intro','has3d','xf','xfnow');root.classList.add('fb','ready','lg');try{$('#hv').pause()}catch(e){}$$('.fbfilm,.fbopen').forEach(i=>{const s=i.dataset.src||i.src;i.src='';i.src=s});fbSync()};
/* the films only start downloading once the home hero is on screen: on the other pages the photos get the connection */
const whenHome=f=>{const h=$('#home'),v=$('#v-home');if(!h||!v||!v.hidden){f();return}new IntersectionObserver((es,o)=>{if(es.some(e=>e.isIntersecting)){o.disconnect();f()}}).observe(h)};
const filmMode=()=>{const hv=$('#hv');hv.addEventListener('error',fb);root.classList.add('filmmode','ready');root.classList.remove('intro');
  hv.pause();hv.removeAttribute('poster');whenHome(()=>{hv.src=FILM;hv.load()});
  
  /* the static logo (#crisp) is already in the page: the 3D opening's last frame, cut out */
  let seen=false;try{seen=sessionStorage.getItem('fsg-open')==='1'}catch(e){}
  /* the hero may be off screen (another page, or scrolled away) by the time the film is ready: then hold everything back for the next visit */
  let heroVis=true,onHidden=null;
  const go=()=>{if(!heroVis&&onHidden){onHidden();return}root.classList.add('xf');{try{hv.currentTime=0}catch(e){}const p=hv.play();if(p&&p.catch)p.catch(fb)}setTimeout(()=>{if(heroVis&&root.classList.contains('xf'))root.classList.add('lg')},900);try{sessionStorage.setItem('fsg-open','1')}catch(e){}};
  /* the logo holds on black until the film has a frame to show, so the dissolve never opens onto nothing */
  const show=()=>{if(hv.readyState>=2){go();return}let w=false;const g=()=>{if(w)return;w=true;go()};hv.addEventListener('canplay',g,{once:true});setTimeout(g,6000)};
  /* scrolled away and back to the top: the opening plays again */
  let firstEnd=()=>show();
  {const l3=$('#l3d'),hero=$('#home');let away=false,armed=false,vis=true;
   /* landed on another page: the opening finishes out of sight, so hold it back and play it when home is first shown */
   firstEnd=()=>{if(vis)show();else{away=true;rewind()}};
   onHidden=()=>{away=true;rewind()};
   const rewind=()=>{try{l3.pause();l3.currentTime=0}catch(e){}};
   const again=()=>{if(armed)return;armed=true;
     const end=()=>{if(!armed)return;armed=false;l3.removeEventListener('timeupdate',tu);l3.removeEventListener('ended',end);if(vis)show();else{away=true;rewind()}},tu=()=>{if(l3.currentTime>3.35)end()};
     l3.addEventListener('timeupdate',tu);l3.addEventListener('ended',end);try{l3.currentTime=0}catch(e){}const p=l3.play();if(p&&p.catch)p.catch(end)};
   const refb=()=>{$$('.fbfilm,.fbopen').forEach(i=>{const u=i.dataset.src||i.src;i.src='';i.src=u});[$('.fbopen'),$('.hero .hcopy')].forEach(n=>{if(!n)return;n.style.animation='none';void n.offsetWidth;n.style.animation=''});fbSync()};
   new IntersectionObserver(es=>{const en=es[es.length-1];vis=en.isIntersecting;heroVis=vis;if(RM)return;
     if(root.classList.contains('fb')){if(!vis)away=true;else if(away&&en.intersectionRatio>=.5){away=false;refb()}return}
     if(!vis){if(root.classList.contains('xf')&&!armed){away=true;root.classList.add('rst');root.classList.remove('xf','lg');hv.pause();rewind();void hero.offsetWidth;requestAnimationFrame(()=>requestAnimationFrame(()=>root.classList.remove('rst')))}}
     else if(away&&en.intersectionRatio>=.5){away=false;again()}},{threshold:[0,.5]}).observe(hero)}
  /* the opening plays on every load (it is short); only people who ask for reduced motion skip it */
  if(RM){root.classList.add('xfnow');show();return}
  const flat=()=>{fitFlat();afterLogo=show;flatIntro()};
  /* the 3D logo on black is an ordinary film, so every browser can play it, Safari and iPhone included */
  play3d(()=>firstEnd(),3.35,L3DO,fb)};
const standIn=()=>{const flat=()=>{if(root.classList.contains('intro'))flatIntro();else root.classList.add('lg')};
  if(!can3d()){flat();return}
  probeImg(L3DP,()=>{root.classList.add('ready');root.classList.remove('intro');let seen=false;try{seen=sessionStorage.getItem('fsg-3d')==='1'}catch(e){}
    if(seen){root.classList.add('has3d','lg');const v=$('#l3d');$('#intro3d').hidden=false;v.addEventListener('loadedmetadata',()=>{v.currentTime=Math.max(0,v.duration-.04)});v.src=L3D}
    else play3d(()=>{root.classList.add('lg');try{sessionStorage.setItem('fsg-3d','1')}catch(e){}},3.6)},flat)};
filmMode();

/* ---------- lazy images ---------- */
const imgIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){load(e.target);imgIO.unobserve(e.target)}}),{rootMargin:'900px 0px'});
/* phones get lighter copies of the four 1200x1500 athlete portraits; desktop keeps the originals */
const PHONE=matchMedia('(max-width:700px)').matches?{'/assets/img/85b6d57529.webp':'/assets/img/5a154496cc.webp','/assets/img/8a182063ef.webp':'/assets/img/256dd48135.webp','/assets/img/2eeba25a43.webp':'/assets/img/8de79c68d1.webp','/assets/img/ae09cf1982.webp':'/assets/img/e25c96b22a.webp'}:{};
function load(i){const k=i.dataset.k;if(k&&IMG[k]){i.decoding='async';i.src=PHONE[IMG[k]]||IMG[k];i.removeAttribute('data-k')}}
function watchImgs(r){$$('img[data-k]',r).forEach(i=>imgIO.observe(i))}
/* warm up: quietly load and decode the current page's images one at a time while idle, so nothing has to decode mid-scroll */
let warmRun=0;
function warm(root){const id=++warmRun,list=$$('img[data-k]',root),idle=window.requestIdleCallback||(f=>setTimeout(f,60));let i=0;
  (function next(){if(id!==warmRun)return;while(i<list.length&&!list[i].dataset.k)i++;if(i>=list.length)return;const im=list[i++];imgIO.unobserve(im);load(im);
    (im.decode?im.decode().catch(()=>{}):Promise.resolve()).then(()=>idle(next,{timeout:500}))})()}

/* ---------- build: ticker, roster strip, athletes grid ---------- */
function card(a,logos){
  const c=el('a','card');c.href='/athletes/'+a.slug;c.draggable=false;
  const ph=el('span','ph'),im=el('img');im.dataset.k=a.c.k;im.width=a.c.w;im.height=a.c.h;im.alt='';im.draggable=false;ph.appendChild(im);
  c.append(ph,el('b',null,a.name),el('small',null,a.role));
  if(logos){const l=el('span','logos');l.innerHTML=a.logos.join('');c.appendChild(l)}
  return c;
}
const agrid=$('#agrid'),ticker=$('#ticker'),rlist=$('#rlist'),peek=$('#peek');
ATH.forEach((a,i)=>{agrid.appendChild(card(a,true));
  const li=el('li'),r=el('a');r.href='/athletes/'+a.slug;r.dataset.i=i;
  const th=el('span','th'),ti=el('img');ti.dataset.k=a.c.k;ti.alt='';ti.width=a.c.w;ti.height=a.c.h;th.appendChild(ti);
  const tx=el('span','tx');tx.append(el('b',null,a.name),el('small',null,a.role));r.append(th,tx);li.appendChild(r);rlist.appendChild(li);
  const pi=el('img');pi.alt='';pi.dataset.k=a.c.k;pi.width=a.c.w;pi.height=a.c.h;peek.appendChild(pi);
  const l2=el('li'),r2=el('a');r2.href='/athletes/'+a.slug;const t2=el('span','tx');t2.append(el('b',null,a.name),el('small',null,a.role));r2.appendChild(t2);l2.appendChild(r2);$('#alist').appendChild(l2)});
ATH.forEach(a=>{const c=card(a,true);c.tabIndex=-1;c.setAttribute('aria-hidden','true');agrid.appendChild(c)});
/* the carousel loops through a second copy of the cards: load both copies together as it nears the screen, so no card ever wraps round blank */
new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){$$('img[data-k]',agrid).forEach(load);o.disconnect()}},{rootMargin:'600px 0px'}).observe(agrid);
/* photo frames: a new photo wipes in only once it is decoded, over the ones already shown, so the frame never flashes empty */
let frZ=3;function frameShow(imgs,i,st){st.want=i;const im=imgs[i];
  const go=()=>{if(st.want!==i||st.cur===i)return;im.classList.remove('on');void im.offsetWidth;im.style.zIndex=++frZ;im.classList.add('on','seen');st.cur=i};
  if(im.dataset.k)load(im);
  if(im.complete&&im.naturalWidth)go();else{const f=()=>{im.complete&&im.naturalWidth?go():im.addEventListener('load',go,{once:true})};im.decode?im.decode().then(go,f):f()}}
function framePreload(box,imgs){new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){o.disconnect();imgs.forEach(im=>{if(im.dataset.k)load(im);im.decode&&im.decode().catch(()=>{})})}},{rootMargin:'1200px 0px'}).observe(box)}
/* roster: one fixed portrait frame beside the list; it changes to the athlete you point at */
(function(){const imgs=$$('img',peek),rows=$$('a',rlist),canHover=matchMedia('(hover:hover)');let cur=-1;
  const fs={cur:-1,want:-1};framePreload(peek,imgs);
  function set(i){if(i===cur)return;frameShow(imgs,i,fs);rows.forEach((r,n)=>r.classList.toggle('act',n===i));cur=i;peek.href=rows[i].href}
  set(0);
  rlist.addEventListener('pointerover',e=>{const r=e.target.closest('a');if(r&&canHover.matches)set(+r.dataset.i)});
  rlist.addEventListener('focusin',e=>{const r=e.target.closest('a');if(r)set(+r.dataset.i)});
})();
/* services page: the six services ride the same carousel as the athletes (two copies for the loop), scroll-lit lead line */
const SVPOS={ricky_taylor_3:'77% 50%'};const SV=['jonny_edgar_fe','ricky_taylor_3','charlie_eastwood_1','jamie_chadwick_1','commercial_mclaren_sky','jamie_vogue'];
const SVT=['Career strategy and pathway development','Contract negotiation and protection','Team and manufacturer positioning','Strategic introductions to key figures','Commercial and sponsorship advisory','Profile and brand management'];
const svHero=$('#svHero'),svGrid=$('#svGrid');
for(let n=0;n<2;n++)SV.forEach((k,i)=>{const c=el('div','card'),ph=el('span','ph'),im=el('img');im.dataset.k=k;im.alt='';im.draggable=false;if(SVPOS[k])im.style.objectPosition=SVPOS[k];ph.appendChild(im);
  c.append(ph,el('b',null,SVT[i]),el('small',null,String(i+1).padStart(2,'0')+' / '+String(SV.length).padStart(2,'0')));c.setAttribute('role','listitem');if(n)c.setAttribute('aria-hidden','true');svGrid.appendChild(c)});
new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){$$('img[data-k]',svGrid).forEach(load);o.disconnect()}},{rootMargin:'600px 0px'}).observe(svGrid);
const svScrub=$('#svScrub');let svN=-1;svScrub.innerHTML=svScrub.textContent.trim().split(/\s+/).map((w,i)=>'<span style="--i:'+i+'">'+w+'</span>').join(' ');const svW=$$('span',svScrub);
function svTick(y,vh){
  svHero.style.translate='0 '+(-Math.min(y,vh)*.07).toFixed(1)+'px';
  const sr=svScrub.getBoundingClientRect();if(sr.top<vh&&sr.bottom>-vh*.2){const n=Math.round(clamp((vh*.86-sr.top)/(sr.height+vh*.16),0,1)*svW.length);if(n!==svN){svN=n;svW.forEach((w,i)=>w.classList.toggle('on',i<n))}}
}
/* manifesto: words light up as you scroll */
const scrub=$('#scrub');let scrubN=-1;
scrub.innerHTML=scrub.textContent.trim().split(/\s+/).map((w,i)=>'<span style="--i:'+i+'">'+w+'</span>').join(' ');
const scrubW=$$('span',scrub);
{const set=el('div','set');ATH.forEach(a=>{const t=el('a');t.href='/athletes/'+a.slug;t.append(el('b',null,a.name),el('span',null,a.role));set.appendChild(t)});ticker.appendChild(set)}
/* photo rails */
[['#railA',1],['#railB',2]].forEach(([id,n],ri)=>{const row=$(id);if(!row)return;for(let rp=0;rp<2;rp++)(ri?ATH.slice().reverse():ATH).forEach(a=>{const m=a.imgs[Math.min(n,a.imgs.length-1)],l=el('a');l.href='/athletes/'+a.slug;l.draggable=false;if(rp){l.tabIndex=-1;l.setAttribute('aria-hidden','true')}
  const im=el('img');im.dataset.k=m.k;im.width=m.w;im.height=m.h;im.alt=a.name;im.style.aspectRatio=m.w+'/'+m.h;im.draggable=false;l.append(im,el('b',null,a.name));row.appendChild(l)})});
for(let n=0;n<2;n++)PLOGOS.forEach((s,i)=>{const li=el('div','cell'+([2,4,6].includes(i)?' sm':''));li.innerHTML=s.svg;if(!n){li.firstChild.setAttribute('role','img');li.firstChild.setAttribute('aria-label',s.name);li.firstChild.removeAttribute('aria-hidden')}$('#plogos').appendChild(li);$('#plogosH').appendChild(li.cloneNode(true))});
{const P=[['commercial_jenson_monster','Jenson Button in a Monster Energy helmet',500,662],['commercial_mclaren_sky','McLaren GT car in Sky livery',900,600],['commercial_lh_police','Lewis Hamilton for Police eyewear',500,750]];
 for(let n=0;n<3;n++)P.forEach(p=>{const f=el('figure'),im=el('img');im.dataset.k=p[0];im.alt=n?'':p[1];im.width=p[2];im.height=p[3];im.style.aspectRatio=p[2]+'/'+p[3];im.draggable=false;f.appendChild(im);$('#cph').appendChild(f)})}

/* drag-to-scroll */
function draggable(box){let down=false,sx=0,sl=0,moved=0;
  box.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;down=true;moved=0;sx=e.clientX;sl=box.scrollLeft});
  addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-sx;moved=Math.abs(dx);if(moved>6)box.classList.add('drag');box.scrollLeft=sl-dx});
  addEventListener('pointerup',()=>{if(!down)return;down=false;setTimeout(()=>box.classList.remove('drag'),0)});
  box.addEventListener('click',e=>{if(moved>6){e.preventDefault();e.stopPropagation()}},true);
  box.addEventListener('dragstart',e=>e.preventDefault());
}


/* ---------- testimonials ---------- */
const tmP=$('#tmPhotos'),tmQ=$('#tmQuotes'),tmT=$('#tmTabs');let tmI=0;
TM.forEach((t,i)=>{
  const im=el('img');im.dataset.k=t.k;im.alt=t.name;tmP.appendChild(im);
  const q=el('div','q'),bq=el('blockquote');t.q.forEach(p=>bq.appendChild(el('p',null,p)));q.appendChild(bq);tmQ.appendChild(q);
  const b=el('button');b.type='button';b.setAttribute('role','tab');b.append(el('b',null,t.name),el('small',null,t.role));
  b.style.setProperty('--tmd',Math.round(2+t.q.join(' ').split(/\s+/).length/4)+'s');
  b.onclick=()=>tmGo(i);b.addEventListener('animationend',()=>{if(!RM)tmGo((i+1)%TM.length)});tmT.appendChild(b);
});
function tmGo(i){const prev=tmI;tmI=i;
  $$('img',tmP).forEach((x,n)=>{x.classList.toggle('on',n===i);x.classList.toggle('out',n===prev&&prev!==i)});
  $$('.q',tmQ).forEach((x,n)=>{x.classList.toggle('on',n===i);x.classList.toggle('out',n===prev&&prev!==i)});
  $$('button',tmT).forEach((x,n)=>{x.setAttribute('aria-selected',n===i?'true':'false');if(n===i){x.style.animation='none';void x.offsetWidth;x.style.animation=''}});
}
tmGo(0);
/* swipe between testimonials on touch screens */
{const g=$('#testimonials .grid');let sx=0,sy=0,on=false;
 g.addEventListener('touchstart',e=>{const p=e.touches[0];sx=p.clientX;sy=p.clientY;on=true},{passive:true});
 g.addEventListener('touchend',e=>{if(!on)return;on=false;const p=e.changedTouches[0],dx=p.clientX-sx,dy=p.clientY-sy;if(Math.abs(dx)>44&&Math.abs(dx)>Math.abs(dy)*1.4)tmGo((tmI+(dx<0?1:-1)+TM.length)%TM.length)},{passive:true})}
/* hero animations rest while the hero is off screen */
new IntersectionObserver(es=>{$('#home').classList.toggle('off',!es[0].isIntersecting)}).observe($('#home'));
/* hero video: pause control; rests while off screen */
{const hv=$('#hv'),vb=$('#vctl');let up=false;
 /* loop by hand: Safari can stall on the first frame when a film loops by itself */
 hv.loop=false;hv.addEventListener('ended',()=>{try{hv.currentTime=0}catch(e){}if(!up){const p=hv.play();if(p&&p.catch)p.catch(()=>{})}});const lab=()=>{const p=hv.paused;vb.classList.toggle('paused',p);vb.lastElementChild.textContent=p?'Play':'Pause';vb.setAttribute('aria-label',(p?'Play':'Pause')+' background video')};
 vb.onclick=()=>{if(hv.paused){up=false;hv.play().catch(()=>{})}else{up=true;hv.pause()}};hv.addEventListener('play',lab);hv.addEventListener('pause',lab);
 new IntersectionObserver(es=>{if(es[0].isIntersecting){if(!up)hv.play().catch(()=>{})}else hv.pause()},{threshold:.05}).observe(hv);lab()
 /* safety net: if the film stops advancing while it should be playing (some browsers stall when a loop restarts), nudge it back to the start */
 let lt=-1,stuck=0;setInterval(()=>{if(hv.paused||document.hidden||hv.readyState<2||$('#home').classList.contains('off')){stuck=0;lt=hv.currentTime;return}
   if(Math.abs(hv.currentTime-lt)<.01){if(++stuck>=2){stuck=0;try{hv.currentTime=.02}catch(e){}const p=hv.play();if(p&&p.catch)p.catch(()=>{})}}else stuck=0;lt=hv.currentTime},700)}
$('#tmPrev').onclick=()=>tmGo((tmI-1+TM.length)%TM.length);$('#tmNext').onclick=()=>tmGo((tmI+1)%TM.length);
new IntersectionObserver(es=>{$('#testimonials').classList.toggle('run',es[0].isIntersecting)},{threshold:.25}).observe($('#testimonials'));

/* ---------- reveal on scroll ---------- */
/* every reveal plays each time its element comes into view, from above or below: it is set when the element enters, and reset only once it has left the screen completely (so nothing flickers at the edges) */
/* image wipes follow the scroll: arriving from below (scrolling down) they open from the top; arriving from above (scrolling up) they open from the bottom */
const revIO=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const n=e.target,c=n.classList;
  if(c.contains('clip')&&!c.contains('in')){const r=e.boundingClientRect,up=r.top+r.height/2<innerHeight/2;if(up!==c.contains('up')){c.add('nt');c.toggle('up',up);void n.offsetWidth;c.remove('nt')}}
  c.add('in')}),{rootMargin:'0px 0px -12% 0px',threshold:.12});
const revOut=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)e.target.classList.remove('in')}),{rootMargin:'-8% 0px 0px 0px'});
$$('[data-r]').forEach(n=>{revIO.observe(n);revOut.observe(n)});
watchImgs(document);

/* ---------- scroll: nav, parallax, the motion graphic ---------- */
const nav=$('#nav'),heroBg=$('#heroBg'),heroL=[],xp=$('#experience'),xpA=$('.a',xp),xpB=$('.b',xp),xpH=$('h2',xp),xpN=$('#xpN'),xpM=$('.mark',xp),xpS=$('.stage',xp),pars=$$('[data-par]');
let lastY=0,navY=0,ticking=false,curView='home';
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v)),ease=t=>1-Math.pow(1-t,3);
function frame(){ticking=false;const y=scrollY,vh=innerHeight;
  nav.classList.toggle('solid',y>40);nav.style.setProperty('--prog',(y/Math.max(1,document.documentElement.scrollHeight-vh)).toFixed(4));
  /* the bar hides on the way down and comes back on the way up, but only after 10px of travel the new way, so tiny wobbles
     (smooth scroll settling, a trackpad jiggle, Safari's bounce at the top) never flicker it */
  {const yy=Math.max(0,y),aw=nav.classList.contains('away');
   if(yy<=vh*.6||root.classList.contains('menu-open')){if(aw)nav.classList.remove('away');navY=yy}
   else if(aw?yy<navY:yy>navY){if(Math.abs(yy-navY)>10){nav.classList.toggle('away',!aw);navY=yy}}
   else navY=yy}
  lastY=y;
  if(RM||matchMedia('(max-width:1020px)').matches)return;   /* phones use timed, in-view animations instead of scroll-linked ones */
  if(curView==='services'){svTick(y,vh);return}if(curView!=='home')return;
  if(y<vh*1.1){heroBg.style.transform='translate3d(0,'+(y*.22).toFixed(1)+'px,0) scale('+(1+y/vh*.08).toFixed(4)+')';const d=innerWidth>1020?Math.min(y,vh)*.16:0;heroL.forEach((l,i)=>{l.style.transform='translate3d('+((i%2?1:-1)*d*(i===1?.9:.55)).toFixed(1)+'px,0,0)'})}
  {const le=frame.le||(frame.le=$('#lead')),ll=frame.ll||(frame.ll=$$('#heroH .ln')),lr=le.getBoundingClientRect();if(lr.top<vh&&lr.bottom>0){const p=clamp((vh-lr.top)/(vh+lr.height),0,1)-.5;ll.forEach((l,i)=>{l.style.transform='translate3d('+((i%2?1:-1)*p*innerWidth*.07*(i===1?1:.6)).toFixed(1)+'px,0,0)'})}}
  {const sr=scrub.getBoundingClientRect();if(sr.top<vh&&sr.bottom>-vh*.2){const n=Math.round(clamp((vh*.82-sr.top)/(sr.height+vh*.22),0,1)*scrubW.length);if(n!==scrubN){scrubN=n;scrubW.forEach((w,i)=>w.classList.toggle('on',i<n))}}}
  pars.forEach(p=>{const r=p.getBoundingClientRect();if(r.bottom>0&&r.top<vh){const im=p.firstElementChild,k=(r.top+r.height/2-vh/2)/vh;im.style.translate='0 '+(-4.5+k*-4.5).toFixed(2)+'%'}});
  const r=xp.getBoundingClientRect();
  if(r.top<vh&&r.bottom>0){const p=clamp(-r.top/(r.height-vh),0,1),q=clamp((vh*.35-r.top)/(vh*.35+(r.height-vh)*.42),0,1),e=1-(1-q)*(1-q),mw=xpM.offsetWidth,x=clamp((vh*.95-r.bottom)/(vh*.4),0,1),off=Math.max(1-e,x*x)*(innerWidth/2+mw*.55);   /* x: the halves part again as the section leaves at the top, so they also come together when scrolling back up */
    xp.classList.toggle('apart',off>mw*.02);

    xpA.style.transform='translate3d('+(-off).toFixed(1)+'px,0,0)';xpB.style.transform='translate3d('+off.toFixed(1)+'px,0,0)';
    xpA.style.opacity=xpB.style.opacity=Math.min(clamp(q*4,0,1),clamp((1-x)*3,0,1));
    const lk=xp.classList.contains('lock');if(!lk&&p>.44){xp.classList.add('lock');xpCount()}else if(lk&&p<.34){xp.classList.remove('lock');cancelAnimationFrame(xpRaf)}}
  else if(xp.classList.contains('lock')){xp.classList.remove('lock');cancelAnimationFrame(xpRaf)}   /* fully off screen, above or below: reset so the headline and count play again */
}
/* phones: in-view, timed versions of the scroll-linked effects */
{const once=(node,th,fn)=>{const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){io.disconnect();fn()}},{threshold:th});io.observe(node)};
 [scrub,svScrub].forEach(p=>{new IntersectionObserver(es=>{if(es[0].isIntersecting)p.classList.add('lit')},{threshold:.3}).observe(p);new IntersectionObserver(es=>{if(!es[0].isIntersecting)p.classList.remove('lit')}).observe(p)});
 {const mq=matchMedia('(max-width:1020px)');let tick=false,done=false;
  const upd=()=>{tick=false;if(!mq.matches||RM)return;const r=xpM.getBoundingClientRect(),sr=xp.getBoundingClientRect(),vh=innerHeight,c=r.top+r.height/2;
    /* the halves are together while the mark sits in the middle of the screen and apart towards the bottom and top edges, so the motion plays the same way scrolling down or back up, every time */
    const d=c>vh*.55?(c-vh*.55)/(vh*.45):c<vh*.22?(vh*.22-c)/(vh*.32):0;let p=1-d;p=p<0?0:p>1?1:p;const e=1-Math.pow(1-p,3),dx=(1-e)*72;
    xpA.style.transition=xpB.style.transition='none';
    xpA.style.transform='translate3d('+(-dx).toFixed(2)+'vw,0,0)';xpB.style.transform='translate3d('+dx.toFixed(2)+'vw,0,0)';xpA.style.opacity=xpB.style.opacity=Math.min(1,p*2.5).toFixed(3);
    if(p>=1&&!done){done=true;xp.classList.add('go','lock');xpCount()}
    /* the headline and count stay put once shown, and reset only when the whole section has left the screen */
    else if(done&&(sr.bottom<=0||sr.top>=vh)){done=false;xp.classList.remove('lock');cancelAnimationFrame(xpRaf)}};
  addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});addEventListener('resize',upd);upd()}
}
var xpRaf;function xpCount(){const t0=performance.now()+350;xpN.textContent='0';cancelAnimationFrame(xpRaf);(function step(now){const k=clamp((now-t0)/1000,0,1);xpN.textContent=Math.round(50*ease(k));if(k<1)xpRaf=requestAnimationFrame(step);else xpN.textContent='50'})(t0)}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(frame)}},{passive:true});
function xpCentre(){if(!xpM.offsetWidth)return;xpM.style.setProperty('--cx',(xpS.clientWidth/2-(xpM.offsetLeft+xpM.offsetWidth/2)).toFixed(1)+'px');xpM.style.setProperty('--cy',(xpS.clientHeight/2-(xpM.offsetTop+xpM.offsetHeight/2)).toFixed(1)+'px')}
addEventListener('resize',()=>{xpCentre();frame()});
if(RM){svW.forEach(w=>w.classList.add('on'));xp.classList.add('lock');scrubW.forEach(w=>w.classList.add('on'))}

/* ---------- continuous motion: marquees + rails react to scroll speed ---------- */
const mqs=$$('[data-mq]').map(tr=>{const c=tr.firstElementChild.cloneNode(true);c.setAttribute('aria-hidden','true');$$('a',c).forEach(a=>{a.tabIndex=-1});tr.appendChild(c);
  const m={tr,s:0,w:0,dir:+tr.dataset.mq,sp:+tr.dataset.sp||1,skew:!!tr.dataset.skew,vis:false,hov:false,drag:false,v:0,n:0};
  const bx=tr.parentElement;bx.addEventListener('pointermove',e=>{m.inside=e.pointerType==='mouse';m.px=e.clientX;m.py=e.clientY});bx.addEventListener('pointerleave',()=>{m.inside=false;m.hov=false});
  new IntersectionObserver(es=>{m.vis=es[0].isIntersecting},{rootMargin:'120px'}).observe(tr.parentElement);return m});
const rails=[];
addEventListener('resize',()=>{mqs.forEach(m=>{m.w=0});rails.forEach(r=>{r.max=-1})});
let vel=0,py=scrollY;
let fc=0;const HS='img,.cell,.ticker a';
const MOB=matchMedia('(max-width:1020px)');
function tick(){fc++;const y=scrollY,v=y-py;py=y;vel+=(v-vel)*.16;if(Math.abs(vel)<.02)vel=0;const mob=MOB.matches,sk=mob?0:clamp(vel*.16,-10,10),vv=mob?0:vel*.5;
  for(const m of mqs){if(!m.vis)continue;if(!m.w||!(fc%40)){const nw=m.tr.firstElementChild.offsetWidth;if(nw)m.w=nw;if(!m.w)continue}
    if(m.inside&&!m.skew&&!(fc%4)){const h=document.elementFromPoint(m.px,m.py);m.hov=!!(h&&h.closest(HS))}
    m.s+=m.dir*((m.hov||m.drag?0:m.sp)+vv);if(!m.drag){if(m.v){m.s+=m.v;m.v*=.93;if(Math.abs(m.v)<.15)m.v=0}if(m.n){const d=m.n*.16;m.s+=d;m.n-=d;if(Math.abs(m.n)<.5)m.n=0}}const pos=-(((m.s%m.w)+m.w)%m.w);
    m.tr.style.transform='translate3d('+pos.toFixed(1)+'px,0,0)'+(m.skew?' skewX('+(-sk*m.dir).toFixed(2)+'deg)':'')}
  if(gal.on&&gal.inside&&!(fc%4)){const h=document.elementFromPoint(gal.px,gal.py);gal.hold=!!(h&&h.closest('#shGal img'))}
  if(gal.on&&gal.tr){if(!gal.w||!(fc%40)){const gw=gal.tr.firstElementChild.offsetWidth;if(gw)gal.w=gw}if(gal.w){if(!gal.hold&&!gal.drag)gal.s+=1.1;if(!gal.drag&&gal.v){gal.s+=gal.v;gal.v*=.93;if(Math.abs(gal.v)<.15)gal.v=0}gal.tr.style.transform='translate3d('+(-(((gal.s%gal.w)+gal.w)%gal.w)).toFixed(1)+'px,0,0)'}}
  requestAnimationFrame(tick)}
const gal={el:$('#shGal'),on:false,hold:false,x:0,dir:1,t:0,tr:null,w:0,s:0,drag:false,v:0};addEventListener('resize',()=>{gal.w=0});
gal.el.addEventListener('pointermove',e=>{gal.inside=e.pointerType==='mouse';gal.px=e.clientX;gal.py=e.clientY});gal.el.addEventListener('pointerleave',()=>{gal.inside=false;gal.hold=false});
/* carousels can also be moved by hand: drag, swipe, sideways scroll, or the arrows */
function handMove(box,get,set,st){let down=false,sx=0,s0=0,lx=0,moved=0;box.style.touchAction='pan-y';box.classList.add('grab');
  box.addEventListener('pointerdown',e=>{if(e.button||e.pointerType==='touch')return;down=true;moved=0;sx=lx=e.clientX;s0=get();st.drag=true;st.v=0;st.n=0});
  addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-sx;moved=Math.max(moved,Math.abs(dx));st.v=Math.max(-30,Math.min(30,(lx-e.clientX)*.75));lx=e.clientX;set(s0-dx);if(moved>6)box.classList.add('dragging')});
  const up=()=>{if(!down)return;down=false;st.drag=false;setTimeout(()=>box.classList.remove('dragging'),0)};
  addEventListener('pointerup',up);addEventListener('pointercancel',up);
  box.addEventListener('click',e=>{if(moved>6){e.preventDefault();e.stopPropagation();moved=0}},true);
  box.addEventListener('dragstart',e=>e.preventDefault());
  box.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)>Math.abs(e.deltaY)){e.preventDefault();st.v=0;set(get()+e.deltaX)}},{passive:false})
  let tx=0,ty=0,tl=0,lock=0;
  box.addEventListener('touchstart',e=>{const t=e.touches[0];tx=lx=t.clientX;ty=t.clientY;lock=0;moved=0;s0=get();st.v=0;st.n=0},{passive:true});
  box.addEventListener('touchmove',e=>{const t=e.touches[0],dx=t.clientX-tx,dy=t.clientY-ty;
    if(!lock){if(Math.abs(dx)<6&&Math.abs(dy)<6)return;lock=Math.abs(dx)>Math.abs(dy)?1:2;if(lock===1){st.drag=true;box.classList.add('dragging')}}
    if(lock!==1)return;e.preventDefault();moved=Math.max(moved,Math.abs(dx));st.v=Math.max(-30,Math.min(30,(lx-t.clientX)*.75));lx=t.clientX;set(s0-dx)},{passive:false});
  const tend=()=>{if(lock===1){st.drag=false;setTimeout(()=>box.classList.remove('dragging'),0)}lock=0};
  box.addEventListener('touchend',tend);box.addEventListener('touchcancel',tend)}
const acm=mqs.find(m=>m.tr.closest('.acar'));
handMove(acm.tr.parentElement,()=>acm.s,v=>{acm.s=v},acm);
handMove(gal.el,()=>gal.s,v=>{gal.s=v},gal);
const svm=mqs.find(m=>m.tr.closest('#svc'));handMove(svm.tr.parentElement,()=>svm.s,v=>{svm.s=v},svm);
{const step=()=>{const c=svm.tr.querySelector('.card');return c?c.getBoundingClientRect().width+parseFloat(getComputedStyle(c).marginRight):320};
 $('#svNext').onclick=()=>{svm.v=0;svm.n+=step()};$('#svPrev').onclick=()=>{svm.v=0;svm.n-=step()}}
{const step=()=>{const c=acm.tr.querySelector('.card');return c?c.getBoundingClientRect().width+parseFloat(getComputedStyle(c).marginRight):320};
 $('#acNext').onclick=()=>{acm.v=0;acm.n+=step()};$('#acPrev').onclick=()=>{acm.v=0;acm.n-=step()}}
if(!RM)requestAnimationFrame(tick);else{acm.tr.parentElement.classList.remove('grab');svm.tr.parentElement.classList.remove('grab')}

/* ---------- menu ---------- */
const burger=$('#burger');
function menu(open){if(open)nav.classList.remove('away');root.classList.toggle('menu-open',open);burger.setAttribute('aria-expanded',open);burger.setAttribute('aria-label',open?'Close menu':'Open menu');document.body.style.overflow=open?'hidden':''}
burger.onclick=()=>menu(!root.classList.contains('menu-open'));

/* ---------- athlete sheet ---------- */
const sheet=$('#sheet');let shI=-1,lastFocus=null;
function openSheet(i){const a=ATH[i];shI=i;
  $('#shName').textContent=a.name;$('#shRole').textContent=a.role;$('#shBio').textContent=a.bio||'';$('#shBio').hidden=!a.bio;{const w=$('#shWeb');w.textContent='';w.hidden=!a.site;if(a.site){const l=el('a');l.href=a.site;l.target='_blank';l.rel='noopener';l.textContent=new URL(a.site).hostname.replace(/^www\./,'');w.append(el('span',0,'Official site'),l)}}$('#shLogos').innerHTML=a.logos.join('');
  const g=$('#shGal');g.textContent='';g.scrollLeft=0;gal.hold=false;gal.on=false;setTimeout(()=>{gal.on=true},350);
  {const tr=el('div','track'),set=el('div','set'),H=Math.min(560,Math.max(240,innerHeight*.40));let ws=0,r=0;
   do{a.imgs.forEach((m,n)=>{const im=el('img');im.width=m.w;im.height=m.h;im.style.aspectRatio=m.w+'/'+m.h;im.alt=r?'':(n?a.name+', photo '+(n+1):a.name);im.draggable=false;im.src=IMG[m.k];set.appendChild(im);ws+=m.w/m.h*H+18});r++}while(ws<innerWidth+240&&r<10);
   const c=set.cloneNode(true);c.setAttribute('aria-hidden','true');tr.append(set,c);g.appendChild(tr);
   /* a photo only shows once it is fully decoded, then fades in: no half-drawn photo while the profile slides up */
   tr.querySelectorAll('img').forEach(im=>{const d=()=>im.classList.add('ld');if(im.complete&&im.naturalWidth)d();else(im.decode?im.decode():new Promise(r=>{im.onload=im.onerror=r})).then(d,d)});gal.tr=tr;gal.w=0;gal.s=0}
  const p=ATH[(i-1+ATH.length)%ATH.length],nx=ATH[(i+1)%ATH.length];
  $('#shPrev b').textContent=p.name;$('#shNext b').textContent=nx.name;
  $('#shPrev').onclick=()=>{go('/athletes/'+p.slug)};$('#shNext').onclick=()=>{go('/athletes/'+nx.slug)};
  if(!sheet.classList.contains('open')){lastFocus=document.activeElement;sheet.classList.add('open');document.body.style.overflow='hidden';setTimeout(()=>$('#shX').focus(),80)}
  else{sheet.scrollTop=0;sheet.classList.remove('open');void sheet.offsetWidth;sheet.classList.add('open')}
}
function closeSheet(){gal.on=false;if(!sheet.classList.contains('open'))return;sheet.classList.remove('open');document.body.style.overflow='';shI=-1;if(lastFocus&&lastFocus.focus)lastFocus.focus()}
$('#shX').onclick=()=>{go('/athletes')};
addEventListener('keydown',e=>{if(e.key==='Escape'){if(sheet.classList.contains('open'))go('/athletes');else if(root.classList.contains('menu-open'))menu(false)}
  if(sheet.classList.contains('open')&&e.key==='Tab'){const f=$$('button',sheet);if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&document.activeElement===f[f.length-1]){e.preventDefault();f[0].focus()}}});

/* ---------- router ---------- */
const VIEWS=['home','athletes','commercial','services','contact'],LIGHT={athletes:1},curtain=$('#curtain');
const P2V={'':'home',athletes:'athletes','brand-partnerships':'commercial',services:'services',contact:'contact'},V2P={home:'/',athletes:'/athletes',commercial:'/brand-partnerships',services:'/services',contact:'/contact'};
function toPath(h){h=String(h||'');if(h.charAt(0)==='/')return h;const p=h.replace(/^#\/?/,'').split('/').filter(Boolean),a=p[0]||'';
  if(V2P[a]&&a!=='home')return V2P[a]+(p[1]?'/'+p[1]:'');return(a&&a!=='home')?'/#'+a:'/'}
function go(u){u=toPath(u);if(u===location.pathname+location.hash)return route();try{history.pushState(null,'',u)}catch(e){location.href=u;return}route()}
window.__go=go;
function parse(){const p=location.pathname.replace(/\.html$/,'').split('/').filter(Boolean),v=P2V[p[0]||''],h=decodeURIComponent(location.hash.replace(/^#\/?/,''));
  if(v&&v!=='home')return{view:v,sub:p[1]||null,anchor:null};
  return{view:'home',sub:null,anchor:(h&&h!=='home'&&document.getElementById(h))?h:null}}
function show(v){VIEWS.forEach(n=>{const d=$('#v-'+n);d.hidden=n!==v;d.classList.remove('enter')});curView=v;syncTop();
  nav.classList.toggle('light',!!LIGHT[v]);
  $$('.nav ul a').forEach(a=>{if(a.dataset.nav===v)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  const d=$('#v-'+v);watchImgs(d);setTimeout(()=>warm(d),root.classList.contains('intro')?5200:900);if(v==='home')requestAnimationFrame(xpCentre);requestAnimationFrame(()=>requestAnimationFrame(()=>d.classList.add('enter')));
  document.title=(window.__TITLES&&__TITLES[v])||((v==='home'?'':(v==='commercial'?'Brand partnerships':v.charAt(0).toUpperCase()+v.slice(1))+' | ')+'Fate Sports Group')}
function toAnchor(id,smooth){const t=id?document.getElementById(id):null,y=t?t.getBoundingClientRect().top+scrollY-(id==='experience'?0:0):0;if(lenis){lenis.scrollTo(y,smooth?{duration:1.2,force:true}:{immediate:true,force:true});return}scrollTo({top:y,behavior:smooth&&!RM?'smooth':'auto'})}
function after(r){if(r.view==='athletes'&&r.sub){const i=ATH.findIndex(a=>a.slug===r.sub);if(i>-1){openSheet(i);{const n=ATH[i].name,ro=ATH[i].role.replace(' - ',', ');let t=n+' | '+ro+' | Fate Sports Group';if(t.length>65)t=n+' | '+ro;if(t.length>65)t=n+' | Racing Driver | Fate Sports Group';document.title=t}}else closeSheet()}else{closeSheet();if(r.view==='athletes'&&window.__TITLES)document.title=__TITLES.athletes}frame()}
let busy=false,first=true;
function route(){const r=parse();menu(false);
  if(first){first=false;show(r.view);if(r.anchor)toAnchor(r.anchor,false);after(r);return}
  if(r.view===curView){if(!(r.view==='athletes'))toAnchor(r.anchor,true);after(r);return}
  if(RM){show(r.view);toAnchor(r.anchor,false);after(r);return}
  if(busy)return;busy=true;closeSheet();
  curtain.className='cover';
  setTimeout(()=>{const rr=parse();show(rr.view);toAnchor(rr.anchor,false);nav.classList.remove('away');lastY=navY=scrollY;curtain.className='leave';after(rr);
    setTimeout(()=>{curtain.className='';busy=false;const z=parse();if(z.view!==curView)route()},500)},410);
}
addEventListener('popstate',route);addEventListener('hashchange',()=>{if(location.hash.indexOf('#/')===0){history.replaceState(null,'',toPath(location.hash))}route()});
/* links to pages of this site open in place (no reload) */
document.addEventListener('click',e=>{if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const a=e.target.closest('a[href]');if(!a||a.target)return;
  const h=a.getAttribute('href');if(h.charAt(0)!=='/'||h.charAt(1)==='/')return;const v=P2V[(h.split(/[?#]/)[0].split('/').filter(Boolean)[0])||''];if(!v)return;e.preventDefault();go(h)});
route();

$('#toTop').onclick=()=>{if(curView!=='home'){go('/');return}if(lenis)lenis.scrollTo(0,{duration:1.2,force:true});else scrollTo({top:0,behavior:RM?'auto':'smooth'});$('#nav .logo').focus({preventScroll:true})};function syncTop(){const t=document.getElementById('toTop');if(!t)return;const h=curView==='home';t.querySelector('span').textContent=h?'Back to top':'Back to home';t.querySelector('path').setAttribute('d',h?'M9 15V3M3.5 8.5 9 3l5.5 5.5':'M15 9H3M8.5 3.5 3 9l5.5 5.5');t.classList.toggle('tohome',!h)}

/* ---------- copy email ---------- */
const cp=$('#copy');
cp.onclick=async()=>{const m='enquiries'+'@'+'fatesportsgroup.com';let ok=false;
  try{await navigator.clipboard.writeText(m);ok=true}catch(e){try{const r=document.createRange();r.selectNodeContents($('#mail'));const s=getSelection();s.removeAllRanges();s.addRange(r);ok=document.execCommand('copy')}catch(_){}}
  cp.textContent=ok?'Email address copied':'Select the address above to copy';setTimeout(()=>{cp.textContent='Copy email address'},2600)};
})();

/* phone athlete strip: runs on its own and can be swiped; moves the strip's left margin, never a transform */
(function(){const car=document.querySelector('#ns-athletes .nscar'),list=car&&car.querySelector('.nslist');if(!car||!list)return;
  const RMq=matchMedia('(prefers-reduced-motion:reduce)');if(RMq.matches)return;
  car.classList.add('hand');let pos=0,vis=false,touch=false,lock=0,sx=0,sy=0,p0=0,lx=0,v=0,moved=0,rest=0,last=0;
  const loop=()=>{const li=list.children[0];return li?(li.getBoundingClientRect().width+parseFloat(getComputedStyle(li).marginRight))*9:0};
  new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis){last=0;requestAnimationFrame(step)}},{rootMargin:'100px'}).observe(car);
  function step(t){if(!vis)return;const dt=last?Math.min(64,t-last):16;last=t;const L=loop();
    if(L){if(!touch){if(v){pos+=v;v*=.94;if(Math.abs(v)<.2){v=0;rest=t}}else pos+=L/64000*dt*Math.min(1,Math.max(0,(t-rest)/350))}
      pos=((pos%L)+L)%L;list.style.marginLeft=(-pos).toFixed(1)+'px'}
    requestAnimationFrame(step)}
  car.addEventListener('touchstart',e=>{const q=e.touches[0];sx=lx=q.clientX;sy=q.clientY;p0=pos;lock=0;moved=0;v=0;touch=true},{passive:true});
  car.addEventListener('touchmove',e=>{const q=e.touches[0],dx=q.clientX-sx,dy=q.clientY-sy;
    if(!lock){if(Math.abs(dx)<6&&Math.abs(dy)<6)return;lock=Math.abs(dx)>Math.abs(dy)?1:2;if(lock===2)touch=false}
    if(lock!==1)return;e.preventDefault();moved=Math.max(moved,Math.abs(dx));v=Math.max(-40,Math.min(40,(lx-q.clientX)));lx=q.clientX;pos=p0-dx},{passive:false});
  const end=()=>{touch=false;rest=performance.now()};car.addEventListener('touchend',end);car.addEventListener('touchcancel',end);
  car.addEventListener('click',e=>{if(moved>8){e.preventDefault();e.stopPropagation();moved=0}},true);
})();
/* Version 2: jump links inside a page, and the commercial enquiry form */
document.addEventListener('click',e=>{const dv=e.target.closest('#ns-athletes li[data-slug]');if(dv){(window.__go||function(u){location.href=u})('/athletes/'+dv.dataset.slug);return}const g=e.target.closest('[data-go]');if(g){e.preventDefault();(window.__go||function(u){location.hash=u})(g.dataset.go);return}const b=e.target.closest('[data-jump]');if(!b)return;e.preventDefault();const t=document.getElementById(b.dataset.jump);if(t&&window.__lenis)window.__lenis.scrollTo(t,{duration:1.2,force:true,offset:-(parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0)});else if(t)t.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'})});
const send=(f,subj,body)=>{const h=f.querySelector('.hint'),b=f.querySelector('button[type=submit]'),d=new FormData(f);const i=d.getAll('Interest');if(i.length>1)d.set('Interest',i.join(', '));d.set('_subject',subj);if(d.get('Email'))d.set('_replyto',d.get('Email'));b.disabled=true;h.textContent='Sending...';fetch(f.action,{method:'POST',body:d,headers:{Accept:'application/json'}}).then(r=>{if(!r.ok)throw 0;f.reset();h.textContent='Thank you. Your enquiry has been sent and we will be in touch.'}).catch(()=>{h.textContent='Could not send, opening your email instead.';location.href='mailto:'+'enquiries'+'@'+'fatesportsgroup.com'+'?subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(body)}).finally(()=>{b.disabled=false})};
(function(){const f=document.getElementById('cf');if(!f)return;f.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(f),want=d.getAll('Interest').join(', ')||'Not specified';
  const body=['Name: '+(d.get('Name')||''),'Company: '+(d.get('Company')||''),'Email: '+(d.get('Email')||''),'Looking for: '+want,'',(d.get('Message')||'')].join('\n');
  send(f,'Brand partnership enquiry'+(d.get('Company')?' from '+d.get('Company'):''),body)})})();
 (function(){const f=document.getElementById('mf');if(!f)return;f.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(f),want=d.getAll('Interest').join(', ')||'Not specified';   const body=['Name: '+(d.get('Name')||''),'Series / category: '+(d.get('Series')||''),'Email: '+(d.get('Email')||''),'Looking for: '+want,'',(d.get('Message')||'')].join('\n');   send(f,'Management enquiry'+(d.get('Name')?' from '+d.get('Name'):''),body)})})();
/* images: no right click menu, drag or long-press save (a deterrent only) */
(function(){const onImg=e=>document.elementsFromPoint(e.clientX,e.clientY).some(el=>el.matches('img,video,picture'));addEventListener('contextmenu',e=>{const t=e.target;if(t.closest('img,video,picture')||(!t.closest('a,button,input,textarea,select,label,p,h1,h2,h3,h4,li,b,small,strong,em')&&onImg(e)))e.preventDefault()});addEventListener('dragstart',e=>{if(e.target.closest&&e.target.closest('img,video,picture'))e.preventDefault()})})();
