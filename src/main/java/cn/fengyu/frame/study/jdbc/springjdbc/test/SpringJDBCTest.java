package cn.fengyu.frame.study.jdbc.springjdbc.test;

import cn.feng.web.ssm.user.po.User;
import cn.fengyu.frame.study.jdbc.springjdbc.dao.ISpringUserDao;
import cn.fengyu.frame.study.jdbc.springjdbc.po.SpringUser;
import cn.fengyu.frame.study.jdbc.springjdbc.service.ISpringUserService;
import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.*;
import org.springframework.jdbc.core.namedparam.*;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.jdbc.support.rowset.SqlRowSet;

import javax.swing.*;
import java.sql.*;
import java.util.*;

/**
 * Created by fengyu on 2016-08-26.
 */
public class SpringJDBCTest {

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

    /**
     * 测试保存,
     */
    @Test
    public void testSave() {
        ISpringUserService service = content.getBean("springUserService", ISpringUserService.class);
        service.saveUser();

    }

    /**
     * 测试保存,并且事务回滚
     * ，后台输出异常:java.lang.Exception ，查看数据库发现第一条数据插入，而第二条数据没有插入，说明事务没有进行了回滚。
     */

    @Test
    public void testSaveThrowException() throws Exception {
        ISpringUserService service = content.getBean("springUserService", ISpringUserService.class);
        service.saveUserThrowException();

    }

    /**
     * 测试保存,并且事务回滚
     * ，后台输出异常:java.lang.RuntimeException，查看数据库发现数据没有插入，说明事务进行了回滚。
     */

    @Test
    public void testSaveUserThrowRuntimeException() throws Exception {
        ISpringUserService service = content.getBean("springUserService", ISpringUserService.class);
        service.saveUserThrowRuntimeException();

    }

    @Test
    public void testJDBCDaoQuery() {
        ISpringUserService service = content.getBean("springUserService", ISpringUserService.class);
        service.findUsers();
    }

    /**
     * //jdbcTemplate.update适合于insert 、update和delete操作；
     * /**
     * 第一个参数为执行sql
     * 第二个参数为参数数据
     */

    @Test
    public void testSave3() {

        SpringUser springUser = new SpringUser();
        springUser.setAge(54);
        springUser.setName("testSave3");

        int update = jdbcTemplate.update("INSERT INTO springuser(name,age) VALUES(?,?)", new Object[]{
                "testSave3", 12
        });

        System.out.println("update = " + update);
    }

    /**
     * /**
     * 第一个参数为执行sql
     * 第二个参数为参数数据
     * 第三个参数为参数类型
     */

    @Test
    public void testSave4() {

        SpringUser springUser = new SpringUser();
        springUser.setAge(54);
        springUser.setName("testSave3");

        int update = jdbcTemplate.update("INSERT INTO springuser(name,age) VALUES(?,?)", new Object[]{
                "testSave4", 14
        }, new int[]{java.sql.Types.VARCHAR, Types.INTEGER});

        System.out.println("update = " + update);
    }

    /**
     * //避免sql注入
     */
    @Test
    public void testSave5() {

        final SpringUser springUser = new SpringUser();
//        springUser.setAge(54);
//        springUser.setName("testSave5");
        int update = jdbcTemplate.update("INSERT INTO springuser(name,age) VALUES(?,?)", new PreparedStatementSetter() {
            public void setValues(PreparedStatement preparedStatement) throws SQLException {

//                preparedStatement.setString(1,springUser.getName()==null?null:springUser.getName());
//                preparedStatement.setInt(2,springUser.getAge());
                preparedStatement.setString(1, springUser.getName());
                preparedStatement.setInt(2, springUser.getAge());

            }
        });

        System.out.println("update = " + update);
    }

    /**
     * //返回插入的主键
     */
    @Test
    public void testSave6() {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        final SpringUser springUser = new SpringUser();
        springUser.setAge(54);
        springUser.setName("testSave5");
        jdbcTemplate.update(new PreparedStatementCreator() {

                                public PreparedStatement createPreparedStatement(Connection connection) throws SQLException {
                                    PreparedStatement ps = connection.prepareStatement("INSERT INTO springuser(name,age) VALUES(?,?)", new String[]{"id"});
                                    ps.setString(1, springUser.getName());
                                    ps.setInt(2, springUser.getAge());
                                    return ps;
                                }
                            },
                keyHolder);

        System.out.println("keyHolder.getKeyList() = " + keyHolder.getKeyList());
    }

