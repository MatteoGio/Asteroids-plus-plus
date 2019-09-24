function Asteroid(pos, r, size=2){
    Entity.call(
        this,
        (!pos) ? random(width) : pos.x,
        (!pos) ? random(height) : pos.y,
        (!r) ? random(60, 80) : r/2
    );

    this.size = size;
    this.total = floor(random(7, 11));
    this.vel = p5.Vector.random2D();
    this.vel = (size==0) ? this.vel.mult(4)
                         : (size==1) ? this.vel.mult(2)
                                     : this.vel;
    // this.vel = this.vel.mult(0);
    this.fc = (floor(random(10))%2==0) ? floor(random(10, 100))
                                       : floor(random(-100, -10));
    /*offset dei vertici dell'asteroide*/
    this.offset = [];
    var i = this.total;
    while(i--) this.offset[i] = random(0.5*this.r, this.r);

    this.rMin = min(this.offset);
    this.rMax = max(this.offset);

    this.vertices = [];
    this.soundEffects = {
        asteroid_explosion_0: soundEffects["asteroid_explosion_0"],
        asteroid_explosion_1: soundEffects["asteroid_explosion_1"],
        asteroid_explosion_2: soundEffects["asteroid_explosion_2"],
    };

    this.render = function(){
        push();
            noFill();
            stroke(255);
            strokeWeight(2);

            /* Asteroid */
            beginShape();
                var j=0, fc=frameCount/this.fc;
                for(var i=0; j<this.total && i<TWO_PI; i+=TWO_PI/this.total, j++){
                    this.vertices[j] = createVector(
                        this.pos.x+this.offset[j]*cos(i+fc),
                        this.pos.y+this.offset[j]*sin(i+fc)
                    );
                    vertex(this.vertices[j].x, this.vertices[j].y);
                }
                stroke(255);
                // point(this.pos.x, this.pos.y);
            endShape(CLOSE);
        pop();
    }

    this.breakup = function(){
        if(size==0) return [];
        return [ new Asteroid(this.pos, this.r, this.size-1),
                 new Asteroid(this.pos, this.r, this.size-1) ];
    }

    this.playSoundEffect = function(){
        this.soundEffects["asteroid_explosion_"+this.size].play();
    }
}

Asteroid.prototype = Object.create(Entity.prototype);