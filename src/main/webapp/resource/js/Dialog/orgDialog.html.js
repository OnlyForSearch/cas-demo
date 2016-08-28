
/* luodh test ext Itsm */
Array.prototype.indexOf = function(substr, start) {
	var ta, rt, d = '\0';
	if (start != null) {
		ta = this.slice(start);
		rt = start;
	} else {
		ta = this;
		rt = 0;
	}
	var str = d + ta.join(d) + d, t = str.indexOf(d + substr + d);
	if (t == -1)
		return -1;
	rt += str.slice(0, t).replace(/[^\0]/g, '').length;
	return rt;
}

Array.prototype.lastIndexOf = function(substr, start) {
	var ta, rt, d = '\0';
	if (start != null) {
		ta = this.slice(start);
		rt = start;
	} else {
		ta = this;
		rt = 0;
	}
	ta = ta.reverse();
	var str = d + ta.join(d) + d, t = str.indexOf(d + substr + d);
	if (t == -1)
		return -1;
	rt += str.slice(t).replace(/[^\0]/g, '').length - 2;
	return rt;
}

// 添加唯一的值
// func 对象比对函数
Array.prototype.addUnique = function(item, func) {
	for (var i = 0; i < this.length; i++) {
	    var curItem = this[i]
	    var bitem = item
	    if (func != null){
	        curItem = func(curItem)
	        bitem = func(item)
	    }
		if ( curItem == bitem) {
			return
		}
	}
	this.push(item)
}

Array.prototype.replace = function(reg, rpby) {
	var ta = this.slice(0), d = '\0';
	var str = ta.join(d);
	str = str.replace(reg, rpby);
	return str.split(d);
}
String.prototype.endWith = function(str) {
	if (str == null || str == "" || this.length == 0
			|| str.length > this.length)
		return false;
	if (this.substring(this.length - str.length) == str)
		return true;
	else
		return false;
	return true;
}

Array.prototype.search = function(reg) {
	var ta = this.slice(0), d = '\0', str = d + ta.join(d) + d, regstr = reg
			.toString();
	reg = new RegExp(regstr.replace(/\/((.|\n)+)\/.*/g, '\\0$1\\0'), regstr
					.slice(regstr.lastIndexOf('/') + 1));
	t = str.search(reg);
	if (t == -1)
		return -1;
	return str.slice(0, t).replace(/[^\0]/g, '').length;
}


var privilegeTree = null;
var action = 1
var delPri = new ActiveXObject("Microsoft.XMLDOM");
var addPri = new ActiveXObject("Microsoft.XMLDOM");
var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var url = "/servlet/staff_manage?";
var isLoadPri = false;
var delPriRoot;
var addPriRoot;
var staffId = 0;
var addIds = new Array()
var delIds = new Array()
var allIds = new Array();
var allNames = new Array();



function init() {
	staffId = 1;
	allIds = new Array();
	$('#prvTreeDis').show()
	var loadAction = new LoadAction();
	var checkAction = new CheckAction();
	privilegeTree = new XMLTree();
	privilegeTree.xmlUrl = "/servlet/staffmenu?action=0";
	privilegeTree.showType = 'checkbox';
	privilegeTree.showDepth = 100;
	privilegeTree.isRightFireOnClick = false;
	privilegeTree.itemClickEvent = 'priItemClick()';
	privilegeTree.setLoadAction(loadAction);
	privilegeTree.setCheckBoxClickAction(checkAction);
	privilegeTree.showAt(prvTreeDIV);
	// iniPriXML()
}

function iniPriXML() {
	delPriRoot = delPri.createElement("DelPri");
	delPri.appendChild(delPriRoot);

	addPriRoot = addPri.createElement("AddPri");
	addPri.appendChild(addPriRoot);
}

function priItemClick() {
	event.srcElement.previousSibling.click();
}

function LoadAction() {
	this.parent = new XMLTree_onLoad_Action;
	this.parent.load = function() {
		if(action == 1){
			//linjl 2010-9-9
			//初始化已经选择的部门
			//loadCheck();
		}
	}
	return this.parent;
}

function loadCheck() {
	var checkedItems = window.dialogArguments;
	var oCheck;
	var oItem;
	//alert(checkedItems);
	for (var i = 0; i < checkedItems.length; i++) {
		var id = getIdbyName(checkedItems[i]);
		allIds.push(id);
		allNames.push(checkedItems[i]);
		oItem = document.getElementById(id);
		if (oItem) {
			oCheck = oItem.previousSibling;
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
		TagName = "Pri";
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

function checkData() {
	if (!checkSubmit(StationMsg.XMLDocument, noNullFiledName, noNullFiledLabel)) {
		return false;
	}
	return true;
}

String.prototype.trim = function() {
	// 用正则表达式将前后空格
	// 用空字符串替代。
	return this.replace(/(^\s*)|(\s*$)/g, "");
}

// 保存
function getSelected() {
	var obj = allIds.join(' ').trim().replace(/\s+/g, ',');
	// alert(obj);
	// alert(allNames.join(',')); .trim().replace(' ',',')
	window.returnValue = {
		'ids' : obj,
		'names' : allNames.join(' ').trim().replace(/\s+/g, ','),
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

function onpageload() {
	init();
}
