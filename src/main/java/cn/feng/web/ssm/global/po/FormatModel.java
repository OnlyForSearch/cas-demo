package cn.feng.web.ssm.global.po;

import java.util.Date;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.NumberFormat;
import org.springframework.format.annotation.NumberFormat.Style;

/**
 * (7） 之 格式化显示
 * 
 * @author Administrator
 * 
 */
public class FormatModel {
	/*
	 * private String money; private String date;
	 */
	/*
	 * public String getMoney() { return money; }
	 * 
	 * public String getDate() { return date; }
	 * 
	 * public void setMoney(String money) { this.money = money; }
	 * 
	 * public void setDate(String date) { this.date = date; }
	 */

	@NumberFormat(style = Style.CURRENCY)
	private double money;

	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date date;

	public double getMoney() {
		return money;
	}

	public Date getDate() {
		return date;
	}

	public void setMoney(double money) {
		this.money = money;
	}

	public void setDate(Date date) {
		this.date = date;
	}

}
