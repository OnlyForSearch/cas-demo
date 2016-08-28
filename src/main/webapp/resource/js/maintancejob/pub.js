var isEveryDay = false;
function doBeforeRightClick(obj,MenuName)
{
    obj.rightMenu=MenuName;
}

//画表格
function  search()
{
	beClickTdId = "";
    var jobid = "";
	//if(MAINTANCE_JOB_ID.value=="" && AUDIT_MAINTANCE_JOB.value=="")
	//{
	//	 MMsg("请选择作业!");
	//	 return;
	//}
	//else if(MAINTANCE_JOB_ID.value!="")
		jobid=MAINTANCE_JOB_ID.value;
	//else
	//	jobid=AUDIT_MAINTANCE_JOB.value;
		
    if(jobid=="")
    {
      MMsg("请选择作业!");
      MAINTANCE_JOB_ID.focus();
      return;
    }
    
	var startdate = PLAN_EXEC_DATE_FROM.value;
	if(startdate == null) startdate = "";
	var enddate = PLAN_EXEC_DATE_TO.value;
	if(enddate == null) enddate = "";
	if(jobid=="" || jobid==null) return;

    if((startdate!="" && enddate==""))
    {
      var date = AddDays(0,startdate);
      var datestr = formatDate(date);
      var oldmonth=datestr.substring(0,datestr.lastIndexOf("-"));
      var newmonth = oldmonth;
      var i=1;
      var olddatestr = "";

      while(oldmonth==newmonth && i<32)
      {
	 		date = AddDays(i,startdate);
            olddatestr = datestr;
            datestr = formatDate(date);
            newmonth=datestr.substring(0,datestr.lastIndexOf("-"));
            i++;
      }
      enddate = olddatestr;
    }
    else if(startdate=="" && enddate!="")
    {
      startdate = enddate.substring(0,enddate.lastIndexOf("-"))+"-01";
    } 
    else if(startdate=="" && enddate=="") {
    	MMsg("请挑选作业执行时间！");
    	return;
    } 
    
    if(startdate>enddate)
    {
      MMsg("开始时间不能大于结束时间!"); return;
    }
    
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	var dXML = new ActiveXObject("Microsoft.XMLDOM");
	var xmldoc =      '<?xml version="1.0" encoding="gb2312"?><xml>';
	xmldoc = xmldoc +   '<MAINTANCE_JOB_ID>'+jobid+'</MAINTANCE_JOB_ID>';
	xmldoc = xmldoc +   '<PLAN_EXEC_DATE_FROM>'+startdate+'</PLAN_EXEC_DATE_FROM>';
	xmldoc = xmldoc +   '<PLAN_EXEC_DATE_TO>'+enddate+'</PLAN_EXEC_DATE_TO>';
	xmldoc = xmldoc +   '<IS_FROM_EVENT_Q>'+isFromEvent_Q+'</IS_FROM_EVENT_Q>';
	xmldoc = xmldoc + '</xml>';
	dXML.loadXML(xmldoc);
	
	var paramArray = new Array();
	paramArray.push("tag="+9);
	
	var oWait = document.getElementById("owait")
	oWait.style.pixelLeft=(window.document.body.clientWidth-oWait.style.pixelWidth)/2;
	oWait.style.pixelTop=(window.document.body.clientHeight-oWait.style.pixelHeight)/2;
	oWait.style.display="block";
	
	xmlhttp.onreadystatechange= function(){handleStateChange(xmlhttp);}
	xmlhttp.Open("POST","../../servlet/jobiteminstanceservlet?"+paramArray.join("&"),true);
	xmlhttp.send(dXML);
}

function handleStateChange(xmlhttp)
{
  var state = xmlhttp.readyState;
  if(state==4)
  {
        tempShowcontent(xmlhttp.responseXML.xml);
		var dXML = new ActiveXObject("Microsoft.XMLDOM");
		dXML.load(xmlhttp.responseXML);
		parseXML(dXML);
		document.getElementById("owait").style.display="none";
  }
}

function isPlanDate(dXML, day_node,tempValue) {
	var isValid = false;
	var publicDay = dXML.selectSingleNode("/job/public_day_work/public_day").text;
	var restDay = dXML.selectSingleNode("/job/public_day_work/rest_day").text;
	var weekendOpr = dXML.selectSingleNode("/job/exclude/weekend_opr").text;
	var holidayOpr = dXML.selectSingleNode("/job/exclude/holiday_opr").text;
	var holiday = dXML.selectSingleNode("/job/exclude/holiday").text;
	
	var sDay = "";
	var strLen = (day_node.split("\n"))[0].indexOf(" ");
	if(strLen != -1) {
		sDay = (day_node.split("\n"))[0].substring(1, strLen);
	} else {
		sDay = (day_node.split("\n"))[0];
	}
	var sWeek = (day_node.split("\n"))[1];
	
	var v_if_weekend = '0BF',v_if_holiday='0BF';
	if(weekendOpr == 'NO_EXEC'){
       v_if_weekend = '0BF';
	}  
    else{
       v_if_weekend = '0BT';
	}  
     
    if(holidayOpr == 'NO_EXEC'){
       v_if_holiday = '0BF';
	}  
    else {
       v_if_holiday = '0BT';
	}  
	
	if(("0BT" == v_if_weekend && "0BT" == v_if_holiday )) {//1、公休日、节假日计划属于计划中；
		isValid = true;
	} else if("0BT" == v_if_weekend && "0BT" != v_if_holiday && holiday.indexOf(sDay) == -1) {//2、节假日不执行且当天不是节假日；
		isValid = true;
	} else if("0BT" != v_if_weekend && "0BT" == v_if_holiday && "六" != sWeek && "日" != sWeek) {//3、公休日不执行且当天不是公休日
		isValid = true;
	} else if("0BT" != v_if_holiday && "0BT" != v_if_weekend && holiday.indexOf(sDay) == -1 && "六" != sWeek && "日" != sWeek){//4、公休、节假日都不计划且当天即不是公休也不是节假日
		isValid = true;
	}else if("0BT" !=v_if_holiday && "0BT" != v_if_weekend && holiday.indexOf(sDay)==-1  && publicDay.indexOf(sDay)!=-1 ){ //5公休、节假日都不计划 且单天不是节假日 (显示公休上班日）
		isValid = true;
	}
	//周期为每天
	if(isEveryDay&&publicDay.indexOf(sDay)!=-1){
		
		isValid =true;
	}
	/*var reg = "2008-11-24,2008-11-26";
	if(reg.indexOf(sDay) == -1) {
		isValid = true;
	} else {
		isValid = false;
	}
	*/
		
	return isValid;
}

