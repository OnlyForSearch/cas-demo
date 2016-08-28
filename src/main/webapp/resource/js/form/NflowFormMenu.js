var oStatusXML=null;
var oURLXMLDoc=null;
function doFlowOnLayer() //适用于表单元素在层上面填写。
{
	flow.Service.dispatch({type:flow.constant.operType.directFlow,actionType:flow.constant.actionType.all,eleOnLayer:true});
}

function doForward()
{
	flow.Service.dispatch({type:flow.constant.operType.directFlow,actionType:flow.constant.actionType.all});
}

function doBack()
{
    flow.Service.dispatch({type:flow.constant.operType.directFlow,actionType:flow.constant.actionType.back});
}
function doEnd()
{
    flow.Service.dispatch({type:flow.constant.operType.directFlow,actionType:flow.constant.actionType.end});
}
function doTransfer()
{
    flow.Service.dispatch({type:flow.constant.operType.directFlow,actionType:flow.constant.actionType.transfer});
}

function isTchEnd()
{
   return (formContext.FLOW.TCH_STATUS=='F' ||formContext.FLOW.FLOW_STATUS=='F');
}

function isFlowBegin()
{
   return (formContext.FLOW.TCH_ID=="0" || formContext.FLOW.TCH_ID=="-1");
}

function isFlowInit()
{
   return (formContext.FLOW.TCH_ID=="0");
}

function isTacheActive()
{
    return (formContext.FLOW.TCH_STATUS=='A')
}

function getCurTchText()
{
	var sFormName=formContext.getFormName();
	if(formContext.getWin().form.getDynamicFormName)
	{
	     sFormName=formContext.getWin().form.getDynamicFormName();
	}
    var sTchName=formContext.FLOW.TCH_NAME;
    var tchHtml='<span style="color:#125899;font-weight:bold;font-size:18px;height:100%;padding-top:2px">'+sFormName+'</span>'+
                '<span style="color:#8e969d;font-weight:bold;font-size:12px;height:100%;padding-top:0px">当前环节:'+sTchName+'<span>';
    return tchHtml;
}

function isRemoteFlow()
{
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("POST",'../../servlet/FlowRemoteAction.do?method=getRemoteFlowMod&flowModel='+formContext.FLOW.FLOW_MOD,false);
	oXMLHTTP.send("");
	if(isSuccess(oXMLHTTP))
	{
	    var remoteFlowMod=oXMLHTTP.responseXML.selectSingleNode("/root/REMOTE_FLOW_MOD").text;
		if(remoteFlowMod!="-1")
			return false;
		else
			return true;
	}
	else
		return true;
	
}

function isReceiver()
{
   var staffId=formContext.GLOBAL_VAR.STAFF_ID;
   var sTchReceiver=formContext.FLOW.TCH_RECEIVER;
   return staffId.isInArray(sTchReceiver.split(","));	
}

function isEnableReceiveButton()
{
   var isExcuting=(formContext.FLOW.TCH_EXECUTER!=null && formContext.FLOW.TCH_EXECUTER!="");
   
   return (!isTchEnd() && !isExcuting && isReceiver());
}

function isEnableForword(){
	
	var staffId=formContext.GLOBAL_VAR.STAFF_ID;
    var sTchExcuter=formContext.FLOW.TCH_EXECUTER;
	var isNotExecuter=(sTchExcuter && !staffId.isInArray(sTchExcuter.split(",")));
	return (isTchEnd() || isView() || (!isReceiver() && !isFlowBegin())||(!isFlowBegin() && isNotExecuter));
}

function doReceive()
{
    var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
    var iTchId=formContext.FLOW.TCH_ID;
	oXMLHTTP.open("POST",'../../servlet/flowOper?OperType=12&tchId='+iTchId,false);
	oXMLHTTP.send("");
	if(isSuccess(oXMLHTTP))
	{
	    MMsg("接收成功!");
	    doRefresh();
	}
}

function candoApprove()//阅办按钮置灰
{
	var iFlowId=formContext.FLOW.FLOW_ID;
    var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("POST",'../../servlet/flowOper?OperType=9&flowId='+iFlowId,false);
	oXMLHTTP.send("");
	if(isSuccess(oXMLHTTP))
	{
	    oXMLDoc=oXMLHTTP.responseXML;
	    var oRowSet=oXMLDoc.selectNodes("//rowSet");
	    var iLen=oRowSet.length;
	    if(iLen==0)
	        return true;
	    else
	        return false;
	}else{
	    return false;
	}
}

function doSaveFlowForm(noValidate,noCloseAfterSave)
{
	if(formContext.save(noValidate))
	{
       doCallback();
       if(noCloseAfterSave){
       		formContext.doAfterSave();
       }else{
       		formContext.closeWin();
       }
	}
    
}
function isView()
{
   return (formContext.request("type")=="view");
}

function isPool()
{
   return formContext.FLOW.IS_POOL=='0BT';
}
function isSingleReceiver()
{
   var sReceiver=formContext.FLOW.TCH_RECEIVER+"";
   return (sReceiver.indexOf(',')==-1);
}

function hasRefURL()
{
   return (oURLXMLDoc.selectNodes("//rowSet").length!=0);
}

function getNextCntByAction(sAction)
{
   if(!oStatusXML) loadTchStatus(formContext.FLOW.TCH_ID);
   var actionCnt=oStatusXML.selectSingleNode("/root/TACHE_STATUS/"+sAction+"").text;
   return actionCnt;
}

function loadTchStatus(iTchId)
{
    var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("POST",'../../servlet/flowOper?OperType=4&tchId='+iTchId,false);
	oXMLHTTP.send("");
	if(isSuccess(oXMLHTTP))
	{
	    oStatusXML=oXMLHTTP.responseXML;
	}
}

function getRefURLXML(iTchMod)
{
    var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("POST",'../../servlet/flowOper?OperType=11&tchMod='+iTchMod,false);
	oXMLHTTP.send("");
	if(isSuccess(oXMLHTTP))
	{
	    oURLXMLDoc=oXMLHTTP.responseXML;
	}	
}

function viewFlowProc()
{
    var iTopFlowId=formContext.FLOW.TOP_FLOW_ID;
    var iFlowId=formContext.FLOW.FLOW_ID;
    var iTchId=formContext.FLOW.TCH_ID;
    var sFlow_name=encodeURIComponent(formContext.FLOW.FLOW_NAME);
    var sHref="flowProc.jsp?topFlowId="+iTopFlowId+"&flowId="+iFlowId+"&tchId="+iTchId;
    var sFeatures = new Array();
    sFeatures.push("width="+(screen.availWidth-20));
    sFeatures.push("height="+(screen.availHeight-20));
    sFeatures.push("location="+0);
    sFeatures.push("left="+0);
    sFeatures.push("top="+0);
    sFeatures.push("menubar="+0);
    sFeatures.push("resizable="+1);
    sFeatures.push("scrollbars="+1);
    sFeatures.push("status="+0);
    sFeatures.push("titlebar="+0);
    sFeatures.push("toolbar="+0);
    window.open(sHref,iTopFlowId+"",sFeatures.join(","));
}

function viewFlowModel()
{
    var sHref="../../FlowModShow?system_code=G&flow_mod="+formContext.FLOW.FLOW_MOD;
    var sFeatures = new Array();
    sFeatures.push("width="+780);
    sFeatures.push("height="+580);
    sFeatures.push("location="+0);
    sFeatures.push("menubar="+0);
    sFeatures.push("resizable="+1);
    sFeatures.push("scrollbars="+1);
    sFeatures.push("status="+0);
    sFeatures.push("titlebar="+0);
    sFeatures.push("toolbar="+0);
    window.open(sHref, "flowMod", sFeatures.join(","));
}

function doApprove()
{
   var oFeatures,layer;
   openNtyLayer();
   function openNtyLayer()
   {
	   oFeatures={width:780,height:480};
	   oFeatures.winId="FL_NTY_WIN";
	   oFeatures.title="环节传阅";
	   oFeatures.html={};
	   oFeatures.html.body=oTemplate.XMLDocument.selectSingleNode("/root/notify_template").text;
	   oFeatures.html.bottom=oTemplate.XMLDocument.selectSingleNode("/root/notify_bottom_template").text;
	   layer=Layer.instances[oFeatures.winId];
	   layer=(layer)?layer.show():Layer.open(oFeatures);
	   var oMap=parseXML();
	   var oTable=layer.$("FL_EXT_NTY_TABLE");
	   rebuildTableBody(oTable);
	   var opinionMenuDoc = flow.Service.getOpinionMenuDoc();
	   render(oTable,opinionMenuDoc,oMap.cur,oMap.prev);
	   layer.$("FL_EXT_NTY_RETURN").onclick=function(){layer.close()}
	   layer.$("FL_EXT_NTY_SUBMIT").onclick=function(){saveOpinion(oMap)};
   }
   function saveOpinion(oMap)
   {
   	   var oLayer=Layer.instances["FL_NTY_WIN"].getDomEle();
   	   if(!doCheck()) return;
   	   var XMLDoc=new ActiveXObject("Microsoft.XMLDOM");
   	   var sendXML='<?xml version="1.0" encoding="GBK"?>'
		             +  '<root>';
   	   for (var key in oMap.cur)
   	   {
   	       sendXML+='<NOTIFY>'
		          +   '<TCH_ID>'+key+"</TCH_ID>"
		          +   '<OPINION>'+xmlEncode(oMap.prev[oMap.cur[key].prevTchId].opinion)+"</OPINION>"
		          + '</NOTIFY>';
   	   }
	   sendXML+='</root>';
	   XMLDoc.loadXML(sendXML);
	   var saveURL="/servlet/flowOper?OperType=10";
	   formContext.App.ajaxRequest(saveURL,{async:true,xml:XMLDoc,onStateChange:function(oXMLHttp){stateChange(oXMLHttp)}});	   
   	   function stateChange(oXMLHttp)
   	   {   	   	  
   	   	  Message.xmlHttpLoading(oXMLHttp,{wait:"正在提交中,请稍候......",succeed:"提交成功"},oLayer,
   	   	  {
   	   	    onSucceed:function()
   	   	    {
   	   	       window.setTimeout(function(){formContext.closeWin();formContext.callback();},1000);
   	   	    },
   	   	    onClick:function()
   	   	    {
   	   	       formContext.closeWin();
	           formContext.callback();
   	   	    }
   	   	  })   	      
   	   }
	   function doCheck()
	   {
	       for (var key in oMap.prev)
	       {
	       	   var sOpinion=oMap.prev[key].opinion;
	       	   var sTchName=oMap.prev[key].tchName;
		       if(sOpinion=="")
			   {
			       Message.fail("请填写【"+sTchName+"】的审阅意见！",oLayer);
			       return false;
			   }
			   if(sOpinion.Tlength>4000)
			   {
			       Message.fail("【"+sTchName+"】的审阅意见不能超过4000个字节！",oLayer);
			       return false;
			   }	       	
	       }
	       return true;
	   }
   }
   function rebuildTableBody(oTable)
   {
   	   var iLen=oTable.rows.length;
       for(var i=iLen-1;i>0;i--)
          oTable.deleteRow(i);
   }
   function parseXML()
   {
   	   var tchMap={};
   	   var prevTchMap={};
   	   var oXMLDoc=getNotifyTachesDoc();
       var oNodes=oXMLDoc.selectNodes("/root/rowSet");
       var iLen=oNodes.length;
       for(var i=0;i<iLen;i++)
       {
           var oNode=oNodes[i];
           var sTchId=oNode.selectSingleNode("TCH_ID").text;
           var sTchName=oNode.selectSingleNode("TCH_NAME").text;
           var sStaffName=oNode.selectSingleNode("STAFF_NAME").text;
           var sPrevTchId=oNode.selectSingleNode("PREV_TCH_ID").text;
           var sPrevTchName=oNode.selectSingleNode("PREV_TCH_NAME").text;
           var sPrevStaffName=oNode.selectSingleNode("PREV_STAFF_NAME").text;
           tchMap[sTchId]={tchId:sTchId,prevTchId:sPrevTchId};
           if(prevTchMap[sPrevTchId])
           {
               prevTchMap[sPrevTchId].staffName=prevTchMap[sPrevTchId].staffName+","+sStaffName;
           }
           else
           {
               prevTchMap[sPrevTchId]={staffName:sStaffName,tchName:sTchName,
                                   prevTchName:sPrevTchName,prevStaffName:sPrevStaffName,
                                   opinion:""};
           }
       }
       return {cur:tchMap,prev:prevTchMap};                    
	   function getNotifyTachesDoc()
	   {
	   	  return formContext.App.syncAjaxRequest('../../servlet/flowOper?OperType=9&flowId='+formContext.FLOW.TOP_FLOW_ID);
	   }
   }
   function render(oTable,opinionMenuDoc,tchMap,prevTchMap)
   {
   	   for(var key in prevTchMap)
   	   {
   	       insertRow(prevTchMap[key]);
   	   }
   	   var iRealHeight=layer.getRealHeight();
	   oFeatures.height=iRealHeight;
	   layer.reSetAreaAndPos();
   	   function insertRow(oTch)
   	   {
	       var oRow=oTable.insertRow();
	       oRow.style.backgroundColor="#FFFFFF";
	       var oEditCell=insertEditCell(oRow);
	       insertOftenOpinionCell(oRow);
	       insertCurTchCell(oRow);
	       insertPervTchCell(oRow);
	       function insertEditCell(oRow)
	       {
	          var oEditCell=oRow.insertCell();
	          oEditCell.innerHTML="<textarea  style='border:0px;width:100%;height:100px;'></textarea>";
	          var oInput=oEditCell.childNodes[0]
	          oInput.onpropertychange=function()
              {
              	  oTch.opinion=this.value;
              }
              oInput.focus();
	          return oEditCell;
	       }
	       function insertOftenOpinionCell(oRow)
	       {	          
	           var oOftenCell=oRow.insertCell();
	           oOftenCell.innerHTML="<div style='border:0px;height:100px;width:100%;overflow-y:auto;overflow-x:hidden'></div>";	           
	           var oAction={ 
		       	               onclick:function(oMenuItem)
		             	       {
		             	          oEditCell.childNodes[0].value = oMenuItem.innerText;
		             	       }
       	                   }
       	       tache.opinionMenu.setMenuList(opinionMenuDoc,oOftenCell.childNodes[0],oAction);
	       }  
	       
	       function insertCurTchCell(oRow)
	       {
		       var oCurTch=oRow.insertCell();
		       oCurTch.innerHTML=["<table><tr><td style='font-weight:bold;white-space:nowrap;'>环节名称:</td>",
		                          "<td style='white-space:nowrap;'>",
		                          oTch.tchName,"</td></tr>",getCurTchStaffHTML(oTch.staffName),"</table>"].join("");
		       oCurTch.style.verticalAlign="top";
	       }
	       function insertPervTchCell(oRow)
	       {
	          var oPrevTch=oRow.insertCell();
	          oPrevTch.innerHTML=["<table><tr><td style='font-weight:bold;white-space:nowrap'>环节名称:</td>",
	                           "<td style='white-space:nowrap'>",oTch.prevTchName,"</td></tr>",
	                           "<tr><td style='font-weight:bold;white-space:nowrap'>发送人:</td>",
	                           "<td style='white-space:nowrap'>",oTch.prevStaffName,"</td></tr></table>"].join("");
	          oPrevTch.style.verticalAlign="top";
	       }
	       function getCurTchStaffHTML(sStaffNames)
	       {
	       	   var oStaffNames=sStaffNames.split(",");
	       	   var iLen=oStaffNames.length;
	       	   var aStaffName=[]
	       	   for(var i=0;i<iLen;i++)
	       	   {
	               var sStaffName=oStaffNames[i];
	               var sTagName=(i==0)?"办理人:":"&nbsp;"
	               aStaffName[i]="<tr><td style='font-weight:bold;white-space:nowrap'>"+sTagName
	                             +"</td><td style='white-space:nowrap'>"+sStaffName+"</td></tr>";
	       	   }
	       	   return aStaffName.join("");
	       }
   	   }
   }
}

function doRead()
{
   var XMLDoc=new ActiveXObject("Microsoft.XMLDOM");
   var sContent="阅毕";
   var sendXML='<?xml version="1.0" encoding="GBK"?>'
	           +'<root><NOTIFY>'
	           +'<TCH_ID>'+formContext.FLOW.TCH_ID+'</TCH_ID>'
	           +'<OPINION>'+sContent+'</OPINION>'
	           +'</NOTIFY>'
	           +'</root>';
   XMLDoc.loadXML(sendXML);
   var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
   oXMLHTTP.open("POST","../../servlet/flowOper?OperType=10",false);
   oXMLHTTP.send(XMLDoc);
   if(isSuccess(oXMLHTTP))
   {
	   formContext.callback();
	   formContext.closeWin();
   }       
}

function doSendMsg()
{
    var sHref="flowSendMsg.html"
    var sPara='dialogwidth:650px;dialogheight:380px;status:no;help:no;resizable:yes;scroll=1';
    var oDialogWin=window.showModalDialog(sHref,formContext,sPara);
}
//添加汇报
function doReportMsg()
{
    var sHref="flowReportMsg.html"
    var sPara='dialogwidth:450px;dialogheight:360px;status:no;help:no;resizable:yes;scroll=1';
    var oDialogWin=window.showModalDialog(sHref,formContext,sPara);
}

function doOpinion(){
	var sHref="flowOpinion.html"
    var sPara='dialogwidth:500px;dialogheight:420px;dialogLeft:200px;status:no;help:no;resizable:no;scroll=1';
    var oDialogWin=window.showModalDialog(sHref,formContext,sPara);
}

function doFavoriteForm()
{
   var sName=formContext.getFormName();
   var sURL="/workshop/form/index.jsp?flowId="+formContext.FLOW.TOP_FLOW_ID;
   //showAddFavUrlWin(sName,sURL);
   showAddFavUrlWin(sName,sURL,formContext.FLOW.TOP_FLOW_ID,1);
}

function doFavoriteFlow()
{
   var sName=formContext.FLOW.FLOW_NAME;
   var sURL="/FlowBrowse?flow_id="+formContext.FLOW.TOP_FLOW_ID+"&system_code=G";
   //showAddFavUrlWin(sName,sURL);
   showAddFavUrlWin(sName,sURL,formContext.FLOW.TOP_FLOW_ID,1);
}

function showRelationShip()
{
	var sHref="flowRelationship.html";
    var sFeatures = new Array();
    sFeatures.push("width="+1000);
    sFeatures.push("height="+680);
    sFeatures.push("location="+0);
    sFeatures.push("menubar="+0);
    sFeatures.push("resizable="+1);
    sFeatures.push("scrollbars="+1);
    sFeatures.push("status="+0);
    sFeatures.push("titlebar="+0);
    sFeatures.push("toolbar="+0);
    window.open(sHref,"flow",sFeatures.join(","));
}

function getURLMenus()
{
    var sDynamicProc="";
    var aURLName=[];
    var aURL=[];
    var oMenuNodes=oURLXMLDoc.selectNodes("//rowSet")
	var iMenuLen=oMenuNodes.length;
    for(var i=0;i<iMenuLen;i++)
    {
        var oMenuNode=oMenuNodes[i];
        var sDynamicProc=oMenuNode.selectSingleNode("DYNAMIC_URL_PROC").text;
        if(sDynamicProc!="")
        {
           break;
        }
        else
        {
            aURLName[i]=oMenuNode.selectSingleNode("URL_NAME").text;
            aURL[i]=oMenuNode.selectSingleNode("URL").text;
        }
    }
    if(sDynamicProc!="")
    {
       aURLName=[];
       aURL=[];
       var aDynamicMenu=getDynamicMenus(sDynamicProc);
       aURLName=aDynamicMenu[0];
       aURL=aDynamicMenu[1];
    }
	return buildURLMenu(aURLName,aURL);	       
}

function buildURLMenu(aURLName,aURL)
{
   var iLen=aURLName.length;
   var sItemXML="";
   var itemXMLDoc = new ActiveXObject("Microsoft.XMLDOM");
   itemXMLDoc.loadXML('<?xml version="1.0" encoding="GBK"?><root></root>');
   for (var i=0;i<iLen;i++)
   {
      var oItemXML=itemXMLDoc.createElement("bar:item");
      oItemXML.setAttribute("label",aURLName[i]);
      oItemXML.setAttribute("onclick","openURL('"+aURL[i]+"')");
      itemXMLDoc.documentElement.appendChild(oItemXML);
   }
   return itemXMLDoc.documentElement.childNodes;
}

