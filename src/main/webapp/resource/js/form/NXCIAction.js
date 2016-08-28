var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var Url = "../../../servlet/CmdbServlet?";
var fLevel,sLevel,tLevel;
var callbackFn;

function proClick()
{
	if(cli=="up")
	{
		HillProps.style.display="";
		cli="down";
		btProps.src="../../../resource/image/bgsearch_up.gif";
	}else
	{
		HillProps.style.display="none";
		cli="up";
		btProps.src="../../../resource/image/bgsearch_down.gif";
	}
}

function setCateLevelInit()
{
	setCateLevel(1);
	document.getElementById("oType").value=oTable.CIM_BASEELEMENT.TYPE.DEFAULT_VALUE;	
	setCateLevel(2);
	document.getElementById("oItem").value=oTable.CIM_BASEELEMENT.ITEM.DEFAULT_VALUE;	
}

function setLocalLevelInit()
{
	//alert(document.getElementById("oRegionId").value)
	setLocatLevel("region");
	document.getElementById("oSiteId").value=oTable.ASSET_BASEINFO.SITEID.DEFAULT_VALUE;	
	setLocatLevel("site");
	document.getElementById("oRoomIdAsset").value=oTable.ASSET_BASEINFO.ROOMID.DEFAULT_VALUE;	
	setLocatLevel("room");
	document.getElementById("oRackIdAsset").value=oTable.ASSET_BASEINFO.RACKID.DEFAULT_VALUE;	
	
}


function setLoatModifyInfo()
{
	
}
	
function setCateLevel(level)
{
	var oValue;
	var oSelect;
	if(level==1)
	{
		oValue=document.getElementById("oCategory").value;
		oSelect=document.getElementById("oType");		
		xmlhttp.Open("POST",Url+"tag=1&parentValue="+oValue,false);
		xmlhttp.send();
		var dataXML = new ActiveXObject("Microsoft.XMLDOM");
		//alert(xmlhttp.responseXML.xml);
		dataXML.load(xmlhttp.responseXML);	
		for(var i=oSelect.length-1;i>=0;i--)
		{
	    	oSelect.options.remove(i);
		}
		var oRows = dataXML.selectNodes("/root/rowSet");
		var iLen = oRows.length;
		var selectValue;
		for(var i=0;i<iLen;i++)
	   	{
			var oOption = document.createElement("OPTION");
			oOption.value =oRows[i].getAttribute("id");
			oOption.text = oRows[i].selectSingleNode("CATE_TIERAME").text;	
			oSelect.add(oOption);
		}
		setCateLevel(2);			
	}else if(level==2)
	{
		oValue=document.getElementById("oType").value;
		oSelect=document.getElementById("oItem");		
		xmlhttp.Open("POST",Url+"tag=1&parentValue="+oValue,false);
		xmlhttp.send();
		var dataXML = new ActiveXObject("Microsoft.XMLDOM");
		//alert(xmlhttp.responseXML.xml);
		dataXML.load(xmlhttp.responseXML);	
		for(var i=oSelect.length-1;i>=0;i--)
		{
	    	oSelect.options.remove(i);
		}
		var oRows = dataXML.selectNodes("/root/rowSet");
		var iLen = oRows.length;
		var selectValue;
		for(var i=0;i<iLen;i++)
	   	{
			var oOption = document.createElement("OPTION");
			oOption.value =oRows[i].getAttribute("id");
			oOption.text = oRows[i].selectSingleNode("CATE_TIERAME").text;	
			oSelect.add(oOption);
		}
	}

}

