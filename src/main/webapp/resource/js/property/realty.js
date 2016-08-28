
/**
金钱的值设置为隔三位带‘，’，精确到小数点后2位
*/
function dealMoney(money){
	money = "" + money;
	var index = money.indexOf(".");
	var str = money;
	if(index != -1){
		str = money.substring(0,index);
	}else{
		index = money.length;
	}
	
	var part = new Array(); 
	for(var i = index; i >= 0; i = i - 3){
		var begin = i - 3;
		var end = i;
		if(begin < 0){
			begin = 0;
		}
		part.push(money.substring(begin,end));
	}
	
	var part2 = new Array();
	for(var i = part.length-1; i>=0 ; i--){
		part2.push(part[i]);
	}
	
	if(index != money.length){
		str = money.substring(index,money.length);
		if(str.length>=4){
			var i = str.charAt(2);
			var j = str.charAt(3);
			if(j >= 5){
				i++;
			}
			str = money.substring(index,index + 2) + i;
		}
		return part2 + str;
	}else{
		return part2;
	} 
}