function getDynamicMenus(sDynamicProc)
{
	var aURLName=[];
	var aURL=[];
	var aReturn=[];
    var sDynamicProc=replaceVar(sDynamicProc,"");
    var iIndex=sDynamicProc.lastIndexOf(",");
    if(iIndex!=-1)
        sDynamicProc=sDynamicProc.substr(0,iIndex)+',?)';
    var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
    var XMLDoc=new ActiveXObject("Microsoft.XMLDOM");
    var sendXML='<?xml version="1.0" encoding="GBK"?>'
          +    '<root><SQL_PROC></SQL_PROC></root>';
    XMLDoc.loadXML(sendXML);
    XMLDoc.selectSingleNode("/root/SQL_PROC").text=sDynamicProc;
	oXMLHTTP.open("POST",'../../servlet/util?OperType=7',false);
	oXMLHTTP.send(XMLDoc);
	if(isSuccess(oXMLHTTP))
	{
	    var oURLXMLDoc=oXMLHTTP.responseXML;
	    var oMenuNodes=oURLXMLDoc.selectNodes("//rowSet")
	    var iMenuLen=oMenuNodes.length;
	   	for(var i=0;i<iMenuLen;i++)
	    {
	        var oMenuNode=oMenuNodes[i];
            aURLName[i]=oMenuNode.selectSingleNode("URL_NAME").text;
	        aURL[i]=oMenuNode.selectSingleNode("URL").text;
	    }
	}
	aReturn[0]=aURLName;
	aReturn[1]=aURL;
	return aReturn;
}

function openURL(sURL)
{
   doWindow_open(replaceVar(sURL,encodeURIComponent));
}

function replaceVar(sURL,formatFunc)
{
   try
   {
	   var reg=/\${1}\w+\.{1}\w+(\.{1}\w+)?(\.{1}\w+)?/gi;
	   var sReturnValue=sURL;
	   var aVar=sURL.match(reg);   
	   if(aVar!=null)
	   {
	       for(var i=0;i<aVar.length;i++)
	       {	          
	          var sVarValue="";
	          var sVar=aVar[i].substr(1);
	          var isGetValue=(sVar.lastIndexOf(".VALUE")==sVar.length-6);
	          if(isGetValue)
	          {
	                  sVar=sVar+"()";
	          }
	          sVarValue=eval("formContext."+sVar);
	          if(typeof(formatFunc)=="function")
	          {
	              sVarValue=formatFunc.call(null,sVarValue);
	          }
	          //sVarValue=encodeURIComponent(sVarValue);
	          sReturnValue=(sReturnValue.replace(aVar[i],sVarValue));
	       }
	   }
   }
   catch(e)
   {
       EMsg("无效的表单元素!")
   }
   return sReturnValue;
}

function doPrint()
{
   formContext.doPrint();
}

function doPrintView()
{
   window.open("printView.html");
}

function toWord(aPrintParam,callBack)
{
    formContext.loadPrint("doc",formContext,oWordForm,aPrintParam,"T");
}

function toOutPdf(aPrintParam){
	formContext.loadPrint("pdf",formContext,oWordForm,aPrintParam,'T');
}

function doClose()
{
   parent.window.close();
}

function doRefresh()
{
   parent.document.execCommand("refresh");
}

function doCallFormMethod(callMethod){
	var isCanOpen = true;
	try{
   		isCanOpen = eval("parent.fraForm."+callMethod);
   	}catch(e){
   		EMsg("调用"+callMethod+"方法出错");
   		isCanOpen = false;
   	}
   	return isCanOpen;
}

var flowTurn = function(flowMod,type,paramObj){
	var param,callMethod,mainRequestId,model,TName,cTableName,mTableName;
	var sURL="/workshop/form/index.jsp?turn=1";
	var maxWidth = screen.availWidth - 10;
	var maxHeight = screen.availHeight - 30;
	var oTable=formContext.TABLE;
	if(paramObj){
		param = paramObj.param;
		callMethod = paramObj.callMethod;
		mainRequestId = paramObj.mainRequestId;
		model = paramObj.model;
		TName = paramObj.TName;
		cTableName = paramObj.cTableName;
	}
	init();
	function init(){
		mTableName = getMTableName();
	}
	
	function getMTableName(){
		var tableName;
		if(TName){
			tableName = TName;
		}else{
			for(var c in oTable){
		       tableName=c;
		    }
	    }
		return tableName;
	}
	
	function getParam(){
		var sFeatures = new Array();
		var turnFlowMod = getTurnVal();
		if(turnFlowMod!="") sFeatures.push("&flowMod="+turnFlowMod);
		else sFeatures.push("&flowMod="+flowMod);
		sFeatures.push("&mainTacheMod="+formContext.FLOW.TCH_MOD);
		sFeatures.push("&beforeFlowMod="+formContext.FLOW.FLOW_MOD);
		sFeatures.push("&mainFlowId="+formContext.FLOW.FLOW_ID);
		sFeatures.push("&mainTchId="+formContext.FLOW.TCH_ID);
		sFeatures.push("&mainTableName="+mTableName);
		sFeatures.push("&fieldType="+type);
		if(model=='showmodal'){
			sFeatures.push("&model=showmodal");
	    }
		if(mainRequestId){
	        sFeatures.push("&mainRequestId="+mainRequestId);
	    }else{
	        sFeatures.push("&mainRequestId="+eval("oTable."+mTableName+".REQUEST_ID.VALUE()"));
	    }
		if(param){
	    	 sFeatures.push("&"+param);
	    }
		return sFeatures.join("");
	}
	
	function getSendDoc(){
		var sendXML = new ActiveXObject("Microsoft.XMLDOM");
		var root = sendXML.createElement("root");
		var flowInfo = sendXML.createElement("FLOW");
		var flowIdObj = sendXML.createElement("FLOW_ID");
		flowIdObj.text = formContext.FLOW.FLOW_ID;
		var tableObj = sendXML.createElement("TABLE");
		var mainTable = sendXML.createElement("MAIN_TABLE");
		mainTable.text = mTableName;
		var childTable = sendXML.createElement("CHILD_TABLE");
		childTable.text = cTableName;
		flowInfo.appendChild(flowIdObj);
		tableObj.appendChild(mainTable);
		tableObj.appendChild(childTable);
		root.appendChild(tableObj);
		root.appendChild(flowInfo);
		sendXML.appendChild(root);
		return sendXML;
	}
	
	function getTurnVal(){
		var turnVal;
		var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
		oXMLHTTP.open("POST","/servlet/FormTurnServlet?tag=48",false);
		oXMLHTTP.send(getSendDoc());
		if(isSuccess(oXMLHTTP))
		{
		    oXml = oXMLHTTP.responseXML;
		    turnVal = oXml.selectSingleNode("root/TURN/FLOW_MOD").text;
		}
		return turnVal;
	}
	
	function doCallMethod(){
		var isCanOpen = true;
		if(callMethod){
	    	isCanOpen = doCallFormMethod(callMethod);
	    }
		return isCanOpen;
	}
	
	this.doTurn = function(){
		var isCanOpen = doCallMethod();
		if(isCanOpen){
	        if(model=='showmodal'){
	            window.showModalDialog(sURL+ getParam(),window,'dialogWidth=1100px;dialogHeight=600px;resizable=yes;');
	        }else{
			    doWindow_open(sURL+ getParam(),maxWidth,maxHeight,"_blank");
			}
		}
	}
};

function doFlowTurn(flowMod,type,paramObj){
	var flowTurnObj = new flowTurn(flowMod,type,paramObj);
	flowTurnObj.doTurn();
}

function doTurn(flowMod,type,param,callMethod,mainRequestId,model,TName,cTableName){
	var paramObj = {};
	paramObj.param = param;
	paramObj.callMethod = callMethod;
	paramObj.mainRequestId = mainRequestId;
	paramObj.model = model;
	paramObj.TName = TName;
	paramObj.cTableName = cTableName;
	var flowTurnObj = new flowTurn(flowMod,type,paramObj);
	flowTurnObj.doTurn();
}

function doTurnMT(flowMod,type,param,callMethod,tableName,req_id){
	var maxWidth = screen.availWidth - 10;
	var maxHeight = screen.availHeight - 30;
	var oTable=formContext.TABLE;
	var isCanOpen = true;
	
    var sURL="/workshop/form/index.jsp?turn=1&mainTacheMod="+formContext.FLOW.TCH_MOD+"&flowMod="+flowMod+"&beforeFlowMod="+formContext.FLOW.FLOW_MOD
    +"&mainTchId="+formContext.FLOW.TCH_ID+"&mainFlowId="+formContext.FLOW.FLOW_ID
    +"&mainTableName="+tableName+"&fieldType="+type+"&mainRequestId="+req_id;
	//var sURL="/workshop/form/index.jsp?turn=1&flowMod="+flowMod+"&beforeFlowMod="+formContext.FLOW.FLOW_MOD+"&mainTableName="+tableName+"&fieldType="+type+"&mainRequestId="+eval("oTable."+tableName+".REQUEST_ID.VALUE()");
	if(typeof(param)!='undefined'&&param!=''){
    	sURL = sURL + "&" + param;
    }
    if(typeof(callMethod)!='undefined'&&callMethod!=''){
    	isCanOpen = doCallFormMethod(callMethod);
    }
    if(isCanOpen){
		doWindow_open(sURL,maxWidth,maxHeight,"_blank");
	}
}



function doTurnFlow(flowMod,turn){
	var oTable=formContext.TABLE;
	var tableName;
	for(var c in oTable){
       tableName=c;
    }
	var sURL="/workshop/form/index.jsp?callback=opener.parent.fraForm.doFlowSearch()&turn="+turn+"&flowMod="+flowMod
	+"&beforeFlowMod="+formContext.FLOW.FLOW_MOD+"&mainTableName="+tableName+"&mainRequestId="+eval("oTable."+tableName+".REQUEST_ID.VALUE()");
	
	doWindow_open(sURL);
}

function endAddTask(){
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
    var tchId = formContext.FLOW.TCH_ID;
	var flowId = formContext.FLOW.FLOW_ID;
	oXMLHTTP.open("POST","/servlet/FormTurnServlet?tag=8&tchId="+tchId+"&flowId="+flowId,false);
	oXMLHTTP.send("");
	if(isSuccess(oXMLHTTP))
	{
	    oXml = oXMLHTTP.responseXML;
	    success = oXml.selectSingleNode("root/TABLE").text;
	    if(success=='0'){
	    	MMsg("任务提交成功!");
	    }else if(success=='1'){
	    	MMsg("操作失败!");
	    }
	}
}

function isTurnDisabled(flowMod,tchMod){
	var flow_mod = formContext.FLOW.FLOW_MOD;
	var tch_mod = formContext.FLOW.TCH_MOD;
	if((","+flowMod+",").indexOf(","+flow_mod+",")>-1 && (tchMod==-1 || (","+tchMod+",").indexOf(","+tch_mod+",")>-1)){
		return false;
	}else{
		return true;
	}
}

function isCanUseButton(funcItemId){
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
    var flow_mod = formContext.FLOW.FLOW_MOD;
	var tch_mod = formContext.FLOW.TCH_MOD;	
	oXMLHTTP.open("POST","/servlet/FormTurnServlet?tag=3&funcItemId="+funcItemId+"&flowMod="+flow_mod+"&tchMod="+tch_mod,false);
	oXMLHTTP.send("");
	if(isSuccess(oXMLHTTP))
	{
	    oXml = oXMLHTTP.responseXML;
	    isCan = oXml.selectSingleNode("/root/IS_CAN_SPLIT_TURN").text;
	    if(isCan=='1'){
	    	return false;
	    }else{
	    	return true;
	    }
	}
}

function revertSheet(method){
	try{
		parent.fraForm.revertSheet(method);
	}catch(e){
		EMsg("调用方法出错");
	}
}

function viewRemoteFlowProc()
{
    var iFlowId=formContext.FLOW.FLOW_ID;
    var iFlowMod=formContext.FLOW.FLOW_MOD;
    var sHref="remoteFlowView.html?flow_id="+iFlowId+"&flow_mod="+iFlowMod;
    var sFeatures = new Array();
    sFeatures.push("width="+780);
    sFeatures.push("height="+580);
    sFeatures.push("location="+0);
    sFeatures.push("menubar="+0);
    sFeatures.push("resizable="+1);
    sFeatures.push("scrollbars="+0);
    sFeatures.push("status="+0);
    sFeatures.push("titlebar="+0);
    sFeatures.push("toolbar="+0);
    window.open(sHref,"flow",sFeatures.join(","));
}

var CancelPrivTchId = -1;//可以取回的环节ID， 小于0时代表没有可以取回的环节ID

function getTchCancelPriv()
{
	var tch_mod = formContext.FLOW.TCH_MOD;
	var tchMod ;
	if (isFlowBegin()) return true;
	if(arguments[0]){
			tchMod = arguments[0];
			if((","+tchMod+",").indexOf(","+tch_mod+",")>-1){
				return true;
			}
	}
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var url = "/servlet/FormTurnServlet?tag=14&system_code=D&flowId="+formContext.FLOW.FLOW_ID+"&tachId="+formContext.FLOW.TCH_ID;
	xmlhttp.open("POST",url,false);
	xmlhttp.send();
	CancelPrivTchId = xmlhttp.responseXML.selectSingleNode("/root/TCH_ID").text
	return !(CancelPrivTchId > 0);
}

function flowCancelNextTch()
{
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var url = "../../FlowDataIntf?action=FlowCancelNextTch&system_code=D&tch_id="+CancelPrivTchId;
	xmlhttp.open("POST",url,false);
	xmlhttp.send();
	if(xmlhttp.responseText=='1')
		MMsg("取回成功!");		
	else
		MMsg("取回失败!");
	
	formContext.callback();
	formContext.getWin().self.close();
}

//新增函数（浙江）
function delFlow() {
	    //验证是否符合删除条件，判断函数在各表单页面里
    if (parent.fraForm.isDelFlow != undefined) {
        if (parent.fraForm.isDelFlow() == false) {
            return;
        }
    }
	var tableName = "";
	for(attrubute in formContext.TABLE)
	{
		tableName = attrubute;
	}
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var dataXML = new ActiveXObject("Microsoft.XMLDOM");
	xmlhttp.Open("POST","/servlet/flowActionZJ.do?method=getSonForm&TABLE_NAME="+tableName+"&FLOW_ID="+formContext.FLOW.FLOW_ID,false);
 	xmlhttp.send();
 	var dataXML = new ActiveXObject("Microsoft.XMLDOM");
    dataXML.load(xmlhttp.responseXML);	
    var oMsgList = dataXML.selectNodes("/root/rowSet");
    if(oMsgList.length>0){
    	if(oMsgList[0].selectSingleNode('COUNT').text == 0){
	if (!confirm("删除流程会使流程中正在处理的事务无法继续进行，是否确认删除该流程？")) {
		return;
	}
	var url = "/servlet/flowActionZJ.do?method=deleteFlow&TABLE_NAME="+tableName+"&FLOW_ID="+formContext.FLOW.FLOW_ID;
		    //var url="/FlowQry?system_code=D&op_type=flow_delete&flow_id="+formContext.FLOW.FLOW_ID;
		    
	var xmlhttp=new ActiveXObject("Microsoft.XMLHTTP"); 
	xmlhttp.open("post",url,false);
 	xmlhttp.send();
	alert(xmlhttp.responseXML.xml);	
	
		    if(isSuccess(xmlhttp)){
		    	alert('删除成功！');
			formContext.closeWin();
			return true;
		   }    
    	}
    	else{
    		alert("该单子存在子单数据，无法删除！");
		}
	}
}


function isTurnAble(flowMod, tchMod) {
	var flow_mod = formContext.FLOW.FLOW_MOD;
	var tch_mod = formContext.FLOW.TCH_MOD;
	if (parent.fraForm.isTurnAbleZJ != undefined) {
		//若表单页面有判断流转条件函数，则执行(浙江)
		if (parent.fraForm.isTurnAbleZJ(tch_mod) == true) {
			return true;
		}
	}
	if ((","+flowMod+",").indexOf(","+flow_mod+",")>-1 && ((","+tchMod+",").indexOf(","+tch_mod+",")>-1)) {
		return true;
	} else {
		return false;
	}
}

