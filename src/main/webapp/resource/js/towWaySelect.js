

var dlg = {}
var oClickedItem = null
var ops = {} 
dlg.instance = null

function getDefaultDlgParam(){
	return {
		title : 'ѡ��Ի���ı���', 
		selectFrom : 'fromDivLeft',       // ��߿���id
		selectTo : 'toDivRight',           // �ұ߿���id
		onOk : function(){},        
		onClose :function(){},
		onSelect : function(item){},  
		onSelectM : function(items){},
		idSql : '',                      // ��ȡ��߿������ݵ�sql
		nameSql : '',                      // ��ȡ��߿������ݵ�sql
		nameStr : '',
		name : 'defaultSelectDivId123', // �Ի����id
		selected : []
	}
}

// ����ѡ��Ի���
dlg.TwoWayDialog=function(args){
	var self = this;
	this.selectedItems = []
	var params = {}
	self.args = args
	
	if (args == null )params = getDefaultDlgParam()
	else{
		if(args.title != null)params.title = args.title;
		if(args.onOk != null)params.onOk = args.onOk;
		if(args.onClose != null)params.onClose = args.onClose;
		if(args.onSelect != null)params.onSelect = args.onSelect;
		if(args.onSelectM != null)params.onSelectM = args.onSelectM;
		if(args.sql != null)params.sql = args.sql;
		if(args.selectFrom != null)params.selectFrom = args.selectFrom;
		if(args.selectTo != null)params.selectTo = args.selectTo;
		if(args.name != null)params.name = args.name;
		if(args.selected != null)params.selected = args.selected;
		if(args.idSql != null)params.idSql = args.idSql;
		if(args.nameSql != null)params.nameSql = args.nameSql;
		if(args.nameStr != null){
			params.nameStr = args.nameStr;
		}else{
			params.nameStr = "";
		}
	}
	ops[params.selectFrom] = params.selectTo
	ops[params.selectTo] = params.selectFrom
	self.params = params
	
	// ��ʼ���Ի���
	initDialog();
	
	
	function initDialog(){
	    if($('#dlgHTML_34556_yuu123').size() == 0){
    		dlgHTML_34556_yuu = fillParams(params, dlgHTML_34556_yuu)
    		$('body').prepend(dlgHTML_34556_yuu)
	    }
		var dialogDivName = params.name
		$('#' + dialogDivName).dialog({
	        modal: true,
	        width: '438px',
	        heigth: '321px',
	        autoOpen: false,
	       // zIndex : -1000,
	       // show: 'drop',
	       // hide: 'drop',
	        overlay: {
	                backgroundColor: '#000',
	                opacity: 0.1
	        },
	        buttons: {
	            '�� ��' : function(){
	                $(this).dialog('close')
	                if(params.onClose){
    	                params.onClose()
	                }
	            },
	            'ȷ ��' : function(){
	                $(this).dialog('close')
	                var selectds = $('#' + params.selectTo).find('nobr')
	                selectds = $.makeArray(selectds)
	                var ids = []
	                for(var i=0;i<selectds.length;i++){
	                	var v = $(selectds[i])
	                	ids.push({id:v.attr('id'), name:v.html()})
                	}
	            	params.onOk(ids)
	            }
	        }
	    });
	    dlg.instance = self;
	}
	
	// ��ʾ�Ի���
	var isFirst = null
	this.open=function(){
		removeAllItem(params.selectFrom)
		removeAllItem(params.selectTo)
		// ��ʼ������
		initData();
		$('#' + params.name).dialog('open')
	}
	
	this.setSelected=function(p){
		params.selected = p
	}
	
	// ��ʼ����ȡ����
	function initData(){
		var nameSql = params.nameSql;
		var idSql = params.idSql;
		var nameStr = params.nameStr;
		var names;
		if (nameStr != '' && nameStr != null){
			names = nameStr.split(",");
		}else{
		    names = queryDataArr(nameSql);
		}
		var ids = queryDataArr(idSql);
		var from = params.selectFrom;
		var to = params.selectTo;
		for(var i=0; i<names.length; i++){
			var name = names[i];
			var bid = ids[i];
			if(inArray(params.selected, bid)){ // ��ѡ��
				addItem(bid, name,  $('#'+to)[0]);
			}else{
				addItem(bid, name,  $('#'+from)[0]);
			}
		}
	}

	function queryDataArr(bsql) {
		var url = "/servlet/commonservlet?tag=201&paramValue="+getAESEncode(encodeURIComponent(bsql));
		var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		var filedtext = "TEXT";
		var retVal = [];
		xmlhttp.Open("get", url, false);
		xmlhttp.send(null);
		if (!isSuccess(xmlhttp))
			return
		var dXML = new ActiveXObject("Microsoft.XMLDOM");
		dXML.load(xmlhttp.responseXML);
		var element = dXML.selectSingleNode("/root/rowSet");
		while (element != null) {
			var text = element.selectSingleNode(filedtext).text;
			retVal.push(text);
			element = element.nextSibling;
		}
		return retVal;
	}
	
	function fillParams(params, str){
		str = str.replace(/\$ID/g, params.name)
				 .replace(/\$TITLE/g, params.title)
				 .replace(/\$SELECTFROM/g, params.selectFrom)
				 .replace(/\$SELECTTO/g, params.selectTo)
		return str
	}
	
	//ѡ���Ƴ�����
	this.addItemFromChoice=function(bdivId, isMultiple)
	{
		var selectedDivName = ops[bdivId]
	    if(oClickedItem)
	    {
	        var id = oClickedItem.id;
	        var name = oClickedItem.innerText;
	        //��ӵ�Ŀ��
	        if(!isMultiple && bdivId==selectedDivName){
	            $('#'+bdivId).html('')
	        }else{
	            //�Ƴ���ǰ��
	            var oNextItem = oClickedItem.nextSibling;
	            oClickedItem.removeNode(true);
	            oClickedItem = null;
	        }
	        addItem(id, name, $('#'+bdivId)[0]);
	    }
	}
	
	function addItem(id, name, bdiv) {
	    var bid = bdiv.id
	    var opid = ops[bid]
	    var opEl = $('#'+opid)
	    
	    // ���Ŀ��bdiv���Ѿ�����ͬid, �����
	    var alreadyHas = getOptions(bid)
	    needAdd = true
	    for(i=0;i<alreadyHas.length;i++){
	        aid = alreadyHas[i][0]
	        aname = alreadyHas[i][1]
	        if(aid == id || aname == name){
	            needAdd = false
	            break
	        }
	    }
	    if(!needAdd)return
	    
	    //��ȡԱ��ְλ
	    outHTML = ''
	    outHTML += '<div title="'+ name +'"  id="'+ id +'" position="R" style="height:20px;PADDING-left:3px;margin:1px;white-space:nowrap;cursor:default;background-color:#EFF3FE;" ';
	    outHTML +=  'onclick="dlg.instance.configItemClick()"  ondblclick="dlg.instance.addItemFromChoice(\''+ opid +'\')">';
	    outHTML +=  '<nobr id="'+ id +'" class="itemNobr">' + name+'</nobr>';
	    outHTML += '</div>';
	    //bdiv.insertAdjacentHTML("beforeEnd",outHTML);
	    $('#'+bid).html($('#'+bid).html() + outHTML )
	}
	
	//ѡ��ĳ��
	this.configItemClick=function()
	{
	    var i;
	    //��ԭ��ѡ�ж���"ȡ��ѡ��"
	    if(oClickedItem)
	    {
	        oClickedItem.runtimeStyle.backgroundColor = '';
	        oClickedItem.runtimeStyle.color = '';
	    }
	    
	    //������ѡ�ж���"����ѡ��"
	    oClickedItem = getElement(event.srcElement,'div');
	    oClickedItem.runtimeStyle.backgroundColor = '#808080';
	    oClickedItem.runtimeStyle.color = 'white';
	}
	
	
	function removeAllItem(destDivId){
	    //srcDivId = ops[destDivId]
	    //allSrc = getOptions(srcDivId)
	    //for(i=0; i<allSrc.length; i++){
	        //id = allSrc[i][0]
	       // name = allSrc[i][1]
	        //addItem(id, name, document.getElementById(destDivId))
	    //}
	    $('#'+destDivId).html('')
	}
	
	// return [[id1, name1],[id2, name2],...]
	function getOptions(divId){
	    var vals = []
	    $('#'+divId + ' nobr').each(function(){
	        el = $(this)
	        vals.push([el.attr('id'), el.html()])
	    })
	    return vals
	}
	
	
	
} // end of dialog class

