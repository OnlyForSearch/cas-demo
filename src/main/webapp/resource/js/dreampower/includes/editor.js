var iniIfmHtml = '<html><head></head><body></body></html>';
var myEditor={}
myEditor.majorVer = navigator.appVersion.match(/MSIE (.)/)[1] ;
myEditor.minorVer = navigator.appVersion.match(/MSIE .\.(.)/)[1] ;
myEditor.isIE55OrMore = myEditor.majorVer >= 6 || ( myEditor.majorVer >= 5 && myEditor.minorVer >= 5 ) ;
myEditor.window=window
myEditor.inIframe=self.name!=''
myEditor.defaultView='Design'
myEditor.showPropertiesBody=false
myEditor.history=[]
myEditor.history.states=20
myEditor.visible=true
myEditor.path=document.location.href.replace(/(.*\/)[^\/]+\..*\??.*/g,'$1')
myEditor.baseURL='dreampower';
//资源管理器的路径
myEditor.explorerURL='explorer.php'
myEditor.explorerURLForDialog='../../explorer.php'
if(myEditor.inIframe){
	//如果这“编辑器”在表框架里，且有表单，初始化一些变量
	//附引用“编辑器”的代码
	//"<textarea name='$name' id=\"$name\" style='width:0px;height:0px;display:none;'>$value</textarea>
	//<textarea id=\"{$name}_head\" style='width:0px;height:0px;display:none;'>{$content[1]}</textarea>
	//<iframe name='$name' id=\"ifrm{$name}\" scrolling='no' src='dreampower.htm' class='multitext' style='padding:0px;margin:0px;width:100%;height:{$height}px;' content='{$content[0]}' skin='{$skin}' lang='{$lang}' editable='true' frameborder=0></iframe>";
	myEditor.myIframe=parent.document.getElementById('ifrm'+self.name)
	myEditor.myTextarea=parent.document.getElementById(self.name)
	myEditor.myHTMLHead=parent.document.getElementById(self.name+'_head')
	//myEditor.myDocument=myEditor.myTextarea.document
	//myEditor.myForm=myEditor.myTextarea.form
	//资源管理器的路径
	myEditor.explorerURL='admin.php?act=explorer&adsess='+myEditor.myIframe.s
	myEditor.explorerURLForDialog='../../../../admin.php?act=explorer&adsess='+myEditor.myIframe.s
    switch(myEditor.myIframe.content.toLowerCase()){
		case 'html':
			myEditor.HTML=myEditor.myTextarea.value
			break;
		case 'body':
			myEditor.HTML=myEditor.myHTMLHead.value+myEditor.myTextarea.value+'</body></html>'
			break;
		case 'text':
			myEditor.HTML=myEditor.myTextarea.value
			break;
        case 'iframe':
            myEditor.HTML=parent.frames[myEditor.myIframe.ifmId].document.documentElement.outerHTML;
			break;
	}
    myEditor.submit = function()
    {
        /*for(var i=0;i<myEditor.myDocument.frames.length;i++){
			var content=''
			with(myEditor.myDocument.frames[i]){
				//我们找出父框架中含有 Dreampower 的浮动框架,且此浮动框架所对应的 表单就是当前的表单
				if(myEditor.myIframe.editable!='true' && myEditor.myForm!=this) continue;
				if(myEditor.currentView=='Text'){
					content=myEditor.text
				}else{
					switch(myEditor.myIframe.content.toLowerCase()){
						case 'html':
							content=myEditor.HTML.replace(eval('/((background|src|href)=\"?)'+myEditor.path.toRegExp()+'/ig'),'$1')//只要相对路径
							break;
						case 'body':
							content=myEditor.bodyHTML.replace(eval('/((background|src|href)=\"?)'+myEditor.path.toRegExp()+'/ig'),'$1')
							break;
						case 'text':
							content=myEditor.text
							break;
					}
				}
				splitTextarea(myEditor.myTextarea,content)
			}
		}*/
        var content='';
        switch(myEditor.myIframe.content.toLowerCase()){
            case 'iframe':
            	content=myEditor.HTML.replace(eval('/((background|src|href)=\"?)'+myEditor.path.toRegExp()+'/ig'),'$1')//只要相对路径
                break;
            case 'html':
                content=myEditor.HTML.replace(eval('/((background|src|href)=\"?)'+myEditor.path.toRegExp()+'/ig'),'$1')//只要相对路径
                break;
            case 'body':
                content=myEditor.bodyHTML.replace(eval('/((background|src|href)=\"?)'+myEditor.path.toRegExp()+'/ig'),'$1')
                break;
            case 'text':
                content=myEditor.text
                break;
        }
        return content;     
    }
	//更新表单的 onsubmit 和 submit()
	/*if(myEditor.myForm.originalOnsubmit==null)myEditor.myForm.originalOnsubmit=myEditor.myForm.onsubmit;
	if(myEditor.myForm.originalSubmit==null)myEditor.myForm.originalSubmit=myEditor.myForm.submit;
	myEditor.myForm.onsubmit=function(){
		alert()
        //拆分大文本
		for(var i=0;i<myEditor.myDocument.frames.length;i++){
			var content=''
			with(myEditor.myDocument.frames[i]){
				//我们找出父框架中含有 Dreampower 的浮动框架,且此浮动框架所对应的 表单就是当前的表单
				if(myEditor.myIframe.editable!='true' && myEditor.myForm!=this) continue;
				if(myEditor.currentView=='Text'){
					content=myEditor.text
				}else{
					switch(myEditor.myIframe.content.toLowerCase()){
						case 'html':
							content=myEditor.HTML.replace(eval('/((background|src|href)=\"?)'+myEditor.path.toRegExp()+'/ig'),'$1')//只要相对路径
							break;
						case 'body':
							content=myEditor.bodyHTML.replace(eval('/((background|src|href)=\"?)'+myEditor.path.toRegExp()+'/ig'),'$1')
							break;
						case 'text':
							content=myEditor.text
							break;
					}
				}
				splitTextarea(myEditor.myTextarea,content)
			}
		}
		return this.originalOnsubmit()
	}
	myEditor.myForm.submit=function(){
		this.onsubmit()
		this.originalSubmit()
	}*/
}else{
	myEditor.HTML=iniIfmHtml;
}
// 大文件内容自动拆分 ,此函数来自 eWebSoft.com
function splitTextarea(objField, html) { 
	var strFieldName = objField.name.replace(/\[\]/g,'')+'[]';//php 的要加 []
	var objForm = objField.form;
	var objDocument = objField.document;
	objField.value = html;

	//表单限制值设定，限制值是102399，考虑到中文设为一半
	var FormLimit = 50000 ;

	// 再次处理时，先赋空值
	for (var i=1;i<objDocument.getElementsByName(strFieldName).length;i++) {
		objDocument.getElementsByName(strFieldName)[i].value = "";
	}

	//如果表单值超过限制，拆成多个对象
	if (html.length > FormLimit) { 
		objField.value = html.substr(0, FormLimit) ;
		html = html.substr(FormLimit) ;
		objField.name=strFieldName
		while (html.length > 0) { 
			var objTEXTAREA = objDocument.createElement("TEXTAREA") ;
			objTEXTAREA.name = strFieldName ;
			objTEXTAREA.style.display = "none" ;
			objTEXTAREA.value = html.substr(0, FormLimit) ;
			objForm.appendChild(objTEXTAREA) ;
			html = html.substr(FormLimit) ;
		} 
	} 
} 
//当文档完成时，进行初始化
document.onreadystatechange=function (){
	//只进行一次
	if (document.readyState!="complete") return;
	if (document.initialized) return;
	document.initialized = true;
	//创建工具条
	createToolbar()
	//初始化document的事件
	with(document){
		//
		onmousedown=function(){
			hideDropdown()
			var srcElt=event.srcElement
			if(srcElt.id=='tdViewSeparator'){
				with(document.whichObjectMove=srcElt.firstChild){
					style.display='block'
					style.pixelTop=style.oldTop=getAbsolutePostion(srcElt).top-5
					style.evY=event.clientY+document.body.scrollTop
				}
			}
			document.evY=event.clientY+document.body.scrollTop
			document.evX=event.clientX+document.body.scrollLeft
		}
		onmousemove=function(){
			if(document.whichObjectMove){
				with(document.whichObjectMove){
					style.pixelTop=style.oldTop+event.clientY-style.evY
				}
			}
		}
		onmouseup=function(){
			if(document.whichObjectMove){
				with(document.whichObjectMove){
					if(id=='divViewSeparator'){
						var dy=style.pixelTop-style.oldTop
						with(parentNode.parentNode.previousSibling.firstChild){
							var h=parseInt(((offsetHeight+dy)/offsetHeight)*parseInt(height))
							if(h>99){
								doViewButtonClick('btCode')
							}else if(h<1){
								doViewButtonClick('btDesign')
							}else{
								height=h+'%'
							}
						}
						style.display='none'
					}
				}
			}
			document.whichObjectMove=null
		}
		onkeydown=doShortcutKey
	}
	//
	taLine.value=''
	for(taLine.n=1;taLine.n<=50;taLine.n++){
		taLine.value += ' '+taLine.n+'\n' ;
	}
	with(taLine){
		onselectstart=new Function('return false')
		onclick=new Function('selectLines(taCode)')
	}
	//
	taCode.value=myEditor.HTML
	with(taCode){
		onscroll=showLine
		onkeypress=onkeyup=doSameContent
		document.onselectionchange=doSameContent
	}
	//
	initIfrmDesign('On',true)
	//
	doViewButtonClick('bt'+myEditor.defaultView)
	if(myEditor.showPropertiesBody){
		tdShowPropertiesBody.onclick()
	}
	//
	if(myEditor.visible){
		new Function(document.all('btVisibleBorder').myselect.replace(/(^|\W+)this(\W+|$)/g,"$1document.all('btVisibleBorder')$2"))()
	}else{
		new Function(document.all('btVisibleBorder').myunselect.replace(/(^|\W+)this(\W+|$)/g,"$1document.all('btVisibleBorder')$2"))()
	}
}

