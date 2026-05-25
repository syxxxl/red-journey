// ══════════════════════════════════════════════
// FEATURES — Timeline, Fragments, Quiz, Pledge, Future, Summary
// ══════════════════════════════════════════════
import { State } from './state.js';
import { TOTAL_FRAGMENTS, FRAGMENT_NAMES, QUIZ_DATA, FUTURE_MESSAGES } from './constants.js';
import { spawnSparks, showAchievement } from './effects.js';

// ── Timeline ──
export function expandTimeline(el) {
  el.classList.toggle('expanded');
}

// ── Fragments ──
export function collectFragment(fid) {
  if (!State.collectFragment(fid)) return;
  const name = FRAGMENT_NAMES[fid] || fid;
  showAchievement('★', '收集到精神碎片：' + name + ' (' + State.get('fragments').size + '/' + TOTAL_FRAGMENTS + ')');
  if (State.get('fragments').size === TOTAL_FRAGMENTS) {
    setTimeout(() => showAchievement('🏆', '全部20枚碎片收集完毕！你是真正的红色文化传承者！'), 1500);
  }
  updateFragmentDisplay();
  // Refresh genealogy if visible
  if (document.getElementById('genealogy-section').classList.contains('active')) {
    import('./genealogy.js').then(m => m.renderGenealogy());
  }
}

export function updateFragmentDisplay() {
  document.querySelectorAll('.spirit-fragment').forEach(el => {
    if (State.get('fragments').has(el.dataset.fid)) el.classList.add('collected');
  });
}

// ── Quiz Engine ──
const quizStates = {};

export function initQuiz(quizId) {
  quizStates[quizId] = { current: 0, answered: false };
  renderQuiz(quizId);
}

function renderQuiz(quizId) {
  const data = QUIZ_DATA[quizId];
  const state = quizStates[quizId];
  if (!data || !state) return;
  const prefix = quizId.split('-')[0];
  const qEl = document.getElementById(prefix + '-q-text');
  const optsEl = document.getElementById(prefix + '-q-opts');
  const fbEl = document.getElementById(prefix + '-q-fb');
  if (state.current >= data.length) {
    const section = quizId.split('-')[0];
    const score = State.get('quizScores')[section];
    const total = State.get('quizTotal')[section];
    qEl.textContent = '🎉 问答完成！';
    optsEl.innerHTML = '';
    fbEl.textContent = '你的得分：' + score + '/' + total + (score === total ? ' ⭐ 全部正确！太棒了！' : ' 继续加油！');
    fbEl.style.color = score === total ? '#81C784' : '#FFD54F';
    return;
  }
  const item = data[state.current];
  qEl.textContent = item.q;
  optsEl.innerHTML = item.opts.map(o =>
    `<button class="quiz-opt" data-correct="${o.c}">${o.t}</button>`
  ).join('');
  fbEl.textContent = '';
  state.answered = false;
}

export function handleQuizClick(opt) {
  if (opt.dataset.handled) return;
  opt.dataset.handled = '1';
  const quizBlock = opt.closest('.quiz-block');
  if (!quizBlock) return;
  const quizId = quizBlock.id;
  const state = quizStates[quizId];
  if (!state || state.answered) return;
  state.answered = true;

  const isCorrect = opt.dataset.correct === 'true';
  const section = quizId.split('-')[0];
  State.addQuizScore(section, isCorrect);

  const optsContainer = opt.parentElement;
  optsContainer.querySelectorAll('.quiz-opt').forEach(o => {
    o.style.pointerEvents = 'none';
    if (o.dataset.correct === 'true') o.classList.add('correct');
    else if (o === opt && !isCorrect) o.classList.add('wrong');
  });

  const fbEl = document.getElementById(section + '-q-fb');
  if (isCorrect) {
    fbEl.textContent = '✅ 回答正确！';
    fbEl.style.color = '#81C784';
    spawnSparks(opt, 18);
  } else {
    fbEl.textContent = '❌ 不对哦，正确答案已高亮显示。';
    fbEl.style.color = '#EF9A9A';
  }
  setTimeout(() => {
    state.current++;
    state.answered = false;
    renderQuiz(quizId);
  }, 1500);
}

export function resetAllQuizzes() {
  Object.keys(QUIZ_DATA).forEach(id => {
    quizStates[id] = { current: 0, answered: false };
    renderQuiz(id);
  });
}

