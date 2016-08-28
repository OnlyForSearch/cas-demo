//
function insertTableRows(n,isAbove){
	if(n!=null && n>0 && canInsertTableRows()){
		var objTable=myEditor.objTable
		var newRow=objTable.row.cloneNode(true)
		objTable.row.insertAdjacentElement('afterEnd',newRow)
		//插入之后 newRow 才生效
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
		//更新上面所有符合要求的单元格的 rowSpan 属性
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
	//删除可要保存当前的选区
	if(n!=null && n>0 && canInsertTableRows(true)){
		var objTable=myEditor.objTable
		//更新上面所有符合要求的单元格的 rowSpan 属性
		for(var i=0;i<objTable.row.rowIndex;i++){
			for(var j=0;j<objTable.table.rows[i].cells.length;j++){
				with(objTable.table.rows[i].cells[j]){
					if(rowSpan+objTable.table.rows[i].rowIndex>objTable.row.rowIndex){
						rowSpan--
					}
				}
			}
			
		}
		//更新下一行的单元格数,如果要删除的行的单元格是跨行的话，会将此单元格的内容移到下一行新加的单元格中
		var nextRow=objTable.table.rows[objTable.row.rowIndex+1]
		for(var i=0;nextRow&&i<objTable.row.cells.length;i++){
			if(objTable.row.cells[i].rowSpan>1){
				var newCell=objTable.row.cells[i].cloneNode(true)
				if(nextRow.cells[i]){
					newCell=nextRow.cells[i].insertAdjacentElement('beforeBegin',newCell)
				}else{
					newCell=nextRow.cells[i-1].insertAdjacentElement('afterEnd',newCell)
				}
				//不能用 newCell.rowSpan--,因为有可能newCell.rowSpan的值不是刚clone的值了,不知这是不是IE的BUG, ;'!
				newCell.rowSpan=parseInt(newCell.outerHTML.replace(/<TD [^<>]*rowSpan=(\d+)[^<>]*>.*/,'$1'))-1
			}
		}
		//这才可以安全地删除行
		objTable.table.deleteRow(objTable.row.rowIndex)
		//如果删除此行后表格没有行了且没有标题，则删除此表格
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
			//单元格跨行时
			if(row.cells[pos].rowSpan>1){
				i+=row.cells[pos].rowSpan-1
			}
			//单元格跨列时
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
		//这里我们还没判断这两个单元格是否是真正的相邻,如有跨行的情况
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