var selfName = "index_JT_Menu.js";
var menuUrl = getRealPath("../../servlet/menu?id=",selfName);
var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
var resultXml;
var mainLevel;
var viewLevel;
var subMenuPrefix;
var mainMenuPrefix;
var subMenuBarPrefix;
var menuButtonPrefix;
var indexPrivilegeId;

var closeTimer;
var subMenuActive;
var mainMenuActive;
var activeMenuPrivilegeId;

function initMenu() {
	Ext.onReady(function(){
		Ext.QuickTips.init();

		mainLevel = 2; //主页顶层菜单
		viewLevel = 5; //显示菜单层级(默认显示三级菜单)
		subMenuPrefix = 'SUB_MENU_';
		mainMenuPrefix = 'MAIN_MENU_';
		subMenuBarPrefix = 'TOOLBAR_';
		menuButtonPrefix = 'BUTTON_';
		indexPrivilegeId = 10; //'主页'菜单ID
	
		var menuHtml;
		var parentId = -1;
		var menuDiv = document.getElementById('topMenu');
		xmlhttp.Open("POST", menuUrl+parentId+'&action=10&level='+viewLevel, false);
		xmlhttp.send();
		if (isSuccess(xmlhttp)) {
			var aMenu;
			var subMenuId;
			var mainMenuId;
			var scriptName;
			var privilegeId;
			var privilegeName;
			var serverUrlName;
			var customUrlName;
			resultXml = xmlhttp.responseXML;
			var mainMenus = resultXml.selectNodes("/root/rowSet[@MENU_LEVEL='" + mainLevel + "']");
			
			menuHtml = '<ul class="top_menu">';
			for (var i=0; i<mainMenus.length; i++) {
				scriptName = mainMenus[i].getAttribute('SCRIPT_NAME');
				privilegeId = mainMenus[i].getAttribute('PRIVILEGE_ID');
				privilegeName = mainMenus[i].getAttribute('PRIVILEGE_NAME');
				serverUrlName = mainMenus[i].getAttribute('SERVER_URL_NAME');
				customUrlName = mainMenus[i].getAttribute('CUSTOM_URL_NAME');	
				subMenuId = subMenuPrefix + privilegeId;
				mainMenuId = mainMenuPrefix + privilegeId;
				
				if (hasSubMenus(resultXml, privilegeId)) {
					buildSubMenus(resultXml, privilegeId, subMenuId, mainMenuId);
				
					aMenu = '<li><a href="#" id="' + mainMenuId + '" onmouseover="showSubMenu(\'' + mainMenuId + '\', \'' + subMenuId + '\')" ' 
								+ 'onmouseout="hideSubMenu(\'' + subMenuId + '\', \'' + mainMenuId + '\', event, true)">'
								+'<span id="' + privilegeId + '" onclick="' + scriptName + '" SERVER_URL_NAME="' + serverUrlName + '" CUSTOM_URL_NAME="' 
									+ customUrlName + '" PRIVILEGE_ID="' + privilegeId + '">' + privilegeName 
								+ '</span></a>'
							+'</li>';
				} else if (scriptName) {
					aMenu = '<li><a href="#" id="' + mainMenuId + '"><span id="' + privilegeId + '" onclick="' + scriptName + '" SERVER_URL_NAME="' 
									+ serverUrlName + '" CUSTOM_URL_NAME="'+ customUrlName + '" PRIVILEGE_ID="' 
									+ privilegeId + '">' + privilegeName + '</span></a></li>';		
				} else {
					aMenu = '<li><a href="#" id="' + mainMenuId + '"><span>' + privilegeName + '</span></a></li>';
				}
								
				menuHtml += aMenu;
			}
			
			menuHtml += '</ul>';
			menuDiv.innerHTML = menuHtml;
		}

	});//Ext
}

function activeMenu(privilegeId) {
	if (privilegeId) {
		var rootMenu = getRootMenu(resultXml, privilegeId);
		if (rootMenu) {
			var topMenu = document.getElementById(mainMenuPrefix + rootMenu.getAttribute('PRIVILEGE_ID'));		
			if (topMenu) {
				topMenu.className ="menuActive";
				activeMenuPrivilegeId = rootMenu.getAttribute('PRIVILEGE_ID');
			}		
		}
	}
}

