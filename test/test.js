import {LinkedListLRU, SimpleLRU} from '../index';
var assert = require('assert');

let _time = Date.now();
const start = ()=>{
  _time = Date.now();
}
const cost=  (tag)=>{
  console.log(tag, ' Cost: ', Date.now() - _time);
};

const size = 10000;

describe('Structures TEST', function() {
  describe('linkedListLRU test small', function() {    
      let a = new LinkedListLRU(4);
      a.set('en1', 1);
      a.set('en2', 1);
      a.set('en3', 1);
      a.set('en4', 1);
      a.get('en1');
      a.set('en5', 1);
      it('01', function() {               
          assert.ok(a.get("en1") !== null, " wrong");        
      });
      it('02', function() {               
          assert.ok(a.get("en2") == null, " wrong");        
      });
      it('03', function() {                   
        assert.ok(a.get("en3") !== null, " wrong");
      });

      it('04', function() {                   
        assert.ok(a.get("en4") !== null, " wrong");
      });
  });  
  describe('linkedListLRU', function() {    
    let a = new LinkedListLRU(size);
    for(let i = 1; i <= 2* size; i++){
      a.set('en' + i, i);
    }
    it('01', function() {               
        assert.ok(a.get("en" + size) == null, " wrong");        
    });
    it('02', function() {               
        assert.ok(a.get("en0") == null, " wrong");        
    });
    it('03', function() {
      assert.ok(a.get("en" + (size + 1)) == (size + 1), " wrong");
    });

    it('04', function() {               
        assert.ok(a.get("en" + (size * 2)) == (size * 2), " wrong");
    });
  });  
  describe('simpleLRU', function() {    
    let a = new SimpleLRU(size);
    for(let i = 1; i <= 2*size; i++){
      a.set('en' + i, i);
    }
    it('01', function() {               
        assert.ok(a.get("en" + size) == null, " wrong");        
    });
    it('02', function() {               
        assert.ok(a.get("en0") == null, " wrong");        
    });
    it('03', function() {               
      assert.ok(a.get("en" + (size + 1)) == (size + 1), " wrong");
    });

    it('04', function() {               
        assert.ok(a.get("en" + (size * 2)) == (size *2), " wrong");
    });      
  });

  //////////performance
  describe('linkedListLRU time', function() {   
    start(); 
    let a = new LinkedListLRU(size);
    for(let i = 1; i <= 2* size; i++){
      a.set('en' + i, i);
    }   
    for(let i = 1; i <= size; i++){
      let _x = Math.floor(Math.random() * size) + 1;
      a.set('en' + _x, _x);
    }
    for(let i = 1; i <= size; i++){
      let _x = Math.floor(Math.random() * size) + 1;
      a.get('en' + _x, _x);
    }
    cost('linkedListLRU');
  });
  describe('simpleLRU time', function() {   
    start(); 
    let a = new SimpleLRU(size);
    for(let i = 1; i <= 2* size; i++){
      a.set('en' + i, i);
    }   
    for(let i = 1; i <= size; i++){
      let _x = Math.floor(Math.random() * size) + 1;
      a.set('en' + _x, _x);
    }
    for(let i = 1; i <= size; i++){
      let _x = Math.floor(Math.random() * size) + 1;
      a.get('en' + _x, _x);
    }
    cost('simpleLRU');
  });
  describe('linkedListLRU test base on result of simpleLRU', function() {   
    let a = new SimpleLRU(size);
    let b = new LinkedListLRU(size);
    for(let i = 1; i <= 2* size; i++){
      a.set('en' + i, i);
      b.set('en' + i, i);
    }   
    for(let i = 1; i <= size; i++){
      let _x = Math.floor(Math.random() * size) + 1;
      a.set('en' + _x, _x);
      b.set('en' + _x, _x);
    }
    for(let i = 1; i <= size; i++){
      let _x = Math.floor(Math.random() * size) + 1;
      a.get('en' + _x, _x);
      b.get('en' + _x, _x);
    }
    for(let i = 1; i <= 20; i++){
      let _x = Math.floor(Math.random() * size) + 1;
      _x = "en" + _x;      
      let _key = ('0' + i).slice(-2);
      it(_key, function() {                    
        assert.ok(a.get(_x) === b.get(_x), " wrong");
      });
    }
  })
  describe('linkedListLRU test base on result of simpleLRU', function() {   
    let size = Math.random() * 100 + 10;
    let a = new SimpleLRU(size);
    let b = new LinkedListLRU(size);
    let keySet = new Set();
    for(let nt = 0; nt <= Math.floor(Math.random()*100) + 20; nt ++){
      for(let i = 0; i < Math.floor(Math.random()*100) + 2; i++){
        let x = Math.random() >= 0.5 ? 'set': 'get';
        let y = 'key' + Math.random() *1000;
        a[x](y, y);
        b[x](y, y);
        keySet.add(y);
      }
    }
    for(let _key of keySet){
      it(_key, function() {                    
        assert.ok(a.get(_key) === b.get(_key), " wrong");
      });
    }      
  });
});