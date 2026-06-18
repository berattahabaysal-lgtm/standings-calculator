/**
 * Fixture / score input table with matchweek navigation.
 * Scores are editable even when pre-filled from data.
 */

/**
 * @typedef {Object} FixtureState
 * @property {string} id
 * @property {string} homeTeamId
 * @property {string} awayTeamId
 * @property {number|null} homeScore
 * @property {number|null} awayScore
 */

/**
 * @param {HTMLElement} container
 * @param {object} options
 */
export function mountFixtureInput(container, options) {
  const {
    league,
    currentMatchweekIndex,
    scoresMap,
    onMatchweekChange,
    onScoreChange,
    onCalculate,
    onReset,
  } = options;

  const teamsById = new Map(league.teams.map((t) => [t.id, t]));
  const matchweeks = league.matchweeks;
  const mw = matchweeks[currentMatchweekIndex];

  container.innerHTML = "";

  const header = document.createElement("div");
  header.className = "fixtures-header";

  const title = document.createElement("h2");
  title.className = "section-title";
  title.textContent = "Fixtures";

  const nav = document.createElement("div");
  nav.className = "matchweek-nav";

  const prevBtn = document.createElement("button");
  prevBtn.type = "button";
  prevBtn.className = "btn btn-secondary btn-nav";
  prevBtn.textContent = "← Prev";
  prevBtn.disabled = currentMatchweekIndex <= 0;
  prevBtn.addEventListener("click", () =>
    onMatchweekChange(currentMatchweekIndex - 1)
  );

  const matchweekLabel = document.createElement("span");
  matchweekLabel.className = "matchweek-label";
  matchweekLabel.textContent = `Matchweek ${mw.matchweek}`;

  const nextBtn = document.createElement("button");
  nextBtn.type = "button";
  nextBtn.className = "btn btn-secondary btn-nav";
  nextBtn.textContent = "Next →";
  nextBtn.disabled = currentMatchweekIndex >= matchweeks.length - 1;
  nextBtn.addEventListener("click", () =>
    onMatchweekChange(currentMatchweekIndex + 1)
  );

  nav.appendChild(prevBtn);
  nav.appendChild(matchweekLabel);
  nav.appendChild(nextBtn);

  header.appendChild(title);
  header.appendChild(nav);
  container.appendChild(header);

  const tableWrap = document.createElement("div");
  tableWrap.className = "table-scroll";

  const table = document.createElement("table");
  table.className = "fixtures-table";
  table.setAttribute("aria-label", "Match fixtures");

  const tbody = document.createElement("tbody");

  for (const fixture of mw.fixtures) {
    const home = teamsById.get(fixture.homeTeamId);
    const away = teamsById.get(fixture.awayTeamId);
    const stored = scoresMap.get(fixture.id) || {
      homeScore: fixture.homeScore,
      awayScore: fixture.awayScore,
    };

    const tr = document.createElement("tr");

    const homeTd = document.createElement("td");
    homeTd.className = "fixture-team fixture-home";
    homeTd.textContent = home?.name ?? fixture.homeTeamId;

    const scoreTd = document.createElement("td");
    scoreTd.className = "fixture-score";

    const homeInput = createScoreInput(
      stored.homeScore,
      (val) => onScoreChange(fixture.id, "homeScore", val)
    );
    const sep = document.createElement("span");
    sep.className = "score-separator";
    sep.textContent = "–";
    const awayInput = createScoreInput(
      stored.awayScore,
      (val) => onScoreChange(fixture.id, "awayScore", val)
    );

    scoreTd.appendChild(homeInput);
    scoreTd.appendChild(sep);
    scoreTd.appendChild(awayInput);

    const awayTd = document.createElement("td");
    awayTd.className = "fixture-team fixture-away";
    awayTd.textContent = away?.name ?? fixture.awayTeamId;

    tr.appendChild(homeTd);
    tr.appendChild(scoreTd);
    tr.appendChild(awayTd);
    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  tableWrap.appendChild(table);
  container.appendChild(tableWrap);

  const actions = document.createElement("div");
  actions.className = "fixture-actions";

  const calcBtn = document.createElement("button");
  calcBtn.type = "button";
  calcBtn.className = "btn btn-primary";
  calcBtn.textContent = "Calculate";
  calcBtn.addEventListener("click", onCalculate);

  const resetBtn = document.createElement("button");
  resetBtn.type = "button";
  resetBtn.className = "btn btn-secondary";
  resetBtn.textContent = "Reset";
  resetBtn.addEventListener("click", onReset);

  actions.appendChild(calcBtn);
  actions.appendChild(resetBtn);
  container.appendChild(actions);
}

/**
 * @param {number|null} value
 * @param {(val: number|null) => void} onChange
 */
function createScoreInput(value, onChange) {
  const input = document.createElement("input");
  input.type = "number";
  input.min = "0";
  input.max = "99";
  input.className = "score-input";
  input.placeholder = "–";
  input.setAttribute("aria-label", "Goals");

  if (value !== null && value !== undefined && value !== "") {
    input.value = String(value);
  }

  input.addEventListener("input", () => {
    const raw = input.value.trim();
    if (raw === "") {
      onChange(null);
      return;
    }
    const num = parseInt(raw, 10);
    onChange(Number.isNaN(num) ? null : num);
  });

  return input;
}
