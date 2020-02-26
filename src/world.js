function World(n_ast=1, mines_array=[], pos=createVector(width/2, height/2)){
    this.level = 1;
    this.ship = new Ship(mines_array, pos);
    this.asteroids = spawnAsteroids(n_ast);
    this.n_ast = n_ast;
    this.dust = [];

    this.update = function(){
        if(minePrime==0 && soundEffects["grenade_prime"].isPlaying())
            soundEffects["grenade_prime"].stop();

        /*aggiorno gli asteroidi e controllo le collisioni navetta-asteroidi*/
        this.asteroids.forEach((element)=>{
            if(canPlay && this.ship.hits(element)) newGame(this);
            element.update();
        });

        /*aggiorno le mine*/
        this.ship.mines.forEach((element, index)=>{
            element.update();
            element.edges();

            /*controllo le collisioni con gli asteroidi*/
            for(var j=this.asteroids.length-1; j>=0; j--){
                if(element.hits(this.asteroids[j])){

                    score += points[this.asteroids[j].size];

                    var dustVel = this.asteroids[j].vel.mult(2);
                    var dustNum = (this.asteroids[j].size+1)*10;
                    // this.dust = new Array(dustNum).fill(new Asteroid(this.asteroids[j].pos, dustVel));

                    this.dust = addDust(this.asteroids[j].pos, dustVel, dustNum);
                    var ast = this.asteroids[j];
                    this.asteroids.splice(j, 1);

                    explosion(element);
                    this.ship.mines.splice(index, 1);
                    this.asteroids = this.asteroids.concat(ast.breakup());

                    // if(--minePrime==0 && element.soundEffects["grenade_prime"].isPlaying())
                    //     element.soundEffects["grenade_prime"].stop();

                    if(this.asteroids.length==0){
                        newLevel(this);
                        // world = new World(n_ast+1, this.ship.mines, this.ship.pos);
                    }
                    if(element.isDestroyed==0) break;
                    if(--minePrime==0) element.soundEffects["grenade_prime"].stop();
                    break;
                }
            }
            /*controllo le collisioni con la navetta*/
            if(canPlay && element.vel.mag()<=1 && this.ship.hits(element)){
                // if(--minePrime==0 && element.soundEffects["grenade_prime"].isPlaying())
                //     element.soundEffects["grenade_prime"].stop();
                newGame(this);
                explosion(element);
                this.ship.mines.splice(index, 1);
                if(element.isDestroyed==0) return;
                if(--minePrime==0) element.soundEffects["grenade_prime"].stop();
            }
        });

        /*aggiorno i laser*/
        this.ship.lasers.forEach((element, index)=>{
            element.update();
            if(element.offscreen()){
                this.ship.lasers.splice(index, 1);
                return;
            }
            /*controllo le collisioni laser-asteroidi*/
            for(var j=this.asteroids.length-1; j>=0; j--)
                if(element.hits(this.asteroids[j])){
                    this.asteroids[j].playSoundEffect();
                    score += points[this.asteroids[j].size];

                    var dustVel = p5.Vector.add(element.vel.mult(0.2), this.asteroids[j].vel);
                    var dustNum = (this.asteroids[j].size+1)*10;
                    // this.dust = new Array(dustNum).fill(new Asteroid(this.asteroids[j].pos, dustVel));

                    this.dust = addDust(this.asteroids[j].pos, dustVel, dustNum);
                    this.asteroids = this.asteroids.concat(this.asteroids[j].breakup());
                    this.asteroids.splice(j, 1);
                    this.ship.lasers.splice(index, 1);

                    if(this.asteroids.length == 0){
                        // if(soundEffects["grenade_prime"].isPlaying())
                        //     soundEffects["grenade_prime"].stop();
                        newLevel(this);
                        // world = new World(n_ast+1, this.ship.mines, this.ship.pos);
                    }
                    break;
                }
            
            /*controllo le collisioni laser-mine*/
            this.ship.mines.forEach((mineElement, mineIndex)=>{
                if(mineElement.isDestroyed==0 && element.hits(mineElement)){
                    // if(minePrime++==0)
                    if(!mineElement.soundEffects["grenade_prime"].isPlaying())
                        mineElement.soundEffects["grenade_prime"].loop();
                    minePrime++;
                    mineElement.isDestroyed = 1;
                    this.ship.lasers.splice(index, 1);
                    setTimeout(()=>{mineElement.isDestroyed=2;}, 2000);
                }
            });
        });

        /*aggiorno la navetta*/
        this.ship.update();

        /*aggiorno la polvere*/
        this.dust.forEach((element, index)=>{
            element.update();
            if(element.transparency<=0)
                this.dust.splice(index, 1);
        });
    }

    this.render = function(){
        background(0);

        /*disegno le mine*/
        this.ship.mines.forEach((element)=>{
            element.render();
        });

        /*disegno la navetta*/
        this.ship.render();
        this.ship.edges();
        
        /*disegno gli asteroidi*/
        this.asteroids.forEach((element)=>{
            element.render();
            element.edges();
        });
        
        /*disegno i laser*/
        this.ship.lasers.forEach((element)=>{
            element.render();
        });

        /*disegno la polvere*/
        this.dust.forEach((element)=>{
            element.render();
        });

        if(keyIsDown(65)) this.ship.heading -= 0.08;
        if(keyIsDown(68)) this.ship.heading += 0.08;
    }
}