function buildSubMenus(xmlDoc, privilegeId, subMenuId, mainMenuId) {
	var aNewMenuDiv = document.createElement("DIV");
	var subMenuDiv = document.getElementById("subMenu");
	var subMenuBar = new Ext.Toolbar({id: subMenuBarPrefix + subMenuId});
	
	aNewMenuDiv.id = subMenuId;
	aNewMenuDiv.className = 'sub_menu';
	aNewMenuDiv.style.display = 'none';
	
	aNewMenuDiv.setAttribute("subMenu", subMenuId);
	aNewMenuDiv.setAttribute("mainMenu", mainMenuId);
	aNewMenuDiv.setAttribute("onmouseout", hideSubMenuDiv);
	
	subMenuDiv.appendChild(aNewMenuDiv);

	if (!subMenuBar.rendered) {
		subMenuBar.render(subMenuId);
		
		var scriptName;
		var privilegeId;
		var privilegeName;
		var serverUrlName;
		var customUrlName;
		var menus = getSubMenus(xmlDoc, privilegeId);
		
		for (var i=0; i<menus.length; i++) {
			scriptName = menus[i].getAttribute('SCRIPT_NAME');
			privilegeId = menus[i].getAttribute('PRIVILEGE_ID');
			privilegeName = menus[i].getAttribute('PRIVILEGE_NAME');
			serverUrlName = menus[i].getAttribute('SERVER_URL_NAME');
			customUrlName = menus[i].getAttribute('CUSTOM_URL_NAME');
			
		 	if (hasSubMenus(xmlDoc, privilegeId)) {
		 		var dropDownMenu = new Ext.menu.Menu({id: menuButtonPrefix + privilegeId, 
		 				listeners: {'mouseover': function(){cancelCloseTime()}, 
		 							'mouseout' : function(){hideSubMenuDiv2Drop(subMenuId, mainMenuId, event)}}});
				dropDownMenu = buildDropDownMenu(dropDownMenu, xmlDoc, privilegeId, subMenuId, mainMenuId);
		 	
		 		subMenuBar.add({text: privilegeName, menu: dropDownMenu});
		 	} else {
				var rootMenu = getRootMenu(xmlDoc, privilegeId);
				subMenuBar.add({
					enableToggle: true,
					text: privilegeName,
		        	scriptName: scriptName,
		        	privilegeId: privilegeId,
		        	serverUrlName: serverUrlName,
		        	customUrlName: customUrlName,
		        	rootMenuScriptName: rootMenu.getAttribute('SCRIPT_NAME'),
		        	rootMenuPrivilegeId: rootMenu.getAttribute('PRIVILEGE_ID'),
		        	rootMenuServerUrlName: rootMenu.getAttribute('SERVER_URL_NAME'),
		        	rootMenuCustomUrlName: rootMenu.getAttribute('CUSTOM_URL_NAME'),
		        	toggleHandler: onItemClick
				});		 	
		 	}
    		
    		if (i < menus.length -1) {
				subMenuBar.addSpacer();
				subMenuBar.addSeparator();
				subMenuBar.addSpacer();    		
    		}
		}
	
		subMenuBar.doLayout();
	}
}

function buildDropDownMenu(dropDownMenu, xmlDoc, privilegeId, subMenuId, mainMenuId) {
	var menuItem;
	var aScriptName;
	var aPrivilegeId;
	var aPrivilegeName;
	var aServerUrlName;
	var aCustomUrlName;
	
	var menuItems = getSubMenus(xmlDoc, privilegeId);

	if (menuItems && menuItems.length > 0) {
		for (var i=0; i< menuItems.length; i++) {
			aScriptName = menuItems[i].getAttribute('SCRIPT_NAME');
			aPrivilegeId = menuItems[i].getAttribute('PRIVILEGE_ID');
			aPrivilegeName = menuItems[i].getAttribute('PRIVILEGE_NAME');
			aServerUrlName = menuItems[i].getAttribute('SERVER_URL_NAME');
			aCustomUrlName = menuItems[i].getAttribute('CUSTOM_URL_NAME');
			
			if (hasSubMenus(xmlDoc, aPrivilegeId)) {
				var subDropDownMenu = new Ext.menu.Menu({id: menuButtonPrefix + aPrivilegeId, 
						listeners: {'mouseover': function(){cancelCloseTime()}, 
									'mouseout' : function(){hideSubMenuDiv2Drop(subMenuId, mainMenuId, event)}}});
				subDropDownMenu = buildDropDownMenu(subDropDownMenu, xmlDoc, aPrivilegeId, subMenuId, mainMenuId);
				
				menuItem = new Ext.menu.Item({text: aPrivilegeName});
				menuItem.menu = subDropDownMenu;
				
				dropDownMenu.add(menuItem);
			} else {
				var rootMenu = getRootMenu(xmlDoc, privilegeId);
				menuItem = new Ext.menu.Item({
					text: aPrivilegeName, 
	        		scriptName: aScriptName,
		        	privilegeId: aPrivilegeId,
		        	serverUrlName: aServerUrlName,
		        	customUrlName: aCustomUrlName,
		        	rootMenuScriptName: rootMenu.getAttribute('SCRIPT_NAME'),
		        	rootMenuPrivilegeId: rootMenu.getAttribute('PRIVILEGE_ID'),
		        	rootMenuServerUrlName: rootMenu.getAttribute('SERVER_URL_NAME'),
		        	rootMenuCustomUrlName: rootMenu.getAttribute('CUSTOM_URL_NAME'),
					handler: onItemClick});
				dropDownMenu.add(menuItem);	
			}
		}
	}
	
	return dropDownMenu;
}

