var selectedTdColor = "rgb(225,236,255)", mouseoutTdColor = "" ,dayDivColor = "rgb(232,238,247)";
var selectedDivColor = "rgb(51,102,204)", selectedFontColor = "#FFFFFF", mouseoutDivColor = "" ,mouseoverDivColor = "#DDDDDD";
var beClickTdId = "", removeFromArrObj;
var beClickTdArr = new Array();
var beClickDivId = "", removeFormDivArrObj;
var beClickDivArr = new Array();
var dutyId;
var ctrlPageFeatures = 'dialogWidth=430px;dialogHeight=360px;help=0;scroll=0;status=0;';

function initPage() {
	dutyId = $request("dutyId");
	Calendar();
}

var Calendar = function(pYear, pMonth){
	clearData();
	
	var date = new Date();
	
	var year = pYear || date.getFullYear();
	var month = pMonth || date.getMonth() + 1;
	
	var firstDay = getMonthFirstDay(year, month);
	var lastDay = getMonthLastDay(year, month);
	var prevLastDay = getPrevMonthLastDay(year, month);
	
	var fw = firstDay.getDay();
    var ld = prevLastDay.getDate();
    var td = lastDay.getDate();
    var nowDay = date.getDate();
    var nowMonth = date.getMonth() + 1;
    var nowYear = date.getFullYear();
    
    var isNextMonthDay = false;//是否是下个月的日期
    var mDay=1,w=1;
    
    if(fw < 1) {
    	fw = fw + 7;
    }
    
    
    var str = '<table width="95%" height="95%" style="table-layout:fixed;" cellspacing="1" cellpadding="0" align="center" bgcolor="rgb(195,217,255)" id="calTable"><caption style="border:0px solid black"><img src="../../resource/image/ico/prev.gif" alt="上一月" style="cursor:hand" onclick="prevCalendar('+ firstDay.getFullYear() +', '+ firstDay.getMonth() +')" align="absmiddle">\t<span>' + firstDay.getFullYear() + '年' + (firstDay.getMonth()+1) + '月\t</span><img src="../../resource/image/ico/next.gif" style="cursor:hand" onclick="nextCalendar('+ firstDay.getFullYear() +', '+ firstDay.getMonth() +')"  align="absmiddle" alt="下一月"></caption><thead ><tr height="20"><th>星期一</th><th>星期二</th>	<th>星期三</th><th>星期四</th><th>星期五</th>	<th>星期六</th><th>星期日</th></tr></thead><tbody id="calBody"><tr bgcolor="#FFFFFF" valign="top">';
    
    var lDay;
    var privMonthStr = dateToString(prevLastDay),thisMonthStr = dateToString(firstDay),nextMonthStr = dateToString(new Date(year,month,1));
    for(lDay = (ld - fw + 2);lDay <= ld;lDay++) {
    	str += '<td id="day_' + privMonthStr + lDay + '" onclick="clickTd(this)" onmousedown="rightMenuTd(this)"><div class="dayDiv">'+ lDay +'</div></td>';
    }
    var thisMonthStr = dateToString(firstDay);
    for(var i = (fw==0)?7:fw;i<=7;i++) {
   		str += '<td id="day_' + thisMonthStr + dayToString(mDay) + '" onclick="clickTd(this)" onmousedown="rightMenuTd(this)"><div class="dayDiv"><div '+((nowYear==year&&nowMonth==month&&mDay==nowDay)?'style="background-color: red;color:white;"':'')+' >' + ((mDay==1)?((firstDay.getMonth() + 1) + "月1日"):mDay) + '</div></div></td>';
    	mDay++
    }
    
    for(var i=2;i<7;i++) {
		str += '<tr bgcolor="#FFFFFF" valign="top">';
      	for(var j=1;j<8;j++) {
			if(isNextMonthDay) { //下个月的日期
				str += '<td id="day_'+ nextMonthStr + dayToString(mDay) + '" onclick="clickTd(this)" onmousedown="rightMenuTd(this)"><div class="dayDiv">'+((mDay==1)?(((firstDay.getMonth() + 2) == 13?1:firstDay.getMonth() + 2) + "月1日"):mDay)+'</div></td>';
			} else { //本月的日期
		    	str += '<td id="day_'+ thisMonthStr + dayToString(mDay) + '" onclick="clickTd(this)" onmousedown="rightMenuTd(this)"><div class="dayDiv"><div '+((nowYear==year&&nowMonth==month&&mDay==nowDay)?'style="background-color: red;color:white;"':'')+' >'+mDay+'</div></div></td>';
        	}
        	
			//判断是否为本月的日期
			if(mDay==td) {
			  isNextMonthDay=true;
			  mDay=0;
			}
			mDay++;
		}
		str += '</tr>';
		if(isNextMonthDay) {
			break;
		}
	}
    
    str += "</tbody></table>"
    
    calendarDiv.innerHTML = str;
    loadArrangData(calBody.firstChild.firstChild.id, calBody.lastChild.lastChild.id);
    loadDutyManagers(calBody.firstChild.firstChild.id, calBody.lastChild.lastChild.id);
    render();
}