function parseXML(dXML)
{
	var action = ' onMouseOver="mouseover(this)" onMouseOut="mouseout(this)" onclick="clickTd(this)" onmousedown="RightMenu(this)" onDblClick="resultResult(this.getAttribute(\'tag\'))"';
	var element_plans = dXML.selectSingleNode("/job/plans");  //返回有计划的在第二行的下标，从０开始．
	var element_day = dXML.selectSingleNode("/job/day");
	
	var arr_day_nodetext = element_day.text.split(",");
	var innerHTML = '';
	var titleHTML = '';
	var title_day_HTML = '';
	var planHTML='',rowHTML='';
    var cycle = '';
    var titleColspan = 0;
    var tempDate="";
    var tempValue ;
    //拼凑计划
	var element_plan = dXML.selectNodes("/job/plans/plan");
	if(element_plan== null)
	{
		MMsg("ＳＱＬ脚本出错!"); return;
	}
	
	cycle = element_plans.getAttribute("cycle");

	//构建日期行和计划行
	title_day_HTML = '<tr>';
	if(element_plan.length>0 || cycle>"1")
	{
		for(var i=0;i<arr_day_nodetext.length;i++)
		{
			tempValue = element_plans.selectSingleNode('plan[@type=1]');
			if(element_plans.selectSingleNode('plan[@index=' + i + ']') && isPlanDate(dXML, arr_day_nodetext[i],tempValue)) {
				var daytext = arr_day_nodetext[i];
				var date = daytext.split("\n")[0];
				var arr = daytext.split("-");
				var text = arr[2].replace("\n","<br>");
				
				title_day_HTML = title_day_HTML + '<td align="center" style="cursor:default;" onMouseDown="putinJob()" onMouseOver="mouseover(this)" onMouseOut="mouseout(this)" onclick="clickTitle(this)" onDblClick="resultJobResult()" id="'+date+'" title="'+date+'" class="td1">'+text+'</td>';
				planHTML = planHTML + '<td align="center" bgcolor="'+planTdColor+'" class="td1">√</td>';
				titleColspan++;
			}
		}
	}else{
		isEveryDay = true;
		for(var i=0;i<arr_day_nodetext.length;i++)
		{
			if(isPlanDate(dXML, arr_day_nodetext[i])) {
				var daytext = arr_day_nodetext[i];
				var date = daytext.split("\n")[0];
				var arr = daytext.split("-");
				var text = arr[2].replace("\n","<br>");
				
				title_day_HTML = title_day_HTML + '<td align="center" style="cursor:default;" onMouseDown="putinJob()" onMouseOver="mouseover(this)" onMouseOut="mouseout(this)" onclick="clickTitle(this)" onDblClick="resultJobResult()" id="'+date+'" title="'+date+'" class="td1">'+text+'</td>';
				planHTML = planHTML + '<td align="center" bgcolor="'+planTdColor+'" class="td1">√</td>';
				titleColspan++;
			}
		}
	}
	title_day_HTML = title_day_HTML + '</tr>';

	// 作业内容查询列名自定义
	var jobContentQueryColName = $getSysVar("JOB_CONTENT_QUERY_COL_NAME").replace(/(^\s*)|(\s*$)/g, "");
	if (jobContentQueryColName == "null" || jobContentQueryColName == "")
		jobContentQueryColName = "作业内容查询";

	if(isShowJobContentQueryBack())
		titleHTML = '<tr><td class="td1" align="center" width="30" nowrap rowspan="2">序号 </td>'+ ((typeof isJtitsmJob !="undefined" && isJtitsmJob)?'<td class="td1" align="center" nowrap rowspan="2">安排时间</td>':'') +'<td class="td1" align="center" rowspan="2"><span style="width:100px;">作业项目及内容</span></td><td class="td1" align="center" nowrap width="30" rowspan="2">进度</td><td class="td1" align="center" colspan="'+ titleColspan +'">月 内 日 期 </td><td class="td2" align="center"  rowspan="2"><span style="width:100px;">'+jobContentQueryColName+'</span></td></tr>';
	else
		titleHTML = '<tr><td class="td1" align="center" width="30" nowrap rowspan="2">序号 </td>'+((typeof isJtitsmJob !="undefined" && isJtitsmJob)?'<td class="td1" align="center" nowrap rowspan="2">安排时间</td>':'')+'<td class="td1" align="center" rowspan="2"><span style="width:100px;">作业项目及内容</span></td><td class="td1" align="center"  rowspan="2"><span style="width:100px;">' + jobContentQueryColName + '</span></td><td class="td1" align="center" nowrap width="30" rowspan="2">进度</td><td class="td1" align="center" colspan="'+ titleColspan +'">月 内 日 期 </td></tr>';
		
	var element_row = dXML.selectNodes("/job/rowSet");
	tdCount=0;
	var map = new Map();
	for(var i=0;i<element_row.length;i++)
	{
		var tempHTML = '<tr>';
		var seq = element_row[i].selectSingleNode("SEQ").text;
		var completeTimeLimit = element_row[i].selectSingleNode("COMPLETE_TIME_LIMIT").text;
		var itemid = element_row[i].selectSingleNode("MAINT_JOB_ITEM_ID").text;
		var itemname = element_row[i].selectSingleNode("ITEM_NAME").text;
		var jobEnabledDate = element_row[i].selectSingleNode("JOB_ENABLED_DATE").text;
		var itemEnabledDate = element_row[i].selectSingleNode("ITEM_ENABLED_DATE").text;		
		var itemCancelDate = element_row[i].selectSingleNode("ITEM_CANCEL_DATE").text;
		var jobCancelDate = element_row[i].selectSingleNode("JOB_CANCEL_DATE").text;
		
		var a_node = element_row[i].selectSingleNode("LINK_ADDR/a");
		var a_text = "";
		while(a_node!=null)
		{
			if(a_text=="")
			{
				a_text = a_node.xml;
			}else{
				a_text = a_text + "<br/>"+a_node.xml;
			}
			a_node = a_node.nextSibling;
		}
		
		a_text = a_text || "&nbsp;";

		tempHTML = tempHTML + '<td align="center" class="td1"  rowspan="2">' + seq +'</td>';
		tempHTML = tempHTML + ((typeof isJtitsmJob !="undefined" && isJtitsmJob)?('<td align="center" class="td1"  rowspan="2">' + completeTimeLimit +'</td>'):'');
		tempHTML = tempHTML + '<td align="center" width="150" nowrap class="td1" rowspan="2">' + itemname +'</td>';
		if(!isShowJobContentQueryBack()) 
			tempHTML = tempHTML + '<td align="center" class="td1" rowspan="2">' + a_text+'</td>'; // itnm00050457 作业内容查询列调整进度之前
		tempHTML = tempHTML + '<td align="center" class="td1" >计划</td>';
		tempHTML = tempHTML + planHTML;
		if(isShowJobContentQueryBack())
			tempHTML = tempHTML + '<td align="center" class="td2" rowspan="2">' + a_text+'</td>';
		tempHTML = tempHTML + '</tr>';
		tempHTML = tempHTML + '<tr>';
		tempHTML = tempHTML + '<td align="center" class="td1" >执行</td>';
		var element_executes = element_row[i].selectSingleNode("EXECUTEXML/executes");
		for(var j=0;j<arr_day_nodetext.length;j++)
		{
		    if((element_plans.selectSingleNode('plan[@index='+(j)+']') 
		       || (element_plan.length==0 && cycle=="1")) && isPlanDate(dXML, arr_day_nodetext[j]))
		    {
				// (1). 判断：是否有效
				var date = arr_day_nodetext[j].split("\n")[0];
				var ifenable = '0BT';
				var enabledDate = "";
				
				if(date.indexOf(" ")<0)            date += " 00:00:00";
				if(jobEnabledDate.indexOf(" ")<0)  jobEnabledDate += " 00:00:00";
				if(itemEnabledDate.indexOf(" ")<0) itemEnabledDate += " 00:00:00";
				if(jobEnabledDate<itemEnabledDate) enabledDate = jobEnabledDate;
				else                               enabledDate = itemEnabledDate;
				
				if(   date < jobEnabledDate 
				   || date < jobEnabledDate 
				   || date >= itemCancelDate 
				   || date >= jobCancelDate) ifenable = '0BF';
				if(ifenable==null) ifenable = "";
				
				var tag = '　';
				if(ifenable=='0BF')//无效的话
				{
                	tag = "<div style='background-color:#ECE9D8;color:#999999'>　</div>"
                }
                
                // (2). 执行情况
                var element_exec = element_executes.selectSingleNode('execute[@index='+j+']');
				if(element_exec)//如果有的话
				{
					var tagcode 			= 	element_exec.getAttribute("state");
					var iteminstanceid 		= 	element_exec.getAttribute("iteminstanceid");
					var jobinstanceid       =   element_exec.getAttribute("jobinstanceid");
					var jobitemsts 			= 	element_exec.getAttribute("jobitemsts");
					var ifover              =   element_exec.getAttribute("ifover");
					var putinchange 		= 	element_exec.getAttribute("putinChange");
					
					iteminstanceid= (iteminstanceid+"").replace("null","-2");
					map.put(arr_day_nodetext[j].split("\n")[0],jobinstanceid);
					if(ifenable=='0BT')
					{
						//1正常、2异常、3未判断
						if(tagcode=="1")
						{
							tag = '√';
						}
						else if(tagcode=="2")
						{
							tag = '×';
						}
						else if(tagcode=="3")
						{
							tag = "　";
						}else{
							tag = "　";
						}
					}
					
					//0初始状态、3执行中、4待自动判断、1待人工处理、2已人工确认
					var style = "putined_rig";
					if(jobitemsts=="3")
					{
					    //style = "befor_putin";
					    tag = "<img src='../../resource/image/ico/spinner.gif'>";//tag = "...";
					}
					else if(jobitemsts=="1")
					{
					    //style = "befor_putin";
					    if(iteminstanceid!=-2 && tagcode=="3")
					    {
					        tag = "<img src='../../resource/image/judge_waiting.gif'>";
					    }
					    
					    if(tagcode=="2")
					    {
					        tag = "<img src='../../resource/image/judge_wrong.gif' class='imageborder'>";
					    }
					    else if(tagcode=="1")
					    {
					        tag = "<img src='../../resource/image/judge_right.gif'>";
					    }
					}else
					{
                        if(tagcode=="2")
                        {
                            //style = "putined_err";
					        tag = "<img src='../../resource/image/putin_wrong.gif' class='imageborder'>";
                        }else{
                            //style = "putined_rig";
					        tag = "<img src='../../resource/image/putin_right.gif'>";
                        }
					}
					
					if(jobitemsts=="2" && ifover=="0BT")
					{
					    //style = "putinoverdue";
                        if(tagcode=="2")
                        {
					        tag = "<img src='../../resource/image/overdue_wrong.gif' class='imageborder'>";
                        }else{
					        tag = "<img src='../../resource/image/overdue_right.gif'>";
                        }
					}
					
					if(putinchange=="1")
					{
						//style = "putinchange";
                        if(tagcode=="2")
                        {
					        tag = "<img src='../../resource/image/result_wrong.gif' class='imageborder'>";
                        }else{
					        tag = "<img src='../../resource/image/result_right.gif'>";
                        }
					}
					
					var tmpaction = "";
					if(ifenable=='0BT')
					{
						tmpaction = action;
					}
					
					tempHTML = tempHTML + '<td enabled_date="'+enabledDate+'" onselectstart="return false" align="center" id="td_'+tdCount+'" ifenable="'+ifenable+'" iteminstanceid="'+iteminstanceid+'" tagcode="'+tagcode+'" jobinstanceid="'+jobinstanceid+'" tag="'+tagcode+'" jobitemsts="'+jobitemsts+'"  itemid="'+itemid+'" date="'+date+'" '+tmpaction+' class="'+style+'">'+tag+'</td>';
				}else{  //iteminstanceid==-2表示未执行过，未生成项目实例
					tempHTML = tempHTML + '<td enabled_date="'+enabledDate+'" onselectstart="return false" align="center" id="td_'+tdCount+'" ifenable="'+ifenable+'" iteminstanceid="-2" itemid="'+itemid+'" tagcode="'+tagcode+'" date="'+date+'" '+action+' class="befor_putin">'+tag+'</td>';
				}
				tdCount ++;
			}else{  //iteminstanceid==-1表示没计划
					//tempHTML = tempHTML + '<td onselectstart="return false" align="center" id="td_'+tdCount+'" ifenable="0BF" iteminstanceid="-1" itemid="'+itemid+'" date="" '+action+' class="befor_putin">　</td>';
			}
		}
		tempHTML = tempHTML + '</tr>';

		if(rowHTML=='') rowHTML = tempHTML;
		else rowHTML = rowHTML + tempHTML;
	}
	//是否添加审核行
	var auditHTML=auditRow(dXML,arr_day_nodetext,map);
	inHTML = '<div style="padding:20px 0px 20px 0px;"><table  class="tableT" width="100%" border="0" cellpadding="0" cellspacing="0">'+titleHTML + title_day_HTML + rowHTML+auditHTML+'</table></div>';

//	document.getElementById("maint").value = inHTML;
//  tempShowcontent(inHTML);
	document.getElementById("reportDIV").innerHTML = inHTML;

}
//审核行
function auditRow(dXML,arr_day_nodetext,map){
	var auditAction = ' onMouseOver="audit_mouseover(this)" onMouseOut="audit_mouseout(this)" onclick="audit_clickTd(this)" onmousedown="audit_RightMenu(this)" onDblClick="auditResult(this.getAttribute(\'tag\'))"';
	var audits = dXML.selectNodes("/job/audit/rowSet");
	var rowHTML2='';
	for(var i=0;i<audits.length;i++)
	{
		rowHTML2='<tr>';
		rowHTML2 = rowHTML2 + '<td align="center" class="td1">&nbsp;</td>';
		rowHTML2 = rowHTML2 + ((typeof isJtitsmJob !="undefined" && isJtitsmJob)?'<td align="center" width="150" nowrap class="td1">&nbsp;</td>':'');
		rowHTML2 = rowHTML2 + '<td align="center" width="150" nowrap class="td1">审核人：' + audits[i].selectSingleNode("AUDIT_STAFF_NAME").text +'</td>';
		if(!isShowJobContentQueryBack())
			rowHTML2 = rowHTML2 + '<td align="center" nowrap class="td1">&nbsp;</td>';
		rowHTML2 = rowHTML2 + '<td align="center" nowrap class="td1">审核</td>';
		var auditStaffId = audits[i].selectSingleNode("AUDIT_STAFF_ID").text;
		
		var tag,date;
		for(var j=0;j<arr_day_nodetext.length;j++)
		{
			if(isPlanDate(dXML, arr_day_nodetext[j])) {
				//var element_exec = audits[i].selectSingleNode('execute[@PLAN_EXEC_DATE="'+arr_day_nodetext[j].split("\n")[0]+'"]');
				var instanceId = map.getByKey(arr_day_nodetext[j].split("\n")[0]);
				var element_exec = audits[i].selectSingleNode('execute[@MAINT_JOB_INSTANCE_ID="'+instanceId+'"]');
				if(element_exec)
				{
					var jobinstanceid = element_exec.getAttribute("MAINT_JOB_INSTANCE_ID");
					var auditinstanceid =element_exec.getAttribute("MAINT_JOB_AUDIT_ID");
					var auditResult = element_exec.getAttribute("AUDIT_RESULT");
					var IF_OVER_TIME = element_exec.getAttribute("IF_OVER_TIME");
					//1正常、2异常
					if(auditResult==null || auditResult=="")
						tag = '&nbsp;';
					else if(auditResult=="1")
						//tag = '√';
						tag = IF_OVER_TIME=='0BT'?"<img src='../../resource/image/audit_orverdue_pass.gif'>":"<img src='../../resource/image/ico/audit_pass.gif'>";
					else if(auditResult=="2")
						//tag = '×';
						tag = IF_OVER_TIME=='0BT'?"<img src='../../resource/image/audit_orverdue_wrong.gif' class='imageborder'>":"<img src='../../resource/image/ico/audit_error.gif' class='imageborder'>";
					else
						tag = '&nbsp;';
					date = arr_day_nodetext[j].split("\n")[0];
					if(date.indexOf(" ")<0) {
						date += " 00:00:00";
					}
					rowHTML2 = rowHTML2 + '<td onselectstart="return false" align="center" ifenable="0BT" id="td_audit_'+i+'_'+j+'" auditStaffId="'+auditStaffId+'" auditinstanceid="'+auditinstanceid+'" jobinstanceid="'+jobinstanceid+'" tag="'+auditResult+'" date="'+date+'" '+auditAction+' class="putined_rig">'+tag+'</td>';
				}
				else if(dXML.selectSingleNode('/job/plans/plan[@index='+j+']')||(dXML.selectNodes("/job/plans/plan").length==0 && dXML.selectSingleNode("/job/plans").getAttribute("cycle")=="1"))
				{
					rowHTML2 = rowHTML2 + '<td onselectstart="return false" align="center" ifenable="0BF" class="befor_putin">&nbsp;</td>';
				}
			}
		}
	}
	return rowHTML2;
}

