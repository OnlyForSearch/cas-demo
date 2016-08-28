
var _k=-1,_6=-1;

//与某个对象进行交互
function talkTo(type, objName, objId)
{
    if(window.parent)
        window.parent.clearTalkRecords(type, objName, objId);
}

function OutlookBar(outlookBarInfos)
{
    browser = new getCurrentExplorer();   //(1). 浏览器信息
    window.outlookBar=this;               //(2). 工具栏对象
    this.outlookBarInfos=outlookBarInfos; //(3). 基本内容
    
    this._p=false;
    this._i=0;
    this._w=0;
    this.htmlCode='';//_y
    
    window.onload=function()
    {
        window.outlookBar.initBar();
    };
    
    window.onresize=function()
    {
        if(browser.ns4)
            document.location.reload();
        else 
            window.outlookBar._o();
    };
    
    document.onselect=function()
    {
        return false;
    };
    
    if(browser.operaOld)
    {	try{
	        $iw=innerWidth;
	        $ih=innerHeight;
	        $tiw=top.innerWidth;
	        $tih=top.innerHeight;
	        window.setInterval('if ($iw != innerWidth || $ih != innerHeight || $tiw != top.innerWidth || $tih != top.innerHeight) document.location.reload();',300)
        }catch (e){} 
    };
        
    this.$panels=this.outlookBarPanels=[];//(4). 面板
    for(var i=0;i<this.outlookBarInfos.panels.length;i++)
        this.outlookBarPanels[i]=new OutlookPanel(this,i);
    
    document.write('<div id="dummyNN4Layer" style="left: 0; top: 0;"></div>'+this.htmlCode)
};
    
$=OutlookBar.prototype;

$._V=function(url,target)
{
    if(!target)target=this.outlookBarInfos.format.target;
    if(target=='_blank')
        window.open(url,'_blank');
    else 
        this._15(target).location=url
};

$._15=function(_q)
{
    if(_q=='_top')
        return top;
    if(top.frames[_q])
        return top.frames[_q];
    for(var i=0;i<top.frames.length;i++)
        if(top.frames[i]!=window)
            return top.frames[i];
    return window
};

$.initBar=function()
{
    for(var i=0;i<this.outlookBarPanels.length;i++)
      this.outlookBarPanels[i].initPanel();//_a
    this._17()
};

$.contactHtmlCode=function(code)
{
    this.htmlCode+=code;
};

$._11=function()
{
    document.cookie='cjsobp_panel='+(_6>=0&&_6<this.outlookBarPanels.length?_6+','+this.outlookBarPanels[_6]._8:'')
};

$._17=function()
{
    var _v=0,_8=0;
    if(document.cookie.match(/cjsobp_panel=(\d)+,(\d+)/))
    {
        _v=parseInt(RegExp.$1);
        _8=parseInt(RegExp.$2);
        if(_v>=this.outlookBarPanels.length)_v=0
    };
    this.outlookBarPanels[_v]._Q(_8)
};

$._T=function()
{
    if(this._G)
    {
        window.clearTimeout(this._G);
        this._p=false;
        this._o()
    };
    this._i=0;
    this._p=true
};

$.$update=$._o=function(_c)
{
    for(var i=0;i<this.outlookBarPanels.length;i++)
        this.outlookBarPanels[i]._o(this._p&&_c);
    if(this._p)
        if(this._i<1000)
        {
            this._i=Math.round(Math.min(this._i+1000/this.outlookBarInfos.format.animationSteps,1000));
            this._G=window.setTimeout('window.outlookBar.$update('+_c+')',this.outlookBarInfos.format.animationDelay)
        }else
        {
            this._i=0;
            this._p=false;
            this._G=null;
            this._o();
            this._11();
            if(!_c&&_6!=-1&&this._w)
                this.outlookBarPanels[_6]._z(this._w)
        }
};

