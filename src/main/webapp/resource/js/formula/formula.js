
function change_button(num) 
{ 
   var srcE=event.srcElement;
   var sTag=srcE.tagName;
   if(sTag=="TD" && srcE.value=="button") 
      srcE.className = "button"+num;
   if(sTag.toLowerCase()=="img")
      srcE.parentElement.className="button"+num;
}
function doOperClick(oFormula,oOper)
{
   var srcE=event.srcElement;
   if(srcE.tagName=="TD" && srcE.value=="button")
   {   
   	   if(oFormula && oFormula.disabled) return;     
       if(srcE.pos)
          pasteOper(oFormula,srcE.oper,parseInt(srcE.pos));
       else
          pasteOper(oFormula,srcE.oper,0);
   }
}

function showVarMenu(varMenu,oButton)
{
    event.cancelBubble=true;
    var iLeft=window.screenLeft+oButton.getBoundingClientRect().left;
    var iBottom=window.screenTop+oButton.getBoundingClientRect().bottom;
    varMenu.show(null,null,iLeft,iBottom);
}

function pasteOper(oTextArea,sHTML,iPos)
{
	var sTemp="@#%#^&#*$";
	oTextArea.focus();
	var rng=document.selection.createRange();
	rng.text=sTemp;
	rng.moveStart("character", -sTemp.length);
	document.execCommand('undo');
	rng.text=sHTML;	
	/*rng.moveToPoint(rng.offsetLeft,rng.offsetTop)
    rng.moveStart("character", -1*oTextArea.value.length+iPos);
    var rngMove = oTextArea.createTextRange();  
    alert(rng.text.length)                   
    rngMove.moveStart("character",rng.text.length-1);     
    rngMove.collapse(true);
    rngMove.select();*/ 
}
function pasteVar(sHTML,iPos)
{
    pasteOper(FORMULA,sHTML,iPos);
}
function doMouseDown(oTR,oKPIContainer)
{	
	var rng = document.body.createTextRange();
	rng.moveToElementText(oTR);             
	rng.select();
}
function doDragStart(oTR,oKPIContainer)
{
    event.dataTransfer.setData("Text", "{$k"+oTR.value+"}"); 
    event.dataTransfer.effectAllowed = "copy"; 
	event.dataTransfer.dropEffect  = "copy";
}

function doDblclick(oTR,oTextArea)
{
    pasteOper(oTextArea,"{$k"+oTR.value+"}",0);
}

function showDropEffect()
{
    event.returnValue=false;
    event.dataTransfer.effectAllowed = "copy"; 
    event.dataTransfer.dropEffect  = "copy";
}
function getKpiXML(neTypeId,sType)
{
    var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
    var oXMLDoc=new ActiveXObject("MSXML.DOMDocument");
	oXMLHTTP.open("POST",'../../servlet/kpiOper?OperType=1&neTypeId='+neTypeId+"&msgType="+sType,false);
	oXMLHTTP.send("");
	if(isSuccess(oXMLHTTP))
	{
        oXMLDoc.load(oXMLHTTP.ResponseXML);
	}
	return oXMLDoc;
}
function getKPIList(oNetElement,sType,oKPIContainer)
{
   var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
   var neTypeId=oNetElement.getAttribute("NE_TYPE_ID");
   var oXMLDoc=getKpiXML(neTypeId,sType);
   if(oXMLDoc!=null)
   {
       createKpiList(oXMLDoc,oKPIContainer);
   }
}
function getKPIByNeId(oNetElement,sType,oKPI)
{
   var neTypeId=oNetElement.getAttribute("NE_TYPE_ID");
   var oXMLDoc=getKpiXML(neTypeId,sType);
   if(oXMLDoc!=null)
   {
       createKpi(oXMLDoc,oKPI);
   }
}
function createKpi(oXMLDoc,oKPI)
{
    var oRows=oXMLDoc.selectNodes("/root/rowSet")
    var iLen=oRows.length;
    for(var i=oKPI.length-1;i>=0;i--)
    {
 	     oKPI.options.remove(i);
    }
    for(var i=0;i<iLen;i++)
    {
        var oOption=document.createElement("OPTION");
        oOption.value=oRows[i].getAttribute("id");
        oOption.text=oRows[i].childNodes[0].text;
        oKPI.add(oOption);
    }
    oKPI.style.width="";
}
function createKpiList(oXMLDoc,oKPIContainer)
{
    var oXMLRows=oXMLDoc.selectNodes("//rowSet");
    var iXMLNodeCnt=oXMLRows.length;
    var oRows=oKPIContainer.rows;
    var iLen=oRows.length;
    for(var j=iLen-1;j>=0;j--)
    {
        oKPIContainer.deleteRow(j);
    }        
    for (var i=0;i<iXMLNodeCnt;i++)
    {
        //var oRow=oKPIContainer.insertRow();
        var oRow=document.createElement("TR");
        oRow.onmousedown=function(){doMouseDown(this,oKPIContainer);};
        oRow.onmouseup=function(){doMouseDown(this,oKPIContainer);};
        oRow.ondragstart=function(){doDragStart(this);};
        oRow.ondragover=function(){showDropEffect();};
        oRow.ondblclick=function(){doDblclick(this,FORMULA);};
        oRow.value=oXMLRows[i].getAttribute("id");
        var oCellImg=document.createElement("TD");
        oCellImg.width="16px";
        oCellImg.innerHTML="<img src='../../resource/image/kpi.gif'/>"
        oCellKpi=document.createElement("TD");
        oCellKpi.align="left";
        oCellKpi.innerHTML='<div style="width:200px">'+oXMLRows[i].childNodes[0].text+'</div>';
        oCellKpi.noWrap=true;
        oRow.appendChild(oCellImg);
        oRow.appendChild(oCellKpi);
        oKPIContainer.childNodes[0].appendChild(oRow);
    }
}




