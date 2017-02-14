// Setup initial game stats
var dots = 240;
var score = 0;
var lives = 2;
var pellets = 4;
var level = 1;

// Define your ghosts here

var fruit = {
  name: 'Cherry',
  available: false,
  addScore: 100
};

var inky = {
  menu_option: '1',
  name: 'Inky',
  colour: 'Red',
  character: 'Shadow',
  edible: false
};

var blinky = {
  menu_option: '2',
  name: 'Blnky',
  colour: 'Cyan',
  character: 'Speedy',
  edible: false
};
var pinky = {
  menu_option: '3',
  name: 'Pinky',
  colour: 'Pink',
  character: 'Bashful',
  edible: false
};

var clyde = {
  menu_option: '4',
  name: 'Clyde',
  colour: 'Orange',
  character: 'Pokey',
  edible: false
};

var ghosts = [inky, blinky, pinky, clyde]

// Draw the screen functionality
function drawScreen() {
  clearScreen();
  setTimeout(function() {
    displayStats();
    displayMenu();
    displayPrompt();
  }, 10);
}

function clearScreen() {
  console.log('\x1Bc');
}

function displayStats() {
  console.log('Score: ' + score + '     Lives: ' + lives + '     Pellets: ' + pellets + '      dots: ' + dots + '      level: ' + level);
}

function displayMenu() {
  console.log('\n\nSelect Option:\n');  // each \n creates a new line
  for(var i = 0; i < ghosts.length; i++) {
    if (ghosts[i].edible === true) {
      var edibility = ' (edible)';
    } else {
      var edibility = ' (inedible)';
    }
    console.log('(' + (i + 1) + ') Eat ' + ghosts[i].name + edibility);
  }
  if (dots >= 100) {
    console.log('(a) Eat 100 dots');
  }
  if (dots >= 10) {
    console.log('(b) Eat 10 dots');
  }
  if (dots > 0) {
    console.log('(c) Eat a dot');
  }
  if (pellets > 0) {
    console.log('(p) Eat Pellet');
  } else {
    pellets = 0;
    console.log('No pellets remaining!');
  }
  if (fruit.available) {
    defFruit(level);
    console.log('(f) Eat ' + fruit.name);
  }
  console.log('(q) Quit');
}

function displayPrompt() {
  // process.stdout.write is similar to console.log except it doesn't add a new line after the text
  process.stdout.write('\nWaka Waka :v '); // :v is the Pac-Man emoji.
}


// Menu Options
function eatDot(num) {
  if (dots >= num) {
    dots -= num;
    score += (10 * num);
    console.log('\nChomp!');
    function randNumGen() {
      var randNum = Math.floor((Math.random() * 3) + 1);
      if (randNum === 3) {
        fruit.available = true;
      }
    }
    randNumGen();
  } else if (dots < num){
      console.log('\nNot enough dots remaining!');
  }
  if (dots === 0){
    levelUp();
  }
}

var eatenCount = 0;
var scoreAdd = 200;

function eatGhost(ghost) {
  if (ghost.edible === false) {
    lives -= 1;
    console.log('\n' + ghost.name + " (the " + ghost.colour + " one) ate Pacman." );
    gameOverYet();
  } else {
      console.log('\n' + ghost.name + " (the " + ghost.colour + " one) was eaten by Pacman." );
      eatenCount += 1;
      score += scoreAdd;
      scoreAdd *= 2;
    ghost.edible = false;
    if (scoreAdd > 1600) {
      scoreAdd = 200;
    }
    if (eatenCount === 4) {
      eatenCount = 0;
    }
  }
}

function eatPellet() {
  if (pellets > 0) {
    pellets -= 1;
    score += 50;
    ghosts.forEach(function(ghost){
      ghost.edible = true;
    });
    levelUp();
  }
}

function defFruit(lev) {
  switch(lev) {
    case 2:
      fruit.name = 'Strawberry';
      fruit.addScore = 300;
      break;
    case 3 || 4:
      fruit.name = 'Orange';
      fruit.addScore += 500;
      break;
    case 5 || 6:
      fruit.name = 'Apple';
      fruit.addScore += 700;
      break;
    case 7 || 8:
      fruit.name = 'Pineapple';
      fruit.addScore += 1000;
      break;
    case 9 || 10:
      fruit.name = 'Galaxian Spaceship';
      fruit.addScore += 2000
    case 11 || 12:
      fruit.name = 'Bell';
      fruit.addScore += 3000;
    case lev >= 13:
      fruit.name = 'Key';
      fruit.addScore += 5000;
      break;
  }
}

function gameOverYet() {
  if (lives <= 0) {
    process.exit();
  }
}

function levelUp() {
  if (pellets === 0 && dots === 0) {
    fruit.available = false;
    level += 1;
    dots = 240;
    pellets = 4;
    ghosts.forEach(function(ghost){
      ghost.edible = false;
    });
  }
}


// Process Player's Input
function processInput(key) {
  switch(key) {
    case '\u0003': // This makes it so CTRL-C will quit the program
    case 'q':
      process.exit();
      break;
    case 'a':
      eatDot(100);
      break;
    case 'b':
      eatDot(10);
      break;
    case 'c':
      eatDot(1);
      break;
    case '1':
      eatGhost(ghosts[0]);
      break;
    case '2':
      eatGhost(ghosts[1]);
      break;
    case '3':
      eatGhost(ghosts[2]);
      break;
    case '4':
      eatGhost(ghosts[3]);
      break;
    case 'p':
      eatPellet();
      break;
    case 'f':
      defFruit(level);
      score += fruit.addScore;
      fruit.available = false;
      break;
    default:
      console.log('\nInvalid Command!');
  }
}


//
// YOU PROBABLY DON'T WANT TO CHANGE CODE BELOW THIS LINE
//

// Setup Input and Output to work nicely in our Terminal
var stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

// Draw screen when game first starts
drawScreen();

// Process input and draw screen each time player enters a key
stdin.on('data', function(key) {
  process.stdout.write(key);
  processInput(key);
  setTimeout(drawScreen, 300); // The command prompt will flash a message for 300 milliseoncds before it re-draws the screen. You can adjust the 300 number to increase this.
});

// Player Quits
process.on('exit', function() {
  console.log('\n\nGame Over!\n');
});
