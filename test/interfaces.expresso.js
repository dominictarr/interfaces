

var  proto = {who: "prototype"}
function Proto () {}
Proto.prototype = proto
var interfaces = require('interfaces')
  , describe = require('should').describe
  , obj = 
  { assertThis: function (){
    describe(this,"this, in obj.x")
      .should.eql(obj)
      return this
    }
  , return3Args: function (a,b,c){
    return [a,b,c]
    }
  , withProperties: function (){
    return arguments.callee.x
  }
  , Class: function (){
    this.self = this
  }
    /*
      synonym

      circular reference    
      
      object
      
      properties
    */
  }
  var Backup = obj.Class
  obj.Class.prototype = new Proto

  obj.withProperties.x = {who: "obj.withProperties.x"}
  obj.withProperties.f = function (x){ return "X" + x + "!"}


function checkInterface (detector,keys) {
  describe(detector.keys,"detected interface keys")
    .should.eql(keys)

  var it = 
    describe(detector.interface,"detected interface")

  detector.keys.forEach(function (i){
    it.should.have.property(i).a('function')
  })

}

exports ['can wrap methods in an object'] = function (test){
  var detector = interfaces.wrap(obj)

  describe(obj.assertThis(),"return value of obj.assertThis()")
    .should.eql(obj)
  
  var r =  obj.return3Args(1,2,3)

  describe(r,"return value of wrapped object")
    .should.eql([1,2,3])

  checkInterface(detector,['assertThis','return3Args'])
}

exports ['perserves function properties'] = function (test){
  var detector = interfaces.wrap(obj)
  
  describe(obj.withProperties,"obj.withProperties")
    .should.have.property('x')
  
  describe(obj.withProperties(),"return value of obj.withProperties()")
    .should.eql(obj.withProperties.x)

  describe(obj.withProperties.f('1234'),"return value of obj.withProperties()")
    .should.eql('X1234!')

}

exports ['does not break instanceof for Objects'] = function (test){
  var detector = interfaces.wrap(obj)

  /**
   * I think this will probably break some things... 
   * depending on how modules check types... 
   * just get something simple going for now.
   *
   */

  var c = new obj.Class()
  describe(c,"new obj.Class")
    .should.be.instanceof(obj.Class)
  describe(c.self,"new obj.Class")
    .should.be.instanceof(obj.Class) 
}

exports ['does not break prototypes for Objects'] = function (test){
  var detector = interfaces.wrap(obj)

  /**
   * I think this will probably break some things... 
   * depending on how modules check types... 
   * just get something simple going for now.
   *
   */

  var c = new obj.Class()
  describe(c,"new obj.Class")
    .should.be.instanceof(obj.Class)
  describe(c.self,"new obj.Class")
    .should.be.instanceof(obj.Class) 
  describe(proto.isPrototypeOf(c),"proto is still prototype of Class")
    .should.be.ok

  describe(c,"proto is still prototype of Class")
    .should.be.instanceof(Proto)

  describe(c,"proto is still prototype of Backup (another reference to Object.Class)")
    .should.be.instanceof(Backup)

  checkInterface(detector,['Class'])
}


exports ['wraps with object is a function'] = function (test){
  
  var detector = interfaces.wrap(funct)

  function funct (a,b,c){
    return [a,b,c]
  }

  /**
   * I think this will probably break some things... 
   * depending on how modules check types... 
   * just get something simple going for now.
   *
   */
   
   describe (detector.wrapped(1,2,3),"return value of wrapped function")
    .should.eql([1,2,3])
    

}

