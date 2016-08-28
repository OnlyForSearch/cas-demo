function propertyReset(){
  REGION_ID.selectedIndex = 0;
  EQUIP_NAME.value = "";
  ADMIN_STAFF.value = "";
  STATE.selectedIndex = 0;
  COMPANY_NAME.value = "";
  EQUIP_MODEL.value = "";
  REALTY_EQUIP_ID.value = "";
  EQUIP_BILL_CLASS_ID.value = "";
  EQUIP_BILL_CLASS_ID.text = "";
  EQUIP_CODE_CLASS.value = "";
  EQUIP_CODE_CLASS.text = "";
  EQUIP_TYPE_ID.value = "";
  EQUIP_TYPE_ID.text = "";
}

//=============================资产扩容情况=================================
function equipupgradeReset(){
  var UPGRADE_PERSON = document.equipupgradeForm.UPGRADE_PERSON;
  var AFFIRM_STAFF = document.equipupgradeForm.AFFIRM_STAFF;

  UPGRADE_DATE_BEGIN.value = "";
  UPGRADE_DATE_END.value = "";
  UPGRADE_PERSON.value = "";
  AFFIRM_STAFF.value = "";
}

function equipupgradeSearch(){
   var UPGRADE_PERSON = document.equipupgradeForm.UPGRADE_PERSON;
   var AFFIRM_STAFF = document.equipupgradeForm.AFFIRM_STAFF;
   var begindate = UPGRADE_DATE_BEGIN.GetDate();
   var enddate = UPGRADE_DATE_END.GetDate();
   var UPGRADE_PERSONstr = UPGRADE_PERSON.value ;
   if(UPGRADE_PERSONstr!="") UPGRADE_PERSONstr = UPGRADE_PERSONstr+'%';
   var AFFIRM_STAFFstr = AFFIRM_STAFF.value+'%';
   if(AFFIRM_STAFFstr!="") AFFIRM_STAFFstr = AFFIRM_STAFFstr+'%';

   var sendXML='<?xml version="1.0" encoding="gb2312"?>'
	             +  '<root>'
                     +     '<search pagesize="10" page="1" orderby="a.SEQ_ID asc">'
                     +        '<param fieldName="c.STAFF_NAME" oper="like" type="string">'+UPGRADE_PERSONstr+'</param>'
                     +        '<param fieldName="b.STAFF_NAME" oper="like" type="string">'+AFFIRM_STAFFstr+'</param>'
                     +        '<param fieldName="a.EQUIP_UPGRADE_ID" oper="=" type="string">'+currentid+'</param>';

      if( begindate!="")
        sendXML = sendXML +    '<param fieldName="a.UPGRADE_DATE" oper="&gt;=" type="date" format="yyyy-MM-dd">'+begindate+'</param>';
      if(enddate!="")
        sendXML = sendXML +   '<param fieldName="a.UPGRADE_DATE" oper="&lt;=" type="date" format="yyyy-MM-dd">'+enddate+'</param>';

        sendXML = sendXML +'</search>'
                     +  '</root>';

   document.all.equipupgradeData.sendXML=sendXML;
   document.all.equipupgradeData.xmlSrc="../../servlet/equipupgradeservlet?tag=1";
}


//===============================固定资产历史信息=============================================
function realtyequiphisReset(){
  var REGION_ID = document.realtyequiphisForm.REGION_ID;
  var ADMIN_STAFF = document.realtyequiphisForm.ADMIN_STAFF;
  var EQUIP_NAME = document.realtyequiphisForm.EQUIP_NAME;
  //var STATE = document.realtyequiphisForm.STATE;

  REGION_ID.selectedIndex = 0;
  EQUIP_NAME.value = "";
  ADMIN_STAFF.value = "";
  //STATE.selectedIndex = 0;
  START_DATE_FROM.value = "";
  START_DATE_TO.value = "";
  END_DATE_FROM.value = "";
  END_DATE_TO.value = "";
}

