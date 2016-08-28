
var global=document.all
function InitDocument(){
	
	parseCssCode(window.dialogArguments)
	
}
function genCssCode(){
	var els,id,id0,arrDir,j=0,els,t="",cssCode=""
	els=new Array(select_font_family,select_font_size,select_font_weight,select_font_style,select_font_variant,select_line_height,select_text_transform,text_decoration[0],color,background_color,select_background_image,select_background_repeat,select_background_attachment,select_background_position_h,select_word_spacing,select_letter_spacing,select_vertical_align,select_text_align,select_text_indent,select_white_space,select_display,select_width,select_float,select_height,select_clear,padding,margin,border_style,select_list_style_type,select_list_style_image,select_list_style_position,select_position,select_visibility,select_overflow,select_z_index,select_left,select_top0,select_right,select_bottom,select_clip_top,select_page_break_before,select_page_break_after,select_cursor,select_filter,scrollbar_3d_light_color,scrollbar_base_color,scrollbar_face_color,scrollbar_shadow_color,scrollbar_arrow_color,scrollbar_dark_shadow_color,scrollbar_highlight_color,scrollbar_track_color)
	arrDir=new Array("top","right","bottom","left")
	for(var i=0;i<els.length;i++){
		id=els[i].id.replace(/^select_/,"")
		id0=id.replace(/_/g,"-")
		if(/^text_decoration/i.test(id)){
			t=""
			for(var j=0;j<5;j++)t+=text_decoration[j].checked?" "+text_decoration[j].value:"";
			cssCode+=t!=""?"text-decoration:"+t+";":""
		}else if(/^background_position/i.test(id)){
			if(background_position_h.t.value!=""||background_position_v.t.value!=""){
				cssCode+="background-position:"+
				(background_position_h.t.value!=""?" "+background_position_h.t.value+(background_position_h_unit.disabled?"":background_position_h_unit.value):"")+
				(background_position_v.t.value!=""?" "+background_position_v.t.value+(background_position_v_unit.disabled?"":background_position_v_unit.value):"")+";"
			}
		}else if(/^padding$/.test(id)){
			if(global.padding.checked){
				if(padding_top.t.value!="")cssCode+="padding: "+padding_top.t.value+(global.padding_top_unit.disabled?"":global.padding_top_unit.value)+";";	
			}else if(padding_top.t.value!=""&&padding_right.t.value!=""&&padding_bottom.t.value!=""&&padding_left.t.value!=""){
				t=""
				for(var j=0;j<4;j++){
					t+=" "+eval("padding_"+arrDir[j]+".t.value")+eval("padding_"+arrDir[j]+"_unit.disabled?'':padding_"+arrDir[j]+"_unit.value")
				}
				cssCode+="padding:"+t+";"
			}else{
				for(var j=0;j<4;j++){
					if(eval("padding_"+arrDir[j]+".t.value")=="")continue;
					cssCode+="padding-"+arrDir[j]+":"+eval("padding_"+arrDir[j]+".t.value")+eval("padding_"+arrDir[j]+"_unit.disabled?'':"+"padding_"+arrDir[j]+"_unit.value")+";"
				}
			}
		}else if(/^margin$/.test(id)){
			if(global.margin.checked){
				if(margin_top.t.value!="")cssCode+="margin: "+margin_top.t.value+(global.margin_top_unit.disabled?"":global.margin_top_unit.value)+";";	
			}else if(margin_top.t.value!=""&&margin_right.t.value!=""&&margin_bottom.t.value!=""&&margin_left.t.value!=""){
				t=""
				for(var j=0;j<4;j++){
					t+=" "+eval("margin_"+arrDir[j]+".t.value")+eval("margin_"+arrDir[j]+"_unit.disabled?'':margin_"+arrDir[j]+"_unit.value")
				}
				cssCode+="margin:"+t+";"
			}else{
				for(var j=0;j<4;j++){
					if(eval("margin_"+arrDir[j]+".t.value")=="")continue;
					cssCode+="margin-"+arrDir[j]+":"+eval("margin_"+arrDir[j]+".t.value")+eval("margin_"+arrDir[j]+"_unit.disabled?'':"+"margin_"+arrDir[j]+"_unit.value")+";"
				}
			}
		}else if(/^border/.test(id)){
			if(global.border_style.checked&&global.border_style.checked&&global.border_color.checked){
				if(border_top_style.t.value!=""||border_top_width.t.value!=""||border_top_color.value!=""){
					cssCode+="border:"+(border_top_width.t.value!=""?" "+border_top_width.t.value+((global.border_top_width_unit.disabled?"":global.border_top_width_unit.value)):"")+
					(border_top_style.t.value!=""?" "+border_top_style.t.value:"")+
					(border_top_color.value!=""?" "+border_top_color.value:"")+";"
				}
			}else{
				for(var j=0;j<4;j++){
					if(eval("border_"+arrDir[j]+"_style.t.value")!=""||eval("border_"+arrDir[j]+"_width.t.value")!=""||eval("border_"+arrDir[j]+"_color.value")!=""){
						cssCode+="border-"+arrDir[j]+":"+(eval("border_"+arrDir[j]+"_width.t.value")!=""?" "+eval("border_"+arrDir[j]+"_width.t.value")+(eval("border_"+arrDir[j]+"_width_unit.disabled")?"":eval("border_"+arrDir[j]+"_width_unit.value")):"")+
						(eval("border_"+arrDir[j]+"_style.t.value")!=""?" "+eval("border_"+arrDir[j]+"_style.t.value"):"")+
						(eval("border_"+arrDir[j]+"_color.value")!=""?" "+eval("border_"+arrDir[j]+"_color.value"):"")+";"
					}
				}
			}
		}else if(id=="top0"){
			if(top0.t.value!=""){
				cssCode+="top: "+top0.t.value+(top0_unit.disabled?"":top0_unit.value)+";"
			}
		}else if(/^clip/i.test(id)){
			if(clip_top.t.value!=""||clip_right.t.value!=""||clip_bottom.t.value!=""||clip_left.t.value!=""){
				t=""
				for(var j=0;j<4;j++){
					t+=(eval("clip_"+arrDir[j]+".t.value")!=""?" "+eval("clip_"+arrDir[j]+".t.value")+(eval("clip_"+arrDir[j]+"_unit.disabled")?"":eval("clip_"+arrDir[j]+"_unit.value")):" auto")
				}
				cssCode+="clip: rect("+t+");"
			}
		}else if(/image$/i.test(id)){
			t=eval(id+".t.value")
			if(t!=""){
				cssCode+=id0+":"+(t=="none"?" none":" url("+escape(t)+")")+";"
			}
		}else if(/^filter$/i.test(id)){
			if(filter.t.value!=""){
				if(global("tbl"+filter.t.value.toLowerCase())){
					t=""
					for(var j=0;j<global("tbl"+filter.t.value.toLowerCase()).all.length;j++){
						var tObj=global("tbl"+filter.t.value.toLowerCase()).all[j]
						if(tObj.id=="")continue;
						if(/checkbox/i.test(tObj.type))t+=tObj.checked?tObj.id.replace(filter.t.value.toLowerCase()+"_","")+"=true,":"";
						if(/text/i.test(tObj.type))t+=tObj.value!=""?tObj.id.replace(filter.t.value.toLowerCase()+"_","")+"="+tObj.value+",":"";
						if(eval(tObj.id+".t"))eval(tObj.id+".t").value!=""?t+=tObj.id.replace(filter.t.value.toLowerCase()+"_","")+"="+eval(tObj.id+".t").value+",":"";
					}
					cssCode+="filter: "+filter.t.value+"("+t.replace(/,$/,"")+")"+";"
				}else{
					cssCode+="filter: "+filter.t.value+";"
				}
			}
		}else{
			var obj=eval(id)
			if(obj.t){
				if(obj.t.value!=""){
					cssCode+=id0+": "+obj.t.value+(global(id+"_unit")&&!eval(id+"_unit.disabled")?eval(id+"_unit.value"):"")+";"
				}
			}else{
				cssCode+=obj.value!=""?id0+": "+obj.value+";":""
			}
		}
	}
	return cssCode
}
function parseCssCode(css){
var els=new Array(select_font_family,select_font_size,font_size_unit,select_font_weight,select_font_style,select_font_variant,select_line_height,line_height_unit,select_text_transform,text_decoration[0],text_decoration[1],text_decoration[2],text_decoration[3],text_decoration[4],color,background_color,select_background_image,select_background_repeat,select_background_attachment,select_background_position_h,background_position_h_unit,select_background_position_v,background_position_v_unit,select_word_spacing,word_spacing_unit,select_letter_spacing,letter_spacing_unit,select_vertical_align,vertical_align_unit,select_text_align,select_text_indent,text_indent_unit,select_white_space,select_display,select_width,width_unit,select_float,select_height,height_unit,select_clear,padding,select_padding_top,padding_top_unit,select_padding_right,padding_right_unit,select_padding_bottom,padding_bottom_unit,select_padding_left,padding_left_unit,margin,select_margin_top,margin_top_unit,select_margin_right,margin_right_unit,select_margin_bottom,margin_bottom_unit,select_margin_left,margin_left_unit,border_style,select_border_top_style,select_border_right_style,select_border_bottom_style,select_border_left_style,border_width,select_border_top_width,border_top_width_unit,select_border_right_width,border_right_width_unit,select_border_bottom_width,border_bottom_width_unit,select_border_left_width,border_left_width_unit,border_color,border_top_color,border_right_color,border_bottom_color,border_left_color,select_list_style_type,select_list_style_image,select_list_style_position,select_position,select_visibility,select_overflow,select_z_index,select_left,left_unit,select_top0,top0_unit,select_right,right_unit,select_bottom,bottom_unit,select_clip_top,clip_top_unit,select_clip_right,clip_right_unit,select_clip_bottom,clip_bottom_unit,select_clip_left,clip_left_unit,select_page_break_before,select_page_break_after,select_cursor,select_filter,select_alpha_opacity,select_alpha_finishopacity,select_alpha_style,select_alpha_startx,select_alpha_starty,select_alpha_finishx,select_alpha_finishy,select_blendtrans_duration,blur_add,select_blur_direction,select_blur_strength,chroma_color,dropshadow_color,select_dropshadow_offx,select_dropshadow_offy,dropshadow_positive,glow_color,select_glow_strength,mask_color,select_revealtrans_duration,select_revealtrans_transition,shadow_color,select_shadow_direction,wave_add,select_wave_freq,select_wave_lightstrength,select_wave_phase,select_wave_strength,scrollbar_3d_light_color,scrollbar_base_color,scrollbar_face_color,scrollbar_shadow_color,scrollbar_arrow_color,scrollbar_dark_shadow_color,scrollbar_highlight_color,scrollbar_track_color)
	//对所有的表单元件进行初始化
	for(var i=0;i<els.length;i++){
		var obj=els[i]
		//使下拉框初始选择第一项
		if(/select/i.test(obj.tagName))obj.selectedIndex=0;
		//使单位下拉框都失效
		if(/_unit$/.test(obj.id))obj.disabled=true;
		if(/^select/.test(obj.id))sltChange(obj,0,1);
		if(/checkbox/i.test(obj.type)&&!/border|padding|margin/.test(obj.id))obj.checked=false;
		if(/text/i.test(obj.type))obj.value="";
		if(/color$/.test(obj.id))obj.parentNode.parentNode.firstChild.firstChild.style.backgroundColor='';
	}
	chgFilter('')
	var arrCSS,arr,a,obj,aV,aU,f,obj0,t,arrDir
	arrDir=new Array("top","right","bottom","left")
	arrCSS=new Array()
	css=(css?css:'').replace(/(^[ ;]+)|([\r\n\t]+)|([ ;]+$)/g,"")
	arrCSS=css.split(/;+/)
	for (var i=0;i<arrCSS.length;i++){
		arr=arrCSS[i].split(/:+/)
		arr[1]=arrCSS[i].substring(arrCSS[i].indexOf(":")+1)
		arr[0]=arr[0].toLowerCase().replace(/-/g,"_").replace(/(^ +)|( +$)/g,"")
		if(arr[0]=="top")arr[0]="top0";
		if((global(arr[0])!=null&&arr[1]!=null)||arr[0]=="background_position"||arr[0]=="clip"||/^border/.test(arr[0])){
			arr[1]=arr[1].replace(/(^ +)|( +$)/g,"")
			if(arr[0]=="clip")arr[1]=arr[1].toLowerCase().replace(/rect *\((.*)\)/,"$1")
			a=arr[1].split(/ +/)
			for(var j=0;j<a.length;j++){
			switch(arr[0]){
				case "background_position":
					obj0=j==1?background_position_v:background_position_h
					t=j==1?'background_position_v':'background_position_h'
					break
				case "clip":
					obj0=eval(arr[0]+"_"+arrDir[j])
					t=arr[0]+"_"+arrDir[j]
					break
				case "padding":
					obj0=eval(arr[0]+"_"+arrDir[j])
					t=arr[0]+"_"+arrDir[j]
					eval(arr[0]+".checked=(a.length==1)")
					break
				case "margin":
					obj0=eval(arr[0]+"_"+arrDir[j])
					t=arr[0]+"_"+arrDir[j]
					eval(arr[0]+".checked="+(a.length==1))
					break
				default:
					if(arr[0]=="border"||/^border_[a-z]{3,6}$/.test(arr[0])){
						var t0=arr[0]=="border"?"top":arr[0].replace(/^border_([a-z]{3,6}$)/,"$1")
						if(/^[\-0-9]+[A-Za-z%]{1,2}$/.test(a[j])||/thin|thick|medium/i.test(a[j])){
							obj0=eval("border_"+t0+"_width")
							t="border_"+t0+"_width"
						}else if(/^#[0-9a-f]{1,6}/i.test(a[j])){
							obj0=eval("border_"+t0+"_color")
							t="border_"+t0+"_color"
						}else{
							obj0=eval("border_"+t0+"_style")
							t="border_"+t0+"_style"
						}
					}else{
						obj=eval(arr[0])
						obj0=obj.length?obj[j]:obj
						t=arr[0]
					}
					if(/^border/.test(arr[0])){
						border_width.checked=arr[0]=="border"
						border_style.checked=arr[0]=="border"
						border_color.checked=arr[0]=="border"
					}
					if(/padding_|margin_/.test(arr[0])){
						eval(arr[0]+".checked=false")
					}
			}
			f=/^[\-0-9]+[A-Za-z%]{1,2}$/.test(a[j])&&global(t+"_unit")
			if(f){
				aV=a[j].replace(/[A-Za-z%]{1,2}$/g,'')
				aU=a[j].replace(/^[\-0-9]+/g,'')
			}else{
				aV=/image$/.test(t)?unescape(a[j].replace(/url\((.*)\)/i,"$1")):(/font_family|filter/.test(t)?arr[1]:a[j])
			}
			if(obj0.t){
				if(t=="filter"){
					aV=aV.replace(/ +/g,"").toLowerCase()
					var aV0=aV.replace(/(.+)\(.*\)$/,"$1")
					filter.t.value=aV0
					if(chgFilter(aV0)&&/\(.*\)$/.test(aV)){
						for(var k=0;k<select_filter.options.length;k++){
							if(select_filter.options[k].value.toLowerCase().indexOf(aV0)==0)select_filter.options[k].selected=true;
						}
						var aV1=aV.replace(/.+\((.*),*\)$/,"$1")
						var a0=aV1.split(',')
						for(var k=0;k<a0.length;k++){
							if(a0[k]=="")break;
							var a1=a0[k].split("=")
							if(/checkbox/.test(eval(aV0+"_"+a1[0]).type))eval(aV0+"_"+a1[0]+".checked="+a1[1]);
							if(eval(aV0+"_"+a1[0]).t)eval(aV0+"_"+a1[0]).t.value=a1[1];
							if(/color$/.test(a1[0]))eval(aV0+"_"+a1[0]).value=a1[1],txtHexChange(eval(aV0+"_"+a1[0])),eval(aV0+"_"+a1[0]).parentNode.parentNode.firstChild.firstChild.style.backgroundColor=a1[1];
						}
					}
				}else{
					obj0.t.value=aV
					var sltObj=eval("select_"+t)
					for(var k=0;k<sltObj.options.length;k++){
						if(sltObj.options[k].value.toLowerCase()==aV.toLowerCase())sltObj.options[k].selected=true;
					}
					if(f){
						sltObj=eval(t+"_unit")
						unitIsEnabled(t,aV)
						for(var k=0;k<sltObj.options.length;k++){
							if(sltObj.options[k].value.toLowerCase()==aU.toLowerCase())sltObj.options[k].selected=true;
						}
					}
				}
			}else{
				if(t=="text_decoration"){
					for(var l=0;l<5;l++){
						if(a[j].toLowerCase()==text_decoration[l].value)text_decoration[l].checked=true;
					}
				}else{
					obj0.value=aV
					if(/color$/.test(t))txtHexChange(obj0),obj0.parentNode.parentNode.firstChild.firstChild.style.backgroundColor=obj0.value;
				}
			}
			}
		}
	}
}
function ifrmHTML(w,f){
	return '<BODY style="margin: 0px;"><input type="text" id="t" style="border: none;height 18px;width:'+w+'px;font-size: 12px;"'+(f?' onkeyup="parent.unitIsEnabled(\''+f+'\',this.value)"  onchange="parent.unitIsEnabled(\''+f+'\',this.value)"':'')+'></body>'
}
function unitIsEnabled(id,v){
	var reg=/^[\-0-9]+$/
	eval(id+"_unit.disabled=!reg.test(v)")
}
function sltChange(obj,f,t){
	eval(obj.previousSibling.id+'.t.value=obj.value')
	if(!t)eval(obj.previousSibling.id+'.t.select()');
	if(!t)eval(obj.previousSibling.id+'.t.focus()');
	if(f)unitIsEnabled(obj.previousSibling.id,obj.value);
}
function setColor(obj,old){
	var arr = showModalDialog("data/colorPicker.htm",old, "dialogWidth:379px; dialogHeight:208px; status:0;help:0");
	if (arr != null){
		obj.value=arr;
		event.srcElement.style.backgroundColor=arr;
	}
}
function controlTable(obj){
	var t=obj.value
	if(tblCssCode.style.display=="block"&&t!="CssCode")parseCssCode(taCssCode.value);
	for(var i=0;i<obj.options.length;i++){
		eval('tbl'+obj.options[i].value+'.style.display="none"');
	}
	eval('tbl'+t+'.style.display="block"')
	tdCategory.innerText=obj.options[obj.selectedIndex].text
	if(t=="CssCode"){
		taCssCode.value=isMul.checked?genCssCode().replace(/;/g,";\n\r"):genCssCode()
	}
}
function txtHexChange(obj){
	if(obj.value==""){
		obj.parentNode.parentNode.firstChild.firstChild.style.backgroundColor=obj.value
		return;
	}
	var reg=/^#*[0-9A-Fa-f]*$/
	if(!reg.test(obj.value)){
		alert("请输入十六进制值 (#RRGGBB)")
		obj.value=''
		return
	}
	var hex=obj.value.indexOf('#')<0 ? "#"+obj.value+"000000" : obj.value+"000000"
	obj.parentNode.parentNode.firstChild.firstChild.style.backgroundColor=obj.value=hex.substring(0,7)
}
function doSame(id,v,t,f){
	var arr=new Array("top","right","bottom","left")
	if(eval((id=="border"?"border_"+t:id)+'.checked')){
		for(var i=0;i<arr.length;i++){
			eval(id+'_'+arr[i]+(t?('_'+t):'')+(t=='color'?'':'.t')+'.value=v')
			if(!f)unitIsEnabled(id+'_'+arr[i]+(t?('_'+t):''),v);
			if(t=="color")eval('border_'+arr[i]+'_color.parentNode.parentNode.firstChild.firstChild.style.backgroundColor=v');
		}
	}
}
function chgFilter(t0){
	var obj=select_filter
	var t=t0.toLowerCase()
	if(global("tbl"+t)){
		subFilter.style.display='block'
		for(var i=0;i<obj.options.length;i++){
			if(!global('tbl'+obj.options[i].value.toLowerCase()))continue;
			eval('tbl'+obj.options[i].value.toLowerCase()+'.style.display="none"');
		}
		eval('tbl'+t+'.style.display="block"')
		filterName.innerText=t0
		return true
	}else{
		subFilter.style.display='none'
		return false
	}
}