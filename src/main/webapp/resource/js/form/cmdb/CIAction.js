document.writeln('<SCRIPT src="/resource/js/form/cmdb/CISelect.js"></SCRIPT>');
var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var Url = "/servlet/CmdbServlet?";
var fLevel,sLevel,tLevel;
var callbackFn;
var param;
var readOnly;
var dataSetId;
var hiddenToolBar;
var flowId;
var	moduleId;//����ģ���cmdb�������ñ�ʶ
var itemId;
var readOnlyParam="&hiddenToolBar=y&readOnly=y";
var disabledFlag  = "show";//��url�д�readOnlyΪyʱ��˵����ֻ����viewType��������Ϊshow�����İ�ť��Ϊ������
var viewType="edit";
var isFocus = false;//�����жϸ澯�б��div�Ƿ��ý���
var assetDestDataSetIds = '2,4';//ѡ��CI���ݼ���Χ
var monitorDestDataSetIds = '6';//ѡ��CI���ݼ���Χ
var assetAddDataSetId = '2';//����CIĬ�����ݼ�
var monitorAddDataSetId = '6';//����CIĬ�����ݼ�
var CI_CLASS_ID ;//��ǰCI��CLASS_ID
var initRelDoms={};//������еĹ�ϵ
var companyParams = new Object();
var wait;
var ipRegex = /^(([1-9]{1}|([1-9]{1}\d{1})|(1\d{2})|(2[0-4]\d)|(25[0-5]))\.)(((\d{1})|([1-9]{1}\d{1})|(1\d{2})|(2[0-4]\d)|(25[0-5]))\.){2}((\d{1})|([1-9]{1}\d{1})|(1\d{2})|(2[0-4]\d)|(25[0-5]))$/
var STAFF_ID;//��ǰԱ��ID
var changeBusiSystem;//ҵ��ϵͳѡ����ú���
var oPopup2;  //���������˵�
var delayTimeOut;
var oCompanyId,oCompanyName;  //��ǰ�����ĳ��̶���
var pWinParam = window.dialogArguments; // ��������Դ�������̣�����

String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {   
	if (!RegExp.prototype.isPrototypeOf(reallyDo)) {   
		return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);   
	} else {   
		return this.replace(reallyDo, replaceWith);   
	}   
}

var loadMask = function(target){
	wait = new Ext.LoadMask(target, {
		msg:'���ڼ�������...'
	});
}
function $(id){
	return document.getElementById(id);
}

//��ȡCLASS_ID
function getThisCiClassId(){
	if(CI_CLASS_ID)
		return CI_CLASS_ID;
	if($("CLASS_ID"))
		CI_CLASS_ID = $("CLASS_ID").value;
	else if($("historyInfo") && historyInfo.CLASS_ID)
		CI_CLASS_ID = historyInfo.CLASS_ID.value;
	else if(parent && parent.getThisCiClassId)
		CI_CLASS_ID = parent.getThisCiClassId();
	return CI_CLASS_ID;
}

//��ȡCLASS_IDԪ��
function getThisCiClassIdEle(){
    if($("CLASS_ID"))
        return $("CLASS_ID");
    else if($("historyInfo") && historyInfo.CLASS_ID)
        return historyInfo.CLASS_ID;
    else if(parent && parent.getThisCiClassIdEle)
        return parent.getThisCiClassIdEle();
}


//����CI
function CIAdd(grid)
{
	addCiCommon(grid, grid.result);
//	callbackFn = refresh.callback([grid]);
//
//	var dataSetId=grid.result.DATASET_ID||assetAddDataSetId;
//	var formType =grid.result.FORM_TYPE;
//	
//	var classId=grid.result.CLASS_ID;
//	var isAbstract=grid.result.IS_ABSTRACT;//�Ƿ�������
//	
//	var formId=grid.result.FORM_ID;
//	var categoryId=grid.result.CATEGORY_ID;
//	
//	if(formType=="CATEGORY" && formId && categoryId){
//		window.showModalDialog("/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId="+formId+"&categoryId="+categoryId+"&dataSetId="+dataSetId+"&flowId="+getFlowId()+"&isSync="+getIsSync()+"&isAudit="+getIsAudit()+"&moduleId="+getModuleId()+"&type="+getType()+"&title="+getTitle(),window,
//                         "dialogWidth:"+window.screen.width+"px;dialogHeight:"+window.screen.height +"px;center:no;help:no;resizable:no;status:no");	
//	}else if(/*formType=="CLASS" &&*/ classId && isAbstract && isAbstract!=1){
//		window.showModalDialog("/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&classId="+classId+"&dataSetId="+dataSetId+"&flowId="+getFlowId()+"&isSync="+getIsSync()+"&isAudit="+getIsAudit()+"&moduleId="+getModuleId()+"&type="+getType()+"&title="+getTitle(),window,
//                         "dialogWidth:"+window.screen.width+"px;dialogHeight:"+window.screen.height +"px;center:no;help:no;resizable:no;status:no");
//		//doWindow_open("/workshop/form/index.jsp?callback=window.opener.callbackFn()&classId="+classId+"&dataSetId="+dataSetId+"&flowId="+getFlowId()+"&isSync="+getIsSync()+"&isAudit="+getIsAudit());
//	}else{
//		MMsg("�Բ�����ѡ���CI�಻�ܴ���CIʵ������ѡ��ɴ�����CI��");
//		return;
//	}
//	
//	window.returnValue = true;
}

// ���� ci �Ĺ��÷���
function addCiCommon(grid, p) {
	callbackFn = refresh.callback([grid]);

	var dataSetId = p.DATASET_ID||assetAddDataSetId;
	var formType = p.FORM_TYPE;
	
	var classId = p.CLASS_ID;
	var isAbstract = p.IS_ABSTRACT;//�Ƿ�������
	
	var formId = p.FORM_ID;
	var categoryId = p.CATEGORY_ID;
	
	if(formType=="CATEGORY" && formId && categoryId){
		window.showModalDialog("/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&formId="+formId+"&categoryId="+categoryId+"&dataSetId="+dataSetId+"&flowId="+getFlowId()+"&isSync="+getIsSync()+"&isAudit="+getIsAudit()+"&moduleId="+getModuleId()+"&type="+getType()+"&title="+getTitle(),window,
                         "dialogWidth:"+window.screen.width+"px;dialogHeight:"+window.screen.height +"px;center:no;help:no;resizable:no;status:no");	
	}else if(/*formType=="CLASS" &&*/ classId && isAbstract && isAbstract!=1){
		window.showModalDialog("/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&classId="+classId+"&dataSetId="+dataSetId+"&flowId="+getFlowId()+"&isSync="+getIsSync()+"&isAudit="+getIsAudit()+"&moduleId="+getModuleId()+"&type="+getType()+"&title="+getTitle(),window,
                         "dialogWidth:"+window.screen.width+"px;dialogHeight:"+window.screen.height +"px;center:no;help:no;resizable:no;status:no");
		//doWindow_open("/workshop/form/index.jsp?callback=window.opener.callbackFn()&classId="+classId+"&dataSetId="+dataSetId+"&flowId="+getFlowId()+"&isSync="+getIsSync()+"&isAudit="+getIsAudit());
	}else{
		MMsg("�Բ�����ѡ���CI�಻�ܴ���CIʵ������ѡ��ɴ�����CI��");
		return;
	}
	
	window.returnValue = true;
}

//�޸�CI
function CIModify(grid)
{
	CIModifyOpenForm(grid,1);
}

//�޸�CI(˫���¼�)
function CIModifyDbClick(grid)
{
	if(!grid || (typeof grid.getSelectionModel != 'function'))
	{
		grid = this;
	}
	CIModifyOpenForm(grid,2);
}

function CIModifyOpenForm(grid,flag){
	callbackFn = refresh.callback([grid]);
		
	var row = grid.getSelectionModel().getSelected();
	if(row){
		var param = "";
		if(row.get("DATASET_ID")==3 || row.get("DATASET_ID")==5){
			param = readOnlyParam;
		}else if(typeof(grid.isAllowOnlyRead)=='undefined' || grid.isAllowOnlyRead){
			param = "&hiddenToolBar="+hiddenToolBar+"&readOnly="+readOnly;
		}
		window.showModalDialog("/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&classId="+row.get("CLASS_ID")+"&dataSetId="+row.get("DATASET_ID")+"&requestId="+row.get("REQUEST_ID")+"&flowId="+getFlowId()+"&isSync="+getIsSync()+"&isAudit="+getIsAudit()+"&title="+getTitle()+"&moduleId="+getModuleId()+param,window,
                         "dialogWidth:"+window.screen.width+"px;dialogHeight:"+window.screen.height +"px;center:no;help:no;resizable:no;status:no");
		//doWindow_open("/workshop/form/index.jsp?callback=window.opener.callbackFn()&classId="+row.get("CLASS_ID")+"&dataSetId="+row.get("DATASET_ID")+"&requestId="+row.get("REQUEST_ID")+"&flowId="+getFlowId()+"&isSync="+getIsSync()+"&isAudit="+getIsAudit()+param,undefined,undefined,'_blank');
	    window.returnValue = true;
	}
	else
	{
		if(flag==1)
			MMsg("��ѡ��һ�");
		return;
	}
}

//ɾ��CI
function CIDelete(grid)
{
	if(grid){//CMDB��񹤾���ɾ���¼�
		var instanceIds="";
        var busiSysInstIds="";
		var rows = grid.getSelectionModel().getSelections();
		if(rows.length!=0){
	  		if(QMsg("ȷ��Ҫɾ����ѡ���¼��ͬʱҲ��ɾ��������CI�Ĺ�ϵ!")==MSG_YES)
	  		{
				for (var i=0;i<rows.length;i++)
				{
					if(i==0)
                    {
						instanceIds=rows[i].get("INSTANCE_ID");
                    }
					else
                    {
						instanceIds=instanceIds+","+rows[i].get("INSTANCE_ID");
                    }
                    if(rows[i].get("CLASS_ID")=="30" && rows[i].get("DATASET_ID")=="2")
                    {
                        //�ʲ����ݼ���ҵ��ϵͳ������ͬ��
                        if(busiSysInstIds=="")
                        {
                            busiSysInstIds=rows[i].get("INSTANCE_ID");
                        }
                        else
                        {
                            busiSysInstIds=busiSysInstIds+","+rows[i].get("INSTANCE_ID");
                        }
                    }
				}
				if(CIDeleteByinstanceIds(instanceIds))
				{
					grid.search();
				}
                if(busiSysInstIds!="")
                {
                    if(syncCIDeleteByinstanceIds(busiSysInstIds))
                        grid.search();
                }
                window.returnValue = true;
	  		}
		}else
		{
			MMsg("��ѡ��һ�");
			return;
		}
    }else{//���ڹ������ϵ�ɾ���¼�
  		if(QMsg("ȷ��Ҫɾ����ǰCI��ͬʱҲ��ɾ��������CI�Ĺ�ϵ!")==MSG_YES)
  		{
			var instanceId=$("INSTANCE_ID").value;
			if(CIDeleteByinstanceIds(instanceId))
			{
               if(getThisCiClassId()=='30')
                   syncCIDeleteByinstanceIds(instanceId);
			   try
			   {
			   		if(window.dialogArguments){
			   			window.dialogArguments.callbackFn();
			   		}else if(parent.window.opener){
			   			parent.window.opener.callbackFn();
			   		}
			   }
			   catch(e)
			   {};
	        	top.window.close();
			}
  		}
	}
}


function CIDeleteByinstanceIds(instanceIds,showMsg)
{
	if(instanceIds)
	{
		var delByClassIdUrl="/servlet/formDispatch?OperType=19&instanceIds="+instanceIds+"&flowId="+getFlowId()+"&isSync="+getIsSync()+"&isAudit="+getIsAudit();
		xmlhttp.Open("POST",delByClassIdUrl,false);
	    xmlhttp.send();
	    if(isSuccess(xmlhttp))
	    {
	    	return true;
	    }
    }
	return false;
}

//ɾ���ʲ�ҵ��ϵͳCIʱͬ��ɾ����ص�
function syncCIDeleteByinstanceIds(instanceIds)
{
    if(instanceIds)
    {
        var delByClassIdUrl="/servlet/formDispatch?OperType=26&instanceIds="+instanceIds+"&flowId="+getFlowId()+"&isSync="+getIsSync()+"&isAudit="+getIsAudit();
        xmlhttp.Open("POST",delByClassIdUrl,false);
        xmlhttp.send();
        if(isSuccess(xmlhttp))
        {
            MMsg("ɾ���ɹ���");
            return true;
        }
    }
    return false;
}


//չʾCI��ϵ����
function CITopo(grid)
{
    var row = grid.getSelectionModel().getSelected();
    if(row){
    	window.showModalDialog("/workshop/config/CITopoExplorer.html?CI_ID="+row.get("INSTANCE_ID")+"&DataSet="+row.get("DATASET_ID"),window,
                         "dialogWidth:"+window.screen.width+"px;dialogHeight:"+window.screen.height +"px;center:no;help:no;resizable:no;status:no");
        //doWindow_open("/workshop/config/CITopoExplorer.html?CI_ID="+row.get("INSTANCE_ID")+"&DataSet="+row.get("DATASET_ID"),undefined,undefined,'_blank');
    }
    else
    {
        MMsg("��ѡ��һ�");
        return;
    }
}

