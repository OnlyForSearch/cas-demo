/**
 * 合并表格相同单元格的插件
 * 可用参数：
 * startRow:	开始合并的行(从0开始计算)，默认值 1
 * cols:		需要的合并的列(从0开始计算)，默认值 0，多列用逗号分隔("1,2,3")
 * hideOrRemove: 合并掉的单元格，隐藏还是删除，默认隐藏，选项：'hide', 'remove'
 * seqCol:		序列所在的列，配置此值时，将自动重新调整合并单元格的序列
 * mergerByRowAttr: 按照表格 tr 属性值(如idx)合并，临近且tr的 idx 属性值一样的的单元格将合并；未配置此值时，默认合并上下两行相同的单元格
 * eg.
 *  $("#tableId").mergerTableTD({startRow: 1, cols: "2"}); 从第 2 行开始合并第 3 列
 * 	$("#tableId").mergerTableTD({cols: 2}); 合并第 3 列
 * 	$("#tableID").mergerTableTD({cols: "0,2"}); 合并第 1 列和第 3 列
 */
(function($){
	$.fn.mergerTableTD = function(options) {
		var settings = $.extend({
			startRow: 1,
			cols: 0,
			hideOrRemove: 'hide',
			seqCol: null,
			mergerByRowAttr: null
		}, options);
		
		var hideCell = function(td) {
			td.hide();
		}
		
		var removeCell = function(td) {
			td.remove();
		} 
		
		// 设置处理合并单元格的函数
		var cellHandler;
		if (settings.hideOrRemove == "hide")
			cellHandler = hideCell; 
		else
			cellHandler = removeCell;		

		var mergerCellsByContent = function(table, startRow, colNum) {
			var rowspan = 1;
			var commonTRObj = table.find("tr").not(":hidden").eq(startRow);
			var commonTDName = commonTRObj.find("td").eq(colNum).html();
				
			// 只合并可见的单元行
			table.find("tr").not(":hidden").slice(startRow + 1).each(function() {
				var tr = $(this);
				var currentTDName = tr.find("td").eq(colNum).html();
			
				if (currentTDName == commonTDName) {
					cellHandler(tr.find("td").eq(colNum));
					commonTRObj.find("td").eq(colNum).attr("rowspan", ++rowspan);
				} else {
					rowspan = 1;
					commonTRObj = tr;
					commonTDName = currentTDName;
				}
			});			
		}

		var mergerCellsByTR = function(table, startRow, colNumArray) {
			var rowspan = 1;
			var commonTRObj = table.find("tr").not(":hidden").eq(startRow);

			function getTRAttr(tr) {
				return tr.attr(settings.mergerByRowAttr);	
			}

			// 只合并可见的单元行
			table.find("tr").not(":hidden").slice(startRow + 1).each(function() {
				var tr = $(this);
				if (getTRAttr(commonTRObj) == getTRAttr(tr)) {
					++rowspan;
					for (var i = 0; i < colNumArray.length; i++) {
						var colNum = colNumArray[i];

						cellHandler(tr.find("td").eq(colNum));
						commonTRObj.find("td").eq(colNum).attr("rowspan", rowspan);
					}
				} else {
					rowspan = 1;
					commonTRObj = tr;
				}
			});
		}

		var resetSeq = function(table, startRow, seqColNum) {
			var seq = 1;	
			var needRemoveTdNum = 0;

			table.find("tr").not(":hidden").slice(startRow).each(function() {
				var tr = $(this);
				var seqTd = tr.find("td").eq(seqColNum);
				var seqNextTd = tr.find("td").eq(seqColNum + 1);

				if (needRemoveTdNum > 0) {
					cellHandler(seqTd);
					needRemoveTdNum--;
					tr.attr("NEW_INDEX", seq - 1);

					return true;
				}

				tr.attr("NEW_INDEX", seq);

				var mergerNum = seqNextTd.attr("rowspan");
				if (mergerNum > 1) {
					needRemoveTdNum = mergerNum - 1;
				}
				seqTd.attr("rowspan", mergerNum).html(seq);

				seq++;
			});
		}
		
		var colsArray = (settings.cols + "").split(",");
		// 当合并方法删除单元格时，合并顺序必须从最后的列开始，防止前面列删除后，列数获取错误
		if (settings.hideOrRemove != "hide") {
			colsArray.sort(function(a, b) {
				return b - a;
			});
		}

		this.filter("table").each(function() {
			var table = $(this);

			if (settings.mergerByRowAttr != null) {
				mergerCellsByTR(table, settings.startRow, colsArray);
			} else {
				for (var i = 0; i < colsArray.length; i++) {
					mergerCellsByContent(table, settings.startRow, colsArray[i])
				}
			}

			if (settings.seqCol != null) {
				resetSeq(table, settings.startRow, settings.seqCol);	
			}
		});
		
		return this;
	};
})(jQuery);