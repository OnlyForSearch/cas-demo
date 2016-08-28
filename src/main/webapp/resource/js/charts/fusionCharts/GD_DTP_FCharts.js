var FCharts = function(pChartSwf,pWidth,pHeight){
	var fChart;
	if(pChartSwf=='AnyChart'){
		fChart = new ACharts(pChartSwf,pWidth,pHeight);
	}else{
		fChart =  new FuCharts(pChartSwf,pWidth,pHeight);
	}
	fChart.init();
	return fChart;
}


var FuCharts = function(pChartSwf,pWidth,pHeight){
	this.CHART_SWF = "/resource/js/charts/fusionCharts/";
	this.chartSwf = pChartSwf;
	this.width = pWidth;
	this.height = pHeight;
	this.fChart;
	this.oChart;
	this.rowCount=0;
}

FuCharts.prototype = {
	init : function(){
		var nocache;
		var curDate = new Date();
		nocache = curDate.getTime();
		var chartObj = "chart"+nocache+"id";
		this.oChart = new   FusionCharts(this.CHART_SWF+'/'+this.chartSwf+".swf?nocache="+nocache,chartObj,this.width,this.height);
	},
	write : function(renderTo){
		this.oChart.render(renderTo);
	},
	configure : function(pAttrName,pAttrValue){
		this.oChart.configure(pAttrName,pAttrValue);
	},
	setXMLData : function(pChart){
		this.rowCount = pChart.getAttribute("rowCount");
		if(window.ActiveXObject)
		{
			this.oChart.setXMLData(pChart.xml);
		}
		else
		{
			var xmls = new XMLSerializer();
			var result = xmls.serializeToString(pChart);
			this.oChart.setXMLData(result);	
		}		
	},
	setTransparent : function(isTransparent){
		this.oChart.setTransparent(isTransparent);
	},
	setChartAttribute : function(name,value){
		
	}
}

var ACharts = Ext.extend(FuCharts,{
	init : function(){
		var nocache;
		this.oChart = new AnyChart(this.CHART_SWF+'/AnyChart.swf?nocache='+nocache, this.CHART_SWF+'/Preloader.swf');
		this.oChart.width = this.width;
		this.oChart.height = this.height;
	},
	write : function(renderTo){
		this.oChart.write(renderTo);
	},
	configure : function(pAttrName,pAttrValue){
		
	},
	setTransparent : function(isTransparent){
		if(isTransparent){
			this.oChart.wMode="Transparent" ;
		}
	},
	setChartAttribute : function(name,value){
		
	}
});

