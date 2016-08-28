
var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var dXML = new ActiveXObject("Microsoft.XMLDOM");
var billUrl = "../../servlet/billInfoServlet?";
var projectGroupUrl = "../../servlet/projectGroupServlet?";
var xmlStr = "";
var billInfoId = 0;
var isClose;
var isToBbs = false;
var isToDocument = false;
var messageArray = new Array();

//1. ��ʼ��ҳ��
function iniPage(){
    billInfoId = 0;
    var arrayUrl=getURLSearch();
    if(arrayUrl!=null)
    {
       if(arrayUrl.billInfoId) billInfoId=arrayUrl.billInfoId;
    }
    //(1). ��ʼ�����
    iniCategory(billInfoForm);
    //(2). ��ʼ��������
    setTimeout("initGroups(billInfoForm)", 10);
    //(3). �Ƿ񷢲�����̳
    //initDeliverToBBS();
    //(4). ��ʼ��������Ϣ
    if(billInfoId!=0){//���²���
      iniUpdatePage(billInfoForm);
    }else{            //��Ӳ���
      iniBlankPage();
    }
    //(5). ��ʼ����������
    initContent();
    //(6). �����ϴ��ɹ�����¼�
    document.all.billInfo.attachEvent('onload',afterUpload);
    //
    var BILLPAGETITLE    = $getSysVar('AHBILLPAGE'); //�Ʒ��б�΢���ػ���־
    if(BILLPAGETITLE != "")
    {
    	document.title = "֪ͨͨ��";
    	try
    	{
    	document.getElementById("category").options[1].selected = true;
    	}catch(e){}
    }
    else
    {
    	document.title = "ITSM��Ϣ����";
    }
    
}
function initContent()
{
    var iniUrl = encodeURIComponent(billUrl+'tag=7&billInfoId='+billInfoId);
    document.getElementById("contentIframe").src = '/resource/ewebeditor/ewebeditor.htm?id=content&style=itnm&tmpDir=knowledgeImgs&iniUrl=' + iniUrl + '&billInfoId=' + billInfoId + '&tempDirectory=' + billInfoForm.tempDirectory.value;
}
function initDeliverToBBS()
{
    var submitURL = billUrl+"tag=28";
    xmlhttp.Open("POST",submitURL,false);
    xmlhttp.send();
    var bbsDom = new ActiveXObject("Microsoft.XMLDOM");
    bbsDom.load(xmlhttp.responseXML);
    if(bbsDom.selectSingleNode("/root/IS_TO_BBS")!=null && bbsDom.selectSingleNode("/root/IS_TO_BBS").text=="true")
    {
        toBbsBlock.style.display="";
    }
}
function iniBlankPage(){
    billInfoForm.tag.value = 4;
    //middleButton.value="��һ��";
    middleButton.style.display="none";
    billInfoForm.uploadedAttachments.style.display="none";
    
    var i = 0;
    for(;i<display_tag.length;i++){
      display_tag[i].style.display = "none";
    }
}
function iniUpdatePage(form){
    form.tag.value = 5;
    form.billInfoId.value = billInfoId;
    middleButton.value="Ӧ  ��";
    tab4.display="";
    tab5.display="";
    
    //(1). ��ȡ�Ʒ���Ϣ
    var submitURL = billUrl+"tag=3&billInfoId="+billInfoId;
    xmlhttp.Open("POST",submitURL,false);
    xmlhttp.send();
    
    dXML.load(xmlhttp.responseXML);
    
    //(2). ��ʾԪ��
    form.title.value = dXML.selectSingleNode("/root/Msg/TITLE").text;
    form.author.value = dXML.selectSingleNode("/root/Msg/AUTHOR").text;
    form.source.value = dXML.selectSingleNode("/root/Msg/SOURCE").text;
    form.category.value = dXML.selectSingleNode("/root/Msg/BILL_INFO_CATEGORY_ID").text;
    form.content.value = dXML.selectSingleNode("/root/Msg/CONTENT").text;

    if(dXML.selectSingleNode("/root/Msg/IS_SPECIAL").text=="0BT") {form.special.checked=true;}
    else {form.nonSpecial.checked=true;}
    document.getElementById("staff_name").innerHTML = '<a href="javascript:showStaffInfo('+dXML.selectSingleNode("/root/Msg/STAFF_ID").text+')">'+dXML.selectSingleNode("/root/Msg/STAFF_NAME").text+'</a>';
    document.getElementById("submit_date").innerHTML = dXML.selectSingleNode("/root/Msg/SUBMIT_DATE").text;
    document.getElementById("organization").innerHTML = dXML.selectSingleNode("/root/Msg/ORG_NAME").text;
    document.getElementById("permissionStaff").innerHTML = dXML.selectSingleNode("/root/Msg/PERMISSION_STAFF_NAME").text;
    initState(dXML, form);
    
    //(3). �ؼ���
    iniKeyword(dXML, form);
    
    //(4). ����
    oData.xmlSrc=billUrl+"tag=8&billInfoId="+billInfoId;
    
    //(5). ����
//    reloadMessage(dXML);
    
    //(6). �����Ա
    iniReader(form);
    
    //(7). ��������
    //var oRows=dXML.selectNodes("/root/PROJECT_GROUPS/rowSet");
    setTimeout("reloadProjectGroup('/root/PROJECT_GROUPS/rowSet')", 20); 
    setTimeout("reloadOtherTarget('/root/OTHERTARGET/rowSet')", 20);
    setTimeout("reloadOrgTarget('/root/ORG_TARGET/rowSet')", 20);
    setTimeout("reloadRegionTarget('/root/REGION_TARGET/rowSet')", 20);
}
function initState(dXML,form)
{
    document.getElementById("state").innerHTML = dXML.selectSingleNode("/root/Msg/LIST_LABEL").text;
    var tempValue = dXML.selectSingleNode("/root/CURRENT_STAFF_ID").text;
    var isSelf = ((dXML.selectSingleNode("/root/Msg/STAFF_ID").text)==tempValue);
    var currentState = dXML.selectSingleNode("/root/Msg/STATE").text;
    form.stateCode.value = currentState;
    if(currentState=='4SC')//����״̬ -- �����ߡ�
    {
        if(isSelf) {form.stateCode.value = "4SA";}
    }
}
function iniKeyword(dXML, form)
{
    var oRows=dXML.selectNodes("/root/KEYWORDS/rowSet");
    
    var iLen = form.keyword.length;
    var oOption;
    for(var i=iLen-1;i>=0;i--){
        form.keyword.options.remove(i);
    }
    iLen = oRows.length;
    for(var i=0;i<iLen;i++){
        oOption=document.createElement("OPTION");
        oOption.text=oRows[i].selectSingleNode("KEYWORD").text;
        form.keyword.add(oOption);
    }
}

