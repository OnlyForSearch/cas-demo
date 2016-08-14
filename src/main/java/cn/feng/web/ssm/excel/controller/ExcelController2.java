package cn.feng.web.ssm.excel.controller;

import jxl.Workbook;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.Calendar;

@Controller
@RequestMapping(value = "/excel")
public class ExcelController2  {


	@RequestMapping(value = "/down", method = { RequestMethod.GET, RequestMethod.POST })
	//@RequestMapping实现 对queryItems方法和url进行映射，一个方法对应一个url
	//一般建议将url和方法写成一样
	public String login(HttpServletRequest request, HttpServletResponse response) throws UnsupportedEncodingException {
		request.setCharacterEncoding("GBK");

		try {

			String filename = "测试文件名";
			String xml = request.getParameter("param");
			//String filename= resultNode.attributeValue("title");
			if (("").equals(filename) || filename == null) {  //生成下载的文件名,配置取值get_value_show_cfg的excelTitle字段-dhh 原title

			}

			filename = filename + "_" + new SimpleDateFormat("yyyyMMdd").format(Calendar.getInstance().getTime()); //格式:标题+yyyMMdd.xls

			littleDataExcelDownLoad(request, response, filename);
			System.out.println("附件下载-操作人员：" +"test" + ", 下载了文件：" + filename + ".xls");




		} catch (Exception e) {
			e.printStackTrace();
		}

		return null;
	}


	public void littleDataExcelDownLoad(HttpServletRequest request, HttpServletResponse response, String filename) throws IOException {
		String errorMessage = null;
		StringBuffer sbuf = new StringBuffer("attachment; filename=");
		sbuf.append(StringUtils.gbToUtf8(filename)).append(".xls");
		ServletOutputStream out = response.getOutputStream();
		WritableWorkbook workbook = null;
		try {
			response.setContentType("application/vnd.ms-excel");
			response.setHeader("Content-disposition", sbuf.toString());
		//	ColumnInfo[] moreHead = this.getMoreHead();
		//	ColumnInfo[] head = this.getHead();
			workbook = Workbook.createWorkbook(out);
			WritableSheet sheet = null;
			sheet = workbook.createSheet("页面表1", 0);
			//sheet.getSettings().setVerticalFreeze(1);



			workbook.write();
			workbook.close();
		} catch (Exception ex) {
			ex.printStackTrace();
			errorMessage = "对不起，保存Excel文件失败，请与管理员联系！";
		} finally {
			if (errorMessage != null) {
				response.reset();
				response.setContentType("text/html; charset=GBK");
				out.println("<script language=javascript>\n");
				out.println("alert(\"" + errorMessage + "\");");
				out.println("</script>\n");
			}
			if (out != null)
				out.close();
		}
	}


	@RequestMapping(value = "/down2", method = {RequestMethod.GET, RequestMethod.POST})

	public ModelAndView handleRequestInternal(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String sheetName = null;
		String errorMessage = null;
		StringBuffer sbuf = new StringBuffer("attachment; filename=");
		sbuf.append(StringUtils.gbToUtf8("文件名")).append(".xls");
		ServletOutputStream out = response.getOutputStream();
		WritableWorkbook workbook = null;
		WritableSheet sheet = null;
		try {
			String sysEncode = System.getProperty("file.encoding");
			request.setCharacterEncoding(sysEncode);

			response.setContentType("application/vnd.ms-excel");
			response.setHeader("Content-disposition", sbuf.toString());

			HttpSession session = request.getSession();
			String xml = request.getParameter("param");
			workbook = Workbook.createWorkbook(out);

			workbook.write();
			workbook.close();
		} catch (Exception ex) {
			ex.printStackTrace();
			errorMessage = "对不起，保存Excel文件失败，请与管理员联系！";
		} finally {
			if (errorMessage != null) {
				response.reset();
				response.setContentType("text/html; charset=GBK");
				out.println("<script language=javascript>\n");
				out.println("alert(\"" + errorMessage + "\");");
				out.println("</script>\n");
			}
			if (out != null)
				out.close();
		}
		return null;

	}


}
