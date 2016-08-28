/**
 * 常用的一些JavaScript方法
 */

Function.prototype.callback = function(args)
{
	var method = this;
	return function()
	{
		return method.apply(window, args);
	}
}

Function.prototype.extend = function(parentClass, m, sm)
{
	var oc = Object.prototype.constructor;
	var F = new Function(), sbp, spp = parentClass.prototype;
	F.prototype = spp;
	sbp = this.prototype = new F();
	sbp.constructor = this;
	sbp.Super = parentClass;
	this.superclass = spp;
	this.methods(m);
	this.methods(sm, true);
	return this;
}

Function.prototype.methods = function(o, isStatic)
{
	if (o)
	{
		var Class = (isStatic === true) ? this : this.prototype;
		for (var name in o)
		{
			Class[name] = o[name];
		}
	}
	return this;
}

function getHtmlData(id)
{
	var el = document.getElementById(id+".{ds}");
	if(el && el.tagName.toUpperCase()=="TEXTAREA")
	{
		return el.value;
	}
	else
	{
		return "";
	}
}

function getJsonFromHtmlData(id)
{
	var data = getHtmlData(id);
	if(data)
	{
		return eval("(" + data + ')');
	}
}

function getXmlFromHtmlData(id)
{
	var data = getHtmlData(id);
	if(data)
	{
		var xmlDom = new ActiveXObject("Microsoft.XMLDOM");
		xmlDom.async = false;
		xmlDom.loadXML(getHtmlData(id));
		return xmlDom;
	}
}

//缓存补丁 Add By Panqd
function getRowSetObjArray(xmlDom){
    var retVal = []
    var element = xmlDom.selectSingleNode("/root/rowSet");
    while (element != null) {
        var childs = element.childNodes;
        var obj = {};
        for (var i = 0; i < childs.length; i++) {
            var e = childs[i];
            var toel = 'obj.' + e.nodeName + '="' + e.text + '"';
            toel = toel.replace(/\n/g, '<br/>');
            try{
                eval(toel);
            }catch(ex){
                var errKey = "err" + i;
                obj[errKey] = e.text;
            }
        }
        retVal.push(obj);
        element = element.nextSibling;
    }
    return retVal;
}

// 通过指定标签得到指定对象的父亲节点
function getElement(oElement, tagName, count)
{
	var index = 0;
	if (typeof(count) == "undefined")
	{
		count = index;
	}
	do
	{
		if (!oElement)
			return null;
		tagName = tagName.toLowerCase();
		if (oElement.tagName.toLowerCase() == tagName)
		{
			if (index == count)
				return oElement;
			else
				index++;
		}
	}
	while (oElement = oElement.parentElement);
	return null;
}

// 通过指定对象的Name得到对象
function getElementByName(oElement, name)
{
	do
	{
		if (!oElement)
			return null;
		if (oElement.getAttribute("name") == name)
		{
			return oElement;
		}
	}
	while (oElement = oElement.parentElement);
	return null;
}

// 判断一个节点是不是最后一个节点
function isLastNode(oElement)
{
	if (oElement)
	{
		if (oElement.parentElement.lastChild == oElement)
			return true;
		else
			return false;
	}
	else
		return false;
}

// 判断一个节点是不是第一个节点
function isFirstNode(oElement)
{
	if (oElement)
	{
		if (oElement.parentElement.firstChild == oElement)
			return true;
		else
			return false;
	}
	else
		return false;
}

// 判断数组中是否包含某个值
function hasItem(array, val)
{
	for (var i = 0; i < array.length && array[i] != val; i++);
	return !(i == array.length);
}

// 刷新页面
function refresh()
{
	location.reload();
}

// 将相对js文件的地址转化为相对js所在页面的地址filePath:文件相对js文件的地址,js文件的名称
var getRealPath = (function()
{
	var relativeReg = /\w+\/\.\.\//
	var filePathMap = {}
	var jsPathMap = {}

	return function(filePath, jsPath)
	{
		var realPath;
		if (filePath in filePathMap)
		{
			return filePathMap[filePath]
		}
		if (jsPath in jsPathMap)
		{
			jsPath = jsPathMap[jsPath]
		}
		else
		{
			var oJsSrc
			var reg = new RegExp("^(.*/)?(?:(?:dv|v)@[^/_]+_)?" + jsPath + "$");
			var arr
			for (var i = 0; i < document.scripts.length; i++)
			{
				var oScript = document.scripts[i];
				oJsSrc = oScript.src || oScript.jsPath || "";
				arr = reg.exec(oJsSrc)
				if (arr)
				{
					jsPathMap[jsPath] = RegExp.$1
					jsPath = jsPathMap[jsPath]
					break
				}
			}
		}
		realPath = jsPath + filePath;
		while(relativeReg.test(realPath))
		{
			realPath = realPath.replace(relativeReg,"");
		}
		filePathMap[filePath]=realPath;
		return realPath;
	}
})()

// 设置页面的标题(还有BUG,有待完善)
function setTitle(oTitle)
{
	if (document.readyState == "interactive")
	{
		setTimeout("setTitle('" + oTitle + "')", 1);
	}
	else if (document.readyState == "loading")
	{
		document.title = oTitle;
		for (i = 0; i < 50; i++)
		{
			document.title += "　";
		}
	}
	else
	{
		location.reload();
	}
}

// 得到指定css文件所在的路径
function getCssPath(cssName)
{
	for (i = 0; i < window.document.styleSheets.length; i++)
	{
		var parentStyle = window.document.styleSheets[i];
		if (parentStyle.href.indexOf(cssName) != -1)
		{
			return parentStyle.href;
		}
		for (j = 0; j < parentStyle.imports.length; j++)
		{
			if (parentStyle.imports[j].href.indexOf(cssName) != -1)
			{
				return parentStyle.imports[j].href;
			}
		}
	}
	return "";
}

// 得到指定js文件所在的路径
function getJsPath(jsName)
{
	var oJsSrc;
	var oIndex;
	for (i = 0; i < window.document.scripts.length; i++)
	{
		oJsSrc = document.scripts[i].src;
		if ((oIndex = oJsSrc.indexOf(jsName)) != -1)
		{
			return oJsSrc;
		}
	}
	return "";
}

// 得到window真正的ScreenTop值(解决框架中的引用)
function getWinScreenTop(win)
{
	var winScreenTop = 0;
	var topWin = win.top;
	while (win.frameElement != null && topWin != win)
	{
		winScreenTop += win.frameElement.getBoundingClientRect().top;
		win = win.parent;
	}
	winScreenTop += win.screenTop;
	return winScreenTop;
}

// 得到window真正的ScreenLeft值(解决框架中的引用)
function getWinScreenLeft(win)
{
	var winScreenLeft = 0;
	var topWin = win.top;
	while (win.frameElement != null && topWin != win)
	{
		winScreenLeft += win.frameElement.getBoundingClientRect().left;
		win = win.parent;
	}
	winScreenLeft += win.screenLeft;
	return winScreenLeft;
}

// 得到执行成功后的数据岛对象
function getMsgXML(dom)
{
	var xmlDom = new ActiveXObject("Microsoft.XMLDOM");
	xmlDom.loadXML(dom.documentElement.lastChild.xml);
	return xmlDom;
}

// 得到执行成功后的数据岛节点
function getMsgNode(dom)
{
	return dom.documentElement.lastChild;
}

