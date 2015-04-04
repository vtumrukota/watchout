var gameSettings = {
  enemyCount: 20,
  width: 900,
  height: 750
};

var gameStats = {
  currScore: 0,
  highScore: 0,
  collisions: 0
};

var gameBoard = d3.select('body').append('svg');

gameBoard.attr('width', gameSettings.width)
         .attr('height', gameSettings.height);

var Enemy = function(){
  this.size = 40;
  this.x = getRandomPosition(this.size, gameSettings.width);
  this.y = getRandomPosition(this.size, gameSettings.height);
  this.collision = false;
};

var Player = function(){
  this.size = 100;
  this.x = gameSettings.width / 2 - this.size / 2;
  this.y = gameSettings.height / 2 - this.size / 2;
};

var getRandomPosition = function(size, limit) {
  return Math.random() * (limit - size);
};

var enemies = [];
//Place enemies in the game window
for (var i = 0; i < gameSettings.enemyCount; i++) {
  enemies.push(new Enemy());
}

gameBoard.selectAll('image')
  .data(enemies)
  .enter()
  .append('image')
  .classed('enemy', true)
  .attr('x', function(d){ return d.x; })
  .attr('y', function(d){ return d.y; })
  .attr('xlink:href', 'asteroid.png')
  .attr('height', function(d){ return d.size; })
  .attr('width', function(d){ return d.size; });

var moveEnemies = function() {
  gameBoard.selectAll('image.enemy')
    .data(enemies)
    .transition()
      .duration(1500)
      .tween('moveEnemy', function(d) {
        var startX = d.x;
        var startY = d.y;
        var endX = getRandomPosition(d.size, gameSettings.width);
        var endY = getRandomPosition(d.size, gameSettings.height);
        var enemy = d3.select(this);
        return function(t) {
          checkCollision(d, onCollision);
          d.x = startX + (endX - startX)*t;
          d.y = startY + (endY - startY)*t;
          enemy.attr('x', d.x).attr('y', d.y);
        };
      });
};

var checkCollision = function(enemy, callback) {
  var playerX = player.x;
  var playerY = player.y;
  var playerCX = playerX / 2;
  var playerCY = playerY / 2;
  var enemyCX = enemy.x / 2;
  var enemyCY = enemy.y / 2;

  var sumOfRadii = (enemy.size / 2) + player.size / 2;
  var diffX = enemyCX - playerCX;
  var diffY = enemyCY - playerCY;
  var distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));

  if (distance < sumOfRadii) {
    enemy.collision = true;
    callback();
  } else {
    if (enemy.collision) {
      gameStats.collisions++;
      enemy.collision = false;
      d3.select('body').classed('collide', false);
    }
  }
};

var onCollision = function() {
  d3.select('body').classed('collide', true);
  gameStats.currScore = 0;
  scoreBoard.select('.current span').text(gameStats.currScore);

};

setInterval(moveEnemies, 1500);

var drag = d3.behavior.drag()
              .origin(function() {
                return {
                  x: d3.select(this).attr('x'),
                  y: d3.select(this).attr('y')
                };
              })
              .on('drag', function(){
                d3.select(this)
                  .attr('x', function(d) {
                    if (d3.event.x > gameSettings.width - d.size) {
                      d.x = gameSettings.width - d.size;
                    } else if (d3.event.x < 0) {
                      d.x = 0;
                    } else {
                      d.x = d3.event.x;
                    }

                    return d.x;
                  })
                  .attr('y', function(d) {
                    if (d3.event.y > gameSettings.height - d.size) {
                      d.y = gameSettings.height - d.size;
                    } else if (d3.event.y < 0) {
                      d.y = 0;
                    } else {
                      d.y = d3.event.y;
                    }

                    return d.y;
                  });
              });

var player = new Player();
gameBoard.selectAll('image.player')
  .data([player])
  .enter()
  .append('image')
  .classed('player', true)
  .attr('x', function(d){ return d.x; })
  .attr('y', function(d){ return d.y; })
  .attr('xlink:href', 'rocketship.png')
  .attr('height', function(d){ return d.size; })
  .attr('width', function(d){ return d.size; })
  .call(drag);


//ScoreBoard Functionality
var scoreBoard = d3.select('.scoreboard');

//wait until enemies move to start increasing score
setTimeout(function() {
  setInterval(function() {
    gameStats.currScore += 10;
    if (gameStats.currScore > gameStats.highScore) {
      gameStats.highScore = gameStats.currScore;
    }
    scoreBoard.select('.high span').text(gameStats.highScore);
    scoreBoard.select('.current span').text(gameStats.currScore);
    scoreBoard.select('.collisions span').text(gameStats.collisions);
  }, 100);
}, 1500);
