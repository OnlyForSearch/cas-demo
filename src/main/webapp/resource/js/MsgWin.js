//定义默认语言资源
var msgWinJSDefaultLang = {
	msgTitle : '待处理工作，请尽快处理'
};
//获取语言资源
function getMsgWinJsLan(code)
{
	if(typeof(ItmLang) == 'undefined' || typeof(ItmLang.widgets) == 'undefined')
	{
		return eval('msgWinJSDefaultLang.' + code);
	}
	else
	{
		 return eval('ItmLang.widgets.msgWinJS.' + code);
	}
}

var MSGWIN_STEP = 17;
var MSGWIN_ACCELERATION = 1;
var MSGWIN_JS_NAME = 'MsgWin.js';
var MSGWIN_TITLE_HEIGHT = 22;

function MsgWin()
{
	this.titile = getMsgWinJsLan('msgTitle');
	this.contentXML;
	this.id = 'MSNMsg_' + document.uniqueID;
	this.height = 140;
	this.width = 200;
	//需要扣除标题的高度和两条边4个像素
	this.contentHeight = this.height - MSGWIN_TITLE_HEIGHT - 4;
	this.imgUrl = getRealPath('../image/msgWin/',MSGWIN_JS_NAME);
	this.oMsgWin;
	this.finishHeight;
	this.objTimer;
	this.step = MSGWIN_STEP;
}

MsgWin.prototype.show = function (_contentXML, _position)
{
	this.contentXML = (_contentXML)?_contentXML:"";
	var outHTML = '<div id="'+this.id+'" onselectstart="return false" style="'
				+   'BORDER-TOP: #a6b4cf 1px solid;'
				+   'BORDER-RIGHT: #455690 1px solid;'
				+   'BORDER-BOTTOM: #455690 1px solid;'
				+   'BORDER-LEFT: #a6b4cf 1px solid;'
				+	'POSITION: absolute;'
				+	'Z-INDEX:99;'
				+	'TOP: 0px;'
				+	'LEFT: 0px;'
				+	'WIDTH: '+this.width+'px;'
				+	'HEIGHT: '+this.height+'px;"> <iframe style="position:absolute;width:100%;height:100%;_filter:alpha(opacity=0);opacity=0;border-style:none; z-index:-1"></iframe>'
				+	  '<div style="'
				+       'BORDER-TOP: white 1px solid;'
				+		'BORDER-RIGHT: #CFDEF4 1px solid;'
				+		'BORDER-BOTTOM: #CFDEF4 1px solid;'
				+		'BORDER-LEFT: white 1px solid;">'
				+		  '<div style="'
				+			'background-image:url('+this.imgUrl+'msg_title_bg.gif);'
				+			'height:'+MSGWIN_TITLE_HEIGHT+'px;'
				+			'padding:2px 0px 0px 5px">'
				+			  '<table width="100%"><tr><td><img src="'+this.imgUrl+'msg.gif" align="absmiddle">'
				+			  '</td><td><span style="color:#1F336B;margin:3px 0px 0px 6px;">' 
				+				this.titile
				+		      '</span>'
				+			  '</td><td align="right"><img src="'+this.imgUrl+'msg_close.gif"  onclick="msgWinClose();"></td></tr></table>'
				+		  '</div>'
				+	  	  '<div id="refresh" style="'
				+			'filter:progid:DXImageTransform.Microsoft.gradient(startcolorstr=#CFDDF4,endcolorstr=white,gradientType=0);'
				+			'height:'+this.contentHeight+';'
				+			'BORDER-TOP: #728EB8 1px solid;'
				+			'BORDER-RIGHT: #B9C9EF 1px solid;'
				+			'BORDER-BOTTOM: #B9C9EF 1px solid;'
				+			'BORDER-LEFT: #728EB8 1px solid;">'
				+				this.contentXML
				+	  	  '</div>'
				+      '</div>'
				+  '</DIV>'
	document.body.insertAdjacentHTML('beforeEnd',outHTML);
	this.oMsgWin = document.getElementById(this.id);
	this.oMsgWin.obj = this;
	
	docWidth = document.body.clientWidth;
	docHeight = document.body.clientHeight-3;
	if(_position == 1){
		//左上角
		this.oMsgWin.style.top = parseInt(document.body.scrollTop,10) + this.step;
		this.oMsgWin.style.left = parseInt(document.body.scrollLeft,10);
		this.finishHeight = parseInt(document.body.scrollTop,10);
	}
	else if(_position == 2){
		//右上角
		this.oMsgWin.style.top = parseInt(document.body.scrollTop,10) +  this.step;
		this.oMsgWin.style.left = parseInt(document.body.scrollLeft,10) + docWidth - this.width;
		this.finishHeight = parseInt(document.body.scrollTop,10);
	}
	else if(_position == 3){
		//左下角
		this.oMsgWin.style.top = parseInt(document.body.scrollTop,10) + docHeight + this.step;
		this.oMsgWin.style.left = parseInt(document.body.scrollLeft,10);
		this.finishHeight = parseInt(document.body.scrollTop,10) + docHeight - this.height;
	}
	else if(_position == 4){
		//右下角
		this.oMsgWin.style.top = parseInt(document.body.scrollTop,10) + docHeight + this.step;
		this.oMsgWin.style.left = parseInt(document.body.scrollLeft,10) + docWidth - this.width ;
		
		//800分辨率下，默认把右下角的窗口定位在1024的最右下角
		if((parseInt(document.body.scrollLeft,10) + docWidth)<1024){
			this.oMsgWin.style.left = 1024 - this.width ;
		}
		this.finishHeight = parseInt(document.body.scrollTop,10) + docHeight - this.height;
	}
	else{
		//缺省值
		this.oMsgWin.style.top = parseInt(document.body.scrollTop,10) + this.step;
		this.oMsgWin.style.left = parseInt(document.body.scrollLeft,10);
		this.finishHeight = parseInt(document.body.scrollTop,10);
	}
	this.objTimer = window.setInterval("moveMsgWin("+this.oMsgWin.id+")",10);
}

MsgWin.prototype.moveDiv = function ()
{
	var divTop = parseInt(this.oMsgWin.style.top,10);
	var setDivTop = divTop - this.step;
	if(setDivTop <= this.finishHeight)
	{
		setDivTop = this.finishHeight;
	}
	this.oMsgWin.style.top = setDivTop;
	this.step = this.step - MSGWIN_ACCELERATION;
	if(this.step<1)
	{
		this.step = 1;
	}
	if(setDivTop == this.finishHeight)
	{
		window.clearInterval(this.objTimer);
		setDivTop = setDivTop - parseInt(document.body.scrollTop,10)
		this.oMsgWin.style.setExpression('top',setDivTop+'+parseInt(document.body.scrollTop,10)');
	}
}

MsgWin.prototype.close = function ()
{
	this.oMsgWin.removeNode(true);
}

function moveMsgWin(oMsgWin)
{
	oMsgWin.obj.moveDiv();
}

function msgWinClose()
{
	if(document.getElementById('UNDO_WIN_STATE')){
		document.getElementById('UNDO_WIN_STATE').setAttribute('class','0');
	}
	getElement(event.srcElement,'div',2).obj.close();
}