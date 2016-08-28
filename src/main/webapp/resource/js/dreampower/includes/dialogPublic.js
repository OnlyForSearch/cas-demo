//全局对象
var myEditor={}
//初始化对话框
function initDialog(){
	myEditor=window.dialogArguments
	//&& myEditor.dialogAutosize
	if(myEditor!=null ){
		//自动调节对话框的大小和位置
		window.dialogHeight=(document.body.scrollHeight+32)+'px'
		window.dialogTop=parseInt((screen.height-parseInt(window.dialogHeight))/2)+'px'
		window.dialogWidth=(document.body.scrollWidth+6)+'px'
		window.dialogLeft=parseInt((screen.width-parseInt(window.dialogWidth))/2)+'px'
	}
}
//初始化文档,全局变量和事件等
function initDocument(whichElementGetRangeData,useHtmlText,whichElementGetClipboardData){
	if(myEditor){
		myEditor.designer=myEditor.window.ifrmDesign
		myEditor.coder=myEditor.window.taCode
		myEditor.form=document.forms('theForm')
		myEditor.formElements=document.forms('theForm').elements
		if(whichElementGetRangeData){
			myEditor.form.elements(whichElementGetRangeData).value=useHtmlText?myEditor.selectionHTML:myEditor.selectionText
		}
		if(whichElementGetClipboardData){
			myEditor.form.elements(whichElementGetClipboardData).value=clipboardData.getData("Text")
		}
	}else{
		myEditor={}
		myEditor.form=document.forms('theForm')
		myEditor.formElements=document.forms('theForm').elements
	}
	//隐藏正在显示的下拉框或对话框等
	document.onmousedown=function(){
		hideDropdown()
	}
	document.onkeydown=function(){
		if(event.keyCode==13&&event.srcElement.tagName!='TEXTAREA'){
			try{
				doOK()
			}catch(e){}
		}
	}
}
//关闭对话框
function closeDialog(){
	window.close()
}

//写对话框右边的按钮
function writeButtonsRight(){
	document.write(arrHTML['rightbuttons'])
}

