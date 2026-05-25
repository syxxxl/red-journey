// ══════════════════════════════════════════════
// STATE — Central state management
// ══════════════════════════════════════════════
const listeners = {};

function emit(event, data) {
  (listeners[event] || []).forEach(fn => fn(data));
}

export const State = {
  _data: {
    visited: new Set(),
    fragments: new Set(),
    quizScores: { history: 0, reality: 0, future: 0 },
    quizTotal: { history: 0, reality: 0, future: 0 },
    pledges: [],
    futureChoice: null,
    pageHistory: ['landing'],
    currentPage: 'landing'
  },

  get(key) { return this._data[key]; },
  set(key, value) { this._data[key] = value; },

  on(event, fn) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(fn);
    return () => { listeners[event] = listeners[event].filter(f => f !== fn); };
  },

  emit,

  addVisited(pageId) {
    if (this._data.visited.has(pageId)) return;
    this._data.visited.add(pageId);
    emit('visited:changed', { visited: this._data.visited });
  },

  collectFragment(fid) {
    if (this._data.fragments.has(fid)) return false;
    this._data.fragments.add(fid);
    emit('fragment:collected', { fid, count: this._data.fragments.size });
    return true;
  },

  addQuizScore(section, correct) {
    this._data.quizTotal[section]++;
    if (correct) this._data.quizScores[section]++;
  },

  addPledge(text) {
    this._data.pledges.push(text);
    emit('pledge:added', { text, count: this._data.pledges.length });
  },

  setFutureChoice(choice) {
    this._data.futureChoice = choice;
    emit('future:chosen', { choice });
  },

  reset() {
    this._data.visited.clear();
    this._data.fragments.clear();
    this._data.quizScores = { history: 0, reality: 0, future: 0 };
    this._data.quizTotal = { history: 0, reality: 0, future: 0 };
    this._data.pledges = [];
    this._data.futureChoice = null;
    this._data.pageHistory = ['landing'];
    this._data.currentPage = 'landing';
  }
};