function iniReader(form)
{   //staffName,orgId,readerIp,startDate,endDate
    form.staffName.value = form.staffName.value.trimall();
    var staffNameStr = "%"+form.staffName.value+"%";
    var orgIdStr = (orgId.value!=null)?orgId.value:"";
    form.readerIp.value = form.readerIp.value.trimall();
    var readerIpStr = form.readerIp.value;
    var startDateStr = startDate.value;
    var endDateStr = endDate.value;
    var sendXML='<?xml version="1.0" encoding="gb2312"?>'+
                '<root>'+
                '  <search pagesize="10" page="1" orderby=" BIR.LAST_DATE desc ">'+
              //'    <param fieldName="BIR.BILL_INFO_ID" oper="=" type="string">'+billInfoId+'</param>'+
                '    <param fieldName="STAFF.STAFF_NAME" oper="like" type="string">'+staffNameStr+'</param>'+
                '    <param fieldName="STAFF.ORG_ID" oper="=" type="string">'+orgIdStr+'</param>'+
                '    <param fieldName="BIR.READER_IP" oper="=" type="string">'+readerIpStr+'</param>';
    if( startDateStr!=""){
       sendXML+='    <param fieldName="BIR.LAST_DATE" oper="&gt;=" type="date" format="yyyy-MM-dd">'+startDateStr+'</param>';
    }
    if( endDateStr!=""){
       endDateStr += " 23:59:59";
       sendXML+='    <param fieldName="BIR.LAST_DATE" oper="&lt;=" type="date" format="yyyy-MM-dd hh24:mi:ss">'+endDateStr+'</param>';
    }
    sendXML +=  '  </search>'+
                '</root>';
    document.all.billInfoMessageData.sendXML=sendXML;
    document.all.billInfoMessageData.xmlSrc= billUrl+"tag=22&billInfoId="+billInfoId;
}
function resetReader()
{
    billInfoForm.staffName.value= "";
    orgId.value = "";
    orgId.text = "";
    billInfoForm.readerIp.value="";
    startDate.value = "";
    endDate.value = "";
}
function iniReader2(dXML, form)
{
    //(1). �����Ϣ
    var datas = readers.rows;
    for(var i=datas.length-1;i>=0;i--)
    {
        datas[i].removeNode(true);
    }
    //(2). ������Ϣ
    var oRows = dXML.selectNodes("/root/READERS/rowSet");
    var iLen = oRows.length;
    var rowObject;
    var cellObject;
    
    rowObject = readers.insertRow();
    cellObject = rowObject.insertCell();
    cellObject.noWrap=true;
    cellObject.colSpan="6";
    cellObject.align="right";
    cellObject.style.color = "#46A718";
    cellObject.innerHTML = '��<span style="border:0;color:red;text-decoration:underline;"> '+dXML.selectSingleNode("/root/READERS/recordCount").text+' </span>�������Ա';
    
    for(var i=0;i<iLen;i++)
    {//��Ա�����ڵ�λ��IP��ַ�����������������ʱ�䡣
        //(1)
        rowObject = readers.insertRow();
        rowObject.bgColor="F3F3F3";
        rowObject.height= "23px";
        cellObject = rowObject.insertCell();//1
        cellObject.noWrap=true;
        cellObject.width = "24px";
        cellObject.align="center";
        cellObject.innerHTML = '<img src="../../resource/image/form_cell_item.gif">';
        cellObject = rowObject.insertCell();//2
        cellObject.noWrap=true;
        cellObject.width = "20%";
        cellObject.style.color = "#46A718";
        cellObject.innerHTML = oRows[i].selectSingleNode("STAFF_NAME").text;
        cellObject = rowObject.insertCell();//3
        cellObject.noWrap=true;
        cellObject.width = "20%";
        cellObject.innerHTML = oRows[i].selectSingleNode("ORG_NAME").text;
        cellObject = rowObject.insertCell();//4
        cellObject.noWrap=true;
        cellObject.width = "20%";
        cellObject.style.color = "#46A718";
        cellObject.innerHTML = oRows[i].selectSingleNode("READER_IP").text;
        cellObject = rowObject.insertCell();//5
        cellObject.noWrap=true;
        cellObject.width = "20%";
        cellObject.innerHTML = oRows[i].selectSingleNode("READ_TIMES").text;
        cellObject = rowObject.insertCell();//6
        cellObject.noWrap=true;
        cellObject.width = "150";
        cellObject.innerHTML = oRows[i].selectSingleNode("LAST_DATE").text;
    }
}

