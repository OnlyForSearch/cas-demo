// ȡ�����̹�ע
function delAttention(grid) {
	var rows = grid.getSelectionModel().getSelections();
	if (rows.length == 0) {
		MMsg("������ѡ��һ����¼!");
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
		MMsg("ȡ����ע�ɹ���");
		grid.search();
	}
}

// ����flowId�򿪱�
function openFlowByFlowId(grid) {
	var row = grid.getSelectionModel().getSelected();
	var flow_id = row.get("FLOW_ID");
	var url = "/workshop/form/index.jsp?flowId=" + flow_id;
	doWindow_open(url);
}