function onItemClick(item) {
		oSelectedItem = {
			id: item.rootMenuPrivilegeId,
			SCRIPT_NAME: item.rootMenuScriptName,
			SERVER_URL_NAME: item.rootMenuServerUrlName,
			CUSTOM_URL_NAME: item.rootMenuCustomUrlName,
			targetPrivilegeId: item.privilegeId,
			targetScriptName: item.scriptName,
			targetServerUrlName: item.serverUrlName,
			targetCustomUrlName: item.customUrlName
		}

		doMenu_relocation();
}

function hasSubMenus(xmlDoc, privilegeId) {
	var subMenus = getSubMenus(xmlDoc, privilegeId);
	
	if (subMenus && subMenus.length > 0) {
		return true;
	}
	
	return false;
}

function getSubMenus(xmlDoc, privilegeId) {
	var subMenus;
	
	if (xmlDoc) {
		subMenus = xmlDoc.selectNodes("/root/rowSet[@PARENT_PRIVILEGE_ID='" + privilegeId + "']");
	}
	
	return subMenus;
}

function getRootMenu(xmlDoc, privilegeId) {
	var menu;
	var curMenu;
	var curMenuPath;
	
	if (xmlDoc) {
		curMenu = xmlDoc.selectNodes("/root/rowSet[@PRIVILEGE_ID='" + privilegeId + "']");
		if (curMenu && curMenu.length > 0) {
			curMenuPath = curMenu[0].getAttribute('PATH');
		}
		if (curMenuPath) {
			var menuPathArray = curMenuPath.split('/');
			var menuArray = xmlDoc.selectNodes("/root/rowSet[@PRIVILEGE_ID='" + menuPathArray[1] + "']");
			if (menuArray && menuArray.length > 0) {
				menu = menuArray[0];
			}
		}
	}

	return menu;
}

function showSubMenu(mainMenuId, subMenuId) {
	var subMenu = document.getElementById(subMenuId);
	var mainMenu = document.getElementById(mainMenuId);
	
	if (subMenu == null || mainMenu == null) {
		return;
	}
	
	if (subMenuActive && subMenuActive.id != subMenuId) {
		mainMenuActive.className = "";
		subMenuActive.style.display = "none";
		activeMenu(activeMenuPrivilegeId);
	} else {
		cancelCloseTime();
	} 
	
	subMenuActive = subMenu;
	mainMenuActive = mainMenu;
	subMenu.style.display = "";
	
	var menuBarLength = subMenu.innerText.length * 5;
	var mainMenuOffsetLeft = getPos(mainMenu, "Left");

	var indexMenu = document.getElementById(mainMenuPrefix + indexPrivilegeId);
	var indexMenuOffset = getPos(indexMenu, "Left");
	var menuBarLengthReal = indexMenuOffset + menuBarLength;
	var dateDiv = document.getElementById("oCurDate");
	var dateOffset = getPos(dateDiv, "Left");

	
	// 子菜单实际宽度
	var subMenuWidth = getElementByClassName("TR", "x-toolbar-left-row", subMenu).offsetWidth;
	// 主菜单宽度
	var mainMenuWidth = mainMenu.offsetWidth;
	
	// 子菜单所在的容器
	var subMenuContainer = document.getElementById("subMenu").parentNode;
	// 子菜单所在的容器宽度
	var subMenuContainerWidth = subMenuContainer.offsetWidth;	
	var subMenuContainerOffsetLeft = getPos(subMenuContainer, "Left");
	// 设置二级菜单宽度
	subMenu.style.width =  subMenuWidth + "px";
	
	// 主菜单中间位置距菜单边界的距离
	var mainMenuCenterPos = mainMenuOffsetLeft - subMenuContainerOffsetLeft + mainMenuWidth / 2;
	
	var subMenuLeft;
	// 二级菜单宽度较小时，以主菜单为中心对齐	
	if ((subMenuWidth < subMenuContainerWidth)
			&& (mainMenuCenterPos >= subMenuWidth /2) 
			&& (mainMenuCenterPos + subMenuWidth /2 <= subMenuContainerWidth)) {
		subMenuLeft = mainMenuOffsetLeft +  mainMenuWidth / 2 - subMenuWidth / 2;
	} else {
		subMenuLeft = indexMenuOffset;
	}

/*
	if ((mainMenuOffsetLeft + menuBarLength) > dateOffset) {
		if (menuBarLengthReal > dateOffset) {
			subMenu.style.left = indexMenuOffset;
		} else {
			subMenu.style.left = mainMenuOffsetLeft - (dateOffset - menuBarLengthReal);
		}
	} else {
		subMenu.style.left = getPos(mainMenu, "Left") - 28;
	}
*/
	subMenu.style.left = subMenuLeft;
	
    //subMenu.style.top = getPos(mainMenu, "Top") + 38;
	subMenu.style.top = getPos(mainMenu, "Top") + 30;
}

