import {
  calculateStandings,
  getAllFixtures,
  cloneOriginalScores,
} from "./calculateStandings.js";
import { mountLeagueSelector } from "./components/LeagueSelector.js";
import { mountFixtureInput } from "./components/FixtureInput.js";
import { renderStandingsTable } from "./components/StandingsTable.js";

let leagues = [];
let activeLeagueId = "";
let scoresMap = new Map();
let originalScoresByLeague = new Map();
let currentMatchweekIndex = 0;

const leagueSelectorEl = document.getElementById("league-selector");
const fixturesEl = document.getElementById("fixtures");
const standingsEl = document.getElementById("standings");

function getActiveLeague() {
  return leagues.find((l) => l.id === activeLeagueId);
}

function buildFixturesFromScores(league) {
  const all = getAllFixtures(league);
  return all.map((f) => {
    const stored = scoresMap.get(f.id);
    return {
      ...f,
      homeScore: stored?.homeScore ?? f.homeScore,
      awayScore: stored?.awayScore ?? f.awayScore,
    };
  });
}

function recalculateAndRender() {
  const league = getActiveLeague();
  if (!league) return;
  const fixtures = buildFixturesFromScores(league);
  const standings = calculateStandings(league.teams, fixtures);
  renderStandingsTable(standingsEl, standings, league.zones);
}

function renderFixtures() {
  const league = getActiveLeague();
  if (!league) return;
  mountFixtureInput(fixturesEl, {
    league,
    currentMatchweekIndex,
    scoresMap,
    onMatchweekChange: (index) => {
      currentMatchweekIndex = index;
      renderFixtures();
    },
    onScoreChange: (fixtureId, field, value) => {
      const current = scoresMap.get(fixtureId) || { homeScore: null, awayScore: null };
      scoresMap.set(fixtureId, { ...current, [field]: value });
    },
    onCalculate: () => recalculateAndRender(),
    onReset: () => {
      const original = originalScoresByLeague.get(activeLeagueId);
      if (original) {
        scoresMap = new Map(
          Array.from(original.entries()).map(([id, scores]) => [id, { ...scores }])
        );
      }
      currentMatchweekIndex = 0;
      renderFixtures();
      recalculateAndRender();
    },
  });
}

function selectLeague(leagueId) {
  activeLeagueId = leagueId;
  const league = getActiveLeague();
  if (!league) return;
  const original = originalScoresByLeague.get(leagueId);
  scoresMap = new Map(
    Array.from(original.entries()).map(([id, scores]) => [id, { ...scores }])
  );
  currentMatchweekIndex = 0;
  mountLeagueSelector(leagueSelectorEl, leagues, leagueId, selectLeague);
  renderFixtures();
  recalculateAndRender();
}

async function init() {
  try {
    // Veriyi doğrudan leagues.json'dan yükle (API sistemi devre dışı)
    const response = await fetch("./data/leagues.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    leagues = data.leagues;

    for (const league of leagues) {
      originalScoresByLeague.set(league.id, cloneOriginalScores(league));
    }

    if (leagues.length === 0) {
      document.body.innerHTML = "<p class='error'>No leagues found.</p>";
      return;
    }

    selectLeague(leagues[0].id);
  } catch (err) {
    console.error(err);
    document.getElementById("app-error").hidden = false;
    document.getElementById("app-error").textContent =
      "Could not load league data.";
  }
}

init();
