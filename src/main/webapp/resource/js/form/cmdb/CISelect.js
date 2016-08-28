var relationobj={};
var selectStoreDates = {};//���ڱ���ѡ��ҳ�淵�ص���ѡCI��store;
var delstr="";

//ѡ��CI�������������ǰ�����ʶ����ǰ��������,Ŀ������ʶ,Ŀ�����ݼ�,Ŀ��CI״̬,�Ƿ��ѡ(trueΪ��ѡ),�Ƿ���װ������,�Ƿ���ԴCI,��ʾ��ʾ
function ciSelect(config) {
	config.destStatus = config.destStatus || "13"; 
	config.isMultiple = config.isMultiple || "false"; 
	var param = getSelectParam(config.result, $("INSTANCE_ID").value, config.destDataSetIds,
							   config.destClassId, config.parentciInstanceId, config.destStatus, config.title, config.isMultiple);
	param.selectStoreDate = selectStoreDates[config.objName];								   
	var objArray = window.showModalDialog("/workshop/form/CIFile/cmdb/CISelect.html",param,"resizable=yes;dialogWidth=900px;dialogHeight=520px;help=0;scroll=0;status=0;");
	if(objArray){
		if(objArray.result == 1){
			selectStoreDates[config.objName] = objArray.selectStoreDate;
			setElementValue(objArray.rightArray,config.objId,config.objName,config.isMultiple,config.isSource,config.addDataSetId);
		}
	}
}

function getSelectParam(result,instanceId,datasetIds,destClassId,parentCiInstanceId,status,title,isMultiple){
	var param = new Object();
	param.result = result;
	param.INSTANCE_ID = instanceId;
	param.SOURCE_CLASS_ID = getThisCiClassId();
	param.isMultiple = isMultiple;
	param.PARENTCI_INSTANCE_ID = parentCiInstanceId;
	param.title = title;
	param.RELANAME = 'null';
	if(datasetIds){
		param.DATASET_IDS = getParamObj("INTEGER",datasetIds);
	}
	if(status){
		param.STATUS = getParamObj("INTEGER",status)
	}
	if(destClassId){
		param.DEST_CLASS_ID = getParamObj("INTEGER",destClassId)
	}
	return param;
}

/*Ϊ��ѡ�Ĺ�ϵ�򸳳�ֵ��isSource����ѡ���Ƿ���Դ(�ַ�����true��false)*/
function setRealtionDefault(objId,objName,instanceId,classId,dataSetId,requestId,shortDescription,isSource){
	var rowArray=new Array();
	var selectStoreDate= new Array();
	var row = {INSTANCE_ID:instanceId,CLASS_ID:classId,DATASET_ID:dataSetId,REQUEST_ID:requestId,SHORT_DESCRIPTION:shortDescription};
	rowArray.push(row);
	selectStoreDate.push({INSTANCE_ID:instanceId,SHORT_DESCRIPTION:shortDescription,rightRow:row});
	if(rowArray.length>0){
		selectStoreDates[objName]= selectStoreDate;
		setElementValue(rowArray,objId,objName,null,isSource,DATASET_ID.value);
	}
}


