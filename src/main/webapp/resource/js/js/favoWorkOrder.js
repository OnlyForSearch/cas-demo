
/**
 * 江苏工单收藏
 * 2012-7-3
 */
 var xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
 var actionUrl = "../../../servlet/FavoritesAction?";
 
 //取消收藏
 function delFavoWorkOrder(grid){
 	var sm = grid.getSelectionModel();
	var records = sm.getSelections();
	if(records.length<1){
		alert('请选中你要取消收藏的记录！');
		return false;
	}
	if(!window.confirm("确定要取消收藏？")){return;}
	var favoIds = "";
	for(var i=0;i<records.length;i++){
		if(i!=records.length-1){
			favoIds += records[i].get("FAVORITE_ID")+",";
		}else{
			favoIds += records[i].get("FAVORITE_ID");
		}
	}
	xmlHttp.open("POST",actionUrl+"action=6&id="+favoIds,false);
	xmlHttp.send();
	if(isSuccess(xmlHttp)){
		alert("已经取消收藏！");
		grid.search();
	}
 }
 
 //展示工单内容
 function showWorkOrder(grid){
 	var sm = grid.getSelectionModel();
	var records = sm.getSelections();
	if(records.length!=1){
		alert('请选中一条记录！');
		return false;
	}
	if(records[0].get("FAVORITE_URL")!=''){
		var iWidth = screen.availWidth;//500px
		var iHeight = screen.availHeight;//430px
		var param = "resizable=yes;dialogWidth="+iWidth+";dialogHeight="
			+iHeight+";help=0;scroll=yes;status=0;";
		window.showModalDialog("../../.."+records[0].get("FAVORITE_URL"),null,param);
	}else{
		alert("工单链接地址错误！");
	}
 }