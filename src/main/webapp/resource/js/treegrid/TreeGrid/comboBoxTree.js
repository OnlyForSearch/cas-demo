
Ext.ux.ComboBoxTree = function(){
	this.treeId = Ext.id()+'-tree';
	this.maxHeight = arguments[0].maxHeight || arguments[0].height || this.maxHeight;
	this.tpl = new Ext.Template('<tpl for="."><div style="height:'+this.maxHeight+'px"><div id="'+this.treeId+'"></div></div></tpl>');
	this.store = new Ext.data.SimpleStore({fields:[],data:[[]]});
	this.selectedClass = '';
	this.mode = 'local';
	this.triggerAction = 'all';
	this.onSelect = Ext.emptyFn;
	this.onBlur = Ext.emptyFn;
	this.editable = false;
	
	//all:所有结点都可选中
	//exceptRoot：除根结点，其它结点都可选
	//folder:只有目录（非叶子和非根结点）可选
	//leaf：只有叶子结点可选
	this.selectNodeModel = arguments[0].selectNodeModel || 'all';
	
	Ext.ux.ComboBoxTree.superclass.constructor.apply(this, arguments);
}

Ext.extend(Ext.ux.ComboBoxTree,Ext.form.ComboBox, {
	
	expand : function(){
		Ext.ux.ComboBoxTree.superclass.expand.call(this);
		if(!this.tree.rendered){
			this.tree.height = this.maxHeight;
			this.tree.border=false;
			this.tree.autoScroll=true;
	        if(this.tree.xtype){
				this.tree = Ext.ComponentMgr.create(this.tree, this.tree.xtype);
			}
			this.tree.render(this.treeId);
	        var combox = this;
	        this.tree.on('click',function(node){
	        	var isRoot = (node == combox.tree.getRootNode());
	        	var selModel = combox.selectNodeModel;
	        	var isLeaf = node.isLeaf();
	        	if(isRoot && selModel != 'all'){
	        		return;
	        	}else if(selModel=='folder' && isLeaf){
	        		return;
	        	}else if(selModel=='leaf' && !isLeaf){
	        		return;
	        	}
	        	combox.setValue(node);
	        	combox.collapse();
	        });
			var root = this.tree.getRootNode();
			if(!root.isLoaded())
				root.reload();
		}
    },
    
    /*
	setValue : function(node){
        var text = node.text;
        if(text==undefined)return;
        this.lastSelectionText = text;
        if(this.hiddenField){
            this.hiddenField.value = node.id;
        }
        Ext.form.ComboBox.superclass.setValue.call(this, text);
        this.value = node.id;
    },
    */
    setValue : function(node){
    	if(!node)return;
    	var text = node.text;
        if(text==undefined)return;
        this.lastSelectionText = text;
        if(this.hiddenField){
            this.hiddenField.value = node.id;
        }
        Ext.form.ComboBox.superclass.setValue.call(this, text);
        this.value = node.id;
    },
    setByValue : function(text,id){
    	Ext.form.ComboBox.superclass.setValue.call(this, {text:text,id:id});
    },
    delValue : function(node){
    	var text = node.text;
        if(text==undefined)return;
        var arr = this.lastSelectionText.split(",");
        var temp = [];
        for(var i=0;i<arr.length;i++){
        	if(arr[i] != text){
        		temp.push(arr[i]);
        	}
        }
        this.lastSelectionText = temp.join(",");
        arr = this.value.split(",");
    	temp = [];
    	for(var i=0;i<arr.length;i++){
    		if(arr[i] != node.id){
        		temp.push(arr[i]);
        	}
    	}
    	this.value = temp.join(",");
        if(this.hiddenField){
        	this.hiddenField.value = temp.join(",");
        }
        Ext.form.ComboBox.superclass.setValue.call(this, this.lastSelectionText);
    },
    
    getValue : function(){
    	return typeof this.value != 'undefined' ? this.value : '';
    }
});

Ext.reg('combotree', Ext.ux.ComboBoxTree);