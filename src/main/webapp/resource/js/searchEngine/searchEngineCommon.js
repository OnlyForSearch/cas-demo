var sortItemValues = new Array('', 'creationDate', 'modified', 'title');
var sortItemNames  = new Array('ƥ���', '��������', '�޸�����', '����');
var sortItemReverses = new Array('true', 'true', 'true', 'false');


/**
 *  1-1. ����ģ��
 */
function loadModules(indexDir, defaultModule)
{
    xmlhttp.open("POST", searchUrl+"tag=4&indexDirectory="+indexDir,false);
    xmlhttp.send();
    if(isSuccess(xmlhttp))
    {
        var dXML = xmlhttp.responseXML;
        reloadModules(dXML, defaultModule);
        fetchCategoryTree(defaultModule);
    }
}

/**
 *  1-2. ���������
 */
function fetchCategoryTree(module)
{
    if(module==null || module.length==0)
    {
        categoryTD.innerHTML = '<IE:tree id="category" treeHeight="200" width="150" readOnly="true">';
    } else
    {
        categoryTD.innerHTML = '<IE:tree id="category" treeHeight="200" width="150" xmlUrl="'+searchUrl+'tag=3&module='+module+'"/>';
    }
}

/**
 *  1-3. ����Ȩ��
 */
function loadIndexDirectory()
{
    xmlhttp.open("POST", searchUrl+"tag=6",false);
    xmlhttp.send();
    if(isSuccess(xmlhttp))
    {
        var dXML = xmlhttp.responseXML;
        var hasPrivilege = dXML.selectSingleNode("/root/HAS_PRIVILEGE").text;
        if(hasPrivilege!="true")
        {
            tempDirecotry.disabled = true;
            deleteDirectory.disabled = true;
            allDirectory.disabled = true;
        }
    }
}

/**
 *  1-4. ����������(2013.11.14 ����Ϊ��һҳ����һҳ��ȥ��Ϊҳ�����Ϣ)
 */
function generateNavigationBar(pageNum, recordCount, preOrNext)//"ÿҳ����", "�����������صļ�¼����", "��һҳ����һҳ"
{

	var isUseIframe= true;
	if("undefined" != typeof frame3){
		isUseIframe=true;
	}else{
		isUseIframe=false;
	}
	
    //(1). ��յ����� update by gjxʹ��iframe�������������
	var datas;
	if(isUseIframe){
		datas = frame3.navigationTable.rows;
	}else{
		datas = navigationTable.rows;
	}
    for(var i=datas.length-1;i>=0;i--)
    {
        datas[i].removeNode(true);
    }
    
    //(2). ���뵼����
    if (recordCount < pageNum && preOrNext == null)
		return;

    //update by gjxʹ��iframe�������������
    var oRow;
    if(isUseIframe){
		oRow= frame3.navigationTable.insertRow();
	}else{
		oRow= navigationTable.insertRow();
	}
     
    var oCell;
    oRow.align="center";
    oRow.valign="top";
    
    var oCell = oRow.insertCell();
    //oCell.noWrap=true;
    //oCell.valign="bottom";
    //oCell.innerHTML = '���ҳ��:&nbsp;';
    
	if ((preOrNext == 1) || (preOrNext == -1 && recordCount == pageNum)) {
        oCell = oRow.insertCell();
        oCell.noWrap = true;

        if(isUseIframe){
			oCell.innerHTML = '<a href="#" onclick="window.parent.searchEntrance(-1);" class="form_title" style="font-size: 16px;">��һҳ</a>&nbsp;&nbsp;';
		}else{
			oCell.innerHTML = '<a href="#" onclick="searchEntrance(-1);" class="form_title" style="font-size: 16px;">��һҳ</a>&nbsp;&nbsp;';
		}
    }
    //oCell.innerHTML = '<span class="form_title" style="color:#C63A00;font-size: 16px;">'+pageIndex+'</span>&nbsp;&nbsp;';

	if ((preOrNext == -1) || (recordCount == pageNum)) {
        oCell = oRow.insertCell();
        oCell.noWrap = true;
        if (isUseIframe) {
			oCell.innerHTML = '<a href="#" onclick="window.parent.searchEntrance(1);" class="form_title" style="font-size: 16px;">��һҳ</a>&nbsp;&nbsp;';
		} else {
			oCell.innerHTML = '<a href="#" onclick="searchEntrance(1);" class="form_title" style="font-size: 16px;">��һҳ</a>&nbsp;&nbsp;';
		}
    }
}

/**
 *  1-4. ����������
 */
