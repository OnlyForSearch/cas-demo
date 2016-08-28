//---------------------------------------------------   
// ????   
//---------------------------------------------------   
Date.prototype.isLeapYear = function()    
{    
    return (0==this.getYear()%4&&((this.getYear()%100!=0)||(this.getYear()%400==0)));    
}    
   
//---------------------------------------------------   
// ?????   
// ?? YYYY/yyyy/YY/yy ????   
// MM/M ??   
// W/w ??   
// dd/DD/d/D ??   
// hh/HH/h/H ??   
// mm/m ??   
// ss/SS/s/S ?   
//---------------------------------------------------   
Date.prototype.Format = function(formatStr)    
{    
    var str = formatStr;    
    var Week = ['?','?','?','?','?','?','?'];   
   
    str=str.replace(/yyyy|YYYY/,this.getFullYear());    
    str=str.replace(/yy|YY/,(this.getYear() % 100)>9?(this.getYear() % 100).toString():'0' + (this.getYear() % 100));    
   
    str=str.replace(/MM/,this.getMonth()>9?this.getMonth().toString():'0' + this.getMonth());    
    str=str.replace(/M/g,this.getMonth());    
   
    str=str.replace(/w|W/g,Week[this.getDay()]);    
   
    str=str.replace(/dd|DD/,this.getDate()>9?this.getDate().toString():'0' + this.getDate());    
    str=str.replace(/d|D/g,this.getDate());    
   
    str=str.replace(/hh|HH/,this.getHours()>9?this.getHours().toString():'0' + this.getHours());    
    str=str.replace(/h|H/g,this.getHours());    
    str=str.replace(/mm/,this.getMinutes()>9?this.getMinutes().toString():'0' + this.getMinutes());    
    str=str.replace(/m/g,this.getMinutes());    
   
    str=str.replace(/ss|SS/,this.getSeconds()>9?this.getSeconds().toString():'0' + this.getSeconds());    
    str=str.replace(/s|S/g,this.getSeconds());    
   
    return str;    
}    
   
//+---------------------------------------------------   
//| ????????? ????? YYYY-MM-dd    
//+---------------------------------------------------   
function daysBetween(DateOne, DateTwo)   
{    
    var OneMonth = DateOne.substring(5,DateOne.lastIndexOf ('-'));   
    var OneDay = DateOne.substring(DateOne.length,DateOne.lastIndexOf ('-')+1);   
    var OneYear = DateOne.substring(0,DateOne.indexOf ('-'));   
   
    var TwoMonth = DateTwo.substring(5,DateTwo.lastIndexOf ('-'));   
    var TwoDay = DateTwo.substring(DateTwo.length,DateTwo.lastIndexOf ('-')+1);   
    var TwoYear = DateTwo.substring(0,DateTwo.indexOf ('-'));   
   
    var cha=((Date.parse(OneMonth+'/'+OneDay+'/'+OneYear)- Date.parse(TwoMonth+'/'+TwoDay+'/'+TwoYear))/86400000);    
    return cha; //Math.abs(cha);   
}   
   
   
//+---------------------------------------------------   
//| ????   
//+---------------------------------------------------   
Date.prototype.DateAdd = function(strInterval, Number) {    
    var dtTmp = this;   
    switch (strInterval) {    
        case 's' :return new Date(Date.parse(dtTmp) + (1000 * Number));   
        case 'n' :return new Date(Date.parse(dtTmp) + (60000 * Number));   
        case 'h' :return new Date(Date.parse(dtTmp) + (3600000 * Number));   
        case 'd' :return new Date(Date.parse(dtTmp) + (86400000 * Number));   
        case 'w' :return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));   
        case 'q' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number*3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());   
        case 'm' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());   
        case 'y' :return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());   
    }   
}   
   
//+---------------------------------------------------   
//| ????? dtEnd ???????? ?????????   
//+---------------------------------------------------   
Date.prototype.DateDiff = function(strInterval, dtEnd) {    
    var dtStart = this;   
    if (typeof dtEnd == 'string' )//????????????   
    {    
        dtEnd = StringToDate(dtEnd);   
    }   
    switch (strInterval) {    
        case 's' :return parseInt((dtEnd - dtStart) / 1000);   
        case 'n' :return parseInt((dtEnd - dtStart) / 60000);   
        case 'h' :return parseInt((dtEnd - dtStart) / 3600000);   
        case 'd' :return parseInt((dtEnd - dtStart) / 86400000);   
        case 'w' :return parseInt((dtEnd - dtStart) / (86400000 * 7));   
        case 'm' :return (dtEnd.getMonth()+1)+((dtEnd.getFullYear()-dtStart.getFullYear())*12) - (dtStart.getMonth()+1);   
        case 'y' :return dtEnd.getFullYear() - dtStart.getFullYear();   
    }   
}   
   
//+---------------------------------------------------   
//| ??????????????toString??   
//+---------------------------------------------------   
Date.prototype.toString = function(showWeek)   
{    
    var myDate= this;   
    var str = myDate.toLocaleDateString();   
    if (showWeek)   
    {    
        var Week = ['?','?','?','?','?','?','?'];   
        str += ' ??' + Week[myDate.getDay()];   
    }   
    return str;   
}   
   
