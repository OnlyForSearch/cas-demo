var paramArray=new Array();
function CreateSingleRelation()
{
    var obj=window.showModalDialog("/workshop/form/CIFile/SelectClassId.html?type=relate",""
		        ,"dialogWidth:400px;dialogHeight:200px;center:no;help:no;resizable:no;status:no");
    if(obj.classId)
    {
         window.showModalDialog("/workshop/form/index.jsp?formId=198&classId="+obj.classId
			             +"&sInstanceId="+formContext.TABLE.CIM_BASEELEMENT.INSTANCEID.VALUE()
			             +"&sClassId="+formContext.TABLE.CIM_BASEELEMENT.CLASSID.VALUE()
			             +"&sRequestId="+formContext.TABLE.CIM_BASEELEMENT.REQUEST_ID.VALUE(),
			             "",
			             "dialogWidth:800px;dialogHeight:500px;center:no;help:no;resizable:yes;status:no");
    }	
}

function CreateMutiRelation()
{
	window.showModalDialog("/workshop/form/CIFile/CIRelation.html?result=100000001&INSTANCEID="
					+formContext.TABLE.CIM_BASEELEMENT.INSTANCEID.VALUE()
					+"&REQUESTID="+formContext.TABLE.CIM_BASEELEMENT.REQUEST_ID.VALUE()
					+"&CLASSID="+formContext.TABLE.CIM_BASEELEMENT.CLASSID.VALUE()
					+"&DATASET=0&relate=0",
		"",
		"dialogWidth:650px;dialogHeight:400px;center:no;help:no;resizable:yes;status:no");
}

function showNeProp()
{
    var sNeId=getNeId();
    if(sNeId)
    {
       var param="dialogWidth=830px;dialogHeight=580px;help=0;scroll=1;status=0";
	   window.showModelessDialog("../../workshop/config/netElementList.html?id="+sNeId+"&tag=2",window,param);
	}
}

function relateToAsset()
{
	var instanceId="";
	instanceId=formContext.TABLE.CIM_BASEELEMENT.INSTANCEID.VALUE();
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");	
	xmlhttp.Open("POST","/servlet/CmdbServlet?tag=8&instanceId="+instanceId+"&vTable=ASSET_BASEINFO",false);
	xmlhttp.send();
	var requestId=xmlhttp.responseText;
	if(requestId)
	{
		doWindow_open("/workshop/form/index.jsp?formId=199&requestId="+requestId);
	}
	else
	{
		MMsg("没有录入对应资产信息！");
		return;				
	}
}

function getNeId()
{
   var sNeId=formContext.TABLE.CIM_BASEELEMENT.RELATE_NE_ID.VALUE();
   return sNeId;
}






var NCIFormTurn = function(classId,dataSetId,paramObj){
	var param,model,callMethod;
	var sURL="/workshop/form/index.jsp?classId="+classId+"&dataSetId=" + dataSetId + "&turn=1&mainRequestId="+formContext.TABLE.CI_BASE_ELEMENT.REQUEST_ID.VALUE();
	var maxWidth = screen.availWidth - 10;
	var maxHeight = screen.availHeight - 30;
	var oTable=formContext.TABLE;
	
	
	if(paramObj){
		param = paramObj.param;
		model = paramObj.model;
		callMethod = paramObj.callMethod;
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
	            window.showModalDialog(sURL,window,'dialogWidth=1100px;dialogHeight=600px;resizable=yes;');
	        }else{
			    doWindow_open(sURL,maxWidth,maxHeight,"_blank");
			}
		}
	}
};

function doTurnMonitor(classId,dataSetId,param,model,callMethod){
	var paramObj = {};
	paramObj.param = param;
	paramObj.callMethod = model;
	paramObj.callMethod = callMethod;
	var nciFormTurnObj = new NCIFormTurn(classId,dataSetId,paramObj);
	nciFormTurnObj.doTurn();
}

/*是否禁用新增网元按钮*/
function isDisableDoTurn(){
	try{
	    if(formContext.TABLE.CI_BASE_ELEMENT.DATASET_ID.VALUE()!=2 ||
	    	 parent.frames["fraForm"].queryReconcileCi(formContext.TABLE.CI_BASE_ELEMENT.INSTANCE_ID.VALUE())){
	    	return true;
	    }
		var classId = formContext.TABLE.CI_BASE_ELEMENT.CLASS_ID.VALUE();
		var instanceId = formContext.TABLE.CI_BASE_ELEMENT.INSTANCE_ID.VALUE();
		var sendUrl="/servlet/CmdbServlet?tag=66&classId="+classId+"&instanceId="+instanceId;
		var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttp.Open("POST",sendUrl,false);
		xmlhttp.send();
		var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.load(xmlhttp.responseXML);
		var count = xmlDoc.selectSingleNode("/root/COUNT").text;
		if(count==0){
			return true;
		}
		return false;
	}catch(e) {
		return true;
	}
	
}