//ѡ��CI��ͨ��һ��CI������һ��CI�������������ǰ�����ʶ����ǰ��������,Ŀ������ʶ���Ƿ��ѡ(trueΪ��ѡ)
/*
 * ������ʽ��
leftCfg  = {
	idObj   : document.getElementById(""),
	nameObj : document.getElementById(""),
	DEST_CLASS_ID : value,
	DATASET_IDS,value,
	[STATUS  : getParamObj("INTEGER",value),]
	[sqlid	: �㶨���ѯ��SQL_ID,Ĭ��Ϊ100002097,]
	isMultiple,
	isSource
}
rightCfg = {
	idObj   : document.getElementById(""),
	nameObj : document.getElementById(""),
	DEST_CLASS_ID : value,
	DATASET_IDS,value,
	[STATUS  : getParamObj("INTEGER",value),]
	[sqlid	: �㶨���ѯ��SQL_ID��Ĭ��Ϊ100002098,]
	isMultiple,
	isSource
}
*/
function ciCascadeSelect(leftCfg,rightCfg,title,height,width)
{
	width = width || "1000px";
	height = height || "520px";
	var param = getCascadeSelectParam(leftCfg,rightCfg,title);
	param.selectStoreDate = selectStoreDates[rightCfg.nameObj];
	var objArray = window.showModalDialog("/workshop/form/CIFile/cmdb/CICascadeSelect.html",param,"resizable=yes;dialogWidth="+width+";dialogHeight="+height+";help=0;scroll=0;status=0;");
	if(objArray){
		if(objArray.result == 1){
			selectStoreDates[rightCfg.nameObj] = objArray.selectStoreDate;
			setElementValue(objArray.leftArray,leftCfg.idObj,leftCfg.nameObj,leftCfg.isMultiple,leftCfg.isSource,DATASET_ID.value);
			setElementValue(objArray.rightArray,rightCfg.idObj,rightCfg.nameObj,rightCfg.isMultiple,rightCfg.isSource,DATASET_ID.value);
		}
	}
}
function getCascadeSelectParam(leftCfg,rightCfg,title){
	var param = new Object();
	
	leftCfg.sqlid = leftCfg.sqlid || 100002097;
	leftCfg.DATASET_IDS = getParamObj("INTEGER",leftCfg.DATASET_IDS || assetDestDataSetIds);
	leftCfg.STATUS = getParamObj("INTEGER",leftCfg.STATUS)
	leftCfg.DEST_CLASS_ID = getParamObj("INTEGER",leftCfg.DEST_CLASS_ID)
	
	rightCfg.sqlid = rightCfg.sqlid || 100002098;
	rightCfg.RELANAME = rightCfg.RELANAME || 'null';
	rightCfg.DATASET_IDS = getParamObj("INTEGER",rightCfg.DATASET_IDS || assetDestDataSetIds);
	rightCfg.STATUS = getParamObj("INTEGER",rightCfg.STATUS)
	rightCfg.DEST_CLASS_ID = getParamObj("INTEGER",rightCfg.DEST_CLASS_ID)
	
	leftCfg.INSTANCE_ID = rightCfg.INSTANCE_ID = INSTANCE_ID.value;
	leftCfg.SOURCE_CLASS_ID = rightCfg.SOURCE_CLASS_ID = getThisCiClassId();
	
	param.left = leftCfg;
	param.right = rightCfg;
	param.isMultiple = rightCfg.isMultiple;
	param.title = title||'';

	return param;
}

//��ֵ����
function setElementValue(rowArray,objId,objName,isMultiple,isSource,dataSetId){
	if(!objId || !objName) return;
	if(typeof(objId)=="string") objId = $(objId);
	if(typeof(objName)=="string") objName = $(objName);
	var ids = "";
	var names = "";
	var relastr= "";
	var href = "";
	var isNameUrl = objName.getAttribute("isNameUrl");
	for(var p=0;p<rowArray.length;p++){
		var obj = rowArray[p];
		href = (isNameUrl=="true"?("<a href=\"#\" onClick=\"getConfigItem("+ obj.CLASS_ID + ","+ obj.DATASET_ID + ",'"+ obj.REQUEST_ID +"')\" title=\"����� "+ obj.SHORT_DESCRIPTION +" ��ϸ��Ϣ\"><font color=\"#0000FF\">"+obj.SHORT_DESCRIPTION  +"</font></a>"):obj.SHORT_DESCRIPTION);
		ids += (obj.INSTANCE_ID + ",");
		names += (href + ",");
		
		var cpt=objName.getAttribute("relaName");
		if(cpt){
			relastr += (isSource=="true" ? (obj.INSTANCE_ID+':'+INSTANCE_ID.value) : (INSTANCE_ID.value+':'+obj.INSTANCE_ID));
			relastr += ':' + dataSetId + ':' + cpt + ':null|';
		}
	}
	
	relationobj[objName.id] = relastr;
	if(ids.length > 0) ids = ids.substring(0,ids.length-1)
	if(names.length > 0) names = names.substring(0,names.length-1)
	objId.value = ids;
	objName.innerHTML = names;
}


//ѡ��CI�������ϵ�������������ǰ�����ʶ����ǰ��������,Ŀ������ʶ,Ŀ�����ݼ�,Ŀ��CI״̬,�Ƿ��ѡ(trueΪ��ѡ),�Ƿ���װ������,,��ǰCI�Ƿ���ԴCI,��ʾ��ʾ
function ciSelectRela(grid) {
	var config = grid.config;
	var param = getSelectParam(config.selectResult, config.instanceId, config.destDataSetIds,
							   config.destClassId, config.parentciInstanceId, config.destStatus, grid.title, config.isMultiple);
	var objArray = window.showModalDialog("CISelect.html",param,"resizable=yes;dialogWidth=900px;dialogHeight=520px;help=0;scroll=0;status=0;");
	if(objArray){
		if(objArray.result == 1){
			createCiRela(grid,objArray.rightArray);
		}
	}
}

