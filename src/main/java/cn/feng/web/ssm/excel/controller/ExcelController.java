/*
package cn.feng.web.ssm.excel.controller;

*/
/**
 * （9） 之 实现注解式权限验证
 *//*


import com.bsnnms.bean.busiMonitor.result.Result;
import com.bsnnms.bean.common.StringTemplate;
import com.bsnnms.bean.common.StringUtils;
import com.bsnnms.bean.common.util.DatabaseUtil;
import com.bsnnms.bean.common.xml.ColumnInfo;
import com.bsnnms.bean.common.xml.XMLResult;
import com.bsnnms.bean.query.SysVariableCtrl;
import com.bsnnms.bean.systemLog.dao.SystemLogDao;
import com.bsnnms.bean.systemLog.vo.SystemLog;
import com.bsnnms.bean.user.StaffInfo;
import com.bsnnms.exception.ApplicationException;
import com.bsnnms.exception.SystemException;
import com.bsnnms.servlet.common.ExcelDownloadTemplateByHead;
import jxl.Workbook;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.Node;
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
import java.util.HashMap;
import java.util.List;

@Controller
@RequestMapping(value = "/excel")
public class ExcelController extends ExcelDownloadTemplateByHead {


	protected String sheetName = "数据";

	*/
/**
	 * 单excel最大的数据量*
	 *//*

	protected int maxRowNum = 0;
	private static final StringTemplate XPATH = new StringTemplate("FLDNAME[.='{$key}']/@name");

	private ColumnInfo[] heads;

	Element resultField;

	protected String fileName = "合并的导出数据";

	protected String fullPath = null;

	@RequestMapping(value = "/down", method = { RequestMethod.GET, RequestMethod.POST })
	//@RequestMapping实现 对queryItems方法和url进行映射，一个方法对应一个url
	//一般建议将url和方法写成一样
	public String login(HttpServletRequest request, HttpServletResponse response) throws UnsupportedEncodingException {
		request.setCharacterEncoding("GBK");
		XMLResult xRs = new XMLResult();

		StaffInfo info = (StaffInfo) request.getSession().getAttribute("staffInfo");
		SystemLog log = new SystemLog();
		log.setModuleId(29010);
		log.setLogCode("ITM52300");
		log.setStaffId(info.getStaffId());

		try {

			String xml = request.getParameter("param");
			Document sendXml = xRs.parseText(xml);
			Element resultNode = (Element) sendXml.selectSingleNode("/root/result");
			//String filename= resultNode.attributeValue("title");
			String filename = resultNode.attributeValue("excelTitle");
			if (("").equals(filename) || filename == null) {  //生成下载的文件名,配置取值get_value_show_cfg的excelTitle字段-dhh 原title
				filename = this.fileName;
			}

			filename = filename + "_" + new SimpleDateFormat("yyyyMMdd").format(Calendar.getInstance().getTime()); //格式:标题+yyyMMdd.xls

			Boolean flag = false;
			List<Element> fields = sendXml.selectSingleNode("/root/fields").selectNodes("field");
			for (int i = 0; i < fields.size(); i++) {
				if ("FORM_ATTACH".equals(fields.get(i).attributeValue("name"))) {
					flag = true;
				}
			}

			maxRowNum = Integer.parseInt(DatabaseUtil.getSysConfigVal("EXCEL_EXPORT_MAX_ROW"));
			int dateSize = this.getTotalCount(request, response);  //获取总数据量
			if (!flag && dateSize <= maxRowNum) {//数据量小于maxRowNum,单文件导出
				littleDataExcelDownLoad(request, response, filename);
				log.setContent("附件下载-操作人员：" + info.getStaffName() + ", 下载了文件：" + filename + ".xls");
			} else {//分多个文件打包下载
				largeDataExcelDownLoad(request, response, dateSize, filename, flag);
				log.setContent("附件下载-操作人员：" + info.getStaffName() + ", 下载了文件：" + filename + ".zip");
			}

			log.setObjName("");
			SystemLogDao.addLog(log);

		} catch (ApplicationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SystemException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

		return null;
	}



	*/
/**
	 * 获取实际数据
	 *//*

	public Document execution(Element resultNode, SysVariableCtrl svCtrl) throws ApplicationException, SystemException {

		XMLResult xRs = new XMLResult();
		List headNodes = resultNode.selectNodes("fields/field");
		int headCount = headNodes.size();
		heads = new ColumnInfo[headCount];
		for (int i = 0; i < headCount; i++) {
			Element headNode = (Element) headNodes.get(i);
			heads[i] = new ColumnInfo(headNode.attributeValue("name"), headNode.getText());
		}

		String ref = resultNode.attributeValue("ref");
		Result result = (Result) super.getApplicationContext().getBean(ref);
		result.setResultNode(resultNode);
		result.setSvCtrl(svCtrl);
		Document doc = xRs.parseText(result.getEncodeResultXml());
		resultField = (Element) doc.selectSingleNode("/root/Fields");
		return doc;
	}

	@Override
	public ColumnInfo[] getHead() {
		ColumnInfo head;
		HashMap attrs;
		Node node;
		for (int i = 0, len = heads.length; i < len; i++) {
			head = heads[i];
			attrs = new HashMap();
			attrs.put("key", head.getName());
			node = this.resultField.selectSingleNode(XPATH.apply(attrs));
			head.setName(node.getText());
		}
		return heads;
	}


	@Override
	protected ModelAndView handleRequestInternal(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String sheetName = null;
		String errorMessage = null;
		StringBuffer sbuf = new StringBuffer("attachment; filename=");
		sbuf.append(StringUtils.gbToUtf8(this.fileName)).append(".xls");
		ServletOutputStream out = response.getOutputStream();
		WritableWorkbook workbook = null;
		WritableSheet sheet = null;
		XMLResult xRs = new XMLResult();
		try {
			String sysEncode = System.getProperty("file.encoding");
			request.setCharacterEncoding(sysEncode);

			response.setContentType("application/vnd.ms-excel");
			response.setHeader("Content-disposition", sbuf.toString());

			HttpSession session = request.getSession();
			SysVariableCtrl svCtrl = new SysVariableCtrl(session);
			String xml = request.getParameter("param");
			Document sendXml = xRs.parseText(xml);
			List resultNodes = sendXml.selectNodes("/root/result");
			workbook = Workbook.createWorkbook(out);
			for (int i = 0; i < resultNodes.size(); i++) {
				Element resultNode = (Element) resultNodes.get(i);
				Document dataDoc = this.execution(resultNode, svCtrl);
				ColumnInfo[] head = this.getHead();
				Element root = dataDoc.getRootElement();
				List rows = root.selectNodes("rowSet");
				sheetName = resultNode.attributeValue("excelTitle") == null || "".equals(resultNode.attributeValue("excelTitle")) ? "Sheet" + (i + 1) : resultNode.attributeValue("excelTitle");
				sheet = workbook.createSheet(sheetName, i);
				sheet.getSettings().setVerticalFreeze(1);
				this.outHead(sheet, head);
				for (int j = 0, rowLen = rows.size(); j < rowLen; j++) {
					this.outData(sheet, (Element) rows.get(j), j, head);
				}
			}

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

	@Override
	public Document execution(HttpServletRequest request, HttpServletResponse response) throws ApplicationException, SystemException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Document execution(HttpServletRequest request, HttpServletResponse response, int start, int end) throws ApplicationException, SystemException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int getTotalCount(HttpServletRequest request, HttpServletResponse response) throws ApplicationException, SystemException {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public ColumnInfo[] getMoreHead() {
		// TODO Auto-generated method stub
		return null;
	}

}
*/