//========================================维护作业计划和业务系统派单的公共JS================================
//创建下拉框
function rebuildSelect(url,obj,blank,ifReturnArr){
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST",url,false);
	xmlhttp.send();

	var dXML = new ActiveXObject("Microsoft.XMLDOM");
	dXML.load(xmlhttp.responseXML);
	var temparr = new Array();
	obj.length = 0;
	var element = dXML.selectSingleNode("/root/rowSet");
        if(blank==null || blank==""){
          obj.add(new Option("",""));
          if(ifReturnArr=="true") temparr.push("");
        }
	while(element!=null){
		var text = element.selectSingleNode("TEXT").text;
		var val = element.selectSingleNode("VALUE").text;
                var key = "";
                if(ifReturnArr=="true"){
                    key = element.selectSingleNode("KEY").text;
                    temparr.push(key);
                }
		var objOption = new Option(text,val);
		obj.add(objOption);
		element = element.nextSibling;
	}
	if(ifReturnArr=="true")  return temparr;
}


//人员选择框
function choosePerson(obj_man_id,obj_man_name,isMult,isList,filter)
{
	var obj = null;
	if(isMult=="" || isMult==null || isMult=="false")
	{
		obj = choiceStaff(null,null,null,null,filter,obj_man_name.value, obj_man_id.value);
		if(obj!=null)
		{
			obj_man_id.value = obj.id;
			obj_man_name.value = obj.name
		}
	}else{
		obj = choiceStaff(true, null, null, null, filter, obj_man_name.value, obj_man_id.value);
		if(obj!=null && (isList==null || isList=="")){
			var arrid = obj.id.split(",");
			var arrname = obj.name.split(",");
			for(var i=0;i<arrid.length;i++)
			{
				obj_man_id.add(new Option(arrname[i],arrid[i]));
			}
		}else if(obj!=null){
			obj_man_id.value = obj.id;
			obj_man_name.value = obj.name
		}
	}
}

//条件的选择,包括模块/业务大类/数据来源
function selectSubmit(type)
{
    var params = new Array();
    var resultArr;
    var checkValueArray = new Array();
    var checkTextArray = new Array();
    var neTypeId=NE_ID.getAttribute("neTypeId");
    var temString="";

    params.push(neTypeId);
    params.push(type);
	//传递已选中值给弹出界面
    var modulCodeArray=new Array();
    var busiClassArray=new Array();
    var regionIdArray=new Array();
    var dataTypeArray=new Array();

    for(var p=0;p<window.MODULE_CODE.options.length;p++){
      modulCodeArray[p]=window.MODULE_CODE.options[p].value;
    }

    for(var p=0;p<window.BUSI_CLASS.options.length;p++){
      busiClassArray[p]=window.BUSI_CLASS.options[p].value;
    }

    for(var p=0;p<window.REGION_ID.options.length;p++){
      regionIdArray[p]=window.REGION_ID.options[p].value;
    }

    for(var p=0;p<window.DATA_TYPE.options.length;p++){
      dataTypeArray[p]=window.DATA_TYPE.options[p].value;
    }

    params.push(modulCodeArray);
    params.push(busiClassArray);
    params.push(regionIdArray);
    params.push(dataTypeArray);
    params.push(dataTypeArray);//addSelectCheck.jsp参数顺序被修改

    if(type=="MODULE_CODE"){
        if(MODULE_CODE_FLAG.value=="1" || MODULE_CODE_FLAG.value==""){
           MMsg("请选择模块标志");
           MODULE_CODE_FLAG.focus();
           return false;
        }
    }else if(type=="BUSI_CLASS"){
        if(BUSI_CLASS_FLAG.value=="1" || BUSI_CLASS_FLAG.value==""){
           MMsg("请选择业务大类标志");
           BUSI_CLASS_FLAG.focus();
           return false;
        }
    }else if(type=="REGION_ID"){
        if(REGION_ID_FLAG.value=="1" || REGION_ID_FLAG.value==""){
           MMsg("请选择数据源标志");
           REGION_ID_FLAG.focus();
           return false;
        }
    }else if(type=="DATA_TYPE"){
        if(DATA_TYPE_FLAG.value=="1" || DATA_TYPE_FLAG.value==""){
           MMsg("请选择数据类型标志");
           DATA_TYPE_FLAG.focus();
           return false;
        }
    }

    var resultArr = window.showModalDialog("../alarm/addSelectCheck.jsp?ciId="+NE_ID.getAttribute("CI_ID"),params,"resizable=yes;dialogWidth=350px;dialogHeight=400px;help=0;scroll=1;status=0;");
	if(resultArr!=null){
		if(type=="MODULE_CODE"){
			 //删除原有的下拉框选项
			MODULE_CODE.length=0;
			for(var h=0;h<resultArr[1].length;h++){
				 var objOption = new Option(resultArr[1][h],resultArr[0][h]);
				 //alert(resultArr[0][h]);
				 window.MODULE_CODE.add(objOption);
				 if(h==resultArr[1].length-1){
				   temString+=(resultArr[1][h]);
				 }else{
				   temString+=(resultArr[1][h]+",");
				 }
			}
			MODULE_CODE_TEXT.value=temString;
			window.MODULE_CODE_TEXT.title=window.MODULE_CODE_TEXT.value;
		}else if(type=="BUSI_CLASS"){
			 //删除原有的下拉框选项
			BUSI_CLASS.length = 0;
			for(var n=0;n<resultArr[1].length;n++){
			 var objOption = new Option(resultArr[1][n],resultArr[0][n]);
			 window.BUSI_CLASS.add(objOption);
				 if(n==resultArr[1].length-1){
				   temString+=(resultArr[1][n]);
				 }else{
				   temString+=(resultArr[1][n]+",");
				 }
			}
			BUSI_CLASS_TEXT.value=temString;
			window.BUSI_CLASS_TEXT.title=window.BUSI_CLASS_TEXT.value;
		}else if(type=="REGION_ID"){
				 //删除原有的下拉框选项
				 REGION_ID.length=0;
				for(var t=0;t<resultArr[1].length;t++){
				 var objOption = new Option(resultArr[1][t],resultArr[0][t]);
				 window.REGION_ID.add(objOption);
					if(t==resultArr[1].length-1){
						temString+=(resultArr[1][t]);
					}else{
						temString+=(resultArr[1][t]+",");
					}
				}
				REGION_ID_TEXT.value=temString;
				window.REGION_ID_TEXT.title=window.REGION_ID_TEXT.value;
		}else if(type=="DATA_TYPE"){
				 //删除原有的下拉框选项
				DATA_TYPE.length=0;
				for(var t=0;t<resultArr[1].length;t++){
				 var objOption = new Option(resultArr[1][t],resultArr[0][t]);
				 window.DATA_TYPE.add(objOption);
					if(t==resultArr[1].length-1){
						temString+=(resultArr[1][t]);
					}else{
						temString+=(resultArr[1][t]+",");
					}
				}
				DATA_TYPE_TEXT.value=temString;
				DATA_TYPE_TEXT.title=window.DATA_TYPE_TEXT.value;
		}
	}
}

