const LEAGUE_IDS = {
    39:  'Premier League',
    140: 'La Liga',
    78:  'Bundesliga',
    135: 'Serie A',
    61:  'Ligue 1',
    203: 'Süper Lig',
  };
  
  async function loadFixtures() {
    try {
      const response = await fetch('data/fixtures.json');
      if (!response.ok) throw new Error('fixtures.json bulunamadı');
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Fikstür yüklenemedi:', err.message);
      return null;
    }
  }
  
  function getMatchweeks(fixtures) {
    const weeks = new Set();
    for (const fixture of fixtures) {
      weeks.add(fixture.fixture.round);
    }
    return [...weeks].sort();
  }
  
  function getFixturesByRound(fixtures, round) {
    return fixtures.filter(f => f.fixture.round === round);
  }
  
  function calculateStandings(fixtures) {
    const teams = {};
  
    for (const fixture of fixtures) {
      const status = fixture.fixture.status.short;
      // Sadece biten maçları hesapla
      if (!['FT', 'AET', 'PEN'].includes(status)) continue;
  
      const homeTeam = fixture.teams.home.name;
      const awayTeam = fixture.teams.away.name;
      const homeGoals = fixture.goals.home;
      const awayGoals = fixture.goals.away;
  
      if (!teams[homeTeam]) teams[homeTeam] = { name: homeTeam, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 };
      if (!teams[awayTeam]) teams[awayTeam] = { name: awayTeam, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 };
  
      teams[homeTeam].played++;
      teams[awayTeam].played++;
      teams[homeTeam].gf += homeGoals;
      teams[homeTeam].ga += awayGoals;
      teams[awayTeam].gf += awayGoals;
      teams[awayTeam].ga += homeGoals;
  
      if (homeGoals > awayGoals) {
        teams[homeTeam].won++;
        teams[homeTeam].points += 3;
        teams[awayTeam].lost++;
      } else if (homeGoals === awayGoals) {
        teams[homeTeam].drawn++;
        teams[homeTeam].points += 1;
        teams[awayTeam].drawn++;
        teams[awayTeam].points += 1;
      } else {
        teams[awayTeam].won++;
        teams[awayTeam].points += 3;
        teams[homeTeam].lost++;
      }
    }
  
    return Object.values(teams).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const gdA = a.gf - a.ga;
      const gdB = b.gf - b.ga;
      if (gdB !== gdA) return gdB - gdA;
      return b.gf - a.gf;
    });
  }
  
  export { loadFixtures, getMatchweeks, getFixturesByRound, calculateStandings, LEAGUE_IDS };