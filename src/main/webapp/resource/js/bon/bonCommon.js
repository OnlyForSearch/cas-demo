var bonGlobal = {
	recWidth    : 200,
	recWidth2   : 355,
	recHeight   : 15,
	recFlagColor: {'-1':'red','0':'yellow','1':'green'},
	recColor    : {'0':'green','1':'blue','2':'red','3':'yellow'},
	msgType     : {'11':'CCR','12':'RAR','13':'ASR','21':'CCA','22':'RAA','23':'ASA'},
	currentWinItm  : null,
	periodStore : new Ext.data.SimpleStore({
        fields: ['value', 'text'],
        data  : [['', '-无-'],[15/60, '15分钟'], [1, '小时'],[24, '天'], [24*7, '周']]
    }),
    cycles : new Array(),
	timeSearchBar : ["&nbsp;时间:&nbsp;&nbsp;", {
						xtype	: "result_datetime",
						id		: 'bon_start_datetime',
						timeFormat : 'H:i:s',
						format : 'Y-m-d H:i:s',
						timeConfig : {
							altFormats : 'H:i:s',
							allowBlank : true
						},
						dateFormat : 'Y-m-d',
						dateConfig : {
							altFormats : 'Y-m-d|Y-n-d',
							allowBlank : true
						},
						width	: 190,
						value	: getModifyDateTime("-1/24")
					}, '&nbsp;&nbsp;至&nbsp;&nbsp;', {
						xtype	: "result_datetime",
						id		: 'bon_end_datetime',
						timeFormat : 'H:i:s',
						format : 'Y-m-d H:i:s',
						timeConfig : {
							altFormats : 'H:i:s',
							allowBlank : true
						},
						dateFormat : 'Y-m-d',
						dateConfig : {
							altFormats : 'Y-m-d|Y-n-d',
							allowBlank : true
						},
						width	: 190,
						value	: getModifyDateTime("+0")
					}, '-',{
						text	: "查询",
						iconCls	: "icon-search",
						handler	: function(){bonWinSearch();}
					},'-',{
						text	: "<前一小时",
						handler	: function(){bonWinSearch("-1/24");}
					},{
						text	: " 后一小时>",
						handler	: function(){bonWinSearch("+1/24");}
					},'-',{
						text	: "<<前一天",
						handler	: function(){bonWinSearch("-1");}
					},{
						text	: " 后一天>>",
						handler	: function(){bonWinSearch("+1");}
					}],
	actionUrl   : "/servlet/BonMsgServlet?action=",
	xmlhttp     : new ActiveXObject("Microsoft.XMLHTTP"),
	cycleObject : undefined
};

function drowRec(num){
	var rec="";
	var nums=num.split(",");
	var countNum=0;
	for(var i=0;i<nums.length;i++){
		countNum+=parseInt(nums[i]);
	}
	for(var i=0;i<nums.length;i++){
		rec += "<span style='height:"+bonGlobal.recHeight+";width:"+bonGlobal.recWidth*(nums[i]/countNum)+";background-color:"+bonGlobal.recColor[i>=bonGlobal.recColor.length?i%(bonGlobal.recColor.length-1):i]+"'>&nbsp;</span>";
	}
	return rec;	
}

function drowFlagRec(num){
	return "<span style='height:"+bonGlobal.recHeight+";width:"+bonGlobal.recWidth+";background-color:"+(bonGlobal.recFlagColor[num]||bonGlobal.recFlagColor["1"])+"'>&nbsp;</span>";
}

function drowUseRec(num){
	var color="0";
	var rec="";
	if(num>80)
		color="2";
	else if(num>60 && num<=80)
		color="3";
	rec += "<span style='background-color: #F0F0F0;height:"+bonGlobal.recHeight+";width:"+bonGlobal.recWidth2+";border:1px solid #2A86F1;'><span style='height:"+bonGlobal.recHeight+";width:"+bonGlobal.recWidth2*(num/100)+";background-color:"+bonGlobal.recColor[color]+";'>&nbsp;</span></span>";
	rec += "<div style='color:#BFBAB7;padding-top:5px;'>0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
			"%" +
			"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
			"100</div>";
	return rec;
}

function useage(num){
	var color="0";
	var rec="";
	if(num>80)
	color="2";
	else if(num>60 && num<=80)
	color="3";
	rec += "<span style='background-color: #F0F0F0;height:"+bonGlobal.recHeight+";width:"+bonGlobal.recWidth2/2+";border:1px solid #2A86F1;'><span style='text-align:center;height:"+bonGlobal.recHeight+";width:"+bonGlobal.recWidth2/2*(num/100)+";background-color:"+bonGlobal.recColor[color]+";'>"+num+"%</span></span>";
	rec += "<div>0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
	"%" +
	"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
	"100</div>";
	return rec;
}

function drowQueueRec(num){
    var rec="";
    var nums=num.split(",");
    var countNum=0;
    for(var i=0;i<nums.length;i++){
        countNum+=parseInt(nums[i]);
    }
    rec += "<span style='text-align:center;height:"+bonGlobal.recHeight+";width:"+bonGlobal.recWidth2/2*(nums[0]/countNum)+";background-color:green;'>"+nums[0]+"</span>"+
           "<span style='text-align:center;height:"+bonGlobal.recHeight+";width:"+bonGlobal.recWidth2/2*(nums[1]/countNum)+";background-color:red;'>"+nums[1]+"</span>";
    rec += "<div style='padding-top:5px;'>"+
           "<span style='text-align:center;height:"+bonGlobal.recHeight+";width:"+bonGlobal.recWidth2/2*(nums[0]/countNum)+";'>正常</span>"+
           "<span style='text-align:center;height:"+bonGlobal.recHeight+";width:"+bonGlobal.recWidth2/2*(nums[1]/countNum)+";'>异常</span>"+
           "</div>";
    return rec;
}



function tip(value){
	return "<div ext:qtip='<div style=\"font-size:10pt;padding:3;\">"+value+"</div>' ext:qtitle='详细信息：'>"+value+"</div>";	
}

function showGridWin(title,result,ciId){
	bonGlobal.currentWinItm=new Ext.data.ResultGrid({
		result		: result,
		iconCls		: 'icon-grid',
		tbar        : bonGlobal.timeSearchBar,
		title		: title,
	    height      : 500,
	    defaults	: {
	    	ciId	: ciId
		},
		id			:"chartWinGrid"
	});
	var oWin = new Ext.Window({
		layout      : "fit",
		width		: 950,
		height		: 530,
		closable 	: true,
		//closeAction	: 'hide',
		constrain   : true,
		modal		: true,
		plain		: false,
		items:[bonGlobal.currentWinItm]
	});
	oWin.show();
	bonWinSearch();
}

