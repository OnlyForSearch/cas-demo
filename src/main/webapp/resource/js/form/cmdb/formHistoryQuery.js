function showForm(g) {
	var r = g.getSelectionModel().getSelected();
	if (r) {
		var classId = r.get("CLASS_ID");
		var datasetId = r.get("DATASET_ID");
		var requestId = r.get("REQUEST_ID");
		var arrayUrl = getURLSearch();
		var flowId = arrayUrl ? arrayUrl.flow_id : null;
		var url = "/workshop/form/index.jsp?callback=window.opener.callbackFn()&classId="
				+ classId
				+ "&dataSetId="
				+ datasetId
				+ "&requestId="
				+ requestId;
		if (flowId != null && flowId != "") {
			url = url + "&flowId=" + flowId;
		}
		window.open(url);
	} else {
		alert("请先选择一行记录");
	}
}

function callbackFn() {
	//Global.grid.search();
}
