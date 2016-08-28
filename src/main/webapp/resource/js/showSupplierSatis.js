function showForm(grid)
	{
		var row = grid.getSelectionModel()
				.getSelected();
		
		if(typeof(row)=='undefined'){
			return;
		}
		var	systemId = row.get("SYSTEM_ID");
		var	suppliersId = row.get("SUPPLIERS_ID");
		curr_window=window.open('/workshop/form/formFile/systemOverallRating.html?systemId='+systemId+'&suppliersId='+suppliersId,'SparePartEdit'+parseInt(1000*Math.random()),'scrollbars=yes,width=780,height=560,resizable=yes');		
}

function showFormZj(systemId,suppliersId)
	{
		curr_window=window.open('/workshop/form/formFile/systemOverallRating.html?systemId='+systemId+'&suppliersId='+suppliersId,'SparePartEdit'+parseInt(1000*Math.random()),'scrollbars=yes,width=780,height=560,resizable=yes');		
}