function Persistence(){};

Persistence.prototype.initialize = function(name){
    this.name = name;
}

Persistence.prototype.purge = function(fn){
    return fn();
}

module.exports = Persistence;
