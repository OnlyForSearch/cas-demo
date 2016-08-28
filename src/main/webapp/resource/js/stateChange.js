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
	state = temp[0].get("状态");
	areaCode =temp[0].get("地市编码");
	sera =temp[0].get("流水号");
	crmGroupid =temp[0].get("CRM归档组ID");
	managFlag =temp[0].get("处理标识");;
	makeTime =temp[0].get("CRM数据接口生成时间");
	lastTime =temp[0].get("最后一次处理时间");
	errorReason =temp[0].get("错单原因");
	 orderType =temp[0].get("订单类型");
	shopCarId =temp[0].get("CRM购物车ID");
	countTime =temp[0].get("统计时间");
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
		Ext.Msg.alert("状态变更","请至少选择一行你要变更的数据！");   
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
			
				alert("状态变更成功!!!!!");		
			
			refresh(Global.grid);	
		}
		
	}

	
}