//isCheck，是否要验证
function checkFlowDomain(dXML,isNotCheck){
        if(MODULE_CODE_FLAG.value==""){
          MMsg("模块标志不能为空!");
          oMPC.selectedIndex = 1;
          MODULE_CODE_FLAG.focus();
          return false;
        }else{
          if(MODULE_CODE_FLAG.value>"1" && window.MODULE_CODE.length==0){
            oMPC.selectedIndex = 1;
          	MMsg("模块不能为空!");
          	return false;
          }
        }

        if(KPI_LIST_FLAG.value=="" && !isNotCheck){
          MMsg("请选择一个kpi标志!");
          oMPC.selectedIndex = 2;//1
          KPI_LIST_FLAG.focus();
          return false;
        }else{
          if(KPI_LIST_FLAG.value>"1" && KPI_LIST.length=="" && !isNotCheck){
          	MMsg("KPI不能为空!");
            oMPC.selectedIndex = 2;//1
          	return false;
          }
        }

		
        var datasource_radi = document.datasource_form.datasource;
        var b = false;
        for(var i=0;i<datasource_radi.length;i++){
                b=true;
                if(datasource_radi[i].checked==true){
                        if(datasource_radi[i].value == "datasource"){
                                if(REGION_ID_FLAG.value==""){
                                  MMsg("数据来源标志不能为空!");
                                  oMPC.selectedIndex = 1;
                                  REGION_ID_FLAG.focus();
                                  return false;
                                }else{
                                  if(REGION_ID_FLAG.value>"1" && REGION_ID.length==0){
                                        MMsg("数据来源不能为空!");
                                        oMPC.selectedIndex = 1;
                                        return false;
                                  }
                                }
                                REGION_ID_GROUP_FLAG.value = "1";
                                REGION_ID_GROUP.value = ""
                        }else if(datasource_radi[i].value == "datasourcegroup"){
                                if(REGION_ID_GROUP_FLAG.value==""){
                                  MMsg("数据来源组标志不能为空!");
                                  oMPC.selectedIndex = 1;
                                  try{REGION_ID_GROUP_FLAG.focus();}catch(e){}
                                  return false;
                                }else{
                                  if(REGION_ID_GROUP_FLAG.value>"1" && REGION_ID_GROUP.value==""){
                                        MMsg("数据来源不能为空!");
                                        oMPC.selectedIndex = 1;
                                        return false;
                                  }
                                }
                                REGION_ID_FLAG.value = "1";
                                REGION_ID.length= 0;
                        }
                }
        }
               
        if(!b){
                REGION_ID_FLAG.value = "1";
                REGION_ID.length= 0;
                REGION_ID_GROUP_FLAG.value = "1";
                REGION_ID_GROUP.value = ""
        }
        
        if(DR_ID_FLAG.value==""){
          MMsg("请选择一个双中心标志!");
          oMPC.selectedIndex = 2;//1
          DR_ID_FLAG.focus();
          return false;        	
        }else{
        if(DR_ID_FLAG.value>"1" && DR_ID.length==""){
          	MMsg("双中心不能为空!");
            oMPC.selectedIndex = 2;//1
          	return false;
          }
        }
        
        bcordt = document.bcordt_form.BcOrDt;
        b = false;
        for(var i=0;i<bcordt.length;i++){
                b=true;
                if(bcordt[i].checked==true){
                        if(bcordt[i].value == "busi_class"){
								if(BUSI_CLASS_FLAG.value==""){
								  oMPC.selectedIndex = 1;
								  MMsg("请选择一个业务大类!");
								  BUSI_CLASS_FLAG.focus();
								  return false;
								}else{
								  if(BUSI_CLASS_FLAG.value>"1" && window.BUSI_CLASS.length==""){
									MMsg("业务大类不能为空!");
									oMPC.selectedIndex = 1;
									return false;
								  }
								}
                                DATA_TYPE_FLAG.value = "1";
                                DATA_TYPE.length= 0;
                        }else if(bcordt[i].value == "data_type"){
								if(DATA_TYPE_FLAG.value==""){
								  oMPC.selectedIndex = 1;
								  MMsg("请选择一个数据类型!");
								  DATA_TYPE_FLAG.focus();
								  return false;
								}else{
								  if(DATA_TYPE_FLAG.value>"1" && window.DATA_TYPE.length==""){
									MMsg("数据类型不能为空!");
									oMPC.selectedIndex = 1;
									return false;
								  }
								}
                                BUSI_CLASS_FLAG.value = "1";
                                BUSI_CLASS.length= 0;
                        }
                }
        }
        if(!b){
                DATA_TYPE_FLAG.value = "1";
                DATA_TYPE_FLAG.length= 0;
                BUSI_CLASS_FLAG.value = "1";
                BUSI_CLASS.length= 0;
        }
		//qih add 20070802
		if(document.all.NE_CONFIG)
		{
			if(NE_CONFIG_FLAG.value==""){
			  oMPC.selectedIndex = 1;
			  MMsg("请选择一个配置项!");
			  NE_CONFIG_FLAG.focus();
			  return false;
			}else{
			  if(NE_CONFIG_FLAG.value>"1" && (NE_CONFIG.value==null||NE_CONFIG.value=="")){
				MMsg("配置项不能为空!");
				oMPC.selectedIndex = 1;
				return false;
			  }
			}
		}
        //模块所选值临时值,业务大类所选值临时值,数据来源所选值临时值
		var busi_class = "";
        for(var i=0;i<BUSI_CLASS.length;i++){
          if(busi_class=="") busi_class = BUSI_CLASS.options[i].value;
          else{
            busi_class = busi_class + "," + BUSI_CLASS.options[i].value;
          }
        }
        var modulecode = "";
        for(var i=0;i<MODULE_CODE.length;i++){
          if(modulecode=="") modulecode = MODULE_CODE.options[i].value;
          else{
            modulecode = modulecode + "," + MODULE_CODE.options[i].value;
          }
        }
        var region_id = "";
        for(var i=0;i<REGION_ID.length;i++){
          if(region_id=="") region_id = REGION_ID.options[i].value;
          else{
            region_id = region_id + "," + REGION_ID.options[i].value;
          }
        }
        
        var kpi_list = "";
        var element_kpi_list = dXML.XMLDocument.selectSingleNode("/Msg/KPI_LIST");
        var kpielement = element_kpi_list.selectNodes("KPI");
		for(var i=0;i<kpielement.length;i++){
			var node = kpielement[i];
			var b = true;
			for(var j=0;j<KPI_LIST.length;j++){
				if(node.getAttribute("KEY")==KPI_LIST.options[j].getAttribute("key")){
					b = false;
				}
			}
			if(b){
				element_kpi_list.removeChild(node);
			}
		}
	var kpielement=dXML.createElement("KPI");
	kpielement.setAttribute("KPI_ID",'-3');
	kpielement.setAttribute("KPI_VALUE",'');
	kpielement.setAttribute("KEY",'-3');
	kpielement.setAttribute("STATE","UPDATE");
	element_kpi_list.appendChild(kpielement);
        for(var i=0;i<KPI_LIST.length;i++){
          var kpiElment = element_kpi_list.selectNodes("KPI");
          if(kpiElment==null){
      			var kpielement=dXML.createElement("KPI");
      			kpielement.setAttribute("KPI_ID",KPI_LIST.options[i].value);
      			kpielement.setAttribute("KPI_VALUE",KPI_LIST.options[i].getAttribute("kpi_value"));
      			kpielement.setAttribute("KEY",KPI_LIST.options[i].getAttribute("key"));
      			kpielement.setAttribute("STATE","ADD");
      			element_kpi_list.appendChild(kpielement);
          }else{
	      	  var element = element_kpi_list.selectSingleNode('KPI[@KPI_ID="'+KPI_LIST.options[i].value+'" and @KPI_VALUE="'+KPI_LIST.options[i].getAttribute("kpi_value")+'" and @KEY="'+KPI_LIST.options[i].getAttribute("key")+'"]');
	      	  if(element==null){  //假如没找到，则说明这个KPI被修改或这个KPI是新增加的
	      		element = element_kpi_list.selectSingleNode('KPI[@KEY="'+KPI_LIST.options[i].getAttribute("key")+'" and @KEY!=""]');
	      		if(element == null){  //
	      			var kpielement=dXML.createElement("KPI");
	      			kpielement.setAttribute("KPI_ID",KPI_LIST.options[i].value);
	      			kpielement.setAttribute("KPI_VALUE",KPI_LIST.options[i].getAttribute("kpi_value"));
	      			kpielement.setAttribute("KEY",KPI_LIST.options[i].getAttribute("key"));
	      			kpielement.setAttribute("STATE","ADD");
	      			element_kpi_list.appendChild(kpielement);
	      		}else{
	      			element.setAttribute("KPI_ID",KPI_LIST.options[i].value);
	      			element.setAttribute("KPI_VALUE",KPI_LIST.options[i].getAttribute("kpi_value"));
	      			element.setAttribute("KEY",KPI_LIST.options[i].getAttribute("key"));
	      			element.setAttribute("STATE","UPDATE");
	      		}
	      	  }
      	  }
        }
        
        var data_type = "";
        for(var i=0;i<DATA_TYPE.length;i++){
          if(data_type=="") data_type = DATA_TYPE.options[i].value;
          else{
            data_type = data_type + "," + DATA_TYPE.options[i].value;
          }
        }

        if(IF_MOBILE.checked==true){
        	dXML.XMLDocument.selectSingleNode("/Msg/IF_MOBILE").text = "0BT";
        }else{
          	dXML.XMLDocument.selectSingleNode("/Msg/IF_MOBILE").text = "0BF";
        }

       /* if(IF_PHS.checked==true){
        	dXML.XMLDocument.selectSingleNode("/Msg/IF_PHS").text = "0BT";
        }else{
          	dXML.XMLDocument.selectSingleNode("/Msg/IF_PHS").text = "0BF";
        }*/

        if(IF_VOICE.checked==true){
        	dXML.XMLDocument.selectSingleNode("/Msg/IF_VOICE").text = "0BT";
        }else{
          	dXML.XMLDocument.selectSingleNode("/Msg/IF_VOICE").text = "0BF";
        }

        if(IF_MAIL.checked==true){
        	dXML.XMLDocument.selectSingleNode("/Msg/IF_MAIL").text = "0BT";
        }else{
          	dXML.XMLDocument.selectSingleNode("/Msg/IF_MAIL").text = "0BF";
        }

        dXML.XMLDocument.selectSingleNode("/Msg/MODULE_CODE").text = modulecode;
        dXML.XMLDocument.selectSingleNode("/Msg/MODULE_CODE_FLAG").text = MODULE_CODE_FLAG.value;
        dXML.XMLDocument.selectSingleNode("/Msg/BUSI_CLASS").text = busi_class;
        dXML.XMLDocument.selectSingleNode("/Msg/BUSI_CLASS_FLAG").text = BUSI_CLASS_FLAG.value;
        dXML.XMLDocument.selectSingleNode("/Msg/REGION_ID_GROUP").text = REGION_ID_GROUP.value;
        dXML.XMLDocument.selectSingleNode("/Msg/REGION_ID_GROUP_FLAG").text = REGION_ID_GROUP_FLAG.value;
        dXML.XMLDocument.selectSingleNode("/Msg/REGION_ID").text = region_id;
        dXML.XMLDocument.selectSingleNode("/Msg/REGION_ID_FLAG").text = REGION_ID_FLAG.value;
        //dXML.XMLDocument.selectSingleNode("/Msg/KPI_LIST").text = kpi_list;
        dXML.XMLDocument.selectSingleNode("/Msg/KPI_LIST_FLAG").text = KPI_LIST_FLAG.value;
        dXML.XMLDocument.selectSingleNode("/Msg/DATA_TYPE").text = data_type;
        dXML.XMLDocument.selectSingleNode("/Msg/DATA_TYPE_FLAG").text = DATA_TYPE_FLAG.value;
        dXML.XMLDocument.selectSingleNode("/Msg/DR_ID").text = DR_ID.value;
        dXML.XMLDocument.selectSingleNode("/Msg/DR_ID_FLAG").text = DR_ID_FLAG.value;
		//qih add 20070802
		if(document.all.NE_CONFIG)
		{
			dXML.XMLDocument.selectSingleNode("/Msg/NE_CONFIG").text = NE_CONFIG.value;
			dXML.XMLDocument.selectSingleNode("/Msg/NE_CONFIG_FLAG").text = NE_CONFIG_FLAG.value;
		}
}

