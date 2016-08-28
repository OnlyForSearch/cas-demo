//首字母大写
String.prototype.toCapitalize=function(){
	return this.substring(0,1).toUpperCase()+this.substr(1);
}
//首字母小写
String.prototype.toUncapitalize=function(){
	return this.substring(0,1).toLowerCase()+this.substr(1);
}
//反转
String.prototype.reverse=function(){
	return this.split('').reverse().join('');
}
//是否相等,不区分大小写
String.prototype.isEq=function(str){
	return this.toLowerCase()==str.toLowerCase()
}
//转为正规表达式的格式
String.prototype.toRegExp=function(){
	return this.replace(/([\\\.\*\!\$\^\+\/\(\)\{\}\"\'\[\]\|\-]{1})/g,'\\$1')
}
//剪去给定的字符(串)
//position:-1 左,0 两端,1 右
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
//检查Email
String.prototype.checkEmail=function(){
	var eml = this.replace(/[\n\r\*\'\"<>&\%\!\(\)\{\}\[\]\?\\/]/g,"");
	if ( /^.+\@(\[?)[a-zA-Z0-9\-\.]+\.([a-zA-Z]{2,4}|[0-9]{1,4})(\]?)$/.test(eml)){
		return eml;
	}else{
		return false;
	}
}
//HTML编码
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
//本函数用来测试变量是否已经配置。若变量已存在、非空字符串或者非零，则返回 false 值；反之返回 true
empty=function(v){
	return v==null || v==='' || v===0
}
//HTML编码
function htmlEncode(text){
	text = text.replace(/&/g, "&amp;") ;
	text = text.replace(/"/g, "&quot;") ;
	text = text.replace(/</g, "&lt;") ;
	text = text.replace(/>/g, "&gt;") ;
	text = text.replace(/'/g, "&apos;") ;
	return text;
}

//显示对话框
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
//显示样式编辑器
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
//显示资源管理器
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
//取得调色板的值,并改变预览区的背景色和颜色文本域的值
//oldColor:旧的颜色值,eventHandle:调色板onOk的事件字符串
function getAndSetColor(obj,oldColor,strScript){
	obj=obj==null ? event.srcElement : obj
	oldColor=oldColor==null ? obj.style.backgroundColor : oldColor
	showDropdown('ifrmColorPicker',obj.previousSibling)
	//注意:ifrmColorPicker前不能加document.all,因为ifrmColorPicker这时应为框架窗体,可以这样引用document.frames('ifrmColorPicker')
	ifrmColorPicker.document.all.tdOldColor.bgColor=ifrmColorPicker.document.all.tdPreviewColor.bgColor=ifrmColorPicker.document.all.tfHexColor.value=oldColor
	ifrmColorPicker.document.onOk=function(){
		if(!empty(strScript))eval(strScript);
		if(!empty(obj.extraScript))eval(obj.extraScript);
		hideDropdown('parent')
	}
}
//显示下拉框,dropdownName:下拉框名称 ,baseObj:相对偏移的对象,左下角为基点
function showDropdown(dropdownName,baseObj){
	baseObj=baseObj==null ? event.srcElement : baseObj
	with(document.all(dropdownName)){
		style.display='block'
		style.zIndex=2
	}
	//设置下拉框等的尺寸
	var w0=parseInt(document.body.clientWidth)
	var h0=parseInt(document.body.clientHeight)
	var w=parseInt(document.frames(dropdownName).document.body.scrollWidth)
	var h=parseInt(document.frames(dropdownName).document.body.scrollHeight)
	document.all(dropdownName).style.pixelWidth=w>w0? w0 : w+(h>h0 ? (w+17>w0 ? w0 : 17) : 0)
	document.all(dropdownName).style.pixelHeight = h>h0 ? h0 : h+(w>w0 ? (h+17>h0 ? h0 : 17) : 0)
	//设置下拉框的位置
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
//取得对象的绝对位置
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

//隐藏正在显示的下拉框
function hideDropdown(){
	if( document.whichDropdownDisplay!=null ){
		with(document.whichDropdownDisplay.style){
			display='none'
			zIndex='-1'
		}
	}
}
//=================================================
//我们的可编辑的下接框
//=================================================

//可编辑的下接框
//注意:浮动框架的id会加入前缀ifrm;  浮动框架中的文本域id为:tf;下拉框的id会加入前缀slt
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
			+'style="padding-left:1px;padding-right:2px;border: none;font-family:宋体,Verdana, Arial, Helvetica, sans-serif;height 100%;width:100%;font-size: 12px;" '
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
//如果浮动框架中的文本域输入的值在下拉框中存在(文本),则取其值
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
//单位下拉框是否生效,slt:单位下拉框,v:等待判断的值
function unitIsEnabled(slt,v){
	var reg=/^[\-0-9]+$/
	slt.disabled=!reg.test(v)
}
//浮动框架中存在文本域,浮动框架的弟节点为下拉框
//当下拉框改变时,将它的值赋给兄节点浮动框架中的文本域
//t0:是否使浮动框架中的文本域取得焦点
function doEditableSelectChange(t0){
	var obj=event.srcElement
	var tf=document.frames(obj.ifrmId).tf
	tf.value=obj.options[obj.selectedIndex].innerText
	tf.hiddenValue=obj.value
	if(t0)tf.select();
	if(t0)tf.focus();
}
//初始化下拉框
//slt:下拉框的引用;arr:数据,序号为偶数的为文本,序号为奇数的为值;index:默认选中项的序号;
function initSelect(slt,arr,index){
	//while(slt.length)slt.options.remove(0);
	slt.length=0
	for(var i=0;i<arr.length;i+=2){
		slt.options[slt.length]=new Option(arr[i],arr[i+1])
	}
	slt.selectedIndex=index!=null?index:0
	//可编辑的下接框时...
	if(slt.editable && slt.editable.toLowerCase()=='true'){
		var tf=document.frames(slt.ifrmId).tf
		tf.value=slt.options[slt.selectedIndex].innerText
		tf.hiddenValue=slt.value
	}
}

//查找下拉框选项的值或文本,如果与给定的值一致,则选中
//slt:下拉框的引用;v:要查找的内容;f:是查找值还是文本的标记;
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
//添加选项
function addOption(slt,text,value,index){
	slt.options.add(new Option(text,value),index!=null?index:slt.length)
}

//使下拉框失效
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
//限制输入的字符
//如果是通过脚本来改变值,用 onpropertychange 事件
function doRestrict(evt){
	var evt=evt!=null ? evt : event
	var srcElt=evt.srcElement
	var restrict=srcElt.restrict
	if(!empty(restrict)){
		if(evt.type=='keypress' && evt.keyCode!=null){
			//如果输入的字符不属于字符集中的字符,则事件不返回值
			evt.returnValue=eval('/['+restrict+']/').test(String.fromCharCode(evt.keyCode))
		}else{
			//我们只保留属于字符集中的字符
			if(evt.type=='keyup'){
				//ctrl+v 考虑用快捷来粘帖的情况
				if(evt.ctrlKey && evt.keyCode==86){
					srcElt.value=srcElt.value.replace(eval('/[^'+restrict+']+/g'),'')
				}
			}else{
				srcElt.value=srcElt.value.replace(eval('/[^'+restrict+']+/g'),'')
			}
		}
	}
}
//检查颜色输入的值,并改变预览区的背景色
function doTfHexChange(obj){
	obj=obj==null ? event.srcElement : obj
	if(obj.value==""){
		obj.parentNode.parentNode.firstChild.firstChild.style.backgroundColor=obj.value
		return;
	}
	var reg=/^#?[0-9A-Fa-f]*$/
	if(!reg.test(obj.value)){
		alert("请输入十六进制值 (#RRGGBB)")
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

//列出文档中所有的CSS样式类
function listClass(dom,slt,force,save){
	//已存在,跳过
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
		//将arr 存到 document.arrClass,以后调用此函数时,就不用再查寻
		if(save){
			document.arrClassList=arr
		}
		initSelect(slt,arr)
	}else{
		initSelect(slt,document.arrClassList)
	}
}

//列出文档中所有的目标
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
//列出文档中所有的链接
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
//列出文档中所有的图片链接,不考虑样式里的图片链接
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
//根据表单的元素的 id (去掉前缀)来汇编标签的属性或样式属性(由 flag 确定)字符串
//ignore:正规表达式类型,忽略 id 符合条件的元素
//格式 property="..."  property="..."  property="..." 
function compileAttributesString(form,flag,ignore){
	var elts=form.elements
	var strTemp=''
	for(var i=0;i<elts.length;i++){
		//id 的要求:必须以slt 或 tf 或 ta 或 rb 或 chk 为前缀
		if(/^((slt)|(tf)|(ta)|(rb)|(chk)).+/.test(elts[i].id)){
			var id=elts[i].id
			var elt=elts[i]
			var attributeName=id.replace(/^((slt)|(tf)|(ta)|(rb)|(chk))/,'')
			if(ignore!=null && ignore.test(id)) continue;
			var prefix=id.replace(/^((slt)|(tf)|(ta)|(rb)|(chk)).+/,'$1')
			var value=''
			switch(prefix){
				case 'slt'://下拉框
					value=getSelectValue(elt)
					break;
				case 'rb'://单选框
				case 'chk'://复选框
					if(elt.checked)value=elt.value;
					break;
				default://其它控件
					value=elt.value
			}
			var eltUnit=form.elements(attributeName+'Units')
			//如果此属性带有单位,则加入单位
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
//根据标签的属性或样式属性(由 flag 确定)来设置表单元素的值
function initFormFromTag(objTag,form,flag,ignore){
	if(objTag==null)return;
	var elts=form.elements
	myEditor.temp=[]//保存标签的属性和值,恢复原始数据时用到
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
				//单位下拉框
				var eltUnit=form.elements(attributeName+'Units')
				if(eltUnit){
					findOption(eltUnit,value.toString().replace(/^-?\d*/g,''))
				}
				//颜色框
				if(elt.className.toLowerCase()=="tfcolor"){
					//如果值除 # 只有三位则补足六位
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
//根据表单的元素的 id (去掉前缀)来设置或移除标签的属性或样式属性(由 flag 确定)
//注意:设置或移除属性名称的大小写
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
					//布尔类型的属性用此法来移除
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
//初始化 Tab
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