function realtyequiphisSearch(){
  var REGION_ID = document.realtyequiphisForm.REGION_ID;
  var ADMIN_STAFF = document.realtyequiphisForm.ADMIN_STAFF;
  var EQUIP_NAME = document.realtyequiphisForm.EQUIP_NAME;
  //var STATE = document.realtyequiphisForm.STATE;

  var REGION_IDstr = REGION_ID.options[REGION_ID.selectedIndex].value;   //区域
  var EQUIP_NAMEstr = EQUIP_NAME.value ;  //资产名称
  if(EQUIP_NAMEstr!="") EQUIP_NAMEstr = EQUIP_NAMEstr+'%';
  var ADMIN_STAFFstr = ADMIN_STAFF.value ;   //管理员
  if(ADMIN_STAFFstr!="") ADMIN_STAFFstr = ADMIN_STAFFstr+'%';
  var str = '';

  if(START_DATE_FROM.GetDate()!=""){
    str = str +    '<param fieldName="a.START_DATE" oper="&gt;=" type="date" format="yyyy-MM-dd">'+START_DATE_FROM.GetDate()+'</param>';
  }
  if(START_DATE_TO.GetDate()!=""){
    str = str +    '<param fieldName="a.START_DATE" oper="&lt;=" type="date" format="yyyy-MM-dd">'+START_DATE_TO.GetDate()+'</param>';
  }

  if(END_DATE_FROM.GetDate()!=""){
    str = str +    '<param fieldName="a.END_DATE" oper="&gt;=" type="date" format="yyyy-MM-dd">'+END_DATE_FROM.GetDate()+'</param>';
  }
  if(END_DATE_TO.GetDate()!=""){
    str = str +    '<param fieldName="a.END_DATE" oper="&lt;=" type="date" format="yyyy-MM-dd">'+END_DATE_TO.GetDate()+'</param>';
  }

  var sendXML='<?xml version="1.0" encoding="gb2312"?>'
	             +  '<root>'
                     +     '<search pagesize="10" page="1" orderby="a.MODIFY_SEQ+0 asc">'
                     +        '<param fieldName="a.REGION_ID" oper="=" type="string">'+REGION_IDstr+'</param>'
                     +        '<param fieldName="a.EQUIP_NAME" oper="like" type="string">'+EQUIP_NAMEstr+'</param>'
                     +        '<param fieldName="i.STAFF_NAME" oper="like" type="string">'+ADMIN_STAFFstr+'</param>'
                     +        '<param fieldName="a.REALTY_EQUIP_HIS_ID" oper="=" type="string">'+currentid+'</param>'
                     +     '</search>'
                     +  '</root>';

   document.all.realtyequiphisData.sendXML=sendXML;
   document.all.realtyequiphisData.xmlSrc="../../servlet/realtyequiphisservlet?tag=1";
}


//===============================关联固定资产=============================================
function relarealtyeuipReset(){
  var EQUIP_NAME = document.relarealtyeuipForm.EQUIP_NAME;
  EQUIP_NAME.value = "";
}

function relarealtyeuipSearch(){
  var EQUIP_NAME = document.relarealtyeuipForm.EQUIP_NAME;
  var EQUIP_NAMEstr = EQUIP_NAME.value ;
  if(EQUIP_NAMEstr!="") EQUIP_NAMEstr = EQUIP_NAMEstr+'%';

  var sendXML='<?xml version="1.0" encoding="gb2312"?>'
	             +  '<root>'
                     +     '<search pagesize="10" page="1">'
                     +        '<param fieldName="b.EQUIP_NAME" oper="like" type="string">'+EQUIP_NAMEstr+'</param>'
                     +        '<param fieldName="a.REALTY_EQUIP_ID" oper="=" type="string">'+currentid+'</param>'
                     +     '</search>'
                     +  '</root>';

   document.all.relarealtyeuipData.sendXML=sendXML;
   document.all.relarealtyeuipData.xmlSrc="../../servlet/relarealtyequipservlet?tag=1";
}

//==================================hostquiphis.jsp=============================================//主机历史信息

function hostquiphisReset(){
  HOST_START_DATE_FROM.value = "";
  HOST_START_DATE_TO.value = "";
  HOST_END_DATE_FROM.value = "";
  HOST_END_DATE_TO.value = "";
}

function hostquiphisSearch(){

  var start_from = HOST_START_DATE_FROM.GetDate();
  var start_to = HOST_START_DATE_TO.GetDate();
  var end_from = HOST_END_DATE_FROM.GetDate();
  var end_to = HOST_END_DATE_TO.GetDate();
  var str = "";
  if(start_from!=""){
    str = str +    '<param fieldName="t.START_DATE" oper="&gt;=" type="date" format="yyyy-MM-dd">'+start_from+'</param>';
  }
  if(start_to!=""){
    str = str +    '<param fieldName="t.START_DATE" oper="&lt;=" type="date" format="yyyy-MM-dd">'+start_to+'</param>';
  }

  if(end_from!=""){
    str = str +    '<param fieldName="t.END_DATE" oper="&gt;=" type="date" format="yyyy-MM-dd">'+end_from+'</param>';
  }
  if(end_to!=""){
    str = str +    '<param fieldName="t.END_DATE" oper="&lt;=" type="date" format="yyyy-MM-dd">'+end_to+'</param>';
  }

  var sendXML='<?xml version="1.0" encoding="gb2312"?>'
	             +  '<root>'
                     +     '<search pagesize="10" page="1">'
                     +     str
                      +    '<param fieldName="t.HOST_QUIP_HIS_ID" oper="=" type="string">'+currentid+'</param>'
                     +     '</search>'
                     +  '</root>';

   document.all.hostquiphisData.sendXML=sendXML;
   document.all.hostquiphisData.xmlSrc="../../servlet/hostquiphisservlet?tag=1";
}