//����Ȩ��
function ciGrant(grid)
{
	var instanceIds="";
	var rows = grid.getSelectionModel().getSelections();
	if(rows.length!=0){
		for (var i=0;i<rows.length;i++)
		{	
			if(i==0)
				instanceIds=rows[i].get("INSTANCE_ID");
			else 
				instanceIds=instanceIds+","+rows[i].get("INSTANCE_ID");
		}
		if (configTreePri('NET_ELEMENT', instanceIds))
		{
			grid.search();
		}
	}
	else
	{
		MMsg("��ѡ��һ�");
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
	if(typeof(historyGrid)!='undefined' && historyGrid){
		historyGrid.search();
	}
	
	//��������Դ��������
	if(pWinParam && pWinParam.area && pWinParam.area=='HB'){
		var result = grid.getSelectionModel().getSelections()[0].get('INSTANCE_ID');
		window.returnValue = result;
		window.close();
	}
	
}


//���������ʼ��
function setCateLevelInit()
{
	setCateLevel(2);
	document.getElementById("ITEM").value=oTable.CI_BASE_ELEMENT.ITEM.DEFAULT_VALUE;	
}

function setCateLevel(level)
{
	if(level==1 || level==2){
		var oValue;
		var oSelect;
		if(level==1) {
			oValue = $("CATEGORY").value;
			oSelect = $("TYPE");		
		} else if(level==2) {
			oValue = $("TYPE").value;
			oSelect = $("ITEM");		
		}
		xmlhttp.Open("POST",Url+"tag=1&parentValue="+oValue,false);
		xmlhttp.send();
		var dataXML = new ActiveXObject("Microsoft.XMLDOM");
		dataXML.load(xmlhttp.responseXML);	
		oSelect.options.length=0;
		var oRows = dataXML.selectNodes("/root/rowSet");
		var iLen = oRows.length;
		var selectValue;
		for(var i=0;i<iLen;i++)
	   	{
			var oOption = document.createElement("OPTION");
			oOption.value =oRows[i].getAttribute("id");
			oOption.text = oRows[i].selectSingleNode("NAME").text;	
			oSelect.add(oOption);
		}
		setCateLevel(++level);			
	}

}

//CI����ͬ���ж�
function checkSameName(thisForm)
{
	return true;
	/*
	var dataSetId=document.getElementById("DATASET_ID").value;
	var inName=document.getElementById("SHORT_DESCRIPTION").value;
	
	if(inName=="")
	{
		MMsg("������CI���ƣ�");
		return false;
	}
	if(thisForm.getFormBahavior()=="C"){
		if(isSameNameExit("CI_BASE_ELEMENT"," AND DATASET_ID="+dataSetId+" AND SHORT_DESCRIPTION='"+encodeURIComponent(inName)+"' AND MARKASDELETED='0'"))
			return false;
		else
			return true;
		
	}else{
		var instanceId=document.getElementById("INSTANCE_ID").value;
		if(isSameNameExit("CI_BASE_ELEMENT"," AND DATASET_ID="+dataSetId+" AND SHORT_DESCRIPTION='"+encodeURIComponent(inName)+"' AND INSTANCE_ID<>"+instanceId+" AND MARKASDELETED='0'"))
			return false;
		else 
			return true;
	}*/
}

function isSameNameExit(tableName,whereStr)
{
	xmlhttp.Open("POST",Url+"tag=9&tableName="+tableName+"&whereStr="+whereStr,false);
	xmlhttp.send();
	var b=xmlhttp.responseText;
	if(b=="true"){
		MMsg("�Ѵ���ͬ���ļ�¼��������������");
		return true;
	}
	else {
		return false;
	}
}

//���̹���
function ConfigComplay(oElement)
{
	var ret=window.showModalDialog("/workshop/companyequip/company.jsp?type=1",companyParams,"dialogWidth:800px;dialogHeight:600px;center:no;help:no;resizable:no;status:no");	
	if(ret=="ok"){
		if(typeof(oElement)=="string"){
			oElement = $(oElement);
		}
		oElement.reInit();
	}
}

//��ͬ����
function ConfigContract(oElement)
{
	var ret=window.showModalDialog("/workshop/config/contract.jsp","","dialogWidth:800px;dialogHeight:600px;center:no;help:no;resizable:no;status:no");		
	if(ret=="ok"){
		if(typeof(oElement)=="string"){
			oElement = $(oElement);
		}
		oElement.reInit();
	}
}

function createItemGrid(config)
{
	return new loadItemGrid(config);
}


/*
* ��ȡ����CI��Ϣ
* 	config����Ҫ������
* 	config.destClassId,//ѡ����������
*	config.destDataSetIds,//��ѯ��ѡ����,�����ж�����ݼ�
*	config.selectResult,//ѡ����
*	config.parentciInstanceId,//ѡ���ã���ǰʵ���ĸ�CI��ID
*	config.destStatus,//ѡ����
*	config.isMultiple,//ѡ����
*	config.isSource,//ѡ����
*	config.systemClassId,//������,
*	config.systemName,//������,
*	config.dataSetId,//������,���ݼ�Ĭ�ϵ�ǰCI���ݼ�
*	config.instanceId//������
*/
function loadItemGrid(config) {
	config.instanceId = INSTANCE_ID.value;
	config.systemClassId = getThisCiClassId();
	config.systemName = NAME.value;
	this.grid =  new Ext.data.ResultGrid({
		result 			: config.result,
		height			: config.height || 230,
		renderTo 		: config.ayTo,
		collapsible		: true,
		collapsed		: config.collapsed,
		titleCollapse	: true,
		isAllowOnlyRead : config.isAllowOnlyRead,
		resultParam 	: {
						INSTANCE_ID		: config.instanceId,
						DEST_CLASS_ID	: getParamObj('INTEGER',config.destClassId),
						VIEW_TYPE		: viewType,//�����
						STAFF_ID        : config.STAFF_ID//�����
						},
		config			: config
	});
	if(config.title)
		this.grid.setTitle(config.title);
	this.search = function() {
		this.grid.search();
		if(this.grid.isAllowOnlyRead && viewType == disabledFlag){
			var toolBar = this.grid.getTopToolbar();
			toolBar && toolBar.setDisabled(true);
		}else if(this.grid.tbarFuncMenu){
			this.grid.tbarFuncMenu.executeRule([this.grid.getTopToolbar()]);
		}
	}
}

function isSaved(){
	if(ThisForm.getFormBahavior()=="C"){
		if(QMsg("��ǰCI����Ϣδ����,������������CI,�Ƿ�Ҫ�ȱ��浱ǰCI��Ϣ?",2)==MSG_YES){
			return (top.window.frames["fraToolBar"]||parent.window.frames["fraToolBar"]).doSave(true);
		}else{
			return false;
		}
	}
	return true;
}

// ѡ��������
function selectConfigItem(grid) {
	if(isSaved()){
		ciSelectRela(grid);
	}
}

//ѡ�������ͬʱҲ����������ĸ�CI����
function selectConfigItemAndRelaParent(grid) {
	if(isSaved()){
		ciCascadeSelectRela(grid.p_grid, grid);
	}
}

// ����������
function addConfigItem(grid) {
	if(isSaved()){
		var config = grid.config; 
		var destClassId = config.destClassId;
		try{
		    destClassId = config.destClassId.split(",")[0];//���������CI�࣬Ĭ�ϴ�����һ��CI�࣬���������Ƴɽ����ѡ
		}
		catch(e) {}
		callbackFn = refresh.callback([grid]);
		doWindow_open("/workshop/form/index.jsp?callback=window.opener.callbackFn()"
								+ "&systemClassId=" + config.systemClassId
								+ "&systemName=" + encodeURIComponent(config.systemName)
								+ "&classId=" + destClassId
								+ "&dataSetId=" + config.dataSetId
								+ "&relaName=" + config.relaName //�����������CI�븸CI�Ĺ�ϵ��������������CI��������CI����ʱ���븸CI������ϵʹ��
								+ "&pInstanceId=" + config.instanceId//�������󣬱�CI��ID��������CI�ĸ�CI��ID
								+ "&isSource=" + config.isSource//��CI�Ƿ���Դ
								+"&flowId="+getFlowId()
								+"&isSync="+getIsSync()+"&isAudit="+getIsAudit()
								,undefined,undefined,'_blank');
	}
}

//�޸�������--�������ٵ��grid�Ĺ������޸İ�ť
function modifyConfigItem(grid)
{
	modifyConfigItemOpenForm(grid,1);
}

//�޸�������--˫��grid����
function modifyConfigItemDbClick(grid)
{
	if(!grid || (typeof grid.getSelectionModel != 'function'))
	{
		grid = this;
	}
	modifyConfigItemOpenForm(grid,2);
}
function modifyConfigItemOpenForm(grid,flag)
{
	callbackFn = refresh.callback([grid]);
	var row = grid.getSelectionModel().getSelected();
	if(row){
		var param = "";
		if(row.get("DATASET_ID")==3 || row.get("DATASET_ID")==5){
			param = readOnlyParam
		}else if(typeof(grid.isAllowOnlyRead)=='undefined' || grid.isAllowOnlyRead){
			param = "&hiddenToolBar="+hiddenToolBar+"&readOnly="+readOnly;
		}
		var config = grid.config;
		doWindow_open("/workshop/form/index.jsp?callback=window.opener.callbackFn()"
							+"&systemClassId=" + config.systemClassId
							+"&systemName=" + encodeURIComponent(config.systemName)
							+"&classId="+row.get("CLASS_ID")
							+"&dataSetId="+row.get("DATASET_ID")
							+"&requestId="+row.get("REQUEST_ID")
							+"&flowId="+getFlowId()
							+"&isSync="+getIsSync()+"&isAudit="+getIsAudit()
							+"&pInstanceId=" + INSTANCE_ID.value//���Լ���ID������CI��
							+param
							,undefined,undefined,'_blank');
	}
	else
	{
		if(flag==1)
			MMsg("��ѡ��һ�");
		return;
	}
}

//�鿴������
function getConfigItem(classId, dataSetId, requestId)
{
		var param = "";
		if(dataSetId==3 || dataSetId==5){
			param = readOnlyParam;
		}else{
			param = "&hiddenToolBar="+hiddenToolBar+"&readOnly="+readOnly;
		}
		doWindow_open("/workshop/form/index.jsp?callback=window.opener.callbackFn()"
							+"&classId="+classId
							+"&dataSetId="+dataSetId
							+"&requestId="+requestId
							+"&flowId="+getFlowId()
							+"&isSync="+getIsSync()+"&isAudit="+getIsAudit()
							+param
							,undefined,undefined,'_blank');
}

//ɾ��CI������ϵ
function delCiRele(grid){
	var row = grid.getSelectionModel().getSelected();
	if(row){
  		if(QMsg("ȷ��ɾ���뵱ǰCI�Ĺ�ϵ��?")==MSG_YES)
  		{
  			var sendUrl=Url+"tag=19&relaInstanceId="+row.get("RELE_INSTANCE_ID")+"&flowId="+getFlowId()+"&isSync="+getIsSync()+"&isAudit="+getIsAudit()+"&isUpdateSystemName="+(grid.config.isUpdateSystemName||'true');
		    xmlhttp.Open("POST",sendUrl,false);
		    xmlhttp.send();
		    if(isSuccess(xmlhttp))
		    {
		        grid.search();
		    }
  		}
	}else
	{
		MMsg("��ѡ��һ�");
		return;
	}
}

//��ȡ��CIʵ��ID--form_cfg����ci_operimg_cfg����ʹ��
function getParentInstanceId(){
	return window.top.getURLSearch().pInstanceId || "";
}
//��ȡ��CI�뵱ǰCI�Ĺ�ϵ��--form_cfg����ʹ��
function getRelaName(){
	return window.top.getURLSearch().relaName || "";
}
//��ȡ��CI�Ƿ���Դ--form_cfg����ʹ��
function isSource(){
	return window.top.getURLSearch().isSource;
}


//��ȡURL�еĲ���,�磺getUrlParam("systemClassId")
function getUrlParam(paramName){
	var value;
	if(window.getURLSearch())
		value = (window.getURLSearch())[paramName];
	else if(parent && parent.getURLSearch())
		value = (window.parent.getURLSearch())[paramName];
		
	if(!value)
		value = "";
	return value;
}

//��ȡ����ID
function getFlowId(){
	if(window.getURLSearch())
		flowId = window.getURLSearch().flowId;
	else if(parent && parent.getURLSearch())
		flowId = window.parent.getURLSearch().flowId;
		
	if(!flowId || flowId=="undefined")
		flowId = "";
	return flowId;
}

//��ȡģ�����CMDB��ʶ
function getModuleId(){
	if(window.getURLSearch())
		moduleId = window.getURLSearch().moduleId;
	else if(parent && parent.getURLSearch())
		moduleId = window.parent.getURLSearch().moduleId;
		
	if(!moduleId || moduleId=="undefined")
		moduleId = "";
	return moduleId;
}

//"&isSync="+getIsSync()+"&isAudit="+getIsAudit()
//��ȡURL�ϵ�isSyncMonitor����
function getIsSync(){
	var isSync;
	if(window.getURLSearch())
		isSync = window.getURLSearch().isSync;
	else if(parent && parent.getURLSearch())
		isSync = window.parent.getURLSearch().isSync;
		
	if(!isSync || isSync=="undefined")
		isSync = "";
	return isSync;
}


//��ȡURL�ϵ�isAudit����
function getIsAudit(){
	var isAudit;
	if(window.getURLSearch())
		isAudit = window.getURLSearch().isAudit;
	else if(parent && parent.getURLSearch())
		isAudit = window.parent.getURLSearch().isAudit;
		
	if(!isAudit || isAudit=="undefined")
		isAudit = "";
	return isAudit;
}
//��ȡURL�ϵ�type����
function getType(){
	var type;
	if(window.getURLSearch())
		type = window.getURLSearch().type;
	else if(parent && parent.getURLSearch())
		type = window.parent.getURLSearch().type;
		
	if(!type || type=="undefined")
		type = "";
	return type;
}
//��ȡURL�ϵ�title����
function getTitle(){
	var title;
	if(window.getURLSearch())
		title = window.getURLSearch().title;
	else if(parent && parent.getURLSearch())
		title = window.parent.getURLSearch().title;
		
	if(!title || title=="undefined")
		title = "";
	return title;
}


//��װ��ѡ�Ĳ�������
function getParamObj(type,value){
	if((type) && (value)){
		return {type:type,isMultiple:"0BT",value:value};
	}else
		return "";
}

//title��ʾ��Ϣ
function tip(value,p,record){
	return "<div ext:qtip='<div style=\"font-size:8pt;padding:3;\">"+value+"</div>' >"+value+"</div>";	
}

//��ʼ���ʲ�ҳ��ĳ�����Ϣ
function initAssetCompany(){
	assetInfo.SUPPLIERTEXT.oText = assetInfo.SUPPLIERTEXT.value;
	assetInfo.SUPPLIERTEXT.onfocus = function(){
		oCompanyName = assetInfo.SUPPLIERTEXT;
		oCompanyId = assetInfo.SUPPLIER_ID;
		assetInfo.SUPPLIERTEXT.attachEvent('onpropertychange',changeCompanyText);
			
    }
	
	assetInfo.MAINTENANCEPARTTEXT.oText = assetInfo.MAINTENANCEPARTTEXT.value;
	assetInfo.MAINTENANCEPARTTEXT.onfocus = function(){
		oCompanyName = assetInfo.MAINTENANCEPARTTEXT;
		oCompanyId = assetInfo.MAINTAINER_ID;
		assetInfo.MAINTENANCEPARTTEXT.attachEvent('onpropertychange',changeCompanyText);
	} 
}


//��ʼҳ�棺1���Ƿ���ʾά������ 2������iframe�߶� 
function iniAssetPage(){
	if(typeof(assetInfo)!="undefined"){
		assetInfo.IS_SUPPORT.checked = SUPPORTED.value=="0"?false:true;
		showSupport(assetInfo.IS_SUPPORT,SUPPORTED,assetInfo.supportCtx);
		initAssetCompany();
		IFrameResize();
	}
}
//����parentҳ��iframe�ĸ߶�
function IFrameResize(){
 	var iframe = parent.document.getElementById("mtcFrame");  //ȡ�ø�ҳ��IFrame����
 	if(iframe!=null)
 		iframe.height = this.document.body.scrollHeight;  //������ҳ����IFrame�ĸ߶�Ϊ��ҳ��ĸ߶�
}
//�����Ƿ�Ҫ��ʾά���ľ�������
function showSupport(isSupport,supported,supportCtx){
	if(isSupport.checked){
		supported.value = 1;
		supportCtx.style.display = "";
	}else{
		supported.value = 0;
		supportCtx.style.display = "none";
	}
}
//�л���ά��ҳ��(��ѡ����:���ý���Ľڵ�)
function switchToAsset(focusObj){
	oMPC.selectedIndex = assetTab.index;
	if(focusObj){
		focusObj.focus();
	}
}
//�������ݵ�׼ȷ��
function checkAssetData(){

	if(typeof(assetInfo)!="undefined"){
		/*if(!assetInfo.ASSET_ID.value) {
			switchToAsset(assetInfo.ASSET_ID);
			EMsg("�ʲ���ά����Ϣ[�̶��ʲ�����]����Ϊ��!");
			return false;
		}
		if(!assetInfo.ASSET_PRICE.value) {
			switchToAsset(assetInfo.ASSET_PRICE);
			EMsg("�ʲ���ά����Ϣ[ԭֵ]����Ϊ��!");
			return false;
		}*/
		if(assetInfo.DEPRECIATION.value && parseFloat(assetInfo.ASSET_PRICE.value) < parseFloat(assetInfo.DEPRECIATION.value)){
			switchToAsset(assetInfo.DEPRECIATION);
			EMsg("�ʲ���ά����Ϣ[�۾�]���ܴ���[ԭֵ]��");
			return false;
		}
		
		if(assetInfo.IS_SUPPORT.checked){
			
			if(!checkDate()){
				return false;
			}
		}
		
		
		//assetInfo.SUPPLIERTEXT.detachEvent("onpropertychange",changeCompanyText);
		if(assetInfo.SUPPLIERTEXT.value!= assetInfo.SUPPLIERTEXT.oText){
			assetInfo.SUPPLIER_ID.value = "";
			assetInfo.SUPPLIERTEXT.value = "";
		}
		
		//assetInfo.MAINTENANCEPARTTEXT.detachEvent("onpropertychange",changeCompanyText);
		if(assetInfo.MAINTENANCEPARTTEXT.value!= assetInfo.MAINTENANCEPARTTEXT.oText){
			assetInfo.MAINTENANCEPARTTEXT.value = "";
			assetInfo.MAINTENANCEPARTTEXT.value = "";
		}
	}
	return true;
}
//�����ж���Ƚ�
function checkDate(){
	/*if(!assetInfo.RECEIVED_DATED.value) {
		switchToAsset(assetInfo.RECEIVED_DATED);
		EMsg("�ʲ���ά����Ϣ[��������]����Ϊ��!");
		return false;
	}*/
	/*if(!assetInfo.INSTALL_DATE.value) {
		switchToAsset(assetInfo.INSTALL_DATE);
		EMsg("�ʲ���ά����Ϣ[��װ����]����Ϊ��!");
		return false;
	}*/
	/*if(!assetInfo.AVAILABLE_DATE.value) {
		switchToAsset(assetInfo.AVAILABLE_DATE);
		EMsg("�ʲ���ά����Ϣ[��������]����Ϊ��!");
		return false;
	}*/
	if(!assetInfo.MAINTAIN_LIMIT.value) {
		switchToAsset(assetInfo.MAINTAIN_LIMIT);
		EMsg("�ʲ���ά����Ϣ[ά����������]����Ϊ��!");
		return false;
	}
	/*if(!assetInfo.DISPOSAL_DATE.value) {
		EMsg("�������ڲ���Ϊ��!");
		assetInfo.DISPOSAL_DATE.focus();
		return false;
	}*/
	//��������<��װ����<��������<ά����������<��������(����Ϊ��,�վͲ��Ƚϣ��ǿ�Ҫ�Ƚ�)
	var dateObjs = [assetInfo.RECEIVED_DATED,assetInfo.INSTALL_DATE,assetInfo.AVAILABLE_DATE,assetInfo.MAINTAIN_LIMIT,assetInfo.DISPOSAL_DATE];
	var names = ["��������","��װ����","��������","ά����������","��������"];
	for(var i=0;i<dateObjs.length-1;i++){
		for(var j=i+1;j<dateObjs.length;j++){
			if(!comparDate(dateObjs[i],dateObjs[j],names[i]+"���ܴ���"+names[j])){
				return false;
			}
		}
	}
	return true;
}
//�Ƚ�����
function comparDate(beginDateObj,endDateObj,msg){
	if(!beginDateObj.value || !endDateObj.value)
		return true;
	if(beginDateObj.value > endDateObj.value){
		switchToAsset(beginDateObj);
		EMsg(msg);
		return false;
	}
	return true;
}

/*
ת��ֵ,
	value:��Ҫת����ֵ
	unit:ת����λ(K,M,G,T,P)
	flag:ת�����(*:��,/:��)
	digit:����С����λ��
��������λתB��������:transformValue("1.5","G","*")
��Bת������λ��������:transformValue("1015156782.345678","G","/","2")
*/
function transformValue(value,unit,flag,digit){
	var pValue = value;
	var pDigit = digit || 2;
	var byteDigit=0;
	if(!pValue){
		return pValue;
	}
	try{
		pValue = parseFloat(pValue);
	}
	catch(e){
		EMsg("�����ֵ����!")
	}
	try{
		pDigit = parseInt(pDigit);
	}
	catch(e){
		EMsg("����ı���С����λ��ֵ����!")
	}
	if(flag=="*"){
		switch(unit){
			case "K" : {return Math.round((pValue*1024).toFixed(byteDigit)*100)/100; break;}
			case "M" : {return Math.round((pValue*1024*1024).toFixed(byteDigit)*100)/100; break;}
			case "G" : {return Math.round((pValue*1024*1024*1024).toFixed(byteDigit)*100)/100; break;}
			case "T" : {return Math.round((pValue*1024*1024*1024*1024).toFixed(byteDigit)*100)/100; break;}
			case "P" : {return Math.round((pValue*1024*1024*1024*1024*1024).toFixed(byteDigit)*100)/100; break;}
		}
	}else if(flag=="/"){
		switch(unit){
			case "K" : {return Math.round((pValue/1024).toFixed(pDigit)*100)/100; break;}
			case "M" : {return Math.round((pValue/1024/1024).toFixed(pDigit)*100)/100; break;}
			case "G" : {return Math.round((pValue/1024/1024/1024).toFixed(pDigit)*100)/100; break;}
			case "T" : {return Math.round((pValue/1024/1024/1024/1024).toFixed(pDigit)*100)/100; break;}
			case "P" : {return Math.round((pValue/1024/1024/1024/1024/1024).toFixed(pDigit)*100)/100; break;}
		}
	}
	return pValue;
}

//ȥ�ո�
function StrTrim(str) {
    var m = str.match(/^\s*(\S+(\s+\S+)*)\s*$/);
    return (m == null) ? "" : m[1];  
}
//������֤
function mailchk(str){
	var pattern = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;  
���� var flag = pattern.test(str);  
    if(flag){
		return true;
	}
	else{
		return false;
	}
}

//������ѯ��ؿ�ʼ
var gridDiv;
function createGrid()
{
	gridDiv = event.srcElement;
	Ext.onReady(iniExt);
	createGrid = function(){};
}
function iniExt()
{
	var instanceId=document.getElementById("INSTANCE_ID").value;
	var param = new Object();
	param.INSTANCE_ID = instanceId||-1;
	var grid = new Ext.data.ResultGrid({
		result		: 100002100,
		resultParam	: param,
		border      : false,
		width		: gridDiv.clientWidth-10,
		height		: gridDiv.clientHeight,
		renderTo	: gridDiv,
		dblclick	: function()
					{
						CIdetail(grid);
					}
	});
	//grid.on("dblclick",CIdetail,grid);
	grid.search();
}
//������ѯ��ؽ���
//����������ؿ�ʼ
var flowGridDiv;
function createFlowGrid()
{
	flowGridDiv = event.srcElement;
	Ext.onReady(createRelaFlow);
	createFlowGrid = function(){};
}
function createRelaFlow()
{
	var instanceId=document.getElementById("INSTANCE_ID").value;
	var param = new Object();
	param.INSTANCE_ID = instanceId||-1;
	var grid = new Ext.data.ResultGrid({
		result		: 100002068,
		resultParam	: param,
		border      : false,
		width		: flowGridDiv.clientWidth-10,
		height		: flowGridDiv.clientHeight,
		renderTo	: flowGridDiv,
		dblclick	: function()
					{
						openFlow(grid);
					}
	});
	//grid.on("dblclick",CIdetail,grid);
	grid.search();
}

function openFlow(grid){
	var row = grid.getSelectionModel().getSelected();
	if(row){
		window.showModalDialog("/workshop/form/index.jsp?flowId="+row.get("FLOW_ID")+"&fullscreen=yes",window,
                         "dialogWidth:"+window.screen.width+"px;dialogHeight:"+window.screen.height +"px;center:no;help:no;resizable:no;status:no");
	}
}
//������ѯ��ؽ���
//©����Ϣ��ؿ�ʼ
var buginfoGridDiv;
function createBugInfoGrid()
{
	buginfoGridDiv = event.srcElement;
	Ext.onReady(createBugInfo);
	createBugInfoGrid = function(){};
}
function createBugInfo()
{
	var instanceId=document.getElementById("INSTANCE_ID").value;
	var param = new Object();
	param.INSTANCE_ID = instanceId||-1;
	var grid = new Ext.data.ResultGrid({
		result		: 100002514,
		resultParam	: param,
		border      : false,
		width		: buginfoGridDiv.clientWidth-10,
		height		: buginfoGridDiv.clientHeight,
		renderTo	: buginfoGridDiv,
		changeState : function(state){
			var rows = this.getSelectionModel().getSelections();
			var bugIds = "";
			if(rows.length!=0){
				for (var i=0;i<rows.length;i++){
					if(i==0){
						bugIds=rows[i].get("BUG_ID");
                    } else{
						bugIds=bugIds+","+rows[i].get("BUG_ID");
                    }
				}
				var sendUrl=Url+"tag=71&ids="+bugIds+"&state="+encodeURIComponent(state);
				xmlhttp.Open("POST",sendUrl,false);
				xmlhttp.send();
				if(isSuccess(xmlhttp)){
				    this.search();
				}
			}
		},
		repair:function(){
			this.changeState("���޸�");
		},
		unrepair:function(){
			this.changeState("δ�޸�");
		}
	});
	grid.search();
}

function repairBug(grid){
	grid.repair();
}
function unRepairBug(grid){
	grid.unrepair();
}
//©����Ϣ��ؽ���


//���ض���������
var isLoadRelaList = true;
function  loadRelaList(){
	if(isLoadRelaList){
		relaListIcon.src = "/resource/image/arrow_expanded.gif";
		loadMask(document.body);
		relaList.style.display = "";
		wait.show();
		(searchRelaList).defer(30);
		
	}else{
		if(relaList.style.display=="none"){
			relaListIcon.src = "/resource/image/arrow_expanded.gif";
			relaList.style.display = "";
		}else{
			relaListIcon.src = "/resource/image/arrow1.gif";
			relaList.style.display = "none";
		}
	}
}


var isLoadSecondItemsList = true;
function  loadSecondItemsList(){
	if(isLoadSecondItemsList){
		loadMask(document.body);
		secondItemsListIcon.src = "/resource/image/arrow_expanded.gif";
		secondItemsList.style.display = "";
		wait.show();
		(searchSecondItems).defer(30);
	}else{
		if(secondItemsList.style.display=="none"){
			secondItemsList.style.display = "";
			secondItemsListIcon.src = "/resource/image/arrow_expanded.gif";
		}else{
			secondItemsList.style.display = "none";
			secondItemsListIcon.src = "/resource/image/arrow1.gif";
		}
	}
}

//���ز���ʾ�����ԣ�����Ԫ����Ҫ��������Ϊdisplay
function displayElements(){
	var displays = document.getElementsByName("display");
	for(var i=0;i<displays.length;i++){
		displays[i].style.display = "none";
	}
}

//ͼ���Ƿ���ʾ����
function imgiconToggle(){
	hiddenToolBar = window.parent.getURLSearch().hiddenToolBar;
	readOnly = window.parent.getURLSearch().readOnly;
	itemId = window.parent.getURLSearch().itemId;
	dataSetId = window.parent.getURLSearch().dataSetId;
	var read = readOnly||hiddenToolBar;
	if(read && read=='y'){
		viewType = "show";
	}
	if(viewType == disabledFlag){
		//����ͼ��
		var imgs = document.getElementsByName("oper_img");
		for(var i=0;i<imgs.length;i++){
			imgs[i].style.display = "none";
		}
		var iframary = document.getElementsByTagName("iframe");
		for (var i = 0; i < iframary.length; i++) {
			var iwin = (iframary[i]).contentWindow;
			var imgs2 = iwin.document.getElementsByName("oper_img");
			for(var y=0;y<imgs2.length;y++){
				imgs2[y].style.display = "none";
			}
		}
	}
}
//�ڹ�ϵ�Ĳ�����ť����׷����հ�ť
function appendDelImg(node){
	if(viewType != disabledFlag){//������ֻ��������²�׷��
      var delImg = document.createElement("IMG");
      delImg.src = "/resource/image/ico/del.gif";
      delImg.className = "delImg";
      delImg.style.display = node.style.display;
      if(node.parentNode)    //�������˫�׽��
      {
         if(node.nextSibling)  //���������һ�ӽ��
         {
            //ǰ�����ӽ��
			node.parentNode.insertBefore(delImg, node.nextSibling);
         }else  //���û����һ�ӽ��
            //��׷���ӽ��
         {
             //var oLabel =  document.createElement("LABEL");
             //oLabel.innerText = " ";
             //node.parentNode.appendChild(oLabel);
             node.parentNode.appendChild(delImg);
         }
      }
   }
}
//��չ�ϵDIV��hidden������
function clearDiv(idArray) {
	if(idArray){ 
		if(idArray.length && idArray.length>0){
			for(var i=0;i<idArray.length;i++){
				if(idArray[i]){
					idObj_id = idArray[i].id;//���CI��INSTANCE_IDֵ��hiddenԪ�ص�id
					nameObj_id = idArray[i].name;//���CI��SHORT_DESCRIPTIONֵ��divԪ�ص�id
					if(idObj_id && $(idObj_id))
						$(idObj_id).value = "";
					if(nameObj_id && $(nameObj_id)){
						$(nameObj_id).innerHTML = "";
						relationobj[nameObj_id] = "";
						selectStoreDates[nameObj_id] = ""; 
					}
				}
			}
		}
	}
}


//��������DIV����հ�ť�����Ҹ���onclick����
function findClearImgAndInit(node,divIdArray) {
	var nextNode = node.nextSibling;
	if(nextNode){
		if(nextNode.tagName=="IMG" && nextNode.className=="delImg"){
			nextNode.onclick = function(){clearDiv(divIdArray)}
		}else{
			findClearImgAndInit(nextNode,divIdArray);
		}
	}else{
		return;
	}
}

function setElementInit()
{
	setCateLevelInit();
	iniAssetPage();
	companyModelInit();//?
	if($("MODEL_ID")){
		modelIdByText = $("MODEL_ID").value;
		getModelHeight();
	}
	
}

function companyModelInit(){
	//�����ͺ�����
	if($("MANUFACTURER_ID") && $("MODEL_ID")){
		MANUFACTURER_ID.onchange = function(){manufacturerChanageFn($("MANUFACTURER_ID"),$("ITEM"),$("MODEL_ID"));}
		if(MANUFACTURER_ID.value!=""){
		    MANUFACTURER_ID.onchange();
		}
	}
	
	//CI���ͳ����ͺ�����
	if($("ITEM") && $("MANUFACTURER_ID") && $("MODEL_ID")){
		ITEM.onchange = function(){
            manufacturerChanageFn($("MANUFACTURER_ID"),$("ITEM"),$("MODEL_ID"));

            if (changeBusiSystem && changeBusiSystem instanceof Function) {
                changeBusiSystem(true);
            }
        }
		if(MANUFACTURER_ID.value!=""){
		    ITEM.onchange();
		}
	}
	
	if($("MODEL_ID")){
		MODEL_ID.value = oTable.CI_BASE_ELEMENT.MODEL_ID.DEFAULT_VALUE;
	}
	//CI������ʱ���浽companyParams,�����̽���ʹ��
	var item = $("ITEM");
	if(item){
		companyParams.itemText = item.options[item.selectedIndex].text;
		companyParams.itemValue = item.value;
	}
}


function initPage(){
	STAFF_ID = getCurrentStaffId();
	imgiconToggle();
	loadOperImgCfg();
	displayElements();
	if(ThisForm.getFormBahavior()!="C"){
		queryRelations();
		showReconcileCi();
	}
	
	if($("REGION_ID") && $("SEARCH_CODE")){
		REGION_ID.onResultChange = regionChange;
		setReportOnlyCode();
	}
	
	if($("COLL_MODEL")){
		COLL_MODEL.onchange = collModelChange;
		collModelChange();
	}
	
	if($("MANUFACTURER_TEXT")){
		MANUFACTURER_TEXT.oText = MANUFACTURER_TEXT.value;
		MANUFACTURER_TEXT.onfocus = function(){
			oCompanyId = MANUFACTURER_ID;
			oCompanyName = MANUFACTURER_TEXT;
			MANUFACTURER_TEXT.attachEvent('onpropertychange',changeCompanyText);
		}; 
	}
	
	if($("MODEL_TEXT")){
		MODEL_TEXT.oText = MODEL_TEXT.value;
		MODEL_TEXT.onclick = function(){
			oCompanyId = MODEL_ID;
			oCompanyName = MODEL_TEXT;
			changeModelText();
		}; 
		MODEL_TEXT.onfocus = function(){
			oCompanyId = MODEL_ID;
			oCompanyName = MODEL_TEXT;
			MODEL_TEXT.attachEvent('onpropertychange',changeModelText);
		}; 
		MODEL_TEXT.onblur=companyInputBlur;
	}
	initRelation();
	
	var version = $getSysVar("CMDB_VERSION");
	var trs = document.getElementsByTagName("TR");
	var divs = document.getElementsByTagName("DIV");
	
	var objs = new Array();
	for(var c=0,obj; obj=trs[c]; c++) {
		objs.push(obj);
	}
	for(var c=0,obj; obj=divs[c]; c++) {
		objs.push(obj);
	}
	
	for(var c=0,obj; obj=objs[c]; c++) {
		if(obj.getAttribute('version')){
			if(obj.getAttribute('version')==version){
				obj.style.display='';
			}else{
				obj.style.display='none';
				
			}
		}
	}
}


//�ɼ�ģʽ��change�¼�
function collModelChange(){
	if($("COLL_POINT"))
		append_coll_x("collPoint_X",COLL_POINT);
	if($("COLL_USER"))
		append_coll_x("collUser_X",COLL_USER);
	if($("COLL_PASSWORD"))
		append_coll_x("collPasswd_X",COLL_PASSWORD);
}
//�ڲɼ����ԵĽڵ������ϱ�����Ǻ�
function append_coll_x(coll_node_x_id,coll_node){
	var collModelValue = COLL_MODEL.value;
	var coll_node_x = document.getElementById(coll_node_x_id);
	if(collModelValue=='telnet' || collModelValue=='ssh'){
		if(!coll_node_x){
			var TD = coll_node.parentNode;
			if(TD){
				var nextTD = TD.nextSibling;
				if(nextTD){
					coll_node_x = document.createElement("SPAN");
					coll_node_x.id = coll_node_x_id;
					coll_node_x.className = "required";
					coll_node_x.innerText = "*"
					nextTD.appendChild(coll_node_x);
		        }
		    }
	    }else{
	    	coll_node_x.style.display = "";
	    }
	}else{
		if(coll_node_x){
			coll_node_x.style.display = "none";
		}
	}
}

function regionChange(){
	//�ı�search_code;
	var sql = "select pkp_cmdb_config.getcisearchcode("+REGION_ID.value+","+getThisCiClassId()+",'"+INSTANCE_ID.value+"') RESULT from dual";
	xmlhttp.Open("POST","/servlet/commonservlet?tag=201&paramValue="+getAESEncode(encodeURIComponent(sql)),false);
	xmlhttp.send();
	var dataXML=xmlhttp.responseXML
	var oRows = dataXML.selectNodes("/root/rowSet");
	if(oRows[0]){
		SEARCH_CODE.value=oRows[0].selectSingleNode("RESULT").text;
	}

	setReportOnlyCode();
}

//��REPORT_ONLY_CODE��ֵ
function setReportOnlyCode(){
	if(ThisForm.getFormBahavior()=="C"){ 
		if($("historyInfo") && historyInfo.REPORT_ONLY_CODE) {
			historyInfo.REPORT_ONLY_CODE.value = SEARCH_CODE.value;
		}
	}
}

	
function queryRelations(xmlDoc){
	  var objs=getRelaDoms();
	  if(!xmlDoc){
		var instid = $("INSTANCE_ID").value;
		  xmlhttp.Open("POST",Url+"tag=30&instanceId="+instid+"&destClassIds="+objs.relaClassIds,false)
		  xmlhttp.send();
		  var  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
          xmlDoc.load(xmlhttp.responseXML);
	  }
	var oRows = xmlDoc.selectNodes("/root/rowSet");
	for(var i=0; i<oRows.length; i++)
   	{
   		var row = oRows[i];
   		var RELA_ID		= row.selectSingleNode("RELA_ID").text;//ci_base_relationship ���е�id
		var CI_NAME		= row.selectSingleNode("CI_NAME").text;
		var INSTANCE_ID	= row.selectSingleNode("INSTANCE_ID").text;
		var CLASS_ID	= row.selectSingleNode("CLASS_ID").text;
		var SUPER_CLASS_ID	= row.selectSingleNode("SUPER_CLASS_ID").text;
		var DATASET_ID	= row.selectSingleNode("DATASET_ID").text;
		var REQUEST_ID	= row.selectSingleNode("REQUEST_ID").text;
		var RELA_NAME	= row.selectSingleNode("RELA_NAME").text;
		
   		var PCI_INSTANCE_ID	= row.selectSingleNode("PCI_INSTANCE_ID").text;//
   		var PCI_NAME	= row.selectSingleNode("PCI_NAME").text;//
		var PCI_CLASS_ID	= row.selectSingleNode("PCI_CLASS_ID").text;
		var PCI_DATASET_ID	= row.selectSingleNode("PCI_DATASET_ID").text;
		var PCI_REQUEST_ID	= row.selectSingleNode("PCI_REQUEST_ID").text;
		
		var ISSOURCE	= row.selectSingleNode("ISSOURCE").text;//�Ƿ���Դ���Ա�ѡCI��˵��
		
		for(var c=0,obj; obj=objs[c]; c++) {
			var relaName = obj.getAttribute("relaName");
			var isSource = obj.getAttribute("isSource");
			var a = relaName.split("=");
			if(a[0]==RELA_NAME && ((a[1].indexOf('-'+CLASS_ID+'-'))>-1 || (a[1].indexOf('-'+SUPER_CLASS_ID+'-'))>-1) && (!isSource || isSource==ISSOURCE)) {
				//��ϵ��ʼ��
				var isNameUrl = obj.getAttribute("isNameUrl");
				var oldHtml = obj.innerHTML;
				html = (isNameUrl=="true") ? ("<a href=\"#\" onClick=\"getConfigItem("+ CLASS_ID + ","+ DATASET_ID + ",'"+ REQUEST_ID +"')\" title=\"�����<"+ CI_NAME +">��ϸ��Ϣ\"><font color=\"#0000FF\">"+CI_NAME  +"</font></a>") : CI_NAME;
				obj.innerHTML = (!oldHtml) ? html : (oldHtml + ',' + html);
				
				//�������й�ϵ
				bakOldRela(obj.id, RELA_ID+':'+INSTANCE_ID);
				if(!selectStoreDates[obj.id]){
					selectStoreDates[obj.id] = [];
				}
				
				selectStoreDates[obj.id].push({"INSTANCE_ID":INSTANCE_ID,"SHORT_DESCRIPTION":CI_NAME,"leftRow":{"INSTANCE_ID":PCI_INSTANCE_ID,"SHORT_DESCRIPTION":PCI_NAME,"REQUEST_ID":PCI_REQUEST_ID,"DATASET_ID":PCI_DATASET_ID,"CLASS_ID":PCI_CLASS_ID},"rightRow":{"INSTANCE_ID":INSTANCE_ID,"SHORT_DESCRIPTION":CI_NAME,"REQUEST_ID":REQUEST_ID,"DATASET_ID":DATASET_ID,"CLASS_ID":CLASS_ID}});
				
				//����ϵ�����еĸ�CI��ʼ��
				var pCiObj = $('parentci_'+obj.id)// ȡ��CI
				if(pCiObj && PCI_REQUEST_ID) {
					var pisNameUrl = pCiObj.getAttribute("isNameUrl");
					pCiObj.innerHTML = (pisNameUrl=="true") ? ("<a href=\"#\" onClick=\"getConfigItem("+ PCI_CLASS_ID + ","+ PCI_DATASET_ID + ",'"+ PCI_REQUEST_ID +"')\" title=\"�����<"+ PCI_NAME +">��ϸ��Ϣ\"><font color=\"#0000FF\">"+PCI_NAME  +"</font></a>"):PCI_NAME;
				}
			}
		}
	}
	//��iframe�еĹ�ϵ��ʼ��֮������
	var iframary = document.getElementsByTagName("iframe");
	for (var i = 0; i < iframary.length; i++) {
		var iwin = (iframary[i]).contentWindow;
		if(iwin.queryRelations)
			iwin.queryRelations(xmlDoc);
	}

}
//�����еĹ�ϵ���ݳ������������ύʱ�����бȽϣ���������Щ��ϵ��Ҫɾ������Щ��Ҫ���
function bakOldRela(id, relaStr){
	var initRela = initRelDoms[id];
	initRela = (initRela ? initRela+'|' : '');
	initRelDoms[id] = initRela + relaStr;
}

function manufacturerChanageFn(company,item,model){
	if(model && model.tagName == 'SELECT'){
		var sqlstr="SELECT AM.ASSET_MODEL_ID,AM.MODEL FROM ASSET_MODEL AM WHERE AM.COMPANY_ID="+company.value+" AND AM.CATEGORY_ID="+item.value+" AND AM.MARKASDELETED='0BF'";
		xmlhttp.Open("POST","/servlet/commonservlet?tag=201&paramValue="+getAESEncode(encodeURIComponent(sqlstr)),false);
		xmlhttp.send();
		var dataXML=xmlhttp.responseXML;
		model.options.length=0;
		var oRows = dataXML.selectNodes("/root/rowSet");
		for(var i=0; i<oRows.length; i++)
	   	{
		    var oOption = document.createElement("OPTION");
			oOption.value =oRows[i].selectSingleNode("ASSET_MODEL_ID").text;
			oOption.text = oRows[i].selectSingleNode("MODEL").text;	
			model.options.add(oOption);
		}
	}
}

function execute(tag,sql,callbackFn){
	if(!wait){
		loadMask(document.body);
	}
	wait.show();
	(function(){
		xmlhttp.Open("POST","/servlet/commonservlet?tag="+tag+"&sql="+sql,false);
		xmlhttp.send();
		if(typeof(callbackFn) == "function")
			callbackFn();
		wait.hide();
	}).defer(0);
}


function getRelaDoms(){
	var divels = document.getElementsByTagName("div");
	var objs = [];
	var relaClassIds = "937,900000500";//��ʼ��Ϊά���еĺ�ͬ����Ϊiframe�еĹ�ϵ��Ŀǰֻ�к�ͬһ��
	for (var o = 0; o < divels.length; o++) {
		var em = divels[o].getAttribute("relaName");
		if (em) {
			objs.push(divels[o])
			var tmp = em.split("-");
			for(var i=1,c; c=tmp[i]; i++){
				relaClassIds += ","+c;
			}
		}
	}
	objs.relaClassIds = relaClassIds; 
	/*��iframe�еĹ�ϵ��ʼ��֮����һ���������⣬��Ҫ���޸�CiSelect�е����ݣ�
	 * var iframary = document.getElementsByTagName("iframe");
	for (var i = 0; i < iframary.length; i++) {
		var iwin = (iframary[i]).contentWindow;
		var divels2 = iwin.document.getElementsByTagName("div");
		for (var o = 0; o < divels2.length; o++) {
			var em = divels2[o].getAttribute("relaName");
			if (em) {
				objs.push(divels2[o])
			}
		}
	}*/
	return objs;
}

//�鿴ci�澯�����Ϣ����б�
function getShortCiAlarmList(instance_id,config_instance_id){

        isFocusShowAlist();
        var sendUrl="/servlet/alarmMergeServlet?tag=90&instance_id="+instance_id+"&config_instance_id="+config_instance_id;
		xmlhttp.Open("POST",sendUrl,false);
		xmlhttp.send();
        var  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.load(xmlhttp.responseXML);
        var rowSets = xmlDoc.selectNodes("/root/rowSet");
        var tempTable = '<table width="100%" border="1" cellspacing="0" bordercolorlight="#333333" bordercolordark="#efefef">';
        tempTable += '<tr height="30" class="alarmTableTitle"><td align="center">�澯����</td><td align="center">KPI</td><td align="center">KPIֵ</td><td width="60" align="center">�澯����</td><td width="60" align="center">�澯����</td><td width="136" align="center">����ʱ��</td></tr>';
        for(var i = 0 ;rowSets!=null&&i<rowSets.length;i++){
			  var ne_alarm_list_id = rowSets[i].selectSingleNode("NE_ALARM_LIST_ID").text;
			  var kpi_name = rowSets[i].selectSingleNode("KPI_NAME").text;
			  var kpi_value = rowSets[i].selectSingleNode("KPI_VALUE").text;
			  var alarm_title = rowSets[i].selectSingleNode("ALARM_TITLE").text;
			  var alarm_level = rowSets[i].selectSingleNode("ALARM_LEVEL").text;
			  var alarm_times = rowSets[i].selectSingleNode("ALARM_TIMES").text;
			  var create_time = rowSets[i].selectSingleNode("CREATE_TIME").text;
			  
			  var tempTr;
			  if((i+1)%2==0){
			  	tempTr = '<tr class="alarmTableTr1" onmouseover="this.style.backgroundColor=\'#CCCCCC\'" onmouseout="this.style.backgroundColor=\'#ffffff\'">';
			  }else{
			  	tempTr = '<tr class="alarmTableTr2" onmouseover="this.style.backgroundColor=\'#CCCCCC\'" onmouseout="this.style.backgroundColor=\'#f1f6f9\'">';
			  }
			  tempTr = tempTr +'<td><a href="#" style="text-decoration:underline; color:blue" onclick="getCIAlarmDetail('+ne_alarm_list_id+')">'+alarm_title+'</a></td>';
			  tempTr = tempTr +'<td>'+kpi_name||'&nbsp;'+'</td>';
			  tempTr = tempTr +'<td>'+kpi_value||'&nbsp;'+'</td>';
			  tempTr = tempTr +'<td align="center">'+alarm_level||'&nbsp;'+'</td>';
			  tempTr = tempTr +'<td align="center">'+alarm_times||'&nbsp;'+'</td>';
			  tempTr = tempTr +'<td align="center">'+create_time||'&nbsp;'+'</td>';          
			  tempTr = tempTr +'</tr>';
			  tempTable = tempTable + tempTr;
        }
       tempTable = tempTable + '</table>';
        var show_alarm_list = document.getElementById("show_alarm_list");
        
        var list_top = document.body.scrollTop+event.clientY-10;
		//var list_left = document.body.scrollLeft+event.clientX;//ֱ�Ӷ���50px��������
		var list_left = 50;
		var list_height = parseInt((show_alarm_list.style.height).replace("px",""),10);
		
		var j = event.clientY + list_height - window.document.body.offsetHeight;//�������λ��+������div�ĸ�-��ҳ�ɼ���
        if(j>0){
        	list_top = list_top-list_height-30;
        }
        show_alarm_list.style.top = list_top;
        show_alarm_list.style.left = list_left;
        show_alarm_list.style.position="absolute"; 
        show_alarm_list.style.display="block"; //div3��ʼ״̬�ǲ��ɼ��ģ����ÿ�Ϊ�ɼ�
       
        
		show_alarm_list.innerHTML=tempTable;
		show_alarm_list.onmouseleave= function(){
		   var show_alarm_list = document.getElementById("show_alarm_list");   
	       show_alarm_list.style.display="none";
		   isFocus=false;
		}
}

function setFocus(){
    isFocus = true;
}
//����ƶ�����Ӧ����
function moveToTD(instance_id,config_instance_id){ 
	getShortCiAlarmList(instance_id,config_instance_id);
}

//��ȡci�澯�б�
function getCiAlarmList(instance_id){
    window.open ("/workshop/alarmManage/alarmMergeList.htm?neId="+instance_id,'','height=400,width=700,top=100,left=100,resizable=yes,toolbar=no,menubar=no,scrollbars=yes,location=no, status=no');    
}

//��ȡci�澯��ϸ��Ϣ
function getCIAlarmDetail(alarmId){
  window.open("/workshop/alarmManage/viewAlarmInfo.htm?alarmId="+alarmId,'_blank',"resizable=1;top=0;left=0;help=0;scroll=0;status=0;");
}

//�澯�б�div�Ƿ���ʾ
function isFocusShowAlist(){
   
      var show_alarm_list = document.getElementById("show_alarm_list");   
      if(!isFocus){
	   show_alarm_list.style.display="none";
	  }
}

//��ؼ����������
var isLoadMonitorSecondItemsList = true;
function  loadMonitorSecondItemsList(){
	if(isLoadMonitorSecondItemsList){
		loadMask(document.body);
		monitorSecondItemsList.style.display = "";
		wait.show();
		(searchMointorSecondItems).defer(30);
	}else{
		if(monitorSecondItemsList.style.display=="none"){
			monitorSecondItemsList.style.display = "";
		}
	}
}


//���ļ�
function openField(filename){ 

  // document.all.downWin.src = '/servlet/downloadservlet?action=1&fullPath='+encodeURI(filePath)+'&filename='+encodeURI(filename);
   document.all.downWin.src = '/servlet/downloadservlet?pathname=/monitor/'+encodeURI(filename)+'&filename='+encodeURI(filename);
 //  window.open('d:/aa.html');
}

function openQuery(instance_id){
	var result;
	switch(getThisCiClassId()){
		case "100102" : {result = 100002700;break;}//aix������־�ļ�
		case "100105" : {result = 100002701;break;}//linux������־�ļ�
		case "100101" : {result = 100002702;break;}//hpunix������־�ļ�
		case "200402" : {result = 100002703;break;}//WEBLOGIC ��־�ļ�
		case "115" : {result = 100002703;break;}//WEBLOGIC���� ��־�ļ�
		case "108" : {result = 100002704;break;}//oracleʵ�� ��־�ļ�
	}
	var src = '/workshop/query/show_result.html?result='+result+'&INSTANCE_ID='+instance_id;
	doWindow_open(src);
}

//��ػ�ȡ����IP��ַ
function getMonitorIp(computerId){
        var sendUrl=Url+"tag=21&computerId="+computerId;
		xmlhttp.Open("POST",sendUrl,false);
		xmlhttp.send();
        var  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.load(xmlhttp.responseXML);
        var rowSets = xmlDoc.selectNodes("/root/rowSet");
        if(rowSets!=null&&rowSets.length>0){
         SERVICE_IP.value=rowSets[0].selectSingleNode("COLL_IP").text;
        }
}

//�ж��Ƿ������ͬ��ip������
function isSameIpOrName(instance_id,class_id,short_description,ip){

        var sendUrl=Url+"tag=22&class_id="+class_id+"&short_description="+encodeURI(short_description)+"&ip="+ip+"&instance_id="+instance_id;
		xmlhttp.Open("POST",sendUrl,false);
		xmlhttp.send();
        var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.load(xmlhttp.responseXML);
        var rowSets = xmlDoc.selectNodes("/root/rowSet");
        var ret="";
        if(rowSets!=null){ 
          if(rowSets.length>1){
                  var count_num = rowSets[rowSets.length-1].selectSingleNode("COUNT_NUM").text;
                  if(count_num>0){
                    ret="Ŀǰͬһ��CI���Ѿ����� "+count_num+" ����ͬ\"��Ԫ����\"�ļ�¼";
                  }               
                  var str = "";
                  for(var i=0;i<=rowSets.length-2;i++){
                     str= str + '"'+rowSets[i].selectSingleNode("SHORT_DESCRIPTION").text+'"';
                     str=str+",";
                  } 
                   str=str.substring(0,str.length-1);
                   switch(parseInt(class_id)){
                     
                     case 142:
                          ret+="\nĿǰͬһ��CI�� "+str+'����ͬ��"Ŀ��IP��ַ"';
                          break;
                     case 100101:
                     case 100102:
                     case 100103:
                     case 100104:
                     case 100105:
                     case 100106:
                     case 100107:
                        ret+="\nĿǰͬһ��CI�� "+str+'����ͬ��"����IP��ַ"';
                        break;
                     case 127:
                     case 126:
                     case 1101:
                     case 1102:
                     case 1103:
                        ret+="\nĿǰͬһ��CI�� "+str+'����ͬ��"�豸�����ַ"';
                        break;
                     case 108:
                     case 200202:
                     case 200203:
                     case 200204:
                     case 200205:
                     case 200206:
                     case 200401:
                     case 200404:
                     case 200405:
                         ret+="\nĿǰͬһ��CI�� "+str+'����ͬ��"IP��ַ"';
                         break;
                     case 115:
                          ret+="\nĿǰͬһ��CI�� "+str+'����ͬ��"������ַ"';
                          break;
                     case 93:
                     case 300605:
                          ret+="\nĿǰͬһ��CI�� "+str+'����ͬ��"��������IP"';
                          break;
                   }
         }
         else{
         	if(rowSets.length==1){
	            var count_num = rowSets[rowSets.length-1].selectSingleNode("COUNT_NUM").text;
				if(count_num>0){
					ret="Ŀǰͬһ��CI���Ѿ����� "+count_num+" ��ͬ\"��Ԫ����\"�ļ�¼";
				}
         	}
         }
       }
       
        return ret;
}


//��ȡ��Ԫ�ڵ��itemId
function getItemId(){
	if(!itemId || itemId=="undefined")
		itemId = ""
   return itemId;
}
//��ȡ��Ԫ�ڵ��Ĭ�ϲɼ�����
function getDefaultAgent(){
    var agent_instance_id = defaultAgent.value;
    return agent_instance_id;
}

//��ȡ��Ԫ�ڵ�Ĺ���ģ��
function getRuleTemplateId(){
   var ruleTemplateId=ruleID.value;
   return ruleTemplateId;
}
//ѡ����Ԫ����ģ��
function ruleChoice(){
	var params = new Object();
	params.ruleName=ruleName.value;
	params.neTypeId = CLASS_ID.value;
	params.class_id = getThisCiClassId();
	params.ruleID=RULE_ID.value;	
	//��ѯ��Ԫ����
	var selectedRule = window.showModalDialog("/workshop/config/choiceRuleTemplate.html",params,"dialogWidth=750px;dialogHeight=580px;help=0;scroll=0;status=0;");
	if(selectedRule!=null){
		ruleName.value=selectedRule.ruleName;
		RULE_ID.value=selectedRule.ruleID;
	}
}
//�޸���Ԫʱ��ȡĬ�ϲɼ�����ֵ
function getEditAgentId(){

      var sendUrl="/servlet/NECustomViewAction?action=46&source_instance_id="+INSTANCE_ID.value;
      xmlhttp.Open("POST",sendUrl,false);
      xmlhttp.send();
      var  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.load(xmlhttp.responseXML);
      var rowSets = xmlDoc.selectNodes("/root/rowSet");
      if(rowSets!=null&&rowSets.length>0){
          var temp_value=rowSets[0].selectSingleNode("AGENT_ID").text;
          for(var i=0;i<defaultAgent.options.length;i++){
              if(defaultAgent.options[i].value==temp_value){
                  defaultAgent.options[i].selected=true;
                  break;
              }
          }
      }
}
//��ȡ��ʼ����ģ��
function add()
{	/*
	//��ȡ����ģ��
	xmlhttp.Open("POST","/servlet/NECustomViewAction?action=41&class_id="+CLASS_ID.value,false);
	xmlhttp.send();
    var  xmlDoc=new ActiveXObject("Microsoft.XMLDOM"); 
	if(isSuccess(xmlhttp))
	{	
	    xmlDoc.load(xmlhttp.responseXML);	
		var item = xmlDoc.getElementsByTagName("MenuItem");
		var ruleNames=[],ruleIDs=[];
		for(var i=0;i<item.length;i++){
			if(item.item(i).getAttribute("id")!=-1 && item.item(i).getAttribute("id")!=-100){
				ruleNames.push(item.item(i).getAttribute("label"));
				ruleIDs.push(item.item(i).getAttribute("id"));
			}
		}
		if(ruleIDs.length > 0){
			ruleName.value=ruleNames.join(",");
			RULE_ID.value=ruleIDs.join(",");
		}
	}*/
}

//��ȡ��ʼĬ�ϲɼ������б�
function getDefaultAgentList(){
        var sendUrl="/servlet/taskConfigServlet?tag=30";
		xmlhttp.Open("POST",sendUrl,false);
		xmlhttp.send();
        var  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.load(xmlhttp.responseXML);
        var rowSets = xmlDoc.selectNodes("/root/rowSet");
        for(var i=0;rowSets!=null&&i<rowSets.length;i++){
           var NE_ID = rowSets[i].selectSingleNode("NE_ID").text;
           var NE_NAME =  rowSets[i].selectSingleNode("NE_NAME").text;
           var defaultAgent=document.getElementById("defaultAgent");
           defaultAgent.options[defaultAgent.length] = new Option(NE_NAME,NE_ID);     
        }
}

//֪ͨ��̨���¹���
function informBackGround(oForm,isSucess){
    if(isSucess){
       if(oForm.getFormBahavior()=="C"&&RULE_ID.value!=""){
        var sendUrl="/servlet/ruleServlet?tag=105&NEID="+INSTANCE_ID.value+"&TEMPLATE_IDS="+RULE_ID.value;
        xmlhttp.Open("POST",sendUrl,false);
        xmlhttp.send();
        
        if(isSuccess(xmlhttp)){
           
        }
      }
    }
}

/*����*/
//�鿴��������
function findDialTestTask(grid){
	var row = grid.getSelectionModel().getSelected();
	if(row){
		window.showModalDialog("/workshop/dialTest/taskConfigList.html?neId="+row.get("INSTANCE_ID")+"&neName="+row.get("SHORT_DESCRIPTION"),window,"dialogWidth=900px;dialogHeight=550px;help=0;scroll=1;resizable=0;status=0;");
	}
	else{
		MMsg("��ѡ��һ�");
		return;
	}
}
//��Ӳ�������
function addDialTestTask(grid){
	var row = grid.getSelectionModel().getSelected();
	if(row){
		window.showModalDialog("/workshop/dialTest/taskInfo.html?neId=" + row.get("INSTANCE_ID"),window,"dialogWidth=1000px;dialogHeight=526px;help=0;scroll=0;status=0;");
	}
	else{
		MMsg("��ѡ��һ�");
		return;
	}
	}

function createFlow(grid)
{
	var row = grid.getSelectionModel().getSelected();
	if(row){
		var p = ["neId="+row.get("INSTANCE_ID"),"neName="+encodeURIComponent(row.get("SHORT_DESCRIPTION"))]
		var url = "/workshop/dialTest/createFlowWithTemplate.html?" + p.join("&");
		window.showModalDialog(url, null,
			"dialogWidth=580px;dialogHeight=526px;help=0;scroll=0;status=0;");
	}
	else{
		MMsg("��ѡ��һ�");
		return;
	}
}

//�����������
function createParam(grid){
	var row = grid.getSelectionModel().getSelected();
	if(row){
		window.showModalDialog("/workshop/dialTest/createParam.html?neId=" + row.get("INSTANCE_ID"),window,"dialogWidth=580px;dialogHeight=526px;help=0;scroll=0;status=0;");
	}
	else{
		MMsg("��ѡ��һ�");
		return;
	}
}

//�鿴������־
function findTaskLog(grid){
	var row = grid.getSelectionModel().getSelected();
	if(row){
		window.showModalDialog("/workshop/dialTest/taskLog.html?neId="+row.get("INSTANCE_ID"),window,"dialogWidth=800px;dialogHeight=600px;help=0;scroll=1;resizable=0;status=0;");
	}
	else{
		MMsg("��ѡ��һ�");
		return;
	}
}

function getSecondItemList(useRange,listSeq){
	useRange = useRange ? useRange:'ASSET';
	listSeq = listSeq ? listSeq : 'A';
	execute(2,"select pkp_cmdb_config.get_second_items("+getThisCiClassId()+",'"+useRange+"','"+listSeq+"') RESULT from dual",function(){
		var dataXML=xmlhttp.responseXML
		var oRows = dataXML.selectNodes("/root/rowSet");
		if(oRows[0]){
			result=oRows[0].selectSingleNode("RESULT").text;
			eval(result);
		}
	})
}
function getSecondItem(useRange,cfgName,varName){
	if(!cfgName)
		MMsg("���������Ʋ���Ϊ�գ�");
	useRange = useRange ? useRange:'ASSET';
	varName = varName ? varName:'';
	var sql = "select pkp_cmdb_config.get_second_item("+getThisCiClassId()+",'"+useRange+"','"+cfgName+"','"+varName+"') RESULT from dual";
	if(!wait){
		loadMask(document.body);
	}
	wait.show();
	xmlhttp.Open("POST","/servlet/commonservlet?tag=201&paramValue="+getAESEncode(encodeURIComponent(sql)),false);
	xmlhttp.send();
	var dataXML=xmlhttp.responseXML
	var oRows = dataXML.selectNodes("/root/rowSet");
	if(oRows[0]){
		result=oRows[0].selectSingleNode("RESULT").text;
		eval(result);
		
	}
	wait.hide();
	return eval(varName);
}

function loadOperImgCfg(){
	var imgs = document.getElementsByName("oper_img");
	if(imgs.length>0){
		var useRange = (DATASET_ID.value==2||DATASET_ID.value==3||DATASET_ID.value==4||DATASET_ID.value==5)?"ASSET":"MONITOR";
		var sql = "select pkp_cmdb_config.get_operimg_script("+getThisCiClassId()+",'"+useRange+"') RESULT from dual";
		if(!wait){
			loadMask(document.body);
		}
		wait.show();
		xmlhttp.Open("POST","/servlet/commonservlet?tag=201&paramValue="+getAESEncode(encodeURIComponent(sql)),false);
		xmlhttp.send();
		var dataXML=xmlhttp.responseXML
		var oRows = dataXML.selectNodes("/root/rowSet");
		if(oRows[0]){
			result=oRows[0].selectSingleNode("RESULT").text;
			eval(result);
		}
		wait.hide();
	}
}


//�Զ����ѯ����excel����
function exportExcel(grid)
{
	var result = grid.result;
	//result.title = grid.title;
	var oSend = result.buildSendXml(result.oParam);
	var field = oSend.createElement("fields");
	var cm = grid.getColumnModel();
	for (var i = 0, len = cm.getColumnCount(), f; i < len; i++)
	{
		if (!cm.isHidden(i))
		{
			var name = cm.getDataIndex(i);
			if (name)
			{
				f = oSend.createElement("field");
				f.setAttribute("name", name);
				f.text = cm.getColumnHeader(i);
				field.appendChild(f);
			}
		}
	}
	oSend.documentElement.appendChild(field);
	var form = document.getElementById("exportExcelForm");
	form.param.value = oSend.xml;
	form.submit();
}

//��ȡģ����²�ģ�飨�ݹ飩��ids
function getLowerModuleIds(instance_id){
	var ids = "";
	xmlhttp.Open("POST",Url + "tag=32&INSTANCE_ID="+instance_id,false);
	xmlhttp.send();
	var dataXML = xmlhttp.responseXML
	var oRows = dataXML.selectNodes("/root/rowSet");
	if(oRows[0]){
		ids = oRows[0].selectSingleNode("LOWER_MODULE_IDS").text;
	}
	return ids;
}
//ɾ��ģ�鼰�������²�ģ�飨�ݹ飩
function cascadeDeleteModule(grid) {
	if(grid){//CMDB��񹤾���ɾ���¼�
		var rows = grid.getSelectionModel().getSelections();
		if(rows.length!=0){
	  		if(QMsg("ȷ��Ҫɾ����ѡģ����ͬʱҲ��ɾ���²�ģ��!")==MSG_YES)
	  		{
				var instanceId=rows[0].get("INSTANCE_ID");
				var instanceIds = getLowerModuleIds(instanceId);
				if(instanceIds)
					instanceIds = instanceId + "," + instanceIds;
				else
					instanceIds = instanceId;
					
				if(instanceIds){
					var delByClassIdUrl="/servlet/formDispatch?OperType=19&instanceIds="+instanceIds+"&flowId="+getFlowId()+"&isSync="+getIsSync()+"&isAudit="+getIsAudit();
				    xmlhttp.Open("POST",delByClassIdUrl,false);
				    xmlhttp.send();
				    if(isSuccess(xmlhttp))
				    {
					    MMsg("ɾ���ɹ���");
				    	grid.search();
				    }
			    }
	  		}
		}else
		{
			MMsg("��ѡ��һ�");
			return;
		}
    }
}

if(typeof(Ext)!='undefined'){
    Ext.onReady(function(){
        if(window.getURLSearch()){
            hiddenToolBar = window.getURLSearch().hiddenToolBar;
            readOnly = window.getURLSearch().readOnly;
        } else if(parent && parent.getURLSearch()) {
            hiddenToolBar = window.parent.getURLSearch().hiddenToolBar;
            readOnly = window.parent.getURLSearch().readOnly;
        }
    });
}

//�Ĵ�NOC��ʾ����
function doSimpleShow() {
	//editDiv.style.display="none";
	infoDiv.style.display="";
	pzDiv.style.display = "";
	
	var tabDivs = infoTab.getElementsByTagName("div");
	for(var i=0,c;c=tabDivs[i];i++) {
		var a = document.getElementById(c.id.replace("_SHOW",""));
		if(a) {
			c.innerHTML = a.text||a.value||a.innerHTML||"&nbsp;";
		} else {
			c.innerHTML = "&nbsp;"
		}
    }
	
	if(typeof monitorSecondItemsList != 'undefined') {
		loadMonitorSecondItemsList.defer(30);
	}
}

function beforeSave(){
	var ciCode = $('CI_CODE');
	var instanceId = $("INSTANCE_ID").value;
	xmlhttp.Open("POST",Url+"tag=120&ciCode=" + ciCode.value +"&instanceId=" + instanceId,false);
	xmlhttp.send();
	var xmlDoc = xmlhttp.responseXML;
	
	if(isSuccess(xmlhttp)){
		 var result = xmlhttp.responseXML.selectSingleNode("/root/result").text;
		 if(result == 'null'){
			 return true;
		 } else{
			 MMsg("CI�������Ԫ��Ϊ����" + result + "�� ��CI�����г�ͻ����������д��");
			 ciCode.focus();
			 return false;
		 }		
	}else{
	 	MMsg("��ȡci_code��Ϣʧ��");
	 }  
	return true;
}

//չʾ�ֹ����ͽ���
function markReconcile(grid)
{
    window.showModalDialog("/workshop/cmdb/reconcile.html",null,
                         "dialogWidth:1000px;dialogHeight:"+window.screen.height +"px;center:yes;help:no;resizable:yes;status:no");
}

//���������ı�
function changeCompanyText(){
	//��ά���̻�Ӧ�̴����������ʱ����parent.window.oCompanyName
	oCompanyName = parent.window.oCompanyName || oCompanyName;
	oCompanyId = parent.window.oCompanyId || oCompanyId;
	var dsUrl = Url + "tag=52&companyName=" + oCompanyName.value;
	changeText(oCompanyId,oCompanyName,dsUrl);
}

function changeModelText(){
	if($("MANUFACTURER_ID") && $("MANUFACTURER_ID").value){
		if(!$("ITEM")){
			alert("ȱ�ٱ�Ԫ��ITEM");
			return;
		}
		var dsUrl = Url + "tag=51&companyId=" + $("MANUFACTURER_ID").value + "&item=" + $("ITEM").value + "&modelText=" + $("MODEL_TEXT").value;
		changeText(oCompanyId,oCompanyName,dsUrl);
	}/*else{
		alert("����¼�������̣�");
		return;
	}*/
}

//���������ı�
function changeText(idInput,textInput,dsUrl){
	window.clearTimeout(delayTimeOut);
	delayTimeOut = window.setTimeout(function(){
		var sChecked, sStyle,sHTML;
		var iRealHeight, iLeft, iBottom;
		var aShowTable = [];
		xmlhttp.Open("POST", dsUrl, false);
		xmlhttp.send();
		var xmlDoc = xmlhttp.responseXML;

		var oRows = xmlDoc.selectNodes("/root/rowSet");
		var iLen = oRows.length;
		oPopup2 = window.createPopup();
		var oPopBody = oPopup2.document.body;
		if(iLen>0){
			for (var i = 0; i < iLen; i++) {
				var oRow = oRows[i];
				var id = oRow.selectSingleNode("ID").text;
				var text = oRow.selectSingleNode("TEXT").text;
				if (id != "") {
					var isChecked = (id== idInput.value);
					sStyle = (isChecked)
							? "style='color:white;background-color:black;'"
							: "";
					sChecked = (isChecked) ? "true" : "false";
					aShowTable[i] = "<tr "
							+ sStyle
							+ "onclick='parent.window.setCompValue(this)' onmouseover='parent.window.setHoverInStyle(this)' onmouseout='parent.window.setHoverOutStyle(this)' checked='"
							+ sChecked + "' sId='" + id + "' sText='" + text
							+ "' >" + "<td>" + text + "</td>" + "</tr>";
				}
			}
			sHTML = "<table style='font-size:9pt;width:310;cursor:hand;'>"
					+ aShowTable.join("") + "</talbe>";

		}else{
			sHTML = "<table style='font-size:9pt;width:310;cursor:hand;'><tr style='color:blue;'><td >û��ƥ�������...</td></tr></talbe>"; 
		}
		
		oPopBody.style.backgroundColor = "white";
		oPopBody.style.color = "black";
		oPopBody.style.border = "1px solid #0066CC";
		oPopBody.innerHTML = sHTML;
		oPopup2.show(0, 0, 310, 0);
	    oPopup2.hide();
		
		iLeft = parseInt(window.screenLeft) + textInput.getBoundingClientRect().left;
		iBottom = parseInt(window.screenTop) + textInput.getBoundingClientRect().bottom;
		oPopup2.show(iLeft, iBottom, 310, oPopup2.document.body.scrollHeight);
	},500);
}

function changeAssetCom(idInput,textInput,dsUrl){
	window.clearTimeout(delayTimeOut);
	delayTimeOut = window.setTimeout(function(){
		var sChecked, sStyle,sHTML;
		var iRealHeight, iLeft, iBottom;
		var aShowTable = [];
		xmlhttp.Open("POST", dsUrl, false);
		xmlhttp.send();
		var xmlDoc = xmlhttp.responseXML;

		var oRows = xmlDoc.selectNodes("/root/rowSet");
		var iLen = oRows.length;
		oPopup2 = window.createPopup();
		var oPopBody = oPopup2.document.body;
		if(iLen>0){
			for (var i = 0; i < iLen; i++) {
				var oRow = oRows[i];
				var id = oRow.selectSingleNode("ID").text;
				var text = oRow.selectSingleNode("TEXT").text;
				if (id != "") {
					var isChecked = (id== idInput.value);
					sStyle = (isChecked)
							? "style='color:white;background-color:black;'"
							: "";
					sChecked = (isChecked) ? "true" : "false";
					aShowTable[i] = "<tr "
							+ sStyle
							+ "onclick='parent.window.setModelValue(this)' onmouseover='parent.window.setHoverInStyle(this)' onmouseout='parent.window.setHoverOutStyle(this)' checked='"
							+ sChecked + "' sId='" + id + "' sText='" + text
							+ "' >" + "<td>" + text + "</td>" + "</tr>";
				}
			}
			sHTML = "<table style='font-size:9pt;width:310;cursor:hand;'>"
					+ aShowTable.join("") + "</talbe>";

		}else{
			sHTML = "<table style='font-size:9pt;width:310;cursor:hand;'><tr style='color:blue;'><td >û��ƥ�������...</td></tr></talbe>"; 
		}
		
		oPopBody.style.backgroundColor = "white";
		oPopBody.style.color = "black";
		oPopBody.style.border = "1px solid #0066CC";
		oPopBody.innerHTML = sHTML;
		oPopup2.show(0, 0, 310, 0);
	    oPopup2.hide();
		
		iLeft = parseInt(window.screenLeft) + textInput.getBoundingClientRect().left;
		iBottom = parseInt(window.screenTop) + textInput.getBoundingClientRect().bottom;
		oPopup2.show(iLeft, iBottom, 310, oPopup2.document.body.scrollHeight);
	},500);
}

//ѡ�г����¼�
function setCompValue(oTr) {
	oCompanyName.value = oTr.sText;
	//��ѡ����ı����𣬷���ʧȥ����ʱ����value�Ƚ��Ƿ�һ��
	oCompanyName.oText = oTr.sText;
	oCompanyId.value = oTr.sId;
	
	
	//�����̱���գ���Ҫ�����ͺ�
	if(oCompanyId.id=="MANUFACTURER_ID"){
		try{
			MODEL_ID.value = "";
			MODEL_TEXT.value = "";
		}catch(e){}
	}
	
	oPopup2.hide();
}

function setModelValue(oTr) {
	MODEL_TEXT_LIST.value = oTr.sText;
	//��ѡ����ı����𣬷���ʧȥ����ʱ����value�Ƚ��Ƿ�һ��
	MODEL_TEXT_LIST.oText = oTr.sText;
	MODEL_ID_LIST.value = oTr.sId;
	
	//�����̱���գ���Ҫ�����ͺ�
	if(oCompanyId.id=="MANUFACTURER_ID"){
		try{
			MODEL_ID.value = "";
			MODEL_TEXT.value = "";
		}catch(e){}
	}
	
	oPopup2.hide();
}

function setHoverInStyle(oTr){
	if(oTr.checked=="false"){
	    oTr.style.backgroundColor = '#666';
	    oTr.style.color = 'white';
	}
}

function setHoverOutStyle(oTr){
	if(oTr.checked=="false"){
	   oTr.style.backgroundColor = 'white';
	   oTr.style.color = 'black';
	}
}

/**
 * ʧȥ����ʱ��֤�����Ƿ���ѡ�����ͬ
 * ��ͬ�����
 */
function companyInputBlur(){
	//oCompanyName.detachEvent("onpropertychange",);
	if(oCompanyName.value != oCompanyName.oText){
		oCompanyName.value= "";
		oCompanyId.value = "";
		
		//�����̱���գ���Ҫ�����ͺ�
		if(oCompanyId.id=="MANUFACTURER_ID"){
			try{
				MODEL_ID.value = "";
				MODEL_TEXT.value = "";
			}catch(e){}
		}
	}
	getModelHeight();
}

function doRead() {
	if(getURLSearch().eventid){
		xmlhttp.open("POST", "/servlet/assetServlet?tag=2&eventId=" + getURLSearch().eventid,false);
		xmlhttp.send();
		if (isSuccess(xmlhttp)) {
			window.close();
		}
	}
}


/**
 * ��۱��ػ����ʲ�ά�����������б��CI˫���¼�
 * @param {} grid
 */
function CIModifyByAsset(grid){
	function refreshGrid(gridPanel){
		gridPanel.store.load(gridPanel.store.lastOptions);
	}
	callbackFn = refreshGrid.callback([grid]);
	var row = grid.getSelectionModel().getSelected();
	if(row){
		var param = "";
		if(row.get("DATASET_ID")==3 || row.get("DATASET_ID")==5){
			param = readOnlyParam;
		}else if(typeof(grid.isAllowOnlyRead)=='undefined' || grid.isAllowOnlyRead){
			param = "&hiddenToolBar="+hiddenToolBar+"&readOnly="+readOnly;
		}
		window.showModalDialog("/workshop/form/index.jsp?callback=window.dialogArguments.callbackFn()&classId="+row.get("CLASS_ID")+"&dataSetId="+row.get("DATASET_ID")+"&requestId="+row.get("REQUEST_ID")+"&flowId="+getFlowId()+"&isSync="+getIsSync()+"&isAudit="+getIsAudit()+"&moduleId="+getModuleId()+param,window,
                         "dialogWidth:"+window.screen.width+"px;dialogHeight:"+window.screen.height +"px;center:no;help:no;resizable:no;status:no");
	}
}
/**
 * �½����̺�ci����
 * @param {} grid
 * @return {String}
 */
function  createFlowRelaCi(grid){
	var arrayUrl=getURLSearch();
	var title,flowId="";
    if(arrayUrl!=null&&arrayUrl.treeId&&arrayUrl.title&&arrayUrl.flowId){
       title = arrayUrl.title;
       flowId = arrayUrl.flowId;
    }else{
    	return;
    }
	var instanceId="";
	if(grid){
		var rows = grid.getSelectionModel().getSelections();
		for(var i=0;i<rows.length;i++){
			if(instanceId==""){
				instanceId=rows[i].get("INSTANCE_ID");
			}else{
				instanceId=instanceId+","+rows[i].get("INSTANCE_ID");
			}
		}
		if(instanceId==""){
			MMsg("��ѡ��Ҫ��ӵļ�¼");
			return;
		}
		
		
		if(arrayUrl.beforeInsert){
			eval(arrayUrl.beforeInsert);
		}
	
		var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		var url="/servlet/CmdbServlet?tag=35&instanceId="+instanceId+"&flowId="+ flowId +"&title="+ encodeURI(title);
		xmlhttp.open("POST",url,false);
		xmlhttp.send();
		if(isSuccess(xmlhttp)){
		    MMsg("��ӹ����ɹ�");
		    window.returnValue = true;
	    }
		window.close();
	}else{
		MMsg("��ѡ��Ҫ��ӵļ�¼");
	}	
}



//���������豸ci����
function setMainFrameCiName(){
        var classId = getThisCiClassId();
        var ciName = '';
        var t_busi = busiSystemName.innerText;
        var t_ip = '';
        for (var i = 0, r; r = ipGrid.getStore().getAt(i); i++) {
          if(r.get("IP_TYPE") == 'MONITOR_IP'){
              t_ip = r.get("IP_NAME");
              break;
          }
       }
       if(!t_busi || !t_ip){//��ҵ��ϵͳ��ip����£����ջ���-����-���к� 
            var t_rackRoom = '';
            var t_rackId = selectStoreDates["rackName"] && selectStoreDates["rackName"][0] ? selectStoreDates["rackName"][0].INSTANCE_ID : '';
            if(t_rackId){ 
                 var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");           
                 xmlhttp.Open("POST","/servlet/CmdbServlet?tag=61&rackId="+t_rackId,false);
                 xmlhttp.send();
                 if (isSuccess(xmlhttp)) { 
                    var row =  xmlhttp.responseXML.selectSingleNode("/root/rowSet");
                    if(row) {
                          t_rackRoom = row.selectSingleNode("RESULT").text;
                     }
                  }
                  t_rackRoom = t_rackRoom.split(",")[0];
                  if(t_rackRoom && rackName.innerText && SERIAL_NUMBER.value)
              	  	  ciName = t_rackRoom +'-'+rackName.innerText+'-'+SERIAL_NUMBER.value;
              }
       }else{  //Ĭ�ϰ��գ���������-ҵ��ϵͳ-����ϵͳ����-IP
       		  var t_className = '';
              try {
	              var T_CLASS_ID = getThisCiClassIdEle();
	              var t_className = T_CLASS_ID.options[T_CLASS_ID.selectedIndex].text;
              } catch(e) {}
              t_className = t_className ? ('-'+t_className) : '';
              ciName = REGION_ID.text + '-' + t_busi + t_className+'-' + t_ip;
       }
       SHORT_DESCRIPTION.value = ciName.trimLine();
}


//���������豸ci����
function setNetDeviceCiName(){
    var ciName = '';
    var serial = SERIAL_NUMBER.value;
    if(serial)
       ciName = RACK_NAME.innerText+'-'+serial+'-'+IP_NAME.innerText;
    else 
       ciName = RACK_NAME.innerText+'-'+IP_NAME.innerText;
    ciName = ciName.trimLine();
    SHORT_DESCRIPTION.value = ciName;
}

String.prototype.trimLine=function(){ 
    return this.replace(/(^-*)|(-*$)/g, ""); 
} 

//�������̹�����ť�ӱ�������Ч����ʧЧ������Ӳ������������
function isDisabledBut(){
	var arrayUrl=getURLSearch();
    if(arrayUrl!=null&&arrayUrl.treeId){
       return false;    
    }else{
    	return true;
    }
}

/*
	�Ƿ��ܴ�CMDB������أ��Ѿ��������Ĳ��У���
*/

function isCanDoTurnMonitor(){
	if(reconcileInstanceId || queryReconcileCi(ThisForm.TABLE.CI_BASE_ELEMENT.INSTANCE_ID.VALUE())){
		alert("�Ѿ���������Ԫ���޷���������");
		return false;
	}else{
		return true;
	}
}

/*��ѡ��ϵ�Ļ��棬��ҳ����ȫ������ɺ���չʾ��ҳ���С�*/
var relationCacheArray = new Array();
function insertRelationCacheArray(objId,objName,instanceId,classId,dataSetId,requestId,shortDescription,isSource){
	relationCacheArray.push({"objId":objId,"objName":objName,"instanceId":instanceId,"classId":classId,"dataSetId":dataSetId,"requestId":requestId,"shortDescription":shortDescription,"isSource":isSource});
}

/*ҳ�������ɺ󣬼�����ҪĬ��չʾ�Ĺ�ϵ������Ѿ����浽���еĹ�ϵ�����浽���еĹ�ϵ��queryRelations��ʵ�֣�*/
function initRelation(){
	if(relationCacheArray.length>0){
		for(var i=0;i<relationCacheArray.length;i++){
			var r = relationCacheArray[i];
			setRealtionDefault(r.objId,r.objName,r.instanceId,r.classId,r.dataSetId,r.requestId,r.shortDescription,r.isSource);
		}
	}
}

function initRelation(){
	if(relationCacheArray.length>0){
		for(var i=0;i<relationCacheArray.length;i++){
			var r = relationCacheArray[i];
			setRealtionDefault(r.objId,r.objName,r.instanceId,r.classId,r.dataSetId,r.requestId,r.shortDescription,r.isSource);
		}
	}
	if(typeof(ipGrid)!="undefined" && ipGrid && ipGridCacheArray.length>0){
		for(var i=0;i<ipGridCacheArray.length;i++){
			var r = ipGridCacheArray[i];
			ipGrid.addIP(r.ipType,r.ipId,r.ipName,r.ipAddr,r.ipsName);
		}
	}
}



/*���ݣ����ͱ�ʶ��ͬ����class_id��short_description����ͬ��Ϊ������
ȡcmdb��Ӧ����Ԫ����Ϣ*/
function getNeCiInfoByCmdb(cmdbInstanceId,neCiInfoColumns){
	neCiInfoColumns = neCiInfoColumns || "CI_BASE_ELEMENT.INSTANCE_ID,TO_CHAR(REQUEST_ID) REQUEST_ID,DATASET_ID,CLASS_ID,SHORT_DESCRIPTION";
	var sendUrl=Url+"tag=65&cmdbInstanceId="+cmdbInstanceId+"&columns="+neCiInfoColumns
	xmlhttp.Open("POST",sendUrl,false);
	xmlhttp.send();
	var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
	xmlDoc.load(xmlhttp.responseXML);
	return xmlDoc
}

function getCmdbInfo(cmdbInstanceId,neCiInfoColumns){
	neCiInfoColumns = neCiInfoColumns || "CI_BASE_ELEMENT.INSTANCE_ID,TO_CHAR(REQUEST_ID) REQUEST_ID,DATASET_ID,CLASS_ID,SHORT_DESCRIPTION";
	var sendUrl=Url+"tag=118&cmdbInstanceId="+cmdbInstanceId+"&columns="+neCiInfoColumns
	xmlhttp.Open("POST",sendUrl,false);
	xmlhttp.send();
	var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
	xmlDoc.load(xmlhttp.responseXML);
	return xmlDoc
}


/*
��CMDB������Ԫ��
1������Ԫ����ʱ���ã����CMDB������״̬������null��������޸�״̬����return cmdb��instanceId���ڿ��н������͹�ϵ
2�����CMDB������״̬������Ԫ����ʱ����ֵ��cmdb��reconcileInstanceId����return null����cmdb����ʱ�ٵ��ý������͹�ϵ��
*/
var reconcileInstanceId = "";
function getReconcileInstanceId(){
	try{
		if(ThisForm.TABLE.CI_BASE_ELEMENT.DATASET_ID.VALUE()==6){
			var openerWin;
			if(parent.opener){
				openerWin = parent.opener.parent;
			}else if(parent.window.dialogArguments){
				openerWin = parent.window.dialogArguments.parent;
			}else{
				return "";
			}
			if(openerWin.oFormContext.getFormBahavior()=="C"){
				//��Ԫ����ʱΪCMDB��reconcileInstanceId��ֵ
				openerWin.frames["fraForm"].reconcileInstanceId = ThisForm.TABLE.CI_BASE_ELEMENT.INSTANCE_ID.VALUE();
				return "";
			}else{
				return openerWin.oFormContext.TABLE.CI_BASE_ELEMENT.INSTANCE_ID.VALUE();
			}
		}else{
			//�˴�ΪCMDB����ʱ����
			return reconcileInstanceId;//�����ֵ����˵����Ԫ�Ѿ�����
		}
	}catch(e){
		return "";
	}
}

/*��ȡ����CI*/
function queryReconcileCi(instanceId){
	var sendUrl=Url+"tag=67&instanceId="+instanceId;
	xmlhttp.Open("POST",sendUrl,false);
	xmlhttp.send();
	var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
	xmlDoc.load(xmlhttp.responseXML);
	var row = xmlDoc.selectSingleNode("/root");
	if(row && row.selectSingleNode("INSTANCE_ID")){
		var ci = {};
		ci.INSTANCE_ID = row.selectSingleNode("INSTANCE_ID").text;
		ci.CLASS_ID = row.selectSingleNode("CLASS_ID").text;
		ci.DATASET_ID = row.selectSingleNode("DATASET_ID").text;
		ci.REQUEST_ID = row.selectSingleNode("REQUEST_ID").text;
		ci.SHORT_DESCRIPTION = row.selectSingleNode("SHORT_DESCRIPTION").text;
		return ci;
	}else{
		return null;
	}
}


function showReconcileCi(){
	var reconcileCiDiv = document.getElementById("RECONCILE_CI_DIV");
	if(reconcileCiDiv){
		var reconcileCi = queryReconcileCi(ThisForm.TABLE.CI_BASE_ELEMENT.INSTANCE_ID.VALUE());
		if(reconcileCi)
			reconcileCiDiv.innerHTML = "<a href=\"#\" onClick=\"getConfigItem("+ reconcileCi.CLASS_ID + ","+ reconcileCi.DATASET_ID + ",'"+ reconcileCi.REQUEST_ID +"')\" title=\"�����<"+ reconcileCi.SHORT_DESCRIPTION +">��ϸ��Ϣ\"><font color=\"#0000FF\">"+reconcileCi.SHORT_DESCRIPTION  +"</font></a>";
	}
}

// ���ݿ⡢�м������������ťʱ��ֱ����ʾ ci �����ѡ��˵�
// ���ڣ�sys_func_menu_item(id=1019)�Ķ�̬���ط���(DYNAMIC_LOAD_EVENT)
var subCiMenu = {
	load: function(grid, item) {
		/*������Ҽ��˵�������ʾ������ť*/
		if (item.findParentByType('menu') != null) {
			item.getEl().parent().setDisplayed(false);
			return;
		}
		item.addListener('show', function() {
			ResultUtil.query(14400000, function(datas){
				var items = [];
				for (var i = 0; i < datas.length; i++) {
					(function(d) {
						items.push({
							text: d.ITEM_LABEL,
							type: 'menu',
							iconCls: 'icon-item',
							handler: function() {
								addCiCommon(grid, d);
							}
						});
					})(datas[i]);
				}

				item.menu = new Ext.menu.Menu({items: items});
			}).refresh({
				VIEW_ID: getViewId(),
				ITEM_ID: grid.result.oParam.TREE_ID,
				PARENT_CLASS_ID: grid.result.oParam.CLASS_ID
			});
		});

		item.on('click', function(btn) {
			btn.showMenu();	
		});
	}
}

function getModelHeight(){
	if ($("MODEL_ID") && MODEL_ID.value != '' && MODEL_ID.value != null){
		var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");           
        xmlhttp.Open("POST","/servlet/CmdbServlet?tag=80&module_id="+MODEL_ID.value,false);
        xmlhttp.send();
        if (isSuccess(xmlhttp))
        { 
           var row =  xmlhttp.responseXML.selectSingleNode("/root/rowSet");
           if(row && $("MODEL_HEIGHT")){
               MODEL_HEIGHT.value = row.selectSingleNode("HEIGHT").text;
           }
           if (CI_CLASS_ID == 32 && row && $("PUTWAY") && $("SLOT_COLUMN") && $("SLOT_ROW")){
           	   PUTWAY.value = row.selectSingleNode("PUTWAY").text;
           	   SLOT_COLUMN.value = row.selectSingleNode("SLOT_COLUMN").text;
           	   SLOT_ROW.value = row.selectSingleNode("SLOT_ROW").text;
           }
        }
	}
}


//vCenter �޸�XenServer�����б�
function  updateVcenterXenServer(grid){	
	if(grid){
		var rows = grid.getSelectionModel().getSelections();
		if(rows.length <= 0){
			MMsg("��ѡ��Ҫ�޸ĵļ�¼");
			return;
		}
		var obj = {}, row = rows[0];   
        obj.vcenterId = row.get("MGR_ID");
        obj.ip = row.get("MASTER_IP");
        obj.port = row.get("MASTER_PORT"); 
        obj.userName = row.get("MASTER_USERNAME"); 
        obj.password = row.get("MASTER_PASSWD");
        obj.mainId = row.get("ID");
        obj.type = "upd";
        
        var k = window.showModalDialog("/workshop/form/CIFile/cmdb/CIMonitorCloudHostList.jsp",obj,"dialogWidth=650px;dialogHeight=350px;help=0;scroll=0;status=0;");
        if(k == "1"){
        	Global.refesh();
        }
	}else{
		MMsg("��ѡ��Ҫ�޸ĵļ�¼");
	}	
}

function addVcenterXenServer(grid){	
	var obj = {};
	obj.vcenterId = INSTANCE_ID.value;
	obj.type = "add";
	var k = window.showModalDialog("/workshop/form/CIFile/cmdb/CIMonitorCloudHostList.jsp",obj,"dialogWidth=650px;dialogHeight=350px;help=0;scroll=0;status=0;");
    if(k == "1"){
    	Global.refesh();
    }
}

function delVcenterXenServer(grid){	
	if(grid){
		var rows = grid.getSelectionModel().getSelections();
		if(rows.length <= 0){
			MMsg("��ѡ��Ҫɾ���ļ�¼");
			return;
		}
        var mainId = rows[0].get("ID");
        var actionUrl ="/servlet/CmdbServlet?";
        
        paramArray = new Array();
        paramArray.push("tag=" +53);
        paramArray.push("mainId=" +mainId);
        paramArray.push("type=del");
        
        var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); 
		xmlhttp.open("POST", encodeURI(actionUrl + paramArray.join("&")), false);
		xmlhttp.send();
		if(isSuccess(xmlhttp)){
			MMsg("ɾ���ɹ�!");
			Global.refesh();
		}
	}else{
		MMsg("��ѡ��Ҫɾ���ļ�¼");
	}	
}

