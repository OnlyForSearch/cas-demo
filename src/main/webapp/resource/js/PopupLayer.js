// JavaScript Document
//***********Ĭ�����ö���.*********************
var tPopWait=50;//ͣ��tWait�������ʾ��ʾ
var tShowPopStep=10;//ÿ�ν���͸����
var tPopOpacity=70;//���ս���͸����

var tPositionX=5;//��ʾ��������������λ��
var tPositionY=5;//��ʾ���������������λ��

var tPopLayerWidth=500;//��ʾ���ڿ�ȣ��߶�����������Ӧ��
var tOpacityWait=30;//ÿ�ν���ȴ�ʱ��
var tShowContent="";//��ʾ����

//***************�ڲ���������*****************
var curShow=null;
var tFadeOut=null;
var tFadeIn=null;
var tFadeWaiting=null;
var tLinkOut=null;
var MouseX=null;
var MouseY=null;

document.write("<div id='dypopLayer' onMouseOver='popupDivOver()' onMouseOut='popupDivOut()' style='position:absolute;z-index:1000;display:none' class='cPopText'><div id='contentLayer' class='RoundedCorner'>");
document.write("	<b class='rtop'><b class='r10'></b><b class='r2'></b><b class='r3'></b><b class='r4'></b></b>");
document.write("	<div id='contentHtml' class='RoundedCorner2'>");	
document.write("	</div>");
document.write("	<b class='rbottom'><b class='r4'></b><b class='r3'></b><b class='r2'></b><b class='r11'></b></b>");
document.write("	</div>");
document.write("</div>");

//��ʾ����������ʾ���ݡ���ʾ���ڿ�ȡ���ʾ��������������λ�á���ʾ���������������λ�á�͸���ȡ�ÿ�ν���͸���ȡ�ÿ�ν���ȴ�ʱ�䡢�Զ�����ʾλ��X���Զ�����ʾλ��Y
function showPopupLayer(showContent,width,PositionX,PositionY,PopOpacity,ShowPopStep,OpacityWait,MyMouseX,MyMouseY){
	if(showContent!=null && showContent!="")
		tShowContent=showContent;
	if(width!=null && width!="")
		tPopLayerWidth=width;
	if(PositionX!=null && PositionX!="")
		tPositionX=PositionX;
	if(PositionY!=null && PositionY!="")
		tPositionY=PositionY;
	if(PopOpacity!=null && PopOpacity!="")
		tPopOpacity=PopOpacity;
	if(ShowPopStep!=null && ShowPopStep!="")
		tShowPopStep=ShowPopStep;
	if(OpacityWait!=null && OpacityWait!="")
		tOpacityWait=OpacityWait;
	if(MyMouseX!=null && MyMouseX!="")
		MouseX=MyMouseX;
	else
		MouseX=event.clientX;
	if(MyMouseY!=null && MyMouseY!="")
		MouseY=MyMouseY;
	else
		MouseY=event.clientY;
	
	//var o=event.srcElement;
	/*MouseX=event.x;
	MouseY=event.y;*/
	
	contentLayer.style.width=tPopLayerWidth;
	contentHtml.style.width=tPopLayerWidth-1;

	clearTimeout(curShow);
	clearTimeout(tFadeOut);
	clearTimeout(tFadeIn);
	clearTimeout(tFadeWaiting);
	clearTimeout(tLinkOut);
	curShow=setTimeout("showIt()",tPopWait);
}

function hiddenPopupLayer(){
	clearTimeout(curShow);
	clearTimeout(tFadeOut);
	clearTimeout(tFadeIn);
	clearTimeout(tFadeWaiting);
	tLinkOut=setTimeout("fadeIn()",500);
}

function popupDivOver(){
	clearTimeout(tLinkOut);
}

