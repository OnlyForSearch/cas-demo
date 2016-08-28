/**
 * ���õ�һЩJavaScript����
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

//���油�� Add By Panqd
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

// ͨ��ָ����ǩ�õ�ָ������ĸ��׽ڵ�
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

// ͨ��ָ�������Name�õ�����
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

// �ж�һ���ڵ��ǲ������һ���ڵ�
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

// �ж�һ���ڵ��ǲ��ǵ�һ���ڵ�
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

// �ж��������Ƿ����ĳ��ֵ
function hasItem(array, val)
{
	for (var i = 0; i < array.length && array[i] != val; i++);
	return !(i == array.length);
}

// ˢ��ҳ��
function refresh()
{
	location.reload();
}

// �����js�ļ��ĵ�ַת��Ϊ���js����ҳ��ĵ�ַfilePath:�ļ����js�ļ��ĵ�ַ,js�ļ�������
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

// ����ҳ��ı���(����BUG,�д�����)
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
			document.title += "��";
		}
	}
	else
	{
		location.reload();
	}
}

// �õ�ָ��css�ļ����ڵ�·��
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

// �õ�ָ��js�ļ����ڵ�·��
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

// �õ�window������ScreenTopֵ(�������е�����)
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

// �õ�window������ScreenLeftֵ(�������е�����)
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

// �õ�ִ�гɹ�������ݵ�����
function getMsgXML(dom)
{
	var xmlDom = new ActiveXObject("Microsoft.XMLDOM");
	xmlDom.loadXML(dom.documentElement.lastChild.xml);
	return xmlDom;
}

// �õ�ִ�гɹ�������ݵ��ڵ�
function getMsgNode(dom)
{
	return dom.documentElement.lastChild;
}

// �õ�url������
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

// �õ�������URL�ַ��� HB_FAULT_POST����
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
// �۽�������
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
// ���ĳ�������µĵ�һ��
function getMonthFirstDay(d)
{
	var year = d.getYear();
	var month = d.getMonth() + 1 + "";
	month = (month.length == 1) ? "0" + month : month;
	return (year + "-" + month + "-01");
}
// ���ĳ�������µ����һ��
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
// ���ڼ��ϼ���
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

// xml�������ַ�����
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
		EMsg(name + " ֻ֧������!");
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
			alert("����"+url+"����");
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
				//  �����Ѿ�����ı�ʶ
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

// ҳ�������е�INPUT ��ֵ���澯��Ϣ ������Ϣ�����õ�
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
 * @param {} duringDays ���뵱ǰʱ������������,�����ɸ�,û�еĻ���ȡ��ǰʱ��
 * @return {}
 * ===============================================
 * ����:2014-08-11 panqd �޸Ĵ�sql�Ĳ�����ʽ
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
 * @param {} hasTime �Ƿ��ʱ���ʽ
 * @return {}
 * ===============================================
 * ����:2014-08-29 panqd �޸Ĵ�sql�Ĳ�����ʽ 
 * PATCH_20140729_01577_panqd_�޸�SQLע�����SQL��� PATCH_20140805_01589_chenzw �����������̸�������� ����
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
					+ "<span style='font-family:����;font-size:9pt;font-weight:bold'>"
					+ "<br><br><br>���ڶ�ȡ����<br>���Ժ�......" + "</span>" + "</div>";
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

// ��ѯ˫����������ѡ����
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
    // ��������ʽ��ǰ��ո�
    // �ÿ��ַ��������
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
// ȡ�õ�ǰ��½�û�����
function getCurrentUserInfo(field) {
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("get", "/servlet/util?OperType=6", false);
	oXMLHTTP.send("");
	if (isSuccess(oXMLHTTP)) {
		return oXMLHTTP.responseXML.selectSingleNode("/root/"+field).text;
	}
}
//������ԱIDȡԱ��ְλ:
function getStaffPost(_staffId){
	if(_staffId==null || _staffId ==undefined || _staffId=="" ){
		_staffId = getCurrentStaffId(); //������Ա��IDΪ����ȡ��ǰ��¼�û�ID
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
// ȡ�õ�ǰ��½Ա��������
function getCurrentStaffName() {
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("get", "/servlet/util?OperType=6", false);
	oXMLHTTP.send("");
	if (isSuccess(oXMLHTTP)) {
		return oXMLHTTP.responseXML.selectSingleNode("/root/staff_name").text;
	}
}
// ��ѯ���ݲ���Ϊ���鷵��
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

// ��ѯһ������
function queryData(sql) {
	checkHasCryptoJS();
	var url = "/servlet/commonservlet?tag=201&paramValue="
	url += getAESEncode(encodeURIComponent(sql));
	return queryOneLineData(url);
}

var formUtil = {}

// Cookie����
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



/**************** ITSM�����ҳ�ں� ****************/

