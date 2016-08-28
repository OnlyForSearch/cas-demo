Ext.grid.AsyncGridView = function(config)
{
	Ext.grid.AsyncGridView.superclass.constructor.call(this, config);
}

Ext.extend(Ext.grid.AsyncGridView, Ext.grid.GridView, {
			renderRowNum		: 10,
			renderStartRow		: 0,
			isContinueAddRender	: true,
			getRenderHtml		: function()
			{
				var count = this.grid.store.getCount();
				var nextRenderStartRow = this.renderStartRow
						+ this.renderRowNum;
				if (nextRenderStartRow >= count)
				{
					nextRenderStartRow = count;
					this.isContinueAddRender = false;
				}
				var markup = this.renderRows(this.renderStartRow,
						nextRenderStartRow - 1);
				this.renderStartRow = nextRenderStartRow;
				return this.templates.body.apply({
							rows	: markup
						});
			},
			renderBody			: function()
			{
				this.renderStartRow = 0;
				return this.getRenderHtml();
			},
			addRenderBody		: function()
			{
				if (this.isContinueAddRender)
				{
					var html = this.getRenderHtml();
					Ext.DomHelper.insertHtml('beforeEnd', this.mainBody.dom,
							html);
					this.addRenderBody.defer(1, this);
				}
				else
				{
					this.processRows(0, true);
					this.fireEvent("refresh", this);
				}
			},
			refresh				: function(headersToo)
			{
				this.fireEvent("beforerefresh", this);
				this.grid.stopEditing(true);
				var result = this.renderBody();
				this.mainBody.update(result);
				if (headersToo === true)
				{
					this.updateHeaders();
					this.updateHeaderSortState();
				}
				this.addRenderBody.defer(1, this);
				this.layout();
				this.applyEmptyText();
			},
			afterRender			: function()
			{
				return null;
			}
		})