function clearData() {
	beClickTdId = "";
	removeFromArrObj = null;
	beClickTdArr = new Array();
	
	beClickDivId = "";
	removeFormDivArrObj = null;
	beClickDivArr = new Array();
}

function prevCalendar(pYear,pMonth) {
	if(pMonth == 0) {
		Calendar(pYear-1,12);
	} else {
		Calendar(pYear,pMonth);
	}
}

function nextCalendar(pYear,pMonth) {
	if(pMonth == 11) {
		Calendar(pYear+1,1);
	} else {
		Calendar(pYear,pMonth+2);
	}
}

function loadDutyManagers(firstDay, lastDay)
{
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.open("POST","../../servlet/DutyAction?action=45&id="+dutyId + "&firstDay="+firstDay.replace("day_","")+"&lastDay="+lastDay.replace("day_",""),false);
	xmlhttp.send();
	var managerData = new ActiveXObject("Microsoft.XMLDOM");
	if(isSuccess(xmlhttp)) {
		var managerData = xmlhttp.responseXML;
		var managerNodes = managerData.selectNodes("//rowSet");
		for(var i = 0; i < managerNodes.length; i++)
		{
			var dayTd = document.getElementById("day_"+managerNodes[i].selectSingleNode("DUTY_DATE").text);
			var staffName = managerNodes[i].selectSingleNode("STAFFNAME").text;
			
			var managerDiv = document.getElementById('arrang_manager_' + managerNodes[i].selectSingleNode("DUTY_DATE").text);
			if(!managerDiv)
			{
				dayTd.childNodes[0].insertAdjacentHTML("afterEnd",'<div class="arrangManagerDiv" id="arrang_manager_' + managerNodes[i].selectSingleNode("DUTY_DATE").text + '"></div>');
				managerDiv = document.getElementById('arrang_manager_' + managerNodes[i].selectSingleNode("DUTY_DATE").text);
			}
			if(managerDiv.title)
			{
				managerDiv.title += "," + staffName;
			}
			else
			{
				managerDiv.title = "值班长:" + staffName;
			}
			var str = '值班长:'+ staffName;
			managerDiv.innerHTML += str;
		}
	}
}