//初始化设计视窗
function initIfrmDesign(mode,hasEvent){
	with(ifrmDesign.document){
		designMode=mode
		write(myEditor.HTML)
		close();
		execCommand("2D-Position",true,true);
		execCommand("MultipleSelection", true, true);
		execCommand("LiveResize", true, true);
		if(hasEvent){
			//为什么要加入 setTimeout() ,我也不清楚原因,但这样才达到想要的效果
			//可能是因为 selection 的产生是发生在事件之后,所以要延迟来取得 selection
			onmousedown=new Function('hideDropdown();setTimeout(showTagPath,1)')
			onkeydown=new Function('return doShortcutKey(ifrmDesign.event)')
			onkeypress=onkeyup=doSameContent
			onselectionchange=doSameContent
		}
	}
}
//视图按钮点击
function doViewButtonClick(btId){
	var bt=document.all(btId)
	if(bt.length){
		bt[bt.length-1].onclick()
	}else{
		bt.onclick()
	}
	saveSelection()
}
//改变视图
function changeView(view){
	view=view.toCapitalize()
	if(myEditor.currentView==view)return;
	if (view=='Text'){
		if (!confirm("警告！切换到纯文本视窗会丢失您所有的HTML格式，您确认切换吗？")){
			if(myEditor.currentView){
				doViewButtonClick('bt'+myEditor.currentView)
			}
			return false;
		}
	}else{
		if (!myEditor.isIE55OrMore){
			alert("HTML设计视窗需要IE5.5版本以上的支持！");
			doViewButtonClick('btText')
			return false;
		}
	}
	if(myEditor.currentView){
		switch(myEditor.currentView){
			case 'Code':
				myEditor.HTML=taCode.value
				if(view=='Text'){
					myEditor.text=ifrmDesign.document.body.innerText
				}
				break;
			case 'Split':
				myEditor.HTML=taCode.value
				if(view=='Text'){
					myEditor.text=ifrmDesign.document.body.innerText
				}
				break;
			case 'Design':
				myEditor.HTML=ifrmDesign.document.all[0].outerHTML;
				if(view=='Text'){
					myEditor.text=ifrmDesign.document.body.innerText
				}
				break;
			case 'Text':
				myEditor.HTML='<html><head></head><body>'+htmlEncode(taCode.value)+'</body></html>'
				break;
			case 'Preview':
				try{myEditor.HTML=ifrmDesign.document.all[0].outerHTML;}catch(e){};
				break;
		}
	}
	var arrObj=[tdInsertbarTop,tdInsertbar,tdInsertbarBottom,tdStandardbar,tdCode,tdViewSeparator,tdDesign,tdTagPath,tdBottomPanel]
	for(var i=0;i<arrObj.length;i++){
		arrObj[i].parentNode.style.display=/^(Text|Preview)$/.test(view) ? 'none' : ''
	}
	for(var i=0;i<tblMain.rows.length;i++){
		tblMain.rows[i].style.display=/^(Text|Preview)$/.test(view)||arrObj[i].innerHTML=='' ? 'none' : ''
	}
	switch(view){
		case 'Code':
			var arrObj=[tdViewSeparator,tdDesign,tdTagPath]
			for(var i=0;i<arrObj.length;i++){
				arrObj[i].parentNode.style.display='none'
			}
			taCode.value=myEditor.HTML
			taCode.focus()
			myEditor.activateWin='Code'
			break;
		case 'Split':
			taCode.value=myEditor.HTML
			initIfrmDesign('On',true)
			break;
		case 'Design':
			var arrObj=[tdViewSeparator,tdCode]
			for(var i=0;i<arrObj.length;i++){
				arrObj[i].parentNode.style.display='none'
			}
			initIfrmDesign('On',true)
			ifrmDesign.focus()
			myEditor.activateWin='Design'
			break;
		case 'Text':
			var arrObj=[tdCode,tdStatusbar,tdEditor]
			for(var i=0;i<arrObj.length;i++){
				arrObj[i].parentNode.style.display=''
			}
			taCode.value=myEditor.text
			taCode.focus()
			myEditor.activateWin='Code'
			break;
		case 'Preview':
			var arrObj=[tdDesign,tdStatusbar,tdEditor]
			for(var i=0;i<arrObj.length;i++){
				arrObj[i].parentNode.style.display=''
			}
			ifrmDesign.focus()
			myEditor.activateWin='Design'
			initIfrmDesign('Off')
			break;
	}
	if(view=='Design'||view=='Split'){
		showBordersAndHiddenElements(myEditor.visible)
	}
	sltCodeWinHeight.disabled=view!='Split'
	myEditor.currentView=view
}
function changeEditWin(obj){
	if(obj.id=="taCode"){
		taLine.style.backgroundColor="#B2B4BF"
		myEditor.activateWin='Code'
	}else{
		taLine.style.backgroundColor="#E0DFE3"
		myEditor.activateWin='Design'
	}
}
//使代码视窗与设计视窗内容一致
function doSameContent(view){
	if(myEditor.activateWin=="Code"||view=='Code'){
		if(myEditor.HTML!=taCode.value){
			myEditor.HTML=taCode.value
			initIfrmDesign('On',true)
			myEditor.bodyHTML=ifrmDesign.document.body.innerHTML
			myEditor.text=ifrmDesign.document.body.innerText
			showLine()
			showBordersAndHiddenElements(myEditor.visible)
			//保存历史记录
			saveHistory()
		}
	}
	if(myEditor.activateWin!="Code"||view=='Design'){
		try{
			if(myEditor.HTML!=ifrmDesign.document.all[0].outerHTML){
				taCode.value=myEditor.HTML=ifrmDesign.document.all[0].outerHTML;
				myEditor.bodyHTML=ifrmDesign.document.body.innerHTML
				myEditor.text=ifrmDesign.document.body.innerText
				showLine()
				showBordersAndHiddenElements(myEditor.visible)
				//保存历史记录
				saveHistory()
			}
		}catch(e){};
	}
}

