function Map()
{
	this.arr = new Array();
	this.length = 0;
}

Map.prototype.find = function(key)
{
	var result = new Object();
	for (var i = 0; i < this.arr.length&&this.arr[i].key != key;i++);
	result.isFind = (i!=this.arr.length);
	result.index = i;
	return result;
}

Map.prototype.put = function(key,value)
{
	var result = this.find(key);
	if(result.isFind)
	{
		this.arr[result.index].value = value;
	}
	else
	{
		var oNewObj = new Object();
		oNewObj.key = key;
		oNewObj.value = value;
		this.arr.push(oNewObj);
		this.length ++;
	}
}

Map.prototype.getByIndex = function(index)
{
	return this.arr[index].value;	
}

Map.prototype.getByKey = function(key)
{
	var result = this.find(key);
	if(result.isFind)
	{
		return this.getByIndex(result.index);
	}
	else
	{
		return null;
	}
}

Map.prototype.remove = function(key)
{
	var result = this.find(key);
	if(result.isFind)
	{
		this.arr.splice(result.index,1);
		this.length --;
	}
}

//add by chenjw
Map.prototype.getKeyByIndex = function(index)
{
	return this.arr[index].key;	
}