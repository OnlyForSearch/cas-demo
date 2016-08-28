var relationobj={};
var selectStoreDates = {};//用于保存选择页面返回的已选CI的store;
var delstr="";

//选择CI，传入参数：当前对象标识，当前对象名称,目标分类标识,目标数据集,目标CI状态,是否多选(true为多选),是否组装带链接,是否是源CI,显示提示
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

/*为单选的关系框赋初值，isSource：被选的是否是源(字符串的true、false)*/
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


//选择CI，通过一个CI查找另一个CI，传入参数：当前对象标识，当前对象名称,目标分类标识，是否多选(true为多选)
/*
 * 参数样式：
leftCfg  = {
	idObj   : document.getElementById(""),
	nameObj : document.getElementById(""),
	DEST_CLASS_ID : value,
	DATASET_IDS,value,
	[STATUS  : getParamObj("INTEGER",value),]
	[sqlid	: 算定义查询的SQL_ID,默认为100002097,]
	isMultiple,
	isSource
}
rightCfg = {
	idObj   : document.getElementById(""),
	nameObj : document.getElementById(""),
	DEST_CLASS_ID : value,
	DATASET_IDS,value,
	[STATUS  : getParamObj("INTEGER",value),]
	[sqlid	: 算定义查询的SQL_ID，默认为100002098,]
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

//赋值界面
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
		href = (isNameUrl=="true"?("<a href=\"#\" onClick=\"getConfigItem("+ obj.CLASS_ID + ","+ obj.DATASET_ID + ",'"+ obj.REQUEST_ID +"')\" title=\"点击打开 "+ obj.SHORT_DESCRIPTION +" 详细信息\"><font color=\"#0000FF\">"+obj.SHORT_DESCRIPTION  +"</font></a>"):obj.SHORT_DESCRIPTION);
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


//选择CI并保存关系，传入参数：当前对象标识，当前对象名称,目标分类标识,目标数据集,目标CI状态,是否多选(true为多选),是否组装带链接,,当前CI是否是源CI,显示提示
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

//创建CI关联
function createCiRela(grid,rowArray){
	var config = grid.config;
	if(!config.isNotCreateRela){//是否不创建关系(其他默认都创建关系，true表示不创建，目前监控的业务系统模块不与其他业务系统建立关系)
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
	     	 var tmstr=iwin.getCurrentRelation();//在iframe的这个方法中得到的，已经去掉了最后一个字符“|”，这里再补上
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
	    var newRela=relationobj[c];//格式：目标ID：数据集：关系名：动态SQL|……
	    var oldRela=initRelDoms[c];//格式: 关系ID：目标ID|……
	    if (oldRela) {
			var newRelas = newRela.split('|');
			var oldRelas = oldRela.split('|');
			//去掉重复选的那部分
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
			//得到需要删除的那部分
			for (var i = 0; i < oldRelas.length; i++) {
				delstr += (oldRelas[i].split(":"))[0] + '|'
			}
			relastr += newRelas.join('|');
		} else {
			relastr += newRela
		}
	}
	if(typeof(saveIP)!='undefined'){// 主机的IP列表
	   relastr+=saveIP();
	}
	relastr+=getchCurrentRelation();
	relastr=relastr.substring(0,relastr.length-1);
   return  relastr||"";
}
function getDelstrRelation(){
	return delstr||"";
}