function iniCategory(form)
{
  xmlhttp.open("POST",billUrl+"tag=11",false);
  xmlhttp.send();
  if(isSuccess(xmlhttp))
  {
    var dXML = new ActiveXObject("Microsoft.XMLDOM");
    dXML.load(xmlhttp.responseXML);
    var oOption;
    var oRows = dXML.selectNodes("/root/CATEGORYS/rowSet");
    var iLen = form.category.length;
    for(var i=iLen-1;i>0;i--){
        form.category.options.remove(i);
    }
    
    oOption=document.createElement("OPTION");
    oOption.text="";
    oOption.value="";
    form.category.add(oOption);
    iLen = oRows.length;
    for(var i=0;i<iLen;i++){
        oOption=document.createElement("OPTION");
        oOption.text=oRows[i].selectSingleNode("CATEGORY_NAME").text;
        oOption.value=oRows[i].selectSingleNode("BILL_INFO_CATEGORY_ID").text;
        form.category.add(oOption);
    }
  }
}

function initGroups(form)
{
    projectGroupList.xmlsrc = projectGroupUrl+"tag=10";
}

function reloadProjectGroup(path)
{
    var oRows=dXML.selectNodes(path);
    var oTarget = selectedProjectGroupList.getObject();
    var iLen = oTarget.length;
    var oOption;
    for(var i=iLen-1;i>=0;i--){
        oTarget.options.remove(i);
    }
    iLen = oRows.length;
    for(var i=0;i<iLen;i++){
        oOption=document.createElement("OPTION");
        oOption.value=oRows[i].selectSingleNode("GROUP_ID").text;
        oOption.text=oRows[i].selectSingleNode("GROUP_NAME").text;
        oTarget.add(oOption);
    }
}

