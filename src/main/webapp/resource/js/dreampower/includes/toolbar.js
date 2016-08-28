//处理自定义的单选框
function doRadioGroup(group,id){
	//我们必须定义 document.radioGroup 数组
	if(document.radioGroup==null){
		document.radioGroup=[]
	}
	//取得此单选框组的全局 select 事件字符串,可用this来指向本对象
	var strSelect=document.radioGroup[group+".select"]!=null ? document.radioGroup[group+".select"] : null
	var strUnselect=document.radioGroup[group+".unselect"]!=null ? document.radioGroup[group+".unselect"] : null
	//检查此组单选框有没有已被选中的
	if(document.radioGroup[group]!=null && document.radioGroup[group]!=""){
		//已被选中的就是现在要选的,则返回
		if(document.radioGroup[group]==id)return;
		var obj=document.all(document.radioGroup[group])
		//我们再检查此选中的单选框是否是数组
		if(obj.length){
			for(var i=0;i<obj.length;i++){
				//我们要确定此选中的单选框是属于此组的
				if(obj[i].mygroup==group){
					//我们使它处于未选中的状态
					obj[i].myselected=false
					//执行 unselect 事件字符串;如果它没 unselect 事件字符串,再考虑是否有全局的
					if(obj[i].myunselect!=null){
						new Function(obj[i].myunselect.replace(/(^|\W+)this(\W+|$)/g,"$1document.all."+document.radioGroup[group]+"["+i+"]$2"))()
					}else if(strUnselect!=null){
						new Function(strUnselect.replace(/(^|\W+)this(\W+|$)/g,"$1document.all."+document.radioGroup[group]+"["+i+"]$2"))()
					}
				}
			}
		}else{
			if(obj.mygroup==group){
				obj.myselected=false
				if(obj.myunselect!=null){
					new Function(obj.myunselect.replace(/(^|\W+)this(\W+|$)/g,"$1document.all."+document.radioGroup[group]+"$2"))()
				}else if(strUnselect!=null){
					new Function(strUnselect.replace(/(^|\W+)this(\W+|$)/g,"$1document.all."+document.radioGroup[group]+"$2"))()
				}
			}
		}
	}
	var obj=document.all(id)
	if(obj.length){
		for(var i=0;i<obj.length;i++){
			if(obj[i].mygroup==group){
				obj[i].myselected=true
				if(obj[i].myselect!=null){
					new Function(obj[i].myselect.replace(/(^|\W+)this(\W+|$)/g,"$1document.all."+id+"["+i+"]$2"))()
				}else if(strSelect!=null){
					new Function(strSelect.replace(/(^|\W+)this(\W+|$)/g,"$1document.all."+id+"["+i+"]$2"))()
				}
			}
		}
	}else{
		if(obj.mygroup==group){
			obj.myselected=true
			if(obj.myselect!=null){
				new Function(obj.myselect.replace(/(^|\W+)this(\W+|$)/g,"$1document.all."+id+"$2"))()
			}else if(strSelect!=null){
				new Function(strSelect.replace(/(^|\W+)this(\W+|$)/g,"$1document.all."+id+"$2"))()
			}
		}
	}
	//更新radioGroup[group],指向选中的id
	document.radioGroup[group]=id
}