//写样式表/其它
function writePublicAttributes(extra){
	var strTemp	='<tr id=trOther>'
  				+'<td height="25" colspan="2">'
				+'<table width="100%"  border="0" cellspacing="0" cellpadding="0">'
				+'<tr>'
				+'<td id=tdOther width="80" class="commandButton" title="展开" '
				+'onclick="showPublicAttributes(document.all.trOther,this)">'
				+'<nobr>样式表/其它<img src="../images/arrowRight.gif"></nobr></td>'
				+'<td><img src="../images/horizontal.gif" width="100%" height="6"></td>'
				+'</tr>'
				+'</table>'
				+'</td>'
				+'</tr>'
				+'<tr>'
				+'<td height="22" align="right">访问键:</td>'
				+'<td>'
				+'<table width="100%"  border="0" cellspacing="0" cellpadding="0">'
				+'<tr>'
				+'<td width="1"><input type="text" class="shortWidth" id="tfAccessKey" maxlength="1"></td>'
				+'<td width="80" align="right">Tab 索引键:</td>'
				+'<td width="1"></td>'
				+'<td><input type="text" class="shortWidth" id="tfTabIndex" restrict="0-9" onKeyPress="doRestrict()" onKeyUp="doRestrict()" onChange="doRestrict()"></td>'
				+'</tr>'
				+'</table>'
				+'</td>'
				+'</tr>'
				+'</tr>'
				+'<tr>'
				+'<td height="22" align="right">ID:</td>'
				+'<td><input type="text" class="normalWidth" id="tfId"></td>'
				+'</tr>'
				+'<tr>'
				+'<td height="22" align="right">标题:</td>'
				+'<td><input id="tfTitle" type="text" class="longWidth" ></td>'
				+'</tr>'
				+'<tr>'
				+'<td height="22" align="right">类:</td>'
				+'<td>'
	document.write(strTemp)
	writeEditableSelect('Class',120,[])
	strTemp	='</td>'
			+'</tr>'
			+'<tr valign="top">'
			+'<td height="22" align="right">样式:</td>'
			+'<td valign="top"><table width="100%"  border="0" cellpadding="0" cellspacing="0">'
			+'<tr>'
			+'<td width="1" valign="top"><textarea rows="3" wrap="OFF" class="longWidth" id="taStyle"></textarea></td>'
			+'<td valign="top"><img height=0 width=0>\n'
			+'<input type="button" value="编辑" style="height:20px" onClick="'+(extra ? extra : 'showStyleEditor()')+'"></td>'
			+'</tr>'
			+'</table></td>'
			+'</tr>'
	document.write(strTemp)
	document.all.tdOther.onclick()
}
function showPublicAttributes(obj,obj0){
	var strObj='obj'
	if(obj.nextSibling.style.display=='none'){
		obj0.title='合拢'
		obj0.firstChild.lastChild.src='../images/arrowDown.gif'
		for(var i=0;i<6;i++){
			strObj+='.nextSibling'
			eval(strObj).style.display='block'
		}
	}else{
		obj0.title='展开'
		obj0.firstChild.lastChild.src='../images/arrowRight.gif'
		for(var i=0;i<6;i++){
			strObj+='.nextSibling'
			eval(strObj).style.display='none'
		}
	}
	window.dialogHeight=(document.body.scrollHeight+32)+'px'
}
function writeColorTable(name,extraScript,path){
	var extraScript	=extraScript!=null?extraScript:''
	var path		=path!=null?path:'../images/'
	var strTemp		=arrHTML['color']
					.replace(/<NAME>/g,name)
					.replace(/<PATH>/g,path)
					.replace(/<EXTRASCRIPT_0>/g,extraScript.replace(/\'/g,"\\'"))
					.replace(/<EXTRASCRIPT>/g,extraScript)
					
	document.write(strTemp)
}
function writeUrlSelector(name,width){
	document.write(arrHTML['file'].replace(/<NAME>/g,name).replace(/<WIDTH>/g,width))
	writeIframeBody(document.frames('ifrm'+name),'slt'+name)
}
function writeDigitalUnits(name,value,more,noDigital){
	var strTemp	=(!noDigital?('<input id="tf'+name+'" value="'+(value!=null?value:'')+'" type="text" class="shortWidth"  restrict="\-0-9" onKeyPress="doRestrict()" onKeyUp="doRestrict()" onChange="doRestrict()">\n\r'):'')
				+'<select id="'+name+'Units" style="'+(more?'width:75px':'')+'">'
				+(more
				  ?('<option value="">默认</option>'
					+'<option value="px" selected>像素(px)</option>'
					+'<option value="pt">点数(pt)</option>' 
					+'<option value="in">英寸(in)</option>'
					+'<option value="cm">厘米(cm)</option>'
					+'<option value="mm">毫米(mm)</option>'
					+'<option value="pc">12pt字(pc)</option> '
					+'<option value="em">字体高(em)</option>'
					+'<option value="ex">字母X高(ex)</option>'
					+'<option value="%">百分比(%)</option>'
					
					):(
					'<option value="%">%</option>'
					+'<option value="" selected>像素</option>'
					)
				)
				+'</select>'
	document.write(strTemp)
}
function writeAlignSelect(name,alignType){
	var strTemp	=''
	if(alignType=='h'){
		strTemp	=arrHTML['halign']
	}else if(alignType=='v'){
		strTemp	=arrHTML['valign']
	}else{
		strTemp	=arrHTML['align']
	}
	document.write(strTemp.replace(/<NAME>/g,name))
}
function writeDigitalTextfield(name,value){
	value=value!=null?value:''
	document.write(arrHTML['digital'].replace(/<NAME>/g,name).replace(/<VALUE>/g,value))
}
function writeTextfield(name,value,c){
	document.write('<input id="tf'+name+'" value="'+(value!=null?value:'')+'"  type="text" class="'+(c=='s'?'shortWidth':(c=='l'?'longWidth':'normalWidth'))+'">')
}
function writeCheckbox(name,value,checked){
	document.write(arrHTML['chk'].replace(/<NAME>/g,name).replace(/<VALUE>/g,(value!=null?value:'')).replace(/>$/,checked?' checked>':'>'))
}
function writeRadio(name,value,group,checked){
	document.write(arrHTML['rd'].replace(/<NAME>/g,name).replace(/<VALUE>/g,(value!=null?value:'')).replace(/GROUP/g,(group!=null?group:name)))
}
function writeSelect(name,arr){
	var strOptions=''
	for(var i=0;i<arr.length;i+=2){
		strOptions+='<option value="'+arr[i+1].replace(/\-Selected$/,'')+'"'+(/\-Selected$/i.test(arr[i+1])?' selected':'')+'>'+arr[i]+'</options>'
	}
	document.write(arrHTML['select'].replace(/<NAME>/g,name).replace(/<OPTIONS>/g,strOptions))
}