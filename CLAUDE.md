# Bulk Season: notes for Claude

The owner (PillowFishSticks) isn't a developer and wants Claude to own the code. Keep it simple and cheap to maintain: no frameworks, no build step, no dependencies.

## What it is
An active incremental web game, in the style of Chef Knight, Loot Frog, Hole Is Mine and Shelldiver. The loop is: short timed run → collect a resource → spend it at a hub on an upgrade tree → go deeper. It's themed on eating food and the gym, and it must play well on a phone (touch drag) and a laptop (WASD/arrows).

## Files
- `index.html` is the whole game: CSS, markup and JS in one file.
- `README.md` is the player-facing description.

## Code map (inside `index.html`'s `<script>`)
- `ZONES` lists the five markets (Corner Shop, The Chippy, Curry House, Street Food, The Buffet). Each has an unlock `cost`, awning colours, floor tiles and foods.
- `F(emoji, name, fill, kcal, {w, bites, flee, spicy, size})` defines a food. `fill` and `kcal` cover the whole item, and multi-bite foods split them per bite. `w` is spawn weight.
- `ROAST` is the boss at The Buffet. It has 300 bites, and the bites left persist in the save as `S.roast`. Finishing it sets `S.won`.
- `GROUPS` and `UPS` hold the upgrades, grouped by bumper-plate colour (25kg red, 20kg blue, 15kg yellow, 10kg green, 5kg white). Each upgrade has `max`, `base` cost, growth `k`, value fn `v(level)` and label fn `f(value)`. Cost is `base * k^level`.
- The save is `localStorage` key `bulkSeason.v1` (`fresh()` lists the fields). Bump the key if the save shape changes incompatibly.
- `startRun` / `update` / `chomp` / `draw` / `endRun` make up the run loop on a canvas. The HUD is HTML overlaid on top.
- `renderGym` draws the hub screen.

## Mechanics
- The run lasts `appetite` seconds. Eating fills the stomach (`stomach` cap), and `digest` empties it each second. When the stomach is full you can't bite.
- One chomp every `chew` seconds takes `jaw` bites. `metab` multiplies kcal. Golden food (`lucky` chance) gives ×5 kcal.
- Spicy food gives a 3s speed boost, and `flee` foods run away from the player.
- kcal is the only currency: it's earned in runs and spent on upgrades and zone unlocks.

## Hosting
- The repo is public, and GitHub Pages serves `main` at `/` (root): https://pillowfishsticks.github.io/bulk-season/
- There's also a private Claude artifact copy (Claude publishes the file minus its first 3 lines and the final `</html>`, because artifacts add their own doctype/head).

## Testing
Run one Playwright smoke test at 390×780: load the file, start a run, sweep with the arrow keys, wait for the results screen, and check for page errors and that `#gym` has no horizontal overflow.

## Open ideas / next steps
- Tune pacing once the owner has played (is the Chippy unlock at 900 kcal too slow or fast?).
- More juice: sound variety, combo multiplier for fast eating, unique boss per zone.
- Quests per zone (eat N of X to unlock recipes/zones), like Chef Knight.
- Cross-device save sync would need accounts. Not planned.