//创建工具条
function createToolbar(){
	var strSelect='<select id="sltToolbar" style="background:#E0DFE3;position: relative;top:-3px;display:none" onchange="showToolbar()"><option>工具收藏夹</option>';
	var arrTemp	=[];//存工具条HTML,工具条的名称作为键
	var arrIfrm	=[];//存下拉框的选项,浮动框架id为键
	var imgURL	=myEditor.baseURL.replace(/\/+$/,'')
	imgURL=(imgURL.length?imgURL+'/':'')+'images/'
	var incURL	=myEditor.baseURL.replace(/\/+$/,'')
	incURL=(incURL.length?incURL+'/':'')+'includes/'
	with(document.all('xmlToolbar').XMLDocument.documentElement){//menu
		for(var i=0;i<childNodes.length;i++){
			with(childNodes[i]){//toolbar
				var barName=getAttribute('name')
				arrTemp[barName]=getAttribute('menu').toLowerCase()=='true' ? '<%-MENU-%>' : '';//<%\-MENU\-%> 替换<工具收藏夹>的标记
				for(var j=0;j<childNodes.length;j++){
					with(childNodes[j]){//category
						strSelect+='<option value="'+getAttribute('id')+'">'+(/^(false|none)$/i.test(getAttribute('display')) ? '&nbsp;&nbsp;' : '√')+'&nbsp;'+getAttribute('label')+'</option>'
						arrTemp[barName]+='<span id="'+getAttribute('id')+'" style="padding-left:9px;background:url('+imgURL+'toolbarHandle.gif) no-repeat;'+(/^(false|none)$/i.test(getAttribute('display')) ? 'display:none;' : '')+'">'
						for(var k=0;k<childNodes.length;k++){
							with(childNodes[k]){
								switch(tagName){
									case "button":
										//因为在dropdown中加入<input>,所以为了使工具栏上的每个按钮的高度与背景图片一致,
										//特加入<input style="width:0px;height:0px;">,保持高度为27px
										arrTemp[barName]	+='<wbr><nobr><input style="width:0px;height:0px;"><img '
															+'id=			"'+getAttribute('id')+'" '
															+'src=			"'+imgURL+getAttribute('image')+'" '
															+'alt=			"'+getAttribute('tooltip')+'" '
															+'title=		"'+getAttribute('tooltip')+'" '
															+'onclick=		"saveSelection();doRadioGroup(this.getAttribute(\'mygroup\'),this.id);'+getAttribute('onclick')+'" '
															+'onmouseover=	"this.className=\'btOver\'" '
															+'onmouseout=	"this.className=\'btUp\'" '
															+'onmousedown=	"this.className=\'btDown\'" '
															+'onmouseup=	"this.className=\'btOver\'" '
															+'ondrag=		"return false" '
															+'myselect=		"this.className=\'btDown\'" '
															+'myunselect=	"this.className=\'btUp\'" '
															+'style=		"position: relative;top:2px;" '
															+'class=		"btUp"></nobr><wbr>'
										break;
									case "separator":
										arrTemp[barName]+='<wbr><nobr><input style="width:0px;height:0px;"><img src="'+imgURL+'separator.gif" style="position: relative;top:2px;"></nobr><wbr>'
										break;
									case 'radiogroup':
										var name=getAttribute('name')
										for(var l=0;l<childNodes.length;l++){
											with(childNodes[l]){
												arrTemp[barName]	+='<wbr><nobr><input style="width:0px;height:0px;"><img '
																	+'id=			"'+getAttribute('id')+'" '
																	+'mygroup=		"'+name+'" '
																	+'src=			"'+imgURL+getAttribute('image')+'" '
																	+'alt=			"'+getAttribute('tooltip')+'" '
																	+'title=		"'+getAttribute('tooltip')+'" '
																	+'onclick=		"saveSelection();doRadioGroup(this.mygroup,this.id);'+getAttribute('onclick')+'" '
																	+'onmouseover=	"if(!this.myselected){this.className=\'btOver\'}" '
																	+'onmouseout=	"if(!this.myselected){this.className=\'btUp\'}" '
																	+'onmousedown=	"if(!this.myselected){this.className=\'btDown\'}" '
																	+'onmouseup=	"if(!this.myselected){this.className=\'btOver\'}" '
																	+'ondrag=		"return false" '
																	+'myselect=		"this.myselected=true;this.style.backgroundColor=\'#ffffff\';this.className=\'btDown\'" '
																	+'myunselect=	"this.myselected=false;this.style.backgroundColor=\'\';this.className=\'btUp\'" '
																	+'myselected=	"'+(getAttribute('checked')&&getAttribute('checked').toLowerCase()=='true'?'1':'')+'" '
																	+'onload=		"eval(\'this.onmyselect=function(){\'+this.myselect+\'};this.onmyunselect=function(){\'+this.myunselect+\'};\')"'
																	+'style=		"position: relative;top:2px;" '
																	+'class=		"btUp"></nobr><wbr>'
											}//with(childNodes[l])
										}//for(var l=0;l<childNodes.length;l++)
										break;
									case "dropdown"://下拉框
										var name=getAttribute('name')
										arrIfrm['ifrm'+name]=[]
										arrIfrm['ifrm'+name]['id']='bt'+name
										arrIfrm['ifrm'+name]['onclick']=getAttribute('onclick')
										var optionsIndex=1
										//var strEvent=(getAttribute('restrict')!=null && getAttribute('restrict')!='' ? 'if(this.value!=\'\'){this.newChar=this.value.substr(this.oldValue.length);if(this.newChar!=\'\'&&!/['+getAttribute('restrict')+']/.test(this.newChar)){this.value=this.oldValue};};' : '')
										arrTemp[barName]	+='<wbr><nobr><input style="width:0px;height:0px;">'
															+((!empty(getAttribute('image')))
																?('<img '
																	+'src=			"'+imgURL+getAttribute('image')+'" '
																	+'alt=			"'+getAttribute('tooltip')+'" '
																  	+'style=		"position: relative;top:2px;" '
																  	+'title=		"'+getAttribute('tooltip')+'">')
																: '')
															//如果需预览,则建立预览区
															+((!empty(getAttribute('previewfield')))
																?('<div '
																  	+'style=		"position: absolute;z-index:1;" '
																	+'alt=			"'+getAttribute('tooltip')+'" '
																  	+'title=		"'+getAttribute('tooltip')+'" '
																	+'onclick=		"saveSelection();this.nextSibling.noSave=true;this.nextSibling.onclick();this.nextSibling.noSave=false;" '
																	+'onmouseover=	"this.nextSibling.onmouseover()" '
																	+'onmouseout=	"this.nextSibling.onmouseout()" '
																	+'onmousedown=	"this.nextSibling.onmousedown()" '
																	+'onmouseup=	"this.nextSibling.onmouseup()" '
																	+'ondrag=		"return false" '
																  	+'>'
																  	+'<div style="position: absolute;'+getAttribute('previewfield')+';'+getAttribute('default')+'"><img width=100% height=100%></div></div>')
																: '')
										with(firstChild){
											switch(tagName){
												case 'textfield'://文本域,[编辑]可选
													arrIfrm['ifrm'+name]['id']='tf'+name
													arrTemp[barName]	+='<input '
																		+'id=			"tf'+name+'" '
																		+				(getAttribute('editable').toLowerCase()=='true' ? '' : 'readonly')+' '
																		+'title=		"'+parentNode.getAttribute('tooltip')+'" '
																		+'value=		"'+getAttribute('value')+'" '
																		+'hiddenValue=	"'+getAttribute('hiddenvalue')+'" '
																		+'myevent=		"'+(empty(getAttribute('myevent'))?'':getAttribute('myevent'))+'" '
																		+'restrict=		"'+getAttribute('restrict')+'" '
																		+'onmouseover=	"this.className=this.nextSibling.className=\'btOver\'" '
																		+'onmouseout=	"this.className=this.nextSibling.className=\'btUp\'" '
																		+(getAttribute('editable').toLowerCase()!='true' 
																			?(	
																			  	'onbeforeactivate=		"saveSelection();" '
																			  	+'onmousedown=	"this.className=\'btDown\'" '
																				+'onmouseup=	"this.className=\'btOver\'" '
																				+'onclick=		"eval(this.myevent)" '
																				+'ondrag=		"return false" '
																			)
																			:(
																			  	'onclick=		"if(this.dropdownClick){eval(this.myevent)}" '
																				+'onkeypress=	"doRestrict();" '
																				+'onkeyup=		"doRestrict();if(event.keyCode==13){doTfCommand();eval(this.myevent)};" '
																				+'onchange=		"doRestrict();" '
																			)
																		 )
																		+'style=		"padding-top:5px;width:'+getAttribute('width')+'px;height:22px;position: relative;top:-2px;'+(getAttribute('editable').toLowerCase()!='true'?'cursor:default':'')+'" '
																		+'class=		"btUp">'
													break;
												case 'image':
													arrTemp[barName]	+='<img '
																		+'id=			"bt'+name+'" '
																		+'src=			"'+imgURL+getAttribute('src')+'" '
																		+'title=		"'+parentNode.getAttribute('tooltip')+'" '
																		+'alt=			"'+parentNode.getAttribute('tooltip')+'" '
																		+'value=		"'+getAttribute('value')+'" '
																		+'hiddenValue=	"'+getAttribute('hiddenvalue')+'" '
																		+'myevent=		"'+(empty(getAttribute('myevent'))?'':getAttribute('myevent'))+'" '
																		+'onclick=		"if(!this.noSave){saveSelection();};eval(this.myevent)" '
																		+'onmouseover=	"this.className=this.nextSibling.className=\'btOver\'" '
																		+'onmouseout=	"this.className=this.nextSibling.className=\'btUp\'" '
																		+'onmousedown=	"this.className=\'btDown\'" '
																		+'onmouseup=	"this.className=\'btOver\'" '
																		+'style=		"position: relative;top:2px;" '
																		+'class=		"btUp">'
													break;
												case 'options':
													optionsIndex=0
													arrTemp[barName]	+='<img '
																		+'id=			"bt'+name+'" '
																		+'src=			"'+imgURL+firstChild.getAttribute('image')+'" '
																		+'alt=			"'+parentNode.getAttribute('tooltip')+'" '
																		+'title=		"'+parentNode.getAttribute('tooltip')+'" '
																		+'value=		"'+(empty(firstChild.firstChild)?'':firstChild.firstChild.xml)+'" '
																		+'hiddenValue=	"'+firstChild.getAttribute('value')+'" '
																		+'myevent=		"'+(empty(firstChild.getAttribute('myevent'))?'':firstChild.getAttribute('myevent'))+'" '
																		+'onclick=		"if(!this.noSave){saveSelection();};eval(this.myevent)" '
																		+'onmouseover=	"this.className=this.nextSibling.className=\'btOver\'" '
																		+'onmouseout=	"this.className=this.nextSibling.className=\'btUp\'" '
																		+'onmousedown=	"this.className=\'btDown\'" '
																		+'onmouseup=	"this.className=\'btOver\'" '
																		+'style=		"position: relative;top:2px;" '
																		+'class=		"btUp">'
													break;
											}//switch(tagName)
										}//with(firstChild)
										arrTemp[barName]	+='<img '
															+'src=			"'+imgURL+'dropdown.gif" '
															+'title=		"'+getAttribute('tooltip')+'" '
															+'alt=			"'+getAttribute('tooltip')+'" '
															+'onclick=		"saveSelection();showDropdown(\'ifrm'+name+'\',this.previousSibling)" '
															+'onmouseover=	"this.className=this.previousSibling.className=\'btOver\'" '
															+'onmouseout=	"this.className=this.previousSibling.className=\'btUp\'" '
															+'onmousedown=	"this.className=\'btDown\'" '
															+'onmouseup=	"this.className=\'btOver\'" '
															+'ondrag=		"return false" '
															+'style=		"position: relative;top:2px;" '
															+'class=		"btUp"></nobr><wbr>'
															+'<iframe id="ifrm'+name+'" frameborder="0" scrolling="auto"  class="dropdown"></iframe>'
										for(var l=0;l<childNodes[optionsIndex].childNodes.length;l++){
											with(childNodes[optionsIndex].childNodes[l]){
												arrIfrm['ifrm'+name][l]=[	empty(getAttribute('value'))?'':getAttribute('value'),
																			empty(getAttribute('image'))?'':getAttribute('image'),
																			empty(getAttribute('myevent'))?'':getAttribute('myevent'),
																			empty(firstChild)?'':firstChild.xml]
											}//with(childNodes[l])
										}//for(var l=0;l<childNodes[optionsIndex].childNodes.length;l++)
										break;
									case "dialogbox":
										arrTemp[barName]	+='<wbr><nobr><input style="width:0px;height:0px;">'
															+((!empty(getAttribute('previewfield')))
																?('<div '
																  	+'style=		"position: absolute;z-index:1;" '
																  	+'title=		"'+getAttribute('tooltip')+'" '
																	+'onclick=		"saveSelection();this.nextSibling.noSave=true;this.nextSibling.onclick();this.nextSibling.noSave=false;" '
																	+'onmouseover=	"this.nextSibling.onmouseover()" '
																	+'onmouseout=	"this.nextSibling.onmouseout()" '
																	+'onmousedown=	"this.nextSibling.onmousedown()" '
																	+'onmouseup=	"this.nextSibling.onmouseup()" '
																	+'ondrag=		"return false" '
																  	+'>'
																  	+'<div style="position: absolute;'+getAttribute('previewfield')+';'+getAttribute('default')+'"><img width=100% height=100%></div></div>')
																: '')
															+'<img '
															+'id=			"'+getAttribute('id')+'" '
															+'src=			"'+imgURL+getAttribute('image')+'" '
															+'alt=			"'+getAttribute('tooltip')+'" '
															+'title=		"'+getAttribute('tooltip')+'" '
															+'hiddenValue=	"'+getAttribute('default')+'" '
															+'onclick=		"if(!this.noSave){saveSelection();};'+getAttribute('onclick')+'" '
															+'onmouseover=	"this.className=this.nextSibling.className=\'btOver\'" '
															+'onmouseout=	"this.className=this.nextSibling.className=\'btUp\'" '
															+'onmousedown=	"this.className=\'btDown\'" '
															+'onmouseup=	"this.className=\'btOver\'" '
															+'ondrag=		"return false" '
															+'style=		"position: relative;top:2px;" '
															+'class=		"btUp"><img '
															+'src=			"'+imgURL+'dialogbox.gif" '
															+'title=		"'+getAttribute('tooltip')+'" '
															+'alt=			"'+getAttribute('tooltip')+'" '
															+'onclick=		"saveSelection();showDialog(\''+getAttribute('url')+'\',\''+getAttribute('width')+'\',\''+getAttribute('height')+'\')" '
															+'onmouseover=	"this.className=this.previousSibling.className=\'btOver\'" '
															+'onmouseout=	"this.className=this.previousSibling.className=\'btUp\'" '
															+'onmousedown=	"this.className=\'btDown\'" '
															+'onmouseup=	"this.className=\'btOver\'" '
															+'ondrag=		"return false" '
															+'style=		"position: relative;top:2px;" '
															+'class=		"btUp"></nobr><wbr>'
										break;
									case "checkbox":
											arrTemp[barName]	+='<wbr><nobr><input style="width:0px;height:0px;"><img '
																+'id=			"'+getAttribute('id')+'" '
																+'src=			"'+imgURL+getAttribute('image')+'" '
																+'alt=			"'+getAttribute('tooltip')+'" '
																+'title=		"'+getAttribute('tooltip')+'" '
																+'onclick=		"saveSelection();if(this.myselected=!this.myselected){eval(myselect)}else{eval(myunselect)};'+getAttribute('onclick')+'" '
																+'onmouseover=	"if(!this.myselected){this.className=\'btOver\'}" '
																+'onmouseout=	"if(!this.myselected){this.className=\'btUp\'}" '
																+'onmousedown=	"if(!this.myselected){this.className=\'btDown\'}" '
																+'onmouseup=	"if(!this.myselected){this.className=\'btOver\'}" '
																+'ondrag=		"return false" '
																+'myselect=		"this.myselected=true;this.style.backgroundColor=\'#ffffff\';this.className=\'btDown\'" '
																+'myunselect=	"this.myselected=false;this.style.backgroundColor=\'\';this.className=\'btUp\'" '
																+'myselected=	"'+(getAttribute('checked')&&getAttribute('checked').toLowerCase()=='true'?'1':'')+'" '
																+'onload=		"eval(\'this.onmyselect=function(){\'+this.myselect+\'};this.onmyunselect=function(){\'+this.myunselect+\'};\')"'
																+'style=		"position: relative;top:2px;" '
																+'class=		"btUp"></nobr><wbr>'
										break;
									case "color":
										arrTemp[barName]	+='<wbr><nobr><input style="width:0px;height:0px;">'
															+((!empty(getAttribute('previewfield')))
																?('<div '
																  	+'style=		"position: absolute;z-index:1;" '
																  	+'title=		"'+getAttribute('tooltip')+'" '
																	+'onbeforeactivate=		"saveSelection();" '
																	+'onclick=		"saveSelection();this.nextSibling.noSave=true;this.nextSibling.onclick();this.nextSibling.noSave=false;" '
																	+'onmouseover=	"this.nextSibling.onmouseover()" '
																	+'onmouseout=	"this.nextSibling.onmouseout()" '
																	+'onmousedown=	"this.nextSibling.onmousedown()" '
																	+'onmouseup=	"this.nextSibling.onmouseup()" '
																	+'ondrag=		"return false" '
																  	+'>'
																  	+'<div style="position: absolute;'+getAttribute('previewfield')+';'+getAttribute('default')+'"><img width=100% height=100%></div></div>')
																: '')
															+'<img '
															+'id=			"'+getAttribute('id')+'" '
															+'src=			"'+imgURL+getAttribute('image')+'" '
															+'title=		"'+getAttribute('tooltip')+'" '
															+'hiddenValue=	"'+getAttribute('default')+'" '
															+'onclick=		"if(!this.noSave){saveSelection();};'+getAttribute('onclick')+'" '
															+'onmouseover=	"this.className=this.nextSibling.className=\'btOver\'" '
															+'onmouseout=	"this.className=this.nextSibling.className=\'btUp\'" '
															+'onmousedown=	"this.className=\'btDown\'" '
															+'onmouseup=	"this.className=\'btOver\'" '
															+'ondrag=		"return false" '
															+'style=		"position: relative;top:2px;" '
															+'class=		"btUp"><img '
															+'src=			"'+imgURL+'color.gif" '
															+'title=		"'+getAttribute('tooltip')+'" '
															+'alt=			"'+getAttribute('tooltip')+'" '
															+'onclick=		"saveSelection();getAndSetColor(this,this.previousSibling.hiddenValue,\'obj.previousSibling.hiddenValue=obj.previousSibling.value=ifrmColorPicker.document.all.tfHexColor.value;'
															+((!empty(getAttribute('previewfield')))
																?('obj.previousSibling.previousSibling.firstChild.style.backgroundColor=obj.previousSibling.hiddenValue;')
																: '')
															+'obj.previousSibling.noSave=true;obj.previousSibling.onclick();obj.previousSibling.noSave=false;\')" '
															+'onmouseover=	"this.className=this.previousSibling.className=\'btOver\'" '
															+'onmouseout=	"this.className=this.previousSibling.className=\'btUp\'" '
															+'onmousedown=	"this.className=\'btDown\'" '
															+'onmouseup=	"this.className=\'btOver\'" '
															+'ondrag=		"return false" '
															+'style=		"position: relative;top:2px;" '
															+'class=		"btUp"></nobr><wbr>'
										break;
								}//switch(tagName)
							}//with(childNodes[k])
						}//for(var k=0;k<childNodes.length;k++)
						arrTemp[barName]+='</span>'
					}//with(childNodes[j])
				}//for(var j=0;j<childNodes.length;j++)
			}//with(childNodes[i])
		}//for(var i=0;i<childNodes.length;i++)
	}//with(document.all('xmlToolbar').XMLDocument.documentElement)
	strSelect+='</select>'
	for(var i in arrTemp){
			document.all('td'+i.toCapitalize()).innerHTML=arrTemp[i].replace(/^<%\-MENU\-%>/,strSelect)
	}
	//建下拉框的选项
	for(var i in arrIfrm){
		var strTemp	='<link href="'+incURL+'style.css" rel="stylesheet" type="text/css"><body style="cursor:default;background:#ffffff;" onselectstart="return event.srcElement.tagName==\'INPUT\'" oncontextmenu="return false">'
					+'<table border="0" cellspacing="0" cellpadding="0">'
					+'<tr><td width=1 bgColor="#cccccc" background="'+imgURL+'dropdownLeft.gif"><img height=1 width="18"></td>'
    				+'<td style="padding:2px">'
					+'<table width="100%" id="tblOptions" border="0" cellspacing="0" cellpadding="0">'
		for(var j=0;j<arrIfrm[i].length;j++){
			strTemp	+='<tr '
					+'onclick=		"var obj=parent.document.all(\''+arrIfrm[i]['id']+'\');obj.hiddenValue=this.value;obj.value=this.lastChild.innerText;if(obj.tagName==\'IMG\'&&this.image!=\'\'){obj.src=\''+imgURL+'\'+this.image;obj.myevent=this.myevent;};obj.dropdownClick=obj.noSave=true;obj.onclick();obj.dropdownClick=obj.noSave=false;'+arrIfrm[i]['onclick']+';" '
					+'onmouseover=	"this.style.background=\'#BBB7C7\'" '
					+'onmouseout=	"this.style.background=\'\'" '
					+'value=		"'+arrIfrm[i][j][0]+'" '
					+'image=		"'+arrIfrm[i][j][1]+'" '
					+'myevent=		"'+arrIfrm[i][j][2]+'">'
			strTemp	+= arrIfrm[i][j][1]=='' ? '' : '<td width="1"><img src="'+imgURL+arrIfrm[i][j][1]+'"></td>'
			strTemp	+= '<td height=15><nobr>'+arrIfrm[i][j][3]+'</nobr></td>'
			strTemp	+='</tr>'
		}
		strTemp	+='</table></td></tr></table></body>'
		var ifrm=document.frames(i)
		ifrm.document.open('text/html','replace')
		ifrm.document.write(strTemp)
		ifrm.document.close()
		ifrm.document.onclick=hideDropdown
	}
}