function showFmwChartWin(title,result,ciId){
	var oResult=new Array(1);
	if(typeof(result)!="number"){
		oResult=getGetValueCfgId("'"+result+"'");
	}else{
		oResult[0]=result;
	}
	bonGlobal.currentWinItm=new FusionChart({
		result : oResult[0],
		title  : title,
		tbar   : bonGlobal.timeSearchBar,
	    defaults	: {
	    	ciId	: ciId
		},
		width : 950,
		height: 450
	  });
	var oWin = new Ext.Window({
		width		: 950,
		height		: 500,
		closable 	: true,
		//closeAction	: 'hide',
		constrain   : true,
		modal		: true,
		plain		: false,
		items:[bonGlobal.currentWinItm]
	});
	oWin.show();
	bonWinSearch();
}
function bonWinSearch(oDays){
	var oStartTime=Ext.getCmp("bon_start_datetime").getValue();
	var oEndTime=Ext.getCmp("bon_end_datetime").getValue();
	if(oDays!=null && oDays!="" && oDays!="0"){
		oStartTime=getModifyDateTime(oDays,oStartTime);
		oEndTime=getModifyDateTime(oDays,oEndTime);
		Ext.getCmp("bon_start_datetime").setValue(oStartTime);
		Ext.getCmp("bon_end_datetime").setValue(oEndTime);
	}
	var oParam={
			START_DATETIME:oStartTime,
			END_DATETIME:oEndTime,
			CI_ID:bonGlobal.currentWinItm.ciId
	};
	bonGlobal.currentWinItm.search(oParam);
}
function getGetValueCfgId(resultName){
	var oResults;
	bonGlobal.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	bonGlobal.xmlhttp.Open("POST",bonGlobal.actionUrl+"1&param_name="+resultName,false);
	bonGlobal.xmlhttp.send();
	if (isSuccess(bonGlobal.xmlhttp))
	{
		var oRows = bonGlobal.xmlhttp.responseXML.selectNodes("/root/rowSet");
		oResults=new Array(oRows.length);
		for( var i=0;i<oRows.length;i++){
			oResults[i]=oRows[i].selectSingleNode("GET_VALUE_CFG_ID").text;
		}
	}
	return oResults;
}

function getSelectStore(sqlName,searchParam,obj){
    var oStore=null;
    var oResult = ResultFactory.newResult(sqlName);
    oResult.async = false;
    oResult.onLoad = function(oXml)
    {
       var domSelect = document.getElementById(obj);
        var oTempArray = new Array();
        var oOption = document.createElement("OPTION");
        oOption.value ="";
        oOption.text = "";  
        domSelect.add(oOption);
        var oRows=oXml.selectNodes("/root/rowSet");
        for(var i=1;i<=oRows.length;i++){
            var oOption = document.createElement("OPTION");
            oOption.value =oRows[i-1].childNodes[1].text;
            oOption.text = oRows[i-1].childNodes[0].text;  
            domSelect.add(oOption);
        }        
    }
    oResult.send(Result.FORCE_GET,searchParam);
}

//duringHours距离当前时间多少小时的小时数，可正可负，没有的话获取当前时间,oDateTime没值的话表示当前时间
function getModifyDateTime(duringHours,oDateTime){
	var date,sql;
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	if(oDateTime)
		sql=encodeURIComponent("select to_char(to_date('"+oDateTime+"','yyyy-mm-dd hh24:mi:ss')"+duringHours+",'yyyy-mm-dd hh24:mi:ss') from dual");
	else
		sql=encodeURIComponent("select to_char(sysdate"+duringHours+",'yyyy-mm-dd hh24:mi:ss') from dual");
	xmlhttp.Open("POST","/servlet/@Deprecated/ExecServlet?action=101&paramValue="+getAESEncode(sql),false);
	xmlhttp.send();
	if (isSuccess(xmlhttp))
	{
		var oRow = xmlhttp.responseXML.selectSingleNode("/root/rowSet");
		date=oRow.attributes[0].value;
	}
	return date;
}

function getListStore(sqlName,searchParam){
	var oStore=null;
	var oResult = ResultFactory.newResult(sqlName);
	oResult.async = false;
	oResult.onLoad = function(oXml)
	{
		var oTempArray = new Array();
		oTempArray[0]= ["","-无-"];
		var oRows=oXml.selectNodes("/root/rowSet");
		for(var i=1;i<=oRows.length;i++)
			oTempArray[i]= [oRows[i-1].childNodes[1].text,oRows[i-1].childNodes[0].text];
		
		oStore = new Ext.data.SimpleStore({
	        fields: ['value', 'text'],
	        data  : oTempArray
	    });
	}
	oResult.send(Result.FORCE_GET,searchParam);
	return oStore;
}

function drowSlider(num){
    var rec="";
    var nums=num.split(",");
    var countNum=parseInt(nums[1]);
    rec = "<div style='width:"+(bonGlobal.recWidth)+"'><b class='b1'></b><b class='b2 d1'></b><b class='b3 d1'></b><b class='b4 d1'></b>"+
          "<div class='b d1 k'><div style='background-color:blue;width:"+bonGlobal.recWidth*(parseInt(nums[0])/countNum)+";height:100%;'></div></div><b class='b4b d1'></b><b class='b3b d1'>"+
          "</b><b class='b2b d1'></b><b class='b1b'></b>"+
          "</div>"+
    "<div style='height:20px;'><span style='margin-left:"+(bonGlobal.recWidth*(parseInt(nums[0])/countNum)-10)
+"'>"+nums[0]+"</span><span style='margin-left:"+(bonGlobal.recWidth-bonGlobal.recWidth*(parseInt(nums[0])/countNum)-8)+";'>"+countNum+"</span></div>";

    return rec; 
}


function jsonEncode(jsonStr){
	var re1=/'/g;
	var re2=/"/g;
	return (jsonStr.replace(re1,"\\'")).replace(re2,'\\"');
}

function xmlDecode(str){
	return EncodeSpecialStrs(str, ["&amp;", "&gt;","&lt;", "&quot;"], ['&', '>', '<', '"']);
}


function showTrace(grid){
	var row = grid.getSelectionModel().getSelected();
	if(row){
		doWindow_open("../bon/sessionTrace.html?ciId="+Global.url.ciId+"&session_id="+row.get("SESSION_ID")+"&ability_name="+row.get("SERVICE_CONTEXT_ID")+"&source_region="+row.get("ORIGIN_PROVE_CODE")+"&source_address="+row.get("ORIGIN_NE_HOST")+"&dest_source="+row.get("DEST_NE_HOST"),1200,500);
		//doWindow_open("/workshop/form/index.jsp?callback=window.opener.callbackFn()&classId="+row.get("CLASS_ID")+"&dataSetId="+row.get("DATASET_ID")+"&requestId="+row.get("REQUEST_ID")+"&flowId="+getFlowId()+param,undefined,undefined,'_blank');
	}
}

function showContentDiv(cDiv,btnLink,overHeight,divType)
{   
    var oContent=document.getElementById(cDiv);
    var oBtnDiv=document.getElementById(btnLink);
    var oBtn =document.getElementById(btnLink+"_img");
    var oriHeight=oContent.offsetHeight;
    if(divType){
        if(oContent.offsetHeight>overHeight+30)
        { 
           oContent.style.height=overHeight+30-20;
           oBtnDiv.style.display="";  
        }else{
           oContent.style.height=overHeight+30;
        }
    }else{
	    if(oContent.offsetHeight>overHeight)
	    { 
	       oContent.style.height=overHeight-20;
	       oBtnDiv.style.display="";  
	    }else{
	       oContent.style.height=overHeight;
	    }
	 }
    oBtn.onclick = function(){
       if(oBtn.src.indexOf("/resource/image/ico/arrow_up.gif")>0)
       {
         if(divType){
           oContent.style.height=(overHeight+30-20)+"px";
         }else{
           oContent.style.height=(overHeight-20)+"px";
         } 
         oBtn.src="/resource/image/ico/arrow_down.gif";
       }
       else
       {
        oContent.style.height=oriHeight+"px";
        oBtn.src="/resource/image/ico/arrow_up.gif";
       }
    }
}