flow.Service=
{
   tchIterator:null,
   context:null,
   init:function()
   {
       var xmlDoc=this.getXmlDoc(flow.constant.actionType.all);
   	   return this.initByXML(xmlDoc);
   },
   initByXML:function(xmlDoc)
   {
   	   if(!xmlDoc) return false;
	   var oNextTchXML=xmlDoc.selectSingleNode("/root/NEXT_TCH_MODS");
	   this.setContext(oNextTchXML);
	   this.setTchIterator(oNextTchXML);
	   return true;
   },
   loadMenu:function(isNotUseOnly)
   {
   	  if(!this.init()) return;
	  var itemXMLDoc = new ActiveXObject("Microsoft.XMLDOM");
	  itemXMLDoc.loadXML('<?xml version="1.0" encoding="GBK"?><root></root>');
	  var menuItems = new Array();
	  for(var i=0;i<this.tchIterator.getTchs().length;i++)
	  {
		 var oTch=this.tchIterator.getTchs()[i];
		 var oItemXML=itemXMLDoc.createElement("bar:item");
		 menuItems.push({isDisabled:this.context.isDisabled(),label:oTch.getShowName(),
				             ico:flow.constant.actionImg[oTch.getAction()],
				             onclick:"flow.Service.dispatch({type:'"+flow.constant.operType.single+"',"
				             +"tchModId:'"+oTch.getModelId()+"'})"
				        });
	  }
	  buildExtentMenu(this.tchIterator,this.context,menuItems);	  
	  for(var i=0;i<menuItems.length;i++)
	  {
		  buildMenuItem(menuItems[i],itemXMLDoc);
	  }
	  if(menuItems.length==0)
	  {
		  EMsg("找不到后续环节不能继续流转!");
		  return;
	  }
	  if(menuItems.length==1&&isNotUseOnly!=true)
	  {
		  eval(menuItems[0].onclick);
		  return;
	  }
	  return itemXMLDoc.documentElement.childNodes;  
   	  function buildExtentMenu(tchIterator,context,menuItems)
   	  {
   	  	 var menuLen=tchIterator.getTchs().length;
   	  	 var isSingleSelect=tchIterator.isSingleSelect();
   	  	 if(context.isDisabled() || context.hasUnClosedConnTch()
   	  	    ||(!context.isDisabled()&& !isSingleSelect))
   	  	 {
   	  	 	  if(menuLen>1)
   	  	 	  {
	   	         var oLineXML=itemXMLDoc.createElement("bar:line");
	   	         itemXMLDoc.documentElement.appendChild(oLineXML);
   	  	 	  }
   	  	 	  if(context.hasUnClosedConnTch())
	   	      {
   	  	 		  menuItems.push({isDisabled:false,label:context.getEndTaskTitle(),ico:"",
   		   	       	  onclick:"flow.Service.dispatch({type:'"+flow.constant.operType.endTask+"'})"});
	   	      }
	   	      if(context.isDisabled())
	   	      {
	   	    	  menuItems.push({isDisabled:false,label:"流转到上面"+menuLen+"个环节",ico:"",
				      onclick:"flow.Service.dispatch({type:'"+flow.constant.operType.more+"'})"});
	   	      }
	          if(context.isNextTchAuto()) return;
	 	      if((!context.isDisabled()&& !isSingleSelect))
	   	      {
	 	    	  menuItems.push({isDisabled:false,label:"流转到更多环节",ico:"",
		   	       	  onclick:"flow.Service.dispatch({type:'"+flow.constant.operType.more+"'})"});
	   	      }	   	      
   	  	 } 
   	  }  	  
   	  function buildMenuItem(aMenuItem,itemXMLDoc)
   	  {
   	  	  var oItemXML=itemXMLDoc.createElement("bar:item");
   	  	  if(aMenuItem.isDisabled)
		  {
		 	  oItemXML.setAttribute("disabled","true");
		  }
		  oItemXML.setAttribute("label",aMenuItem.label);
		  oItemXML.setAttribute("ico",aMenuItem.ico);
		  oItemXML.setAttribute("onclick",aMenuItem.onclick);
   	      itemXMLDoc.documentElement.appendChild(oItemXML);
   	  }
   },
   setContext:function(oNextTchXML)
   {
    	this.context=flow.Context.createInst(oNextTchXML) 
		return this.context;
   },
   setTchIterator:function(oNextTchXML)
   {
   	    this.tchIterator=flow.TchIterator.createInst(oNextTchXML.childNodes,this.context);
		return this.tchIterator;
   },
   getXmlDoc:function(actionType)
   {
   	  var returnXML=this.reGetXmlDoc(actionType);
	  if(returnXML)
	  {
		  this.getXmlDoc=function(actionType)
	   	  {
		   	  return returnXML;
	   	  }
	   	  return this.getXmlDoc(actionType);
	  }
	  return null;
   },
   reGetXmlDoc:function(actionType)
   {
      return formContext.App.syncAjaxRequest('../../servlet/flowOper?OperType=1&flowType='+actionType
   	                                              +'&flowMod='+formContext.FLOW.FLOW_MOD+"&tchId="
   	                                              +formContext.FLOW.TCH_ID);
   },
   flowTo:function(aParam)
   {
   	    if(!this.init()) return;
   	    var eleOnLayer=(aParam.eleOnLayer==undefined)?false:aParam.eleOnLayer;
   	    this.dispatch({type:flow.constant.operType.single,tchModId:aParam.tchModId,tchModNum:aParam.tchModNum,eleOnLayer:eleOnLayer})
   },
   flowToNext:function(aParam)
   {
   	    if(!this.init()) return;
   	    var isPrompt=(aParam.isPrompt==undefined)?true:aParam.isPrompt;
   	    var eleOnLayer=(aParam.eleOnLayer==undefined)?false:aParam.eleOnLayer;
   	    this.dispatch({type:flow.constant.operType.single,eleOnLayer:eleOnLayer,isAuto:true,
   	                  tchModId:aParam.tchModId,tchModNum:aParam.tchModNum,isPrompt:isPrompt})
   },
   flowToDefault:function(aParam)
   {
   	    if(!this.init()) return;
   	    var isPrompt=(aParam.isPrompt==undefined)?true:aParam.isPrompt;
   	    var eleOnLayer=(aParam.eleOnLayer==undefined)?false:aParam.eleOnLayer;
   	    var aTch=this.tchIterator.getTchs();
   	    if(aTch.length)
   	    {
   	        var oSelTch=this.tchIterator.getSelectedTch();
   	        if(oSelTch)
   	        {
   	            this.dispatch({type:flow.constant.operType.single,eleOnLayer:eleOnLayer,isAuto:true,isPrompt:isPrompt,
   	                  tchModId:oSelTch.getModelId()})
   	        }
   	        else
   	        {
   	            this.dispatch({type:flow.constant.operType.directFlow,actionType:flow.constant.actionType.all,eleOnLayer:eleOnLayer});
   	        }
   	        return;
   	    }
   	    if(this.context.hasUnClosedConnTch())
   	    {
   	        this.dispatch({type:flow.constant.operType.endTask,eleOnLayer:eleOnLayer,isAuto:true,isPrompt:isPrompt})
   	    }
   },
   isFormValidate:function(action,oValidateMod)
   {
		if(!oValidateMod) return (formContext.validate());
		if(!oValidateMod[action]) return true;
		return(formContext.validate());
   },
   dispatch:function(aParam)
   {
   	    var aDispatcher={};
	    aDispatcher[flow.constant.operType.single] =function(){singelSelect(this,aParam);};
	    aDispatcher[flow.constant.operType.more] =function(){moreSelect(this,aParam);};
	    aDispatcher[flow.constant.operType.endTask]=function(){endTask(this,aParam)};
	    aDispatcher[flow.constant.operType.directFlow]=function(){directFlow(this,aParam)};
	    aDispatcher[aParam.type].call(this);
	    function getSelectTch(oService,aParam)
	    {
	       if(aParam.tchModId) return oService.tchIterator.getTchById(aParam.tchModId);
	       if(aParam.tchModNum) return oService.tchIterator.getTchByNum(aParam.tchModNum);
	       return null;
	    }
   	    function singelSelect(oService,aParam)
		{  
		   var oTch=getSelectTch(oService,aParam);
		   if(!oTch)
		   {
		       EMsg("找不到对应的环节!");
		       return;
		   }
		   if(aParam.isAuto)
		      oTch.setAuto(true);
		   if(!isOnClickBeforeEvent())return;
		   if(!aParam.eleOnLayer || isFlowBegin())
		   {
		      if(!oService.isFormValidate(oTch.getAction(),oService.context.getValidateMod())) return;
		   }
		   if(oTch.hasDefaultStaff())
		      oTch.setExcuteStaffIds(oTch.getDefaultStaff().getId());
		   if(!oService.context.onBeforeFinish(oTch)) return;
           if(!oTch.onBeforeCreate()) return;
           if(!oTch.canAutoFinish())
           {
	           oService.tchIterator.popOther(oTch);
               openWin(oService,aParam);
               return;
           }
           if(oTch.hasDefaultNotifyStaff())
              oTch.setNotifyStaffIds(oTch.getDefaultNotifyStaff().getId());
           oService.context.setDefault();
           if(!oService.onBeforeSubmit()) return;
           var oSendXML=oService.getSendXML(oTch);
           var isPrompt=(aParam.isPrompt==undefined)?true:aParam.isPrompt;
           if(isPrompt && QMsg("确认要提交信息？")!=MSG_YES) return; 
           if(oService.save(oSendXML,oTch))
           {
               MMsg(getAutoMsg()||"提交完毕！");
               formContext.closeWin();
               formContext.callback();
           }
		}
		function getAutoMsg()
		{
		   var returnXML=formContext.App.syncAjaxRequest("../../servlet/flowOper?OperType=13&tchId="+
		                 formContext.FLOW.TCH_ID+"&flowId="+formContext.FLOW.FLOW_ID);
	       sValue=(returnXML)?returnXML.selectSingleNode("/root/MSG").text:"";
		   return sValue;
		}
	    function moreSelect(oService,aParam)
        {
           if(!isOnClickBeforeEvent())return;            
           if(!oService.isFormValidate(flow.constant.actionType.run,oService.context.getValidateMod())) return;
           oService.tchIterator.setDefault();
           if(!oService.context.onBeforeFinish(null,oService.tchIterator)) return;           
           openWin(oService,aParam); 
        }
        function endTask(oService,aParam)
        {
           if(!isOnClickBeforeEvent())return;
           if(!aParam.eleOnLayer || isFlowBegin())
		   {
		      if(!oService.isFormValidate("endTask",oService.context.getValidateMod())) return;
		   }
           if(!oService.context.onBeforeFinish(null,null)) return;
           if(aParam.isAuto)
		      oService.context.setEndTaskAuto(true);
           if(oService.context.isEndTaskAuto())
           {
           	    oService.context.setDefault();
           	    if(!oService.onBeforeSubmit()) return;
            	var oSendXML=oService.getSendXML();
            	var isPrompt=(aParam.isPrompt==undefined)?true:aParam.isPrompt;
                if(isPrompt && QMsg("是否要"+oService.context.getEndTaskTitle()+"？")!=MSG_YES) return; 
                if(oService.save(oSendXML))
                {
                   MMsg("提交完毕！");
                   formContext.closeWin();
                   formContext.callback();
                }
                return;
           }
           openWin(oService,aParam);
        }
        function directFlow(oService,aParam)
        {
           var xmlDoc=oService.reGetXmlDoc(aParam.actionType);
           if(!oService.initByXML(xmlDoc)) return;
           if(!isOnClickBeforeEvent())return;
           if(!aParam.eleOnLayer || isFlowBegin())
           {
               if(!oService.isFormValidate(aParam.actionType,oService.context.getValidateMod())) return;
           }
           openWin(oService,aParam);
        }
		function openWin(oService,aParam)
		{
		   var param={win:window,context:oService.context,tchIterator:oService.tchIterator,
	               type:aParam.type,actionType:aParam.actionType,eleOnLayer:aParam.eleOnLayer};
	       var openModel=oService.context.getWinCfg().model;
	       if(openModel=="win")
	       {
			   var sHref="tacheContent.html";
			   var sPara='dialogwidth:650px;dialogheight:480px;status:no;help:no;resizable:yes;scroll=1';
			   var isOK=window.showModalDialog(sHref,param,sPara);
			   if(isOK==1) 
			   {
			       formContext.callback();
                   formContext.closeWin();
			   }
	       }
	       if(openModel=="layer")
	           showLayer(param);
		}		
		function isOnClickBeforeEvent()
		{	
			if(!formContext.onClickBeforeEvent()){
				return false;
			}else{
				return true;
			}
		}
   },
   getSendXML:function(oTch,oTchIterator)
   {
      	var flowXMLDoc=new ActiveXObject("Microsoft.XMLDOM");      	
      	var oFormXML=formContext.getSendXML();
      	var sTchXML="";
      	if(oTch)
      	   sTchXML=oTch.asXML()
        else if(oTchIterator)
           sTchXML=oTchIterator.getSelectedTchXML();
        var sendXML='<?xml version="1.0" encoding="GBK"?>'
          +    '<FLOW FLOW_ID="'+formContext.FLOW.FLOW_ID+'" toDir="flow"'
          +      ' FLOW_NAME="'+xmlEncode(this.context.getFlowName())+'">'
          +      '<FLOW_MOD>'+formContext.FLOW.FLOW_MOD+'</FLOW_MOD>'
          +      '<STAFF_ID>'+formContext.GLOBAL_VAR.STAFF_ID+'</STAFF_ID>'
          +      '<CUR_TCH_ID>'+formContext.FLOW.TCH_ID+'</CUR_TCH_ID>'
          +      '<CUR_TCH_CONTENT>'+xmlEncode(this.context.getOpinion().getValue())+'</CUR_TCH_CONTENT>'
          +      this.context.getOnAfterFinishExpr().getExecXML(oTch,this.tchIterator)
          +      sTchXML
          +      '<ATACHES/>'
          +    '</FLOW>';
        flowXMLDoc.loadXML(sendXML);
        var flowNode=flowXMLDoc.selectSingleNode("/FLOW");
        var formFlowNode=oFormXML.selectSingleNode("/root/FLOW");
	    if(null!=formFlowNode)
	    {
	       formFlowNode.selectNodes("/root/FLOW").removeAll();
	    }
	    oFormXML.selectSingleNode("/root").appendChild(flowNode);
        return oFormXML;        
   },
   onBeforeSubmit:function(oTch,oTchIterator)
   {
	   if(!this.context.onFinish(oTch,oTchIterator)) return false;
   	   if(oTchIterator && !oTchIterator.onCreate()) return false;
   	   if(!formContext.flowSubmit()) return false;
       return true;
   },
   save:function(XMLDoc,oTch,oTchIterator,async)
   {
   	   var isAsync=async||false;
   	   var saveURL='../../servlet/flowOper?OperType=2&formId='+formContext.getFormId()
   	               +'&formHistoryId='+formContext.GLOBAL_VAR["FORM_HISTORY_ID"]
   	   var self=this;
   	   if(!isAsync)
   	   {
   	       var isOK=formContext.App.syncAjaxRequest(saveURL,XMLDoc); 
		   if(isOK)
		   {
			   onAfterSave();
		   }
		   return isOK;
   	   }
   	   formContext.App.ajaxRequest(saveURL,{async:true,xml:XMLDoc,onStateChange:function(oXMLHttp){stateChange(oXMLHttp)}});
   	   function stateChange(oXMLHttp)
   	   {
   	   	  var oLayer=Layer.instances["FL_EGN_WIN"].getDomEle();
   	   	  Message.xmlHttpLoading(oXMLHttp,{wait:"流程提交中,请稍候......",succeed:"提交成功"},oLayer,
   	   	  {
   	   	    onSucceed:function()
   	   	    {
   	   	       onAfterSave();
   	   	       window.setTimeout(function(){formContext.closeWin();formContext.callback();},1000);
   	   	    },
   	   	    onClick:function()
   	   	    {
   	   	       formContext.closeWin();
	           formContext.callback();
   	   	    }
   	   	  })   	      
   	   }
   	   function onAfterSave()
	   {
	       self.context.onAfterFinish(oTch,oTchIterator);
		   if(oTchIterator)
		      oTchIterator.onAfterCreate(oTch);
	   }
   },
   getOpinionMenuDoc:function()
   {
      return formContext.App.syncAjaxRequest('../../servlet/flowOper?OperType=14&'
   	                                              +'&flowMod='+formContext.FLOW.FLOW_MOD+'&tchMod='
   	                                              +formContext.FLOW.TCH_MOD);
   }
};
flow.Context=function()
{
   var xmlNode;
   var nextTchAuto=false;//下一环节是否被流程引擎自动创建
   var defaultTch;
   var nextTchCount=0;
   var existUnClosedConnTch=false;
   var isSetDefaultTch=false;
   var tacheEditable=true;
   var endTaskAuto=false;
   var endTaskTitle;
   var validateMode={run:true,end:true,"return":true,transfer:true,endTask:true};
   var winCfg={model:"win",showSaveSucceed:false,showFlowName:true,showAttach:true};
   var layerStyle={fullScreen:"0",width:"650px",height:"480px"};
   var opinion={};
   var defaultFlowName={};
   var flowName="";
   var onFinishExpr={};
   var onBeforeFinishExpr={};
   var onAfterFinishExpr={};
   var execDesc;
   var serialState=flow.constant.serialState.none;
   this.getFlowName=function(){return flowName};
   this.setFlowName=function(pFlowName){return flowName=pFlowName};
   this.getEndTaskTitle=function(){return endTaskTitle};
   this.setEndTaskTitle=function(pEndTaskTitle){endTaskTitle=pEndTaskTitle};
   this.isEndTaskAuto=function(){return endTaskAuto};
   this.setEndTaskAuto=function(pEndTaskAuto){endTaskAuto=pEndTaskAuto};   
   this.getValidateMod=function(){return validateMode};
   this.getExecDesc=function(){return execDesc};
   this.setExecDesc=function(pExecDesc){execDesc=pExecDesc};
   this.getWinCfg=function(){return winCfg};
   this.setWinCfg=function(pWinCfg){winCfg= pWinCfg};
   this.getLayerStyle=function(){return layerStyle};
   this.setLayerStyle=function(pLayerStyle){layerStyle= pLayerStyle};
   this.getSerialState=function(){return serialState};
   this.setSerialState=function(pSerialState){serialState= pSerialState};
   this.setValidateMod=function(pValidateMod)
   {
   	  if(pValidateMod)
   	  {
   	  	 for(var key in pValidateMod)
            validateMode[key]=pValidateMod[key];
   	  }
   };
   this.setNextTchAuto=function(pAuto)
   {
      nextTchAuto=(pAuto=="0")?false:true;
   };
   this.isNextTchAuto=function(){return nextTchAuto};
   this.isTacheEditale=function(){return tacheEditable};
   this.setTacheEditale=function(pEditable){tacheEditable=pEditable};   
   this.setDefaultTch=function(aDefaultTch)
   {
   	   if(!aDefaultTch.ids) return;
   	   isSetDefaultTch=true;
   	   defaultTch={ids:"",selectedTchIds:"",canChange:true,selected:false,hiddenOther:false,count:0};
       defaultTch.ids=aDefaultTch.ids+"";
       defaultTch.selectedTchIds=(aDefaultTch.selected==flow.constant.aBoolean.True)?aDefaultTch.ids:aDefaultTch.selectedTchIds+"";
       defaultTch.canChange=(aDefaultTch.canChange==flow.constant.aBoolean.True)?true:false;
       defaultTch.selected=(aDefaultTch.selected==flow.constant.aBoolean.True)?true:false;
       defaultTch.hiddenOther=(aDefaultTch.hiddenOther==flow.constant.aBoolean.True)?true:false;
       if(defaultTch.selected && !defaultTch.canChange)
       {       
       	  defaultTch.hiddenOther=true;
       }   
       defaultTch.count=aDefaultTch.count;
   };
   this.getDefaultTch=function(){return defaultTch};
   this.setNextTchCount=function(pNextTchCnt){nextTchCount=pNextTchCnt};
   this.getNextTchCount=function(){return nextTchCount};
   this.hasDefaultTch=function(){return isSetDefaultTch};
   this.isDisabled=function()
   {
       if(nextTchAuto) return (nextTchCount>1)?true:false;
       if(isSetDefaultTch && defaultTch.count>1 && !defaultTch.canChange) return true;
       return false;
   }
   this.hasUnClosedConnTch=function(){return existUnClosedConnTch};
   this.setHasUnClosedConnTch=function(pHasUnClosedConnTch){existUnClosedConnTch=pHasUnClosedConnTch};
   this.getOpinion=function(){return opinion;}
   this.setOpinion=function(sType,sDefaultValueExpr,sDefaultValueType,sValue)
   {        
        var value="";
        opinion.type=sType;
        opinion.setValue=function(pValue){value=pValue};
        opinion.getValue=function(){return value};
        opinion.getDefaultValue=function()
        {
		    if(sValue!="") return sValue;	
		    if(sDefaultValueType=="") sDefaultValueType="form";
		    if(sDefaultValueExpr!="") return flow.Expr.parse(sDefaultValueType,sDefaultValueExpr,{});
		    if(formContext.QuickOpinion) return formContext.QuickOpinion.value;//todo 可以重构后去掉，需要改调用方
		    return "";
        }
   }
   this.getDefaultFlowName=function(){return defaultFlowName;};
   this.setDefaultFlowName=function(aDefaultFlowName)
   {
    	 defaultFlowName.get=function()
    	 {
    	     if(aDefaultFlowName.exprType && aDefaultFlowName.nameExpr) 
    	         return flow.Expr.parse(aDefaultFlowName.exprType,aDefaultFlowName.nameExpr,{});
    	     return formContext.FLOW.FLOW_NAME;
    	 }
    };
    this.getOnAfterFinishExpr=function(){return onAfterFinishExpr};
    this.setOnAfterFinishExpr=function(aOnAfterFinishExpr)
    {
         onAfterFinishExpr=flow.Expr.copyObj(aOnAfterFinishExpr);
         onAfterFinishExpr.getExecXML=function(oTch,oTchIterator)
         {
         	 var aParam=getEventParam(oTch,oTchIterator);
         	 return flow.Expr.getExecXML(onAfterFinishExpr.type,"ON_AFTER_FINISH",onAfterFinishExpr.value
              ,{action:aParam.action,selTch:aParam.modelId,selStaff:aParam.staffId,
               selTchNum:aParam.modelNum,funcType:onAfterFinishExpr.type});  
         }
    };    
    this.onAfterFinish=function(oTch,oTchIterator)
    {
        if(!onAfterFinishExpr.type || !onAfterFinishExpr.value 
           || onAfterFinishExpr.type!=flow.constant.scriptType.js) return;
        var aParam=getEventParam(oTch,oTchIterator);
        flow.Expr.exec(onAfterFinishExpr.value,
        	           {action:aParam.action,selTch:aParam.modelId,selStaff:aParam.staffId,
                        selTchNum:aParam.modelNum,funcType:flow.constant.scriptType.js});
    };
    this.setOnBeforeFinishExpr=function(aOnBeforeFinishExpr)
    {
         onBeforeFinishExpr=flow.Expr.copyObj(aOnBeforeFinishExpr);
    };    
    this.onBeforeFinish=function(oTch,oTchIterator)
    {
    	 if(!onBeforeFinishExpr.type || !onBeforeFinishExpr.value) return true;
         var aParam=getEventParam(oTch,oTchIterator);
         return flow.Expr.exec(onBeforeFinishExpr.value,
       	                      {action:aParam.action,selTch:aParam.modelId,selStaff:aParam.staffId,
       	                       selTchNum:aParam.modelNum,funcType:onBeforeFinishExpr.type});
    };
    this.setOnFinishExpr=function(aOnFinishExpr){onFinishExpr=flow.Expr.copyObj(aOnFinishExpr)};
    this.onFinish=function(oTch,oTchIterator)
    {
       if(!onFinishExpr.type || !onFinishExpr.value) return true;
       var aParam=getEventParam(oTch,oTchIterator);
       return flow.Expr.exec(onFinishExpr.value,
       	                     {action:aParam.action,selTch:aParam.modelId,selStaff:aParam.staffId,
       	                      selTchNum:aParam.modelNum,funcType:onFinishExpr.type});
    };
    this.setDefault=function()
    {    	
        this.setFlowName(defaultFlowName.get());
        this.getOpinion().setValue(opinion.getDefaultValue());
    };
    this.setXMLNode=function(oXMLNode)
    {
        this.xmlNode=oXMLNode;
    };
    this.getXMLNode=function()
    {
        return this.xmlNode;        
    }
    this.hasNextTchHook=function()
    {
       return(this.xmlNode.getAttribute("NEXT_TCHS_TYPE")!=""
             && this.xmlNode.getAttribute("NEXT_TCHS_VALUE")!="");
    }
    this.resetByHook=function()
    {
	    var oTchXMLnodes=this.xmlNode.childNodes;
	    var nextTchCnt=oTchXMLnodes.length;
	   	var defaultNextTchCnt=0;
	   	var oNextTchs=getNextTch(this.xmlNode)
	    var nextTchIds=oNextTchs.nextTchIds;
	    var selectedTchIds=oNextTchs.selectedTchIds;
	   	for(var i=0;i<oTchXMLnodes.length;i++)
	   	{
	   	   var oTchXMLnode=oTchXMLnodes[i];
	   	   var sTchMod=oTchXMLnode.selectSingleNode("TCH_MOD").text;
	   	   var sConnTchClosed=oTchXMLnode.selectSingleNode("CON_TCH_CLOSED").text;
	   	   if(sConnTchClosed=="1")
	   	   {   	   
	   	   	  if(sTchMod.isInArray(nextTchIds.split(","))) defaultNextTchCnt++;   	        
	   	   }
	   	   else
	   	      nextTchCnt--;
	    }
	    this.setNextTchCount(nextTchCnt);
	    this.setHasUnClosedConnTch(nextTchCnt<oTchXMLnodes.length);
	    formContext.setParalleling(nextTchCnt<oTchXMLnodes.length);
	    this.setDefaultTch({ids:nextTchIds,selectedTchIds:selectedTchIds,canChange:this.xmlNode.getAttribute("NEXT_TCHS_CAN_CHANGE"),
                          selected:this.xmlNode.getAttribute("NEXT_TCHS_IS_SELECTED"),
                          hiddenOther:this.xmlNode.getAttribute("NEXT_TCHS_IS_HIDDEN_OTHER"),
                          count:defaultNextTchCnt});
        function getNextTch(xmlNode)
        {
            var oNextTch=flow.Expr.parse(xmlNode.getAttribute("NEXT_TCHS_TYPE"),
	                                   xmlNode.getAttribute("NEXT_TCHS_VALUE"),{})+"";
	        var nextTchIds="",selectedTchIds="";
	        if(oNextTch.indexOf(":")==-1)
	        {
	            nextTchIds=oNextTch;
	        }
	        else
	        {
	        	var aNextTch=oNextTch.split(":")
	            nextTchIds=aNextTch[0]||"";
	            selectedTchIds=aNextTch[1]||"";
	        }
	        return {nextTchIds:nextTchIds,selectedTchIds:selectedTchIds};
        }
    };
    var getEventParam=function(oTch,oTchIterator)
    {
         var aParam={action:"",modelId:"",staffId:"",modelNum:""};
    	 if(oTch)
    	 {
    	     aParam.action=oTch.getAction();
    	     aParam.modelId=oTch.getModelId();
    	     aParam.staffId=oTch.getExcuteStaffIds();
    	     aParam.modelNum=oTch.getTchNum();
    	 }
    	 else if(oTchIterator)
    	 {
    	 	 var oSelTchs=oTchIterator.getSelectedTchsInfo();
    	 	 aParam=flow.Expr.copyObj(oSelTchs);
    	 }
    	 return aParam;
    }
};

