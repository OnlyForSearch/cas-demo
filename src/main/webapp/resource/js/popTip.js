/**
 * "弹出提示信息"的调用格式：
 *    onmouseover="showTip2(this, popTip, 'tip_information')" onmouseout="hideTip(this, popTip, event)"
 */
document.writeln("<style>.pop_page {position:absolute;background-color:#e9ffd8;border:1px solid #fed070;padding-left:5;width:60;}</style>");
document.writeln("<style>.tipdiv {z-index:3;font-family:verdana, arial, helvetica; font-size:12px; color:black; background-color:lightyellow; border:black 1px solid; padding:1px;}</style>");
document.writeln("<div id=popTip class=tipdiv style='position:absolute;display:none;' onmouseout='hideSelf(this, event)'></div>");

var popup_tip = null;

//1.   功能：对象所在位置
//     输入：(1).事件对象, (2).方向位置
//     输出：对象所在位置
function getPos(el,sProp) {
	var iPos = 0;
	while (el!=null) {
		iPos+=el["offset" + sProp];
		el = el.offsetParent;
	}
	return iPos;
}

//2.   功能：显示Tip对象
//     输入：(1).事件对象, (2).Tip对象, (3).Tip信息, (4). 位置, (5). 是否保持原样
//     输出：
function showTip2(el, popObj, tipstr, direction, isPre) {	
	if (tipstr.length > 1) {
		if (popObj) {
			popObj.style.display='';
			if (popObj.innerHTML.length<1) 
			{
			    if(isPre!=null && isPre==true) popObj.innerHTML = "<pre>"+tipstr.replace(/</g, '&lt;')+"</pre>";
			    else popObj.innerHTML = tipstr;
			}
			if(direction!=null && typeof direction!=null)
			{
			    if( direction==-1 )
			    {
			        popObj.style.left = getPos(el,"Left") - popObj.offsetWidth;
			        popObj.style.top = getPos(el,"Top") + el.offsetHeight;
			    }
			    else if(direction == -2)
			    {
			        popObj.style.left = getPos(el,"Left");
			        popObj.style.top = getPos(el,"Top") + el.offsetHeight;
			    }
			    else if(direction == -3)
			    {
			        popObj.style.left = getPos(el,"Left") + el.offsetWidth - popObj.offsetWidth;
			        popObj.style.top = getPos(el,"Top") + el.offsetHeight;
			    }
			}else
			{
			    popObj.style.left = getPos(el,"Left") + el.offsetWidth;
			    popObj.style.top = getPos(el,"Top") + el.offsetHeight;
			}
		}
	}
	if ((popObj!=popup_tip) && (popup_tip)) popup_tip.style.display = 'none';
	popup_tip = popObj;
}

//3.   功能：在超出范围后，隐藏Tip对象
//     输入：(1).对象, (2).Tip对象, (3).事件
//     输出：
function hideTip(el, popObj, e) {
	var cx, cy;
	if (!e) {
		cx = window.event.x;
		cy = window.event.y;
	} else {
		cx = e.clientX;
		cy = e.clientY;
	}

	if (el && popObj && popObj.style.display=='') {
		if ((document.body.scrollLeft + cx > el.offsetLeft) 
				&& (document.body.scrollLeft + cx < el.offsetLeft + el.offsetWidth) 
				&& (document.body.scrollTop + cy > el.offsetTop) 
				&& (document.body.scrollTop + cy < el.offsetTop + el.offsetHeight)
				|| (document.body.scrollLeft + cx > popObj.offsetLeft)                
				&& (document.body.scrollLeft + cx < popObj.offsetLeft + popObj.offsetWidth) 
				&& (document.body.scrollTop + cy > popObj.offsetTop)
				&& (document.body.scrollTop + cy < popObj.offsetTop + popObj.offsetHeight)) {
		} else {
			popObj.style.display = 'none';
			popObj.innerHTML = "";
		}
	}
}

//4.   功能：在超出范围后，隐藏Tip对象
//     输入：(1).Tip对象, (3).事件
//     输出：
function hideSelf(popObj, e)
{
    var cx, cy;
	if (!e) {
		cx = window.event.x;
		cy = window.event.y;
	} else {
		cx = e.clientX;
		cy = e.clientY;
	}

    if (popObj.style.display=='') {
        if ((document.body.scrollLeft + cx >= popObj.offsetLeft)                
        && (document.body.scrollLeft + cx <= popObj.offsetLeft + popObj.offsetWidth) 
        && (document.body.scrollTop + cy >= popObj.offsetTop)
        && (document.body.scrollTop + cy <= popObj.offsetTop + popObj.offsetHeight)) {
        } else {
          popObj.style.display = 'none';
        }
    }
}

/**
 * "弹出页面"的调用格式：
 *    (1). 弹出：showPopPage(this, popPage)
 *    (2). 隐藏：hideObj(popPage)
 */
//1. 功能：显示POPUP对象
//   输入：(1).操作对象, (2).弹出页面
//   输出：(无)
function showPopPage(dropDownObj, popPageObj)
{
    popPageObj.style.display='';
    popPageObj.style.left = getPos(dropDownObj,"Left") ;
    popPageObj.style.top = getPos(dropDownObj,"Top");
    popPageObj.style.width = dropDownObj.offsetWidth;
    
    var screenWidth = window.document.body.clientWidth;//window.screenLeft
    var screenHeight = window.document.body.clientHeight;//window.screenTop
    if( (getPos(popPageObj, "Left")+popPageObj.offsetWidth)>screenWidth )
    {
        popPageObj.style.left = screenWidth - popPageObj.offsetWidth - 10;
    }
    if( (getPos(popPageObj, "Top")+popPageObj.offsetHeight)>screenHeight )
    {
		popPageObj.style.top = screenHeight - popPageObj.offsetHeight+WebForm_GetScrollY();
    }
}
//2. 功能：隐藏对象
//   输入：(1).对象
//   输出：(无)
function hideObj(popPageObj)
{
    popPageObj.style.display='none';
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

