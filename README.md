# COC Dashboard

A web dashboard for Clash of Clans built on top of [clashofclans.js](https://github.com/clashperk/clashofclans.js).

- **Backend**: Express + TypeScript (wraps `clashofclans.js`)
- **Frontend**: React + Vite

## Features
- Clan overview (members, donations, war stars, last seen)
- Live war tracker (state, stars, member attack map)
- Clan War League group + rounds
- Capital Raid seasons
- Player deep-dive (heroes, troops, spells, achievements)
- Location rankings (clans & players)

## Setup

### 1. Get API credentials
Create a developer account at https://developer.clashofclans.com and note your email/password (or generate an API key — see `clashofclans.js` docs).

### 2. Backend
```bash
cd server
cp .env.example .env      # fill EMAIL + PASSWORD
npm install
npm run dev               # runs on http://localhost:4000
```

### 3. Frontend
```bash
cd web
npm install
npm run dev               # runs on http://localhost:5173 (proxies /api -> 4000)
```

Open http://localhost:5173 and search by clan/player tag (e.g. `#2PP` or full tag).

## Notes
- The Express server caches responses (5 min TTL) to stay within API rate limits.
- Requires Node.js >= 20.
- Tags are case-insensitive; the `#` is optional in the search box.
