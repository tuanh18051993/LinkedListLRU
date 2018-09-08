Simple LRU Cache For ES6

let {LinkedListLRU} = require('linked-list-lru');

let cached = new LinkedListLRU(50);

cached.set('key', 'value');
cached.get('key');// => return value