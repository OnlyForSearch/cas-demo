
Ext.ns('Ext.ux.grid');  
/** 
 * 实现grid的rowspan效果 
 * 
 *  1.在列模型里需要配置合并行的列中设置rowspan属性，如：{dataIndex:'xxx', header:'xxx', rowspan:true}
 *  2.为grid设置view属性 => view : new Ext.ux.grid.RowspanView() 
 *  3.为grid设置cls属性 => cls : 'rowspan-grid' 
 *  4.加入css样式 
 */  
Ext.ux.grid.RowspanView = Ext.extend(Ext.grid.GridView, { 
	forceFit:true,
    constructor: function(conf) {  
        Ext.ux.grid.RowspanView.superclass.constructor.call(this, conf);  
    },  
    // private  
    cleanRenderer : function(column, value, previousValue, metaData, record, rowIndex, colIndex, store) {
    	if(column.rowspan && value==previousValue){
    		return '';
    	}
        return column.renderer(value, metaData, record, rowIndex, colIndex, store);  
    },  
    // private  
    doRender : function(cs, rs, ds, startRow, colCount, stripe){
        var ts = this.templates, ct = ts.cell, rt = ts.row, last = colCount-1;  
        var tstyle = 'width:'+this.getTotalWidth()+';';  
        // buffers  
        var buf = [], cb, c, p = {}, rp = {tstyle: tstyle}, r, previousRecord, previousValue, nextRecord, nextValue;
  
        var cmConfig = this.cm.config;
  
        for(var j = 0, len = rs.length; j < len; j++){
            r = rs[j]; cb = [];
            var rowIndex = (j+startRow);
        	nextRecord = (j != len-1) ? rs[j+1] : null;
            for(var i = 0; i < colCount; i++){
            	
                c = cs[i];
                p.id = c.id;
                p.css = i === 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '');  
                p.attr = p.cellAttr = "";  
                previousValue = previousRecord ? previousRecord.data[c.name] : null; 
                nextValue = nextRecord ? nextRecord.data[c.name] : null; 
                p.value = this.cleanRenderer(cmConfig[i], r.data[c.name], previousValue, p, r, rowIndex, i, ds);  
                p.style = c.style;  
                if(Ext.isEmpty(p.value)){  
                    p.value = "&nbsp;";  
                }  
                if(this.markDirty && r.dirty && typeof r.modified[c.name] !== 'undefined'){  
                    p.css += ' x-grid3-dirty-cell';  
                }
                //------------------------------------------------  
                if(cmConfig[i].rowspan){
                    if(j == (len-1) || r.data[c.name] != nextValue){  
                        p.css += ' rowspan-bottom';  
                    }else{
                        p.css += ' rowspan-unborder'; 
                    }  
                }  
                //------------------------------------------------  
                cb[cb.length] = ct.apply(p);  
            }
            var alt = [];  
            if(stripe && ((rowIndex+1) % 2 === 0)){
                alt[0] = "x-grid3-row-alt";  
            }  
            if(r.dirty){  
                alt[1] = " x-grid3-dirty-row";  
            }  
            rp.cols = colCount;  
            if(this.getRowClass){  
                alt[2] = this.getRowClass(r, rowIndex, rp, ds);  
            }  
            rp.alt = alt.join(" ");  
            rp.cells = cb.join("");  
            buf[buf.length] =  rt.apply(rp);  
            previousRecord = r;
        }  
        return buf.join("");  
    }  
});