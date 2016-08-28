/**
 * 实现类似HashTable的功能,使用key来对应所对应的对象
 */
function Table()
{
  this.keyArray = new Array();
  this.valArray = new Array();
}

Table.prototype.containsKey = function(key){
  for(i=0;(key != this.keyArray[i])&&(i<this.keyArray.length);i++);
  return (i==this.keyArray.length)?-1:i;
}

Table.prototype.put = function(key,value){
  var index = this.containsKey(key);
  if(index==-1){
    this.keyArray.push(key);
    this.valArray.push(value);
  }
  else{
    this.keyArray[index] = key;
    this.valArray[index] = value;
  }
}

Table.prototype.getByKey = function(key){
  var index = this.containsKey(key);
  return (index==-1)?null:this.valArray[index];
}

Table.prototype.getByIndex = function(id){
  return (id>=this.valArray.length)?null:this.valArray[id];
}

Table.prototype.remove = function(key){
  var index = this.containsKey(key);
  if(index!=-1){
    this.keyArray.splice(index,1);
    this.valArray.splice(index,1);
  }
}

Table.prototype.size = function(){
  return this.keyArray.length;
}
