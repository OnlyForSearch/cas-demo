package cn.fengyu.frame.study.jdbc.springjdbc.test;

import cn.fengyu.frame.study.jdbc.springjdbc.dao.ISpringUserDao;
import cn.fengyu.frame.study.jdbc.springjdbc.po.SpringUser;
import cn.fengyu.frame.study.jdbc.springjdbc.po.SpringUser2;
import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowCallbackHandler;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 *  NamedParameterJdbcTemplate类是基于JdbcTemplate类，并对它进行了封装从而支持命名参数特性。
 NamedParameterJdbcTemplate主要提供以下三类方法：execute方法、query及queryForXXX方
 法、update及batchUpdate方法。
 1）NamedParameterJdbcTemplate初始化：可以使用DataSource或JdbcTemplate 对象作为构造器参数初始化；
 2）insert into test(name) values(:name)：其中“:name”就是命名参数；
 3） update(insertSql, paramMap)：其中paramMap是一个Map类型，包含键为“name”，值为“name5”的键值对，也就是为命名参数设值的数据；
 4）query(selectSql, paramMap, new RowCallbackHandler()……)：类似于JdbcTemplate中介绍的，唯一不同是需要传入paramMap来为命名参数设值；
 5）update(deleteSql, paramSource)：类似于“update(insertSql, paramMap)”，但使用SqlParameterSource参数来为命名参数设值，此处使用MapSqlParameterSource实现，其就是简单封装Java.util.Map。


 NamedParameterJdbcTemplate类为命名参数设值有两种方式：java.util.Map和SqlParameterSource：
 1）java.util.Map：使用Map键数据来对于命名参数，而Map值数据用于设值；
 2）SqlParameterSource：可以使用SqlParameterSource实现作为来实现为命名参数设值，默认有MapSqlParameterSource和BeanPropertySqlParameterSource实现；MapSqlParameterSource实现非常简单，只是封装了java.util.Map；而BeanPropertySqlParameterSource封装了一个JavaBean对象，通过JavaBean对象属性来决定命名参数的值。



 * Created by fengyu on 2016-08-26.
 */
public class NamedParameterJdbcTemplateTest {

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

    @Test
    public void testNamedParameterJdbcTemplate1() {
        NamedParameterJdbcTemplate namedParameterJdbcTemplate = null;
//namedParameterJdbcTemplate =
//    new NamedParameterJdbcTemplate(dataSource);
        namedParameterJdbcTemplate =
                new NamedParameterJdbcTemplate(jdbcTemplate);
        String insertSql = "insert into test(name) values(:name)";
        String selectSql = "select * from test where name=:name";
        String deleteSql = "delete from test where name=:name";
        Map<String, Object> paramMap = new HashMap<String, Object>();
        paramMap.put("name", "name5");
        namedParameterJdbcTemplate.update(insertSql, paramMap);
        final List<Integer> result = new ArrayList<Integer>();
        namedParameterJdbcTemplate.query(selectSql, paramMap,
                new RowCallbackHandler() {
                    public void processRow(ResultSet rs) throws SQLException {
                        result.add(rs.getInt("id"));
                    }
                });
        Assert.assertEquals(1, result.size());
        SqlParameterSource paramSource = new MapSqlParameterSource(paramMap);
        namedParameterJdbcTemplate.update(deleteSql, paramSource);
    }


