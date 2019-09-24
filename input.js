function Input(){
    this.listeners = {};
    this.reset = function(){
        this.listeners = {};
    };
    this.registerAsListener = function(index, callback){
        if(this.listeners[index] == undefined) this.listeners[index] = [];
        this.listeners[index].push(callback);
    };
    this.handleEvent = function(char, code, press){
        if(this.listeners[code] != undefined)
            this.listeners[code].forEach( fun=>fun.apply(this, [char, code, press]) );
    }
}

function keyReleased(){
    if(lives<=0) return;
    if(keyCode==87||32||77) input.handleEvent(key, keyCode, false);
    else return false;
}

function keyPressed(){
    if(lives<=0) return;
    if(keyCode==87||32||77) input.handleEvent(key, keyCode, true);
    else return false;
}