Simple LRU Cache

let {LinkedListLRU} = require('linked-list-lru');

let cached = new LinkedListLRU(50);

cached.set('key', 'value');
cached.get('key');// => return value
