var callbackFn;

function tip(value,p,record){
		return "<div ext:qtip='<div style=\"font-size:10pt;padding:3;\">"+value+"</div>' ext:qtitle='ÏêÏ¸ÐÅÏ¢£º'>"+value+"</div>";	
	}
	
function showFlowList(grid)
{
  if(!grid || (typeof grid.getSelectionModel != 'function'))
  {
          grid = this;
  }
  callbackFn = refresh.callback([grid]);
  var row = grid.getSelectionModel().getSelected();
  if(row){
   //alert(row.get("SOURCE_BEGIN_DATE"));
   doWindow_open("/workshop/query/show_result.html?result="+row.get("GET_VALUE_CFG_ID")+"&flow_mod="+row.get("FLOW_MOD")+"\n"
                  +"&source_begin_date="+row.get("SOURCE_BEGIN_DATE")+"&source_end_date="+row.get("SOURCE_END_DATE"));       
  }
}

function getCurrentTacheName(value, p, record) {
	var p_url = '../../../servlet/FlowRemoteAction.do?method=getLastTacheName&flowId=' + record
			.get("FLOW_ID");

	var xmlDom;
	var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
	oXMLHTTP.open("POST", p_url, false);
	oXMLHTTP.send();
	return oXMLHTTP.responseTEXT;
}