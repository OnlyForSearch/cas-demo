/*
 * Ext JS Library 2.0 RC 1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.onReady(function(){
	Ext.BLANK_IMAGE_URL = '../extjs/resources/images/default/s.gif';
		
    var tree = new Ext.tree.ColumnTree({
        el:'tree-ct',
        width:700,
        autoHeight:true,
        rootVisible:false,
        autoScroll:true,
		expandable:false,
		enableDD:true,
        title: 'Menu Configuration',
        tbar: [{
				text:'Save Menu',
				tooltip: 'Save Menu',
				iconCls:'save-icon',
				listeners: {
					'click': function() {
						var json = tree.toJsonString(null,
							function(key, val) {
								return (key == 'leaf' || key == 'id' || key =='menu_item'|| key == 'menu_url');
							}, {
								menu_item: 'text',
								menu_url: 'href'
							}
						);
						alert(json);
					},
					scope:this
				}
			},{
				xtype:'tbseparator'
			},{
				text:'Add Folder Item',
				tooltip: 'Add Folder Item',
				iconCls:'folder-icon',
				listeners: {
					'click' : function(){
						var selectedItem = tree.getSelectionModel().getSelectedNode();
						if (!selectedItem) {
							selectedItem = tree.getRootNode(); 
						}
					
						handleCreate = function (btn, text, cBoxes){
							if(btn == 'ok' && text) {
								var newNode = new Ext.tree.TreeNode({
										menu_item: text,
										menu_url: '',
										leaf: false,
										expandable: true,
										uiProvider: Ext.tree.ColumnNodeUI
								});
								if(selectedItem.isLeaf()) {
									selectedItem.parentNode.insertBefore(newNode, selectedItem.nextSibling);
								} else {
									selectedItem.insertBefore(newNode, selectedItem.firstChild);
								}
							}
						}
						Ext.MessageBox.show({
							title:'Add new Folder Item',
							msg: 'Name of Folder Item:',
							buttons: Ext.MessageBox.OKCANCEL,
							prompt:true,
							fn: handleCreate
						});
					}
				}
			},{
				xtype:'tbseparator'
			},{
				text:'Add Page Item',
				tooltip: 'Add Page Item',
				iconCls:'page-icon',
				listeners: {
					'click' : function(){
						var selectedItem = tree.getSelectionModel().getSelectedNode();
						if (!selectedItem) {
							Ext.Msg.alert('Warning', 'Please select an Item after which you want to add a new one.');
							return false;
						}
					
						handleCreate = function (btn, text, cBoxes){
							if(btn == 'ok' && text) {
								var newNode = new Ext.tree.TreeNode({
										menu_item: text,
										menu_url: '',
										leaf: true,
										allowChildren:false,
										uiProvider: Ext.tree.ColumnNodeUI
								});
								if(selectedItem.isLeaf()) {
									selectedItem.parentNode.insertBefore(newNode, selectedItem.nextSibling);
								} else {
									selectedItem.insertBefore(newNode, selectedItem.firstChild);
								}
							}
						}
						Ext.MessageBox.show({
							title:'Add new Page Item',
							msg: 'Name of Page Item:',
							buttons: Ext.MessageBox.OKCANCEL,
							prompt:true,
							fn: handleCreate
						});
					}
				}
				
			},{
				xtype:'tbseparator'
			},{
				text:'Delete Item',
				tooltip: 'Delete Item',
				iconCls:'delete-icon',
				listeners: {
					'click' : function(){
						var selectedItem = tree.getSelectionModel().getSelectedNode();
						if (!selectedItem) {
							Ext.Msg.alert('Warning', 'Please select an Item to delete.');
							return false;
						}
					
						handleDelete = function (btn){
							if(btn == 'ok') {
								selectedItem.remove();
							}
						}
						Ext.MessageBox.show({
							title:'Confirm your action',
							msg: 'Are you sure you want to delete this item and its children?',
							buttons: Ext.MessageBox.OKCANCEL,
							fn: handleDelete
						});
					}
				}
			},{
				xtype:'tbseparator'
			}],
        columns:[{
            header:'Menu Item',
            width:300,
            dataIndex:'menu_item'
        },{
            header:'URL',
            width:398,
            dataIndex:'menu_url'
        }],

        loader: new Ext.tree.TreeLoader({
            preloadChildren:true,
            uiProviders:{
                'col': Ext.tree.ColumnNodeUI
            }
        }),
		
        root: new Ext.tree.AsyncTreeNode({
				allowChildren: true,
				children: [{
				  menu_item: "Current State",
				  menu_url: 'blah blah', 
				  uiProvider:'col',
				  children: [{
					  menu_item: "Executive Summary",
					  menu_url: 'blah blah', 
					  uiProvider:'col',
					  leaf:true
				  },{
					  menu_item: "Vulnerability Scorecard",
					  menu_url: 'blah blah',
					  uiProvider:'col',
					  leaf:true
				  },{
					  menu_item: "Vulnerability Distribution",
					  menu_url: 'blah blah',
					  uiProvider:'col',
					  leaf:true
				  }]
				},{
					
				  menu_item: "Trends",
				  menu_url: 'blah blah',
				  uiProvider:'col',
				  children: [{
					  menu_item: "Host Changes",
					  menu_url: 'blah blah',
					  uiProvider:'col',
					  leaf:true
				  },{
					  menu_item: "Hosts and Vulnerability",
					  menu_url: 'blah blah',
					  uiProvider:'col', 
					  leaf:true
				  },{
					  menu_item: "Application and Vulnerability",
					  menu_url: 'blah blah',
					  uiProvider:'col', 
					  leaf:true
				  },{
					  menu_item: "Vulnerability by Operation System",
					  menu_url: 'blah blah',
					  uiProvider:'col', 
					  leaf:true
				  },{
					  menu_item: "Vulnerability by Networks",
					  menu_url: 'blah blah',
					  uiProvider:'col', 
					  leaf:true
				  },{
					  menu_item: "Vulnerability by Application Group",
					  menu_url: 'blah blah',
					  uiProvider:'col', 
					  leaf:true
				  }]
				},{
					
				  menu_item: "Technical",
				  menu_url: 'blah blah',
				  uiProvider:'col', 
				  children: [{
					  menu_item: "Risk Matrix",
					  menu_url: 'blah blah',
					  uiProvider:'col', 
					  leaf:true
				  },{
					  menu_item: "Host Inventory",
					  menu_url: 'blah blah',
					  uiProvider:'col', 
					  leaf:true
				  },{
					  menu_item: "Application Inventory",
					  menu_url: 'blah blah',
					  uiProvider:'col', 
					  leaf:true
				  },{
					  menu_item: "Vulnerability Inventory",
					  menu_url: 'blah blah',
					  uiProvider:'col', 
					  leaf:true
				  },{
					  menu_item: "Most Common Vulnerabilites",
					  menu_url: 'blah blah',
					  uiProvider:'col', 
					  leaf:true
				  },{
					  menu_item: "Most Common SANS Vulnerabilities",
					  menu_url: 'blah blah',
					  uiProvider:'col', 
					  leaf:true
				  },{
					  menu_item: "Most Vulnerable Applications",
					  menu_url: 'blah blah',
					  uiProvider:'col', 
					  leaf:true
				  },{
					  menu_item: "Most Vulnerable Hosts",
					  menu_url: 'blah blah',
					  uiProvider:'col', 
					  leaf:true
				  },{
					  menu_item: "PCI Compliance",
					  menu_url: 'blah blah',
					  uiProvider:'col', 
					  leaf:true
				  }]
				}]
			})
    });
    tree.render();
	tree.expandAll();
	/**
	 //加上一下一段就可以编辑
	 var te = new Ext.tree.ColumnTreeEditor(tree,{
                completeOnEnter: true,
                autosize: true,
                ignoreNoChange: true
            });
*/

});