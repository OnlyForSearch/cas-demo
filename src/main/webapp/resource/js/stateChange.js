var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var stateChangeUrl = "../../servlet/stateChangeAction?";
var crmId ;
var state ;
var areaCode;
var sera;
var crmGroupid;
var managFlag;
var makeTime;
var lastTime;
var errorReason;
var orderType;
var shopCarId;
var countTime;
function manageDbClick(value){
	var url = "stateChangeInfo.html?rnd="+Math.random();
	var temp = Global.grid.getSelectionModel().getSelections();
	
	crmId = temp[0].get("ROWID");
	state = temp[0].get("״̬");
	areaCode =temp[0].get("���б���");
	sera =temp[0].get("��ˮ��");
	crmGroupid =temp[0].get("CRM�鵵��ID");
	managFlag =temp[0].get("�����ʶ");;
	makeTime =temp[0].get("CRM���ݽӿ�����ʱ��");
	lastTime =temp[0].get("���һ�δ���ʱ��");
	errorReason =temp[0].get("��ԭ��");
	 orderType =temp[0].get("��������");
	shopCarId =temp[0].get("CRM���ﳵID");
	countTime =temp[0].get("ͳ��ʱ��");
	var bReturn = window.showModalDialog(url, window,"dialogHeight=420px;dialogWidth:630px;help=0;scroll=0;status=0");
	if(bReturn){
	 	search();
	}
}

function stateChange(){
	
	var cm = Global.grid.getColumnModel();
	var rows = Global.grid.getSelectionModel().getSelections(); 
	var issuccess = false;
	if(rows.length==0){
		Ext.Msg.alert("״̬���","������ѡ��һ����Ҫ��������ݣ�");   
	}else{
		var ids = "", states = [];
		var ret="";
		
		for (var i = 0, row; row = rows[i]; i++)
		{
			ids = ids+row.get("CRMID");
			if(i==rows.length-1){
					break;
			}
			ids+=",";
		
		}
		
		xmlhttp.Open("POST", stateChangeUrl+"id="+ids+"&action=1", false);
		xmlhttp.send();
		if(isSuccess(xmlhttp)) {
			
				alert("״̬����ɹ�!!!!!");		
			
			refresh(Global.grid);	
		}
		
	}

	
}