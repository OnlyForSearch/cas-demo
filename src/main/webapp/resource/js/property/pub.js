var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var currentid = "";
var ifdetail = "1",company_id="",contrance_id="";
/**
* ===================================property.jsp=============================================
* */

function modifyproperty(){  //修改particularMsg
  	var selectedRows = currentid;
        if(selectedRows== "") {EMsg("请选择要查看的记录"); return false;}
	if(isExecute(selectedRows))
	{
		document.getElementById("particularMsg").src = "propertyInfo.jsp?oper=update&realtyequipid="+selectedRows+"&item_id="+item_id+"&company_id="+company_id+"&company_id="+company_id;
	}
}

function showproperty(){
  var selectedRows = currentid;
  modifyproperty();
}

function viewhostmsg(){  //主机详细情况
	var selectedRows = currentid;
        if(selectedRows== "") {EMsg("请选择要查看的记录"); return false;}
	if(isExecute(selectedRows))
	{
		var params = new Array();
                xmlhttp.open("POST","hostquip.jsp?realtyequipid="+selectedRows,false);
                xmlhttp.send();
                document.getElementById("showHostMsg").innerHTML = xmlhttp.responseText;
	}
}

function viewhosthismsg(){  //主机历史详细情况
//alert(currentid)
	var selectedRows = currentid;
        if(selectedRows== "") {EMsg("请选择要查看的记录"); return false;}
	if(isExecute(selectedRows))
	{
		var params = new Array();
                xmlhttp.open("POST","hostquiphis.jsp",false);
                xmlhttp.send();
                document.getElementById("showHisHostMsg").innerHTML = xmlhttp.responseText;
                hostquiphisinipage(selectedRows);
	}
}

function showRepair(){ //维保信息
	var selectedRows = currentid;
	if(selectedRows== "") {EMsg("请选择要查看的记录"); return false;}
	if(isExecute(selectedRows))
	{
		var params = new Array();
		document.getElementById("RepairMsg").src = "repair.jsp?oper=update&realtyequipid="+selectedRows+"&item_id="+item_id+"&company_id="+company_id+"&company_id="+company_id;
	}
}

function viewextend(){  //扩容
//alert(currentid)
        var selectedRows = currentid;
        if(selectedRows== "") {EMsg("请选择要查看的记录"); return false;}
	if(isExecute(selectedRows))
	{
		var params = new Array();
                xmlhttp.open("POST","equipupgrade.jsp?realtyequipid="+selectedRows,false);
                xmlhttp.send();
                var oExtent=document.getElementById("showExtend");
                oExtent.innerHTML = xmlhttp.responseText;
                equipupgradeinipage(selectedRows);
	}
}


function viewhistory(){  //历史资产
//alert(currentid)
      var selectedRows = currentid;
      if(selectedRows== "") {EMsg("请选择要查看的记录"); return false;}
      if(isExecute(selectedRows))
      {
              var params = new Array();
              xmlhttp.open("POST","realtyequiphis.jsp?realtyequipid="+selectedRows,false);
              xmlhttp.send();
              document.getElementById("showHistory").innerHTML = xmlhttp.responseText;
              realtyequiphisinipage(selectedRows);
      }
}

function viewrelarealtyequip(){  //关联固定资产
//alert(currentid)
      var selectedRows = currentid;
      if(selectedRows== "") {EMsg("请选择要查看的记录"); return false;}
      if(isExecute(selectedRows))
      {
              var params = new Array();
              xmlhttp.open("POST","relarealtyequip.jsp?realtyequipid="+selectedRows,false);
              xmlhttp.send();
              document.getElementById("showRelarealtypequip").innerHTML = xmlhttp.responseText;
              relarealtyeuipinipage(selectedRows);
      }
}


function showAllMsg(){
  var selectedRows = currentid;
  
  //currentid = selectedRows;
      if(isExecute(selectedRows))
      {
         modifyproperty();
	     //viewextend();
	     //viewhistory();
	     //viewrelarealtyequip();
           if(ifdetail!="1"){
             //viewhosthismsg();
             //viewhostmsg();
           }
      }

}
/**
* ============================================hostquip.jsp====================================================
* */

function addhosteqip(){
    var params = new Array();
    params.push("realtyequipid="+currentid);
    document.getElementById("hostQuipMsg").src = "hostquipinfo.jsp?realtyequipid="+currentid;
}

function modifyhostequip(){
    var params = new Array();
    var selectedRows = hostquipData.getPropertys("id");
    if(selectedRows== "") {EMsg("请选择要查看的记录"); return false;}
    params.push("realtyequipid="+selectedRows);
    document.getElementById("hostQuipMsg").src = "updatehostquip.jsp?realtyequipid="+selectedRows;
}