function loadArrangData(firstDay, lastDay) {
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.open("POST","../../servlet/DutyAction?action=14&id="+dutyId + "&firstDay="+firstDay.replace("day_","")+"&lastDay="+lastDay.replace("day_",""),false);
	xmlhttp.send();
	
	var arrangData = new ActiveXObject("Microsoft.XMLDOM");
	if(isSuccess(xmlhttp)) {
		arrangData = xmlhttp.responseXML;
		var arrangNodes = arrangData.selectNodes("//rowSet");
		for(var i=0;i<arrangNodes.length;i++) {
			var staffName = arrangNodes[i].selectSingleNode("STAFFNAME").text;
			var str = '<div class="arrangDiv" title="'+ staffName + '" onMouseDown="rightMenuArrang(this)" onMouseOver="mouseOver(this)" onMouseOut="mouseOut(this)" id="arrang_'+ arrangNodes[i].selectSingleNode("ARRANGEMENT_ID").text +'" onclick="clickArrang(this)" ondblclick="dbclickArrang(this)" tag="' + arrangNodes[i].selectSingleNode("ORDER_NAME").text + '">'+ arrangNodes[i].selectSingleNode("ORDER_NAME").text + ":" + staffName + '</div>';
			var dayTd = document.getElementById("day_"+arrangNodes[i].selectSingleNode("DUTY_DATE").text);
			dayTd.innerHTML += str;
		}
	}
}

function dayToString(pDay) {
	return (pDay>=10)?""+pDay:"0" + pDay;
}

function dateToString(pDate) {
	return (pDate.getFullYear() + "" + ((pDate.getMonth() + 1 >= 10)?(pDate.getMonth() + 1) : "0" + (pDate.getMonth() + 1)));
}

function getMonthFirstDay(pYear,pMonth)
{
	return new Date(pYear,pMonth-1,1);
}

function getMonthLastDay(pYear,pMonth)
{
	return new Date(pYear,pMonth,0);
}

function getPrevMonthLastDay(pYear,pMonth)
{
	return new Date(pYear,pMonth-1,0);
}

/**
 * 对象是否已选中，已选中返回true，否则返回false
 */
function isObjInArr(sArray, obj){
	var result = false;
	for(var i=0;i<sArray.length;i++){
		if(obj.id==sArray[i].id){
			result = true;
		}
	}
	
	return result;
}

function removeFromArr(sArray, obj) {
	var result = false;
	for(var i=0;i<sArray.length;i++){
		if(obj.id == sArray[i].id){
			result = true;
		}
		if(result){
			sArray[i] = sArray[i+1];
		}
	}
	if(result){
		sArray.length--;
	}
}