function setLocatLevel(level)
{
	var oValue;
	var oSelect;
	if(level=="region")
	{
		oValue=document.getElementById("oRegionId").value;
		oSelect=document.getElementById("oSiteId");	
		xmlhttp.Open("POST",Url+"tag=2&parentValue="+oValue,false);
		xmlhttp.send();
		var dataXML = new ActiveXObject("Microsoft.XMLDOM");
		//alert(xmlhttp.responseXML.xml);
		dataXML.load(xmlhttp.responseXML);	
		for(var i=oSelect.length-1;i>=0;i--)
		{
	    	oSelect.options.remove(i);
		}
		var oRows = dataXML.selectNodes("/root/rowSet");
		var iLen = oRows.length;
		var selectValue;
		for(var i=0;i<iLen;i++)
	   	{
			var oOption = document.createElement("OPTION");
			oOption.value =oRows[i].getAttribute("id");
			oOption.text = oRows[i].selectSingleNode("SITENAME").text;	
			oSelect.add(oOption);
		}
		setLocatLevel("site");					
	}else if(level=="site")
	{
		oValue=document.getElementById("oSiteId").value;
		oSelect=document.getElementById("oRoomIdAsset");		
		xmlhttp.Open("POST",Url+"tag=3&parentValue="+oValue,false);
		xmlhttp.send();
		var dataXML = new ActiveXObject("Microsoft.XMLDOM");
		//alert(xmlhttp.responseXML.xml);
		dataXML.load(xmlhttp.responseXML);	
		for(var i=oSelect.length-1;i>=0;i--)
		{
	    	oSelect.options.remove(i);
		}
		var oRows = dataXML.selectNodes("/root/rowSet");
		var iLen = oRows.length;
		var selectValue;
		for(var i=0;i<iLen;i++)
	   	{
			var oOption = document.createElement("OPTION");
			oOption.value =oRows[i].getAttribute("id");
			oOption.text = oRows[i].selectSingleNode("ROOMNAME").text;	
			oSelect.add(oOption);
		}
		setLocatLevel("room");				
	}else if(level=="room")
	{		
		oValue=document.getElementById("oRoomIdAsset").value;
		oSelect=document.getElementById("oRackIdAsset");		
		xmlhttp.Open("POST",Url+"tag=4&parentValue="+oValue,false);
		xmlhttp.send();
		var dataXML = new ActiveXObject("Microsoft.XMLDOM");
		//alert(xmlhttp.responseXML.xml);
		dataXML.load(xmlhttp.responseXML);	
		for(var i=oSelect.length-1;i>=0;i--)
		{
	    	oSelect.options.remove(i);
		}
		var oRows = dataXML.selectNodes("/root/rowSet");
		var iLen = oRows.length;
		var selectValue;
		for(var i=0;i<iLen;i++)
	   	{
			var oOption = document.createElement("OPTION");
			oOption.value =oRows[i].getAttribute("id");
			oOption.text = oRows[i].selectSingleNode("RACKNAME").text;	
			oSelect.add(oOption);
		}
	}
}

//人员选择框
function choosePerson(obj_man_id,isMult,isList)
{
	var obj = null;
	if(isMult=="" || isMult==null || isMult=="false")
	{
		obj = choiceStaff();
		if(obj!=null)
		{
			obj_man_id.value = obj.id;
			obj_man_id.text = obj.name
		}
	}else{
		obj = choiceStaff(false, null, null, null, null, obj_man_id.text,obj_man_id.value );
		if(obj!=null && (isList==null || isList=="")){
			var arrid = obj.id.split(",");
			var arrname = obj.name.split(",");
			for(var i=0;i<arrid.length;i++)
			{
				obj_man_id.add(new Option(arrname[i],arrid[i]));
			}
		}else if(obj!=null){
		
			obj_man_id.value = obj.id;
			obj_man_id.text = obj.name
		}
	}
}

function ChooseCapability()
{
	var sfilter=oCapabilityList.value;
	choiceCode("CIM_CAPABILITYLIST",oCapabilityList,false,sfilter);
}

function choiceCode(codeType,objId,isList,filter)
{
	var obj = null;
	obj=choiceCodeList(true,null,objId.text,objId.value,codeType,filter);
	if(obj!=null){
		if(obj!=null && isList){
			var arrid = obj.id.split(",");
			var arrname = obj.name.split(",");
			for(var i=0;i<arrid.length;i++)
			{
				objId.add(new Option(arrname[i],arrid[i]));
			}
		}else if(obj!=null){		
			objId.value = obj.id;
			objId.text = obj.name
		}
	}
}

