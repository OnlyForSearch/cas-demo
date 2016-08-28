var favoritesLang;
if("undefined" != typeof(ItmLang) && ItmLang.favorites)
{
	favoritesLang = ItmLang.favorites;
}
else
{
	favoritesLang = 
	{
			add_succ:"添加成功！",
			not_repeat_fav:"您已经收藏过，不允许重复收藏！",
			is_del:"是否删除'",
			fav_ques:"收藏夹?",
			this_shortcut_expiry:"该快捷菜单已失效,请删除!",
			create_new_folder:"新建文件夹",
			del_succ:"删除成功!",
			flow:"'流程-"
	};
}

var FAVORITES_JS_NAME = "favorites.js";
var FAVORITES_ROOT = -1;
var FAVORITES_FORDER = 0;
var FAVORITES_URL = 1;
var FAVORITES_PRIVILEGE = 2;
var FAVORITES_QUERY = 3;

var favorites_servletUrl = "../../../servlet/FavoritesAction?";
var favorites_addWinUrl = "../../../workshop/favorites/favoritesFolderTree.html";
var favorites_queryUrl = "../../../workshop/query/query_result.jsp?id=";
var favorites_addQueryUrl = "../../../workshop/query/queryInfo.html";
var favorites_editQueryUrl = "../../../workshop/query/query_cfg.jsp?queryId="
var favorites_isTransformServletUrl = false;
var favorites_isTransformAddWinUrl = false;
var favorites_isTransformQueryUrl = false;
var favorites_isTransformAddQueryUrl = false;
var favorites_isTransformEditQueryUrl = false;
var favorites_tree;
var favorites_xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
var favorites_sendUrl;
var favorites_sendParams;

var sendQueryWinParam;

function getFavoritesServletUrl()
{
	if(!favorites_isTransformServletUrl)
	{
		favorites_servletUrl = getRealPath(favorites_servletUrl,FAVORITES_JS_NAME);
		favorites_isTransformServletUrl = true;
	}
	return favorites_servletUrl;
}

function getFavoritesAddWinUrl()
{
	if(!favorites_isTransformAddWinUrl)
	{
		favorites_addWinUrl = getRealPath(favorites_addWinUrl,FAVORITES_JS_NAME);
		favorites_isTransformAddWinUrl = true;
	}
	return favorites_addWinUrl;
}

function getFavoritesQueryUrl()
{
	if(!favorites_isTransformQueryUrl)
	{
		favorites_queryUrl = getRealPath(favorites_queryUrl,FAVORITES_JS_NAME);
		favorites_isTransformQueryUrl = true;
	}
	return favorites_queryUrl;
}

function getFavoritesAddQueryUrl()
{
	if(!favorites_isTransformAddQueryUrl)
	{
		favorites_addQueryUrl = getRealPath(favorites_addQueryUrl,FAVORITES_JS_NAME);
		favorites_isTransformAddQueryUrl = true;
	}
	return favorites_addQueryUrl;
}

function getFavoritesEditQueryUrl()
{
	if(!favorites_isTransformEditQueryUrl)
	{
		favorites_editQueryUrl = getRealPath(favorites_editQueryUrl,FAVORITES_JS_NAME);
		favorites_isTransformEditQueryUrl = true;
	}
	return favorites_editQueryUrl;
}

function showFavoriteFoldersTree(oElement)
{
	favorites_sendUrl = getFavoritesServletUrl();
	favorites_sendParams = new Array("action=8");
	favorites_tree = new XMLTree();
	favorites_tree.xmlUrl = getSendUrl(favorites_sendUrl,favorites_sendParams);
	favorites_tree.isDynamicLoad = true;
	favorites_tree.isDragOnTree = true;
	favorites_tree.isRightFireOnClick = false;
	favorites_tree.setDynamicLoadAction(new DynamicLoadFavoriteFoldersTree());
	favorites_tree.setEditAction(new RenameFavorites());
	favorites_tree.setStartDragAction(new IsDragFavorites());
	favorites_tree.setEndDragAction(new endDragFavorites());
	favorites_tree.setRightAction(new RightFavorites());
	favorites_tree.showAt(oElement);
}

