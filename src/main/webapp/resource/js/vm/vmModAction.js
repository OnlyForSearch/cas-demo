var selfName = "vmModAction.js";
var selectStoreDates = {};//���ڱ���ѡ��ҳ�淵�ص���ѡCI��store;
var moveActionPage = getRealPath("../../../workshop/form/CIFile/cmdb/CIMonitorVMMove.html?", selfName);
var copyActionPage = getRealPath("../../../workshop/form/CIFile/cmdb/CIMonitorVMCopy.html?", selfName);
var snapMagePage = getRealPath("../../../workshop/form/CIFile/cmdb/CIMonitorVMSnap.html?", selfName);
var storeMagePage = getRealPath("../../../workshop/form/CIFile/cmdb/CIMonitorVMStore.html?", selfName);
var networkMagePage = getRealPath("../../../workshop/form/CIFile/cmdb/CIMonitorVMNetwork.html?", selfName);
var netPortgroupPage = getRealPath("../../../workshop/form/CIFile/cmdb/CIMonitorVMNetCard.html?", selfName);
var vmhostcontrolpage = getRealPath("../../../workshop/form/CIFile/cmdb/CIMonitorVMHostControl.html?",selfName);
var vmcontrolpage = getRealPath("../../../workshop/form/CIFile/cmdb/CIMonitorVMControl.html?", selfName);
var vmcreatepage = getRealPath("../../../workshop/form/CIFile/cmdb/CIMonitorVMCreate.html?", selfName);
var vmmodifypage = getRealPath("../../../workshop/form/CIFile/cmdb/CIMonitorVMMoidfy.html?", selfName);
var vmcreatebymodulepage = getRealPath("../../../workshop/form/CIFile/cmdb/CIMonitorVMCreateByModule.html?", selfName);
var vmconsole = getRealPath("../../../workshop/form/CIFile/cmdb/CIMonitorVMConsole.html?", selfName);
var reconfigClusterActionPage = getRealPath("../../../workshop/form/CIFile/cmdb/CIMonitorVClusterReconfig.html?", selfName);
var hostRelateClusterActionPage = getRealPath("../../../workshop/form/CIFile/cmdb/CIMonitorHostMainFrameRelateCluster.html?", selfName);
var vm2TemplatePage = getRealPath("../../../workshop/form/CIFile/cmdb/CIMonitorVMTemplate.html?",selfName);
var scriptInfoPage = getRealPath("../../../workshop/execscript/scriptInfo.html?",selfName);
var vmManaulCollectPage = getRealPath("../../../workshop/form/CIFile/cmdb/CIMonitorVmManaulCollect.html?",selfName);
var addDataCenterActionPage = getRealPath("../../../workshop/form/CIFile/cmdb/CIMonitorVResourceGroupInf.html?", selfName);
var vmDispatcherRuleCfgPage = getRealPath("../../../workshop/form/CIFile/cmdb/CIMonitorVmDispatcherRule.html?",selfName);

var hasClickedsave = false;
var globalTask = null;
var pageRefParam;
var selectStoreDates = {};//���ڱ���ѡ��ҳ�淵�ص���ѡCI��store;
String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {
    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);
    } else {
        return this.replace(reallyDo, replaceWith);
    }
}

function initSelectStoreData(idObj,nameObj,leftObj,rightObj){
	if(idObj.value>0){
		if(!selectStoreDates[nameObj.id]){
			selectStoreDates[nameObj.id] = [];
		}
		selectStoreDates[nameObj.id].push({"INSTANCE_ID":idObj.value||"","SHORT_DESCRIPTION":nameObj.value||"",
		"leftRow":{"INSTANCE_ID":leftObj.id||"","SHORT_DESCRIPTION":leftObj.name||"","REQUEST_ID":leftObj.requestId||"","DATASET_ID":leftObj.datasetId||"6","CLASS_ID":leftObj.classId||""},
		"rightRow":{"INSTANCE_ID":rightObj.id||"","SHORT_DESCRIPTION":rightObj.name||"","REQUEST_ID":rightObj.requestId||"","DATASET_ID":rightObj.datasetId||"6","CLASS_ID":rightObj.classId||""}});
	}else{
		selectStoreDates[nameObj.id] = [];
	}
}

/*
   ��ʼ����ϵ�ؼ�
 */
function initRelationCtrl(dialParam,destClassId,operImg,ctrlId,ctrlName,title,sqlResult,afterSetValueFunc){	
    operImg.onclick = function () {
        var cfg = {};
        cfg.objId = ctrlId;
        cfg.objName = ctrlName;
        cfg.destClassId = destClassId;
        cfg.isMultiple = "false";
        cfg.isSource = "true";
        cfg.title = title;
        cfg.result = sqlResult;
        cfg.destDataSetIds = "6";
        cfg.addDataSetId = "6";
        cfg.destStatus = "13";
        cfg.ciId = dialParam.ciId;
        cfg.classId = dialParam.classId;
        cfg.afterSetValueFunc = afterSetValueFunc;                         
        cfg.result=sqlResult||100002211;        
        ciSelect(cfg);
    };
    var nameCtrl = document.getElementById(ctrlName);
    nameCtrl.setAttribute("isNameUrl", "false");
    nameCtrl.setAttribute("relaName", "VIRTUALIZATION=-" + destClassId.replaceAll(",", "-") + "-");
    //var idArray = new Array({id:"vmHostId", name:"vmHostName"});
    //ɾ������
    //appendDelImg(operImg);
    //findClearImgAndInit(operImg, idArray);
}

