async function loadRepos() {
  const container = document.getElementById('repos-list');
  if (!container) return;
  const org = container.dataset.org || 'Zoran-IA-Mimetique';
  const url = `https://api.github.com/orgs/${org}/repos?per_page=100&sort=updated`;
  const res = await fetch(url);
  if (!res.ok) {
    container.innerHTML = '<div class="card"><p>Impossible de charger la liste des dépôts (API GitHub). Réessayez plus tard.</p></div>';
    return;
  }
  let repos = await res.json();
  repos = repos.filter(r => !r.archived);
  const search = document.getElementById('search');
  const sortSel = document.getElementById('sort');

  function render(list) {
    container.innerHTML = '';
    list.forEach(r => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3><a href="${r.html_url}" target="_blank" rel="noopener">${r.name}</a></h3>
        <p>${r.description ? r.description : '—'}</p>
        <div class="repo-meta">
          <span>★ ${r.stargazers_count}</span>
          <span>MAJ : ${new Date(r.updated_at).toLocaleDateString()}</span>
          <span>Lang : ${r.language || '—'}</span>
        </div>
      `;
      container.appendChild(card);
    });
  }

  function apply() {
    let list = [...repos];
    const q = (search.value || '').toLowerCase().trim();
    if (q) {
      list = list.filter(r => (r.name.toLowerCase().includes(q) || (r.description||'').toLowerCase().includes(q)));
    }
    const mode = sortSel.value;
    if (mode === 'stars') list.sort((a,b)=>b.stargazers_count-a.stargazers_count);
    if (mode === 'name') list.sort((a,b)=>a.name.localeCompare(b.name));
    if (mode === 'updated') list.sort((a,b)=>new Date(b.updated_at)-new Date(a.updated_at));
    render(list);
  }

  search.addEventListener('input', apply);
  sortSel.addEventListener('change', apply);
  apply();
}

document.addEventListener('DOMContentLoaded', loadRepos);