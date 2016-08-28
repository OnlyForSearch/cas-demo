/******************��־����******************/
Ext.namespace("agentdeploy.log");
Ext.BLANK_IMAGE_URL = '../../resource/js/ext/resources/images/default/s.gif';
agentdeploy.log.logPanel = function(config) {
	Ext.QuickTips.init();
	this.log = {
		xtype:'htmleditor',
		fieldLabel:'��־��Ϣ',
		anchor:'100%',
		height:600,
		value:config.log,
		enableSourceEdit : true,
		disabled : true,
		enableLinks : false, // ���ǰ����ӵİ�ťȥ��.
		enableLists : false, // ���ǰ�list �����ȥ��,
		fontFamilies : []
		
	};
	agentdeploy.log.logPanel.superclass.constructor.call(this, {
				autoHeight : true,
				bodyStyle : 'background:#dfe8f6',
				frame : true,
				layout:'form',
				buttonAlign : 'center',
				viewConfig : {
					forceFit : false,
					rowSelectorDepth : 50

				},
				items : [this.log],
				buttons:[{
					text:'ȷ��',
					handler:function(){
						window.close();
					}
				}]
			});
}
Ext.extend(agentdeploy.log.logPanel, Ext.Panel, {});
function initLogLoad() {

	var w = window.screen.width - 45;
	var h = window.screen.height - 85;
	var params = window.dialogArguments;
	if(!params){
		params={}
	}
	//��ȡ��־��Ϣ
	var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
	sendRequest.open("GET", '../../servlet/DeployAgentServlet?action=17&fileName='
						+ params.fileName+".log", false);
	sendRequest.send(null);
	if (sendRequest.readyState == 4 && sendRequest.status == 200)
	{
				params.log = sendRequest.responseText;
	}
	var logPanel = new agentdeploy.log.logPanel(params);

	var win;
	if (!win) {
		win = new Ext.Window({
					layout : 'fit',
					title : params.ptitle,
					iconCls : 'objectIco',
					collapsible : false,
					closable : false,
					draggable : false,
					resizable : false,
					modal : true,
					y : 0,
					width : w,
					height : h,
					constrain : true,
					items : [logPanel]
				});

	}

	win.show();

}