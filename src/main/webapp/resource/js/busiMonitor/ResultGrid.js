var busiMonitorResultGridJSDefaultLang = {
	sortAscText : '正序',
	sortDescText : '逆序',
	lockText : '锁列',
	unlockText : '解锁列',
	columnsText : '列',
	details : '详细信息',
	linkageError : '控件联动出错',
	error : '错误',
	requestFail : '请求失败!',
	prevCycle : '上一期',
	nextCycle : '下一期',
	joinText : '&nbsp;到&nbsp;',
	dayCycle : '按日',
	weekCycle : '按周',
	monthCycle : '按月',
	halfyearCycle : '按半年',
	yearCycle : '按年',
	custCycle : '自定义',
	prevMonth : '前一月',
	nextMonth : '后一月',
	displayMsg : '显示记录 {0} - {1} of {2}',
	emptyMsg : '无记录',
	prevDay : '前一天',
	nextDay : '后一天',
	nullOption : '-无-',
	selectall : '选择全部',
	searchParam : '查询参数',
	search : '查询',
	cancle : '取消',
	greaterThan : '大于',
	equivalentTo : '等于',
	lessThan : '小于',
	like : '模糊',
	value : '值',
	filter : '过滤',
	recordUnit : '条',
	displayRecords : '显示条数：'
};
//获取语言资源
function getBusiMonitorResultGridJSLan(code)
{
	if(typeof(ItmLang) == 'undefined' || typeof(ItmLang.widgets) == 'undefined')
	{
		return eval('busiMonitorResultGridJSDefaultLang.' + code);
	}
	else
	{
		 return eval('ItmLang.widgets.busiMonitorResultGridJS.' + code);
	}
}

Ext.BLANK_IMAGE_URL = '../../resource/js/ext/resources/images/default/s.gif';
$import("../ext_extend/LovCombo/Ext.ux.form.LovCombo.js", "ResultGrid.js");
$import("../ext_extend/Ext.ux.form.DateTime.js", "ResultGrid.js");
$import("../ext_extend/MonthPicker3.0.js", "ResultGrid.js");
if (Ext.grid.GridView) {
	Ext.apply(Ext.grid.GridView.prototype, {
				sortAscText : getBusiMonitorResultGridJSLan('sortAscText'),
				sortDescText : getBusiMonitorResultGridJSLan('sortDescText'),
				lockText : getBusiMonitorResultGridJSLan('lockText'),
				unlockText : getBusiMonitorResultGridJSLan('unlockText'),
				columnsText : getBusiMonitorResultGridJSLan('columnsText')
			});
}

Ext.data.CombinChartPanel = Ext.extend(Ext.Panel, {
	layout : 'form',
	border : true,
	initComponent : function(){
		this.loadPanelCfg();
		Ext.data.CombinChartPanel.superclass.initComponent.call(this);
	},
	initEvents : function()
	{
		Ext.data.CombinChartPanel.superclass.initEvents.call(this);
	},
	onRender : function(ct, position){
		var vHeight = this.height / this.panelCfg.length;
		for(var i = 0; i < this.panelCfg.length; i++)
		{
			var oGetValueCfg = this.panelCfg[i].selectSingleNode("GET_VALUE_CFG_ID");
			var oType = this.panelCfg[i].selectSingleNode("TYPE");
			if(oGetValueCfg != null && oType != null)
			{
				var oItem = this.getItemByType(oType.text,oGetValueCfg.text,vHeight);
				this.add(oItem);
			}
			else
			{
				this.add(new Ext.Panel({
					height : vHeights,
					border : false
				}));
			}
		}
		Ext.data.CombinChartPanel.superclass.onRender.call(this, ct, position);
	},
	loadPanelCfg : function(){
		var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
		var sendParams = ["method=getCombinPanelItem", "result=" + this.result];
		var sendUrl = getSendUrl("/servlet/chart.do?", sendParams);
		sendRequest.open("post", sendUrl, false);
		sendRequest.send();
		if (isSuccess(sendRequest))
		{
			this.panelCfg = sendRequest.responseXML.selectNodes("/root/rowSet");
		}
	},
	getItemByType : function(type,vResult,vHeight){
		if(type.toLowerCase() == "grid")
		{
			return new Ext.data.ResultGrid({
							result : vResult,
							height : vHeight,
							border : false
						});
		}
		else if(type.toLowerCase() == "chart")
		{
			return new FusionChart({
						result : vResult,
						height : vHeight,
						border : false
					});
		}
		else
		{
			return new Ext.Panel({
						height : vHeight,
						border : false
					});	
		}
	},
	search : function(o, arg){
		this.items.each(function(item){
			item.search(o,arg);
		});
	}
});

var gridViewRows = -1;
function setRowColor() {
	var grid = this;
	var rows = grid.getView().getRows();
	var color = grid.rowColor;
	var exp = grid.rowExp;
	var rowRefer = grid.rowRefer;

	if (rows.length == gridViewRows) {
		Ext.each(rows, function(row, idx) {
					var flag = true;
					if (rowRefer && exp) {
						var tmpexp = exp;
						var d = grid.store.data.items[idx].get(rowRefer);
						tmpexp = tmpexp.replace(rowRefer, d);
						flag = eval(d + tmpexp);
					}

					if (flag && color)
						row.style.backgroundColor = color;
				});
	} else {
		gridViewRows = rows.length;
		setRowColor.defer(100, this);
	}
}

function setColumnColor(v, f, exp, color, link, tip) {
	var rv = new Ext.Template('<div {qtip} style="{cursor} {color}" {link}>{value}</div>');
	var c = {
		value : v
	};
	if (tip)
		Ext.apply(c, {
					qtip : "ext:qtip='<div style=\"font-size:10pt;padding:3;\">"
							+ v + "</div>' ext:qtitle='" + getBusiMonitorResultGridJSLan('details') + "：'"
				});
	if (color && exp) {
		var vexp = exp.replace(f.dataIndex, v);
		if (eval(vexp)) {
			Ext.apply(c, {
						color : "color:" + color + ";"
					});
		}
	}

	if (link) {
		Ext.apply(c, {
					cursor : "cursor:hand;",
					link : "onclick=\"window.open(\'" + link + "\')\""
				});
		Ext.apply(c, {
					value : "<span style=\"border-bottom:1px solid " + color
							+ ";\">" + v + "</span>"
				});
	}

	return rv.apply(c);
}

function compSelectChange() {
	if (this.linkId) {
		var linkComp = Ext.getCmp(this.linkId);
		linkComp.clearValue();
		var store = new Array();
		var spath = "/servlet/commonservlet?tag=7&linkCompId=" + linkComp.name
				+ "&parentid=" + this.getValue();
		Ext.Ajax.request({
					url : spath,
					headers : {
						'contentType' : 'text/xml'
					},
					method : 'POST',
					success : function(response, options) {
						errElement = getErrorCode(response);
						if (errElement) {
							if (errElement.text == 0) {
								xmlDoc = response.responseXML;
								var nodeList = xmlDoc
										.selectNodes("/root/rowSet");
								for (var i = 0; i < nodeList.length; i++) {
									var value = nodeList[i].childNodes[0].text;
									var text = nodeList[i].childNodes[1].text;
									store[i] = [value, text];
								}
								linkComp.store.loadData(store);
							} else {
								Ext.Msg.show({
											title : getBusiMonitorResultGridJSLan('linkageError'),
											msg : errElement.nextSibling.text,
											buttons : Ext.Msg.OK,
											icon : Ext.Msg.ERROR
										});
							}
						}
					},
					failure : function(response, options) {
						Ext.Msg.show({
									title : getBusiMonitorResultGridJSLan('error'),
									msg : getBusiMonitorResultGridJSLan('requestFail'),
									buttons : Ext.Msg.OK,
									icon : Ext.Msg.ERROR
								});
					}
				});

	}
}
(function() {
	var plugins = {
		treebyvaluecfg : function(comp, oParam) {
			var result = comp.result;
			result.oParam = oParam;
			result.async = false;
			result.method = "getTreeXml";
			result.onLoad = function(oXml) {
				Ext.apply(comp, {
							xtype : "treefield",
							xmlDom : oXml
						})
			}
			result.send(Result.FORCE_GET, oParam);
			return comp;
		},
		existfield : function(comp, oParam) {
			return null;
		},
		checktreebyvaluecfg : function(comp, oParam) {
			var result = comp.result;
			result.oParam = oParam;
			result.async = false;
			result.method = "getTreeXml";
			result.onLoad = function(oXml) {
				Ext.apply(comp, {
							xtype : "treefield",
							xmlDom : oXml,
							isCheck : true
						})
			}
			result.send(Result.FORCE_GET, oParam);
			return comp;
		}
	};
	Ext.apply(ResultCompUtils, {
				createExtComp : function(comp, oParam) {
					var plugin = plugins[comp.xtype];
					if (plugin) {
						comp = plugin(comp, oParam);
					}
					return (comp) ? Ext.ComponentMgr.create(comp) : comp;
				}
			});
})();