function reloadOtherTarget(path)
{
    var oRows=dXML.selectNodes(path);
    var oTarget = selectedStaffList.getObject();
    var iLen = oTarget.length;
    var oOption;
    for(var i=iLen-1;i>=0;i--){
        oTarget.options.remove(i);
    }
    iLen = oRows.length;
    for(var i=0;i<iLen;i++){
        oOption=document.createElement("OPTION");
        oOption.value=oRows[i].selectSingleNode("STAFF_ID").text;
        oOption.text=oRows[i].selectSingleNode("STAFF_NAME").text;
        oTarget.add(oOption);
    }
}

function reloadOrgTarget(path)//selectedOrgList ��֯��
{
    var oRows=dXML.selectNodes(path);
    var oTarget = selectedOrgList.getObject();
    var iLen = oTarget.length;
    var oOption;
    for(var i=iLen-1;i>=0;i--){
        oTarget.options.remove(i);
    }
    iLen = oRows.length;
    for(var i=0;i<iLen;i++){
        oOption=document.createElement("OPTION");
        oOption.value=oRows[i].selectSingleNode("ORG_ID").text;
        oOption.text=oRows[i].selectSingleNode("ORG_NAME").text;
        oTarget.add(oOption);
    }
}

function reloadRegionTarget(path)//regions ���� 
{
    var oRows=dXML.selectNodes(path);
    if(oRows.length>0){
        var str = '';
        for(var i=oRows.length-1;i>0;i--){
        	str += oRows[i].selectSingleNode("REGION_ID").text+',';
        }
        str += oRows[0].selectSingleNode("REGION_ID").text;
        regions.value = str;    	
    }
}