function  checkVcenterXenServer(grid){	
	if(grid){
		var rows = grid.getSelectionModel().getSelections();
		if(rows.length <= 0){
			MMsg("��ѡ��Ҫ��֤�ļ�¼");
			return;
		}
		var actionUrl ="/servlet/CmdbServlet?";
		var row = rows[0];   
        var ip = row.get("MASTER_IP");
        var port = row.get("MASTER_PORT"); 
        var userName = row.get("MASTER_USERNAME"); 
        var password = row.get("MASTER_PASSWD");
        
        paramArray = new Array();
        paramArray.push("tag=" +54);
        paramArray.push("masterIp=" +ip);
        paramArray.push("port=" +port);
        paramArray.push("userName=" +userName);
        paramArray.push("pwd=" +password);
        
        var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); 
        xmlhttp.open("get", encodeURI(actionUrl + paramArray.join("&")), false);
		xmlhttp.send();
		if(isSuccess(xmlhttp)){
			 var result = xmlhttp.responseXML.selectSingleNode("/root/result").text;
			 if(result == "true"){
			 	MMsg("��֤�ɹ�!");
			 }else{
			 	MMsg("xenserver������֤ʧ�ܣ����޸���������!!");
			 }           
		}       
	}else{
		MMsg("��ѡ��Ҫ��֤�ļ�¼");
	}	
}

