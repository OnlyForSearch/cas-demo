var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var selectXml = new ActiveXObject("Microsoft.XMLDOM");
var actionURL = '../../servlet/AlarmReportServlet?';
var arrayUrl=getURLSearch();
//����ID
var id = arrayUrl.id;
var filename="";
var graphURL = '../../servlet/DisplayChart?filename=';
var param=new Array();
//ϵͳ����
var sysdate="";
//��ǰ��ѯ����Ĳɼ�����
var gatherDate="";

//��ȡ������ǰn�������
function getBeforSysdate(beforDay){
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST","../../servlet/jobiteminstanceservlet?tag=12&sysdate=sysdate-"+beforDay,false);
	xmlhttp.send();
	selectXml.load(xmlhttp.responseXML);
	var element = selectXml.selectSingleNode("/root/rowSet");
	var sysdate = element.selectSingleNode("VALUE").text;
    return sysdate;
}

//��ȡ��������
function getReportTitle(){
	var param = new Array();
	param.push('action=3');
	param.push('id='+id);
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.Open("POST",actionURL+param.join('&'),false);
    xmlhttp.send();
    return xmlhttp.responseText;
}
//��ʾ�ȴ���
function showWait(){
	var oWait = document.getElementById("waitimg")
	oWait.style.pixelLeft=(window.document.body.clientWidth-oWait.style.pixelWidth)/2;
	oWait.style.pixelTop=(window.document.body.clientHeight-oWait.style.pixelHeight)/2;
	oWait.style.display="block";
}

//��ȡ��¼Ա����������
function getStaffRegion(){
	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.Open("POST",actionURL+"action=9",false);
    xmlhttp.send();
    return xmlhttp.responseText;
}

//��ʼ������
function setRegion(){
	var staff_region=getStaffRegion();
	/*xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST",actionURL+"action=6&type=region",false);
	xmlhttp.send();
	selectXml.load(xmlhttp.responseXML);
	var regionId = document.getElementById("regionId");
	//����������
	var oRows=selectXml.selectNodes("//root/Info");
	for(var i=0;i<oRows.length;i++)
	{
		// ����Option����
		var objOption = new Option(oRows[i].attributes[1].value,oRows[i].attributes[0].value);
		regionId.add(objOption);
		
	}
	for(var i=0;i<regionId.length;i++)
	{
		if(regionId.options[i].value==staff_region)
			regionId.value=staff_region;
	}*/
	regionId.value=staff_region;
}
//��ȡ�ɼ�ʱ��
function getGatherDate(theCreateDate){
    var param = new Array();
	param.push('action=7');
	param.push('id='+id);
	param.push('date='+theCreateDate);
	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST",actionURL+param.join('&'),false);
	xmlhttp.send();
	return xmlhttp.responseText;
}
//��ȡ�ɼ����κ�
function getBatchid(theGatherDate){
    var  param = new Array();
	param.push('action=5');
	param.push('id='+id);
	param.push('date='+theGatherDate);
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.Open("POST",actionURL+param.join('&'),false);
    xmlhttp.send();
	return xmlhttp.responseText;
}
//�زɼ�
function regather(theGatherDate){
    var batchid=getBatchid(theGatherDate);
	var url = "/servlet/regatherorreanalyzeservlet?";
	var xmldoc =      '<?xml version="1.0" encoding="gb2312"?><xml>';
	xmldoc = xmldoc + '<GATHER_BATCH_ID>'+batchid+'</GATHER_BATCH_ID>';
	xmldoc = xmldoc + '</xml>';
	
	var dXML = new ActiveXObject("Microsoft.XMLDOM");
	dXML.loadXML(xmldoc);
	var paramArray = new Array();
	paramArray.push("tag=1");
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.onreadystatechange= function(){handleStateChange(xmlhttp);}
	xmlhttp.Open("POST",url+paramArray.join("&"),true);
	xmlhttp.send(dXML);
	gatherDate=getGatherDate(theGatherDate);
}
//�زɼ���ˢ��
function handleStateChange(xmlhttp){
    var state = xmlhttp.readyState;
    if(state==4)
    {
		search(1,1);
    }
}