function deletehostquip(){
        var url = "../../servlet/hostquipservlet?";
        var selectedRows = hostquipData.getPropertys("id");
        if(selectedRows== "") {EMsg("请选择要删除的记录"); return false;}
      if(isExecute(selectedRows))
      {
          if(QMsg("是否删除该信息?")==MSG_YES)
          {
              var paramArray = new Array();
              paramArray.push("tag="+5);
              var realtyequipid = selectedRows;
              paramArray.push("realtyequipid="+realtyequipid);
              xmlhttp.Open("POST",url+paramArray.join("&"),false);
              xmlhttp.send(hostquipData.XMLDocument);
              isOK = isSuccess(xmlhttp);
              if(isOK)
              {
                MMsg("删除成功!");
                hostquipData.doRefresh(false);
                document.getElementById("hostQuipMsg").style.display = "none";
              }
          }
      }
}

//===============================hostquiphis.jsp============================

function hostquiphisinipage(realtyequipid){
   var sendXML='<?xml version="1.0" encoding="gb2312"?>'
               +  '<root>'
               +     '<search>'
               +        '<param fieldName="t.HOST_QUIP_HIS_ID" oper="=" type="string">'+realtyequipid+'</param>'
               +     '</search>'
               +  '</root>';
   if(document.all.hostquiphisData.readyState=="complete")
   {
   	document.all.hostquiphisData.sendXML=sendXML;
   	document.all.hostquiphisData.xmlSrc="../../servlet/hostquiphisservlet?tag=1";
   }
   else
   {
      window.setTimeout("hostquiphisinipage('"+realtyequipid+"')",1000)
   }
}

function updatehostquiphis(){
    var url = "../../servlet/hostquiphisservlet?";
    var params = new Array();
    var realtyequipid = hostquiphisData.getPropertys("key1");
    var modifysqe = hostquiphisData.getPropertys("key2");
    if(realtyequipid== "" || modifysqe=="") {EMsg("请选择要查看的记录"); return false;}
    params.push("realtyequipid="+realtyequipid);
    params.push("modifysqe="+modifysqe);
    document.getElementById("hostQuipHisMsg").src = "updatehostquiphis.jsp?realtyequipid="+realtyequipid+"&modifysqe="+modifysqe;
}

function deletehostquiphis(){
    var url = "../../servlet/hostquiphisservlet?";
    if(QMsg("是否删除该信息?")==MSG_YES)
    {
        var params = new Array();
        var realtyequipid = hostquiphisData.getPropertys("key1");
        var modifysqe = hostquiphisData.getPropertys("key2");
        if(realtyequipid== "" || modifysqe=="") {EMsg("请选择要删除的记录"); return false;}
        params.push("tag="+4);
        params.push("realtyequipid="+realtyequipid);
        params.push("modifysqe="+modifysqe);
        xmlhttp.Open("POST",url+params.join("&"),false);
        xmlhttp.send(hostquiphisData.XMLDocument);
        isOK = isSuccess(xmlhttp);
        if(isOK)
        {
          MMsg("删除成功!");
          hostquiphisData.doRefresh(false);
          document.getElementById("hostQuipHisMsg").style.display="none";
        }
    }
}

//===============================equipupgrade.jsp=======================================

function equipupgradeinipage(realtyequipid){
   var sendXML='<?xml version="1.0" encoding="gb2312"?>'
               +  '<root>'
               +     '<search  orderby="a.SEQ_ID asc">'
               +        '<param fieldName="a.EQUIP_UPGRADE_ID" oper="=" type="string">'+realtyequipid+'</param>'
               +     '</search>'
               +  '</root>';
   if(document.all.equipupgradeData.readyState=="complete")
   {
      document.all.equipupgradeData.sendXML=sendXML;
      document.all.equipupgradeData.xmlSrc="../../servlet/equipupgradeservlet?tag=1";
   }
   else
   {
      window.setTimeout("equipupgradeinipage('"+realtyequipid+"')",1000)
   }  
}



function addequipupgrade(){
    var params = new Array();
    document.getElementById("equipUpGradeMsg").src = "equipupgradeinfo.jsp?realtyequipid="+currentid;
}

function modifyequipupgrade(){
    var params = new Array();
    var realtyequipid = equipupgradeData.getPropertys("key1");
    var seqid = equipupgradeData.getPropertys("key2");
    if(realtyequipid== "" || seqid=="" ) {EMsg("请选择要查看的记录"); return false;}
    document.getElementById("equipUpGradeMsg").src = "updateequipupgrade.jsp?realtyequipid="+realtyequipid+"&seqid="+seqid;
}

function deleteequipupgrade(){
    var url = "../../servlet/equipupgradeservlet?";
	 var realtyequipid = equipupgradeData.getPropertys("key1");
	if(realtyequipid== "" || seqid=="" ) {EMsg("请选择要删除的记录"); return false;}
    if(QMsg("是否删除该信息?")==MSG_YES)
    {
        var params = new Array();
        var seqid = equipupgradeData.getPropertys("key2");
        params.push("tag="+5);
        params.push("realtyequipid="+realtyequipid);
        params.push("seqid="+seqid);
        xmlhttp.Open("POST",url+params.join("&"),false);
        xmlhttp.send(equipupgradeData.XMLDocument);
        isOK = isSuccess(xmlhttp);
        if(isOK)
        {
          MMsg("删除成功!");
          equipupgradeData.doRefresh(false);
          document.getElementById("equipUpGradeMsg").style.display = "none";
        }
    }
}