// 得到url搜索串
function getURLSearch(isParent)
{
	var strSearch ="";
	if(isParent){
	 strSearch= window.parent.location.search;
	}
	else{
		 strSearch= location.search;
	}
	var reg1 = /=/gi;
	var reg2 = /&/gi;
	strSearch = strSearch.substr(1, strSearch.length);
	strSearch = strSearch.replace(reg1, '":"');
	strSearch = strSearch.replace(reg2, '","');
	if (strSearch == "")
		return null;
	else
		strSearch = decodeURIComponent('{"' + strSearch + '"}');
		
	eval("var ArrayUrl=" + strSearch);
	return ArrayUrl;
}

function getUrlParam()
{
	return getURLSearch() || {};
}

// 得到父窗口URL字符串 HB_FAULT_POST需求
function getParentUrlParam()
{
	var strSearch = parent.window.location.search;
	var reg1 = /=/gi;
	var reg2 = /&/gi;
	strSearch = strSearch.substr(1, strSearch.length);
	strSearch = strSearch.replace(reg1, '":"');
	strSearch = strSearch.replace(reg2, '","');
	if (strSearch == "")
		return null;
	else
		strSearch = decodeURIComponent('{"' + strSearch + '"}');
	eval("var ArrayUrl=" + strSearch);
	return ArrayUrl || {};
}

