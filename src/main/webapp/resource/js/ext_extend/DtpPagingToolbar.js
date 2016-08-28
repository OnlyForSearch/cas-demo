Ext.DtpPagingToolbar = Ext.extend(Ext.Toolbar, {

	pageSize : 20,

	displayMsg : 'Displaying {0} - {1} of {2}',

	emptyMsg : 'No data to display',

	beforePageText : "Page",

	afterPageText : "of {0}",

	firstText : "First Page",

	prevText : "Previous Page",

	nextText : "Next Page",

	lastText : "Last Page",

	refreshText : "Refresh",

	addRecordText : "",

	addRecordWindowId : "",

	delRecordText : "",

	delRecordGridPanelId : "",

	delRecordRequestUrl : "",

	paramNames : {
		start : 'start',
		limit : 'limit'
	},

	// private
	initComponent : function() {
		this.addEvents('change', 'beforechange');
		Ext.DtpPagingToolbar.superclass.initComponent.call(this);
		this.cursor = 0;
		this.bind(this.store);
	},

	// private
	onRender : function(ct, position) {
		Ext.DtpPagingToolbar.superclass.onRender.call(this, ct, position);

		this.first = this.addButton({
					tooltip : this.firstText,
					iconCls : "x-tbar-page-first",
					disabled : true,
					handler : this.onClick.createDelegate(this, ["first"])
				});
		this.prev = this.addButton({
					tooltip : this.prevText,
					iconCls : "x-tbar-page-prev",
					disabled : true,
					handler : this.onClick.createDelegate(this, ["prev"])
				});
		this.addSeparator();
		this.add(this.beforePageText);
		this.field = Ext.get(this.addDom({
					tag : "input",
					type : "text",
					size : "3",
					value : "1",
					cls : "x-tbar-page-number"
				}).el);
		this.field.on("keydown", this.onPagingKeydown, this);
		this.field.on("focus", function() {
					this.dom.select();
				});
		this.field.on("blur", this.onPagingBlur, this);
		this.afterTextEl = this.addText(String.format(this.afterPageText, 1));
		this.field.setHeight(18);
		this.addSeparator();
		this.next = this.addButton({
					tooltip : this.nextText,
					iconCls : "x-tbar-page-next",
					disabled : true,
					handler : this.onClick.createDelegate(this, ["next"])
				});
		this.last = this.addButton({
					tooltip : this.lastText,
					iconCls : "x-tbar-page-last",
					disabled : true,
					handler : this.onClick.createDelegate(this, ["last"])
				});
		this.addSeparator();
		this.addRecord = this.addButton({
					tooltip : this.addRecordText,
					iconCls : "x-tbar-page-addRecord",
					disabled : true,
					handler : this.onClick.createDelegate(this, ["addRecord"])
				});
		this.delRecord = this.addButton({
					tooltip : this.delRecordText,
					iconCls : "x-tbar-page-delRecord",
					disabled : true,
					handler : this.onClick.createDelegate(this, ["delRecord"])
				});
		this.addRecord.enable();
		this.delRecord.enable();
		this.addSeparator();
		this.loading = this.addButton({
					tooltip : this.refreshText,
					iconCls : "x-tbar-loading",
					handler : this.onClick.createDelegate(this, ["refresh"])
				});

		if (this.displayInfo) {
			this.displayEl = Ext.fly(this.el.dom).createChild({
						cls : 'x-paging-info'
					});
		}
		if (this.dsLoaded) {
			this.onLoad.apply(this, this.dsLoaded);
		}
	},

	// private
	updateInfo : function() {
		if (this.displayEl) {
			var count = this.store.getCount();
			var msg = count == 0 ? this.emptyMsg : String.format(
					this.displayMsg, this.cursor + 1, this.cursor + count,
					this.store.getTotalCount());
			this.displayEl.update(msg);
		}
	},

	// private
	onLoad : function(store, r, o) {
		if (!this.rendered) {
			this.dsLoaded = [store, r, o];
			return;
		}
		this.cursor = o.params ? o.params[this.paramNames.start] : 0;
		var d = this.getPageData(), ap = d.activePage, ps = d.pages;

		this.afterTextEl.el.innerHTML = String.format(this.afterPageText,
				d.pages);
		this.field.dom.value = ap;
		this.first.setDisabled(ap == 1);
		this.prev.setDisabled(ap == 1);
		this.next.setDisabled(ap == ps);
		this.last.setDisabled(ap == ps);
		this.loading.enable();
		this.updateInfo();
		this.fireEvent('change', this, d);
	},

	// private
	getPageData : function() {
		var total = this.store.getTotalCount();
		return {
			total : total,
			activePage : Math.ceil((this.cursor + this.pageSize)
					/ this.pageSize),
			pages : total < this.pageSize ? 1 : Math
					.ceil(total / this.pageSize)
		};
	},

	// private
	onLoadError : function() {
		if (!this.rendered) {
			return;
		}
		this.loading.enable();
	},

	// private
	readPage : function(d) {
		var v = this.field.dom.value, pageNum;
		if (!v || isNaN(pageNum = parseInt(v, 10))) {
			this.field.dom.value = d.activePage;
			return false;
		}
		return pageNum;
	},

	// private
	onPagingBlur : function(e) {
		this.field.dom.value = this.getPageData().activePage;
	},

	// private
	onPagingKeydown : function(e) {
		var k = e.getKey(), d = this.getPageData(), pageNum;
		if (k == e.RETURN) {
			e.stopEvent();
			pageNum = this.readPage(d);
			if (pageNum !== false) {
				pageNum = Math.min(Math.max(1, pageNum), d.pages) - 1;
				this.doLoad(pageNum * this.pageSize);
			}
		} else if (k == e.HOME || k == e.END) {
			e.stopEvent();
			pageNum = k == e.HOME ? 1 : d.pages;
			this.field.dom.value = pageNum;
		} else if (k == e.UP || k == e.PAGEUP || k == e.DOWN || k == e.PAGEDOWN) {
			e.stopEvent();
			if (pageNum = this.readPage(d)) {
				var increment = e.shiftKey ? 10 : 1;
				if (k == e.DOWN || k == e.PAGEDOWN) {
					increment *= -1;
				}
				pageNum += increment;
				if (pageNum >= 1 & pageNum <= d.pages) {
					this.field.dom.value = pageNum;
				}
			}
		}
	},

	// private
	beforeLoad : function() {
		if (this.rendered && this.loading) {
			this.loading.disable();
		}
	},

	// private
	doLoad : function(start) {
		var o = {}, pn = this.paramNames;
		o[pn.start] = start;
		o[pn.limit] = this.pageSize;
		if (this.fireEvent('beforechange', this, o) !== false) {
			this.store.load({
						params : o
					});
		}
	},

	/**
	 * Change the active page
	 * 
	 * @param {Integer}
	 *            page The page to display
	 */
	changePage : function(page) {
		this.doLoad(((page - 1) * this.pageSize).constrain(0, this.store
						.getTotalCount()));
	},

	// private
	onClick : function(which) {
		var store = this.store;
		switch (which) {
			case "first" :
				this.doLoad(0);
				break;
			case "prev" :
				this.doLoad(Math.max(0, this.cursor - this.pageSize));
				break;
			case "next" :
				this.doLoad(this.cursor + this.pageSize);
				break;
			case "last" :
				var total = store.getTotalCount();
				var extra = total % this.pageSize;
				var lastStart = extra ? (total - extra) : total - this.pageSize;
				this.doLoad(lastStart);
				break;
			case "refresh" :
				this.doLoad(this.cursor);
				break;
			case "addRecord" :
				Ext.getCmp(this.addRecordWindowId).show();
				break;
			case "delRecord" :
				var delRequestUrl = this.delRecordRequestUrl;
				var panel = Ext.getCmp(this.delRecordGridPanelId);
				var recs = panel.getSelectionModel().getSelections();
				if (recs.length == 0) {
					Ext.Msg.show({
								title : '提示',
								msg : '请先选择需要删除的记录',
								buttons : Ext.Msg.OK,
								icon : Ext.Msg.INFO
							});
					return false;
				}
				Ext.MessageBox.confirm("提示", "是否确定删除选中的数据？", function(btnId) {
							if (btnId == 'yes') {
								var ids = new Array();
								for (var i = 0; i < recs.length; i++) {
									ids.push(recs[i].get('ID'));
								}
								var msgTip = Ext.MessageBox.show({
											title : '提示',
											width : 250,
											msg : '正在操作请稍后......'
										});
								Ext.Ajax.request({
											url : delRequestUrl,
											params : {
												ids : ids.join(',')
											},
											method : 'POST',
											success : function(response,
													options) {
												msgTip.hide();
												var result = Ext.util.JSON
														.decode(response.responseText);
												if (result.msg) {
													Ext.Msg.show({
																title : '错误',
																msg : '操作失败,'
																		+ result.msg,
																buttons : Ext.Msg.OK,
																icon : Ext.Msg.ERROR
															});													
												} else {
													Ext.Msg.show({
																title : '提示',
																msg : '操作成功',
																buttons : Ext.Msg.OK,
																icon : Ext.Msg.INFO
															});
													panel.getStore().load();
												}
											},
											failure : function(response,
													options) {
												msgTip.hide();
												Ext.Msg.alert('提示', '请求服务器失败！');
											}
										});
							}
						});
				break;
		}
	},

	/**
	 * Unbinds the paging toolbar from the specified {@link Ext.data.Store}
	 * 
	 * @param {Ext.data.Store}
	 *            store The data store to unbind
	 */
	unbind : function(store) {
		store = Ext.StoreMgr.lookup(store);
		store.un("beforeload", this.beforeLoad, this);
		store.un("load", this.onLoad, this);
		store.un("loadexception", this.onLoadError, this);
		this.store = undefined;
	},

	/**
	 * Binds the paging toolbar to the specified {@link Ext.data.Store}
	 * 
	 * @param {Ext.data.Store}
	 *            store The data store to bind
	 */
	bind : function(store) {
		store = Ext.StoreMgr.lookup(store);
		store.on("beforeload", this.beforeLoad, this);
		store.on("load", this.onLoad, this);
		store.on("loadexception", this.onLoadError, this);
		this.store = store;
	},

	// private
	onDestroy : function() {
		if (this.store) {
			this.unbind(this.store);
		}
		Ext.DtpPagingToolbar.superclass.onDestroy.call(this);
	}
});