    /**
     * 修改
     */
    @Test
    public void update() {

        final SpringUser springUser = new SpringUser();
        springUser.setAge(54);
        springUser.setName("testSave5");
        springUser.setId(66l);
        int update = jdbcTemplate.update(
                "UPDATE springuser SET name=?,age=? WHERE id = ?",
                new PreparedStatementSetter() {

                    public void setValues(PreparedStatement ps) throws SQLException {
                        ps.setString(1, springUser.getName());
                        ps.setInt(2, springUser.getAge());
                        ps.setLong(3, springUser.getId());
                    }
                }
        );
        System.out.println("update = " + update);
    }


    /*class是结果数据的java类型  实际上这里是做反射，将查询的结果和User进行对应复制  */
    @Test
    public void queryForObject4() {

        SpringUser user = jdbcTemplate.queryForObject("SELECT * FROM springuser WHERE id = ?", new Object[]{65}, new RowMapper<SpringUser>() {
            public SpringUser mapRow(ResultSet resultSet, int i) throws SQLException {
                SpringUser springUser = new SpringUser();
                springUser.setName(resultSet.getString("name"));
                springUser.setId(resultSet.getLong("id"));
                springUser.setAge(resultSet.getInt("age"));

                return springUser;
            }
        });
        System.out.println("user = " + user);

    }

    /*class是结果数据的java类型  实际上这里是做反射，将查询的结果和User进行对应复制  */
    @Test
    public void queryForObject5() {

     /*   SpringUser user = jdbcTemplate.queryForObject("select id,age,name from springuser where id = ?", new Object[]{65}, SpringUser.class);
        System.out.println("user = " + user);*/

    }

    SpringUser springUser = new SpringUser();

    {
        springUser.setAge(54);
        springUser.setName("testSave5");
        springUser.setId(55L);
    }

    @Test
    @SuppressWarnings("unchecked")
    public void queryForList1() {
     /*   final SpringUser springUser = new SpringUser();
        springUser.setAge(54);
        springUser.setName("testSave5");
        List<SpringUser> springUsers = (List<SpringUser>) jdbcTemplate.queryForList("select * from springuser where name = ?",
                new Object[]{springUser.getName()},
                SpringUser.class);*/
    }

    @Test
    @SuppressWarnings("unchecked")
    public void queryForList2() {
        List<String> strings = jdbcTemplate.queryForList("SELECT name FROM springuser WHERE id > ?",
                new Object[]{springUser.getId()},
                String.class);

        System.out.println("strings = " + strings);
    }


    @Test
    //通过RowCallbackHandler对Select语句得到的每行记录进行解析，并为其创建一个User数据对象。实现了手动的OR映射。
    public void queryUserById4() {
        String id = "65";
        final SpringUser user = new SpringUser();

        //该方法返回值为void
        jdbcTemplate.query("SELECT * FROM springuser WHERE id = ?",
                new Object[]{id},
                new RowCallbackHandler() {


                    public void processRow(ResultSet rs) throws SQLException {
                        /*SpringUser user  = new SpringUser();*/
                        user.setId(rs.getLong("id"));
                        user.setName(rs.getString("name"));
                        user.setAge(rs.getInt("age"));

                    }
                });

        System.out.println("user = " + user);


    }

    @SuppressWarnings("unchecked")

    @Test
    public void list() {


        String sql = "SELECT * FROM springuser WHERE id > ?";
        BeanPropertyRowMapper<SpringUser> userRowMapper = BeanPropertyRowMapper.newInstance(SpringUser.class);

        List query = jdbcTemplate.query(sql,
                new Object[]{55},
                userRowMapper
        );
        System.out.println("query = " + query);
    }


    @Test
    public void testFindById() {
        String sql = "SELECT * FROM springuser WHERE id=?";
        BeanPropertyRowMapper<SpringUser> mapper = BeanPropertyRowMapper.newInstance(SpringUser.class);
        SpringUser springUser = jdbcTemplate.queryForObject(sql, mapper, 55);
        //  SpringUser springUser = jdbcTemplate.queryForObject(sql, mapper, 1);//查询不到抛出一个EmptyResultDataAccessException
        System.out.println("springUser = " + springUser);


    }


