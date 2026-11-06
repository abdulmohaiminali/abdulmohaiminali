import { loadFoldersWhenNear } from './load-folders.js?v=kopp-collage';
// Keep the document useful before WebGL loads. Dependencies are bundled locally.
const stage = document.querySelector('#lanyard-stage');
const fallback = document.querySelector('#lanyard-fallback');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
let lanyard;
let starting = false;
let generation = 0;
let heroNear = false;

// Use the supplied, full-bleed card artwork on both faces.
function cardArtwork() {
  return {frontImage:'assets/card-front.png',backImage:'assets/card-back.png'};
}

async function startLanyard() {
  if (starting || lanyard || motion.matches || !heroNear || document.hidden) return;
  starting=true;
  const current=++generation;
  try {
    const [{mountLanyard}, artwork] = await Promise.all([import('./lanyard.bundle.js?v=performance-1'), cardArtwork()]);
    if (current!==generation || motion.matches || !heroNear || document.hidden) return;
    lanyard=mountLanyard(stage,{
      ...artwork,
      imageFit:'cover',cardColor:'#ffffff',orientation:'portrait',finish:'glossy',
      cornerRadius:0.3,size:0.6,anchor:'center',strapLength:0.5,
      strapColor:'#00bf63',strapWidth:0.65,metal:'silver',gravity:1,
      damping:0.5,elasticity:0.5,breeze:0.5,interactive:true,intro:true
    });
    if (!lanyard) throw new Error('WebGL unavailable');
    fallback.hidden=true;
    fallback.style.display='none';

  } catch (error) {
    // A clear static badge remains if WebGL or the dependency cannot initialize.

    console.info('Using the static identity card:',error.message);
  } finally {
    starting=false;
    // A motion preference toggled during import must not strand the static fallback.
    if (current !== generation && !motion.matches) startLanyard();
  }
}

function updateMotion() {
  if (motion.matches) {
    generation++;
    lanyard?.destroy();lanyard=null;
    fallback.hidden=false;fallback.style.display='';

  } else startLanyard();
}
motion.addEventListener('change',updateMotion);

// Avoid initializing WebGL for visitors opening directly at Work or Contact.
const heroObserver = new IntersectionObserver(([entry]) => {
  heroNear = entry.isIntersecting;
  if (heroNear) requestAnimationFrame(() => requestAnimationFrame(startLanyard));
}, { rootMargin: '100px 0px' });
if (stage) heroObserver.observe(stage);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) startLanyard();
});

// Hover/focus-only FlowingMenu animation; each discipline links to the work section.
document.querySelectorAll('.flowing-menu__item').forEach(item=>{
  item.addEventListener('pointerenter',event=>{
    if(event.pointerType==='touch') return;
    const rect=item.getBoundingClientRect();
    item.style.setProperty('--flow-from',event.clientY<rect.top+rect.height/2?'-101%':'101%');
    item.classList.add('is-active');
  });
  item.addEventListener('pointerleave',()=>item.classList.remove('is-active'));
  item.addEventListener('focusin',()=>{
    item.style.setProperty('--flow-from','101%');
    item.classList.add('is-active');
  });
  item.addEventListener('focusout',event=>{
    if(!item.contains(event.relatedTarget)) item.classList.remove('is-active');
  });
});

// Keep quick notes within the requested 100-word limit and report the current email setup state.
const quickNoteField=document.querySelector('#quick-note-text');
const wordCount=document.querySelector('#note-word-count');
const countWords=value=>value.trim()?value.trim().split(/\s+/).length:0;
if(quickNoteField&&wordCount){
  quickNoteField.addEventListener('input',()=>{
    const words=quickNoteField.value.trim().split(/\s+/).filter(Boolean);
    if(words.length>100) quickNoteField.value=words.slice(0,100).join(' ');
    wordCount.textContent=`${countWords(quickNoteField.value)} / 100 words`;
  });
}
document.querySelectorAll('[data-email-form]').forEach(form=>{
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const status=form.querySelector('[data-form-status]');
    if(status) status.textContent='Your message is ready, but email delivery is not connected yet. I’ll enable sending once the inbox and hosting details are set.';
  });
});
document.querySelector('#quick-note-popover')?.addEventListener('toggle',event=>{
  if(event.newState==='open') quickNoteField?.focus();
});

loadFoldersWhenNear(document.querySelector('#folder-react-root'));
