/*********************************
 * 单击维护作业一条记录 联动显示对应维护作业项目数据
 *********************************/
var grid1 = new Object();
var aMaintJobInstanceId;
function showRef(grid){
	grid1 = grid;
    var row = grid.getSelectionModel().getSelected();
    if(typeof(row)=='undefined'){
        return;
    }
   
    var maintanceJobId = row.get("MAINTANCE_JOB_ID");
    var EXEC_DATETIME = row.get("EXEC_DATETIME");
    var resultParam = {};
    resultParam.startDate = document.getElementById("PLAN_EXEC_DATE_TO").value;
    resultParam.MAINTANCE_JOB_ID = maintanceJobId;
    resultParam.MAINT_JOB_INSTANCE_ID = row.get("MAINT_JOB_INSTANCE_ID");
    oGridPanel.maintItemJobList.search(resultParam);
    aMaintJobInstanceId = row.get("MAINT_JOB_INSTANCE_ID");
	
	aMaintanceJobId = maintanceJobId;
	aMaintanceType = row.get("JOB_TYPE_CODE");
    
    document.getElementById("maintanceJobId").value = maintanceJobId;
    document.getElementById("EXEC_DATETIME").value = EXEC_DATETIME;
    document.getElementById("refSearchList").innerHTML = "";
    /*
    var selectDate = document.getElementById("PLAN_EXEC_DATE_TO").value;
    var maintJobInstanceId = row.get("MAINT_JOB_INSTANCE_ID");
    document.getElementById("refSearchList").innerHTML = "";
    document.getElementById("maintJobItemList").src="../query/show_result.html?result=111100004&startDate="+selectDate + "&MAINTANCE_JOB_ID="+ maintanceJobId+"&MAINT_JOB_INSTANCE_ID="+maintJobInstanceId; 
	*/
	removeHdCheck();
}

function showRef2(grid){
	grid1 = grid;
    var row = grid.getSelectionModel().getSelected();
    var rows = grid.getSelectionModel().getSelections();
    if(typeof(row)=='undefined' || rows.length > 1){
        return;
    }
    var maintanceJobId = row.get("MAINTANCE_JOB_ID");
    var EXEC_DATETIME = row.get("EXEC_DATETIME");
    var resultParam = {};
    resultParam.startDate = row.get("PLAN_EXEC_DATE").substr(0,10);
    resultParam.MAINTANCE_JOB_ID = maintanceJobId;
    resultParam.MAINT_JOB_INSTANCE_ID = row.get("MAINT_JOB_INSTANCE_ID");
    oGridPanel.maintItemJobList.search(resultParam);
    aMaintJobInstanceId = row.get("MAINT_JOB_INSTANCE_ID");
	aMaintanceJobId = maintanceJobId;
	aMaintanceType = row.get("JOB_TYPE_CODE");
    
    document.getElementById("maintanceJobId").value = maintanceJobId;
    document.getElementById("EXEC_DATETIME").value = EXEC_DATETIME;
    document.getElementById("refSearchList").innerHTML = "";
    /*
    var selectDate = row.get("PLAN_EXEC_DATE").substr(0,10);
    var maintJobInstanceId = row.get("MAINT_JOB_INSTANCE_ID");
    
    document.getElementById("maintJobItemList").src="../query/show_result.html?result=111100004&startDate="+selectDate + "&MAINTANCE_JOB_ID="+ maintanceJobId+"&MAINT_JOB_INSTANCE_ID="+maintJobInstanceId;
	*/
}