// 根据 class 名称获取对象
function getElementByClassName(tagName, className, parentElement){
	var elems = parentElement.getElementsByTagName(tagName);

	for (i = 0; j = elems[i]; i++) {
		if ((" " + j.className + " ").indexOf(" " + className + " ") != -1 ) {
			return j;
		}
	}
} 

function hideSubMenu(subMenuId, mainMenuId, e, instant) {
	var subMenu = document.getElementById(subMenuId);
	var mainMenu = document.getElementById(mainMenuId);
	
	if (subMenu == null || mainMenu == null) {
		return;
	}

	if(subMenu.contains(e.toElement) == false) {
		if (instant == true) {
			mainMenu.className = "";
			subMenu.style.display = "none";

			var menuBar = Ext.getCmp(subMenuBarPrefix + subMenuId);
			for (var i=0; i<menuBar.items.length; i++) {
				if (menuBar.items.item(i).menu) {
					menuBar.items.item(i).menu.hide();
				}
			}
			
			activeMenu(activeMenuPrivilegeId);
		} else {								
			closeTimer = window.setTimeout(function(){
												mainMenu.className = "";
												subMenu.style.display = "none";
												
												var menuBar = Ext.getCmp(subMenuBarPrefix + subMenuId);
												
												for (var i=0; i<menuBar.items.length; i++) {
													if (menuBar.items.item(i).menu) {
														menuBar.items.item(i).menu.hide();
													}
												}
												
												activeMenu(activeMenuPrivilegeId);										
											}, 300);
		}
	} else {
		cancelCloseTime();
		mainMenu.className ="menuActive";
	}
}

function cancelCloseTime() {
	if (closeTimer) {
		window.clearTimeout(closeTimer);
		closeTimer = null;
	}
}

function hideSubMenuDiv2Drop(subMenuId, mainMenuId, e) {
	var oElement = e.srcElement;
	var subMenuElement = getMenuDiv(oElement, menuButtonPrefix);
		
	if(subMenuElement && subMenuElement.contains(e.toElement) == false) {
		hideSubMenu(subMenuId, mainMenuId, e, false);
	}
}

function hideSubMenuDiv() {
	var oElement = event.srcElement;
	var subMenuElement = getMenuDiv(oElement, subMenuPrefix);
	
	if (subMenuElement) {
		hideSubMenu(subMenuElement.subMenu, subMenuElement.mainMenu, event, false);
	}
}

function getMenuDiv(menuElement, prefixStr) {
	if (!menuElement) {
		return;
	}
	
	var menuDivElement;
	var oElement = menuElement;
	
	do {
		if (!oElement) {
			return;
		}
		
		if (oElement.tagName.toLowerCase() == "div") {
			if (oElement.id && oElement.id.indexOf(prefixStr) == 0) {
				menuDivElement = oElement;
				break;
			}
		}
	} while (oElement = oElement.parentElement);

	return menuDivElement;
}

function getPos(el,sProp) 
{
	var iPos = 0;
	while (el!=null) {
		iPos+=el["offset" + sProp];
		el = el.offsetParent;
	}
	return iPos;
}