    /**
     * 、JdbcTemplate的使用和运行查询
     * 1、基本的查询
     * JDBC模板是Spring JDBC模块中主要的API，它提供了常见的数据库访问功能：
     */
    @Test
    public void testBaseQuery() {

        Integer integer = jdbcTemplate.queryForObject("SELECT count(*) FROM user", Integer.class);
        System.out.println(integer);
        Integer integer2 = jdbcTemplate.queryForObject("SELECT count(*) FROM user WHERE id>30", Integer.class);
        System.out.println(integer2);
    }

    /**
     * 简单的插入功能：
     */
    @Test
    public void testSimpleInsert() {
        //提供参数的标准语法——使用“？”字符
        int testSimpleInsert = jdbcTemplate.update("INSERT INTO springuser(name,age) VALUES(?,?)", "testSimpleInsert", 22);
        System.out.println("testSimpleInsert = " + testSimpleInsert);

    }

    /**
     * 要获得命名参数的支持，我们需要使用Spring JDBC提供的其它JDBC模板——NamedParameterJdbcTemplate。
     * 此类封装了JbdcTemplate，并提供了使用“？”来替代指定参数的传统语法。它使用传递的参数来替换占位符“？”，以执行传参的查询：
     */
    @Test
    public void testNameParameters() {
        SqlParameterSource parameterSource = new MapSqlParameterSource().addValue("id", 77);
        String s = namedParameterJdbcTemplate.queryForObject("SELECT name FROM user WHERE id=:id", parameterSource, String.class);
        System.out.println("s = " + s);


    }

    /**
     * 使用bean类的属性来确定命名参数简单例子
     */
    @Test
    public void testBeanNameParameter() {
//不存在的情况查询结果的
        SpringUser user = new SpringUser();
        user.setName("testBeanNameParameter");
        String select = "SELECT COUNT(*) FROM springuser WHERE NAME = :name";

        SqlParameterSource namedParameters = new BeanPropertySqlParameterSource(user);
        Integer integer = namedParameterJdbcTemplate.queryForObject(select, namedParameters, Integer.class);
        System.out.println("integer = " + integer);


        //存在查询结果的
        SpringUser user2 = new SpringUser();
        user.setName("springjdbc");
        String select2 = "SELECT COUNT(*) FROM springuser WHERE NAME = :name";

        Integer hasCount = namedParameterJdbcTemplate.queryForObject(select, namedParameters, Integer.class);
        System.out.println("hasCount = " + hasCount);


    }

    /**
     * 把查询结果映射到Java对象
     * 还有一个非常有用的功能是把查询结果映射到Java对象——通过实现RowMapper接口。
     * 例如，对于查询返回的每一行结果，Spring会使用该行映射来填充Java bean：
     */
    @Test
    public void testMapperBeanParameter() {

        String query = "SELECT * FROM springuser WHERE id=?";
        SpringUser springUser = jdbcTemplate.queryForObject(query, new Object[]{7}, new SpringUserRowMapper());
        System.out.println("springUser = " + springUser);

    }


    class SpringUserRowMapper implements RowMapper<SpringUser> {
        public SpringUser mapRow(ResultSet resultSet, int rowNum) throws SQLException {
            SpringUser springUser = new SpringUser();
            springUser.setId(resultSet.getLong("id"));
            springUser.setName(resultSet.getString("name"));
            springUser.setAge(resultSet.getInt("age"));
            System.out.println("SpringUserRowMapper:springUser = " + springUser);

            return springUser;
        }
    }

    /**
     * 五、使用SimpleJdbc类实现JDBC操作
     * SimpleJdbc类提供简单的方法来配置和执行SQL语句。这些类使用数据库的元数据来构建基本的查询。 SimpleJdbcInsert类和SimpleJdbcCall类提供了更简单的方式来执行插入和存储过程的调用。
     * 1、SimpleJdbcInsert类
     * 下面，让我们来看看执行简单的插入语句的最低配置，基于SimpleJdbcInsert类的配置产生的INSERT语句。
     * 所有您需要提供的是：表名、列名和值。让我们先创建SimpleJdbcInsert：
     */
/*SimpleJdbcInsert类
下面，让我们来看看执行简单的插入语句的最低配置，基于SimpleJdbcInsert类的配置产生的INSERT语句。
所有您需要提供的是：表名、列名和值。让我们先创建SimpleJdbcInsert：*/
    @Test
    public void testSimpleJDBC() {

        SimpleJdbcInsert simpleJdbcInsert = new SimpleJdbcInsert(jdbcTemplate).withTableName("springuser");
        Map<String, Object> parameters = new HashMap<String, Object>();
        SpringUser springUser = new SpringUser();
        springUser.setAge(32);
        springUser.setId(44l);
        springUser.setName("testSimpleJDBC");


        parameters.put("id", springUser.getId());
        parameters.put("name", springUser.getName());
        parameters.put("age", springUser.getAge());
        int execute = simpleJdbcInsert.execute(parameters);
        System.out.println("execute = " + execute);

    }

