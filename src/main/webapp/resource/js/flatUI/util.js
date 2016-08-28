Date.prototype.toStr = function(format) {
	if (format == null) {
		format = "yyyy-MM-dd HH:mm:ss";
	}
	format = format.replace(/yyyy/g, this.getFullYear());
	format = format.replace(/yyy/g, this.getYear());
	format = format.replace(/yy/g, this.getFullYear().toString().slice(-2));
	if (format.indexOf('mi') >= 0) {
		format = format.replace(/mi/g, this.getMilliseconds().toString());
	}
	if (format.indexOf('M') >= 0) {
		var M = (this.getMonth() + 1).toString();
		format = format.replace(/MM/g, ("0" + M).slice(-2));
		format = format.replace(/M/g, M);
	}
	if (format.indexOf('ddd') >= 0) {
		var xq = [ "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日" ];
		format = format.replace(/ddd/g, xq[this.getDay()]);
	}
	if (format.indexOf('d') >= 0) {
		var d = this.getDate().toString();
		format = format.replace(/dd/g, ("0" + d).slice(-2));
		format = format.replace(/d/g, d);
	}
	if (format.indexOf('h') >= 0 || format.indexOf('H') >= 0) {
		var h = this.getHours();
		format = format.replace(/HH/g, ("0" + h.toString()).slice(-2));
		format = format.replace(/H/g, h);
		h = h % 12;
		format = format.replace(/hh/g, ("0" + h.toString()).slice(-2));
		format = format.replace(/h/g, h);
	}
	if (format.indexOf('m') >= 0) {
		var m = this.getMinutes().toString();
		format = format.replace(/mm/g, ("0" + m).slice(-2));
		format = format.replace(/m/g, m);
	}
	if (format.indexOf('s') >= 0) {
		var s = this.getSeconds().toString();
		format = format.replace(/ss/g, ("0" + s).slice(-2));
		format = format.replace(/s/g, m);
	}
	return format;
};