function showExpecialContentDiv(cDiv,btnLink,overHeight)
{   
    var oContent=document.getElementById(cDiv+"_body");
    var oBtnDiv=document.getElementById(btnLink);
    var oBtn =document.getElementById(btnLink+"_img");
    var oContent_child_1=document.getElementById(cDiv+"_body_1");
    var oContent_child_2=document.getElementById(cDiv+"_body_2");
    var oriHeight=oContent.offsetHeight;
    if(oContent.offsetHeight>overHeight+48)
    { 
       oContent.style.height=overHeight+48-20;
       oBtnDiv.style.display="";  
    }else{
       oContent.style.height=overHeight+48;
       oContent_child_2.style.height = oContent.offsetHeight-oContent_child_1.offsetHeight;
    }
    oBtn.onclick = function(){
       if(oBtn.src.indexOf("/resource/image/ico/arrow_up.gif")>0)
       {
       
         oContent.style.height=(overHeight+48-20)+"px";
         oBtn.src="/resource/image/ico/arrow_down.gif";
       }
       else
       {
        oContent.style.height=oriHeight+"px";
        oBtn.src="/resource/image/ico/arrow_up.gif";
       }
    }
}

function clickEvent(click_type,click_cfg){
   var sysInterfaceHtml='';
   switch(click_type){
     case 'chart':
     case 'grid':
        sysInterfaceHtml+=" style='cursor:pointer;' onclick='showFmwChartWin(\"\",\""+click_cfg+"\","+Global.ciId+")'";
        break;
    case 'clickLink':
        sysInterfaceHtml+=" style='cursor:pointer;' onclick='doWindow_open(\""+click_cfg+"&ciId="+Global.ciId+"\")'";
        break;
    case 'jsFunc':
        sysInterfaceHtml+=" style='cursor:pointer;' onclick='"+click_cfg+"'";
        break;
   }
   return sysInterfaceHtml;
}

function getEasyKpi(oXml,obj_div,obj_title,obj_width,overHeight,divType){
         if(obj_width==""){
            obj_width=200;
         }
         var rows =  oXml.selectNodes("/root/rowSet");
         var exchangeHtml = "";
         exchangeHtml+="<div class='b' style='margin-left:3px;width:"+(obj_width-6)+"px;background:#333'></div>";
         exchangeHtml+="<div class='b' style='margin-left:2px;width:"+(obj_width-4)+"px;'></div>";
         exchangeHtml+="<div class='b' style='margin-left:1px;width:"+(obj_width-2)+"px;'></div>";
         exchangeHtml +="<div class='a' style='width:"+obj_width+"px;'><div style='height:30px;line-height:30px;text-align:center;background-color:#E9E9E9;border: #BCBCBC 1px solid;border-top:0;'>"+obj_title+"</div>";
         exchangeHtml +="<div id='"+obj_div+"_body' style='background-color:#F4F4F4;border: #BCBCBC 1px solid;padding-top:5px;overflow:hidden;'>";
         for (var i=0;i<rows.length;i++){
           var remarkEle = rows[i].selectSingleNode("REMARK");
	       var  remark = '';
	       if(remarkEle) remark = remarkEle.text;
	       var title = '';
	       if(remark!='')
	             title = "title='"+remark+"'";
            exchangeHtml+="<div class='normalDiv' ";
            if(rows[i].selectSingleNode("CLICK_TYPE")){
                  exchangeHtml+=clickEvent(rows[i].selectSingleNode("CLICK_TYPE").text,rows[i].selectSingleNode("CLICK_CFG").text);
            }
            exchangeHtml+="><span class='titleText' "+title+" style='width:"+obj_width*3.5/5+"px;'>"+rows[i].selectSingleNode("KPI_NAME").text+"：</span><span style='vertical-align:middle'><img  height='20px' width='20px' src='/resource/image/jifbosswg/alarm_"+rows[i].selectSingleNode("ALARM_LEVEL").text+".png'/></span></div>";
         }
         exchangeHtml +="</div>";
         exchangeHtml+="<div id='"+obj_div+"_div' style='display:none;'><img style='float:right' height='20px' width='20px' id='"+obj_div+"_div_img' onclick='imgClick(this)' src='/resource/image/ico/arrow_down.gif' /></div>";
         exchangeHtml +="</div>";
         document.getElementById(obj_div).innerHTML=exchangeHtml;
         showContentDiv(obj_div+"_body",obj_div+"_div",overHeight,divType);
}

function getSystemInterface(oXml,obj_div,obj_title,obj_width,overHeight,divType){
    if(obj_width==""){
            obj_width=250;
    }
    var sysInterfaceHtml="";
    sysInterfaceHtml +="<div id='"+obj_div+"_body' style='width:"+obj_width+";background-color:#F4F4F4;border: #BCBCBC 1px solid;padding-top:5px;overflow:hidden;'>";  
    var rows =  oXml.selectNodes("/root/rowSet");
    for (var i=0;i<rows.length;i++){
       var remarkEle = rows[i].selectSingleNode("REMARK");
       var  remark = '';
       if(remarkEle) remark = remarkEle.text;
       var title = '';
       if(remark!='')
             title = "title='"+remark+"'";
       sysInterfaceHtml+="<div class='normalDiv'";
       if(rows[i].selectSingleNode("CLICK_TYPE")){
         sysInterfaceHtml+=clickEvent(rows[i].selectSingleNode("CLICK_TYPE").text,rows[i].selectSingleNode("CLICK_CFG").text);
       }
       sysInterfaceHtml+="><span style='vertical-align:middle;margin-left:15px;'><img  height='20px' width='20px' src='/resource/image/jifbosswg/system.png'/></span><span class='titleText' "+title+" style='width:160px;'>"+rows[i].selectSingleNode("KPI_NAME").text+"：</span><span style='vertical-align:middle'><img  height='20px' width='20px' src='/resource/image/jifbosswg/alarm_"+rows[i].selectSingleNode("ALARM_LEVEL").text+".png'/></span></div>";
    }
    sysInterfaceHtml+="</div>";
    sysInterfaceHtml+="<div id='"+obj_div+"_div' style='width:"+obj_width+";display:none;'><img style='float:right' height='20px' width='20px' id='"+obj_div+"_div_img' onclick='imgClick(this)' src='/resource/image/ico/arrow_down.gif' /></div>";
    sysInterfaceHtml+="</div>";
    document.getElementById(obj_div).innerHTML=sysInterfaceHtml;
    showContentDiv(obj_div+"_body",obj_div+"_div",overHeight,divType);
}

