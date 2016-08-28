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
 * SimpleJdbcTemplate��Ҳ�ǻ���JdbcTemplate�࣬������Java5+�Ŀɱ�����б���Զ�װ��Ͳ���Ӷ���ȡ�����Ĵ��롣
 SimpleJdbcTemplate��Ҫ�ṩ���෽����query��queryForXXX������update��batchUpdate������
 ���������ǿ������Ӱ�

 1��SimpleJdbcTemplate��ʼ��������ʹ��DataSource��JdbcTemplate��NamedParameterJdbcTemplate������Ϊ������������ʼ����
 2��update(insertSql, 10, "name5")������Java5+�ɱ�����б�Ӷ�����new Object[]{10, "name5"}��ʽ��
 3��query(selectSql, mapper, 10, "name5")��ʹ��Java5+�ɱ�����б�RowMapper�ص������÷���������ָ������ֵ���ͣ�List<UserModel>����

 SimpleJdbcTemplate�໹֧�������������ԣ���queryForList(String sql, SqlParameterSource args)��queryForList(String sql, Map<String, ?> args) ��������NamedParameterJdbcTemplate��ʹ�ã��ڴ˾Ͳ������ˡ�
 ע��SimpleJdbcTemplate���ṩ������ParameterizedRowMapper ���ڷ������Ե�֧�֣�ParameterizedRowMapper��RowMapper�����࣬����spring 3.0������������ҪJava5+����˲�����ҪParameterizedRowMapper ��������ֱ��ʹ��RowMapper��
 query(String sql, ParameterizedRowMapper<T> rm, SqlParameterSource args)
 query(String sql, RowMapper<T> rm, Object... args) //ֱ��ʹ�ø����

 SimpleJdbcTemplate���ṩ���·������ڻ�ȡJdbcTemplate��NamedParameterJdbcTemplate��
 1����ȡJdbcTemplate���󷽷���JdbcOperations��JdbcTemplate�Ľӿ�
 JdbcOperations getJdbcOperations()
 2����ȡNamedParameterJdbcTemplate���󷽷���NamedParameterJdbcOperations��NamedParameterJdbcTemplate�Ľӿ�
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
        //��֧��DataSource��NamedParameterJdbcTemplate��Ϊ����������
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
