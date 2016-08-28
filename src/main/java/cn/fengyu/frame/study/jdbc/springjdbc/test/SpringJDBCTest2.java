package cn.fengyu.frame.study.jdbc.springjdbc.test;

import cn.fengyu.frame.study.jdbc.springjdbc.dao.ISpringUserDao;
import cn.fengyu.frame.study.jdbc.springjdbc.po.SpringUser;
import cn.fengyu.frame.study.jdbc.springjdbc.service.ISpringUserService;
import org.junit.*;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.*;
import org.springframework.jdbc.core.namedparam.*;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.jdbc.support.rowset.SqlRowSet;

import javax.sql.DataSource;
import java.sql.*;
import java.util.*;

/**
 * Created by fengyu on 2016-08-26.
 */
public class SpringJDBCTest2 {

    private static ApplicationContext content;
    private static JdbcTemplate jdbcTemplate;
    private static NamedParameterJdbcTemplate namedParameterJdbcTemplate;


    @BeforeClass
    public static void setUp() {

        content = new ClassPathXmlApplicationContext("spring-jdbc.xml");
        ISpringUserDao springUserDao = content.getBean("springUserDao", ISpringUserDao.class);
        jdbcTemplate = springUserDao.getSpringJdbcTemplate();
        namedParameterJdbcTemplate = springUserDao.getSpringNameJdbcTemplate();
    }

    //1）预编译语句及存储过程创建回调、自定义功能回调使用：首先使用PreparedStatementCreator
    // 创建一个预编译语句，其次由JdbcTemplate通过PreparedStatementCallback回调传回，由用
    // 户决定如何执行该PreparedStatement。此处我们使用的是execute方法。
    @Test
    public void testPpreparedStatement1() {
        int count = jdbcTemplate.execute(new PreparedStatementCreator() {

            public PreparedStatement createPreparedStatement(Connection conn)
                    throws SQLException {
                return conn.prepareStatement("SELECT count(*) FROM springuser");
            }
        }, new PreparedStatementCallback<Integer>() {

            public Integer doInPreparedStatement(PreparedStatement pstmt)
                    throws SQLException, DataAccessException {
                pstmt.execute();
                ResultSet rs = pstmt.getResultSet();
                rs.next();
                return rs.getInt(1);
            }
        });
        Assert.assertEquals(0, count);
    }

    //2）预编译语句设值回调使用：

    /**
     * 通过JdbcTemplate的int update(String sql, PreparedStatementSetter
     * pss)执行预编译sql，其中sql参数为“insert into test(name) values (?)
     * ”，该sql有一个占位符需要在执行前设值，PreparedStatementSetter实现就是为了设值，使
     * 用setValues(PreparedStatement pstmt)回调方法设值相应的占位符位置的值。
     * JdbcTemplate也提供一种更简单的方式“update(String sql, Object...
     * args)
     * ”来实现设值，所以只要当使用该种方式不满足需求时才应使用PreparedStatementSetter。
     */
    @Test
    public void testPreparedStatement2() {
        String insertSql = "INSERT INTO springuser(name) VALUES (?)";
        int count = jdbcTemplate.update(insertSql, new PreparedStatementSetter() {

            public void setValues(PreparedStatement pstmt) throws SQLException {
                pstmt.setObject(1, "name4");
            }
        });
        Assert.assertEquals(1, count);
        String deleteSql = "DELETE FROM springuser WHERE name=?";
        count = jdbcTemplate.update(deleteSql, new Object[]{"name4"});
        Assert.assertEquals(1, count);
    }

    /**
     * 3）结果集处理回调：
     */
    @Test
    public void testResultSet1() {
        jdbcTemplate.update("INSERT INTO springuser(name) VALUES('name5')");
        String listSql = "SELECT * FROM springuser";
        List result = jdbcTemplate.query(listSql, new RowMapper<Map>() {

            public Map mapRow(ResultSet rs, int rowNum) throws SQLException {
                Map row = new HashMap();
                row.put(rs.getInt("id"), rs.getString("name"));
                return row;
            }
        });
        Assert.assertEquals(1, result.size());
        jdbcTemplate.update("DELETE FROM springuser WHERE name='name5'");
    }

    /**
     * RowMapper接口提供mapRow(ResultSet rs, int rowNum)方法将结果集的每一行转换为一个Map，当然可以转换为其他类，如表的对象画形式。
     */

    @Test
    public void testResultSet2() {
        jdbcTemplate.update("INSERT INTO springuser(name) VALUES('name5')");
        String listSql = "SELECT * FROM springuser";
        final List result = new ArrayList();
        jdbcTemplate.query(listSql, new RowCallbackHandler() {

            public void processRow(ResultSet rs) throws SQLException {
                Map row = new HashMap();
                row.put(rs.getInt("id"), rs.getString("name"));
                result.add(row);
            }
        });
        Assert.assertEquals(1, result.size());
        jdbcTemplate.update("DELETE FROM springuser WHERE name='name5'");
    }


    /**
     * RowCallbackHandler接口也提供方法processRow(ResultSet rs)，能将结果集的行转换为需要的形式。
     * ResultSetExtractor使用回调方法extractData(ResultSet rs)提供给用户整个结果集，让用户决定如何处理该结果集。
     */


