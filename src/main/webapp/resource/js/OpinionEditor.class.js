// JavaScript Document
function Editor(id){
	this.width = '100%';
	this.height = '150px';
	this.imgPath = '/resource/image/';
	this.HTML;
	this.popwin;
	this.id = id;
        this.Menu='<IE:PopupMenu id="oMenu_'+this.id+'" icoUrl="'+this.imgPath+'">'+
        	   '<item ico="cfgMsg.gif" label="选择意见" event="'+this.id+'.chose()"/>'+
        	   '<item ico="editPLSQL.gif" label="自定义意见" event="'+this.id+'.diyOpinion()"/>'+
        	   '</IE:PopupMenu>'
	//alert(this.HTML);
	//document.getElementById("aaa").value = this.HTML;

	this.ini=function(){
		this.HTML = '<table style="width:'+this.width+'"  border="0" cellspacing="0" cellpadding="0">';
//		this.HTML = this.HTML + '<tr>';
//		this.HTML = this.HTML +	 '<td>';
//		this.HTML = this.HTML +         '<img title="选择意见"  class="imgbutton1" src="'+this.imgPath+'cfgMsg.gif" onclick="'+this.id+'.chose()" width="16" height="16">';
//		this.HTML = this.HTML +         '<img title="自定义意见"  class="imgbutton1" src="'+this.imgPath+'editPLSQL.gif" onclick="'+this.id+'.diyOpinion()" width="16" height="16">';
//		this.HTML = this.HTML +	 '</td>';
//		this.HTML = this.HTML + '</tr>';
		this.HTML = this.HTML + '<tr >';
		this.HTML = this.HTML +		'<td style="height:'+this.height+';"><div onmousedown="'+this.id+'.RightMenu()" style="width:'+this.width+';height:'+this.height+';overflow-y:auto;overflow-x:auto;border:1px solid black" CONTENTEDITABLE=true id="oDiv_'+this.id+'"></div></td>';
		this.HTML = this.HTML + '</tr>';
		this.HTML = this.HTML + '</table>';
	}
	this.write=function(){
          	document.write(this.Menu);
		document.write(this.HTML);
	}
        this.RightMenu = function(){
        	if(event.button==2){
                    document.getElementById("oMenu_"+this.id).show();
               }
        }
	this.chose = function(){
		this.popwin = window.createPopup();
		this.CreatePopupStyleSheet(this.popwin);
		this.popwin.document.body.scroll="no";
		this.popwin.document.body.background=this.imgPath+"form_9.gif";
		var pophtml = this.getOpinion();
		this.popwin.document.write(pophtml);
		this.popwin.show((screen.width-200)/2,(screen.height-160)/2,200,160,document.body);
		this.popwin.document.body.style.marginTop="0";
		this.popwin.document.body.style.marginLeft="";
		this.popwin.document.body.style.marginRight="0";
		this.popwin.document.body.style.marginBottom="0";
		this.popwin.document.body.style.overflow="hidden";
		this.popwin.document.body.style.border = "1px dashed #999999";
	}

	this.CreatePopupStyleSheet = function(oPopup){
		var PopupStyleSheet = oPopup.document.createStyleSheet();
		PopupStyleSheet.addRule('BODY','border:1px;');
	}

	this.getOpinion = function(){
		var url = "/servlet/WorkAction?action=14";
		var pophtml = '<SELECT  style="position:absolute;left=-4;top=-4 " onclick="parent.'+this.id+'.insertToC(this)" size="10" style="width:204px;">';
		var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttp.Open("POST",url,false);
		xmlhttp.send();

		var dXML = new ActiveXObject("Microsoft.XMLDOM");
		dXML.load(xmlhttp.responseXML);

		var element = dXML.selectSingleNode("/root/rowSet");

		while(element!=null){
			var text = element.selectSingleNode("TEXT").text;
			var val = element.selectSingleNode("VALUE").text;
			var type = element.selectSingleNode("TYPE").text;
			pophtml = pophtml + '<option value="'+val+'" type="'+type+'">'+text+'</option>';
			element = element.nextSibling;
		}
		pophtml = pophtml + '</select>';
		/*
		var pophtml1 = '<SELECT ID="CONDITION" NAME="CONDITION" onclick="parent.'+this.id+'.insertToC(this)" size="10" style="width:100%;">';
		pophtml1 = pophtml1 + '<option value="??" type="text">??</option>';
		pophtml1 = pophtml1 + '<option value="/upload/opinion/yy.gif" type="img">??</option>';
		pophtml1 = pophtml1 + '</SELECT>';*/
		return pophtml;
	}
        this.diyOpinion = function(){
          window.showModalDialog("sign.html","","dialogWidth=660px;dialogHeight=500px;help=0;scroll=0;status=0;")
        }
	this.insertToC = function(obj){
		if(obj.selectedIndex>=0){
			var opt = obj.options[obj.selectedIndex];
			if(opt.getAttribute("type")=="img"){
				var val = opt.value;
			    var onesplit=val.split("/upload/work/");
		        //var fir=onesplit[0];
		        //var sec=onesplit[1];
				//document.getElementById("oDiv_"+this.id).insertAdjacentHTML("beforeEnd",'<img src="'+fir+sec+'"/>');
		        document.getElementById("oDiv_"+this.id).innerHTML = '<img src="'+val+'"/>';
			}else{
				//document.getElementById("oDiv_"+id).insertAdjacentHTML("beforeEnd",opt.value);
				document.getElementById("oDiv_"+this.id).innerHTML = opt.value;
			}
			if(this.popwin!=null){
				this.popwin.hide();
			}
		}
	}
	this.getContent = function(){
		var html = document.getElementById("oDiv_"+this.id).innerHTML;
		var href = window.location.href;
		if(href.indexOf("://")>0){
			href = href.substring(0,href.indexOf("/",href.indexOf("://")+3));
			while(html.indexOf(href)>=0){
				html = html.replace(href,"");
			}
		}
		return html;
	}
	this.setContent = function(HTML){
		document.getElementById("oDiv_"+this.id).innerHTML = HTML;
	}
}
