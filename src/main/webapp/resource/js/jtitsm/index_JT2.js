// 5002050流程历史信息查询用
function showForm(grid){
	if (!grid)
		grid = Global.mainPanel.items.get(0);
	var row = grid.getSelectionModel().getSelected();
	
	if(typeof(row)=='undefined'){
		return;
	}
	var	flow_mod = row.get("FLOW_MOD");
	var	flow_id = row.get("FLOW_ID");

	var urlHtml=getCodeList("INDEX_JT2_FLOW_FIND_URLHTML",flow_mod);
	if(urlHtml!=''){
		window.open(urlHtml, "winName2");
	}else{
		urlHtml="/FlowBrowse?system_code=D&flow_id="+flow_id;
		window.open(urlHtml, "winName2");
	}
}
	
// 获取codelist表中配置的值  INDEX_JT2_FLOW_FIND_URLHTML 	    
 function getCodeList(typeName,flowMod) {
  	 var urlHtml='';
     var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
     xmlhttp.open("POST", "/servlet/codeListCtrl.do?method=getCodeList&type=" + typeName, false);
     xmlhttp.send();
     arrayCode=new Array();
	 if (isSuccess(xmlhttp))	{
		var nodes = xmlhttp.responseXML.selectNodes("/root/rowSet");
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];	
			if(flowMod==node.selectSingleNode("CODE").text){
				urlHtml=node.selectSingleNode("MEAN").text;
				break;					
			}							
		}
	}
	return urlHtml;
 } 
