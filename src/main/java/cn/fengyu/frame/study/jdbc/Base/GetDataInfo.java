package cn.fengyu.frame.study.jdbc.Base;

import cn.fengyu.frame.study.jdbc.util.JdbcUtils;
import org.junit.Test;

import java.sql.*;

/**
 * 获取数据库以及结果集的metadata信息
 * <p>
 * 　　在JDBC中，我们不仅能够对数据进行操作，我们还能获取数据库以及结果集的元数据信息，例如数据库的名称、驱动信息、表信息；结果集的列信息等。
 * Created by fengyu on 2016-08-25.
 */
public class GetDataInfo {

    /**
     * 我们可以通过connection.getMetaData方法来获取数据库的元数据信息，它的类型是DatabaseMetaData。
     */
    @Test
    public void tesGetMeta() {
        Connection conn = null;
        try {
            conn = JdbcUtils.getConnection();
            DatabaseMetaData metaData = conn.getMetaData();
            System.out.println("数据库：" + metaData.getDatabaseProductName() + " " + metaData.getDatabaseProductVersion());
            System.out.println("驱动程序：" + metaData.getDriverName() + " " + metaData.getDriverVersion());

            ResultSet rs = metaData.getTables(null, null, null, null);
            System.out.println(String.format("|%-22s|%-9s|%-9s|%-9s|", "表名称", "表类别", "表类型", "表模式"));
            while (rs.next()) {
                System.out.println(String.format("|%-25s|%-10s|%-10s|%-10s|",//
                        rs.getString("TABLE_NAME"),//表名称
                        rs.getString("TABLE_CAT"),//表类别
                        rs.getString("TABLE_TYPE"),//表类型
                        rs.getString("TABLE_SCHEM")//表模式
                ));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            JdbcUtils.free(null, null, conn);
        }


    }

    /**
     * 获取结果集的元数据信息
     * <p>
     * 　　我们可以通过使用resultset.getMetaData方法来获取结果集的元数据信息，它的类型是ResultSetMetaData。
     */
    @Test
    public void testGetResultSetMeta() throws SQLException {

        Connection connection = JdbcUtils.getConnection();
        Statement statement = connection.createStatement();


        ResultSet rs = statement.executeQuery("SELECT ID, NAME FROM user");
        ResultSetMetaData rsmd = rs.getMetaData();
        for (int i = 1; i <= rsmd.getColumnCount(); i++) {
            System.out.println("Column Name:" + rsmd.getColumnName(i)//
                    + "; Column Type(名):" + rsmd.getColumnTypeName(i)//
                    + "; Column Type:" + rsmd.getColumnType(i)//
            );
        }
        JdbcUtils.free(rs, statement, connection);


    }


    //通过ResultSet对数据进行增、删、改
    private static void getResultCount() throws SQLException {
        System.out.println("=====Result Count=====");
        String dbURL = "jdbc:mysql://localhost/test";
        Connection con = DriverManager.getConnection(dbURL, "root", "123");
        Statement st = con.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_READ_ONLY, ResultSet.CLOSE_CURSORS_AT_COMMIT);
        ResultSet rs = st.executeQuery("SELECT * FROM user");
        rs.last();
        System.out.println("返回结果的条数：" + rs.getRow());
        rs.first();

        rs.close();
        st.close();
        con.close();
    }

    private static void insertDataToResultSet() throws SQLException {
        System.out.println("=====Insert=====");
        String dbURL = "jdbc:mysql://localhost/test";
        Connection con = DriverManager.getConnection(dbURL, "root", "123");
        Statement st = con.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_UPDATABLE);
        ResultSet rs = st.executeQuery("SELECT ID,NAME FROM user");
        rs.moveToInsertRow();
        rs.updateInt(1, 4);
        rs.updateString(2, "Xiao Ming");
        rs.insertRow();
        showUser(st);

        rs.close();
        st.close();
        con.close();
    }

    private static void updateDataToResultSet() throws SQLException {
        System.out.println("=====Update=====");
        String dbURL = "jdbc:mysql://localhost/test";
        Connection con = DriverManager.getConnection(dbURL, "root", "123");
        Statement st = con.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_UPDATABLE);
        ResultSet rs = st.executeQuery("SELECT * FROM user");
        rs.last();
        int count = rs.getRow();
        rs.first();
        rs.absolute(count);
        rs.updateString(2, "Xiao Qiang");
        rs.updateRow();
        showUser(st);

        rs.close();
        st.close();
        con.close();
    }

    private static void delDataFromResultSet() throws SQLException {
        System.out.println("=====Delete=====");
        String dbURL = "jdbc:mysql://localhost/test";
        Connection con = DriverManager.getConnection(dbURL, "root", "123");
        Statement st = con.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_UPDATABLE, ResultSet.CLOSE_CURSORS_AT_COMMIT);
        ResultSet rs = st.executeQuery("SELECT * FROM user");
        rs.last();
        int count = rs.getRow();
        rs.first();
        rs.absolute(count);
        rs.deleteRow();
        showUser(st);

        rs.close();
        st.close();
        con.close();
    }

    private static void showUser(Statement st) throws SQLException {
        ResultSet rs = st.executeQuery("SELECT ID, NAME FROM user");
        while (rs.next()) {
            int id = rs.getInt("ID");
            String name = rs.getString("NAME");
            System.out.println("ID:" + id + "; NAME=" + name);
        }
        rs.close();
    }

}
