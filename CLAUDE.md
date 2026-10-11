# Bulk Season: notes for Claude

The owner (PillowFishSticks) isn't a developer and wants Claude to own the code. Keep it simple and cheap to maintain: no frameworks, no build step, no dependencies.

## What it is
An active incremental web game modelled on **Chef Knight** (Steam). The loop is: short timed run → collect a resource → spend it at a hub on a skill tree → go deeper. It's themed on eating food and the gym. It is **desktop-first** (landscape, fullscreen, keyboard or Xbox controller), and it still works on a phone with touch drag.

## Look and feel (match Chef Knight)
- Hand-drawn cartoon style: thick dark outlines (`OUT` #2a1a12), a dark brick and stone dungeon, warm lamp glow and a vignette.
- UI is wooden plaques and parchment panels. Fonts are Alegreya (display) and Alegreya Sans (UI).
- Foods are emoji turned into outlined "stickers" by `sprite()`, with googly eyes that track the player. Runners get little legs. Hits flash white and squash.
- The lifter is drawn procedurally in `drawLifter()`: chibi build, walk cycle, a belly that grows with stomach fill, a chomping mouth and dizzy eyes.

## Files
- `index.html` is the whole game: CSS, markup and JS in one file.
- `README.md` is the player-facing description.

## Code map (inside `<script>`)
- `ZONES`: five markets. Each has a `cost`, `at` (foods eaten in a run before its boss appears), a theme `th`, `foods`, a `boss` and hazards `hz`. It also has `tasks`, which are done in order and pay a flat kcal reward.
- `F(emoji, name, fill, kcal, {w, bites, flee, spicy, size})` defines a food. `fill` and `kcal` cover the whole item.
- Sections and bosses: each market has 3 `secs` (own floor and wall drawing, food ×`SECK`, more hazards), and each section has one boss. Beat a section's boss to unlock the next section (`S.sec[zone]`, `S.cleared["zone:i"]`); beating the third clears the market (`S.beaten`, a trophy) and unlocks the next market for free. Markets have no kcal cost: kcal only buys upgrades, and boss HP is the gate. Boss HP/reward come from the market's `bb` (×`BHP`/`BREW` per section). HP left is saved per section in `S.bhp["zone:i"]`, and a damaged boss waits at the start of the next run. Cleared sections give encore bosses. Bosses never fill your stomach.
- Boss attacks (`atk` on each boss, run by `bossAttacks()`): spread, ring, spin (spiral), slam (telegraphed circle) and charge (telegraphed line). Hits cost appetite time (shot 0.75s, slam/charge 1.5s), and Dash makes you immune.
- Stomach is soft: you can always eat. Past full you're "overstuffed" (up to 150%), and chewing and walking slow steeply (`R.full`).
- Foods get chewier per market (`CHEWY`: more bites with the same kcal and fill per bite), so Jaw strength keeps mattering.
- Your Gym (hub tab, `TAB`): `EQUIP` levels (`S.g`) give members (`members()`, boosted by `fame()` = trophies + bench), and members pay £ per second (`income()`) into `S.cash`. That money buys `EQUIP` and `SUPPS` (`S.sp`: shake +kcal, pre-workout +time, creatine +boss damage, trainer +speed, tea +digestion, socks +gold). Money accrues all the time, at full rate while the tab is hidden and at half rate offline (up to 8h, `catchUp`). `drawGym()` draws the gym scene with equipment slots and wandering members. A new season keeps the gym and cash but resets supplements.
- Hazards ramp up per section: `R.stage` (0–2) adds seagulls, fires, puddles and waiters, and `R.hzF` speeds up spawns.
- `NODES` is the skill tree: `p` (parent), `x`/`y` on a 100×64 grid, `max`, `base`, `k`, `v(level)` and `f(value)`. Cost is `base * k^level`. `skill:1` marks the four active skills (`SKILLS`: Dash, Big Inhale, Plate Toss, Cheat Meal).
- Each market's room is drawn in `buildRoom()` from `FLOORS[id]` and `WALLS[id]` (shop shelves and fridges, chippy tiles, menus and hot counter, curry arches and carpet, street night market, buffet table and chandeliers). Light fittings are drawn every frame in `drawLights()`. kcal scales with the market, so earlier markets pay less.
- Hazards are updated in `hazards()`: puddles/grease (slide or slow), fire spills, seagulls (steal food; run into them to shoo), scooters (warning lane, then a knock), waiters (bump them to drop food) and Big Dave (a rival eater). A knock means stun plus lost time, never death.
- The save is `localStorage` key `bulkSeason.v2` (`fresh()` lists the fields). Bump the key if the save shape changes incompatibly. "Save & devices" exports the whole save as a `BULK1:` + base64 code (copy or download) and imports one. This is how the owner moves between laptop and phone; there are no accounts.
- Audio: `audio()` makes the context on the first click or key press. `SFX` respects `S.muted`, and the music respects `S.music` independently. Music is a tiny step sequencer (`SONGS.hub` / `SONGS.run`, 64 sixteenth-note steps of MIDI notes) scheduled by `musicTick`, with `setSong()` switching tracks per screen.
- A "How to play" modal opens on the first visit (`S.runs===0`).
- `startRun` / `update` / `chomp` / `eaten` / `draw` / `endRun` make up the run. A single `frame()` loop also polls the gamepad and animates the hub.
- Screens: a "Press any key/button" title (`#title`, `leaveTitle()`; a key or click also requests fullscreen), then the gym hub, the run, and modals. On landscape screens, `fitScreen()` adds `body.staged`: the hub is laid out at a fixed 1600×900 `#stage` and scaled with `--k` to fit (no scrolling, like a console game). The run HUD scales with `--hk`, and modal cards with `--mk`, so it all reads well on a TV. Portrait phones fall back to the scrolling layout. Scrollbars, text selection and the context menu are disabled. The cursor hides when a pad is in use or the mouse is idle during a run.
- The hub's tree and market list are built once. `renderGym()` only updates classes and text, so controller focus survives purchases.
- Prestige: once The Buffet is beaten, "New season" resets the season and grants medals (+15% kcal each, `medalsFor`). Boss HP scales ×1.6 per season.

## Controls
- Keyboard: WASD or arrows to move, Space/Shift Dash, Q Inhale, E Plate Toss, R Cheat Meal, Esc/P pause, F fullscreen. Arrows and Enter navigate menus.
- Xbox pad: left stick or d-pad to move, A/RB Dash, B/LB Inhale, X Toss (aim with the right stick), Y Cheat, Start to pause. Rumble (`rumble()`) fires on knocks, golden food and bosses. In menus, d-pad/stick do spatial navigation (`navMove`), A presses, B backs out, LB/RB switch market, and Start begins a run. A toast confirms when a controller connects. Browsers only expose a pad after one button press, and a pad press doesn't count as a user gesture for fullscreen, so use F or a click for that.
- On keyboard, Plate Toss aims at the mouse cursor if the mouse has moved recently. Otherwise it throws the way you're facing. Glyph hints switch with the last input device (`body.pad` / `body.touch`).

## Balance
Open `index.html#debug` and run `BS.sim(900)` in the console. A bot plays full seasons headlessly and buys the cheapest upgrade each time, then returns milestones (run number and minutes at each market open and boss kill). Tuning targets as of 2026-10-11: the bot finishes season 1 in about 35 minutes (sections ~2 runs each), so a person should take an hour or more. The sim also earns and spends gym money. `BS.sim(900,{season:2,medals:5})` checks later seasons: about 20 bot minutes each, earning 5–6 medals.

## Hosting
- The repo is public, and GitHub Pages serves `main` at `/` (root): https://pillowfishsticks.github.io/bulk-season/
- There's also a private Claude artifact copy (Claude publishes the file minus its first 3 lines and the final `</html>`, because artifacts add their own doctype/head).

## Testing
Do a quick Playwright check, not a test suite. Load the page at 1920×1080 (the owner plays fullscreen on a TV), 1366×768 and 390×844, press a key past the title, start a run, sweep with the arrow keys, wait for the results screen, and check for page errors and no horizontal overflow on `#gym`. For the controller, stub `navigator.getGamepads` with a fake pad and step through the menus.

## Open ideas / next steps
- Get the owner's feedback after a real playthrough and retune.
- Cooking/recipes like Chef Knight (combine eaten foods into dishes for bonuses).
- More bosses per market, or "floors" within a market.
- Cross-device save sync would need accounts. Not planned.