//+---------------------------------------------------   
//| ???????   
//| ????YYYY-MM-DD?YYYY/MM/DD   
//+---------------------------------------------------   
function IsValidDate(DateStr)    
{    
    var sDate=DateStr.replace(/(^\s+|\s+$)/g,''); //?????;    
    if(sDate=='') return true;    
    //??????YYYY-(/)MM-(/)DD?YYYY-(/)M-(/)DD?YYYY-(/)M-(/)D?YYYY-(/)MM-(/)D????''    
    //????????????:YYYY-MM/DD(2003-3/21),?????????YYYY-MM-DD??    
    var s = sDate.replace(/[\d]{ 4,4 }[\-/]{ 1 }[\d]{ 1,2 }[\-/]{ 1 }[\d]{ 1,2 }/g,'');    
    if (s=='') //??????YYYY-MM-DD?YYYY-M-DD?YYYY-M-D?YYYY-MM-D    
    {    
        var t=new Date(sDate.replace(/\-/g,'/'));    
        var ar = sDate.split(/[-/:]/);    
        if(ar[0] != t.getYear() || ar[1] != t.getMonth()+1 || ar[2] != t.getDate())    
        {    
            //alert('????????????YYYY-MM-DD?YYYY/MM/DD??????');    
            return false;    
        }    
    }    
    else    
    {    
        //alert('????????????YYYY-MM-DD?YYYY/MM/DD??????');    
        return false;    
    }    
    return true;    
}    
   
//+---------------------------------------------------   
//| ??????   
//| ????YYYY-MM-DD HH:MM:SS   
//+---------------------------------------------------   
function CheckDateTime(str)   
{    
    var reg = /^(\d+)-(\d{ 1,2 })-(\d{ 1,2 }) (\d{ 1,2 }):(\d{ 1,2 }):(\d{ 1,2 })$/;    
    var r = str.match(reg);    
    if(r==null)return false;    
    r[2]=r[2]-1;    
    var d= new Date(r[1],r[2],r[3],r[4],r[5],r[6]);    
    if(d.getFullYear()!=r[1])return false;    
    if(d.getMonth()!=r[2])return false;    
    if(d.getDate()!=r[3])return false;    
    if(d.getHours()!=r[4])return false;    
    if(d.getMinutes()!=r[5])return false;    
    if(d.getSeconds()!=r[6])return false;    
    return true;    
}    
   
//+---------------------------------------------------   
//| ????????   
//+---------------------------------------------------   
Date.prototype.toArray = function()   
{    
    var myDate = this;   
    var myArray = Array();   
    myArray[0] = myDate.getFullYear();   
    myArray[1] = myDate.getMonth();   
    myArray[2] = myDate.getDate();   
    myArray[3] = myDate.getHours();   
    myArray[4] = myDate.getMinutes();   
    myArray[5] = myDate.getSeconds();   
    return myArray;   
}   
   
//+---------------------------------------------------   
//| ????????   
//| ?? interval ??????   
//| y ? m? d? w?? ww? h? n? s?   
//+---------------------------------------------------   
Date.prototype.DatePart = function(interval)   
{    
    var myDate = this;   
    var partStr='';   
    var Week = ['?','?','?','?','?','?','?'];   
    switch (interval)   
    {    
        case 'y' :partStr = myDate.getFullYear();break;   
        case 'm' :partStr = myDate.getMonth()+1;break;   
        case 'd' :partStr = myDate.getDate();break;   
        case 'w' :partStr = Week[myDate.getDay()];break;   
        case 'ww' :partStr = myDate.WeekNumOfYear();break;   
        case 'h' :partStr = myDate.getHours();break;   
        case 'n' :partStr = myDate.getMinutes();break;   
        case 's' :partStr = myDate.getSeconds();break;   
    }   
    return partStr;   
}   
   
//+---------------------------------------------------   
//| ??????????????   
//+---------------------------------------------------   
Date.prototype.MaxDayOfDate = function()   
{    
    var myDate = this;   
    var ary = myDate.toArray();   
    var date1 = (new Date(ary[0],ary[1]+1,1));   
    var date2 = date1.dateAdd(1,'m',1);   
    var result = dateDiff(date1.Format('yyyy-MM-dd'),date2.Format('yyyy-MM-dd'));   
    return result;   
}   
   
//+---------------------------------------------------   
//| ?????????????????   
//+---------------------------------------------------   
Date.prototype.WeekNumOfYear = function()   
{    
    var myDate = this;   
    var ary = myDate.toArray();   
    var year = ary[0];   
    var month = ary[1]+1;   
    var day = ary[2];   
    document.write('< script language=VBScript\>\r\n');   
    document.write('myDate = DateValue("'+month+'-'+day+'-'+year+'")\r\n');   
    document.write('result = DatePart("ww", myDate)\r\n');   
    document.write('\r\n');
    return result;   
}
   
