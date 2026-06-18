# League Standings Calculator

A minimal “what-if” league table calculator. Enter match scores, click **Calculate**, and see updated standings with qualification zone colors.

Built with plain HTML, CSS, and vanilla JavaScript (ES modules). No build step or npm required.

## Quick start

The app loads `data/leagues.json` via `fetch`, so you need a local web server (opening `index.html` directly will not work).

```bash
cd league-standings-calculator
python -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080)

## Project structure

```
league-standings-calculator/
├── index.html              # Main page
├── css/styles.css          # Theme and layout
├── data/
│   └── leagues.json        # ← Add new leagues here (no code changes)
├── js/
│   ├── app.js              # Wires components together
│   ├── calculateStandings.js # Pure calculation logic (reusable/testable)
│   ├── standingsColumns.js # ← Edit column config here
│   └── components/
│       ├── LeagueSelector.js
│       ├── FixtureInput.js
│       └── StandingsTable.js
└── README.md
```

## Adding a new league

Edit `data/leagues.json` and add a new object to the `leagues` array:

```json
{
  "id": "my-league",
  "name": "My League",
  "country": "Country",
  "teams": [
    { "id": "team-a", "name": "Team A", "shortCode": "TMA", "logo": null }
  ],
  "zones": [
    { "id": "top", "label": "Promotion", "from": 1, "to": 2, "color": "#1a3a5c" }
  ],
  "matchweeks": [
    {
      "matchweek": 1,
      "fixtures": [
        {
          "id": "unique-fixture-id",
          "homeTeamId": "team-a",
          "awayTeamId": "team-b",
          "homeScore": null,
          "awayScore": null
        }
      ]
    }
  ]
}
```

- `homeScore` / `awayScore`: use `null` for unplayed matches, or a number for played matches.
- `zones`: define position ranges and highlight colors per league (any number of zones).

## Adding a standings column

Edit `js/standingsColumns.js` — add an entry to `STANDINGS_COLUMNS`:

```js
{
  key: "form",
  label: "Form",
  align: "center",
  render: (row) => row.form ?? "—",
},
```

If the value is a direct field on the standing row, use `key` without `render`.

## Calculation rules

`calculateStandings(teams, fixtures)` in `js/calculateStandings.js`:

- Counts only fixtures where **both** scores are valid numbers.
- Points: win = 3, draw = 1, loss = 0.
- Sorting: points → goal difference → goals for → team name.

Import and test in Node or the browser console:

```js
import { calculateStandings } from "./js/calculateStandings.js";
```

## Sample data

Two leagues are included:

1. **Premier League** (England) — 4 teams, 3 matchweeks
2. **Süper Lig** (Turkey) — 4 teams, 3 matchweeks

Some matches are pre-scored; others are blank for you to fill in.