//ʵʱ�ɼ�
function getRealTimeData(gather_id,param,exportTovalue){
	var url = "/servlet/regatherorreanalyzeservlet?";
	var paramArray = new Array();
	paramArray.push("tag=4");
	if(gather_id!=null && gather_id!=""){
		paramArray.push("gatherid="+gather_id);
	}
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.onreadystatechange= function(){handleStateChange_realtime(xmlhttp,param,exportTovalue);}
	xmlhttp.Open("POST",url+paramArray.join("&"),true);
	xmlhttp.send();
}
//ʵʱ�ɼ���ˢ��
function handleStateChange_realtime(xmlhttp,param,exportTovalue){
    var state = xmlhttp.readyState;
    if(state==4)
    {		
		gatherDate=getGatherDate(sysdate);
		search_page(exportTovalue,param);
    }
}
//����������ĺ�����ͨ��  
function DateDiff(sDate1,sDate2){//sDate1��sDate2��2007-7-3��ʽ  
   var aDate,oDate1,oDate2,iDays;
   aDate = sDate1.split("-");
   oDate1 = new Date(aDate[1]+'-'+aDate[2]+'-'+aDate[0]);   //ת��Ϊ7-3-2007��ʽ  
   aDate=sDate2.split("-");
   oDate2=new Date(aDate[1]+'-'+aDate[2]+'-'+aDate[0]);  
   iDays = parseInt(Math.abs(oDate1-oDate2)/1000/60/60/24);    //�����ĺ�����ת��Ϊ����  
   return iDays; 
}    

//��ѯ˫����������ѡ����
function rebuildSelect(url,obj,blank){
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST",url,false);
	xmlhttp.send();

	var dXML = new ActiveXObject("Microsoft.XMLDOM");
	dXML.load(xmlhttp.responseXML);

	obj.length = 0;
	var element = dXML.selectSingleNode("/root/rowSet");
        if(blank==null || blank==""){
          obj.add(new Option("",""));
    }
	while(element!=null){
		var text = element.selectSingleNode("TEXT").text;
		var val = element.selectSingleNode("VALUE").text;
		var objOption = new Option(text,val);
		obj.add(objOption);
		element = element.nextSibling;
	}
}


//��ȡ��¼Ա��������֯
function getStaffOrgId(){
	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.Open("POST",actionURL+"action=14",false);
    xmlhttp.send();
    return xmlhttp.responseText;
}

//��ȡsys_cofig��ʾ��ť���� ������ 20090914
function displayBtn(){
	btnSearch.style.display = "none";
	btnGather.style.display = "none";
	btnRegather.style.display = "none";
    var paramArray = new Array();
    paramArray.push("action=15");
	xmlhttp.Open("POST",actionURL+paramArray.join("&"),false);
	xmlhttp.send();
	var strBtns = xmlhttp.responseText;
	var arrayBtns = strBtns.split(",");
	for(var i=0;i<arrayBtns.length;i++)
	{
		if (arrayBtns[i]==1 || arrayBtns[i]=="1") {
			btnSearch.style.display = "";
		}
		else if (arrayBtns[i]==2 || arrayBtns[i]=="2") {
			btnGather.style.display = "";
		}
		else if (arrayBtns[i]==3 || arrayBtns[i]=="3") {
			btnRegather.style.display = "";
		}
	}
}

//�±���ɼ���ѯ�ĵ���15�����𲻳���30�죬�����²ɼ�����
function monthGatherSearch(){
	var exportTovalue=1;
	var flag=0;
	var yearVal = year.value;
	var monthVal = (month.value.length==1)?"0"+month.value:month.value;
	if(DateDiff(yearVal+"-"+monthVal+"-15",sysdate)>=30)
		flag=1;
	search(exportTovalue,flag);
}

//�ձ����ѯ��ʱ�䲻����30�죬�����²ɼ�����
function dateGatherSearch(){
	var theCreateDate=createDate.value;
	var exportTovalue=1;
	var flag=0;
	if(DateDiff(theCreateDate,sysdate)>=30)
		flag=1;
	search(exportTovalue,flag);
}

