// ══════════════════════════════════════════════
// MAP — Interactive Journey Map (rendered in reality section)
// ══════════════════════════════════════════════

const locations = [
  { id:'r1', name:'武汉革命博物馆', x:52, y:48, emoji:'🏛️' },
  { id:'r2', name:'武汉大学', x:58, y:55, emoji:'🏫' },
  { id:'r3', name:'武汉长江大桥', x:48, y:52, emoji:'🌉' },
  { id:'r4', name:'中国光谷', x:65, y:58, emoji:'💡' },
  { id:'r5', name:'武汉抗疫纪念馆', x:40, y:35, emoji:'🎗️' },
  { id:'r6', name:'红色美丽乡村(红安)', x:70, y:25, emoji:'🌾' },
  { id:'r7', name:'武汉工人文化宫', x:45, y:42, emoji:'⚒️' }
];

export function renderMap(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Only render once
  if (container.querySelector('.map-marker')) return;

  let html = '';

  // Draw route path (simplified as SVG)
  html += `<svg class="map-route" viewBox="0 0 100 100" preserveAspectRatio="none">
    <polyline points="52,48 58,55 48,52 65,58 70,25 45,42 40,35"
      fill="none" stroke="rgba(255,215,0,0.3)" stroke-width="0.4" stroke-dasharray="2,2" />
  </svg>`;

  // City labels
  html += `<div style="position:absolute;left:46%;top:44%;color:rgba(255,215,0,0.5);font-size:0.85rem;letter-spacing:4px;pointer-events:none;font-family:var(--font-serif)">武 汉</div>`;
  html += `<div style="position:absolute;left:67%;top:21%;color:rgba(255,255,255,0.25);font-size:0.7rem;letter-spacing:2px;pointer-events:none">红安</div>`;

  // Location markers
  locations.forEach(loc => {
    html += `<div class="map-marker" style="left:${loc.x}%;top:${loc.y}%"
      data-loc="${loc.id}" onclick="window._showMapInfo('${loc.id}')"
      title="${loc.name}">
      ${loc.emoji}
      <div class="marker-pulse"></div>
    </div>`;
  });

  // Info panel
  html += `<div class="map-info-panel" id="mapInfoPanel">
    <h4 id="mapInfoTitle"></h4>
    <p id="mapInfoDesc"></p>
  </div>`;

  container.innerHTML = html;
}

// Show map info (global)
window._showMapInfo = function(locId) {
  const locData = {
    r1: { name:'武汉革命博物馆', desc:'武昌红巷红色地标，集农讲所、毛泽东旧居、五大会址于一体。每年接待超过200万人次。' },
    r2: { name:'武汉大学', desc:'百年学府，红色摇篮。陈潭秋、李达在此求学任教，周恩来故居坐落珞珈山。' },
    r3: { name:'武汉长江大桥', desc:'万里长江第一桥，1957年通车。新中国"一五"计划标志性工程，"一桥飞架南北，天堑变通途"。' },
    r4: { name:'中国光谷', desc:'东湖高新区，中国光电子产业基地。13万家企业集聚，年GDP超3000亿元。' },
    r5: { name:'武汉抗疫纪念馆', desc:'记录2020武汉保卫战的英雄史诗，1000余件实物讲述新时代英雄故事。' },
    r6: { name:'红色美丽乡村(红安)', desc:'大别山革命老区，223位将军的故乡。红色旅游+特色农业+光伏产业，实现脱贫摘帽。' },
    r7: { name:'武汉工人文化宫', desc:'工人阶级精神家园。见证从二七罢工到新时代大国工匠的百年工人运动史。' }
  };

  const info = locData[locId];
  if (!info) return;

  document.getElementById('mapInfoTitle').textContent = info.name;
  document.getElementById('mapInfoDesc').textContent = info.desc;
  const panel = document.getElementById('mapInfoPanel');
  panel.classList.add('show');

  // Highlight marker
  document.querySelectorAll('.map-marker').forEach(m => m.classList.remove('active'));
  const marker = document.querySelector(`.map-marker[data-loc="${locId}"]`);
  if (marker) marker.classList.add('active');
};