function getOtherKpi(oXml,obj_div,obj_title,obj_width,overHeight,divType){
    if(obj_width==""){
            obj_width=200;
    }
    var sysInterfaceHtml="";
    var rows =  oXml.selectNodes("/root/rowSet");
    sysInterfaceHtml +="<div id='"+obj_div+"_body' style='width:"+obj_width+";background-color:#F4F4F4;border: #BCBCBC 1px solid;padding-top:5px;overflow:hidden;'>";  
    for (var i=0;i<rows.length;i++){
       sysInterfaceHtml+="<div class='normalDiv'";
       if(rows[i].selectSingleNode("CLICK_TYPE")){
         sysInterfaceHtml+=clickEvent(rows[i].selectSingleNode("CLICK_TYPE").text,rows[i].selectSingleNode("CLICK_CFG").text);
       }
       var alarm_level = rows[i].selectSingleNode("ALARM_LEVEL").text; 
       var remarkEle = rows[i].selectSingleNode("REMARK");
       var  remark = '';
       if(remarkEle) remark = remarkEle.text;
       var title = '';
       if(remark!='')
             title = "title='"+remark+"'";
       if(alarm_level!='1'&&alarm_level!='2'&&alarm_level!='3'&&alarm_level!='4'){
         sysInterfaceHtml+="style='margin-top:5px;'><span class='titleText' "+title+" style='width:"+obj_width*3.5/5+"px;'>"+rows[i].selectSingleNode("KPI_NAME").text+"</span><span style='vertical-align:middle'></div>";
       }else{
         sysInterfaceHtml+="style='margin-top:5px;'><span class='titleText' "+title+" style='width:"+obj_width*3.5/5+"px;'>"+rows[i].selectSingleNode("KPI_NAME").text+"</span><span style='vertical-align:middle'><img  height='18px' width='18px' src='/resource/image/jifbosswg/alarm_"+rows[i].selectSingleNode("ALARM_LEVEL").text+".png'/></span></div>";
       }
    }
    sysInterfaceHtml+="</div>";
    sysInterfaceHtml+="<div id='"+obj_div+"_div' style='width:"+obj_width+";display:none;'><img style='float:right' height='20px' width='20px' id='"+obj_div+"_div_img' onclick='imgClick(this)' src='/resource/image/ico/arrow_down.gif' /></div>";
    sysInterfaceHtml+="</div>";
    document.getElementById(obj_div).innerHTML=sysInterfaceHtml;
    showContentDiv(obj_div+"_body",obj_div+"_div",overHeight,divType);
    
}

function getDataInfoKpi(oXml,obj_div,obj_title,obj_width,overHeight,divType){ 
         if(obj_width==""){
            obj_width=332;
         }      
         var rows =  oXml.selectNodes("/root/rowSet");
         var exchangeHtml = "";
         exchangeHtml+="<div class='b' style='margin-left:3px;width:"+(obj_width-6)+"px;background:#333'></div>";
         exchangeHtml+="<div class='b' style='margin-left:2px;width:"+(obj_width-4)+"px;'></div>";
         exchangeHtml+="<div class='b' style='margin-left:1px;width:"+(obj_width-2)+"px;'></div>";
         exchangeHtml +="<div class='a' style='width:"+obj_width+"px;'><div style='height:30px;line-height:30px;text-align:center;background-color:#E9E9E9;border: #BCBCBC 1px solid;border-top:0;'>"+obj_title+"</div>";
         exchangeHtml +="<div id='"+obj_div+"_body' style='background-color:#F4F4F4;border: #BCBCBC 1px solid;padding-top:5px;overflow:hidden;'>";
         for (var i=0;i<rows.length;i++){
           var remarkEle1 = rows[i].selectSingleNode("REMARK1");
           var  remark1 = '';
           if(remarkEle1) remark1 = remarkEle1.text;
           var title1 = '';
           if(remark1!='')
                 title1 = "title='"+remark1+"'";
           
           var remarkEle2 = rows[i].selectSingleNode("REMARK2");
           var  remark2 = '';
           if(remarkEle2) remark2 = remarkEle2.text;
           var title2 = '';
           if(remark2!='')
                 title2 = "title='"+remark2+"'";
                 
            exchangeHtml+="<div";
            if(rows[i].selectSingleNode("CLICK_TYPE")){
                exchangeHtml+=clickEvent(rows[i].selectSingleNode("CLICK_TYPE").text,rows[i].selectSingleNode("CLICK_CFG").text);
            }
            exchangeHtml+="><div style='width:"+(obj_width-9)+"px;margin-top:2px;margin-left:4px;margin-right:3px;height:18px;line-height:18px;'><span style='float:left;' "+title1+" >"+rows[i].selectSingleNode("KPI_NAME").text+"：</span>";
            exchangeHtml+="<span style='float:right;'> "+rows[i].selectSingleNode("CURRENT_NUM").text+"<img style='vertical-align:text-bottom;' height='18px' width='18px' src='/resource/image/jifbosswg/alarm_"+rows[i].selectSingleNode("ALARM_LEVEL").text+".png'/></span></div>";
            exchangeHtml+="<div style='margin-left:4px;margin-right:3px;'><span style='background-color:white;width:"+(obj_width-9)+";height:2px;border:#BCBCBC 1px solid;'><span style='width:"+setColorLength(rows[i].selectSingleNode("CURRENT_NUM").text,rows[i].selectSingleNode("TOTAL_NUM").text,(obj_width-9))+";background-color:"+setBackGroundColor(rows[i].selectSingleNode('ALARM_LEVEL').text)+";'></span></span></div>";
            exchangeHtml+="<div style='margin-left:4px;margin-right:3px;'><span style='float:right;'>"+rows[i].selectSingleNode("TOTAL_NUM").text+"</span>0<span style='width:"+obj_width/2+"px;text-align:right;' "+title2+" >"+rows[i].selectSingleNode("UNIT_NAME").text+"</span></div></div>";
         }
         exchangeHtml +="</div>";
         exchangeHtml+="<div id='"+obj_div+"_div' style='display:none;'><img style='float:right' height='20px' width='20px' id='"+obj_div+"_div_img' onclick='imgClick(this)' src='/resource/image/ico/arrow_down.gif' /></div>";
          exchangeHtml +="</div>";
         document.getElementById(obj_div).innerHTML=exchangeHtml;
         showContentDiv(obj_div+"_body",obj_div+"_div",overHeight,divType);
}

function getWordXml(oXml,obj_div,obj_title,obj_width,overHeight,divType){
     if(obj_width==""){
          obj_width=200;
     }
     var sysInterfaceHtml="";
     sysInterfaceHtml +="<div id='"+obj_div+"_body' style='width:"+obj_width+";background-color:#F4F4F4;border: #BCBCBC 1px solid;padding-top:5px;overflow:hidden;'>";  
     var rows =  oXml.selectNodes("/root/rowSet");
     for (var i=0;i<rows.length;i++){
       var remarkEle = rows[i].selectSingleNode("REMARK");
       var  remark = '';
       if(remarkEle) remark = remarkEle.text;
       var title = '';
       if(remark!='')
             title = "title='"+remark+"'"; 
       sysInterfaceHtml+="<div class='normalDiv' ";
       if(rows[i].selectSingleNode("CLICK_TYPE")){
         sysInterfaceHtml+=clickEvent(rows[i].selectSingleNode("CLICK_TYPE").text,rows[i].selectSingleNode("CLICK_CFG").text);
       }
       sysInterfaceHtml+="><span class='titleText' style='margin-left:15px;width:"+obj_width*3.5/5+"px;' "+title+" >"+rows[i].selectSingleNode("KPI_NAME").text+"：</span>"+rows[i].selectSingleNode("ALARM_LEVEL").text+"</div>";
     }
     sysInterfaceHtml+="</div>";
     sysInterfaceHtml+="<div id='"+obj_div+"_div' style='width:"+obj_width+";display:none;'><img style='float:right' height='20px' width='20px' id='"+obj_div+"_div_img' onclick='imgClick(this)' src='/resource/image/ico/arrow_down.gif' /></div>";
     sysInterfaceHtml+="</div>";
     document.getElementById(obj_div).innerHTML=sysInterfaceHtml;
     showContentDiv(obj_div+"_body",obj_div+"_div",overHeight,divType);
}

