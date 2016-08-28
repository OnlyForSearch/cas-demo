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
 * 画圆环图的工具
 * e.g.
 *		var ac = new AnnulusChart({
 *			domId: 'xdivId',
 *			value: 30,
 *			total: 100
 *		});
 *		// 其它选项参考 defaults 参数
 *
 *		// 更新圆环值：
 *		ac.setValue(75, 100, otherParams); // otherParams：自定义其他参数对象 e.g. {regionName: '福建'}, 该值仅用于 tipTpl
 */
function AnnulusChart(opt) {
    var defaults = {
        domId: null,		// 图所在 dom id

        width: 150,				 // 圆环宽度
        borderWidth: 12,		 // 圆环边框大小
        backgroundColor: '#eee', // 圆环底色
        color: '#b8897f',        // 圆环数据条的颜色

        // 圆环中数值展示配置
        tipCfg: {
            'color': null,		// 默认为数据条颜色
            'font-size': 18,	// 字体大小
            'font-family': '微软雅黑',
            'font-weight': 'normal',
            'opacity': 1        // 透明度
        },
        // 数据显示的模板，支持的参数有：{total} (总数)，{value} (值), {valuePercent} (值百分比), {leaveValue} (反值,即 total-value), {leaveValuePercent}
        tipTpl: '{valuePercent}',

        secondTipCfg: {
            'color': '#999',
            'font-size': 12,
            'font-family': '微软雅黑',
            'font-weight': 'normal',
            'opacity': 1
        },
        secondTipTpl: null, // 第二行数据展示，模板，同 tipTpl
        
        tipOverlap: false,  // 展示的 tip、secondTip 是否允许重叠

        value: null,   // 值
        total: null,   // 总数

        speed: 0	   // 动画时间(单位：ms)
    };

    this.textHolder = {};

    var self = this;
    this.o = o = $.extend(true, defaults, opt);

    if (o.domId == null) {
        alert('domId 参数不能为空');
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
            r: o.width/2 - o.borderWidth/2, // 半径
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

        // 计算提示文字的 X,Y 坐标
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

    // 数据结果展示
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

    // 设置值并画图
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

        // 封装数据参数：{total} (总数)，{value} (值), {valuePercent} (值百分比), {leaveValue} (反值,即 total-value), {leaveValuePercent}
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
