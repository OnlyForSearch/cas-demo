
/**
 * ���չ����ղ�
 * 2012-7-3
 */
 var xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
 var actionUrl = "../../../servlet/FavoritesAction?";
 
 //ȡ���ղ�
 function delFavoWorkOrder(grid){
 	var sm = grid.getSelectionModel();
	var records = sm.getSelections();
	if(records.length<1){
		alert('��ѡ����Ҫȡ���ղصļ�¼��');
		return false;
	}
	if(!window.confirm("ȷ��Ҫȡ���ղأ�")){return;}
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
		alert("�Ѿ�ȡ���ղأ�");
		grid.search();
	}
 }
 
 //չʾ��������
 function showWorkOrder(grid){
 	var sm = grid.getSelectionModel();
	var records = sm.getSelections();
	if(records.length!=1){
		alert('��ѡ��һ����¼��');
		return false;
	}
	if(records[0].get("FAVORITE_URL")!=''){
		var iWidth = screen.availWidth;//500px
		var iHeight = screen.availHeight;//430px
		var param = "resizable=yes;dialogWidth="+iWidth+";dialogHeight="
			+iHeight+";help=0;scroll=yes;status=0;";
		window.showModalDialog("../../.."+records[0].get("FAVORITE_URL"),null,param);
	}else{
		alert("�������ӵ�ַ����");
	}
 }