//多选 维护作业项目
function fillInSingle(grid)
{	
    var row = grid.getSelectionModel().getSelected();

    if(typeof(row)=='undefined'){
            return;
    }
    var maintJobItemId = row.get("MAINT_JOB_ITEM_ID");
    var maintJobInstanceId = row.get("MAINT_JOB_INSTANCE_ID");
    var jobItemInstanceId = row.get("JOB_ITEM_INSTANCE_ID");
    var itemName = row.get("ITEM_NAME");
    var itemInstanceSts = row.get("SUB")=='提交'? 2 : 1 ;
    
    var execDate = document.getElementById("EXEC_DATETIME").value;
    if(execDate.split(',').length>1){
        //var execDates = execDate.split(',');
        //execDate = execDates[execDates.length-1];
        execDate = getPlanExecDate(maintJobInstanceId+'');
    }
    
    var date = document.getElementById("PLAN_EXEC_DATE_TO").value + " " +
               execDate;//document.getElementById("EXEC_DATETIME").value;
    
    var maintanceJobId = document.getElementById("maintanceJobId").value;
    document.getElementById("refSearchList").innerHTML = relateQuery(row);
    var params = new Array();
    params.push(jobItemInstanceId);  //实例ID
    params.push(maintJobItemId);  //项目ID
    params.push(date);  //日期
    params.push(maintanceJobId);
    params.push(itemInstanceSts);
    params.push("");
    params.push(maintJobInstanceId);
    var resultURL = "jobItemIn.jsp?params="+params.join("●")+"&rnd="+(Math.random()*(20-10)+10)+"&type="+type;
    document.getElementById("JobItemInf").src = resultURL;  
}

//关联查询处理
function relateQuery(row){
    var LINK_ADDR = row.get("LINK_ADDR");
    var linkAddrHTML = ""; 
    var count = getStrCount(LINK_ADDR,'</a>')
    if(count>1){
        for(var i=0;i<count;i++){
            var index = LINK_ADDR.indexOf('</a>');
            var text = LINK_ADDR.substring(0,index+4);
            LINK_ADDR = LINK_ADDR.replace(text,"");
            
             if(linkAddrHTML=="")
             {
                 linkAddrHTML = text;
             }else{
                    linkAddrHTML = linkAddrHTML + "<br/>"+text;
             }
        }
    }else{
        linkAddrHTML = LINK_ADDR;
    }
    return linkAddrHTML;
}

/************************
**统计字符串中特定字符串的个数
*************************/
function getStrCount(scrstr,armstr)
{ //scrstr 源字符串 armstr 特殊字符
    var count=0;
    while(scrstr.indexOf(armstr) >=1 )
    {
        scrstr = scrstr.replace(armstr,"");
        count++;    
    }
    return count;
}

//超过1个为多选 多选时 控制信息展示
function getSelectRows(grid){
	
        var selectionModel = grid.getSelectionModel();
        var rows = selectionModel.getSelections();
        var arrayUrl=getURLSearch();
        if(rows.length >0){
             var maintJobItemId = "";
             var maintJobInstanceId = "";
             var jobItemInstanceId  = "";
             var itemName = "";
             var itemInstanceSts = "";
             var EXEC_RESULT = "";
             var MAINT_JOB_INSTANCE_ID = aMaintJobInstanceId; 
			 var relateHTML = ""; 
             for (var i = 0, row; row = rows[i]; i++){
                 maintJobItemId += row.get("MAINT_JOB_ITEM_ID")+",";
                 maintJobInstanceId += row.get("MAINT_JOB_INSTANCE_ID")+",";
                 jobItemInstanceId += row.get("JOB_ITEM_INSTANCE_ID")+",";
                 itemName += row.get("ITEM_NAME")+",";
                 itemInstanceSts +=( row.get("SUB")=='提交'? 2 : 1 )+",";
				 //alert(row.get("EXECR"));
                 EXEC_RESULT += row.get("EXECR")+",";
				 var oHTML = relateQuery(row);
				 relateHTML += oHTML + ( oHTML=="" ? "" : "<br/>" );
            }
             document.getElementById("refSearchList").innerHTML = relateHTML;
             maintJobItemId = maintJobItemId.substr(0,maintJobItemId.length-1);
             maintJobInstanceId = maintJobInstanceId.substr(0,maintJobInstanceId.length-1);
	         jobItemInstanceId = jobItemInstanceId.substr(0,jobItemInstanceId.length-1);
             itemName = itemName.substr(0,itemName.length-1);
             itemInstanceSts = itemInstanceSts.substr(0,itemInstanceSts.length-1);
	         EXEC_RESULT = EXEC_RESULT.substr(0,EXEC_RESULT.length-1);
             
             var execDate = document.getElementById("EXEC_DATETIME").value;
		     if(execDate.split(',').length>1){
		        //var execDates = execDate.split(',');
		        //execDate = execDates[execDates.length-1];
		     	execDate = getPlanExecDate(maintJobInstanceId);
		     }
		    
	        var date = document.getElementById("PLAN_EXEC_DATE_TO").value + " " +
	               execDate;//document.getElementById("EXEC_DATETIME").value;
                   
                   
	         var maintanceJobId = document.getElementById("maintanceJobId").value;
             var params = [];
		    params.push(jobItemInstanceId);  //实例ID
		    params.push(maintJobItemId);  //项目ID
		    params.push(date);  //日期
		    params.push(maintanceJobId);
		    params.push(itemInstanceSts);
            params.push(EXEC_RESULT);
            params.push(MAINT_JOB_INSTANCE_ID);
		    var resultURL = "jobItemIn.jsp?params="+params.join("●")+"&rnd="+(Math.random()*(20-10)+10);
		    document.getElementById("JobItemInf").src = resultURL; 
        }
}