//显示或隐藏属性面板
function showPropertiesBody(obj){
	with(document.all.divPropertiesBody.parentNode.parentNode.style){
		if(display==''){
			imgRightArrow.style.display=''
			imgBottomArrow.style.display='none'
			display='none'
		}else{
			imgRightArrow.style.display='none'
			imgBottomArrow.style.display=''
			display=''
		}
	}
}

//代码输入框与行数框滚动同步
function showLine(){
	taLine.scrollTop = taCode.scrollTop;
	while(taLine.scrollTop != taCode.scrollTop) {
		taLine.value += ' '+(taLine.n++)+'\n'  ;
		taLine.scrollTop = taCode.scrollTop;
	}
	taLine.style.pixelWidth=taLine.scrollWidth
	return;
}
function selectLines(obj,srcElt,lines) {
	srcElt=srcElt==null ? event.srcElement : srcElt
	lines=lines!=null?lines:1
	var lineHeight=srcElt.style.lineHeight ? parseInt(srcElt.style.lineHeight) : 14
	var currLine=Math.ceil(event.offsetY/lineHeight)
	if(!/^\d+$/.test(currLine) || currLine==0) return;
	var rng = obj.createTextRange();
	var arr = obj.value.split(/\n/);
	if(currLine>arr.length) currLine = arr.length;
	var str_tmp = "";
	for(var i=0; i<currLine-1; i++) {
		str_tmp += arr[i];
	}
	rng.moveStart('character',str_tmp.length);
	str_tmp = "";
	for(i=currLine+lines-1; i<arr.length; i++) {
		str_tmp += arr[i];
	}
	rng.moveEnd('character',-str_tmp.length); 
	rng.select();
	return;
}