function choiceCodeList(isMultiple,isReadOnly,iniName,iniId,codeType,filter)
{
	var dialogsFeatures = "dialogWidth=450px;dialogHeight=370px;help=0;scroll=0;status=0;"
	if(isMultiple==null)
	{
		isMultiple = false;
	}
	if(isReadOnly==null)
	{
		isReadOnly = false;
	}
	var paramArray = new Array();
	paramArray.push(isMultiple);
	paramArray.push(isReadOnly);
	paramArray.push(iniName);
	paramArray.push(iniId);
	paramArray.push(codeType);
	paramArray.push(window);
	paramArray.push(filter);
	return window.showModalDialog("ChoiceCodeList.html",paramArray,dialogsFeatures);
}
//新增CI
function CIAdd(grid)
{
	callbackFn = refresh.callback([grid]);
	var formId="";
	formId=grid.result.FORM_ID;
	if(formId && formId!="")
	{
		doWindow_open("/workshop/form/index.jsp?callback=window.opener.callbackFn()&classId="+grid.result.CLASSID);
	}else{
		var obj=window.showModalDialog("/workshop/form/CIFile/SelectClassId.html?type=CI&classId="+grid.result.CLASSID,"","dialogWidth:400px;dialogHeight:200px;center:no;help:no;resizable:no;status:no");			
		if(obj.sel=="1"){
			doWindow_open("/workshop/form/index.jsp?callback=window.opener.callbackFn()&classId="+obj.classId);
		}
	}
}

//修改CI
function CIModify(grid)
{
	if(!grid || (typeof grid.getSelectionModel != 'function'))
	{
		grid = this;
	}
	callbackFn = refresh.callback([grid]);
	var row = grid.getSelectionModel().getSelected();
	if(row)
		doWindow_open("/workshop/form/index.jsp?callback=window.opener.callbackFn()&classId="+row.get("CLASSID")+"&requestId="+row.get("REQUEST_ID"),undefined,undefined,'_blank');
	else
	{
		MMsg("请选择一项！");
		return;
	}
}


//删除CI
function CIDelete(grid)
{
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{
  		if(QMsg("确认删除所选择记录？")==MSG_YES)
  		{
  			var classId=row.get("CLASSID");
  			var sRequestId=row.get("REQUEST_ID");
  			var delByClassIdUrl="../../../servlet/formDispatch?OperType=15&classId="+classId+"&requestId="+sRequestId

		    xmlhttp.Open("POST",delByClassIdUrl,false);
		    xmlhttp.send();
		    if(isSuccess(xmlhttp))
		    {
		        MMsg("删除成功！");
		        grid.search();
		    } 
  		}
	}else
	{
		MMsg("请选择一项！");
		return;
	}
}


function RelaAdd(grid)
{
	callbackFn = refresh.callback([grid]);
	var classId="";
	var classType="";
	classType=grid.result.CLASS_TYPE;
	classId=grid.result.CLASSID;
	if(classType=="3")
	{
		window.showModalDialog("/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=198&classId="+grid.result.CLASSID,window,"dialogWidth:750px;dialogHeight:500px;center:no;help:no;resizable:no;status:no");
	}else{
		var obj=window.showModalDialog("/workshop/form/CIFile/SelectClassId.html?type=relate&classId="+grid.result.CLASSID,"","dialogWidth:400px;dialogHeight:200px;center:no;help:no;resizable:no;status:no");			
		if(obj.sel=="1"){
			window.showModalDialog("/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=198&classId="+obj.classId,window,"dialogWidth:750px;dialogHeight:500px;center:no;help:no;resizable:no;status:no");
		}
	}
}