    /**
     * 为了让数据库生成主键，我们可以使用executeAndReturnKey() API，我们还需要配置的实际自动生成的列：
     */
    @Test
    public void testSimpleJDBCInsert() {

        SimpleJdbcInsert simpleJdbcInsert = new SimpleJdbcInsert(jdbcTemplate).withTableName("springuser")//
                .usingGeneratedKeyColumns("id");//自动生成主键
        ;
        Map<String, Object> parameters = new HashMap<String, Object>();
        SpringUser springUser = new SpringUser();
        springUser.setAge(32);

        springUser.setName("testSimpleJDBC");


        parameters.put("name", springUser.getName());
        parameters.put("age", springUser.getAge());
        Number executeAndReturnKey = simpleJdbcInsert.executeAndReturnKey(parameters);

        System.out.println("executeAndReturnKey = " + executeAndReturnKey);

    }

    /**
     * SimpleJdbcCall调用存储过程
     * 让我们看看如何执行存储过程——我们使用SimpleJdbcCall的抽象：
     */

    @Test
    public void testSimpleCall() {
        int in = 4;
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("GetUserByID");
        Map<String, Object> execute = simpleJdbcCall.execute(in);
        System.out.println(execute);


    }


    /**
     * 六、批处理操作
     * 另一个简单的用例——把多种操作合在一起实现批处理
     * 1、使用JdbcTemplate执行基本的批处理操作
     * 使用JdbcTemplate类，通过batchUpdate() API来执行基本的批处理操作：
     */
    @Test
    public void testBatchUpdateUsingJdbcTemplate() {

        final List<SpringUser> springUserList = new ArrayList<SpringUser>();
        for (int i = 0; i < 5; i++) {
            SpringUser springUser = new SpringUser();
            springUser.setAge(22 + i);
            springUser.setName("testBatchUpdateUsingJdbcTemplate" + i);
            springUserList.add(springUser);

        }

        int[] batchUpdate = jdbcTemplate.batchUpdate("INSERT INTO springuser(name,age) VALUES(?,?)", new BatchPreparedStatementSetter() {
            public void setValues(PreparedStatement preparedStatement, int i) throws SQLException {
                preparedStatement.setString(1, springUserList.get(i).getName());
                preparedStatement.setLong(2, springUserList.get(i).getAge());
            }

            public int getBatchSize() {
                return springUserList.size();
            }
        });


        System.out.println("batchUpdate = " + Arrays.toString(batchUpdate));

    }

    /**
     * 使用NamedParameterJdbcTemplate执行批处理操作
     * 对于批处理操作，还可以选择使用NamedParameterJdbcTemplate的batchUpdate() API来执行。
     * 此API比先前的更简单——无需实现任何额外的接口来设置参数，因为它有一个内部的预准备语句的setter来传递预设的参数值。
     * 参数值可以通过batchUpdate()方法传递给SqlParameterSource的数组。
     */
    @Test
    public void testBatchUpdateUsingNameJdbcTemplate() {
        final List<SpringUser> springUserList = new ArrayList<SpringUser>();
        for (int i = 0; i < 5; i++) {
            SpringUser springUser = new SpringUser();
            springUser.setAge(22 + i);
            springUser.setName("NameJdbcTemplate" + i);
            springUserList.add(springUser);

        }
        SqlParameterSource[] batch = SqlParameterSourceUtils.createBatch(springUserList.toArray());
        int[] ints = namedParameterJdbcTemplate.batchUpdate("INSERT INTO springuser(name,age) VALUES(:name,:age)", batch);
        System.out.println("Arrays.toString(ints) = " + Arrays.toString(ints));
    }


}