function popupDivOut(){
	var o=event.srcElement;
	var dLeft=dypopLayer.style.left;
	var dTop=dypopLayer.style.top;
	dLeft=dLeft.substring(0,dLeft.length-2);
	dTop=dTop.substring(0,dTop.length-2);
	if(event.x<=parseInt(dLeft,10)+1 || event.x>=(parseInt(dLeft,10)+dypopLayer.clientWidth)
	|| event.y<=parseInt(dTop,10)+3 || event.y>=(parseInt(dTop,10)+dypopLayer.clientHeight))
		fadeIn();
}
/*
function showIt(){
	contentHtml.innerHTML=tShowContent;
	popWidth=dypopLayer.clientWidth;
	popHeight=dypopLayer.clientHeight;
	if(MouseX+tPositionX+popWidth>document.body.clientWidth) popLeftAdjust=-popWidth-24
		else popLeftAdjust=0;
	if(MouseY+tPositionY+popHeight>document.body.clientHeight) popTopAdjust=-popHeight-24
		else popTopAdjust=0;
	dypopLayer.style.left=MouseX+tPositionX+document.body.scrollLeft+popLeftAdjust;
	dypopLayer.style.top=MouseY+tPositionY+document.body.scrollTop+popTopAdjust;
	dypopLayer.style.filter="Alpha(Opacity=0)";
	fadeOut();
}
*/
function showIt(){
	contentHtml.innerHTML=tShowContent;
	popWidth=dypopLayer.clientWidth;
	popHeight=dypopLayer.clientHeight;
	/*if(MouseX+tPositionX+popWidth>document.body.clientWidth) popLeftAdjust=-popWidth-24
		else popLeftAdjust=0;
	if(MouseY+tPositionY+popHeight>document.body.clientHeight) popTopAdjust=-popHeight-24
		else popTopAdjust=0;
	dypopLayer.style.left=MouseX+tPositionX+document.body.scrollLeft+popLeftAdjust;
	dypopLayer.style.top=MouseY+tPositionY+document.body.scrollTop+popTopAdjust;
	*/
	var std_msgdocH = WebForm_GetClentY();
	var std_msgdocW = WebForm_GetClentX();
	if(MouseY+tPositionY+popHeight>std_msgdocH)
	{
		popTopAdjust=-popHeight-24;
	}
	else
	{
		popTopAdjust=0;
	}
	if(MouseX+tPositionX+popWidth>std_msgdocW)
	{
		popLeftAdjust=-popWidth-24;
	}
	else
	{
		popLeftAdjust=0;
	}
	var dhtscrolltop=WebForm_GetScrollY();
	var dhtscrollLeft=WebForm_GetScrollX();
	dypopLayer.style.left=MouseX+tPositionX+dhtscrollLeft+popLeftAdjust;
	dypopLayer.style.top=MouseY+tPositionY+dhtscrolltop+popTopAdjust;
	
	dypopLayer.style.filter="Alpha(Opacity=0)";
	dypopLayer.style.display="";
	fadeOut();
}
function fadeOut(){
	dypopLayer.style.display="";
	if(dypopLayer.filters.Alpha.opacity<tPopOpacity) {
		dypopLayer.filters.Alpha.opacity+=tShowPopStep;
		tFadeOut=setTimeout("fadeOut()",tOpacityWait);
	}
}

function fadeIn(){
	if(dypopLayer.filters.Alpha.opacity>0) {
		dypopLayer.filters.Alpha.opacity-=tShowPopStep;
		tFadeIn=setTimeout("fadeIn()",tOpacityWait);
	}
	else
	{
		dypopLayer.style.display="none";
	}
}

//////////////////////////////////////////////////
function WebForm_GetClentX() 
{
    if (typeof window.pageYOffset != 'undefined') 
    {
        return window.pageXOffset;
    }
    else 
    {
        if (document.documentElement && document.documentElement.clientWidth) 
        {
            return document.documentElement.clientWidth;
        }
        else if (document.body) 
        {
            return document.body.clientWidth;
        }
    }
    return 0;
}
function WebForm_GetClentY() 
{
    if (typeof window.pageYOffset != 'undefined') 
    {
        return window.pageYOffset;
    }
    else 
    {
        if (document.documentElement && document.documentElement.clientHeight) 
        {
            return document.documentElement.clientHeight;
        }
        else if (document.body) 
        {
            return document.body.clientHeight;
        }
    }
    return 0;
}

function WebForm_GetScrollX() 
{
    if (typeof window.pageYOffset != 'undefined') 
    {
        return window.pageXOffset;
    }
    else 
    {
        if (document.documentElement && document.documentElement.scrollLeft) 
        {
            return document.documentElement.scrollLeft;
        }
        else if (document.body) 
        {
            return document.body.scrollLeft;
        }
    }
    return 0;
}
function WebForm_GetScrollY() 
{
    if (typeof window.pageYOffset != 'undefined') 
    {
        return window.pageYOffset;
    }
    else 
    {
        if (document.documentElement && document.documentElement.scrollTop) 
        {
            return document.documentElement.scrollTop;
        }
        else if (document.body) 
        {
            return document.body.scrollTop;
        }
    }
    return 0;
}