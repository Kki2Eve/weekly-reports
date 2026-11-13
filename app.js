(() => {
  'use strict';
  const storageKey='quest-weekend-report-20261114-v2',original=structuredClone(window.REPORT);
  let data=structuredClone(original),draft=false,editing=false,activeSection=0;
  const selected={comparison:0,quest:0};
  try{const saved=JSON.parse(localStorage.getItem(storageKey));if(saved?.groups?.comparison&&saved?.groups?.quest&&Array.isArray(saved.review)){data=saved;draft=true;}}catch(_){}
  const $=selector=>document.querySelector(selector);
  const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const field=(path,value,tag='span',cls='')=>`<${tag} class="${cls}" data-field="${path}">${escape(value)}</${tag}>`;
  const heading=(number,title)=>`<div class="section-label">${number}</div><h2>${title}</h2>`;
  function gallery(group){return `<div class="demo-layout"><div class="player-shell"><video id="video-${group}" controls playsinline preload="none"></video><div class="player-toolbar"><span id="video-label-${group}"></span><button type="button" data-next="${group}">下一段 →</button></div></div><div id="playlist-${group}" class="playlist"></div></div>`;}
  function render(){
    $('#report').innerHTML=`
    <section id="review">${heading('01','上周回顾')}<div class="review-list">${data.review.map((v,i)=>field(`review.${i}`,v,'p')).join('')}</div><div class="carry"><h3>遗留任务</h3>${field('pending',data.pending,'p')}</div></section>
    <section id="training">${heading('02','本周 · 模型训练')}${field('training',data.training,'p','lead')}<div class="training-layout"><div class="chart-card"><div class="chart-heading">${field('developmentTitle',data.developmentTitle,'strong')}${field('developmentMetric',data.developmentMetric)}</div>${data.trainingRows.map((r,i)=>`<div class="bar-row"><div class="bar-label">${field(`trainingRows.${i}.label`,r.label)}<strong>${r.value.toFixed(1)}</strong></div><div class="bar-track"><div class="bar-fill" style="width:${Math.min(100,r.value/25*100)}%"></div></div></div>`).join('')}</div><div class="metric-list">${data.testResults.map((r,i)=>`<article class="metric">${field(`testResults.${i}.dataset`,r.dataset,'h3')}${field(`testResults.${i}.value`,r.value,'div','metric-value')}${field(`testResults.${i}.metric`,r.metric,'p','metric-label')}</article>`).join('')}</div></div></section>
    <section id="comparison" class="video-section">${heading('03','对比方法')}${gallery('comparison')}</section>
    <section id="quest" class="video-section">${heading('04','Quest 调试')}${gallery('quest')}</section>
    <section id="next">${heading('05','下周计划')}${field('next',data.next,'p','next-focus')}</section>`;
    $('.sidebar-date').textContent=data.date;
    Object.keys(selected).forEach(group=>selectVideo(group,selected[group]));
    document.querySelectorAll('[data-next]').forEach(b=>b.onclick=()=>selectVideo(b.dataset.next,(selected[b.dataset.next]+1)%data.groups[b.dataset.next].length));
    document.querySelectorAll('video').forEach(player=>player.addEventListener('play',()=>document.querySelectorAll('video').forEach(other=>{if(other!==player)other.pause();})));
    syncEditor();observeSections();
  }
  function selectVideo(group,index){
    selected[group]=index;const list=data.groups[group],v=list[index],player=$(`#video-${group}`);
    player.pause();player.removeAttribute('src');player.load();player.poster=v.poster;player.src=v.src;player.style.aspectRatio=v.aspect||'16 / 9';player.setAttribute('aria-label',v.title);
    $(`#video-label-${group}`).innerHTML=field(`groups.${group}.${index}.title`,v.title);
    $(`#playlist-${group}`).innerHTML=list.map((item,i)=>`<div><button type="button" class="video-choice ${i===index?'active':''}" data-video="${group},${i}" aria-pressed="${i===index}"><img src="${escape(item.poster)}" alt="" loading="lazy"><span><span class="choice-title">${escape(item.title)}</span><small>${escape(item.duration)}</small></span></button><div class="video-edit" ${editing?'':'hidden'}><button type="button" data-move="${group},${i},-1" ${i===0?'disabled':''}>↑ 上移</button><button type="button" data-move="${group},${i},1" ${i===list.length-1?'disabled':''}>↓ 下移</button></div></div>`).join('');
    $(`#playlist-${group}`).querySelectorAll('[data-video]').forEach(b=>b.onclick=()=>{const[g,i]=b.dataset.video.split(',');selectVideo(g,Number(i));});
    $(`#playlist-${group}`).querySelectorAll('[data-move]').forEach(b=>b.onclick=()=>{const[g,rawIndex,rawDelta]=b.dataset.move.split(','),i=Number(rawIndex),d=Number(rawDelta),items=data.groups[g],id=items[selected[g]].id;[items[i],items[i+d]]=[items[i+d],items[i]];saveDraft();selectVideo(g,items.findIndex(item=>item.id===id));});
    syncEditor();
  }
  function syncEditor(){document.querySelectorAll('[data-field]').forEach(el=>{el.contentEditable=editing?'true':'false';el.spellcheck=false;});$('#edit-toggle').textContent=editing?'完成编辑':'编辑内容';$('#export').hidden=!editing;$('#reset').hidden=!editing;$('#draft-state').hidden=!draft;document.querySelectorAll('.video-edit').forEach(el=>el.hidden=!editing);}
  function saveDraft(){draft=true;try{localStorage.setItem(storageKey,JSON.stringify(data));}catch(_){toast('请导出修改以保存。');}$('#draft-state').hidden=false;}
  document.addEventListener('input',event=>{const el=event.target.closest('[data-field]');if(!el||!editing)return;const path=el.dataset.field.split('.'),key=path.pop();let parent=data;for(const part of path)parent=parent[part];parent[key]=el.innerText.replace(/\r/g,'');saveDraft();if(path[0]==='groups'&&key==='title'){const button=document.querySelector(`[data-video="${path[1]},${path[2]}"] .choice-title`);if(button)button.textContent=parent[key];}});
  document.addEventListener('paste',event=>{if(!editing||!event.target.closest('[data-field]'))return;event.preventDefault();const selection=window.getSelection();if(!selection.rangeCount)return;const range=selection.getRangeAt(0);range.deleteContents();const node=document.createTextNode(event.clipboardData.getData('text/plain'));range.insertNode(node);range.setStartAfter(node);range.collapse(true);selection.removeAllRanges();selection.addRange(range);event.target.dispatchEvent(new Event('input',{bubbles:true}));});
  $('#edit-toggle').onclick=()=>{editing=!editing;syncEditor();if(editing)toast('点击文字编辑；修改仅保存在本机，导出后重新发布。');};
  $('#export').onclick=()=>{const blob=new Blob(['window.REPORT = '+JSON.stringify(data,null,2)+';\n'],{type:'text/javascript;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='content.js';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('替换 content.js 并重新发布即可更新网站。');};
  let resetArmed=false,resetTimer;
  $('#reset').onclick=()=>{if(!resetArmed){resetArmed=true;$('#reset').textContent='确认恢复';resetTimer=setTimeout(()=>{resetArmed=false;$('#reset').textContent='恢复文件版本';},4000);return;}clearTimeout(resetTimer);resetArmed=false;$('#reset').textContent='恢复文件版本';try{localStorage.removeItem(storageKey);}catch(_){}data=structuredClone(original);draft=false;selected.comparison=0;selected.quest=0;render();};
  let observer;
  function observeSections(){observer?.disconnect();observer=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;activeSection=[...document.querySelectorAll('main section')].indexOf(entry.target);document.querySelectorAll('.sidebar nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${entry.target.id}`));$('#page-count').textContent=`${activeSection+1} / 5`;}},{rootMargin:'-10% 0px -65% 0px',threshold:0});document.querySelectorAll('main section').forEach(s=>observer.observe(s));}
  function moveSection(delta){const sections=[...document.querySelectorAll('main section')];activeSection=Math.max(0,Math.min(sections.length-1,activeSection+delta));sections[activeSection].scrollIntoView({behavior:'smooth'});}
  function presentation(on){document.body.classList.toggle('presenting',on);$('.presentation-controls').hidden=!on;editing=false;syncEditor();document.querySelectorAll('main section')[activeSection].scrollIntoView();}
  $('#present').onclick=()=>presentation(true);$('#exit-present').onclick=()=>presentation(false);$('#previous').onclick=()=>moveSection(-1);$('#following').onclick=()=>moveSection(1);
  document.addEventListener('keydown',e=>{if(e.target.isContentEditable||['INPUT','TEXTAREA','VIDEO'].includes(e.target.tagName))return;if(e.key==='Escape')presentation(false);if(!document.body.classList.contains('presenting'))return;if(['ArrowRight','PageDown'].includes(e.key)){e.preventDefault();moveSection(1);}if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();moveSection(-1);}});
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();document.querySelector(a.getAttribute('href')).scrollIntoView({behavior:'smooth'});}));
  if(location.hash)history.replaceState(null,'',location.pathname+location.search);
  let toastTimer;function toast(message){$('#toast').textContent=message;$('#toast').style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').style.display='none',4500);}
  render();
})();