var $request = (function request()
{
	var sSearch = location.search;
	var oParam = {};
	sSearch = sSearch.substr(1, sSearch.length);
	var params = sSearch.split("&");
	for (var i = 0; i < params.length; i++)
	{
		var param = params[i].split("=");
		var key = param[0];
		var value = decodeURIComponent(param[1]);
		if (key in oParam)
		{
			(oParam[key].constructor == Array)
					? oParam[key].push(value)
					: oParam[key] = [oParam[key], value];

		}
		else
		{
			oParam[key] = value;
		}
	}
	return (function(sParamName)
	{
		return (oParam[sParamName]) ? oParam[sParamName] : ""
	});
})();
// 聚焦下拉框
function doFoucs(property, cboName)
{
	for (i = 0; i < cboName.length; i++)
	{
		if (cboName[i].value == property)
		{
			cboName[i].selected = true;
			break;
		}
	}
}
// 获得某天所在月的第一天
function getMonthFirstDay(d)
{
	var year = d.getYear();
	var month = d.getMonth() + 1 + "";
	month = (month.length == 1) ? "0" + month : month;
	return (year + "-" + month + "-01");
}
// 获得某天所在月的最后一天
function getMonthLastDay(d)
{
	var aMonthDays = new Array(31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
	var year = d.getYear();
	var month = d.getMonth();
	aMonthDays[1] = (((!(year % 4)) && (year % 100)) || !(year % 400))
			? 29
			: 28;
	var lastDay = aMonthDays[month];
	month = month + 1 + "";
	month = (month.length == 1) ? "0" + month : month;
	return (year + "-" + month + "-" + lastDay);
}
// 日期加上几天
function addDay(sDay, num)
{
	var d = new Date(sDay.replace(/-/g, "/"));
	d.setDate(d.getDate() + num);
	var year = d.getFullYear();
	var month = d.getMonth() + 1;
	var day = d.getDate();
	function _f(n)
	{
		if (n < 10)
			n = "0" + n;
		return n;
	}
	return year + "-" + _f(month) + "-" + _f(day);
}

function dateAdd(strInterval, span, dtDate)  {
  var dtTmp = new Date(dtDate.replace(/-/ig,'/'));     
  switch (strInterval){   
   case   "s":
     dtTmp  =  new Date(Date.parse(dtTmp) + (1000 * parseInt(span,10))); 
     break;  
   case   "n":
     dtTmp  =   new Date(Date.parse(dtTmp) + (60000 * parseInt(span,10))); 
     break;  
   case   "h":
     dtTmp  =   new Date(Date.parse(dtTmp) + (3600000 * parseInt(span,10)));
     break;
   case   "d":
     dtTmp  =   new Date(Date.parse(dtTmp) + (86400000 * parseInt(span,10)));
     break;
   case   "w":
     dtTmp  =   new Date(Date.parse(dtTmp) + ((86400000 * 7) * parseInt(span,10))); 
     break;
   case   "m":
     dtTmp  =   new Date(dtTmp.getFullYear(),(dtTmp.getMonth())+parseInt(span,10),dtTmp.getDate(),
      dtTmp.getHours(), dtTmp.getMinutes(),dtTmp.getSeconds());
     break;   
   case  "y":
     dtTmp  =   new   Date(dtTmp.getFullYear()+parseInt(span),   dtTmp.getMonth(),   dtTmp.getDate(),
        dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
     break;
  }
  var mStr=new String(dtTmp.getMonth()+1);
  var dStr=new String(dtTmp.getDate());
  if (mStr.length==1){
   mStr="0"+mStr;
  }
  if (dStr.length==1){
   dStr="0"+dStr;
  }
  return dtTmp.getFullYear()+"-"+mStr+"-"+dStr;
}

function EncodeSpecialStrs(str, aRequstStr, aReplaceStr)
{
	if(!str) return "";
	var iLen = aRequstStr.length;
	var tmpStr = str;
	for (var i = 0; i < iLen; i++)
	{
		var reg = new RegExp(aRequstStr[i], "gi");
		tmpStr = tmpStr.replace(reg, aReplaceStr[i]);
	}
	return tmpStr;
}

// xml串特殊字符处理
function xmlEncode(str)
{
	return EncodeSpecialStrs(str, ['&', '>', '<', '"'], ["&amp;", "&gt;",
					"&lt;", "&quot;"]);
}

function inputNum(name)
{
	var oInput = event.srcElement;
	if (!oInput.value.is_num())
	{
		EMsg(name + " 只支持数字!");
		event.srcElement.select();
	}
}

function reWin()
{
	var scrollHeight = document.body.scrollHeight;
	var height = document.body.offsetHeight;
	var winHeight = parseInt(window.dialogHeight, 10);
	if (scrollHeight > height)
	{
		window.dialogHeight = winHeight - height + scrollHeight + 'px';
		winHeight = parseInt(window.dialogHeight, 10);
		window.dialogTop = (screen.availHeight - winHeight) / 2 + 'px';
		if (document.body.scrollHeight > document.body.offsetHeight)
		{
			window.dialogWidth = parseInt(window.dialogWidth, 10) + 16 + 'px';
		}
	}

	var scrollWidth = document.body.scrollWidth;
	var width = document.body.offsetWidth;
	var winWidth = parseInt(window.dialogWidth, 10);
	if (scrollWidth > width)
	{
		window.dialogWidth = winWidth - width + scrollWidth + 'px';
		if (document.body.scrollHeight > document.body.offsetHeight)
		{
			window.dialogWidth = parseInt(window.dialogWidth, 10) + 16 + 'px';
		}
		winWidth = parseInt(window.dialogWidth, 10);
		window.dialogLeft = (screen.availWidth - winWidth) / 2 + 'px';
	}
}

function getCookieValue(name)
{
	var reg = new RegExp(name + "=(?!null)(.+?)(?=;|$)");
	var cookieValue = "";
	var match = reg.exec(document.cookie);
	if (match)
	{
		cookieValue = match[1];
	}
	return cookieValue;
}

var $import = function(js, name)
{
	var importObject = {}

	var getUrlWithVersion=function(url,version)
	{
		version && (url = url.replace(/[^/]+?(?=$|\?)/, function($0){return version + "_"+$0}));
		return url;	
	}
	
	var loadResource=function (url,version,isEncode)
	{
		isEncode && (url = url.replace(/\/v(?=@[^/_]+_([^/]+)$)/,"/dv"));
		var sText = "";
		var request = new ActiveXObject("Microsoft.XMLHTTP")
		request.open("GET", url, false);
		isEncode && request.setRequestHeader("isEncode", "true");
		version || request.setRequestHeader("If-Modified-Since", 0);
		request.send();
		if (request.status == 200 || request.status == 304)
		{
			sText = request.responseText;
		}
		else
		{
			alert("加载"+url+"出错");
		}
		request = null;
		return sText;
	}
	
	var getResourceVersion = function(name, path) {
		var importVersion = {}
		var sVersion = getCookieValue("BOSSWG_IMPORT_JS_VERSION");
		if (sVersion) {
			var versionJson = loadResource(
					getUrlWithVersion("/servlet/dynamicImportJsVersionServlet",
							sVersion), sVersion)
			importVersion = eval("(" + versionJson + ")");
		}
		getResourceVersion = function(name, path) {
			key = (path) ? path + name : name;
			var ver;
			if (key in importVersion) {
				ver = importVersion[key];
			}
			return {
				"url" : (ver) ? ((path) ? ver + "_" + name : getUrlWithVersion(
						key, ver)) : name,
				"version" : ver
			}
		}
		return getResourceVersion(name, path);
	}
	
	var fn = function(js, name)
	{
		if (js && !(js in importObject))
		{
			if (name)
			{
				js = getRealPath(js, name);
			}

			js = js.replace(/^(\.\.\/)*/, "").replace(
					/(http:\/\/).+?[0-9]{0,4}(\/)/, "");
			js.indexOf("/") == 0 || (js = "/" + js);
			var jsVerInfo = getResourceVersion(js);
			var jsText = loadResource(jsVerInfo.url,jsVerInfo.version,true);
			if (jsText)
			{
				//  打上已经导入的标识
				importObject[js] = null;
				var oImportJs = window.document.createElement("script");
				oImportJs.language = "javascript";
				oImportJs.type = "text/javascript";
				oImportJs.defer = true;
				oImportJs.text = jsText;
				oImportJs.jsPath = js;
				var oLastJs = document.scripts[document.scripts.length - 1];
				oLastJs.insertAdjacentElement('afterEnd', oImportJs);
			}
		}
	}

	fn.methods({
				"getUrl" : getResourceVersion,
				"load":loadResource
			}, true);
	return fn;
}()

// 页面上所有的INPUT 赋值，告警信息 性能信息里有用到
function iniAllTextField(submitURL)
{
	var submitXML = new ActiveXObject("Microsoft.XMLDOM");
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST", submitURL, false);
	xmlhttp.send(submitXML);
	var returnXml = new ActiveXObject("Microsoft.XMLDOM");
	returnXml.load(xmlhttp.responseXML);
	var oRows = returnXml.selectNodes("/root/rowSet");
	if (oRows.length == 0)
		return;
	var oRows = oRows[0].childNodes;
	var size = oRows.length;
	for (var i = 0; i < size; i++)
	{
		var id = oRows[i].nodeName;
		id = id.toLowerCase();
		if (document.getElementById(id) != null)
		{
			if (document.getElementById(id).tagName == "DIV")
			{
				var text = oRows[i].text;
				text = text.replace(/\n/g, '<BR>');
				document.getElementById(id).innerHTML = text || '&nbsp;';
			}
			else
				document.getElementById(id).value = oRows[i].text || '&nbsp;';
		}
	}
}

function doWindow_open(pageSrc, width, height, target)
{
	if (target == undefined)
	{
		target = "_blank";
	}
	var maxWidth = screen.availWidth - 10;
	var maxHeight = screen.availHeight - 30;
	width = (typeof(width) == "undefined") ? maxWidth : width;
	height = (typeof(height) == "undefined") ? maxHeight : height;
	var top = (maxHeight - height) / 2;
	var left = (maxWidth - width) / 2;
	var sFeatures = new Array();
	sFeatures.push("width=" + width);
	sFeatures.push("height=" + height);
	sFeatures.push("top=" + top);
	sFeatures.push("left=" + left);
	sFeatures.push("location=" + 0);
	sFeatures.push("menubar=" + 0);
	sFeatures.push("resizable=" + 1);
	sFeatures.push("scrollbars=" + 1);
	sFeatures.push("status=" + 0);
	sFeatures.push("titlebar=" + 0);
	sFeatures.push("toolbar=" + 0);
	if (pageSrc)
	{
		window.open(pageSrc, target, sFeatures.join(","));
	}
}

function getSendUrl(sendUrl, sendParams)
{
	return sendUrl + sendParams.join('&');
}

function getSendUrlByObj(sendUrl, sendParams)
{
	var list = []
	var i = 0;
	for (var c in sendParams)
	{
		list[i] = c + "=" + encodeURIComponent(sendParams[c]);
		i++;
	}
	return getSendUrl(sendUrl, list);
}

function loadRightMenu(menuName)
{
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("POST", "/servlet/util?OperType=4&menuName=" + menuName
					+ "&menuType=rightMenu", false);
	oXMLHTTP.send("");
	if (isSuccess(oXMLHTTP))
	{
		var menuDoc = oXMLHTTP.ResponseXML;
		var menuNode = menuDoc.selectSingleNode("/root/menu");
		var sHTML = menuNode.xml;
		sHTML = sHTML.replace("<menu ", "<IE:PopupMenu ");
		sHTML = sHTML.replace("menu>", "IE:PopupMenu>");
		var reg = /<item[^>]*isLine="0BT"[^>]*><\/item>/g;
		var aLine = sHTML.match(reg);
		if (aLine != null)
		{
			for (var i = 0; i < aLine.length; i++)
			{
				sHTML = sHTML.replace(aLine[i], "<line/>");
			}
		}
		document.body.insertAdjacentHTML("afterBegin", sHTML);
	}
}

function $getSysVar(varName)
{
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("POST", "/servlet/util?OperType=5&varName=" + varName, false);
	oXMLHTTP.send("");
	if (isSuccess(oXMLHTTP))
	{
		return oXMLHTTP.responseXML.selectSingleNode("/root/value").text;
	}
}

/**
 * @param {} duringDays 距离当前时间多少天的天数,可正可负,没有的话获取当前时间
 * @return {}
 * ===============================================
 * 日期:2014-08-11 panqd 修改带sql的参数方式
 * ===============================================
 */
function getCurServerDate(duringDays){
	duringDays = duringDays || "";
	var date;
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST","/servlet/util?OperType=13&duringDays=" + encodeURIComponent(duringDays), false);
	xmlhttp.send();
	if (isSuccess(xmlhttp))
	{
		var y = xmlhttp.responseXML.selectSingleNode("/root/values/years").text;
		var m = xmlhttp.responseXML.selectSingleNode("/root/values/months").text;
		var d = xmlhttp.responseXML.selectSingleNode("/root/values/days").text;
		date = y + "-" + m + "-" + d;
	}
	return date;
}

/**
 * @param {} hasTime 是否带时间格式
 * @return {}
 * ===============================================
 * 日期:2014-08-29 panqd 修改带sql的参数方式 
 * PATCH_20140729_01577_panqd_修改SQL注入相关SQL语句 PATCH_20140805_01589_chenzw 服务请求流程改造第三版 带出
 * ===============================================
 */
function getCurServerDateTime(hasTime) {
    if(!hasTime){
        return getCurServerDate();
    }
    var duringDays = "";
    var datetime = "";
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST","/servlet/util?OperType=13&duringDays=" + encodeURIComponent(duringDays), false);
	xmlhttp.send();
	if (isSuccess(xmlhttp))
	{
		var y = xmlhttp.responseXML.selectSingleNode("/root/values/years").text;
		var m = xmlhttp.responseXML.selectSingleNode("/root/values/months").text;
		var d = xmlhttp.responseXML.selectSingleNode("/root/values/days").text;
		var h = xmlhttp.responseXML.selectSingleNode("/root/values/hours").text;
		var minutes = xmlhttp.responseXML.selectSingleNode("/root/values/minutes").text;
		var seconds = xmlhttp.responseXML.selectSingleNode("/root/values/seconds").text;
		datetime = y + "-" + m + "-" + d + " " + h + ":" + minutes + ":" + seconds;
	}
    return datetime;
}


var bShowWait = "true";
function showWait()
{
	if (bShowWait == "true")
	{
		var oWait = window.document.getElementById("oWait");
		if (oWait == null)
		{
			var sDivHTML = "<div style='width:250px;height:100px;z-index:1000;border:1px solid black;display:none;position:absolute;"
					+ "background-color:white' id='oWait'>"
					+ "<img src='/resource/image/ani_wait.gif' style='float:left'/>"
					+ "<span style='font-family:宋体;font-size:9pt;font-weight:bold'>"
					+ "<br><br><br>正在读取数据<br>请稍候......" + "</span>" + "</div>";
			window.document.body.insertAdjacentHTML("afterBegin", sDivHTML);
			oWait = window.document.getElementById("oWait");
		}
		oWait.style.pixelLeft = (window.document.body.clientWidth - oWait.style.pixelWidth)
				/ 2;
		oWait.style.pixelTop = (window.document.body.clientHeight - oWait.style.pixelHeight)
				/ 2;
		oWait.style.display = "block";
		window.setTimeout("loadChart()", 100);
	}
	else
		loadChart();
}

// 查询双中心下拉框选择项
function getSelectOptions(url, obj, blank)
{
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST", url, false);
	xmlhttp.send();

	var dXML = new ActiveXObject("Microsoft.XMLDOM");
	dXML.load(xmlhttp.responseXML);

	var element = dXML.selectSingleNode("/root/rowSet");
	while (element != null)
	{
		var text = element.selectSingleNode("TEXT").text;
		var val = element.selectSingleNode("VALUE").text;
		var objOption = new Option(text, val);
		obj.add(objOption);
		element = element.nextSibling;
	}
}

function rebuildObjToUpperCase(o)
{
	return rebuildObj(o, function(c)
			{
				return c.toUpperCase()
			});
}

function rebuildObjToLowerCase(o)
{
	return rebuildObj(o, function(c)
		{
			return c.toLowerCase();
		});
}

var IEVersion = (function(){   
    var undef,v = 3,
     div = document.createElement('div'),
     all = div.getElementsByTagName('i');
    while (
     div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',  
     all[0] );   
    return v > 4 ? v : undef;
}());


function rebuildObj(o, nameFn)
{
	var copyObj = {};
	for (var c in o)
	{
		copyObj[nameFn(c)] = o[c]
	}
	return copyObj;
}

var BuildClass = (function()
{
	var isFunction = function(fn)
	{
		return typeof fn == "function";
	}

	function createCBFn(config, scope)
	{
		return function()
		{
			var callArgs = Array.prototype.slice.call(arguments, 0);
			callArgs = callArgs.concat(config.fnName);
			var i = 0, f;
			for (i = 0; f = config.before[i]; i++)
			{
				if (f.apply(scope || this || window, callArgs) === false)
				{
					return;
				}
			}
			var retval = config.fn.apply(this || window, arguments);
			for (i = 0; (f = config.after[i])
					&& f.apply(scope || this || window, callArgs) !== false; i++);
			return retval;
		}
	}

	function addConfig(object, config, name)
	{
		var fn = config[name];
		if (isFunction(fn))
		{
			object[name].push(fn);
		}
	}

	var Cls = function(c)
	{
		this.bClass = c;
		this.fConfig = {};
	}

	Cls.prototype = {
		addFilter	: function(fnList, config)
		{
			var fnList = fnList.split(",");
			for (var i = 0, fnName; fnName = fnList[i]; i++)
			{
				var fn = this.bClass.prototype[fnName];
				if (isFunction(fn))
				{
					var filterConfig = this.fConfig[fnName];
					if (!filterConfig)
					{
						filterConfig = {
							fnName	: fnName,
							fn		: fn,
							before	: [],
							after	: []
						}
						this.fConfig[fnName] = filterConfig;
					}
					addConfig(filterConfig, config, "before");
					addConfig(filterConfig, config, "after");
				}
			}
		},
		build		: function()
		{
			for (var c in this.fConfig)
			{
				this.bClass.prototype[c] = createCBFn(this.fConfig[c]);
			}
		}
	}
	return Cls;
})()

// add by panchh
String.prototype.trim = function()
{
    // 用正则表达式将前后空格
    // 用空字符串替代。
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
// 取得当前登陆用户名：
function getCurrentUserInfo(field) {
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("get", "/servlet/util?OperType=6", false);
	oXMLHTTP.send("");
	if (isSuccess(oXMLHTTP)) {
		return oXMLHTTP.responseXML.selectSingleNode("/root/"+field).text;
	}
}
//根据人员ID取员工职位:
function getStaffPost(_staffId){
	if(_staffId==null || _staffId ==undefined || _staffId=="" ){
		_staffId = getCurrentStaffId(); //若传入员工ID为空则取当前登录用户ID
	}
	var _staffPost = "";
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("get", "/servlet/staff_manage?tag=410&staffId="+_staffId, false);
	oXMLHTTP.send("");
	if (isSuccess(oXMLHTTP)) {
		_staffPost = oXMLHTTP.responseXML.selectSingleNode("/root/rowSet/STAFF_POST").text;
	}
	return _staffPost;
}
// 取得当前登陆员工姓名：
function getCurrentStaffName() {
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("get", "/servlet/util?OperType=6", false);
	oXMLHTTP.send("");
	if (isSuccess(oXMLHTTP)) {
		return oXMLHTTP.responseXML.selectSingleNode("/root/staff_name").text;
	}
}
// 查询数据并作为数组返回
function queryOneLineData(url) {
	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var filedtext = "TEXT";
	var retVal = []
	xmlhttp.Open("get", url, false);
	xmlhttp.send(null);
	if (!isSuccess(xmlhttp))
		return
	var dXML = new ActiveXObject("Microsoft.XMLDOM");
	dXML.load(xmlhttp.responseXML);
	var element = dXML.selectSingleNode("/root/rowSet");
	while (element != null) {
		var text = element.selectSingleNode(filedtext).text;
		retVal.push(text);
		element = element.nextSibling;
	}
	return retVal;
}

// 查询一行数据
function queryData(sql) {
	checkHasCryptoJS();
	var url = "/servlet/commonservlet?tag=201&paramValue="
	url += getAESEncode(encodeURIComponent(sql));
	return queryOneLineData(url);
}

var formUtil = {}

// Cookie名称
var CK_STAFF_ID = 'ITSM_CK_STAFF_ID'
var CK_BTYPE = 'ITSM_CK_BTYPE'
var CK_GROUP_ID = 'ITSM_CK_GROUP_ID'
var CK_REGION_ID = 'ITSM_CK_REGION_ID'
var CK_ORG_ID = 'ITSM_CK_ORG_ID'
var CK_CHOICE_FOUR = 'ITSM_CK_CHOICE_FOUR'
var CK_JTCSSP_FOUR_DEPT = 'ITSM_CK_JTCSSP_FOUR_DEPT'
var CK_TACHE_EXEC_STAFF_JSON = 'ITSM_CK_TACHE_EXEC_STAFF_JSON'
var CK_GROUP_ADD_STAFF_ID = 'ITSM_CK_GROUP_ADD_STAFF_ID'
var CK_PERMANAGER_NEID = 'ITSM_CK_PERMANAGER_NEID'
var CK_INIT_TCHCONTENT_DEPT = 'ITSM_CK_INIT_TCHCONTENT_DEPT'
var CK_HOME_PAGE_NAME = 'CK_HOME_PAGE_NAME'



/**************** ITSM监控首页融合 ****************/

// 取得当前登陆员工ID：
function getCurrentStaffId() {
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("get", "/servlet/util?OperType=6", false);
	oXMLHTTP.send("");
	if (isSuccess(oXMLHTTP)) {
		return oXMLHTTP.responseXML.selectSingleNode("/root/staff_id").text;
	}
}

// 查询多行数据
function queryAllData(sql) {
	checkHasCryptoJS();
	var url = "/servlet/commonservlet?tag=201&paramValue=";
	url += getAESEncode(encodeURIComponent(sql));
	return queryAllData_(url,sql);
}

// 设置cookie
function setCookie(key, val) {
	$.cookie(key)
	$.cookie(key, null)
	var date = new Date();
	date.setTime(date.getTime() + (3 * 24 * 60 * 60 * 1000));
	var ops = {
		path : '/',
		expires : date
	}
	$.cookie(key, val, ops);
}

// 删除cookie
function delCookie(hname) {
	$.cookie(hname)
	$.cookie(hname, null)
	var date = new Date();
	date.setTime(date.getTime() + (3 * 24 * 60 * 60 * 1000));
	var ops = {
		path : '/',
		expires : date
	}
	$.cookie(hname, '', ops);
}

// 查询数据并作为{}数组返回
function queryAllData_(url, bsql) {
	// ProbeHelper.enter("JS-通用查询进入 func"+url ,"2")
	 var sendXML='<?xml version="1.0" encoding="utf-8"?>'
           +  '<root isPage="true">'
           +    '<search pagesize="5" page="1" />'
            +   '<params/>' 
           +  '<sql><![CDATA['
           +    bsql
           +  ']]></sql>'
           +  '</root>';
           
	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var retVal = []
	xmlhttp.Open("GET", url, false);
	xmlhttp.send(sendXML);
	if (!isSuccess(xmlhttp))
		return
	var dXML = new ActiveXObject("Microsoft.XMLDOM");
	dXML.load(xmlhttp.responseXML);
	var element = dXML.selectSingleNode("/root/rowSet");
	while (element != null) {
		// 读取所有元素与对应值
		var childs = element.childNodes
		var obj = {}
		for (var i = 0; i < childs.length; i++) {
			var e = childs[i]
			var toel = 'obj.' + e.nodeName + '="' + e.text + '"';
			toel = toel.replace(/\n/g, '<br/>')
			//toel = toel.replace(/\n/g, ' ')
			try{
			    eval(toel)
			}catch(ex){
			    // 异常, 将值设置到备用属性
			    var errKey = "err" + i
			    obj[errKey] = e.text
			}
		}
		retVal.push(obj)
		element = element.nextSibling;
	}
	// ProbeHelper.leave("JS-通用查询结束","2")
	return retVal
}

// 获取系统当前路径的URL前缀层次级数 Laixh Add in 2010-03-18
function getSysPath(){
	var SysPath = "";
	var pathname = location.pathname.substring(1);
	if (pathname.indexOf('/') > -1) {
		pathname = pathname.substring(pathname.indexOf('/') + 1);
		var path_array = pathname.split("/");
		for (var i = 0; i < path_array.length; i++) {
			SysPath += "../";
		}
	}
	return SysPath;
}

// SQL EXECUTE 可执行一条SQL语句 返回:true/false
function executeSql(sql){
	var sendXML='<?xml version="1.0" encoding="utf-8"?>'
	      +'<root>'
	      +'<sql><![CDATA['+sql+']]></sql>'
	      + '</root>';
	var url = "/servlet/commonservlet?tag=9";
	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.open("GET",url,false);
	xmlhttp.send(sendXML);
	if(!isSuccess(xmlhttp)){
		return false;
	}else{
		return true;
	}
}

function formatBytes (baseNumber)
{
	var unit, unitDivisor, unitLabel;
	var unitDivisors = [1073741824, 1048576, 1024, 1];
	var unitLabels = ["GB", "MB", "KB", "B"];
	if (baseNumber === 0)
	{
		return "0 " + unitLabels[unitLabels.length - 1];
	}
	unit = baseNumber;
	unitLabel = unitLabels.length >= unitDivisors.length ? unitLabels[unitDivisors.length - 1] : "";
	for (var i = 0; i < unitDivisors.length; i++) 
	{
		if (baseNumber >= unitDivisors[i]) 
		{
			unit = (baseNumber / unitDivisors[i]).toFixed(2);
			unitLabel = unitLabels.length >= i ? " " + unitLabels[i] : "";
			break;
		}
	}
	return unit + unitLabel;
};

//取得当前登陆员工ID
function getCurrentStaffId()
{
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("POST", "/servlet/util?OperType=6", false);
	oXMLHTTP.send("");
	if (isSuccess(oXMLHTTP))
	{
		return oXMLHTTP.responseXML.selectSingleNode("/root/staff_id").text;
	}
}


/*
 * #迁移自ITSM中Common.js function getHasPrivilege(privilegeId, staffId) 函数
 * 判断某用户是否有某菜单ID的权限 privilegeId：菜单ID，staffId：用户ID（为空时为当前用户）； add laixh 20100411
 */
function getHasPrivilege(privilegeId, staffId) {
	if (privilegeId == "" || privilegeId == undefined) {
		return "false";
	}
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("get", "/servlet/staff_manage?tag=99&privilegeId="
					+ privilegeId + "&staffId=" + staffId, false);
	oXMLHTTP.send("");
	if (isSuccess(oXMLHTTP)) {
		return oXMLHTTP.responseXML.selectSingleNode("/root/HAS_PRIVILEGE").text;
	}
}

//TODO 浅层复制,后续者可以修改成深层复制
var extendOptions = function(o,n,override){
	for(var p in n){
	   if(n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override)){
	   	  o[p]=n[p];
	   }   
    }
    return o;
};

//获取当前系统日期{}
var getSysDate = function() {
	var today = new Date(),
	    year = today.getFullYear(),
	    month = today.getMonth() + 1
	    day = today.getDate(),
	    hours = today.getHours(),
	    minutes = today.getMinutes(),
	    seconds = today.getSeconds();
	
	function to2Digit(_value){ //转化成2位数
		return _value < 10 ? "0" + _value : _value;
	}
	    
	function getNowTime(_timeSeparatorChar){
		return hours + _timeSeparatorChar + to2Digit(minutes) + _timeSeparatorChar + to2Digit(seconds);
	}    
	
	function getNowDate(_dateSeparatorChar){
		return year + _dateSeparatorChar + to2Digit(month) + _dateSeparatorChar + to2Digit(day);
	}   

	
	return function(options){
		var defaults = {
			dateSeparatorChar : "-",
			timeSeparatorChar : ":", 
			dateType: "date"
	    },
	    dateTypes = {
	    	DATE : "date",
	    	DATE_TIME: "dateTime"
	    };
		options = extendOptions(defaults,options || {},true);
		if(options.dateType === dateTypes.DATE){
			return getNowDate(options.dateSeparatorChar);
		}else if(options.dateType === dateTypes.DATE_TIME){
			return getNowDate(options.dateSeparatorChar) + " " + getNowTime(options.timeSeparatorChar);
		} else {
			throw new Error("[dateType] param is error!");
		}
	}
}();

//根据用户ID获取用户名：
function getUserNameByStaffId(_staffId){
	if(_staffId==null || _staffId ==undefined || _staffId=="" ){
		return "";
	}
	//若第一个或最后一个字符为","测去掉：
	var n = _staffId.length;
	if(n>0){
		var sl = _staffId.substring(0,1); 	//左边第一个字符
		if(sl.indexOf(",")>-1){
			_staffId = _staffId.substring(1,_staffId.length)
		}
		var sr = _staffId.substring(_staffId.length-1, _staffId.length);	//最后一个字符
		if(sr.indexOf(",")>-1){
			_staffId = _staffId.substring(0, _staffId.length-1)
		}
	}
	
	var _staffName = "";
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("get", "/servlet/staff_manage?tag=411&staffIds="+_staffId, false);
	oXMLHTTP.send("");
	if (isSuccess(oXMLHTTP)) {
		var oRowSets = oXMLHTTP.responseXML.selectNodes("/root/rowSet");
   		for(var i = 0; i < oRowSets.length; i++) {
   			if (i == 0) {
   				_staffName += oRowSets[i].selectSingleNode("STAFF_NAME").text;
   			} else {
   				_staffName += ("," + oRowSets[i].selectSingleNode("STAFF_NAME").text);
   			}
   		}
	}
	
	return _staffName;
}


//取得当前登陆员工所属部门：
function getCurrentStaffOrg() {
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("get", "/servlet/util?OperType=6", false);
	oXMLHTTP.send("");
	if (isSuccess(oXMLHTTP)) {
		return oXMLHTTP.responseXML.selectSingleNode("/root/org_id").text;
	}
}

/**
 * 从iframe页面往父窗口激发指定事件
 * @param {} event
 */
function fire(event)
{
     var p = parent;     
     var ip;
     if(p) {
       for(var i=0; i<p.document.getElementsByTagName("iframe").length; i++) {
          var _src = (p.document.getElementsByTagName("iframe")[i]).src;
          var $href = _src.substring(_src.lastIndexOf('/')+1, _src.length);
          var _href = location.href.substring(location.href.lastIndexOf('/')+1, location.href.length);
          if($href==_href) {
             ip = (p.document.getElementsByTagName("iframe")[i]);
             break;
          }
       }
     }
     if(ip) ip.fireEvent(event);
}

//获取PROPERTY_CONFIG配置信息
function $getPropertyCfgVar(code)
{
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("POST","/servlet/util?OperType=11&code="+code,false);
	oXMLHTTP.send();
	if(isSuccess(oXMLHTTP)){
		return oXMLHTTP.responseXML.selectSingleNode("/root/value").text;
	}
}

// 取得员工信息
// key:staff_id或者user_name
// value:STAFF_ID,PASSWD,USER_NAME,STAFF_NAME,REGION_ID,REGION_NAME,ORG_ID,ORG_NAME,MOBILE,PHS,TEL,ADDRESS,FAX,EMAIL,CALLED_NAME
// type:1->key为staff_id，2->key为user_name,3->key 为staff_ids
// type!=3 : arguments[0]:key,arguments[1]:value,arguments[2]:type
function getStaffInfo(key, value, type) {
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	if (type != 3) {
		oXMLHTTP.open("POST", "/servlet/util?OperType=12&key=" + key + "&value=" + value + "&type=" + type, false);
		oXMLHTTP.send("");
		if (isSuccess(oXMLHTTP)) {
			return oXMLHTTP.responseXML.selectSingleNode("/root/value").text;
		}
	} else {
		oXMLHTTP.open("POST", "/servlet/util?OperType=12&key=" + key + "&type=" + type, false);
		oXMLHTTP.send("");
		return oXMLHTTP.responseXML;
	}
}

function hiddenObj(img, obj) {
	if (img != null && img != "" && typeof(img) == 'string') {
		var id = img;
		img = document.getElementById(id);
	}
	if (obj != null && obj != "" && typeof(obj) == 'string') {
		var id = obj;
		obj = document.getElementById(id);
	}
	if (obj.style.display == "none") {
		obj.style.display = "block";
		if (img != null && img != "") {
			img.innerHTML = "6";
		}
	} else {
		obj.style.display = "none";
		if (img != null && img != "") {
			img.innerHTML = "4";
		}
	}
}


// 根据 code_type 从 codelist 表获取数据，生成下拉列表
// 参数：
//		selectObjId: select 的 id
//		codeType: codelist 表的 code_type
//		emptyText: 非null时将添加空值选项，显示文本为 emptyText(可选)
function loadCodeList(selectObjId, codeType, emptyText) {
	var selectObj = document.getElementById(selectObjId);

	if (!selectObj)
		return;

	selectObj.options.length = 0;
	
	if (emptyText != null) {
		selectObj.add(new Option(emptyText, ''));
	}

	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.open("POST", "/servlet/codeListCtrl.do?method=getCodeList&type=" + codeType, false);
	xmlhttp.send();
	if (isSuccess(xmlhttp))	{
		var nodes = xmlhttp.responseXML.selectNodes("/root/rowSet");
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
					
			var value = node.selectSingleNode("CODE").text;
			var text = node.selectSingleNode("MEAN").text;	
			selectObj.add(new Option(text, value));
		}
	}
}

/**
 * getElementsByName("SPAN","name");
 * @param {} tag
 * @param {} name
 * @return {}
 */
function getElementsByName(tag, name) {
	var returns = document.getElementsByName(name);
	if (returns.length > 0)
		return returns;
	returns = new Array();
	var e = document.getElementsByTagName(tag);
	for (var i = 0; i < e.length; i++) {
		if (e[i].getAttribute("name") == name) {
			returns[returns.length] = e[i];
		}
	}
	return returns;
}

/**
 * setProcPathByIframeId 处理过程路径切换 PATCH_20131224_00830_panqd
 * called like this --->setProcPathByIframeId.call(oForm,ifmId);
 * @param {} ifmId
 * @param {} extendParam 流程处理页面规定的其他参数
 */
function setProcPathByIframeId(ifmId, extendParam){
	var ifmObj = document.getElementById(ifmId);
	if(!ifmObj){
		return ;
	}
	extendParam = extendParam || {};
	var realRootPath = "/";
	var procPath = $getSysVar("FLOW_PROC_PATH");
	var absPath = realRootPath + procPath + "?";
	var params = new Array();
	params.push("topFlowId="+this.FLOW.TOP_FLOW_ID);
	params.push("flowId="+this.FLOW.FLOW_ID);
	params.push("tchId="+this.FLOW.TCH_ID);
	for(var k in extendParam){
		params.push(k+"="+extendParam[k])
	}
	absPath += params.join("&");
	ifmObj.src = absPath;
}

/**
 * 用于格式化语言资源
 * 调用方法:
 * var str = "where are {0} ?";
 * formatResource(str,"you");
 */
function formatResource() {
    if( arguments.length == 0 )
        return null;
    var str = arguments[0];
    for(var i=1;i<arguments.length;i++) {
        var re = new RegExp('\\{' + (i-1) + '\\}','gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
}


/**
 * 获取级联的下拉值
 * selectObjId:子下拉框的Id
 * domainType:对应tp_tree_type表中的domain_type
 * parentTypeCode:当前父下拉框的值
 * hasEmptyRow:是否拥有初始空行[true,false]
 */
function getTpTreeTypeValue(selectObjId,domainType,parentTypeCode,hasEmptyRow){
	var selectObj = document.getElementById(selectObjId);

	if (!selectObj)
		return;
	else
	    selectObj.options.length = 0;
	
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.open("POST", "/servlet/util?OperType=14&domainType="+ domainType +"&parentCode="+parentTypeCode,false);
	xmlhttp.send();
	if (isSuccess(xmlhttp))	{
		var nodes = xmlhttp.responseXML.selectNodes("/root/rowSet");
		if(hasEmptyRow==true){
			selectObj.add(new Option('',''));
		}
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			var value = node.selectSingleNode("TYPE_CODE").text;
			var text = node.selectSingleNode("TYPE_NAME").text;	
			selectObj.add(new Option(text, value));
		}
	}
}

function createSelect(url, obj, blank) {
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("get", url, false);
	xmlhttp.send();
	if (!isSuccess(xmlhttp))
		return
	var dXML = new ActiveXObject("Microsoft.XMLDOM");
	dXML.load(xmlhttp.responseXML);

	obj.length = 0;
	var element = dXML.selectSingleNode("/root/rowSet");
	
	var option = document.createElement("option");
	
	if (blank == null || blank == "") {
		obj.add(new Option("", ""));
	}
	while (element != null) {
		var text = element.selectSingleNode("TEXT").text;
		var val = element.selectSingleNode("VALUE").text;
		var objOption = new Option(text, val);
		obj.add(objOption);
		element = element.nextSibling;
	}
}

/**
 * 在grid的表单格渲染的时候,默认是innerHTML方式渲染,此方式会造成跨站脚本攻击
 * 跨站脚本测试字符串 222"><img/src=1 onerror=alert(2)>
 * @author panqd
 * @使用方式 get_value_cfg_field.config_script使用下列配置 PS:由于部分列已经使用tip,故提供下列参考方式
 * {renderer: innerTextRender().htmltip} 内容按照文本显示,提示信息如果带有html标签仍然会按照html解析
 * {renderer: innerTextRender().texttip}  内容按照文本显示,提示信息如果带有html仍然按照文本显示
 * {renderer: innerTextRender().notip}    内容按照文本显示
 */
function innerTextRender(){
	var div = document.createElement("div");
	return {
		htmltip:function(value, record, attr){/**该qtip的value不加xmlEncode仍然按照html解析,会出现跨站脚本攻击*/
			div["ext:qtip"] = "<div style=\"font-size:10pt;padding:3;\">"+ value +"</div>";
			div["ext:qtitle"] ="详细信息:";
			div.innerText= value;
			return div.outerHTML; 
		},
		texttip:function(value, record, attr){
			div["ext:qtip"] = "<div style=\"font-size:10pt;padding:3;\">"+ xmlEncode(value) +"</div>";
			div["ext:qtitle"] ="详细信息:";
			div.innerText= value;
			return div.outerHTML; 
		},
		notip:function(value, record, attr){
			div.innerText= value;
			return div.outerHTML;
		}
	};
}

/**
 * ie下模拟html5的placeholder
 * @param oTextbox : element,必须拥有placeholder属性
 * @returns
 */
function handlePlaceholder(oTextbox) {
    var curPlaceholder = oTextbox.getAttribute("placeholder");
    if (curPlaceholder && curPlaceholder.length > 0 && oTextbox.value == '') {
        oTextbox.value = curPlaceholder;
        oTextbox.setAttribute("old_color", oTextbox.style.color);
        oTextbox.style.color = "#c0c0c0";
        oTextbox.onfocus = function() {
            this.style.color = this.getAttribute("old_color");
            if (this.value === curPlaceholder)
                this.value = "";
        };
        oTextbox.onblur = function() {
            if (this.value === "") {
                this.style.color = "#c0c0c0";
                this.value = curPlaceholder;
            }
        }
    }
}


/**
 * 获取自定义查询结果，返回 json 数组
 * 针对 Result.js 的浅封装，方便以 json 格式操作数据
 * 参数:
 *		cfgName: 自定义查询名(VALUE_CFG_PARAM.PARAM_NAME)或 id
 *		callback: 回调函数
 *		async: 是否异步，默认 true(可选参数)
 * e.g.
 *		var dataHandler = ResultUtil.query('GET_CI_PERF_CONFIG', function(datas) {
 *			for (var i = 0; i < datas.length; i++) {
 *				//....
 *			}
 *		});
 *		dataHandler.refresh(); // 或 dataHandler.refresh({param1: 'xx', param2: 'yy'})
 */
var ResultUtil = {
	cfgHolder: {},
	// 预加载查询配置
	setCfgCache: function(cfgs) {
		this.cfgHolder = cfgs || {};	
	},

	onceDataCache: {},
	setOnceDataCache: function(datas) {
		this.onceDataCache = datas || {};	
	},

	// 
	query: function(cfgName, callback, async) {
		var self = this;
		var handler = ResultFactory.newResult(this.cfgHolder[cfgName] || cfgName);

		if (handler == null) {
			alert('自定义查询配置不存在[' + cfgName + ']，请检查');
			return {
				refresh: function(){}	
			};
		}

		handler.onLoad = function(oXml) {
			var dataList = [];

			// 将 <rowSet><t1>xx</t1><t2>yy</t2> 转换为 {t1: xx, t2:yy}
			var rows = oXml.selectNodes('/root/rowSet');
			for (var i = 0; i < rows.length; i++) {
				var data = {};
				for (var j = 0; j < rows[i].childNodes.length; j++) {
					var node = rows[i].childNodes[j];
					data[node.tagName] = node.text;
				}

				dataList.push(data);
			}

			callback(dataList);
		};

		// 获取列名信息
		handler.getColumnCfg = function() {
			this.loadRenderCfg();

			return this.renderCfg.fields;
		};

		// dataSource: jndi 数据源名称，可选
		handler.refresh = function(p, dataSource) {
			var params = p || {};
			if (dataSource) {
				params.__DATA_SOURCE = dataSource;	
			}

			handler.send(Result.FORCE_GET, p);
		};

		if (this.onceDataCache[cfgName]) {
			var oldRefreshFn = handler.refresh;	
			handler.refresh = function() {
				var cacheData = self.onceDataCache[cfgName];
				this.onLoad(cacheData);

				self.onceDataCache[cfgName] = null;

				handler.refresh = oldRefreshFn;
			}
		}

		if (async === false) {
			handler.async = false;	
		}

		return handler;
	}
}

function checkLua(fn){
	if (fn == null || fn == ""){
		alert("请输入lua脚本");
		return false;
	}
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST","/servlet/taskConfigServlet?tag=61&fn="+fn,false);
    xmlhttp.send();
    if(isSuccess(xmlhttp))
    {
        return true;
    }else{
    	alert("Lua脚本校验出错");
    }
}

//根据flowNum获取flowMod
function getFlowModByFlowNum(flowNum){
	var submitURL ="/servlet/flowOper?OperType=24&flowNum="+flowNum;
	xmlhttp.open("POST", submitURL, false);
	xmlhttp.send();
	if(isSuccess(xmlhttp)){
		var nodes = xmlhttp.responseXML.selectNodes("/root/rowSet");
		if(nodes.length<=0){
			return "";
		}else{
			return nodes[0].selectSingleNode("FLOW_MOD").text;
		}
	}
	return "";
}

function checkHasCryptoJS() {
	if(typeof CryptoJS === "undefined" ||
		(typeof window.CryptoJS !== "undefined" && typeof CryptoJS.enc === "undefined")) {
		$import("../../resource/js/encode/aes.js", "Common.js");
		$import("../../resource/js/encode/mode-ecb.js", "Common.js");
	}
}

/**
 * getAESEncode sql注入加密函数
 */
function getAESEncode(p_sql){
	var encryptedStr = "";
	var keyStr = "0102030405060708";
	var key = CryptoJS.enc.Utf8.parse(keyStr);
	var srcs = CryptoJS.enc.Utf8.parse(p_sql);
	var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB});
	encryptedStr = encrypted.ciphertext.toString();
	return encryptedStr;
}

