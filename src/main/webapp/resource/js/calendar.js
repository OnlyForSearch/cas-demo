<!--
//定义默认语言资源
var calendarJSDefaultLang = {
	closeShortcuts : '关闭的快捷键',
	shortcuts : '快捷键',
	lastMonth : '向前翻 1 月',
	nextMonth : '向后翻 1 月',
	lastYear  : '向前翻 1 年',
	nextYear  : '向后翻 1 年',
	currentDate	  : '当前日期',
	today	  : '今天',
	clear	  : '清空',
	close	  : '关闭'
};
//获取语言资源
function getCalendarJSLan(code)
{
	if(typeof(ItmLang) == 'undefined' || typeof(ItmLang.widgets) == 'undefined')
	{
		return eval('calendarJSDefaultLang.' + code);
	}
	else
	{
		 return eval('ItmLang.widgets.calendarJS.' + code);
	}
}
var calendarJSLANGUAGE = 'CN';
if(typeof(ItmLang) != 'undefined' && typeof(ItmLang.widgets) != 'undefined' 
			&& typeof(ItmLang.widgets.calendarHTC) != 'undefined')
{
	calendarJSLANGUAGE = ItmLang.widgets.calendarHTC.calendarJSLANGUAGE || 'CN';
}

var calendarJSgaMonthNames = new Array(
  new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'),
  new Array('一月', '二月', '三月', '四月', '五月', '六月', '七月', 
            '八月', '九月', '十月', '十一月', '十二月')
  );
var calendarJSgaDayNames = new Array( 
  new Array('S', 'M', 'T', 'W', 'T', 'F', 'S'),
  new Array('日','一', '二', '三', '四', '五', '六'),
  new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')
  );
/* 调用方法：
  <input onfocus="calendar()" name="s2" type="text" id="s2" style="width:100%;" />
*/
var cal_Width = 180;//定义日历显示的宽度，至少140

document.write("<div id='meizzCalendarLayer' style='position: absolute; z-index: 9999; width: " + (cal_Width+4).toString() + "px; height: 193px; display: none'>");
document.write("<iframe name='meizzCalendarIframe' id='meizzCalendarIframe' scrolling='no' frameborder='0' width='100%' height='100%'></iframe></div>");
var WebCalendar = new WebCalendar();

function document.onclick()
{
    if(WebCalendar.eventSrc != window.event.srcElement) hiddenCalendar();
}

function WebCalendar() //初始化日历的设置
{
    this.regInfo    = "WEB Calendar ver 3.0&#13;" + getCalendarJSLan('closeShortcuts') + "：[Esc]";
    
    this.dayShow    = 38;                       //定义页面上要显示的天数,不能小于35,或大于39
    this.daysMonth  = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this.day        = new Array(this.dayShow);            //定义日历展示用的数组
    this.dayObj     = new Array(this.dayShow);            //定义日期展示控件数组
    this.dateStyle  = null;                     //保存格式化后日期数组
    this.objExport  = null;                     //日历回传的显示控件
    this.eventSrc   = null;                     //日历显示的触发控件
    this.inputDate  = null;                     //转化外的输入的日期(d/m/yyyy)
    this.thisYear   = new Date().getFullYear(); //定义年的变量的初始值
    this.thisMonth  = new Date().getMonth()+ 1; //定义月的变量的初始值
    this.thisDay    = new Date().getDate();     //定义日的变量的初始值
    this.today      = this.thisDay +"/"+ this.thisMonth +"/"+ this.thisYear;   //今天(d/m/yyyy)
    this.iframe     = window.frames("meizzCalendarIframe"); //日历的 iframe 载体
    this.shadow   = getObjectById("meizzCalendarLayer");  //日历的层
    this.dateReg    = "";           //日历格式验证的正则式
    this.useOldDate = true;

    this.yearFall   = 50;           //定义显示的年份下拉框的年差值，如果今年是2000年，这里设置为50，就显示1950－2050
    this.format     = "yyyy-mm-dd"; //回传日期的格式
    this.timeShow   = false;        //是否返回时间
    this.drag       = true;         //是否允许拖动
    this.darkColor  = "#95B7F3";    //控件的暗色
    this.lightColor = "#FFFFFF";    //控件的亮色
    this.btnBgColor = "#E6E6FA";    //控件的按钮背景色
    this.wordColor  = "#000080";    //控件的文字颜色
    this.wordDark   = "#DCDCDC";    //控件的暗文字颜色
    this.dayBgColor = "#F5F5FA";    //日期数字背景色
    this.todayColor = "#FF0000";    //今天在日历上的标示背景色
    this.DarkBorder = "#D4D0C8";    //日期显示的立体表达色
    
    this.yearOption = "";
    var yearNow = new Date().getFullYear();
    yearNow = (yearNow <= 1000)? 1000 : ((yearNow >= 9999)? 9999 : yearNow);
    var yearMin = (yearNow - this.yearFall >= 1000) ? yearNow - this.yearFall : 1000;
    var yearMax = (yearNow + this.yearFall <= 9999) ? yearNow + this.yearFall : 9999;
        yearMin = (yearMax == 9999) ? yearMax-this.yearFall*2 : yearMin;
        yearMax = (yearMin == 1000) ? yearMin+this.yearFall*2 : yearMax;
    for (var i=yearMin; i<=yearMax; i++)
    {
    	if(calendarJSLANGUAGE == 'CN')
    	{
    		this.yearOption += "<option value='"+i+"'>"+i+"年</option>";
    	}
    	else
    	{
    		this.yearOption += "<option value='"+i+"'>"+i+"</option>";
    	}
    }
}   