/*
	��ʼ��δ������ϵ�Ĺ�ϵ--�ʲ�
*/
function initRelationCtrl2(dialParam,destClassId,operImg,ctrlId,ctrlName,title,sqlResult,afterSetValueFunc){	
 operImg.onclick = function () {
     var cfg = {};
     cfg.objId = ctrlId;
     cfg.objName = ctrlName;
     cfg.destClassId = destClassId;
     cfg.isMultiple = "false";
     cfg.isSource = "true";
     cfg.title = title;
     cfg.result = sqlResult;
     cfg.destDataSetIds = "2";
     cfg.addDataSetId = "2";
     cfg.destStatus = "13";
     cfg.ciId = dialParam.ciId;
     cfg.classId = dialParam.classId;
     cfg.afterSetValueFunc = afterSetValueFunc;                         
     cfg.result=sqlResult||100002211;        
     ciSelect(cfg);
 };
 var nameCtrl = document.getElementById(ctrlName);
 nameCtrl.setAttribute("isNameUrl", "false");
 nameCtrl.setAttribute("relaName", "VIRTUALIZATION=-" + destClassId.replaceAll(",", "-") + "-");
}


//ͨ��Ŀ��ѡ��Դ
function initCasecadeRelationCtrl(operImg,lCfgId,lCfgName,lClassId,lTitle,rCfgId,rCfgName,rClassId,rTitle,selectedId,afterSetValueFunc){
    operImg.onclick = function() {
        var lcfg = {};
        lcfg.idObj = lCfgId;
        lcfg.nameObj = lCfgName;
        lcfg.DEST_CLASS_ID = lClassId;
        lcfg.isMultiple = "false";
        lcfg.isSource = "false";
        lcfg.sqlid = "100002211"
        lcfg.DATASET_IDS = "6";//"2,4";
        lcfg.DATASET_ID = "6";//"2";
        lcfg.title = lTitle;//"����";
        lcfg.STATUS = "13";
        lcfg.afterSetValueFunc = afterSetValueFunc;
        var rcfg = {};
        rcfg.idObj = rCfgId;
        rcfg.nameObj = rCfgName;
        rcfg.DEST_CLASS_ID = rClassId;
        rcfg.isMultiple = "false";
        rcfg.isSource = "true";
        rcfg.sqlid = "100002090";
        rcfg.DATASET_IDS = "6";
        rcfg.DATASET_ID = "6";
        rcfg.title = rTitle;
        rcfg.STATUS = "13";
        rcfg.ciId = selectedId;
        ciCascadeSelect(lcfg, rcfg, rTitle, "", "");
    };
    var lNameCtrl = document.getElementById(lCfgName);
    lNameCtrl.setAttribute("isNameUrl", "false");
    lNameCtrl.setAttribute("relaName", "VIRTUALIZATION=-"
        + lClassId.replaceAll(",", "-") + "-");
    /*var idArray307 = new Array({
     id : "IP_ID",
     name : "IP_NAME"
     }, {
     id : "HOST_ID",
     name : "HOST_NAME"
     });
     appendDelImg(operImg307);
     findClearImgAndInit(operImg307, idArray307);*/
    var rNameCtrl = document.getElementById(rCfgName);
    rNameCtrl.setAttribute("isNameUrl", "false");
    rNameCtrl.setAttribute("relaName", "DEPENDENCY=-"
        + rClassId.replaceAll(",", "-") + "-");

}

//ͨ��Դѡ��Ŀ��,leftLimit ��ߵ��б��instanceid������leftLimit��
function initCasecadeRelationCtrl2(operImg,lCfgId,lCfgName,lClassId,lTitle,rCfgId,rCfgName,rClassId,rTitle,selectedId,leftLimit,lSqlId,rSqlId,afterSetValueFunc){
    operImg.onclick = function() {
        var lcfg = {};
        lcfg.idObj = lCfgId;
        lcfg.nameObj = lCfgName;
        lcfg.DEST_CLASS_ID = lClassId;
        lcfg.isMultiple = "false";
        lcfg.isSource = "true";
        lcfg.sqlid = lSqlId||"100002212";
        lcfg.DATASET_IDS = "6";//"2,4";
        lcfg.DATASET_ID = "6";//"2";
        lcfg.title = lTitle;//"����";
        lcfg.STATUS = "13";
        lcfg.INSTANCE_IDS = leftLimit;
        lcfg.afterSetValueFunc = afterSetValueFunc;
        var rcfg = {};
        rcfg.idObj = rCfgId;
        rcfg.nameObj = rCfgName;
        rcfg.DEST_CLASS_ID = rClassId;
        rcfg.isMultiple = "false";
        rcfg.isSource = "false";
        rcfg.sqlid = rSqlId||"100002213";
        rcfg.DATASET_IDS = "6";
        rcfg.DATASET_ID = "6";
        rcfg.title = rTitle;
        rcfg.STATUS = "13";
        rcfg.ciId = selectedId;
        ciCascadeSelect(lcfg, rcfg, rTitle, "", "");
    };
    var lNameCtrl = document.getElementById(lCfgName);
    lNameCtrl.setAttribute("isNameUrl", "false");
    lNameCtrl.setAttribute("relaName", "VIRTUALIZATION=-"
        + lClassId.replaceAll(",", "-") + "-");
    /*var idArray307 = new Array({
     id : "IP_ID",
     name : "IP_NAME"
     }, {
     id : "HOST_ID",
     name : "HOST_NAME"
     });
     appendDelImg(operImg307);
     findClearImgAndInit(operImg307, idArray307);*/
    var rNameCtrl = document.getElementById(rCfgName);
    rNameCtrl.setAttribute("isNameUrl", "false");
    rNameCtrl.setAttribute("relaName", "APPLICATION_SYSTEM_COMPUTER=-"
        + rClassId.replaceAll(",", "-") + "-");

}