flow.Context.createInst=function(xmlNode)
{
	var oContext=new flow.Context();
	oContext.setXMLNode(xmlNode);
	formContext.setSerialing(xmlNode.getAttribute("SERIAL_STATE")==flow.constant.serialState.inProgress);
	oContext.resetByHook();	
    var oCommands=[{command:"setNextTchAuto",param:xmlNode.getAttribute("IS_AUTO")},
                   {command:"setTacheEditale",param:(xmlNode.getAttribute("IS_TACHE_EDITABLE")==flow.constant.aBoolean.True)},
                   {command:"setEndTaskTitle",param:xmlNode.getAttribute("END_TASK_TITLE")},
                   {command:"setEndTaskAuto",param:(xmlNode.getAttribute("IS_END_TASK_AUTO")==flow.constant.aBoolean.True)},
                   {command:"setValidateMod",param:flow.Expr.parseJson(xmlNode.getAttribute("FLOW_VALIDATE_MODE"))},
                   {command:"setLayerStyle",param:flow.Expr.parseJson(xmlNode.getAttribute("LAYER_STYLE"))},
                   {command:"setExecDesc",param:xmlNode.getAttribute("EXEC_DESC")},
                   {command:"setSerialState",param:xmlNode.getAttribute("SERIAL_STATE")},
                   {command:"setDefaultFlowName",
                    param:{exprType:xmlNode.getAttribute("DEFAULT_FLOW_NAME_TYPE"),
                          nameExpr:xmlNode.getAttribute("DEFAULT_FLOW_NAME_VALUE")}},                
                   {command:"setOnBeforeFinishExpr",
                   param:{type:xmlNode.getAttribute("ON_BEFORE_FINISH_TYPE"),
                          value:xmlNode.getAttribute("ON_BEFORE_FINISH")}},
                   {command:"setOnFinishExpr",
                   param:{type:xmlNode.getAttribute("ON_FINISH_TYPE"),
                          value:xmlNode.getAttribute("ON_FINISH")}},          
                   {command:"setOnAfterFinishExpr",
                   param:{type:xmlNode.getAttribute("ON_AFTER_FINISH_TYPE"),
                          value:xmlNode.getAttribute("ON_AFTER_FINISH")}}];
                          
   var iLen=oCommands.length;
   for(var i=0;i<iLen;i++)
   {
      var oCommand=oCommands[i];
      oContext[oCommand.command](oCommand.param);
   }
   setOpinion(oContext,xmlNode);
   setWinCfg(oContext,xmlNode);
   return oContext;
   function setOpinion(oContext,xmlNode)
   {
       oContext.setOpinion(xmlNode.getAttribute("OPINION_TYPE"),
                           xmlNode.getAttribute("DEFAULT_OPINION_VALUE"),
                           xmlNode.getAttribute("DEFAULT_OPINION_TYPE"),
                           xmlNode.getAttribute("OPINION"))
   }
   function setWinCfg(oContext,xmlNode)
   {
      var oWinCfg=flow.Expr.parseJson(xmlNode.getAttribute("FLOW_WIN_CFG"));
      var oSysWinCfg=flow.Expr.parseJson(xmlNode.getAttribute("SYS_FLOW_WIN_CFG"));
      for (var key in oSysWinCfg)
      {      
          if(oWinCfg && oWinCfg[key]!=undefined && key!="model")
          {
              oSysWinCfg[key]=oWinCfg[key];
          }
      }
      oContext.setWinCfg(oSysWinCfg);
   }
}
flow.NextTch=function(xmlNode)
{
    var modelId;
    var name;
    var desc="";
    var action;
    var showed=true;
    var selected=false;
    var excuteStaffIds="";
    var excuteGroupIds="";
    var notifyStaffIds="";
    var excludeTch=[];
    var ownerPanel;
    var defaultStaff;
    var defaultNotifyStaff;
    var defaultOrg;
    var notifyDefaultOrg;
    var staffCreateType;
    var notifyStaffCreateType;
    var auto=false;
    var disabled=false;
    var actionRunTitle;
    var actionBackTitle;
    var actionTransferTitle;
    var filterStaffWhere;
    var sms={display:false,selected:false,changed:false};
    var mail={display:false,selected:false,changed:false};
    var notifyCfg={sms:{display:false,selected:false,canChange:true},mail:{display:false,selected:false,canChange:true}};
    var onBeforeCreateExpr={};
    var onAfterCreateExpr={};
    var onCreateExpr={};
    var remark;
    var tchNum;
    this.counterSignCfg={text:'会签方式:',display:false, canParallel:false,canSerial:false,
                        parallel:{checked:false,text:'并行',display:false},
                        serial:{checked:false,text:'串行',display:false}}
    this.setModelId=function(pModelId){modelId=pModelId};
    this.getModelId=function(){return modelId};
    this.setName=function(pName){name=pName};
    this.getName=function(){return name};
    this.setRemark=function(pRemark){remark=pRemark};
    this.getRemark=function(){return remark};
    this.setDesc=function(pDesc){desc=pDesc};
    this.getDesc=function(){return (desc)?desc:name};
    this.setAuto=function(pAuto){auto=pAuto};
    this.isAuto=function(){return auto};
    this.setDisabled=function(pDisabled){return disabled=pDisabled};
    this.isDisabled=function(){return disabled}; 
    this.setActionRunTitle=function(pActionRunTitle){return actionRunTitle=pActionRunTitle};
    this.getActionRunTitle=function(){return actionRunTitle};
    this.setActionBackTitle=function(pActionBackTitle){return actionBackTitle=pActionBackTitle};
    this.getActionBackTitle=function(){return actionBackTitle};
    this.setActionTransferTitle=function(pActionTransferTitle){return actionTransferTitle=pActionTransferTitle};
    this.getActionTransferTitle=function(){return actionTransferTitle};
    this.setFilterStaffWhere=function(pFilterStaffWhere){return filterStaffWhere=pFilterStaffWhere};
    this.getFilterStaffWhere=function(){return filterStaffWhere};
    this.setExcuteStaffIds=function(pExcuteStaffIds){excuteStaffIds=pExcuteStaffIds};
    this.getExcuteStaffIds=function(){return excuteStaffIds};
    this.setExcuteGroupIds=function(pExcuteGroupIds){excuteGroupIds=pExcuteGroupIds};
    this.getExcuteGroupIds=function(){return excuteGroupIds};
    this.setNotifyStaffIds=function(pNotifyStaffIds){notifyStaffIds=pNotifyStaffIds};
    this.getNotifyStaffIds=function(){return notifyStaffIds};    
    this.getStaffCreateType=function(){return staffCreateType};
    this.setStaffCreateType=function(pStaffCreateType){staffCreateType=pStaffCreateType};
    this.getNotifyStaffCreateType=function(){return notifyStaffCreateType};
    this.setNotifyStaffCreateType=function(pNotifyStaffCreateType){notifyStaffCreateType=pNotifyStaffCreateType};    
    this.setAction=function(pAction){action=pAction};
    this.getAction=function(){return action};
    this.setMail=function(pMail){mail=flow.Expr.copyObj(pMail)};   
    this.getMail=function(){return mail;}; 
    this.getSms=function(){return sms;};
    this.setSms=function(pSms){sms=flow.Expr.copyObj(pSms)};
    this.setNotifyCfg=function(pNotifyCfg){notifyCfg=flow.Expr.parseJson(pNotifyCfg)};
    this.getNotifyCfg=function(){return notifyCfg};
    this.isShowed=function(){return showed};
    this.setShowed=function(pShowed){showed=pShowed};
    this.setOwnerPanel=function(pOwnerPanel){ownerPanel=pOwnerPanel};
    this.getOwnerPanel=function(){return ownerPanel};
    this.pushExcludeTch=function(oTch){excludeTch.push(oTch);};
    this.getExcludeTchs=function(){return excludeTch;};
    this.setExcludeTchs=function(aTch){excludeTch=aTch;};
    this.setTchNum=function(pTchNum){tchNum=pTchNum};
    this.getTchNum=function(){return tchNum};
    this.getShowName=function()
    {
  	   var aReturn={};
	   aReturn[flow.constant.actionType.run]=this.getActionRunTitle().replace('%TCH_NAME%',this.getName());
	   aReturn[flow.constant.actionType.back]=this.getActionBackTitle().replace('%TCH_NAME%',this.getName());
	   aReturn[flow.constant.actionType.transfer]=this.getActionTransferTitle().replace('%TCH_NAME%',this.getName());
	   aReturn[flow.constant.actionType.end]=this.getName();
	   return aReturn[this.getAction()];
    }
    this.clearExcludeTch=function()
    {
    	var iLen=excludeTch.length;
		for (var i=0;i<iLen;i++)
		   excludeTch.pop();
    };
    this.popExcludeTch=function(otherTch)
    {
        for(var i=0;i<excludeTch.length;i++)
        {
           if(excludeTch[i]==otherTch)
           {
               excludeTch.splice(i,1);
               return;
           }
        }
    }
    this.isExclude=function(otherTch)
    {
        var iLen=otherTch.getExcludeTchs().length;
        for(var i=0;i<iLen;i++)
        {
           if(otherTch.getExcludeTchs()[i]==this) return true;
        }
        return false;
    }
    this.hasDefaultStaff=function(){return (defaultStaff)?true:false;}; 
    this.getDefaultStaff=function(){return defaultStaff;};    
    this.setDefaultStaff=function(aDefaultStaff)
    {    	
        defaultStaff=setStaff(aDefaultStaff);
    }
    this.getDefaultNotifyStaff=function(){return defaultNotifyStaff;};
    this.hasDefaultNotifyStaff=function(){return (defaultNotifyStaff)?true:false;};
    this.setDefaultNotifyStaff=function(aNotifyStaff)
    {
        defaultNotifyStaff=setStaff(aNotifyStaff);  
    }
    this.hasDefaultOrg=function(){return (defaultOrg)?true:false;};
    this.getDefaultOrg=function(){return defaultOrg};
    this.setDefaultOrg=function(aDefaultOrg)
    {
    	defaultOrg=flow.Expr.copyObj(aDefaultOrg);    
    	defaultOrg.getId=function()
    	{
    	    return flow.Expr.parse(defaultOrg.exprType,defaultOrg.expr,{selTch:modelId,action:action,selTchNum:tchNum});
    	}
    }
    this.setNotifyDefaultOrg=function(aNotifyDefaultOrg)
    {
        notifyDefaultOrg=flow.Expr.copyObj(aNotifyDefaultOrg);
        notifyDefaultOrg=flow.Expr.copyObj(aNotifyDefaultOrg);    
    	notifyDefaultOrg.getId=function()
    	{
    	    return flow.Expr.parse(notifyDefaultOrg.exprType,notifyDefaultOrg.expr,{selTch:modelId,action:action,selTchNum:tchNum});
    	}
    }
    this.hasNotifyDefaultOrg=function(){return (notifyDefaultOrg)?true:false;};
    this.getNotifyDefaultOrg=function(){return notifyDefaultOrg};
    var setStaff=function(aStaff)
    {
	     var oStaff=flow.Expr.copyObj(aStaff);
	     oStaff.getId=function()
	     {
	         return flow.Expr.parse(aStaff.exprType,aStaff.valueExpr,{selTch:modelId,action:action,selTchNum:tchNum});
	     }
	     oStaff.getName=function()
	     {
	     	return flow.Expr.parse(aStaff.exprType,aStaff.nameExpr,{selTch:modelId,action:action,selTchNum:tchNum});
	     }
	     return oStaff;
    }
    this.isSelected=function(){return selected}; 
    this.setSelected=function(pSelected){selected=pSelected};  
    this.select=function()
    {
        selected=true;
        for(var i=0;i<excludeTch.length;i++)
        {
           var oExcludeTch=excludeTch[i];
           oExcludeTch.unSelect();
           if(oExcludeTch.getOwnerPanel())
           {
               oExcludeTch.getOwnerPanel().unSelect();
           }
        }
    };
    this.unSelect=function()
    {
       selected=false;
    };
    this.isEnd=function()
    {
        return (action==flow.constant.actionType.end)	
    }
    this.canChangeNotifyStaff=function()
    {
    	if(this.hasDefaultNotifyStaff() && !defaultNotifyStaff.canChange) return false;
        return true;
    }
    this.canChangeStaff=function()
    {
    	if(this.isEnd()) return false;
    	if(this.hasDefaultStaff() && !defaultStaff.canChange)  return false;
        return(staffCreateType==flow.constant.staffCreateType.deptTree 
               || staffCreateType==flow.constant.staffCreateType.dutyTree
               || staffCreateType==flow.constant.staffCreateType.groupTree);
    }
    this.canWithoutExecuter=function()
    {
        if(this.isEnd()) return true;
        if(staffCreateType==flow.constant.staffCreateType.func) return true;
        return false;
    }
    this.canAutoFinish=function()
    {
    	if(!this.isAuto()) return false;
        if(this.isAuto()) 
        {
        	if(this.canWithoutExecuter()) return true;
            if(this.getExcuteStaffIds()) return true;
        }
        return false;
    }
    this.setOnCreateExpr=function(aOnCreateExpr){onCreateExpr=flow.Expr.copyObj(aOnCreateExpr)};
    this.getOnCreateExpr=function(){return onCreateExpr};
    this.onCreate=function()
    {
       if(!onCreateExpr.type || !onCreateExpr.value) return true;
       return flow.Expr.exec(onCreateExpr.value,
       	                     {action:action,selTch:modelId,selStaff:excuteStaffIds,
       	                      selTchNum:tchNum,funcType:onCreateExpr.type});
    };
    this.setOnBeforeCreateExpr=function(aOnBeforeCreateExpr)
    {
        onBeforeCreateExpr=flow.Expr.copyObj(aOnBeforeCreateExpr)
    };
    this.onBeforeCreate=function()
    {
       if(!onBeforeCreateExpr.type || !onBeforeCreateExpr.value) return true;
       return flow.Expr.exec(onBeforeCreateExpr.value,
       	                     {action:action,selTch:modelId,selStaff:excuteStaffIds,
       	                      selTchNum:tchNum,funcType:onBeforeCreateExpr.type});
    };
    this.getOnAfterCreateExpr=function(){return onAfterCreateExpr};
    this.setOnAfterCreateExpr=function(aOnAfterCreateExpr)
    {
         onAfterCreateExpr=flow.Expr.copyObj(aOnAfterCreateExpr);
         
         onAfterCreateExpr.getExecXML=function()
         {
         	return flow.Expr.getExecXML(onAfterCreateExpr.type,"ON_AFTER_CREATE",onAfterCreateExpr.value
                   ,{action:action,selTch:modelId,selStaff:excuteStaffIds,funcType:onAfterCreateExpr.type,selTchNum:tchNum});
         }
    };
    this.onAfterCreate=function()
    {
       if(!onAfterCreateExpr.type || !onAfterCreateExpr.value 
          || onAfterCreateExpr.type!=flow.constant.scriptType.js) return;
       flow.Expr.exec(onAfterCreateExpr.value,
       	              {action:action,selTch:modelId,selStaff:excuteStaffIds,selTchNum:tchNum,
                      funcType:flow.constant.scriptType.js});
    };    
    var getGroupId = function(pGroupIds)
    {
    	var groupIds="";
    	if(pGroupIds!=null&&pGroupIds!='') groupIds=pGroupIds.match(/(\b\d+\b)(?!.*,\1(,|$))/ig);
    	if(groupIds==null) groupIds = "";
    	return groupIds;
    };
    this.asXML=function()
    {  
    	var aExecuteStaff=excuteStaffIds.split(",");
    	if(this.counterSignCfg.parallel.checked)
    	{    	   
    	   if(excuteGroupIds!=null)
    	   {
    	   	  var aExecuteGroup = excuteGroupIds.split(",");
    	   }
    	   var aXML=[];
    	   var groupId="";
    	   for (var i=0;i<aExecuteStaff.length;i++)
    	   {
    	   	  if(excuteGroupIds!=null) groupId = excuteGroupIds[i];
    	         aXML[i]=getXML(this,aExecuteStaff[i],groupId,"");
    	   }
    	   return aXML.join("");
    	}
    	if(this.counterSignCfg.serial.checked)
    	{
    	    return getXML(this,aExecuteStaff[0],excuteGroupIds,excuteStaffIds);
    	}
    	return getXML(this,excuteStaffIds,excuteGroupIds,"");
	    function getXML(oTch,sStaffid,sGroupId,sSerialStaffid)
	    {
	       var sXML='<NEXT_TCH_MOD>'
			   +'<TCH_DESC>'+xmlEncode(oTch.getDesc())+'</TCH_DESC>'
			   +'<TCH_MOD>'+oTch.getModelId()+'</TCH_MOD>'
			   +'<NEXT_STAFF>'+sStaffid+'</NEXT_STAFF>'
			   +'<SERIAL_STAFF>'+sSerialStaffid+'</SERIAL_STAFF>'
			   +'<NEXT_GROUP>'+getGroupId(sGroupId)+'</NEXT_GROUP>'
			   +'<NOTIFY_STAFFS>'+oTch.getNotifyStaffIds()+'</NOTIFY_STAFFS>'
			   +oTch.getOnAfterCreateExpr().getExecXML()
			   +'<IS_SEND_SMS>'+((oTch.getSms().selected)?1:0)+'</IS_SEND_SMS>'
			   +'<IS_SEND_MAIL>'+((oTch.getMail().selected)?1:0)+'</IS_SEND_MAIL>'
			   +'<IS_SEND_N_SMS>'+((oTch.getNotifyCfg().sms.selected)?1:0)+'</IS_SEND_N_SMS>'
			   +'<IS_SEND_N_MAIL>'+((oTch.getNotifyCfg().mail.selected)?1:0)+'</IS_SEND_N_MAIL>'
			   +'</NEXT_TCH_MOD>';
		   return sXML;
	    }
    }
    this.clone=function()
    {
    	var oClone=new flow.NextTch();
    	oClone.setModelId(this.getModelId());
    	oClone.setName(this.getName());
    	oClone.setStaffCreateType(this.getStaffCreateType());
    	oClone.setAction(this.getAction());
    	oClone.setSelected(this.isSelected());
    	oClone.setShowed(this.isShowed());
    	oClone.setOnCreateExpr(this.getOnCreateExpr());
    	oClone.setOnAfterCreateExpr(this.getOnAfterCreateExpr());
    	if(this.hasDefaultOrg())
    	{
    		oClone.setDefaultOrg(this.getDefaultOrg());
    	}
    	if(this.hasDefaultNotifyStaff())
    	{
    	   oClone.setDefaultNotifyStaff(this.getDefaultNotifyStaff());
    	}
    	oClone.setExcludeTchs(this.getExcludeTchs());
    	oClone.setSms(this.getSms());
    	oClone.setMail(this.getMail());
    	oClone.setRemark(this.getRemark());
    	appendToExclude(oClone);
        return oClone;
        function appendToExclude(oClone)
        {
            for(var i=0;i<oClone.getExcludeTchs().length;i++)
            {
                oClone.getExcludeTchs()[i].pushExcludeTch(oClone);
            }
        }
    }
};
flow.NextTch.createInst=function(xmlNode,context)
{
   var modelId=xmlNode.selectSingleNode("TCH_MOD").text;
   var isDefault=getDefault(context,modelId);
   var oCommands=[
                  {command:"setModelId",param:modelId},
                  {command:"setName",param:xmlNode.selectSingleNode("TCH_NAME").text},
                  {command:"setTchNum",param:xmlNode.selectSingleNode("TCH_NUM").text},
                  {command:"setRemark",param:xmlNode.selectSingleNode("REMARK").text},          
                  {command:"setAction",param:xmlNode.selectSingleNode("TACHE_ACTION").text},
                  {command:"setAuto",param:(xmlNode.selectSingleNode("IS_AUTO").text==flow.constant.aBoolean.True)},
                  {command:"setStaffCreateType",param:xmlNode.selectSingleNode("STAFF_CREATE_TYPE").text},
                  {command:"setNotifyStaffCreateType",param:xmlNode.selectSingleNode("NOTIFY_STAFF_CREATE_TYPE").text},
                  {command:"setSelected",param:getSelected(isDefault,modelId)},
                  {command:"setDisabled",param:getDisabled(isDefault,modelId)},   
                  {command:"setActionRunTitle",param:xmlNode.selectSingleNode("ACTION_RUN_TITLE").text},
                  {command:"setActionBackTitle",param:xmlNode.selectSingleNode("ACTION_BACK_TITLE").text},
                  {command:"setActionTransferTitle",param:xmlNode.selectSingleNode("ACTION_TRANSFER_TITLE").text},   
                  {command:"setFilterStaffWhere",param:xmlNode.selectSingleNode("FILTER_STAFF_WHERE").text},
                  {command:"setSms",param:getNotify(xmlNode.selectSingleNode("SMS_JSON").text)},
                  {command:"setMail",param:getNotify(xmlNode.selectSingleNode("MAIL_JSON").text)},
                  {command:"setNotifyCfg",param:xmlNode.selectSingleNode("NOTIFY_CFG").text},
                  {command:"setShowed",param:getShowed(xmlNode,isDefault)},
                  {command:"setOnCreateExpr",
                   param:{type:xmlNode.selectSingleNode("ON_CREATE_TYPE").text,
                          value:xmlNode.selectSingleNode("ON_CREATE").text}},
                  {command:"setOnAfterCreateExpr",
                   param:{type:xmlNode.selectSingleNode("ON_AFTER_CREATE_TYPE").text,
                          value:xmlNode.selectSingleNode("ON_AFTER_CREATE").text}},
                  {command:"setOnBeforeCreateExpr",
                   param:{type:xmlNode.selectSingleNode("ON_BEFORE_CREATE_TYPE").text,
                         value:xmlNode.selectSingleNode("ON_BEFORE_CREATE").text}}
                 ];
   var iLen=oCommands.length;
   var oNextTch=new flow.NextTch();
   for(var i=0;i<iLen;i++)
   {
      var oCommand=oCommands[i];
      oNextTch[oCommand.command](oCommand.param);      
   }
   setDefaultStaff(oNextTch,xmlNode);
   setDefaultNotifyStaff(oNextTch,xmlNode);
   setDefaultOrg(oNextTch,xmlNode);
   setNotifyDefaultOrg(oNextTch,xmlNode);
   setCounterSignCfg(oNextTch,xmlNode,context)
   return oNextTch;
   function setCounterSignCfg(oNextTch,xmlNode,context)
   {
       var oCounterSignCfg=flow.Expr.parseJson(xmlNode.selectSingleNode("COUNTERSIGN_CFG").text);
       var serialState=context.getSerialState();
       var canParallel=(xmlNode.selectSingleNode("MULTI_INST").text=="1")?true:false;
       var canSerial=(xmlNode.selectSingleNode("CAN_SERIAL").text==flow.constant.aBoolean.True)?true:false;
       canSerial=(canSerial && serialState!=flow.constant.serialState.inProgress)?true:false;
       canParallel=(canParallel && serialState!=flow.constant.serialState.inProgress)?true:false;
       oNextTch.counterSignCfg.canParallel=canParallel;
       oNextTch.counterSignCfg.canSerial=canSerial;
       oNextTch.counterSignCfg.text=oCounterSignCfg.text;
       oNextTch.counterSignCfg.display=(canSerial || canParallel)?oCounterSignCfg.display:false;
       oNextTch.counterSignCfg.parallel.text=oCounterSignCfg.parallel.text;
       oNextTch.counterSignCfg.parallel.display=(canParallel)?oCounterSignCfg.parallel.display:false;
       oNextTch.counterSignCfg.parallel.checked=(canParallel)?oCounterSignCfg.parallel.checked:false;
       oNextTch.counterSignCfg.serial.text=oCounterSignCfg.serial.text;
       oNextTch.counterSignCfg.serial.display=(canSerial)?oCounterSignCfg.serial.display:false;
       oNextTch.counterSignCfg.serial.checked=(canSerial)?oCounterSignCfg.serial.checked:false;
       if(!oNextTch.counterSignCfg.serial.display && !oNextTch.counterSignCfg.parallel.display)
           oNextTch.counterSignCfg.display=false;          
   }
   function setDefaultNotifyStaff(oNextTch,xmlNode)
   {
        var value=xmlNode.selectSingleNode("NOTIFY_STAFF_VALUE").text;
        var type=xmlNode.selectSingleNode("NOTIFY_STAFF_TYPE").text; 
        if(type && value)
    	{  
    		var defaultNotifyStaff={};
    		var disabled=xmlNode.selectSingleNode("NOTIFY_STAFF_DISABLED").text;
    		var selected=xmlNode.selectSingleNode("NOTIFY_STAFF_SELECTED").text;
    		var canChange=xmlNode.selectSingleNode("NOTIFY_STAFF_CAN_CHANGE").text;
    		defaultNotifyStaff.canChange=(canChange==flow.constant.aBoolean.True)?true:false;
    		defaultNotifyStaff.exprType=type;
    		defaultNotifyStaff.valueExpr=value;
    		defaultNotifyStaff.nameExpr="";
    		defaultNotifyStaff.disabled=(disabled==flow.constant.aBoolean.True)?true:false;
    		defaultNotifyStaff.selected=(selected==flow.constant.aBoolean.True)?true:false;
    		oNextTch.setDefaultNotifyStaff(defaultNotifyStaff);
    	}
   }   
   function setDefaultStaff(oNextTch,xmlNode)
   {
        var value=xmlNode.selectSingleNode("DEFAULT_STAFF_VALUE").text;
        var type=xmlNode.selectSingleNode("DEFAULT_STAFF_TYPE").text;  
        if(type && value)
    	{
    		var defaultStaff={};
    		var name=xmlNode.selectSingleNode("DEFAULT_STAFF_NAME_VALUE").text;
    		var canChange=xmlNode.selectSingleNode("DEFAULT_STAFF_CAN_CHANGE").text;
    		var disabled=xmlNode.selectSingleNode("DEFAULT_STAFF_DISABLED").text;
    		var selected=xmlNode.selectSingleNode("DEFAULT_STAFF_SELECTED").text;
    		defaultStaff.canChange=(canChange==flow.constant.aBoolean.True)?true:false;
    		defaultStaff.nameExpr=name;
    		defaultStaff.exprType=type;
    		defaultStaff.valueExpr=value;
    		defaultStaff.disabled=(disabled==flow.constant.aBoolean.True)?true:false;
    		defaultStaff.selected=(selected==flow.constant.aBoolean.True)?true:false;
    		oNextTch.setDefaultStaff(defaultStaff);
    	}
   }
   function setDefaultOrg(oNextTch,xmlNode)
   {
   	    var value=xmlNode.selectSingleNode("ROOT_ORG_VALUE").text;
        var type=xmlNode.selectSingleNode("ROOT_ORG_TYPE").text;
    	if(type && value)
    	{    		
           var canChange=xmlNode.selectSingleNode("ROOT_ORG_CAN_CHANGE").text;        
           var param=xmlNode.selectSingleNode("ROOT_ORG_PARAM").text;
   	       var defaultOrg={};
    	   defaultOrg.otherParam=(param)?flow.Expr.parseJson(param):null;
    	   defaultOrg.canChange=(canChange==flow.constant.aBoolean.True)?true:false;
    	   defaultOrg.exprType=type;
    	   defaultOrg.expr=value;
    	   oNextTch.setDefaultOrg(defaultOrg);
    	}
   }
   function setNotifyDefaultOrg(oNextTch,xmlNode)
   {
        var value=xmlNode.selectSingleNode("NOTIFY_ROOT_ORG_VALUE").text;
        var type=xmlNode.selectSingleNode("NOTIFY_ROOT_ORG_TYPE").text;
    	if(type && value)
    	{    		
           var canChange=xmlNode.selectSingleNode("NOTIFY_ROOT_ORG_CAN_CHANGE").text;
   	       var defaultOrg={};
    	   defaultOrg.otherParam=null;
    	   defaultOrg.canChange=(canChange==flow.constant.aBoolean.True)?true:false;
    	   defaultOrg.exprType=type;
    	   defaultOrg.expr=value;
    	   oNextTch.setNotifyDefaultOrg(defaultOrg);
    	}
   }
   function getNotify(jsonData)
   {
   	  var oJson=flow.Expr.parseJson(jsonData);
      var oNotify={};
      oNotify.display=(oJson.display==flow.constant.aBoolean.True)?true:false;
      oNotify.selected=(oJson.selected==flow.constant.aBoolean.True)?true:false;
      oNotify.canChange=(oJson.canChange==flow.constant.aBoolean.True)?true:false;
      return oNotify;
   }
   function getShowed(xmlNode,isDefault)
   {
	   var relateTchClosed=(xmlNode.selectSingleNode("CON_TCH_CLOSED").text=="1")?true:false;
	   if(!relateTchClosed)  return false;
       if(context.isNextTchAuto()) return true;
       if(!isDefault && context.hasDefaultTch() && context.getDefaultTch().hiddenOther) return false;
	   return true;
   }
   function getSelected(isDefault,modelId)
   {
	   if(context.isNextTchAuto())	return true;
       if(isDefault && modelId.isInArray(context.getDefaultTch().selectedTchIds.split(","))) return true;
       if(!context.hasDefaultTch() && modelId==formContext.FLOW.TCH_MOD
         && context.getSerialState()==flow.constant.serialState.inProgress) return true;
	   return false;
   }
   function getDisabled(isDefault,modelId)
   {
	   if(context.isNextTchAuto())	return true;
	   if(isDefault && context.getDefaultTch().selected
	      && !context.getDefaultTch().canChange) return true;
	   return false;
   }
   function getDefault(context,modelId)
   {
	   if(!context.hasDefaultTch()) return false;
	   return modelId.isInArray(context.getDefaultTch().ids.split(","))
   }
};
flow.TchIterator=function()
{
    var tchs;
    this.setTchs=function(aTch){tchs=aTch};
    this.getTchs=function(){return tchs};
    this.push=function(tch){tchs.push(tch)};
    this.getTchById=function(tchId)
    {
       for(var i=0;i<tchs.length;i++)
       {
           var oTch=tchs[i];
           if(oTch.getModelId()==tchId)
           {
              return oTch;
           }
       }
       return null;
    }
    
    this.getTchByNum=function(tchNum)
    {
       for(var i=0;i<tchs.length;i++)
       {
           var oTch=tchs[i];
           if(oTch.getTchNum()==tchNum)
           {
              return oTch;
           }
       }
       return null;
    }
    this.hasSelectedTch=function()
    {
        for(var i=0;i<tchs.length;i++)
        {
            if(tchs[i].isSelected())
               return true;
        }
        return false;
    }
    this.getSelectedTch=function()
    {
        for(var i=0;i<tchs.length;i++)
        {
            if(tchs[i].isSelected())
               return tchs[i];
        }
        return null;
    }
    this.pop=function(oTch)
    {
       for(var i=0;i<oTch.getExcludeTchs().length;i++)
       {
		  oTch.getExcludeTchs()[i].popExcludeTch(oTch);
       }
       for(var i=0;i<tchs.length;i++)
       {
          if(tchs[i]==oTch)
          {
             tchs.splice(i,1);
             return;
          }
       }
    }
    this.popOther=function(oTch)
    {
    	var iLen=tchs.length;
        for(var i=0;i<iLen;i++)
        {
            tchs.pop();
        }
        oTch.clearExcludeTch();
        oTch.setSelected(true);
        tchs.push(oTch);
    }
    this.isSingleSelect=function()
    {
    	for(var i=0;i<tchs.length;i++)
    	{
    	    for(var j=i+1;j<tchs.length;j++)
    	    {
    	    	if(!tchs[i].isExclude(tchs[j])) return false;    	    	
    	    }
    	}
    	return true;        
    }
    this.onCreate=function()
    {
       for(var i=0;i<tchs.length;i++)
       {
       	   var oTch=tchs[i];
       	   if(oTch.isSelected() && !oTch.onCreate())
       	      return false;
       } 
       return true;
    }
    this.setDefault=function()
    {
       for(var i=0;i<tchs.length;i++)
       {
       	   var oTch=tchs[i];
       	   if(oTch.isSelected())
		   {
			  if(oTch.hasDefaultStaff())
		         oTch.setExcuteStaffIds(oTch.getDefaultStaff().getId());
		      if(oTch.hasDefaultNotifyStaff())
		         oTch.setNotifyStaffIds(oTch.getDefaultNotifyStaff().getId());
		   }
       }
    }
    this.getSelectedTchsInfo=function()
    {
       var tchInfo={action:"",staffId:"",modelId:"",modelNum:""};
       for(var i=0;i<tchs.length;i++)
       {
       	   var oTch=tchs[i];
       	   if(oTch.isSelected())
       	   {
       	      tchInfo.action+=oTch.getAction()+",";
       	      tchInfo.staffId+=oTch.getExcuteStaffIds()+"|";
       	      tchInfo.modelId+=oTch.getModelId()+",";
       	      tchInfo.modelNum+=oTch.getTchNum()+",";
       	   }       	   
       }
       tchInfo.action=tchInfo.action.slice(0,-1);
       tchInfo.staffId=tchInfo.staffId.slice(0,-1);
       tchInfo.modelId=tchInfo.modelId.slice(0,-1);
       tchInfo.modelNum=tchInfo.modelNum.slice(0,-1);
       return tchInfo;
    }
    this.onAfterCreate=function(oTch)
    {
       if(oTch)
       {
           oTch.onAfterCreate();
           return;
       }
       for(var i=0;i<tchs.length;i++)
       {
       	   var oTch=tchs[i];
       	   if(oTch.isSelected())
       	      oTch.onAfterCreate();
       }
    }
    this.getSelectedTchXML=function()
    {
       var aTchXML=[];
       for(var i=0;i<tchs.length;i++)
       {
       	   var oTch=tchs[i];
       	   if(oTch.isSelected())
               aTchXML[i]=oTch.asXML();
       }
       return aTchXML.join("");
    }
}
flow.TchIterator.createInst=function(xmlNodes,context)
{
   var iLen=xmlNodes.length;
   var tchInterator=new flow.TchIterator();
   var aTch=[];
   var aExcludeTch=[];
   for (var i=0;i<iLen;i++)
   {
   	  var oNextTch=flow.NextTch.createInst(xmlNodes[i],context);
   	  if(oNextTch.isShowed())
   	  {
   	  	 var excludeModelIds=xmlNodes[i].selectSingleNode("EXCLUDE_PATH").text;
   	     aTch.push(oNextTch);
   	     aExcludeTch.push(excludeModelIds);
   	  }
   }
   tchInterator.setTchs(aTch);
   if(context.isNextTchAuto()) return tchInterator;
   if(context.hasDefaultTch() && context.getDefaultTch().selected 
     && !context.getDefaultTch().canChange) return tchInterator;
   iLen=aTch.length;
   for(var i=0;i<iLen;i++)
   {
      var oTch=aTch[i];      
      for(var j=i+1;j<iLen;j++)
      {
          var oOtherTch=aTch[j];
          var isExclude=(oTch.getAction()!=oOtherTch.getAction() 
             || oTch.getModelId().isInArray(aExcludeTch[j].split(";")))
          if(isExclude)
          {
              oTch.pushExcludeTch(oOtherTch);
              oOtherTch.pushExcludeTch(oTch);
          }
      }
   }
   tchInterator.setTchs(aTch);
   return tchInterator;
}

