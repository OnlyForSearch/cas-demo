function loadUpdatePasswd(){
	var str =	'	<div id="mask_div" class="maskCss" style="height:100%"></div> '+
				'	<div id="UPDATE_PASSWORD" style="width:560px;height:370px;display:none;overflow:auto;overflow-x: hidden;background-color:#ffffff;position:absolute;padding:0px;"> '+
				'		<div class="floatTitleDiv"> '+
				'			<span class="floatCloseBut" '+
				'				onclick="closeUpdatePassword()" '+
				'				title="�ر�"><img src="/resource/image/indexZJ/close.png"/> </span> '+
				' 			<span class="floatTitle">�˺Ű�ȫ����</span> '+
				' 		</div> '+
				' 		<div> '+
				'			<div class="divConfig"> '+
				'		        <div class="divConfigContent"> '+
				'		        	<div class="divConfigHide" id="divUpdatePassword"> '+
				'			         	<div class="divConfigTitle" id="divUpdatePasswordTitle" onclick="updatePassConfig()"> '+
				'			        		<div class="divImg_1"> '+
				'			        			<img src="/resource/image/indexZJ/up_pass_08.png" width="20px" height="20px" style="margin:5px 0 0 5px"/> '+
				'			        		</div> '+
				'				        	<span class="divConfigTitleSpan_1">�޸�����</span> '+
				'				        	<img class="imgArrow" src="/resource/image/indexZJ/arrow-next.png" title="չ��" onclick="showUpdatePass()" id="showPass"/> '+
				'				        	<img class="imgArrow" src="/resource/image/indexZJ/arrow-prev.png" title="����" onclick="hideUpdatePass()" id="hidePass" style="display:none;"/> '+
				'				        	<span class="divConfigTitleSpan_2">�������벻��Ϊ��ʷ���룩</span> '+
				'				        </div> '+
				'				        <!-- �޸�����/չ��ҳ�� --> '+
				'				        <div style="height:193px;width:100%;display:none;" id="divUpdatePasswordContent"> '+
				'				        	<div style="float:left;width:49.5%;height:100%"> '+
				'				        		<div class="divPasswordContent_1" onclick="updateOldPassword()"> '+
				'				        			<div class="divImg_3"> '+
				'				        				<img src="/resource/image/indexZJ/up_pass_07.png" width="45px" height="45px" style="margin:10px 0 0 12px;"/> '+
				'				        			</div> '+
				'				        			<span class="divConfigTitleSpan_4">���������</span> '+
				'				        		</div> '+
				'				        	</div> '+
				'				        	<div style="float:left;width:49.5%;height:100%"> '+
				'				        		<div class="divPasswordContent_1" onclick="updatePhonePassword()"> '+
				'				        			<div class="divImg_4"> '+
				'				        				<img src="/resource/image/indexZJ/up_pass_05.png" width="45px" height="45px" style="margin:10px 0 0 18px;"/> '+
				'				        			</div> '+
				'				        			<span class="divConfigTitleSpan_4">�ֻ�����</span> '+
				'				        		</div> '+
				'				        	</div> '+
				'				        </div> '+
				'				        <!-- �޸�����/��������� --> '+
				'				        <div style="height:193px;width:100%;display:none;" id="divUpdateOldPasswordContent"> '+
				'				        	<div style="width:100%;height:100%"> '+
				'				        		<div class="divOldPassContent"> '+
				'				        			<span class="divOldPassContentSpan">��ǰ����</span> '+
				'				        			<INPUT type="password" style="width:210px;" id="ps0"> '+
				'				        		</div> '+
				'				        		<div class="divOldPassContent"> '+
				'				        			<span class="divOldPassContentSpan">&nbsp;&nbsp;������</span> '+
				'				        			<INPUT type="password" style="width:210px;" id="ps1"> '+
				'				        		</div> '+
				'				        		<div class="divOldPassContent"> '+
				'				        			<span class="divOldPassContentSpan">ȷ������</span> '+
				'				        			<INPUT type="password" style="width:210px;" id="ps2"> '+
				'				        		</div> '+
				'				        		<div class="divOldPassContent_2"> '+
				'				        			<span class="divConfigSave" onclick="enter(1)">����</span> '+
				'				        			<span class="divConfigCancel" onclick="updateOldPassword_cancel()">ȡ��</span> '+
				'				        		</div> '+
				'				        	</div> '+
				'				        </div> '+
				'				        <!-- �޸�����/�������޸ĳɹ� --> '+
				'				        <div style="height:193px;width:100%;display:none;" id="divUpdateOldPasswordSuccess"> '+
				'				        	<div class="divOldPassSuccess"> '+
				'				        		<div class="divImg_5"> '+
				'				        			<img src="/resource/image/indexZJ/up_pass_06.png" width="25px" height="25px" style="margin:5px 0 0 5px"/> '+
				'				        		</div> '+
				'					        	<span class="divOldPassSuccessSpan">���ã����������Ѿ��޸ĳɹ���</span> '+
				'					        </div> '+
				'				        </div> '+
				'				        <!-- �޸�����/�ֻ����ܣ�1�� --> '+
				'				        <div style="height:193px;width:100%;display:none;" id="divUpdatePhonePasswordContent_1"> '+
				'				        	<div style="width:100%;height:100%"> '+
				'				        		<div class="divPhonePasswordContent_1"> '+
				'				        			<span class="divPhonePasswordSpan_1" id="isBindMobileTitle_2"></span> '+
				'				        			<span class="divPhonePasswordSpan_2" onclick="showBindPhone()">�޸ĺ���</span> '+
				'				        		</div> '+
				'				        		<div class="divOldPassContent"> '+
				'				        			<span class="divPhonePasswordSpan_3">*</span> '+
				'				        			<span class="divPhonePasswordSpan_4">&nbsp;&nbsp;��֤��</span> '+
				'				        			<div style="float:left;width:140px;"> '+
				'				        				<INPUT type="text" style="width:140px;" id="validateCode_1" onkeyup="validateCode(1)"> '+
				'				        			</div> '+
				'				        			<span class="divPhonePasswordSpan_5" style="display:none;" id="errorValidateCode_1">��֤�����</span> '+
				'				        		</div> '+
				'				        		<div class="divOldPassContent_2"> '+
				'				        			<span class="divConfigButtom" onclick="getValidateCode(1)">������»�ȡ��֤��</span> '+
				'				        		</div> '+
				'				        	</div> '+
				'				        </div> '+
				'				        <!-- �޸�����/�ֻ����ܣ�2�� --> '+
				'				        <div style="height:193px;width:100%;display:none;" id="divUpdatePhonePasswordContent_2"> '+
				'				        	<div style="width:100%;height:100%"> '+
				'				        		<div class="divOldPassContent"> '+
				'				        			<span class="divOldPassContentSpan_2">���������������룡</span> '+
				'				        		</div> '+
				'				        		<div class="divOldPassContent"> '+
				'				        			<span class="divOldPassContentSpan">&nbsp;&nbsp;������</span> '+
				'				        			<INPUT type="password" style="width:210px;" id="ps3"> '+
				'				        		</div> '+
				'				        		<div class="divOldPassContent"> '+
				'				        			<span class="divOldPassContentSpan">ȷ������</span> '+
				'				        			<INPUT type="password" style="width:210px;" id="ps4"> '+
				'				        		</div> '+
				'				        		<div class="divOldPassContent_3"> '+
				'				        			<span class="divConfigSave" onclick="enter(2)">����</span> '+
				'				        		</div> '+
				'				        	</div> '+
				'				        </div> '+
				'			        </div> '+
				'			        <div class="divConfigHide" id="divBindPhone" style="margin-top:35px"> '+
				'				        <div class="divConfigTitle" id="divBindPhoneTitle" onclick="bindPhoneConfig()"> '+
				'			        		<div class="divImg_2"> '+
				'			        			<img src="/resource/image/indexZJ/up_pass_04.png" width="20px" height="20px" style="margin:5px 0 0 7px"/> '+
				'			        		</div> '+
				'				        	<span class="divConfigTitleSpan_1">���ֻ�</span> '+
				'				        	<span class="divConfigTitleSpan_3" id="isBindMobileTitle"></span> '+
				'				        	<img class="imgArrow" src="/resource/image/indexZJ/arrow-next.png" title="չ��" onclick="showBindPhone()" id="showPhone"/> '+
				'					        <img class="imgArrow" src="/resource/image/indexZJ/arrow-prev.png" title="����" onclick="hideBindPhone()" id="hidePhone" style="display:none;"/> '+
				'				        </div> '+
				'				        <!-- ���ֻ�/չ��ҳ�� --> '+
				'				        <div style="height:193px;width:100%;display:none;" id="divBindPhoneContent"> '+
				'				        	<div style="width:100%;height:100%"> '+
				'				        		<div class="divBindPhoneContent"> '+
				'				        			<div class="divBindPhoneContent_2"> '+
				'				        				<span class="divOldPassContentSpan">�ֻ�����</span> '+
				'				        				<INPUT type="text" style="width:150px;" id="phone" onblur="getObj(\'validateCode_2\').value=\'\';"> '+
				'				        			</div> '+
				'				        			<span class="divConfigButtom_2" style="float:right" onclick="getValidateCode_2(2)">��ȡ��֤��</span> '+
				'				        		</div> '+
				'				        		<div class="divBindPhoneContent"> '+
				'				        			<span class="divOldPassContentSpan">&nbsp;</span> '+
				'				        			<div style="float:left;width:150px;"> '+
				'				        				<INPUT type="text" style="width:150px;color:#99a1a3;" id="validateCode_2" value="������֤��" onFocus="if(getObj(\'validateCode_2\').value==\'������֤��\'){getObj(\'validateCode_2\').value=\'\';}"> '+
				'				        			</div> '+
				'				        			<span class="divPhonePasswordSpan_5" style="display:none;" id="errorValidateCode_2">��֤�����</span> '+
				'				        		</div> '+
				'				        		<div class="divOldPassContent_3" style="margin-left:165px;"> '+
				'				        			<span class="divConfigButtom_2" onclick="confirmBindMobile()">ȷ��</span> '+
				'				        		</div> '+
				'				        	</div> '+
				'				        </div> '+
				'				        <!-- ���ֻ�/���ֻ��ɹ� --> '+
				'				        <div style="height:193px;width:100%;display:none;" id="divBindPhoneSuccess"> '+
				'				        	<div class="divBindPhoneSuccess"> '+
				'				        		<div class="divImg_5"> '+
				'				        			<img src="/resource/image/indexZJ/up_pass_06.png" width="25px" height="25px" style="margin:5px 0 0 5px"/> '+
				'				        		</div> '+
				'					        	<span class="divOldPassSuccessSpan">���ã������ֻ��Ѿ��󶨳ɹ���</span> '+
				'					        	<span class="divPhonePasswordSpan_2" onclick="showUpdatePass()">�޸�����</span> '+
				'					       </div> '+
				'				        </div> '+
				'			        </div> '+
				'		        </div> '+
				'			</div> '+
				'		</div> '+
				'	</div> '+
				'	<form name="frmMail" action="http://132.32.24.99:6080/chgpassword_wg.php?sid=1629443578dae2a52d&tid=2&lid=5&retid=5487" method=POST style="display:none" target="oMail"> '+
				'	<input type=hidden name=sid value="1629443578dae2a52d"> '+
				'	<input type=hidden name=lid value="5"> '+
				'	<input type=hidden name=tid value="2"> '+
				'	<input type=hidden name="save" value="yes"> '+
				'	<input type=hidden name="uid" value=""> '+
				'	<input type=hidden name="pwd_old" value=""> '+
				'	<input type=hidden name="pwd_new" value=""> '+
				'	<input type=hidden name="pwd_confirm" value=""> '+
				'	</form> '+
				'	<iframe src="about:blank" id="oMail" name="oMail" style="display:none"></iframe> ';
	getObj("loadPasswdConfig").innerHTML = str;
}
//���˺Ű�ȫ����
function updatePassword(){
	document.body.style.overflow = "hidden";
	getObj("mask_div").style.height =  document.body.scrollHeight;
	getObj("mask_div").style.display="block";//���ֲ�
	var obj = getObj("UPDATE_PASSWORD");
	obj.className = "floatDivCss";
	obj.style.display = "block";
	var top = 135;
	obj.style.top = document.body.scrollTop + top;
	//obj.style.top =  (document.body.clientHeight-obj.offsetHeight)/2;
	obj.style.left =  (document.body.clientWidth-obj.offsetWidth)/2;
	
	isBindMobile();
}
//�ر��˺Ű�ȫ����
function closeUpdatePassword(){
	getObj('UPDATE_PASSWORD').style.display = 'none';
	getObj('mask_div').style.display = 'none';
	document.body.style.overflow = 'auto';
	
	hideUpdatePass();
	hideBindPhone();
}
//�ж��Ƿ���ֻ�
var bindMobile = "";
var bindMobileEncrypt = "";
function isBindMobile(){
	$.ajax({
			type:'post',
			url: '/CustZJAction.do?method=getBindMobile',
			async: false,
			dataType:'json',
			success:function(msg){
				bindMobile = msg.value;
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				alert(errorThrown);
			}
	});
	if(bindMobile === "") getObj("isBindMobileTitle").innerHTML = "δ���ֻ�������ֻ�����";
	else {
		bindMobileEncrypt = bindMobile.substring(0,2)+"*******"+bindMobile.substring(bindMobile.length-2,bindMobile.length);
		getObj("isBindMobileTitle").innerHTML = "�Ѱ��ֻ�"+bindMobileEncrypt;
	}
}
//��ȡ����
function getObj(str){
	return document.getElementById(str);
}
var updatePassFalg = 0;
function updatePassConfig(){
	if(updatePassFalg == 0) showUpdatePass();
	else hideUpdatePass();
}
var bindPhoneFalg = 0;
function bindPhoneConfig(){
	if(bindPhoneFalg == 0) showBindPhone();
	else hideBindPhone();
}
//չ���޸��������
function showUpdatePass(){
	getObj("divUpdatePassword").className = 'divConfigShow';
	getObj("divUpdatePasswordTitle").style.background = '#ffffff';
	
	getObj("divUpdatePasswordContent").style.display = 'block';
	
	//���ذ��ֻ�����
	hideBindPhone();
	
	getObj("showPass").style.display = 'none';
	getObj("hidePass").style.display = 'block';
	
	updatePassFalg = 1;
	bindPhoneFalg = 0;
}
//�����޸��������
function hideUpdatePass(){
	getObj("divUpdatePassword").className = 'divConfigHide';
	getObj("divUpdatePasswordTitle").style.background = '#F2F2F2';
	
	getObj("divUpdatePasswordContent").style.display = 'none';
	getObj("divUpdateOldPasswordContent").style.display = 'none';
	getObj("divUpdateOldPasswordSuccess").style.display = 'none';
	getObj("divUpdatePhonePasswordContent_1").style.display = 'none';
	getObj("divUpdatePhonePasswordContent_2").style.display = 'none';
	
	getObj("showPass").style.display = 'block';
	getObj("hidePass").style.display = 'none';
	
	updatePassFalg = 0;
	bindPhoneFalg = 0;
}
//չ�����ֻ�����
function showBindPhone(){
	getObj("divBindPhone").className = 'divConfigShow';
	getObj("divBindPhoneTitle").style.background = '#ffffff';
	
	getObj("divBindPhoneContent").style.display = 'block';
	
	//�����޸��������
	hideUpdatePass();
	
	getObj("showPhone").style.display = 'none';
	getObj("hidePhone").style.display = 'block';
	
	validateCode_2.value = '������֤��';
	phone.value = '';
	
	bindPhoneFalg = 1;
	updatePassFalg = 0;
}
//���ذ��ֻ�����
function hideBindPhone(){
	getObj("divBindPhone").className = 'divConfigHide';
	getObj("divBindPhoneTitle").style.background = '#F2F2F2';
	
	getObj("divBindPhoneContent").style.display = 'none';
	getObj("divBindPhoneSuccess").style.display = 'none';
	
	getObj("showPhone").style.display = 'block';
	getObj("hidePhone").style.display = 'none';
	
	bindPhoneFalg = 0;
	updatePassFalg = 0;
}
//���������
function updateOldPassword(){
	ps0.value = "";
	ps1.value = "";
	ps2.value = "";
	
	getObj("divUpdateOldPasswordContent").style.display = 'block';
	getObj("divUpdatePasswordContent").style.display = 'none';
}
//���������/ȡ��
function updateOldPassword_cancel(){
	getObj("divUpdatePasswordContent").style.display = 'block';
	getObj("divUpdateOldPasswordContent").style.display = 'none';
}
//�ֻ�����
function updatePhonePassword(){
	if(bindMobile == ""){
		EMsg("����ֻ�����!");
		showBindPhone();
	}else{
		getValidateCode(1);
		validateCode_1.value = "";
		getObj("isBindMobileTitle_2").innerHTML = "�Ѿ����͵������ֻ�"+bindMobileEncrypt+"�������������յ�����֤�룡";
		
		getObj("divUpdatePhonePasswordContent_1").style.display = 'block';
		getObj("divUpdatePasswordContent").style.display = 'none';
	}
}
//��ȡ��֤��
var currenCode = "";//��ǰ��֤��
function getValidateCode(tag){
		$.ajax({
			type:'post',
			url: '/CustZJAction.do?method=sendValidateCode&bindMobile='+bindMobile+'&tag='+tag,
			async: false,
			dataType:'json',
			success:function(msg){
				currenCode = msg.code;
				if(currenCode == ""){
					isSuccessSendCode = false;
					alert("�ֻ����롰"+bindMobileEncrypt+"���Ѱ󶨣����ֻ�����ʧ��!");
				}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				alert(errorThrown);
			}
		});
}
var isSuccessSendCode = true;
function getValidateCode_2(tag){
	if(checkPhone()){
		bindMobile = phone.value;
		bindMobileEncrypt = bindMobile.substring(0,2)+"*******"+bindMobile.substring(bindMobile.length-2,bindMobile.length);
		getValidateCode(tag);
		if(isSuccessSendCode) alert("�Ѿ����͵������ֻ�"+bindMobileEncrypt+"�������������յ�����֤�룡");
		else isSuccessSendCode = true;
	}
}
//У����֤��
function validateCode(index){
	if(getObj("validateCode_"+index).value.length == 6){
		if(getObj("validateCode_"+index).value == currenCode){
			if(index == 1) {
				ps3.value = '';
				ps4.value = '';
				getObj("divUpdatePhonePasswordContent_1").style.display = 'none';
				getObj("divUpdatePhonePasswordContent_2").style.display = 'block';
			}
			getObj("errorValidateCode_"+index).style.display = 'none';
			return true;
		}else {
			getObj("errorValidateCode_"+index).style.display = 'block';
			return false;
		}
	}
	
	if(index != 1) {
		if(getObj("validateCode_"+index).value.length != 6 || getObj("validateCode_"+index).value == currenCode){
			getObj("errorValidateCode_"+index).style.display = 'block';
			return false;
		}
	}
}
//����ֻ���λ���Ƿ���ȷ
function checkPhone() {
    // ��֤����11λ���֣���1��ͷ��
    re = /^1\d{10}$/;
    if (!re.test(phone.value)) {
        EMsg("�ֻ������벻���Ϲ淶!");
        return false;
    }
    return true;
}
//ȷ�����ֻ�����
function confirmBindMobile(){
	if(getObj("validateCode_2").value == "" || getObj("validateCode_2").value == "������֤��"){
		EMsg("��������֤��!");
        return false;
	}
	if(validateCode(2)){
		$.ajax({
			type:'post',
			url: '/CustZJAction.do?method=bindingMobile&bindMobile='+bindMobile,
			async: false,
			dataType:'json',
			success:function(msg){
				if(msg.code == "0"){
					isBindMobile();
					getObj("divBindPhoneSuccess").style.display = 'block';
					getObj("divBindPhoneContent").style.display = 'none';
				}else{
					EMsg(msg.msg);
					return false;
				}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				alert(errorThrown);
			}
		});
	}
}
/////////////////////�޸����뿪ʼ/////////////////////
function checkData()
{
	if(ps0.value == "")
	{
		EMsg("��ǰ���벻��Ϊ��!");
		ps0.focus();
		return false;
	}
	if(ps1.value == "")
	{
		EMsg("�����벻��Ϊ��!");
		ps1.focus();
		return false;
	}
	if(ps2.value == "")
	{
		EMsg("ȷ�����벻��Ϊ��!");
		ps2.focus();
		return false;
	}
	if(ps1.value != ps2.value)
	{
		EMsg("��������������벻һ��!");
		ps1.focus();
		return false;
	}
	if(ps0.value == ps1.value)
	{
		EMsg("�����벻�ܺ͵�ǰ����һ��!");
		ps1.focus();
		return false;
	}
	
	return true;	
}
function checkData_2()
{
	if(ps3.value == "")
	{
		EMsg("�����벻��Ϊ��!");
		ps3.focus();
		return false;
	}
	if(ps4.value == "")
	{
		EMsg("ȷ�����벻��Ϊ��!");
		ps4.focus();
		return false;
	}
	if(ps3.value != ps4.value)
	{
		EMsg("��������������벻һ��!");
		ps3.focus();
		return false;
	}
	
	return true;	
}

