function convertToGrid()
{
	var typeArr = ['resultChart','FusionChart','resultFmwChart'];
	for(var i = 0, type; type = typeArr[i]; i++)
	{
		var panelArr = GLOBAL_MAIN_RESULT_PANEL.panel.findByType(type);
		for(var k = 0, oPanel; oPanel = panelArr[k]; k++)
		{
			var obj = new Ext.data.ResultGrid({
				result : (typeof oPanel.result == 'object') ? oPanel.result.id : oPanel.result
			});
			var oct = oPanel.ownerCt;
			oct.remove(oPanel);
			oct.add(obj);
			oct.doLayout();
			obj.search(Global.urlParam,GLOBAL_MAIN_RESULT_PANEL.panel.paramByToolbar);
		}
	}
}

function convertToChart()
{
	var panelArr = GLOBAL_MAIN_RESULT_PANEL.panel.findByType('resultGrid');
	for(var k = 0, oPanel; oPanel = panelArr[k]; k++)
	{
		var obj = new ResultChart({
			result : oPanel.result.id
		});
		var oct = oPanel.ownerCt;
		oct.remove(oPanel);
		oct.add(obj);
		oct.doLayout();
		obj.search(Global.urlParam,GLOBAL_MAIN_RESULT_PANEL.panel.paramByToolbar);
	}
}

function convertToFmwChart()
{
	var panelArr = GLOBAL_MAIN_RESULT_PANEL.panel.findByType('resultGrid');
	for(var k = 0, oPanel; oPanel = panelArr[k]; k++)
	{
		var obj = new ResultFmwChart({
			result : oPanel.result.id
		});
		var oct = oPanel.ownerCt;
		oct.remove(oPanel);
		oct.add(obj);
		oct.doLayout();
		obj.search(Global.urlParam,GLOBAL_MAIN_RESULT_PANEL.panel.paramByToolbar);
	}
}

function convertToMeter()
{
	var panelArr = GLOBAL_MAIN_RESULT_PANEL.panel.findByType('resultGrid');
	for(var k = 0, oPanel; oPanel = panelArr[k]; k++)
	{
		var obj = new ResultFmwChart({
			result : oPanel.result.id,
			cfgFrom : 'METER_CHART_CFG'
		});
		var oct = oPanel.ownerCt;
		oct.remove(oPanel);
		oct.add(obj);
		oct.doLayout();
		obj.search(Global.urlParam,GLOBAL_MAIN_RESULT_PANEL.panel.paramByToolbar);
	}
}

function convertToFusChart()
{
	var panelArr = GLOBAL_MAIN_RESULT_PANEL.panel.findByType('resultGrid');
	for(var k = 0, oPanel; oPanel = panelArr[k]; k++)
	{
		var obj = new FusionChart({
			result : oPanel.result.id
		});
		var oct = oPanel.ownerCt;
		oct.remove(oPanel);
		oct.add(obj);
		oct.doLayout();
		obj.search(Global.urlParam,GLOBAL_MAIN_RESULT_PANEL.panel.paramByToolbar);
	}
}