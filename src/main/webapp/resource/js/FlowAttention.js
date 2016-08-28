// 取消流程关注
function delAttention(grid) {
	var rows = grid.getSelectionModel().getSelections();
	if (rows.length == 0) {
		MMsg("请至少选择一条记录!");
		return;
	}
	var flowIdArr = new Array();
	for (var i = 0; i < rows.length; i++) {
		flowIdArr.push(rows[i].get("FLOW_ID"));
	}
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.Open("POST", "/servlet/flowOper?OperType=16&flowIds="
					+ flowIdArr.join(','), false);
	xmlhttp.send();
	if (isSuccess(xmlhttp)) {
		MMsg("取消关注成功！");
		grid.search();
	}
}

// 根据flowId打开表单
function openFlowByFlowId(grid) {
	var row = grid.getSelectionModel().getSelected();
	var flow_id = row.get("FLOW_ID");
	var url = "/workshop/form/index.jsp?flowId=" + flow_id;
	doWindow_open(url);
}