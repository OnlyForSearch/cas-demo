var xmlRequest = new ActiveXObject("Microsoft.XMLHTTP");
var mainPageUrl = 'servlet/MainPageAction?';
var reqParams;
var linkImg;
var linkVal;
var linkTitle;

function setLink()
{
	reqParams = new Array('action=0');
	xmlRequest.Open("POST",mainPageUrl+reqParams.join('&'),false);
	xmlRequest.send();
	if(isSuccess(xmlhttp))
	{
		var workLinks = xmlRequest.responseXML.selectNodes("/root/rowSet[LINK_TYPE='A'||LINK_TYPE='B']");
		var topLinks = xmlRequest.responseXML.selectNodes("/root/rowSet[LINK_TYPE='C']");
		var flowLinks = xmlRequest.responseXML.selectNodes("/root/rowSet[LINK_TYPE='D']");
		setTopLink(topLinks);
		setWorkLink(workLinks);
		setFlowLink(flowLinks);
		loadShortCutMenu();//快速通道
		
	}
}
	// 快速通道 个性化菜单开始
	var reloc_id = [];
	var reloc_url =[];
	var menuDoc = new ActiveXObject("Microsoft.XMLDOM");
	function loadShortCutMenu(){
		if(document.getElementById('shortCutMenu22')){
		    var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); 
		    xmlhttp.onreadystatechange=function(){
		        if(xmlhttp.readyState==4){
		            loadShortCutMenuList(xmlhttp)
		        }
		    }
		    xmlhttp.open("POST","servlet/FavoritesAction?action=0",true);
		    xmlhttp.send("");
	    }
	}
	function loadShortCutMenuList(xmlhttp) {
	    if(isSuccess(xmlhttp)){
	        menuDoc.load(xmlhttp.responseXML);
	        var outHTMLStr = "";
	        var outHTML = '<table width="100%" height="100px" border="0" cellpadding="0"  cellspacing="0" style="margin-top:5px;">';
	        var oNodes = menuDoc.selectNodes("//rowSet"); 
	        var oErrCodeStr = oNodes.context.selectSingleNode("/root/error_code"); 
	        if(oErrCodeStr.text == 0) {
	            var menuList = oNodes.context.selectNodes("/root/Menu/MenuItem/MenuItem");
	            if(menuList.length >0){
	                for(i=0; i<menuList.length&&i<20; i++){     //
	                  try{
	                      var privilegeId = menuList[i].getAttribute("PRIVILEGE_ID");//ADDED BY PANCHH
	                      var favoriteName = menuList[i].getAttribute("FAVORITE_NAME");
	                      var serverUrlName = menuList[i].getAttribute("SERVER_URL_NAME")
	                      var scriptName = menuList[i].getAttribute("SCRIPT_NAME");
	                      //added by panchh
	                      // 如果配置有带地址则不加地址头，如果没有则默认是当前的服务地址跳转
	                      for(var x=0;x<reloc_id.length;x++){
	                        if (reloc_id[x]===privilegeId){
	                            if(reloc_url[x].indexOf("http")==-1)
	                                serverUrlName = location.protocol+"//"+location.hostname+":"+
	                                    reloc_url[x]+"&userName="+userName+"&passwd="+pswd;
	                            else 
	                                serverUrlName = reloc_url[x]+"&userName="+userName+"&passwd="+pswd;
	                            break;
	                        }
	                      }
	                      if(favoriteName != null && favoriteName != "" && serverUrlName != null && serverUrlName != ""){
	                          outHTMLStr += "<a class='ni_staffMenu' href='#' title='"+ favoriteName +"' ";
	                          if(scriptName!=null && scriptName!="" && scriptName.indexOf("doMenu_open")>-1){ 
	                                outHTMLStr += " onClick=\"doMenu_open2('" + serverUrlName + "','',''," + menuList[i].getAttribute("id") + ")\"> ";
	                          }else{
	                                outHTMLStr += " onClick=\"window.open('" + serverUrlName + "')\"> ";
	                          }
	                          //outHTMLStr += "><img src='resource/image/arrow.gif' align='absmiddle'/>&nbsp;";
	                          //outHTMLStr +=favoriteName; 
	                          //outHTMLStr += "</a>";
	                          outHTML += '<tr valign="top" style="height:25px">'
								+	'<td style="padding-top:6px;"><img src="resource/image/arrow.gif"/>&nbsp;'
								+		outHTMLStr
								+		  favoriteName
								+		'</a>'
								+	  '</div>'
								+	'</td>'
								+  '</tr>'
	                      }
	                  }catch(e){continue}
	                }
	            }
	        }
	    } 
	    	outHTML = outHTML+' </table>';
	        document.getElementById('shortCutMenu22').innerHTML = outHTML ;
	}
	function doMenu_open2(url,width,height,winId) {
	    width = (typeof(width)=="undefined")?screen.availWidth:width;
	    height = (typeof(height)=="undefined")?screen.availHeight:height;
	    var top = (screen.availHeight-height)/2;
	    var left =(screen.availWidth-width)/2;
	    var sFeatures = new Array();
	    sFeatures.push("width="+width);
	    sFeatures.push("height="+height);
	    sFeatures.push("top="+top);
	    sFeatures.push("left="+left);
	    sFeatures.push("location="+0);
	    sFeatures.push("menubar="+0);
	    sFeatures.push("resizable="+1);
	    sFeatures.push("scrollbars="+1);
	    sFeatures.push("status="+0);
	    sFeatures.push("titlebar="+0);
	    sFeatures.push("toolbar="+0);
	    if(!winId)
	    {
	        winId = '_blank';
	    }
	    window.open(url,winId,sFeatures.join(","));
	}
	// 快速通道 个性化菜单结束