//+---------------------------------------------------   
//| ?????????    
//| ?? MM/dd/YYYY MM-dd-YYYY YYYY/MM/dd YYYY-MM-dd   
//+---------------------------------------------------   
function StringToDate(DateStr)   
{    
   
    var converted = Date.parse(DateStr);   
    var myDate = new Date(converted);   
    if (isNaN(myDate))   
    {    
        //var delimCahar = DateStr.indexOf('/')!=-1?'/':'-';   
        var arys= DateStr.split('-');   
        myDate = new Date(arys[0],--arys[1],arys[2]);   
    }   
    return myDate;   
}

/**
 * 日期计算 tangft 2014.07.1 
 * @param {} strInterval 需要计算的部分 如：时为h，分为n，秒为s等
 * @param {} Number 时间差 如加1小时为1，减两小时为-2等
 * @return {}
 */
Date.prototype.DateAdd2 = function(strInterval, Number) {   
    var dtTmp = this; //时间对象
    switch (strInterval) {//月是从0开始，所有月都+1
    	//秒
        case 's' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), (dtTmp.getSeconds() + Number));
        //分
        case 'n' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()), dtTmp.getDate(), dtTmp.getHours(), (dtTmp.getMinutes() + Number), dtTmp.getSeconds());
        //时
        case 'h' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()), dtTmp.getDate(), (dtTmp.getHours() + Number), dtTmp.getMinutes(), dtTmp.getSeconds());
        //天
        case 'd' :return new Date(dtTmp.getFullYear(), dtTmp.getMonth(), dtTmp.getDate()+Number, dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        //周
        case 'w' :return new Date(dtTmp.getFullYear(), dtTmp.getMonth(), (dtTmp.getDate()+ (Number*7)), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        //月
        case 'm' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        //季
        case 'q' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number*3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        //年
        case 'y' :return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
    } 
}

/**
 * 格式化日期 2014.07.1 
 * @param {} formatStr 返回的字符串格式
 * @return {}
 */
Date.prototype.Format2 = function(formatStr)   
{   
    var str = formatStr;
    //周格式
    var Week = ['日','一','二','三','四','五','六'];  
    //年
    str=str.replace(/yyyy|YYYY/,this.getFullYear());   
    str=str.replace(/yy|YY/,(this.getYear() % 100)>9?(this.getYear() % 100).toString():'0' + (this.getYear() % 100));   
  	
    //月
    str=str.replace(/MM/,this.getMonth()>8?(this.getMonth()+1).toString():'0' + (this.getMonth()+1).toString());   
    str=str.replace(/M/g,(this.getMonth()+1).toString());
    
  	
    //周
    str=str.replace(/w|W/g,Week[this.getDay()]);   
  	
    //日
    str=str.replace(/dd|DD/,this.getDate()>9?this.getDate().toString():'0' + this.getDate());   
    str=str.replace(/d|D/g,this.getDate());   
  	
    //时
    str=str.replace(/hh|HH/,this.getHours()>9?this.getHours().toString():'0' + this.getHours());   
    str=str.replace(/h|H/g,this.getHours());   
    
    //分
    str=str.replace(/mm/,this.getMinutes()>9?this.getMinutes().toString():'0' + this.getMinutes());   
    str=str.replace(/m/g,this.getMinutes());   
  	
    //秒
    str=str.replace(/ss|SS/,this.getSeconds()>9?this.getSeconds().toString():'0' + this.getSeconds());   
    str=str.replace(/s|S/g,this.getSeconds());   
  
    return str;   
}

/**
 * 格式化日期 2014.07.1 
 * @param {} showWeek 是否显示星期
 * @return {}
 */
Date.prototype.toString2 = function(showWeek){   
    var myDate= this;  
    var str = myDate.toLocaleDateString();  
    if (showWeek){   
        var Week = ['日','一','二','三','四','五','六'];  
        str += ' 星期' + Week[myDate.getDay()];  
    }  
    return str;  
}

/**
 * 当月天数 tangft 2014.07.1 
 * @return {}
 */
Date.prototype.MaxDayOfDate2 = function()  
{   
    var myDate = this;  
    var ary = myDate.toArray();  
    var date1 = (new Date(ary[0],ary[1]+1,1));  
    var date2 = date1.dateAdd(1,'m',1);  
    var result = dateDiff(date1.Format('yyyy-MM-dd'),date2.Format('yyyy-MM-dd'));  
    return result;  
} 


//获取两个日期差 add by tangft 2014.07.1
function dateDiff2(d1,d2){
	var date1 = new Date(d1);
	var date2 = new Date(d2);
	var diff = date2-date1;
	return(date2-date1);
	
	//alert(date2.Format("YYYY-MM-DD HH:mm:ss"));
}

//把时间差转化成标准格式 HH:mm:ss add by tangft 2014.07.1
function getTime2(diff){
	var d = new Date(diff-28800000);
	var a = new Date(d-(new Date("1979/01/01 08:00:00")));
	return a.Format("HH:mm:ss"); 
}