Ext.form.CycleField = Ext.extend(Ext.BoxComponent, {
	format : 'Y-m-d',
	fieldClass : "x-form-field",
	defaultAutoCreate : {
		tag : "span",
		style : "border:0;width:80px;font-size:12px;text-align:center;padding-left:2px;padding-right:2px;"
	},
	beginValue : '',
	endValue : '',
	sysCurTime : '',
	CYCLE_TYPE : {
		DAY : 'DAY',
		WEEK : "WEEK",
		MONTH : "MONTH",
		HALFYEAR:"HALFYEAR",
		YEAR:"YEAR"
	},
	showCycle : {
		DAY : true,
		WEEK : true,
		MONTH : true,
		HALFYEAR: true,
		YEAR: true,
		CUST: false
	},
	curCycle : 'DAY',
	nameid : '',
	prevText : getBusiMonitorResultGridJSLan('prevCycle'),
	nextText : getBusiMonitorResultGridJSLan('nextCycle'),
	joinText : getBusiMonitorResultGridJSLan('joinText'),

	initComponent : function() {
		Ext.form.CycleField.superclass.initComponent.call(this);
		this.nameid = Ext.id();
		this.sysCurTime = getCurServerDate();

		if (this.HIDDEN) {
			for (var i = 0; i < this.HIDDEN.length; i++) {
				this.showCycle[this.HIDDEN[i]] = false;
			}
		}

		if (this.SHOW) {
			for (var i = 0; i < this.SHOW.length; i++) {
				this.showCycle[this.SHOW[i]] = true;
			}
		}

		var dateConfig = Ext.apply({}, {
			style:'margin-bottom:2px;margin-top:0px;',
			format : this.format,
			width : 100,
			selectOnFocus : this.selectOnFocus,
			validator : this.dateValidator,
			listeners : {
				change : {
					scope: this,
					fn: this.onCustChange	
				}
			}
		}, this.dateConfig);

		this.beginDf = new Ext.form.DateField(dateConfig);
		   
		this.beginDf.ownerCt = this;
		this.relayEvents(this.beginDf, ['focus', 'specialkey', 'invalid', 'valid']);

		this.endDf = new Ext.form.DateField(dateConfig);
		this.endDf.ownerCt = this;
		this.relayEvents(this.endDf, ['focus', 'specialkey', 'invalid', 'valid']);

		this.actions.init(this);
	},
	onCustChange: function() {
		var s = this.beginDf.getValue().format(this.format);
		var e = this.endDf.getValue().format(this.format);
		this.setValue(s + '/' + e);
	},
	onRender : function(ct, position) {
		Ext.form.CycleField.superclass.onRender.call(this, ct, position);
		var oCycle = this;
		var cfg = this.getAutoCreate();
		var overCls = "'x-btn x-btn-text-icon x-btn-over'";
		var outCls = "'x-btn x-btn-text-icon'";
		var btnTpl = new Ext.Template('<table cellspacing="0" class="x-btn x-btn-text-icon" onmousemove="javascript:this.className='
				+ overCls
				+ ';" onmouseout="javascript:this.className='
				+ outCls
				+ ';" width="100%">'
				+ '<tbody class="x-btn-small x-btn-icon-small-left">'
				+ '<tr><td class="x-btn-tl"><i>&nbsp;</i></td><td class="x-btn-tc"></td><td class="x-btn-tr"><i>&nbsp;</i></td></tr>'
				+ '<tr><td class="x-btn-ml"><i>&nbsp;</i></td><td class="x-btn-mc"><em unselectable="on" class=""><button type="button" class="x-btn-text {iconCls}">{text}</button></em></td><td class="x-btn-mr"><i>&nbsp;</i></td></tr>'
				+ '<tr><td class="x-btn-bl"><i>&nbsp;</i></td><td class="x-btn-bc"></td><td class="x-btn-br"><i>&nbsp;</i></td></tr>'
				+ '</tbody>' + '</table>');


		var cycleT = ct.createChild({
			cls : "x-toolbar-cell",
			style : "float: left;"
		});

		this.prevBtn = cycleT.createChild({
					cls : "x-toolbar-cell",
					style : /*@cc_on!@*/true ? "width:70px;float:left;" :"width:50px;display:inline;padding-right:2px;"
				});
		var prevBtnCfg = {
			text : this.prevText,
			iconCls : "icon-prev1"
		};
		btnTpl.overwrite(this.prevBtn, prevBtnCfg);
		Ext.EventManager.addListener(this.prevBtn, 'click', function() {
					oCycle.prevCycle();
				});

		var el = cycleT.createChild(cfg);
		el.wrap({
			cls: 'x-toolbar-cell',
			style : /*@cc_on!@*/true ? "width:70px;display:block;float:left;" :"display: inline;"
		});
		el.addClass('x-form-text');
		el.dom.readOnly = true;
		el.addClass([this.fieldClass, this.cls]);
		this.displayEl = el;

		this.nextBtn = cycleT.createChild({
					cls : "x-toolbar-cell",
					style : /*@cc_on!@*/true ? "width:70px;float:left;" :"width:50px;display:inline;padding-right:2px;"
				});
		var nextBtnCfg = {
			text : this.nextText,
			iconCls : "icon-next1"
		};
		btnTpl.overwrite(this.nextBtn, nextBtnCfg);
		Ext.EventManager.addListener(this.nextBtn, 'click', function() {
					oCycle.nextCycle();
				});

		var custT = Ext.DomHelper.append(ct, {
			tag : 'table',
			style : 'border-collapse:collapse; float: left;',
			children : [{
				tag : 'tr',
				children : [{
					tag : 'td',
					cls : 'cycle_beginDate',
					style : 'margin-bottom:1px;'
				}, {
					tag : 'td',
					style : 'padding-left: 5px; padding-right: 5px',
					html: '到'
				}, {
					tag : 'td',
					cls : 'cycle_endDate'
				}]
			}]
		}, true);

		this.beginDf.render(custT.child('td.cycle_beginDate'));
		this.beginDf.el.swallowEvent(['keydown', 'keypress']);

		this.endDf.render(custT.child('td.cycle_endDate'));
		this.endDf.el.swallowEvent(['keydown', 'keypress']);
		custT.setDisplayed(false);

		this.cycleT = cycleT;
		this.custT = custT;

		var cycleCfg = {
			DAY: {
				textName: 'dayCycle',
				style : /*@cc_on!@*/true ? "width:50px;float:left;" :"width:50px;display:inline;padding-left:2px;"
			},
			WEEK: {
				textName: 'weekCycle',
				style : /*@cc_on!@*/true ? "width:50px;float:left;" :"width:50px;display:inline;padding-left:2px;"
			},
			MONTH: {
				textName: 'monthCycle',
				style : /*@cc_on!@*/true ? "width:50px;float:left;" :"width:50px;display:inline;padding-left:2px;"
			},
			HALFYEAR: {
				textName: 'halfyearCycle',
				style : /*@cc_on!@*/true ? "width:63px;float:left;" :"width:63px;display:inline;padding-left:2px;"
			},
			YEAR: {
				textName: 'yearCycle',
				style : /*@cc_on!@*/true ? "width:50px;float:left;" :"width:50px;display:inline;padding-left:2px;"
			},
			CUST: {
				textName: 'custCycle',
				style : /*@cc_on!@*/true ? "width:63px;float:left;" :"width:63px;display:inline;padding-left:2px;"
			}
		};


		var radioTpl = new Ext.Template('<DIV class="x-form-check-wrap">'
				+ '<INPUT class="x-form-radio x-form-field" value={value} {checked} type="radio" name="cycle_{nameid}">'
				+ '<LABEL class="x-form-cb-label">{text}</LABEL>' + '</DIV>');
		var checkedCfg = {checked : 'CHECKED="checked"'};

		var hasDefaultChecked = false;
		for (var p in this.showCycle) {
			if (this.showCycle[p] && p == this.curCycle) {
				hasDefaultChecked = true;
				break;
			}
		}

		for (var p in this.showCycle) {
			if (!this.showCycle[p])
				continue;

			var c = {};
			if (!hasDefaultChecked && checkedCfg) {
				c = checkedCfg;
				checkedCfg = null;
				this.curCycle = p;
			} else if (p == this.curCycle) {
				c = checkedCfg;
			}

			var	style = cycleCfg[p].style || "width:50px;display:inline;padding-left:2px;";
			var radio = ct.createChild({
				cls : "x-toolbar-cell",
				style : style
			});	

			var radioCfg = Ext.apply({
				value: p,
				nameid: this.nameid,
				text : getBusiMonitorResultGridJSLan(cycleCfg[p].textName)
			}, c);

			radioTpl.overwrite(radio, radioCfg);
			Ext.EventManager.addListener(radio, 'click', function() {
				var oArr = Ext.query("input", this);
				oArr[0].checked = true;
				oCycle.selectCycle(oArr[0].value);
			});
		}

		if (this.value) {
			this.setDisplayEl();
			this.setValue(this.value);
		} else {
			this.selectCycle(this.curCycle);
		}
	},

	actions: {
		init: function(oCycle) {
			this.oCycle = oCycle;	
			this.handler = this.Handler(oCycle);
		},
		changeCycleVal: function(sign) {
			var o = this.oCycle;

			this.handler.changeCycleVal(o.beginValue, o.endValue, sign)
				.getValue(function(beginDate, endDate) {
					o.beginValue = beginDate.format(o.format);
					o.endValue = endDate.format(o.format);

					if (o.beginValue != o.endValue)
						o.setValue(o.beginValue + '/' + o.endValue);
					else
						o.setValue(o.beginValue);			
				});
		},
		selectCycle: function() {
			var o = this.oCycle;

			var curTime = o.sysCurTime;
			this.handler.selectCycle(curTime)
				.getValue(function(beginDate, endDate) {
					var v = curTime;
					if (beginDate && endDate) {
						o.beginValue = beginDate.format(o.format);
						o.endValue = endDate.format(o.format);	

						v = o.beginValue + '/'+ o.endValue;
					}

					o.setValue(v);
				});
		},
		
		Handler:  function(oCycle) {
			var _b, _e, _sign, _curTime;
			var _oCycle = oCycle;
			var _custB = null, _custE = null;

			var actionCfg = {
				DAY: {
					changeCycleVal:	function() {
						_b = _b.add(Date.DAY, 1 * _sign);
						_e = _e.add(Date.DAY, 1 * _sign);
					},
					selectCycle: function() {
						_b = null;
						_e = null;
					}
				},
				WEEK: {
					changeCycleVal:	function() {
						_b = _b.add(Date.DAY, 7 * _sign);
						_e = _e.add(Date.DAY, 7 * _sign);
					},
					selectCycle: function() {
						var curWeek = _curTime.getDay();
						if (curWeek === 0)
							curWeek = 7;

						_b = _curTime.add(Date.DAY, -curWeek + 1);
						_e = _b.add(Date.DAY, 6);
					}
				},
				MONTH: {
					changeCycleVal:	function() {
						_b = _b.add(Date.MONTH, 1 * _sign);
						_e = _b.add(Date.MONTH, 1).add(Date.DAY, -1);
					},
					selectCycle: function() {
						_b = new Date(_curTime.getFullYear(), _curTime.getMonth(), 1);
						_e = _b.add(Date.MONTH, 1).add(Date.DAY, -1);
					}
				},
				HALFYEAR: {
					changeCycleVal: function() {
						_b = _b.add(Date.MONTH, 6 * _sign);
						_e = _b.add(Date.MONTH, 6).add(Date.DAY, -1);
					},
					selectCycle: function() {
						if(_curTime.getMonth()<7){
							_b = new Date(_curTime.getFullYear(), 0, 1);
							_e = new Date(_curTime.getFullYear(), 5, 30);
						} else {
							_b = new Date(_curTime.getFullYear(), 6, 1);
							_e = new Date(_curTime.getFullYear(), 11, 31);
						}
					}
				},
				YEAR: {
					changeCycleVal: function() {
						_b = _b.add(Date.YEAR, 1 * _sign);
						_e = _e.add(Date.YEAR, 1 * _sign);
					},
					selectCycle: function() {
						_b = new Date(_curTime.getFullYear(), 0, 1);
						_e = new Date(_curTime.getFullYear(), 11, 31);
					}
				},
				CUST: {
					selectCycle: function() {
						_custB = _oCycle.beginDf.getValue();
						_custE = _oCycle.endDf.getValue();
						if (_custB === '') {
							_custB = _b;
							_custE = _e;
						} else {
							_b = _custB;	
							_e = _custE;
						}
					}	
				}
			};

			return {
				changeCycleVal: function(beginValue, endValue, sign) {
					_b = new Date(beginValue.replace(/-/g, '/')); 
					_e = new Date(endValue.replace(/-/g, '/'));
					_sign = sign;

					actionCfg[_oCycle.curCycle].changeCycleVal();

					return this;
				},
				selectCycle: function(curTime) {
					_curTime = new Date(curTime.replace(/-/g, "/"));
					actionCfg[_oCycle.curCycle].selectCycle();

					return this;
				},
				getValue: function(callback) {
					callback(_b, _e);
				}
			};
		}
	},

	prevCycle : function() {
		this.actions.changeCycleVal(-1);
	},
	nextCycle : function() {
		this.actions.changeCycleVal(1);
	},
	selectCycle : function(cycle) {
		this.curCycle = cycle;
		this.setDisplayEl();
	
		this.actions.selectCycle();
	},
	setDisplayEl: function() {
		var isCust = (this.curCycle === 'CUST');

		this.cycleT.setDisplayed(!isCust);
		this.custT.setDisplayed(isCust);
	},
	getAutoCreate : function() {
		var cfg = typeof this.autoCreate == "object" ? 
			this.autoCreate : Ext.apply({}, this.defaultAutoCreate);
		if (this.id && !cfg.id) {
			cfg.id = this.id + '_display';
		}
		return cfg;
	},
	getValue : function() {
		return this.beginValue + '/' + this.endValue;
	},
	searchFn : null,
	setValue : function(v) {
		if (v) {
			var displayVal = v;

			if (v.indexOf('/') != -1) {
				this.beginValue = v.split('/')[0];
				this.endValue = v.split('/')[1];
				displayVal = this.beginValue + this.joinText + this.endValue;
			} else {
				this.beginValue = v;
				this.endValue = v;
			}

			if (this.curCycle != 'CUST') {
				this.displayEl.dom.innerHTML = displayVal;
			} else {
				this.beginDf.setValue(this.beginValue);	
				this.endDf.setValue(this.endValue);
			}

			if (Result.isFunction(this.searchFn)) {
				try {
					this.searchFn();
				} catch (e) {
				}
			}
		}
	}
});

