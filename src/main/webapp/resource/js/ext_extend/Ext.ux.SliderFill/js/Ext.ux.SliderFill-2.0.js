/**
 * Ext.ux.SliderFill
 *
 * @author  Abdul Rehman Talat (artalat.obspk.com)
 * @version 2.0
 * @date    8 December 2009
 *
 * @license Ext.ux.SliderFill is licensed under the terms of
 * the Open Source LGPL 3.0 license.  Commercial use is permitted to the extent
 * that the code/component(s) do NOT become part of another Open Source or Commercially
 * licensed development library or toolkit without explicit permission.
 * 
 * License details: http://www.gnu.org/licenses/lgpl.html
 */
Ext.ns("Ext.ux");
Ext.ux.SliderFill = (function(){
    return {
        init: function(f) {
            f.onRender = f.onRender.createSequence(this.onRender);
            f.afterRender = f.afterRender.createSequence(this.afterRender);
            f.moveThumb = f.moveThumb.createSequence(this.moveThumb);
        },
        onRender : function(){
            this.fill = this.innerEl.insertFirst({cls:'x-slider-bg'});
            this.fill.insertHtml("afterBegin", "&nbsp;");
        },
        afterRender : function()
        {
            if(this.vertical==true)
            {
                    this.fill.setWidth(this.innerEl.getWidth());
                    if(this.thumbs.length == 1)
                    {
                        var thumb = this.thumbs[0];
                        var height = this.translateValue(thumb.value)+(thumb.el.getHeight()/2).constrain(0,this.innerEl.getHeight());
                        this.fill.setHeight(height);
                    }
                    else
                    {
                        Ext.fly(this.endEl).addClass("x-slider-vert-multi");
                        var first = this.thumbs[0];
                        var last = this.thumbs[this.thumbs.length-1];
                        var height = this.translateValue(last.value) - this.translateValue(first.value);
                        var bottom = this.translateValue(first.value)+(first.el.getHeight()/2);
                        this.fill.setBottom(bottom);
                        this.fill.setHeight(height);
                    }
            }
            else
            {      
                    this.fill.setWidth(this.translateValue(this.thumbs[0].value));
                    if(this.thumbs) {
	                    if(this.thumbs.length == 1)
	                    {
	                        this.fill.setWidth(this.translateValue(this.thumbs[0].value));
	                    }
	                    else
	                    {
	                        Ext.fly(this.el).addClass("x-slider-horz-multi");
	                        var first = this.thumbs[0];
	                        var last = this.thumbs[this.thumbs.length-1];
	                        var width = this.translateValue(last.value) - this.translateValue(first.value);
	                        var left = this.translateValue(first.value);
	                        this.fill.setLeft(left);
	                        this.fill.setWidth(width);
	                    }                    	
                    }
                    this.fill.setHeight(this.innerEl.getHeight());
            }
        },
        moveThumb: function(index, v, animate)
        {
        	if(index<0) return false;
        	index = Math.floor(index);
            var thumb = this.thumbs[index];
            if(this.vertical==true)
            {
                this.fill.setWidth(this.innerEl.getWidth());
                if(this.thumbs.length == 1)
                {
                    thumb = this.thumbs[0];
                    var height = this.translateValue(thumb.value)+(thumb.el.getHeight()/2).constrain(0,this.innerEl.getHeight());
                    this.fill.setHeight(height);
                }
                else
                {
                    var first = this.thumbs[0];
                    var last = this.thumbs[this.thumbs.length-1];
                    var height = this.translateValue(last.value) - this.translateValue(first.value);
                    var bottom = this.translateValue(first.value)+(first.el.getHeight()/2);
                    this.fill.setBottom(bottom);
                    this.fill.setHeight(height);
                }
            }
            else
            {                  
                var first = this.thumbs[0];
                var last = this.thumbs[this.thumbs.length-1];
                if(this.thumbs.length == 1)
                {
                    this.fill.setWidth(this.translateValue(thumb.value)+(thumb.el.getWidth()/2), animate);
                }
                else if (this.thumbs.length != 1 && (thumb == first || thumb == last))
                {
                    var width = this.translateValue(last.value) - this.translateValue(first.value);
                    var left = this.translateValue(first.value);
                    this.fill.setLeft(left);
                    this.fill.setWidth(width);
                }
            }
        }
    };
})();