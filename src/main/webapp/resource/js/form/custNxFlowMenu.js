//�жϱ��水ť�Ƿ��û�
function saveButtonCanEdit(){ 
   if(isView()) return false;
   var current_staff_id = ','+formContext.GLOBAL_VAR.STAFF_ID+',';
    //��������������̣���ǰ��¼��Ϊ����������ڵĴ�����ʱ�������޸��������������
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

//���󵥴�ӡ�Ƿ��û�
function canAnalyPrint(){
 //���������������
 if(formContext.FLOW.FLOW_NUM=='nx_require_12171'){
	  switch(formContext.FLOW.TCH_NUM){ //��Щ���ڲ��û�
	    case 'nx_require_13834'://�������
	    case 'nx_require_13893'://��Ϣ�����Ÿ�������
	    case 'nx_require_13840'://CRM�Ŷ�ʵʩ 
	    case 'nx_require_13816'://�Ʒ��Ŷ�ʵʩ
	    case 'nx_require_13818'://OSS�Ŷ�ʵʩ
	    case 'nx_require_13820'://ƽ̨�����Ŷ�ʵʩ
	    case 'nx_require_13822'://MSS�Ŷ�ʵʩ
	    case 'nx_require_13824'://����֧���Ŷ�ʵʩ
	    case 'nx_require_13826'://�����Ŷ�ʵʩ
	    case 'nx_require_13828'://IT����̨ʵʩ
	    case 'nx_require_13827'://IT����̨������
	    case 'nx_require_13825'://�����ŶӸ�����
	    case 'nx_require_13823'://����֧���ŶӸ�����
	    case 'nx_require_13819'://ƽ̨�����ŶӸ�����
	    case 'nx_require_13817'://OSS�ŶӸ�����
	    case 'nx_require_13841'://�Ʒ��ŶӸ�����
	    case 'nx_require_13839'://CRM�ŶӸ�����
	    case 'nx_require_13821'://MSS�ŶӸ�����
	             return false;
	  }
  }
  return true;
}

//���󵥴�ӡ
function doAnalyPrintView()
{
   window.open("/workshop/form/formFile/nx_requirementPrint.html");
}