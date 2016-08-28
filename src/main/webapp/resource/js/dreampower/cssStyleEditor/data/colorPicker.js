// Copyright 2004 Afeila Studio All rights reserved.

var R,G,B,H,S,V,yL,yR,oX1=9,oX2=194,oY1=9
document.onmouseup=docMU
function init(){
	for (var i=0; i<document.body.all.length;	i++){
		var curr=document.body.all[i];
		if (curr.tagName.toLowerCase() == "img"&&curr.id!='imgHue'){
      		InitBtn(curr);
    	}
  	}
	var hex=window.dialogArguments
	if(hex){
		hex=hex.substring(1)
		R=toDec(hex.substring(0,2))
		G=toDec(hex.substring(2,4))
		B=toDec(hex.substring(4))
	}else{
		R=G=B=0
	}
	rgb2hsv(R,G,B)
	tdOldColor.bgColor="#"+toHex(R)+toHex(G)+toHex(B)
	changeAllParameter(true,true,true)
	docMU()	
}
function InitBtn(btn){
  btn.ondragstart = YCancelEvent;
  btn.onselectstart = YCancelEvent;
  btn.onselect = YCancelEvent;
  btn.YINITIALIZED = true;
  return true;
}
function YCancelEvent()
{
  event.returnValue=false;
  event.cancelBubble=true;
  return false;
}
function toHex(n)
{
	n = Math.floor(n);
	n=(n.toString(16).length<2 ? "0"+n.toString(16) : n.toString(16)).toUpperCase();
	return n;
}
function toDec(n)
{
	n=parseInt(n,16);
	return n;
}
function getColorFromXY(x,y){
	var cnum,x,y,hSpace,n,hDis,r,g,b;
	cnum=new Array(0,0,0,0,0,1,1,0,1,0,1,-1,0,0,0,0,0,1,1,0)
	hSpace=imgHue.width/6
	n=Math.floor(x/hSpace)
    hDis = Math.floor(x % hSpace * (255 / hSpace));
	r = 255*cnum[n*2+8]+hDis*cnum[n*2+9];
    g = 255*cnum[n*2+4]+hDis*cnum[n*2+5];
    b = 255*cnum[n*2]+hDis*cnum[n*2+1];
	r = Math.floor(r - y*r/127);
	g = Math.floor(g - y*g/127);
	b = Math.floor(b - y*b/127);
	imgTopArrow.style.pixelLeft=x+oX1
	imgLeftArrow.style.pixelTop=y+oY1
	changeWhiteness(r,g,b)
	HBWchangeColor()
}
function changeWhiteness(r,g,b){
	var r0,g0,b0;
	for(var i=0;i<64;i++){
		r0=255-(255-r)*i/64
		g0=255-(255-g)*i/64
		b0=255-(255-b)*i/64
		tblWhiteness.rows(63-i).bgColor=toHex(r0)+toHex(g0)+toHex(b0)
	}
}
document.onmousedown=function(){
	if (event.srcElement.className.indexOf('img')==0){
		document.dragapproved=true
		document.evObj=event.srcElement
		document.tempY=document.evObj.style.pixelTop
		document.evY=event.clientY
		document.tempX=document.evObj.style.pixelLeft
		document.evX=event.clientX
		document.onmousemove=move
	}
}

