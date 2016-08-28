/**
 * @class Ext.ux.form.TimeField
 * @extends Ext.ux.form.FieldPanel
 * This class creates a time field using spinners.
 * @author: chenjw
 * @constructor
 * Creates a new FieldPanel
 * @param {Object} config Configuration options
 */
Ext.namespace("Ext.ux.form");
Ext.ux.form.CronField = Ext.extend(Ext.ux.form.FieldPanel, {
    border: false,
    baseCls: 'x-plain',
    layout: 'table',
    token: ' ',
    value: '00 00 * * *',
    fieldWidth: 40,
    maskRe : /^[0-9|*|,|-]{0,1}$/,
	layoutConfig: {
		columns: 10
	},
	width: 250,
	defaults:{
		msgTarget : 'title',
		maxLength: 20,
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

        if(!value || valid) false;
        var vs = value.split(this.token);
        if(vs.length<5) return false;
        for(var j=0;j<vs.length;j++) {
            if(vs[j]=="") return false;
        }
        return true;
    },
	// private
	initComponent: function()
	{
		this.items = [{
		    maskRe: this.maskRe,
			xtype: 'textfield',
			width: this.fieldWidth,
			name: this.name + 'M'
		}, {
			html: '分',
			baseCls: null,
			border: false
		}, {
            maskRe: this.maskRe,
			xtype: 'textfield',
			width: this.fieldWidth,
			name: this.name + 'H'
		}, {
			html: '时',
			baseCls: null,
			border: false
		}, {
            maskRe: this.maskRe,
			xtype: 'textfield',
			width: this.fieldWidth,
			name: this.name + 'D'
		}, {
			html: '日',
			baseCls: null,
			border: false
		}, {
            maskRe: this.maskRe,
			xtype: 'textfield',
			width: this.fieldWidth,
			name: this.name + 'M'
		}, {
			html: '月',
			baseCls: null,
			border: false
		}, {
            maskRe: this.maskRe,
			xtype: 'textfield',
			width: this.fieldWidth,
			name: this.name + 'W'
		}, {
			html: '周',
			baseCls: null,
			border: false
		}]
		Ext.ux.form.TimeField.superclass.initComponent.call(this);
	}
});
Ext.reg('itnmCronField', Ext.ux.form.CronField);