const ON_LOG = false;
class LinkedListItem{
    constructor(entry, data, prev, next){
        this.entry = entry;
        this.data = data;
        this.prev = prev;
        this.next = next;
    }
}

class LinkedList{    
    constructor(_nullValue){
        this._nullValue = _nullValue;
        this._first = this._nullValue;
        this._last = this._nullValue;
        this._map = {};
        this._length = 0;
    }
    getLength(){
        return this._length;
    }
    createItem(entry, data, prev, next){
        let _obj = new LinkedListItem(entry, data, prev, next);
        return _obj;      
    }
    _isNullItem(item){
        return item === this._nullValue;
    }
    getBack(){
        return this._last;
    }
    getFront(){
        return this._first;
    }
    pushBack(entry, data){
        let item = this.createItem(entry, data, this._nullValue, this._nullValue);
        this._addEntry(entry, item);
        if(this._last) {
            item.prev = this._last;    
            this._last.next = item;
            this._last = item;
        }else{
            this._first = item;
            this._last = this._first;
        }
    }
    pushFront(entry, data){
        let item = this.createItem(entry, data, this._nullValue, this._nullValue);
        this._addEntry(entry, item);        
        if(this._first){            
            item.next = this._first;
            this._first.prev = item;
            this._first = item;
        }else{
            this._first = item;
            this._last = this._first;
        }        
    }
    iterator(){
        return this._first;
    }
    _addEntry(entry, refItem){
        if(this._map[entry]) throw new Error('call _addEntry but the entry is existed!! ' + entry);        
        this._map[entry] = refItem;
        this._length ++;
    }
    _deleteEntry(entry){
        if(!this._map[entry]) throw new Error('call _deleteEntry but the entry not existed!! ' + entry);
        ON_LOG && console.log('_deleteEntry ', entry);
        delete this._map[entry];        
        this._length --;
    }
    _remove(item){
        this._deleteEntry(item.entry);
        ON_LOG && console.log('remove item ', item.entry);
        if(!this._isNullItem(item.prev)){
            //item is not the first
            ON_LOG && console.log('item isnt first');
            let _prev = item.prev;
            _prev.next = item.next;
            if(this._isNullItem(item.next)){
                //item is last
                ON_LOG && console.log('item is last');
                this._last = _prev;
            }else{
                item.next.prev = _prev;
            }
        }else{
            ON_LOG && console.log('item is first');
            //item is first
            this._first = item.next;
            if(this._isNullItem(item.next)){
                //item is last
                ON_LOG && console.log('item is last');
                this._last = this._nullValue;
            }else{
                item.next.prev = this._nullValue;
            }
        }
    }
    getFromEntry(entry){
        if(this._map.hasOwnProperty(entry) && this._map[entry]){
            return this._map[entry];
        }
        return this._nullValue;
    }

//region api
    getFirstEntry(){
        if(this._isNullItem(this._first)) return null;
        return this._first.entry;
    }
    //return null if not exist
    getDataFromEntry(entry){
        let _item = this.getFromEntry(entry);        
        if(this._isNullItem(_item)) return null;
        ON_LOG && console.log('getDataFromEntry' , entry, _item);
        return _item.data;
    }
    raiseEntryToTopIfExist(entry, data){//true/false
        let _success = false;
        let _item = this.getFromEntry(entry);
        if(!this._isNullItem(_item)){
            this._remove(_item);
            if(data !== undefined) _item.data = data;
            this.pushFront(entry, _item.data);
            _success = true;
        }
        return _success;
    }
    remove(entry){//true/false
        let _find = false;
        let _item = this.getFromEntry(entry);
        if(!this._isNullItem(_item)){            
            this._remove(_item);
            _find = true;
        }
        return _find
    }
    removeLast(){
        if(!this._last) throw new Error('Call removeLast when _last == null');
        let _entryLast = this._last.entry;
        this.remove(_entryLast);
    }
//endregion
}

//O(1) for all actions
class LinkedListLRU{
    constructor(maxCached){
        this._linkedList = new LinkedList(/*nullValue*/);
        this.maxItem = maxCached || 50;
    }
    get(entry){        
        if(this._raise(entry)){
            //return true if entry existed
            return this._linkedList.getDataFromEntry(entry);    
        }else{
            return null;
        }        
    }
    removeKey(entry){
        return this._linkedList.remove(entry);
    }
    getIterator(){
        return this._linkedList.iterator();
    }

    _raise(entry, data){
        return this._linkedList.raiseEntryToTopIfExist(entry, data);
    }

    _checkRoll(){
        while(this._linkedList.getLength() > this.maxItem) 
            this._linkedList.removeLast();
    }
    set(entry, data){
        if(data != undefined && entry){          
            if(!this._raise(entry, data)){
                this._linkedList.pushFront(entry, data);
            }
            this._checkRoll();
        }else{
            throw new Error('entry/data is not valid');
        }
    }
}

//O(n) for all actions
class SimpleLRU{
    constructor(maxCached){
        this.cachedData = {};
        this.arrEntries = [];
        this.maxItem = maxCached || 50;
    }
    get(entry){
        if(this.cachedData.hasOwnProperty(entry) && this.cachedData[entry] != undefined){
            this._raise(entry);
            return this.cachedData[entry];
        }
        return null;
    }

    _raise(entry){
        for(let i = 0; i < this.arrEntries.length; i++){
            if(this.arrEntries[i] == entry){
                if(i != 0){
                    this.arrEntries.splice(i, 1);
                    this.arrEntries.unshift(entry); 
                }               
                return true;
            }
        }
        return false;
    }

    _checkRoll(){
        while(this.arrEntries.length > this.maxItem){
            let _last = this.arrEntries.pop();
            if(_last && this.cachedData[_last]) delete this.cachedData[_last];
        }
    }
    set(entry, data){
        if(data != undefined && entry){          
            if(!this._raise(entry))
                this.arrEntries.unshift(entry);
            this.cachedData[entry] = data;
            this._checkRoll();            
        }
    }
}

module.exports = {
    LinkedListLRU,
    SimpleLRU
}