//
function insertTableRows(n,isAbove){
	if(n!=null && n>0 && canInsertTableRows()){
		var objTable=myEditor.objTable
		var newRow=objTable.row.cloneNode(true)
		objTable.row.insertAdjacentElement('afterEnd',newRow)
		//����֮�� newRow ����Ч
		for(var i=objTable.row.cells.length-1;i>=0;i--){
			if(objTable.row.cells[i].rowSpan>1){
				objTable.row.cells[i].rowSpan++;
				newRow.deleteCell(i)
			}else{
				if(isAbove){
					objTable.row.cells[i].innerHTML='&nbsp;'
				}else{
					newRow.cells[i].innerHTML='&nbsp;'
				}
			}
		}
		//�����������з���Ҫ��ĵ�Ԫ��� rowSpan ����
		for(var i=0;i<objTable.row.rowIndex;i++){
			for(var j=0;j<objTable.table.rows[i].cells.length;j++){
				with(objTable.table.rows[i].cells[j]){
					if(rowSpan>1&&rowSpan>objTable.row.rowIndex){
						rowSpan++
					}
				}
			}
		}
		insertTableRows(n-1,isAbove)
		doSameContent()
	}
}
function canInsertTableRows(save){
	if(myEditor.activateWin!='Design') return false;
	if(save)saveSelection();
	var theNode=myEditor.selectionElement
	while(theNode && theNode.tagName!='TD' && theNode.tagName!='TH' && theNode.tagName!='TR')
		theNode=theNode.parentNode;
	if(theNode){
		createTableObject(theNode)
		return true
	}
	return false
}
//
function deleteTableRows(n){
	//ɾ����Ҫ���浱ǰ��ѡ��
	if(n!=null && n>0 && canInsertTableRows(true)){
		var objTable=myEditor.objTable
		//�����������з���Ҫ��ĵ�Ԫ��� rowSpan ����
		for(var i=0;i<objTable.row.rowIndex;i++){
			for(var j=0;j<objTable.table.rows[i].cells.length;j++){
				with(objTable.table.rows[i].cells[j]){
					if(rowSpan+objTable.table.rows[i].rowIndex>objTable.row.rowIndex){
						rowSpan--
					}
				}
			}
			
		}
		//������һ�еĵ�Ԫ����,���Ҫɾ�����еĵ�Ԫ���ǿ��еĻ����Ὣ�˵�Ԫ��������Ƶ���һ���¼ӵĵ�Ԫ����
		var nextRow=objTable.table.rows[objTable.row.rowIndex+1]
		for(var i=0;nextRow&&i<objTable.row.cells.length;i++){
			if(objTable.row.cells[i].rowSpan>1){
				var newCell=objTable.row.cells[i].cloneNode(true)
				if(nextRow.cells[i]){
					newCell=nextRow.cells[i].insertAdjacentElement('beforeBegin',newCell)
				}else{
					newCell=nextRow.cells[i-1].insertAdjacentElement('afterEnd',newCell)
				}
				//������ newCell.rowSpan--,��Ϊ�п���newCell.rowSpan��ֵ���Ǹ�clone��ֵ��,��֪���ǲ���IE��BUG, ;'!
				newCell.rowSpan=parseInt(newCell.outerHTML.replace(/<TD [^<>]*rowSpan=(\d+)[^<>]*>.*/,'$1'))-1
			}
		}
		//��ſ��԰�ȫ��ɾ����
		objTable.table.deleteRow(objTable.row.rowIndex)
		//���ɾ�����к���û��������û�б��⣬��ɾ���˱��
		if(objTable.table.rows.length<1&&!objTable.table.caption){
			objTable.table.removeNode(true)
		}
		deleteTableRows(n-1)
		doSameContent()
	}
}
//
function insertTableColumns(n,isLeft){
	if(n!=null && n>0 && canInsertTableColumns(false)){
		var objTable=myEditor.objTable
		var refIndex	=objTable.cell
						? objTable.row.cells.length-objTable.cell.cellIndex 
						: (isLeft?0:objTable.row.cells.length-1)
		for(var i=0;i<objTable.table.rows.length;i++){
			var row=objTable.table.rows[i]
			var pos = row.cells.length - refIndex
			pos = pos<1?0:pos
			newCell = row.insertCell(isLeft?pos:pos+1)
			newCell.innerHTML = "&nbsp;"
		}
		insertTableColumns(n-1,isLeft)
		doSameContent()
	}
}
function canInsertTableColumns(save){
	return canInsertTableRows(save)
}
//
function deleteTableColumns(n){
	if(n!=null && n>0 && canInsertTableColumns(true)){
		var objTable=myEditor.objTable
		var refIndex	=objTable.cell
						? objTable.row.cells.length-objTable.cell.cellIndex 
						: (isLeft?0:objTable.row.cells.length-1)
		for(var i=0;i<objTable.table.rows.length;i++){
			var row=objTable.table.rows[i]
			var pos = row.cells.length - refIndex
			pos = pos<1?0:pos
			//��Ԫ�����ʱ
			if(row.cells[pos].rowSpan>1){
				i+=row.cells[pos].rowSpan-1
			}
			//��Ԫ�����ʱ
			if (row.cells[pos].colSpan > 1) {
				row.cells[pos].colSpan = row.cells[pos].colSpan - 1
			} else { 
				row.deleteCell(pos)
			}
		}
		deleteTableColumns(n-1)
		if(objTable.table.cells.length<1&&!objTable.table.caption){
			objTable.table.removeNode(true)
		}
		doSameContent()
	}
}
//
function mergeTableColumns(n,isAbove){
	if(n!=null && n>0 && canMergeTableColumns(false)
	&& myEditor.objTable.cell.cellIndex+1!=myEditor.objTable.row.cells.length){
		var objTable=myEditor.objTable
		//�������ǻ�û�ж���������Ԫ���Ƿ�������������,���п��е����
		if(objTable.cell.rowSpan==objTable.cell.nextSibling.rowSpan){
			objTable.cell.innerHTML+=objTable.cell.nextSibling.innerHTML
			objTable.cell.colSpan+=objTable.cell.nextSibling.colSpan
			objTable.row.deleteCell(objTable.cell.cellIndex+1)
			return
		}
		doSameContent()
	}
}
function mergeTableRows(n,isAbove){
	if(n!=null && n>0 && canMergeTableColumns(false) 
	&& myEditor.objTable.row.rowIndex+1!=myEditor.objTable.table.rows.length){
		var objTable=myEditor.objTable
		var nextRow=objTable.table.rows[objTable.row.rowIndex+objTable.cell.rowSpan]
		objTable.cell.innerHTML+=nextRow.cells[objTable.cell.cellIndex].innerHTML
		objTable.cell.rowSpan+=nextRow.cells[objTable.cell.cellIndex].rowSpan
		nextRow.deleteCell(objTable.cell.cellIndex)
		doSameContent()
	}
}
function canMergeTableColumns(save){
	return canInsertTableRows(save) 
	&& myEditor.objTable.cell 
}
//
function createTableObject(theNode){
	myEditor.objTable={}
	switch(theNode.tagName){
		case 'TD':
		case 'TH':
			myEditor.objTable.cell=theNode
			theNode=theNode.parentNode
		case 'TR':
			myEditor.objTable.row=theNode
			theNode=theNode.parentNode
		case 'THEAD':
		case 'TBODY':
		case 'TFOOT':
			myEditor.objTable.body=theNode
			theNode=theNode.parentNode
		case 'TABLE':
			myEditor.objTable.table=theNode
	}
}