function clickTd() {
	var obj = event.srcElement;
	var ctrlb = true;
	var shiftb = true;
	var elseb = true;
	if(event.button==2){  //如果是右键的话，
		if(!isObjInArr(beClickTdArr, obj)){  //点中的TD不是选中，就按照普通的点击事件处理
			ctrlb = false;
		}else{
			elseb = false;
		}
	}
	
	if(event.shiftKey){
		for(var i=1;i<beClickTdArr.length;i++){
			beClickTdArr[i].bgColor = mouseoutTdColor;
			if(beClickTdArr[i].firstChild) {
				beClickTdArr[i].firstChild.runtimeStyle.backgroundColor = dayDivColor;
			}
		}
		beClickTdArr = new Array();
		if(beClickTdId!="") {
			beClickTdArr.push(document.getElementById(beClickTdId));
		}
		
		//beClickTdId = "";
		var b = isObjInArr(beClickTdArr, obj);
		if(!b){//如果不是选中的不是本身，则选中连续的元素
			//选中从第一个选中的元素到当前选中的所有元素
			var sRow = beClickTdArr[0].parentNode.rowIndex;
			var sCell = beClickTdArr[0].cellIndex;
			var dRow = obj.parentNode.rowIndex;
			var dCell = obj.cellIndex;
			
			var cell1 = sCell;
			var cell2 = dCell;
			var start;
			var end;
			
			var first = Math.min(sRow,dRow);
			var last = Math.max(sRow,dRow);
			
			if(sRow!=dRow) {
				for(var i=first;i<=last;i++) {
					if(i==first) {
						start = (first==sRow)?sCell:dCell;
						end = 6;
					} else if(i==last) {
						start = 0;
						end = (first==sRow)?dCell:sCell;
					} else {
						start = 0;
						end = 6;
					}
					
					for(var j=start;j<=end;j++) {
						var myTd = calTable.rows[i].cells[j];
						beClickTdArr.push(myTd);
						myTd.bgColor = selectedTdColor;
						if(myTd.firstChild) {
							myTd.firstChild.runtimeStyle.backgroundColor = selectedTdColor;
						}
					}
				}
			} else if(sRow == dRow) {
				start = Math.min(sCell,dCell);
				end = Math.max(sCell,dCell);
				for(var j=start;j<=end;j++) {
					var myTd = calTable.rows[sRow].cells[j];
					beClickTdArr.push(myTd);
					myTd.bgColor = selectedTdColor;
					if(myTd.firstChild) {
						myTd.firstChild.runtimeStyle.backgroundColor = selectedTdColor;
					}
				}
			}
		}else{
			//什么也不做
		}
	} else if(elseb) {
		if(beClickTdId!=""){
			document.getElementById(beClickTdId).bgColor = mouseoutTdColor;
			if(document.getElementById(beClickTdId).firstChild && document.getElementById(beClickTdId).firstChild.runtimeStyle) {
				document.getElementById(beClickTdId).firstChild.runtimeStyle.backgroundColor = dayDivColor;
			}
		}
		for(var i=0;i<beClickTdArr.length;i++){
			beClickTdArr[i].bgColor = mouseoutTdColor;
			if(beClickTdArr[i].firstChild && beClickTdArr[i].firstChild.runtimeStyle) {
				beClickTdArr[i].firstChild.runtimeStyle.backgroundColor = dayDivColor;
			}
		}
		beClickTdId = obj.id;
		beClickTdArr.length = 0;
		obj.bgColor = selectedTdColor;
		if(obj.firstChild && obj.firstChild.runtimeStyle) {
			obj.firstChild.runtimeStyle.backgroundColor = selectedTdColor;
		}
	}
}

function clickArrang(obj) {
	event.cancelBubble = true;
	var ctrlb = true;
	var elseb = true;
	if(event.button==2){  //如果是右键的话，
		if(!isObjInArr(beClickDivArr, obj)){  //点中的DIV不是选中，就按照普通的点击事件处理
			ctrlb = false;
		}else{
			elseb = false;
		}
	}
	
	if(event.ctrlKey && ctrlb){
		if(beClickDivArr.length==0 && beClickDivId!=""){
			beClickDivArr.push(document.getElementById(beClickDivId));
		}
		beClickDivId = "";
		var b = isObjInArr(beClickDivArr, obj);
		if(!b){
			beClickDivArr.push(obj);
			obj.runtimeStyle.backgroundColor = selectedDivColor;
			obj.runtimeStyle.color = selectedFontColor;
		}else{
			removeFromArr(beClickDivArr,obj);
			removeFromArrObj = obj; //设置为刚从多选数组中移出来.
			obj.runtimeStyle.backgroundColor = mouseoutDivColor;
			obj.runtimeStyle.color = mouseoutDivColor;
		}
	} else if(elseb) {
		if(beClickDivId!=""){
			document.getElementById(beClickDivId).runtimeStyle.backgroundColor = mouseoutDivColor;
			document.getElementById(beClickDivId).runtimeStyle.color = mouseoutDivColor;
		}
		for(var i=0;i<beClickDivArr.length;i++){
			beClickDivArr[i].runtimeStyle.backgroundColor = mouseoutDivColor;
			beClickDivArr[i].runtimeStyle.color = mouseoutDivColor;
		}
		beClickDivId = obj.id;
		beClickDivArr.length = 0;
		obj.runtimeStyle.backgroundColor = selectedDivColor;
		obj.runtimeStyle.color = selectedFontColor;
	}
}

function dbclickArrang(obj) {
	event.cancelBubble = true;
	stafArrangSingle(obj);
}

