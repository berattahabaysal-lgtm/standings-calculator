/**
 * Pure standings calculation — works for any league.
 * Input: teams array + flat list of fixtures with scores.
 * Output: sorted standings rows with position, stats, and points.
 *
 * A fixture is only counted when BOTH homeScore and awayScore are valid numbers.
 */

/**
 * @typedef {Object} Team
 * @property {string} id
 * @property {string} name
 * @property {string} shortCode
 * @property {string|null} logo
 */

/**
 * @typedef {Object} Fixture
 * @property {string} id
 * @property {string} homeTeamId
 * @property {string} awayTeamId
 * @property {number|null} homeScore
 * @property {number|null} awayScore
 */

/**
 * @typedef {Object} StandingRow
 * @property {string} teamId
 * @property {string} teamName
 * @property {string} shortCode
 * @property {string|null} logo
 * @property {number} played
 * @property {number} won
 * @property {number} drawn
 * @property {number} lost
 * @property {number} goalsFor
 * @property {number} goalsAgainst
 * @property {number} goalDifference
 * @property {number} points
 * @property {number} position
 */

function isPlayedFixture(fixture) {
  const home = fixture.homeScore;
  const away = fixture.awayScore;
  return (
    home !== null &&
    away !== null &&
    home !== "" &&
    away !== "" &&
    !Number.isNaN(Number(home)) &&
    !Number.isNaN(Number(away))
  );
}

function createEmptyRow(team) {
  return {
    teamId: team.id,
    teamName: team.name,
    shortCode: team.shortCode,
    logo: team.logo,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
    position: 0,
  };
}

/**
 * Calculate league standings from teams and fixtures.
 *
 * @param {Team[]} teams
 * @param {Fixture[]} fixtures
 * @returns {StandingRow[]}
 */
export function calculateStandings(teams, fixtures) {
  const rowsById = new Map();

  for (const team of teams) {
    rowsById.set(team.id, createEmptyRow(team));
  }

  for (const fixture of fixtures) {
    if (!isPlayedFixture(fixture)) continue;

    const homeGoals = Number(fixture.homeScore);
    const awayGoals = Number(fixture.awayScore);
    const homeRow = rowsById.get(fixture.homeTeamId);
    const awayRow = rowsById.get(fixture.awayTeamId);

    if (!homeRow || !awayRow) continue;

    homeRow.played += 1;
    awayRow.played += 1;
    homeRow.goalsFor += homeGoals;
    homeRow.goalsAgainst += awayGoals;
    awayRow.goalsFor += awayGoals;
    awayRow.goalsAgainst += homeGoals;

    if (homeGoals > awayGoals) {
      homeRow.won += 1;
      awayRow.lost += 1;
      homeRow.points += 3;
    } else if (homeGoals < awayGoals) {
      awayRow.won += 1;
      homeRow.lost += 1;
      awayRow.points += 3;
    } else {
      homeRow.drawn += 1;
      awayRow.drawn += 1;
      homeRow.points += 1;
      awayRow.points += 1;
    }
  }

  const standings = Array.from(rowsById.values()).map((row) => ({
    ...row,
    goalDifference: row.goalsFor - row.goalsAgainst,
  }));

  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) {
      return b.goalDifference - a.goalDifference;
    }
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.teamName.localeCompare(b.teamName);
  });

  return standings.map((row, index) => ({
    ...row,
    position: index + 1,
  }));
}

/**
 * Flatten all matchweek fixtures from a league object.
 * @param {{ matchweeks: { fixtures: Fixture[] }[] }} league
 * @returns {Fixture[]}
 */
export function getAllFixtures(league) {
  return league.matchweeks.flatMap((mw) => mw.fixtures);
}

/**
 * Deep-clone fixture scores from league data (for Reset).
 * @param {{ matchweeks: { fixtures: Fixture[] }[] }} league
 * @returns {Map<string, { homeScore: number|null, awayScore: number|null }>}
 */
export function cloneOriginalScores(league) {
  const map = new Map();
  for (const mw of league.matchweeks) {
    for (const f of mw.fixtures) {
      map.set(f.id, {
        homeScore: f.homeScore,
        awayScore: f.awayScore,
      });
    }
  }
  return map;
}
