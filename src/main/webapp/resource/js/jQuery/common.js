/**
 * ����js
 */
// ģ������ע��
if (pcs == null)
	var pcs = {};
if (pcs.common == null)
	pcs.common = {};

var url = document.location.pathname;
var itmp = url.indexOf("/", 1);
var webpath = itmp < 0 ? url : url.substr(0, itmp);
if (webpath.indexOf('/') == -1) {
	webpath = '/' + webpath;
}

pcs.common = {

	path : window.location.protocol + '//' + window.location.host + webpath,
	
	aclName : 'FRAMEWORK-ERROR-ACL-2',
	/**
	 * ��ҳ�Ĵ��� defaultHtml ���û���ҵ����ݣ����������ԭ������ʾ��panel��
	 */
	changePage : function(url, pageSize, xmlname, result, youfun, pagePanel,defaultHtml,current) {
		$(pagePanel).text('');
		pcs.common.beLoading(result);
		var totalRows = 'data.root.' + xmlname + '.page.totalRows';
		var currentpage = 'data.root.' + xmlname + '.page.currentPage';
		var i = 1;
		if(current != null && current != '' && current != undefined){
			i = current;
		}
		url = encodeURI(url);
		$.post(url, {
					PAGE_SIZE : pageSize,
					CURRENT_PAGE : i
				}, function(data) {
					if(data.success){
						if (eval(totalRows) != null && eval(totalRows) != undefined && eval(currentpage) != null && eval(currentpage) != undefined) {
							if (pagePanel != null && pagePanel != "" && eval(totalRows) > pageSize) {
								$(pagePanel).pagination(eval(totalRows), {
									items_per_page : pageSize,
									current_page : eval(currentpage) - 1,
									num_display_entries : 5,
									callback : function(page_id, panel) {
										$.post(url, {
													PAGE_SIZE : pageSize,
													CURRENT_PAGE : page_id + 1
												}, function(data) {
													pcs.common.showdata(data, xmlname, youfun, result, defaultHtml,eval(currentpage));
												}, "json");
									}
								});
							}
						}
						pcs.common.showdata(data, xmlname, youfun, result, defaultHtml,eval(currentpage));
					}
					else if(data.errors.errorcode == pcs.common.aclName){
						$(result).html('<li><em style="text-align: center;width:100%">��û�в鿴�б��Ȩ��</em></li>');
					}
					else{
						alert(data.errors.errmsg);
					}

					$(".list li").mouseover(function(){
					$(this).addClass("over");}).mouseout(function(){ 
						$(this).removeClass("over");})
					$(".list li:even").addClass("alt");
				}, "json");
					
	},
	/**
	 * ����ȴ�ͼƬ
	 */
	beLoading : function(result) {
		$(result).html('<em style="width:100%;text-align: center;"><img src="' + pcs.common.path + '/common/images/loader.gif"/></em>');
	},
	
	forLoading: function(result) {
		$(result).html('<li><em style="width:100%;text-align: center;"><img src="' + pcs.common.path + '/common/images/loader.gif"/></em></li>');
	},

	/**
	 * ��ʾ��ҳ����
	 */
	showdata:function(data,xmlname,youfun,result,defaultHtml,current) {
		$(result).text('');
		var t=true;
		if(eval('data.root.'+xmlname+'.rs')!=null && eval('data.root.'+xmlname+'.rs')!=undefined && eval('data.root.'+xmlname+'.rs.length')>0){
			$.each(eval('data.root.'+xmlname+'.rs'),function(i,n){
				youfun(this,$(result),i,n,current);
				t=false;
			})
		}
		if(t){
			$(result).append(defaultHtml);
		}
		$(".list li").mouseover(function(){
		$(this).addClass("over");}).mouseout(function(){ 
			$(this).removeClass("over");})
		$(".list li:even").addClass("alt");
	},
	/**
	 * ��ҳ�����б�
	 */
	listPage:function(url,xmlname,result,youfun,defaultHtml){
		url=encodeURI(url);
		$.post(url, {}, function(data) {
			if(data.success){
				pcs.common.showDictData(data,xmlname,youfun,result,defaultHtml);
			}
			else if(data.errors.errorcode == pcs.common.aclName){
				$(result).html('<li><em style="text-align: center;width:100%">��û�в鿴�б��Ȩ��</em></li>');
			}
			else{
				alert(data.errors.errmsg);
			}
		}, "json");
		$(".list li").mouseover(function(){
		$(this).addClass("over");}).mouseout(function(){ 
		$(this).removeClass("over");})
		$(".list li:even").addClass("alt");
	},

	/**
	 * ��ʾ��ҳ�ֵ�����
	 */
	showDictData:function(data,xmlname,youfun,result,defaultHtml) {
		var t=true;
		if(eval('data.root.'+xmlname+'.rs')!=null && eval('data.root.'+xmlname+'.rs')!=undefined && eval('data.root.'+xmlname+'.rs.length')>0){
			$.each(eval('data.root.'+xmlname+'.rs'),function(i,n){
				youfun(this,$(result),i,n);
				t=false;
			})
		}
		if(t){
			$(result).append(defaultHtml);
		}
	},
	
	/**
	 * ȡ�������ֵ�����
	 */
	getDictByPage : function(DICT_ID,CLASS_CODE,result,youfn){
		var url = pcs.common.path + '/json?action=QUERY_T_SYSTEM_STATUS_ACTION&STATUS_TYPE='+ DICT_ID;	//��ȡĳһ���ȫ������
		if(CLASS_CODE.length>0){	
			url = pcs.common.path + '/json?action=GET_T_SYSTEM_STATUS_ACTION&STATUS_TYPE='+ DICT_ID+'&STATUS_CODE='+CLASS_CODE;//��ȡĳһ���ָ��������
		}
		url=encodeURI(url);
		var xmlname='T_SYSTEM_STATUS';
		pcs.common.listPage(url,xmlname,result,youfn);
	},
	
	/**
	 * ȡ�û�������
	 */
	getBaseIno : function(type,result,youfn){
		var url = pcs.common.path + '/json?action=QUERY_T_BASE_INFO_BY_CONDITION_ACTION&TYPE='+type;
		url=encodeURI(url);
		var xmlname='T_BASE_INFO';
		pcs.common.listPage(url,xmlname,result,youfn);
	},
	
	/**
	 * ����URL�еĲ���ֵ������JSP�е�request.getParamter('id'); 
	 * �÷���var strGetQuery =document.location.search; var id = pcs.common.getQueryString(strGetQuery,'id');
	 */
	getQueryString : function (url,name){
		var reg = new RegExp("(^|\\?|&)"+ name +"=([^&]*)(\\s|&|$)", "i");
		if (reg.test(url)){
			return unescape(RegExp.$2.replace(/\+/g, " "));
		}
		return "";
	},
	
	/**
	 * ȥ�����������ָ�����Ŵ���
	 */
	ellipsis : function(str, maxlength, suffix) {
		if (str.length <= maxlength) {
			return str;
		} else {
			return str.substr(0, maxlength - 0) + suffix
		}
	},
	
	/**
	 * ȡ���û�session
	 */
	getUserSession : function(fn, flag,flag_parent) {
		var url = pcs.common.path + '/json?action=GET_SESSION_USER_ACTION';
		var userinfo = {
			ACCOUNT : '',
			PK_USER : '',
			USER_NAME : '',
			TEMP_PASSWORD : '',
			MOBILE : '',
			PHONE : '',
			EMAIL : '',
			REMARK : '',
			USER_LEVEL : '',
			USER_TYPE : '',
			DATA_VALUES : '',
			CREATE_DATE : '',
			LAST_LOGIN_TIME : '',
			LAST_LOGIN_IP : ''
		};
		$.post(url,{}, function(data) {
				if(data.success){
					if(data.root.SESSION_ID.rs[0] == null || data.root.SESSION_ID.rs[0] == undefined){
						if(flag){
							alert("�Բ�������δ��¼���¼��ʱ�������µ�¼��");
						}
						if(flag_parent){
							window.parent.parent.location.href=pcs.common.path + '/index.html';
						}
						else{
							window.parent.location.href=pcs.common.path + '/index.html';
						}
					}
					else{
						userinfo = {
							ACCOUNT : data.root.SESSION_BEAN.rs[0].ACCOUNT,
							PK_USER : data.root.SESSION_BEAN.rs[0].SYSUSER_ID,
							USER_NAME : data.root.SESSION_BEAN.rs[0].USER_NAME,
							TEMP_PASSWORD : data.root.SESSION_BEAN.rs[0].TEMP_PASSWORD,
							MOBILE : data.root.SESSION_BEAN.rs[0].MOBILE,
							PHONE :data.root.SESSION_BEAN.rs[0].PHONE,
							EMAIL : data.root.SESSION_BEAN.rs[0].EMAIL,
							REMARK : data.root.SESSION_BEAN.rs[0].REMARK,
							USER_LEVEL : data.root.SESSION_BEAN.rs[0].USER_LEVEL,
							USER_TYPE : data.root.SESSION_BEAN.rs[0].USER_TYPE,
							DATA_VALUES : data.root.SESSION_BEAN.rs[0].DATA_VALUES,
							CREATE_DATE : data.root.SESSION_BEAN.rs[0].CREATE_DATE,
							LAST_LOGIN_TIME : data.root.SESSION_BEAN.rs[0].LAST_LOGIN_TIME,
							LAST_LOGIN_IP : data.root.SESSION_BEAN.rs[0].LAST_LOGIN_IP
						}
						if(userinfo.TEMP_PASSWORD != ''){
							var temp_url = pcs.common.path +  "/sysmanage/password.html?tage=temppassword";
							$("#mainFrame",parent.document.body).attr('src',temp_url);
						}
					}
					if(fn!=null || fn!=undefined){
						fn(userinfo);
					}
				}
				else{
					alert(data.errors.errmsg);
					if(flag_parent){
						window.parent.parent.location.href=pcs.common.path + '/index.html';
					}
					else{
						window.parent.location.href=pcs.common.path + '/index.html';
					}
				}
		}, "json");		
	},
	
	/**
	 * ��֤��ǰҳ��Ĳ�����ť�Ƿ���ʾ
	 * @param {} permissionNames
	 * @param {} actionNames
	 * @param {} fn
	 */
	hasPermission : function(permissionNames, actionNames, fn){ 
		$.ajax({
			type: 'post',
			url: pcs.common.path + '/json',
			data: 'action=VALIDATOR_PERMISSION_ACTION&PERMISSION_NAME='+ permissionNames + '&ACTION_NAME='+actionNames,
			dataType: 'json',
			async: false,
			success:function(data){
				if(data.success){
					fn(data);
				}
				else{
					alert(data.errors.errmsg);
				}
			}
		})
	},

	/**
	 * �Զ��嵯����optionsΪ��ѡ����
	 */
	showDialog : function(msg, options) {
		var settings = {
			modal : true,
			overlay : {
				opacity : 0.5,
				background : "black"
			},
			resizable : false,
			height : 200,
			width : 300,
			xtype : 'ok',
			fontsize : '14px',
			url : '',
			btnValue : 'ȷ��',
			url2 : '',
			btnValue2 : 'ȷ��2'
		};
		if (options != null) {
			jQuery.extend(settings, options);
		}
		var ximage = project_root + '/common/images/';
		switch (settings.xtype) {
			case 'ok' :
				ximage += 'ok_1.gif';
				break;
			case 'error' :
				ximage += 'error_1.gif';
				break;
			case 'info' :
				ximage += 'info_1.gif';
				break;
			case 'message' :
				ximage += 'message_1.gif';
				break;
			default :
				ximage += 'ok_1.gif';
				break;
		}
		var onclickfn = '';
		var btnStyle = 'margin-left:15px;BORDER-RIGHT: #7EBF4F 1px solid; PADDING-RIGHT: 2px; BORDER-TOP: #7EBF4F 1px solid; PADDING-LEFT: 2px; FONT-SIZE: 14px; FILTER: progid:DXImageTransform.Microsoft.Gradient(GradientType=0, StartColorStr=#ffffff, EndColorStr=#B3D997); BORDER-LEFT: #7EBF4F 1px solid; CURSOR: hand; COLOR: black; PADDING-TOP: 2px; BORDER-BOTTOM: #7EBF4F 1px solid';
		if (settings.url != '') {
			onclickfn = "window.location.href='" + settings.url + "'";
		} else {
			onclickfn = "$(this).parent().parent().dialog(\'close\');";
		}
		var sBtn1 = '<input type="button" style="' + btnStyle + '" value="'
				+ settings.btnValue + '" onclick="' + onclickfn + '"/>';
		var sBtn2 = '';
		if (settings.url2 != '') {
			onclickfn = "window.location.href='" + settings.url2 + "'";
			sBtn2 = '<input type="button" style="' + btnStyle + '" value="'
					+ settings.btnValue2 + '" onclick="' + onclickfn + '"/>';
		} else {
			onclickfn = "$(this).parent().parent().dialog(\'close\');";
		}
		var str = '<div id="diaglog" class="flora"><img style="padding-right:15px;padding-left:5px;" src="'
				+ ximage
				+ '" alt="" align="absmiddle"/><span style="font-size:'
				+ settings.fontsize
				+ ';padding-bottom:-10px;">'
				+ msg
				+ '</span><div align="center" style="padding-top:25px;">'
				+ sBtn1 + sBtn2 + '</div></div>';
		$(str).dialog(settings);
	},

	/**
	 * ѡ������ָ��name�����
	 */
	allCheck : function(name) {
		$("input[name=" + name + "]").each(function() {
					$(this).attr("checked", true);
				});
	},
	
	/**
	 * ȥ������ָ��name�����
	 */
	desCheck : function(name) {
		$("input[name=" + name + "]").each(function() {
					$(this).attr("checked", false);
				});
	},
	
	/**
	 * �ַ�����ָ�����ַ�����ָ����ʽ��ʾ
	 */ 
	setStringHtmlCss : function(t, s, h, c) {
		return t.replace(eval('/' + s + '/g'), '<' + h + ' class="' + c + '">'	+ s + '</' + h + '>');
	},
	
	/**
	 * 	imgId:�������ʾλ�õ�id��xtype;��ʾ����eg,src,value��def_SessionName������һ��session���֣�����Ĭ��
	 */
	getRandcode : function(imgId, xtype, def_SessionName) {
															
		$('#' + imgId).attr(xtype,"/public/rndcode.jsp?" + Math.random() + '&sessionName=' + def_SessionName);
	},
	
	/**
	 * ȡCookie
	 */ 
	getCookie : function(name) {
		var strCookie = document.cookie;
		var arrCookie = strCookie.split("; ");
		for (var i = 0; i < arrCookie.length; i++) {
			var arr = arrCookie[i].split("=");
			if (arr[0] == name) {
				if (arr[1] == '' || arr[1] == null || arr[1] == undefined) {
					return "";
				} else {
					return arr[1];
				}
			}
		}
		return "";
	},
	
	/**
	 * ����js�ű���html��ǩ
	 */ 
	noHTML : function(htmlString) // ȥ��HTML���
	{
		htmlString = htmlString.replace(/\\&[a-zA-Z]{1,10};/ig, '');
		htmlString = htmlString.replace(/<[^>]*>/ig, ''); 
		htmlString = htmlString.replace(/[(\/>)<]/ig, '');
		return htmlString;
	},
	
	/**
	 * ȡ�����������
	 */
	getBrowser : function() {
		var browser;
		if ($.browser.msie) {
			browser = "msie";
		} else if ($.browser.safari) {
			browser = "safari";
		} else if ($.browser.mozilla) {
			browser = "mozilla";
		} else if ($.browser.opera) {
			browser = "opera";
		} else {
			browser = "unknown";
		}
		return browser;
	},
	
	/**
	 * ���ܣ�ת��ʱ���ʽ
	 * ����: datetime Ϊ����ʱ�䣬format Ϊʱ���ʽ
	 */
	toChar:function(datetime, format) {
		if(datetime=="" || datetime==null || datetime==undefined){
			return "";
		}else{
			var date = new Date(datetime);
			var yyyy = date.getFullYear();
			var mm = date.getMonth()+1;
			var dd = date.getDate();
			var hh24 = date.getHours();
			var mi = date.getMinutes();
			var ss = date.getSeconds();
			var s1 = format.replace(/yyyy|YYYY/g, yyyy);
			var s2 = s1.replace(/mm|MM/g,mm<10 ? "0" + mm : mm);
			var s3 = s2.replace(/dd|DD/g,dd<10 ? "0" + dd : dd);
			var s4 = s3.replace(/hh24|HH24/g,hh24<10 ? "0" + hh24 : hh24);
			var s5 = s4.replace(/mi|MI/g,mi<10 ? "0" + mi : mi);
			var s6 = s5.replace(/ss|SS/g,ss<10 ? "0" + ss : ss);
			return s6;
		}		
	},
	
	/**
	 * ���ܣ��ж��Ƿ�Ϊ����
	 * ������
	 * numstr����Ҫ��֤���ַ���
	 * �÷���
	 * isNumber('123');//����:true;
	 */
	isNumber:function(numstr) {
		var i,j,strTemp; 
		strTemp = "0123456789"; 
		if (numstr.length== 0)	{ return false; }
		for (i=0;i<numstr.length;i++) {
			j = strTemp.indexOf(numstr.charAt(i)); 
			if (j == -1)return false; 
		} 
		return true; 
	},
	
	hideStatus:function(){
		window.status=' ';
	},
	
	debug:function(e){
		//��ӡ�쳣��Ϣ�����ߺ�ע�͵�alert(e.message)
		alert("����ʧ��");
	},
		/**
 * ����URL�еĲ���ֵ������JSP�е�request.getParamter('name'); 
 * �÷���var value = getUrlParameter('name');
 * 
 * @param {String}
 *            ��������
 * @return {String}
 */
 
getUrlParameter:function(name) {  
	var value = "";
	var search = document.location.search;
	if (search == null || search == "" || name == null || name == "")
		return value;
	search = search.toLowerCase();
	name = name.toLowerCase();
	name += "=";
	var itmp = search.indexOf(name); 
	if (itmp < 0) {
		return value;
	}
	search = search.substr(itmp + name.length);
	itmp = search.indexOf("&");
	if (itmp < 0) {
		return search;
	} else {
		search = search.substr(0, itmp);
		return search;
	}
}
};