// ── Future Choice ──
export function selectFuture(el, choice) {
  document.querySelectorAll('#future-choices .future-choice-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  State.setFutureChoice(choice);
  const msg = FUTURE_MESSAGES[choice];
  if (!msg) return;
  document.getElementById('future-result-title').textContent = msg.title;
  document.getElementById('future-result-text').textContent = msg.text;
  document.getElementById('future-result-quote').textContent = msg.quote;
  const card = document.getElementById('future-result-card');
  card.style.display = 'block';
  card.classList.add('revealed');
  setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
}

// ── Pledge ──
export function submitPledge() {
  const input = document.getElementById('pledgeInput');
  const text = input.value.trim();
  if (!text) return;
  State.addPledge(text);
  const wall = document.getElementById('pledgeWall');
  const tag = document.createElement('span');
  tag.className = 'pledge-tag';
  tag.textContent = text;
  wall.appendChild(tag);
  input.value = '';
  spawnSparks(tag);
  showAchievement('💬', '誓言已铭记：' + text.substring(0, 18) + (text.length > 18 ? '…' : ''));
}

// ── Sub-Nav Tabs ──
export function initSubNav() {
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.sub-nav-btn');
    if (!btn) return;
    const target = btn.dataset.target;
    const parent = btn.parentElement;
    parent.querySelectorAll('.sub-nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const section = btn.closest('.section-page') || btn.closest('.page');
    if (!section) return;

    // Hide all containers
    const containers = section.querySelectorAll('.content-card, .location-grid, .future-grid, .pledge-section, .timeline-wrap, #future-result-card, [id^="loc-"]');
    containers.forEach(c => { c.style.display = 'none'; });

    // Hide wrapper divs
    const idsToHide = ['timeline', 'loc-overview', 'future-choices-panel', 'future-pledge'];
    idsToHide.forEach(id => {
      const el = section.querySelector('#' + id);
      if (el) el.style.display = 'none';
    });

    const targetEl = document.getElementById(target);
    if (targetEl) targetEl.style.display = 'block';

    // Restore grid displays
    if (target === 'loc-overview') {
      const grid = section.querySelector('.location-grid');
      if (grid) grid.style.display = 'grid';
    }
    if (target === 'timeline') {
      const tl = section.querySelector('#timeline');
      if (tl) tl.style.display = 'block';
    }
    if (target === 'future-choices-panel') {
      const grid = section.querySelector('.future-grid');
      if (grid) grid.style.display = 'grid';
      const result = document.getElementById('future-result-card');
      if (result) result.style.display = State.get('futureChoice') ? 'block' : 'none';
    }
    if (target === 'future-pledge') {
      const ps = section.querySelector('#future-pledge .pledge-section');
      if (ps) ps.style.display = 'block';
    }
  });
}

// ── Summary Builder ──
export function buildSummary() {
  const names = {
    'history-section': '历史之路', 'reality-section': '现实之窗', 'future-section': '未来之梦',
    'genealogy-section': '精神谱系', 'heroes-section': '英雄谱', 'voices-section': '薪火之声'
  };
  const visitedArr = [...State.get('visited')].filter(v => names[v]).map(v => names[v]);
  const totalQuizScore = Object.values(State.get('quizScores')).reduce((a, b) => a + b, 0);
  const totalQuizQ = Object.values(State.get('quizTotal')).reduce((a, b) => a + b, 0);

  document.getElementById('summaryRecap').innerHTML = `
    你的寻访轨迹：<span>${visitedArr.join(' → ') || '尚未深度探索'}</span><br><br>
    在建党105周年、长征胜利90周年之际，<br>
    你沿着<span>「历史·现实·未来」</span>三维实践体系，<br>
    深入湖北武汉，穿越了百年红色时空。<br>
    从1911年武昌城头的枪声到2026年光谷的脉动，<br>
    从长征路上的草鞋足迹到新时代青年的铿锵誓言——<br>
    你走过的每一站，都是薪火相传路上的一个坐标；<br>
    你收集的每一枚精神碎片，都是照亮未来的星火。
  `;
  document.getElementById('stat-paths').textContent = visitedArr.length;
  document.getElementById('stat-quiz').textContent = totalQuizQ > 0 ? Math.round((totalQuizScore / totalQuizQ) * 100) + '%' : '—';
  document.getElementById('stat-fragments').textContent = State.get('fragments').size + '/' + TOTAL_FRAGMENTS;
  document.getElementById('stat-pledges').textContent = State.get('pledges').length;
  updateFragmentDisplay();
}

// ── Reset ──
export function resetAll() {
  State.reset();
  document.getElementById('pledgeWall').innerHTML = '';
  document.getElementById('topBar').style.transform = 'scaleX(0)';
  document.getElementById('future-result-card').style.display = 'none';
  document.querySelectorAll('.future-choice-card').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.spirit-fragment').forEach(el => el.classList.remove('collected'));
  document.querySelectorAll('.timeline-event').forEach(el => { el.classList.remove('expanded', 'visible'); });
  document.querySelectorAll('.location-card').forEach(el => el.classList.remove('expanded'));
  resetAllQuizzes();
}
