var flowFormLang;
if("undefined" != typeof(ItmLang)  && ItmLang.flow)
{
	flowFormLang = ItmLang.flow;
}
else
{
	flowFormLang = 
	{
		flow_proc:"流程流转过程",
		exec_staff:"执行者",
		tch_doc:"文档", //flowForm.js
		tache_context:"环节内容", //flowForm.js
		execute_result:"执行结果", //flowForm.js
		finish_time : "完成时间", //flowForm.js
	};
}

function flowForm(flowRequest)
{
   form.call(this,flowRequest);
   this.loadData=function(isAfterSave)
   {
       var iFlowMod=flowRequest.flowMod;
       var iTchId=flowRequest.tchId;
       var iFlowId=flowRequest.flowId; 
       if(isAfterSave){
       		iFlowId = this.FLOW.FLOW_ID;
       		iTchId = -1;
       }
       return formApp.syncAjaxRequest('../../servlet/formDispatch?OperType=3&tchId='
                                     +iTchId+'&form_Id='+this.getFormId()
                                     +'&flowId='+iFlowId);      
   }
   this.loadRightData=function()
   {
       return formApp.syncAjaxRequest('../../servlet/formDispatch?OperType=4&tchId='+flowRequest.tchId
                                       +'&flowMod='+flowRequest.flowMod); 
   }
   this.appendPrintHTML=function(oPrintWin,aPrintParam)
   {
   	   if(aPrintParam && aPrintParam.withoutFlowProc=='T') return;
       if(oPrintWin.document.getElementById("flow_"+this.getFormId())==null)
	   {
		   var sFlowHTML=getFlowProcHTML(this);
		   oPrintWin.document.body.insertAdjacentHTML("beforeEnd",sFlowHTML);
	   }
   }
     
   function getFlowProcHTML(oForm)
   {
	    var sTable='<div style="visibility:hidden;"><p style="page-break-after:always;"></p></div>'
	               +'<br><div style="width:96%;text-align:center;font-weight:bold;font-size:15pt">'
	               +flowFormLang.flow_proc
	               + '</div><br>'
	               +'<div style="width:100%;" id="flow_'+oForm.getFormId()+'">'
	               +   '<table border="1"  align="center" style="width:96%;BORDER-COLLAPSE: collapse"'
	               +        ' bordercolor="#111111"	cellpadding="2">'
	               +       '<tr height="25" style="font-weight:bold;">'
	               +         '<TD>'+ flowFormLang.exec_staff +'</TD><TD>'+ flowFormLang.tache_context +'</TD>'
	               +         '<TD>'+ flowFormLang.tache_context +'</TD><TD>'+flowFormLang.tch_doc+'</TD><TD>'+flowFormLang.finish_time+'</TD>'
	               +       '</tr>';
		var xmlDom=formApp.syncAjaxRequest("../../servlet/flowOper?OperType=3&flowId="+oForm.FLOW.TOP_FLOW_ID);
		var oRows=xmlDom.selectNodes("//rowSet");
		var iLen=oRows.length;
		for (var i=0;i<iLen;i++)
		{
		     var oRow=oRows[i];
		     var sReg=/\.\.\/\.\.\//gi;
		     var sDoc=oRow.selectSingleNode("DOC").text;
		     var iLevel=parseInt(oRow.getAttribute("level"),10);
		     var iMargin=iLevel*20;
		     sTable+='<tr>'
		           +   '<td style="margin-left:'+iMargin+'px">'+oRow.selectSingleNode("STAFF_NAME").text+'</Td>'
		           +   '<td>'+oRow.selectSingleNode("TCH_CONT_DESC").text+'</Td>'
		           +   '<td>'+oRow.selectSingleNode("RESULT_DESC").text+'</Td>'
		           +   '<td>'+sDoc.replace(sReg,"../../../")+'</Td>'
		           +   '<td>'+oRow.selectSingleNode("FINISH_DATE").text+'</Td>'
		           + '</tr>';
		}
	 	sTable+='</table></div>';
	 	return sTable;
	}
}