function move(){
	var t,id=document.evObj.id
	if (event.button==1&&document.dragapproved){
		if(id=="imgTopArrow"||document.evObj.className=="imgBar"){
			t=document.tempX+event.clientX-document.evX
			if(t>oX1-1&&t<oX1+128&&document.evObj.id=="imgTopArrow"){
				document.evObj.style.pixelLeft=t
			}else if(t>oX2-1&&t<oX2+125&&document.evObj.className=="imgBar"){
				document.evObj.style.pixelLeft=t
				if(id=="imgR"){txtR.value=Math.floor((t-oX2)*255/124);txt2RGBHSV();changeAllParameter(true,true)}
				if(id=="imgG"){txtG.value=Math.floor((t-oX2)*255/124);txt2RGBHSV();changeAllParameter(true,true)}
				if(id=="imgB"){txtB.value=Math.floor((t-oX2)*255/124);txt2RGBHSV();changeAllParameter(true,true)}
				if(id=="imgH"){txtH.value=Math.floor((t-oX2)*255/124);txt2RGBHSV();hsv2rgb(H,S,V);changeAllParameter(true,false,true)}
				if(id=="imgS"){txtS.value=Math.floor((t-oX2)*255/124);txt2RGBHSV();hsv2rgb(H,S,V);changeAllParameter(true,false,true)}
				if(id=="imgV"){txtV.value=Math.floor((t-oX2)*255/124);txt2RGBHSV();hsv2rgb(H,S,V);changeAllParameter(true,false,true)}
			}
		}else{
			t=document.tempY+event.clientY-document.evY
			if(t>oY1-1&&t<oY1+128){
				document.evObj.style.pixelTop=t
			}
		}
		return false
	}
}
function docMU(){
	document.dragapproved=false
	var r,g,b,h,s,v
	r=txtR.value
	g=txtG.value
	b=txtB.value
	h=txtH.value
	s=txtS.value
	v=txtV.value
	changeTblRGB(tblR,r,g,b,'r')
	changeTblRGB(tblG,r,g,b,'g')
	changeTblRGB(tblB,r,g,b,'b')
	changeTblSV(tblS,h,s,v,"s")
	changeTblSV(tblV,h,s,v,"v")
}
function tblWhitenessMD(){
	var evObj=event.srcElement
	imgRightArrow.style.pixelTop=evObj.parentNode.rowIndex*2+event.offsetY+oY1
	HBWchangeColor()
}
function HBWchangeColor(){
	var hex,t=oY1+127-imgRightArrow.style.pixelTop
	hex=tblWhiteness.rows(0).bgColor.substring(1)
	R=Math.floor(255-(255-toDec(hex.substring(0,2)))*t/127)
	G=Math.floor(255-(255-toDec(hex.substring(2,4)))*t/127)
	B=Math.floor(255-(255-toDec(hex.substring(4)))*t/127)
	changeAllParameter(false,true,true)
}
function rgb2hsv(r,g,b){
  var rd, gd, bd, h, s, v, max, min, del, rc, gc, bc;
  rd = r / 255;
  gd = g / 255;
  bd = b / 255;
  max=rd>=gd?(rd>=bd?rd:bd):(gd>=bd?gd:bd)
  min=rd<=gd?(rd<=bd?rd:bd):(gd<=bd?gd:bd)
  del = max - min;
  v = max;
  s=max!=0.0?del/max:0.0;
  h=isNaN(H)?0:H
  if(s != 0.0){
    rc = (max - rd) / del;
    gc = (max - gd) / del;
    bc = (max - bd) / del;
    if      (rd==max) h = bc - gc;
    else if (gd==max) h = 2 + rc - bc;
    else if (bd==max) h = 4 + gc - rc;
    h = h * 256/6;
    if (h<0) h += 256;
  }
  H=Math.floor(h)
  S=Math.floor(s*255)
  V=Math.floor(v*255)
}