//保存当前视窗的选区并初始化一些变量
function saveSelection(noFocus){
	var tmpDocument
	if(myEditor.activateWin=='Code'||myEditor.currentView=='Code'){
		if(!noFocus)taCode.focus();
		tmpDocument=taCode.document
	}else{
		if(!noFocus)ifrmDesign.focus();
		tmpDocument=ifrmDesign.document
	}
	with(myEditor.document=tmpDocument){
		with(myEditor.selection=selection){
			myEditor.selectionType=type.toUpperCase()
			var rng = myEditor.selectionRange=createRange()
			myEditor.selectionItem=createRange().item ? createRange().item(0) : null
			myEditor.selectionTagName=(type=='Control'?rng.item(0).tagName:rng.parentElement().tagName)
			myEditor.selectionElement=(type=='Control'?rng.item(0):rng.parentElement())
			if((myEditor.activateWin=='Code'||myEditor.currentView=='Code')){
					var txt	= rng.text!=null?rng.text:"" ;
					rng.moveStart('character',/^[^<]*>/.test(txt)?txt.indexOf('>')+1:0)//前面去除 [^<]*> 的选区
					rng.moveEnd('character',/<[^>]*$/.test(txt)?-(txt.length-txt.lastIndexOf('<')):0)//后面去除 <[^>]* 的选区
			}
			myEditor.selectionText=(type=='Control'?'':rng.text).replace(/(\n)/g,'')
			myEditor.selectionHTML=(type=='Control'
									?(rng.item 
									 ? rng.item(0).outerHTML 
									 : ''
									)
									:((myEditor.activateWin=='Code'||myEditor.currentView=='Code')
									   ?rng.text
									   :rng.htmlText
									  )
									).replace(/(\n)/g,'')
			
		}
	}
}

//execCommand方法
function doCommand(cmd,f,v){
	if(cmd=="copy"||cmd=="delete"||cmd=="cut"){
		myEditor.document.execCommand(cmd)
	}else{
		if(myEditor.activateWin=="Code"){
			doCommandForCode(cmd,f,v)
		}else{
			var tmpDoc=myEditor.selectionType=="NONE" ? ifrmDesign.document : myEditor.selectionRange
			myEditor.selectionRange.select()
			if(cmd){
				if(f!=null){
					if(v!=null){
						tmpDoc.execCommand(cmd,f,v)
					}else{
						tmpDoc.execCommand(cmd,f)
					}
				}else{
					tmpDoc.execCommand(cmd)
				}
			}
		}
	}
	doSameContent()
}

//execCommand方法,适用于代码视窗
function doCommandForCode(cmd,f,v){
	var rng = myEditor.selectionRange;
	var txt	= rng.text!=null?rng.text:"" ;
	rng.moveStart('character',/^[^<]*>/.test(txt)?txt.indexOf('>')+1:0)//前面去除 [^<]*> 的选区
	rng.moveEnd('character',/<[^>]*$/.test(txt)?-(txt.length-txt.lastIndexOf('<')):0)//后面去除 <[^>]* 的选区
	divTemp.innerHTML = rng.text!=null?rng.text:"";
	var objTextRange = document.body.createTextRange()
	with(objTextRange){
		moveToElementText(divTemp);
		select()
		if(cmd){
			if(f!=null){
				if(v!=null){
					execCommand(cmd,f,v)
				}else{
					execCommand(cmd,f)
				}
			}else{
				execCommand(cmd)
			}
		}
	}
	rng.text=divTemp.innerHTML
	//恢复改变后的选区
	rng.moveStart('character',-divTemp.innerHTML.replace(/\n/g,'').length)
	rng.select()
	divTemp.innerHTML = "" ;
}

function doPaste(){
	if(myEditor.activateWin=='Code'||myEditor.currentView=='Code'){
		insert(clipboardData.getData("Text"))
	}else{
		divTemp.innerHTML = ""
		var objTextRange = document.body.createTextRange()
		objTextRange.moveToElementText(divTemp);
		objTextRange.execCommand('paste')
		var re = /<\w[^>]* class="?MsoNormal"?/gi
		if ( re.test(divTemp.innerHTML)){
			if ( confirm( "你要粘贴的内容好象是从Word中拷出来的，是否要先清除Word格式再粘贴？" ) ){
				divTemp.innerHTML=cleanWord( divTemp.innerHTML);
			}
		}
		insert(divTemp.innerHTML)
	}
}

// 清除WORD冗余格式
function cleanWord( html,flag ) {
	if(flag){
		html=myEditor.HTML
	}
	// Remove all SPAN tags
	html = html.replace(/<\/?SPAN[^>]*>/gi, "" );
	// Remove Class attributes
	html = html.replace(/<(\w[^>]*) class=([^ |>]*)([^>]*)/gi, "<$1$3") ;
	// Remove Style attributes
	html = html.replace(/<(\w[^>]*) style="([^"]*)"([^>]*)/gi, "<$1$3") ;
	// Remove Lang attributes
	html = html.replace(/<(\w[^>]*) lang=([^ |>]*)([^>]*)/gi, "<$1$3") ;
	// Remove XML elements and declarations
	html = html.replace(/<\\?\?xml[^>]*>/gi, "") ;
	// Remove Tags with XML namespace declarations: <o:p></o:p>
	html = html.replace(/<\/?\w+:[^>]*>/gi, "") ;
	// Replace the &nbsp;
	html = html.replace(/&nbsp;/, " " );
	// Transform <P> to <DIV>
	var re = new RegExp("(<P)([^>]*>.*?)(<\/P>)","gi") ;	// Different because of a IE 5.0 error
	html = html.replace( re, "<div$2</div>" ) ;
	if(flag){
			taCode.value=html
			doSameContent('Code')
	}else{
		return html
	}
}

