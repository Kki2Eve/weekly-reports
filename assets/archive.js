(() => {
  const reports = window.REPORT_INDEX || [];
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  document.querySelector('#report-count').textContent = `${reports.length} 份汇报`;
  if (reports.length) {
    const r = reports[0], [year, month, day] = r.date.split('-');
    document.querySelector('#latest').innerHTML = `<a class="latest-card" href="${escape(r.url)}"><div class="latest-copy"><div class="latest-label"><span class="badge">最新汇报</span><time datetime="${r.date}">${r.date.replaceAll('-','.')}</time></div><h2>${escape(r.title)}</h2><p class="summary">${escape(r.summary)}</p><div class="tags">${r.tags.map(t=>`<span class="tag">${escape(t)}</span>`).join('')}</div><span class="open-report">打开汇报 <span aria-hidden="true">↗</span></span></div><div class="latest-art" aria-hidden="true"><div class="date-tile"><small>${year} / ${month}</small><strong>${day}</strong><br><span>工作汇报</span></div></div></a>`;
  }
  function render(query = '') {
    const filtered = reports.filter(r => [r.date, r.date.replaceAll('-','.'), r.title, r.summary, ...r.tags].join(' ').toLowerCase().includes(query.trim().toLowerCase()));
    let year = '';
    document.querySelector('#archive').innerHTML = filtered.map(r => {
      const heading = year !== r.date.slice(0,4) ? `<h3 class="year-label">${r.date.slice(0,4)}</h3>` : '';
      year = r.date.slice(0,4);
      return `${heading}<a class="report-row" href="${escape(r.url)}"><time class="row-date" datetime="${r.date}">${r.date.replaceAll('-','.')}</time><div class="row-body"><div class="row-title">${escape(r.title)}</div><div class="row-summary">${escape(r.summary)}</div></div><span class="arrow" aria-hidden="true">↗</span></a>`;
    }).join('');
    document.querySelector('#empty').hidden = filtered.length !== 0;
  }
  document.querySelector('#search').addEventListener('input', event => render(event.target.value));
  render();
})();
