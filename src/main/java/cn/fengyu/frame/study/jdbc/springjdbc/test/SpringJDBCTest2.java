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

    //1��Ԥ������估�洢���̴����ص����Զ��幦�ܻص�ʹ�ã�����ʹ��PreparedStatementCreator
    // ����һ��Ԥ������䣬�����JdbcTemplateͨ��PreparedStatementCallback�ص����أ�����
    // ���������ִ�и�PreparedStatement���˴�����ʹ�õ���execute������
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

    //2��Ԥ���������ֵ�ص�ʹ�ã�

    /**
     * ͨ��JdbcTemplate��int update(String sql, PreparedStatementSetter
     * pss)ִ��Ԥ����sql������sql����Ϊ��insert into test(name) values (?)
     * ������sql��һ��ռλ����Ҫ��ִ��ǰ��ֵ��PreparedStatementSetterʵ�־���Ϊ����ֵ��ʹ
     * ��setValues(PreparedStatement pstmt)�ص�������ֵ��Ӧ��ռλ��λ�õ�ֵ��
     * JdbcTemplateҲ�ṩһ�ָ��򵥵ķ�ʽ��update(String sql, Object...
     * args)
     * ����ʵ����ֵ������ֻҪ��ʹ�ø��ַ�ʽ����������ʱ��Ӧʹ��PreparedStatementSetter��
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
     * 3�����������ص���
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
     * RowMapper�ӿ��ṩmapRow(ResultSet rs, int rowNum)�������������ÿһ��ת��Ϊһ��Map����Ȼ����ת��Ϊ�����࣬���Ķ�����ʽ��
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
     * RowCallbackHandler�ӿ�Ҳ�ṩ����processRow(ResultSet rs)���ܽ����������ת��Ϊ��Ҫ����ʽ��
     * ResultSetExtractorʹ�ûص�����extractData(ResultSet rs)�ṩ���û���������������û�������δ���ý������
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
        //1.��ѯһ�����ݲ�����int�ͽ��
        jdbcTemplate.queryForInt("SELECT count(*) FROM springuser");
//2. ��ѯһ�����ݲ�����������ת��ΪMap����
        jdbcTemplate.queryForMap("SELECT * FROM springuser WHERE name='name5'");
//3.��ѯһ���κ����͵����ݣ����һ������ָ�����ؽ������
        jdbcTemplate.queryForObject("SELECT count(*) FROM springuser", Integer.class);
//4.��ѯһ�����ݣ�Ĭ�Ͻ�ÿ������ת��ΪMap
        jdbcTemplate.queryForList("SELECT * FROM springuser");
//5.ֻ��ѯһ�������б���������String���ͣ���������name
        jdbcTemplate.queryForList(" SELECT name FROM springuser WHERE name=?", new Object[]{"name5"}, String.class);
//6.��ѯһ�����ݣ�����ΪSqlRowSet��������ResultSet�������ٰ󶨵�������
        SqlRowSet rs = jdbcTemplate.queryForRowSet("SELECT * FROM test");
    }

    /**
     * 3�� �洢���̼������ص���
     �����޸�JdbcTemplateTest��setUp�������޸ĺ�������ʾ��
     */
    /**
     * ����CREATE FUNCTION FUNCTION_TEST���ڴ����Զ��庯����CREATE PROCEDURE PROCEDURE_TEST���ڴ����洢���̣�ע����Щ������������ݿ���صģ���ʾ���е����ֻ������HSQLDB���ݿ⡣
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
     * ����drop�������ɾ�������Ĵ洢���̡��Զ��庯�������ݿ��
     */
    @Test
    public void tearDown() {
        jdbcTemplate.execute("DROP FUNCTION FUNCTION_TEST");
        jdbcTemplate.execute("DROP PROCEDURE PROCEDURE_TEST");
        String dropTableSql = "DROP TABLE test";
        jdbcTemplate.execute(dropTableSql);
    }

    /**
     * {call FUNCTION_TEST(?)}�������Զ��庯����sql��䣬ע��hsqldb {?= call ��}��{call ��}������һ���ģ�������mysql�����ֺ����ǲ�һ���ģ�
     params�����������Զ��庯��ռλ�������������������ͣ�SqlParameter��������IN���Ͳ�����SqlOutParameter��������OUT���Ͳ�����SqlInOutParameter��������INOUT���Ͳ�����SqlReturnResultSet�����������ô洢���̻��Զ��庯�����ص�ResultSet�������ݣ�����SqlReturnResultSet��Ҫ�ṩ���������ص����ڽ������ת��Ϊ��Ӧ����ʽ��hsqldb�Զ��庯������ֵ��ResultSet���͡�
     CallableStatementCreator���ṩConnection�������ڴ���CallableStatement����
     outValues������call��������������ΪMap<String, Object>����
     outValues.get("result")����ȡ�������ͨ��SqlReturnResultSet����ת���������ݣ�����SqlOutParameter��SqlInOutParameter��SqlReturnResultSetָ����name���ڴ�callִ�к󷵻ص�Map�л�ȡ��Ӧ�Ľ������name��Map�ļ���
     ע����Ϊhsqldb {?= call ��}��{call ��}������һ���ģ���˵����Զ��庯��������һ�����������ResultSet��
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
     * ��ʾ����MySQL��ε����Զ��庯����
     * getMysqlDataSource����������mysql������ʹ��5.4.3�汾������ε�¼mysql����test���ݿ⣨��create database test;�������ڽ��в���ǰ���������ز����mysql-connector-java-5.1.10.jar��classpath��
     {?= call FUNCTION_TEST(?)}������ʹ��{?= call ��}��ʽ�����Զ��庯����
     params������ʹ��SqlReturnResultSet��ȡ��������ݣ�����ʹ��SqlOutParameter�������Զ��庯������ֵ��
     CallableStatementCreator��ͬ�ϸ����Ӻ���һ����
     cstmt.registerOutParameter(1, Types.INTEGER)����OUT���Ͳ���ע��ΪJDBC����Types.INTEGER���˴�������ֵ����ΪTypes.INTEGER��
     outValues.get("result")����ȡ�����ֱ�ӷ���Integer���ͣ���hsqldb�򵥶��˰ɡ�
     */

    @Test
    public void testCallableStatementCreator2() {
        JdbcTemplate mysqlJdbcTemplate = new JdbcTemplate(getMysqlDataSource());
        //2.�����Զ��庯��
        String createFunctionSql =
                "CREATE FUNCTION FUNCTION_TEST(str VARCHAR(100)) " +
                        "returns INT return LENGTH(str)";
        String dropFunctionSql = "DROP FUNCTION IF EXISTS FUNCTION_TEST";
        mysqlJdbcTemplate.update(dropFunctionSql);
        mysqlJdbcTemplate.update(createFunctionSql);
//3.׼��sql,mysql֧��{?= call ��}
        final String callFunctionSql = "{?= call FUNCTION_TEST(?)}";
//4.�������
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
     * {call PROCEDURE_TEST(?, ?)}������洢����sql��
     params������洢���̲�����SqlInOutParameter����INOUT���Ͳ�����SqlOutParameter����OUT���Ͳ�����
     CallableStatementCreator�����ڴ���CallableStatement������ֵ��ע��OUT�������ͣ�
     outValues��ͨ��SqlInOutParameter��SqlOutParameter���������name����ȡ�洢���̽����

     JdbcTemplate�໹�ṩ�˺ܶ�����������ڴ˾Ͳ�һһ�����ˣ�����Щ�������ɹ��ɿ�ѭ�ģ���һ�־����ṩ�ص��ӿ����û�����
     ��ʲô���ڶ��ֿ�����Ϊ�Ǳ�����������queryForXXX����������Щ�Ƚϼ򵥵Ĳ���
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
