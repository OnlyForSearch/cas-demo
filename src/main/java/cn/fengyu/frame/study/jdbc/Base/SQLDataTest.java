package cn.fengyu.frame.study.jdbc.Base;

import cn.fengyu.frame.study.jdbc.util.JdbcUtils;
import org.junit.Test;

import java.io.*;
import java.sql.*;
import java.util.Date;

/**��������,���ı����ݴ���
 * Created by fengyu on 2016-08-25.
 */
public class SQLDataTest {

/**�������ݿ��ʱ������ڴ���*/
    @Test
    public void testCreate() throws SQLException {

        Connection conn = null;
        PreparedStatement ps = null;//Ԥ������Է�ֹSQLע��
        ResultSet rs = null;
        try {
            // 2.��������
            conn = JdbcUtils.getConnection();
            // conn = JdbcUtilsSing.getInstance().getConnection();

            // 3.�������
            String sql = "INSERT INTO  user (name,birthday,money) VALUES (?,?,?)";
            System.out.println(sql);
            ps = conn.prepareStatement(sql);
            ps.setString(1,"name");
            ps.setDate(2,new java.sql.Date(new Date().getTime()));
            ps.setFloat(3,3.65f);
            // 4.ִ�����
             ps.executeUpdate();

        } finally {
            JdbcUtils.free(rs, ps, conn);
        }


    }


/**
 * �����ȡʱ������ڵĴ���
 *
 * */
    @Test
    public void readDate() throws SQLException {
        String name="name1";
        Connection conn = null;
        PreparedStatement st = null;//Ԥ������Է�ֹSQLע��
        ResultSet rs = null;
        try {
        Date birthday=null;
            // 2.��������
            conn = JdbcUtils.getConnection();
            // conn = JdbcUtilsSing.getInstance().getConnection();

            // 3.�������
            String sql = "select birthday  from user where name=?";
            System.out.println(sql);
            st = conn.prepareStatement(sql);
            st.setString(1,name);
            // 4.ִ�����
            rs = st.executeQuery();

            // 5.������
            while (rs.next()) {
                birthday=  rs.getDate("birthday") ;//ֱ�ӽ���ת��
            System.out.println(birthday);
            }
        } finally {
            JdbcUtils.free(rs, st, conn);
        }


    }
/**�������ı�����,ʹ���ַ��������ı������뵽���ݿ�*/
    @Test
    public void testCreateClob() throws SQLException, IOException {

        Connection conn = null;
        PreparedStatement ps = null;//Ԥ������Է�ֹSQLע��
        ResultSet rs = null;
        try {
            // 2.��������
            conn = JdbcUtils.getConnection();
            // 3.�������
            String sql = "insert into clob_test(big_text) values (?) ";
            ps = conn.prepareStatement(sql);
            File file = new File("E:\\fengyuProject\\ssm\\ssm\\src\\main\\java\\cn\\fengyu\\frame\\study\\jdbc\\util\\JdbcUtils.java");
            Reader reader = new BufferedReader(new FileReader(file));

            ps.setCharacterStream(1, reader, (int) file.length());
            // ps.setString(1, x);
            // 4.ִ�����
            int i = ps.executeUpdate();

            reader.close();

            System.out.println("i=" + i);

        } finally {
            JdbcUtils.free(rs, ps, conn);
        }


    }



    /**
     * �����ݿ��ж�ȡ���ı�������,����д��һ���ļ�
     *
     * */
    @Test
    public void testReadClob() throws SQLException, IOException {
        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;
        try {
            // 2.��������
            conn = JdbcUtils.getConnection();
            // conn = JdbcUtilsSing.getInstance().getConnection();
            // 3.�������
            st = conn.createStatement();

            // 4.ִ�����
            rs = st.executeQuery("select big_text  from clob_test");

            // 5.������
            while (rs.next()) {
                Clob clob = rs.getClob(1);
                Reader reader = clob.getCharacterStream();
                // reader = rs.getCharacterStream(1);
                // String s = rs.getString(1);

                File file = new File("JdbUtils_bak.java");//д����Ŀ¼��
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
 * ��ȡ�ļ� ͼƬ
 * */
@Test
    public void readBlogImage() throws SQLException, IOException {
        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;
        try {
            // 2.��������
            conn = JdbcUtils.getConnection();
            // conn = JdbcUtilsSing.getInstance().getConnection();
            // 3.�������
            st = conn.createStatement();

            // 4.ִ�����
            rs = st.executeQuery("select big_bit  from blob_test");

            // 5.������
            while (rs.next()) {
                // Blob blob = rs.getBlob(1);
                // InputStream in = blob.getBinaryStream();
                InputStream in = rs.getBinaryStream("big_bit");

                File file = new File("IMG_0002_bak.jpg");
                OutputStream out = new BufferedOutputStream(//ʹ���ֽ���
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
     * �����ݿ�����ļ� ,ͼƬ
     * @throws SQLException
     * @throws IOException
     */
    @Test
    public void createBlogImage() throws SQLException, IOException {
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            // 2.��������
            conn = JdbcUtils.getConnection();
            // conn = JdbcUtilsSing.getInstance().getConnection();
            // 3.�������
            String sql = "insert into blob_test(big_bit) values (?) ";
            ps = conn.prepareStatement(sql);
            File file = new File("IMG_0002.jpg");
            InputStream in = new BufferedInputStream(new FileInputStream(file));//ʹ���ֽ���

            ps.setBinaryStream(1, in, (int) file.length());
            // 4.ִ�����
            int i = ps.executeUpdate();
            in.close();

            System.out.println("i=" + i);
        } finally {
            JdbcUtils.free(rs, ps, conn);
        }
    }

}