    @Test
    public void testResultSet3() {
        jdbcTemplate.update("INSERT INTO springuser(name) VALUES('name5')");
        String listSql = "SELECT * FROM springuser";
        List result = jdbcTemplate.query(listSql, new ResultSetExtractor<List>() {

            public List extractData(ResultSet rs)
                    throws SQLException, DataAccessException {
                List result = new ArrayList();
                while (rs.next()) {
                    Map row = new HashMap();
                    row.put(rs.getInt("id"), rs.getString("name"));
                    result.add(row);
                }
                return result;
            }
        });
//    Assert.assertEquals(0, result.size());
        jdbcTemplate.update("DELETE FROM springuser WHERE name='name5'");
    }

    @Test
    public void testQueryDemo() {
        //1.查询一行数据并返回int型结果
        jdbcTemplate.queryForInt("SELECT count(*) FROM springuser");
//2. 查询一行数据并将该行数据转换为Map返回
        jdbcTemplate.queryForMap("SELECT * FROM springuser WHERE name='name5'");
//3.查询一行任何类型的数据，最后一个参数指定返回结果类型
        jdbcTemplate.queryForObject("SELECT count(*) FROM springuser", Integer.class);
//4.查询一批数据，默认将每行数据转换为Map
        jdbcTemplate.queryForList("SELECT * FROM springuser");
//5.只查询一列数据列表，列类型是String类型，列名字是name
        jdbcTemplate.queryForList(" SELECT name FROM springuser WHERE name=?", new Object[]{"name5"}, String.class);
//6.查询一批数据，返回为SqlRowSet，类似于ResultSet，但不再绑定到连接上
        SqlRowSet rs = jdbcTemplate.queryForRowSet("SELECT * FROM test");
    }

    /**
     * 3） 存储过程及函数回调：
     首先修改JdbcTemplateTest的setUp方法，修改后如下所示：
     */
    /**
     * 其中CREATE FUNCTION FUNCTION_TEST用于创建自定义函数，CREATE PROCEDURE PROCEDURE_TEST用于创建存储过程，注意这些创建语句是数据库相关的，本示例中的语句只适用于HSQLDB数据库。
     */
    @Test
    public void setUp2() {
        String createTableSql = "CREATE TABLE `test` (\n" +
                "  `id` INT(11) NOT NULL AUTO_INCREMENT,\n" +
                "  `name` VARCHAR(255) DEFAULT NULL,\n" +
                "  `age` INT(11) DEFAULT NULL,\n" +
                "  PRIMARY KEY (`id`)\n" +
                ") ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8;\n";
        jdbcTemplate.update(createTableSql);

        String createHsqldbFunctionSql =
                "CREATE  FUNCTION `FUNCTION_TEST`(`str` CHAR) RETURNS INT(11) BEGIN RETURN length(str); END";
        jdbcTemplate.update(createHsqldbFunctionSql);
        String createHsqldbProcedureSql =
                "CREATE PROCEDURE PROCEDURE_TEST(INOUT inOutName VARCHAR(100), OUT outId INT) BEGIN   INSERT INTO test(NAME) VALUES (inOutName);   SET outId = IDENTITY();   SET inOutName = 'Hello,' + inOutName; END";
        jdbcTemplate.execute(createHsqldbProcedureSql);
    }

    /**
     * 其中drop语句用于删除创建的存储过程、自定义函数及数据库表。
     */
    @Test
    public void tearDown() {
        jdbcTemplate.execute("DROP FUNCTION FUNCTION_TEST");
        jdbcTemplate.execute("DROP PROCEDURE PROCEDURE_TEST");
        String dropTableSql = "DROP TABLE test";
        jdbcTemplate.execute(dropTableSql);
    }

    /**
     * {call FUNCTION_TEST(?)}：定义自定义函数的sql语句，注意hsqldb {?= call …}和{call …}含义是一样的，而比如mysql中两种含义是不一样的；
     params：用于描述自定义函数占位符参数或命名参数类型；SqlParameter用于描述IN类型参数、SqlOutParameter用于描述OUT类型参数、SqlInOutParameter用于描述INOUT类型参数、SqlReturnResultSet用于描述调用存储过程或自定义函数返回的ResultSet类型数据，其中SqlReturnResultSet需要提供结果集处理回调用于将结果集转换为相应的形式，hsqldb自定义函数返回值是ResultSet类型。
     CallableStatementCreator：提供Connection对象用于创建CallableStatement对象
     outValues：调用call方法将返回类型为Map<String, Object>对象；
     outValues.get("result")：获取结果，即通过SqlReturnResultSet对象转换过的数据；其中SqlOutParameter、SqlInOutParameter、SqlReturnResultSet指定的name用于从call执行后返回的Map中获取相应的结果，即name是Map的键。
     注：因为hsqldb {?= call …}和{call …}含义是一样的，因此调用自定义函数将返回一个包含结果的ResultSet。
     */
    @Test
    public void testCallableStatementCreator1() {
        final String callFunctionSql = "{call FUNCTION_TEST(?)}";
        List<SqlParameter> params = new ArrayList<SqlParameter>();
        params.add(new SqlParameter(Types.VARCHAR));
        params.add(new SqlReturnResultSet("result", new ResultSetExtractor<Integer>() {

                    public Integer extractData(ResultSet rs) throws SQLException, DataAccessException {
                        while (rs.next()) {
                            return rs.getInt(1);
                        }
                        return 0;
                    }
                })
        );


        Map<String, Object> outValues = jdbcTemplate.call(
                new CallableStatementCreator() {

                    public CallableStatement createCallableStatement(Connection conn) throws SQLException {
                        CallableStatement cstmt = conn.prepareCall(callFunctionSql);
                        cstmt.setString(1, "test");
                        return cstmt;
                    }
                }, params);
        Assert.assertEquals(4, outValues.get("result"));
    }