$._d=function()
{
	    var _h=browser.ie && document.body.offsetHeight || ((window.innerHeight || document.documentElement.clientHeight)+(browser.ns4?4:0));
	    for(var i=0;i<this.outlookBarPanels.length;i++)
	        _h -= this.outlookBarPanels[i].panelItem.h;return _h
        
};

$._W=function(_13)
{
    return Math.round(_13*(1000-this._i)/1000)
};
    
/*************************************************/
/*************************************************/
/*************************************************/
function OutlookPanelItem(iWidth, zIndex, format, panel)
{
    this._f=0;
    this._t=false;
    
    //正常情况、鼠标滑过、鼠标点击、保护层
    this.panelItems=[new OutlookHtml(),new OutlookHtml(),new OutlookHtml(),new OutlookHtml(true)];
    this.panelItems[0].writeDiv(iWidth, 0,  zIndex*2,   this.getPanelFormat(format.normal, panel));
    this.panelItems[1].writeDiv(iWidth, 0,  zIndex*2,   this.getPanelFormat(format.rollovered||format.normal, panel));
    this.panelItems[2].writeDiv(iWidth, 0,  zIndex*2,   this.getPanelFormat(format.clicked||format.rollovered||format.normal, panel));
    this.panelItems[3].writeDiv(iWidth, 10, zIndex*2+1, browser.realDom?'<img src="'+window.outlookBar.outlookBarInfos.format.blankImage+'" width="100%" height="100%" />':'')
};

$=OutlookPanelItem.prototype;

$._a=function()
{
    this.panelItems[0].getProperty();
    this.panelItems[1].getProperty();
    this.panelItems[2].getProperty();
    this.panelItems[3].getProperty();
    
    with(this.panelItems[0])
    {
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=h
    };
    
    this.panelItems[3].el._g=this;
    this.panelItems[3].el.onmouseover=function()
    {
        if(browser.ns4)
            this.captureEvents(Event.MOUSEDOWN|Event.MOUSEUP);
        this._$=true;
        this._g._C(this._Z?2:1);
        this._g._18()
    };
    
    this.panelItems[3].el.onmouseout=function()
    {
        if(browser.ns4)
            this.releaseEvents(Event.MOUSEDOWN|Event.MOUSEUP);
        this._$=false;
        this._g._C(0);
        this._g._L()
    };
    
    this.panelItems[3].el.onmousedown=function()
    {
        this._Z=true;
        this._g._C(2);
        this._g._N()
    };
    
    this.panelItems[3].el.onmouseup=function()
    {
        this._Z=false;
        this._g._C(this._$?1:0);
        if(browser.ns4)
            this.onclick();
        this._g._H()
    };
    
    this.panelItems[3].el.onclick=function()
    {
        this._g._K()
    };
    
    if(browser.realDom)
    {
        this.panelItems[0]._e();
        this.panelItems[1]._e();
        this.panelItems[2]._e();
        this.panelItems[0]._b();
        this.panelItems[1]._b();
        this.panelItems[2]._b()
    }
};

$._18=$._L=$._N=$._H=$._K=function(){};

$._C=function(_f)
{
    if(this._f!=_f)
    {
        if(this._t)
        {
            this.panelItems[_f]._e();
            this.panelItems[this._f]._b()
        };
        this._f=_f
    }
};

$._e=function()
{
    if(!this._t)
    {
        this.panelItems[this._f]._e();
        this.panelItems[3]._e();
        this._t=true
    };
    this.panelItems[3].setHeight(this.h=this.panelItems[this._f].getHeight());
};

$._b=function()
{
    if(this._t)
    {
        this.panelItems[this._f]._b();
        this.panelItems[3]._b();
        this._t=false
    }
};

$._j=function(_x,_y)
{
    this.panelItems[0].setPosition(_x,_y);
    this.panelItems[1].setPosition(_x,_y);
    this.panelItems[2].setPosition(_x,_y);
    this.panelItems[3].setPosition(_x,_y);
    this.x=_x;
    this.y=_y
};