function editStafArrang() {
	if(beClickDivArr.length>0) {
		stafArrangMulti();
	}else {
		stafArrangSingle();
	}
}



function stafArrangMulti() {
	var arrangementIds = "";
	var date = new Date();
	var today = date.getFullYear() + "" + ((date.getMonth() + 1)>9?(date.getMonth()+1):("0"+ (date.getMonth() + 1))) + "" + ((date.getDate())>9?date.getDate():("0"+date.getDate()));
	
	for(var i=0;i<beClickDivArr.length;i++) {
		arrangementIds += "," + beClickDivArr[i].id.replace("arrang_","")
	}
	arrangementIds = arrangementIds.replace(",","");
	
	
	var params = {
		dutyId:dutyId,
		arrangementId : arrangementIds
	}
	
	var result = checkDutyArrOnLineOrHis(params.arrangementId);

	if(result>0){
		EMsg("不允许修改历史的排班人员信息！");
	}else if(result==0){
		var returnVal = window.showModalDialog("editDutyArrangement.html",params,ctrlPageFeatures);
		if(returnVal != null && returnVal != "null") {
			var returnObj = eval("(" + returnVal + ")");
			for(var i=0;i<beClickDivArr.length;i++) {
				beClickDivArr[i].title = returnObj.staff;
				beClickDivArr[i].innerHTML = beClickDivArr[i].tag + ":" + returnObj.staff;
				
				var parentDay = beClickDivArr[i].parentNode.id.replace("day_","");
				var managerDiv = document.getElementById("arrang_manager_" + parentDay);
				if(!managerDiv)
				{
					beClickDivArr[i].parentNode.childNodes[0].insertAdjacentHTML("afterEnd",'<div class="arrangManagerDiv" id="arrang_manager_' + parentDay + '"></div>');
					managerDiv = document.getElementById('arrang_manager_' + parentDay);
				}
				managerDiv.title = "值班长:" + returnObj.manager_staff;
				managerDiv.innerHTML = '值班长:'+ returnObj.manager_staff;
			}
			render();
		}
	}
	
	
}

//检查被修改的值班线是否处于执行状态中
function checkDutyArrOnLineOrHis(arrangementId){
	var result;
	var beginTime;
	var endTime;
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var sendURL = "../../servlet/DutyAction?";
	var params = new Array();
	params.push("action=42");
	params.push("arrangmentId="+arrangementId);
	xmlhttp.Open("POST",sendURL+params.join("&"),false);
	xmlhttp.send();
	
	if(isSuccess(xmlhttp))
	{
		var xmlDoc = xmlhttp.responseXML;
		var countRs = xmlDoc.getElementsByTagName('RS_COUNT')[0].childNodes[0].nodeValue;
		result=parseInt(countRs);
		
	}
	
	return result;
}

function checkPrivilege(dutyId,action){	
	return hasPrivilege('DUTY',dutyId,action);	
}

