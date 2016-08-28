function TabViewClass(objname){
	this.name = objname;
	this.topTdStyle = "border-top-width: 1px;"+
		"border-right-width: 2px;"+
		"border-bottom-width: 8px;"+
		"border-left-width: 2px;"+
		"border-top-style: double;"+
		"border-left-style: double;"+
		"border-top-color: #F3F3F3;"+
		"border-right-color: #969597;"+
		"border-left-color: #F3F3F3;"+
		"border-right-style: double;"+
		"cursor: default;"+
                "line-height:18px;"+
		"border-collapse:3px;";

    this.middleTdStyle = "border-top-width: 2px;"+
		"border-top-style: outset;"+
		"border-top-color: #F4F2E8;"+
		"height: 2px;";

	this.bottomTdStyle = "border-right: 1px outset #ECE9D8;"+
		"border-bottom: 1px outset #ECE9D8;"+
		"border-left: 1px double #F4F3EA;";

	this.bgcolor = "#ECE9D8";
        this.contentbgcolor = "#F8F8F8";
	this.panelStyle = "";
	this.valign="top";
	this.maxTabCount = 20;
	this.tabCount = 0;
	this.tabName = new Array();
	this.tabWidth = new Array();

	this.begin = function(tabcount){
		this.maxTabCount = tabcount+1;
		this.tabCount = tabcount;
		var outstr = "";
		document.write('<table  id="'+this.name+'_tabTableForTitle"  border="0" cellpadding="0" cellspacing="0">');
		document.write( '  <tr>');

		for(var i=0;i<parseInt(tabcount);i++){
			document.write('	<td height="30" nowrap id="'+this.name+'_titletd_'+i+'" onmousedown="'+this.name+'.showTab(\''+i+'\')" valign="bottom" ><div  id="'+this.name+'_title_'+i+'"  align="center" style="'+this.topTdStyle+'background-color:'+this.bgcolor+';"></div></td>');
		}
		for(var i=0;i<this.maxTabCount-tabcount;i++){
			document.write('	<td>&nbsp;</td>');
		}
		document.write('  </tr>');
		document.write('  <tr>');
		for(var i=0;i<this.maxTabCount;i++){
			document.write('	<td id="'+this.name+'_below_titletd_'+i+'" style="'+this.middleTdStyle+'" bgcolor="'+this.bgcolor+'"></td>');
		}
		document.write('  </tr>');
                document.write('</table>');
		document.write('<table width="100%" style="'+this.panelStyle+'" id="'+this.name+'_tabTable"  border="0" cellpadding="0" cellspacing="0">');

	};

	this.end = function(selectedIndex){
		document.write('</table>');
		this.ini();
		if(selectedIndex == "" || selectedIndex==null) selectedIndex = 0;
		this.showTab(selectedIndex);
	};

	this.addOptionBegin = function(tabName,tabWidth,contendTdStyle){
		this.tabName.push(tabName);
		if(tabWidth == null) tabWidth = "";
		this.tabWidth.push(tabWidth);
		var outstr = "";
		outstr = outstr + '  <tr id="'+this.name+'_contenttr_'+(this.tabName.length-1)+'" style="display:none;">';
		outstr = outstr + '		<td valign="'+this.valign+'" style="'+this.bottomTdStyle+contendTdStyle+'" colspan="'+this.maxTabCount+'" bgcolor="'+this.contentbgcolor+'">';
		document.write(outstr);
	};

	this.addOptionEnd = function(){
		var outstr = '';
		outstr = outstr + '		</td>';
		outstr = outstr + '  </tr>';
		document.write(outstr);
	};

	this.ini = function(){
		var table = document.getElementById(this.name+"_tabTableForTitle");

		var tr = table.children;
		//给tab赋值
		if(tr[0].tagName == "TBODY"){
			tr = tr[0].children[0];
		}
		var td = tr.children;  //第1行
		for(var i=0;i<this.tabName.length;i++){
			document.getElementById(this.name+"_title_"+i).innerText = this.tabName[i];
			document.getElementById(this.name+"_titletd_"+i).style.width = this.tabWidth[i];
		}
		//document.getElementById("aa").innerText = table.outerHTML;
	}

	this.setContentStyle = function(style){
		this.bottomTdStyle = this.bottomTdStyle + style;
	}

	this.setPanelStyle = function(style){
		this.panelStyle = this.panelStyle + style;
	}

        this.hiddenTabTitle = function(index){
          var id = this.name+"_titletd_"+index;
          var id1 =this.name+"_below_titletd_"+index;
          document.getElementById(id).style.display = "none";
          document.getElementById(id1).style.display = "none";
        }

        this.showTabTitle = function(index){
          var id = this.name+"_titletd_"+index;
          var id1 =this.name+"_below_titletd_"+index;
          document.getElementById(id).style.display = "";
          document.getElementById(id1).style.display = "";
        }

	this.showTab = function(index){

		var table = document.getElementById(this.name+"_tabTableForTitle");
		var tr = table.children;
		if(tr[0].tagName == "TBODY"){
			tr = tr[0].children;
		}

		var tr_line = tr[1];
		var td = tr_line.children;  //第二行

		for(var i=0;i<td.length;i++){

			if(index == i){
				td[i].style.borderTopWidth = "0px";
			}else{
				td[i].style.borderTopWidth = "2px";
			}
		}

		for(var i=0;i<this.tabName.length;i++){
			var td_title = document.getElementById(this.name+"_title_"+i);
			if(index == i){
				td_title.style.height = "22px";
			}else{
				td_title.style.height = "18px";
			}
		}

		for(var i=0;i<this.tabName.length;i++){
			if(index == i){
				document.getElementById(this.name+"_contenttr_"+i).style.display = "block";
			}else{
				document.getElementById(this.name+"_contenttr_"+i).style.display = "none";
			}
		}
	};


}
