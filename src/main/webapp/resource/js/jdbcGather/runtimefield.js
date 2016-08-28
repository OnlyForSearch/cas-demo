/**
 * @class Ext.ux.form.TimeField
 * @extends Ext.ux.form.FieldPanel
 * This class creates a time field using spinners.
 * @license: BSD
 * @author: Robert B. Williams (extjs id: vtswingkid)
 * @constructor
 * Creates a new FieldPanel
 * @param {Object} config Configuration options
 */
Ext.namespace("Ext.ux.form");
Ext.ux.form.RunTimeField = Ext.extend(Ext.ux.form.FieldPanel, {
    border: false,
    baseCls: 'x-plain',
    layout: 'table',
    token: ' ',
    value: '00 00 * * *',
    fieldWidth: 40,
    maskRe : /^[0-9|*]{0,1}$/,
    strategyGroup: [
        new Ext.ux.form.Spinner.TimeStrategy({
            format: 'i',
            incrementConstant: Date.MINUTE
        }),
        new Ext.ux.form.Spinner.TimeStrategy({
            format: 'H',
            incrementConstant: Date.HOUR
        }),
        new Ext.ux.form.Spinner.DateStrategy({
            format: 'd',
            incrementConstant: Date.DAY,
            alternateIncrementValue: 1,
            alternateIncrementConstant: Date.DAY
        }),
        new Ext.ux.form.Spinner.DateStrategy({
            format: 'm',
            incrementConstant: Date.MONTH,
            alternateIncrementValue: 1,
            alternateIncrementConstant: Date.MONTH
        }),
        new Ext.ux.form.Spinner.NumberStrategy({
            incrementConstant: 1,
            minValue: 1,
            maxValue: 7
        })
    ],
	layoutConfig: {
		columns: 10
	},
	width: 250,
	defaults:{
		msgTarget : 'title',
		maxLength: 2,
		allowBlank : false,
		listeners: {
			'focus': function(f){
				f.selectText();
			}
		}
	},
	setRawValue: function(v){
		if(!v.length) v=this.value;
		Ext.ux.form.TimeField.superclass.setRawValue.call(this, v);
	},
    validateValue : function(value){
    	var valid = true;
		this.items.each(function(f)
		{
			if (f.isFormField && valid && !f.isValid()) valid = false;
		},this);
		if(valid && value.length) { 
		   var vs = value.split(this.token);
           if(parseInt(vs[0], 10) < 0 || parseInt(vs[0], 10) > 59) return false;
           if(parseInt(vs[1], 10) < 0 || parseInt(vs[1], 10) > 23) return false;
           if(vs[2]!='*' && isNaN(vs[2]) || parseInt(vs[2], 10) < 1 || parseInt(vs[2], 10) > 31) return false;
           if(vs[3]!='*' && isNaN(vs[3]) || parseInt(vs[3], 10) < 1 || parseInt(vs[3], 10) > 12) return false;
           if(vs[4]!='*' && isNaN(vs[4]) || parseInt(vs[4], 10) < 1 || parseInt(vs[4], 10) > 7) return false;
		}else {
		  return false;
		}
        return true;
    },
	// private
	initComponent: function()
	{
		this.items = [{
		    maskRe: this.maskRe,
			xtype: 'uxspinner',
			width: this.fieldWidth,
			name: this.name + 'M',
			strategy: this.strategyGroup[0]
		}, {
			html: '分',
			baseCls: null,
			bodyStyle: 'font-weight: bold;',
			border: false
		}, {
            maskRe: this.maskRe,
			xtype: 'uxspinner',
			width: this.fieldWidth,
			name: this.name + 'H',
			strategy: this.strategyGroup[1]
		}, {
			html: '时',
			baseCls: null,
			bodyStyle: 'font-weight: bold;',
			border: false
		}, {
            maskRe: this.maskRe,
			xtype: 'uxspinner',
			width: this.fieldWidth,
			name: this.name + 'D',
			strategy: this.strategyGroup[2]
		}, {
			html: '日',
			baseCls: null,
			bodyStyle: 'font-weight: bold;',
			border: false		
		}, {
            maskRe: this.maskRe,
			xtype: 'uxspinner',
			width: this.fieldWidth,
			name: this.name + 'M',
			strategy: this.strategyGroup[3]
		}, {
			html: '月',
			baseCls: null,
			bodyStyle: 'font-weight: bold;',
			border: false		
		}, {
            maskRe: this.maskRe,
			xtype: 'uxspinner',
			width: this.fieldWidth,
			name: this.name + 'W',
			strategy: this.strategyGroup[4]
		}, {
			html: '周',
			baseCls: null,
			bodyStyle: 'font-weight: bold;',
			border: false		
		}]
		Ext.ux.form.TimeField.superclass.initComponent.call(this);
	}
});
Ext.reg('uxruntimefield', Ext.ux.form.RunTimeField);