function showLayer(oParam)
{
    tache.Service.init(oParam);
}

Layer=function(oFeatures)
{
   this.show =function()
   {
		oLayer=oFormDoc.getElementById(winId);
		if(oLayer)
		{
			createWinMask();
			oLayer.style.display="block";
			setAreaAndPos();
		}
		return this;
   }
   this.$=function(elementId)
   {
       return oLayer.all(elementId);
   }
   this.close=function()
   {
       var e=oFormWin.event;
   	   e && (e.cancelBubble = true);
   	   var oWin=oFormDoc.getElementById(winId);
       oWin.style.display="none";
  	   oFormDoc.body.style.overflow="auto";
  	   oToobarDoc.getElementById("FL_EGN_MASK").style.display="none";
  	   oFormDoc.getElementById("FL_EGN_MASK").style.display="none";
  	   onClose && onClose();
   }
   this.getDomEle=function()
   {
       return oLayer;
   }
   this.getRealHeight=function()
   {
   	   var iCurHeight=oLayer.all("FL_EGN_BODY").style.posHeight;
       oLayer.all("FL_EGN_BODY").style.posHeight=0;
       var iHeight=oLayer.all("FL_EGN_BODY").scrollHeight;
       oLayer.all("FL_EGN_BODY").posHeight=iCurHeight;
       return iHeight+iBottomHeight+titleBarHeight;
   }
   this.reSetAreaAndPos=function()
   {
       height=parseInt(oFeatures.height,10);
       setAreaAndPos();
   }
   function init()
   {
       var sWinTemplate=oTemplate.XMLDocument.selectSingleNode("/root/win_template").text;
  	   sWinTemplate=sWinTemplate.replace("%WIN_ID%",winId);
  	   sWinTemplate=sWinTemplate.replace("%TITLE%",title);  	    
	   oFormDoc.body.insertAdjacentHTML("afterBegin",sWinTemplate);
	   oLayer=oFormDoc.getElementById(winId);
	   oLayer.all("FL_EGN_BODY").innerHTML=bodyHTML;
	   oLayer.all("FL_EGN_BOTTOM").innerHTML=bottomHTML;
	   oLayer.all("FL_EGN_WIN_CLOSE").onclick=function(){self.close();}
       oLayer.all("FL_EGN_TITLE_BAR").onmousedown=function(){drag(oLayer);};
       Layer.instances[winId]=self;
	   setAreaAndPos();
   }
   function setAreaAndPos()
   {
      var iClientHeight=oBody.offsetHeight;
      var iClientWidth=oBody.offsetWidth;
      var iScrollTop=oBody.scrollTop;
      var iScrollLeft=oBody.scrollLeft;
      self.$("FL_EGN_BOTTOM").style.posHeight=iBottomHeight;
      self.$("FL_EGN_TITLE_BAR").style.posHeight=titleBarHeight;
      if(fullScreen)
      {
      	   oLayer.style.posHeight=iClientHeight;
      	   oLayer.style.posWidth=iClientWidth;
      	   oLayer.style.posTop=iScrollTop;
      	   oLayer.style.posLeft=iScrollLeft;
      	   self.$("FL_EGN_BODY").style.posHeight=iClientHeight-titleBarHeight-iBottomHeight;
      }
      else
      {
      	   var iHeight=(height>iClientHeight)?iClientHeight:height;
      	   var iWidth=(width>iClientWidth)?iClientWidth:width;
           var iTop=((iClientHeight-iHeight)/2)+iScrollTop-(formContext.getToolbar().height/2);
           var iLeft=iScrollLeft+((iClientWidth-iWidth)/2);
           oLayer.style.posHeight=iHeight;
           oLayer.style.posWidth=iWidth;
           oLayer.style.posTop=(iTop<iScrollTop)?iScrollTop:iTop;
           oLayer.style.posLeft=(iLeft<iScrollLeft)?iScrollLeft:iLeft;
           self.$("FL_EGN_BODY").style.posHeight=(iHeight-titleBarHeight-iBottomHeight);
      }   
   }
   function createWinMask()
   {
	   createMask(oToobarDoc);
	   createMask(oFormDoc);
	   function createMask(oDoc)
	   {
	    	var oMask=oDoc.getElementById("FL_EGN_MASK");
	    	oDoc.body.style.overflow="hidden";
	    	if(oMask)
	    	{
	    	   oMask.style.display="block";
	    	   return;
	    	}
	    	var ua=navigator.userAgent.toLowerCase();
	    	var ieVersion=ua.match(/msie ([\d.]+)/)[1];
	    	var sElement=(ieVersion>6)?"div":"iframe";
	        var oIframe=oDoc.createElement(sElement);
	        oIframe.id="FL_EGN_MASK";
	        oIframe.style.width=oDoc.body.clientWidth+oDoc.body.scrollWidth+"px";
	        oIframe.style.height=oDoc.body.clientHeight+oDoc.body.scrollHeight+"px";
		    oIframe.style.position="absolute";
		    oIframe.style.top="0px";
		    oIframe.style.left="0px";
		    oIframe.style.backgroundColor="rgb(255, 255, 255)";
		    oIframe.style.filter="alpha(opacity=50)"; 
		    oIframe.style.opacity="0.5";
		    oIframe.style.zIndex="999";
		    oIframe.frameBorder='0';
		    oIframe.scrolling="no";
		    oDoc.body.insertAdjacentElement("beforeEnd",oIframe);
	    }
    }
	function drag(oWin)
	{
		 var e=oFormWin.event;
		 var oBody=oFormDoc.body
		 var x = e.clientX + oBody.scrollLeft - oWin.style.pixelLeft
		 var y = e.clientY + oBody.scrollTop - oWin.style.pixelTop
		 var move = function()
		 {
			if (e.button == 1)
			{							
				oWin.style.pixelLeft = e.clientX + oBody.scrollLeft - x
				oWin.style.pixelTop = e.clientY + oBody.scrollTop - y
			}
			else oFormDoc.detachEvent("onmousemove", move)
			
		 }
		 oFormDoc.attachEvent("onmousemove", move);
		 e.cancelBubble = true;
	 }	 
	 var iBottomHeight=25;      
     var titleBarHeight=25;
	 var fullScreen=parseInt(oFeatures.fullScreen||"0");
	 var winId=oFeatures.winId;
	 var height=parseInt(oFeatures.height||"480",10);
	 var width=parseInt(oFeatures.width||"650",10);
	 var title=oFeatures.title||"窗口";
	 var bodyHTML=oFeatures.html.body;
	 var bottomHTML=oFeatures.html.bottom;
	 var onClose=oFeatures.onclose;
	 var oFormWin=formContext.getWin().form;
	 var oFormDoc=oFormWin.document;
	 var oToobarDoc=formContext.getWin().toolbar.document;
	 var oBody=oFormDoc.body;
	 var oLayer;
	 var self=this;
	 createWinMask();
	 init();
}
Layer.open=function(oFeatures)
{
   var oLayer=new Layer(oFeatures);
   return oLayer.show();
}
Layer.instances={};
Message=
{
    prompt:function(sPromptText,layer,oAction)
    {    
        this.init();
    	this.hiddenAll();
    	var oPrompt=this.dom.prompt;
    	oPrompt.style.display="block";
		oPrompt.all("FL_EGN_PROMPT_TEXT").innerText=sPromptText;
		this.position(oPrompt,layer);
        this.dettachTopWinClose(this);
        oPrompt.onclick=function()
        {
           oPrompt.style.display="none";
           if(oAction && oAction.onClick)
	          oAction.onClick();
        }
        window.setTimeout(function(){oPrompt.style.display="none"},1000);
    },
    loading:function(sWaitText,layer)
    {
       if(this.isloading) return;
       this.init();
       this.hiddenAll();       
       this.mask(layer);       
       var oWait=this.dom.wait;
       oWait.style.display="block";
       oWait.all("FL_EGN_WAIT_TEXT").innerText=sWaitText;
       this.position(oWait,layer);
       this.attachTopWinClose(this); 
       this.isloading=true;
    },
    xmlHttpLoading:function(oXMLHttp,oText,layer,oAction)
    {
       if(oXMLHttp.readyState!=4) 
   	   {
   	   	    this.loading(oText.wait,layer);
   	   	    return;
   	   }
   	   if(oXMLHttp.readyState==4)
   	   {
   	        if(oXMLHttp.status != 200)
   	      	{
   	      	    this.fail("后台程序出现异常![错误代码:"+oXMLHttp.status+"]",layer);
   	      	    return;
   	      	}
   	      	var errElement = getErrorCode(oXMLHttp);
   	      	if(!errElement)
   	      	{
   	      	     this.fail("xml文档格式错误!",layer);
   	      	     return;
   	      	}
            if(errElement.text == "0")
            {              	 
             	 this.prompt(oText.succeed,layer,oAction);
             	 if(oAction && oAction.onSucceed)
             	       oAction.onSucceed();
             	 return;
            }
            this.fail(errElement.nextSibling.text,layer);
   	    }
    },
    fail:function(errMsg,oLayer)
    {
    	this.init();
    	this.hiddenAll();
    	var oFail=this.dom.fail;
    	oFail.innerText=errMsg;	
    	this.position(oFail,oLayer);
    	this.dettachTopWinClose(this);
    	window.setTimeout(function(){oFail.style.display="none"},2000);
    },
    dom:null,
    isloading:false,
    init:function()
    {
    	var sMsgTemplate=oTemplate.XMLDocument.selectSingleNode("/root/msg_template").text;
    	var oFormDoc=formContext.getWin().form.document;
    	oFormDoc.body.insertAdjacentHTML("beforeEnd",sMsgTemplate);
    	this.dom={};
    	this.dom.waitMask=oFormDoc.getElementById("FL_EGN_WAIT_MASK");
    	this.dom.wait=oFormDoc.getElementById("FL_EGN_WAIT");
    	this.dom.prompt=oFormDoc.getElementById("FL_EGN_PROMPT");
    	this.dom.fail=oFormDoc.getElementById("FL_EGN_FAIL");
    	this.init=function(){}
    	return this.init();
    },
    hiddenAll:function()
    {
        this.dom.wait.style.display="none";
		this.dom.waitMask.style.display="none";
		this.dom.fail.style.display="none";
		this.dom.prompt.style.display="none";
		this.isloading=false;
    },
    position:function(oMsg,oLayer)
    {
    	oMsg.style.display="block";
		oMsg.style.width="0px";		
		var iWidth=(oMsg.scrollWidth>500)?500:oMsg.scrollWidth;
		oMsg.style.posWidth=iWidth;
        var oPos=this.getLayerPos(oLayer);
        oMsg.style.posTop=oPos.top+(oPos.height/2);
        oMsg.style.posLeft=oPos.left+((oPos.width-iWidth)/2);
    },
    mask:function(oLayer)
    {
        var oWaitMask=this.dom.waitMask;
        var oPos=this.getLayerPos(oLayer)
        oWaitMask.style.display="block";
    	oWaitMask.style.posWidth=oPos.width;
    	oWaitMask.style.posHeight=oPos.height;
    	oWaitMask.style.posTop=oPos.top;
    	oWaitMask.style.posLeft=oPos.left;
    },
    getLayerPos:function(oLayer)
    {
        var oFormBody=formContext.getWin().form.document.body;
    	var oRect=oLayer.getBoundingClientRect();
    	var iWidth=oRect.right-oRect.left;
    	var iHeight=oRect.bottom-oRect.top;
        var iLeft = oRect.left +oFormBody.scrollLeft
        var iTop = oRect.top +oFormBody.scrollTop;
        return {top:iTop,left:iLeft,width:iWidth,height:iHeight};
    },
    confirmClose:function()
    {
        top.window.event.returnValue="系统正在处理中，关闭或刷新窗口可能导致提交失败，确定要关闭窗口吗？";
	},
	attachTopWinClose:function(self)
	{
		top.window.attachEvent("onbeforeunload",self.confirmClose);
	},
    dettachTopWinClose:function(self)
	{
		top.window.detachEvent("onbeforeunload",self.confirmClose);
	}
}
tache={}
tache.constant={
                  actionImage:{run:["forwardTache.gif","forwardTacheCopy.gif","forwardTacheDel.gif","前进"],
                              "return":["backTache.gif","backTacheCopy.gif","backTacheDel.gif","退回"],
                              end:["forwardTache.gif","forwardTacheCopy.gif","forwardTacheDel.gif","竣工"],
                              transfer:["tranTache.gif","tranTacheCopy.gif","tranTacheDel.gif","转交"]},
                  opinionType:{hidden:"H",option:"SO",require:"SR"}
               }
