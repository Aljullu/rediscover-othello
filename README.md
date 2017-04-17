Rediscover Othello
==========

Othello/Reversi game written in JavaScript, HTML and CSS. Uses Zepto for DOM manipulation.

## Artificial Intelligence

Includes an already intelligent AI (PlayerLearned.js) and a dumb AI (PlayerLearning.js) that is able to learn based in these situations:

* Current player having more cells of its color.
* Opponent player having more cells of its color.
* Current player having more border cells of its color.
* Opponent player having more border cells of its color.
* Current player having more corner cells of its color.
* Opponent player having more corner cells of its color.

The AI will give a weight of how good or how bad every situation is and, when it learns, it will use these weights to decide how to play. The implementation is very simple but for me it is quite hard to deffeat.

## TODO

### Bugs

* [ ] Choose color is not working

### Roadmap

* [ ] Add more game modes
* [ ] Improve AI
* [ ] Make AI async
* [ ] Beautify code
* [ ] Reset preferences
* [ ] If #columns is very different than #rows, it doesn't look good
* [ ] Bug when changing color of multiple pieces (maybe audio bug?)
* [ ] Make walls
* [ ] Campaign
    * [ ] Allow playing previous levels
    * [ ] Show results from previous levels

### Finished

* [x] Allow odd number of cells
* [x] Allow different number of rows and columns
* [x] 'tableColor' -> 'boardColor'
* [x] Best scores
* [x] Allow starting in a different position
* [x] Load maps from file
* [x] Campaign: Show current #level
