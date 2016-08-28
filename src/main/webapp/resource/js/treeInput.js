TreeInput = function()
{
	var ua = navigator.userAgent.toLowerCase();
	var isFireFox = !/(trident|msie)/.test(ua);

	var TOP_LINE = {
		topLine0 : 'rminus.gif',
		topLine1 : 'rplus.gif',
		topLine2 : 'r.gif'
	};
	var BOTTOM_LINE = {
		bottomLine0 : 'lminus.gif',
		bottomLine1 : 'lplus.gif',
		bottomLine2 : 'l.gif'
	};
	var OTHER_LINE = {
		otherLine0 : 'tminus.gif',
		otherLine1 : 'tplus.gif',
		otherLine2 : 't.gif'
	};
	var BACKGROUND_LINE = 'i.gif';
	var WAIT_ICO = 'spinner.gif';
	var defaultIco = 'treeItem.gif';
	var defaultParentIco = 'treeItem.gif';

	if (isFireFox)
	{
		XMLDocument.prototype.selectSingleNode = Element.prototype.selectSingleNode = function(
				xpath)
		{
			var x = this.selectNodes(xpath)
			if (!x || x.length < 1)
				return null;
			return x[0];
		}
		XMLDocument.prototype.selectNodes = Element.prototype.selectNodes = function(
				xpath)
		{
			var xpe = new XPathEvaluator();
			var nsResolver = xpe.createNSResolver(this.ownerDocument == null
					? this.documentElement
					: this.ownerDocument.documentElement);
			var result = xpe.evaluate(xpath, this, nsResolver, 0, null);
			var found = [];
			var res;
			while (res = result.iterateNext())
				found.push(res);
			return found;
		}
	}

	var getUniqueID = function()
	{
		var i = 0;
		var name = 'treeInput_'
		return function()
		{
			return name + (++i);
		}
	}()

	function setXslAttribute(name, value, oXslDoc)
	{
		if (value != null)
		{
			switch (value.constructor)
			{
				case String :
					value = "'" + value + "'";
					break;
				case Boolean :
					value = value + "()";
					break;
			}
			name = '/xsl:stylesheet/xsl:variable[@name="' + name + '"]';
			oXslDoc.selectSingleNode(name).setAttribute("select", value);
		}
	}

	function setXslAttributeArray(obj, oXslDoc)
	{
		var key
		for (key in obj)
		{
			setXslAttribute(key, obj[key], oXslDoc);
		}
	}

	function changeImgSrc(oItemImg, state)
	{
		oItemImg.src = oItemImg.getAttribute("src" + state);
		oItemImg.imgType = state;
	}

	var Class = function(cfg)
	{
		this.iptEl;
		this.id = getUniqueID();
		this.cfg = cfg;
		this.value;
		this.text;
		this.width = 160;
		this.btn;
		this.win;
		this.winLeft;
		this.winTop;
		this.isShow = false;
		this.xslDoc;
		this.overNode;
	}

	Class.methods({
		hide : function()
		{
			this.win.style.display = 'none';
		},
		showAt : function(oEl)
		{
			var sHtml = '<div>1</div>';
			var self = this;
			if (isFireFox)
			{
				sHtml = '<div id="'
						+ this.id
						+ '" style="height:20px;width:'
						+ this.width
						+ 'px;border:1px solid #ABABAB">'
						+ '<table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%">'
						+ '<tr>'
						+ '<td width="100%" style="border-right: 1px solid #ABABAB"><input type="text" id="id_ipt" autocomplete="off" style="border:0px;width:100%;font-size:9pt;" readonly="readonly"></td>'
						+ '<td><button style="width:16px;background:#E6E4DF;font-size:7pt;border:0px;height:100%" id="id_btn" hidefocus="true">&#9660;</button></td>'
						+ '</tr>'
						+ '</table>'
						+ '</div>'
						+ '<div style="position:absolute;height:200px;border:1px solid black;overflow:hidden;display:none">'
						+ '<div style="width:100%;height:173px;overflow:auto;padding:3 2 2 3;background-color:#F7FAFD"></div>'
						+ '<div style="width:100%;height:19px;text-align:right;padding:4 5 0 0;font-size:9pt;background-color:#D5EAFF;overflow:hidden;cursor:pointer;color:#284997">[&nbsp;Çå¿Õ&nbsp;]</div>';
				oEl.innerHTML = sHtml;
				this.iptEl = document.getElementById(this.id);
				this.popLeft = this.iptEl.getBoundingClientRect().left;
				this.popTop = this.iptEl.getBoundingClientRect().top;
				this.btn = this.iptEl.firstChild.rows[0].cells[1].firstChild;
				this.textEl = this.iptEl.firstChild.rows[0].cells[0].firstChild;
				this.win = this.iptEl.nextSibling;
				this.win.style.width = this.iptEl.offsetWidth - 2;
				this.clearBtn = this.win.lastChild;
				this.clearBtn.addEventListener('click', function(e)
						{
							self.hide();
							self.isShow = false;
							self.textEl.value = "";
							self.value = "";
							self.text = "";
						});

				this.xslDoc = document.implementation.createDocument("", "",
						null);
				this.xslDoc.async = false;
				this.xslDoc.load("/resource/xsl/XMLTree.xsl");
				setXslAttribute('IcoUrl', "/resource/image/ico/", this.xslDoc);
				setXslAttribute('LineUrl', "/resource/image/line/", this.xslDoc);
				setXslAttributeArray(TOP_LINE, this.xslDoc);
				setXslAttributeArray(BOTTOM_LINE, this.xslDoc);
				setXslAttributeArray(OTHER_LINE, this.xslDoc);
				setXslAttribute('backgroundLine', BACKGROUND_LINE, this.xslDoc);
				setXslAttribute('isShowUnDisplay', false, this.xslDoc);
				setXslAttribute('isDynamicLoad', true, this.xslDoc);
				setXslAttribute('defaultIco', defaultIco, this.xslDoc);
				setXslAttribute('defaultParentIco', defaultParentIco,
						this.xslDoc);
				setXslAttribute('sortAtt', "", this.xslDoc);
				setXslAttribute('parentNodeClickEvent', "", this.xslDoc);
				setXslAttribute('itemOverEvent', "", this.xslDoc);
				setXslAttribute('itemOutEvent', "", this.xslDoc);
				setXslAttribute('itemClickEvent', "", this.xslDoc);
				setXslAttribute('itemDblClickEvent', "", this.xslDoc);
				setXslAttribute('startDragEvent', "", this.xslDoc);
				setXslAttribute('dragEvent', "", this.xslDoc);
				setXslAttribute('endDragEvent', "", this.xslDoc);
				setXslAttribute('rightClickEvent', "", this.xslDoc);

				var transformNode = function(oXmlDom, oXslDom)
				{
					var oProcessor = new XSLTProcessor();
					oProcessor.importStylesheet(oXslDom);
					var oResultDom = oProcessor.transformToDocument(oXmlDom);

					var oSerializer = new XMLSerializer();
					var sXml = oSerializer.serializeToString(oResultDom,
							"text/xml");
					return sXml;
				}

				this.btn.addEventListener('click', function()
						{
							self.win.style.display = 'block';
							if (!self.isShow)
							{
								self.isShow = true;
								var winEl = self.win.firstChild;

								var sendXml = document.implementation
										.createDocument("", "send", null);
								var root = sendXml.documentElement;
								root.setAttribute("cfg", self.cfg);
								root.setAttribute("showRoot", "-1");
								var xmlHttpRequest = new XMLHttpRequest();
								xmlHttpRequest
										.open(
												"post",
												"/servlet/DBTreeAction?action=0",
												false);
								xmlHttpRequest.send(sendXml);

								setXslAttribute('transformType', 1, self.xslDoc);
								setXslAttribute('isShowLineInOnlyNode', false,
										self.xslDoc);
								setXslAttribute('showDepth', 2, self.xslDoc);

								var treeHtml = transformNode(
										xmlHttpRequest.responseXML, self.xslDoc);
								winEl.innerHTML = treeHtml;
							}
						});
				this.win.addEventListener('click', function(e)
				{
					var target = e.target;
					if (target.tagName == 'NOBR' && !target.getAttribute("disabled"))
					{
						self.win.style.display = 'none';
						self.value = target.id;
						self.text = target.innerHTML
						self.textEl.value = self.text;
					}
					if (target.tagName == 'IMG')
					{
						var oItemDiv = getElement(target, "div");
						var oImg = oItemDiv.firstChild
						var type = oItemDiv.getAttribute("type");
						if (type == 'parentNode')
						{
							var oChildrenDiv = oItemDiv.nextSibling;
							if (oChildrenDiv.style.display == "none")
							{
								oChildrenDiv.style.display = "";
								changeImgSrc(oImg, 0);
							}
							else
							{
								oChildrenDiv.style.display = "none";
								changeImgSrc(oImg, 1);
							}
						}
						else if (type == 'dynamicLoadNode')
						{
							var parentId = oItemDiv.lastChild.id;
							var isLoad = false;
							var sendXml = document.implementation
									.createDocument("", "send", null);
							var root = sendXml.documentElement;
							root.setAttribute("cfg", self.cfg);
							root.setAttribute("showRoot", "-1");

							var paramParent = sendXml.createElement("param");
							paramParent.setAttribute("name",
									"_sys_db_tree_parent_id");
							paramParent.setAttribute("type", "string");
							paramParent.setAttribute("isMultiple", "0");
							paramParent.textContent = parentId;
							root.appendChild(paramParent);

							var xmlHttpRequest = new XMLHttpRequest();
							xmlHttpRequest.open("post",
									"/servlet/DBTreeAction?action=1", false);
							xmlHttpRequest.send(sendXml);

							setXslAttribute('transformType', 2, self.xslDoc);
							setXslAttribute('isShowLineInOnlyNode', true,
									self.xslDoc);
							setXslAttribute('showDepth', 1, self.xslDoc);
							setXslAttribute('isParentLast',
									(oItemDiv.isLast == 'true'), self.xslDoc);
							setXslAttribute('isParentOnlyNode',
									(oItemDiv.isOnlyNode == 'true'),
									self.xslDoc);
							var outHTML = transformNode(
									xmlHttpRequest.responseXML, self.xslDoc);
							if (outHTML != "")
							{
								oItemDiv
										.insertAdjacentHTML('afterEnd', outHTML);
								isLoad = true;
							}
							if (isLoad)
							{
								oItemDiv.setAttribute("type", 'parentNode');
								changeImgSrc(oImg, 0);
							}
						}

					}
					e.stopPropagation();
				});
				this.win.addEventListener('mouseover', function(e)
						{
							var target = e.target;
							if (target.tagName == 'NOBR' && !target.getAttribute("disabled"))
							{
								if (self.overNode)
								{
									self.overNode.style.backgroundColor = '';
									self.overNode.style.border = '';
									self.overNode.style.color = '';
								}
								target.style.backgroundColor = '#808080';
								target.style.border = '1px solid #3F3F3F';
								target.style.color = 'white';
								self.overNode = target;
							}
							e.stopPropagation();
						});
				window.document.addEventListener('click', function(e)
						{
							if (e.target != self.btn)
							{
								self.hide();
							}
						});

			}
			else
			{
				sHtml = '<ie:dbtree id="' + this.id + '" width="' + this.width
						+ '" cfg="' + this.cfg + '"/>'
				oEl.innerHTML = sHtml;
				this.iptEl = document.getElementById(this.id);
			}
		},
		getValue : function()
		{
			if (isFireFox)
			{
				return this.value;
			}
			else
			{
				return this.iptEl.value;
			}
		},
		getText : function()
		{
			if (isFireFox)
			{
				return this.text;
			}
			else
			{
				return this.iptEl.text;
			}
		},
		setValue : function(value)
		{
			if (isFireFox)
			{
				if (value)
				{
					var sendXml = document.implementation.createDocument("",
							"send", null);
					var root = sendXml.documentElement;
					root.setAttribute("cfg", this.cfg);
					root.setAttribute("showRoot", "-1");

					var paramParent = sendXml.createElement("param");
					paramParent.setAttribute("name", "_sys_db_tree_id");
					paramParent.setAttribute("type", "string");
					paramParent.setAttribute("isMultiple", "0");
					paramParent.textContent = value;
					root.appendChild(paramParent);

					var xmlHttpRequest = new XMLHttpRequest();
					xmlHttpRequest.open("post",
							"/servlet/DBTreeAction?action=2", false);
					xmlHttpRequest.send(sendXml);

					this.text = xmlHttpRequest.responseXML
							.selectNodes('/root/rowSet')[0].textContent;
					this.value = value;
					this.textEl.value = this.text;
				}
			}
			else
			{
				this.iptEl.value = value;
			}
		}
	});

	return Class;
}();