var dlgHTML_34556_yuu = 
				"<div id='dlgHTML_34556_yuu123' style=\"display:none\">\n" +
				"  <div id=\"$ID\" title='$TITLE'>\n" + 
				"    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin:10px\">\n" + 
				"      <tr height=\"20\">\n" + 
				"        <td ALIGN=\"center\">��&nbsp;&nbsp;ѡ</td>\n" + 
				"        <td>&nbsp;</td>\n" + 
				"        <td ALIGN=\"center\">ѡ&nbsp;&nbsp;��</td>\n" + 
				"      </tr>\n" + 
				"      <tr>\n" + 
				"        <td> <div style='overflow:scroll'><div class='treeDiv2' id=\"$SELECTFROM\" width=\"220\" onOptionDblClick=\"dlg.instance.addItemFromChoice('$SELECTTO')\"/></div></td>\n" + 
				"        <td width=\"80\">\n" + 
				"          <table border=\"0\" cellspacing=\"5\" cellpadding=\"0\" width=\"100%\" valign=\"center\">\n" + 
				"              <tr>\n" + 
				"                <td align=\"center\"><button  width=\"33\" onclick=\"dlg.instance.addItemFromChoice('$SELECTTO')\" id=\"addBtn\">&nbsp;>&nbsp;</button></td>\n" + 
				"              </tr>\n" + 
				"              <tr>\n" + 
				"                <td align=\"center\"><button width=\"33\" onclick=\"dlg.instance.addItemFromChoice('$SELECTFROM')\" id=\"delBtn\">&nbsp;<&nbsp;</button></td>\n" + 
				"              </tr>\n" + 
				"             </table>\n" + 
				"        </td>\n" + 
				"        <td>\n" + 
				"        <div style='overflow:scroll'><div class='treeDiv2' id=\"$SELECTTO\" width=\"220\"\n" + 
				"            onOptionDblClick=\"delBtn.click()\" onMoveOptionIn=\"moveIn()\"/></div></td>\n" + 
				"      </tr>\n" + 
				"     </table>\n" + 
				"  </div>\n" + 
				"</div>";