function showFavoritesTree(oElement)
{
	favorites_sendUrl = getFavoritesServletUrl();
	favorites_sendParams = new Array("action=0");
	favorites_tree = new XMLTree();
	favorites_tree.xmlUrl = getSendUrl(favorites_sendUrl,favorites_sendParams);
	favorites_tree.isDynamicLoad = true;
	favorites_tree.isDragOnTree = true;
	favorites_tree.isSelectedClick = true;
	favorites_tree.isRightFireOnClick = false;
	favorites_tree.setDynamicLoadAction(new DynamicLoadFavoritesTree());
	favorites_tree.setEditAction(new RenameFavorites());
	favorites_tree.setStartDragAction(new IsDragFavorites());
	favorites_tree.setEndDragAction(new endDragFavorites());
	favorites_tree.setClickAction(new clickFavorites());
	favorites_tree.setRightAction(new RightFavorites());
	favorites_tree.showAt(oElement);
	//oElement.attachEvent("onselectstart",favoritesCancel);
}

function favoritesCancel()
{
	return false;
}

function DynamicLoadFavoritesTree()
{
	this.parent = new XMLTree_onDynamicLoad_Action;
	this.parent.dynamicLoad = function(oItem)
	{
		favorites_sendUrl = getFavoritesServletUrl();
		favorites_sendParams = new Array("action=1","id="+oItem.id);
		return getSendUrl(favorites_sendUrl,favorites_sendParams);
	}
	return this.parent;
}

function DynamicLoadFavoriteFoldersTree()
{
	this.parent = new XMLTree_onDynamicLoad_Action;
	this.parent.dynamicLoad = function(oItem)
	{
		favorites_sendUrl = getFavoritesServletUrl();
		favorites_sendParams = new Array("action=9","id="+oItem.id);
		return getSendUrl(favorites_sendUrl,favorites_sendParams);
	}
	return this.parent;
}

function RenameFavorites()
{
	this.parent = new XMLTree_onEditItem_Action;
	this.parent.edit = function(oItem,value)
	{
		favorites_sendParams = new Array(3);
		favorites_sendParams[0] = "action="+5;
		favorites_sendParams[1] = "id="+oItem.id;
		favorites_sendParams[2] = "name="+encodeURIComponent(value);
		favorites_sendUrl = getSendUrl(getFavoritesServletUrl(),favorites_sendParams);
		favorites_xmlHttp.Open("POST",favorites_sendUrl,false);
		favorites_xmlHttp.send();
		return isSuccess(favorites_xmlHttp);
	}
	return this.parent;
}

function IsDragFavorites()
{
	this.parent = new XMLTree_onDragStart_Action;
	this.parent.isStartDrag = function (oItem)
	{
		return (oItem.id != -1);
	}
	return this.parent;
}

function endDragFavorites()
{
	this.parent = new XMLTree_onDragEnd_Action;
	this.parent.endDrag = function(oDragItem,oOverItem)
	{
		if(oOverItem)
		{
			var flag = parseInt(oOverItem.FAVORITE_FLAG);
			if(flag == FAVORITES_FORDER || flag == FAVORITES_ROOT)
			{
				favorites_sendParams = new Array(3);
				favorites_sendParams[0] = "action="+7;
				favorites_sendParams[1] = "sId="+oDragItem.id;
				favorites_sendParams[2] = "tId="+oOverItem.id;
				favorites_sendUrl = getSendUrl(getFavoritesServletUrl(),favorites_sendParams);
				favorites_xmlHttp.Open("POST",favorites_sendUrl,false);
				favorites_xmlHttp.send();
				return isSuccess(favorites_xmlHttp);
			}
		}
		else
		{
			return false;
		}
	}
	return this.parent;
}