function ciCascadeSelectRela(p_grid,grid,title,height,width)
{
	var p_config = p_grid.config;
	var leftCfg = {
			INSTANCE_ID:	p_config.instanceId,
			DATASET_IDS:	p_config.destDataSetIds,
			DEST_CLASS_ID:	p_config.destClassId,
			STATUS:			p_config.destStatus,
			isSource:		p_config.isSource,
			isMultiple:		p_config.isMultiple
			};
	var config = grid.config;
	var rightCfg = {
			INSTANCE_ID:	config.instanceId,
			DATASET_IDS:	config.destDataSetIds,
			DEST_CLASS_ID:	config.destClassId,
			STATUS:			config.destStatus,
			isSource:		config.isSource,
			isMultiple:		config.isMultiple
			};
	width = width || "1000px";
	height = height || "520px";
	var param = getCascadeSelectParam(leftCfg,rightCfg,grid.title);
	var objArray = window.showModalDialog("CICascadeSelect.html",param,"resizable=yes;dialogWidth="+width+";dialogHeight="+height+";help=0;scroll=0;status=0;");
	if(objArray){
		if(objArray.result == 1){
			createCiRela(p_grid,objArray.leftArray);
			createCiRela(grid,objArray.rightArray);
		}
	}
}

//����CI����
function createCiRela(grid,rowArray){
	var config = grid.config;
	if(!config.isNotCreateRela){//�Ƿ񲻴�����ϵ(����Ĭ�϶�������ϵ��true��ʾ��������Ŀǰ��ص�ҵ��ϵͳģ�鲻������ҵ��ϵͳ������ϵ)
		var paramArray = new Array();
		paramArray.push("relaName="+config.relaName||"");
		paramArray.push("dataSetId="+config.dataSetId);
		paramArray.push("isUpdateSystemName="+(config.isUpdateSystemName || 'true'));
		
		var ids = "";
		for(var p=0;p<rowArray.length;p++){
			ids = ids+ rowArray[p].INSTANCE_ID + "," ;
		}
		if(ids.length > 0) {
			ids = ids.substring(0,ids.length-1);
		}
		if(config.isSource=="true"){
			paramArray.push("sourceInstanceIds="+config.instanceId);
			paramArray.push("destInstanceIds="+ids);
		}else{
			paramArray.push("sourceInstanceIds="+ids);
			paramArray.push("destInstanceIds="+config.instanceId);
		}
		var sendUrl=Url+"tag=18&"+paramArray.join("&");
	    xmlhttp.Open("POST",sendUrl,false);
	    xmlhttp.send();
	    if(isSuccess(xmlhttp)){
	        grid.search();
	    }
    }
}



function getchCurrentRelation(){
	 var iframary=document.getElementsByTagName("iframe");
	  var objs=[];
	  var str="";
	  for(var o=0;o<iframary.length;o++){
	     var iwin=(iframary[o]).contentWindow;
	     if(iwin.getCurrentRelation){
	     	 var tmstr=iwin.getCurrentRelation();//��iframe����������еõ��ģ��Ѿ�ȥ�������һ���ַ���|���������ٲ���
	     	 if(tmstr.length>0)
	     	 	tmstr += "|";
	     	 str+=tmstr;
	     }
	     if(iwin.getDelstrRelation){
	     	 var tmstr=iwin.getDelstrRelation();
	     	 delstr+=tmstr;
	     }
	     
	  }
	  return str;
}

function getCurrentRelation(){
	var relastr="";
	delstr="";
	for(var c in relationobj)
	{
	    var newRela=relationobj[c];//��ʽ��Ŀ��ID�����ݼ�����ϵ������̬SQL|����
	    var oldRela=initRelDoms[c];//��ʽ: ��ϵID��Ŀ��ID|����
	    if (oldRela) {
			var newRelas = newRela.split('|');
			var oldRelas = oldRela.split('|');
			//ȥ���ظ�ѡ���ǲ���
			for (var i = newRelas.length-1; i >=0; i--) {
				var newInstanceId = (newRelas[i].split(":"))[0];
				for (var j = oldRelas.length-1; j >=0; j--) {
					if (oldRelas[j] && oldRelas[j] != '') {
						var oldInstanceId = (oldRelas[j].split(":"))[1];
						if (newInstanceId == oldInstanceId) {
							newRelas.splice(i,1);
							oldRelas.splice(j,1);;
						}
					}
				}
			}
			//�õ���Ҫɾ�����ǲ���
			for (var i = 0; i < oldRelas.length; i++) {
				delstr += (oldRelas[i].split(":"))[0] + '|'
			}
			relastr += newRelas.join('|');
		} else {
			relastr += newRela
		}
	}
	if(typeof(saveIP)!='undefined'){// ������IP�б�
	   relastr+=saveIP();
	}
	relastr+=getchCurrentRelation();
	relastr=relastr.substring(0,relastr.length-1);
   return  relastr||"";
}
function getDelstrRelation(){
	return delstr||"";
}