function hsv2rgb(h,s,v){
  var j,rd, gd, bd,f, p, q, t;
  s=s/255
  v=v/255
  if (s==0.0) { rd = v;  gd = v;  bd = v; }
  else {
    h = h *6/256;
    j = Math.floor(h);
    f = h - j;
    p = v * (1-s);
    q = v * (1 - (s*f));
    t = v * (1 - (s*(1 - f)));
    switch (j) {
    case 0:  rd = v;  gd = t;  bd = p;  break;
    case 1:  rd = q;  gd = v;  bd = p;  break;
    case 2:  rd = p;  gd = v;  bd = t;  break;
    case 3:  rd = p;  gd = q;  bd = v;  break;
    case 4:  rd = t;  gd = p;  bd = v;  break;
    case 5:  rd = v;  gd = p;  bd = q;  break;
    default: rd = v;  gd = t;  bd = p;  break;
    }
  }
	R = Math.floor((rd * 255.0) + 0.5);
	G = Math.floor((gd * 255.0) + 0.5);
	B = Math.floor((bd * 255.0) + 0.5);
}
function changeAllParameter(isHBW,isHSV,isRGB){
	var r0,g0,b0
	r0=R,g0=G,b0=B
	tdNewColor.bgColor=txtHex.value="#"+toHex(R)+toHex(G)+toHex(B)
	if(isRGB){
		txtR.value=R
		txtG.value=G
		txtB.value=B
		imgR.style.pixelLeft=Math.floor(R*124/255)+oX2;
		imgG.style.pixelLeft=Math.floor(G*124/255)+oX2
		imgB.style.pixelLeft=Math.floor(B*124/255)+oX2
	}
	rgb2hsv(R,G,B)
	if(isHSV){
		txtH.value=H
		txtS.value=S
		txtV.value=V
		imgH.style.pixelLeft=Math.floor(H*124/255)+oX2
		imgS.style.pixelLeft=Math.floor(S*124/255)+oX2
		imgV.style.pixelLeft=Math.floor(V*124/255)+oX2
	}
	if(isHBW){
		imgTopArrow.style.pixelLeft=Math.floor(H*127/255)+oX1
		hsv2rgb(H,255,255)
		var yL0=((255-R)*(255-g0)-(255-G)*(255-r0))*127/(G*(255-r0)-R*(255-g0))
		var yR0=(127*(255-r0)/(255-R+yL0*R/127))
		yL=r0==g0?(isNaN(yL)?127:yL):Math.abs(yL0>127||isNaN(yL0)?(isNaN(yL0)?0:yL):yL0)
		yR=r0==g0?(isNaN(yR)?127:yR):Math.abs(yR0>127||isNaN(yR0)?(isNaN(yR0)?0:127):yR0)
		imgLeftArrow.style.pixelTop=Math.floor(yL)+oY1
		imgRightArrow.style.pixelTop=Math.floor(127-yR)+oY1
		R = Math.floor(R - yL*R/127);
		G = Math.floor(G - yL*G/127);
		B = Math.floor(B - yL*B/127);
		changeWhiteness(R,G,B)
	}
}
function changeTblRGB(obj,r,g,b,f){
	var r0,g0,b0;
	for(var i=0;i<64;i++){
		r0=f=="r"?Math.floor(255*i/64):r
		g0=f=="g"?Math.floor(255*i/64):g
		b0=f=="b"?Math.floor(255*i/64):b
		obj.rows(0).cells(i).bgColor=toHex(r0)+toHex(g0)+toHex(b0)
	}
}
function changeTblSV(obj,h,s,v,f){
	for(var i=0;i<64;i++){
		if(f=="s"){
			hsv2rgb(h,Math.floor(255*i/64),v)
		}else if(f=="v"){
			hsv2rgb(h,s,Math.floor(255*i/64))
		}
		obj.rows(0).cells(i).bgColor='#'+toHex(R)+toHex(G)+toHex(B)
	}
}
function tblRGBHSV_MD(id){
	var t=event.srcElement.cellIndex*2+event.offsetX
	eval("txt"+id+".value=Math.floor(t*255/127)");
	eval("img"+id+".style.pixelLeft=Math.floor(t*124/127)+oX2");
	txt2RGBHSV();
	if(id=="H"||id=="S"||id=="V"){
		hsv2rgb(H,S,V);
		changeAllParameter(true,false,true)
	}else{
		changeAllParameter(true,true,true)
	}
}
function txt2RGBHSV(){
	R=txtR.value
	G=txtG.value
	B=txtB.value
	H=txtH.value
	S=txtS.value
	V=txtV.value
}
function txtRGBHSV_change(obj,id){
	var reg=/^[0-9]*$/
	if(!reg.test(obj.value)){
		alert("The value must be number!")
		obj.value=parseInt(obj.value)
		if(isNaN(obj.value))obj.value=0;
		return
	}
	if(obj.value>255)obj.value=255;
	txt2RGBHSV();
	eval("img"+id+".style.pixelLeft=Math.floor(obj.value*124/255)+oX2");
	if(id=="H"||id=="S"||id=="V"){
		hsv2rgb(H,S,V);
		changeAllParameter(true,false,true)
	}else{
		changeAllParameter(true,true)
	}
	docMU()
}
function txtHexChange(obj){
	var reg=/^#*[0-9A-Fa-f]*$/
	if(!reg.test(obj.value)){
		alert("Enter a hex value (#RRGGBB)!")
		obj.value=''
		return
	}
	var hex=obj.value.indexOf('#')<0 ? "#"+obj.value+"000000" : obj.value+"000000"
	hex=hex.substring(0,7).toUpperCase()
	obj.value=hex
	hex=hex.substring(1)
	R=toDec(hex.substring(0,2))
	G=toDec(hex.substring(2,4))
	B=toDec(hex.substring(4))
	changeAllParameter(true,true,true)
	docMU()
}
function arrowMD(obj,id,isInc){
	obj.className="downBorder"
	document.evObj=obj
	document.inc=isInc
	document.tmpId=id
	changeValue()
	document.isAuto=true
	setTimeout(changeValue,500)
}
function arrowMU(obj){
	obj.className="overBorder"
	document.isAuto=false
}
function changeValue(){
	if(document.evObj.className!="downBorder"&&!document.isAuto)return;
	var id=document.tmpId
	var t=parseInt(eval("txt"+id+".value"))
	if(document.inc){t++}else{t--}
	t=t<0?0:(t>255?255:t)
	eval("txt"+id+".value=t")
	txt2RGBHSV();
	eval("img"+id+".style.pixelLeft=Math.floor(t*124/255)+oX2");
	if(id=="H"||id=="S"||id=="V"){
		hsv2rgb(H,S,V);
		changeAllParameter(true,false,true)
	}else{
		changeAllParameter(true,true)
	}
	if(document.isAuto&&t>0&&t<255){
		setTimeout(changeValue,10)
	}else{
		return
	}
}