//设置样式
//attribute,value 可为数组
//此函数写得太烦琐,下一版本写成多个函数,或写成一个类
function setStyle(attribute,value,tagName,forceApply){
	if(attribute==null){
		alert("参数无效,可能未设置")
		return
	}
	var arrAttribute=[''],arrValue=['']
	if(typeof(attribute)== 'object'){
		arrAttribute=attribute
		arrValue=value
	}
	var doc=myEditor.document
	var rng = myEditor.selectionRange;
	//
	if(empty(rng.htmlText)&&myEditor.selectionType!='CONTROL')return;
	tagName=empty(tagName) ? 'SPAN' : tagName.toUpperCase()
	if(myEditor.activateWin=='Code'||myEditor.currentView=='Code'){
		var skip=false
		var txt=rng.text!=null?rng.text:"";
		rng.moveStart('character',/^[^<]*>/.test(txt)?txt.indexOf('>')+1:0)
		rng.moveEnd('character',/<[^>]*$/.test(txt)?-(txt.length-txt.lastIndexOf('<')):0)
		//我们必需使用 divTemp.innerHTML 存 rng.text,使文本规范化
		divTemp.innerHTML= rng.text!=null?rng.text:"" ;
		if(/^<((.+)|(.+>.*<\/.+))>$/i.test(divTemp.innerHTML)){
			if(forceApply||divTemp.firstChild.tagName==tagName){
				for(var i=0;i<arrAttribute.length;i++){
					if(arrAttribute[i]!=''){
						attribute=arrAttribute[i]
						value=arrValue[i]
					}
					attribute=attribute.replace(/\-/g,'').toUncapitalize()
					//有些样式的属性是 Boolen 类型的,所以我们在值上加入后缀-Boolean
					if(/\-Boolean$/i.test(value)){
						attribute+=value.replace(/(\-Boolean$)|(\-)/g,'')
						divTemp.firstChild.style.setAttribute(attribute,!divTemp.firstChild.style.getAttribute(attribute))
					}else{
						if(empty(value)){
							divTemp.firstChild.style.removeAttribute(attribute)
						}else{
							divTemp.firstChild.style.setAttribute(attribute,value)
						}
					}
				}
				skip=true
			}
		}
		if(!skip){
			var strStyle=''
			for(var i=0;i<arrAttribute.length;i++){
				if(arrAttribute[i]!=''){
					attribute=arrAttribute[i]
					value=arrValue[i]
				}
				var reg=eval('/\\b'+attribute.replace(/\-/g,'\\-')+':/i')
				if(/\-Boolean$/i.test(value)&&reg.test(strStyle)){
					strStyle=strStyle.replace(reg,attribute+':'+value.replace(/\-Boolean$/i,'')+' ')
				}else{
					if(!empty(value)){
						strStyle+=attribute+':'+value.replace(/\-Boolean$/i,'')+';'
					}
				}
			}
			var openTag=empty(strStyle)?'':'<'+tagName+' style="'+strStyle+'">'
			var closeTag=openTag==''?'':'</'+tagName+'>'
			divTemp.innerHTML=openTag+divTemp.innerHTML+closeTag
			if(tagName=='FONT'){divTemp.firstChild.removeAttribute('size')}
		}
		rng.text=divTemp.innerHTML
		rng.moveStart('character',-divTemp.innerHTML.replace(/\n/g,'').length)
	}else{
		if(myEditor.selectionType=='CONTROL'){
			var elt=myEditor.selectionItem
			//如果当前选区的标签和我们提供的标签一致,且内容一样,我们就直接在此对象上设置样式
			if(forceApply||elt.tagName==tagName||(elt.parentNode.tagName==tagName&&elt.parentNode.innerHTML==elt.outerHTML)){
				elt=(elt.tagName==tagName||forceApply)?elt:elt.parentNode
				for(var i=0;i<arrAttribute.length;i++){
					if(arrAttribute[i]!=''){
						attribute=arrAttribute[i]
						value=arrValue[i]
					}
					attribute=attribute.toUncapitalize().replace(/\-/g,'')
					//有些样式的属性是 Boolen 类型的,所以我们在值上加入后缀-Boolean
					if(/\-Boolean$/i.test(value)){
						attribute+=value.replace(/(\-Boolean$)|(\-)/g,'')
						elt.style.setAttribute(attribute,!elt.style.getAttribute(attribute))
					}else{
						//在 Desgin 视窗中 我们用 currentStyle 对象判断此属性和值是否一样
						var tmpValue=elt.currentStyle.getAttribute(attribute)
						if(tmpValue!=null&&(value.toLowerCase()==tmpValue.toString())){
							continue
						}
						if(empty(value)){
							elt.style.removeAttribute(attribute)
						}else{
							elt.style.setAttribute(attribute,value)
						}
					}
				}
			}else{
				if(!empty(value)){
					//我们用替换对象的方法来设置样式
					//当然,也可以给控件的outerHTML属性赋值来实现
					var newElt=doc.createElement(tagName)
					newElt.innerHTML=elt.outerHTML
					for(var i=0;i<arrAttribute.length;i++){
						if(arrAttribute[i]!=''){
							attribute=arrAttribute[i]
							value=arrValue[i]
						}
						var tmpValue=elt.currentStyle.getAttribute(attribute)
						if(tmpValue!=null&&(value.toLowerCase()==tmpValue.toString())){
							continue
						}
						attribute=attribute.toUncapitalize().replace(/\-/g,'')
						//有些样式的属性是 Boolen 类型的,所以我们在值上加入后缀-Boolean
						if(/\-Boolean$/i.test(value)){
							attribute+=value.replace(/(\-Boolean$)|(\-)/g,'')
							value=true
						}
						newElt.style.setAttribute(attribute,value)
					}
					elt.replaceNode(newElt)
				}
				try{
					rng = doc.body.createTextRange() ;
					rng.moveToElementText(elt) ;
				}catch(e){}
				rng.collapse(false)
			}
		}else{
			var elt=rng.parentElement()
			divTemp.innerHTML=rng.htmlText
			if(elt.tagName==tagName&&elt.innerText==divTemp.innerText){
				for(var i=0;i<arrAttribute.length;i++){
					if(arrAttribute[i]!=''){
						attribute=arrAttribute[i]
						value=arrValue[i]
					}
					attribute=attribute.toUncapitalize().replace(/\-/g,'')
					//有些样式的属性是 Boolen 类型的,所以我们在属性值后加入后缀 -Boolean
					if(/\-Boolean$/i.test(value)){
						attribute+=value.replace(/(\-Boolean$)|(\-)/g,'')
						elt.style.setAttribute(attribute,!elt.style.getAttribute(attribute))
					}else{
						var tmpValue=elt.currentStyle.getAttribute(attribute)
						if(tmpValue!=null&&(value.toLowerCase()==tmpValue.toString())){
							continue
						}
						if(empty(value)){
							elt.style.removeAttribute(attribute)
						}else{
							elt.style.setAttribute(attribute,value)
						}
					}
				}
			}else{
				var strStyle=''
				for(var i=0;i<arrAttribute.length;i++){
					if(arrAttribute[i]!=''){
						attribute=arrAttribute[i]
						value=arrValue[i]
					}
					var tmpValue=elt.currentStyle.getAttribute(attribute.replace(/\-/g,''))
					//考虑 Boolen 类型的属性值
					if(tmpValue!=null&&(value.toLowerCase()==tmpValue.toString()||(/\-Boolean$/i.test(value)&&(eval('/'+(value.replace(/\-Boolean$/i,'').toRegExp())+'/i').test(tmpValue))))){
						continue
					}
					var reg=eval('/\\b'+attribute.replace(/\-/g,'\\-')+':/i')
					if(/\-Boolean$/i.test(value)&&reg.test(strStyle)){
						strStyle=strStyle.replace(reg,attribute+':'+value.replace(/\-Boolean$/i,'')+' ')
					}else{
						if(!empty(value)){
							strStyle+=attribute+':'+value.replace(/\-Boolean$/i,'')+';'
						}
					}
				}
				//去掉重复的标签
				if(divTemp.childNodes.length==1&&divTemp.firstChild.tagName&&needToRemoveTag(elt,divTemp.firstChild)){
					divTemp.innerHTML=divTemp.firstChild.innerHTML
				}
				var openTag=empty(strStyle)?'':'<'+tagName+' style="'+strStyle+'">'
				var closeTag=openTag==''?'':'</'+tagName+'>'
				var length=divTemp.innerText.replace(/\n/g,'').length
				saveSelection()
				rng.pasteHTML(openTag+divTemp.innerHTML+closeTag)
				//pasteHTML() 会在内容周围包含额外的标签,所以我们就去掉额外的标签
				if(elt.childNodes.length==1&&elt.firstChild.tagName&&needToRemoveTag(elt,elt.firstChild)){
					elt.innerHTML=elt.firstChild.innerHTML
				}
				rng.moveStart('character',-length)
			}
		}
	}
	rng.select()
	divTemp.innerHTML=''
	doSameContent()
}

