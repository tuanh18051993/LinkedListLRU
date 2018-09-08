let {LinkedListLRU} = require('./index.js');

let cached = new LinkedListLRU(50);

cached.set('my_key', 'my_value');
console.log(cached.get('my_key'));// => return value