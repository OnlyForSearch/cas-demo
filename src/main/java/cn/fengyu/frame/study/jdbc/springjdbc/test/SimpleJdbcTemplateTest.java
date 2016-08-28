package cn.fengyu.frame.study.jdbc.springjdbc.test;

import cn.fengyu.frame.study.jdbc.springjdbc.dao.ISpringUserDao;
import cn.fengyu.frame.study.jdbc.springjdbc.po.SpringUser;
import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcTemplate;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

/**
 *
 * SimpleJdbcTemplate类也是基于JdbcTemplate类，但利用Java5+的可变参数列表和自动装箱和拆箱从而获取更简洁的代码。
 SimpleJdbcTemplate主要提供两类方法：query及queryForXXX方法、update及batchUpdate方法。
 首先让我们看个例子吧

 1）SimpleJdbcTemplate初始化：可以使用DataSource、JdbcTemplate或NamedParameterJdbcTemplate对象作为构造器参数初始化；
 2）update(insertSql, 10, "name5")：采用Java5+可变参数列表从而代替new Object[]{10, "name5"}方式；
 3）query(selectSql, mapper, 10, "name5")：使用Java5+可变参数列表及RowMapper回调并利用泛型特性来指定返回值类型（List<UserModel>）。

 SimpleJdbcTemplate类还支持命名参数特性，如queryForList(String sql, SqlParameterSource args)和queryForList(String sql, Map<String, ?> args) ，类似于NamedParameterJdbcTemplate中使用，在此就不介绍了。
 注：SimpleJdbcTemplate还提供类似于ParameterizedRowMapper 用于泛型特性的支持，ParameterizedRowMapper是RowMapper的子类，但从spring 3.0由于允许环境需要Java5+，因此不再需要ParameterizedRowMapper ，而可以直接使用RowMapper；
 query(String sql, ParameterizedRowMapper<T> rm, SqlParameterSource args)
 query(String sql, RowMapper<T> rm, Object... args) //直接使用该语句

 SimpleJdbcTemplate还提供如下方法用于获取JdbcTemplate和NamedParameterJdbcTemplate：
 1）获取JdbcTemplate对象方法：JdbcOperations是JdbcTemplate的接口
 JdbcOperations getJdbcOperations()
 2）获取NamedParameterJdbcTemplate对象方法：NamedParameterJdbcOperations是NamedParameterJdbcTemplate的接口
 NamedParameterJdbcOperations getNamedParameterJdbcOperations()
 * Created by fengyu on 2016-08-26.
 */
public class SimpleJdbcTemplateTest {

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

     class UserRowMapper implements RowMapper<SpringUser> {
        public SpringUser mapRow(ResultSet rs, int rowNum) throws SQLException {
            SpringUser model = new SpringUser();
            model.setId(rs.getLong("id"));
            model.setName(rs.getString("name"));
            return model;
        }
    }

    @Test
    public void testSimpleJdbcTemplate() {
        //还支持DataSource和NamedParameterJdbcTemplate作为构造器参数
        SimpleJdbcTemplate simpleJdbcTemplate = new SimpleJdbcTemplate(jdbcTemplate);
        String insertSql = "insert into test(id, name) values(?, ?)";
        simpleJdbcTemplate.update(insertSql, 10, "name5");
        String selectSql = "select * from test where id=? and name=?";
        List<Map<String, Object>> result = simpleJdbcTemplate.queryForList(selectSql, 10, "name5");
        Assert.assertEquals(1, result.size());
        RowMapper<SpringUser> mapper = new UserRowMapper();
        List<SpringUser> result2 = simpleJdbcTemplate.query(selectSql, mapper, 10, "name5");
        Assert.assertEquals(1, result2.size());
    }
}