// ȡ�õ�ǰ��½Ա��ID��
function getCurrentStaffId() {
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("get", "/servlet/util?OperType=6", false);
	oXMLHTTP.send("");
	if (isSuccess(oXMLHTTP)) {
		return oXMLHTTP.responseXML.selectSingleNode("/root/staff_id").text;
	}
}

// ��ѯ��������
function queryAllData(sql) {
	checkHasCryptoJS();
	var url = "/servlet/commonservlet?tag=201&paramValue=";
	url += getAESEncode(encodeURIComponent(sql));
	return queryAllData_(url,sql);
}

// ����cookie
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

// ɾ��cookie
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

// ��ѯ���ݲ���Ϊ{}���鷵��
function queryAllData_(url, bsql) {
	// ProbeHelper.enter("JS-ͨ�ò�ѯ���� func"+url ,"2")
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
		// ��ȡ����Ԫ�����Ӧֵ
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
			    // �쳣, ��ֵ���õ���������
			    var errKey = "err" + i
			    obj[errKey] = e.text
			}
		}
		retVal.push(obj)
		element = element.nextSibling;
	}
	// ProbeHelper.leave("JS-ͨ�ò�ѯ����","2")
	return retVal
}

// ��ȡϵͳ��ǰ·����URLǰ׺��μ��� Laixh Add in 2010-03-18
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

// SQL EXECUTE ��ִ��һ��SQL��� ����:true/false
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

//ȡ�õ�ǰ��½Ա��ID
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
 * #Ǩ����ITSM��Common.js function getHasPrivilege(privilegeId, staffId) ����
 * �ж�ĳ�û��Ƿ���ĳ�˵�ID��Ȩ�� privilegeId���˵�ID��staffId���û�ID��Ϊ��ʱΪ��ǰ�û����� add laixh 20100411
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

//TODO ǳ�㸴��,�����߿����޸ĳ���㸴��
var extendOptions = function(o,n,override){
	for(var p in n){
	   if(n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override)){
	   	  o[p]=n[p];
	   }   
    }
    return o;
};