$.getPanelFormat=function(format, panel)
{
    for(var _q in panel)
        format = format.replace('{'+_q+'}', panel[_q]);
    return format;
};

/*************************************************/
/*************** 初始化面板 ************************/
/*************************************************/
function OutlookPanel(outlookBar, num)
{
    this.outlookBar = outlookBar;
    this.num = num;
    
    this._8=0;
    var panel=this.outlookBar.outlookBarInfos.panels[this.num];
    
    this.url=panel.url;
    this.target=panel.target;
    
    this.panelItem=new OutlookPanelItem(browser.ns4?null:'100%', 3, this.outlookBar.outlookBarInfos.format.templates.panel, panel);
    this.panelItem._9=this;
    this.panelItem._K=function()
    {
        if(this._9._16())
        {
            this._9.outlookBar._T();
            this._9._Q(0)
        };
        if(this._9.url)
            window.outlookBar._V(this._9.url,this._9.target)
    };
    
    
    this._5=[];
    for(var i=0;i<this.outlookBar.outlookBarInfos.panels[this.num].items.length;i++)
    {
        var panel=this.outlookBar.outlookBarInfos.panels[this.num].items[i];
        this._5[i]=new OutlookPanelItem(browser.ns4?null:'100%',1,this.outlookBar.outlookBarInfos.format.templates.item,panel);
        if(panel.url)
        {
            this._5[i].url=panel.url;
            this._5[i].target=panel.target;
            this._5[i]._9=this;
            this._5[i]._K=function()
            {
                if(window.outlookBar._d()>=this.h&&!this._9._E(this,true))
                    this._9._z(+1);
                window.outlookBar._V(this.url,this.target)
            }
        }
    };
    
    this.arr_up=new OutlookPanelItem('auto',2,this.outlookBar.outlookBarInfos.format.templates.upArrow,{});
    this.arr_up._9=this;
    this.arr_up._N=function()
    {
        this._9._z(-1)
    };
    this.arr_dn=new OutlookPanelItem('auto',2,this.outlookBar.outlookBarInfos.format.templates.downArrow,{});
    this.arr_dn._9=this;
    
    this.arr_dn._N=function()
    {
        this._9._z(+1)
    };
    this.arr_up._L=this.arr_up._H=this.arr_dn._L=this.arr_dn._H=function()
    {
        this._9.outlookBar._w=0
    }
};

$=OutlookPanel.prototype;

$.initPanel=function()
{
    this.panelItem._a();
    for(var i=0;i<this._5.length;i++)
        this._5[i]._a();
    this.arr_up._a();
    this.arr_dn._a()
};

$._P=function()
{	
    	return browser.ie&&document.body.offsetWidth||window.innerWidth || document.documentElement.clientWidth;
};

$._E=function(_1,_14)
{
    if(_14)
        return _1.y>=this.panelItem.y 
               && 
               (
                 this.num==this.outlookBar.outlookBarPanels.length-1 
                 ||
                 _1.y+_1.h-1< this.outlookBar.outlookBarPanels[this.num+1].panelItem.y+this.outlookBar.outlookBarPanels[this.num+1].panelItem.h
               );
    else 
        return (
                  _1.y>=this.panelItem.y+this.panelItem.h 
                  &&
                  _1.y<this.panelItem.y+this.panelItem.h+this.outlookBar._d()
               )
               ||
               (
                 _1.y+_1.h>=this.panelItem.y+this.panelItem.h
                 &&
                 _1.y+_1.h<this.panelItem.y+this.panelItem.h+this.outlookBar._d()
               )
};

$._S=function(_10)
{
    var _h=0;
    for(var i=0;i<this.num;i++)
        _h+=this.outlookBar.outlookBarPanels[i].panelItem.h;
    if(_10>=0&&this.num>_10)
        _h+=this.outlookBar._d();
    return _h
};

