# Dungeon Hop
Dungeon hop is a side-scrolling browser game where players race to the end of a course.

[Live](http://www.ommish.com/dungeon-hop)

## Customizable Game
Using a simple form, users can customize several different aspects of the game:
- number of players
- max jump length
- AI intelligence
- number of obstacle types
- item

## Collision Detection
Each player holds a reference to their course, which keeps track of what space is currently beneath the player.
Landing on a space with an obstacle will cause a collision, causing the player to jump back to where they were before.

## Items
Spaces may also contain items, which each change the state of the player in different ways.

## Global High Scores
Scores are saved globally to a Firebase database.

## Other Features
- Audio- settings for background music are saved locally
- Pause/Restart- game can be paused or restarted
- Stopwatch- time elapsed is rendered at the center of the game canvas

## Future Directions
User authentication with Firebase
Items that affect the opposing player
Improved jump physics