Ext.form.MonthDateField = Ext.extend(Ext.form.TriggerField, {

	format : "Y-m",

	mode : "month", // 处理模式:[month、day]

	prevText : getBusiMonitorResultGridJSLan('prevMonth'),

	nextText : getBusiMonitorResultGridJSLan('nextMonth'),

	triggerClass : 'x-form-date-trigger',

	showToday : true,

	readOnly : true,

	disableKeyFilter : false,
	
	searchFn : null,

	inited : true,

	defaultAutoCreate : {
		tag : "input",
		type : "text",
		size : "10",
		autocomplete : "off"
	},

	getValue : function() {
		return Ext.form.MonthDateField.superclass.getValue.call(this,
				this.menu.text);
	},
	setValue : function(sDate) {
		if (typeof sDate == 'string' && sDate != "") {
			sDate = Date.parseDate(sDate, this.format).format(this.format);
		}
		if (typeof sDate == 'object') {
			sDate = sDate.format(this.format);
		}
		Ext.form.MonthDateField.superclass.setValue.call(this, sDate);
		if (this.inited) {
			this.fireEvent('change');
		}
		this.inited = true;
		
		if(Result.isFunction(this.searchFn)){
    		this.searchFn(sDate);
		}
	},
	onRender : function(ct, position) {
		Ext.form.MonthDateField.superclass.onRender.call(this, ct, position);
		var overCls = "'x-btn x-btn-text-icon x-btn-over'";
		var outCls = "'x-btn x-btn-text-icon x-btn-expand'";
		var tpl = new Ext.Template('<table cellspacing="0" class="x-btn x-btn-text-icon x-btn-expand" onmousemove="javascript:this.className='
				+ overCls
				+ ';" onmouseout="javascript:this.className='
				+ outCls
				+ ';" style="width: auto;">'
				+ '<tbody class="x-btn-small x-btn-icon-small-left">'
				+ '<tr><td class="x-btn-tl"><i>&nbsp;</i></td><td class="x-btn-tc"></td><td class="x-btn-tr"><i>&nbsp;</i></td></tr>'
				+ '<tr><td class="x-btn-ml"><i>&nbsp;</i></td><td class="x-btn-mc"><em unselectable="on" class=""><button type="button" id="{id}" class="x-btn-text {iconCls}">{text}</button></em></td><td class="x-btn-mr"><i>&nbsp;</i></td></tr>'
				+ '<tr><td class="x-btn-bl"><i>&nbsp;</i></td><td class="x-btn-bc"></td><td class="x-btn-br"><i>&nbsp;</i></td></tr>'
				+ '</tbody>' + '</table>');
		var oField = this;
		var sMode = this.mode;

		this.prevBtnWarp = this.wrap.createChild({cls : "x-toolbar-cell",style : "width:50px;display:inline;padding-right:1px;margin-top:-1px;"},
			this.wrap.first());
			
		var prevBtnId = Ext.id();
		var prevBtn = {
			text : this.prevText,
			iconCls : "icon-prev2",
			id : prevBtnId
		};
		tpl.overwrite(this.prevBtnWarp, prevBtn);
		Ext.EventManager.addListener(prevBtnId, 'click', function() {
					var dt;
					if (sMode == "month") {
						if (!oField.getValue()) {
							val = new Date().format(sFormat) + "-01";
						} else {
							val = oField.getValue() + "-01";
						}
						val = val.split("-");
						dt = new Date(val[0] + "/" + val[1] + "/" + val[2]);
						dt = dt.add(Date.MONTH, -1);
					} else {
						if (!oField.getValue()) {
							val = new Date().format(sFormat);
						} else {
							val = oField.getValue();
						}
						val = val.split("-");
						dt = new Date(val[0] + "/" + val[1] + "/" + val[2]);
						dt = dt.add(Date.DAY, -1);
					}
					// Ext.form.MonthDateField.superclass.setValue.call(oField,dt.format(sFormat));
					oField.setValue(dt.format(sFormat));
				});

		this.nextBtnWarp = this.wrap.createChild({cls : "x-toolbar-cell",style : "width:50px;display:inline;padding-left:18px;margin-top:-1px;"})
		var nextBtnId = Ext.id();
		var nextBtn = {
			text : this.nextText,
			iconCls : "icon-next2",
			id : nextBtnId
		};
		tpl.overwrite(this.nextBtnWarp, nextBtn);
		Ext.EventManager.addListener(nextBtnId, 'click', function() {
					var dt;
					if (sMode == "month") {
						if (!oField.getValue()) {
							val = new Date().format(sFormat) + "-01";
						} else {
							val = oField.getValue() + "-01";
						}
						val = val.split("-");
						dt = new Date(val[0] + "/" + val[1] + "/" + val[2]);
						dt = dt.add(Date.MONTH, 1);
					} else {
						if (!oField.getValue()) {
							val = new Date().format(sFormat);
						} else {
							val = oField.getValue();
						}
						val = val.split("-");
						dt = new Date(val[0] + "/" + val[1] + "/" + val[2]);
						dt = dt.add(Date.DAY, 1);
					}
					// Ext.form.MonthDateField.superclass.setValue.call(oField,dt.format(sFormat));
					oField.setValue(dt.format(sFormat));
				});
		var sFormat = this.format;
		if (sMode == "month") {
			this.menu = new Ext.ux.MonthMenu({
						text : new Date().format(sFormat),
						handler : function(dp, newValue, oldValue) {
							this.text = newValue.format(sFormat);
						},
						format : sFormat,
						allowBlank : false,
						useDayDate : 1,
						noPastYears : false,
						noPastMonths : false
					});
		} else {
			this.menu = new Ext.menu.DateMenu({
						text : new Date().format(sFormat),
						handler : function(dp, newValue, oldValue) {
							this.text = newValue.format(sFormat);
						},
						format : sFormat,
						allowBlank : false,
						useDayDate : 1,
						noPastYears : false,
						noPastMonths : false
					});
		}

		// this.setValue(this.menu.text);
	},
	onTriggerClick : function() {
		if (this.disabled) {
			return;
		}
		this.menu.on(Ext.apply({}, this.menuListeners, {
					scope : this
				}));
		this.menu.show(this.el, "tl-bl?");
	},
	menuListeners : {
		select : function(m, d) {
			this.setValue(d);
			this.fireEvent('select', this, d);
		},
		show : function() {
			this.onFocus();
		},
		hide : function() {
			this.focus.defer(10, this);
			var ml = this.menuListeners;
			this.menu.un("select", ml.select, this);
			this.menu.un("show", ml.show, this);
			this.menu.un("hide", ml.hide, this);
		}
	}
});