/**
 * 功能：设置“网元范围”和“告警KPI”
 * 
 */
function loadFlowDomain(dXML,sourceXML)
{
    var neid        = (dXML.selectSingleNode("/root/Msg/NE_ID").text+"").replace("null","");          // 网元ＩＤ
    var nename      = (dXML.selectSingleNode("/root/Msg/NE_NAME").text+"").replace("null","");        // 网元名称
    var neTypeId    = (dXML.selectSingleNode("/root/Msg/NE_TYPE_ID").text+"").replace("null","");     // 网元类型
    var neFlag      = (dXML.selectSingleNode("/root/Msg/NE_FLAG").text+"").replace("null","");        // 网元标志
    var moduleid    = (dXML.selectSingleNode("/root/Msg/MODULE_CODE").text+"").replace("null","");    // 模　　块
    var busiclassid = (dXML.selectSingleNode("/root/Msg/BUSI_CLASS").text+"").replace("null","");     // 业务大类
	var datatypeid  = (dXML.selectSingleNode("/root/Msg/DATA_TYPE").text+"").replace("null","");      // 数据类型
    var regionid    = (dXML.selectSingleNode("/root/Msg/REGION_ID").text+"").replace("null","");      // 数 据 源
    var regiongroup = (dXML.selectSingleNode("/root/Msg/REGION_ID_GROUP").text+"").replace("null","");// 数据源组
    var drId        = (dXML.selectSingleNode("/root/Msg/DR_ID").text+"").replace("null","");           // 双中心
    //var kpilistid   = (dXML.selectSingleNode("/root/Msg/KPI_LIST").text+"").replace("null","");       // 告警KPI
	//var key         = (dXML.selectSingleNode("/root/Msg/KEY").text+"").replace("null","");            // ID
	//var type        = (dXML.selectSingleNode("/root/Msg/TYPE").text+"").replace("null","");           // 类型
	if(document.all.NE_CONFIG)
	{
		var neconfigid  = (dXML.selectSingleNode("/root/Msg/NE_CONFIG").text+"").replace("null","");      // 配置项
	}

	if(neTypeId!=null && neTypeId!="")// 存在网元 --> 取相关信息
	{
        // (1). 网　　元 (业务类型)
		//NE_ID.value = neid;
		xmlhttp.Open("POST","../../servlet/NECustomViewAction?action=39&viewId=1&ciId="+neid,false);
		xmlhttp.send();
        if(isSuccess(xmlhttp))
        {
        	NE_ID.value = xmlhttp.responseXML.selectSingleNode("/root/itemId").text;
        }
		NE_ID.text = nename;
		NE_ID.setAttribute("neTypeId",neTypeId);
		NE_ID.setAttribute("tag",neFlag);
		
		MODULE_CODE_FLAG.value     = dXML.selectSingleNode("/root/Msg/MODULE_CODE_FLAG").text;
		BUSI_CLASS_FLAG.value      = dXML.selectSingleNode("/root/Msg/BUSI_CLASS_FLAG").text;
		DATA_TYPE_FLAG.value       = dXML.selectSingleNode("/root/Msg/DATA_TYPE_FLAG").text;
		REGION_ID_FLAG.value       = dXML.selectSingleNode("/root/Msg/REGION_ID_FLAG").text;
		REGION_ID_GROUP_FLAG.value = dXML.selectSingleNode("/root/Msg/REGION_ID_GROUP_FLAG").text;
		DR_ID_FLAG.value           = dXML.selectSingleNode("/root/Msg/DR_ID_FLAG").text;
		if(document.all.NE_CONFIG)
			NE_CONFIG_FLAG.value   = dXML.selectSingleNode("/root/Msg/NE_CONFIG_FLAG").text;
		
		var datasource_radi = document.datasource_form.datasource;
		var bcordt = document.bcordt_form.BcOrDt;
		
		
		// (2). 模　　块
		var sendxml='<?xml version="1.0" encoding="gb2312"?>'
					+ '<root>'
					+    '<value>'+moduleid+'</value>'
					+    '<netypeid>'+neTypeId+'</netypeid>'
					+    '<ciid>'+neid+'</ciid>'
					+ '</root>';
		var modulename = setValue("../../servlet/appsysautoflowservlet?tag=18",sendxml,MODULE_CODE,MODULE_CODE_TEXT);
		
		// (3). 业务大类
		sendxml='<?xml version="1.0" encoding="gb2312"?>'
					+ '<root>'
					+    '<value>'+busiclassid+'</value>'
					+    '<netypeid>'+neTypeId+'</netypeid>'
					+    '<ciid>'+neid+'</ciid>'
					+ '</root>';
		var busiclassname = setValue("../../servlet/appsysautoflowservlet?tag=19",sendxml,BUSI_CLASS,BUSI_CLASS_TEXT);		
		if(BUSI_CLASS.length>0)
		{
			try{
			bcordt[0].checked=true;
			clickBusiClass();}catch(e){}
		}
		
		// (4). 数据类型
		sendxml='<?xml version="1.0" encoding="gb2312"?>'
					+ '<root>'
					+    '<value>'+datatypeid+'</value>'
					+    '<netypeid>'+neTypeId+'</netypeid>'
					+ '</root>';
		var datatypename = setValue("../../servlet/appsysautoflowservlet?tag=25",sendxml,DATA_TYPE,DATA_TYPE_TEXT);
		if(DATA_TYPE.length>0)
		{
			try{bcordt[1].checked=true;
			clickDataType();}catch(e){}
		}
		
		// (5). 数 据 源
		sendxml='<?xml version="1.0" encoding="gb2312"?>'
					+ '<root>'
					+    '<value>'+regionid+'</value>'
					+    '<netypeid>'+neTypeId+'</netypeid>'
					+ '</root>';
		var regionname = setValue("../../servlet/appsysautoflowservlet?tag=20",sendxml,REGION_ID,REGION_ID_TEXT);
		if(regionid!="")
		{
			try{datasource_radi[0].checked=true;
			clickdatasource();}catch(e){}
		}
		
		// (6). 数据源组
		REGION_ID_GROUP.value = regiongroup;
		if(REGION_ID_GROUP.value!="")
		{
			try{datasource_radi[1].checked=true;
			clickdatasourcegroup();}catch(e){}
		}
		
		//  双中心
		
		DR_ID.value = drId;
		
		
		// (8). 配置项
		if(document.all.NE_CONFIG)
		{
			NE_CONFIG.value=dXML.selectSingleNode("/root/Msg/NE_CONFIG").text;
			var neConfigText="";
			xmlhttp.open("POST","../../servlet/perManagerServlet?tag=39&id="+NE_CONFIG.value,false);
			xmlhttp.send();
			if(isSuccess(xmlhttp)) {
				var doc = new ActiveXObject("Microsoft.XMLDOM");
				doc.load(xmlhttp.responseXML);
				var nodeList = doc.selectNodes("/root/rowSet");
				for(var i=0;i<nodeList.length;i++)
				{
					neConfigText+=nodeList[i].getAttribute("value")+",";	
				}
				if(neConfigText.length>0)
					neConfigText = neConfigText.substring(neConfigText,neConfigText.length-1);
			}
			NE_CONFIG_TEXT.value=neConfigText;
		}	
	}else{// 不存在网元 --> 初始化
		NE_ID.value            = "";// (1). 网　　元
		NE_ID.text             = "";
		MODULE_CODE_TEXT.value = "";// (2). 模　　块
		MODULE_CODE.length     = 0;
		BUSI_CLASS_TEXT.value  = "";// (3). 业务大类
		BUSI_CLASS.length      = 0;
		DATA_TYPE_TEXT.value   = "";// (4). 数据类型
		DATA_TYPE.length       = 0;
		REGION_ID_TEXT.value   = "";// (5). 数 据 源
		REGION_ID.length       = 0;
		REGION_ID_GROUP.value  = "";// (6). 数据源组
		REGION_ID.length       = 0;
		KPI_LIST_TEXT.value    = "";// (7). 告警KPI
		KPI_LIST.length        = 0;
		if(document.all.NE_CONFIG)
		{
			NE_CONFIG_TEXT.value   = "";// (8). 配置项
			NE_CONFIG.value        = "";
		}

		MODULE_CODE_FLAG.value     = "1";
		BUSI_CLASS_FLAG.value      = "1";
		DATA_TYPE_FLAG.value       = "1";
		REGION_ID_FLAG.value       = "1";
		REGION_ID_GROUP_FLAG.value = "1";
		KPI_LIST_FLAG.value        = "1";
		DR_ID_FLAG.value           = "1";
		DR_ID.value                = "0";
		if(document.all.NE_CONFIG)
			NE_CONFIG_FLAG.value   = "1";
	}
	
	initMotion(dXML,sourceXML);
}

