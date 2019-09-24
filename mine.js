function Mine(spos, angle){
    Entity.call(this, spos.x, spos.y, 12);

    this.rotation -= 0.05;
    this.vel = p5.Vector.fromAngle(angle);
    this.vel.mult(-5);
    this.fc = (floor(random(10))%2==0) ? 20 : -20;
    this.mineCheck = true;
    this.isDestroyed = 0;

    this.vertices = [];
    this.soundEffects = {
        grenade_launcher: soundEffects["grenade_launcher"],
        grenade_explosion: soundEffects["grenade_explosion"],
        grenade_prime: soundEffects["grenade_prime"],
    };

    this.render = function(){
        var fc = this.isDestroyed==0 ? frameCount/this.fc : 2*(frameCount/this.fc);
        push();
            if(this.r===12) stroke("blue");
            if(this.vel.mag()<=3) stroke("green");
            if(this.vel.mag()<=1) stroke("red");            
            // fill(190);
            noFill();
            // ellipse(this.pos.x, this.pos.y, 150);
            // point(this.pos.x, this.pos.y);
            strokeWeight(3);

            /* Mine */
            beginShape();
                var j=0;
                for(var i=0; j<9 && i<TWO_PI; i+=TWO_PI/9, j++){
                    this.vertices[j] = createVector(
                        this.pos.x+this.r*cos(i+fc),
                        this.pos.y+this.r*sin(i+fc)
                    );
                    vertex(this.vertices[j].x, this.vertices[j].y);
                }
            endShape(CLOSE);
        pop();
    }

    this.update = function(){
        if(this.isDestroyed==1){
            this.r += 1;
            this.rMax = this.r;
            return;
        }
        Entity.prototype.update.call(this);
        this.rMin = this.rMax = this.r;
        this.vel.mult(0.99).mult(0.99);
        this.r = (this.vel.mag()<=3 && this.r<24) ? this.r=24 : this.r;
    }

    this.hits = function(asteroid){
        var dist = p5.Vector.dist(this.pos, asteroid.pos);
        if(dist>this.r+asteroid.rMax) return false;
        if(dist<=this.r+asteroid.rMin) return true;
        
        ctx = createCorral(asteroid);
        return this.vertices.some((element)=>{
            return ctx.isPointInPath(element.x, element.y);
        });
    }

    this.playSoundEffect = function(sound){
        this.soundEffects[sound].play();
    }
}

Mine.prototype = Object.create(Entity.prototype);