tache.Service=
{
   isShowFlowSuccess:true,
   context:null,
   tchIterator:null,
   param:null,
   isLayerShow:false,
   layer:null,
   formDoc:null,
   isSingleSelect:true,
   isShowEndtask:false,
   init:function(aParam)
   {
   	  var oToobarDoc=formContext.getWin().toolbar.document;
	  var oFormDoc=formContext.getWin().form.document;
	  this.formDoc=oFormDoc;
      this.param=aParam;
      var aDispatcher={};
      aDispatcher[flow.constant.operType.single] =function(){copyContextAndTchs(aParam,this);this.isShowEndtask=false};
      aDispatcher[flow.constant.operType.more] =function()
      {
         copyContextAndTchs(aParam,this);
         this.isSingleSelect=false;
         this.isShowEndtask=true;
      };
      aDispatcher[flow.constant.operType.endTask]=function()
      {
         copyContext(aParam,this);
         this.tchIterator=null;
         this.isShowEndtask=true;
      };
      aDispatcher[flow.constant.operType.directFlow]=function()
      {
         rebuildContextAndTchs(aParam,this);
         this.isSingleSelect=this.tchIterator.isSingleSelect();
         this.isShowEndtask=true;
      };
      aDispatcher[aParam.type].call(this);
      initLayer(this);
      function copyContextAndTchs(aParam,oService)
      {
          oService.tchIterator=aParam.tchIterator;
          oService.context=aParam.context;
      }   
      function copyContext(aParam,oService){oService.context=aParam.context;}
      function rebuildContextAndTchs(aParam,oService)
      {
          copyContextAndTchs(aParam,oService);
      }
      function initLayer(oService)
      {
	   	  showLayer(oService);
	   	  oService.isLayerShow=true;
	   	  function showLayer(oService)
	   	  {
	   	  	  var oFeatures=flow.Expr.copyObj(oService.context.getLayerStyle());
	   	  	  oFeatures.winId="FL_EGN_WIN";
	   	  	  oFeatures.title="环节处理";
	   	  	  oFeatures.html={};
	   	  	  oFeatures.html.body=oTemplate.XMLDocument.selectSingleNode("/root/flow_template").text;
	   	  	  oFeatures.html.bottom=oTemplate.XMLDocument.selectSingleNode("/root/flow_bottom_template").text;
	   	  	  oFeatures.onClose=function(){oService.isLayerShow=false};
	   	  	  var layer=Layer.instances[oFeatures.winId];
	   	  	  if(layer)
	   	  	  {
	   	  	  	  layer.show();
	   	  	  }
	   	  	  else
	   	  	  {
	   	  	  	  layer=Layer.open(oFeatures);
	   	  	  	  appendDiv(formContext.apendElement);
	   	  	  	  layer.$("FL_EGN_RETURN").onclick=function(){oService.closeLayer();}
		   	  	  layer.$("FL_EGN_SUBMIT").onclick=function()
		   	  	  {
		   	  	      oService.save();
		   	  	  }
	   	  	  }	   	  	  
	   	  	  oService.layer=layer;	   	  	  
	   	      oService.setFlowName();
	   	      oService.setExecDesc();
	   	      if(!oService.showTacheList())
	   	      {
	   	          layer.close();
	   	      }
              tache.opinionCtrl.init(oService.context,layer);
              tache.attachCtrl.init(oService,layer);
	   	  	  function appendDiv(aDiv)
	   	  	  {
	   	  	  	  var oAppendDivContainer=layer.$("FL_EGN_APPEND_DIV");
	   	  	  	  if(aDiv.length==0)
	   	  	  	  {
	   	  	  	      oAppendDivContainer.style.display="none";
	   	  	  	      return;
	   	  	  	  }
	   	  	      for(var i=0;i<aDiv.length;i++)
	   	  	      {
	   	  	          oAppendDivContainer.insertAdjacentElement("beforeEnd",aDiv[i]);
	   	  	          aDiv[i].style.display='';
	   	  	          aDiv[i].style.visibility='';
	   	  	          aDiv[i].style.border='1px solid #436c80';
	   	  	          aDiv[i].style.width='100%';
	   	  	          //aDiv[i].style.marginLeft='25px';
	   	  	          setCustCss(aDiv[i]);
	   	  	      }
	   	  	      function setCustCss(oDiv)
	   	  	      {
	   	  	      	  if(oDiv.styleAtPopup)
	   	  	      	      oDiv.style.cssText+=";"+oDiv.getAttribute("atPopupStyle");
	   	  	          var iLen=oDiv.all.length;
					  for(var i=0;i<iLen;i++)
					  {
					  	  var oChild=oDiv.all(i);
						  if(oChild.getAttribute("atPopupStyle"))
	   	  	      	         oChild.style.cssText=oChild.getAttribute("atPopupStyle");
					  }
	   	  	      }
	   	  	  }
	   	  }  	  
       }
   },
   closeLayer:function()
   {
   	  if(!this.isLayerShow) return;
  	  this.layer.close();
   },
   showTacheList:function()
   {
       //if(!this.tchIterator) return;
       var oContainer=this.layer.$("FL_EGN_TCHS_ROW");
       var sTchTemplate=oTemplate.XMLDocument.selectSingleNode("/root/tch_template").text;
       var sEndTaskTemplate=oTemplate.XMLDocument.selectSingleNode("/root/end_task_template").text;
       var sFloat=this.isSingleSelect?"left":"none"
       var sSelectType=this.isSingleSelect?"radio":"checkbox";
       sTchTemplate=sTchTemplate.replace('%TCH_FLOAT_STYLE%',sFloat);
       sTchTemplate=sTchTemplate.replace('%TCH_SELECT_TYPE%',sSelectType);
       sEndTaskTemplate=sEndTaskTemplate.replace('%TCH_FLOAT_STYLE%',sFloat);
       sEndTaskTemplate=sEndTaskTemplate.replace('%TCH_SELECT_TYPE%',sSelectType);
       var sUserTemplate=oTemplate.XMLDocument.selectSingleNode("/root/user_template").text;
       var panelManager=tache.PanelManager.createInst(this);
       if(!panelManager) return null;
       oContainer.innerHTML=panelManager.getaHTML(sTchTemplate,sEndTaskTemplate);
       this.layer.$("FL_EGN_USER_ROW").style.display="none";
       this.layer.$("FL_EGN_TCH_USERS").innerHTML="";
       panelManager.setPanelsEvent(oContainer,sUserTemplate);
       return panelManager;
   },
   rebuildAll:function()
   {
       if(!this.isLayerShow) return;
       this.setFlowName();
       if(this.param.type!=flow.constant.operType.endTask)
       {
          this.rebuildTchs();
          this.rebuildStaff();
       }
       this.rebuildOpinion();
   },
   rebuildTchs:function()
   {
   	   if(!this.isLayerShow) return;
       if(!this.context.hasNextTchHook()) return;
       if(this.context.isNextTchAuto()) return;
       var defaultIds=this.context.getDefaultTch()?this.context.getDefaultTch().ids:"";
       var prevContext={selectedIds:this.tchIterator.getSelectedTchsInfo().modelId,
                        defaultIds:defaultIds};
       this.context.resetByHook();
       if(isUnchange(prevContext,this.context)) return; 
       var aDispatcher={}
       aDispatcher[flow.constant.operType.single] =function(){singleModel(prevContext,this.context,this);};
       aDispatcher[flow.constant.operType.more] =function(){reSetTchIterator(prevContext,this.context,this);};
       aDispatcher[flow.constant.operType.directFlow]=function(){reSetTchIterator(prevContext,this.context,this);};
       aDispatcher[this.param.type].call(this);
       function singleModel(prevContext,curContext,oService)
       {
           var sCurTchIds=prevContext.selectedIds;
           sCurTchIds=sCurTchIds.split(",")[0];//多实例环节拷贝时只取单个环节Id
           if(sCurTchIds.isInArray(curContext.getDefaultTch().ids)) return;
           oService.tchIterator=flow.Service.setTchIterator(curContext.getXMLNode());
           oService.isSingleSelect=true;
           oService.showTacheList();
       }
       function reSetTchIterator(prevContext,curContext,oService)
       {
          oService.tchIterator=flow.Service.setTchIterator(curContext.getXMLNode());
          if(oService.tchIterator.getTchs().length==1 && !oService.context.hasUnClosedConnTch())
          {
              oService.tchIterator.getTchs()[0].setSelected(true);
          }
          oService.isSingleSelect=oService.tchIterator.isSingleSelect();
          oService.showTacheList();   
       }
       function isUnchange(prevContext,curContext)
       {
           var sPrevDefaultTchIds=prevContext.defaultIds;
           var scurDefaultTchIds=curContext.getDefaultTch().ids;
           var sPrev=sPrevDefaultTchIds.split(",").sort().join(",");
           var sCur=scurDefaultTchIds.split(",").sort().join(",");
           return (sPrev==sCur);
       }
   },
   rebuildStaff:function()
   {
       this.tchIterator.setDefault();
       var oTchs=this.tchIterator.getTchs();
       for(var i=0;i<oTchs.length;i++)
       {
       	   var oTch=oTchs[i];
       	   if(oTch.isSelected())
       	   {
               oTch.getOwnerPanel().setDefaultByHook();
       	   }
       	   else
       	   {  
       	   	   if(oTch.getOwnerPanel().isUserLoaded())
       	   	   {
       	   	   	  if(oTch.hasDefaultStaff())
		              oTch.setExcuteStaffIds(oTch.getDefaultStaff().getId());
				   if(oTch.hasDefaultNotifyStaff())
		               oTch.setNotifyStaffIds(oTch.getDefaultNotifyStaff().getId());
       	          oTch.getOwnerPanel().setDefaultByHook();
       	   	   }
       	   }
       }
   },
   rebuildOpinion:function()
   {
   	   var oOpinionInput=this.layer.$("FL_EGN_OPINION_INPUT");
       var sDefaultValue = this.context.getOpinion().getDefaultValue();
       if(sDefaultValue!='') oOpinionInput.value = sDefaultValue;
   },
   setFlowName:function()
   {
   	  var oFlowRow=this.layer.$("FL_EGN_FLOW_NAME_ROW");
   	  var oFlowName=this.layer.$("FL_EGN_FLOW_NAME_VALUE");
   	  var context=this.context;
   	  if(!context.getWinCfg().showFlowName)
   	  {
           oFlowRow.style.display="none";
   	  }
      if(!isFlowBegin())
      {
          oFlowRow.style.display="none";
          return;
      }
      oFlowName.innerText=context.getDefaultFlowName().get();
      context.setFlowName(oFlowName.innerText);
      oFlowName.onblur=function(){context.setFlowName(this.innerText);}; 
   },
   setExecDesc:function()
   {   	 
   	  if(this.context.getExecDesc()!="")
   	  {
   	  	  var oExecDescRow=this.layer.$("FL_EGN_EXEC_DESC_ROW");
   	      oExecDescRow.style.display="";
   	      oExecDescRow.all("FL_EGN_EXEC_DESC_VALUE").innerHTML=this.context.getExecDesc();
   	  }
   },
   save:function()
   {
   	   var self=this;
       if(!validate(this.context,this.tchIterator)) return;
       if(!flow.Service.onBeforeSubmit(null,this.tchIterator)) return;
       var oSendXML=flow.Service.getSendXML(null,this.tchIterator);
       if(oSendXML.selectSingleNode("/root/FLOW/ATACHES").childNodes.length==0)
           tache.attachCtrl.appendXML(oSendXML);
       flow.Service.save(oSendXML,null,this.tchIterator,true);       
       function validate(context,tchIterator)
       {
       	   var sOpinion=context.getOpinion().getValue();
           if(tache.opinionCtrl.isInvalid(context))
           {
               return showErr("请填写您的意见!");
           }
           if(sOpinion.Tlength()>4000)
           {
               return showErr("意见不能超过4000个字节!");
           }
           if(!context.hasUnClosedConnTch() && tchIterator && !tchIterator.hasSelectedTch())
           {
               return showErr("请选择下一环节!");
           }
           if(tache.attachCtrl.getFilesQueuedNum()>0)
           {
                 return showErr("有"+tache.attachCtrl.getFilesQueuedNum()+"个附件正在上传中，请稍候!");
           }
           var isEndTask=(self.isShowEndtask && (!tchIterator || !tchIterator.hasSelectedTch()));
           if(isEndTask) 
           {
           	   if(self.param.eleOnLayer && !flow.Service.isFormValidate("endTask",context.getValidateMod())) 
               	   return false;
               return true;
           }
           for (var i=0;i<tchIterator.getTchs().length;i++)
           {
               var oTch=tchIterator.getTchs()[i];
               if(oTch.isSelected())
               {
               	   if(self.param.eleOnLayer && !isFlowBegin())
                   {
               	      if(!flow.Service.isFormValidate(oTch.getAction(),context.getValidateMod())) 
               	         return false;
                   }
               	   if(!oTch.getExcuteStaffIds() && !oTch.canWithoutExecuter())
                       return showErr("请选择\""+oTch.getName()+"\"环节的执行人!");               
               }
           }
           return true;
       }
       function showErr(sErrMsg)
       {
           Message.fail(sErrMsg,self.layer.getDomEle());
           return false;
       }
   }
}

