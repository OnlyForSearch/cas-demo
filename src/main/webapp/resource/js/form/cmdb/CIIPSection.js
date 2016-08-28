var ci_ip;
var ipResult;
var cli="up";
var ThisForm;
var oTable;
var clickSource='saveBtn';//记录是点击了保存按钮还是生成按钮

function onFormSubmit(oForm)
{
	if(!checkIp())
		return false;
	
	if(!checkSameName(oForm))
		return false;
		
	if(ThisForm.getFormBahavior()=="E" && clickSource!='regenIpBtn'){
		if(START_VALUE.value!=START_VALUE_BAK.value || END_VALUE.value!=END_VALUE_BAK.value )
			if(QMsg("当前CI的【IP范围】已经改变,是否要重新生成IP列表?",2)==MSG_YES){
				saveIpList();
			}
	}
	clickSource='saveBtn';//标志还原回初始状态
	return true;
}

function searchSecondItems(){
	isLoadSecondItemsList = false;
	var ci_ip = getSecondItem('ASSET','IPS_IP','ci_ip');
	ci_ip.grid.on("rowclick",changeBtnText);
	if(this.setHiddenColunm){
		setHiddenColunm();
	}
	wait.hide();
}

//切换“设置为网关”按钮的Text，IP为网关时显示为“取消设置”
function changeBtnText(grid, rowIndex, e){
	var row = grid.getSelectionModel().getSelected();
	var btn = grid.getTopToolbar().items.get("Menu1_2311");//sys_func_menu_item.FUNC_MENU_ITEM_ID必须为2311，否则得换ID
	if(row.get("ADDRESS").indexOf("*")>=0){
		btn.setText("取消设置");
	}else{
		btn.setText("设置为网关");
	}
}

function setGateway(grid) {
	callbackFn = refresh.callback([grid]);
	var row = grid.getSelectionModel().getSelected();
	if(row){
		execute(18,"{call pkp_cmdb_config.changeIpRela('"+row.get("RELE_INSTANCE_ID")+"',"+getCurrentStaffId()+",?) }",function(){
			ci_ip.search();
			var btn = grid.getTopToolbar().items.get("Menu1_2311");
			btn.setText(btn.getText()=="取消设置"?"设置为网关":"取消设置");
		})
	}else {
		MMsg("请选择一项！");
		return;
	}
}

//生成IP
function regenIP(){
	if(!checkIp())
		return false;
	var saveFlag = true;
	clickSource='regenIpBtn';//标志改变为点击了生成IP按钮
	if(ThisForm.getFormBahavior()=="C"){
		if(QMsg("当前CI的信息未保存,不能选择关联CI,是否要先保存当前CI信息?",2)==MSG_YES){
			saveFlag = (top.window.frames["fraToolBar"]||parent.window.frames["fraToolBar"]).doSave(true);
		}else return;
	}else if(ThisForm.getFormBahavior()=="E"){
		if(START_VALUE.value!=START_VALUE_BAK.value || END_VALUE.value!=END_VALUE_BAK.value ){
			if(QMsg("当前CI的【IP范围】已经改变,是否要先保存当前CI信息?",2)==MSG_YES){
				saveFlag = (top.window.frames["fraToolBar"]||parent.window.frames["fraToolBar"]).doSave(true);
			}else return;
		}
	}
	if(saveFlag){
		saveIpList();
	}
}

function saveIpList(){
	syncIp();
	var isRepeat = 1;
	var result="";
	//判断IP间是否有重复，并询问是否要生成。
	/*execute(2,"select pkp_cmdb_config.getRepeatIp('"+START_VALUE.value+"','"+END_VALUE.value+"',"+INSTANCE_ID.value+","+dataSetId+") RESULT from dual",function(){
		if(ci_ip)ci_ip.search();
		var dataXML=xmlhttp.responseXML
		var oRows = dataXML.selectNodes("/root/rowSet");
		if(oRows[0]){
			result=oRows[0].selectSingleNode("RESULT").text;
	
			if(result.length>0){
				if(QMsg(result + "		是否要生成？",2)==MSG_YES){
					isRepeat = 1
				}else{
					isRepeat = 0
				}
			}
		}
	})*/
	//1为ip段之间的IP允许重复，0为不允许重复
	execute(18,"{call pkp_cmdb_config.regenIp('"+START_VALUE.value+"','"+END_VALUE.value+"',"+getCurrentStaffId()+","+INSTANCE_ID.value+",'"+isRepeat+"',?,"+dataSetId+") }",function(){
		if(ci_ip)ci_ip.search();
		/*var dataXML=xmlhttp.responseXML
		var oRows = dataXML.selectNodes("/root/rowSet");
		var result=oRows[0].selectSingleNode("RESULT").text;*/
		if(result.length>0){
			result_div.style.display = "";
			result_content.innerHTML = result;
		}else{
			result_div.style.display = "none";
		}
	})
}
//同步IP范围
function syncIp(){
	START_VALUE_BAK.value = START_VALUE.value; 
	END_VALUE_BAK.value = END_VALUE.value;
}

function checkIp(){
	if(!ipRegex.test(START_VALUE.value)){
		MMsg("ip范围开始格式不正确");
		START_VALUE.focus();
		return false;
	}
	if(!ipRegex.test(END_VALUE.value)){
		MMsg("ip范围结束格式不正确");
		END_VALUE.focus();
		return false;
	}
	if(!ipRegex.test(SUBNET_MASK.value)){
		MMsg("子网掩码格式不正确");
		SUBNET_MASK.focus();
		return false;
	}
	
	if(compareIP(START_VALUE.value, END_VALUE.value)==1){
		MMsg("ip范围开始必须小于ip范围结束");
		START_VALUE.focus();
		return false;
	}
	return true;
}
function compareIP(ipBegin, ipEnd){
    var temp1;
    var temp2;
    temp1 = ipBegin.split(".");
    temp2 = ipEnd.split(".");
    for (var i = 0; i < temp1.length; i++)
    {
        if (parseInt(temp1[i])>parseInt(temp2[i])) {
            return 1;
        } else if (parseInt(temp1[i])<parseInt(temp2[i])) {
            return -1;
        }
    }
    return 0;     
}