//文本框命令
function doTfCommand(){
	var srcElt=event.srcElement
	//取列表对象
	var obj=document.frames('ifrm'+srcElt.id.substr(2)).document.all('tblOptions')
	//检查此输入的值是否已在此列表中
	for(var i=0;i<obj.rows.length;i++){
		if(obj.rows[i].lastChild.innerText.toLowerCase()==srcElt.value.toLowerCase()){
			srcElt.hiddenValue=empty(obj.rows[i].value)?'':obj.rows[i].value
			return
		}
	}
	//如果没,我们就加入此值
	with(obj.rows[obj.rows.length-1]){
		var newRow,newCell
		//如果此列表有新加入值,那么我用-----将新加入值与旧的值隔开
		if(!obj.hasNewOpt){
			newRow = obj.insertRow(0)
			newCell = newRow.insertCell(0)
			newCell.innerHTML = '<div style="width:100%;height:2;border:1px inset"><img width="100%" height="100%"></div>'
			newCell.height='6px'
			newCell.colSpan=cells.length
			obj.hasNewOpt=true
		}
		//加入此值
		newRow = obj.insertRow(0)
		for(var i=0;i<cells.length-1;i++){
			newCell = newRow.insertCell(i)
		}
		newCell = newRow.insertCell(i)
		newCell.innerText=newRow.value=srcElt.hiddenValue=srcElt.value
		newRow.onmouseover=onmouseover
		newRow.onmouseout=onmouseout
		newRow.onclick=onclick
	}
}

//显示工具条
function showToolbar(){
	with(srcElt=event.srcElement){
		if(document.all(value).style.display=='none'){
			options[selectedIndex].text=options[selectedIndex].innerText.replace(/^\s\s/,'√')
			document.all(value).style.display= '';
		}else{
			options[selectedIndex].text=options[selectedIndex].innerText.replace(/^√/,'  ')
			document.all(value).style.display= 'none';
		}
		selectedIndex=0
	}
}