function RelaModify(grid)
{
	if(!grid || (typeof grid.getSelectionModel != 'function'))
	{
		grid = this;
	}
	callbackFn = refresh.callback([grid]);
	var row = grid.getSelectionModel().getSelected();
	if(row)
		window.showModalDialog("/workshop/form/index.jsp?formId=198&requestId="+row.get("REQUEST_ID"),"","dialogWidth:750px;dialogHeight:500px;center:no;help:no;resizable:no;status:no");
	else
	{
		MMsg("请选择一项！");
		return;
	}}

function RelaDelete(grid)
{
	if(!grid || (typeof grid.getSelectionModel != 'function'))
	{
		grid = this;
	}
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{
  		if(QMsg("确认删除所选择记录？")==MSG_YES)
  		{
  			var sRequestId=row.get("R_REQUEST_ID");
  			var delByClassIdUrl="../../../servlet/formDispatch?OperType=15&formId=198&requestId="+sRequestId;
  			//alert(delByClassIdUrl)
		    xmlhttp.Open("POST",delByClassIdUrl,false);
		    xmlhttp.send();
		    if(isSuccess(xmlhttp))
		    {
		        MMsg("删除成功！");
		        grid.search();
		    }
  		}
	}else
	{
		MMsg("请选择一项！");
		return;
	}	
}

function CreateSingleRelationByForm(grid)
{
	var instanceId=document.getElementById("oInstanceId").value;
	var classId=document.getElementById("oClassId").value;
	var requestId=document.getElementById("oRequestId").value;
	if(instanceId!=""){
		var obj=window.showModalDialog("/workshop/form/CIFile/SelectClassId.html?type=relate","","dialogWidth:400px;dialogHeight:200px;center:no;help:no;resizable:no;status:no");	
		if(obj.sel=="1"){
			window.showModalDialog("/workshop/form/index.jsp?formId=198&classId="+obj.classId+"&sInstanceId="+instanceId+"&sClassId="+classId+"&sRequestId="+requestId,"","dialogWidth:750px;dialogHeight:500px;center:no;help:no;resizable:no;status:no");
			grid.search();
		}
	}
}

function DelMutiRelationByFrom(grid)
{
	var instanceId=document.getElementById("oInstanceId").value;
	var instanceIds="";
	var row = grid.getSelectionModel().getSelections();
	if(row.length!=0){
		if(QMsg("确认删除所选择记录？")==MSG_YES)
  		{
			for (var i=0;i<row.length;i++)
			{	
				if(i==row.length-1)
					instanceIds=instanceIds+row[i].get("INSTANCEID");
				else instanceIds=instanceIds+row[i].get("INSTANCEID")+",";
			}
			xmlhttp.Open("POST",Url+"tag=7&instanceId="+instanceId+"&instanceIds="+instanceIds,false);
			xmlhttp.send();
			if(isSuccess(xmlhttp))
			{
				MMsg("删除成功!");
				grid.search();
			}
		}
	}else{
		MMsg("请选择一项！");
		return;		
	}
}
function CreateMutiRelationByForm(grid)
{
	var instanceId=document.getElementById("oInstanceId").value;
	var classId=document.getElementById("oClassId").value;
	var requestId=document.getElementById("oRequestId").value;
	if(instanceId!=""){
		window.showModalDialog("/workshop/form/CIFile/CIRelation.html?result=100000001&INSTANCEID="+instanceId+"&CLASSID="+classId+"&DATASET=0&relate=0"+"&REQUESTID="+requestId,"","dialogWidth:650px;dialogHeight:400px;center:no;help:no;resizable:no;status:no");
		grid.search();
	}
}
//创建一对一关系
function CreateSingleRelation(grid)
{
	var row = grid.getSelectionModel().getSelected();
	if(row){
		var obj=window.showModalDialog("/workshop/form/CIFile/SelectClassId.html?type=relate","","dialogWidth:400px;dialogHeight:200px;center:no;help:no;resizable:no;status:no");	
		if(obj.sel=="1"){
			window.showModalDialog("/workshop/form/index.jsp?formId=198&classId="+obj.classId+"&sInstanceId="+row.get("INSTANCEID")+"&sClassId="+row.get("CLASSID"),"","dialogWidth:750px;dialogHeight:500px;center:no;help:no;resizable:no;status:no");
		}
	}
	else
	{
		MMsg("请选择一项！");
		return;
	}
}

