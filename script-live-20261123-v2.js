const menuBtn=document.querySelector('.menu-toggle');const nav=document.querySelector('.nav-links');menuBtn.addEventListener('click',()=>nav.classList.toggle('open'));nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}}),{threshold:.13});document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
document.querySelectorAll('[data-tilt]').forEach(card=>{card.addEventListener('pointermove',e=>{if(innerWidth<700)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform='perspective(1000px) rotateY('+(x*7)+'deg) rotateX('+(-y*7)+'deg) translateY(-3px)'});card.addEventListener('pointerleave',()=>card.style.transform='')});
document.querySelectorAll('.expand-button').forEach(btn=>btn.addEventListener('click',()=>{const card=btn.closest('.offer-card');card.classList.toggle('expanded');btn.setAttribute('aria-expanded',String(card.classList.contains('expanded')))}));
document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(t=>{t.classList.remove('active');t.setAttribute('aria-selected','false')});document.querySelectorAll('.timeline').forEach(t=>t.classList.add('hidden'));btn.classList.add('active');btn.setAttribute('aria-selected','true');document.getElementById(btn.dataset.tab).classList.remove('hidden');document.getElementById(btn.dataset.tab).querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'))}));
(function cursorTrail(){const canvas=document.getElementById('cursorTrail'),core=document.querySelector('.cursor-core');if(!canvas||!core||!window.matchMedia('(pointer:fine)').matches)return;const ctx=canvas.getContext('2d');let w=0,h=0,dpr=1,mx=-200,my=-200,particles=[];function resize(){dpr=Math.min(devicePixelRatio||1,2);w=innerWidth;h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}window.addEventListener('resize',resize,{passive:true});window.addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;core.style.left=mx+'px';core.style.top=my+'px';for(let i=0;i<2;i++)particles.push({x:mx+(Math.random()-.5)*5,y:my+(Math.random()-.5)*5,vx:(Math.random()-.5)*1.6,vy:(Math.random()-.5)*1.6,life:1,r:Math.random()*2.6+1})},{passive:true});function draw(){ctx.clearRect(0,0,w,h);for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.x+=p.vx;p.y+=p.vy;p.life-=.023;p.r*=.992;if(p.life<=0){particles.splice(i,1);continue}ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(183,139,255,'+(p.life*.7)+')';ctx.shadowBlur=13;ctx.shadowColor='#9d64ff';ctx.fill()}ctx.shadowBlur=0;requestAnimationFrame(draw)}resize();draw()})();
(function heroThree(){const canvas=document.getElementById('hero3d');if(!canvas||!window.THREE)return;try{const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(54,innerWidth/innerHeight,.1,100);camera.position.set(0,0,12);const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));renderer.setSize(innerWidth,innerHeight);const group=new THREE.Group();scene.add(group);const violet=new THREE.MeshStandardMaterial({color:0x8750e8,metalness:.65,roughness:.27,wireframe:true,transparent:true,opacity:.58});const pale=new THREE.MeshBasicMaterial({color:0xb88aff,wireframe:true,transparent:true,opacity:.21});const knot=new THREE.Mesh(new THREE.TorusKnotGeometry(1.75,.015,180,12,2,5),violet);knot.position.set(-4.7,.1,-1.7);group.add(knot);const ico=new THREE.Mesh(new THREE.IcosahedronGeometry(1.2,2),pale);ico.position.set(4.8,-.5,-2);group.add(ico);const ring=new THREE.Mesh(new THREE.TorusGeometry(2.25,.008,8,150),new THREE.MeshBasicMaterial({color:0xa57af6,transparent:true,opacity:.4}));ring.position.copy(ico.position);ring.rotation.set(1.1,.4,.6);group.add(ring);const count=260,pos=new Float32Array(count*3);for(let i=0;i<count;i++){pos[i*3]=(Math.random()-.5)*23;pos[i*3+1]=(Math.random()-.5)*13;pos[i*3+2]=(Math.random()-.5)*14-2}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));const stars=new THREE.Points(geo,new THREE.PointsMaterial({color:0xb995ff,size:.025,transparent:true,opacity:.65}));scene.add(stars);let mx=0,my=0;window.addEventListener('pointermove',e=>{mx=(e.clientX/innerWidth-.5)*.4;my=(e.clientY/innerHeight-.5)*.3},{passive:true});function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)}window.addEventListener('resize',resize);function animate(t){requestAnimationFrame(animate);group.rotation.y=t*.00012+mx;group.rotation.x=Math.sin(t*.0002)*.06+my;knot.rotation.z=t*.00013;ico.rotation.y=-t*.00018;ring.rotation.z=t*.00016;stars.rotation.y=-t*.000018;renderer.render(scene,camera)}animate(0)}catch(e){console.warn('3D scene not available',e)}})();

