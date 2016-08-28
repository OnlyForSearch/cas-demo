var ci_ip;
var ipResult;
var cli="up";
var ThisForm;
var oTable;
var clickSource='saveBtn';//��¼�ǵ���˱��水ť�������ɰ�ť

function onFormSubmit(oForm)
{
	if(!checkIp())
		return false;
	
	if(!checkSameName(oForm))
		return false;
		
	if(ThisForm.getFormBahavior()=="E" && clickSource!='regenIpBtn'){
		if(START_VALUE.value!=START_VALUE_BAK.value || END_VALUE.value!=END_VALUE_BAK.value )
			if(QMsg("��ǰCI�ġ�IP��Χ���Ѿ��ı�,�Ƿ�Ҫ��������IP�б�?",2)==MSG_YES){
				saveIpList();
			}
	}
	clickSource='saveBtn';//��־��ԭ�س�ʼ״̬
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

//�л�������Ϊ���ء���ť��Text��IPΪ����ʱ��ʾΪ��ȡ�����á�
function changeBtnText(grid, rowIndex, e){
	var row = grid.getSelectionModel().getSelected();
	var btn = grid.getTopToolbar().items.get("Menu1_2311");//sys_func_menu_item.FUNC_MENU_ITEM_ID����Ϊ2311������û�ID
	if(row.get("ADDRESS").indexOf("*")>=0){
		btn.setText("ȡ������");
	}else{
		btn.setText("����Ϊ����");
	}
}

function setGateway(grid) {
	callbackFn = refresh.callback([grid]);
	var row = grid.getSelectionModel().getSelected();
	if(row){
		execute(18,"{call pkp_cmdb_config.changeIpRela('"+row.get("RELE_INSTANCE_ID")+"',"+getCurrentStaffId()+",?) }",function(){
			ci_ip.search();
			var btn = grid.getTopToolbar().items.get("Menu1_2311");
			btn.setText(btn.getText()=="ȡ������"?"����Ϊ����":"ȡ������");
		})
	}else {
		MMsg("��ѡ��һ�");
		return;
	}
}

//����IP
function regenIP(){
	if(!checkIp())
		return false;
	var saveFlag = true;
	clickSource='regenIpBtn';//��־�ı�Ϊ���������IP��ť
	if(ThisForm.getFormBahavior()=="C"){
		if(QMsg("��ǰCI����Ϣδ����,����ѡ�����CI,�Ƿ�Ҫ�ȱ��浱ǰCI��Ϣ?",2)==MSG_YES){
			saveFlag = (top.window.frames["fraToolBar"]||parent.window.frames["fraToolBar"]).doSave(true);
		}else return;
	}else if(ThisForm.getFormBahavior()=="E"){
		if(START_VALUE.value!=START_VALUE_BAK.value || END_VALUE.value!=END_VALUE_BAK.value ){
			if(QMsg("��ǰCI�ġ�IP��Χ���Ѿ��ı�,�Ƿ�Ҫ�ȱ��浱ǰCI��Ϣ?",2)==MSG_YES){
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
	//�ж�IP���Ƿ����ظ�����ѯ���Ƿ�Ҫ���ɡ�
	/*execute(2,"select pkp_cmdb_config.getRepeatIp('"+START_VALUE.value+"','"+END_VALUE.value+"',"+INSTANCE_ID.value+","+dataSetId+") RESULT from dual",function(){
		if(ci_ip)ci_ip.search();
		var dataXML=xmlhttp.responseXML
		var oRows = dataXML.selectNodes("/root/rowSet");
		if(oRows[0]){
			result=oRows[0].selectSingleNode("RESULT").text;
	
			if(result.length>0){
				if(QMsg(result + "		�Ƿ�Ҫ���ɣ�",2)==MSG_YES){
					isRepeat = 1
				}else{
					isRepeat = 0
				}
			}
		}
	})*/
	//1Ϊip��֮���IP�����ظ���0Ϊ�������ظ�
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
//ͬ��IP��Χ
function syncIp(){
	START_VALUE_BAK.value = START_VALUE.value; 
	END_VALUE_BAK.value = END_VALUE.value;
}

function checkIp(){
	if(!ipRegex.test(START_VALUE.value)){
		MMsg("ip��Χ��ʼ��ʽ����ȷ");
		START_VALUE.focus();
		return false;
	}
	if(!ipRegex.test(END_VALUE.value)){
		MMsg("ip��Χ������ʽ����ȷ");
		END_VALUE.focus();
		return false;
	}
	if(!ipRegex.test(SUBNET_MASK.value)){
		MMsg("���������ʽ����ȷ");
		SUBNET_MASK.focus();
		return false;
	}
	
	if(compareIP(START_VALUE.value, END_VALUE.value)==1){
		MMsg("ip��Χ��ʼ����С��ip��Χ����");
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