function generateNavigationBar_old(pageNum, sumNum, startNum, endNum)//"ÿҳ����", "����", "��ʼ��", "��β��"
{
	var isUseIframe= true;
	if("undefined" != typeof frame3){
		isUseIframe=true;
	}else{
		isUseIframe=false;
	}
	
    //(1). ��յ����� update by gjxʹ��iframe�������������
	var datas;
	if(isUseIframe){
		datas = frame3.navigationTable.rows;
	}else{
		datas = navigationTable.rows;
	}
    for(var i=datas.length-1;i>=0;i--)
    {
        datas[i].removeNode(true);
    }
    
    //(2). ���뵼����
    if(sumNum==0) return;
    var pageIndex = parseInt(SEARCH_CONDITION.selectSingleNode("/root/Msg/PAGE_INDEX").text);//�ڼ�ҳ
    //update by gjxʹ��iframe�������������
    var oRow;
    if(isUseIframe){
		oRow= frame3.navigationTable.insertRow();
	}else{
		oRow= navigationTable.insertRow();
	}
     
    var oCell;
    oRow.align="center";
    oRow.valign="top";
    
    var oCell = oRow.insertCell();
    oCell.noWrap=true;
    oCell.valign="bottom";
    oCell.innerHTML = '���ҳ��:&nbsp;';
    
    if(pageIndex>1)
    {
        oCell = oRow.insertCell();
        oCell.noWrap=true;
        if(isUseIframe){
			oCell.innerHTML = '<a href="#" onclick="window.parent.searchEntrance('+(pageIndex-1)+');" class="form_title" style="font-size: 16px;">��һҳ</a>&nbsp;&nbsp;';
		}else{
			oCell.innerHTML = '<a href="#" onclick="searchEntrance('+(pageIndex-1)+');" class="form_title" style="font-size: 16px;">��һҳ</a>&nbsp;&nbsp;';
		}
    }
    for(var i=Math.max(pageIndex-10,1); i<Math.min(pageIndex+10,(sumNum/pageNum)+1); i++)
    {
        oCell = oRow.insertCell();
        oCell.noWrap=true;
        if(i!=pageIndex)
        {
        	if(isUseIframe){
				oCell.innerHTML = '<a href="#" onclick="window.parent.searchEntrance('+i+');" class="form_title" style="font-size: 16px;">'+i+'</a>&nbsp;&nbsp;';
			}else{
				oCell.innerHTML = '<a href="#" onclick="searchEntrance('+i+');" class="form_title" style="font-size: 16px;">'+i+'</a>&nbsp;&nbsp;';
			}
        }else
        {
            oCell.innerHTML = '<span class="form_title" style="color:#C63A00;font-size: 16px;">'+i+'</span>&nbsp;&nbsp;';
        }
    }
    if(pageIndex<((sumNum/pageNum)))
    {
        oCell = oRow.insertCell();
        oCell.noWrap=true;
        if(isUseIframe){
			oCell.innerHTML = '<a href="#" onclick="window.parent.searchEntrance('+(pageIndex+1)+');" class="form_title" style="font-size: 16px;">��һҳ</a>&nbsp;&nbsp;';
		}else{
			oCell.innerHTML = '<a href="#" onclick="searchEntrance('+(pageIndex+1)+');" class="form_title" style="font-size: 16px;">��һҳ</a>&nbsp;&nbsp;';
		}
    }
}


/**
 *  1-5. ����
 */
function getUrlLink(link, title)
{
    if(link==null || link.length=="") return "";
    return '��<a href="javascript:openNormalWindow(\''+encodeURIComponent(link)+'\');" class="form_title" style="font-weight:normal;text-decoration:underline;">'+title+'</a>��';
}

/*************************************************************/
/*************************************************************/
/*************************************************************/

/**
 *  2-1. ��������ģ��
 */
function reloadModules(dXML, defaultModule)
{
    reloadSelection(module, dXML.selectNodes("/root/MODULES/MODULE"));
    
    var oOption = document.createElement("OPTION");
    oOption.text = "-- ȫ����Դ --";
    oOption.value = "";
    module.add(oOption, 0);
    
    if(defaultModule) module.value = defaultModule;
    else module.selectedIndex=0;
}

/**
 *  2-2. ��������������
 */
function reloadSelection(selectionObj, oRows)
{
    var oOption;
    var iLen = selectionObj.length;
    for(var i=iLen-1;i>=0;i--){
        selectionObj.options.remove(i);
    }
    if(oRows==null) {return;}
    
    iLen = oRows.length;
    for(var i=0;i<iLen;i++)
    {
        oOption = document.createElement("OPTION");
        oOption.value = oRows[i].childNodes[0].text;
        oOption.text = oRows[i].childNodes[1].text;
        selectionObj.add(oOption);
    }
}
/**
 *  2-3. �򿪴���
 */
function openNormalWindow(url)
{
    var iWidth = 780;
    var iHeight = 580;
    var top = (screen.availHeight-iHeight)/2;
    var left = (screen.availWidth-iWidth)/2;
    var sFeatures = new Array();
    sFeatures.push("width="+iWidth);
    sFeatures.push("height="+iHeight);
    sFeatures.push("top="+top);
    sFeatures.push("left="+left);
    sFeatures.push("location="+0);
    sFeatures.push("menubar="+0);
    sFeatures.push("resizable="+1);
    sFeatures.push("scrollbars="+1);
    sFeatures.push("status="+0);
    sFeatures.push("titlebar="+0);
    sFeatures.push("toolbar="+0);
    if (url.indexOf('workshop')!=-1)
    	url = '/' + url.substring(url.indexOf('workshop'));
    else if(url.indexOf('servlet')!=-1)
    	url = '/' + url.substring(url.indexOf('servlet'));
    window.open(url, "", sFeatures.join(","));
}

/**
 *  2-4. �������б�
 *  @deprecated
 */
function fetchCategoryList(module)
{
    if(module==null || module.length==0)
    {
        reloadSelection(category, null);
    } else
    {
        xmlhttp.open("POST",searchUrl+"tag=2&module="+module,false);
        xmlhttp.send();
        if(isSuccess(xmlhttp))
        {
            var dXML = xmlhttp.responseXML;
            reloadSelection(category, dXML.selectNodes("/root/rowSet"));
        }
    }
    
    var oOption = document.createElement("OPTION");
    oOption.text = "-- ȫ����� --";
    oOption.value = "";
    category.add(oOption, 0);
    category.selectedIndex = 0;
}
