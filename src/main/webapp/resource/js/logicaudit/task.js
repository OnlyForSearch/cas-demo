var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var url = "../../servlet/logicgathertaskservlet?";
var taskRows = new Array();
var selectedRowIndex = -1;
var isOK = "";
function Row(){
    this.TASK_ID="";
    this.LOGIC_DATA_GATHER_ID="";
    this.REGION_ID="";
    this.NE_ID="";
    this.NE_NAME = "";
    this.TASK_TYPE="";
    this.TASK_TYPE_NAME = "";
    this.TASK_INTERVAL="";
    this.SOURCE_BEGIN_DATE="";
    this.SOURCE_END_DATE="";
    this.NEXT_TASK_DATE="";
    this.STATE="";
    this.STATE_NAME="";
    this.STATE_DATE="";
    this.INDEX = "";
}

function addTask(logicdatagatherid)
{
	if(getTriggerType(logicdatagatherid)!=1){
		alert("不是定时稽核任务，或者修改还未保存，无法修改任务。");
		return;
	}
//        if(REGION_ID.options[REGION_ID.selectedIndex].value=="")
//        {
//                EMsg("区域不能为空!");
//                return false;
//        }
//        if(NE_ID.value=="")
//        {
//                EMsg("网元不能为空!");
//                return false;
//        }
        if(TASK_TYPE.options[TASK_TYPE.selectedIndex].value=="")
        {
                EMsg("任务类型不能为空!");
                return false;
        }
        if(TASK_INTERVAL.value=="")
        {
                EMsg("间隔不能为空!");
                return false;
        }
//        if(begindate.getDateTime()!="" || enddate.getDateTime()!=""){
//                if(begindate.getDateTime()=="" || enddate.getDateTime()==""){
//                        EMsg("采集源开始时间和采集源结束时间只能同时为空或同时不为空!");
//                        return false;
//                }
//        }
        if(executedate.value=="" && TASK_TYPE.options[TASK_TYPE.selectedIndex].value!="1")
        {
                EMsg("任务执行时间不能为空!");
                return false;
        }
        if(TASK_TYPE.options[TASK_TYPE.selectedIndex].value!="1"){
         // if(executedate.checkDate()=="false"){
         //       return false;
         // }
        }
      //  if(begindate.checkDate()=="false" || enddate.checkDate()=="false")
      //  {
      //          return false;
      //  }
        if( STATE.options[STATE.selectedIndex].value=="")
        {
                EMsg("状态不能为空!");
                return false;
        }
        var begindatetime = begindate.value;
        var enddatetiem = enddate.value;
        if(begindatetime>enddatetiem && (begindatetime!="" && enddatetiem!="")){
          EMsg("开始时间不能大于结束时间!");
          return false;
        }

        LOGIC_DATA_TASK.XMLDocument.selectSingleNode("/Msg/TASK_ID").text = "";
        LOGIC_DATA_TASK.XMLDocument.selectSingleNode("/Msg/REGION_ID").text = LOGIC_DATA_GATHER.XMLDocument.selectSingleNode("/Msg/REGION_ID").text;
        try{
          LOGIC_DATA_TASK.XMLDocument.selectSingleNode("/Msg/NE_ID").text = LOGIC_DATA_GATHER.XMLDocument.selectSingleNode("/Msg/NE_ID").text;
          }catch(e){}
        LOGIC_DATA_TASK.XMLDocument.selectSingleNode("/Msg/TASK_TYPE").text = TASK_TYPE.options[TASK_TYPE.selectedIndex].value;
        LOGIC_DATA_TASK.XMLDocument.selectSingleNode("/Msg/TASK_INTERVAL").text = TASK_INTERVAL.value;
        LOGIC_DATA_TASK.XMLDocument.selectSingleNode("/Msg/SOURCE_BEGIN_DATE").text = begindate.value;
        LOGIC_DATA_TASK.XMLDocument.selectSingleNode("/Msg/SOURCE_END_DATE").text = enddate.value;
        LOGIC_DATA_TASK.XMLDocument.selectSingleNode("/Msg/NEXT_TASK_DATE").text = executedate.value;
        LOGIC_DATA_TASK.XMLDocument.selectSingleNode("/Msg/STATE").text = STATE.options[STATE.selectedIndex].value;
	    LOGIC_DATA_TASK.XMLDocument.selectSingleNode("/Msg/LOGIC_DATA_GATHER_ID").text = logicdatagatherid;

        if(selectedRowIndex<0){
  		var row = new Row();
        	row.TASK_ID = "";
		row.LOGIC_DATA_GATHER_ID = logicdatagatherid;
		row.REGION_ID = REGION_ID.options[REGION_ID.selectedIndex].value;
		row.NE_ID=NE_ID.value;
		row.NE_NAME = NE_ID.text;
		row.TASK_TYPE= TASK_TYPE.options[TASK_TYPE.selectedIndex].value;
		row.TASK_TYPE_NAME = TASK_TYPE.options[TASK_TYPE.selectedIndex].text;
		row.TASK_INTERVAL=TASK_INTERVAL.value;
		row.SOURCE_BEGIN_DATE=begindate.value;
		row.SOURCE_END_DATE=enddate.value;
		row.NEXT_TASK_DATE=executedate.value;
		row.STATE=STATE.options[STATE.selectedIndex].value;
		row.STATE_NAME=STATE.options[STATE.selectedIndex].text;
		row.STATE_DATE="";
       	 	addRow(row);
        }else{
    		row = taskRows[selectedRowIndex-1];
		row.REGION_ID = REGION_ID.options[REGION_ID.selectedIndex].value;
		row.NE_ID=NE_ID.value;
		row.NE_NAME = NE_ID.text;
		row.TASK_TYPE= TASK_TYPE.options[TASK_TYPE.selectedIndex].value;
		row.TASK_TYPE_NAME = TASK_TYPE.options[TASK_TYPE.selectedIndex].text;
		row.TASK_INTERVAL=TASK_INTERVAL.value;
		row.SOURCE_BEGIN_DATE=begindate.value;
		row.SOURCE_END_DATE=enddate.value;
		row.NEXT_TASK_DATE=executedate.value;
		row.STATE=STATE.options[STATE.selectedIndex].value;
		row.STATE_NAME=STATE.options[STATE.selectedIndex].text;
          	updateRow(row);
        }
}