function stafArrangSingle(obj) {
	if(checkPrivilege(dutyId,'ARRANG') == false && getCurrentUserInfo("staff_id")!=1){
		EMsg("您没有该值班线的排班权限！");
		return;
	}
	var arrangmentId = (obj)?obj.id.replace("arrang_",""):beClickDivId.replace("arrang_","");
	var parentDay = document.getElementById("arrang_" + arrangmentId).parentNode.id.replace("day_","");
	var date = new Date();
	
	var params = {
		dutyId:dutyId,
		arrangementId : arrangmentId
	}
	var result = checkDutyArrOnLineOrHis(arrangmentId);
	
	//if(!result)return;
	if(result>0){
		EMsg("不允许修改历史的排班人员信息！");
	}else if(result==0){
		var returnVal = window.showModalDialog("editDutyArrangement.html",params,ctrlPageFeatures); //返回值格式: {staff:'...',manager_staff:'...'}  staff:值班人员   manager_staff:值班长
		if(returnVal != null && returnVal != "null") {
			var returnObj = eval("(" + returnVal + ")");
			if(obj) {
				obj.title = returnObj.staff;
				obj.innerHTML = obj.tag + ":" + returnObj.staff;
			} else {
				document.getElementById(beClickDivId).title = returnObj.staff;
				document.getElementById(beClickDivId).innerHTML = document.getElementById(beClickDivId).tag + ":" + returnObj.staff;
			}
			var managerDiv = document.getElementById("arrang_manager_" + parentDay);
			if(!managerDiv)
			{
				document.getElementById(beClickDivId).parentNode.childNodes[0].insertAdjacentHTML("afterEnd",'<div class="arrangManagerDiv" id="arrang_manager_' + parentDay + '"></div>');
				managerDiv = document.getElementById('arrang_manager_' + parentDay);
			}
			managerDiv.title = "值班长:" + returnObj.manager_staff;
			managerDiv.innerHTML = '值班长:'+ returnObj.manager_staff;
			render();
		}
	}
	
	
}
function rightMenuTd(obj) {
	if(event.button == 2){
		clickTd(obj);
		oMenu.show();
	}
}

function rightMenuArrang(obj) {
	event.cancelBubble = true;
	if(event.button == 2) {
		clickArrang(obj);
		oMenu1.show();
	}
}

function mouseOver(obj) {
	obj.style.backgroundColor = mouseoverDivColor;
}

function mouseOut(obj) {
	obj.style.backgroundColor = mouseoutDivColor;
}

function saveModel() {
	if(beClickTdArr.length<=1) {
		EMsg("请挑选时段");
		return;
	}
	
	var sTime = getTime(beClickTdArr);
	
	var params = {
		action:0,
		dutyId:dutyId,
		modelId:null,
		startTime:sTime[0],
		endTime:sTime[1]
	}
	
	window.showModalDialog("dutyModelInfo.html",params,"dialogWidth=630px;dialogHeight=360px;help=0;scroll=0;status=0;");
}

function searchRecord() {
	if(beClickDivArr.length!=0) {
		EMsg("请挑选一个班次");
		return;
	}
	
	if(beClickDivId) {
		var parentDay = document.getElementById(beClickDivId).parentNode.id.replace("day_","");
		var date = new Date();
		var today = date.getFullYear() + "" + ((date.getMonth() + 1)>9?(date.getMonth()+1):("0"+ (date.getMonth() + 1))) + "" + ((date.getDate())>9?date.getDate():("0"+date.getDate()));

		if(parentDay > today) {
			EMsg("该班次还没有值班记录！");
			return;
		}
		
		window.showModalDialog("dutyRecordCust_up.html?arrangementId=" +beClickDivId.replace("arrang_",""),window,"resizable=yes;dialogWidth=730px;dialogHeight=695px;help=0;scroll=1;status=0;");
	}
}

function getTime(sArr) {
	var min = sArr[1].id.replace("day_","");
	var max = sArr[sArr.length-1].id.replace("day_","");
	
	return [min,max];
}

function render() {
	var firstDay = calBody.firstChild.firstChild.id, lastDay = calBody.lastChild.lastChild.id;
	
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.open("POST","../../servlet/DutyAction?action=37&id="+dutyId + "&firstDay="+firstDay.replace("day_","")+"&lastDay="+lastDay.replace("day_",""),false);
	xmlhttp.send();
	
	if(isSuccess(xmlhttp)) {
		var dayNodes = xmlhttp.responseXML.selectNodes("//rowSet");
		for(var i=0;i<dayNodes.length;i++) {
			document.getElementById("day_" + dayNodes[i].selectSingleNode("DUTY_DATE").text).style.border = (dayNodes[i].selectSingleNode("NUM").text>0)?"":"1px solid rgb(102,140,217)";
		}
	}
}