/**
 * encodeXmlSrc 针对multiSelect的xmlSrc等组件的sql注入加密改造
 */
function encodeXmlSrc(domId,sql){
	var dom = document.getElementById(domId);
	var eSql = getAESEncode(encodeURIComponent(sql));
	var url = "/servlet/commonservlet?tag=201&paramValue=" + eSql;
	dom.xmlSrc = url;
	if(typeof dom.doRefresh === 'function'){
		dom.doRefresh(); // 要显示调用该方法, 详情见源代码multiSelect.htc
	}
}

/**
 * 弹出div层
 *  eg./workshop/config/autoFindProcess/processFilterCfg.jsp
 */
var PopUpLayer = {
	//移动层
	dragOper: function(oWin) {
		 var e = window.event;
		 var oBody = document.body;
		 var x = e.clientX + oBody.scrollLeft - oWin.style.pixelLeft;
		 var y = e.clientY + oBody.scrollTop - oWin.style.pixelTop;
	   
		 var move = function() {
			if (e.button == 1) {				
				var newX = e.clientX + oBody.scrollLeft - x;
				var newY = e.clientY + oBody.scrollTop - y;
				oWin.style.pixelLeft = newX;
				oWin.style.pixelTop = newY;
			} else {
				document.detachEvent("onmousemove", move);
			}		
		 }
		 document.attachEvent("onmousemove", move);
		 e.cancelBubble = true;
	},
	
	//展示div maskDivId 遮罩层div showDivId要展示的div
	showDiv: function(maskDivId, showDivId) {
		var height = document.body.clientHeight > document.body.scrollHeight ? document.body.clientHeight : document.body.scrollHeight;
		PopUpLayer.getObj(maskDivId).style.height =  height;
		PopUpLayer.getObj(maskDivId).style.display = "block";//遮罩层
		
		var obj = PopUpLayer.getObj(showDivId);		
		obj.style.display = "block";
		obj.style.top = (document.body.clientHeight-obj.offsetHeight)/2;
		obj.style.left = (document.body.clientWidth-obj.offsetWidth)/2;
	},
	
	//隐藏div
	hideDiv: function(maskDivId, showDivId) {
		PopUpLayer.getObj(maskDivId).style.display = "none";
		PopUpLayer.getObj(showDivId).style.display = "none";
	},
	
	//获取对象
	getObj: function(id) {
		return document.getElementById(id);
	}
}