tache.PanelManager=function(oTacheService)
{
    var tchPanels;
    var endTaskPanel;
    this.tchService=oTacheService;
    this.setTchPanels=function(aTchPanels){tchPanels=aTchPanels}; 
    this.getEndTaskPanel=function(){return endTaskPanel};
    this.getaHTML=function(sTemplate,sEndTaskTemplate)
    { 
        var aHTML=[];
        for(var i=0;i<tchPanels.length;i++)
        {
            aHTML[i]=tchPanels[i].getInnerHTML(sTemplate);
        }
        if(endTaskPanel)
        {
            aHTML[aHTML.length]=endTaskPanel.getInnerHTML(oTacheService,sEndTaskTemplate);
        }
        return aHTML.join("");
    }
    this.setEndTaskPanel=function(oEndTaskPanel)
    {
        endTaskPanel=oEndTaskPanel;
    }
    this.unSelectAllTchs=function()
    {
        for(var i=0;i<tchPanels.length;i++)
        {
            tchPanels[i].unSelect();
        }
    }
    this.setPanelsEvent=function(oContainer,sUserTemplate)
    {
    	var i;
    	buildTchPanelsEvent();
    	buildEndtaskPanelsEvent();
        if(tchPanels.length==1 && !endTaskPanel)
        {
            tchPanels[0].select();
        }
        if(tchPanels.length==0 && endTaskPanel)
        {
            endTaskPanel.select();
        }
        function doMouseEnter(oTchDiv,oTch)
    	{
    		if(!oTch.isSelected())
    		{
	    	    oTchDiv.style.backgroundColor="#4D9CD4";
			    oTchDiv.style.borderColor="black";
    		}
    	}
    	function doMouseLeave(oTchDiv,oTch)
    	{
    		if(!oTch.isSelected())
    		{
    	       oTchDiv.style.backgroundColor="white";
		       oTchDiv.style.borderColor="white";
    		}
    	}
        function buildTchPanelsEvent()
    	{
    	    for(i=0;i<tchPanels.length;i++)
		    {
		       var oTchContainer=oContainer.childNodes[i];		       
		       tchPanels[i].setEvent(oTchContainer,oTacheService,sUserTemplate);
               var oTchDiv=oTchContainer.childNodes[0];
               var oTch=tchPanels[i].getTch();
		       oTchDiv.onmouseover=(function(tchDiv,tch){return function(){doMouseEnter(tchDiv,tch)};})(oTchDiv,oTch);
		       oTchDiv.onmouseleave=(function(tchDiv,tch){return function(){doMouseLeave(tchDiv,tch)};})(oTchDiv,oTch);
		    }
    	}    	
    	function buildEndtaskPanelsEvent()
    	{
    	    if(!endTaskPanel) return;
    	    var oEndTaskContainer=oContainer.childNodes[i];
    	    var oEndtaskDiv=oEndTaskContainer.childNodes[0];
    	    oEndtaskDiv.onmouseover=(function(tchDiv,tch){return function(){doMouseEnter(tchDiv,tch)};})(oEndtaskDiv,endTaskPanel);
		    oEndtaskDiv.onmouseout=(function(tchDiv,tch){return function(){doMouseLeave(tchDiv,tch)};})(oEndtaskDiv,endTaskPanel);
    	    endTaskPanel.setEvent(oEndTaskContainer);
    	}
    }
}

tache.PanelManager.createInst=function(oTacheService)
{
   var tchPanelManager=new tache.PanelManager(oTacheService);
   var aTchPanel=[];
   var iLen=0;
   var oTchs;
   if(oTacheService.tchIterator)
   {
       oTchs=oTacheService.tchIterator.getTchs();
       iLen=oTchs.length;
   }
   if(iLen==0 && !oTacheService.context.hasUnClosedConnTch())
   {
       EMsg("找不到下一环节！");
       return null;
   }
   for(var i=0;i<iLen;i++)
   {
      var oTch=oTchs[i];
      var oTachePanel=tache.Panel.createInst(oTch,tchPanelManager);
      aTchPanel.push(oTachePanel);
   }
   tchPanelManager.setTchPanels(aTchPanel);
   if(oTacheService.context.hasUnClosedConnTch() && oTacheService.isShowEndtask)
   {
      var oEndTaskPanel=new tache.EndTaskPanel(tchPanelManager);
      tchPanelManager.setEndTaskPanel(oEndTaskPanel);
   }
   return tchPanelManager;
}

tache.EndTaskPanel=function(tchPanelManager)
{
	var isSelected=false;
	var endTaskContainer;
    this.getInnerHTML=function(oTacheService,sTemplate)
    {
       var sTemp=sTemplate;
       sTemp=sTemp.replace("%END_TASK_TITLE%",oTacheService.context.getEndTaskTitle());
       return sTemp;
    }
    this.isSelected=function()
    {
        return isSelected;
    }
    this.setEvent=function(oEndTaskContainer)
    {    	
    	endTaskContainer=oEndTaskContainer;
        setSelectBoxEvent(oEndTaskContainer.all("FL_EGN_END_TASK"),
                         oEndTaskContainer.all("FL_EGN_TCH_SELECT"),this);
        function setSelectBoxEvent(endTaskDiv,oSelectTch,oPanel)
	    {
	       endTaskDiv.onclick=function(){oSelectTch.click()};
	       oSelectTch.onclick=function()
	       {
	           this.checked?oPanel.select():oPanel.unSelect();
	       }
	    }
    }
    this.select=function()
    {
        var getFormEle=tchPanelManager.tchService.layer.$;
        getFormEle("FL_EGN_USER_ROW").style.display="none";
        tchPanelManager.unSelectAllTchs();
        endTaskContainer.all("FL_EGN_END_TASK").style.backgroundColor="#4D9CD4";
        endTaskContainer.all("FL_EGN_END_TASK").style.border="1px solid black";
        endTaskContainer.all("FL_EGN_TCH_SELECT").checked=true;
        isSelected=true;
    }
    this.unSelect=function()
    {
    	if(!endTaskContainer) return;
    	var getFormEle=tchPanelManager.tchService.layer.$;
        getFormEle("FL_EGN_USER_ROW").style.display="";
        endTaskContainer.all("FL_EGN_END_TASK").style.backgroundColor="";
        endTaskContainer.all("FL_EGN_END_TASK").style.border="1px solid white";
        endTaskContainer.all("FL_EGN_TCH_SELECT").checked=false;
        isSelected=false;
    }
}

tache.Panel=function()
{
   var tch;
   var tchContainer;
   var context;
   var userTemplate;
   var tchIterator;
   var tchService;
   var userLoaded=false;
   var userContainer;
   var tchPanelManager;
   this.setTch=function(pTch,oTchPanelManager)
   {
       tch=pTch;
       tchPanelManager=oTchPanelManager;
       tch.setOwnerPanel(this);
   };
   this.getTch=function(){return tch};
   this.setEvent=function(oPanelContainer,oTacheService,sUserTemplate)
   {       
   	   tchService=oTacheService;
       tchContainer=oPanelContainer;
       context=oTacheService.context;
       tchIterator=oTacheService.tchIterator;
       userTemplate=sUserTemplate;
       if(tch.isSelected()) this.select();
       setTchDesc(tchContainer.all("FL_EGN_TCH_NAME"),tchContainer.all("FL_EGN_TCH_REMARK"));
       setSelectBoxEvent(tchContainer.all("FL_EGN_TCH"),tchContainer.all("FL_EGN_TCH_SELECT"),this)
       if(tch.isDisabled())
           this.hiddenSelect();
   };
   this.isUserLoaded=function()
   {
       return userLoaded;
   }
   this.getInnerHTML=function(sTemplate)
   {
       var aStr=[["TCH_NAME",tch.getShowName()],['TCH_REMARK',tch.getRemark()]];
       var iLen=aStr.length;
       var sTemp=sTemplate;
       for(var i=0;i<iLen;i++)
       {
          var sReplaceVar='%'+aStr[i][0]+'%';
          var sReplace=aStr[i][1];
          sTemp=sTemp.replace(sReplaceVar,sReplace);
       }
       return sTemp;
   }
   this.select=function()
   {
       if(!userContainer)
           userContainer=appendUserHTML();
       this.setDefaultByHook();
       setCountersign(userContainer);
       setSms(userContainer.all("FL_EGN_SMS_SPAN"),userContainer.all("FL_EGN_SMS_SELECT"));
       setMail(userContainer.all("FL_EGN_MAIL_SPAN"),userContainer.all("FL_EGN_MAIL_SELECT"));
       setNSms(userContainer.all("FL_EGN_N_SMS_SPAN"),userContainer.all("FL_EGN_N_SMS_SELECT"));
       setNMail(userContainer.all("FL_EGN_N_MAIL_SPAN"),userContainer.all("FL_EGN_N_MAIL_SELECT"));
       if(!tch.getSms().display && !tch.getMail().display)
       {
           userContainer.all("FL_EGN_NMODE_ROW").style.display="none";
       }
       if(!tch.getNotifyCfg().sms.display && !tch.getNotifyCfg().mail.display)
       {
           userContainer.all("FL_EGN_N_NMODE_ROW").style.display="none";
       }
       this.select=function()
       {
           setContainerStyle({userTabDisplay:"",bg:"rgb(251,251,251)",boxChecked:true,tchBg:'#4D9CD4',tchBorder:'1px solid black'}); 
           if(tchPanelManager.getEndTaskPanel()) tchPanelManager.getEndTaskPanel().unSelect();
           tch.select(); 
       }
       userLoaded=true;
       return this.select();
   } 
   this.setDefaultByHook=function()
   {
       setDefaultStaff(userContainer.all("FL_EGN_STAFF"));
       setDefaultNotifyStaff(userContainer.all("FL_EGN_NOTIFY_STAFF"));
       setSelectStaff(userContainer.all("FL_EGN_SELECT_STAFF"),userContainer.all("FL_EGN_STAFF"));
       setSelectNotifyStaff(userContainer.all("FL_EGN_SELECT_NTY_STAFF"),userContainer.all("FL_EGN_NOTIFY_STAFF"));
   }
   this.unSelect=function()
   {
       if(tch.isDisabled()) return;
       setContainerStyle({userTabDisplay:"none",bg:"",boxChecked:false,tchBg:'',tchBorder:'1px solid white'});
       tch.unSelect();
   }
   this.hiddenSelect=function()
   {
       tchContainer.all("FL_EGN_TCH_SELECT").style.display="none";
   }
   var setTchDesc=function(oTchDesc,oTchRemark)
   {
       oTchDesc.title=tch.getRemark();
       tch.setDesc(tch.getName());
   }
   var appendUserHTML=function()
   {
       var parentContainer=tchContainer;
       var userContainer=tchService.layer.$("FL_EGN_USER_ROW");
       if(tchService.isSingleSelect) 
       {
           parentContainer=userContainer.all("FL_EGN_TCH_USERS");
           userContainer.style.display="";
       }
       var oUserDiv=tchService.formDoc.createElement("div"); 
       oUserDiv.innerHTML=userTemplate;
   	   parentContainer.insertAdjacentElement('BeforeEnd',oUserDiv);   	   
   	   return oUserDiv;
   }   
   var setDefaultStaff=function(oStaffInput)
   {
       if(tch.hasDefaultStaff())
       {
           var oDefaultStaff=tch.getDefaultStaff();
           var sId=(tch.getExcuteStaffIds())?tch.getExcuteStaffIds():oDefaultStaff.getId();
           var isSingleStaff=(sId) && sId.indexOf(",")==-1
           var isSelected=(isSingleStaff)?true:oDefaultStaff.selected;
           var aStaff={id:sId,name:oDefaultStaff.getName(),disableSel:oDefaultStaff.disabled,isSelected:isSelected};
           setStaff(aStaff,oStaffInput,tch.setExcuteStaffIds);
       }
       if(tch.isEnd())
       {
       	   userContainer.all("FL_EGN_NMODE_ROW").style.display="none";
       	   userContainer.all("FL_EGN_STAFF").style.display="none";
       	   userContainer.all("FL_EGN_STAFF_ROW").className="";
       	   userContainer.all("FL_EGN_STAFF_ROW").style.width="0px";
       	   userContainer.all("FL_EGN_STAFF_BLANK_ROW").style.width="0px"; 
       	   userContainer.all("FL_EGN_STAFF_LABEL_BLANK_ROW").style.width="0px";       	   
       	   userContainer.all("FL_EGN_NOTIFY_STAFF_ROW").className="";
       	   userContainer.all("FL_EGN_NOTIFY_STAFF_ROW").style.width="100%";
       	   userContainer.all("FL_EGN_SELECT_STAFF").style.display="none";
       	   userContainer.all("FL_EGN_STAFF_LABEL_ROW").className="";
       	   userContainer.all("FL_EGN_STAFF_LABEL_ROW").style.width="0px";
       	   userContainer.all("FL_EGN_STAFF_LABEL").style.display="none";       	        	   
       }
   }
   var setDefaultNotifyStaff=function(oStaffNotifyInput)
   {
       if(tch.hasDefaultNotifyStaff())
       {       	
           var oDefaultNotifyStaff=tch.getDefaultNotifyStaff();
           var sId=(tch.getNotifyStaffIds())?tch.getNotifyStaffIds():oDefaultNotifyStaff.getId();
           var aStaff={id:sId,name:"",disableSel:oDefaultNotifyStaff.disabled,isSelected:oDefaultNotifyStaff.selected};
           setStaff(aStaff,oStaffNotifyInput,tch.setNotifyStaffIds);
       }
   }
   var setSelectBoxEvent=function(tchDiv,oSelectTch,oPanel)
   {
   	   tchDiv.onclick=function(){oSelectTch.click()};
       oSelectTch.onclick=function()
       {
           this.checked?oPanel.select():oPanel.unSelect();
       }
   }    
   var setSms=function(oSmsSpan,oSmsSel){setNotifyEvent(oSmsSpan,oSmsSel,tch.getSms(),'短信')};
   var setMail=function(oMailSpan,oMailSel){setNotifyEvent(oMailSpan,oMailSel,tch.getMail(),'邮件')};
   var setNSms=function(oSmsSpan,oSmsSel){setNotifyEvent(oSmsSpan,oSmsSel,tch.getNotifyCfg().sms,'短信',true)};
   var setNMail=function(oMailSpan,oMailSel){setNotifyEvent(oMailSpan,oMailSel,tch.getNotifyCfg().mail,'邮件',true)};
   var setNotifyEvent=function(oNotifySpan,oNotifySel,oNotifyCfg,sNotifyCN,isNNotify)
   {
       oNotifySpan.style.display=((tch.isEnd() && !isNNotify)||!oNotifyCfg.display)?"none":"";
       oNotifySpan.title=getTitle(oNotifyCfg,sNotifyCN);
       oNotifySel.checked=(oNotifyCfg.selected)?true:false;
       if(!oNotifyCfg.canChange)
       {
           oNotifySel.disabled=true;
       }
       function getTitle(oNotifyCfg,sNotifyCN)
       {
           if(!oNotifyCfg.canChange)
               return "管理员已设定此环节发"+sNotifyCN+"给执行人,无法在执行时更改";
           if(oNotifyCfg.selected)
               return "发送"+sNotifyCN+"给执行人";
           else
               return "不发送"+sNotifyCN+"给执行人";
       }
       oNotifySel.onclick=function()
       {
           if(!oNotifyCfg.canChange) return;
           oNotifyCfg.selected=!oNotifyCfg.selected;
           oNotifySel.checked=(oNotifyCfg.selected)?true:false;
           oNotifySel.title=getTitle(oNotifyCfg,sNotifyCN);
       }
   }
   var setCountersign=function(userContainer)
   {
   	   var oDom=userContainer.all;
   	   var counterSignCfg=tch.counterSignCfg;
   	   oDom("FL_EGN_COUNTERSIGN_ROW").style.display=(counterSignCfg.display)?"":"none";
   	   oDom("FL_EGN_COUNTERSIGN_TEXT").innerHTML=counterSignCfg.text;
   	   oDom("FL_EGN_PARALLEL_SPAN").style.display=(counterSignCfg.parallel.display)?"":"none";
   	   oDom("FL_EGN_PARALLEL_TEXT").innerHTML=counterSignCfg.parallel.text;
   	   oDom("FL_EGN_SERIAL_SPAN").style.display=(counterSignCfg.serial.display)?"":"none";
   	   oDom("FL_EGN_SERIAL_TEXT").innerHTML=counterSignCfg.serial.text;
   	   var oParallelSel=oDom("FL_EGN_PARALLEL_SELECT");
   	   var oSerialSel=oDom("FL_EGN_SERIAL_SELECT");   	   
       oParallelSel.checked=counterSignCfg.parallel.checked;
       oSerialSel.checked=counterSignCfg.serial.checked;
       oParallelSel.onpropertychange=function()
       {
           tch.counterSignCfg.parallel.checked=(this.checked);
           if(tch.counterSignCfg.parallel.checked)
              oSerialSel.checked=false;
       }
       oSerialSel.onpropertychange=function()
       {
           tch.counterSignCfg.serial.checked=(this.checked);
           if(tch.counterSignCfg.serial.checked)
              oParallelSel.checked=false;
       }       
   }   
   var setSelectStaff=function(oSelectStaff,oStaffInput)
   {       
       var orgId="";
       var orgCanChange=true;
       var orgParam=null;
       oSelectStaff.disabled=(tch.canChangeStaff()?false:true);
       if(tch.hasDefaultOrg())
       {
           orgId=tch.getDefaultOrg().getId();
           orgCanChange=tch.getDefaultOrg().canChange;
           orgParam=tch.getDefaultOrg().otherParam;
       }
       oSelectStaff.onclick=function()
       {
       	    if(this.disabled) return;
            selectStaff(oStaffInput,orgId,tch.getStaffCreateType(),!orgCanChange,orgParam,tch.setExcuteStaffIds,tch.setExcuteGroupIds,tch.getFilterStaffWhere());
       }
   }
   var setSelectNotifyStaff=function(oSelectNotifyStaff,oStaffNotifyInput)
   {
       var orgId="";
       var orgCanChange=true;
       var orgParam=null;
       oSelectNotifyStaff.disabled=(tch.canChangeNotifyStaff()?false:true);
       if(tch.hasNotifyDefaultOrg())
       {
           orgId=tch.getNotifyDefaultOrg().getId();
           orgCanChange=tch.getNotifyDefaultOrg().canChange;
       }
       oSelectNotifyStaff.onclick=function()
       {
       	   if(this.disabled) return;
       	   selectStaff(oStaffNotifyInput,orgId,tch.getNotifyStaffCreateType(),!orgCanChange,orgParam,tch.setNotifyStaffIds,null,null);
       }
   }
   var selectStaff=function(oStaffContainer,sDefaultOrgId,sStaffCreateType,isSetRoot,aRootOrgParam,callFunc,groupCallFunc,filterStaffWhere)
   {
        var returnStaff=null;
        var text=oStaffContainer.text;
        var value=oStaffContainer.value;
        var group=oStaffContainer.group;
        if(sStaffCreateType==flow.constant.staffCreateType.deptTree)
           returnStaff=choiceStaff(true,sDefaultOrgId,null,false,null,text,value,isSetRoot,null,filterStaffWhere);
        else if(sStaffCreateType==flow.constant.staffCreateType.groupTree)
           returnStaff=choiceStaffByProject(true,sDefaultOrgId,null,false,null,text,value,isSetRoot,aRootOrgParam,group,filterStaffWhere);
        else if(sStaffCreateType==flow.constant.staffCreateType.dutyTree)
           returnStaff=choiceStaffByDuty(true,sDefaultOrgId,null,false,null,text,value,isSetRoot,null,filterStaffWhere);
        setStaff(returnStaff,oStaffContainer,callFunc,groupCallFunc);
   }
   setStaff=function(aStaff,oStaffInput,callFunc,groupCallFunc)
   {
       if(!aStaff) return;
       if(oStaffInput.readyState!="complete")
       { 
           window.setTimeout(function(){setStaff.call(this,aStaff,oStaffInput,callFunc,groupCallFunc)});
           return;
       }
       oStaffInput.onSelectChange=function()
       {       
          callFunc.call(tch,oStaffInput.value);
          if(groupCallFunc) groupCallFunc.call(tch,oStaffInput.group);
       }
       oStaffInput.group = aStaff.group;
       oStaffInput.value = aStaff.id;       
       if(aStaff.disableSel) oStaffInput.disabledSel="true";       
       if(aStaff.name)
       {
           oStaffInput.hasText="true";
           oStaffInput.text = aStaff.name;
           return;
       }
       oStaffInput.setReturnText();
       if(!aStaff.isSelected) oStaffInput.unSelectAll();
   }
   var setContainerStyle=function(aStyle)
   {
       if(!userContainer || !userContainer.all("FL_EGN_USERS_DIV")) return;
       userContainer.all("FL_EGN_USERS_DIV").style.display=aStyle.userTabDisplay;
       //userContainer.style.backgroundColor=aStyle.bg;
       tchContainer.all("FL_EGN_TCH").style.backgroundColor=aStyle.tchBg;
       tchContainer.all("FL_EGN_TCH").style.border=aStyle.tchBorder;
       tchContainer.all("FL_EGN_TCH_SELECT").checked=aStyle.boxChecked;
   }
}