//==============================realtyequiphis.jsp=========================================

function realtyequiphisinipage(realtyequipid){
   var sendXML='<?xml version="1.0" encoding="gb2312"?>'
               +  '<root>'
               +     '<search  orderby="a.MODIFY_SEQ+0 asc">'
               +        '<param fieldName="a.REALTY_EQUIP_HIS_ID" oper="=" type="string">'+realtyequipid+'</param>'
               +     '</search>'
               +  '</root>';
   
   if(document.all.realtyequiphisData.readyState=="complete")
   {
      document.all.realtyequiphisData.sendXML=sendXML;
      document.all.realtyequiphisData.xmlSrc="../../servlet/realtyequiphisservlet?tag=1";
   }
   else
   {
      window.setTimeout("realtyequiphisinipage('"+realtyequipid+"')",1000)
   }
}

function updaterealtyequiphis(){  //修改
    var realtyequipid = realtyequiphisData.getPropertys("key1");
    var modifyseq = realtyequiphisData.getPropertys("key2");
    if(realtyequipid== "" || modifyseq=="" ) {EMsg("请选择要查看的记录"); return false;}
    var params = new Array();
    params.push("realtyequipid="+realtyequipid);
    params.push("modifyseq="+modifyseq);
    document.getElementById("realtyEquipHisMsg").src = "updaterealtyequiphis.jsp?realtyequipid="+realtyequipid+"&modifyseq="+modifyseq;
}

function deleterealtyequiphis(){  //删除
    var url = "../../servlet/realtyequiphisservlet?";
    var realtyequipid = realtyequiphisData.getPropertys("key1");
    var modifyseq = realtyequiphisData.getPropertys("key2");
    if(realtyequipid== "" || modifyseq=="" ) {EMsg("请选择要删除的记录"); return false;}
    if(QMsg("是否删除该信息?")==MSG_YES)
    {
        var params = new Array();
        params.push("tag="+5);
        params.push("realtyequipid="+realtyequipid);
        params.push("modifyseq="+modifyseq);
        xmlhttp.Open("POST",url+params.join("&"),false);
        xmlhttp.send();
        isOK = isSuccess(xmlhttp);
        if(isOK)
        {
          MMsg("删除成功!");
          realtyequiphisData.doRefresh(false);
          document.getElementById("realtyEquipHisMsg").style.display = "none";
        }
    }
}

//===================================relarealtyequip.jsp=======================================

function relarealtyeuipinipage(realtyequipid){
   var sendXML='<?xml version="1.0" encoding="gb2312"?>'
               +  '<root>'
               +     '<search>'
               +        '<param fieldName="a.REALTY_EQUIP_ID" oper="=" type="string">'+realtyequipid+'</param>'
               +     '</search>'
               +  '</root>';
   if(document.all.relarealtyeuipData.readyState=="complete")
   {
      document.all.relarealtyeuipData.sendXML=sendXML;
      document.all.relarealtyeuipData.xmlSrc="../../servlet/relarealtyequipservlet?tag=1";
   }
   else
   {
      window.setTimeout("relarealtyeuipinipage('"+realtyequipid+"')",1000)
   }
}

function addrelarealtyeuip(){
    var params = new Array();
    document.getElementById("relarealtyEquipMsg").src = "relarealtyequipinfo.jsp?realtyequipid="+currentid;
}

function modifyrelarealtyeuip(){
    var realtyequipid = relarealtyeuipData.getPropertys("key1");
    var relarealtyequipseq = relarealtyeuipData.getPropertys("key2");
    if(realtyequipid== "" || relarealtyequipseq=="" ) {EMsg("请选择要查看的记录"); return false;}
    var params = new Array();
    params.push("realtyequipid="+realtyequipid);
    params.push("relarealtyequipseq="+relarealtyequipseq);
    document.getElementById("relarealtyEquipMsg").src = "updaterelarealtyequip.jsp?realtyequipid="+realtyequipid+"&relarealtyequipseq="+relarealtyequipseq;
}

function deleterelarealtyeuip(){
    var url = "../../servlet/relarealtyequipservlet?";
    var realtyequipid = relarealtyeuipData.getPropertys("key1");
    var relarealtyequipseq = relarealtyeuipData.getPropertys("key2");
    if(realtyequipid== "" || relarealtyequipseq=="" ) {EMsg("请选择要删除的记录"); return false;}
    if(QMsg("是否删除该信息?")==MSG_YES)
    {
        var params = new Array();
        params.push("tag="+5);
        params.push("realtyequipid="+realtyequipid);
        params.push("relarealtyequipseq="+relarealtyequipseq);
        xmlhttp.Open("POST",url+params.join("&"),false);
        xmlhttp.send();
        isOK = isSuccess(xmlhttp);
        if(isOK)
        {
          MMsg("删除成功!");
          relarealtyeuipData.doRefresh(false);
          document.getElementById("relarealtyEquipMsg").style.display = "none";
        }
    }
}

//==================================================================

function doBeforeRightClick(obj,MenuName)
{
    obj.rightMenu=MenuName;
}


