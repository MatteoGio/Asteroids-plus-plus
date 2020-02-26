function Ship(mines_array=[], pos=createVector(width/2, height/2)){
    Entity.call(this, pos.x, pos.y, 20);

    this.vertices = [];
    this.lasers = [];
    this.mines = mines_array;
    this.brokenParts = [];
    this.isDestroyed = false;
    this.destroyFrames = 600;
    this.mineCounter = 5-mines_array.length;
    this.shields = shieldTime;

    this.soundEffects = soundEffects["ship_explosion"];

    var scope = this;

    this.render = function(){
        if(lives<=0) return;
        if(this.isDestroyed){
            this.brokenParts.forEach((element)=>{
                push();
                    stroke(floor(255*((this.destroyFrames-=2)/600)));
                    strokeWeight(3);
                    strokeCap(SQUARE);
                    translate(element.pos.x, element.pos.y);
                    rotate(element.heading);
                    line(-this.r/2, -this.r/2, this.r/2, this.r/2);
                pop();
            });
        }
        else{
            push();
                translate(this.pos.x, this.pos.y);
                rotate(this.heading);
                var shieldCol = random(map(this.shields, 0, shieldTime, 255, 0), 255);
                // fill(190);
                noFill();
                stroke(shieldCol, shieldCol, 255);
                strokeWeight(3);
                triangle(-2/3*this.r, -this.r, -2/3*this.r, this.r,4/3*this.r, 0);
                // ellipse(0, 0, this.r);
                // point(0, 0);
            pop();
            this.vertices = [
                p5.Vector.add(createVector(-2/3*this.r, this.r).rotate(this.heading), this.pos),
                p5.Vector.add(createVector(-2/3*this.r, -this.r).rotate(this.heading), this.pos),
                p5.Vector.add(createVector(4/3*this.r, 0).rotate(this.heading), this.pos),
                p5.Vector.add(createVector(this.r, 0).rotate(this.heading), this.pos),
                p5.Vector.add(createVector(0, 0.5*this.r).rotate(this.heading), this.pos),
                p5.Vector.add(createVector(0, -0.5*this.r).rotate(this.heading), this.pos),
            ];
        }
    }

    input.registerAsListener(87, function(char, code, press){
        scope.accelMagnitude = press ? 0.1 : 0;
    });
    input.registerAsListener(32, function(char, code, press){
        if(press && canPlay){
            var laser = new Laser(scope.pos, scope.heading);
            laser.soundEffects.play()
            scope.lasers.push(laser);
        }
    });
    input.registerAsListener(77, function(char, code, press){
        if(press && scope.mineCounter>0 && canPlay){
            scope.mineCounter--;
            var mine = new Mine(scope.pos, scope.heading);
            mine.playSoundEffect("grenade_launcher");
            scope.mines.push(mine);
        }
    });

    this.update = function(){
        if(lives<=0) return;
        if(this.isDestroyed){
            this.brokenParts.forEach((element)=>{
                element.pos.add(element.vel);
                element.heading += element.rot;
            });
        }
        else{
            Entity.prototype.update.call(this);
            this.vel.mult(0.99).mult(0.99);
        }
        if(this.shields>0) this.shields -= 1;
    }

    this.hits = function(asteroid){
        if(this.shields>0) return false;
        var dist = p5.Vector.dist(this.pos, asteroid.pos);
        var sumMax = 27+asteroid.rMax;
        var sumMin = this.r+asteroid.rMin;

        if(dist>sumMax) return false;
        if(dist<=sumMin) return true;

        if(asteroid.mineCheck){
            /*controllo che esista un vertice dentro la mina*/
            return this.vertices.some((element)=>{
                dist = p5.Vector.dist(element, asteroid.pos);
                return dist<=asteroid.r;
            });
        }
        else{
            /*controllo che tutti i vertici siano a distanza di sicurezza*/
            if(
                this.vertices.every((element)=>{
                    var dist = p5.Vector.dist(element, asteroid.pos);
                    if(dist>asteroid.rMax) return true;
                })
            ) return false;

            ctx = createCorral(asteroid)
            return this.vertices.some((element)=>{
                return ctx.isPointInPath(element.x, element.y);
            });
        }
    }

    this.destroy = function(){
        this.soundEffects.play();
        this.isDestroyed = true;
        score = score>=100 ? score-100: score;
        var i = 3;
        while(i--){
            this.brokenParts[i] = {
                pos: this.pos.copy(),
                vel: p5.Vector.random2D(),
                heading: random(0, 360),
                rot: random(-0.07, 0.07)
            };
        }
    }
}

Ship.prototype = Object.create(Entity.prototype);