function writeIframe()
{
    var strIframe = "<html><head><meta http-equiv='Content-Type' content='text/html; charset=gb2312'><style>"+
    "*{font-size: 12px; font-family: 宋体}"+
    ".bg{  color: "+ WebCalendar.lightColor +"; cursor: default; background-color: "+ WebCalendar.darkColor +";}"+
    "table#tableMain{ width: "+ (cal_Width+2).toString() +"px; height: 180px;}"+
    "table#tableWeek td{ width:14%;color: "+ WebCalendar.lightColor +";}"+
    "table#tableDay  td{ width:14%;font-weight: bold;}"+
    "td#meizzYearHead, td#meizzYearMonth{color: "+ WebCalendar.wordColor +"}"+
    ".out { text-align: center; border-top: 1px solid "+ WebCalendar.DarkBorder +"; border-left: 1px solid "+ WebCalendar.DarkBorder +";"+
    "border-right: 1px solid "+ WebCalendar.lightColor +"; border-bottom: 1px solid "+ WebCalendar.lightColor +";}"+
    ".over{ text-align: center; border-top: 1px solid #FFFFFF; border-left: 1px solid #FFFFFF;"+
    "border-bottom: 1px solid "+ WebCalendar.DarkBorder +"; border-right: 1px solid "+ WebCalendar.DarkBorder +"}"+
    "input{ border: 1px solid "+ WebCalendar.darkColor +"; padding-top: 1px; height: 18px; cursor: hand;"+
    "       color:"+ WebCalendar.wordColor +"; background-color: "+ WebCalendar.btnBgColor +"}"+
    "</style></head><body onselectstart='return false' style='margin: 0px' oncontextmenu='return false'><form name=meizz>";

    if (WebCalendar.drag){ strIframe += "<scr"+"ipt type='text/javascript'>"+
    "var drag=false, cx=0, cy=0, o = parent.WebCalendar.shadow; function document.onmousemove(){"+
    "if(parent.WebCalendar.drag && drag){if(o.style.left=='')o.style.left=0; if(o.style.top=='')o.style.top=0;"+
    "o.style.left = parseInt(o.style.left) + window.event.clientX-cx;"+
    "o.style.top  = parseInt(o.style.top)  + window.event.clientY-cy;}}"+
    "function document.onkeydown(){ switch(window.event.keyCode){  case 27 : parent.hiddenCalendar(); break;"+
    "case 37 : parent.prevM(); break; case 38 : parent.prevY(); break; case 39 : parent.nextM(); break; case 40 : parent.nextY(); break;"+
    "case 84 : document.forms[0].today.click(); break;} " +
    "try{window.event.keyCode = 0; window.event.returnValue= false;}catch(ee){}}"+
    "function dragStart(){cx=window.event.clientX; cy=window.event.clientY; drag=true;}</scr"+"ipt>"}

    strIframe += "<table id=tableMain class=bg border=0 cellspacing=2 cellpadding=0>"+
    "<tr><td width='"+ cal_Width +"px' height='19px' bgcolor='"+ WebCalendar.lightColor +"'>"+
    "    <table width='"+ cal_Width +"px' id='tableHead' border='0' cellspacing='1' cellpadding='0'><tr align='center'>"+
    "    <td width='10%' height='19px' class='bg' title='" + getCalendarJSLan('lastMonth') + "&#13;" + getCalendarJSLan('shortcuts') + "：←' style='cursor: hand' onclick='parent.prevM()'><b>&lt;</b></td>"+
    "    <td width='45%' id=meizzYearHead "+
    "        onmouseover='this.bgColor=parent.WebCalendar.darkColor; this.style.color=parent.WebCalendar.lightColor'"+
    "        onmouseout='this.bgColor=parent.WebCalendar.lightColor; this.style.color=parent.WebCalendar.wordColor'>" + 
    "<select name=tmpYearSelect  onblur='parent.hiddenSelect(this)' style='width:100%;'"+
    "        onchange='parent.WebCalendar.thisYear =this.value; parent.hiddenSelect(this); parent.writeCalendar();'>";
    
//    var yearNow = new Date().getFullYear();
//    yearNow = (yearNow <= 1000)? 1000 : ((yearNow >= 9999)? 9999 : yearNow);
//    var yearMin = (yearNow - WebCalendar.yearFall >= 1000) ? yearNow - WebCalendar.yearFall : 1000;
//    var yearMax = (yearNow + WebCalendar.yearFall <= 9999) ? yearNow + WebCalendar.yearFall : 9999;
//        yearMin = (yearMax == 9999) ? yearMax-WebCalendar.yearFall*2 : yearMin;
//        yearMax = (yearMin == 1000) ? yearMin+WebCalendar.yearFall*2 : yearMax;
//    for (var i=yearMin; i<=yearMax; i++) strIframe += "<option value='"+i+"'>"+i+"年</option>";

    strIframe += WebCalendar.yearOption + "</select>"+
    "</td>"+
    "    <td width='35%' id=meizzYearMonth "+
    "        onmouseover='this.bgColor=parent.WebCalendar.darkColor; this.style.color=parent.WebCalendar.lightColor'"+
    "        onmouseout='this.bgColor=parent.WebCalendar.lightColor; this.style.color=parent.WebCalendar.wordColor'>" +
    "<select name=tmpMonthSelect onblur='parent.hiddenSelect(this)' style='width:100%;'" +    
    "        onchange='parent.WebCalendar.thisMonth=this.value; parent.hiddenSelect(this); parent.writeCalendar();'>";
    for (var i=1; i<13; i++) 
    {
    	if(calendarJSLANGUAGE == 'CN')
    	{
    		strIframe += "<option value='"+i+"'>" + calendarJSgaMonthNames[1][i-1] + "</option>";		
    	}
    	else
    	{
    		strIframe += "<option value='"+i+"'>" + calendarJSgaMonthNames[0][i-1] + "</option>";
    	}
    }
    strIframe += "</select>"+
    "</td>"+
    "    <td width='10%' class=bg title='" + getCalendarJSLan('nextMonth') + "&#13;" + getCalendarJSLan('shortcuts') + "：→' onclick='parent.nextM()' style='cursor: hand'><b>&gt;</b></td></tr></table>"+
    "</td></tr><tr><td height='20px'>"+
    "<table id=tableWeek border=1 width='"+ cal_Width +"px' cellpadding=0 cellspacing=0 ";
    if(WebCalendar.drag){strIframe += "onmousedown='dragStart()' onmouseup='drag=false' ";}
    strIframe += " borderColorLight='"+ WebCalendar.darkColor +"' borderColorDark='"+ WebCalendar.lightColor +"'>";
    if(calendarJSLANGUAGE == 'CN1')
    {
    	strIframe +="    <tr align=center><td height='20px'>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td></tr></table>";
    }
    else
    {
    	strIframe +="    <tr align=center>";
    	for(var i = 0; i < calendarJSgaDayNames[0].length; i ++)
    	{
    		strIframe +="<td height='20px'>" + calendarJSgaDayNames[0][i] + "</td>";
    	}
    	strIframe +="    </tr></table>";
    }
    strIframe +="</td></tr><tr><td valign=top width='"+ cal_Width +"px' bgcolor='"+ WebCalendar.lightColor +"'>"+
    "    <table id=tableDay height='120px' width='"+ cal_Width +"px' border=0 cellspacing=1 cellpadding=0>";
         for(var x=0; x<5; x++){
           strIframe += "<tr>";
           for(var y=0; y<7; y++)
             strIframe += "<td class=out id='meizzDay"+ (x*7+y) +"'></td>"; 
           strIframe += "</tr>";
         }
         strIframe += "<tr>";
         for(var x=35; x<WebCalendar.dayShow; x++)
           strIframe += "<td class=out id='meizzDay"+ x +"'></td>";
         strIframe +="<td colspan="+(42-WebCalendar.dayShow).toString()+" class=out style='text-align:center;' title='"+ WebCalendar.regInfo +"'>" + 
         "<input style=' background-color: " + WebCalendar.btnBgColor +";cursor: hand; padding-top: 2px; width: 44%; height: 100%;' onfocus='this.blur()'"+
         " type=button value='" + getCalendarJSLan('clear') + "' onclick='parent.WebCalendar.objExport.value=\"\";parent.hiddenCalendar()'>" + 
         "&nbsp;" + 
         "<input style=' background-color: " + WebCalendar.btnBgColor +";cursor: hand; padding-top: 2px; width: 43%; height: 100%;' onfocus='this.blur()'"+
         " type=button value='" + getCalendarJSLan('close') + "' onclick='parent.hiddenCalendar()'>" + 
         "</td></tr></table>"+
    "</td></tr><tr><td height='20px' width='"+ cal_Width +"px' bgcolor='"+ WebCalendar.lightColor +"'>"+
    "    <table border=0 cellpadding=1 cellspacing=0 width='"+ cal_Width +"px'>"+
    "    <tr><td><input name=prevYear title='" + getCalendarJSLan('lastYear') + "&#13;" + getCalendarJSLan('shortcuts') + "：↑' onclick='parent.prevY()' type=button value='&lt;&lt;'"+
    "    onfocus='this.blur()' style='meizz:expression(this.disabled=parent.WebCalendar.thisYear==1000)'><input"+
    "    onfocus='this.blur()' name=prevMonth title='" + getCalendarJSLan('lastMonth') + "&#13;" + getCalendarJSLan('shortcuts') + "：←' onclick='parent.prevM()' type=button value='&lt;&nbsp;'>"+
    "    </td><td align=center><input name=today type=button value='" + getCalendarJSLan('today') + "' onfocus='this.blur()' style='width: 50px;' title='" + getCalendarJSLan('currentDate') + "&#13;" + getCalendarJSLan('shortcuts') + "：T'"+
    "    onclick=\"parent.returnDate(new Date().getDate() +'/'+ (new Date().getMonth() +1) +'/'+ new Date().getFullYear())\">"+
    "    </td><td align=right><input title='" + getCalendarJSLan('nextMonth') + "&#13;" + getCalendarJSLan('shortcuts') + "：→' name=nextMonth onclick='parent.nextM()' type=button value='&nbsp;&gt;'"+
    "    onfocus='this.blur()'><input name=nextYear title='" + getCalendarJSLan('nextYear') + "&#13;" + getCalendarJSLan('shortcuts') + "：↓' onclick='parent.nextY()' type=button value='&gt;&gt;'"+
    "    onfocus='this.blur()' style='meizz:expression(this.disabled=parent.WebCalendar.thisYear==9999)'></td></tr></table>"+
    "</td></tr><table></form></body></html>";
    with(WebCalendar.iframe)
    {
        document.writeln(strIframe); document.close();
        for(var i=0; i<WebCalendar.dayShow; i++)
        {
            WebCalendar.dayObj[i] = eval("meizzDay"+ i);
            WebCalendar.dayObj[i].onmouseover = dayMouseOver;
            WebCalendar.dayObj[i].onmouseout  = dayMouseOut;
            WebCalendar.dayObj[i].onclick     = returnDate;
        }
    }
}

