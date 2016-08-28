package cn.fengyu.frame.study.jdbc.Base;

import cn.fengyu.frame.study.jdbc.util.JdbcUtils;
import org.junit.Test;

import java.io.*;
import java.sql.*;
import java.util.Date;

/**对于日期,大文本数据处理
 * Created by fengyu on 2016-08-25.
 */
public class SQLDataTest {

/**插入数据库的时候的日期处理*/
    @Test
    public void testCreate() throws SQLException {

        Connection conn = null;
        PreparedStatement ps = null;//预处理可以防止SQL注入
        ResultSet rs = null;
        try {
            // 2.建立连接
            conn = JdbcUtils.getConnection();
            // conn = JdbcUtilsSing.getInstance().getConnection();

            // 3.创建语句
            String sql = "INSERT INTO  user (name,birthday,money) VALUES (?,?,?)";
            System.out.println(sql);
            ps = conn.prepareStatement(sql);
            ps.setString(1,"name");
            ps.setDate(2,new java.sql.Date(new Date().getTime()));
            ps.setFloat(3,3.65f);
            // 4.执行语句
             ps.executeUpdate();

        } finally {
            JdbcUtils.free(rs, ps, conn);
        }


    }


/**
 * 处理读取时候的日期的处理
 *
 * */
    @Test
    public void readDate() throws SQLException {
        String name="name1";
        Connection conn = null;
        PreparedStatement st = null;//预处理可以防止SQL注入
        ResultSet rs = null;
        try {
        Date birthday=null;
            // 2.建立连接
            conn = JdbcUtils.getConnection();
            // conn = JdbcUtilsSing.getInstance().getConnection();

            // 3.创建语句
            String sql = "select birthday  from user where name=?";
            System.out.println(sql);
            st = conn.prepareStatement(sql);
            st.setString(1,name);
            // 4.执行语句
            rs = st.executeQuery();

            // 5.处理结果
            while (rs.next()) {
                birthday=  rs.getDate("birthday") ;//直接进行转换
            System.out.println(birthday);
            }
        } finally {
            JdbcUtils.free(rs, st, conn);
        }


    }
/**创建大文本数据,使用字符流将但文本串输入到数据库*/
    @Test
    public void testCreateClob() throws SQLException, IOException {

        Connection conn = null;
        PreparedStatement ps = null;//预处理可以防止SQL注入
        ResultSet rs = null;
        try {
            // 2.建立连接
            conn = JdbcUtils.getConnection();
            // 3.创建语句
            String sql = "insert into clob_test(big_text) values (?) ";
            ps = conn.prepareStatement(sql);
            File file = new File("E:\\fengyuProject\\ssm\\ssm\\src\\main\\java\\cn\\fengyu\\frame\\study\\jdbc\\util\\JdbcUtils.java");
            Reader reader = new BufferedReader(new FileReader(file));

            ps.setCharacterStream(1, reader, (int) file.length());
            // ps.setString(1, x);
            // 4.执行语句
            int i = ps.executeUpdate();

            reader.close();

            System.out.println("i=" + i);

        } finally {
            JdbcUtils.free(rs, ps, conn);
        }


    }



    /**
     * 从数据库中读取大文本数据流,重新写成一个文件
     *
     * */
    @Test
    public void testReadClob() throws SQLException, IOException {
        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;
        try {
            // 2.建立连接
            conn = JdbcUtils.getConnection();
            // conn = JdbcUtilsSing.getInstance().getConnection();
            // 3.创建语句
            st = conn.createStatement();

            // 4.执行语句
            rs = st.executeQuery("select big_text  from clob_test");

            // 5.处理结果
            while (rs.next()) {
                Clob clob = rs.getClob(1);
                Reader reader = clob.getCharacterStream();
                // reader = rs.getCharacterStream(1);
                // String s = rs.getString(1);

                File file = new File("JdbUtils_bak.java");//写到根目录下
                Writer writer = new BufferedWriter(new FileWriter(file));
                char[] buff = new char[1024];
                for (int i = 0; (i = reader.read(buff)) > 0;) {
                    writer.write(buff, 0, i);
                }
                writer.close();
                reader.close();
            }
        } finally {
            JdbcUtils.free(rs, st, conn);
        }}

/**
 *
 * 读取文件 图片
 * */
@Test
    public void readBlogImage() throws SQLException, IOException {
        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;
        try {
            // 2.建立连接
            conn = JdbcUtils.getConnection();
            // conn = JdbcUtilsSing.getInstance().getConnection();
            // 3.创建语句
            st = conn.createStatement();

            // 4.执行语句
            rs = st.executeQuery("select big_bit  from blob_test");

            // 5.处理结果
            while (rs.next()) {
                // Blob blob = rs.getBlob(1);
                // InputStream in = blob.getBinaryStream();
                InputStream in = rs.getBinaryStream("big_bit");

                File file = new File("IMG_0002_bak.jpg");
                OutputStream out = new BufferedOutputStream(//使用字节流
                        new FileOutputStream(file));
                byte[] buff = new byte[1024];
                for (int i = 0; (i = in.read(buff)) > 0;) {
                    out.write(buff, 0, i);
                }
                out.close();
                in.close();
            }
        } finally {
            JdbcUtils.free(rs, st, conn);
        }
    }

    /**
     * 向数据库插入文件 ,图片
     * @throws SQLException
     * @throws IOException
     */
    @Test
    public void createBlogImage() throws SQLException, IOException {
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            // 2.建立连接
            conn = JdbcUtils.getConnection();
            // conn = JdbcUtilsSing.getInstance().getConnection();
            // 3.创建语句
            String sql = "insert into blob_test(big_bit) values (?) ";
            ps = conn.prepareStatement(sql);
            File file = new File("IMG_0002.jpg");
            InputStream in = new BufferedInputStream(new FileInputStream(file));//使用字节流

            ps.setBinaryStream(1, in, (int) file.length());
            // 4.执行语句
            int i = ps.executeUpdate();
            in.close();

            System.out.println("i=" + i);
        } finally {
            JdbcUtils.free(rs, ps, conn);
        }
    }

}