$.$update=$._o=function(_c)
{
    var _y=this._S(_6);
    this.panelItem._j(0,_y+(_c?this.outlookBar._W(this._S(_k)-_y):0));
    this.panelItem._e();
    if(_6==this.num||(_c&&_k==this.num))
    {
        if(this._D()<this.outlookBar._d())
            while(this._8>0)
            {
                this._8--;
                if(this._D()>this.outlookBar._d())
                {
                    this._8++;
                    break
                }
                else if(this._D()>=this.outlookBar._d())
                    break
            };
        _y+=this.panelItem.h;
        if(this.outlookBar._i==0)
        {
            this._dy=0;
            if(_c)
            {
                if(this.num==_6)
                {
                    if(_6>_k&&_k!=-1)
                        this._dy=this.outlookBar._d()
                }else
                {
                    if(_k<_6||_6==-1)
                        return;
                    else 
                        this._dy=-this.outlookBar._d()
                }
            }
            else if(this.outlookBar._p)
                this._dy=this._5[this._8].y-_y
        };
        
        for(var i=0;i<this._8;i++)
            _y-=this._5[i].h;
        _y+=this.outlookBar._W(this._dy);
        
        for(var i=0;i<this._5.length;i++)
        {
            this._5[i]._j(0,_y);
            if(this._E(this._5[i],_c))
                this._5[i]._e();
            else 
                this._5[i]._b();
            _y+=this._5[i].h
        }
    }
    else if(_k==this.num)
        for(var i=0;i<this._5.length;i++)
            this._5[i]._b();
    this.arr_up._j(this._P()-this.arr_up.w,this.panelItem.y+this.panelItem.h);
    this.arr_dn._j(this._P()-this.arr_dn.w,this.panelItem.y+this.panelItem.h+this.outlookBar._d()-this.arr_dn.h);
    
    if(this._X())
        this.arr_up._e();
    else if(!_c||this.outlookBar._i==1000)
        this.arr_up._b();
    
    if(!this._E(this.arr_up,_c))
        this.arr_up._b();
    if(this._U())
        this.arr_dn._e();
    else if(!_c||this.outlookBar._i==1000)
        this.arr_dn._b();
    if(!this._E(this.arr_dn,_c))
        this.arr_dn._b()
};

$._z=function(_O)
{
    if(_O<0?this._X():this._U())
    {
        this.outlookBar._w=_O;
        this.outlookBar._T();
        this._8+=_O;
        this.outlookBar._o()
    }
};

$._D=function()
{
    var _h=0;
    for(var i=this._8;i<this._5.length;i++)
        _h+=this._5[i].h;
    return _h
};

$._U=function()
{
    return this._8<this._5.length-1&&_6==this.num&&this._D()>this.outlookBar._d()
};

$._X=function()
{
    return this._8>0&&_6==this.num
};

$._16=function()
{
    return _6!=this.num||this.outlookBar.outlookBarInfos.format.rollback
};

$._Q=function(_8)
{
    if(_6==this.num)
    {
        if(this.outlookBar.outlookBarInfos.format.rollback)
        {
            _k=this.num;
            _6=-1;
        }else 
            return
    }else
    {
        _k=_6;
        _6=this.num
    };
    this._8=_8;
    this.outlookBar._o(true)
};

