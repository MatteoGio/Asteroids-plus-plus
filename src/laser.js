function Laser(spos, angle){
    Entity.call(this, spos.x+27*cos(angle), spos.y+27*sin(angle), 3);

    this.vel = p5.Vector.fromAngle(angle);
    this.vel.mult(10);

    this.head = createVector(10*cos(angle), 10*sin(angle));
    this.tail = createVector(0, 0);

    this.soundEffects = soundEffects["laser"];

    this.render = function(){
        if(lives<=0) return;
        push();
            translate(this.pos.x, this.pos.y);
            stroke("blue");
            strokeWeight(this.r);
            line(this.tail.x, this.tail.y, this.head.x, this.head.y);
            // stroke("red");
            // point(this.head.x, this.head.y);
        pop();
    }

    this.offscreen = function(){
        if(this.pos.x>width || this.pos.x<0) return true;
        if(this.pos.y>height || this.pos.y<0) return true;
        return false;
    }

    this.playSoundEffect = function(sound){
        sound.play();
    }

    this.hits = function(asteroid){
        var dist = p5.Vector.dist(this.pos, asteroid.pos);
        
        if(asteroid.mineCheck) return dist<=asteroid.r;
        if(dist>asteroid.rMax) return false;
        if(dist<=asteroid.rMin) return true;

        ctx = createCorral(asteroid);
        return (ctx.isPointInPath(this.head.x, this.head.y) ||
                ctx.isPointInPath(this.pos.x, this.pos.y) ||
                ctx.isPointInPath(this.tail.x, this.tail.y));
    }
}

Laser.prototype = Object.create(Entity.prototype);
