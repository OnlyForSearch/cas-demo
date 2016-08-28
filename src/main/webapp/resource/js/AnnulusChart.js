$.ajaxSetup({
	async: false,
	cache: true
});

if (typeof templateUtil == 'undefined')
    $.getScript('/resource/js/strTemplateUtil.js');

if (typeof Raphael == 'undefined')
	$.getScript('/resource/js/raphael-min.js');

$.ajaxSetup({
	async: true,
	cache: false
});

/*
 * ��Բ��ͼ�Ĺ���
 * e.g.
 *		var ac = new AnnulusChart({
 *			domId: 'xdivId',
 *			value: 30,
 *			total: 100
 *		});
 *		// ����ѡ��ο� defaults ����
 *
 *		// ����Բ��ֵ��
 *		ac.setValue(75, 100, otherParams); // otherParams���Զ��������������� e.g. {regionName: '����'}, ��ֵ������ tipTpl
 */
function AnnulusChart(opt) {
    var defaults = {
        domId: null,		// ͼ���� dom id

        width: 150,				 // Բ�����
        borderWidth: 12,		 // Բ���߿��С
        backgroundColor: '#eee', // Բ����ɫ
        color: '#b8897f',        // Բ������������ɫ

        // Բ������ֵչʾ����
        tipCfg: {
            'color': null,		// Ĭ��Ϊ��������ɫ
            'font-size': 18,	// �����С
            'font-family': '΢���ź�',
            'font-weight': 'normal',
            'opacity': 1        // ͸����
        },
        // ������ʾ��ģ�壬֧�ֵĲ����У�{total} (����)��{value} (ֵ), {valuePercent} (ֵ�ٷֱ�), {leaveValue} (��ֵ,�� total-value), {leaveValuePercent}
        tipTpl: '{valuePercent}',

        secondTipCfg: {
            'color': '#999',
            'font-size': 12,
            'font-family': '΢���ź�',
            'font-weight': 'normal',
            'opacity': 1
        },
        secondTipTpl: null, // �ڶ�������չʾ��ģ�壬ͬ tipTpl
        
        tipOverlap: false,  // չʾ�� tip��secondTip �Ƿ������ص�

        value: null,   // ֵ
        total: null,   // ����

        speed: 0	   // ����ʱ��(��λ��ms)
    };

    this.textHolder = {};

    var self = this;
    this.o = o = $.extend(true, defaults, opt);

    if (o.domId == null) {
        alert('domId ��������Ϊ��');
        return;
    }

    if (o.value != null && o.total != null) {
        o.value = parseFloat(o.value);
        o.total = parseFloat(o.total);
        if (o.value > o.total)
            o.total = o.value;
    }

    function createPaper() {
        var paper = Raphael(o.domId, o.width + 3, o.width + 3);

        paper.customAttributes.arc = function (xloc, yloc, value, total, R) {
            var alpha = 360 / total * value,
                a = (90 - alpha) * Math.PI / 180,
                x = xloc + R * Math.cos(a),
                y = yloc - R * Math.sin(a),
                path;

            if (total == value) {
                path = [
                    ["M", xloc, yloc - R],
                    ["A", R, R, 0, 1, 1, xloc - 0.01, yloc - R]
                ];
            } else {
                path = [
                    ["M", xloc, yloc - R],
                    ["A", R, R, 0, +(alpha > 180), 1, x, y]
                ];
            }

            return {
                path: path
            };
        };

        return paper;
    }

    function init() {
        var o = self.o;

        $.extend(o, {
            r: o.width/2 - o.borderWidth/2, // �뾶
            w: o.borderWidth,
            x: o.width/2,
            y: o.width/2,
            bc: o.backgroundColor,
            c: o.color
        });

        initTipCfg();
    }

    function startDraw() {
        var o = self.o;
        self._paper.circle(o.x, o.y, o.r).attr({
            'stroke': o.bc,
            'stroke-width': o.w
        });

        self.myArc = self._paper.path().attr({
            'stroke': o.c,
            'stroke-width': o.w
        });
    }

    function initTipCfg() {
        var o = self.o;

        o.showTip = (o.tipTpl != null && o.tipTpl != '');
        o.secondShowTip = (o.secondTipTpl != null && o.secondTipTpl != null);

        // ������ʾ���ֵ� X,Y ����
        if (o.showTip) {
            $.extend(o.tipCfg, {
                x: o.x,
                y: o.y,
                tpl: o.tipTpl
            });

            if (o.tipCfg.color == null)
                o.tipCfg.color = o.color;
        }

        if (o.secondShowTip) {
            var sp = 0;

            if (!o.tipOverlap && o.showTip) {
                sp = 10;
                $.extend(o.tipCfg, {
                    y: o.y - sp
                });
            }

            $.extend(o.secondTipCfg, {
                x: o.x,
                y: o.y + sp,
                tpl: o.secondTipTpl
            });
        }
    }

    this._paper = createPaper();
    init();
    startDraw();

    if (o.value != null && o.total != null)
        this.setValue(o.value, o.total);
}

AnnulusChart.prototype = {
    text: function(name, cfg) {
        if (this.textHolder[name]) {
            this.textHolder[name].attr('text', templateUtil.getStr(cfg.tpl, this.o.datas));
        } else {
            this.textHolder[name] = this._paper.text(cfg.x, cfg.y, templateUtil.getStr(cfg.tpl, this.o.datas)).attr({
                'fill': cfg.color,
                'font-size': cfg['font-size'],
                'font-family': cfg['font-family'],
                'font-weight': cfg['font-weight'],
                opacity: cfg.opacity
            });
        }
    },

    // ���ݽ��չʾ
    updateDisplay: function() {
        if (this.o.showTip) {
            this.text('st', this.o.tipCfg);
        }

        if (this.o.secondShowTip) {
            this.text('sst', this.o.secondTipCfg);
        }
    },

    getPercent: function(v, total) {
        return Math.round(v/total*10000)/100 + '%';
    },

    // ����ֵ����ͼ
    setValue: function(value, total, otherParams) {
        if (value == null || value === '' || isNaN(value))
            value = 0;

        value = parseFloat(value);
        if (isNaN(total))
            total = 0;
        else
            total = parseFloat(total);

        var dv = value || 0.0001; // dirty workaround
        this.myArc.animate({
            arc: [this.o.x, this.o.y, dv, total, this.o.r]
        }, this.o.speed, '');

        // ��װ���ݲ�����{total} (����)��{value} (ֵ), {valuePercent} (ֵ�ٷֱ�), {leaveValue} (��ֵ,�� total-value), {leaveValuePercent}
        this.o.datas = $.extend({
            total: total,
            value: value,
            valuePercent: this.getPercent(value, total),
            leaveValue: total - value,
            leaveValuePercent: this.getPercent(total - value, total)
        }, otherParams);

        this.updateDisplay();
    }
};