    /**
     * 可以看出BeanPropertySqlParameterSource使用能减少很多工作量，但命名参数必须和JavaBean属性名称相对应才可以。
     */
    @Test
    public void testNamedParameterJdbcTemplate2() {
        NamedParameterJdbcTemplate namedParameterJdbcTemplate = null;
        namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(jdbcTemplate);
        SpringUser model = new SpringUser();
        model.setName("name5");
        String insertSql = "insert into springuser(name) values(:myName)";
        SqlParameterSource paramSource = new BeanPropertySqlParameterSource(model);
        namedParameterJdbcTemplate.update(insertSql, paramSource);
    }
    /**测试in*/
@Test
    public void testIN() {
        String sql = "select * from springuser where id in (:param)";

        List<Long> ids = new ArrayList<Long>();
        ids.add(56l);
        ids.add(51l);
        ids.add(52l);
        ids.add(53l);
        ids.add(141l);

        Map<String, Object> paramMap = new HashMap<String, Object>();
        paramMap.put("param", ids);

        NamedParameterJdbcTemplate jdbc = new NamedParameterJdbcTemplate(jdbcTemplate);
        jdbc.query(sql, paramMap, new RowMapper<SpringUser>() {

            public SpringUser mapRow(ResultSet rs, int index)
                    throws SQLException {
                SpringUser user = new SpringUser();
                System.out.println("----- name="+rs.getString("name"));
              System.out.println(index+"----- id="+rs.getLong("id"));

                return null;
            }

        });
    }

/** /*
 * 这里会用到NamedParameterJdbcTemplate两个好处：
 * 1，不用一个个的为参数赋值。
 * 2，可以轻易的得到主键自动增长值
 */

    @Test
    public void add() {
        String sql = "INSERT INTO springuser(name,age) VALUES(:name,:age)";
        //:后面的名称必须和user属性名称一样
        SpringUser springUser = new SpringUser();
        springUser.setAge(22 );
        springUser.setName("add" );
        SqlParameterSource ps=new BeanPropertySqlParameterSource(springUser);
        KeyHolder keyholder=new GeneratedKeyHolder();
        namedParameterJdbcTemplate.update(sql, ps,keyholder);
        //加上KeyHolder这个参数可以得到添加后主键的值
        int m=keyholder.getKey().intValue();
        System.out.println(m);
        //Map map=keyholder.getKeys();//这样可以得到联合主键的值
        //keyholder.getKeyList();//这样可以得到一些主主键值，若一次添加好几条记录
    }


    @Test
    public void count() {
        String sql="select count(*) from springuser";
        //可以通过NamedParameterJdbcTemplate得到JdbcTemplate
        int m=namedParameterJdbcTemplate.getJdbcOperations().queryForInt(sql);
        System.out.println("m = " + m);
    }


    /*
    * 这里会用到NamedParameterJdbcTemplate另一个好处：
    * 位置参数
    */
    @Test
    public void delSpringUser() {
        int sid=45;
        String sql="delete springuser where id=:id";
        Map map=new HashMap();
        map.put("id", sid);
        int update = namedParameterJdbcTemplate.update(sql, map);
        System.out.println("update = " + update);
    }

    @Test
    public void getAllSpringUser() {
        String sql="select id as sid,name as sname,age as sage from springuser";
        List list=namedParameterJdbcTemplate.getJdbcOperations().query(sql,new BeanPropertyRowMapper(SpringUser2.class));
        System.out.println("list = " + list);
    }
    @Test
    public void getSpringUserById() {
        SpringUser2 stu = new SpringUser2();
        stu.setSid(44L);
        String sql="select id as sid,name as sname,age as sage from springuser where id=:sid";
        SqlParameterSource ps=new BeanPropertySqlParameterSource(stu);
        List query = namedParameterJdbcTemplate.query(sql, ps, new BeanPropertyRowMapper(SpringUser2.class));
        System.out.println("query = " + query);
    }
    public SpringUser getOneSpringUser(SpringUser stu) {
        String sql="select s_id as sid,s_name as sname,s_sex as ssex,s_brith as sbrith from stu where s_id=:sid";
        SqlParameterSource ps=new BeanPropertySqlParameterSource(stu);
        return (SpringUser)namedParameterJdbcTemplate.queryForObject(sql, ps, new BeanPropertyRowMapper(SpringUser.class));
    }
    public String getSpringUserName(SpringUser stu) {
        String sql="select s_name as sname from stu where s_name=:sname";
        SqlParameterSource ps=new BeanPropertySqlParameterSource(stu);
        return (String)namedParameterJdbcTemplate.queryForObject(sql, ps, String.class);
    }
    public void updSpringUser(SpringUser stu) {
        String sql="update stu set s_name=:sname,s_sex=:ssex,s_brith=:sbrith where s_id=:sid";
        SqlParameterSource ps=new BeanPropertySqlParameterSource(stu);
        namedParameterJdbcTemplate.update(sql, ps);
    }
}


