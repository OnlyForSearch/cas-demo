function loadUpdatePasswd(){
	var str =	'	<div id="mask_div" class="maskCss" style="height:100%"></div> '+
				'	<div id="UPDATE_PASSWORD" style="width:560px;height:370px;display:none;overflow:auto;overflow-x: hidden;background-color:#ffffff;position:absolute;padding:0px;"> '+
				'		<div class="floatTitleDiv"> '+
				'			<span class="floatCloseBut" '+
				'				onclick="closeUpdatePassword()" '+
				'				title="关闭"><img src="/resource/image/indexZJ/close.png"/> </span> '+
				' 			<span class="floatTitle">账号安全设置</span> '+
				' 		</div> '+
				' 		<div> '+
				'			<div class="divConfig"> '+
				'		        <div class="divConfigContent"> '+
				'		        	<div class="divConfigHide" id="divUpdatePassword"> '+
				'			         	<div class="divConfigTitle" id="divUpdatePasswordTitle" onclick="updatePassConfig()"> '+
				'			        		<div class="divImg_1"> '+
				'			        			<img src="/resource/image/indexZJ/up_pass_08.png" width="20px" height="20px" style="margin:5px 0 0 5px"/> '+
				'			        		</div> '+
				'				        	<span class="divConfigTitleSpan_1">修改密码</span> '+
				'				        	<img class="imgArrow" src="/resource/image/indexZJ/arrow-next.png" title="展开" onclick="showUpdatePass()" id="showPass"/> '+
				'				        	<img class="imgArrow" src="/resource/image/indexZJ/arrow-prev.png" title="隐藏" onclick="hideUpdatePass()" id="hidePass" style="display:none;"/> '+
				'				        	<span class="divConfigTitleSpan_2">（新密码不能为历史密码）</span> '+
				'				        </div> '+
				'				        <!-- 修改密码/展开页面 --> '+
				'				        <div style="height:193px;width:100%;display:none;" id="divUpdatePasswordContent"> '+
				'				        	<div style="float:left;width:49.5%;height:100%"> '+
				'				        		<div class="divPasswordContent_1" onclick="updateOldPassword()"> '+
				'				        			<div class="divImg_3"> '+
				'				        				<img src="/resource/image/indexZJ/up_pass_07.png" width="45px" height="45px" style="margin:10px 0 0 12px;"/> '+
				'				        			</div> '+
				'				        			<span class="divConfigTitleSpan_4">旧密码改密</span> '+
				'				        		</div> '+
				'				        	</div> '+
				'				        	<div style="float:left;width:49.5%;height:100%"> '+
				'				        		<div class="divPasswordContent_1" onclick="updatePhonePassword()"> '+
				'				        			<div class="divImg_4"> '+
				'				        				<img src="/resource/image/indexZJ/up_pass_05.png" width="45px" height="45px" style="margin:10px 0 0 18px;"/> '+
				'				        			</div> '+
				'				        			<span class="divConfigTitleSpan_4">手机改密</span> '+
				'				        		</div> '+
				'				        	</div> '+
				'				        </div> '+
				'				        <!-- 修改密码/旧密码改密 --> '+
				'				        <div style="height:193px;width:100%;display:none;" id="divUpdateOldPasswordContent"> '+
				'				        	<div style="width:100%;height:100%"> '+
				'				        		<div class="divOldPassContent"> '+
				'				        			<span class="divOldPassContentSpan">当前密码</span> '+
				'				        			<INPUT type="password" style="width:210px;" id="ps0"> '+
				'				        		</div> '+
				'				        		<div class="divOldPassContent"> '+
				'				        			<span class="divOldPassContentSpan">&nbsp;&nbsp;新密码</span> '+
				'				        			<INPUT type="password" style="width:210px;" id="ps1"> '+
				'				        		</div> '+
				'				        		<div class="divOldPassContent"> '+
				'				        			<span class="divOldPassContentSpan">确认密码</span> '+
				'				        			<INPUT type="password" style="width:210px;" id="ps2"> '+
				'				        		</div> '+
				'				        		<div class="divOldPassContent_2"> '+
				'				        			<span class="divConfigSave" onclick="enter(1)">保存</span> '+
				'				        			<span class="divConfigCancel" onclick="updateOldPassword_cancel()">取消</span> '+
				'				        		</div> '+
				'				        	</div> '+
				'				        </div> '+
				'				        <!-- 修改密码/旧密码修改成功 --> '+
				'				        <div style="height:193px;width:100%;display:none;" id="divUpdateOldPasswordSuccess"> '+
				'				        	<div class="divOldPassSuccess"> '+
				'				        		<div class="divImg_5"> '+
				'				        			<img src="/resource/image/indexZJ/up_pass_06.png" width="25px" height="25px" style="margin:5px 0 0 5px"/> '+
				'				        		</div> '+
				'					        	<span class="divOldPassSuccessSpan">您好！您的密码已经修改成功！</span> '+
				'					        </div> '+
				'				        </div> '+
				'				        <!-- 修改密码/手机改密（1） --> '+
				'				        <div style="height:193px;width:100%;display:none;" id="divUpdatePhonePasswordContent_1"> '+
				'				        	<div style="width:100%;height:100%"> '+
				'				        		<div class="divPhonePasswordContent_1"> '+
				'				        			<span class="divPhonePasswordSpan_1" id="isBindMobileTitle_2"></span> '+
				'				        			<span class="divPhonePasswordSpan_2" onclick="showBindPhone()">修改号码</span> '+
				'				        		</div> '+
				'				        		<div class="divOldPassContent"> '+
				'				        			<span class="divPhonePasswordSpan_3">*</span> '+
				'				        			<span class="divPhonePasswordSpan_4">&nbsp;&nbsp;验证码</span> '+
				'				        			<div style="float:left;width:140px;"> '+
				'				        				<INPUT type="text" style="width:140px;" id="validateCode_1" onkeyup="validateCode(1)"> '+
				'				        			</div> '+
				'				        			<span class="divPhonePasswordSpan_5" style="display:none;" id="errorValidateCode_1">验证码错误</span> '+
				'				        		</div> '+
				'				        		<div class="divOldPassContent_2"> '+
				'				        			<span class="divConfigButtom" onclick="getValidateCode(1)">点击重新获取验证码</span> '+
				'				        		</div> '+
				'				        	</div> '+
				'				        </div> '+
				'				        <!-- 修改密码/手机改密（2） --> '+
				'				        <div style="height:193px;width:100%;display:none;" id="divUpdatePhonePasswordContent_2"> '+
				'				        	<div style="width:100%;height:100%"> '+
				'				        		<div class="divOldPassContent"> '+
				'				        			<span class="divOldPassContentSpan_2">请输入您的新密码！</span> '+
				'				        		</div> '+
				'				        		<div class="divOldPassContent"> '+
				'				        			<span class="divOldPassContentSpan">&nbsp;&nbsp;新密码</span> '+
				'				        			<INPUT type="password" style="width:210px;" id="ps3"> '+
				'				        		</div> '+
				'				        		<div class="divOldPassContent"> '+
				'				        			<span class="divOldPassContentSpan">确认密码</span> '+
				'				        			<INPUT type="password" style="width:210px;" id="ps4"> '+
				'				        		</div> '+
				'				        		<div class="divOldPassContent_3"> '+
				'				        			<span class="divConfigSave" onclick="enter(2)">保存</span> '+
				'				        		</div> '+
				'				        	</div> '+
				'				        </div> '+
				'			        </div> '+
				'			        <div class="divConfigHide" id="divBindPhone" style="margin-top:35px"> '+
				'				        <div class="divConfigTitle" id="divBindPhoneTitle" onclick="bindPhoneConfig()"> '+
				'			        		<div class="divImg_2"> '+
				'			        			<img src="/resource/image/indexZJ/up_pass_04.png" width="20px" height="20px" style="margin:5px 0 0 7px"/> '+
				'			        		</div> '+
				'				        	<span class="divConfigTitleSpan_1">绑定手机</span> '+
				'				        	<span class="divConfigTitleSpan_3" id="isBindMobileTitle"></span> '+
				'				        	<img class="imgArrow" src="/resource/image/indexZJ/arrow-next.png" title="展开" onclick="showBindPhone()" id="showPhone"/> '+
				'					        <img class="imgArrow" src="/resource/image/indexZJ/arrow-prev.png" title="隐藏" onclick="hideBindPhone()" id="hidePhone" style="display:none;"/> '+
				'				        </div> '+
				'				        <!-- 绑定手机/展开页面 --> '+
				'				        <div style="height:193px;width:100%;display:none;" id="divBindPhoneContent"> '+
				'				        	<div style="width:100%;height:100%"> '+
				'				        		<div class="divBindPhoneContent"> '+
				'				        			<div class="divBindPhoneContent_2"> '+
				'				        				<span class="divOldPassContentSpan">手机号码</span> '+
				'				        				<INPUT type="text" style="width:150px;" id="phone" onblur="getObj(\'validateCode_2\').value=\'\';"> '+
				'				        			</div> '+
				'				        			<span class="divConfigButtom_2" style="float:right" onclick="getValidateCode_2(2)">获取验证码</span> '+
				'				        		</div> '+
				'				        		<div class="divBindPhoneContent"> '+
				'				        			<span class="divOldPassContentSpan">&nbsp;</span> '+
				'				        			<div style="float:left;width:150px;"> '+
				'				        				<INPUT type="text" style="width:150px;color:#99a1a3;" id="validateCode_2" value="短信验证码" onFocus="if(getObj(\'validateCode_2\').value==\'短信验证码\'){getObj(\'validateCode_2\').value=\'\';}"> '+
				'				        			</div> '+
				'				        			<span class="divPhonePasswordSpan_5" style="display:none;" id="errorValidateCode_2">验证码错误</span> '+
				'				        		</div> '+
				'				        		<div class="divOldPassContent_3" style="margin-left:165px;"> '+
				'				        			<span class="divConfigButtom_2" onclick="confirmBindMobile()">确定</span> '+
				'				        		</div> '+
				'				        	</div> '+
				'				        </div> '+
				'				        <!-- 绑定手机/绑定手机成功 --> '+
				'				        <div style="height:193px;width:100%;display:none;" id="divBindPhoneSuccess"> '+
				'				        	<div class="divBindPhoneSuccess"> '+
				'				        		<div class="divImg_5"> '+
				'				        			<img src="/resource/image/indexZJ/up_pass_06.png" width="25px" height="25px" style="margin:5px 0 0 5px"/> '+
				'				        		</div> '+
				'					        	<span class="divOldPassSuccessSpan">您好！您的手机已经绑定成功！</span> '+
				'					        	<span class="divPhonePasswordSpan_2" onclick="showUpdatePass()">修改密码</span> '+
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
//打开账号安全设置
function updatePassword(){
	document.body.style.overflow = "hidden";
	getObj("mask_div").style.height =  document.body.scrollHeight;
	getObj("mask_div").style.display="block";//遮罩层
	var obj = getObj("UPDATE_PASSWORD");
	obj.className = "floatDivCss";
	obj.style.display = "block";
	var top = 135;
	obj.style.top = document.body.scrollTop + top;
	//obj.style.top =  (document.body.clientHeight-obj.offsetHeight)/2;
	obj.style.left =  (document.body.clientWidth-obj.offsetWidth)/2;
	
	isBindMobile();
}
//关闭账号安全设置
function closeUpdatePassword(){
	getObj('UPDATE_PASSWORD').style.display = 'none';
	getObj('mask_div').style.display = 'none';
	document.body.style.overflow = 'auto';
	
	hideUpdatePass();
	hideBindPhone();
}
//判断是否绑定手机
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
	if(bindMobile === "") getObj("isBindMobileTitle").innerHTML = "未绑定手机，请绑定手机号码";
	else {
		bindMobileEncrypt = bindMobile.substring(0,2)+"*******"+bindMobile.substring(bindMobile.length-2,bindMobile.length);
		getObj("isBindMobileTitle").innerHTML = "已绑定手机"+bindMobileEncrypt;
	}
}
//获取对象
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
//展开修改密码界面
function showUpdatePass(){
	getObj("divUpdatePassword").className = 'divConfigShow';
	getObj("divUpdatePasswordTitle").style.background = '#ffffff';
	
	getObj("divUpdatePasswordContent").style.display = 'block';
	
	//隐藏绑定手机界面
	hideBindPhone();
	
	getObj("showPass").style.display = 'none';
	getObj("hidePass").style.display = 'block';
	
	updatePassFalg = 1;
	bindPhoneFalg = 0;
}
//隐藏修改密码界面
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
//展开绑定手机界面
function showBindPhone(){
	getObj("divBindPhone").className = 'divConfigShow';
	getObj("divBindPhoneTitle").style.background = '#ffffff';
	
	getObj("divBindPhoneContent").style.display = 'block';
	
	//隐藏修改密码界面
	hideUpdatePass();
	
	getObj("showPhone").style.display = 'none';
	getObj("hidePhone").style.display = 'block';
	
	validateCode_2.value = '短信验证码';
	phone.value = '';
	
	bindPhoneFalg = 1;
	updatePassFalg = 0;
}
//隐藏绑定手机界面
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
//旧密码改密
function updateOldPassword(){
	ps0.value = "";
	ps1.value = "";
	ps2.value = "";
	
	getObj("divUpdateOldPasswordContent").style.display = 'block';
	getObj("divUpdatePasswordContent").style.display = 'none';
}
//旧密码改密/取消
function updateOldPassword_cancel(){
	getObj("divUpdatePasswordContent").style.display = 'block';
	getObj("divUpdateOldPasswordContent").style.display = 'none';
}
//手机改密
function updatePhonePassword(){
	if(bindMobile == ""){
		EMsg("请绑定手机号码!");
		showBindPhone();
	}else{
		getValidateCode(1);
		validateCode_1.value = "";
		getObj("isBindMobileTitle_2").innerHTML = "已经发送到您的手机"+bindMobileEncrypt+"，请输入您接收到的验证码！";
		
		getObj("divUpdatePhonePasswordContent_1").style.display = 'block';
		getObj("divUpdatePasswordContent").style.display = 'none';
	}
}
//获取验证码
var currenCode = "";//当前验证码
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
					alert("手机号码“"+bindMobileEncrypt+"”已绑定，绑定手机号码失败!");
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
		if(isSuccessSendCode) alert("已经发送到您的手机"+bindMobileEncrypt+"，请输入您接收到的验证码！");
		else isSuccessSendCode = true;
	}
}
//校验验证码
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
//检查手机的位数是否正确
function checkPhone() {
    // 验证规则：11位数字，以1开头。
    re = /^1\d{10}$/;
    if (!re.test(phone.value)) {
        EMsg("手机的输入不符合规范!");
        return false;
    }
    return true;
}
//确定绑定手机号码
function confirmBindMobile(){
	if(getObj("validateCode_2").value == "" || getObj("validateCode_2").value == "短信验证码"){
		EMsg("请输入验证码!");
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
/////////////////////修改密码开始/////////////////////
function checkData()
{
	if(ps0.value == "")
	{
		EMsg("当前密码不能为空!");
		ps0.focus();
		return false;
	}
	if(ps1.value == "")
	{
		EMsg("新密码不能为空!");
		ps1.focus();
		return false;
	}
	if(ps2.value == "")
	{
		EMsg("确认密码不能为空!");
		ps2.focus();
		return false;
	}
	if(ps1.value != ps2.value)
	{
		EMsg("您两次输入的密码不一致!");
		ps1.focus();
		return false;
	}
	if(ps0.value == ps1.value)
	{
		EMsg("新密码不能和当前密码一致!");
		ps1.focus();
		return false;
	}
	
	return true;	
}
function checkData_2()
{
	if(ps3.value == "")
	{
		EMsg("新密码不能为空!");
		ps3.focus();
		return false;
	}
	if(ps4.value == "")
	{
		EMsg("确认密码不能为空!");
		ps4.focus();
		return false;
	}
	if(ps3.value != ps4.value)
	{
		EMsg("您两次输入的密码不一致!");
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
/////////////////////修改密码结束/////////////////////