//插入,注意:如果不是标签,则 value 必为这样 <*>[</*>] 的格式,否则可能会自动附加一对额外的标签
//value:插入的内容,flag:标记,flag的值为"select","TAGNAME"时插入内容后会选中内容
//"TAGNAME"用于检查是否想插入一个标签,这时value为标签名称
function insert(value,flag){
	var doc=myEditor.document
	var rng = myEditor.selectionRange;	
	flag=empty(flag)?'':flag
	if(myEditor.activateWin=='Code'||myEditor.currentView=='Code'){//代码窗口
		var txt=rng.text!=null?rng.text:"";
		rng.moveStart('character',/^[^<]*>/.test(txt)?txt.indexOf('>')+1:0)
		rng.moveEnd('character',/<[^>]*$/.test(txt)?-(txt.length-txt.lastIndexOf('<')):0)
		if(flag.toLowerCase()=='tagname'){
			value="<"+value+">"+(rng.text!=null?rng.text:"")+"</"+value+">"
		}
		rng.text=value
		rng.moveStart('character',-value.replace(/\n/g,'').length)
	}else{//设计窗口
		//如果选中的是控件
		if(myEditor.selectionType=='CONTROL'){
			var newElt,elt=myEditor.selectionItem
			//我们就用新的元素来替换
			if(flag.toLowerCase()=='tagname'){
				newElt=doc.createElement(value)
				newElt.innerHTML=elt.outerHTML
			}else{
				//如果插入的内容不符合 <*>[</*>] 的格式,则我们附加一对额外的标签再替换
				newElt=doc.createElement('span')
				var startTagName=value.replace(/^<([^<>\s]+).*/,'$1').toUpperCase()
				var endTagName=value.replace(/.*<\/?([^<>\s]+).*>$/,'$1').toUpperCase()
				newElt.innerHTML=startTagName==endTagName? value : '<span>'+value+'</span>'
				newElt=newElt.firstChild
			}
			elt.replaceNode(newElt)
			try{
				rng = doc.body.createTextRange() ;
				rng.moveToElementText(elt) ;
			}catch(e){}
		}else{
			var length
			var elt=myEditor.selectionElement
			if(flag.toLowerCase()=='tagname'){
				var html=rng.htmlText!=null?rng.htmlText:''
				//因为这种情况下 pasteHTML() 会在内容周围包含额外的标签,所以我们就预先去掉此标签
				if(/^<[^<>]+>/.test(html)){
					divTemp.innerHTML=html
					html=divTemp.firstChild.innerHTML
					divTemp.removeChild(divTemp.firstChild)
					html+=divTemp.innerHTML
				}
				value="<"+value+">"+(html)+"</"+value+">"
				length=rng.text.replace(/\n/g,'').length
			}else{
				divTemp.innerHTML=value
				//去掉重复的标签
				if(divTemp.childNodes.length==1&&divTemp.firstChild.tagName&&needToRemoveTag(elt,divTemp.firstChild)){
					divTemp.innerHTML=divTemp.firstChild.innerHTML
				}
				length=divTemp.innerText.replace(/\n/g,'').length
			}
			//确保焦点,否则 pasteHTML() 时可能会出错 
			saveSelection()
			try{
				rng.pasteHTML(value)
				if(elt.childNodes.length==1&&elt.firstChild.tagName&&needToRemoveTag(elt,elt.firstChild)){
					elt.innerHTML=elt.firstChild.innerHTML
				}
			}catch(e){}
			rng.moveStart('character',-length)
		}
	}
	if(flag.toLowerCase()=='select'||flag=='TAGNAME'){
		rng.select()
	}else{
		rng.collapse(false)
	}
	divTemp.innerHTML=''
	saveSelection()
	doSameContent()
}
function needToRemoveTag(elt,elt0){
	// ^o^ 哦!用正规表达式简单一点
	try{//因为有些标签没有 innerHTML 属性
		if(elt.canHaveHTML&&elt0.canHaveHTML){
			var html0=elt.outerHTML
			var html1=elt.innerHTML
			var index=html0.indexOf(html1)
			var html2=html0.substring(0,index)+html0.substr(index+html1.length)
			html0=elt0.outerHTML
			html1=elt0.innerHTML
			index=html0.indexOf(html1)
			var html3=html0.substring(0,index)+html0.substr(index+html1.length)
			if(html2==html3 && elt.childNodes.length==1){
				return true
			}
		}
	}catch(e){}
	return false
}
//历史记录
function saveHistory(){
	//初始化历史
	if(!myEditor.history.length){
		myEditor.history.index=0
		myEditor.history[0]=	{
									HTML:myEditor.HTML,
									bookmark:'',
									view:myEditor.currentView,
									win:myEditor.activateWin
								}
	}
	if(	myEditor.history[myEditor.history.index]
		&& myEditor.history[myEditor.history.index].HTML
		&& myEditor.history[myEditor.history.index].HTML!=myEditor.HTML
	){
		//如果历史记录已满,则清除旧的记录
		if(myEditor.history.length<myEditor.history.states){
			myEditor.history.index++
			//清除当前记录后的所用历史记录
			for(var i=myEditor.history.index;i<myEditor.history.length;i++){
				myEditor.history.pop()
			}
		}else{
			myEditor.history.shift()
		}
		//取得选区的当前状态
		var bookmark
		if(myEditor.activateWin=='Code'){
			var rng=document.selection.createRange()
			bookmark=rng.parentElement()==taCode ? rng.getBookmark() : ''
		}else{
			if (ifrmDesign.document.selection.type != "Control"){
				bookmark = ifrmDesign.document.selection.createRange().getBookmark();
			} else {
				var rng=ifrmDesign.document.selection.createRange()
				bookmark = rng.item!=null? rng.item : rng.getBookmark();
			}
		}
		//记录历史
		myEditor.history[myEditor.history.index]=	{
														HTML:myEditor.HTML,
														bookmark:bookmark,
														view:myEditor.currentView,
														win:myEditor.activateWin
													}
	}
}

