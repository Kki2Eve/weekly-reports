(() => {
  'use strict';
  const original = structuredClone(window.WEEKLY_REPORT);
  const storageKey = `weekly-report:${original.date}:v1`;
  let data = structuredClone(original), editing = false, draft = false, active = 0;
  try { const saved = JSON.parse(localStorage.getItem(storageKey)); if (saved?.date === original.date && Array.isArray(saved.sections)) { data = saved; draft = true; } } catch (_) {}
  const $ = selector => document.querySelector(selector);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const field = (path, value, tag = 'span', cls = '') => `<${tag} class="${cls}" data-field="${path}">${esc(value)}</${tag}>`;
  const mediaUrl = value => { try { const url = new URL(value, location.href); return ['http:', 'https:', 'file:'].includes(url.protocol) ? esc(value) : ''; } catch (_) { return ''; } };
  function block(b, p) {
    if (b.type === 'text') return field(`${p}.text`, b.text, 'p', 'text-block');
    if (b.type === 'bullets') return b.items.length ? `<ul class="list-block">${b.items.map((t,i) => field(`${p}.items.${i}`, t, 'li')).join('')}</ul>` : '';
    if (b.type === 'image') return `<figure class="image-block"><a href="${mediaUrl(b.src)}" target="_blank" rel="noopener"><img src="${mediaUrl(b.src)}" alt="${esc(b.alt || b.caption || '')}" loading="lazy"></a>${field(`${p}.caption`, b.caption || '', 'figcaption')}</figure>`;
    if (b.type === 'videos') return `<div class="media-grid">${b.items.map((v,i) => `<div class="player-shell"><video controls playsinline preload="none" src="${mediaUrl(v.src)}" ${v.poster ? `poster="${mediaUrl(v.poster)}"` : ''} aria-label="${esc(v.title)}"></video><div class="player-toolbar">${field(`${p}.items.${i}.title`, v.title)}</div></div>`).join('')}</div>`;
    if (b.type === 'metrics') return `<div class="metrics-grid">${b.items.map((m,i) => `<article class="metric">${field(`${p}.items.${i}.label`, m.label, 'h3')}${field(`${p}.items.${i}.value`, m.value, 'div', 'metric-value')}${field(`${p}.items.${i}.note`, m.note || '', 'p', 'metric-label')}</article>`).join('')}</div>`;
    if (b.type === 'table') return `<div class="table-wrap"><table><thead><tr>${b.columns.map((v,i) => field(`${p}.columns.${i}`, v, 'th')).join('')}</tr></thead><tbody>${b.rows.map((r,i) => `<tr>${r.map((v,j) => field(`${p}.rows.${i}.${j}`, v, 'td')).join('')}</tr>`).join('')}</tbody></table></div>`;
    return '';
  }
  function render() {
    document.title = `${data.title} · ${data.date}`;
    $('.sidebar-date').textContent = data.date.replaceAll('-', '.');
    $('.sidebar nav').innerHTML = data.sections.map((s,i) => `<a href="#${esc(s.id)}"><span>${String(i+1).padStart(2,'0')}</span>${esc(s.title)}</a>`).join('');
    $('#report').innerHTML = `<div class="report-intro">${field('title',data.title,'h1')}${field('summary',data.summary,'p')}</div>` + data.sections.map((s,i) => `<section id="${esc(s.id)}"><div class="section-heading"><span class="section-label">${String(i+1).padStart(2,'0')}</span>${field(`sections.${i}.title`, s.title, 'h2')}</div>${s.blocks.map((b,j) => block(b,`sections.${i}.blocks.${j}`)).join('')}</section>`).join('');
    document.querySelectorAll('video').forEach(v => v.addEventListener('play', () => document.querySelectorAll('video').forEach(other => { if (other !== v) other.pause(); })));
    sync(); updateActive();
  }
  function sync() {
    document.querySelectorAll('[data-field]').forEach(el => { el.contentEditable = String(editing); el.spellcheck = false; });
    $('#edit-toggle').textContent = editing ? '完成编辑' : '编辑内容';
    $('#export').hidden = $('#reset').hidden = !editing;
    $('#draft-state').hidden = !draft;
  }
  let toastTimer;
  function toast(message) { $('#toast').textContent = message; $('#toast').style.display = 'block'; clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').style.display = 'none', 4500); }
  document.addEventListener('input', event => {
    const el = event.target.closest('[data-field]'); if (!editing || !el) return;
    const parts = el.dataset.field.split('.'), key = parts.pop(); let parent = data;
    parts.forEach(part => parent = parent[part]); parent[key] = el.innerText.replace(/\r/g,''); draft = true;
    try { localStorage.setItem(storageKey, JSON.stringify(data)); } catch (_) { toast('请导出修改以保存。'); }
    $('#draft-state').hidden = false;
  });
  document.addEventListener('paste', event => {
    if (!editing || !event.target.closest('[data-field]')) return;
    event.preventDefault(); const selection = getSelection(); if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0); range.deleteContents(); const node = document.createTextNode(event.clipboardData.getData('text/plain')); range.insertNode(node); range.setStartAfter(node); range.collapse(true); selection.removeAllRanges(); selection.addRange(range); event.target.dispatchEvent(new Event('input', {bubbles:true}));
  });
  $('#edit-toggle').onclick = () => { editing = !editing; if (!editing) render(); else { sync(); toast('修改保存在本机；导出 report.json 后重新发布。'); } };
  $('#export').onclick = () => { const url = URL.createObjectURL(new Blob([JSON.stringify(data,null,2)+'\n'], {type:'application/json;charset=utf-8'})); const a = document.createElement('a'); a.href = url; a.download = 'report.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); };
  let resetArmed = false, resetTimer;
  $('#reset').onclick = () => {
    if (!resetArmed) { resetArmed = true; $('#reset').textContent = '确认恢复'; resetTimer = setTimeout(() => { resetArmed = false; $('#reset').textContent = '恢复文件版本'; },4000); return; }
    clearTimeout(resetTimer); resetArmed = false; $('#reset').textContent = '恢复文件版本'; try { localStorage.removeItem(storageKey); } catch (_) {} data = structuredClone(original); draft = false; render();
  };
  function updateActive() {
    const sections = [...document.querySelectorAll('main section')]; active = 0;
    sections.forEach((s,i) => { if (s.getBoundingClientRect().top <= (document.body.classList.contains('presenting') ? 75 : 180)) active = i; });
    document.querySelectorAll('.sidebar nav a').forEach((a,i) => a.classList.toggle('active', i === active)); $('#page-count').textContent = `${active+1} / ${sections.length}`;
  }
  function move(delta) { const sections = [...document.querySelectorAll('main section')]; active = Math.max(0,Math.min(sections.length-1,active+delta)); sections[active]?.scrollIntoView({behavior:'smooth'}); }
  function present(on) { document.body.classList.toggle('presenting',on); $('.presentation-controls').hidden = !on; editing = false; sync(); document.querySelectorAll('main section')[active]?.scrollIntoView(); }
  $('#present').onclick = () => present(true); $('#exit-present').onclick = () => present(false); $('#previous').onclick = () => move(-1); $('#following').onclick = () => move(1);
  window.addEventListener('scroll',updateActive,{passive:true}); window.addEventListener('resize',updateActive);
  document.addEventListener('keydown', e => { if (e.target.isContentEditable || ['INPUT','TEXTAREA','VIDEO'].includes(e.target.tagName)) return; if (e.key === 'Escape') present(false); if (!document.body.classList.contains('presenting')) return; if (['ArrowRight','PageDown','ArrowLeft','PageUp'].includes(e.key)) { e.preventDefault(); move(['ArrowRight','PageDown'].includes(e.key) ? 1 : -1); } });
  render();
})();
