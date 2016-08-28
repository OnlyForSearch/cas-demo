//选择人员
function choosePerson(obj_man_id,obj_man_name){
	var obj = choiceStaff();
	if(obj!=null){
		obj_man_id.value = obj.id;
		obj_man_name.value = obj.name
				}
}
//选择参加人员
function choosecompere(obj_man_id, obj_man_name, staffCategory, isMultiple)
{	var obj = choiceCompetitionStaff(obj_man_id.value, obj_man_name.value,staffCategory, isMultiple);
		if (obj != null) {
			obj_man_id.value = obj.id;
			obj_man_name.value = obj.name
		}
}
function chooseComStaff(selObject,staffCategory, isMultiple)
{ 	    var obj_man_id;
		var obj_man_name;
		var idArray = new Array();
		var nameArray = new Array();
		var oSelect = selObject.getObject();
		for (i = 0; i < oSelect.options.length; i++)
			{
				idArray.push(oSelect.options[i].value);
				nameArray.push(oSelect.options[i].text);
			}
			obj_man_id = idArray.join(",");
			obj_man_name = nameArray.join(",");
		var obj = choiceCompetitionStaff(obj_man_id, obj_man_name,staffCategory, isMultiple,selObject);
		if (obj != null) 
		{
			selObject.delAllOption();
			selObject.addOptions(obj.name, obj.id);
		}
}
function choiceCompetitionStaff(iniId,iniName,staffCategory,isMultiple)
{
	var dialogsFeatures = "dialogWidth=450px;dialogHeight=390px;help=0;scroll=0;status=0;";
	if(isMultiple==null)
	{
		isMultiple = false;
	}
	var paramArray = new Array();
	paramArray.push(iniId);
	paramArray.push(iniName);
	paramArray.push(staffCategory);
	paramArray.push(isMultiple);
	return window.showModalDialog("../../workshop/competition/choiceCompetitionStaff.html",paramArray,dialogsFeatures);
}
function chooseQuestion(selObject, isMultiple)
{ 	    var obj_man_id;
		var obj_man_name;
		var idArray = new Array();
		var nameArray = new Array();
		var oSelect = selObject.getObject();
		for (i = 0; i < oSelect.options.length; i++)
			{
				idArray.push(oSelect.options[i].value);
				nameArray.push(oSelect.options[i].text);
			}
			obj_man_id = idArray.join(",");
			obj_man_name = nameArray.join(",");
		var obj = choiceQuestionHtml(obj_man_id, obj_man_name,isMultiple,selObject);
		if (obj != null) 
		{
			selObject.delAllOption();
			selObject.addOptions(obj.name, obj.id);
		}
}
function choiceQuestionHtml(iniId,iniName,isMultiple)
{
	var dialogsFeatures = "dialogWidth=450px;dialogHeight=400px;help=0;scroll=0;status=0;";
	if(isMultiple==null)
	{
		isMultiple = false;
	}
	var paramArray = new Array();
	paramArray.push(iniId);
	paramArray.push(iniName);
	paramArray.push(isMultiple);
	return window.showModalDialog("../../workshop/competition/choiceQuestion.html",paramArray,dialogsFeatures);
}
// 为XML节点添加子节点
function addNewNode(infoNode, nodeName, nodeValue, attrNameArr, attrValueArr)
{
    if(nodeName==null) return;    
    var dXML = infoNode.ownerDocument;
    var itemNode = dXML.createElement(nodeName);
    if(nodeValue!="") itemNode.text = nodeValue;       
    if(attrNameArr!=null)
    {
        for(var i=0;i<attrNameArr.length;i++)
        {
              itemNode.setAttribute(attrNameArr[i], attrValueArr[i]);
        }
    }
    infoNode.appendChild(itemNode);
    return itemNode;
}
function getCurTime()
{
var myDate = new Date();
var curMonth = myDate.getMonth()+1;
	if (String(curMonth).length==1) curMonth="0"+curMonth;
var curDate = myDate.getDate()+1;
	if (String(curMonth).length==1) curDate="0"+curDate;
	//myDate.toLocaleTimeString()
    return  myDate.getFullYear()+"-"+curMonth+"-"+curDate+" ";

}
function clearNoNum(obj)
	{
		//先把非数字的都替换掉，除了数字和.
		obj.value = obj.value.replace(/[^\d.]/g,"");
		//必须保证第一个为数字而不是.
		obj.value = obj.value.replace(/^\./g,"");
		//保证只有出现一个.而没有多个.
		obj.value = obj.value.replace(/\.{2,}/g,".");
		//保证.只出现一次，而不能出现两次以上
		obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");

		if (obj.value.length>=5) obj.value=obj.value.substring(0,5);
	}
