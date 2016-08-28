/**
 * �ϲ������ͬ��Ԫ��Ĳ��
 * ���ò�����
 * startRow:	��ʼ�ϲ�����(��0��ʼ����)��Ĭ��ֵ 1
 * cols:		��Ҫ�ĺϲ�����(��0��ʼ����)��Ĭ��ֵ 0�������ö��ŷָ�("1,2,3")
 * hideOrRemove: �ϲ����ĵ�Ԫ�����ػ���ɾ����Ĭ�����أ�ѡ�'hide', 'remove'
 * seqCol:		�������ڵ��У����ô�ֵʱ�����Զ����µ����ϲ���Ԫ�������
 * mergerByRowAttr: ���ձ�� tr ����ֵ(��idx)�ϲ����ٽ���tr�� idx ����ֵһ���ĵĵ�Ԫ�񽫺ϲ���δ���ô�ֵʱ��Ĭ�Ϻϲ�����������ͬ�ĵ�Ԫ��
 * eg.
 *  $("#tableId").mergerTableTD({startRow: 1, cols: "2"}); �ӵ� 2 �п�ʼ�ϲ��� 3 ��
 * 	$("#tableId").mergerTableTD({cols: 2}); �ϲ��� 3 ��
 * 	$("#tableID").mergerTableTD({cols: "0,2"}); �ϲ��� 1 �к͵� 3 ��
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
		
		// ���ô���ϲ���Ԫ��ĺ���
		var cellHandler;
		if (settings.hideOrRemove == "hide")
			cellHandler = hideCell; 
		else
			cellHandler = removeCell;		

		var mergerCellsByContent = function(table, startRow, colNum) {
			var rowspan = 1;
			var commonTRObj = table.find("tr").not(":hidden").eq(startRow);
			var commonTDName = commonTRObj.find("td").eq(colNum).html();
				
			// ֻ�ϲ��ɼ��ĵ�Ԫ��
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

			// ֻ�ϲ��ɼ��ĵ�Ԫ��
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
		// ���ϲ�����ɾ����Ԫ��ʱ���ϲ�˳�����������п�ʼ����ֹǰ����ɾ����������ȡ����
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