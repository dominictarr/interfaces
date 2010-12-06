  
function toArray(args){
  var a = []
  for(i in args){
    a[i] = args[i]
  }
  return a
}
function wrapF (f,detector,key){
  var wrapped =
    function wrapped(){
    detector.interface[key] = f
    return f.apply(this,toArray(arguments))
  }
  wrapped.prototype = f.prototype
  var props = Object.keys(f)
  
  props.forEach(function (key){
    wrapped[key] = f[key]
  })
  
  return wrapped  
}

exports.wrap = function (obj){
  var detector = {interface:{} , get keys(){return Object.keys(this.interface) } }
  if('object' === typeof obj){
  
    Object.keys(obj).forEach(function(key){
      var value = obj[key]
      
      if('function' == typeof value){
        obj[key] = wrapF(value,detector,key)
      }
    })
    detector.wrapped = obj
  } else if ('function' === typeof obj) {
    detector.wrapped = wrapF(obj,detector,'null')
  }
  return detector
}
/*
  it would be technicially possible to make exports = a primitive
  but why would you want to?

*/