(function() {
	var EXEC_SQL_URL = getRealPath("../../../servlet/@Deprecated/ExecServlet?", "ResultGrid.js");

	var SelectDialog = (function() {
		var Field = Ext.extend(Ext.form.TriggerField, {
			readOnly : true,
			onRender : function(ct, position) {
				Field.superclass.onRender.call(this, ct, position);
				this.trigger.dom.style.backgroundImage = 'url(/resource/image/find-trigger.gif)';
				this.wrap.dom.style.cursor = 'pointer'
				this.hiddenField = this.el.insertSibling({
							tag : 'input',
							type : 'hidden',
							name : this.hiddenName || this.name,
							id : this.id || this.name,
							value : this.value || ""
						}, 'before', true);
			},
			setValue : function(v) {
				this.hiddenField.value = v;
			},
			getValue : function() {
				return this.hiddenField.value;
			}
		});
		Ext.reg('selectDialog', Field);
		return Field;
	})();

	var CreateResultGridCls = function(superCls) {
		var Grid = function(config, isForce) {
			var applyFn = (isForce === true) ? Ext.applyIf : Ext.apply;
			this.result = ResultFactory.newResult(config.result,
					config.resultArgs, config.resultParam);
			this.searchTask;
			delete config.result;
			delete config.resultArgs;
			delete config.resultParam;

			this.result.loadRenderCfg();
			if (this.result.renderCfg) {
				var showCfg = this.result.renderCfg.show;
				delete showCfg.importJs;
				if (showCfg.pageSize) {
					this.pageSizeAry = showCfg.pageSize.split(',');
					showCfg.pageSize = this.pageSizeAry[0];
				} else {
					showCfg.pageSize = Grid.defaultPageSize;
				}
				applyFn(config, showCfg.config);
				delete showCfg.config;
				for (var c in showCfg) {
					if (showCfg[c] === "") {
						delete showCfg[c];
					}
				}
				applyFn(config, showCfg);
				applyFn(config, {
							isPage : config.isPage !== false,
							pageSize : config.pageSize
						});

				var isNewLine = '<div class="x-grid3-cell-inner x-grid3-col-{id}" {attr}>{value}</div>';
				if (config.isNewLine === true) {
					isNewLine = '<div style="white-space:normal;padding-bottom:3px" class="x-grid3-cell-inner x-grid3-col-{id}" {attr}>{value}</div>';
				}
				Ext.applyIf(config, {
					viewConfig : {
						forceFit : (config.isForcefit !== false),
						templates : {
							cell : new Ext.Template(
									'<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}" tabIndex="0" {cellAttr}>',
									isNewLine, "</td>")
						}
					},
					store : this.createStore(config),
					columns : this.createColumns(config)
				});
				if (config.isPage) {
					config.bbar = new Ext.PagingToolbar({
								pageSize : parseInt(config.pageSize),
								store : config.store,
								displayInfo : true,
								displayMsg : getBusiMonitorResultGridJSLan('displayMsg'),
								emptyMsg : getBusiMonitorResultGridJSLan('emptyMsg'),
								listeners : {
									beforechange : function(t, p) {
										if (t.store.lastOptions) {
											var lastParam = t.store.lastOptions.params
													|| {};
											Ext.applyIf(p, lastParam);

											this.store.reload({
														params : p
													});
										} else {
											this.store.load({
														params : p,
														getType : Result.FORCE_GET
													});
										}
										return false;
									}
								}
							})
				}
				if (config.toolbar) {
					applyFn(config, {
								tbar : (config.toolbar == "-1")
										? null
										: (function(grid) {
											var funcmenu = new ExtFuncMenu();
											funcmenu.eventParams = [grid];
											funcmenu.menuId = config.toolbar;
											funcmenu.getMenuDataFunc = "menuId";
											funcmenu.buildRule();
											config.tbarFuncMenu = funcmenu;
											return funcmenu.buildMenuData();
										})(this)
							})
				}
				if (config.isAddParamTbar && !config.tbar) {
					config.tbar = this.buildParamBar();
				}
				config.listeners = config.listeners || {};
				if (config.right) {
					var funcmenu = new ExtFuncMenu();
					funcmenu.eventParams = [this];
					funcmenu.menuId = config.right;
					funcmenu.getMenuDataFunc = "menuId";
					funcmenu.buildRule();
					config.rightFuncMenu = funcmenu;
					config.rightMenu = new Ext.menu.Menu({
								items : funcmenu.buildMenuData(),
								uniqueID : funcmenu.uniqueID
							});

					delete config.right;
					config.listeners = Ext.apply(config.listeners, {
								"rowcontextmenu" : {
									fn : Grid.defaultEvent.rightClickFn
								}
							});
				}
				if (config.dblclick) {
					config.listeners = Ext.apply(config.listeners, {
								"dblclick" : {
									fn : Grid.defaultEvent.dblclickFn,
									scope : this
								}
							});
				}
				if (config.filedSearch) {
					config.listeners = Ext.apply(config.listeners, {
								"headerclick" : {
									fn : Grid.defaultEvent.headerclickFn,
									scope : this
								}
							});
				}
				if (config.setRowColor || config.setColumnColor) {
					config.listeners = Ext.apply(config.listeners, {
								"afterrender" : {
									fn : Grid.defaultEvent.setColorFn,
									scope : this
								}
							});
				}

				if (typeof ExtMenuUtil != 'undefined')
					ExtMenuUtil.init(this);
			}
			Grid.superclass.constructor.call(this, config);
		}
		var getArrayFromXml = function(url,sqlId) {
			
			var oXml = getXmlFromHtmlData(sqlId+"#sqlCompDs");
			var rows;
			if(oXml)
			{
				rows = oXml.selectNodes("/root/rowSet");
			}
			else
			{
				var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
				sendRequest.open("post", url, false);
				sendRequest.send();
				if (isSuccess(sendRequest)) {
					rows = sendRequest.responseXML.selectNodes("/root/rowSet");
				}
			}
			var list = []
			if (rows) {
				for (var i = 0, row; row = rows[i]; i++) {
					list[i] = [row.attributes[0].value, row.childNodes[0].text];
				}
			}
			return list;
		}
		Ext.apply(Grid, {
			defaultPageSize : 25,
			defaultColumnCfgType : 'replace',
			maxWinHeight : 550,
			defaultEvent : {
				rightClickFn : function(grid, rowIndex, e) {
					e.preventDefault();
					grid.getSelectionModel().selectRow(rowIndex);
					grid.rightMenu.showAt(e.getXY());
					if (typeof GridRightAfterEvent == "function") {
						GridRightAfterEvent();
					}
				},
				dblclickFn : function(e) {
					var fn = eval(this.dblclick);
					if (Result.isFunction(fn)) {
						return fn.apply(this, [this]);
					}
				},
				headerclickFn : function(g, index) {
					var col = g.colModel.getColumnAt(index);
					if (col.id != 'checker' && col.id != 'numberer') {
						col.sortable = false;
						var win = this.createFiledWin(col)
						win.show()
					}
				},
				setColorFn : function() {
					this.view.on("refresh", this.setRowColor, this);
				}
			},
			Read : (function() {
				var Cls = function(meta) {
					this.meta = meta;
					this.recordType = Ext.data.Record.create([]);
				}

				Ext.apply(Cls, {
							NAME : 1,
							LABEL : 2
						});

				Ext.extend(Cls, Ext.data.XmlReader, {
					isBuildFieldEvery : false,
					getNameType : Cls.LABEL,
					addRecordFields : function(doc, fields) {
						fields.clear();
						var labelConfig = this.meta.label || {};
						var fieldNodes = doc
								.selectNodes('/root/Fields/FLDNAME');
						var name, label, tagName, fieldLabel;
						for (var i = 0, fieldNode; fieldNode = fieldNodes[i]; i++) {
							tagName = fieldNode.getAttribute("name");
							label = fieldNode.text;
							name = (this.getNameType == Cls.LABEL)
									? label
									: tagName;
							fieldLabel = labelConfig[label] || label;
							fieldLabel = fields.add(new Ext.data.Field({
										name : name,
										tagName : tagName,
										type : fieldNode.getAttribute("type"),
										label : fieldLabel
									}));
						}
						return fields;
					},
					_readRecords : function(doc) {
						var root = doc.documentElement;
						var recordType = this.recordType, fields = recordType.prototype.fields;
						var sid = this.meta.id;
						var totalRecords = 0, success = true;
						if (this.meta.totalRecords) {
							totalRecords = Result.getNumber(root,
									this.meta.totalRecords, 0);
						}
						if (this.meta.success) {
							var sv = Result.getNumber(root, this.meta.success,
									0);
							success = sv == 0;
						}
						var records = [];
						var ns = root.selectNodes(this.meta.record);
						for (var i = 0, len = ns.length; i < len; i++) {
							var n = ns[i];
							var values = {};
							var id = sid ? Result.getText(n, sid) : undefined;
							for (var j = 0, jlen = fields.length; j < jlen; j++) {
								var f = fields.items[j];
								var v = Result.getText(n, f.tagName);
								values[f.name] = f.convert(v);
							}
							var record = new recordType(values, id);
							record.node = n;
							records[records.length] = record;
						}

						return {
							success : success,
							records : records,
							totalRecords : totalRecords || records.length
						}
					},
					readRecords : function(doc) {
						var fields = this.recordType.prototype.fields;
						this.addRecordFields(doc, fields);
						if (this.meta.id) {
							var field = fields.key(this.meta.id.toUpperCase());
							this.meta.id = (field) ? field.tagName : "";
						}
						if (this.isBuildFieldEvery) {
							return this._readRecords(doc);
						} else {
							this.readRecords = this._readRecords
									.createDelegate(this);
							return this.readRecords.apply(this, arguments);
						}
					}
				});
				return Cls;
			})(),
			Field : {
				FunButton : (function() {
					var Field = Ext.extend(Ext.Button, {});
					Ext.reg('fun_button', Field);
					return Field;
				})(),
				CycleField : (function() {
					var Field = Ext.form.CycleField;
					Ext.reg('result_cyclefield', Field);
					return Field;
				})(),
				MonthDateField : (function() {
					var Field = Ext.extend(Ext.form.MonthDateField, {
								format : 'Y-m',
								mode : 'month',
								prevText : getBusiMonitorResultGridJSLan('prevMonth'),
								nextText : getBusiMonitorResultGridJSLan('nextMonth')
							});
					Ext.reg('result_monthdatefield', Field);
					return Field;
				})(),
				DayDateField : (function() {
					var Field = Ext.extend(Ext.form.MonthDateField, {
								format : 'Y-m-d',
								mode : 'day',
								prevText : getBusiMonitorResultGridJSLan('prevDay'),
								nextText : getBusiMonitorResultGridJSLan('nextDay')
							});
					Ext.reg('result_daydatefield', Field);
					return Field;
				})(),
				DateField : (function() {
					var Field = Ext.extend(Ext.form.DateField, {
								format : 'Y-m-d',
								setValue : function(date) {
									if (typeof date == 'string'
											&& date.toString() != "") {
										date = this.parseDate(date);
										date = date.format(this.format);
									}
									Ext.form.DateField.superclass.setValue
											.call(this, this.formatDate(this
															.parseDate(date)));
								}
							});
					Ext.reg('result_datefield', Field);
					return Field;
				})(),
				Select : (function() {
					var Field = Ext.extend(Ext.form.ComboBox, {
						editable : false,
						typeAhead : true,
						triggerAction : 'all',
						initComponent : function() {
							this.mode = 'local';
							this.store = new Ext.data.SimpleStore({
								'id' : 0,
								fields : ['value', 'text'],
								data : (this.appendNO === false)
										? (this.sql
												? getArrayFromXml(EXEC_SQL_URL
														+ "action="
														+ this.action
														+ "&sql="
														+ encodeURIComponent(this.sql),this.sql)
												: this.data)
										: ((this.hideNullItem === true) ? (this.sql
														? getArrayFromXml(EXEC_SQL_URL
																+ "action="
																+ this.action
																+ "&sql="
																+ encodeURIComponent(this.sql),this.sql)
														: this.data) : [["", getBusiMonitorResultGridJSLan('nullOption')]]
												.concat((this.sql
														? getArrayFromXml(EXEC_SQL_URL
																+ "action="
																+ this.action
																+ "&sql="
																+ encodeURIComponent(this.sql),this.sql)
														: this.data)))
							});
							this.valueField = 'value';
							this.displayField = 'text';
							Field.superclass.initComponent.call(this);
						}
					});
					Ext.reg('result_select', Field);
					return Field;
				})(),
				DateTime : (function() {
					var Field = Ext.extend(Ext.ux.form.DateTime, {
								timeFormat : 'H:i:s',
								format : 'Y-m-d H:i:s',
								timeConfig : {
									altFormats : 'H:i:s',
									allowBlank : true
								},
								dateFormat : 'Y-m-d',
								dateConfig : {
									altFormats : 'Y-m-d|Y-n-d',
									allowBlank : true
								}
							})
					Ext.reg('result_datetime', Field);
					return Field;
				})(),
				MultipleSelect : (function() {
					var Field = Ext.extend(Ext.ux.form.LovCombo, {
						editable : false,
						typeAhead : true,
						triggerAction : 'all',
						showSelectAll : true,
						initComponent : function() {
							this.mode = 'local';
							this.store = new Ext.data.SimpleStore({
										'id' : 0,
										fields : ['value', 'text'],
										data : this.sql
												? getArrayFromXml(EXEC_SQL_URL
														+ "action="
														+ this.action
														+ "&sql="
														+ encodeURIComponent(this.sql),this.sql)
												: this.data
									});
							this.valueField = 'value';
							this.displayField = 'text';
							Field.superclass.initComponent.call(this);
						},
						initList : function() {
							if (!this.list) {
								var cls = 'x-combo-list';

								this.list = new Ext.Layer({
											parentEl : this.getListParent(),
											shadow : this.shadow,
											cls : [cls, this.listClass]
													.join(' '),
											constrain : false
										});

								var lw = this.listWidth
										|| Math.max(this.wrap.getWidth(),
												this.minListWidth);
								this.list.setSize(lw, 0);
								this.list.swallowEvent('mousewheel');
								this.assetHeight = 0;
								if (this.syncFont !== false) {
									this.list.setStyle('font-size', this.el
													.getStyle('font-size'));
								}
								if (this.title) {
									this.header = this.list.createChild({
												cls : cls + '-hd',
												html : this.title
											});
									this.assetHeight += this.header.getHeight();
								}

								if (this.showSelectAll) {
									this.selectall = this.list.createChild({
										cls : cls
												+ 'item ux-combo-selectall-icon-unchecked ux-combo-selectall-icon',
										html : getBusiMonitorResultGridJSLan('selectall')
									});
									this.selectall.on("click", function(el) {
										if (this.selectall
												.hasClass("ux-combo-selectall-icon-checked")) {
											this.selectall
													.replaceClass(
															"ux-combo-selectall-icon-checked",
															"ux-combo-selectall-icon-unchecked");
											this.deselectAll();
										} else {
											this.selectall
													.replaceClass(
															"ux-combo-selectall-icon-unchecked",
															"ux-combo-selectall-icon-checked")
											this.selectAll();
										}
									}, this);
									this.assetHeight += this.selectall
											.getHeight();
								}

								this.innerList = this.list.createChild({
											cls : cls + '-inner'
										});
								this.mon(this.innerList, 'mouseover',
										this.onViewOver, this);
								this.mon(this.innerList, 'mousemove',
										this.onViewMove, this);
								this.innerList.setWidth(lw
										- this.list.getFrameWidth('lr'));

								if (this.pageSize) {
									this.footer = this.list.createChild({
												cls : cls + '-ft'
											});
									this.pageTb = new Ext.PagingToolbar({
												store : this.store,
												pageSize : this.pageSize,
												renderTo : this.footer
											});
									this.assetHeight += this.footer.getHeight();
								}

								if (!this.tpl) {
									this.tpl = '<tpl for="."><div class="'
											+ cls + '-item">{'
											+ this.displayField
											+ '}</div></tpl>';
								}

								this.view = new Ext.DataView({
											applyTo : this.innerList,
											tpl : this.tpl,
											singleSelect : true,
											selectedClass : this.selectedClass,
											itemSelector : this.itemSelector
													|| '.' + cls + '-item',
											emptyText : this.listEmptyText
										});

								this.mon(this.view, 'click', this.onViewClick,
										this);

								this.bindStore(this.store, true);

								if (this.resizable) {
									this.resizer = new Ext.Resizable(this.list,
											{
												pinned : true,
												handles : 'se'
											});
									this.mon(this.resizer, 'resize', function(
											r, w, h) {
										this.maxHeight = h - this.handleHeight
												- this.list.getFrameWidth('tb')
												- this.assetHeight;
										this.listWidth = w;
										this.innerList
												.setWidth(w
														- this.list
																.getFrameWidth('lr'));
										this.restrictHeight();
									}, this);

									this[this.pageSize ? 'footer' : 'innerList']
											.setStyle('margin-bottom',
													this.handleHeight + 'px');
								}
							}
						}
					});
					Ext.reg('multiple_result_select', Field);
					return Field;
				})(),
				Fuzzy : (function() {
					var Field = Ext.extend(Ext.form.TextField, {
								getValue : function() {
									var v = Field.superclass.getValue
											.call(this);
									return (v) ? ('%' + v + "%") : "";
								}
							});
					Ext.reg('fuzzyfield', Field);
					return Field;
				})(),
				Tree : (function() {
					var Field = Ext.extend(Ext.form.TriggerField, {
								deferMillis : 50,
								emptyValue : -1,
								emptyText : "",
								sendParams : "",
								defaultAutoCreate : {
									tag : "input",
									type : "text",
									size : "16",
									autocomplete : "off",
									readonly : 'true',
									style : "cursor:pointer;color:black"
								},
								onRender : function(ct, position) {
									Field.superclass.onRender.call(this, ct,
											position);
									this.hiddenField = this.el.insertSibling({
												tag : 'input',
												type : 'hidden',
												name : this.hiddenName
														|| this.name,
												id : this.id || this.name
											}, 'before', true);
									this.el.dom.removeAttribute('name');
									this.el.on('mousedown',
											this.onTriggerClick, this);
									this.treeHtc = ct.createChild({
												tag : "IE:tree",
												style : "display:none",
												treeHeight : this.treeHeight
														|| 200,
												isCheckBox : this.isCheck?this.isCheck:false,
												isSelectChildNode : this.isSelectChildNode?this.isSelectChildNode:false,
												//是否显示复选框 和 是否自动选择子节点
												isShowUnDisplay : this.isShowUnDisplay?this.isShowUnDisplay:false
											}).dom;
									Field.prototype.initTreeHtcValue.defer(
											this.deferMillis, this);
								},
								setUrl : function(url) {
									this.treeHtc.xmlUrl = url;
								},
								initTreeHtcValue : function() {
									if (this.treeHtc.readyState == "complete") {
										if (this.xmlDom) {
											this.treeHtc.xmlDom = this.xmlDom;
										} else {
											if (this.sql) {
												var oTreeXml = getXmlFromHtmlData(this.sql+"#sqlCompDs");
												if(oTreeXml)
												{
													this.treeHtc.xmlDom = oTreeXml;
												}
												else
												{
													this.xmlUrl = EXEC_SQL_URL
															+ "action="
															+ this.action;
													this.sendParams = "sql="
															+ encodeURIComponent(this.sql);
												}
											}
											this.treeHtc.sendParams = this.sendParams
													|| "";
											this.treeHtc.xmlUrl = this.xmlUrl
													|| "";
										}
										this.treeHtc.value = this.value;
										this.el.dom.value = this.treeHtc.text
												|| this.emptyText;
										this.treeHtc
												.attachEvent(
														"onResultChange",
														Field.prototype.loadTreeHtcValue
																.createDelegate(this));
										this.treeHtc.attachEvent("onSetBtnClick",
																							Field.prototype.loadTreeHtcValue.createDelegate(this));
									} else {
										Field.prototype.initTreeHtcValue.defer(
												this.deferMillis, this);
									}
								},
								loadTreeHtcValue : function(oEvt) {
									this.el.dom.value = event.selectedText
											|| this.emptyText;
									this.value = event.selectedValue;
									this.hiddenField.value = this.value;
									if (this.onResultChange) {
										var fn = eval(this.onResultChange);
										if (typeof fn == 'function') {
											fn.call(this,this,this.value,oEvt);
										}
									}
								},
								initValue : Ext.emptyFn,
								onTriggerClick : function() {
									if (!this.disabled)
										this.treeHtc.showTree(null,
												this.wrap.dom);
								},
								setValue : function(v) {
									if (this.treeHtc) {
										this.treeHtc.value = v;
									} else {
										this.value = v;
										if (this.hiddenField)
											this.hiddenField.value = this.value;
									}
								},
								getValue : function() {
									var v = this.value;
									return (v == this.emptyValue) ? "" : v;
								}
							})
					Ext.reg('treefield', Field);
					return Field;
				})(),
				DBTree : (function() {
					var Field = Ext.extend(Ext.form.TriggerField, {
								deferMillis : 50,
								emptyValue : -1,
								emptyText : "",
								sendParams : "",
								defaultAutoCreate : {
									tag : "input",
									type : "text",
									size : "16",
									autocomplete : "off",
									readonly : 'true',
									style : "cursor:pointer;color:black"
								},
								onRender : function(ct, position) {
									Field.superclass.onRender.call(this, ct,
											position);
									this.hiddenField = this.el.insertSibling({
												tag : 'input',
												type : 'hidden',
												name : this.hiddenName
														|| this.name,
												id : this.id || this.name
											}, 'before', true);
									this.el.dom.removeAttribute('name');
									this.el.on('mousedown',
											this.onTriggerClick, this);
									this.treeHtc = ct.createChild({
												tag : "IE:dbTree",
												style : "display:none",
												cfg : this.cfg,
												treeHeight : this.treeHeight
														|| 200
											}).dom;
									Field.prototype.initTreeHtcValue.defer(
											this.deferMillis, this);
								},
								initTreeHtcValue : function() {
									if (this.treeHtc.readyState == "complete") {
										this.treeHtc.value = this.value;
										this.el.dom.value = this.treeHtc.text
												|| this.emptyText;
										this.treeHtc
												.attachEvent(
														"onResultChange",
														Field.prototype.loadTreeHtcValue
																.createDelegate(this));
									} else {
										Field.prototype.initTreeHtcValue.defer(
												this.deferMillis, this);
									}
								},
								loadTreeHtcValue : function() {
									this.el.dom.value = event.selectedText
											|| this.emptyText;
									this.value = event.selectedValue;
									this.hiddenField.value = this.value;
									if(this.onResultChange) {
										var fn = eval(this.onResultChange);
										if(typeof fn == 'function') {
											fn.call(this,this,this.value);
										}
									}						
								},
								initValue : Ext.emptyFn,
								onTriggerClick : function() {
									this.treeHtc.showTree(this.wrap.dom)
								},
								setValue : function(v) {
									if (this.treeHtc) {
										this.treeHtc.value = v;
									} else {
										this.value = v;
										this.hiddenField.value = this.value;
									}
								},
								getValue : function() {
									var v = this.value;
									return (v == this.emptyValue) ? "" : v;
								}
							})
					Ext.reg('dbTree', Field);
					return Field;
				})(),
				SelectDialog : SelectDialog,
				SelectStaff : (function() {
					var Action = getRealPath(
							"../../../servlet/util?OperType=1", "ResultGrid.js");

					var getName = function(v) {
						var name = "";
						var sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
						var sendXml = new ActiveXObject("Microsoft.XMLDOM");
						sendXml.async = false;
						sendXml.loadXML('<root><table>staff</table>'
								+ '<keyColumn>staff_id</keyColumn>'
								+ '<valueColumn>staff_name</valueColumn>'
								+ '<valuesSplit>,</valuesSplit><keys>' + v
								+ '</keys></root>');
						sendRequest.open('post', Action, false);
						sendRequest.send(sendXml)
						if (isSuccess(sendRequest)) {
							var node = sendRequest.responseXML
									.selectSingleNode('/root/values');
							if (node) {
								name = node.text
							}
						}
						sendRequest = null;
						return name;
					}

					var Field = Ext.extend(SelectDialog, {
								isMultiple : '0BF',
								onTriggerClick : function() {
									choiceStaffToElement(this.el.dom,
											this.hiddenField,
											(this.isMultiple == "0BT"));
								},
								setValue : function(v) {
									Field.superclass.setValue.call(this, v);
									this.el.dom.value = getName(v);
								}
							});
					Ext.reg('selectStaff', Field);
					return Field;
				})()
			}
		});
		Ext.extend(Grid, superCls, {
			stripeRows : true,
			loadMask : true,
			createStore : function(config) {
				var renderCfg = this.result.renderCfg;
				var storeFunc = Ext.data.Store;
				var storeConfig = {};
				if (typeof config.group == "object") {
					// config.isPage = false;
					storeFunc = Ext.data.GroupingStore;
					storeConfig = config.group;
				}
				return new storeFunc(Ext.apply({
							proxy : new Ext.data.ResultProxy({
										result : this.result,
										isPage : config.isPage
									}),
							reader : new Grid.Read({
										record : "rowSet",
										success : "error_code",
										id : renderCfg.id
									}),
							baseParams : this.result.oParam,
							remoteSort : config.isPage
						}, storeConfig));
			},
			createColumns : function(config) {
				var columnCfgType = config.columnCfgType
						|| Grid.defaultColumnCfgType;
				var renderCfg = this.result.renderCfg;
				var columns = [];
				var cfgColumns = {};
				var cfgColumnLen = renderCfg.columns.length;
				if (cfgColumnLen > 0) {
					for (var i = 0, c; c = renderCfg.columns[i]; i++) {
						Ext.apply(c, c.config);
						delete c.config;
						cfgColumns[c.dataIndex] = c;
						columns[i] = c;
					}
				}
				var self = this;
				var editColumn = {};
				var cfgEditProc;
				if (config.editColumn) {
					var cfgEditColumn = config.editColumn.split(',');
					for (eCol in cfgEditColumn) {
						var colName = cfgEditColumn[eCol];
						editColumn[colName] = colName;
					}
					cfgEditProc = config.editProc;					
					var vFields = renderCfg.fields.length > 0 ? renderCfg.fields : renderCfg.columns;
					for (var i = 0, f; f = vFields[i]; i++) {
						var fieldName = f.name || f.dataIndex;
						var col = {
							header : fieldName || f.header,
							dataIndex : fieldName || f.dataIndex,
							sortable : true
						};
						if (cfgEditProc && editColumn[fieldName]) {
							Ext.apply(col, {
								editor : new Ext.form.TextField({
									tableHeader : fieldName,
									editProc : cfgEditProc,
									allowNegative : false,
									allowBlank : false,
									minValue : 1,
									listeners : {
										'change' : function() {											
											if (this.editProc) {
												var reg = /(.+)[(](.+)[)]/;
												if (reg.test(this.editProc)) {
													var procName = this.editProc.substring(0,this.editProc.indexOf('('));
													var procParam = this.editProc.substring(this.editProc.indexOf('(')+1,this.editProc.indexOf(')'));
													var params = procParam.split(',');
													var paramList = new Array();
													var regParam = /(.*?)\.value$/i;
													var record = self.getStore().getAt(self.selectedRow);													
													for(var i = 0, param; param = params[i]; i++)
													{
														if(regParam.test(param))
														{
															var mt = param.match(regParam);
															var columnName = mt[1];
															var columnValue;
															eval("var reqHeader = /^" + this.tableHeader + "$/i");															
															if(config.singleChange && i==1)
															{
																columnValue = "'" + this.tableHeader + "##" + this.getValue() + "'";																
															}else if(reqHeader.test(columnName))
															{
																columnValue = "'" + this.getValue() + "'";
															}
															else
															{
																columnValue = "'" + record.get(columnName)+ "'";
															}
															paramList.push(columnValue);
														}
														else
														{
															paramList.push(param);
														}
														
														if(config.singleChange && i==1)
															break;
													}
													
													var sqlProc = procName+ "(" + paramList.join(',')	+ ")";

													var sXML = '<?xml version="1.0" encoding="gb2312"?><root><sqlProc/></root>';
													var XMLDoc = new ActiveXObject("Microsoft.XMLDOM");
													XMLDoc.loadXML(sXML);
													XMLDoc
															.selectSingleNode("/root/sqlProc").text = sqlProc;

													var oXMLHTTP = new ActiveXObject("Microsoft.XMLHTTP");
													oXMLHTTP
															.open(
																	"POST",
																	"/servlet/util?OperType=3",
																	true);
													oXMLHTTP.send(XMLDoc);
													oXMLHTTP.onreadystatechange = function() {
														if (oXMLHTTP.readyState == 4) {
															if (oXMLHTTP.status == 200) {
																isSuccess(oXMLHTTP);
															}
														}
													};
												}
											}
										}
									}
								})
							});
						}
						Ext.apply(col, cfgColumns[fieldName]);
						columns[i] = col;
					}
				}else if (cfgColumnLen == 0
						|| columnCfgType != Grid.defaultColumnCfgType) {
					for (var i = 0, f; f = renderCfg.fields[i]; i++) {
						var fieldName = f.name;
						var col = {
							header : fieldName,
							dataIndex : fieldName,
							sortable : true
						};						
						Ext.apply(col, cfgColumns[fieldName]);
						columns[i] = col;
					}
				}
				if (config.hiddenColumns) {
					var re = new RegExp();
					re.compile("^(?:" + config.hiddenColumns.replace(/,/g, '|')
									+ ")$", "i");
					for (var i = 0, c; c = columns[i]; i++) {
						if (re.test(c.dataIndex)) {
							columns[i].hidden = true;
						}
					}
				}
				var ct = (config.isDisplayRowNum === false)
						? (!config.isDisplayExpander
								|| config.isDisplayExpander === false
								? []
								: [new Ext.ux.grid.RowExpander()])
						: [new Ext.grid.RowNumberer()];
				var cm = (config.view) ? columns : (ct).concat(columns);
				if (config.sm) {
					if (config.sm.constructor == Ext.grid.CheckboxSelectionModel) {
						cm = [new Ext.grid.CheckboxSelectionModel()].concat(cm);
					}
				}
				return cm;
			},
			createParamCompList : function() {
				var compList = [];
				for (var i = 0, p; p = this.result.paramList[i]; i++) {
					var comp = p.comp;
					if (comp) {
						var extComp = ResultCompUtils.createExtComp(comp,
								this.result.oParam);
						if (extComp) {
							comp.item = extComp;
							compList[i] = comp.item;
						}
					}
				}
				this.compList = compList;
				return compList;
			},
			createParamWin : function() {
				var grid = this;
				var win;
				var paramCompList = grid.createParamCompList();
				if (paramCompList.length != 0) {
					var vAlign = (navigator.userAgent.toLowerCase()
							.indexOf("msie 8") > -1) ? "middle" : "baseline"
					var form = new Ext.Panel({
								labelWidth : 100,
								defaults : {
									width : 220,
									style : {
										verticalAlign : vAlign
									}
								},
								border : false,
								bodyStyle : {
									padding : '5 0 0 10',
									background : '#DFE8F6'
								},
								autoScroll : true,
								layout : 'form',
								items : paramCompList
							})
					// this.result.createComp(form.items.items);

					var winHeight = paramCompList.length * 26 + 100;
					var winWidth = 380;
					for(var o in paramCompList){
						if(paramCompList[o].xtype=='result_cyclefield'){
							winWidth = 750;
							break;p
						}
					}	
					// 修复：列表窗口高度小于 Grid.maxWinHeight， 且查询条件较多时，无法完整显示查询窗口
					// 2011.12.12 add by l.sa
					/*
					 * if (winHeight > Grid.maxWinHeight) { winHeight =
					 * Grid.maxWinHeight; }
					 */
					var allowMaxHeight = (Grid.maxWinHeight > grid.height)
							? grid.height
							: Grid.maxWinHeight;
					if (winHeight > allowMaxHeight) {
						winHeight = allowMaxHeight;
					}

					win = new Ext.Window({
						title : getBusiMonitorResultGridJSLan('searchParam'),
						iconCls : "icon-param",
						layout : 'fit',
						width : winWidth,
						height : winHeight,
						minWidth : 380,
						closeAction : 'hide',
						modal : false,
						plain : true,
						items : form,
						initValue : [],
						listeners : {
							"beforeshow" : {
								fn : function(win) {
									for (var i = 0, c; c = form.items.items[i]; i++) {
										this.initValue[i] = c.getValue();
									}
								}
							}
						},
						buttons : [{
									text : getBusiMonitorResultGridJSLan('search'),
									handler : function() {
										delete this.result.filedsearch;
										win.hide();
										grid.search.defer(300, grid);
									},
									scope : this
								}, {
									text : getBusiMonitorResultGridJSLan('cancle'),
									handler : function() {
										for (var i = 0, c; c = form.items.items[i]; i++) {
											(c.getValue() != win.initValue[i])
													&& c
															.setValue(win.initValue[i])
										}
										win.hide()
									}
								}]
					})
				}
				return win;
			},
			createFiledWin : function(col) {
				var grid = this;
				var win;
				var checkboxs = new Ext.form.RadioGroup({
							columns : 4,
							width : 300,
							bodyStyle : {
								padding : '5 0 0 10',
								background : '#DFE8F6'
							},
							items : [{
										boxLabel : getBusiMonitorResultGridJSLan('greaterThan'),
										value : '>',
										name : 'compare'
									}, {
										boxLabel : getBusiMonitorResultGridJSLan('equivalentTo'),
										name : 'compare',
										value : '=',
										checked : true
									}, {
										boxLabel : getBusiMonitorResultGridJSLan('lessThan'),
										value : '<',
										name : 'compare'
									}, {
										boxLabel : getBusiMonitorResultGridJSLan('like'),
										value : 'like',
										name : 'compare'
									}]
						})
				var textfiled = new Ext.form.TextField({
							fieldLabel : getBusiMonitorResultGridJSLan('value'),
							maxLength : 30,
							width : 120
						})
				var vAlign = (navigator.userAgent.toLowerCase()
						.indexOf("msie 8") > -1) ? "middle" : "baseline"
				var form = new Ext.Panel({
							labelWidth : 50,
							frame : true,
							defaults : {
								width : 230,
								style : {
									verticalAlign : vAlign
								}
							},
							border : false,
							bodyStyle : {
								padding : '5 0 0 5',
								background : '#DFE8F6'
							},
							autoScroll : true,
							layout : 'form',
							items : [checkboxs, textfiled]
						})

				win = new Ext.Window({
							title : "[" + col.header + "]" + getBusiMonitorResultGridJSLan('filter'),
							iconCls : "icon-param",
							layout : 'fit',
							width : 330,
							height : 165,
							closeAction : 'hide',
							modal : true,
							plain : true,
							items : form,
							listeners : {
								"beforeshow" : {
									fn : function(win) {

									}
								}
							},
							buttons : [{
								text : getBusiMonitorResultGridJSLan('search'),
								handler : function() {
									var qtype = checkboxs.getValue().value;
									var didx = col.dataIndex;
									col.sortable = true;
									var value = Ext.util.Format.trim(textfiled
											.getValue());
									if (value == '') {
										didx += " is null"
									} else {
										if (qtype == 'like') {
											didx += " " + qtype + "'%"
													+ textfiled.getValue()
													+ "%'";
										} else {
											didx += qtype + "'"
													+ textfiled.getValue()
													+ "'";
										}
									}
									this.result.filedsearch = didx;
									win.hide();
									grid.search.defer(300, grid);
								},
								scope : this
							}, {
								text : getBusiMonitorResultGridJSLan('cancle'),
								handler : function() {
									col.sortable = true;
									win.hide()
								}
							}]
						})

				return win;
			},
			buildParamBar : function() {
				var grid = this;
				var paramBar = [];
				var paramCompList = grid.createParamCompList();
				for (var i = 0, j = 0, p; p = paramCompList[i]; i++, j++) {
					paramBar[j] = p.fieldLabel + ":";
					paramBar[++j] = p;
					paramBar[++j] = '-';
				}

				paramBar.push({
							text : getBusiMonitorResultGridJSLan('search'),
							iconCls : 'icon-search',
							handler : function() {
								delete this.result.filedsearch;
								grid.search();
							},
							scope : this
						});
				grid.hasBuildParamBar = true;
				return paramBar;
			},
			showParamWin : function() {
				this.paramWin = this.createParamWin();
				this.showParamWin = (this.paramWin) ? this.paramWin.show
						.createDelegate(this.paramWin) : this.search;
				this.showParamWin.apply(this, arguments);
			},
			changeParamSearch : function(pos,value,grid){
				grid.showParamWin();
				grid.paramWin.items.items[0].items.items[pos].setValue(value);
				grid.search();
				grid.paramWin.hide();
			},
			resetCompValue : function() {
				for (var i = 0, comp; comp = this.compList[i]; i++) {
					comp.setValue(comp.initCompValue);
				}
			},
			searchRun : function(o, arg) {
				o = o || {};
				this.store.load(Ext.apply({
							params : Ext.apply(o, ((this.isPage) ? {
										start : 0,
										limit : this.pageSize
									} : {})),
							getType : Result.FORCE_GET
						}, arg));
			},
			search : function(o, arg) {
				if (this.interval) {
					var self = this;
					if (this.searchTask) {
						Ext.TaskMgr.stop(this.searchTask);
					}
					this.searchTask = Ext.TaskMgr.start({
								run : Grid.prototype.searchRun.createDelegate(
										self, [o, arg]),
								interval : self.interval
							});
				} else {
					this.searchRun(o, arg)
				}
			},
			onRender : function(ct, position) {
				Grid.superclass.onRender.apply(this, arguments);
				if (this.isAddParamTbar) {
					var pBar;
					if (this.hasBuildParamBar !== true) {
						pBar = new Ext.Toolbar({
									buttons : this.buildParamBar(),
									renderTo : this.tbar
								});
					} else {
						pBar = this.topToolbar;
					}
					// this.result.createToolbarComp(pBar.items);
				}
				if (this.tbarFuncMenu) {
					this.topToolbar.uniqueID = this.tbarFuncMenu.uniqueID;
				}
				var data = [];
				if (this.pageSizeAry) {
					for (var i = 0; i < this.pageSizeAry.length; i++) {
						if (parseInt(this.pageSizeAry[i], 0)) {// 当配置数据不符合规则时候
							data.push([this.pageSizeAry[i],
									this.pageSizeAry[i] + getBusiMonitorResultGridJSLan('recordUnit')])
						}
					}
				}
				var bbar = this.getBottomToolbar();
				if (data.length > 1 && bbar) {
					this.getBottomToolbar().addFill();
					this.getBottomToolbar().addText(getBusiMonitorResultGridJSLan('displayRecords'))
					var ps = new Ext.form.ComboBox({
								typeAhead : false,
								triggerAction : 'all',
								mode : 'local',
								width : 110,
								listWidth : 115,
								value : (data[0])[0],
								listeners : {
									select : {
										fn : this.psComboxFn
												.createDelegate(this),
										scope : this
									}
								},
								store : new Ext.data.ArrayStore({
											autoLoad : true,
											fields : ['id', 'text'],
											data : data
										}),
								valueField : 'id',
								displayField : 'text'
							});
					this.getBottomToolbar().addField(ps);
				}
			},
			psComboxFn : function(cb) {
				delete this.result.filedsearch;
				this.pageSize = cb.getValue();
				var bbar = this.getBottomToolbar();
				bbar.pageSize = parseInt(this.pageSize);
				bbar.doLoad(0)// 如果从第一条开始查询参数为0
			}
		});
		return Grid;
	};
	var clsConfigs = [{
				key : "resultEditGrid",
				superCls : Ext.grid.EditorGridPanel,
				clsName : null
			}, {
				key : "resultGrid",
				superCls : Ext.grid.GridPanel,
				clsName : "Ext.data.ResultGrid"
			}];
	for (var i = 0, clsConfig; clsConfig = clsConfigs[i]; i++) {
		var GridCls = CreateResultGridCls(clsConfig.superCls);
		Ext.ComponentMgr.registerType(clsConfig.key, GridCls);
		if (clsConfig.key == "resultGrid") 
		{
			Ext.data.ResultGrid = GridCls;
		}
		else if(clsConfig.key == "resultEditGrid")
		{
			Ext.data.ResultEditGrid = GridCls;
		}
	}
})();