/*************************************************/
/*************************************************/
/*************************************************/
//获得当前浏览器 (判断当前使用的浏览器：IE/NS/OPERA)
function getCurrentExplorer()
{
    this.ver=navigator.appVersion;
    this.agent=navigator.userAgent;
    
    this.dom=document.getElementById?1:0;
    
    this.opera5=this.agent.indexOf("Opera 5")>-1;
    
    this.ie5=this.ver.indexOf("MSIE 5")>-1&&this.dom&&!this.opera5;
    this.ie6=this.ver.indexOf("MSIE 6")>-1&&this.dom&&!this.opera5;
    this.ie4=(document.all&&!this.dom&&!this.opera5)?1:0;
    this.ie=this.ie4||this.ie5||this.ie6;
    
    this.opera7=(   (this.agent.toLowerCase().indexOf('opera 7')>-1) 
                  ||(this.agent.toLowerCase().indexOf('opera/7')>-1)
                );
    
    this.opera=window.opera;
    this.operaOld=this.opera&&!this.opera7;
    this.realDom=this.dom&&!this.operaOld;
    this.ns4=document.layers&&!this.dom&&!this.operaOld
};

/*************************************************/
/*************************************************/
/*************************************************/
function OutlookHtml(hided)
{
    if(!OutlookHtml.num)
        OutlookHtml.num = 0;
    
    this.id = 'do_'+(OutlookHtml.num++);
    this.isHidden = hided;
};

$=OutlookHtml.prototype;

//当前元素的属性
$.getProperty=function()//ns4p 
{
    this.el=browser.dom?
              document.getElementById(this.id)
              :
              browser.ie4?
                document.all[this.id]
                :
                browser.ns4?
                  document.layers[this.id]:0;
    this.css=(browser.dom||browser.ie4)?this.el.style:this.el;
    this.doc=(browser.dom||browser.ie4)?document:this.css.document;
    
    this.x=parseInt(this.css.left)||this.css.pixelLeft||this.el.offsetLeft||0;
    this.y=parseInt(this.css.top)||this.css.pixelTop||this.el.offsetTop||0;
    
    this.w=this.getWidth();
    this.h=this.getHeight();
};

//元素宽度
$.getWidth=function()
{
    return this.el.offsetWidth||this.css.clip.width||this.doc.width||this.css.pixelWidth||0;
};

//元素高度
$.getHeight=function()
{
    return this.el.offsetHeight||this.css.clip.height||this.doc.height||this.css.pixelHeight||0;
};

//元素置位
$.setPosition=function(_x,_y)
{
    this.x=_x;
    this.y=_y;
    if(this.el)
    {
        var px=(browser.ns4||browser.operaOld)?0:'px';
        this.css.left=_x+px;
        this.css.top=_y+px;
    }
};

//元素置高
$.setHeight=function(_h)
{
    this.h=_h;
    if(this.el)
    {
        if(browser.ns4)
            this.el.resize(this.w,_h);
        else
        {
            var px=browser.operaOld?0:'px';
            this.css.height=_h+px
        }
    }
};

//
$._e=function()//showDiv
{
    if(browser.realDom&&!this.el&&!this.isHidden)
    {
        this.el=document.createElement('DIV');
        this.el.innerHTML=this.htmlCode;
        this.el.style.position='absolute';
        this.el.style.width=this._w||(this.w+'px');
        this.el.style.left=this.x+'px';
        this.el.style.top=this.y+'px';
        this.el.style.zIndex=this._z;
        document.body.appendChild(this.el,'beforeEnd');
        this.css=this.el.style;
        this.w=this.getWidth();
        this.h=this.getHeight();
    };
    this.css.visibility=browser.ns4?'show':"visible";
};

$._b=function()
{
    this.css.visibility=browser.ns4?'hide':"hidden";
    if(browser.realDom&&this.el&&!this.isHidden)
    {
        this.el.parentNode.removeChild(this.el);
        this.el.innerHTML='';
        this.css=null;
        this.el=null
    }
};

$.writeDiv=function(width, heigth, zIndex, code)
{
    this.htmlCode=code;
    this._z=zIndex;
    this._w=width;
    window.outlookBar.contactHtmlCode
    (
      '<div ondrag="return false" id="'+this.id+'" style="position:absolute; z-index:'+zIndex+
          ';left: 0; top: 0;'+(width?' width: '+width+'; ':'')+'height: auto; visibility:hidden;">'+
        code+
      '</div>'
    )
}










