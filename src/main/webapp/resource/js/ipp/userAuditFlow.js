Ext.namespace("bosswg.ipp");
Ext.LoadMask.prototype.msg = "����������...";
Ext.BLANK_IMAGE_URL = '../../resource/js/ext-2.0.2/resources/images/default/s.gif';
Ext.QuickTips.init();
// ************************************

bosswg.ipp.MainPanel = function(config) {
	this.config = config || {};
    this.myDetailsTemplate = new Ext.XTemplate(
            '<div >' +
            '	<table class="MyTABLE" width="100%" height="120px" border="0">' +
            '<tr>' +
              '<td width="133"  bgcolor="#dfe8f7" align="right">�û���[����]��</td>' +
              '<td width="150">&nbsp;{REAL_NAME}</td>' +
              '<td width="133"  bgcolor="#dfe8f7" align="right">�û���[Ӣ��]��</td>' +
              '<td width="180">&nbsp;{ALIAS_NAME}</td>' +
            '</tr>' +
            '<tr>' +
              '<td  bgcolor="#dfe8f7" align="right">����ʱ�䣺</td>' +
              '<td>&nbsp;{GENERATE_TIME}</td>' +
              '<td  bgcolor="#dfe8f7" align="right">����������</td>' +
              '<td>&nbsp;{REGION_NAME}</td>' +
            '</tr>' +
            '<tr>' +
              '<td  bgcolor="#dfe8f7" align="right">ע���ֻ��ţ�</td>' +
              '<td>&nbsp;{PHONENUMBER}</td>' +
              '<td  bgcolor="#dfe8f7" align="right">ע�����䣺</td>' +
              '<td>&nbsp;{MAIL}</td>' +
             '</tr>' +
             '<tr>' +
              '<td  bgcolor="#dfe8f7" align="right">����</td>' +
                '<td>&nbsp;{GRADE:this.gradeJson()}</td>' +
                '<td  bgcolor="#dfe8f7" align="right">�Ƿ���Ȩ��</td>' +
                '<td>&nbsp;{ADVAN_USER:this.advanUser()}</td>' +
                   '</tr>' +
          '</table>' +   
            '</div>',
              {
                gradeJson : function (val) {
                  if(val==0){
				  	  return 'һ��'
				    }else{
				    	 return '����'
				    }
                },
                advanUser : function (val) {
                  if(val=='0SA'){
				  	  return '��'
				    }else{
				    	 return '��'
				    }
                }
            }
           
    ).compile();
     this.details = new Ext.Panel({
     	region:'north',
     	height:150,
        border: false
    });
    this.option = new Ext.form.TextArea({
				name : 'option',
				fieldLabel : '������',
				allowBlank:false,
				blankText:'�������Ϊ��',
				maxLength:1998,
				height:150,
				style : 'margin-top:2px',
				// style : 'padding:5,0,0,5;margin-bottom:5',
				anchor : '98%',
				labelSeparator : '��'
			})
    	this.submitForm = new Ext.FormPanel({
				labelWidth : 100,
				region:'center',
				border : false,
				frame : false,
				autoScroll : true,
				buttonAlign:'right',
				buttons:[{text:'ͨ��',handler:this.onToAdoptFn,scope:this},{text:'��ͨ��',handler:this.unAdoptFn,scope:this}],
				items : [this.option]
			})
	bosswg.ipp.MainPanel.superclass.constructor.call(this, {
		closable : true,
		draggable : false,
		autoScroll : true,
		layout : 'border',
		items : [this.details,this.submitForm]
		});
    this.on('afterlayout',this.onAfterlayoutFn,this,{single:true});
}

Ext.extend(bosswg.ipp.MainPanel, Ext.Panel, {
			onToAdoptFn:function(){
				this.onSubmit('0SA')
			},
			unAdoptFn:function(){
				this.onSubmit('0SX')
			},
			onSubmit:function(opType){
					if (this.submitForm.form.isValid()) {
						params={
							opType:opType,
							userId:this.config.audit_info_id
						};
			        this.submitForm.form.submit({
						waitMsg : '�����ύ��...',
						waitTitle : '��Ϣ',
						params : params,
						url : '/servlet/ippAction.do?method=ckUserAuditInfo',
						method : 'post',
						failure : function(form, action) {
							Ext.MessageBox.alert('����', '��д������û��ͨ����֤');
						},
						success : function(form, action) {
							if (action.result.success == true) {
								Ext.MessageBox.alert('�ɹ�', '�����Ѿ�����');
								window.close();
							} else {
								Ext.MessageBox.alert('ʧ��', '���ݱ���ʧ��,�����³���');
							}
						},
						scope : this
					});
		         }
			},
			fireResize : function() {
				var e = document.body;
				this.setSize(e.clientWidth, e.clientHeight);
				this.doLayout();
			},
			onAfterlayoutFn:function(){
				var url = '/servlet/ippAction.do?method=ckUserDeleteEventQ&userId='
						+ this.config.audit_info_id;
				var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
				sendRequest.open("post", url, false);
				sendRequest.send(null);
			
				var responseInfo = Ext.util.JSON.decode(sendRequest.responseText);
				var userInfo=		responseInfo.userInfoRow;
			    this.myDetailsTemplate.overwrite(this.details.body,userInfo[0]);
			}
		});
		
function initPage() {
	var par = getURLSearch()||{};
	//alert(par.audit_info_id);
		var e = document.body;
		Ext.EventManager.onWindowResize(fireResize);
	var md=new bosswg.ipp.MainPanel(par);
    var showP=new Ext.Window({
    	width : e.clientWidth-3.8,
		height : e.clientHeight-4.1,
		x:0,
		y:0,
		closable:false,
		resizable : false,
		draggable:false,
    	title:'�����Ϣ',
    	layout:'fit',
    	items:[md]
    })
    showP.show();
    function fireResize() {
				var e = document.body;
				showP.setSize(e.clientWidth-3.8, e.clientHeight-4.1);
				
			}
}

function getURLSearch()
{
	var strSearch = location.search;
	var reg1 = /=/gi;
	var reg2 = /&/gi;
	strSearch = strSearch.substr(1, strSearch.length);
	strSearch = strSearch.replace(reg1, '":"');
	strSearch = strSearch.replace(reg2, '","');
	if (strSearch == "")
		return null;
	else
		strSearch = '{"' + strSearch + '"}';
	eval("var ArrayUrl=" + strSearch);
	return ArrayUrl;
}