function gotoHistory(index,flag){
	//如果flag为假,则index为增量
	if(!flag){
		index=myEditor.history.index+index
	}
	if(index<0 || index>=myEditor.history.length)return;
	myEditor.history.index=index
	//返回历史记录
	myEditor.HTML=taCode.value=myEditor.history[index].HTML
	initIfrmDesign('On',true)
	myEditor.bodyHTML=ifrmDesign.document.body.innerHTML
	myEditor.text=ifrmDesign.document.body.innerText
	showLine()
	//改变视图
	if(myEditor.history[index].view && myEditor.history[index].view!=myEditor.currentView){
		doViewButtonClick('bt'+myEditor.history[index].view)
	}
	//设置选区
	if(myEditor.history[index].win && myEditor.history[index].win=='Code'){
		if(myEditor.history[index].bookmark){
			var rng=document.body.createTextRange()
			rng.moveToBookmark(myEditor.history[index].bookmark)
			rng.select()
		}
	}else{
		if(myEditor.history[index].bookmark){
			var rng=ifrmDesign.document.body.createTextRange()
			//确保选区准确,所以用两次 rng.select()
			//^_^其实还不是很准确
			rng.select()
			if(myEditor.history[index].bookmark== "[object]"){
				if(/^(table|img)$/i.test(myEditor.history[index].bookmark.tagName)){
					rng=ifrmDesign.document.body.createControlRange()
					rng.addElement(myEditor.history[index].bookmark)
				}else{
					try{
						rng.moveToElementText(myEditor.history[index].bookmark)
					}catch(e){}
				}
			}else{
				rng.moveToBookmark(myEditor.history[index].bookmark)
			}
			rng.select()
		}
	}
}

