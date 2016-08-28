<!-- 同时可选择多个部门 -->
<%@ page contentType="text/html; charset=gbk" language="java"%>
<HTML XMLNS:IE>
	<head>
		<META http-equiv="Content-Type" content="text/html; charset=gbk">
		<title>部门选择</title>
		<SCRIPT src="../Common.js"></SCRIPT>
		<SCRIPT src="../Dialog.js"></SCRIPT>
		<SCRIPT src="../Error.js"></SCRIPT>
		<SCRIPT src="../stringUtil.js"></SCRIPT>
		<SCRIPT src="../XML.js"></SCRIPT>
		<SCRIPT src="../XMLTree/XMLTree.js"></SCRIPT>
		<SCRIPT src="../XMLTree/XMLTreeAction.js"></SCRIPT>
		<SCRIPT src="../ChoiceDialog.js"></SCRIPT>
		<SCRIPT>
		var privilegeTree = null;
		var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		var url = "/servlet/staff_manage?";
		var addIds = new Array()
		var delIds = new Array()
		var allIds = null;
		var allNames = new Array();
		Array.prototype.indexOf = function(Object){  
			for(var i = 0;i<this.length;i++){  
				if(this[i] == Object){  
				    return i;  
				}  
			}  
			return -1;  
		}
		function init() {
			//$('#prvTreeDis').show()
			allIds = new Array();
			var checkAction = new CheckAction();
			var loadAction = new LoadAction();
			privilegeTree = new XMLTree();
			privilegeTree.xmlUrl = "/servlet/staffmenu?action=0";
			privilegeTree.showType = 'checkbox';
			privilegeTree.showDepth = 100;
			privilegeTree.isRightFireOnClick = false;
			privilegeTree.itemClickEvent = 'priItemClick()';
			privilegeTree.setLoadAction(loadAction);
			privilegeTree.setCheckBoxClickAction(checkAction);
			privilegeTree.showAt(prvTreeDIV);
		}
		
		function priItemClick() {
			event.srcElement.previousSibling.click();
		}
		function LoadAction() {
			this.parent = new XMLTree_onLoad_Action;
			this.parent.load = function() {
				//if(action == 1){
					//初始化已经选择的部门
					loadCheck();
				//}
			}
			return this.parent;
		}
		
		function loadCheck() {
			var checkedItems = window.dialogArguments;
			var oCheck;
			var oItem;
			//alert(checkedItems);
			for (var i = 0; i < checkedItems.length; i++) {
				var id = checkedItems[i];
				allIds.push(id);
				//allNames.push(checkedItems[i]);
				oItem = document.getElementById(id);
				if (oItem) {
					oCheck = oItem.previousSibling;
					allNames.push(oItem.ORG_NAME);
					oCheck.checked = true;
				}
			}
		}
		
		function getIdbyName(pName) {
			var dataObjs = document.all;
			for (var i = 0; i < dataObjs.length; i++) {
				if (dataObjs.item(i).tagName === 'NOBR') {
					//alert(dataObjs.item(i).ORG_NAME);
					//alert(dataObjs.item(i).id)
					if (dataObjs.item(i).ORG_NAME === pName) {
						return dataObjs.item(i).id;
					}
				}
			}
		}
		
		function CheckAction() {
			this.parent = new XMLTree_onCheckBoxClick_Action;
			this.parent.check = function(oCheckBox, oItem) {
				var priId = oItem.id;
				var orgName = oItem.ORG_NAME;
				// alert(oItem.ORG_NAME);
				if (oCheckBox.checked) // 添加
				{
					if (allIds.indexOf(priId) == -1) {
						allIds.push(priId)
						allNames.push(orgName)
					}
				} else // 删除
				{
					idx = allIds.indexOf(priId)
					if (idx != -1) {
						delete allIds[idx];
						delete allNames[idx];
					}
				}
			}
			return this.parent;
		}
		// 保存
		function getSelected() {
			var obj = allIds.join(' ').trimall().replace(/\s+/g, ',');
			// alert(obj);
			window.returnValue = {
				'ids' : obj,
				'names' : allNames.join(' ').trimall().replace(/\s+/g, ','),
		        'type' : 'insure'
			};
			window.close();
		}
		function concal() {
			window.returnValue = {
				'ids' : '',
				'names' : '',
		        'type' : 'close'
			};
			window.close();
		}
		</SCRIPT>
<STYLE>
.xmlTable {
	behavior: url(../../resource/htc/table.htc);
	cursor: hand;
}
body{background-color:#EFF4FE;margin:0;padding:0;}
</STYLE>
</head>
<body onload='init()'>
<div id='orgDiv' style="width: 100%; height: 320px; overflow: auto; padding: 1px;background-color:#FFFFFF;">
	<div id='prvTreeDIV'></div>
</div>
<div style="text-align:center;padding-top:10px;border-top:1px solid #94B0CB;">
	<input type="button" id="test" value=" 确定 " onclick="getSelected()" style="cursor:hand;"/>
	<input type="button" id="test" value=" 取消 " onclick="concal()" style="margin-left:15px;cursor:hand;"/>
</div>
</body>
</html>
