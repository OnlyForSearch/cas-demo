var ImageChooser = function(config){
	this.config = config;
}
ImageChooser.prototype = {
    lookup : {},
	show : function(el, callback, extern){
		if(!this.win){
			this.initTemplates();
			this.store = new Ext.data.JsonStore({
			    url: this.config.url,
			    root: 'items',
			    fields: ['name', 'url', {name:'size', type: 'float'}, 'lastmod'],
			    listeners: {
			    	'load': {fn:function(){ this.view.select(0); }, scope:this, single:true}
			    }
			});
			this.store.load();
			var formatSize = function(data){
		        if(data.size < 1024) {
		            return data.size + " bytes";
		        } else {
		            return (Math.round(((data.size*10) / 1024))/10) + " KB";
		        }
		    };
			var formatData = function(data){
		    	data.shortName = data.name.ellipse(15);
		    	data.sizeString = formatSize(data);
		    	data.dateString = data.lastmod;
		    	this.lookup[data.name] = data;
		    	return data;
		    };
		    this.view = new Ext.DataView({
				tpl: this.thumbTemplate,
				singleSelect: true,
				overClass:'x-view-over',
				itemSelector: 'div.thumb-wrap',
				emptyText : '<div style="padding:10px;">没有匹配的文件...</div>',
				store: this.store,
				listeners: {
					'selectionchange': {fn:this.showDetails, scope:this, buffer:100},
					'dblclick'       : {fn:this.doCallback, scope:this},
					'loadexception'  : {fn:this.onLoadException, scope:this},
					'beforeselect'   : {fn:function(view){
				           return view.store.getRange().length > 0;
				    }}
				},
				prepareData: formatData.createDelegate(this)
			});
			var cfg = {
		    	title: '自定义节点图标',
		    	id: 'img-chooser-dlg',
		    	layout: 'border',
				minWidth: 500,
				minHeight: 300,
				modal: true,
				closeAction: 'hide',
				border: false,
				items:[{
					id: 'img-chooser-view',
					region: 'center',
					autoScroll: true,
					items: this.view,
                    tbar:[{
                    	text: '搜索:'
                    },{
                    	xtype: 'textfield',
                    	id: 'filter',
                    	selectOnFocus: true,
                    	width: 200,
                    	listeners: {
                    		'render': {fn:function(){
						    	Ext.getCmp('filter').getEl().on('keyup', function(){ this.filter(); }, this, {buffer:500});
                    		}, scope:this}
                    	}
                    }, ' ', '-', {
                    	text: '排序:'
                    }, {
                    	id: 'sortSelect',
                    	xtype: 'combo',
				        typeAhead: true,
				        triggerAction: 'all',
				        width: 100,
				        editable: false,
				        mode: 'local',
				        displayField: 'desc',
				        valueField: 'name',
				        lazyInit: false,
				        value: 'name',
				        store: new Ext.data.ArrayStore({
					        fields: ['name', 'desc'],
					        data : [['name', '文件名'],['size', '文件大小'],['lastmod', '最后修改时间']]
					    }),
					    listeners: {
							'select': {fn:this.sortImages, scope:this}
					    }
				    }]
				},{
					id: 'img-detail-panel',
					region: 'east',
					split: true,
					width: 150,
					minWidth: 150,
					maxWidth: 250
				}],
				buttons: [{
					id: 'ok-btn',
					text: '确定',
					handler: this.doCallback,
					scope: this
				},{
					text: '取消',
					handler: function(){ this.win.hide(); },
					scope: this
				}],
				keys: {
					key: 27, // Esc key
					handler: function(){ this.win.hide(); },
					scope: this
				}
			};
			Ext.apply(cfg, this.config);
		    this.win = new Ext.Window(cfg);
		}
		this.reset();
	    this.win.show(el);
		this.callback = callback;
		this.extern = extern;
		this.animateTarget = el;
	},
	initTemplates : function(){
		this.thumbTemplate = new Ext.XTemplate(
			'<tpl for=".">',
				'<div class="thumb-wrap" id="{name}">',
				'<div class="thumb"><img src="{url}" title="{name}"></div>',
				'<span>{shortName}</span></div>',
			'</tpl>'
		);
		this.thumbTemplate.compile();
		this.detailsTemplate = new Ext.XTemplate(
			'<div class="details">',
				'<tpl for=".">',
					'<img src="{url}"><div class="details-info">',
					'<b>文件名:</b>',
					'<span>{name}</span>',
					'<b>大小:</b>',
					'<span>{sizeString}</span>',
					'<b>最后修改时间:</b>',
					'<span>{dateString}</span></div>',
				'</tpl>',
			'</div>'
		);
		this.detailsTemplate.compile();
	},
	showDetails : function(){
	    var selNode = this.view.getSelectedNodes();
	    var detailEl = Ext.getCmp('img-detail-panel').body;
		if(selNode && selNode.length > 0){
			selNode = selNode[0];
			Ext.getCmp('ok-btn').enable();
		    var data = this.lookup[selNode.id];
            detailEl.hide();
            this.detailsTemplate.overwrite(detailEl, data);
            detailEl.slideIn('l', {stopFx:true,duration:.2});
		}else{
		    Ext.getCmp('ok-btn').disable();
		    detailEl.update('');
		}
	},
	filter : function(){
		var filter = Ext.getCmp('filter');
		this.view.store.filter('name', filter.getValue());
		this.view.select(0);
	},
	sortImages : function(){
		var v = Ext.getCmp('sortSelect').getValue();
    	this.view.store.sort(v, v == 'name' ? 'asc' : 'desc');
    	this.view.select(0);
    },
	reset : function(){
		if(this.win.rendered){
			Ext.getCmp('filter').reset();
			this.view.getEl().dom.scrollTop = 0;
		}
	    this.view.store.clearFilter();
		this.view.select(0);
	},
	doCallback : function(){
        var selNode = this.view.getSelectedNodes()[0];
		var callback = this.callback;
		var lookup = this.lookup;
		var extern = this.extern;
		this.win.hide(this.animateTarget, function(){
            if(selNode && callback){
				var data = lookup[selNode.id];
				callback(data, extern);
			}
		});
    },
	onLoadException : function(v,o){
	    this.view.getEl().update('<div style="padding:10px;">Error loading images.</div>');
	}
};
String.prototype.ellipse = function(maxLength){
    if(this.length > maxLength){
        return this.substr(0, maxLength-3) + '...';
    }
    return this;
};