//快捷键
function doShortcutKey(evt){
	evt = evt !=null?evt:event
	var char = String.fromCharCode(evt.keyCode).toUpperCase();
	if(/(Code)|(Design)|(Split)/i.test(myEditor.currentView)){
		if (evt.ctrlKey){
			switch(char){
				case 'D':// Ctrl+D:从Word粘贴
					return false
					break;
				case 'F':// Ctrl+F:查找替换
					return false
					break;
				case 'Y':// Ctrl+Y:重做
					gotoHistory(1)
					return false
					break;
				case 'Z':// Ctrl+Z:撤销
					gotoHistory(-1)
					return false
					break;
				case 'V':
					if(myEditor.activateWin=='Design'){
						doPaste();
						return false
					}
					break;
				case '':
					return false
					break;
				case '':
					return false
					break;
			}
		}
		//小回车 Shift+Enter
		if(myEditor.activateWin=='Design' &&   document.all('chkBR').checked && evt.keyCode==13 && !evt.shiftKey && evt.srcElement.tagName=='BODY'){
			with(ifrmDesign.document.selection.createRange()){
				pasteHTML('<br>')
				select();
				evt.cancelBubble = true;
				evt.returnValue = false;
				moveEnd("character", 1);
				moveStart("character", 1);
				collapse(false);
			}
			return false
		}
	}
	return true;
}
//显示边框和不可见元素
function showBordersAndHiddenElements(flag) {
	var allElements=[]
	myEditor.visible=flag!=null? flag : !myEditor.visible
	with(ifrmDesign.document){
		var arrTagName=["FORM","INPUT","TABLE","TD","TH","A","DIV","SPAN","IFRAME"]
		for(var i=0;i<arrTagName.length;i++){
			var elts=getElementsByTagName(arrTagName[i])
			for(var j=0;j<elts.length;j++){
				allElements.push(elts[j])
			}
		}
	}
	function hasBorderWidth(){
		var ret0,ret1
		with(elt.currentStyle){
			ret0= 	parseInt(borderLeftWidth)>0 
					&& parseInt(borderRightWidth)>0
					&& parseInt(borderTopWidth)>0
					&& parseInt(borderBottomWidth)>0
		}
		with(elt.runtimeStyle){
			ret1= 	parseInt(borderLeftWidth)>0 
					&& parseInt(borderRightWidth)>0
					&& parseInt(borderTopWidth)>0
					&& parseInt(borderBottomWidth)>0
		}
		return ret1?'2':(ret0?'1':'0')
	}
	function hasBackground(){
		var ret0,ret1
		with(elt.currentStyle){
			ret0= backgroundColor!='transparent' || backgroundImage!='none'
		}
		with(elt.currentStyle){
			ret1= backgroundColor!='transparent' || backgroundImage!='none'
		}
		return ret1?'2':(ret0?'1':'0')
	}
	for(var i=0;i<allElements.length;i++){
		var elt=allElements[i]
		with(elt.runtimeStyle){
			if(myEditor.visible){
				switch(elt.tagName){
					case 'FORM':// 表单
						border = "1px dotted #FF0000"
						height="15px"
						background= "URL("+myEditor.baseURL+"/images/formVisible.gif) no-repeat"
						break;
					case 'INPUT':// Input Hidden类
						if(elt.type.toUpperCase()=='HIDDEN'){
							width = "17px"
							height = "15px"
							border="none"
							background= "URL("+myEditor.baseURL+"/images/hiddenfieldVisible.gif) no-repeat"
						}else{
							cssText = ""
						}
						break;
					case 'TABLE':// 表格
					case 'TH':
					case 'TD':
						var hasBorder=false
						switch(elt.tagName){
							case 'TABLE':
								hasBorder=parseInt(elt.border)
								break;
							case 'TH':
							case 'TD':
								hasBorder=parseInt(elt.parentNode.parentNode.parentNode.border)
								break;
						}
						if(!hasBorder && (hasBorderWidth()=='0'||hasBorderWidth()=='2')){
							border = "1px dotted #999999"
						}else{
							cssText=''
						}
						break;
					case 'A'://锚记
						if(elt.name!=''){
							height = "15px"
							background= "URL("+myEditor.baseURL+"/images/anchorVisible.gif) no-repeat"
						}else{
							cssText = ""
						}
						break;
					case 'DIV':
					case 'SPAN'://层
						var noCssText=true
						if(elt.style.position=='absolute'){
							if(hasBorderWidth()=='0'||hasBorderWidth()=='2'){
								border = "1px outset"
								noCssText=false
							}
							if(hasBackground()=='0'||hasBackground()=='2'){
								background= "URL("+myEditor.baseURL+"/images/layerVisible.gif) no-repeat"
								noCssText=false
							}
						}
						if(noCssText){
							cssText = ""
						}
						break;
					case 'IFRAME'://浮动框架
						if(elt.frameBorder=='0' && (hasBorderWidth()=='0'||hasBorderWidth()=='2')){
							border="2px inset menu"
						}else{
							cssText=''
						}
						break;
				}
			}else{
				cssText = ""
			}
		}
	}
}
// 上移(1)或下移(-1)一层
function setZIndex(dIndex){
	if(myEditor.selectionType=='CONTROL'){
		var rng=myEditor.selectionRange
		for (var i=0; i<rng.length; i++){
			var obj = rng.item(i);
			obj.style.zIndex += dIndex;
		}
		doSameContent()
	}
}
//显示标签路径
function showTagPath(){
	if(myEditor.activateWin=='Design'){
		myEditor.temp=[]
		function createTagPath(obj){
			myEditor.temp.unshift(obj)
			if(obj.tagName=="BODY"){
				return '<td class=btTag>&lt;body'+(obj.className!=''?'.'+obj.className:'')+(obj.id!=''?'#'+obj.id:'')+'&gt;</td>'
			}else{
				return createTagPath(obj.parentElement)+('<td class=btTag>&lt;'+obj.tagName.toLowerCase()+(obj.className!=''?'.'+obj.className:'')+(obj.id!=''?'#'+obj.id:'')+'&gt;</td>')
			}
		}
		saveSelection()
		tdAdvancedProperties.obj=myEditor.selectionElement
		divTagPath.innerHTML='<table border="0" cellpadding="0" cellspacing="0"><tr id=trTmp>'
							+createTagPath(myEditor.selectionElement)
							+'</tr></table>'
		divTagPath.scrollLeft=divTagPath.scrollWidth-divTagPath.offsetWidth
		for(var i=0;i<document.all('trTmp').cells.length;i++){
			var objTd=document.all('trTmp').cells[i]
			objTd.obj=myEditor.temp[i]
			with(objTd){
				onmousedown=function(){
					if(divTagPath.whichTdSelected){
						divTagPath.whichTdSelected.className='btTag'
					}
					if(this.className!='btTagOn'){
						this.className='btTagOn'
					}
					tdAdvancedProperties.obj=this.obj
					divTagPath.whichTdSelected=this
				}
				ondblclick=function(){
					try{
						myEditor.tag=this.obj;
						showDialog('tagEditor.htm',616,404)
					}catch(e){}
				}
				onmouseup=function(){
					var rng
					if(/^(table|img)$/i.test(this.obj.tagName)){
						rng=ifrmDesign.document.body.createControlRange()
						rng.addElement(this.obj)
					}else{
						try{
							rng = ifrmDesign.document.body.createTextRange() ;
							rng.moveToElementText(this.obj);	
						}catch(e){}
					}
					rng.select()
					saveSelection()
				}
			}
		}
		myEditor.temp=null
	}
}
//新建文档,下一版本可以从模板中新建
function doNew(){
	if(myEditor.inIframe){
		switch(myEditor.myIframe.content.toLowerCase()){
			case 'html':
				myEditor.HTML=myEditor.myTextarea.value
				break;
			case 'body':
				myEditor.HTML=myEditor.myHTMLHead.value+'</body></html>'
				break;
			case 'text':
				myEditor.HTML=''
				break;
		}
	}else{
		myEditor.HTML='<html><head></head><body></body></html>'
	}
	taCode.value=myEditor.HTML
	initIfrmDesign('On',true)
}
function setEditorSize(size){
	if(myEditor.inIframe){
		var height = parseInt(myEditor.myIframe.offsetHeight);
		if (height+size>=400){
			myEditor.myIframe.style.pixelHeight=height+size;
		}
	}
}