//��ȡ��ǰϵͳ����{}
var getSysDate = function() {
	var today = new Date(),
	    year = today.getFullYear(),
	    month = today.getMonth() + 1
	    day = today.getDate(),
	    hours = today.getHours(),
	    minutes = today.getMinutes(),
	    seconds = today.getSeconds();
	
	function to2Digit(_value){ //ת����2λ��
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

//�����û�ID��ȡ�û�����
function getUserNameByStaffId(_staffId){
	if(_staffId==null || _staffId ==undefined || _staffId=="" ){
		return "";
	}
	//����һ�������һ���ַ�Ϊ","��ȥ����
	var n = _staffId.length;
	if(n>0){
		var sl = _staffId.substring(0,1); 	//��ߵ�һ���ַ�
		if(sl.indexOf(",")>-1){
			_staffId = _staffId.substring(1,_staffId.length)
		}
		var sr = _staffId.substring(_staffId.length-1, _staffId.length);	//���һ���ַ�
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


//ȡ�õ�ǰ��½Ա���������ţ�
function getCurrentStaffOrg() {
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("get", "/servlet/util?OperType=6", false);
	oXMLHTTP.send("");
	if (isSuccess(oXMLHTTP)) {
		return oXMLHTTP.responseXML.selectSingleNode("/root/org_id").text;
	}
}

/**
 * ��iframeҳ���������ڼ���ָ���¼�
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

//��ȡPROPERTY_CONFIG������Ϣ
function $getPropertyCfgVar(code)
{
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("POST","/servlet/util?OperType=11&code="+code,false);
	oXMLHTTP.send();
	if(isSuccess(oXMLHTTP)){
		return oXMLHTTP.responseXML.selectSingleNode("/root/value").text;
	}
}

// ȡ��Ա����Ϣ
// key:staff_id����user_name
// value:STAFF_ID,PASSWD,USER_NAME,STAFF_NAME,REGION_ID,REGION_NAME,ORG_ID,ORG_NAME,MOBILE,PHS,TEL,ADDRESS,FAX,EMAIL,CALLED_NAME
// type:1->keyΪstaff_id��2->keyΪuser_name,3->key Ϊstaff_ids
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


// ���� code_type �� codelist ���ȡ���ݣ����������б�
// ������
//		selectObjId: select �� id
//		codeType: codelist ��� code_type
//		emptyText: ��nullʱ����ӿ�ֵѡ���ʾ�ı�Ϊ emptyText(��ѡ)
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
 * setProcPathByIframeId �������·���л� PATCH_20131224_00830_panqd
 * called like this --->setProcPathByIframeId.call(oForm,ifmId);
 * @param {} ifmId
 * @param {} extendParam ���̴���ҳ��涨����������
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
 * ���ڸ�ʽ��������Դ
 * ���÷���:
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
 * ��ȡ����������ֵ
 * selectObjId:���������Id
 * domainType:��Ӧtp_tree_type���е�domain_type
 * parentTypeCode:��ǰ���������ֵ
 * hasEmptyRow:�Ƿ�ӵ�г�ʼ����[true,false]
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
 * ��grid�ı�����Ⱦ��ʱ��,Ĭ����innerHTML��ʽ��Ⱦ,�˷�ʽ����ɿ�վ�ű�����
 * ��վ�ű������ַ��� 222"><img/src=1 onerror=alert(2)>
 * @author panqd
 * @ʹ�÷�ʽ get_value_cfg_field.config_scriptʹ���������� PS:���ڲ������Ѿ�ʹ��tip,���ṩ���вο���ʽ
 * {renderer: innerTextRender().htmltip} ���ݰ����ı���ʾ,��ʾ��Ϣ�������html��ǩ��Ȼ�ᰴ��html����
 * {renderer: innerTextRender().texttip}  ���ݰ����ı���ʾ,��ʾ��Ϣ�������html��Ȼ�����ı���ʾ
 * {renderer: innerTextRender().notip}    ���ݰ����ı���ʾ
 */
function innerTextRender(){
	var div = document.createElement("div");
	return {
		htmltip:function(value, record, attr){/**��qtip��value����xmlEncode��Ȼ����html����,����ֿ�վ�ű�����*/
			div["ext:qtip"] = "<div style=\"font-size:10pt;padding:3;\">"+ value +"</div>";
			div["ext:qtitle"] ="��ϸ��Ϣ:";
			div.innerText= value;
			return div.outerHTML; 
		},
		texttip:function(value, record, attr){
			div["ext:qtip"] = "<div style=\"font-size:10pt;padding:3;\">"+ xmlEncode(value) +"</div>";
			div["ext:qtitle"] ="��ϸ��Ϣ:";
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
 * ie��ģ��html5��placeholder
 * @param oTextbox : element,����ӵ��placeholder����
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
 * ��ȡ�Զ����ѯ��������� json ����
 * ��� Result.js ��ǳ��װ�������� json ��ʽ��������
 * ����:
 *		cfgName: �Զ����ѯ��(VALUE_CFG_PARAM.PARAM_NAME)�� id
 *		callback: �ص�����
 *		async: �Ƿ��첽��Ĭ�� true(��ѡ����)
 * e.g.
 *		var dataHandler = ResultUtil.query('GET_CI_PERF_CONFIG', function(datas) {
 *			for (var i = 0; i < datas.length; i++) {
 *				//....
 *			}
 *		});
 *		dataHandler.refresh(); // �� dataHandler.refresh({param1: 'xx', param2: 'yy'})
 */
var ResultUtil = {
	cfgHolder: {},
	// Ԥ���ز�ѯ����
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
			alert('�Զ����ѯ���ò�����[' + cfgName + ']������');
			return {
				refresh: function(){}	
			};
		}

		handler.onLoad = function(oXml) {
			var dataList = [];

			// �� <rowSet><t1>xx</t1><t2>yy</t2> ת��Ϊ {t1: xx, t2:yy}
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

		// ��ȡ������Ϣ
		handler.getColumnCfg = function() {
			this.loadRenderCfg();

			return this.renderCfg.fields;
		};

		// dataSource: jndi ����Դ���ƣ���ѡ
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
		alert("������lua�ű�");
		return false;
	}
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST","/servlet/taskConfigServlet?tag=61&fn="+fn,false);
    xmlhttp.send();
    if(isSuccess(xmlhttp))
    {
        return true;
    }else{
    	alert("Lua�ű�У�����");
    }
}

//����flowNum��ȡflowMod
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
 * getAESEncode sqlע����ܺ���
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
 * encodeXmlSrc ���multiSelect��xmlSrc�������sqlע����ܸ���
 */
function encodeXmlSrc(domId,sql){
	var dom = document.getElementById(domId);
	var eSql = getAESEncode(encodeURIComponent(sql));
	var url = "/servlet/commonservlet?tag=201&paramValue=" + eSql;
	dom.xmlSrc = url;
	if(typeof dom.doRefresh === 'function'){
		dom.doRefresh(); // Ҫ��ʾ���ø÷���, �����Դ����multiSelect.htc
	}
}

/**
 * ����div��
 *  eg./workshop/config/autoFindProcess/processFilterCfg.jsp
 */
var PopUpLayer = {
	//�ƶ���
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
	
	//չʾdiv maskDivId ���ֲ�div showDivIdҪչʾ��div
	showDiv: function(maskDivId, showDivId) {
		var height = document.body.clientHeight > document.body.scrollHeight ? document.body.clientHeight : document.body.scrollHeight;
		PopUpLayer.getObj(maskDivId).style.height =  height;
		PopUpLayer.getObj(maskDivId).style.display = "block";//���ֲ�
		
		var obj = PopUpLayer.getObj(showDivId);		
		obj.style.display = "block";
		obj.style.top = (document.body.clientHeight-obj.offsetHeight)/2;
		obj.style.left = (document.body.clientWidth-obj.offsetWidth)/2;
	},
	
	//����div
	hideDiv: function(maskDivId, showDivId) {
		PopUpLayer.getObj(maskDivId).style.display = "none";
		PopUpLayer.getObj(showDivId).style.display = "none";
	},
	
	//��ȡ����
	getObj: function(id) {
		return document.getElementById(id);
	}
}

/**
 * ����ģ������ eg
 * var modelName = new Object();
    	modelName.MODEL_NAME = 'FLASH_CHART'; //ͼ��Ϊ FLASH_CHART  	
    	modelName.DIV_ID = 'flah_div1';//���ø÷���ǰ ��divId���ȴ���
    	modelName.GET_VALUE_CFG_ID = '80236';
    	modelName.WIDTH = '400';
    	modelName.HEIGHT = '300'; 
    	modelName.JSONPARAM: {},//json��ʽ�Ĳ������� ����ǰ����
		modelName��CALLBACK: 'resourceAllDetail.modelNameXnh2Func' //ͼ�������ִ�еĻص�����  	   	
    	
    	var array = [];
    	array.push(modelName); //�м���ͼ������modelName����  	
    	
    	var dataObj = new Object();
    	dataObj.source = 'html';//�̶�Ϊhtml
    	dataObj.pageFlag = '2';//�Ǳ���
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
 * ����flashͼ���÷�����java�е���
 * chartMap ��ͼ�����ȫ�ֱ���
 */
var chartMap = {};
function setChartData(obj, callback) {
	$('#' + obj.id).empty();//���div
		
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
	//�лص������Ļ���������ͼ��ִ��
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