//2. ��֤�ύ����
function submitBillInfo(form, ifClose)
{
  isClose = ifClose;
  //(1). ������Ϣ
  form.title.value = form.title.value.trimall();
  if(form.title.value=="")
  {
    EMsg("\"����\"����Ϊ��!");
    return false;
  }
  if(form.title.value.Tlength()>250)
  {
    EMsg("\"����\"���Ȳ��ܴ���250���ַ�!");
    return false;
  }
  form.author.value = form.author.value.trimall();
  if(form.author.value.Tlength()>50)
  {
    EMsg("\"ԭ����\"���Ȳ��ܴ���50���ַ�!");
    return false;
  }
  form.source.value = form.source.value.trimall();
  if(form.source.value.Tlength()>50)
  {
    EMsg("\"��Դ\"���Ȳ��ܴ���50���ַ�!");
    return false;
  }
/*
  var catalogId = (bbsCatalog.value!=null)?bbsCatalog.value:"";
  if(catalogId!=null && catalogId!="")//form.isToBbs.checked
  {
    if(catalogId.length==0) {EMsg("��ѡ��\"BBS��Ŀ\"!");return false;} else {}
    form.bbsCatalogId.value = catalogId;
  }*/
  
  
  //(2). �������� (--> ȡ��ͼƬ --> �ص�"http://server:port"�ַ���)
 /* var images = contentIframe.window.frames["templateBillInfo"].myEditor.window.ifrmDesign.document.getElementsByTagName("img");
  var imageStr ="";
  var imageValue = "";
  var tempValue;
  var reg;
  for(var i=0;i<images.length;i++)
  {
      imageValue = images[i].src;
      if(images[i].id!=null && images[i].id=="uploadImage"){
        tempValue = location.protocol+"\\/\\/"+location.host;//--> ����·���滻�����·��
        reg=eval("/"+tempValue+"/g");
        imageValue = imageValue.replace(reg, "../..");
        tempValue = "\\/"+form.tempDirectory.value+"\\/";//--> ��ʱĿ¼�滻����ȷĿ¼
        reg = eval("/"+tempValue+"/g");
        imageValue = imageValue.replace(reg, "/"+form.imageDirectory.value+"/");
        images[i].src = imageValue;
        imageValue = imageValue.substring(imageValue.lastIndexOf("/"));
        imageStr += '<input type="hidden" name="uploadImage" value="'+imageValue+'">';
      }
  }
  imageArray.innerHTML = imageStr;
  form.content.value = contentIframe.window.frames["templateBillInfo"].myEditor.window.ifrmDesign.document.documentElement.outerHTML;
  
  var contentValue = contentIframe.window.frames["templateBillInfo"].myEditor.submit();//Ϊ�˷�ֹ�ύʧ�ܵ����γ��֡�
  contentIframe.window.frames["templateBillInfo"].myEditor.document.body.innerHTML = contentValue;
  */
    var eWebEditorElement = document.getElementById("contentIframe").contentWindow.eWebEditor.window.document.documentElement;

    form.content.value = eWebEditorElement.outerHTML;
  if(form.content.value=="")
  {
    EMsg("\"��������\"����Ϊ��!");
    return false;
  }
  
  //(3). �ؼ���
  var iLen = form.keyword.length;
  var oOption;
  for(var i=0;i<iLen;i++){
      form.keyword.options(i).selected=true;
  }
  
  //(4). ����
  var hasAttach = false;
  var attachs = document.getElementsByName("uploadFile");
  var attachNames = document.getElementsByName("uploadFileName");
  for(var i=0;i<attachs.length;i++)
  {
    attachNames[i].value = attachs[i].value;
    if(attachNames[i].value!="")
    {
      hasAttach = true;
    }
  }
  
  var targetCout = 0;
  
  //(5). ��������
  var oTarget = selectedProjectGroupList.getObject();
  iLen = oTarget.length;
  targetCout += iLen;
  var targetStr = "";
  for(var i=0;i<iLen;i++)
  {
      targetStr += '<input type="hidden" name="projectGroup" value="'+oTarget.options[i].value+'">';
  }
  targetArray.innerHTML = targetStr;
  
  //(6).������Ա
  var oTarget = selectedStaffList.getObject();
  iLen = oTarget.length;
  targetCout += iLen;
  var otherTargetStr = "";
  for(var i=0;i<iLen;i++)
  {
      otherTargetStr += '<input type="hidden" name="otherTarget" value="'+oTarget.options[i].value+'">';
  }
  otherTargetArray.innerHTML = otherTargetStr;
  
  //(7).��֯��
  var oTarget = selectedOrgList.getObject();
  iLen = oTarget.length;
  targetCout += iLen;
  var orgTargetStr = "";
  for(var i=0;i<iLen;i++){
      orgTargetStr += '<input type="hidden" name="orgTarget" value="'+oTarget.options[i].value+'">';
  }
  orgTargetArray.innerHTML = orgTargetStr;

  //(8).����
  form.regionsArray.value = Ext.isEmpty(regions.value)?'':regions.value;//�������������м����
  
  if(form.category.value == ""&&targetCout == 0 && form.regionsArray.value == "")
  {
    var flag = msgBox("δѡ�񷢲���������ͣ�ȷ�Ϸ�����ù��潫��ȫרҵ�ɼ���",MSG_OKCANCEL,MSG_INFORMATION,MSG_DEFAULTBUTTON1);
    if(flag != 1){
    	return false;
    }
  }
  
  if(hasAttach)
  {
    showBlur("�ļ��ϴ���,�Ƿ�ȷ�Ϲرմ���?");
    showWait("�����ϴ��ļ�");
  }
  form.action=billUrl+"tag="+form.tag.value;
  
    form.submit();

}

