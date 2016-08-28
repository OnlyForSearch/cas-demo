var mainRequestId;
var oTable
var mainOTable;
var tableName;
var mainTableName; 
var mainFlowId;
var isAttach;
var myFormField;
var fieldType;
var model;

var mainTacheMod;//add:g.huangxm time 

function getTachModId(){
	return mainTacheMod;
}


function getRqid(){
	return mainRequestId;
}

function getMtableName(){
	return mainTableName;
}
function getMainFlowId(){
	return mainFlowId;
}
function getFieldType(){
	return fieldType;
}
function getIsAttach(){
	if(isAttach=='0BT'){
		return 0;
	}else{
		return 1;
	}
}

function doFlowSearch(){
	myFormField.gridMain.search();
}

function doFormFieldTurn(){
	var myFieldTurn = new formFieldTurn(formContext);
	myFieldTurn.fieldTurn();
}

function showForm(grid){
	var row = grid.getSelectionModel()
			.getSelected();
	if(typeof(row)=='undefined'){
		return;
	}
	var	flow_id = row.get("FLOW_ID");
	var flowMod = row.get("FLOW_MOD");
	var url;
	if(typeof(flow_id)=='undefined'){
		MMsg('��ȡ����ID����!');
		return;
	}
	if(typeof(flowMod)=='undefined'){
		flowMod = "";
	}
	url = "/workshop/form/index.jsp?fullscreen=yes&flowId="+flow_id+"&flowMod="+flowMod;
	doWindow_open(url);
}
 