//ͨ��Դѡ��Ŀ��,leftLimit ��ߵ��б��instanceid������leftLimit��
function initCasecadeRelationCtrlByAsset(operImg,lCfgId,lCfgName,lClassId,lTitle,rCfgId,rCfgName,rClassId,rTitle,selectedId,leftLimit,lSqlId,rSqlId,afterSetValueFunc){
    operImg.onclick = function() {
        var lcfg = {};
        lcfg.idObj = lCfgId;
        lcfg.nameObj = lCfgName;
        lcfg.DEST_CLASS_ID = lClassId;
        lcfg.isMultiple = "false";
        lcfg.isSource = "true";
        lcfg.sqlid = lSqlId||"100002212";
        lcfg.DATASET_IDS = "2,4";//"2,4";
        lcfg.DATASET_ID = "2";//"2";
        lcfg.title = lTitle;//"����";
        lcfg.STATUS = "13";        
        lcfg.INSTANCE_IDS = leftLimit;
        lcfg.afterSetValueFunc = afterSetValueFunc;
        var rcfg = {};
        rcfg.idObj = rCfgId;
        rcfg.nameObj = rCfgName;
        rcfg.DEST_CLASS_ID = rClassId;
        rcfg.isMultiple = "false";
        rcfg.isSource = "false";
        rcfg.sqlid = rSqlId||"100002213";
        rcfg.DATASET_IDS = "2,4";
        rcfg.DATASET_ID = "2";
        rcfg.title = rTitle;
        rcfg.STATUS = "13";
        rcfg.ciId = selectedId;
        ciCascadeSelect(lcfg, rcfg, rTitle, "", "");
    };
    var lNameCtrl = document.getElementById(lCfgName);
    lNameCtrl.setAttribute("isNameUrl", "false");
    lNameCtrl.setAttribute("relaName", "VIRTUALIZATION=-"
        + lClassId.replaceAll(",", "-") + "-");
    /*var idArray307 = new Array({
     id : "IP_ID",
     name : "IP_NAME"
     }, {
     id : "HOST_ID",
     name : "HOST_NAME"
     });
     appendDelImg(operImg307);
     findClearImgAndInit(operImg307, idArray307);*/
    var rNameCtrl = document.getElementById(rCfgName);
    rNameCtrl.setAttribute("isNameUrl", "false");
    rNameCtrl.setAttribute("relaName", "APPLICATION_SYSTEM_COMPUTER=-"
        + rClassId.replaceAll(",", "-") + "-");
}

//��װ��ѡ�Ĳ�������
function getParamObj(type,value){
    if((type) && (value)){
        return {type:type,isMultiple:"0BT",value:value};
    }else
        return "";
}

//ѡ��CI�������������ǰ�����ʶ����ǰ��������,Ŀ������ʶ,Ŀ�����ݼ�,Ŀ��CI״̬,�Ƿ��ѡ(trueΪ��ѡ),�Ƿ���װ������,�Ƿ���ԴCI,��ʾ��ʾ
function ciSelect(config) {
    config.destStatus = config.destStatus || "13";
    config.isMultiple = config.isMultiple || "false";
    var param = getSelectParam(config.result, config.ciId, config.destDataSetIds,
        config.destClassId, config.parentciInstanceId, config.destStatus, config.title, config.isMultiple,config.classId);
    param.selectStoreDate = selectStoreDates[config.objName];
    var objArray = window.showModalDialog("/workshop/form/CIFile/cmdb/CISelect.html",param,"resizable=yes;dialogWidth=900px;dialogHeight=520px;help=0;scroll=0;status=0;");
    if(objArray){
        if(objArray.result == 1){
            selectStoreDates[config.objName] = objArray.selectStoreDate;
            setElementValue(objArray.rightArray,config.objId,config.objName,config.isMultiple,config.isSource,config.addDataSetId,config.afterSetValueFunc);
        }
    }
}

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
            
            if(objArray.leftArray[0]){
            	var selectStoreDate= new Array();
            	var row = {INSTANCE_ID:objArray.leftArray[0].INSTANCE_ID,CLASS_ID:objArray.leftArray[0].CLASS_ID,DATASET_ID:objArray.leftArray[0].DATASET_ID,REQUEST_ID:objArray.leftArray[0].REQUEST_ID,SHORT_DESCRIPTION:objArray.leftArray[0].SHORT_DESCRIPTION};
				selectStoreDate.push({INSTANCE_ID:objArray.leftArray[0].INSTANCE_ID,SHORT_DESCRIPTION:objArray.leftArray[0].SHORT_DESCRIPTION,rightRow:row});
				selectStoreDates[leftCfg.nameObj]= selectStoreDate;
            }
									
            setElementValue(objArray.leftArray,leftCfg.idObj,leftCfg.nameObj,leftCfg.isMultiple,leftCfg.isSource,leftCfg.DATASET_ID);
            setElementValue(objArray.rightArray,rightCfg.idObj,rightCfg.nameObj,rightCfg.isMultiple,rightCfg.isSource,leftCfg.DATASET_ID,leftCfg.afterSetValueFunc);
        }
    }
}

