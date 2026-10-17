# Bulk Season

A short, active incremental game about eating your way to a bigger bench. Raid a food market until your appetite runs out, then burn the calories on the gym's skill tree and go back hungrier.

Play: https://pillowfishsticks.github.io/bulk-season/

## The loop

1. **Run.** Runs are short (25 seconds at most). The market is full of food monsters. Knock them down, then walk over the food they drop to eat it before your *Appetite* runs out. Keep hitting and eating to build a combo.
2. **Throw.** You don't eat enemies, you throw dumbbells at them. Throwing is automatic: the boss first if it's in range, otherwise the nearest food monster or seagull, and nothing when there are no enemies. Grab power-ups for a few seconds of Rapid Fire, Spread Shot, a Dumbbell Ring or Heavy Iron.
3. **Events.** Unlock things that happen on their own: plates crashing down on food, gym buddies who eat for you, and chomps that chain-zap nearby food.
4. **Sections and bosses.** Each market has five sections, and each one should take you two or three runs (Corner Shop: Front Door, The Aisles, Freezer Aisle, Stock Room, The Till). Eat your way past food goblins (they chase you, shoot at you and bump into you) until the boss turns up, then knock it out with dumbbells before your appetite runs out. Hits cost you time. Beat a boss to open the next section; beat the fifth to open the next market.
5. **Gym.** Spend kcal on the skill tree: up for more time, right for damage, left for kcal gains, down for skills and events. Under damage there's a throwing branch too: Throw Power, Quick Release, Long Throw, Fastball, Twin Throw, Straight Through, Heavy Iron, Power-up Drops and Pumped. Getting a node to level 3 opens the next ones. Run your own gym too: equipment brings members, members pay you money even while you're away, and money buys supplements: gym-only perks like a training partner who throws with you, a spotter who takes hits for you, One More Set, a hype man who brings the boss out sooner, and prize money for every boss. More members unlock gym ranks (Bronze to Legend) with permanent perks. Red badges on the tabs show when you can afford something.
6. **New season.** Clear The Buffet and you can start again with medals that boost every kcal for good.

Each market has its own hazards. None of them can kill you, but they knock you about: wet floors, seagulls that nick your dropped food and peck you (shoot them down), chilli spills that flare up, scooters, waiters and Big Dave, who's eating too.

## Controls

| | Keyboard | Xbox controller | Touch |
|---|---|---|---|
| Move | WASD / arrows | Left stick / d-pad | Drag |
| Dash | Space | A | Skill buttons |
| Shield | Q | B | |
| Plate Toss | E | X | |
| Cheat Meal | R | Y | |
| Pause | Esc | Start | II button |
| Fullscreen | F | | |

## Running it

It's one file with no build step. Open `index.html` in any browser, or host the repo with GitHub Pages.

Progress saves by itself in your browser after every run and purchase. To play on another device, open **Save & devices** in the gym, copy the code, and load it on the other device.

Using an Xbox controller? Press any button once so the browser picks it up. Plate Toss aims with the right stick, and LB/RB switch markets in the gym.

## Desktop version (Windows)

The same game also ships as a desktop app built with Electron. It runs fullscreen, uncapped, at 144 FPS on a 144 Hz screen.

- `npm install` once, then `npm start` to play.
- `npm run dist` builds `dist/BulkSeason-<version>-portable.exe` (a single exe, no install) and `dist/BulkSeason-<version>-setup.exe` (an installer).
- On desktop the save is a real file at `%APPDATA%\Bulk Season\save.json`. A `save.backup.json` copy is made every time the game starts.
