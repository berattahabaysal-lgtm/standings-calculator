const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'b7f4523a2534c0dd01afd053fd6191e1';

const LEAGUES = [
  { id: 39,  name: 'Premier League', country: 'England' },
  { id: 140, name: 'La Liga',        country: 'Spain'   },
  { id: 78,  name: 'Bundesliga',     country: 'Germany' },
  { id: 135, name: 'Serie A',        country: 'Italy'   },
  { id: 61,  name: 'Ligue 1',        country: 'France'  },
  { id: 203, name: 'Süper Lig',      country: 'Turkey'  },
];

const SEASON = 2024;

function fetchFixtures(leagueId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'v3.football.api-sports.io',
      path: `/fixtures?league=${leagueId}&season=${SEASON}`,
      method: 'GET',
      headers: {
        'x-apisports-key': API_KEY,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function main() {
  const allFixtures = {};

  for (const league of LEAGUES) {
    console.log(`Çekiliyor: ${league.name}...`);
    try {
      const data = await