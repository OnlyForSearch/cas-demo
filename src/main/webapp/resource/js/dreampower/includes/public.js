//����ĸ��д
String.prototype.toCapitalize=function(){
	return this.substring(0,1).toUpperCase()+this.substr(1);
}
//����ĸСд
String.prototype.toUncapitalize=function(){
	return this.substring(0,1).toLowerCase()+this.substr(1);
}
//��ת
String.prototype.reverse=function(){
	return this.split('').reverse().join('');
}
//�Ƿ����,�����ִ�Сд
String.prototype.isEq=function(str){
	return this.toLowerCase()==str.toLowerCase()
}
//תΪ������ʽ�ĸ�ʽ
String.prototype.toRegExp=function(){
	return this.replace(/([\\\.\*\!\$\^\+\/\(\)\{\}\"\'\[\]\|\-]{1})/g,'\\$1')
}
//��ȥ�������ַ�(��)
//position:-1 ��,0 ����,1 ��
String.prototype.trim = function(position,str) {
	position=position!=null?position:0
	str=str != null?str : " "
	var length=str.length
	if(position==-1 || position==0){
		for (var i = 0; i<this.length && (this.substring(i,i+length) == str || this.charAt(i) == "\n" || this.charAt(i) == "\r"); i=i+((this.charAt(i) == "\n" || this.charAt(i) == "\r")?1:length));
	}
	if(position==1 || position==0){
		for (var j = this.length; j>=(i?i:0) && (this.substring(j-length,j) == str || this.charAt(j-1) == "\n" || this.charAt(j-1) == "\r"); j=j-((this.charAt(j-1) == "\n" || this.charAt(j-1) == "\r")?1:length));
	}
	if(j<i){
		return ''
	}else{
		return (this.substring(i, j));
	}
};
//���Email
String.prototype.checkEmail=function(){
	var eml = this.replace(/[\n\r\*\'\"<>&\%\!\(\)\{\}\[\]\?\\/]/g,"");
	if ( /^.+\@(\[?)[a-zA-Z0-9\-\.]+\.([a-zA-Z]{2,4}|[0-9]{1,4})(\]?)$/.test(eml)){
		return eml;
	}else{
		return false;
	}
}
//HTML����
String.prototype.htmlEncode=function(){
	var text=this
	text = text.replace(/&/g, "&amp;") ;
	text = text.replace(/"/g, "&quot;") ;
	text = text.replace(/</g, "&lt;") ;
	text = text.replace(/>/g, "&gt;") ;
	text = text.replace(/'/g, "&apos;") ;
	return text;
}
function inputError(msg,obj){
	alert(msg)
	if(!obj.disabled){
		obj.focus()
		if((obj.tagName=='INPUT'&&(obj.type==''||obj.type.toLowerCase()=='text'))||obj.tagName=='TEXTAREA'){
			obj.select()
		}
	}
}
//�������������Ա����Ƿ��Ѿ����á��������Ѵ��ڡ��ǿ��ַ������߷��㣬�򷵻� false ֵ����֮���� true
empty=function(v){
	return v==null || v==='' || v===0
}
//HTML����
function htmlEncode(text){
	text = text.replace(/&/g, "&amp;") ;
	text = text.replace(/"/g, "&quot;") ;
	text = text.replace(/</g, "&lt;") ;
	text = text.replace(/>/g, "&gt;") ;
	text = text.replace(/'/g, "&apos;") ;
	return text;
}

//��ʾ�Ի���
function showDialog(url,width,height,path){
	if(event){
		myEditor.srcElement=event.srcElement
	}
	if(empty(width) || empty(height)){
		myEditor.dialogAutosize=true
	}
	width=empty(width) ? 466 : width
	height=empty(height) ? 300 : height
	var dialogURL=myEditor.baseURL.replace(/\/+$/,'')
	dialogURL=(dialogURL.length?dialogURL+'/':'')+'dialog/'
	path=(path!=null?path:dialogURL).replace(/\/+$/,'')
	path=path.length?path+'/':''
	return showModalDialog(path+url,myEditor, 'dialogWidth:'+width+'px; dialogHeight:'+height+'px;scroll:0; status:0;help:0;')
}
//��ʾ��ʽ�༭��
function showStyleEditor(obj,path,ta){
	obj=obj==null? event.srcElement:obj
	path=path==null ? '../' : path
	ta=ta!=null? ta : obj.parentNode.parentNode.firstChild.firstChild
	var css=showModalDialog(path+'cssStyleEditor/cssStyleEditor.htm',ta.value, 'dialogWidth:530px; dialogHeight:345px; status:0;help:0;')
	if(css!=null){
		ta.value=ta.tagName=='TEXTAREA' ? css.replace(/(\n|\r|;)/g,';\n\r') :css
		if(ta.onchange)ta.onchange();
	}
}
//��ʾ��Դ������
function showExplorer(obj,url,ta){
	obj=obj==null? event.srcElement:obj
	url=url==null ? myEditor.explorerURLForDialog : url
	ta=ta!=null? ta : document.frames(obj.parentNode.parentNode.firstChild.childNodes[1].ifrmId).tf
	var file=showModalDialog(url,ta.value, 'dialogWidth:630px; dialogHeight:390px;resizable:yes ;status:0;help:0;scroll:0;')
	if(file!=null){
		ta.value=file
		if(ta.onchange)ta.onchange();
	}
}
//ȡ�õ�ɫ���ֵ,���ı�Ԥ�����ı���ɫ����ɫ�ı����ֵ
//oldColor:�ɵ���ɫֵ,eventHandle:��ɫ��onOk���¼��ַ���
function getAndSetColor(obj,oldColor,strScript){
	obj=obj==null ? event.srcElement : obj
	oldColor=oldColor==null ? obj.style.backgroundColor : oldColor
	showDropdown('ifrmColorPicker',obj.previousSibling)
	//ע��:ifrmColorPickerǰ���ܼ�document.all,��ΪifrmColorPicker��ʱӦΪ��ܴ���,������������document.frames('ifrmColorPicker')
	ifrmColorPicker.document.all.tdOldColor.bgColor=ifrmColorPicker.document.all.tdPreviewColor.bgColor=ifrmColorPicker.document.all.tfHexColor.value=oldColor
	ifrmColorPicker.document.onOk=function(){
		if(!empty(strScript))eval(strScript);
		if(!empty(obj.extraScript))eval(obj.extraScript);
		hideDropdown('parent')
	}
}
//��ʾ������,dropdownName:���������� ,baseObj:���ƫ�ƵĶ���,���½�Ϊ����
function showDropdown(dropdownName,baseObj){
	baseObj=baseObj==null ? event.srcElement : baseObj
	with(document.all(dropdownName)){
		style.display='block'
		style.zIndex=2
	}
	//����������ȵĳߴ�
	var w0=parseInt(document.body.clientWidth)
	var h0=parseInt(document.body.clientHeight)
	var w=parseInt(document.frames(dropdownName).document.body.scrollWidth)
	var h=parseInt(document.frames(dropdownName).document.body.scrollHeight)
	document.all(dropdownName).style.pixelWidth=w>w0? w0 : w+(h>h0 ? (w+17>w0 ? w0 : 17) : 0)
	document.all(dropdownName).style.pixelHeight = h>h0 ? h0 : h+(w>w0 ? (h+17>h0 ? h0 : 17) : 0)
	//�����������λ��
	var pos=getAbsolutePostion(baseObj)
	with(document.all(dropdownName)){
		style.display='block'
		style.zIndex=2
		if(pos.left+offsetWidth>document.body.scrollLeft+document.body.clientWidth){
			style.pixelLeft=document.body.scrollLeft+document.body.clientWidth-offsetWidth
		}else{
			style.pixelLeft=pos.left
		}
		if(pos.top+baseObj.offsetHeight+offsetHeight>document.body.scrollTop+document.body.clientHeight){
			if(pos.top-offsetHeight<document.body.scrollTop){
				if(pos.top-document.body.scrollTop>document.body.clientHeight-(pos.top-document.body.scrollTop+baseObj.offsetHeight)){
					style.pixelTop=document.body.scrollTop
				}else{
					style.pixelTop=document.body.scrollTop+document.body.clientHeight-offsetHeight
				}
			}else{
				style.pixelTop=pos.top-offsetHeight
			}
		}else{
			style.pixelTop=pos.top+baseObj.offsetHeight
		}
	}
	//
	event.cancelBubble=true
	document.whichDropdownDisplay=document.all(dropdownName)
}
//ȡ�ö���ľ���λ��
function getAbsolutePostion(obj){
	var myTop = 0,myLeft = 0 ,stmp = "";
	obj=obj==null ? event.srcElement : obj
	while(eval("obj"+ stmp).tagName!="BODY"){
		myLeft += eval("obj"+stmp).offsetLeft;
		myTop += eval("obj"+stmp).offsetTop;
		stmp += ".offsetParent";
	}
	return {top:myTop,left:myLeft}
}

//����������ʾ��������
function hideDropdown(){
	if( document.whichDropdownDisplay!=null ){
		with(document.whichDropdownDisplay.style){
			display='none'
			zIndex='-1'
		}
	}
}
//=================================================
//���ǵĿɱ༭���½ӿ�
//=================================================

//�ɱ༭���½ӿ�
//ע��:������ܵ�id�����ǰ׺ifrm;  ��������е��ı���idΪ:tf;�������id�����ǰ׺slt
function writeEditableSelect(name,width,data,extraScript,extraScript_0,restrict){
	var text,value
	data=data!=null?data:[]
	var strTemp	='<div style="position: absolute;width:'+width+';height:100%;" class="longWidth"><table width="100%"  border="0" cellspacing="0" cellpadding="0"><tr>'
				+'<td width="100%"><iframe id="ifrm'+name+'" style="position:absolute;margin: 0px;border: none;top:2px;left:2px;height:16px;width:100%" scrolling="no" frameborder="0"></iframe></td>'
				+'<td width=21 valign="top"><img width=21 height=1></td></tr></table></div>'
				+'<select id="slt'+name+'" ifrmId="ifrm'+name+'" class="longWidth"  editable="true"  style="width:'+width+';height:20px;"  onChange="doEditableSelectChange();'+(extraScript!=null ? extraScript :'')+'">'
	if(data && data.length){
		text=data[0]
		value=data[1]
	}else{
		text=value=''
	}
	for(var i=0;i<data.length;i+=2){
		var t=''
		if(/\-Selected$/i.test(data[i+1])){
			t='selected'
			text=data[i]
			value=data[i+1]
		}
		strTemp	+='<option value="'+data[i+1]+'" '+t+'>'+data[i]+'</option>'
	}
	strTemp	+='</select>'
	document.write(strTemp)
	writeIframeBody(document.frames('ifrm'+name),'slt'+name,text,value,extraScript_0,restrict)
}
function writeIframeBody(obj,sltId,text,value,extraScript,restrict){
	strTemp	='<BODY style="margin: 0px;"><input '
			+'value="'+(text!=null?text:'')+'" '
			+'hiddenValue="'+(value!=null?value:'')+'" '
			+'id="tf" type="text" '
			+'style="padding-left:1px;padding-right:2px;border: none;font-family:����,Verdana, Arial, Helvetica, sans-serif;height 100%;width:100%;font-size: 12px;" '
			+'restrict="'+(restrict!=null?restrict:'')+'" '
			+'onkeypress="parent.doRestrict(event)" '
			+'onkeyup="parent.doRestrict(event);this.hiddenValue=parent.getEditableSelectValue(parent.document.all(\''+sltId+'\'),this.value);'+(extraScript!=null? extraScript :'')+'"  '
			+'onchange="parent.doRestrict(event);this.hiddenValue=parent.getEditableSelectValue(parent.document.all(\''+sltId+'\'),this.value);'+(extraScript!=null? extraScript :'')+'"  '
			+'></body>'
	obj.document.open('text/html','replace')
	obj.document.write(strTemp)
	obj.document.close()
	obj.document.onmousedown=hideDropdown
}
//�����������е��ı��������ֵ���������д���(�ı�),��ȡ��ֵ
function getEditableSelectValue(slt,v){
	for(var i=0;i<slt.options.length;i++){
		if(slt.options[i].innerText.toLowerCase()==v.toLowerCase()){
			slt.selectedIndex=i
			return slt.options[i].value
		}
	}
	slt.selectedIndex=-1
	return v
}
//��λ�������Ƿ���Ч,slt:��λ������,v:�ȴ��жϵ�ֵ
function unitIsEnabled(slt,v){
	var reg=/^[\-0-9]+$/
	slt.disabled=!reg.test(v)
}
//��������д����ı���,������ܵĵܽڵ�Ϊ������
//��������ı�ʱ,������ֵ�����ֽڵ㸡������е��ı���
//t0:�Ƿ�ʹ��������е��ı���ȡ�ý���
function doEditableSelectChange(t0){
	var obj=event.srcElement
	var tf=document.frames(obj.ifrmId).tf
	tf.value=obj.options[obj.selectedIndex].innerText
	tf.hiddenValue=obj.value
	if(t0)tf.select();
	if(t0)tf.focus();
}
//��ʼ��������
//slt:�����������;arr:����,���Ϊż����Ϊ�ı�,���Ϊ������Ϊֵ;index:Ĭ��ѡ��������;
function initSelect(slt,arr,index){
	//while(slt.length)slt.options.remove(0);
	slt.length=0
	for(var i=0;i<arr.length;i+=2){
		slt.options[slt.length]=new Option(arr[i],arr[i+1])
	}
	slt.selectedIndex=index!=null?index:0
	//�ɱ༭���½ӿ�ʱ...
	if(slt.editable && slt.editable.toLowerCase()=='true'){
		var tf=document.frames(slt.ifrmId).tf
		tf.value=slt.options[slt.selectedIndex].innerText
		tf.hiddenValue=slt.value
	}
}

//����������ѡ���ֵ���ı�,����������ֵһ��,��ѡ��
//slt:�����������;v:Ҫ���ҵ�����;f:�ǲ���ֵ�����ı��ı��;
function findOption(slt,v,f){
	if(v==null)v='';
	for (var i=0;i<slt.length;i++){
		var t=f?slt.options[i].innerText:slt.options[i].value
		if (t.toLowerCase() == v.toLowerCase()){
			slt.selectedIndex = i;
			if(slt.editable && slt.editable.toLowerCase()=='true'){
				var tf=document.frames(slt.ifrmId).tf
				tf.value=slt.options[slt.selectedIndex].innerText
				tf.hiddenValue=slt.value
			}
			return true;
		}
	}
	return false;
}
//���ѡ��
function addOption(slt,text,value,index){
	slt.options.add(new Option(text,value),index!=null?index:slt.length)
}

//ʹ������ʧЧ
function setSelectDisabled(slt,v){
	slt.disabled=v
	if(slt.editable && slt.editable.toLowerCase()=='true'){
		document.frames(slt.ifrmId).disabled=v
		document.frames(slt.ifrmId).tf.disabled=v
	}
}
function getSelectValue(slt){
	if(slt.editable && slt.editable.toLowerCase()=='true'){
		return document.frames(slt.ifrmId).tf.hiddenValue
	}else{
		return slt.value
	}
}
function getSelectText(slt){
	if(slt.editable && slt.editable.toLowerCase()=='true'){
		return document.frames(slt.ifrmId).tf.value
	}else{
		if(slt.selectedIndex>=0){
			return slt.options[slt.selectedIndex].innerText
		}else{
			return ''
		}
	}
}
//����������ַ�
//�����ͨ���ű����ı�ֵ,�� onpropertychange �¼�
function doRestrict(evt){
	var evt=evt!=null ? evt : event
	var srcElt=evt.srcElement
	var restrict=srcElt.restrict
	if(!empty(restrict)){
		if(evt.type=='keypress' && evt.keyCode!=null){
			//���������ַ��������ַ����е��ַ�,���¼�������ֵ
			evt.returnValue=eval('/['+restrict+']/').test(String.fromCharCode(evt.keyCode))
		}else{
			//����ֻ���������ַ����е��ַ�
			if(evt.type=='keyup'){
				//ctrl+v �����ÿ����ճ�������
				if(evt.ctrlKey && evt.keyCode==86){
					srcElt.value=srcElt.value.replace(eval('/[^'+restrict+']+/g'),'')
				}
			}else{
				srcElt.value=srcElt.value.replace(eval('/[^'+restrict+']+/g'),'')
			}
		}
	}
}
//�����ɫ�����ֵ,���ı�Ԥ�����ı���ɫ
function doTfHexChange(obj){
	obj=obj==null ? event.srcElement : obj
	if(obj.value==""){
		obj.parentNode.parentNode.firstChild.firstChild.style.backgroundColor=obj.value
		return;
	}
	var reg=/^#?[0-9A-Fa-f]*$/
	if(!reg.test(obj.value)){
		alert("������ʮ������ֵ (#RRGGBB)")
		obj.value=''
		return
	}
	var hex=obj.value.indexOf('#')<0 ? "#"+obj.value+"000000" : obj.value+"000000"
	obj.parentNode.parentNode.firstChild.firstChild.style.backgroundColor=obj.hiddenValue=obj.value=hex.substring(0,7)
	if(obj.extraScript){
		alert(obj.extraScript)
		eval(obj.extraScript)
	}
}

//�г��ĵ������е�CSS��ʽ��
function listClass(dom,slt,force,save){
	//�Ѵ���,����
	if(!document.arrClassList||force){
		var arr=new Array('','')
		for(var i=0;i<dom.styleSheets.length;i++){
			with(dom.styleSheets[i]){
				for(var j=0;j<rules.length;j++){
					with(rules[j]){
						if(/\./.test(selectorText)){
							s=selectorText.replace(/.*\.(\w+)(\s|#)?.*/,"$1")
							arr.push(s)
							arr.push(s)
						}
					}
				}
			}
		}
		//��arr �浽 document.arrClass,�Ժ���ô˺���ʱ,�Ͳ����ٲ�Ѱ
		if(save){
			document.arrClassList=arr
		}
		initSelect(slt,arr)
	}else{
		initSelect(slt,document.arrClassList)
	}
}

//�г��ĵ������е�Ŀ��
function listTarget(dom,slt,force,save){
	if(!document.arrTargetList||force){
		var LIST_TARGETS = new Array("","","_blank","_blank","_parent","_parent","_self","_self","_top","_top");
		var frameNames = dom.frames;
		for (var i=0; i < frameNames.length; i++){
			if(frameNames[i].name){
				LIST_TARGETS.push(frameNames[i].name);
				LIST_TARGETS.push(frameNames[i].name);
			}
		}
		var links = dom.getElementsByTagName('A');
		var DOC_TARGETS=new Array()
		for (var q=0; q < links.length; q++){
			if (links[q]){
				if (links[q].getAttribute("target")){
					var add = true;
					for (var y=0; y < DOC_TARGETS.length; y++){
						if (DOC_TARGETS[y] == links[q].getAttribute("target")){
							add = false;
							break;
						}
					}
					if (add){
						DOC_TARGETS.push(links[q].getAttribute("target"));
					}
				}
			}else{
				break;
			}
		}   
		var allTargets = LIST_TARGETS;
		for (var p=0; p < DOC_TARGETS.length; p++){
			var addTarget = true;
			for (var x=0; x < allTargets.length; x+=2){
			  if (allTargets[x] == DOC_TARGETS[p]){
				addTarget = false;
				break;
			  }
			}
			if (addTarget){
			  LIST_TARGETS.push(DOC_TARGETS[p]);
			  LIST_TARGETS.push(DOC_TARGETS[p]);
			}
		}
		if(save){
			document.arrTargetList=LIST_TARGETS
		}
		initSelect(slt,LIST_TARGETS)
	}else{
		initSelect(slt,document.arrTargetList)
	}
}
//�г��ĵ������е�����
function listLink(dom,slt,force,save){
	if(!document.arrLinkList||force){
		var LIST_LINKS=new Array('','')
		var allAnchors = dom.getElementsByTagName("A");
		var anchorName;
		for (var i=0; i < allAnchors.length; i++){
			if (allAnchors[i]){
				anchorName = allAnchors[i].getAttribute("NAME");
				if (anchorName){
					LIST_LINKS.push("#" + anchorName);
					LIST_LINKS.push("#" + anchorName);
				}
				anchorHref=allAnchors[i].getAttribute("HREF");
				if (anchorHref){
					var add=true
					for(var p=0;p<LIST_LINKS.length;p+=2){
						if(LIST_LINKS[p]==anchorHref){
							add=false
							break
						}
					}
					if(add){
						LIST_LINKS.push(anchorHref);
						LIST_LINKS.push(anchorHref);
					}
				}
			}else{
				break;
			}
		}
		if(save){
			document.arrLinkList=LIST_LINKS
		}
		initSelect(slt,LIST_LINKS)
	}else{
		initSelect(slt,document.arrLinkList)
	}
}
//�г��ĵ������е�ͼƬ����,��������ʽ���ͼƬ����
function listImage(dom,slt,force,save){
	if(!document.arrImageList||force){
		var LIST_IMAGES=new Array('','')
		var arr=new Array('IMG','TABLE','TD')
		for(var i=0;i<arr.length;i++){
			var elts = dom.getElementsByTagName(arr[i]);
			for(var j=0;j<elts.length;j++){
				var src=elts[j].getAttribute('SRC')
				var bg=elts[j].getAttribute('BACKGROUND')
				var value=arr[i]=='IMG'&&src ? src :bg
				if(value){
					var add=true
					for(var p=0;p<LIST_IMAGES.length;p+=2){
						if(LIST_IMAGES[p]==value){
							add=false
							break
						}
					}
					if(add){
						LIST_IMAGES.push(value);
						LIST_IMAGES.push(value);
					}
				}
			}
		}
		if(save){
			document.arrImageList=LIST_IMAGES
		}
		initSelect(slt,LIST_IMAGES)
	}else{
		initSelect(slt,document.arrImageList)
	}
}
//���ݱ���Ԫ�ص� id (ȥ��ǰ׺)������ǩ�����Ի���ʽ����(�� flag ȷ��)�ַ���
//ignore:������ʽ����,���� id ����������Ԫ��
//��ʽ property="..."  property="..."  property="..." 
function compileAttributesString(form,flag,ignore){
	var elts=form.elements
	var strTemp=''
	for(var i=0;i<elts.length;i++){
		//id ��Ҫ��:������slt �� tf �� ta �� rb �� chk Ϊǰ׺
		if(/^((slt)|(tf)|(ta)|(rb)|(chk)).+/.test(elts[i].id)){
			var id=elts[i].id
			var elt=elts[i]
			var attributeName=id.replace(/^((slt)|(tf)|(ta)|(rb)|(chk))/,'')
			if(ignore!=null && ignore.test(id)) continue;
			var prefix=id.replace(/^((slt)|(tf)|(ta)|(rb)|(chk)).+/,'$1')
			var value=''
			switch(prefix){
				case 'slt'://������
					value=getSelectValue(elt)
					break;
				case 'rb'://��ѡ��
				case 'chk'://��ѡ��
					if(elt.checked)value=elt.value;
					break;
				default://�����ؼ�
					value=elt.value
			}
			var eltUnit=form.elements(attributeName+'Units')
			//��������Դ��е�λ,����뵥λ
			if(eltUnit && /^\-?\d+$/.test(value) && value!=''){
				value+=eltUnit.value
			}
			value=value.toString().replace(/\"/g,'&quot;')
			if(value!=''){
				if(flag){
					strTemp+=attributeName+':'+(/image$/i.test(attributeName)&&value!=''?'url('+value+')':value)+';'
				}else{
					strTemp+=attributeName+'="'+(attributeName.toLowerCase()=='style'?value.replace(/\n|\r/g,''):value)+'" '
				}
			}
		}
	}
	return strTemp.trim(0,flag?';':' ')
}
//���ݱ�ǩ�����Ի���ʽ����(�� flag ȷ��)�����ñ�Ԫ�ص�ֵ
function initFormFromTag(objTag,form,flag,ignore){
	if(objTag==null)return;
	var elts=form.elements
	myEditor.temp=[]//�����ǩ�����Ժ�ֵ,�ָ�ԭʼ����ʱ�õ�
	for(var i=0;i<elts.length;i++){
		if(/^((slt)|(tf)|(ta)|(rb)|(chk)).+/.test(elts[i].id)){
			var id=elts[i].id
			var elt=elts[i]
			var attributeName=id.replace(/^((slt)|(tf)|(ta)|(rb)|(chk))/,'')
			if(ignore!=null && ignore.test(id)) continue;
			var prefix=id.replace(/^((slt)|(tf)|(ta)|(rb)|(chk)).+/,'$1')
			var value
			if(flag){
				value=objTag.style.getAttribute(attributeName.toUncapitalize().replace(/\-/g,''))
				if(value!=null){
					myEditor.temp[attributeName.toUncapitalize().replace(/\-/g,'')]=value
				}
				if(/image$/i.test(attributeName)){
					value=value.replace(/url\((.+)\)/i,'$1')
				}
			}else{
				var tmp=attributeName.toUncapitalize()
				value=objTag.getAttribute(tmp=='class'?'className':tmp)
				if(tmp=='style')value=value.cssText;
				if(value!=null){
					myEditor.temp[tmp]=value
				}
			}
			if(value!=null){
				switch(prefix){
					case 'slt':
						var tmpValue=value
						if(/^\-?\d+[pxtinmce%]{1,2}$/i.test(value.toString())&&form.elements(attributeName+'Units')){
							tmpValue=value.toString().replace(/^(\-?\d+)[^\d]*/g,'$1')
						}
						if(!findOption(elt,tmpValue) && elt.editable && elt.editable.toLowerCase()=='true'){
							document.frames(elt.ifrmId).tf.hiddenValue=document.frames(elt.ifrmId).tf.value=tmpValue
						}
						break;
					case 'rb':
						if(elts(elt.name).length){
							for(var p=0;p<elts(elt.name).length;p++){
								if(elts(elt.name)[p].toLowerCase()==value.toLowerCase()){
									elts(elt.name)[p].checked=true
									break;
								}
							}
						}else{
							elt.checked=value;
						}
						break;
					case 'chk':
						elt.checked=value;
						break;
					default:
						if(/^\-?\d+[pxtinmce%]{1,2}$/i.test(value.toString())&&form.elements(attributeName+'Units')){
							elt.value=value.toString().replace(/^(\-?\d+)[^\d]*/g,'$1')
						}else{
							elt.value=attributeName.toLowerCase()=='style' ? (elt.tagName=='TEXTAREA'?value.replace(/;/g,';\n\r'):value) : value
						}
				}
				//��λ������
				var eltUnit=form.elements(attributeName+'Units')
				if(eltUnit){
					findOption(eltUnit,value.toString().replace(/^-?\d*/g,''))
				}
				//��ɫ��
				if(elt.className.toLowerCase()=="tfcolor"){
					//���ֵ�� # ֻ����λ������λ
					if(elt.value.length==4){
						elt.value	='#'
									+elt.value.substr(1,1)+elt.value.substr(1,1)
									+elt.value.substr(2,1)+elt.value.substr(2,1)
									+elt.value.substr(3,1)+elt.value.substr(3,1)
					}
					doTfHexChange(elt);
				}
			}
		}
	}
}
//���ݱ���Ԫ�ص� id (ȥ��ǰ׺)�����û��Ƴ���ǩ�����Ի���ʽ����(�� flag ȷ��)
//ע��:���û��Ƴ��������ƵĴ�Сд
function setOrRemoveAttribute(objTag,form,flag,ignore){
	if(objTag==null)return;
	var elts=form.elements
	for(var i=0;i<elts.length;i++){
		if(/^((slt)|(tf)|(ta)|(rb)|(chk)).+/.test(elts[i].id)){
			var id=elts[i].id
			var elt=elts[i]
			var attributeName=id.replace(/^((slt)|(tf)|(ta)|(rb)|(chk))/,'')
			if(ignore!=null && ignore.test(id)) continue;
			var prefix=id.replace(/^((slt)|(tf)|(ta)|(rb)|(chk)).+/,'$1')
			var value=''
			switch(prefix){
				case 'slt':
					value=getSelectValue(elt)
					break;
				case 'rb':
				case 'chk':
					if(elt.checked)value=elt.value;
					break;
				default:
					value=elt.value
			}
			var eltUnit=form.elements(attributeName+'Units')
			if(eltUnit && /^\-?\d+$/.test(value) && value!=''){
				value+=eltUnit.value
			}
			attributeName=attributeName.toUncapitalize()
			if(value && (attributeName!='tabIndex' || (attributeName=='tabIndex' && value!='0'))){
				if(flag){
					objTag.style.setAttribute(attributeName.replace(/\-/g,''),(/image$/i.test(attributeName)?'url('+value+')':value))
				}else{
					var tmp=attributeName.toUncapitalize()
					if(tmp=='style'){
						objTag.style.cssText=value
					}else{
						objTag.setAttribute(tmp=='class'?'className':tmp,value)
					}
				}
			}else{
				if(flag){
					objTag.style.removeAttribute(attributeName.replace(/\-/g,''))
				}else{
					//�������͵������ô˷����Ƴ�
					if(prefix=='chk'){
						objTag.setAttribute(attributeName,false)
					}else{
						var tmp=attributeName
						objTag.removeAttribute(tmp=='class'?'className':tmp)
					}
				}
			}
		}
	}
}
//��ʼ�� Tab
function initTab(){
	if(document.all.tblTab!=null){
		with(document.all.tblTab){
			for(var i=0;i<cells.length;i++){
				if(cells[i].className=='tabButton'){
					with(cells[i]){
						onmouseover=function(){
							this.style.textDecoration='underline'
						}
						onmouseout=function(){
							this.style.textDecoration='none'
						}
						onclick=function(){
							if(this.parentNode.whichTabOn){
								with(this.parentNode.whichTabOn){
									previousSibling.firstChild.style.display='none'
									style.backgroundImage=''
									style.color=''
									nextSibling.firstChild.style.display='none'
									document.all(table).style.display='none'
								}
							}
							this.previousSibling.firstChild.style.display='block'
							this.style.backgroundImage= 'url(../images/tabBg.gif)'
							this.style.color='#0046D5'
							this.nextSibling.firstChild.style.display='block'
							document.all(this.table).style.display='block'
							this.parentNode.whichTabOn=this
						}
					}
				}
			}
			cells[1].click()
		}
	}
}