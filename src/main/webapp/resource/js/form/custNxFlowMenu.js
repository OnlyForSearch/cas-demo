//判断保存按钮是否置灰
function saveButtonCanEdit(){ 
   if(isView()) return false;
   var current_staff_id = ','+formContext.GLOBAL_VAR.STAFF_ID+',';
    //宁夏需求分析流程，当前登录人为需求分析环节的处理人时，就能修改需求分析的内容
   if (formContext.FLOW.FLOW_MOD==12043 && formContext.GLOBAL_VAR.STAFF_ID==26 || formContext.GLOBAL_VAR.STAFF_ID==753){
   	return true;
   }else if(formContext.TABLE.CUST_NX_ANALY){
       var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
       var sql=encodeURIComponent("select strcat(person) from v_tache d ,tache_model h where d.flow_id="+formContext.FLOW.FLOW_ID+
                   " and  h.tch_num='nx_require_13834' and h.tch_mod = d.tch_mod");
       sendRequest.Open("POST","/servlet/@Deprecated/ExecServlet?action=101&paramValue="+getAESEncode(sql),false);
       sendRequest.send();
       if (sendRequest.readyState == 4 && sendRequest.status == 200) {
	            var canModifyStaff =  sendRequest.responseXML.selectSingleNode("/root/rowSet").attributes[0].value;  
	            canModifyStaff = ","+canModifyStaff+",";
	            if(canModifyStaff&&canModifyStaff.indexOf(current_staff_id)>-1){
	                return true;
	            }
       }
       return false;
   }
   return false;         
}

//需求单打印是否置灰
function canAnalyPrint(){
 //宁夏需求分析流程
 if(formContext.FLOW.FLOW_NUM=='nx_require_12171'){
	  switch(formContext.FLOW.TCH_NUM){ //这些环节不置灰
	    case 'nx_require_13834'://需求分析
	    case 'nx_require_13893'://信息化部门副总审批
	    case 'nx_require_13840'://CRM团队实施 
	    case 'nx_require_13816'://计费团队实施
	    case 'nx_require_13818'://OSS团队实施
	    case 'nx_require_13820'://平台保障团队实施
	    case 'nx_require_13822'://MSS团队实施
	    case 'nx_require_13824'://数据支撑团队实施
	    case 'nx_require_13826'://配置团队实施
	    case 'nx_require_13828'://IT服务台实施
	    case 'nx_require_13827'://IT服务台负责人
	    case 'nx_require_13825'://配置团队负责人
	    case 'nx_require_13823'://数据支撑团队负责人
	    case 'nx_require_13819'://平台保障团队负责人
	    case 'nx_require_13817'://OSS团队负责人
	    case 'nx_require_13841'://计费团队负责人
	    case 'nx_require_13839'://CRM团队负责人
	    case 'nx_require_13821'://MSS团队负责人
	             return false;
	  }
  }
  return true;
}

//需求单打印
function doAnalyPrintView()
{
   window.open("/workshop/form/formFile/nx_requirementPrint.html");
}