    /**
     * 们示例下MySQL如何调用自定义函数：
     * getMysqlDataSource：首先启动mysql（本书使用5.4.3版本），其次登录mysql创建test数据库（“create database test;”），在进行测试前，请先下载并添加mysql-connector-java-5.1.10.jar到classpath；
     {?= call FUNCTION_TEST(?)}：可以使用{?= call …}形式调用自定义函数；
     params：无需使用SqlReturnResultSet提取结果集数据，而是使用SqlOutParameter来描述自定义函数返回值；
     CallableStatementCreator：同上个例子含义一样；
     cstmt.registerOutParameter(1, Types.INTEGER)：将OUT类型参数注册为JDBC类型Types.INTEGER，此处即返回值类型为Types.INTEGER。
     outValues.get("result")：获取结果，直接返回Integer类型，比hsqldb简单多了吧。
     */

    @Test
    public void testCallableStatementCreator2() {
        JdbcTemplate mysqlJdbcTemplate = new JdbcTemplate(getMysqlDataSource());
        //2.创建自定义函数
        String createFunctionSql =
                "CREATE FUNCTION FUNCTION_TEST(str VARCHAR(100)) " +
                        "returns INT return LENGTH(str)";
        String dropFunctionSql = "DROP FUNCTION IF EXISTS FUNCTION_TEST";
        mysqlJdbcTemplate.update(dropFunctionSql);
        mysqlJdbcTemplate.update(createFunctionSql);
//3.准备sql,mysql支持{?= call …}
        final String callFunctionSql = "{?= call FUNCTION_TEST(?)}";
//4.定义参数
        List<SqlParameter> params = new ArrayList<SqlParameter>();
        params.add(new SqlOutParameter("result", Types.INTEGER));
        params.add(new SqlParameter("str", Types.VARCHAR));
        Map<String, Object> outValues = mysqlJdbcTemplate.call(
                new CallableStatementCreator() {
                    public CallableStatement createCallableStatement(Connection conn) throws SQLException {
                        CallableStatement cstmt = conn.prepareCall(callFunctionSql);
                        cstmt.registerOutParameter(1, Types.INTEGER);
                        cstmt.setString(2, "test");
                        return cstmt;
                    }}, params);
        Assert.assertEquals(4, outValues.get("result"));
    }
    public DataSource getMysqlDataSource() {
        String url = "jdbc:mysql://localhost:3306/jdbc";
        DriverManagerDataSource dataSource =
                new DriverManagerDataSource(url, "root", "root");     dataSource.setDriverClassName("com.mysql.jdbc.Driver");
        return dataSource;
    }

    /**
     * {call PROCEDURE_TEST(?, ?)}：定义存储过程sql；
     params：定义存储过程参数；SqlInOutParameter描述INOUT类型参数、SqlOutParameter描述OUT类型参数；
     CallableStatementCreator：用于创建CallableStatement，并设值及注册OUT参数类型；
     outValues：通过SqlInOutParameter及SqlOutParameter参数定义的name来获取存储过程结果。

     JdbcTemplate类还提供了很多便利方法，在此就不一一介绍了，但这些方法是由规律可循的，第一种就是提供回调接口让用户决定
     做什么，第二种可以认为是便利方法（如queryForXXX），用于那些比较简单的操作
     */
    @Test
    public void testCallableStatementCreator3() {
        final String callProcedureSql = "{call PROCEDURE_TEST(?, ?)}";
        List<SqlParameter> params = new ArrayList<SqlParameter>();
        params.add(new SqlInOutParameter("inOutName", Types.VARCHAR));
        params.add(new SqlOutParameter("outId", Types.INTEGER));
        Map<String, Object> outValues = jdbcTemplate.call(
                new CallableStatementCreator() {

                    public CallableStatement createCallableStatement(Connection conn) throws SQLException {
                        CallableStatement cstmt = conn.prepareCall(callProcedureSql);
                        cstmt.registerOutParameter(1, Types.VARCHAR);
                        cstmt.registerOutParameter(2, Types.INTEGER);
                        cstmt.setString(1, "test");
                        return cstmt;
                    }}, params);
        Assert.assertEquals("Hello,test", outValues.get("inOutName"));
        Assert.assertEquals(0, outValues.get("outId"));
    }


}