function getSummaryXml(oXml,obj_div,obj_title,obj_width,overHeight){
        if(obj_width==""){
          obj_width=200;
        }
        var nomalHtml="<div id='"+obj_div+"_body' style='width:"+obj_width+";'><div style='height:39px;line-height:39px;background-color:#F2F2F2;border-top:#BCBCBC 1px solid;border-right:#BCBCBC 1px solid;border-left:#BCBCBC 1px solid;text-align:center;width:100%;margin-top:0px;' id='"+obj_div+"_body_1'><font style='font-size:19px;font-weight:bold;'>告警情况概述</font></div>";
        var rows =  oXml.selectNodes("/root/rowSet");
         nomalHtml+="<div style='width:100%;background-color:white;border:#BCBCBC 1px solid;' id='"+obj_div+"_body_2'>";
        for(var i=0;rows&&i<rows.length;i++){
           nomalHtml+="<div class='normalDiv'><img  height='10px' width='10px' src='/resource/image/jifbosswg/dot.png'/>&nbsp;&nbsp;"+rows[i].selectSingleNode("KPI_NAME").text+"</div>";
        }    
        nomalHtml+="</div>";
        nomalHtml+="</div>";
        nomalHtml+="<div id='"+obj_div+"_div' style='display:none;'><img style='float:right' height='20px' width='20px' id='"+obj_div+"_div_img' onclick='imgClick(this)' src='/resource/image/ico/arrow_down.gif' /></div>";
        nomalHtml+="</div>";
        document.getElementById(obj_div).innerHTML=nomalHtml;
        showExpecialContentDiv(obj_div,obj_div+"_div",overHeight);
}

function getIframeXml(obj_div,obj_height){
    if(obj_height==""){
          obj_height=280;
    }
    var exchangeHtml ="<div style='height:"+obj_height+";' id='iframe_1'>";
    exchangeHtml +="</div>";
    document.getElementById(obj_div).innerHTML=exchangeHtml;
}
function setColorLength(len,total,width){
    var temp1= parseFloat(len);
    var temp2 = parseFloat(total);
    return (temp1/temp2)*parseFloat(width); 
    
}
function setBackGroundColor(value){
    
    var temp="";
    if(value=="1"){
        temp ="red";
    }else if(value=="2"){
        
        temp= "orange";
        
    }else if(value=="3"){
        temp ="yellow";
    }else if(value=="4"){
        temp ="green";
    }else if(value=='0'){
        temp="green";
    }
    return temp;
    
}


function setSafeAlarmBackground(record, rowIndex, rowParams, store) {
       var v=record.get('ALARM_LEVEL');
    
      //获取行记录的ALARM_LEVEL字段的值,然后根据不同的值返回在CSS定义的不同样式     
      switch(v){
        case 1:
            return 'x-grid-back-red' ;
            break;
        case 2:  
            return 'x-grid-back-orange' ;
            break; 
        case 3:  
            return 'x-grid-back-yellow' ;
            break; 
        case 4:  
            return 'x-grid-back-green' ;
            break;  
      }
}



function imgClick(obj){
       var oContent=document.getElementById(obj.id.substring(0,obj.id.indexOf("_div_img"))+"_body");
       if(obj.src.indexOf("/resource/image/ico/arrow_up.gif")>0)
       {
        oContent.style.height=minHeight-20+"px"; 
        obj.src="/resource/image/ico/arrow_down.gif";
       }
       else
       {
        oContent.style.height=oContent.offsetHeight+"px";
        obj.src="/resource/image/ico/arrow_up.gif";
       }
}

//获取当前省份的region_id编码（SR专用）
function getCurrentRegionId(){
    var date,sql;
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    sql=encodeURIComponent("select code region_id,mean region_name from codelist where remark='1' and code_type='SR_REGION_ID' and rownum=1");
    xmlhttp.Open("POST","/servlet/@Deprecated/ExecServlet?action=101&paramValue="+getAESEncode(sql),false);
    xmlhttp.send();
    if (isSuccess(xmlhttp))
    {
        var region ={};
        region.region_id =  xmlhttp.responseXML.selectSingleNode("/root/rowSet").attributes[0].value;
        region.region_name = xmlhttp.responseXML.selectSingleNode("/root/rowSet/REGION_NAME").text;
    }
    return region;
}

//获取相邻一个月的第一天
function getNeighborMonthFirstDay(oDateTime,durings){
    var date,sql;
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    if(oDateTime)
        sql=encodeURIComponent("SELECT to_char(trunc(add_months(to_date('"+oDateTime+"','yyyy-mm-dd hh24:mi:ss'), "+durings+"),'month') ,'yyyy-mm-dd')||' 00:00:00'  FROM dual");
    else
        sql=encodeURIComponent("SELECT to_char(trunc(add_months(SYSDATE,"+durings+"),'month'),'yyyy-mm-dd')||' 00:00:00'  FROM dual");
    xmlhttp.Open("POST","/servlet/@Deprecated/ExecServlet?action=101&paramValue="+getAESEncode(sql),false);
    xmlhttp.send();
    if (isSuccess(xmlhttp))
    {
        var oRow = xmlhttp.responseXML.selectSingleNode("/root/rowSet");
        date=oRow.attributes[0].value;
    }
    return date;
}

//获取相邻一个月的最后一天
function getNeighborMonthLastDay(oDateTime,durings){
    var date,sql;
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    if(oDateTime)
        sql=encodeURIComponent("SELECT to_char(last_day(add_months(to_date('"+oDateTime+"','yyyy-mm-dd hh24:mi:ss'), "+durings+")),'yyyy-mm-dd')||' 23:59:59'  FROM dual");
    else
        sql=encodeURIComponent("SELECT to_char(last_day(add_months(SYSDATE, "+durings+")),'yyyy-mm-dd')||' 23:59:59'  FROM dual");
    xmlhttp.Open("POST","/servlet/@Deprecated/ExecServlet?action=101&paramValue="+getAESEncode(sql),false);
    xmlhttp.send();
    if (isSuccess(xmlhttp))
    {
        var oRow = xmlhttp.responseXML.selectSingleNode("/root/rowSet");
        date=oRow.attributes[0].value;
    }
    return date;
}
//获相邻一天的开始时刻
function getNeighborDayBegin(oDateTime,durings){
    var date,sql;
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    if(oDateTime)
        sql=encodeURIComponent("select to_char(to_date('"+oDateTime+"','yyyy-mm-dd hh24:mi:ss')"+durings+",'yyyy-mm-dd')||' 00:00:00' from dual");
    else
        sql=encodeURIComponent("select to_char(sysdate"+durings+",'yyyy-mm-dd')||' 00:00:00' from dual");
    xmlhttp.Open("POST","/servlet/@Deprecated/ExecServlet?action=101&paramValue="+getAESEncode(sql),false);
    xmlhttp.send();
    if (isSuccess(xmlhttp))
    {
        var oRow = xmlhttp.responseXML.selectSingleNode("/root/rowSet");
        date=oRow.attributes[0].value;
    }
    return date;
}

//获取相邻一天的最后时刻
function getNeighborDayLast(oDateTime,durings){
    var date,sql;
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    if(oDateTime)
        sql="select to_char(to_date('"+oDateTime+"','yyyy-mm-dd hh24:mi:ss')"+durings+",'yyyy-mm-dd')||' 23:59:59' from dual";
    else
        sql="select to_char(sysdate"+durings+",'yyyy-mm-dd')||' 23:59:59' from dual";
    xmlhttp.Open("POST","/servlet/@Deprecated/ExecServlet?action=101&paramValue="+getAESEncode(encodeURIComponent(sql)),false);
    xmlhttp.send();
    if (isSuccess(xmlhttp))
    {
        var oRow = xmlhttp.responseXML.selectSingleNode("/root/rowSet");
        date=oRow.attributes[0].value;
    }
    return date;
}