var formFieldTurn =  function(oForm){
	var myForm = oForm;	
	var turn;
	var gridMain = null;
	var gridSub = null;
	var isClose = null;
	var url = "/servlet/FormTurnServlet?"
	this.getMainRequestId=function(){return mainRequestId};
	this.getMainTableName=function(){return mainTableName};
	this.getTableName=function(){return tableName};
	this.fieldTurn=function(formField){
		myFormField = formField;
		mainTacheMod = myForm.request("mainTacheMod");
		mainRequestId = myForm.request("mainRequestId");
		fieldType= myForm.request("fieldType");
		turn = myForm.request("turn");
		isClose = myForm.request("isClose");
		manyTable = myForm.request("manyTable");
		manyEleIndex = myForm.request("manyEleIndex");
		model = myForm.request("model");		
		if(mainRequestId!=""&&turn!=""){
		   
		   oTable=oForm.TABLE;
		   if(model&&model=='showmodal'){
		       mainOTable = parent.window.dialogArguments.parent.oFormContext.TABLE;
			   mainFlowId = parent.window.dialogArguments.parent.oFormContext.FLOW.FLOW_ID; 
		   }else{
		       mainOTable = parent.opener.parent.oFormContext.TABLE;
			   mainFlowId = parent.opener.parent.oFormContext.FLOW.FLOW_ID; 
           }
		   var tableNameMany = "";
		   var mainTableNameMany = "";
		   
		   for(var c in oTable){
		       tableName=c;
		       tableNameMany = tableNameMany + tableName + ",";
		   }
		   for(var c in mainOTable){
		   	   mainTableName=c;
		   	   mainTableNameMany = mainTableNameMany + mainTableName + ",";
		   }
		   var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		   xmlhttp.open("POST",url+"tag=1&turn="+turn+"&tableNameMain="+mainTableNameMany+"&tableNameSub="+tableNameMany+"&mRequestId="+mainRequestId,false);
		   xmlhttp.send();
		   if(isSuccess(xmlhttp))
		   {
		       
		       var dXML = new ActiveXObject("Microsoft.XMLDOM");
		       dXML.load(xmlhttp.responseXML);
		       var oRows = dXML.selectNodes("/root/TABLE/rowSet");
			   for(var i=0;i<oRows.length;i++){
			   		var fieldNameMain = oRows[i].selectSingleNode("FIELD_NAME_MAIN").text;
			   		var fieldNameSub = oRows[i].selectSingleNode("FIELD_NAME_SUB").text;
			   		var tableNameMain = oRows[i].selectSingleNode("TABLE_NAME_MAIN").text;
			   		var tableNameSub = oRows[i].selectSingleNode("TABLE_NAME_SUB").text;
			   		var fileTypeMain = oRows[i].selectSingleNode("FIELD_TYPE_MAIN").text;
			   		var fileTypeSub = oRows[i].selectSingleNode("FIELD_TYPE_SUB").text;
			   		var elementNameMain = oRows[i].selectSingleNode("ELEMENT_NAME_MAIN").text;
			   		var elementNameSub =  oRows[i].selectSingleNode("ELEMENT_NAME_SUB").text;
			   		isAttach = oRows[i].selectSingleNode("ISATTACH").text;
					var sValue="";
					if(fileTypeMain.indexOf("ATTACH")>-1&&fileTypeSub.indexOf("ATTACH")>-1){
						var attachs = oRows[i].selectNodes("ATTACH/rowSet");
						for(var j=0;j<attachs.length;j++){
							var subObj = oForm.getWin().form.document.getElementById(elementNameSub);
							subObj.loadByXML(attachs[j]);
						}
					}else{
						if(manyTable==tableNameMain&&manyEleIndex!=""){
							//sValue = oForm.getWin().form.document.getElementById(elementName+"_"+manyEleIndex).value;
							var ele;
							if(model&&model=='showmodal'){
							   ele= parent.window.dialogArguments.parent.frames["fraForm"].document.getElementById(elementNameMain+"_"+manyEleIndex);
							}else{
							   ele= parent.opener.parent.frames["fraForm"].document.getElementById(elementNameMain+"_"+manyEleIndex);
							}
						
							if(ele){
						
							   sValue=ele.value;
							   oTable[tableNameSub][fieldNameSub].SET_VALUE(sValue);  
							}
						}else{						
							if(mainOTable[tableNameMain][fieldNameMain]){								
								sValue= mainOTable[tableNameMain][fieldNameMain].VALUE(); 
								if(oTable[tableNameSub][fieldNameSub].ELEMENT_TYPE=='20'){								
									oForm.getWin().form.KE.html(fieldNameSub,sValue);
								}else{
								oTable[tableNameSub][fieldNameSub].SET_VALUE(sValue);
								}
								
						    }		   		  
				     	}			     		  
			        }
		     }
		   }
		   
		  if(fieldType=="turn"){
		      if(model&&model=='showmodal'){
		      }else{
		   		parent.opener.parent.window.close();
		   	 }
		  }
		}
	}
	
	this.getValueCfgId = function(tableName,type){
		   var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		   xmlhttp.open("POST",url+"tag=4&tableName="+tableName+"&type="+type,false);
		   xmlhttp.send();
		   if(isSuccess(xmlhttp))
		   {
		       var dXML = new ActiveXObject("Microsoft.XMLDOM");
		       dXML.load(xmlhttp.responseXML);
		       var get_value_cfg_id = dXML.selectSingleNode("/root/TABLE/rowSet/GET_VALUE_CFG_ID").text;
		   	   return get_value_cfg_id;
		   }
	}
	
	this.flowSplitSearch = function(oFm,reqId,relationPage,eldiv,turnType){
		if(oFm.FLOW.TCH_ID!=0){
			var e = document.body;
			var oTable=oFm.TABLE;
			for(var c in oTable){
		       tableName=c;
		    }
		    var get_value_cfg_id;
		    relationPage.style.display="";
			if(this.gridMain==null&&turnType!=1){
				get_value_cfg_id = this.getValueCfgId(tableName,'main');
				this.gridMain = new Ext.data.ResultGrid({
						result : get_value_cfg_id,
						resultParam : {
							REQUEST_ID : reqId
						},
						isAddParamTbar : false,// �Ƿ���ʾ��ѯ������
						// style : "padding:5 5 5 5",
						iconCls : 'icon-grid',
						width : e.clientWidth-150,
						//height : e.clientHeight/2.5,
						autoHeight : true,
						renderTo :eldiv
					});
				
				this.gridMain.search();
				
			}
			if(this.gridSub==null&&turnType==1){
				get_value_cfg_id = this.getValueCfgId(tableName,'sub');
				this.gridSub = new Ext.data.ResultGrid({
						result : get_value_cfg_id,
						resultParam : {
							REQUEST_ID : reqId
						},
						isAddParamTbar : false,// �Ƿ���ʾ��ѯ������
						// style : "padding:5 5 5 5",
						iconCls : 'icon-grid',
						width : e.clientWidth-150,
						//height : e.clientHeight/2.5,
						autoHeight : true,
						renderTo :eldiv
					});	
				this.gridSub.search();	
			    //this.gridSub.destroy();	
			}	
		}
	}
	
	this.loadGrid = function(oFm,reqId,relationPage,eldiv,get_value_cfg_id){
		 var e = document.body;
		 Ext.QuickTips.init();
		 this.gridSub = new Ext.data.ResultGrid({
				result : get_value_cfg_id,
				isAddParamTbar : false,// �Ƿ���ʾ��ѯ������
				resultParam:{M_REQUEST_ID:reqId,M_FLOW_ID:oFm.FLOW.FLOW_ID},
				// style : "padding:5 5 5 5",
				iconCls : 'icon-grid',
				width : e.clientWidth-100,
				style:'margin:10,0,10,10',
				//height : e.clientHeight/2.5,
				autoHeight : true,
				renderTo :eldiv
			});	
	    if(this.gridSub.tbarFuncMenu){
	     this.gridSub.tbarFuncMenu.executeRule([this.gridSub.getTopToolbar()]); 
	    }
		this.gridSub.search({REQUEST_ID:reqId,FLOW_ID:oFm.FLOW.FLOW_ID});
	}
	
}