function calendar() //主调函数
{
//alert(sss);
    var e = window.event.srcElement;  
    writeIframe();
    var o = WebCalendar.shadow.style; WebCalendar.eventSrc = e;
    if(e.tagName=="INPUT"){
        WebCalendar.objExport = e;
    }
    else{
    	if(!arguments[0]){
    		arguments[0] = document.getElementById(arguments[0].toString());
    	}
        WebCalendar.objExport = eval(arguments[0]);
    }
    //如果有两个参数，第二个参数为判断是否让今天之前日期可用
    if (arguments.length > 1){ WebCalendar.useOldDate = arguments[1]; }

   
//	if (arguments.length == 0) WebCalendar.objExport = e;
//    else WebCalendar.objExport = eval(arguments[0]);

    WebCalendar.iframe.tableWeek.style.cursor = WebCalendar.drag ? "move" : "default";
//	var t = e.offsetTop,  h = e.clientHeight, l = e.offsetLeft, p = e.type;
//	
//	
//	while (e = e.offsetParent){t += e.offsetTop; l += e.offsetLeft;}
//    o.display = ""; WebCalendar.iframe.document.body.focus();
//    var cw = WebCalendar.shadow.clientWidth, ch = WebCalendar.shadow.clientHeight;
//    var dw = document.body.clientWidth, dl = document.body.scrollLeft, dt = document.body.scrollTop;
//  
//	
//	//如果有三个参数，第三个参数为iframe名
//    if (arguments.length > 2){
//        if(typeof(arguments[2])!='undefined'){
//            dt = dt + arguments[2].scrollTop; 
//        }
//	}
//   
//    if (document.body.clientHeight + dt - t - h >= ch) o.top = (p=="image")? t + h : t + h ;
//    else o.top  = (t - dt < ch) ? ((p=="image")? t + h : t + h ) : t - ch;
//    if (dw + dl - l >= cw) o.left = l; else o.left = (dw >= cw) ? dw - cw + dl : dl;


//var dads  = document.all.meizzCalendarIframe.style;
	var th = e;
	var btop = document.body.scrollTop;
	var bhei = document.body.clientHeight;
	var bwid = document.body.clientWidth;
	var sTop = -193;
//	if(typeof(pobj)!='undefined'){
//		btop = btop + pobj.scrollTop;
//	}
	//如果有三个参数，第三个参数为iframe名
    if (arguments.length > 2){
        if(typeof(arguments[2])!='undefined'){
            sTop = sTop + arguments[2].scrollTop; 
        }
	}
	//alert(arguments.length)
	//if (arguments.length > 3){
   //     if(typeof(arguments[3])!='undefined'){
     //       btop = btop + arguments[3]; 
    //    }
	//}
	
	var ttop  = e.offsetTop-sTop;     //TT控件的定位点高
	var thei  = e.clientHeight;  //TT控件本身的高
	var tleft = e.offsetLeft;    //TT控件的定位点宽
	
	var ttyp  = e.type;          //TT控件的类型
	var vWid=event.clientX+e.clientWidth;
	while (e = e.offsetParent){ttop+=e.offsetTop; tleft+=e.offsetLeft;}
	//alert(tleft);
	
	var blance =  cal_Width +4 - (window.screen.width - tleft);
	//避免向右撑出的
	if(blance>0){
	    tleft = tleft - cal_Width -4;
	}
    o.display = ""; WebCalendar.iframe.document.body.focus();
	
	if(ttop-bhei-thei-btop<193){
		ttop = ttop - 193-thei;
	}

	o.top  = (ttyp=="image")? ttop+thei : ttop+thei+6;
	
	if(vWid>bwid){
		tleft=tleft-130;
	}
	
	o.left = tleft;
	
    if  (!WebCalendar.timeShow) WebCalendar.dateReg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
    else WebCalendar.dateReg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;

    try{
        if (WebCalendar.objExport.value.trim() != ""){
            WebCalendar.dateStyle = WebCalendar.objExport.value.trim().match(WebCalendar.dateReg);
            if (WebCalendar.dateStyle == null)
            {
                WebCalendar.thisYear   = new Date().getFullYear();
                WebCalendar.thisMonth  = new Date().getMonth()+ 1;
                WebCalendar.thisDay    = new Date().getDate();
                alert("原文本框里的日期有错误！\n可能与你定义的显示时分秒有冲突！");
                writeCalendar(); return false;
            }
            else
            {
                WebCalendar.thisYear   = parseInt(WebCalendar.dateStyle[1], 10);
                WebCalendar.thisMonth  = parseInt(WebCalendar.dateStyle[3], 10);
                WebCalendar.thisDay    = parseInt(WebCalendar.dateStyle[4], 10);
                WebCalendar.inputDate  = parseInt(WebCalendar.thisDay, 10) +"/"+ parseInt(WebCalendar.thisMonth, 10) +"/"+ 
                parseInt(WebCalendar.thisYear, 10); writeCalendar();
            }
        } 
        else {
          WebCalendar.thisYear   = new Date().getFullYear();
          WebCalendar.thisMonth  = new Date().getMonth()+ 1;
          WebCalendar.thisDay    = new Date().getDate();
          writeCalendar();
        }
    }
    catch(e) {
        WebCalendar.thisYear   = new Date().getFullYear();
        WebCalendar.thisMonth  = new Date().getMonth()+ 1;
        WebCalendar.thisDay    = new Date().getDate();
        writeCalendar();
    }
}