//获取当前月第一天
function getCurrentMonthFirstDay(){
    var date,sql;
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    sql="select to_char(trunc(sysdate,'mm'),'yyyy-mm-dd')||' 00:00:00' from dual";
    xmlhttp.Open("POST","/servlet/@Deprecated/ExecServlet?action=101&paramValue="+getAESEncode(encodeURIComponent(sql)),false);
    xmlhttp.send();
    if (isSuccess(xmlhttp))
    {
        var oRow = xmlhttp.responseXML.selectSingleNode("/root/rowSet");
        date=oRow.attributes[0].value;
    }
    return date;
}

function changeCycle(i,type,callback,obj){
   obj.className='flatButDown';
   if(bonGlobal.cycles[i]&&bonGlobal.cycles[i]!=obj){bonGlobal.cycles[i].className='flatBut';}
  // obj.style.color='blue';
   bonGlobal.cycles[i] = obj;
   switch(type){
      case 't':
      case 'T':
           document.getElementById("begin_time_"+i).innerHTML="<font style='font-weight:bold;'>"+getModifyDateTime("-6/24")+"</font>";
           document.getElementById("end_time_"+i).innerHTML="<font style='font-weight:bold;'>"+getModifyDateTime("+0")+"</font>"; 
           document.getElementById("pre_cycle_"+i).innerHTML="&lt;前6小时";         
           document.getElementById("new_cycle_"+i).innerHTML="最新6小时";
           document.getElementById("last_cycle_"+i).innerHTML="后6小时&gt;";            
           document.getElementById("pre_cycle_"+i).onclick=function(){ changeResult("t",i,"-6/24",callback,document.getElementById("pre_cycle_"+i));}
           document.getElementById("new_cycle_"+i).onclick=function (){ getLastResult("t",i,callback,document.getElementById("new_cycle_"+i));}
           document.getElementById("last_cycle_"+i).onclick=function (){changeResult("t",i,"+6/24",callback,document.getElementById("last_cycle_"+i));}         
           break;
      case 'd':
      case 'D':
           document.getElementById("begin_time_"+i).innerHTML= "<font style='font-weight:bold;'>"+getCurServerDateTime(false)+" 00:00:00"+"</font>";
           document.getElementById("end_time_"+i).innerHTML= "<font style='font-weight:bold;'>"+getCurServerDateTime(true)+"</font>";
           document.getElementById("pre_cycle_"+i).innerHTML="&lt;前1天";
           document.getElementById("new_cycle_"+i).innerHTML="最新1天";
           document.getElementById("last_cycle_"+i).innerHTML="后1天&gt;";
           document.getElementById("pre_cycle_"+i).onclick=function(){ changeResult("d",i,"-1",callback,document.getElementById("pre_cycle_"+i));}
           document.getElementById("new_cycle_"+i).onclick=function (){ getLastResult("d",i,callback,document.getElementById("new_cycle_"+i));}
           document.getElementById("last_cycle_"+i).onclick=function (){changeResult("d",i,"+1",callback,document.getElementById("last_cycle_"+i));}     
           break;
      case 'm':
      case 'M':
           document.getElementById("begin_time_"+i).innerHTML = "<font style='font-weight:bold;'>"+getCurrentMonthFirstDay()+"</font>";
           document.getElementById("end_time_"+i).innerHTML= "<font style='font-weight:bold;'>"+getCurServerDateTime(true)+"</font>";
           document.getElementById("pre_cycle_"+i).innerHTML="&lt;前1个月";
           document.getElementById("new_cycle_"+i).innerHTML="最新1个月";
           document.getElementById("last_cycle_"+i).innerHTML="后1个月&gt;";
           document.getElementById("pre_cycle_"+i).onclick=function(){ changeResult("m",i,"-1",callback,document.getElementById("pre_cycle_"+i));}
           document.getElementById("new_cycle_"+i).onclick=function (){ getLastResult("m",i,callback,document.getElementById("new_cycle_"+i));}
           document.getElementById("last_cycle_"+i).onclick=function (){changeResult("m",i,"+1",callback,document.getElementById("last_cycle_"+i));}     
           break;
     default: 
           document.getElementById("begin_time_"+i).innerHTML="<font style='font-weight:bold;'>"+getModifyDateTime("-6/24")+"</font>";
           document.getElementById("end_time_"+i).innerHTML="<font style='font-weight:bold;'>"+getModifyDateTime("+0")+"</font>"; 
           document.getElementById("pre_cycle_"+i).innerHTML="&lt;前6小时";         
           document.getElementById("new_cycle_"+i).innerHTML="最新6小时";
           document.getElementById("last_cycle_"+i).innerHTML="后6小时&gt;";            
           document.getElementById("pre_cycle_"+i).onclick=function(){ changeResult("t",i,"-6/24",callback,document.getElementById("pre_cycle_"+i));}
           document.getElementById("new_cycle_"+i).onclick=function (){ getLastResult("t",i,callback,document.getElementById("new_cycle_"+i));}
           document.getElementById("last_cycle_"+i).onclick=function (){changeResult("t",i,"+6/24",callback,document.getElementById("last_cycle_"+i));}         
           break;
  }
  document.getElementById("last_begin_time_"+i).value=document.getElementById("begin_time_"+i).innerText;
  document.getElementById("last_end_time_"+i).value=document.getElementById("end_time_"+i).innerText;
  callback(document.getElementById("last_begin_time_"+i).value,document.getElementById("last_end_time_"+i).value);
}

function getLastResult(type,i,callback,obj){
   obj.className='flatButDown';
   if(bonGlobal.cycles[i]&&bonGlobal.cycles[i]!=obj){bonGlobal.cycles[i].className='flatBut';}
   //obj.style.color='blue';
   bonGlobal.cycles[i] = obj;
  switch(type){
      case 't':
      case 'T':
           document.getElementById("begin_time_"+i).innerHTML="<font style='font-weight:bold;'>"+getModifyDateTime("-6/24")+"</font>";
           document.getElementById("end_time_"+i).innerHTML="<font style='font-weight:bold;'>"+getModifyDateTime("+0")+"</font>"; 
           break;
      case 'd':
      case 'D':
           document.getElementById("begin_time_"+i).innerHTML= "<font style='font-weight:bold;'>"+getCurServerDateTime(false)+" 00:00:00"+"</font>";
           document.getElementById("end_time_"+i).innerHTML= "<font style='font-weight:bold;'>"+getCurServerDateTime(true)+"</font>";
           break;
      case 'm':
      case 'M':
           document.getElementById("begin_time_"+i).innerHTML = "<font style='font-weight:bold;'>"+getCurrentMonthFirstDay()+"</font>";
           document.getElementById("end_time_"+i).innerHTML= "<font style='font-weight:bold;'>"+getCurServerDateTime(true)+"</font>";
           break;
  }
  document.getElementById("last_begin_time_"+i).value=document.getElementById("begin_time_"+i).innerText;
  document.getElementById("last_end_time_"+i).value=document.getElementById("end_time_"+i).innerText;
  callback(document.getElementById("last_begin_time_"+i).value,document.getElementById("last_end_time_"+i).value);
}

function timeOver(obj,i){
  if(bonGlobal.cycles[i]&&bonGlobal.cycles[i]==obj) return;
  obj.className='flatButOver';
}

function timeOut(obj,i){
  if(bonGlobal.cycles[i]&&bonGlobal.cycles[i]==obj) return;
  obj.className='flatBut';
}

