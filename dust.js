function Dust(pos, vel){
    this.pos = pos.copy();
    this.vel = vel.copy();
    this.vel.add(p5.Vector.random2D().mult(random(0.5, 1.5)));
    this.colors = [];
    this.transparency = random(100, 255);

    this.update = function(){
        this.pos.add(this.vel);
        this.transparency -= 2;
    }

    this.render = function(){
        push();
            if(this.transparency>0){
                stroke(this.transparency);
                strokeWeight(3);
                point(this.pos.x, this.pos.y);
            }
        pop();
    }
}