/* Thumbnail play buttons start the native video player in place. */
document.querySelectorAll('.video-frame').forEach(frame=>{
  const video=frame.querySelector('video');
  const cover=frame.querySelector('.video-cover');
  const play=cover?.querySelector('.cover-play');
  if(!video||!cover||!play)return;
  play.addEventListener('click',async()=>{
    try{await video.play();}
    catch(err){console.warn('Video playback could not start. Use the player controls.',err);}
  });
  video.addEventListener('play',()=>cover.classList.add('is-hidden'));
  video.addEventListener('ended',()=>cover.classList.remove('is-hidden'));
});


/* Swipeable project carousel with accessible pagination dots. */
(function projectCarousel(){
  const track=document.querySelector('.project-grid');
  if(!track)return;
  const cards=Array.from(track.querySelectorAll(':scope > .project-card'));
  if(cards.length<2)return;
  track.setAttribute('role','region');
  track.setAttribute('aria-label','Selected video projects carousel');
  track.setAttribute('tabindex','0');
  const dotsWrap=document.createElement('div');
  dotsWrap.className='project-slider-dots';
  dotsWrap.setAttribute('aria-label','Project carousel pagination');
  track.insertAdjacentElement('afterend',dotsWrap);
  let dots=[];
  function stepSize(){const first=cards[0];const gap=parseFloat(getComputedStyle(track).gap)||0;return first.getBoundingClientRect().width+gap;}
  function pageCount(){const max=Math.max(0,track.scrollWidth-track.clientWidth);return Math.max(1,Math.ceil(max/stepSize())+1);}
  function buildDots(){
    const count=pageCount();
    dotsWrap.replaceChildren();
    dots=Array.from({length:count},(_,i)=>{
      const b=document.createElement('button');
      b.type='button';
      b.setAttribute('aria-label','Show project slide '+(i+1));
      b.addEventListener('click',()=>track.scrollTo({left:Math.min(i*stepSize(),track.scrollWidth-track.clientWidth),behavior:'smooth'}));
      dotsWrap.appendChild(b);
      return b;
    });
    updateDots();
  }
  function updateDots(){
    if(!dots.length)return;
    const idx=Math.min(dots.length-1,Math.round(track.scrollLeft/stepSize()));
    dots.forEach((d,i)=>d.setAttribute('aria-current',String(i===idx)));
  }
  let scrollTimer;
  track.addEventListener('scroll',()=>{if(scrollTimer)clearTimeout(scrollTimer);scrollTimer=setTimeout(updateDots,45)},{passive:true});
  track.addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'){e.preventDefault();track.scrollBy({left:stepSize(),behavior:'smooth'});}
    if(e.key==='ArrowLeft'){e.preventDefault();track.scrollBy({left:-stepSize(),behavior:'smooth'});}
  });
  if('ResizeObserver' in window)new ResizeObserver(buildDots).observe(track);
  else window.addEventListener('resize',buildDots);
  buildDots();
})();
