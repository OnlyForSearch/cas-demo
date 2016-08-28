String.prototype.trimall=function()//去首尾空格函数
{
    var reg=/^ +| +$/g;
    var str=this.replace(reg,"");
    return str;
}

String.prototype.is_num=function()//判断数字
{
    var reg=/^-?\d*$/gi;
    var isNum=reg.exec(this);
    if(!isNum)
        return false;
    return true;
}
String.prototype.is_float=function()//判断浮点数
{
    var reg=/^(-?\d+)(\.\d+)?$/gi;
    var isFloat=reg.exec(this);
    if(!isFloat)
        return false;
    return true;
}
String.prototype.is_email=function()
{
    var reg=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/gi;
    var isEmail=reg.exec(this);
    if(!isEmail)
        return false;
    return true;
}

String.prototype.EncodeURI=function()
{
    var m="",sp="!'()*-.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~"
    for(var i=0;i<this.length;i++){
        if(sp.indexOf(this.charAt(i))!=-1){
            m+=this.charAt(i)
        }else{
            var n=this.charCodeAt(i)
            var t="0"+n.toString(8)
            if(n>0x7ff)
                m+=("%"+(224+parseInt(t.slice(-6,-4),8)).toString(16)+"%"+(128+parseInt(t.slice(-4,-2),8)).toString(16)+"%"+(128+parseInt(t.slice(-2),8)).toString(16)).toUpperCase()
            else if(n>0x7f)
                m+=("%"+(192+parseInt(t.slice(-4,-2),8)).toString(16)+"%"+(128+parseInt(t.slice(-2),8)).toString(16)).toUpperCase()
            else if(n>0x3f)
                m+=("%"+(64+parseInt(t.slice(-2),8)).toString(16)).toUpperCase()
            else if(n>0xf)
                m+=("%"+n.toString(16)).toUpperCase()
            else
                m+=("%"+"0"+n.toString(16)).toUpperCase()
        }
    }
    return m;
}
String.prototype.is_chinese=function()
{
   if (/[^\x00-\xff]/g.test(this))
     return true;
   return false;
}

String.prototype.Tlength = function()
{
        var arr=this.match(/[^\x00-\xff]/ig);
        return this.length+(arr==null?0:arr.length);
}

String.prototype.hasText = function()
{
    if(this==null || this.length == 0)
    {
        return false;
    }
    for(var i=0;i<this.length;i++)
    {
        if(this.charAt(i)!=" ") return true;
    }
    return false;
}

String.prototype.isInArray = function(aString)
{
     var isIn=false;
     var iLen=aString.length;
	 for(var i=0;i<iLen;i++)
	 {
	     if(aString[i]==this)
		 {
		     isIn=true;
			 break;
		 }
	 }
	 return isIn;
}

String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {   
	if (!RegExp.prototype.isPrototypeOf(reallyDo)) {   
		return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);   
	} else {   
		return this.replace(reallyDo, replaceWith);   
	}   
}

//add by chenzw 2015-11-3
String.prototype.startWith=function(s){
	if(s==null||s==""||this.length==0||s.length>this.length)
	   return false;
	if(this.substr(0,s.length)==s)
	     return true;
	else
	     return false;
	return true;
}
//add by chenzw 2015-11-3
String.prototype.endWith=function(s){
	if(s==null||s==""||this.length==0||s.length>this.length)
	     return false;
	if(this.substring(this.length-s.length)==s)
	     return true;
	else
	     return false;
	return true;
}


function xmlDecode(str)
{
	return EncodeSpecialStrs(str, ["&amp;","&gt;","&lt;","&quot;","&apos;"],['&', '>', '<', '"',"'"]);
}