function initMotion(dXML,sourceXML){
	var key         = (dXML.selectSingleNode("/root/Msg/KEY").text+"").replace("null","");            // ID
	var type        = (dXML.selectSingleNode("/root/Msg/TYPE").text+"").replace("null","");           // 类型
	KPI_LIST_FLAG.value        = dXML.selectSingleNode("/root/Msg/KPI_LIST_FLAG").text;
		// (7). 告警KPI
	sendxml='<?xml version="1.0" encoding="gb2312"?>'
					+ '<root>'
					+    '<key>'+key+'</key>'
					+    '<type>'+type+'</type>'
					+ '</root>';
	setKpiXML("../../servlet/appsysautoflowservlet?tag=29",sendxml,sourceXML);
	var kpilistname = setKpiValue("../../servlet/appsysautoflowservlet?tag=29",sendxml,KPI_LIST,KPI_LIST_TEXT);
    
		// (8). 手机短信
	if(dXML.selectSingleNode("/root/Msg/IF_MOBILE").text=="0BT") IF_MOBILE.checked=true;
	else IF_MOBILE.checked=false;
	
	// (9). 小灵通短信
	/*if(dXML.selectSingleNode("/root/Msg/IF_PHS").text=="0BT") IF_PHS.checked=true;
	else IF_PHS.checked=false;*/
	
	// (10).语音通知
	if(dXML.selectSingleNode("/root/Msg/IF_VOICE").text=="0BT") IF_VOICE.checked=true;
	else IF_VOICE.checked=false;
	
	// (11).邮件通知
	if(dXML.selectSingleNode("/root/Msg/IF_MAIL").text=="0BT") IF_MAIL.checked=true;
	else IF_MAIL.checked=false;
}
/*url获取KPI列表的URL
sendxml获取KPI列表的xml
dXML要存储KPI列表的XML
*/
function setKpiXML(url,sendxml,dXML)
{
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  	var sendXML = new ActiveXObject("Microsoft.XMLDOM");
	sendXML.loadXML(sendxml);
	xmlhttp.Open("POST",url,false);
	xmlhttp.send(sendXML);
	var selectXml = new ActiveXObject("Microsoft.XMLDOM");
	selectXml.load(xmlhttp.responseXML);
	var element = selectXml.selectSingleNode("/root/rowSet");
	var kpilist = dXML.selectSingleNode("/Msg/KPI_LIST");
	var kpielement = kpilist.selectNodes("KPI");
	for(var i=0;i<kpielement.length;i++)
	{
		var node = kpielement[i];
		kpilist.removeChild(node);
	}
	
	while(element!=null)
	{
		var kpi_name = element.selectSingleNode("KPI_NAME").text;
		var kpi_id = element.selectSingleNode("KPI_ID").text;
		var kpi_value = element.selectSingleNode("KPI_VALUE").text;
		var key = element.selectSingleNode("KEY").text;
  		var kpielement=dXML.createElement("KPI");
  		kpielement.setAttribute("KPI_ID",kpi_id);
  		kpielement.setAttribute("KPI_VALUE",kpi_value);
  		kpielement.setAttribute("KEY",key);
  		kpielement.setAttribute("STATE","UPDATE");
  		kpilist.appendChild(kpielement);
		element = element.nextSibling;
	}
}

function setKpiValue(url,sendxml,objSelect,objText)
{
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  	var sendXML = new ActiveXObject("Microsoft.XMLDOM");
	sendXML.loadXML(sendxml);
	xmlhttp.Open("POST",url,false);
	xmlhttp.send(sendXML);
	var selectXml = new ActiveXObject("Microsoft.XMLDOM");
	selectXml.load(xmlhttp.responseXML);
	//alert(selectXml.xml)
	var element = selectXml.selectSingleNode("/root/rowSet");
	var checkValue="";//初始化复选框的状态
	var returntxt = "";
	objSelect.length = 0;
	while(element!=null)
	{
		i++;
		var kpi_name = element.selectSingleNode("KPI_NAME").text;
		var kpi_id = element.selectSingleNode("KPI_ID").text;
		var kpi_value = element.selectSingleNode("KPI_VALUE").text;
		var key = element.selectSingleNode("KEY").text;
		objSelect.length ++;
		objSelect.options[objSelect.length-1].value = kpi_id;
		objSelect.options[objSelect.length-1].text = kpi_name;
		objSelect.options[objSelect.length-1].setAttribute("kpi_value",kpi_value);
		objSelect.options[objSelect.length-1].setAttribute("key",key);
		if(returntxt==""){
		  returntxt = kpi_name;
		}else{
		  returntxt = returntxt+","+kpi_name;
		}
		element = element.nextSibling;
	}
	objText.value = returntxt;
    return returntxt;
}

function setValue(url,sendxml,objSelect,objText){
  	var sendXML = new ActiveXObject("Microsoft.XMLDOM");
	sendXML.loadXML(sendxml);
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST",url,false);
	xmlhttp.send(sendXML);
	var selectXml = new ActiveXObject("Microsoft.XMLDOM");
	selectXml.load(xmlhttp.responseXML);
	var element = selectXml.selectSingleNode("/root/rowSet");
	var checkValue="";//初始化复选框的状态
	var returntxt = "";
	objSelect.length = 0;
	while(element!=null){
		i++;
		var text = element.selectSingleNode("TEXT").text;
		var val = element.selectSingleNode("VALUE").text;

		objSelect.length ++;
		objSelect.options[objSelect.length-1].value = val;
		objSelect.options[objSelect.length-1].text = text;

		if(returntxt==""){
		  returntxt = text;
		}else{
		  returntxt = returntxt+","+text;
		}
		element = element.nextSibling;
	}
	objText.value = returntxt;
    return returntxt;
}


