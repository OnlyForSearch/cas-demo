function readNotice(){
	var rows = Global.gridPanel.getSelectionModel().getSelections();
	if(rows.length == 0)
	{
		return false;
	}
	var noticeIds = new Array();
	for(var i = 0; row = rows[i]; i++)
	{
		var noticeId = row.data['NOTICE_ID'];
		noticeIds.push(noticeId);
	}
	var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.open("post","/servlet/KnowledgeManager?tag=47&noticeId=" + noticeIds.join(','),false);
	xmlhttp.send();
	if(isSuccess(xmlhttp))
	{
		Global.gridPanel.store.reload();
	}
}

function openNotice(){
	var rows = Global.gridPanel.getSelectionModel().getSelections();
	var kid = rows[0].data['KNOWLEDGE_ID'];
	readNotice();
	window.open('/workshop/knowledge/knowledgeRead.jsp?kId=' + kid,null,'fullscreen=no,scrollbars=yes,resizable=yes,top=0,left=0');
}

function openKnowledgeFlow(){
	var row = Global.gridPanel.getSelectionModel().getSelected();
	var tchId = row.data['TCH_ID'];
	if(tchId)
	{
		window.open('/workshop/form/index.jsp?fullscreen=yes&callback=opener.document.execCommand("refresh")&tchId=' + tchId,'_blank','fullscreen=no,scrollbars=yes,resizable=yes,top=0,left=0');
	}
	else
	{
		alert('获取流程环节ID错误!');
	}
}