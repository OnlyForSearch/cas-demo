package cn.fengyu.frame.study.jdbc.Base;

import cn.fengyu.frame.study.jdbc.util.JdbcUtils;
import org.junit.Test;

import java.sql.*;

/**SQLע��
 * Created by fengyu on 2016-08-24.
 */
public class SQLInject {


    /**
     * չ��sqlע��
     * ƴ���ķ�ʽ:���ڰ�ȫ����
     * @throws SQLException
     */
    @Test
    public void read1() throws SQLException {
        String name="'or 1 or'";
        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;
        try {
            // 2.��������
            conn = JdbcUtils.getConnection();
            // conn = JdbcUtilsSing.getInstance().getConnection();

            // 3.�������
            String sql = "select id, name, money, birthday  from user where name='"
                    + name + "'";
            System.out.println(sql);
            st = conn.createStatement();
            // 4.ִ�����
            rs = st.executeQuery(sql);

            // 5.������
            while (rs.next()) {
                 System.out.println(rs.getObject("id") + "\t"
                 + rs.getObject("name") + "\t"
                 + rs.getObject("birthday") + "\t"
                 + rs.getObject("money"));
            }
        } finally {
            JdbcUtils.free(rs, st, conn);
        }
    }


    @Test
    public void read2() throws SQLException {
        String name="'or 1 or'";
        Connection conn = null;
        PreparedStatement st = null;//Ԥ������Է�ֹSQLע��
        ResultSet rs = null;
        try {
            // 2.��������
            conn = JdbcUtils.getConnection();
            // conn = JdbcUtilsSing.getInstance().getConnection();

            // 3.�������
            String sql = "select id, name, money, birthday  from user where name=?";
            System.out.println(sql);
            st = conn.prepareStatement(sql);
            st.setString(1,name);
            // 4.ִ�����
            rs = st.executeQuery();

            // 5.������
            while (rs.next()) {
                System.out.println(rs.getObject("id") + "\t"
                        + rs.getObject("name") + "\t"
                        + rs.getObject("birthday") + "\t"
                        + rs.getObject("money"));
            }
        } finally {
            JdbcUtils.free(rs, st, conn);
        }


    }
    /**
     *
     * ���ؾ������������
     * */
    @Test
    public void read3() throws SQLException {
        String name="'or 1 or'";
        Connection conn = null;
        PreparedStatement st = null;//Ԥ������Է�ֹSQLע��
        ResultSet rs = null;
        try {
            // 2.��������
            conn = JdbcUtils.getConnection();
            // conn = JdbcUtilsSing.getInstance().getConnection();

            // 3.�������
            String sql = "select id, name, money, birthday  from user where name=?";
            System.out.println(sql);
            st = conn.prepareStatement(sql);
            st.setString(1,name);
            // 4.ִ�����
            rs = st.executeQuery();

            // 5.������
            while (rs.next()) {
                System.out.println(rs.getInt("id") + "\t"
                        + rs.getString("name") + "\t"
                        + rs.getDate("birthday") + "\t"
                        + rs.getFloat("money"));
            }
        } finally {
            JdbcUtils.free(rs, st, conn);
        }


    }

}