function decryptPwd(str){
	paramArray = new Array();
    paramArray.push("tag=" +75);
    paramArray.push("pwd=" +str);
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); 
    xmlhttp.open("POST", "/servlet/CmdbServlet?tag=75&pwd="+str, false);
	xmlhttp.send();
	if(isSuccess(xmlhttp)){
		 var result = xmlhttp.responseXML.selectSingleNode("/root/result").text;
		 return result;
	}else{
	 	MMsg("�������ʧ��");
	 }  
}

/**
* ����CI
*/
function CICopy(grid)
{
	if(grid){
		var instanceIds="";
		var rows = grid.getSelectionModel().getSelections();
		if(rows.length!=0){
	  		if(QMsg("ȷ��Ҫ������ѡ��ļ�¼��")==MSG_YES)
	  		{
				for (var i=0;i<rows.length;i++)
				{
					if(i==0)
                    {
						instanceIds=rows[i].get("INSTANCE_ID");
                    }
					else
                    {
						instanceIds=instanceIds+","+rows[i].get("INSTANCE_ID");
                    }
				}
				
				var delByClassIdUrl = Url + "tag=81&instanceIds="+instanceIds;
		        xmlhttp.Open("POST",delByClassIdUrl,false);
		        xmlhttp.send();
		        if(isSuccess(xmlhttp))
		        {
		            MMsg("���Ƴɹ���");
		            grid.search();
		            return true;
		        }
		}
    }else
		{
			MMsg("��ѡ��һ�");
			return false;
		}
    }
}

//�޸ļ��״̬
function updateStatus(instanceId,obj){
	var isCheck;
	if(obj.checked){
		isCheck = 1;
	}else{
		isCheck = 0;
	}
	var updateUrl = Url + "tag=82&instanceId="+instanceId+"&status="+isCheck;
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); 
	xmlhttp.Open("POST",updateUrl,false);
    xmlhttp.send();
    if(!isSuccess(xmlhttp))
    {
    	 MMsg("���״̬�޸�ʧ�ܣ�");
    }		
}

//ip��Ϣ
var isLoadIpmiIpList = true;
function  loadIpmiIpList(){
	if(isLoadIpmiIpList){
		loadMask(document.body);
		ipmiIpListIcon.src = "/resource/image/arrow_expanded.gif";
		ipmiIpList.style.display = "";
		isLoadIpmiIpList = false;
	}else{
		if(ipmiIpList.style.display=="none"){
			ipmiIpList.style.display = "";
			ipmiIpListIcon.src = "/resource/image/arrow_expanded.gif";
		}else{
			ipmiIpList.style.display = "none";
			ipmiIpListIcon.src = "/resource/image/arrow1.gif";
		}
	}
}