function enter(index)
{
	if(index == 1){
		if(checkData()){
			var passwd;
			var passwdNew;
			var validCode = "";
			
			passwd = document.getElementById("ps0").value+"";
			passwdNew = document.getElementById("ps1").value+"";
			
			var xmlStr = "<Msg>";
			xmlStr = xmlStr + "<PASSWD>" + passwd + "</PASSWD>";
			xmlStr = xmlStr + "<PASSWD_NEW>" + passwdNew + "</PASSWD_NEW>";
			xmlStr = xmlStr + "<VALIDATE_CODE>" + validCode + "</VALIDATE_CODE>";
			xmlStr = xmlStr + "</Msg>";
			
			var pswdMsgXml = new ActiveXObject("Microsoft.XMLDOM");
			pswdMsgXml.loadXML(xmlStr); 
			
			xmlhttp.Open("POST", '../../servlet/staff_manage?tag=27',false);
			xmlhttp.send(pswdMsgXml);
			if(isSuccess(xmlhttp))
			{
			    setMailPwd(ps0.value,ps1.value,ps2.value);
				
			    document.frmMail.submit();
				getObj("divUpdateOldPasswordContent").style.display = 'none';
				getObj("divUpdateOldPasswordSuccess").style.display = 'block';
			}
		}
	}else{
		if(checkData_2()){
			$.ajax({
				type:'post',
				url: '/CustZJAction.do?method=updateStaffPasswd&passwdNew='+getObj("ps3").value,
				async: false,
				dataType:'json',
				success:function(msg){
					bindMobile = msg.code;
					if(msg.code == "0"){
						getObj("divUpdatePhonePasswordContent_2").style.display = 'none';
						getObj("divUpdateOldPasswordSuccess").style.display = 'block';
					}else{
						EMsg(msg.msg);
						return false;
					}
				},
				error:function(XMLHttpRequest, textStatus, errorThrown){
					alert(errorThrown);
				}
			});
		}
	}
}
function setMailPwd(value1,value2,value3)
{
   frmMail.uid.value=userName;
   frmMail.pwd_old.value=value1;
   frmMail.pwd_new.value=value2;
   frmMail.pwd_confirm.value=value3;
}
/////////////////////�޸��������/////////////////////