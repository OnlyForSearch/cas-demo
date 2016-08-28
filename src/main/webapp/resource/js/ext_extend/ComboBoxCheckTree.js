Ext.ux.ComboBoxCheckTree = function() {
	this.treeId = Ext.id() + '-tree';
	this.maxHeight = arguments[0].maxHeight || arguments[0].height || this.maxHeight;
	this.tpl = new Ext.Template('<tpl for="."><div style="height:' + this.maxHeight + 'px"><div id="' + this.treeId + '"></div></div></tpl>');
	this.store = new Ext.data.SimpleStore({fields:[], data:[[]]});
	this.selectedClass = '';
	this.mode = 'local';
	this.triggerAction = 'all';
	this.onSelect = Ext.emptyFn;
	this.beforeBlur = Ext.emptyFn;
	this.editable = false;
	this.selectValueModel = 'leaf';
	this.translator = arguments[0].translator; //value翻译器
	this.valuetype = arguments[0].valuetype; //value的取值方式. value-取自node.attributes.value, id--取自node.id
	Ext.ux.ComboBoxCheckTree.superclass.constructor.apply(this, arguments);
}

Ext.extend(Ext.ux.ComboBoxCheckTree, Ext.form.ComboBox, {
	checkField : 'checked',
	separator : ',',
	initEvents : function() {
		Ext.ux.ComboBoxCheckTree.superclass.initEvents.apply(this, arguments);
		this.keyNav.tab = false;
	},
	initComponent : function() {
		this.on({scope : this});
	},
	expand : function() {
		Ext.ux.ComboBoxCheckTree.superclass.expand.call(this);
		if (!this.tree.rendered) {
			this.tree.height = this.maxHeight;
			this.tree.border = false;
			this.tree.autoScroll = true;
			if (this.tree.xtype) {
				this.tree = Ext.ComponentMgr.create(this.tree, this.tree.xtype);
			}
			this.tree.render(this.treeId);
			var combox = this;
			this.tree.on('check', function(node, checked) {combox.setValue();});
			var root = this.tree.getRootNode();
			if (!root.isLoaded()) root.reload();
		}
	},
	setValue : function(v) {
		if(!v) {
		   var values = [];
		   var texts = [];
		   var root = this.tree.getRootNode();
		   var checkedNodes = this.tree.getChecked();
		   for (var i = 0; i < checkedNodes.length; i++) {
			    var node = checkedNodes[i];
			    if (this.selectValueModel == 'all'
					|| (this.selectValueModel == 'leaf' && node.isLeaf())
					|| (this.selectValueModel == 'folder' && !node.isLeaf())) {
				  if(this.valuetype=='value'){ 
				      values.push(node.attributes.value);
				  }else if(this.valuetype=='id'){
				  	  values.push(node.id);
				  }
				  texts.push(node.text);
			    }
		   }
		   this.value = values.join(this.separator);
		   this.setRawValue(texts.join(this.separator));
		}else {
		   this.value = v;
		   if(this.translator && typeof this.translator == "function") {
              this.setRawValue(this.translator(v));		   	
		   }else {
		   	  this.setRawValue(v);
		   }
		   if (this.tree.rendered) {
		       var root = this.tree.getRootNode();
		       var checkedNodes = this.tree.getChecked();
		       for (var i = 0; i < checkedNodes.length; i++) {
			        var node = checkedNodes[i];
			        node.getUI().checkbox.checked = false;
				    node.attributes.checked = false;	    
		       }
		       var ids = v.split(',');
		       var findNodeByValue = function(node, value) {
		              var a = node.attributes;
		              if(a.value==value) return node;
		              if(!a.leaf) {
			             var cs = node.childNodes;
			             var _node;
			             for(var i = 0; i < cs.length; i++) {
			             	_node = findNodeByValue(cs[i], value);
			             	if(_node) return _node;
			             }
			          }
			          return null;
		       }
               if(this.valuetype=='value'){ 
			       var i = ids.length;
			       while(i--) {
			       	   var node = findNodeByValue(root, ids[i]);
			           if(node) {
			           	  node.getUI().checkbox.checked = true;
			           	  node.attributes.checked = true;
			           }
			       }
			   }else if(this.valuetype=='id'){
			       var i = ids.length;
			       while(i--) {
			           var node = this.tree.getNodeById(ids[i]);
			           if(node) {
			           	  node.getUI().checkbox.checked = true;
			           	  node.attributes.checked = true;
			           }
			       }			  	  
			   }    
		   }
		}
		if (this.hiddenField) {
			this.hiddenField.value = this.value;
		}
	},
	getValue : function() {
		return this.value || '';
	},
	clearValue : function() {
		this.value = '';
		this.setRawValue(this.value);
		if (this.hiddenField) {
			this.hiddenField.value = '';
		}
	    var checkedNodes = this.tree.getChecked();
	    var i = checkedNodes.length;
	    while(i--) {
		   var node = checkedNodes[i];
		   node.getUI().checkbox.checked = false;
		   node.attributes.checked = false;	    	       	
	    }
		this.tree.getSelectionModel().clearSelections();
	}
});
Ext.reg('combochecktree', Ext.ux.ComboBoxCheckTree);