///当选可忽略的时候，对应的下拉框为空值
function flagchange(obj,objflag,ifselect){
  if(objflag.value=="1"){
    if(ifselect!=null && ifselect!=""){
		obj.value = "";
		obj.text = "";
	}else{
		obj.length = 0;
	}
	var str = "document.getElementById(\""+obj.id+"_TEXT\").value=''";
	try{eval(str);}catch(e){}
  }
}
function changeRegionGroup(){
    if(REGION_ID_GROUP_FLAG.value=="1"){
       MMsg("请选择数据源组标志");
       REGION_ID_GROUP_FLAG.focus();
       REGION_ID_GROUP.value="";
       REGION_ID_GROUP.text = "";
    }
}
function buildRegionGroup(){
	rebuildSelect("../../servlet/regiongroupservlet?tag=13",REGION_ID_GROUP);
}
function clickdatasource(){
	document.getElementById("tr_datasource").style.display="";
	document.getElementById("tr_datasourcegroup").style.display="none";
}
function clickdatasourcegroup(){
	document.getElementById("tr_datasource").style.display="none";
	document.getElementById("tr_datasourcegroup").style.display="";
}

function clickBusiClass(){
	document.getElementById("tr_busiclass").style.display="";
	document.getElementById("tr_datatype").style.display="none";
}

function clickDataType(){
	document.getElementById("tr_busiclass").style.display="none";
	document.getElementById("tr_datatype").style.display="";
}

function configRegionGroup(){
	var params= new Array();
    var resultArr = window.showModalDialog("/workshop/maintjobplan/regionGroupCfg.html",params,"resizable=yes;dialogWidth=800px;dialogHeight=600px;help=0;scroll=1;status=0;");
	if(resultArr=="ok"){
		buildRegionGroup();
	}
}

function rebuildFlag(obj){
	rebuildSelect("../../servlet/maintjobitemservlet?tag=8",obj,"false");
}

function rebuildFlag2(obj,code){
	rebuildSelect("../../servlet/maintjobitemservlet?tag=22&code="+code,obj,"false");
}

function setFlowDomainBlank(){
		MODULE_CODE_FLAG.selectedIndex = 0;
		MODULE_CODE.length=0;
		MODULE_CODE_TEXT.value = "";

		BUSI_CLASS_FLAG.selectedIndex = 0;
		BUSI_CLASS.length=0;
		BUSI_CLASS_TEXT.value = "";

		REGION_ID_FLAG.selectedIndex = 0;
		REGION_ID.length=0;
		REGION_ID_TEXT.value = "";

		REGION_ID_GROUP.value = "";
		//REGION_ID_GROUP_FLAG.value = "";
		REGION_ID_GROUP_FLAG.selectedIndex = 0;

		DATA_TYPE.length=0;
		//DATA_TYPE_FLAG.value = "";
		DATA_TYPE_FLAG.selectedIndex = 0;
		DATA_TYPE_TEXT.value = "";

		KPI_LIST_FLAG.selectedIndex = 0;
		KPI_LIST.length=0;
		KPI_LIST_TEXT.value = "";
		
		DR_ID.value="0";
		DR_ID_FLAG.value="1";
		
		if(document.all.NE_CONFIG)
		{
			NE_CONFIG_FLAG.selectedIndex = 0;
			NE_CONFIG_TEXT.value = "";
			NE_CONFIG.value = "";
		}

        var datasource_radi = document.datasource_form.datasource;
        datasource_radi[0].checked = true;
        clickdatasource();

        var bcordt = document.bcordt_form.BcOrDt;
        bcordt[0].checked = true;
        clickBusiClass();
}

//显示KPI面板
/**
*kpiset 是NormalObj的对象数组,kpiset是记录KPI的，是初始化查询面板的已选KPI。
*neidobj 是NeIdObj对象，neidobj是记录网元，多个网元用"，"分割
**/
function showKPIPanel(kpiset,neidobj,if_appsys,ne_msg_type,ci_class_id,selectOneOnly){
    if(ne_msg_type==null){
    	ne_msg_type = "20";
    }
    
    if(if_appsys==null){
    	if_appsys = "";
    }
    
    //创建参数
	var kpiselectobj = new KPISelectObj();
	//kpiselectobj.if_appsys = if_appsys;
	kpiselectobj.ne_msg_type = ne_msg_type;
	if(selectOneOnly!=null && selectOneOnly!="")
		kpiselectobj.selectOneOnly=selectOneOnly;
	if(ci_class_id!=null && ci_class_id!="")
		kpiselectobj.ci_class_id=ci_class_id;
	
	if(if_appsys=="true"){
		var neidobj = new NeIdObj();
		neidobj.value = NE_ID.value;
		neidobj.text = NE_ID.text;
		neidobj.neTypeId = NE_ID.getAttribute("neTypeId");
		kpiselectobj.neidObj = neidobj;
		
		var moduleset = new Array();
		for(var i=0;i<MODULE_CODE.length;i++){
			var normalobj = new NormalObj();
			normalobj.value = MODULE_CODE.options[i].value;
			normalobj.text = MODULE_CODE.options[i].text;
			moduleset.push(normalobj);
		}
		kpiselectobj.moduleSet = moduleset;
		kpiselectobj.moduleFlag = MODULE_CODE_FLAG.value;
		
		var busiclassset = new Array();
		for(var i=0;i<BUSI_CLASS.length;i++){
			var normalobj = new NormalObj();
			normalobj.value = BUSI_CLASS.options[i].value;
			normalobj.text = BUSI_CLASS.options[i].text;
			busiclassset.push(normalobj);
		}
		kpiselectobj.busiClassSet = busiclassset;
		kpiselectobj.busiClassFlag = BUSI_CLASS_FLAG.value;
		
		var datatypeset = new Array();
		for(var i=0;i<DATA_TYPE.length;i++){
			var normalobj = new NormalObj();
			normalobj.value = DATA_TYPE.options[i].value;
			normalobj.text = DATA_TYPE.options[i].text;
			datatypeset.push(normalobj);
		}
		kpiselectobj.dataTypeSet = datatypeset;
		kpiselectobj.dataTypeFlag = DATA_TYPE_FLAG.value;

	}
	
	//kpiset必须为NormalObj的数组类型
	if(kpiset!=null){
		kpiselectobj.kpiSet = kpiset;
	}
	
	//neidobj必须为NeIdObj类型
	if(neidobj!=null){
		var v_neidobj = new NeIdObj();
		v_neidobj = neidobj;
		kpiselectobj.neidObj = v_neidobj;
	}else{
		var v_neidobj = new NeIdObj();
		v_neidobj.value = "-1";
		v_neidobj.text  = "网元";
		kpiselectobj.neidObj = v_neidobj;
	}
	

    var params = new Array();
    params.push(window);
	params.push(if_appsys);
	params.push(ne_msg_type);
	params.push(kpiselectobj);

    var returnObj = window.showModalDialog("../alarm/KPISelect.html",params,"resizable=yes;dialogWidth=600px;dialogHeight=550px;help=0;scroll=1;status=0;");
	if(returnObj==null){
		returnObj = new Array();
	}
	return returnObj;
}