/**
 * 请求模块数据 eg
 * var modelName = new Object();
    	modelName.MODEL_NAME = 'FLASH_CHART'; //图表为 FLASH_CHART  	
    	modelName.DIV_ID = 'flah_div1';//调用该方法前 该divId需先存在
    	modelName.GET_VALUE_CFG_ID = '80236';
    	modelName.WIDTH = '400';
    	modelName.HEIGHT = '300'; 
    	modelName.JSONPARAM: {},//json格式的参数对象 和以前类似
		modelName。CALLBACK: 'resourceAllDetail.modelNameXnh2Func' //图表加载完执行的回调方法  	   	
    	
    	var array = [];
    	array.push(modelName); //有几个图表传几个modelName对象  	
    	
    	var dataObj = new Object();
    	dataObj.source = 'html';//固定为html
    	dataObj.pageFlag = '2';//非必须
    	dataObj.modelName = JSON.stringify(array);
    	
    	getModelData(dataObj);    	 
 */
function getModelData(data, callback, url) {
	$.ajax({
		 url: url || '/servlet/BigPipeServlet',
		 type: 'POST',
		 data: data || null,
		 success: callback,
		 dataType: 'script'
	});
}

/**
 * 构建flash图表，该方法在java中调用
 * chartMap 存图表对象，全局变量
 */