//创建一对多关系
function CreateMutiRelation(grid)
{
	var row0 = grid.getSelectionModel().getSelections();
	if(row0.length>1){
		MMsg("创建一对多关系，只能选择一项！");
		return;
	}
	var row = grid.getSelectionModel().getSelected();
	if(row){
		window.showModalDialog("/workshop/form/CIFile/CIRelation.html?INSTANCEID="+row.get("INSTANCEID")+"&CLASSID="+row.get("CLASSID")+"&DATASET=0&REQUESTID="+row.get("REQUEST_ID")+"&relate=0","","dialogWidth:650px;dialogHeight:400px;center:no;help:no;resizable:no;status:no");
	}
	else
	{
		MMsg("请选择一项！");
		return;
	}
}

function CreateMutiToOneRelation(grid)
{
	var instanceIds="";
	var classIds="";
	var datasetIds="";
	var requestIds="";
	var row = grid.getSelectionModel().getSelections();
	if(row.length<1){
		MMsg("请至少选择一项！");
		return;		
	}
	for (var i=0;i<row.length;i++)
	{
		if(i==row.length-1){
			instanceIds=instanceIds+row[i].get("INSTANCEID");
			classIds=classIds+row[i].get("CLASSID");
			requestIds=requestIds+row[i].get("REQUEST_ID");
		}
		else 
		{
			instanceIds=instanceIds+row[i].get("INSTANCEID")+",";
			classIds=classIds+row[i].get("CLASSID")+",";
			requestIds=requestIds+row[i].get("REQUEST_ID")+",";
		}
	}
	window.showModalDialog("/workshop/form/CIFile/CIRelation.html?INSTANCEID="+instanceIds+"&CLASSID="+classIds+"&DATASET="+datasetIds+"&REQUESTID="+requestIds+"&relate=1","","dialogWidth:650px;dialogHeight:400px;center:no;help:no;resizable:no;status:no");
	
}

//查看CI
function CIdetail(grid)
{
	if(!grid || (typeof grid.getSelectionModel != 'function'))
	{
		grid = this;
	}
	var row = grid.getSelectionModel().getSelected();
	doWindow_open("/workshop/form/index.jsp?classId="+row.get("CLASSID")+"&requestId="+row.get("REQUEST_ID"),undefined,undefined,'_blank');
}

function AssetAddByCI(grid)
{
	if(!grid || (typeof grid.getSelectionModel != 'function'))
	{
		grid = this;
	}
	callbackFn = refresh.callback([grid]);
	var row = grid.getSelectionModel().getSelected();
	if(row){
		xmlhttp.Open("POST",Url+"tag=8&instanceId="+row.get("INSTANCEID")+"&vTable=ASSET_BASEINFO",false);
		xmlhttp.send();
		var requestId=xmlhttp.responseText;
		if(requestId==""){
			doWindow_open("/workshop/form/index.jsp?formId=95110199"+"&instanceId="+row.get("INSTANCEID"));	
		}else{
			doWindow_open("/workshop/form/index.jsp?formId=95110199&requestId="+requestId);
		}
	}
	else
	{
		MMsg("请选择一项！");
		return;
	}	
}

function AssetAdd(grid)
{
	callbackFn = refresh.callback([grid]);
	doWindow_open("/workshop/form/index.jsp?callback=window.opener.callbackFn()&formId=95110199");
}

function AssetModify(grid)
{
	if(!grid || (typeof grid.getSelectionModel != 'function'))
	{
		grid = this;
	}
	callbackFn = refresh.callback([grid]);
	var row = grid.getSelectionModel().getSelected();
	if(row)
		doWindow_open("/workshop/form/index.jsp?callback=window.opener.callbackFn()&formId=95110199&requestId="+row.get("REQUEST_ID"));
	else
	{
		MMsg("请选择一项！");
		return;
	}	
}