function addRow(RowObj){
  var table = document.getElementById("tasksTable");
  var tr = table.children;
  if(tr[0].tagName == "TBODY"){
    tr = tr[0].children;
  }
  Row.INDEX = tr.length;
  var paramArray = new Array();
  paramArray.push("tag="+3);
  var url = "../../servlet/logicgathertaskservlet?";

  xmlhttp.Open("POST",url+paramArray.join("&"),false);
  xmlhttp.send(LOGIC_DATA_TASK.XMLDocument);

  isOK = isSuccess(xmlhttp);
  if(isOK)
  {
          var row = table.insertRow();
          row.bgColor="#FFFFFF";
          row.height="23";
          row.id = "";
          row.onclick = function(){clickRow(row);}
          row.ondblclick = function(){Edit();}
          row.onmousedown = function(){RightMenu(row);}
          RowObj.TASK_ID = xmlhttp.responseXML.selectSingleNode("/root/Key").text;
          addCell(row,RowObj);
          setValuenNull();
          taskRows.push(RowObj);
          MMsg("添加成功!");
          document.getElementById("taskContent").style.display="none";
  }
}

function updateRow(rowObj){
  LOGIC_DATA_TASK.XMLDocument.selectSingleNode("/Msg/TASK_ID").text = rowObj.TASK_ID;
   if(selectedRowIndex>0){
 	 var table = document.getElementById("tasksTable");
 	 var tr = table.children;
	  if(tr[0].tagName == "TBODY"){
 	   tr = tr[0].children;
 	 }

        var paramArray = new Array();
        paramArray.push("tag="+4);
        var url = "../../servlet/logicgathertaskservlet?";
        xmlhttp.Open("POST",url+paramArray.join("&"),false);
        xmlhttp.send(LOGIC_DATA_TASK.XMLDocument);
        isOK = isSuccess(xmlhttp);
        if(isOK)
        {
                  MMsg("修改成功!");
                  document.getElementById("taskContent").style.display="none";
                  taskRows[selectedRowIndex-1] = rowObj;
                  var td = tr[selectedRowIndex].children;

                  td[0].innerText = rowObj.TASK_TYPE_NAME;  //
                  td[1].innerText = rowObj.NE_NAME;
                  td[2].innerText = rowObj.TASK_INTERVAL;  //间隔
                  td[3].innerText = rowObj.STATE_NAME; //状态
                  td[4].innerText = rowObj.NEXT_TASK_DATE;  //执行时间
                  td[5].innerText = rowObj.SOURCE_BEGIN_DATE;  //数据源起始时间
                  td[6].innerText = rowObj.SOURCE_END_DATE;  //数据源结束时间;
        }
    }else{
      alert("请选择要修改的记录");
    }
}

function Edit(){
  document.getElementById("taskContent").style.display="";
  setValue();
  changeTaskType();
}

function clickRow(row){
   selectedRowIndex = row.rowIndex;
   var table = document.getElementById("tasksTable");
   var tr = table.children;
   if(tr[0].tagName == "TBODY"){
     tr = tr[0].children;
   }
    for(var i=1;i<tr.length;i++){
  	tr[i].bgColor = "#FFFFFF";
    }
    row.bgColor = "#F1F1A6";
    iniValue();
}