function afterUpload()
{
  try{
	hideWait();
	hideBlur();
	if(document.readyState=="complete")
	{
		var xmlDom = window.frames["billInfo"].document.XMLDocument;
		if(xmlDom==null) return;
		//alert(xmlDom.xml);
		var errCode = xmlDom.selectSingleNode("/root/error_code");
		if(errCode==null || errCode.text != 0)
		{
            EMsg(xmlDom.selectSingleNode("/root/error_msg").text);
		}
		else
		{
		    try
		    {
		      if(window.opener.billInfoData!=null)
		      {
		          window.opener.billInfoData.doRefresh(false);
		      }else{
		          window.opener.loadBillInfos();
		      }
			  
			  if(window.opener.opener.loadBillInfos){
				window.opener.opener.loadBillInfos();
			  }
		    }catch(e){}
		    
            if(billInfoId==0){

                console.log(document.getElementById("contentIframe").contentWindow.eWebEditor.window.document.body);
              billInfoId = xmlDom.selectSingleNode("/root/Key").text;
              staff_name.innerHTML = xmlDom.selectSingleNode("/root/STAFF_NAME").text;
              organization.innerHTML = xmlDom.selectSingleNode("/root/ORG_NAME").text;
              submit_date.innerHTML = xmlDom.selectSingleNode("/root/SUBMIT_DATE").text;
              isToBbs = eval(xmlDom.selectSingleNode("/root/IS_TO_BBS").text);
              isToDocument = eval(xmlDom.selectSingleNode("/root/IS_TO_DOCUMENT").text);
              
              //ITSM2.0����ʾ�鵵����
              var isItsmSys = document.getElementById("isItsmSys").value;//itsm:1
              if(isItsmSys != 1){
                if(isToBbs || isToDocument)//var returnValue = 
                    window.showModalDialog("bill_info_dispatch.htm?billInfoId="+billInfoId+"&action=ACTION_BOTH&title="+encodeURIComponent(billInfoForm.title.value),window,"dialogWidth=340px;dialogHeight=220px;help=0;scroll=0;status=0;");
              }else {MMsg("��ӳɹ�!");}
              if(isClose) goToBack();
              else setBlank(billInfoForm);//window.location = 'editBillInfo.htm';
              billInfoId = 0;
            }else{
              MMsg("�޸ĳɹ�!");
              if(isClose)//"ȷ��"
              {
                  goToBack();
              }
              else       //"Ӧ��"
              {
                  //(1). ���������б�
                  resetMessageStatus();
                  reloadMessage(xmlDom);
                  //(2). ���¸�������
                  oData.doRefresh(false);
                  clearAttach();
              }
            }
		}
	}
  }catch(e){}
}

function goToBack()
{
    //window.location.href = '../../workshop/info/billInfo.htm';
    //if(history.length>1) {history.go(-2);} else{window.close();}
    window.close();
}

function setBlank(form)
{
    //(1). ������Ϣ
    form.title.value = "";
    form.author.value = "";
    form.source.value = "";
    //(2). ��������
    contentIframe.window.frames["templateBillInfo"].myEditor.document.body.innerHTML="";
    //(3). �ؼ���
    var iLen = form.keyword.length;
    var oOption;
    for(var i=iLen-1;i>=0;i--){
        form.keyword.options.remove(i);
    }
    //(4). ������ǩ
    clearAttach();
}

