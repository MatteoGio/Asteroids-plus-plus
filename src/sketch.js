var world;
var input;
var hud;
var soundEffects = {};
var shieldTime = 180;
var score = 0;
var lives = 3;
var points = [100, 50, 25];
var canPlay = true;
var minePrime = 0;

function preload(){
    soundEffects["laser"] = loadSound('audio/fire.wav');
    soundEffects["ship_explosion"] = loadSound('audio/ship_explosion.mp3');    

    soundEffects["asteroid_explosion_0"] = loadSound('audio/asteroid-0_explosion.mp3');
    soundEffects["asteroid_explosion_1"] = loadSound('audio/asteroid-1_explosion.mp3');
    soundEffects["asteroid_explosion_2"] = loadSound('audio/asteroid-2_explosion.mp3');

    soundEffects["grenade_launcher"] = loadSound('audio/grenade_launcher.mp3');
    soundEffects["grenade_explosion"] = loadSound('audio/grenade_explosion.mp3');
    soundEffects["grenade_prime"] = loadSound('audio/grenade_safety.mp3');  
}

function setup(){
    createCanvas(windowWidth, windowHeight);
    hud = new Hud();
    input = new Input();
    world = new World();
}

function draw(){
    world.update();
    world.render();
    hud.render();
}

function newGame(world){
    canPlay = false;
    world.ship.destroy();
    input.reset();
    setTimeout(
        ()=>{
            if(lives-->0){
                world.ship = new Ship(world.ship.mines);
                canPlay = true;
            }
        },
        3000
    );
}

function newLevel(world){
    input.reset();
    world.level++;
    world.ship = new Ship(world.ship.mines, world.ship.pos);
    world.asteroids = spawnAsteroids(++world.n_ast);
}

function explosion(mine){
    mine.playSoundEffect("grenade_explosion");

    /*onda d'urto sulla navetta*/
    var dist = p5.Vector.dist(mine.pos, world.ship.pos);
    if(!world.ship.isDestroyed && dist<=150) newGame(world);

    /*onda d'urto sugli asteroidi*/
    for(var i=world.asteroids.length-1; i>=0; i--){
        var dist = p5.Vector.dist(mine.pos, world.asteroids[i].pos);
        if(dist<=150){
            score += points[world.asteroids[i].size];
            var dustVel = world.asteroids[i].vel.mult(2);
            var dustNum = (world.asteroids[i].size+1)*10;
            world.dust = new Array(dustNum).fill(new Asteroid(world.asteroids[i].pos, dustVel));

            world.asteroids = world.asteroids.concat(world.asteroids[i].breakup());
            world.asteroids.splice(i, 1);
        }
    }

    /*onda d'urto sulle altre mine*/
    world.ship.mines.forEach((element, index)=>{
        if(mine===element) return;
        var dist = p5.Vector.dist(mine.pos, element.pos);
        if(dist<=150){
            var mine_i = element;
            world.ship.mines.splice(index, 1);
            explosion(mine_i);

            if(element.isDestroyed==0) return;
            if(--minePrime==0) element.soundEffects["grenade_prime"].stop();

            // if(--minePrime==0 && element.soundEffects["grenade_prime"].isPlaying())
            //     element.soundEffects["grenade_prime"].stop();
        }
    });
}

function createCorral(asteroid){
    var canvas = document.getElementById("defaultCanvas0");
    var ctx = canvas.getContext("2d");

    ctx.beginPath();
        if(asteroid.vertices[0]!==undefined){
            var v0 = asteroid.vertices[0];
            ctx.moveTo(v0.x, v0.y);
            asteroid.vertices.forEach((element)=>{
                ctx.lineTo(element.x,element.y);
            });
            ctx.lineTo(v0.x, v0.y);
        }
    ctx.closePath();
    return ctx;
}

function addDust(pos, vel, n){
    var i=n, a=[];
    while(i--)
        a.push(new Dust(pos, vel));
    return a;
}

function spawnAsteroids(n){
    var a = [];
    for(var i=0; i<n; i++)
        a.push(new Asteroid());
    return a;
}