//==============================================================================================
function checkdate(){
		if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=8){
			alert("只能输入数字");
                        var value1 = event.srcElement.value;
                        event.srcElement.value = value1.substring(0,value1.length-1);
			return false;
		}
		return true;
}
function checkdate1(min,max){
		if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=8){
			alert("只能输入数字");
                        var value1 = event.srcElement.value;
                        event.srcElement.value = value1.substring(0,value1.length-1);
			return false;
		}else{
          	      if((parseInt(event.srcElement.value)<min || parseInt(event.srcElement.value)>max) && event.keyCode!=8){
               		alert("输入的数字只能是"+min+"到"+max+"范围内！");
                        event.srcElement.value = "";
         	      }
		}
		return true;
}
function timepicker(name,dateObj,showUID){
    this.name = name;
    this.dateObj = dateObj;
    this.hh = "";
    this.mm = "";
    this.ss = "";
    this.showUID = showUID;
    if(dateObj!=""){
  	  this.outputstr = '<table width="267" height="16"  border="0" cellpadding="0" cellspacing="0">'+
		  '<tr>'+
		    '<td height="16" nowrap>'+
                    '<IE:CalendarIpt class=DPFrame id="date_'+this.name+'" style="width:150" value="" sHiddenObject="STATE"/>'+
                    '&nbsp;<input style="border: 1px solid #999999; " maxlength="2"  onKeyUp="return checkdate1(0,23);"  id="h_'+this.name+'" type="text" size="2">&nbsp;时&nbsp;'+
 		    '<input style="border: 1px solid #999999; " maxlength="2" onKeyUp="return checkdate1(0,59);" name="textfield2" id="m_'+this.name+'"  type="text" size="2">&nbsp;分&nbsp;'+
 		    '<input style="border: 1px solid #999999; " maxlength="2" onKeyUp="return checkdate1(0,59);" name="textfield3" id="s_'+this.name+'"  type="text" size="2">&nbsp;秒</td>'+
 		 '</tr>'+
	   '</table>';
    }
    if(showUID=="" || showUID==null){
      document.write(this.outputstr);
    }
    this.ini = function(){
    	document.getElementById(showUID).innerHTML = this.outputstr;
    }

    this.getDateTime = function(){
          var returnstr = "";
	  this.hh = document.getElementById("h_"+this.name).value==""?"00":document.getElementById("h_"+this.name).value;
	  this.mm = document.getElementById("m_"+this.name).value==""?"00":document.getElementById("m_"+this.name).value;
	  this.ss = document.getElementById("s_"+this.name).value==""?"00":document.getElementById("s_"+this.name).value;

     	 if(this.dateObj==true){
    	    returnstr = document.getElementById("date_"+this.name).GetDate();
                if(returnstr!=""){
			returnstr = returnstr + " " + this.hh;
			returnstr = returnstr + ":" + this.mm;
			returnstr = returnstr + ":" + this.ss;
                }
   	   }else{
		returnstr = returnstr + " " + this.hh;
		returnstr = returnstr + ":" + this.mm;
		returnstr = returnstr + ":" + this.ss;
    	  }
          return returnstr;
    }
    this.checkDate=function(){
      if(this.getDateTime()=="") return "";
          var returnstr = "";
          if(this.hh<0 || this.hh>23 ){
            alert("小时必须在0到23之间");
            returnstr = "false";
          }
          if( this.mm<0 || this.mm>59){
            alert("分钟必须在0到59之间");
            returnstr = "false";
          }
          if(this.ss<0 || this.ss>59){
            alert("秒钟必须在0到59之间");
            returnstr = "false";
          }
          return returnstr;
    }
	this.setShowDate= function(ifshowdate){
		this.dateObj = ifshowdate;
		if(ifshowdate){
			document.getElementById("date_"+this.name).style.display = "";
		}else{
			document.getElementById("date_"+this.name).style.display = "none";
		}
	}

	this.setDate = function(date){
		document.getElementById("date_"+this.name).value = date;
	}

	this.setTime = function(time){
		var arr = time.split(":");
                if(time==""){
                	arr = new Array(3);
                        arr[0] = "";
                        arr[1] = "";
                        arr[2] = "";
                }
		document.getElementById("h_"+this.name).value = arr[0];
		document.getElementById("m_"+this.name).value = arr[1];
		document.getElementById("s_"+this.name).value = arr[2];
	}
        this.setDateTime = function(datetime){
          var arr = datetime.split(" ");
          if(datetime==""){
            arr = new Array(2);
            arr[0]="";
            arr[1]="";
          }
          this.setDate(arr[0]);
          this.setTime(arr[1]);
        }
}
//获取字符串宽度
function getStrWidth(str)
{
    var w = 0;
    var id = 'check_new_line_span_leonny';
    var s = document.getElementById(id);
    s.innerHTML = str;
    s.style.display = '';
    w = s.scrollWidth;
    s.style.display = 'none';
    return w;
}
//动态改变选择列表框,主要为动态实现滚动条提供服务
//输入参数:(1)选择框对象,(2)选择框默认的宽度,(3)选择框默认的行数
//说明:当选择框对象超出设置默认的参数时就改变,如果没有超出设置的默认参数就以默认的参数初始化
function initSelect(selectObject,selectWidth,selectSize)
{				
                var oSelect=selectObject.getObject();
                if (typeof(oSelect)=='undefined'||typeof(oSelect.scrollWidth)=='undefined'||typeof(selectObject.getLength())=='undefined')
                {	
                	oSelect.style.width=selectWidth;
                	oSelect.size=selectSize;
                	return;
                }
                var maxLength=selectWidth;
                var curLength=0;
                 for(i=0;i<oSelect.options.length;i++)
                 	{	
                 		curLength=getStrWidth(oSelect.options[i].text)+40;
                 		if (curLength>maxLength)
                 			maxLength = curLength;                		
                 	}               
				if (maxLength>selectWidth) oSelect.style.width=maxLength;
				else oSelect.style.width=selectWidth;		
				if (selectObject.getLength()>=selectSize) oSelect.size=selectObject.getLength();
				else oSelect.size=selectSize;
			    oSelect.multiple="true";
			    
}