function setWorkLink(linkNodes)
{
	var outHTML = '<table width="100%" border="0" cellpadding="0"  cellspacing="0" style="margin-top:5px;">';
	for(var i=0;i<linkNodes.length;i++)
	{
		linkImg = getNodeValue(linkNodes[i],'LINK_IMG');
		linkVal = getNodeValue(linkNodes[i],'LINK_VALUE');
		linkTitle = getNodeValue(linkNodes[i],'LINK_TITLE')
		linkTitle = linkImg!=null&&linkImg!='undefined'&&linkImg!=''?"<img src='" + linkImg + "' alt='" + linkTitle + "' border='0'>":linkTitle;  
		outHTML += '<tr valign="top" style="height:25px">'
				+	'<td style="padding-top:6px;"><img src="resource/image/indexImage/style1/about_link.jpg"/>&nbsp;'
				+		'<a href="'+linkVal+'">'
				+		  linkTitle
				+		'</a>'
				+	  '</div>'
				+	'</td>'
				+  '</tr>'
	}
	outHTML += '</table>';
	workLinkSpan.innerHTML = outHTML;		
}

function setFlowLink(linkNodes){
	var outHTML = '<table width="100%" border="0" cellpadding="0"  cellspacing="0" style="margin-top:5px;">';
	for(var i=0;i<linkNodes.length;i++)
	{
		linkImg = getNodeValue(linkNodes[i],'LINK_IMG');
		linkVal = getNodeValue(linkNodes[i],'LINK_VALUE');
		linkTitle = getNodeValue(linkNodes[i],'LINK_TITLE')
		linkTitle = linkImg!=null&&linkImg!='undefined'&&linkImg!=''?"<img src='" + linkImg + "' alt='" + linkTitle + "' border='0'>":linkTitle;  
		outHTML += '<tr valign="top" style="height:25px">'
				+	'<td style="padding-top:6px;"><img src="resource/image/indexImage/style1/about_link.jpg"/>&nbsp;'
				+		'<a href="'+linkVal+'">'
				+		  linkTitle
				+		'</a>'
				+	  '</div>'
				+	'</td>'
				+  '</tr>'
	}
	outHTML += '</table>';
	var flowLink=document.getElementById('flowLink');
	if(flowLink){
		flowLink.innerHTML = outHTML;	
	}
}

function setTopLink(linkNodes)
{
	var outHTML = '<table width="75%" height="93" border="0" cellpadding="0" cellspacing="0"><tr>';
	for(var i=0;i<linkNodes.length;i++)
	{
		linkVal = getNodeValue(linkNodes[i],'LINK_VALUE');
		inkImg = getNodeValue(linkNodes[i],'LINK_IMG');
		outHTML += '<td align="center">'
				+      '<a href="'+linkVal+'">'
				+	     '<img src="'+inkImg+'" border=0 />'
				+      '</a>'
				+ '</td>'
	}
	outHTML += '</tr></table>';
	topLinkDiv.innerHTML = outHTML;
}

function setFriendLink(linkNodes)
{
	var outHTML = '<table width="195" border="0" cellspacing="3" cellpadding="0" background="resource/image/indexImage/index_25.gif" >';
	for(var i=0;i<linkNodes.length;i++)
	{
		linkVal = getNodeValue(linkNodes[i],'LINK_VALUE');
		linkTitle = getNodeValue(linkNodes[i],'LINK_TITLE');
		outHTML += '<tr>'
				+    '<td width="50" valign="top">'
				+      '<div align="center">'
				+	     '<img src="resource/image/indexImage/link_map.gif" width="26" height="22">'
				+      '</div>'
				+	 '</td>'
				+    '<td>'
				+	   '<a href="'+linkVal+'" target="_blank">'+linkTitle+'</a>'
				+    '</td>'
				+  '</tr>'
	}
	outHTML += '</table>';
	friendLinkSpan.innerHTML = outHTML;	
}

/**
 *	根据链接的类型取出所有的链接的xml信息。
 *  eg：getLinkNodes("A") 或 getLinkNodes(["A","B"]);
 */
function getLinkNodes(linkType){
	reqParams = new Array('action=0');
	xmlRequest.Open("POST",mainPageUrl+reqParams.join('&'),false);
	xmlRequest.send();
	if(isSuccess(xmlhttp))
	{
		var link_type_str = "[";
		if(typeof(linkType)=="object" && linkType.length>0){
			//数组情况
			for(var i=0;i<linkType.length;i++){
				link_type_str += "LINK_TYPE='"+linkType[i]+"'"+"||";
			}
			link_type_str = link_type_str.substring(0,link_type_str.length-2);
		}else{
			//字符串的情况
			link_type_str += "LINK_TYPE='"+linkType+"'";
		}
		link_type_str += "]";
		return xmlRequest.responseXML.selectNodes("/root/rowSet"+link_type_str);
	}
}