function showStaffInfo(id)
{
    window.showModalDialog("staff_info.htm?staffId="+id,window,"dialogWidth=440px;dialogHeight=420px;help=0;scroll=0;status=0;");
}

function getOrgProjectGroupList()
{
	projectGroupList.xmlsrc = "../../servlet/projectGroupServlet?tag=7&orgId="+event.selectedValue;
}

function showGroup()
{
    window.showModalDialog("../projectGroup/project_group.htm?groupType=GROUP",window,"dialogWidth=640px;dialogHeight=480px;help=0;status=0;");
    initGroups(billInfoForm);
    checkSelectedProjectGroupList();
}

function checkSelectedProjectGroupList()
{
    var oSource = projectGroupList.getObject();
    var oTarget = selectedProjectGroupList.getObject();
    var sOption;
    var tOption;
    var isFound;
    for(var i=0;i<oTarget.length;i++)
    {
        tOption = oTarget.options[i];
        isFound = false;
        for(var j=0;j<oSource.length;j++)
        {
            sOption = oSource.options[j];
            if(tOption.value==sOption.value)
            {
                isFound = true;
                break;
            }
        }
        if(!isFound)
        {
            oTarget.options.remove(i);
        }
    }
}

//-----��������-----
//1. "���"������ǩ
function addAttach()
{
	var oAttachTR = document.getElementById("attachTable").insertRow();
	//var iAttachIndex = oAttachTR.rowIndex+1;
	oTD_1 = oAttachTR.insertCell();
	oTD_1.height = 26;
	oTD_1.width = 16;
	
	oTD_2 = oAttachTR.insertCell();
	oTD_2.width = 13;
	oTD_2.innerHTML = '<IMG src="../../resource/image/form_cell_item.gif" width="6" height="6">';
	
	oTD_3 = oAttachTR.insertCell();
	oTD_3.width = 70;
	oTD_3.className = 'form_cell';
	oTD_3.innerText = "�ϴ��ļ�:";
	
	oTD_4 = oAttachTR.insertCell();
	oTD_4.width = 260;
	oTD_4.innerHTML = '<input type="file" name="uploadFile"/><input type="hidden" name="uploadFileName"/>';
	
	oTD_5 = oAttachTR.insertCell();
	oTD_5.innerHTML = '<input type="button" value="ɾ������" name="deleteAttachment" onclick="delAttach()"/>';
}

//2. "ɾ��"������ǩ
function delAttach()
{
	var oAttatch = getElement(event.srcElement,"tr");
	oAttatch.removeNode(true);
}

//3. "��ʼ��"������ǩ
function clearAttach()
{
    var elements = document.getElementsByName("uploadFile");
    if(elements!=null && elements.length>0)
    {
      for(var i=elements.length-1;i>=0;i--)
      {
        var oAttach = getElement(elements[i], "tr");
        oAttach.removeNode(true);
      }
    }
    addAttach();
}

//4. "����"����
function downLoad()
{
	var selectedRows = oData.getPropertys("LINK_ADDRESS");
    if(selectedRows.length>1) {MMsg("ͬʱֻ������һ������");return false}
	if(isExecute(selectedRows))
	{
		var fileName = encodeURIComponent(oData.getTexts(0));
		var pathName = encodeURIComponent(selectedRows);
		var path = "../../servlet/downloadservlet?filename="+fileName+"&pathname="+pathName;
		//document.all.downWin.src = path;
		window.top.location.href=path;
	}
}