function getBeforSysdate(){
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST","../../servlet/jobiteminstanceservlet?tag=12&sysdate=sysdate-1",false);
	xmlhttp.send();
	var dXML = new ActiveXObject("Microsoft.XMLDOM");
	dXML.load(xmlhttp.responseXML);
	var element = dXML.selectSingleNode("/root/rowSet");
	var sysdate = element.selectSingleNode("VALUE").text;
    return sysdate;
}

function formatDate(d){
	return d.getYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}

//维护作业执行月查询情况
function maintJobExec_Month1(){
	var grid;
	if(document.getElementById('maintanceJobList').style.display==""){
		grid = oGridPanel.maintanceJobList;
	}else{
		grid = oGridPanel.maintanceJobListNo;
	}
	row = grid.getSelectionModel().getSelected();
	monthSearch(row);
}

//双击事件
function maintJobExec_Month(){
	row = grid1.getSelectionModel().getSelected();
	monthSearch(row);
}

//维护作业执行月查询情况
function monthSearch(row){
	var aMaintanceJobId = "";
	var aMaintanceType = "";
	if(typeof(row)=='undefined'){
    	alert("请先选择作业项");
        return;
    }
    var aMaintanceJobId = row.get("MAINTANCE_JOB_ID");
    var aMaintanceType = row.get("JOB_TYPE_CODE");
	if(aMaintanceType=="" && aMaintanceJobId ==""){
		alert("请先选择作业项");
		return ;
	}
	var maxWidth = screen.availWidth - 10;
	var maxHeight = screen.availHeight - 30;
	width = (typeof(width) == "undefined") ? maxWidth : width;
	height = (typeof(height) == "undefined") ? maxHeight : height;
	var top = (maxHeight - height) / 2;
	var left = (maxWidth - width) / 2;
	var sFeatures = new Array();
	sFeatures.push("width="+width);
	sFeatures.push("height="+height);
	sFeatures.push("top="+top);
	sFeatures.push("left="+left);
	sFeatures.push("location="+0);
	sFeatures.push("menubar="+0);
	sFeatures.push("resizable="+1);
	sFeatures.push("scrollbars="+1);
	sFeatures.push("status="+0);
	sFeatures.push("titlebar="+0);
	sFeatures.push("toolbar="+0);
	window.open("/workshop/maintjobplan/itemResultSearch.jsp?hiddenCondition=1&jobType="+aMaintanceType+"&maintanceJobId="+aMaintanceJobId,"_blank",sFeatures.join(","));
}

function removeHdCheck(){
	 var hd_checker = oGridPanel.maintItemJobList.getEl().select('div.x-grid3-hd-checker');  
     var hd = hd_checker.first(); 
     hd.removeClass('x-grid3-hd-checker-on');  
}

function getPlanExecDate(jobInstanceId){
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST","../../servlet/maintjobinstanceservlet?tag=20&jobInstanceId="+jobInstanceId.split(',')[0],false);
	xmlhttp.send();
	var planDate = xmlhttp.responseXML.selectSingleNode("/root/Msg/PLAN_EXEC_DATE").text;
	return planDate.substring(11);
}