function getSelectParam(result,instanceId,datasetIds,destClassId,parentCiInstanceId,status,title,isMultiple,classId){
    var param = new Object();
    param.result = result;
    param.INSTANCE_ID = instanceId;
    param.SOURCE_CLASS_ID = classId;
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

function getCascadeSelectParam(leftCfg,rightCfg,title){
    var param = new Object();

    leftCfg.sqlid = leftCfg.sqlid;
    leftCfg.DATASET_IDS = getParamObj("INTEGER",leftCfg.DATASET_IDS || assetDestDataSetIds);
    leftCfg.STATUS = getParamObj("INTEGER",leftCfg.STATUS)
    leftCfg.DEST_CLASS_ID = getParamObj("INTEGER",leftCfg.DEST_CLASS_ID)

    rightCfg.sqlid = rightCfg.sqlid;
    rightCfg.RELANAME = rightCfg.RELANAME || 'null';
    rightCfg.DATASET_IDS = getParamObj("INTEGER",rightCfg.DATASET_IDS || assetDestDataSetIds);
    rightCfg.STATUS = getParamObj("INTEGER",rightCfg.STATUS)
    rightCfg.DEST_CLASS_ID = getParamObj("INTEGER",rightCfg.DEST_CLASS_ID)

    leftCfg.INSTANCE_ID = rightCfg.INSTANCE_ID = rightCfg.ciId;
    leftCfg.SOURCE_CLASS_ID = rightCfg.SOURCE_CLASS_ID = rightCfg.DEST_CLASS_ID;

    param.left = leftCfg;
    param.right = rightCfg;
    param.isMultiple = rightCfg.isMultiple;
    param.title = title||'';

    return param;
}

//��ֵ����
function setElementValue(rowArray,objId,objName,isMultiple,isSource,dataSetId,_afterSetValueFunc){
    if(!objId || !objName) return;
    if(typeof(objId)=="string") objId = document.getElementById(objId);
    if(typeof(objName)=="string") objName = document.getElementById(objName);
    var ids = "";
    var names = "";
    var relastr= "";
    var href = "";
    var isNameUrl = objName.getAttribute("isNameUrl");
    for(var p=0;p<rowArray.length;p++){
        var obj = rowArray[p];
        if(obj){
        	href = (isNameUrl=="true"?("<a href=\"#\" onClick=\"getConfigItem("+ obj.CLASS_ID + ","+ obj.DATASET_ID + ",'"+ obj.REQUEST_ID +"')\" title=\"����� "+ obj.SHORT_DESCRIPTION +" ��ϸ��Ϣ\"><font color=\"#0000FF\">"+obj.SHORT_DESCRIPTION  +"</font></a>"):obj.SHORT_DESCRIPTION);
	        ids += (obj.INSTANCE_ID + ",");
	        names += (href + ",");
        }        

        /*
        var cpt=objName.getAttribute("relaName");
        if(cpt){
            relastr += (isSource=="true" ? (obj.INSTANCE_ID+':'+INSTANCE_ID.value) : (INSTANCE_ID.value+':'+obj.INSTANCE_ID));
            relastr += ':' + dataSetId + ':' + cpt + ':null|';
        }
        */
    }

    if(ids.length > 0) ids = ids.substring(0,ids.length-1)
    if(names.length > 0) names = names.substring(0,names.length-1)    
    objId.value = ids;
    objName.innerHTML = names;    
    if(_afterSetValueFunc){
        _afterSetValueFunc.call(this);
    }
}

function failFunc(){
    EMsg("����ʧ��");
}

function closeAction() {
    window.close();
}

function window.onbeforeunload() {
    //����Ѿ����������������δ��������ʾ���ܹر�
    if (globalTask!=null && globalTask.taskObj.taskState != "success" && globalTask.taskObj.taskState != "error" && hasClickedsave) {
        window.event.returnValue = "����δ��ɲ��ܹرմ��ڣ���ȷ��Ҫ�ر�ô��";
    }
}

/*
 �����Ǩ��
 */
function moveVm(cfgName, priConfig){
    var oItem = cfgTree.getSelectedItem();
    var dialogsFeatures = "dialogWidth=650px;dialogHeight=230px;help=0;scroll=0;status=0;"
    var param = ["cfgName=" + cfgName, "ciId=" + oItem.CI_ID , "classId="+ oItem.NE_TYPE_ID,"ciName="+oItem.ITEM_NAME];
    return window.showModalDialog(getSendUrl(moveActionPage, param), priConfig, dialogsFeatures);

}

/*
 �������¡
 */
function copyVm(cfgName, priConfig){
    var oItem = cfgTree.getSelectedItem();
    var dialogsFeatures = "dialogWidth=650px;dialogHeight=250px;help=0;scroll=0;status=0;"
    var param = ["cfgName=" + cfgName, "ciId=" + oItem.CI_ID , "classId="+ oItem.NE_TYPE_ID,"ciName="+oItem.ITEM_NAME];
    var target =  window.showModalDialog(getSendUrl(copyActionPage, param), priConfig, dialogsFeatures);
    cfgTree._getParent(oItem).click();
    cfgTree.dynamicLoadTree();
    return target ;
}

/*
 ��������չ���
 */
function snapMage(cfgName, priConfig){
    var oItem = cfgTree.getSelectedItem();
    var dialogsFeatures = "dialogWidth=630px;dialogHeight=450px;help=0;scroll=0;status=0;"
    var param = ["cfgName=" + cfgName, "ciId=" + oItem.CI_ID , "classId="+ oItem.NE_TYPE_ID,"ciName="+oItem.ITEM_NAME];
    return window.showModalDialog(getSendUrl(snapMagePage, param), priConfig, dialogsFeatures);
}

/*
 ������洢����
 */
function storeMage(cfgName, priConfig){
    var oItem = cfgTree.getSelectedItem();
    var dialogsFeatures = "dialogWidth=600px;dialogHeight=125px;help=0;scroll=0;status=0;"
    var param = ["cfgName=" + cfgName, "ciId=" + oItem.CI_ID , "classId="+ oItem.NE_TYPE_ID,"ciName="+oItem.ITEM_NAME];
    return window.showModalDialog(getSendUrl(storeMagePage, param), priConfig, dialogsFeatures);
}

/*
 ����������Ӷ˿������
 */
function networkMage(cfgName, priConfig){
    var oItem = cfgTree.getSelectedItem();
    var dialogsFeatures = "dialogWidth=550px;dialogHeight=380px;help=0;scroll=0;status=0;"
    var param = ["cfgName=" + cfgName, "ciId=" + oItem.CI_ID , "classId="+ oItem.NE_TYPE_ID,"ciName="+oItem.ITEM_NAME];
    return window.showModalDialog(getSendUrl(netPortgroupPage, param), priConfig, dialogsFeatures);
}

/*
 ����˿���VLAN����
 */
function vLanMage(cfgName, priConfig){
    var oItem = cfgTree.getSelectedItem();
    var dialogsFeatures = "dialogWidth=520px;dialogHeight=400px;help=0;scroll=0;status=0;"
    var param = ["cfgName=" + cfgName, "ciId=" + oItem.CI_ID , "classId="+ oItem.NE_TYPE_ID,"ciName="+oItem.ITEM_NAME,
    "isManage=1"];
    return window.showModalDialog(getSendUrl(networkMagePage, param), priConfig, dialogsFeatures);
}

/*
 ��Ӷ˿���
 */
function addPortgroup(cfgName, priConfig){
    var oItem = cfgTree.getSelectedItem();
    var dialogsFeatures = "dialogWidth=570px;dialogHeight=400px;help=0;scroll=0;status=0;"
    var param = ["cfgName=" + cfgName, "ciId=" + oItem.CI_ID , "classId="+ oItem.NE_TYPE_ID,"ciName="+oItem.ITEM_NAME,
     "isManage=0"];
    return window.showModalDialog(getSendUrl(networkMagePage, param), priConfig, dialogsFeatures);
}
//�����Դ��
function addDataCenter(cfgName, priConfig){
    var oItem=cfgTree.getSelectedItem();
    var ciId=oItem.CI_ID;
    var classId=oItem.NE_TYPE_ID;
    var itemType=oItem.ITEM_TYPE;
    var viewId=oItem.VIEW_ID;    
    if(oItem.ITEM_TYPE=="FROM_CI_VIEW_CLASS" && oItem.VIEW_ID=="10010"){
    	ciId=getVcenterLevelIdByNeItemId(oItem.NE_ITEM_ID);
    }    
    var dialogsFeatures="dialogWidth=800px;dialogHeight=300px;help=0;scroll=0;status=0;"
    var param = ["cfgName=" + cfgName, "ciId=" + ciId , "classId="+classId,"itemName="+oItem.ITEM_NAME];
    var returnVal=window.showModalDialog(getSendUrl(addDataCenterActionPage, param), priConfig, dialogsFeatures);    
    if(returnVal=="ok"){    
    	oItem.click();
    	cfgTree.dynamicLoadTree();
    }
    return returnVal;
}
//��Ӽ�Ⱥ
function addCluster(cfgName, priConfig){
    var oItem=cfgTree.getSelectedItem();
    var ciId=oItem.CI_ID;
    var classId=oItem.NE_TYPE_ID;
    var itemType=oItem.ITEM_TYPE;
    var viewId=oItem.VIEW_ID;    
    if(oItem.ITEM_TYPE=="FROM_CI_VIEW_CLASS" && oItem.VIEW_ID=="10010"){
    	ciId=getVcenterLevelIdByNeItemId(oItem.NE_ITEM_ID);
    }    
    var dialogsFeatures="dialogWidth=800px;dialogHeight=400px;help=0;scroll=0;status=0;"
    var param = ["cfgName=" + cfgName, "ciId=" + ciId , "classId="+classId,"itemName="+oItem.ITEM_NAME,"type=ADD"];
    var returnVal=window.showModalDialog(getSendUrl(reconfigClusterActionPage, param), priConfig, dialogsFeatures);    
    if(returnVal=="ok"){    
    	oItem.click();
    	cfgTree.dynamicLoadTree();
    }
    return returnVal;
}

//�޸ļ�Ⱥ����
function reconfigCluster(cfgName, priConfig){
    var oItem=cfgTree.getSelectedItem();
    var classId=oItem.NE_TYPE_ID;
    var dialogsFeatures="dialogWidth=800px;dialogHeight=600px;help=0;scroll=0;status=0;"
    var param = ["cfgName=" + cfgName, "ciId=" + oItem.CI_ID , "classId="+classId,"itemName="+oItem.ITEM_NAME,"type=EDIT"];
    var returnVal=window.showModalDialog(getSendUrl(reconfigClusterActionPage, param), priConfig, dialogsFeatures);    
    if(returnVal=="ok"){    	
    	cfgTree._getParent(oItem).click();
    	cfgTree.dynamicLoadTree();
    }
    return returnVal;
}

//�������������Ⱥ
function addHostToCluster(cfgName, priConfig){
    var oItem=cfgTree.getSelectedItem(); 
    var type="ADD"; 
    var ciId=oItem.CI_ID;
    var classId=oItem.NE_TYPE_ID;
    var itemType=oItem.ITEM_TYPE;
    var viewId=oItem.VIEW_ID;
    if(itemType=="FROM_ENTITY_NE" && classId=="900001011"){//�����ʵ����Ԫ��Ϊ������CI
    	var oData=queryAllData("SELECT pkp_vm_inf_util.judgehostisrelatecluster("+ciId+") CLUSTER_ID FROM DUAL");
	    if(typeof(oData)!="undefined" && oData.length>0 && oData[0].CLUSTER_ID > 0){
	        EMsg("�����������ڼ�Ⱥ��!");
	        return;
	    }
	    type="EDIT";	    
    }   
    
    var dialogsFeatures="dialogWidth=800px;dialogHeight=600px;help=0;scroll=0;status=0;"
    var param = ["cfgName=" + cfgName, "ciId=" + ciId , "classId="+classId,"itemName="+oItem.ITEM_NAME,"type="+type];
    var returnVal=window.showModalDialog(getSendUrl(hostRelateClusterActionPage, param), priConfig, dialogsFeatures);
    if(returnVal=="ok"){
    	if(viewId=="10010"){//��Դ����ͼ
    		if(classId=="900001011"){
    			cfgTree._getParent(oItem).click();
    			cfgTree.dynamicLoadTree();
    		}else{
    			oItem.click();
    			cfgTree.dynamicLoadTree();
    		}    		
    	}else{//������ͼ
    		if(classId=="900001011"){
    			if(itemType=="FROM_CI_VIEW_CLASS"){//������Ԫ����
    				oItem.click();
    				cfgTree.dynamicLoadTree();
    			}else{
    				cfgTree._getParent(oItem).click();
    				cfgTree.dynamicLoadTree();
    			}
    		}
    	}    	
    }
    return returnVal;
}

//�Ӽ�Ⱥ���Ƴ�������
function removeHostFromCluster(cfgName, priConfig){
    var oItem=cfgTree.getSelectedItem();
    var oData1=queryAllData("SELECT pkp_vm_inf_util.judgehostisrelatecluster("+oItem.CI_ID+") CLUSTER_ID FROM DUAL");
    if(typeof(oData1)!="undefined" && oData1.length>0 && oData1[0].CLUSTER_ID==0){
        EMsg("��������δ�������Ⱥ!");
        return;
    }

    var oData2=queryAllData("SELECT decode(is_maintenance_mode,1,1,0) flag FROM CI_MAINFRAME where instance_id = " + oItem.CI_ID);
    if(typeof(oData2)!="undefined" && oData2.length>0 && oData2[0].FLAG==0){
        EMsg("�������Ƴ�ǰ���봦��ά��ģʽ��!");
        return;
    }
    var classId=oItem.NE_TYPE_ID;
    var dialogsFeatures="dialogWidth=800px;dialogHeight=600px;help=0;scroll=0;status=0;"
    var param = ["cfgName=" + cfgName, "ciId=" + oItem.CI_ID , "classId="+classId,"itemName="+oItem.ITEM_NAME,"type=REMOVE"];
    var returnVal=window.showModalDialog(getSendUrl(hostRelateClusterActionPage, param), priConfig, dialogsFeatures);
    if(returnVal=="ok"){
    	cfgTree._getParent(oItem).click();
    	cfgTree.dynamicLoadTree();
    }
    return returnVal;
}

function ajaxRequest(url,oParam){
    var xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
    var oParam=oParam||{};
    if(oParam.async){
        xmlHttp.onreadystatechange=function(){oParam.onStateChange(xmlHttp)};
    }
    xmlHttp.open(oParam.method||"POST",url,oParam.async||false);
    xmlHttp.send(oParam.xml||"");
    if(!oParam.async){
        return xmlHttp;
    }
}

function syncAjaxRequest(url,oXML){
    var xmlHttp=ajaxRequest(url,{xml:(oXML||null)});
    var xmlDoc=null;
    if(isSuccess(xmlHttp)){
        xmlDoc=xmlHttp.responseXML;
    }
    return xmlDoc;
}

//��������ѡ��ĳһ��
function chooseSelect(selectId,valueId){
    var objSelect = document.getElementById(selectId);
    var rsId = null;
    for(var i=0;i<objSelect.options.length;i++){
        var option = objSelect.options[i];
        if(option.value==valueId){
            objSelect.options.selectedIndex=i;
            rsId = valueId;
            break;
        }
    }
    return rsId;
}

//��ȡ������ѡ��ֵ
function getSelectedValue(selectId){
    var objSelect=document.getElementById(selectId);
    return objSelect.options[objSelect.selectedIndex].value;
}

//�ж��Ƿ���ڷ�������������
function isExistsSameData(tableName,whereStr){
    var xmlHttp=ajaxRequest("/servlet/CmdbServlet?tag=9&tableName="+tableName+"&whereStr="+whereStr);
    var flag=xmlHttp.responseText;
    if(flag=="true"){
        return true;
    }else {
        return false;
    }
}

/**
 * ���¼������ݴ洢
 */
function rescanAction(){
    var oItem = cfgTree.getSelectedItem();
    var desInstanceId = oItem.CI_ID;
    var desName = oItem.ITEM_NAME;

    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.Open("get", "/servlet/VMResDispatchAction?action=10&des_id="+desInstanceId
        +"&des_name="+encodeURIComponent(desName), false);
    xmlhttp.send();
    if(xmlhttp.readyState==4 && xmlhttp.status == 200) {
        var ret = xmlhttp.responseXML.selectSingleNode("root/result").text;
        if(ret=="0"){
            MMsg("ˢ�³ɹ���");
        } else{
            EMsg("ˢ��ʧ�ܣ�");
        }
    }
}

/*
 * ˫���ű�����ű���Ϣҳ��
*/
function toScriptInfo(grid){
	var row = grid.getSelectionModel().getSelected();
	if(typeof(row)=='undefined'){
		EMsg("��ѡ����")
		return ;
	}
	if(row.get("EXEC_SCRIPT_ID")==""){
		MMsg("��ģ���޶�Ӧ�ű��������ã�");
		return ;
	}
	var dialogsFeatures = "dialogWidth=600px;dialogHeight=600px;help=0;scroll=0;status=0;";
	var param = {scriptId:row.get("EXEC_SCRIPT_ID"),action:2};
	return window.showModalDialog(scriptInfoPage, param ,dialogsFeatures);	
}
//<IE:button style="margin-left: 10;" type="button" value="����ˢ�����ݴ洢" onclick="rescanAction()"/>

// ***********add by: huangxm*******************************************

function hostcontrol() {
    var oItem = cfgTree.getSelectedItem();
    var dialogsFeatures = "dialogWidth=600px;dialogHeight=430px;help=0;scroll=0;status=0;"
    var param = ["cfgName=", "ciId=" + oItem.CI_ID,"classId=" + oItem.NE_TYPE_ID, "hostname=" + oItem.ITEM_NAME];
    return window.showModalDialog(getSendUrl(vmhostcontrolpage, param), "",dialogsFeatures);
}

function vmcontrol() {
    var oItem = cfgTree.getSelectedItem();
    var dialogsFeatures = "dialogWidth=700px;dialogHeight=430px;help=0;scroll=0;status=0;"
    var param = ["cfgName=", "ciId=" + oItem.CI_ID,"classId=" + oItem.NE_TYPE_ID, "vmname=" + oItem.ITEM_NAME];
//    var param = ["cfgName=", "ciId=" + oItem.CI_ID, "classId=" + oItem.NE_TYPE_ID, "vmname=��������Ⱥ��"];
    return window.showModalDialog(getSendUrl(vmcontrolpage, param), "",dialogsFeatures);
}

function vmcreate() {
    var oItem = cfgTree.getSelectedItem();
    var dialogsFeatures = "dialogWidth=650px;dialogHeight=450px;help=0;scroll=0;status=0;"
    var ciId=oItem.CI_ID;    
    if(oItem.ITEM_TYPE=="FROM_CI_VIEW_CLASS" && oItem.VIEW_ID=="10010"){
    	ciId=getVcenterLevelIdByNeItemId(oItem.NE_ITEM_ID);
    }
    var param = ["cfgName=", "ciId=" + ciId,"classId=" + oItem.NE_TYPE_ID, "vmName=" + oItem.ITEM_NAME];
    var  result =  window.showModalDialog(getSendUrl(vmcreatepage, param), "",dialogsFeatures);
	oItem.click();
	cfgTree.dynamicLoadTree();
	return result;
}

function vmcreatebymodule() {
    var oItem = cfgTree.getSelectedItem();       
    var dialogsFeatures = "dialogWidth=600px;dialogHeight=430px;help=0;scroll=0;status=0;"
    var ciId=oItem.CI_ID;    
    if(oItem.ITEM_TYPE=="FROM_CI_VIEW_CLASS" && oItem.VIEW_ID=="10010"){
    	ciId=getVcenterLevelIdByNeItemId(oItem.NE_ITEM_ID);
    }
    var param = ["cfgName=", "ciId=" + ciId,"classId=" + oItem.NE_TYPE_ID, "vmName=" + oItem.ITEM_NAME];
    var  result = window.showModalDialog(getSendUrl(vmcreatebymodulepage, param), "",dialogsFeatures);
	oItem.click();
	cfgTree.dynamicLoadTree();
	return result;
}

function openvmconsole() {
    var oItem = cfgTree.getSelectedItem();
    var dialogsFeatures = "dialogWidth=720px;dialogHeight=660px;help=0;scroll=0;status=0;"
    var param = ["cfgName=", "ciId=" + oItem.CI_ID, "classId=" + oItem.NE_TYPE_ID, "vmname=" + oItem.ITEM_NAME];
	window.open(getSendUrl(vmconsole, param));

}

function vmmodify() {
    var oItem = cfgTree.getSelectedItem();
    var dialogsFeatures = "dialogWidth=600px;dialogHeight=430px;help=0;scroll=0;status=0;"
    var param = ["cfgName=", "ciId=" + oItem.CI_ID, "classId=" + oItem.NE_TYPE_ID, "vmname=" + oItem.ITEM_NAME];
    //var param = ["cfgName=", "ciId=" + oItem.CI_ID, "classId=" + oItem.NE_TYPE_ID, "vmname=createvm"];
    return window.showModalDialog(getSendUrl(vmmodifypage, param), "", dialogsFeatures);
}

function vm2Template() {
	var oItem = cfgTree.getSelectedItem();
	var dialogsFeatures = "dialogWidth=650px;dialogHeight=350px;help=0;scroll=1;status=0;"
		var param = ["cfgName=", "ciId=" + oItem.CI_ID, "classId=" + oItem.NE_TYPE_ID, "ciName=" + oItem.ITEM_NAME];
	return window.showModalDialog(getSendUrl(vm2TemplatePage, param), "", dialogsFeatures);
}

function vmDispatcherRuleCfg() {
    var oItem = cfgTree.getSelectedItem();
    var dialogsFeatures = "dialogWidth=650px;dialogHeight=350px;help=0;scroll=1;status=0;"
    var param = ["cfgName=", "ciId=" + oItem.CI_ID, "classId=" + oItem.NE_TYPE_ID, "ciName=" + oItem.ITEM_NAME];
    return window.showModalDialog(getSendUrl(vmDispatcherRuleCfgPage, param), "", dialogsFeatures);
}



function vmdelete()
{
	var oItem = cfgTree.getSelectedItem();
    if (confirm('ȷ��ɾ���������')) {
	   	var dialogsFeatures = "dialogWidth=700px;dialogHeight=430px;help=0;scroll=0;status=0;"
	    var param = ["cfgName=", "ciId=" + oItem.CI_ID,"classId=" + oItem.NE_TYPE_ID, "vmname=" + oItem.ITEM_NAME,"deltag=0"];
	    var result = window.showModalDialog(getSendUrl(vmcontrolpage, param), "",dialogsFeatures);
			cfgTree._getParent(oItem).click();
	cfgTree.dynamicLoadTree();
	return result;
	}
}

function manualSync(){
	var oItem=cfgTree.getSelectedItem();	
	var instanceId=oItem.CI_ID;
	var classId=oItem.NE_TYPE_ID;	
	if(instanceId=="" || classId==""){
		EMsg("instanceId��classIdΪ�ղ���ִ�иò���!");
		return;
	}
	if(classId=="900001007"){
		MMsg("���⽻�����ݲ�֧�ִ˲���!");
		return;
	}
	var dialogsFeatures="dialogWidth=650px;dialogHeight=350px;help=0;scroll=0;status=0;"
    var param = ["ciId=" + instanceId , "classId="+classId,"itemName="+oItem.ITEM_NAME];       
    var returnVal=window.showModalDialog(getSendUrl(vmManaulCollectPage, param), "", dialogsFeatures);
    cfgTree._getParent(oItem).click();
    cfgTree.dynamicLoadTree();
    return returnVal;               
}
//����Ŀ��ID��������ȡԴID
function getSourceCiId(dest_instance_id,dest_class_name,source_class_name){
	var oData=queryAllData("select pkp_vm_inf_util.getSourceCI("+dest_instance_id+",'"+dest_class_name+"','"+source_class_name+"') INSTACNE_ID from dual");
    if(typeof(oData)!="undefined" && oData.length>0){
       return oData[0].INSTACNE_ID;
    }
    return "";
}
//��ȡ���⻯�������ID
function getVcenterId(instanceId){
	var oData=queryAllData("select pkp_vm_inf_util.getVMManageSoft("+instanceId+") INSTACNE_ID from dual");
    if(typeof(oData)!="undefined" && oData.length>0){
       return oData[0].INSTACNE_ID;
    }
    return "";
}

//����Դ����ͼ�У���ͨ��NE_ITEM_ID�ݹ��ѯ����vCenter�ڵ��INSTANCE_ID
function getVcenterLevelIdByNeItemId(neItemId){
	var oData=queryAllData("select b.relation_id INSTACNE_ID from (select a.*, ROW_NUMBER() over(order by level desc) seq from NE_VIEW_CFG a start with ne_item_id = "
						  + neItemId + " and view_id = 10010 connect by ne_item_id = prior parent_ne_item_id and view_id = 10010) b where b.seq = 2");    
    if(typeof(oData)!="undefined" && oData.length>0){
       return oData[0].INSTACNE_ID;
    }
    return "";
}

//��ȡCI_BASE_ELEMENT_SEQ
function getInstanceIdSeq(){
	var oData=queryAllData("SELECT CI_BASE_ELEMENT_SEQ.NEXTVAL INSTACNE_ID FROM DUAL");
    if(typeof(oData)!="undefined" && oData.length>0){
       return oData[0].INSTACNE_ID;
    }
    return "";
}

//��ȡCI����
function getCIName(instanceId){
	var oData=queryAllData("select PKP_CI_VIEW.getCIName("+instanceId+") CI_NAME from dual");
    if(typeof(oData)!="undefined" && oData.length>0){
       return oData[0].CI_NAME;
    }
    return "";
}
// ******************************************************