//5. "ɾ��"���� 
function del()
{
	var attachIds = oData.getPropertys("BILL_INFO_ATTACH_ID");
	var linkAddress = oData.getPropertys("LINK_ADDRESS");
    if(attachIds== "") {MMsg("��ѡ��Ҫɾ���ļ�¼"); return false;}
    if(QMsg("�Ƿ�ɾ������Ϣ?")==MSG_YES)
    {
      var dXML = new ActiveXObject("Microsoft.XMLDOM");
      var sendXML = '<?xml version="1.0" encoding="gb2312"?><root>';
      for(var i=0;i<attachIds.length;i++){
        sendXML = sendXML + '<ATTACHMENTS>';
        sendXML = sendXML + '  <BILL_INFO_ATTACH_ID>'+attachIds[i]+'</BILL_INFO_ATTACH_ID>';
        sendXML = sendXML + '  <LINK_ADDRESS>'+linkAddress[i]+'</LINK_ADDRESS>';
        sendXML = sendXML + '</ATTACHMENTS>';
      }
      sendXML = sendXML + '</root>';
      dXML.loadXML(sendXML);

      xmlhttp.open("POST",billUrl+"tag=9",false);
      xmlhttp.send(dXML);
      if(!isSuccess(xmlhttp)) {
        MMsg("ɾ��ʧ��!");
      }else{
        MMsg("ɾ���ɹ�!");
      }
      oData.doRefresh(false);
    }
}


//-----�ؼ��ֲ���------

var isEdit=false;//�����޸�״̬�����ܽ���"����"��"����"����

//1. "���"�ؼ���
function doAdd(oText)
{
    if(oText.value.trimall()=="") return;
    var keyArr = oText.value.trimall().split(" ");
    var oOption;
    for(var i=0;i<keyArr.length;i++)
    {
        oOption=document.createElement("OPTION");
        oOption.text=keyArr[i];
        document.getElementById("keyword").add(oOption);
    }
    oText.value="";
    oText.focus();
}
function doKeyDown(oText, oUpdate)
{
    var enterKey=13;
    if(event.keyCode==enterKey){
        if(isEdit){
            doUpdate(oText, oUpdate);
        }else{
            doAdd(oText);
        }
    }
}

//2. "����"����
function doUp(keyword)
{
    var iIndex=keyword.selectedIndex;
    if(isEdit) return;
    if(iIndex==-1 || iIndex==0) return;
    
    var oOption=keyword.options(iIndex);
    var oSwapOption=keyword.options(iIndex-1);
    oOption.swapNode(oSwapOption);
}

//3. "����"����
function doDown(keyword)
{
    var iIndex=keyword.selectedIndex;
    var iLen=keyword.length;
    if(isEdit) return;
    if(iIndex==-1 || iIndex==iLen-1) return;
    
    var oOption=keyword.options(iIndex);
    var oSwapOption=keyword.options(iIndex+1);
    oOption.swapNode(oSwapOption);
}

//7. "ɾ��"����
function doDel(keyword)
{
    var iLen=keyword.length;
    if(isEdit) return;
    for(var i=iLen-1;i>=0;i--)
    {
        var oOption=keyword.options(i);
        if(oOption.selected==true)
           keyword.options.remove(i);
    }
    keyword.selectedIndex=0;
}

//8. "�༭"����
function doEdit(keyword,oText)
{
    isEdit=true;
    var iIndex=keyword.selectedIndex;
    if(iIndex==-1) return;
    
    oText.value=keyword.options(iIndex).text;
    oUpdate.updateIndex=iIndex;
    oAdd.style.display="none";
    oUpdate.style.display="block";
}

//9. "����"����
function doUpdate(oText,oUpdate)
{
    if(oText.value.trimall()=="") return;
    var iIndex=parseInt(oUpdate.updateIndex);
    if(iIndex==-1) return;
    
    document.getElementById("keyword").options(iIndex).text=oText.value.trimall();
    //keyword.options(iIndex).selected=true;
    document.getElementById("keyword").selectedIndex=iIndex;
    
    oAdd.style.display="block";
    oUpdate.style.display="none";
    isEdit=false;
    oUpdate.updateIndex="-1";
    oText.value="";
    oText.focus();
}