var chartMap = {};
function setChartData(obj, callback) {
	$('#' + obj.id).empty();//清空div
		
	var cfg = {
         renderTo: obj.id, 
         height: obj.height || 300,
         width: obj.width || 400, 
         cfgData : obj.chartCfg,
		 resultData : obj.chartResult,		
         border : false,
         cache : obj.cache || true
	}
	
	var chartObj = new FusionChart(cfg);
	//有回调函数的话，加载完图表执行
	if(callback) {
		chartObj.FCharts.oChart.addEventListener("dataUpdated", function(eventObj, dataObj) {		
			callback(eventObj, dataObj);
		});
	}
	
	var chartDataDom = new ActiveXObject("Microsoft.XMLDOM");
	chartDataDom.loadXML(obj.chartData);
	chartObj.setChartDataXML(chartDataDom);
	
	var objC = {'divId': obj.id, 'chartObj': chartObj, 'jsonParam': obj.jsonParam};
	chartMap[obj.id] = objC;
}

function isUndefined(a){
	return typeof a == "undefined";
}


function doRepeat(arr)
{
	var d = [], hash={};
	
	for(var i=0; i<arr.length; i++)
	{
		var a = arr[i];
		if(!hash[a])
		{
			d.push(a);
			hash[a] = true;
		}
	}
	
	return d;
}


Array.prototype.remove=function(dx) 
{ 
    if(isNaN(dx)||dx>this.length){return false;} 
    for(var i=0,n=0;i<this.length;i++) 
    { 
        if(this[i]!=this[dx]) 
        { 
            this[n++]=this[i] 
        } 
    } 
    this.length-=1 
} 

var bigPipeChartCount = 0;
function setFmwChartData(obj, callback){
	var panel = Ext.getCmp(obj.id); 
	if(obj.descText)
	{
		panel.descText = obj.descText ;
		panel.createDescText();
		panel.descCount ++;
	}
	if(obj.descTitle)
	{
		panel.descTitle = obj.descTitle ;
		panel.createDescTitle();
		panel.descCount ++;
	}
	if(obj.descLeft)
	{
		panel.descLeft = obj.descLeft ;
		panel.createDescLeft();
		panel.descCount ++;
	}
	panel.setResultCfg(obj.chartResult);
	panel.renderBigPipeChart(obj.chartData);
	bigPipeChartCount++;
	if(Global && Global.arrModeCfg && bigPipeChartCount == Global.arrModeCfg.length)
	{
		Global.bigPipeIsLoading = false;
	}
}