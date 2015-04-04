// start slingin' some d3 here.
var gameSettings = {
  enemyCount: 10,
  width: 1200,
  height: 800
};

var gameBoard = d3.select('body').append('svg');

gameBoard.attr('width', gameSettings.width)
         .attr('height', gameSettings.height);


var Enemy = function(){
  this.size = 40;
  this.x = getRandomPosition(this.size, gameSettings.width);
  this.y = getRandomPosition(this.size, gameSettings.height);
};

var Player = function(){
  this.size = 120;
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
  var player = d3.selectAll('.player');
  var playerX = player.attr('x');
  var playerY = player.attr('y');
  var playerCX = playerX / 2;
  var playerCY = playerY / 2;
  var enemyCX = enemy.x / 2;
  var enemyCY = enemy.y / 2;

  var sumOfRadii = (enemy.size / 2) + 60 ; //60 refers to radius of player
  var diffX = enemyCX - playerCX;
  var diffY = enemyCY - playerCY;
  var distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));

  if (distance < sumOfRadii) {
    callback();
  }
};

var onCollision = function() {
  gameStats.currScore = 0;
  gameStats.collisions++;
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
                  .attr('x', d3.event.x)
                  .attr('y', d3.event.y);
              });

var player = gameBoard.selectAll('image.player')
              .data([new Player()])
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
var gameStats = {
  currScore: 0,
  highScore: 0,
  collisions: 0
};

//wait until enemies move to start increasing score
setTimeout(function() {
  setInterval(function() {
    gameStats.currScore += 10;
    scoreBoard.select('.current span').text(gameStats.currScore);
    scoreBoard.select('.collisions span').text(gameStats.collisions);
  }, 100);
}, 1500);