tache.Panel.createInst=function(oTch,tchPanelManager)
{
   var oPanel=new tache.Panel();
   oPanel.setTch(oTch,tchPanelManager);
   return oPanel;
}

tache.opinionCtrl=
{
   isShow:true, 
   type:tache.constant.opinionType.option,
   timer:null,
   getType:function()
   {
      return this.type;
   },
   setRequire:function(oOpinionRequire)
   {
       oOpinionRequire.style.display="";
   },
   hidden:function(oOpinionContainer)
   {
      this.isShow=false;
      oOpinionContainer.style.display="none";
   },
   show:function(oOpinionContainer)
   {
      this.isShow=true;
      oOpinionContainer.style.display="block";
   },
   dynamicShow:function()
   {
       this.isShow?this.hidden():this.show(); 
   },
   setType:function(sOpinionType,oOpinionContainer,oOpinionRequire)
   {
       this.type=sOpinionType;
       var aOpinionCtrl={};
       aOpinionCtrl[tache.constant.opinionType.hidden] =function(){this.hidden(oOpinionContainer);};
       aOpinionCtrl[tache.constant.opinionType.option] =function(){this.show(oOpinionContainer);};
       aOpinionCtrl[tache.constant.opinionType.require]=function(){this.show(oOpinionContainer);this.setRequire(oOpinionRequire)};
       aOpinionCtrl[sOpinionType].call(this);
   },   
   init:function(context,layer)
   {
   	   var oOpinionInput=layer.$("FL_EGN_OPINION_INPUT");
   	   var oOpinionRequire=layer.$("FL_EGN_OPINION_REQUIRE");
       this.setType(context.getOpinion().type,layer.$("FL_EGN_OPINION_ROW"),oOpinionRequire);
       var aDefaultValue = context.getOpinion().getDefaultValue();
       if(aDefaultValue!='') oOpinionInput.value = aDefaultValue;  //IE存在BUG，如果在将值赋空时，第一次无法触发onpropertychange事件
       var oOpinionCtrl=this;
       initOpinionMenu();
       oOpinionInput.onpropertychange=function()
       {
           context.getOpinion().setValue(this.value);
       }
       function initOpinionMenu()
       {
       	  var oOpinionOften=layer.$("FL_EGN_OFTEN_OPINION_DIV");
       	  var oOpinionEditor=layer.$("FL_EGN_OPINION_EDIT_BUTTON");
          var oOftenOpinionSeter=layer.$("FL_EGN_OFTEN_OPINION_SET_BUTTON");
       	  var oAction={onclick:function(oMenuItem)
             	       {
             	          layer.$("FL_EGN_OPINION_INPUT").value = oMenuItem.innerText;
             	       }};       	  
       	  reSetOftenOpinion();
          oOpinionEditor.onclick=function()
          {
              doOpinion();
              reSetOftenOpinion();
          }
          oOftenOpinionSeter.onclick=function()
          {
              if(oOpinionInput.value=="") return;
              setOftenOpinion(oOpinionInput.value)
          }
          function reSetOftenOpinion()
          {
              var opinionMenuDoc = flow.Service.getOpinionMenuDoc();
              tache.opinionMenu.setMenuList(opinionMenuDoc,oOpinionOften,oAction);
          }
          function setOftenOpinion(sOpinion)
		  {
		  	  if(sOpinion.Tlength()>250)
		  	  {
		  	      Message.fail("常用意见不能超过250个字节！",layer.getDomEle());
		  	      return;
		  	  }
		      var XMLDoc=new ActiveXObject("Microsoft.XMLDOM");
		   	  var sendXML='<?xml version="1.0" encoding="GBK"?>'
				             +  '<root><FLOW_MOD/><TCH_MOD/><OPINION_TYPE>STAFF</OPINION_TYPE>'
				             +  '<ADD><record OPINION_CONTENT="'+xmlEncode(sOpinion)+'" /></ADD>'
		   	                 +  '<DEL/><EDIT/></root>';
			  XMLDoc.loadXML(sendXML);
			  var saveURL="/servlet/FormTurnServlet?tag=17";
			  formContext.App.ajaxRequest(saveURL,{async:true,xml:XMLDoc,onStateChange:function(oXMLHttp){stateChange(oXMLHttp)}});	   
		   	  function stateChange(oXMLHttp)
		   	  {   	   	  
		   	   	  Message.xmlHttpLoading(oXMLHttp,{wait:"正在提交中,请稍候......",succeed:"设置成功"},layer.getDomEle(),
		   	   	  {
		   	   	    onSucceed:function(){reSetOftenOpinion();}
		   	   	  })   	      
		   	  }
		   }
       }
   },
   isInvalid:function(context)
   {
       return (this.type==tache.constant.opinionType.require && ! context.getOpinion().getValue());
   }
}
tache.attachCtrl=
{
	oService:null,
	uploader:null,
	files:{},
	init:function(oService,oWin)
	{
	    this.oService=oService;
	    this.uploader=oWin.$("FL_EGN_UPLOADER");
	    var self=this;
	    if (this.uploader.readyState=="complete")
	    {
	        initUploader(this.uploader);
	    }
	    else
	    {
		    this.uploader.onreadystatechange=function()
		    {		    	
		         if (this.readyState=="complete")
		         {
		         	  initUploader(this);
		         }
		    }
	    }
	    if(!oService.context.getWinCfg().showAttach)
	    {
	        oWin.$("FL_EGN_UPLOADER_ROW").style.display="none";	    
	    }
	    function initUploader(oUploader)
	    {
	        oUploader.init();
	        oUploader.onFileAdd=function(){self.addFile();}
        	oUploader.onFileDel=function(){self.delFile();}
	    }
	},
	addFile:function()
	{
		var e=formContext.getWin().form.event;
		var file=e.hook.file;
		var oXMLDoc= new ActiveXObject("Microsoft.XMLDOM");
		oXMLDoc.loadXML(e.hook.serverData);
        var xmlNode=oXMLDoc.selectSingleNode("/root/rowSet");
        var sServerRelativePath=decodeURIComponent(xmlNode.getAttribute("relativeName"));
        var sHref=xmlNode.selectSingleNode("/root/rowSet/name/a").getAttribute("href")
		this.files[file.id]={name:file.name,size:file.size,serverRelativePath:sServerRelativePath};
		e.hook.link.href=sHref;
	},
	delFile:function()
	{
		 var e=formContext.getWin().form.event;
		 var file=e.hook.file;
	     var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	     var sRelativePath=encodeURIComponent(this.files[file.id].serverRelativePath);
	     oXMLHTTP.Open("POST","/servlet/flowAttach?relativeName="+sRelativePath+"&OperType=2",false);
		 oXMLHTTP.send();
		 delete this.files[file.id];
	},
    getFilesQueuedNum:function()
    {
    	if(!this.oService.context.getWinCfg().showAttach) return 0;
    	if(!this.uploader.getFileQueuedCnt()) return 0;
        return this.uploader.getFileQueuedCnt();
    },
	appendXML:function(XMLDoc)
    {	
    	var oXML= new ActiveXObject("Microsoft.XMLDOM"); 
    	var oFiles=this.files;
        var sXML='<?xml version="1.0" encoding="GBK"?>'
	             +  '<root><FLOW_MOD/><TCH_MOD/>';
	    for (var key in oFiles)
        {
        	sXML+='<rowSet relativeName="'+oFiles[key].serverRelativePath
        	sXML+='" size="'+oFiles[key].size+'" staffId="'+formContext.globalVar.STAFF_ID+'">';
        	sXML+='<name>'+xmlEncode(oFiles[key].name)+'</name>';
        	sXML+='</rowSet>';
        }        
		sXML+='</root>';
		oXML.loadXML(sXML);
		var oFilesXML=oXML.selectNodes("/root/rowSet");
		var iLen=oFilesXML.length;
		for(var i=0;i<iLen;i++)
		{
		    var oNewNode=oFilesXML[i].cloneNode(true);
		    XMLDoc.selectSingleNode("/root/FLOW/ATACHES").appendChild(oNewNode);
		}
    }
}

tache.opinionMenu = 
{
    setMenuList:function(opinionMenuDoc,oOpinionOften,oAction)
    {
    	oOpinionOften.innerHTML="";
        var opinionRows = opinionMenuDoc.selectNodes("/root/rowSet");
        var iWidth=oOpinionOften.clientWidth-20;
        var oFormDoc=formContext.getWin().form.document;
        if (opinionRows != null)
        {
            if (opinionRows.length > 0) 
            {
                for (var i = 0; i < opinionRows.length; i++) 
                {
                	var oDiv=oFormDoc.createElement("div");
                	oDiv.style.cssText="text-align:left;font-size:9pt;white-space:nowrap;margin:2px;overflow:hidden;text-overflow:ellipsis;"
                	                  +"width:"+iWidth+";cursor:default";
                	var sText=opinionRows[i].selectSingleNode("OPINION_CONTENT").text;
                	oDiv.className="fl_egn_often_opinion_item";
		            oDiv.innerText=sText;
                	oDiv.onclick=function(){oAction && oAction.onclick(this)};               	
                	oDiv.onmouseover=function()
                	{
                	    this.style.background="blue";
                	    this.style.color="white";
                	}
                	oDiv.onmouseout=function()
                	{
                	    this.style.background="";
                	    this.style.color="black"
                	}                	
                	oOpinionOften.appendChild(oDiv);
                	oDiv.title=sText;
                }
            }
        }
    }
}

function doCancelFlow(){
    if (!confirm("撤销流程会使流程中正在处理的事务无法继续进行，是否确认撤销该流程？")) {
	   return;
    }
    var oXMLHTTP=new ActiveXObject("Microsoft.XMLHTTP");
    var url="/FlowBrowse?system_code=D&op_type=cancel_flow&flow_id="+formContext.FLOW.FLOW_ID;	
    oXMLHTTP.Open("POST",url,false);
    oXMLHTTP.send();
    var dataXML=new ActiveXObject("Microsoft.XMLDOM");
    dataXML.load(oXMLHTTP.responseXML);    
    oResult=dataXML.selectNodes("/FLOW/RESULT");
    var ret,msg;
    if(oResult!=null && oResult.length>0){
       ret=oResult[0].getAttribute("ret");
       if(ret==0){
           alert("流程撤销成功！");
		   formContext.callback();
           formContext.getWin().self.close();
           return true;
       }else{
          msg="流程撤销失败！"+oResult[0].text;
          alert(msg);
	      return false;
       }
    }else{
         alert("流程撤销失败！");
	     return false;
    }
}

function isCancelBtnDisabled(){
	if(formContext.FLOW.TCH_ID!=0){
		var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");	
		xmlhttp.Open("POST","/servlet/JSRealtyServlet?tag=33&flowId="+formContext.FLOW.FLOW_ID,false);
		xmlhttp.send();
		if(isSuccess(xmlhttp)){
			oXml=xmlhttp.responseXML;
			var returnCode=oXml.selectSingleNode("/root/resultCode").text;
			if(returnCode==0){
				return false;
			}else{
				return true;
			}
		}
		return true;
	}else{
		return true;
	}	
}

//添加流程关注
function addFlowAttention(){
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");	
	xmlhttp.Open("POST","/servlet/flowOper?OperType=15&flowId="+formContext.FLOW.FLOW_ID,false);
	xmlhttp.send();
	if(isSuccess(xmlhttp)){
		MMsg("添加关注成功！");
		formContext.menuObject.executeRule();
	}	
}

//取消流程关注
function delFlowAttention(){
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");	
	xmlhttp.Open("POST","/servlet/flowOper?OperType=16&flowIds="+formContext.FLOW.FLOW_ID,false);
	xmlhttp.send();
	if(isSuccess(xmlhttp)){
		MMsg("取消关注成功！");
		formContext.menuObject.executeRule();
	}	
}

//是否已添加关注
function isAddedFlowAttention(){
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");	
	xmlhttp.Open("POST","/servlet/flowOper?OperType=17&flowId="+formContext.FLOW.FLOW_ID,false);
	xmlhttp.send();
	if(isSuccess(xmlhttp)){
		var xmlData=xmlhttp.responseXML;
		var returnCode=xmlData.selectSingleNode("/root/resultCode").text;
		if(returnCode==1){//已添加关注		
			return true;
		}		
	}
	return false;
}

//判断流程是否是首环节或者已竣工
function isFlowCanAttention(){
	var flag = isFlowBegin() || (formContext.FLOW.FLOW_STATUS=='F');
	return flag;
}

function isDisabledAddFlowAttention(){
	var flag = isFlowBegin() || (formContext.FLOW.FLOW_STATUS=='F') || isAddedFlowAttention();
	return flag;
}

//取消接收，将单子退回工单池
function cancelReceive(){
    var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
    var iTchId=formContext.FLOW.TCH_ID;
    oXMLHTTP.open("POST",'../../servlet/flowOper?OperType=19&tchId='+iTchId,false);
    oXMLHTTP.send("");
    if(isSuccess(oXMLHTTP))
    {
        MMsg("释放成功!");
        doRefresh();
    }
}

//当前员工是否为流程发起人 add by tangft 2013.10.20
function getSubmitStaff(oForm){
	flowId = oForm.FLOW.TOP_FLOW_ID;
	var currentStaffId = oForm.GLOBAL_VAR.STAFF_ID;
	var staffId;
	var sql;
    sql = "select T.STAFF_ID from flow T WHERE T.FLOW_ID = " + flowId;
	var sqlResult = queryAllData(sql);
	if (sqlResult != "" && sqlResult != null)
	{
		staffId = sqlResult[0].STAFF_ID;
		return (currentStaffId != staffId);
	}else{
		return true;
	}
}


//发送短信邮件催办 add by tangft 2013.10.20
function hurryBySmsEmail(notifyType,oForm){
	var flowId = oForm.FLOW.TOP_FLOW_ID;
	var msg = "短信及邮件";
	if(notifyType==1){
		msg = "短信";
	}else if(notifyType==2){
		msg = "邮件";
	}
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	try {
		var staffs = getHurryStaffsInfo(flowId);
		if(!staffs || staffs == "" || staffs == null || staffs == "null"){
			alert("当前办理人不符合催办条件，不能发送催办！");
			return;
		}
		if(confirm("是否要向 "+staffs+" 发送"+msg+"催办？")){
			oXMLHTTP.Open("POST","/servlet/flowOper?OperType=21&notifyType="+notifyType+"&flowId="+flowId,false);
			oXMLHTTP.send();
			if(isSuccess(oXMLHTTP)){
				alert ("催办成功");
			}else{
				alert ("催办失败");
			}
		}	
	} catch (e) {
		alert("异步调用失败！");
	}
}


//获取催办员工信息 区域-姓名 add by tangft 2013.10.20
function getHurryStaffsInfo(flowId){
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("POST", "/servlet/flowOper?OperType=20&flowId="+flowId, false);
	oXMLHTTP.send();
	if(isSuccess(oXMLHTTP)){
		if (oXMLHTTP.responseXML.selectSingleNode("/root/STAFF_NAMES").text != ""){
            return oXMLHTTP.responseXML.selectSingleNode("/root/STAFF_NAMES").text;
        }
	}
	return '';
}  	