//选择KPI后，把KPI显示在KPI_LIST中(要修改),
//if_appsys参数已不起作用，传""
//ci_class_id参数为ci类ID，传入可默认查询该CI类的KPI
//selectOneOnly参数值为1时表示kpi只能选一个，传其他值，或者不传该参数，表示KPI为多选
function selectsubmitKPI(if_appsys,ne_msg_type,ci_class_id,selectOneOnly){

	if(KPI_LIST_FLAG.value=="1" || KPI_LIST_FLAG.value==""){
     MMsg("请选择KPI标志");
     KPI_LIST_FLAG.focus();
     return false;
  } 
  
  if(ne_msg_type==null || ne_msg_type==""){
  	ne_msg_type = "20";
  }
  
  //if(if_appsys==null){
  //	if_appsys = "";
  //}
  
  //创建参数
	var kpiselectobj = new KPISelectObj();
	kpiselectobj.ifGetKpiValue = true;
	//kpiselectobj.if_appsys = if_appsys;
	kpiselectobj.ne_msg_type = ne_msg_type;
	if(selectOneOnly!=null && selectOneOnly!="")
		kpiselectobj.selectOneOnly=selectOneOnly;
	if(if_appsys=="true")
		kpiselectobj.ci_class_id=NE_ID.getAttribute("neTypeId");
	if(ci_class_id!=null && ci_class_id!="")
		kpiselectobj.ci_class_id=ci_class_id;
	/*if(if_appsys=="true"){
		var neidobj = new NeIdObj();
		neidobj.value = NE_ID.value;
		neidobj.text = NE_ID.text;
		neidobj.neTypeId = NE_ID.getAttribute("neTypeId");
		kpiselectobj.neidObj = neidobj;
		
		var moduleset = new Array();
		for(var i=0;i<MODULE_CODE.length;i++){
			var normalobj = new NormalObj();
			normalobj.value = MODULE_CODE.options[i].value;
			normalobj.text = MODULE_CODE.options[i].text;
			moduleset.push(normalobj);
		}
		kpiselectobj.moduleSet = moduleset;
		kpiselectobj.moduleFlag = MODULE_CODE_FLAG.value;
		
		var busiclassset = new Array();
		for(var i=0;i<BUSI_CLASS.length;i++){
			var normalobj = new NormalObj();
			normalobj.value = BUSI_CLASS.options[i].value;
			normalobj.text = BUSI_CLASS.options[i].text;
			busiclassset.push(normalobj);
		}
		kpiselectobj.busiClassSet = busiclassset;
		kpiselectobj.busiClassFlag = BUSI_CLASS_FLAG.value;
		
		var datatypeset = new Array();
		for(var i=0;i<DATA_TYPE.length;i++){
			var normalobj = new NormalObj();
			normalobj.value = DATA_TYPE.options[i].value;
			normalobj.text = DATA_TYPE.options[i].text;
			datatypeset.push(normalobj);
		}
		kpiselectobj.dataTypeSet = datatypeset;
		kpiselectobj.dataTypeFlag = DATA_TYPE_FLAG.value;
	}else{
		var neidobj = new NeIdObj();
		try{
			if(NE_ID_INPUT.value && NE_ID_INPUT.value.indexOf(",")>0) {
				//如果要传入KPI选择页面的网元有多个，则取第一个，这个有个前提：网元的网元类型是相同的
				neidobj.value = (NE_ID_INPUT.value.split(","))[0];
				neidobj.text = (NE_NAME.value.split(","))[0];
			} else {
				neidobj.value = NE_ID_INPUT.value;
				neidobj.text = NE_NAME.value;
			}
		}catch(e){
			neidobj.value = "-1";
			neidobj.text  = "网元";
		}

		kpiselectobj.neidObj = neidobj;
	}*/
	
	var kpiset = new Array();
	for(var i=0;i<KPI_LIST.length;i++){
		var kpiobj = new KpiObj();
		kpiobj.kpi_id = KPI_LIST.options[i].value;
		kpiobj.kpi_name = KPI_LIST.options[i].text;
		kpiobj.kpi_value = KPI_LIST.options[i].getAttribute("kpi_value");
		kpiobj.key = KPI_LIST.options[i].getAttribute("key");
		kpiset.push(kpiobj);
	}
	kpiselectobj.kpiSet = kpiset;
	kpiselectobj.kpiFlag = KPI_LIST_FLAG.value;
	
    var params = new Array();
    params.push(window);
	params.push(if_appsys);
	params.push(ne_msg_type);
	params.push(kpiselectobj);
    var returnObj = window.showModalDialog("../alarm/KPISelect.html",params,"resizable=yes;dialogWidth=600px;dialogHeight=550px;help=0;scroll=1;status=0;");

	if(returnObj!=null){
      KPI_LIST.length = 0;
      KPI_LIST_TEXT.value = returnObj.name;
      var kpi_name = returnObj.name;
      var kpi_id = returnObj.value;
      var kpi_value = returnObj.kpi_value;
      var keys = returnObj.key;

      if(kpi_id!="" && kpi_id !=null){
          var valuearr = kpi_value.split(",");
          var textarr = kpi_name.split(",");
          var idarr = kpi_id.split(",");
          var keyarr = keys.split(",");
          for(i=0;i<idarr.length;i++){
            KPI_LIST.length++;
            KPI_LIST.options[KPI_LIST.length-1].value = idarr[i];
            KPI_LIST.options[KPI_LIST.length-1].text = textarr[i];
            KPI_LIST.options[KPI_LIST.length-1].setAttribute("kpi_value",valuearr[i]);
            KPI_LIST.options[KPI_LIST.length-1].setAttribute("key",keyarr[i]);
          }
      }
    }
}

function KPISelectObj(){
	this.moduleSet = new Array();
	this.moduleFlag = "";
	this.busiClassSet = new Array();
	this.busiClassFlag = "";
	this.dataTypeSet = new Array();
	this.dataTypeFlag = "";
	this.kpiSet = new Array();
	this.kpiFlag = "";
	this.neidObj = new NeIdObj();
	this.if_appsys = "";  //是否只选择业务系统KPI
	this.ne_msg_type = "";  //消息类型
	this.ifGetKpiValue = false; //时候也要获取KPI 值
}
//选择KPI时候返回的对象
function ReturnObject(){
	this.name="";
	this.value="";
	this.kpi_value;
	this.key="";
}

function KpiObj(){
	this.kpi_id;
	this.kpi_name;
	this.kpi_value;
	this.key;
}

function NeIdObj(){
	this.value;
	this.text;
	this.neTypeId;
}

function NormalObj(){
	this.value;
	this.text;
}

function showModalD(url,width,height){
	var params = new Array();
	if(width=="" || width==null) width = "780px";
	if(height=="" || height==null) width = "600px";
	var sysdate = getBeforSysdate();
    var obj = document.getElementById(beClickTdId);
    if(obj!=null){
      if(obj.getAttribute("date")!=null && obj.getAttribute("date")!=""){
        	var d = new Date();
            var aa = formatDate(d);
        	sysdate = obj.getAttribute("date");
            var arr = sysdate.split("-");
            var year = parseFloat(arr[0]);
            var month = parseFloat(arr[1])-1;
            var day = parseFloat(arr[2]);

            var date=new Date(year,month,day);
            var newtimems=date.getTime()+(-1*24*60*60*1000);
            date.setTime(newtimems);
            sysdate = formatDate(date);
      }
    }

	url = url.replace(/@@/g,"&");
    var left = (screen.width-parseInt(width))/2;
    var top = (screen.height-parseInt(height))/2;
    var resultArr = window.open(url+"&sysdate="+sysdate+"&fromjob=fromjob","111","resizable=yes,left="+left+",top="+top+",width="+width+",height="+height+",help=0,scrollbars=1,status=0");
}

function openAnalyzeReport(ruleid,width,height){
	var analyzeBatchId = "";
	var sysdate = getSysdate();
    var obj = document.getElementById(beClickTdId);

	if(width=="" || width==null) width = "780px";
	if(height=="" || height==null) width = "600px";

    if(obj!=null){
		if(obj.getAttribute("date")!=null && obj.getAttribute("date")!=""){
			sysdate = obj.getAttribute("date");
		}
    }

	var url = "../../servlet/regatherorreanalyzeservlet?";
	var sendXML = '<?xml version="1.0" encoding="gb2312"?><xml>';
	sendXML = sendXML + '<analyzeRuleId>'+ruleid+'</analyzeRuleId>';
	sendXML = sendXML + '<analyzeRuleDate>'+sysdate+'</analyzeRuleDate>';
	sendXML = sendXML + '</xml>';

	var dXML = new ActiveXObject("Microsoft.XMLDOM");
	dXML.loadXML(sendXML);
	var paramArray = new Array();
	paramArray.push("tag=5");
	xmlhttp.Open("POST",url+paramArray.join("&"),false);
	xmlhttp.send(dXML);

	var isOK = isSuccess(xmlhttp);
	if(isOK){
		var dXML = new ActiveXObject("Microsoft.XMLDOM");
		dXML.load(xmlhttp.responseXML);

		var MsgNode = dXML.selectSingleNode("/root/Msg");
		if(MsgNode==null){
			MMsg("根据审核规则标识“"+ruleid+"”没找到"+sysdate+"的稽核报表！");
			return;
		}

		var analyzeBatchNode = MsgNode.selectSingleNode("ANALYZE_TASK_BATCH_ID");
		if(analyzeBatchNode == null){
			MMsg("根据审核规则标识“"+ruleid+"”没找到"+sysdate+"的稽核报表！");
			return ;
		}
		analyzeBatchId = analyzeBatchNode.text;

		var params = new Array();
		params.push("logicAnalyseRuleId="+ruleid);
		params.push("analyseTaskBatchId="+analyzeBatchId);

	    var left = (screen.width-parseInt(width))/2;
	    var top = (screen.height-parseInt(height))/2;
		window.open("../logicaudit/infoList.jsp?"+params.join("&"),"111","resizable=yes,left="+left+",top="+top+",width="+width+",height="+height+",help=0,scrollbars=1,status=0");

	}
}

//下载维护作业手册
function downloadHandbook()
{
	var sql = "SELECT D.DOCUMENT_NAME,D.DOCUMENT_PATH FROM DOCUMENTS D WHERE D.DOCUMENT_ID = '" + $getSysVar('MAINT_JOB_HANDBOOK_DOUCUNET_ID') +"'"
	xmlhttp.Open("POST","../../servlet/@Deprecated/ExecServlet?action=101&paramValue="+getAESEncode(encodeURIComponent(sql)),false);
	xmlhttp.send();
	if (isSuccess(xmlhttp))	{
		var row=xmlhttp.responseXML.selectSingleNode("//root/rowSet");
		var params = new Array();
		params.push("filename="+encodeURIComponent(row.attributes[0].value));
		params.push("fullPath="+encodeURIComponent(row.childNodes[0].text));		
		window.location.href = "../../servlet/downloadservlet?action=1&filename="+params.join("&");
	}
}

//是否显示说明信息
function isExpandNote(expand)
{
	if(expand)
		step_2.style.display = "";
	else
    	step_2.style.display = "none";
}

//作业内容查询 一列 是否显示在后面。
function isShowJobContentQueryBack()
{
	return $getSysVar("IS_SHOW_JOB_CONTENT_QUERY_BACK") == '0BT'
}

function checkFloat(obj,precision) {
	var reg = new RegExp("^[0-9]+(.[0-9]{1," + precision + "})?$","gi");
	var isFloat = reg.exec(obj.value);
	if(!isFloat) {
		EMsg("只能输入精确到小数点后" + precision + "位的数字");
		obj.value = "";
		return false;
	}
	return true;
}

function isEmpty(v, allowBlank){
   return v === null || v === undefined || (!allowBlank ? v === '' : false);
}

function getHref(addr,name){
	if(!isEmpty(addr) && !isEmpty(name) ){
		return '<a href="'+addr+'" target="_blank">'+name+'</a>'
	}	
	return "";
}
