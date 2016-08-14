package cn.feng.web.ssm.excel.controller;

import jxl.Cell;
import jxl.Sheet;
import jxl.SheetSettings;
import jxl.Workbook;
import jxl.write.*;
import jxl.write.Number;
import org.junit.Test;

import java.io.File;
import java.io.IOException;
import java.util.*;

/**
 * Excel导入导出
 *
 * @author 林计钦
 * @version 1.0 Feb 7, 2014 4:14:51 PM
 */
public class ExcelTest2 {

    /**
     * 导入(导入到内存)
     */
    @Test
    public void importExcel() {
        Workbook book = null;
        try {
            book = Workbook.getWorkbook(new File("D:/test/测试.xls"));
            // 获得第一个工作表对象
            Sheet sheet = book.getSheet(0);
            int rows = sheet.getRows();
            int columns = sheet.getColumns();
            // 遍历每行每列的单元格
            for (int i = 0; i < rows; i++) {
                for (int j = 0; j < columns; j++) {
                    Cell cell = sheet.getCell(j, i);
                    String result = cell.getContents();
                    if (j == 0) {
                        System.out.print("姓名：" + result + " ");
                    }
                    if (j == 1) {
                        System.out.print("年龄：" + result + " ");
                    }
                    if ((j + 1) % 2 == 0) {
                        System.out.println();
                    }
                }
            }
            System.out.println("========");
            // 得到第一列第一行的单元格
            Cell cell1 = sheet.getCell(0, 0);
            String result = cell1.getContents();
            System.out.println(result);
            System.out.println("========");
        } catch (Exception e) {
            System.out.println(e);
        } finally {
            if (book != null) {
                book.close();
            }
        }
    }