function addCell(row,rowObj){
  var cell = row.insertCell(0);
  cell.align="center";
  cell.innerText = rowObj.TASK_TYPE_NAME;  //

  cell = row.insertCell(1);
  cell.align="center";
  cell.style.display="none";
  cell.innerText = rowObj.NE_NAME;

  cell = row.insertCell(2);
  cell.align="center";
  cell.innerText = rowObj.TASK_INTERVAL;  //间隔

  cell = row.insertCell(3);
  cell.align="center";
  cell.innerText = rowObj.STATE_NAME; //状态

  cell = row.insertCell(4);
  cell.align="center";
  cell.innerText = rowObj.NEXT_TASK_DATE;  //执行时间

  cell = row.insertCell(5);
  cell.align="center";
  cell.innerText = rowObj.SOURCE_BEGIN_DATE;  //数据源起始时间

  cell = row.insertCell(6);
  cell.align="center";
  cell.innerText = rowObj.SOURCE_END_DATE;  //数据源结束时间;
}

function deleteRow(){
  var table = document.getElementById("tasksTable");
  try{
    if(selectedRowIndex>0){
        table.deleteRow(selectedRowIndex);
        for(var j=selectedRowIndex-1;j<taskRows.length;j++){
          if(j>=selectedRowIndex-1 && selectedRowIndex>0 && j<(taskRows.length-1)){
            taskRows[j]= taskRows[j+1];
          }
  	}
        taskRows.pop();
        selectedRowIndex = -1;
    }else{
      alert("请选择要删除的记录");
    }
  }catch(e){}
}

function setValue(){
  if(selectedRowIndex>0){
  	var obj = taskRows[selectedRowIndex-1];
	doFoucs(obj.TASK_TYPE,TASK_TYPE);
        doFoucs(obj.REGION_ID,REGION_ID);
	NE_ID.value = obj.NE_ID;
	NE_ID.text = obj.NE_NAME;
        TASK_ID.value = obj.TASK_ID;
        LOGIC_DATA_GATHER_ID.value = obj.LOGIC_DATA_GATHER_ID;
	doFoucs(obj.TASK_TYPE,TASK_TYPE);
        doFoucs(obj.STATE,STATE);
	TASK_INTERVAL.value = obj.TASK_INTERVAL;
	begindate.value=obj.SOURCE_BEGIN_DATE;
	enddate.value=obj.SOURCE_END_DATE;
	executedate.value=obj.NEXT_TASK_DATE;
  }
}

function setValuenNull(){
  	selectedRowIndex = -1;
	TASK_TYPE.selectedIndex = 0;
    REGION_ID.selectedIndex = 0;
	NE_ID.value = "";
	NE_ID.text = "";
	doFoucs("",TASK_TYPE);
    doFoucs("",STATE);
	TASK_INTERVAL.value = "";
	begindate.value="";
	enddate.value="";
	executedate.value="";
	changeTaskType();
  	var table = document.getElementById("tasksTable");
    document.getElementById("taskContent").style.display = "";
  	 var tr = table.children;
 	 if(tr[0].tagName == "TBODY"){
	     tr = tr[0].children;
	 }
 	 for(var i=1;i<tr.length;i++){
  		tr[i].bgColor = "#FFFFFF";
 	 }
}

function deleteTask(){
  var httpUrl = "../../servlet/logicgathertaskservlet?"
    if(selectedRowIndex>0){
        var row = taskRows[selectedRowIndex-1];
  	var taskid = row.TASK_ID;
          if(taskid!=""){
	    if(QMsg("是否删除该信息?")==MSG_YES)
	    {
 	     var params = new Array();
 	     params.push("tag="+5);
 	     params.push("taskid="+taskid);
 	     xmlhttp.open("POST",httpUrl+params.join("&"),false);
 	     xmlhttp.send();
 	     if(isSuccess(xmlhttp))
 	     {
 	      	 MMsg("删除成功!");
                deleteRow();
	      }
	    }
          }else{
            deleteRow();
          }

        selectedRowIndex = -1;
        setValuenNull();
    }else{
      alert("请选择要删除的记录");
    }
}

function iniValue(){
	TASK_TYPE.selectedIndex = 0;
    REGION_ID.selectedIndex = 0;
	NE_ID.value = "";
	NE_ID.text = "";
	doFoucs("",TASK_TYPE);
    doFoucs("",STATE);
	TASK_INTERVAL.value = "";
	begindate.value="";
	enddate.value="";
	executedate.value="";
}

function cancel(){
  setValuenNull();
  document.getElementById("taskContent").style.display="none";
}


function getTriggerType(logicdatagatherid) {
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var submitURL = "/servlet/logicdatagatherservlet?tag=2&logicdatagatherid=" + logicdatagatherid;
	xmlhttp.Open("POST", submitURL, false);
	xmlhttp.send();
	var dXML = new ActiveXObject("Microsoft.XMLDOM");
	dXML.load(xmlhttp.responseXML);
	return dXML.selectSingleNode("/root/Msg/TRIGGER_TYPE").text;
}