(() => {
  'use strict';
  const storageKey = 'quest-weekend-report-20261114-v1';
  const original = JSON.parse(JSON.stringify(window.REPORT));
  let data = JSON.parse(JSON.stringify(original));
  let draft = false, editing = false, selected = 0, activeSection = 0;
  try { const saved = localStorage.getItem(storageKey); if (saved) { const parsed=JSON.parse(saved); if(Array.isArray(parsed.videos)&&parsed.recap&&parsed.next){data=parsed;draft=true;} } } catch (_) {}
  const $ = s => document.querySelector(s);
  const escape = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const field = (path, value, tag='span', cls='') => `<${tag} class="${cls}" data-field="${path}">${escape(value)}</${tag}>`;
  const label = (n, name) => `<div class="section-label"><span class="number">${n}</span>${name}</div>`;
  function render() {
    $('#report').innerHTML = `
      <section id="recap">${label('01','RECAP / 上上周回顾')}<div class="hero-top"><div>${field('subtitle',data.subtitle,'p','eyebrow')}${field('title',data.title,'h1')}</div><div class="hero-emblem" aria-hidden="true"><span>3D</span></div></div>${field('intro',data.intro,'p','lead')}<div class="two-grid">${data.recap.map((c,i)=>`<article class="card"><span class="card-index">0${i+1} / ${i?'DATA':'MODEL'}</span>${field(`recap.${i}.title`,c.title,'h3')}${field(`recap.${i}.text`,c.text,'p')}</article>`).join('')}</div><div class="carry">${field('carryTitle',data.carryTitle,'h3')}<ul>${data.carry.map((v,i)=>field(`carry.${i}`,v,'li')).join('')}</ul></div></section>
      <section id="training">${label('02','THIS WEEK / 模型训练')}${field('trainingTitle',data.trainingTitle,'h2')}${field('trainingIntro',data.trainingIntro,'p','lead')}<div class="training-layout"><div class="chart-card"><div class="chart-heading"><strong>数据扩充前后</strong><span>MPJPE ↓ / mm</span></div>${data.trainingRows.map((r,i)=>`<div class="bar-row"><div class="bar-label">${field(`trainingRows.${i}.label`,r.label)}<strong>${r.value.toFixed(1)}</strong></div><div class="bar-track"><div class="bar-fill" style="width:${Math.min(100,r.value/25*100)}%"></div></div><div class="bar-model">${escape(r.model)}</div></div>`).join('')}${field('trainingNote',data.trainingNote,'p','note')}</div><div class="metric-list">${data.trainingResults.map((r,i)=>`<article class="metric"><div>${field(`trainingResults.${i}.value`,r.value,'div','metric-value')}${field(`trainingResults.${i}.label`,r.label,'div','metric-label')}</div>${field(`trainingResults.${i}.text`,r.text,'p')}</article>`).join('')}</div></div><div class="takeaway"><b>本周结论</b>${field('trainingConclusion',data.trainingConclusion)}</div><details class="sources"><summary>查看结果来源</summary><a href="https://github.com/Young-wm/HaWoR-Refine/blob/97e913d5f8d2a0385569aa2fc79c244663790e13/experiments/p9_v3_r3/README.md" target="_blank" rel="noopener">UmeTrack 扩充</a><a href="https://github.com/Young-wm/HaWoR-Refine/blob/97e913d5f8d2a0385569aa2fc79c244663790e13/experiments/p9_v4_show3d/README.md" target="_blank" rel="noopener">SHOW3D 训练</a><a href="https://github.com/Young-wm/HaWoR-Refine/blob/97e913d5f8d2a0385569aa2fc79c244663790e13/experiments/p9_v4_score_show3d/README.md" target="_blank" rel="noopener">SHOW3D 测试</a><p>来源仓库需要相应访问权限；网页展示不依赖仓库登录。</p></details></section>
      <section id="quest">${label('03','THIS WEEK / QUEST 调试')}${field('questTitle',data.questTitle,'h2')}${field('questIntro',data.questIntro,'p','lead')}<div class="three-grid">${data.questCards.map((c,i)=>`<article class="card">${field(`questCards.${i}.tag`,c.tag,'span','tag')}${field(`questCards.${i}.title`,c.title,'h3')}${field(`questCards.${i}.text`,c.text,'p')}</article>`).join('')}</div><div class="pipeline">${data.questPipeline.map((s,i)=>`<div class="pipeline-step"><small>STEP 0${i+1}</small>${field(`questPipeline.${i}`,s)}</div>`).join('')}</div><div class="takeaway"><b>当前状态</b>${field('questConclusion',data.questConclusion)}</div>${field('questNote',data.questNote,'p','note')}</section>
      <section id="demos">${label('04','DEMONSTRATION / 视频展示')}${field('demoTitle',data.demoTitle,'h2')}${field('demoIntro',data.demoIntro,'p','lead')}<div class="demo-layout"><div><div class="player-shell"><video id="video" controls playsinline preload="none" aria-label="演示视频"></video><div class="player-toolbar"><span id="video-label"></span><button id="next-video" type="button">下一段 →</button></div></div><div id="video-description" class="video-description"></div></div><div id="playlist" class="playlist" aria-label="选择演示视频"></div></div></section>
      <section id="next">${label('05','NEXT / 下周计划')}${field('nextTitle',data.nextTitle,'h2')}${field('nextIntro',data.nextIntro,'p','lead')}<div class="next-grid">${data.next.map((c,i)=>`<article class="next-card"><span class="next-num">0${i+1}</span>${field(`next.${i}.title`,c.title,'h3')}${field(`next.${i}.text`,c.text,'p')}${field(`next.${i}.deliverable`,c.deliverable,'div','deliverable')}</article>`).join('')}</div>${field('closing',data.closing,'p','closing')}<div class="footer"><span>HaWoR-Refine / Quest · 手部三维重建与数据采集</span>${field('date',data.date)}</div></section>`;
    $('.sidebar-date').textContent=data.date;
    selectVideo(selected);
    $('#next-video').onclick=()=>selectVideo((selected+1)%data.videos.length);
    syncEditor();
    observeSections();
  }
  function selectVideo(index) {
    selected=index;
    const v=data.videos[index], player=$('#video');
    player.pause(); player.removeAttribute('src'); player.load();
    player.poster=v.poster; player.src=v.src; player.setAttribute('aria-label',v.title);
    $('#video-label').textContent=`${String(index+1).padStart(2,'0')} / ${String(data.videos.length).padStart(2,'0')} · ${v.duration}`;
    $('#video-description').innerHTML=`${field(`videos.${index}.tag`,v.tag,'span','tag')}${field(`videos.${index}.title`,v.title,'h3')}${field(`videos.${index}.description`,v.description,'p')}<div class="original">${escape(v.original)}</div>`;
    $('#playlist').innerHTML=data.videos.map((item,i)=>`<div><button type="button" class="video-choice ${i===index?'active':''}" data-video="${i}" aria-pressed="${i===index}"><img src="${escape(item.poster)}" loading="lazy" alt=""><span><span class="choice-title">${escape(item.title)}</span><small>${String(i+1).padStart(2,'0')} / ${escape(item.duration)}</small></span></button><div class="video-edit" ${editing?'':'hidden'}><button type="button" data-move="${i},-1" ${i===0?'disabled':''}>↑ 上移</button><button type="button" data-move="${i},1" ${i===data.videos.length-1?'disabled':''}>↓ 下移</button></div></div>`).join('');
    document.querySelectorAll('[data-video]').forEach(b=>b.onclick=()=>selectVideo(Number(b.dataset.video)));
    document.querySelectorAll('[data-move]').forEach(b=>b.onclick=()=>{const [i,d]=b.dataset.move.split(',').map(Number);const id=data.videos[selected].id;[data.videos[i],data.videos[i+d]]=[data.videos[i+d],data.videos[i]];saveDraft();selectVideo(data.videos.findIndex(v=>v.id===id));});
    syncEditor();
  }
  function syncEditor() {
    document.querySelectorAll('[data-field]').forEach(el=>{el.contentEditable=editing?'true':'false';el.spellcheck=false;});
    $('#edit-toggle').textContent=editing?'完成编辑':'编辑内容';
    $('#export').hidden=!editing; $('#reset').hidden=!editing;
    $('#draft-state').hidden=!draft;
    document.querySelectorAll('.video-edit').forEach(el=>el.hidden=!editing);
  }
  function saveDraft() {
    draft=true;
    try {localStorage.setItem(storageKey,JSON.stringify(data));} catch(_){toast('浏览器无法保存草稿，请及时导出修改。');}
    $('#draft-state').hidden=false;
  }
  document.addEventListener('input',event=>{
    const el=event.target.closest('[data-field]'); if(!el||!editing)return;
    const path=el.dataset.field.split('.'); const key=path.pop();let parent=data;for(const part of path)parent=parent[part];parent[key]=el.innerText.replace(/\r/g,'');saveDraft();
    if(el.dataset.field==='date')$('.sidebar-date').textContent=data.date;
    if(el.dataset.field===`videos.${selected}.title`)document.querySelector(`[data-video="${selected}"] .choice-title`).textContent=parent[key];
  });
  document.addEventListener('paste',event=>{if(!editing||!event.target.closest('[data-field]'))return;event.preventDefault();const text=event.clipboardData.getData('text/plain');const selection=window.getSelection();if(!selection.rangeCount)return;const range=selection.getRangeAt(0);range.deleteContents();const node=document.createTextNode(text);range.insertNode(node);range.setStartAfter(node);range.collapse(true);selection.removeAllRanges();selection.addRange(range);event.target.dispatchEvent(new Event('input',{bubbles:true}));});
  $('#edit-toggle').onclick=()=>{editing=!editing;syncEditor();if(editing)toast('点击虚线框修改文字；视频可以上移、下移。修改仅保存在本机，请导出后更新网站。');};
  $('#export').onclick=()=>{const blob=new Blob(['// 网页导出的汇报内容。替换 site/content.js 后重新发布。\nwindow.REPORT = '+JSON.stringify(data,null,2)+';\n'],{type:'text/javascript;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='content.js';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('已导出 content.js；替换网站同名文件后重新发布，其他电脑才会更新。');};
  $('#reset').onclick=()=>{if(!confirm('清除本机草稿，恢复网站文件中的内容？'))return;try{localStorage.removeItem(storageKey);}catch(_){}data=JSON.parse(JSON.stringify(original));draft=false;selected=0;render();toast('已恢复文件版本。');};
  let observer;
  function observeSections(){observer?.disconnect();observer=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;const sections=[...document.querySelectorAll('main section')];activeSection=sections.indexOf(entry.target);document.querySelectorAll('.sidebar nav a').forEach(a=>a.classList.toggle('active',a.hash===`#${entry.target.id}`));$('#page-count').textContent=`${activeSection+1} / ${sections.length}`;}},{rootMargin:'-10% 0px -65% 0px',threshold:0});document.querySelectorAll('main section').forEach(s=>observer.observe(s));}
  function moveSection(delta){const sections=[...document.querySelectorAll('main section')];activeSection=Math.max(0,Math.min(sections.length-1,activeSection+delta));sections[activeSection].scrollIntoView({behavior:'smooth'});}
  function presentation(on){document.body.classList.toggle('presenting',on);$('.presentation-controls').hidden=!on;editing=false;syncEditor();document.querySelectorAll('main section')[activeSection].scrollIntoView();}
  $('#present').onclick=()=>presentation(true);$('#exit-present').onclick=()=>presentation(false);$('#previous').onclick=()=>moveSection(-1);$('#following').onclick=()=>moveSection(1);
  document.addEventListener('keydown',e=>{if(e.target.isContentEditable||['INPUT','TEXTAREA','VIDEO','BUTTON'].includes(e.target.tagName))return;if(e.key==='Escape')presentation(false);if(!document.body.classList.contains('presenting'))return;if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();moveSection(1);}if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();moveSection(-1);}});
  let toastTimer;function toast(message){$('#toast').textContent=message;$('#toast').style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').style.display='none',6500);}
  render();
})();
