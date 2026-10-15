---
name: nfl-edge
description: Run the NFL Edge betting-analysis engine on a game. Use when the user names an NFL game to analyze ("analyze Cowboys at Eagles", "/nfl-edge DAL @ PHI", "what are the best bets for KC vs BUF"), gives sportsbook prop lines to price, or asks how the engine has performed.
---

# NFL Edge

The engine lives in `nfl-edge/` (read its README.md for the full method). It reads the
local nfl-mcp DuckDB directly (read-only), so the MCP server does not need to be running.

## Run a game

```
cd nfl-edge
.venv/Scripts/python.exe analyze.py "<AWAY> @ <HOME>" [options]
```

- Game text accepts abbreviations, nicknames or full names ("DAL @ PHI", "Cowboys at Eagles", "PHI").
  A single team picks its next unplayed game. `--season/--week` replays a past game and grades it.
- Prices exact lines with `--prop "Player|market|line|over_odds|under_odds"` (repeatable) or
  `--lines file.json` (template: `nfl-edge/lines/example.json`). Markets: rec_yds, receptions,
  rush_yds, rush_rec_yds, pass_yds, pass_td, completions, ints, anytime_td.
- `--spread -3.5` / `--total 47.5` override the stored market numbers (home-team spread).
- `--out "Name"` / `--active "Name"` override availability when news is newer than the data.

## Before running

1. If the game is in the current season, refresh data first so last week's games and the newest
   injury report are in: `nfl-mcp update` (exe in Python313\Scripts). Stop the MCP server first
   if it is running (DuckDB allows only one writer).
2. Ask the user for the sportsbook lines they are considering if they haven't given any. Without
   lines the report still gives fair lines and "bet-if" thresholds.

## Reporting back

The report is printed and saved to `nfl-edge/reports/<game_id>.md`. Relay:
- graded bets (A/B/C) with win probability, EV and stake; say plainly when everything is a PASS
- availability flags (players who missed recent games without a designation)
- the matchup reasoning for the headline props (target share, volume, defense-vs-position, CBs)
- any patterns that survived the false-discovery test (usually none, which is expected)

Never present outputs as certain; these are probabilities for entertainment.
