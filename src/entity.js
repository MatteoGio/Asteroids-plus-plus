function Entity(x, y, r){
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.r = r;
    this.rmax = r;
    this.mineCheck = false;
    this.heading = 0;
    this.rotation = 0;
    this.accelMagnitude = 0;
    this.rMin = r;
    this.rMax = r;
}

Entity.prototype.update = function(){
    this.heading += this.rotation;

    // creo il vettore forza dalla direzione
    var force = p5.Vector.fromAngle(this.heading);
    force.mult(this.accelMagnitude);
    
    // sommo forza a velocità e velocità a posizione
    // considerando la massa della navetta e la variazione di tempo unitaria 
    this.vel.add(force);
    this.pos.add(this.vel);
}

Entity.prototype.edges = function(){
    if(this.pos.x > width+this.rmax) this.pos.x = -this.rmax;
    else if(this.pos.x < -this.rmax) this.pos.x = width+this.rmax;

    if(this.pos.y > height+this.rmax) this.pos.y = -this.rmax;
    else if(this.pos.y < -this.rmax) this.pos.y = height+this.rmax;
}