    /**
     * 导出(导出到磁盘)
     */
    @Test
    public void exportExcel() {
        WritableWorkbook book = null;
        try {
            // 打开文件
            book = Workbook.createWorkbook(new File("D:/test/测试.xls"));
            // 生成名为"学生"的工作表，参数0表示这是第一页
            WritableSheet sheet = book.createSheet("学生", 0);
            // 指定单元格位置是第一列第一行(0, 0)以及单元格内容为张三
            Label label = new Label(0, 0, "张三");
            // 将定义好的单元格添加到工作表中
            sheet.addCell(label);
            // 保存数字的单元格必须使用Number的完整包路径
            jxl.write.Number number = new jxl.write.Number(1, 0, 30);
            sheet.addCell(number);
            // 写入数据并关闭文件
            book.write();
        } catch (Exception e) {
            System.out.println(e);
        } finally {
            if (book != null) {
                try {
                    book.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * 对象数据写入到Excel
     */
    @Test
    public void writeExcel() {
        WritableWorkbook book = null;
        try {
            // 打开文件
            book = Workbook.createWorkbook(new File("D:/test/stu.xls"));
            // 生成名为"学生"的工作表，参数0表示这是第一页

            List<String> sheetNameList = Arrays.asList("st1", "st2", "122");

            for (int j = 0; j < sheetNameList.size(); j++) {
                String sheetName = sheetNameList.get(j);
                WritableSheet sheet = book.createSheet(sheetName, j);
                List<Student> stuList = queryStudentList();
                if (stuList != null && !stuList.isEmpty()) {
                    for (int i = 0; i < stuList.size(); i++) {
                        sheet.addCell(new Label(0, i, stuList.get(i).getName() + j));
                        sheet.addCell(new Number(1, i, stuList.get(i).getAge()));
                    }
                }
            }


            // 写入数据并关闭文件
            book.write();
            book.close();
        } catch (Exception e) {
            System.out.println(e);
        } finally {
            if (book != null) {
                try {
                    book.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

    }/**
     * 对象数据写入到Excel2
     */
    @Test
    public void writeExcel2() throws IOException, WriteException {

        List<String> sheetNameList = Arrays.asList("st1", "st2", "122");
        //声明工作簿jxl.write.WritableWorkbook
        WritableWorkbook book = null;
        try {

            //根据传进来的file对象创建可写入的Excel工作薄
            //OutputStream os = response.getOutputStream();
            // 打开文件
            book = Workbook.createWorkbook(new File("D:/test/export.xls"));
            // 生成名为"学生"的工作表，参数0表示这是第一页

           /*
             * 创建一个工作表、sheetName为工作表的名称、"0"为第一个工作表
             * 打开Excel的时候会看到左下角默认有3个sheet、"sheet1、sheet2、sheet3"这样
             * 代码中的"0"就是sheet1、其它的一一对应。
             * createSheet(sheetName, 0)一个是工作表的名称，另一个是工作表在工作薄中的位置
             */
            WritableSheet ws = book.createSheet(sheetNameList.get(0), 0);

            SheetSettings ss = ws.getSettings();
            ss.setVerticalFreeze(1);//冻结表头

            WritableFont font1 = new WritableFont(WritableFont.createFont("微软雅黑"), 10, WritableFont.BOLD);
            WritableFont font2 = new WritableFont(WritableFont.createFont("微软雅黑"), 9, WritableFont.NO_BOLD);
            //创建单元格样式
            WritableCellFormat wcf = new WritableCellFormat(font1);
            WritableCellFormat wcf2 = new WritableCellFormat(font2);
            WritableCellFormat wcf3 = new WritableCellFormat(font2);//设置样式，字体

            //创建单元格样式
            //WritableCellFormat wcf = new WritableCellFormat();

            //背景颜色
            wcf.setBackground(jxl.format.Colour.YELLOW);
            wcf.setAlignment(Alignment.CENTRE);  //平行居中
            wcf.setVerticalAlignment(VerticalAlignment.CENTRE);  //垂直居中
            wcf3.setAlignment(Alignment.CENTRE);  //平行居中
            wcf3.setVerticalAlignment(VerticalAlignment.CENTRE);  //垂直居中
            wcf3.setBackground(Colour.LIGHT_ORANGE);
            wcf2.setAlignment(Alignment.CENTRE);  //平行居中
            wcf2.setVerticalAlignment(VerticalAlignment.CENTRE);  //垂直居中

                        /*
             * 这个是单元格内容居中显示
             * 还有很多很多样式
             */
            wcf.setAlignment(Alignment.CENTRE);
            List<String> columns=Arrays.asList("column1","column2","column3");
            List<Map<String,Object>> objData=new ArrayList<Map<String, Object>>();
             HashMap<String, Object> map1 = new HashMap<String,Object>();
            map1.put("01", "0001");
            objData.add(map1);
            HashMap<String, Object> map2 = new HashMap<String, Object>();
            map1.put("02", "0002");

            objData.add(map2);
            HashMap<String, Object> map3 = new HashMap<String, Object>();
            map1.put("03", "0003");

            objData.add(map3);

            //判断一下表头数组是否有数据

                //循环写入表头
                for (int i = 0; i < columns.size(); i++) {

                    /*
                     * 添加单元格(Cell)内容addCell()
                     * 添加Label对象Label()
                     * 数据的类型有很多种、在这里你需要什么类型就导入什么类型
                     * 如：jxl.write.DateTime 、jxl.write.Number、jxl.write.Label
                     * Label(i, 0, columns[i], wcf)
                     * 其中i为列、0为行、columns[i]为数据、wcf为样式
                     * 合起来就是说将columns[i]添加到第一行(行、列下标都是从0开始)第i列、样式为什么"色"内容居中
                     */
                    ws.addCell(new Label(i, 0, columns.get(i), wcf));
                }
                //判断表中是否有数据
                if (objData != null && objData.size() > 0) {
                    //循环写入表中数据
                    for (int i = 0; i < objData.size(); i++) {

                        //转换成map集合{activyName:测试功能,count:2}
                        Map<String, Object> map = (Map<String, Object>) objData.get(i);

                        //循环输出map中的子集：既列值
                        int j = 0;
                        for (Object o : map.keySet()) {
                            //ps：因为要“”通用”“导出功能，所以这里循环的时候不是get("Name"),而是通过map.get(o)
                            ws.addCell(new Label(j, i + 1, String.valueOf(map.get(o))));
                            j++;
                        }
                    }
                }
                // 写入数据并关闭文件
                book.write();

        } catch (Exception e) {
            System.out.println(e);
        } finally {
            if (book != null) {
                try {
                    book.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }


    }
    /**
     * 读取Excel数据到内存
     */
    @Test
    public void readExcel() {
        Workbook book = null;
        try {
            // 打开文件
            book = Workbook.getWorkbook(new File("D:/test/stu.xls"));
            // 获得第一个工作表对象
            Sheet sheet = book.getSheet(0);
            int rows = sheet.getRows();
            int columns = sheet.getColumns();
            List<Student> stuList = new ArrayList<Student>();
            // 遍历每行每列的单元格
            for (int i = 0; i < rows; i++) {
                Student stu = new Student();
                for (int j = 0; j < columns; j++) {
                    Cell cell = sheet.getCell(j, i);
                    String result = cell.getContents();
                    if (j == 0) {
                        stu.setName(result);
                    }
                    if (j == 1) {
                        stu.setAge(Integer.parseInt(result));
                    }
                    if ((j + 1) % 2 == 0) {
                        stuList.add(stu);
                        stu = null;
                    }
                }
            }

            //遍历数据
            for (Student stu : stuList) {
                System.out.println(String.format("姓名：%s, 年龄：%s", stu.getName(), stu.getAge()));
            }

        } catch (Exception e) {
            System.out.println(e);
        } finally {
            if (book != null) {
                try {
                    book.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

    }

    /**
     * 图片写入Excel，只支持png图片
     */
    @Test
    public void writeImg() {
        WritableWorkbook wwb = null;
        try {
            wwb = Workbook.createWorkbook(new File("D:/test/image.xls"));
            WritableSheet ws = wwb.createSheet("图片", 0);
            File file = new File("D:\\test\\png.png");
            //前两位是起始格，后两位是图片占多少个格，并非是位置
            WritableImage image = new WritableImage(1, 4, 6, 18, file);
            ws.addImage(image);
            wwb.write();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (wwb != null) {
                try {
                    wwb.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }

    private List<Student> queryStudentList() {
        List<Student> stuList = new ArrayList<Student>();
        stuList.add(new Student("zhangsan", 20));
        stuList.add(new Student("lisi", 25));
        stuList.add(new Student("wangwu", 30));
        return stuList;
    }

    public class Student {

        private String name;
        private int age;

        public Student() {
        }

        public Student(String name, int age) {
            super();
            this.name = name;
            this.age = age;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public int getAge() {
            return age;
        }

        public void setAge(int age) {
            this.age = age;
        }
    }
}