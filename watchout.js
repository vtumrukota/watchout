// start slingin' some d3 here.
var gameSettings = {
  enemyCount: 20,
  width: 1000,
  height: 800
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
  this.x = getRandomPosition(this.size, gameSettings.width);
  this.y = getRandomPosition(this.size, gameSettings.height);
};

var Player = function(){
  this.size = 120;
  this.x = getRandomPosition(this.size, gameSettings.width);
  this.y = getRandomPosition(this.size, gameSettings.height);
};

var getRandomPosition = function(size, limit) {
  return size + (Math.random() * (limit - size));
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
          .duration(1500)
          .attr('x', function(d){return getRandomPosition(d.size, gameSettings.width);})
          .attr('y', function(d){return getRandomPosition(d.size, gameSettings.height);});
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
                d3.select(this).attr('x', d3.event.x)
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