function AssetDelete(grid)
{
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{
  		if(QMsg("确认删除所选择记录？")==MSG_YES)
  		{
  			var sRequestId=row.get("REQUEST_ID");
  			var delUrl="../../../servlet/formDispatch?OperType=15&formId=95110199&requestId="+sRequestId;
		    xmlhttp.Open("POST",delUrl,false);
		    xmlhttp.send();
		    if(isSuccess(xmlhttp))
		    {
		        MMsg("删除成功！");
		        grid.search();
		    } 
  		}
	}else
	{
		MMsg("请选择一项！");
		return;
	}	
}
function search(grid, btn)
{
	grid.showParamWin(btn.el)
}

function refresh(grid)
{
	grid.search();
}

function selectCI()
{	
	var obj=window.showModalDialog("/workshop/form/CIFile/CISelect.html?","","dialogWidth:650px;dialogHeight:400px;center:no;help:no;resizable:no;status:no");
	return obj;
}


function selectSystem(objName,objClassId){
	var obj=selectCI();
	if(obj.sel=="1"){
		objName.value=obj.elementName;
		objClassId.value=obj.classId;
		objClassId.setReturnText();
	}
}

function relateToNetElement(grid)
{
	var neId="";
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{
		neId=row.get("RELATE_NE_ID");
		if(neId!=""){
			doWindow_open("/workshop/config/netElementList.html?id="+neId+"&tag=2",undefined,undefined,'_blank');			
		}else{
			MMsg("没有关联网元！");
			return;				
		}
	}else
	{
		MMsg("请选择一项！");
		return;		
	}
}

function relateToAsset(grid)
{
	var instanceId="";
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{
		instanceId=row.get("INSTANCEID");	
		xmlhttp.Open("POST",Url+"tag=8&instanceId="+instanceId+"&vTable=ASSET_BASEINFO",false);
		xmlhttp.send();
		var requestId=xmlhttp.responseText;
		if(requestId!="")
		{
			doWindow_open("/workshop/form/index.jsp?callback=window.opener.callbackFn()&formId=95110199&requestId="+requestId);
		}else{
			MMsg("没有录入对应资产信息！");
			return;				
		}
	}else
	{
		MMsg("请选择一项！");
		return;	
	}
}

function RelateToCI(grid)
{
	var classId="";
	var CIRequestId="";
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{
		classId=row.get("CLASSID");	
		CIRequestId=row.get("CI_REQUEST_ID");
		doWindow_open("/workshop/form/index.jsp?classId="+classId+"&requestId="+CIRequestId,undefined,undefined,'_blank');
	}else
	{
		MMsg("请选择一项！");
		return;	
	}
}

function RepRecordList(grid)
{	
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{
		window.showModalDialog("/workshop/query/show_result.html?result=100000110&ASSET_INFO_ID="+row.get("ASSET_INFO_ID"),"","dialogWidth:800px;dialogHeight:400px;center:no;help:no;resizable:no;status:no");	
	}else
	{
		MMsg("请选择一项！");
		return;
	}
}

function AddRepRecord(grid)
{
	callbackFn = refresh.callback([grid]);
	var assetInfoId=Global.url.ASSET_INFO_ID;
	window.showModalDialog("/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=203&assetInfoId="+assetInfoId,window,"dialogWidth:800px;dialogHeight:600px;center:no;help:no;resizable:no;status:no");	
}

function ModRepRecord(grid)
{	
	callbackFn = refresh.callback([grid]);
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{
		window.showModalDialog("/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=203&requestId="+row.get("REQUEST_ID"),window,"dialogWidth:800px;dialogHeight:600px;center:no;help:no;resizable:no;status:no");	
	}
	else
	{
		MMsg("请选择一项！");
		return;
	}
	
}

function DelRepRecord(grid)
{
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{
  		if(QMsg("确认删除所选择记录？")==MSG_YES)
  		{
  			var sRequestId=row.get("REQUEST_ID");
  			var delUrl="../../../servlet/formDispatch?OperType=15&formId=203&requestId="+sRequestId;
		    xmlhttp.Open("POST",delUrl,false);
		    xmlhttp.send();
		    if(isSuccess(xmlhttp))
		    {
		        MMsg("删除成功！");
		        grid.search();
		    } 
  		}
	}else
	{
		MMsg("请选择一项！");
		return;
	}		
}