function clickFavorites()
{
	this.parent = new XMLTree_onClick_Action;
	this.parent.click = function(oItem)
	{
		if(oItem.STATE == '0SA')
		{
			switch (parseInt(oItem.FAVORITE_FLAG))
			{
				case FAVORITES_URL:
					doUrl(oItem);
					break;			
				case FAVORITES_PRIVILEGE:
					doPrivilege(oItem);
					break;
				case FAVORITES_QUERY:
					doQuery(oItem);
					break;
			}
		}
		else
		{
			EMsg(favoritesLang.this_shortcut_expiry);
		}
	}
	
	function doUrl(oItem)
	{
		doMenu_open_by_url(oItem.SERVER_URL_NAME);
	}
	
	function doPrivilege(oItem)
	{
		if(favorites_tree.isCallPage == 'shortCut.html')
		{
			oSelectedItem = oItem;
			oSelectedItem.id = oSelectedItem.FAVORITE_PARAM;
			oSelectedItem.PRIVILEGE_NAME = oSelectedItem.innerText;
			oSelectedItem.PRIVILEGE_ID = oSelectedItem.FAVORITE_PARAM;
			eval(oItem.SCRIPT_NAME);
		}
		else
		{
		    var url=(oItem.SERVER_URL_NAME)?oItem.SERVER_URL_NAME:"/";
			doMenu_open_by_url(url);
		}
	}
	
	function doQuery(oItem)
	{
		var queryUrl = getFavoritesQueryUrl()+oItem.FAVORITE_PARAM;
		oItem.SERVER_URL_NAME = queryUrl;
		if(favorites_tree.isCallPage == 'shortCut.html')
		{
			oSelectedItem = oItem;
			doMenu_loadWin('RIGHTFRAME');
		}
		else
		{
			doMenu_open_by_url(oItem.SERVER_URL_NAME);
		}
	}
	
	return this.parent;
}

function RightFavorites()
{
	this.parent = new XMLTree_oncontextmenu_Action;
	this.parent.rightClick = function(oItem)
	{
		switch (parseInt(oItem.FAVORITE_FLAG))
		{
			case FAVORITES_ROOT:
				favoritesMenu.setItemDisable("editQuery");
				favoritesMenu.setItemDisable("rename");
				favoritesMenu.setItemDisable("del");
				break;
			case FAVORITES_FORDER:
				favoritesMenu.setItemDisable("editQuery");
				break;
			case FAVORITES_URL:
				favoritesMenu.setItemDisable("addFolder");
				favoritesMenu.setItemDisable("addQuery");
				favoritesMenu.setItemDisable("editQuery");
				break;			
			case FAVORITES_PRIVILEGE:
				favoritesMenu.setItemDisable("addFolder");
				favoritesMenu.setItemDisable("addQuery");
				favoritesMenu.setItemDisable("editQuery");
				break;
			case FAVORITES_QUERY:
				favoritesMenu.setItemDisable("addFolder");
				favoritesMenu.setItemDisable("addQuery");
				break;
		}
		favoritesMenu.show();
	}
	return this.parent;
}

function hideFavoritesMenu()
{
	favorites_tree.releaseRightClick();
}

function addFavoriteFolder()
{
	var parentId = favorites_tree.getSelectedItem().id;
	var newId,newName=favoritesLang.create_new_folder;
	var newAttName = new Array("STATE","FAVORITE_FLAG","ico");
	var newAttVal = new Array("0SA","0","folder2.gif");
	favorites_sendParams = new Array(3);
	favorites_sendParams[0] = "action=2";
	favorites_sendParams[1] = "id="+parentId;
	favorites_sendParams[2] = "name="+encodeURIComponent(newName);
	favorites_sendUrl = getSendUrl(getFavoritesServletUrl(),favorites_sendParams);
	favorites_xmlHttp.open("post",favorites_sendUrl,false);
	favorites_xmlHttp.send();
	if(isSuccess(favorites_xmlHttp))
	{
		newId = favorites_xmlHttp.responseXML.selectSingleNode('/root/id').text;
		favorites_tree.add(newId,newName,newAttName,newAttVal,true,true);
	}
}

function renameFavorites()
{
	favorites_tree.edit();
}

