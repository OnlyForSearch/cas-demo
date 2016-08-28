var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var selectXml = new ActiveXObject("Microsoft.XMLDOM");
var actionURL = '../../servlet/AlarmReportServlet?';
var arrayUrl=getURLSearch();
//报表ID
var id = arrayUrl.id;
var filename="";
var graphURL = '../../servlet/DisplayChart?filename=';
var param=new Array();
//系统日期
var sysdate="";
//当前查询结果的采集日期
var gatherDate="";

//获取服务器前n天的日期
function getBeforSysdate(beforDay){
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST","../../servlet/jobiteminstanceservlet?tag=12&sysdate=sysdate-"+beforDay,false);
	xmlhttp.send();
	selectXml.load(xmlhttp.responseXML);
	var element = selectXml.selectSingleNode("/root/rowSet");
	var sysdate = element.selectSingleNode("VALUE").text;
    return sysdate;
}

//获取报表名称
function getReportTitle(){
	var param = new Array();
	param.push('action=3');
	param.push('id='+id);
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.Open("POST",actionURL+param.join('&'),false);
    xmlhttp.send();
    return xmlhttp.responseText;
}
//显示等待框
function showWait(){
	var oWait = document.getElementById("waitimg")
	oWait.style.pixelLeft=(window.document.body.clientWidth-oWait.style.pixelWidth)/2;
	oWait.style.pixelTop=(window.document.body.clientHeight-oWait.style.pixelHeight)/2;
	oWait.style.display="block";
}

//获取登录员工所属区域
function getStaffRegion(){
	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.Open("POST",actionURL+"action=9",false);
    xmlhttp.send();
    return xmlhttp.responseText;
}

//初始化区域
function setRegion(){
	var staff_region=getStaffRegion();
	/*xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST",actionURL+"action=6&type=region",false);
	xmlhttp.send();
	selectXml.load(xmlhttp.responseXML);
	var regionId = document.getElementById("regionId");
	//区域下拉框
	var oRows=selectXml.selectNodes("//root/Info");
	for(var i=0;i<oRows.length;i++)
	{
		// 建立Option对象
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
//获取采集时间
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
//获取采集批次号
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
//重采集
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
//重采集后刷新
function handleStateChange(xmlhttp){
    var state = xmlhttp.readyState;
    if(state==4)
    {
		search(1,1);
    }
}

//实时采集
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
//实时采集后刷新
function handleStateChange_realtime(xmlhttp,param,exportTovalue){
    var state = xmlhttp.readyState;
    if(state==4)
    {		
		gatherDate=getGatherDate(sysdate);
		search_page(exportTovalue,param);
    }
}
//计算天数差的函数，通用  
function DateDiff(sDate1,sDate2){//sDate1和sDate2是2007-7-3格式  
   var aDate,oDate1,oDate2,iDays;
   aDate = sDate1.split("-");
   oDate1 = new Date(aDate[1]+'-'+aDate[2]+'-'+aDate[0]);   //转换为7-3-2007格式  
   aDate=sDate2.split("-");
   oDate2=new Date(aDate[1]+'-'+aDate[2]+'-'+aDate[0]);  
   iDays = parseInt(Math.abs(oDate1-oDate2)/1000/60/60/24);    //把相差的毫秒数转换为天数  
   return iDays; 
}    

//查询双中心下拉框选择项
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


//获取登录员工所属组织
function getStaffOrgId(){
	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.Open("POST",actionURL+"action=14",false);
    xmlhttp.send();
    return xmlhttp.responseText;
}

//获取sys_cofig显示按钮配置 江梦添 20090914
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

//月报表采集查询的当月15号算起不超过30天，有重新采集功能
function monthGatherSearch(){
	var exportTovalue=1;
	var flag=0;
	var yearVal = year.value;
	var monthVal = (month.value.length==1)?"0"+month.value:month.value;
	if(DateDiff(yearVal+"-"+monthVal+"-15",sysdate)>=30)
		flag=1;
	search(exportTovalue,flag);
}

//日报表查询的时间不超过30天，有重新采集功能
function dateGatherSearch(){
	var theCreateDate=createDate.value;
	var exportTovalue=1;
	var flag=0;
	if(DateDiff(theCreateDate,sysdate)>=30)
		flag=1;
	search(exportTovalue,flag);
}