function funMonthSelect() //月份的下拉框
{
    var m = isNaN(parseInt(WebCalendar.thisMonth, 10)) ? new Date().getMonth() + 1 : parseInt(WebCalendar.thisMonth);
    var e = WebCalendar.iframe.document.forms[0].tmpMonthSelect;
    e.value = m; //e.focus(); 
    //window.status = e.style.left;
}

function funYearSelect() //年份的下拉框
{
    var e = WebCalendar.iframe.document.forms[0].tmpYearSelect;
    var y = isNaN(parseInt(WebCalendar.thisYear, 10)) ? new Date().getFullYear() : parseInt(WebCalendar.thisYear);
    e.value = y; //e.focus();
//    if(e.value == "")
//    {
//      e.value = new Date().getFullYear();
//      WebCalendar.thisYear = e.value;
//    }
}

function prevM()  //往前翻月份
{
    WebCalendar.thisDay = 1;
    if (WebCalendar.thisMonth==1)
    {
        WebCalendar.thisYear--;
        WebCalendar.thisMonth=13;
    }
    WebCalendar.thisMonth--; writeCalendar();
}

function nextM()  //往后翻月份
{
    WebCalendar.thisDay = 1;
    if (WebCalendar.thisMonth==12)
    {
        WebCalendar.thisYear++;
        WebCalendar.thisMonth=0;
    }
    WebCalendar.thisMonth++; writeCalendar();
}
function prevY(){WebCalendar.thisDay = 1; WebCalendar.thisYear--; writeCalendar();}//往前翻 Year
function nextY(){WebCalendar.thisDay = 1; WebCalendar.thisYear++; writeCalendar();}//往后翻 Year
function hiddenSelect(e){
  //for(var i=e.options.length; i>-1; i--)e.options.remove(i); e.style.display="none";
}
function getObjectById(id){ if(document.all) return(eval("document.all."+ id)); return(eval(id)); }
function hiddenCalendar(){getObjectById("meizzCalendarLayer").style.display = "none";};
function appendZero(n){return(("00"+ n).substr(("00"+ n).length-2));}//日期自动补零程序
function String.prototype.trim(){return this.replace(/(^\s*)|(\s*$)/g,"");}
function dayMouseOver()
{
    this.className = "over";
    this.style.backgroundColor = WebCalendar.darkColor;
    if(WebCalendar.day[this.id.substr(8)].split("/")[1] == WebCalendar.thisMonth)
    this.style.color = WebCalendar.lightColor;
}
function dayMouseOut()
{
    this.className = "out"; var d = WebCalendar.day[this.id.substr(8)], a = d.split("/");
    this.style.removeAttribute('backgroundColor');
    if(a[1] == WebCalendar.thisMonth && d != WebCalendar.today)
    {
        if(WebCalendar.dateStyle && a[0] == parseInt(WebCalendar.dateStyle[4], 10))
        this.style.color = WebCalendar.lightColor;
        this.style.color = WebCalendar.wordColor;
    }
}
function writeCalendar() //对日历显示的数据的处理程序
{
    var y = WebCalendar.thisYear;
    var m = WebCalendar.thisMonth; 
    var d = WebCalendar.thisDay;
    WebCalendar.daysMonth[1] = (0==y%4 && (y%100!=0 || y%400==0)) ? 29 : 28;
    if (!(y<=9999 && y >= 1000 && parseInt(m, 10)>0 && parseInt(m, 10)<13 && parseInt(d, 10)>0)){
        alert("对不起，你输入了错误的日期！");
        WebCalendar.thisYear   = new Date().getFullYear();
        WebCalendar.thisMonth  = new Date().getMonth()+ 1;
        WebCalendar.thisDay    = new Date().getDate(); }
    y = WebCalendar.thisYear;
    m = WebCalendar.thisMonth;
    d = WebCalendar.thisDay;
    
    funYearSelect(parseInt(y, 10));
    funMonthSelect(parseInt(m,10));
    //WebCalendar.iframe.meizzYearHead.innerText  = y +" 年";
    //WebCalendar.iframe.meizzYearMonth.innerText = parseInt(m, 10) +" 月";
    WebCalendar.daysMonth[1] = (0==y%4 && (y%100!=0 || y%400==0)) ? 29 : 28; //闰年二月为29天
    var w = new Date(y, m-1, 1).getDay();
    var prevDays = m==1  ? WebCalendar.daysMonth[11] : WebCalendar.daysMonth[m-2];
    for(var i=(w-1); i>=0; i--) //这三个 for 循环为日历赋数据源（数组 WebCalendar.day）格式是 d/m/yyyy
    {
        WebCalendar.day[i] = prevDays +"/"+ (parseInt(m, 10)-1) +"/"+ y;
        if(m==1) WebCalendar.day[i] = prevDays +"/"+ 12 +"/"+ (parseInt(y, 10)-1);
        prevDays--;
    }
    for(var i=1; i<=WebCalendar.daysMonth[m-1]; i++) WebCalendar.day[i+w-1] = i +"/"+ m +"/"+ y;
    for(var i=1; i<WebCalendar.dayShow-w-WebCalendar.daysMonth[m-1]+1; i++)
    {
        WebCalendar.day[WebCalendar.daysMonth[m-1]+w-1+i] = i +"/"+ (parseInt(m, 10)+1) +"/"+ y;
        if(m==12) WebCalendar.day[WebCalendar.daysMonth[m-1]+w-1+i] = i +"/"+ 1 +"/"+ (parseInt(y, 10)+1);
    }
    for(var i=0; i<WebCalendar.dayShow; i++)    //这个循环是根据源数组写到日历里显示
    {
        var a = WebCalendar.day[i].split("/");
        WebCalendar.dayObj[i].innerText    = a[0];
        WebCalendar.dayObj[i].title        = a[2] +"-"+ appendZero(a[1]) +"-"+ appendZero(a[0]);
        WebCalendar.dayObj[i].bgColor      = WebCalendar.dayBgColor;
        WebCalendar.dayObj[i].style.color  = WebCalendar.wordColor;
        if ((i<10 && parseInt(WebCalendar.day[i], 10)>20) || (i>27 && parseInt(WebCalendar.day[i], 10)<12))
            WebCalendar.dayObj[i].style.color = WebCalendar.wordDark;
        if (WebCalendar.inputDate==WebCalendar.day[i])    //设置输入框里的日期在日历上的颜色
        {WebCalendar.dayObj[i].bgColor = WebCalendar.darkColor; WebCalendar.dayObj[i].style.color = WebCalendar.lightColor;}
        if (WebCalendar.day[i] == WebCalendar.today)      //设置今天在日历上反应出来的颜色
        {WebCalendar.dayObj[i].bgColor = WebCalendar.todayColor; WebCalendar.dayObj[i].style.color = WebCalendar.lightColor;}
    }
}
function returnDate() //根据日期格式等返回用户选定的日期
{
    if(WebCalendar.objExport)
    {
        var returnValue;
        var a = (arguments.length==0) ? WebCalendar.day[this.id.substr(8)].split("/") : arguments[0].split("/");
        var d = WebCalendar.format.match(/^(\w{4})(-|\/)(\w{1,2})\2(\w{1,2})$/);
        if(d==null){alert("你设定的日期输出格式不对！\r\n\r\n请重新定义 WebCalendar.format ！"); return false;}
        var flag = d[3].length==2 || d[4].length==2; //判断返回的日期格式是否要补零
        returnValue = flag ? a[2] +d[2]+ appendZero(a[1]) +d[2]+ appendZero(a[0]) : a[2] +d[2]+ a[1] +d[2]+ a[0];
        if(WebCalendar.timeShow)
        {
            var h = new Date().getHours(), m = new Date().getMinutes(), s = new Date().getSeconds();
            returnValue += flag ? " "+ appendZero(h) +":"+ appendZero(m) +":"+ appendZero(s) : " "+  h  +":"+ m +":"+ s;
        }
       
        var pretvalue = returnValue.replace(/-/gi,'');
        var i_chdate = parseInt(pretvalue);
        var i_today  = parseInt(new Date().getFullYear() + appendZero(new Date().getMonth()+1) +appendZero(new Date().getDate()));
        if(i_chdate<i_today)
        {
            //比较选定的日期和当前日期，如果是之前的日期则返回false
            return false;
        }
        WebCalendar.objExport.value = returnValue;      
        hiddenCalendar();
        
    }
}
//-->