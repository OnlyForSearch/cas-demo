var busiMonitorResultFmwChartJSDefaultLang = {
	picLoding : '图像载入中...'
};
//获取语言资源
function getBusiMonitorResultFmwChartJSLan(code)
{
	if(typeof(ItmLang) == 'undefined' || typeof(ItmLang.widgets) == 'undefined')
	{
		return eval('busiMonitorResultFmwChartJSDefaultLang.' + code);
	}
	else
	{
		 return eval('ItmLang.widgets.busiMonitorResultFmwChartJS.' + code);
	}
}

ResultFmwChart = (function() {
	
	var FMW_CHART_CTRL_URL	= "../../../servlet/fmwChartCtrl.do?";
	
	var FmwChart = function(config, isForce) {
		this.chartCfgId = config.result;
		this.chartCfgTable = config.cfgFrom == null? "" : config.cfgFrom;
		if(config.bigPipeChart != true)
		{
			this.sendRequest = new ActiveXObject("Microsoft.XMLHTTP");
			var sendParams  =["method=getValueCfgId", "chartCfgId=" + this.chartCfgId,"chartCfgTable=" + this.chartCfgTable ];
			var sendUrl = getSendUrl(FMW_CHART_CTRL_URL, sendParams);
			this.sendRequest.open("post", sendUrl, false);
			this.sendRequest.send();
			
			if (isSuccess(this.sendRequest))
			{
				config.result = this.sendRequest.responseXML.selectSingleNode("/root/get_value_cfg_id").text;
			}
			this.result = ResultFactory.newResult(config.result, config.resultArgs,
					config.resultParam);		
			delete config.result;
			delete config.resultArgs;
			delete config.resultParam;
			var applyFn = (isForce === true) ? Ext.applyIf : Ext.apply;
			this.result.loadRenderCfg();
			if (this.result.renderCfg) {
				var showCfg = this.result.renderCfg.show;
				applyFn(config, showCfg.config);
			}
		}
		FmwChart.superclass.constructor.call(this, config);
	}
	Ext.extend(FmwChart, Ext.Panel, {
				msg 	: getBusiMonitorResultFmwChartJSLan('picLoding'),
				msgCls 	: 'x-mask-loading',
				method 	: "getChart",
				descInited : false,
				descTitleInited : false,
				descLeftInited : false,
				descCount : 0,
				descFinish : 0,
				firstSearch : true,
				onRender : function(ct, position){
					FmwChart.superclass.onRender.call(this, ct, position);
					var ct = document.getElementById(this.id);
					this.ctWrap = document.getElementById(this.id);
				},
				setResultCfg : function(result){
					var resultData = result;
					if(typeof result == 'string')
					{
						var resultCfgDom = new ActiveXObject("Microsoft.XMLDOM");
						resultCfgDom.loadXML(resultData);
						resultData = resultCfgDom;
					}
					
					var valueCfg = resultData.selectSingleNode("/root/value_cfg");
					this.result = ResultFactory.newResult(valueCfg);
					var renderCfg = resultData.selectSingleNode("/root/render_cfg");
					if(renderCfg != null)
					{
						this.result.renderCfg = Result.loadJsonText(renderCfg.text);
					}
				},
				createDescText : function(){
					var ct = this.ctWrap;
					if(ct.childNodes[0].childNodes[0].childNodes.length >= 4)
					{
						this.descTextId = Ext.id();
						this.body.dom.style.borderBottomWidth = '0px';
						Ext.DomHelper.insertHtml('beforeEnd',this.ctWrap,'<div id="'+this.descTextId+'" class="x-panel-body" style="height:25px;border-top:0;border-left:1px solid #99bbe8;border-right:1px solid #99bbe8;border-bottom:1px solid #99bbe8;"><table cellspacing="0" width="100%" height="100%" style="font-size:24px;text-align:center;"><tr><td>'+this.descText+'</td></tr></table></div>');
						this.computeDescTextSize();
					}
					else
					{
						this.createDescText.defer(100,this,[ct]);
					}
				},
				createDescTitle : function(o,arg){
					var ct = this.ctWrap;
					if(ct.childNodes[0].childNodes[0].childNodes.length >= 4 || (ct.childNodes[1] && ct.childNodes[1].childNodes[0] && ct.childNodes[1].childNodes[0].childNodes.length >= 4))
					{
						ct.childNodes[0].childNodes[0].style.borderTopWidth = '0px';
						var descTitle = "";
						if(typeof this.descTitle == "number")
						{
							var titleData = ResultFactory.newResult(this.descTitle);
							titleData.async = false;
							titleData.onLoad = function(oXml)
							{
								var oRows = oXml.selectSingleNode("/root/rowSet");
								descTitle = oRows.childNodes[0].text;
							}
							titleData.send(Result.FORCE_GET,o,arg);
						}
						else
						{
							descTitle = this.descTitle;
						}
						if(this.titleId)
						{
							document.getElementById(this.titleId).innerHTML = descTitle;
						}
						else
						{
							this.titleId = Ext.id();
							Ext.DomHelper.insertHtml('afterbegin',this.ctWrap,'<div class="x-panel-body" style="border-top:1px solid #99bbe8;border-left:1px solid #99bbe8;border-right:1px solid #99bbe8;border-bottom:0px;"><table cellspacing="0" width="100%" height="100%" style="font-size:24px;text-align:center;"><tr><td><div id='+this.titleId+'>'+descTitle+'</div></td></tr></table></div>');
						}
						this.computeDescTitleSize();
					}
					else
					{
						this.createDescTitle.defer(100,this,[ct,o,arg]);
					}
				},
				createDescLeft : function(o,arg){
					var ct = this.ctWrap;
					var idx = 0;
					if(this.descTitle) idx = 1;
					if(ct.childNodes[idx] && ct.childNodes[idx].childNodes[0].childNodes.length >= 4 ||(ct.childNodes[idx] && ct.childNodes[idx].childNodes[1] && ct.childNodes[idx].childNodes[1].childNodes.length >= 4))
					{
						var descLeft = "";
						if(typeof this.descLeft == "number")
						{
							var descLeftData = ResultFactory.newResult(this.descLeft);
							descLeftData.async = false;
							descLeftData.onLoad = function(oXml)
							{
								var oRows = oXml.selectSingleNode("/root/rowSet");
								descLeft = oRows.childNodes[0].text;
							}
							descLeftData.send(Result.FORCE_GET,o,arg);
						}
						else
						{
							descLeft = this.descLeft;
						}
						if(this.descLeftId)
						{
							document.getElementById(this.descLeftId).innerHTML = descLeft;
						}
						else
						{
							this.descLeftId = Ext.id();
							var left = ct.offsetLeft;
							var top = ct.offsetTop;
							var height = ct.childNodes[idx].offsetHeight;
							var width = ct.childNodes[idx].offsetWidth;
							Ext.DomHelper.insertHtml('afterbegin',this.ctWrap.childNodes[idx],'<div style="padding:3px;z-index:99999999;position:absolute;left:'+left+'px;top:'+top+'px;height:'+height+'px;width:'+width+'px;" id="'+this.descLeftId+'">'+descLeft+'</div>');							
							this.doLayout();
							this.descLeftInited = true;
							this.descFinish ++;
						}
					}
					else
					{
						this.createDescLeft.defer(100,this,[ct,o,arg]);
					}
				},
				computeDescTextSize : function(){
					if(!this.descInited)
					{
						var height = this.ctWrap.childNodes[0].childNodes[0].style.height.replace("px","");
						this.ctWrap.childNodes[0].childNodes[0].style.height = height - 25;
						this.ctWrap.childNodes[0].childNodes[0].childNodes[3].style.height = this.ctWrap.childNodes[0].childNodes[0].childNodes[3].offsetHeight - document.getElementById(this.descTextId).offsetHeight;
						this.ctWrap.childNodes[0].childNodes[0].childNodes[3].style.width = this.ctWrap.childNodes[0].childNodes[0].offsetWidth;
						this.doLayout();
						this.descInited = true;
						this.descFinish ++;
					}
				},
				computeDescTitleSize : function(){
					if(!this.descTitleInited)
					{
						var vHeight = this.ctWrap.childNodes[1].childNodes[0].childNodes[3].offsetHeight - document.getElementById(this.titleId).offsetHeight;
						if(vHeight > 0)
						{
							this.ctWrap.childNodes[1].childNodes[0].childNodes[3].style.height = vHeight - 1;
							this.ctWrap.childNodes[1].childNodes[0].childNodes[3].style.width = this.ctWrap.childNodes[1].childNodes[0].offsetWidth-2;
							this.ctWrap.childNodes[1].style.height = this.ctWrap.childNodes[1].offsetHeight - document.getElementById(this.titleId).offsetHeight - 1;
							this.ctWrap.childNodes[1].childNodes[0].style.height = this.ctWrap.childNodes[1].offsetHeight;
							this.doLayout();
							this.descTitleInited = true;
							this.descFinish ++;
						}
						else
						{
							this.computeDescTitleSize.defer(100,this);							
						}
					}
					else
					{
						this.computeDescTitleSize.defer(100,this);
					}
				},
				search 	: function(o, arg) {
					this.showMask();
					this.buildSendXml(o,arg);
					var sendUrl = this.buildSendUrl();
					drawChart(sendUrl, this.body.dom.id);
					this.hideMask();
					if(this.descText)
					{
						this.createDescText(this.ctWrap);
						if(this.firstSearch)
							this.descCount ++;
					}
					if(this.descTitle)
					{
						this.createDescTitle(this.ctWrap,o,arg);
						if(this.firstSearch)
							this.descCount ++;
					}
					if(this.descLeft)
					{
						this.createDescLeft(this.ctWrap,o,arg);
						if(this.firstSearch)
							this.descCount ++;
					}
					if((this.descText || this.descTitle || this.descLeft) && this.firstSearch)
					{
						this.renderChart(o, arg);
					}
				},
				renderChart : function(o, arg){
					if(this.descCount == this.descFinish)
					{
						this.search(o, arg);
						this.firstSearch = false;
					}
					else
					{
						this.renderChart.defer(100,this,[o, arg]);
					}
				},
				renderBigPipeChart : function(chartData){
					this.body.dom.innerHTML = chartData;
					this.firstSearch = false;
				},
				showMask : function(){			
        			if(!this.loadMask){
        				this.loadMask = new Ext.LoadMask(this.body,{ msg : this.msg, cls : this.msgCls});
        			}
        			this.loadMask.show();
				},
				hideMask : function(){
					if(this.loadMask){ this.loadMask.hide();};
				},
				buildSendUrl : function() {
					var height = this.body.dom.style.height.replace("px", "");
					var width = this.body.dom.style.width.replace("px", "");
					var sendParams = ["method=" + this.method, "width=" + width,"height=" + height,"xmlParam="+this.sendXml.xml];
					var sendUrl = getSendUrl(FMW_CHART_CTRL_URL, sendParams);
					return sendUrl;
				},
				buildSendXml : function(o, arg){
					var sendXml = this.result.buildSendXml(o,arg);
					var root = sendXml.selectSingleNode("root");
					var chartCfgId = sendXml.createElement("chartCfgId");
					var chartCfgTable =  sendXml.createElement("chartCfgTable");
					chartCfgId.text = this.chartCfgId;
					chartCfgTable.text = this.chartCfgTable;
					root.appendChild(chartCfgId);
					root.appendChild(chartCfgTable);
					this.sendXml = sendXml;
				}
			});
	return FmwChart;
})();
Ext.ComponentMgr.registerType('resultFmwChart', ResultFmwChart);