function changeResult(type,i,durings,callback,obj){
   obj.className='flatButDown';
   if(bonGlobal.cycles[i]&&bonGlobal.cycles[i]!=obj){ 
          bonGlobal.cycles[i].className='flatBut';
   }
   //obj.style.color='blue';
   bonGlobal.cycles[i] = obj;
   switch(type){
      case 't':
      case 'T':
           document.getElementById("begin_time_"+i).innerHTML="<font style='font-weight:bold;'>"+getModifyDateTime(durings, document.getElementById("begin_time_"+i).innerText)+"</font>";
           document.getElementById("end_time_"+i).innerHTML="<font style='font-weight:bold;'>"+getModifyDateTime(durings,document.getElementById("end_time_"+i).innerText)+"</font>";         
           break;
      case 'd':
      case 'D':
           document.getElementById("begin_time_"+i).innerHTML= "<font style='font-weight:bold;'>"+getNeighborDayBegin(document.getElementById("begin_time_"+i).innerText,durings)+"</font>";
           document.getElementById("end_time_"+i).innerHTML = "<font style='font-weight:bold;'>"+getNeighborDayLast(document.getElementById("end_time_"+i).innerText,durings)+"</font>";
           break;
      case 'm':
      case 'M':
	       document.getElementById("begin_time_"+i).innerHTML= "<font style='font-weight:bold;'>"+getNeighborMonthFirstDay(document.getElementById("begin_time_"+i).innerText,durings)+"</font>";
	       document.getElementById("end_time_"+i).innerHTML="<font style='font-weight:bold;'>"+getNeighborMonthLastDay(document.getElementById("end_time_"+i).innerText,durings)+"</font>";
           break;
  }  
  document.getElementById("last_begin_time_"+i).value=document.getElementById("begin_time_"+i).innerText;
  document.getElementById("last_end_time_"+i).value=document.getElementById("end_time_"+i).innerText;
  callback(document.getElementById("last_begin_time_"+i).value,document.getElementById("last_end_time_"+i).value);
}

function showSearchWin(obj,i){
    //if(bonGlobal.cycleObject){bonGlobal.cycleObject.className='flatBut';}
    var ele = document.getElementById("searchWin_"+i);
    ele.style.display="";
    ele.style.zIndex=150;
    ele.style.left = ele.parentElement.scrollLeft+obj.getBoundingClientRect().left-210;
    ele.style.top =  ele.parentElement.scrollTop+obj.getBoundingClientRect().top+30;
}

function selfDefineSearch(callback,i){
     document.getElementById("begin_time_"+i).innerHTML= "<font style='font-weight:bold;'>"+document.getElementById("last_begin_time_"+i).value+"</font>";
     document.getElementById("end_time_"+i).innerHTML= "<font style='font-weight:bold;'>"+document.getElementById("last_end_time_"+i).value+"</font>";
     document.getElementById('searchWin_'+i).style.display="none";
     callback(document.getElementById("last_begin_time_"+i).value,document.getElementById("last_end_time_"+i).value);
}

function hideSearchWin(i){
     document.getElementById("searchWin_"+i).style.display="none";
}

//获取界面按钮,
//obj_div放置位置，callback回调函数，menuIds周期显示类型，timeType周期类型，i按钮id(0,1,2..)，noShowTime是否显示查询时间
function getPageMenu(obj_div,callback,menuIds,timeType,i,noShowTime){
  if(!i){
     i=0;
  }
  var bodyHtml="<div id='searchWin_"+i+"' style='position:absolute;display:none;'>";
  bodyHtml+="<div style='margin-left:3px;height:1px;overflow:hidden;border-left:1px #4068AA solid ;background-color:#4068AA;border-right:1px #4068AA solid;width:269px;'></div>";
  bodyHtml+="<div style='margin-left:2px;height:1px;overflow:hidden;border-left:1px #4068AA solid ;background-color:#DBE5FA;border-right:1px #4068AA solid;width:271px;'></div>";
  bodyHtml+="<div style='margin-left:1px;height:1px;overflow:hidden;border-left:1px #4068AA solid ;background-color:#DBE5FA;border-right:1px #4068AA solid;width:273px;'></div>";
  bodyHtml+="<div class='searchWin' style='width:275px;border-left:1px #4068AA solid ;border-right:1px #4068AA solid ;' >";
  bodyHtml+="<table style='width:100%'><tr><td align='right'>查询时间：从</td><td><input id='last_begin_time_"+i+"' type='text' style='width:185px;' onFocus=\"WdatePicker({isShowClear:true,dateFmt:'yyyy-MM-dd HH:mm:ss', readOnly:true})\" /></td></tr>"+
               "<tr><td align='right'>到</td><td><input id='last_end_time_"+i+"' type='text' style='width:185px;' onFocus=\"WdatePicker({isShowClear:true,dateFmt:'yyyy-MM-dd HH:mm:ss', readOnly:true})\"/></td></tr>"+
               " <tr><td></td><td><input type='button' onclick='selfDefineSearch("+callback+","+i+")' value='查&nbsp;询'/><input  type='button' value='取&nbsp;消' "+
               " onclick='hideSearchWin("+i+")' style='margin-left:20px;'/></td></tr></table>";
  bodyHtml+="</div>";
  bodyHtml+="<div style='margin-left:1px;height:1px;overflow:hidden;border-left:1px #4068AA solid ;background-color:#DBE5FA;border-right:1px #4068AA solid;width:273px;'></div>";
  bodyHtml+="<div style='margin-left:2px;height:1px;overflow:hidden;border-left:1px #4068AA solid ;background-color:#DBE5FA;border-right:1px #4068AA solid;width:271px;'></div>";
  bodyHtml+="<div style='margin-left:3px;height:1px;overflow:hidden;border-left:1px #4068AA solid ;background-color:#4068AA;border-right:1px #4068AA solid;width:269px;'></div>";
  bodyHtml+="</div>";
  document.body.insertAdjacentHTML('afterBegin',bodyHtml);
  var menuTypeHtml='';
  menuTypeHtml+="<div style='float:left;margin-left:5px;line-height:28px;height:28px;margin-top:5px;";
  if(noShowTime){
   menuTypeHtml+="display:none";
  }
  menuTypeHtml+="'>从&nbsp;<span id='begin_time_"+i+"' style='text-decoration:underline;'></span>&nbsp;到&nbsp;<span id='end_time_"+i+"'  style='text-decoration:underline;'></span></div>";  
  
  menuTypeHtml +="<div id='timeDiv_"+i+"'";
  if(!menuIds||(menuIds.indexOf("t")<0)){
      menuTypeHtml +=" style='display:none;'";
  }
  menuTypeHtml +=" onMouseOver=\"timeOver(this,"+i+")\"  onMouseOut=\"timeOut(this,"+i+")\"   onclick='changeCycle("+i+",\"t\","+callback+",this)' class='flatBut'>6小时</div>";    
  menuTypeHtml +="<div id='dayDiv_"+i+"'";
  if(!menuIds||(menuIds.indexOf("d")<0)){
      menuTypeHtml +=" style='display:none;'";
  }
  menuTypeHtml +=" onMouseOver=\"timeOver(this,"+i+")\"  onMouseOut=\"timeOut(this,"+i+")\"  onclick='changeCycle("+i+",\"d\","+callback+",this)' class='flatBut' >1天</div>"; 
  
  menuTypeHtml +="<div id='monthDiv_"+i+"'";
  if(!menuIds||(menuIds.indexOf("m")<0)){
      menuTypeHtml +=" style='display:none;'";
  }
  menuTypeHtml +=" onMouseOver=\"timeOver(this,"+i+")\"  onMouseOut=\"timeOut(this,"+i+")\" onclick='changeCycle("+i+",\"m\","+callback+",this)' class='flatBut'>1个月</div>";
  var oriObject=null;
  switch(timeType){
      case 't':
      case 'T':
           oriObject= "timeDiv_"+i;
           menuTypeHtml +="<div onMouseOver=\"timeOver(this,"+i+")\"  onMouseOut=\"timeOut(this,"+i+")\"  id='pre_cycle_"+i+"' class='flatBut' ><前6小时</div>";
           menuTypeHtml +="<div onMouseOver=\"timeOver(this,"+i+")\"  onMouseOut=\"timeOut(this,"+i+")\"  id='new_cycle_"+i+"' class='flatBut' >最新6小时</div>";
           menuTypeHtml +="<div onMouseOver=\"timeOver(this,"+i+")\"  onMouseOut=\"timeOut(this,"+i+")\"  id='last_cycle_"+i+"' class='flatBut' >后6小时></div>";
           menuTypeHtml +="<div onclick='showSearchWin(this,"+i+")' class='flatBut'>自定义查询</div>";
           break;
      case 'd':
      case 'D':
           oriObject= "dayDiv_"+i;
           menuTypeHtml +="<div onMouseOver=\"timeOver(this,"+i+")\"  onMouseOut=\"timeOut(this,"+i+")\"  id='pre_cycle_"+i+"' class='flatBut' ><前1天</div>";
           menuTypeHtml +="<div onMouseOver=\"timeOver(this,"+i+")\"  onMouseOut=\"timeOut(this,"+i+")\"  id='new_cycle_"+i+"' class='flatBut' >最新1天</div>";
           menuTypeHtml +="<div onMouseOver=\"timeOver(this,"+i+")\"  onMouseOut=\"timeOut(this,"+i+")\"  id='last_cycle_"+i+"' class='flatBut'>后1天></div>";
           menuTypeHtml +="<div onclick='showSearchWin(this,"+i+")' class='flatBut'>自定义查询</div>";  
           break;
      case 'm':
      case 'M':
           oriObject= "monthDiv_"+i;
           menuTypeHtml +="<div onMouseOver=\"timeOver(this,"+i+")\"  onMouseOut=\"timeOut(this,"+i+")\"  id='pre_cycle_"+i+"' class='flatBut'><前1个月</div>";
           menuTypeHtml +="<div onMouseOver=\"timeOver(this,"+i+")\"  onMouseOut=\"timeOut(this,"+i+")\"  id='new_cycle_"+i+"' class='flatBut' >最新1个月</div>";
           menuTypeHtml +="<div onMouseOver=\"timeOver(this,"+i+")\"  onMouseOut=\"timeOut(this,"+i+")\"  id='last_cycle_"+i+"' class='flatBut'>后1个月></div>";
           menuTypeHtml +="<div onclick='showSearchWin(this,"+i+")' class='flatBut'>自定义查询</div>";    
           break;
      default:
           oriObject= "timeDiv_"+i;
           menuTypeHtml +="<div onMouseOver=\"timeOver(this,"+i+")\"  onMouseOut=\"timeOut(this,"+i+")\"  id='pre_cycle_"+i+"' class='flatBut'><前6小时</div>";
           menuTypeHtml +="<div onMouseOver=\"timeOver(this,"+i+")\"  onMouseOut=\"timeOut(this,"+i+")\"  id='new_cycle_"+i+"' class='flatBut'>最新6小时</div>";
           menuTypeHtml +="<div onMouseOver=\"timeOver(this,"+i+")\"  onMouseOut=\"timeOut(this,"+i+")\"  id='last_cycle_"+i+"' class='flatBut'>后6小时></div>";
           menuTypeHtml +="<div onclick='showSearchWin(this,"+i+")' class='flatBut'>自定义查询</div>";     
           break;
  } 
  document.getElementById(obj_div).innerHTML = menuTypeHtml;
  document.getElementById(oriObject).click();
 // changeCycle(i,timeType,callback,document.getElementById(oriObject));
}