function nullToEmpty(str,len){
	 var content = str; 
	 if(isEmpty(str)){
	 	if(len == -4 || len == -5  || len == -6 ||len == -7 || len == 0){
	 		return '';
	 	}else if(len == -100 ){
	 	    return pcs.common.path() + '/common/images/error_1.gif';
	 	}else{
	 	  	return '&nbsp;';
	 	 }
	 }else if(len > 0){
	    if(str.length > len){content = str.substring(0,len) + '...';}
	 }else if(len == -1){
	    content = dateToString(str,'yyyy-MM-dd HH:mm:ss');
	 }else if(len == -2){
	    content =  dateToString(str,'yyyy-MM-dd');
	 }else if(len == -3){
	     content = dateToString(str,'HH:mm:ss');
	 }else if(len == -4){
	    content = dateToString(str,'yyyy-MM-dd HH:mm:ss');
	 }else if(len == -5){
	    content =  dateToString(str,'yyyy-MM-dd');
	 }else if(len == -6){
	     content = dateToString(str,'HH:mm:ss');
	 }else if(len == -7){
	    content = dateToString(str,'yyyy-MM-dd HH:mm');
	 }
 return content;
}
function isEmpty(str){
	 if(str == ''|| str == null || str == undefined || str == NaN){
	   return true;
	 }
	 return false;
}

function dateToString(dateVal,format) {
	 if(dateVal==null||dateVal==''){
		  s6='&nbsp;'
	 }else{
		 var date = new Date(dateVal);
		 var yyyy = date.getFullYear();
		 var MM = date.getMonth()+1;
		 var dd = date.getDate();
		 var HH = date.getHours();
		 var mm = date.getMinutes();
		 var ss = date.getSeconds();
		 var s1 = format.replace(/yyyy/g, yyyy);
		 var s2 = s1.replace(/MM/g,MM<10 ? "0" + MM : MM);
		 var s3 = s2.replace(/dd/g,dd<10 ? "0" + dd : dd);
		 var s4 = s3.replace(/HH/g,HH<10 ? "0" + HH : HH);
		 var s5 = s4.replace(/mm/g,mm<10 ? "0" + mm : mm);
		 var s6 = s5.replace(/ss/g,ss<10 ? "0" + ss : ss);
	 }
 return s6;
}

 
