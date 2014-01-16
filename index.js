var trycatch = require('middleware');

var IronMiddleware = function(defaultHandler){
  if (!(this instanceof IronMiddleware)) {
    return new IronMiddleware(defaultHandler);
  }
  this.defaultHandler = defaultHandler || function(err, req, res){
    console.error(err);
    res.writeHead(500, "Internal Server Error");
    res.end();
  };
};

IronMiddleware.ignoreAllErrors = function(err, req, res, next){
  next();
};

IronMiddleware.prototype.wrapper = function(middleware, errHandler){
  var defaultHandler = this.defaultHandler;
  return function(req, res, next){
    trycatch(function(){
      middleware(req, res, next);
    }, function(err){
      if (errHandler){
        return errHandler(err, req, res, next);
      }
      return defaultHandler(err, req, res, next);
    });
  };
};


module.exports = IronMiddleware;