function workInfoList(grid)
{
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{
		window.showModalDialog("/workshop/query/show_result.html?result=100000111&ASSET_INFO_ID="+row.get("ASSET_INFO_ID"),"","dialogWidth:800px;dialogHeight:400px;center:no;help:no;resizable:no;status:no");	
	}else
	{
		MMsg("请选择一项！");
		return;
	}
}

function workInfoAdd(grid){
	callbackFn = refresh.callback([grid]);
	var assetInfoId=Global.url.ASSET_INFO_ID;
	window.showModalDialog("/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=204&assetInfoId="+assetInfoId,window,"dialogWidth:800px;dialogHeight:500px;center:no;help:no;resizable:no;status:no");	
}

function workInfoModify(grid){
	callbackFn = refresh.callback([grid]);
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{
		window.showModalDialog("/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId=204&requestId="+row.get("REQUEST_ID"),window,"dialogWidth:800px;dialogHeight:500px;center:no;help:no;resizable:no;status:no");	
	}
	else
	{
		MMsg("请选择一项！");
		return;
	}
}

function workInfoDelete(grid){
	var row = grid.getSelectionModel().getSelected();
	if(row)
	{
  		if(QMsg("确认删除所选择记录？")==MSG_YES)
  		{
  			var sRequestId=row.get("REQUEST_ID");
  			var delUrl="../../../servlet/formDispatch?OperType=15&formId=204&requestId="+sRequestId;
		    xmlhttp.Open("POST",delUrl,false);
		    xmlhttp.send();
		    if(isSuccess(xmlhttp))
		    {
		        MMsg("删除成功！");
		        grid.search();
		    } 
  		}
	}else
	{
		MMsg("请选择一项！");
		return;
	}	
}
function isSameNameExit(inName,tableName,colName,keyColumn,keyValue,oper)
{
	xmlhttp.Open("POST",Url+"tag=9&tableName="+tableName+"&colName="+colName+"&inName="+encodeURIComponent(inName)+"&keyColumn="+keyColumn+"&keyValue="+keyValue+"&oper="+oper,false);
	xmlhttp.send();
	var b=xmlhttp.responseText;
	if(b=="true"){
		MMsg("已存在同名的记录，请重新命名！");
		return true;
	}
	else {
		return false;
	}
}

function checkSameName(thisForm)
{
	var inName=document.getElementById("oCIName").value;
	if(inName=="")
	{
		MMsg("请选择一项！");
		return false;
	}
	if(thisForm.getFormBahavior()=="C"){
		if(isSameNameExit(inName,"CIM_BASEELEMENT","ELEMENTNAME","","","C"))
			return false;
		else
			return true;
		
	}else{
		var instanceId=document.getElementById("oInstanceId").value;
		if(isSameNameExit(inName,"CIM_BASEELEMENT","ELEMENTNAME","INSTANCEID",instanceId,"M"))
			return false;
		else 
			return true;
	}
}



function ConfigComplay(oElement)
{
	var ret=window.showModalDialog("/workshop/companyequip/company.jsp?type=1","","dialogWidth:800px;dialogHeight:600px;center:no;help:no;resizable:no;status:no");	
	if(ret=="ok"){
		oElement.reInit();
	}
}

function ConfigContract()
{
	var ret=window.showModalDialog("/workshop/config/contract.jsp","","dialogWidth:800px;dialogHeight:600px;center:no;help:no;resizable:no;status:no");		
	if(ret=="ok"){
		oElement.reInit();
	}
}

function ciGrant(grid)
{
	var sm = grid.getSelectionModel();
	var row = sm.getSelected();
	if (configTreePri('CIM_BASEELEMENT', row.get("INSTANCEID")))
	{
		grid.search();
	}
}
