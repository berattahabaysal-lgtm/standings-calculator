const https = require('https');

const API_KEY = 'b7f4523a2534c0dd01afd053fd6191e1';

const LEAGUES = [
  { id: 39,  name: 'Premier League', country: 'England', slug: 'premier-league' },
  { id: 140, name: 'La Liga',        country: 'Spain',   slug: 'la-liga'        },
  { id: 78,  name: 'Bundesliga',     country: 'Germany', slug: 'bundesliga'     },
  { id: 135, name: 'Serie A',        country: 'Italy',   slug: 'serie-a'        },
  { id: 61,  name: 'Ligue 1',        country: 'France',  slug: 'ligue-1'        },
  { id: 203, name: 'Süper Lig',      country: 'Turkey',  slug: 'super-lig'      },
];

const SEASON = 2024;

function apiGet(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'v3.football.api-sports.io',
      path,
      method: 'GET',
      headers: { 'x-apisports-key': API_KEY },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function toLeaguesJson(leaguesMeta, fixturesByLeague) {
  const result = [];

  for (const meta of leaguesMeta) {
    const fixtures = fixturesByLeague[meta.id] || [];

    const teamsMap = {};
    for (const f of fixtures) {
      const h = f.teams.home;
      const a = f.teams.away;
      if (!teamsMap[h.id]) teamsMap[h.id] = { id: String(h.id), name: h.name, shortCode: h.name.substring(0,3).toUpperCase(), logo: h.logo };
      if (!teamsMap[a.id]) teamsMap[a.id] = { id: String(a.id), name: a.name, shortCode: a.name.substring(0,3).toUpperCase(), logo: a.logo };
    }

    const weeksMap = {};
    for (const f of fixtures) {
      const round = f.league.round;
      if (!weeksMap[round]) weeksMap[round] = [];
      weeksMap[round].push({
        id: String(f.fixture.id),
        homeTeamId: String(f.teams.home.id),
        awayTeamId: String(f.teams.away.id),
        homeScore: f.goals.home,
        awayScore: f.goals.away,
      });
    }

    const matchweeks = Object.entries(weeksMap).map(([round, fixtureList]) => ({
      matchweek: round,
      fixtures: fixtureList,
    }));

    result.push({
      id: meta.slug,
      name: meta.name,
      country: meta.country,
      teams: Object.values(teamsMap),
      zones: [],
      matchweeks,
    });
  }

  return { leagues: result };
}

module.exports = async (req, res) => {
  const fixturesByLeague = {};

  for (const league of LEAGUES) {
    try {
      const data = await apiGet(`/fixtures?league=${league.id}&season=${SEASON}`);
      fixturesByLeague[league.id] = data.response || [];
      await new Promise(r => setTimeout(r, 1500));
    } catch (err) {
      fixturesByLeague[league.id] = [];
    }
  }

  const leaguesJson = toLeaguesJson(LEAGUES, fixturesByLeague);

  // Veriyi leagues.json formatında döndür
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(leaguesJson);
};
