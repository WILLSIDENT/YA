window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('grid'))   loadAll();
  if (document.getElementById('detail')) loadDetail();
});

// 一覧表示
async function loadAll() {
  const list = await fetch('./characters.json').then(r => r.json());
  const grid = document.getElementById('grid');
  grid.innerHTML = '';

  list.forEach(c => {
    const a = document.createElement('a');
    a.href = `detail.html?id=${c.id}`;
    a.className = 'card';
    a.classList.add(c.gender === '♂' ? 'male' : c.gender === '♀'?'female':'le');
    a.innerHTML = `
      <img src="${c.thumb}" alt="${c.name}" width="150" height="150">
      <div class="card-info">
        <h2>${c.name1}　${c.gender}</h2>
        <div class="card-meta">
          <span>誕生日:${c.birthday}　</span><span>年齢:${c.age}　</span>
          <span>身長:${c.height}　</span><span>体重:${c.weight}　</span><br>
          <span>${c.motto}　</span>
        </div>
        <div class="color-container">${Array.isArray(c.colors) ? c.colors.map(col => `<span class="color-box" style="background:${col}"></span>`).join(''):''}</div>
      </div>
    `;
    grid.append(a);
  });
}


// 詳細表示
async function loadDetail() {
  const div = document.getElementById('detail');
  try {
    const res = await fetch('characters.json');
    if (!res.ok) throw new Error(`status ${res.status}`);
    const list = await res.json();const id = new URLSearchParams(location.search).get('id');
    const c = list.find(x => x.id === id);
    if (!c) {div.textContent = `キャラが見つかりません (id=${id})`;return;}
    const person=c.person||{};const status=c.status||{};
    const impressions = Array.isArray(c.impressions) ? c.impressions : [];
    const {good1 = '', bad1 = '' } = c.preference || {};
    const {good = '', bad = '' } = c.relationships || {};

    div.innerHTML = `
      <div class="flex">
        <figure class="image"><img src="${c.thumb}" alt="${c.name}"></figure>
        <div class="right">
          <p class="title">${c.name} ( ${c.name1} ) ${c.gender}</p>
          <p class="text">${c.motto}　誕生日：${c.birthday}　年齢：${c.age}歳　身長：${c.height}　体重：${c.weight}　出身地：${c.birthplace}
            ・${c.profile1 || ''}<br>・${c.profile2 || ''}
          </p>
        </div>
      </div>
      <div class="detail-color-container">${Array.isArray(c.colors) ? c.colors.map(col => `<span class="detail-color-box" style="background:${col}"></span>`).join(''):''}</div>
        


      <h3>能力</h3>
      <div>
      <li class="normal-list2">　${c.ability || '---'}</li>
      </div>

      <h3>ステータス</h3>

      <ul class="status-list">
        ${Object.entries(status).length
            ? Object.entries(status)
              .map(([k, v]) => `<li class="status-${k}">${k}: ${v}</li>`).join('')
            : '<li class="status-unknown">未設定</li>'}
      </ul>
      <ul class="person-list">
        ${Object.entries(person).length
            ? Object.entries(person)
              .map(([k, v]) => `<li class="status-${k}">${k}: ${v}</li>`).join('')
            : '<li class="status-unknown">未設定</li>'}
      </ul>


      <h3>好み</h3>
      <div>
      <ul class="normal-list">
      <li>好きな物・事：　${good1 || 'なし'}</li>
      <li>嫌いな物・事：　${bad1 || 'なし'}</li>
      </ul>
      </div>
      <h3>人間関係</h3>
      <div>
      <li class="normal-list2">仲良い人 ／ 好きなタイプ：　${good || 'なし'}</li>
      <li class="normal-list2">仲悪い人 ／ 嫌いなタイプ：　${bad || 'なし'}</li>
      </div>


      <h3>互いの印象</h3>

      <ul class="impr-list">
        ${c.impressions.map(i => {
          const f = list.find(x => x.id === i.from) || {};
          const ff = list.find(x=>x.id===i) || {};
                const likeClass = i.like === '1' ? 'like-1'
                                : i.like === '2' ? 'like-2'
                                : i.like === '3' ? 'like-3'
                                : '';
                return `
          <li>
            <a href="detail.html?id=${i.from}">
              <img src="${f.thumb||''}" alt="${f.name||i}" width="100" height="100">
              <span>${f.name1||i.from}</span>
            </a>
        <div class="impr-text">
         <!-- likeClass を here に追加 -->
          <p class="impr-b">▷▷${i.text_b||''}</p><br>
          <p class="impr-a ${likeClass}">◁◁${i.text_a||''}</p>

        </div>
          </li>`;
        }).join('')}
      </ul>
    `;
  } catch (e) {div.textContent='読み込みエラー';}
}