// 创建下拉框
function createSelect(url, obj, blank) {
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.Open("get", url, false);
    xmlhttp.send();
    if (!isSuccess(xmlhttp))
        return
    var dXML = new ActiveXObject("Microsoft.XMLDOM");
    dXML.load(xmlhttp.responseXML);
    obj.length = 0;
    var element = dXML.selectSingleNode("/root/rowSet");
    if (blank == null || blank == "") {
        obj.add(new Option("无", ""));
    }
    while (element != null) {
        var text = element.selectSingleNode("TEXT").text;
        var val = element.selectSingleNode("VALUE").text;
        var objOption = new Option(text, val);
        obj.add(objOption);
        element = element.nextSibling;
    }
}

function getIFrameDOM(id){
    return document.getElementById(id).contentWindow || document.getElementById(id).contentDocument;
}



//duringDays距离当前时间多少天的天数，可正可负，没有的话获取当前时间,oDate没值的话表示当前时间
function getModifyDate(duringDays,oDate){
    var date,sql;
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    if(oDate)
        sql="select to_char(to_date('"+oDate+"','yyyy-mm-dd')"+duringDays+",'yyyy-mm-dd') from dual";
    else
        sql="select to_char(sysdate"+duringDays+",'yyyy-mm-dd') from dual";
    xmlhttp.Open("POST","/servlet/@Deprecated/ExecServlet?action=101&paramValue="+getAESEncode(encodeURIComponent(sql)),false);
    xmlhttp.send();
    if (isSuccess(xmlhttp))
    {
        var oRow = xmlhttp.responseXML.selectSingleNode("/root/rowSet");
        date=oRow.attributes[0].value;
    }
    return date;
}


function showAlarmInfo(grid){
    var row = grid.getSelectionModel().getSelected();
    if(row){
        doWindow_open("/workshop/alarmManage/viewAlarmInfo.htm?alarmId="+row.get("NE_ALARM_LIST_ID"));
    }
}

//获取控制命令参数
 function getControlParam(controlId,insId){
    var sql;
    var retJson='{';
    var retJsonContent='';
    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    sql="select t.param_name,decode(t.comp_id,2,(select to_CHAR(sysdate,'yyyymmdd') from dual),d.param_value) param_value from CI_CTRL_COL_PARAM t,CI_CTRL_COL_PARAM_INSTANCE d,CI_CTRL_INSPECT a where t.param_id=d.param_id and t.ci_ctrl_col_id="+controlId+" and d.inspect_id=a.inspect_id and a.instance_id="+insId;
    xmlhttp.Open("POST","/servlet/@Deprecated/ExecServlet?action=101&paramValue="+getAESEncode(encodeURIComponent(sql)),false);
    xmlhttp.send();
    if (isSuccess(xmlhttp))
    {
        var rows = xmlhttp.responseXML.selectNodes("/root/rowSet");
        for(var i=0;rows&&i<rows.length;i++){
            var param_name = rows[i].attributes[0].value.toUpperCase();
            var param_value = rows[i].selectSingleNode("PARAM_VALUE").text;
            retJsonContent+='"'+param_name+'":"'+param_value+'",';
        }
        if(retJsonContent!=''){
           retJsonContent = retJsonContent.substring(0,retJsonContent.length-1);
        }
    }
    if(retJsonContent!='')
       retJson+=retJsonContent+'}';
    else 
       retJson+='"NE_HOST":"all"}';
    return retJson;
 }

            