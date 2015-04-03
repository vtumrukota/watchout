// start slingin' some d3 here.
var gameSettings = {
  enemyCount: 20,
  width: 1500,
  height: 1000
};

var gameBoard = d3.select('body').append('svg');

gameBoard.attr('width', gameSettings.width)
         .attr('height', gameSettings.height);

var x = d3.scale.linear()
          .domain([0, 100])
          .range([0, gameSettings.width]);

var y = d3.scale.linear()
          .domain([0, 100])
          .range([0, gameSettings.height]);

var Enemy = function(){
  this.size = 40;
  this.x = getRandomPosition(this.size);
  this.y = getRandomPosition(this.size);
};

var Player = function(){
  this.size = 100;
  this.x = getRandomPosition(this.size);
  this.y = getRandomPosition(this.size);
};

var getRandomPosition = function(size) {
  return size + (Math.random() * (gameSettings.width - size));
};

var enemies = [];
//Place enemies in the game window
for(var i=0; i < gameSettings.enemyCount; i++){
  enemies.push(new Enemy());
}
gameBoard.selectAll('image').data(enemies).enter()
          .append('image')
          .classed('enemy', true)
          .attr('x', function(d){return d.x;})
          .attr('y', function(d){return d.y;})
          .attr('xlink:href', 'asteroid.png')
          .attr('height', function(d){return d.size;})
          .attr('width', function(d){return d.size;});

var moveEnemies = function() {
  gameBoard.selectAll('image.enemy').transition()
          .ease('linear')
          .duration(1300)
          .attr('x', function(d){return getRandomPosition(d.size)})
          .attr('y', function(d){return getRandomPosition(d.size)});
};

setInterval(moveEnemies, 1300);

var player = new Player();
gameBoard.selectAll('image.player').data([player]).enter()
          .append('image')
          .classed('player', true)
          .attr('x', function(d){return d.x;})
          .attr('y', function(d){return d.y;})
          .attr('xlink:href', 'rocketship.png')
          .attr('height', function(d){return d.size;})
          .attr('width', function(d){return d.size;});
