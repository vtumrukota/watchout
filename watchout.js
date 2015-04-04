// start slingin' some d3 here.
var gameSettings = {
  enemyCount: 20,
  width: 1200,
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
  this.x = gameSettings.width / 2 - this.size / 2;
  this.y = gameSettings.height / 2 - this.size / 2;
};

var getRandomPosition = function(size, limit) {
  return Math.random() * (limit - size);
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


//collisionCheck
var collisionCheck = function(enemy, collideCB){
  //iterate through enemy array
  for(var i=0; i < enemies.length; i++){
    var enemyCoords = enemies[i].x
  }
    //grab enemy x,y coords
    //grab player x,y coords
      //if coords intersect player x,y

        //increment collision counter
        //if currScore > HighScore, change them
        //reset currScore to 0
        gameStats.currScore = 0;
}




//ScoreBoard Functionality
var scoreBoard = d3.select('.scoreboard');
var gameStats = {
  currScore: 0,
  highScore: 0,
  collisions: 0
};
//wait until enemies move to start increasing score
setTimeout(function() {
  setInterval(function(){
    gameStats.currScore += 10;
    scoreBoard.select('.current span').text(gameStats.currScore);
  }, 100);},
  1500);