function dateDisabledImgDisabled(){
	
	var imgList=document.getElementsByName("imgDateDisable77");
	for(var g=0;g<imgList.length;g++){
		var inputId=imgList[g].getAttribute("inputDateId");
		var dateText=document.getElementById(inputId);
	    if(dateText){
		       if(dateText.getAttribute("disabled")){
		    	  // dateText.className="imgDisable";
		    	   imgList[g].disabled=true;
		    	   imgList[g].className="imgDisable";
			    }
		 }
	}
	textReadonlyImgDisable();
}

function textReadonlyImgDisable(){

	var imgRedList=document.getElementsByName("imgTextReadonly88");
	for(var ir=0;ir<imgRedList.length;ir++){
	   var textId=imgRedList[ir].getAttribute("inputTextId");
	   var txtComd=document.getElementById(textId);
	   if(txtComd){
	      if(txtComd.getAttribute("readonly")){
	    	 //txtComd.className="imgDisable";
	    	 imgRedList[ir].disabled=true;
	    	 imgRedList[ir].className="imgDisable";
		   }
		}
	}

}


//���ı���Disabled�������ñ���������
function textDisabledlabelNoLink(){
	var objs_label = document.getElementsByTagName("label");	
	for(var i=0;i<objs_label.length;i++){	
		if(objs_label[i].name == "labelLink99" && document.getElementById(objs_label[i].getAttribute("htmlFor")).disabled){		    			
			setlabelNoLink(objs_label[i].id);	
		}
	}	
}

//���ñ���������
function setlabelNoLink(obj){
    if (obj != "" && typeof(obj) == 'string') {
		var id = obj;
		obj = document.getElementById(id);
	}
	obj.onclick = function(){}
	obj.className = "labelNoLink";
	obj.onmouseover = function(){obj.classname = "labelNoLink";}
	obj.onmouseout = function(){obj.classname = "labelNoLink";}
}

function formDisabled(sRequestId,sFormId){
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	if(QMsg("ȷ��ɾ����")==MSG_YES){	   
	    xmlhttp.open("POST","../../../servlet/formDispatch?OperType=15&formId="+sFormId+"&requestId="+sRequestId,false);
	    xmlhttp.send("");
	    if(isSuccess(xmlhttp)){
	        MMsg("ɾ���ɹ���");
	        return true;
	    }else{
			MMsg("ɾ��ʧ�ܣ�");
		}
	}
}