function delFavorites()
{
	var oDelItem = favorites_tree.getSelectedItem();
	//next line update by panqd 
	//innerText默认是label,如果带<等标签,在渲染后已经被解释了,再次拼接仍然出现跨站脚本攻击
	//相反,innerHTML还带着转义的内容
	if (QMsg(favoritesLang.is_del + oDelItem.innerHTML + favoritesLang.fav_ques)==MSG_YES)
	{
		favorites_sendParams = new Array(2);
		favorites_sendParams[0] = "action=6";
		favorites_sendParams[1] = "id="+oDelItem.id;
		favorites_sendUrl = getSendUrl(getFavoritesServletUrl(),favorites_sendParams);
		favorites_xmlHttp.Open("POST",favorites_sendUrl,false);
		favorites_xmlHttp.send();
		if(isSuccess(favorites_xmlHttp))
		{
			MMsg(favoritesLang.del_succ);
			var isFireClick = false;
			/*if(favorites_tree.isCallPage == 'shortCut.html')
			{
				isFireClick = true;
			}*/
			favorites_tree.delItem(oDelItem,isFireClick);
		}
	}
}

function addFavoritePrivilege(id,name,privilegeId)
{
	favorites_sendParams = new Array(4);
	favorites_sendParams[0] = "action=3";
	favorites_sendParams[1] = "id="+id;
	favorites_sendParams[2] = "priId="+privilegeId;
	favorites_sendParams[3] = "name="+encodeURIComponent(name);
	favorites_sendUrl = getSendUrl(getFavoritesServletUrl(),favorites_sendParams);
	favorites_xmlHttp.open("post",favorites_sendUrl,false);
	favorites_xmlHttp.send();
	return isSuccess(favorites_xmlHttp);
}

function addFavoriteUrl(id,name,url,flowId,appMode)
{
	favorites_sendParams = new Array(4);
	favorites_sendParams[0] = "action=4";
	favorites_sendParams[1] = "id="+id;
	favorites_sendParams[2] = "name="+encodeURIComponent(name);
	favorites_sendParams[3] = "url="+encodeURIComponent(url);
	//2012-6-28
	favorites_sendParams[4] = "flowId="+flowId;
	favorites_sendParams[5] = "appMode="+appMode;
	//end
	favorites_sendUrl = getSendUrl(getFavoritesServletUrl(),favorites_sendParams);
	favorites_xmlHttp.open("post",favorites_sendUrl,false);
	favorites_xmlHttp.send();
	return isSuccess(favorites_xmlHttp);
}

function addFavoriteQuery()
{
	var winUrl = getFavoritesAddQueryUrl();
	sendQueryWinParam = new Array(3);
	sendQueryWinParam[0] = "priId="+favorites_tree.getSelectedItem().id;
	sendQueryWinParam[1] = "type=1";
	sendQueryWinParam[2] = "1";
	window.showModalDialog(winUrl,window,"dialogWidth=360px;dialogHeight=200px;help=0;scroll=0;status=0;");
}

function editFavoriteQuery(queryId)
{
	var winUrl = getFavoritesEditQueryUrl();
	if(!queryId)
	{
		queryId = favorites_tree.getSelectedItem().FAVORITE_PARAM;
	}
	window.showModalDialog(winUrl+queryId,window,"dialogWidth=800px;dialogHeight=580px;help=0;scroll=0;status=0;");
}

function showAddFavWin(name,url,flag,markId,mode)
{
	var winUrl = getFavoritesAddWinUrl();
	var dialogsFeatures = "dialogWidth=470px;dialogHeight=266px;help=0;scroll=0;status=0;";
	var sendParams = new Array(2);
	sendParams[0] = name;
	sendParams[1] = url;
	sendParams[2] = flag;
	sendParams[3] = markId;
	sendParams[4] = mode;
	return window.showModalDialog(winUrl,sendParams,dialogsFeatures);
}

function showAddFavPriWin(name,url)
{
	return showAddFavWin(name,url,FAVORITES_PRIVILEGE);
}

function showAddFavUrlWin(name,url,markId,mode)
{
	if(!name)
	{
		name = document.title;
	}
	if(!url)
	{
		url = location.href;
	}
	return showAddFavWin(name,url,FAVORITES_URL,markId,mode);
}

function addFavoriteForm(name,id,markId,mode)
{
	showAddFavUrlWin(favoritesLang.flow + name,'FlowBrowse?system_code=G&flow_id='+id,markId,mode);
}