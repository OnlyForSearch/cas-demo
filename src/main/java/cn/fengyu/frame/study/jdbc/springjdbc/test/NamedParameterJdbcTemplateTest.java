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
 *  NamedParameterJdbcTemplate���ǻ���JdbcTemplate�࣬�����������˷�װ�Ӷ�֧�������������ԡ�
 NamedParameterJdbcTemplate��Ҫ�ṩ�������෽����execute������query��queryForXXX��
 ����update��batchUpdate������
 1��NamedParameterJdbcTemplate��ʼ��������ʹ��DataSource��JdbcTemplate ������Ϊ������������ʼ����
 2��insert into test(name) values(:name)�����С�:name����������������
 3�� update(insertSql, paramMap)������paramMap��һ��Map���ͣ�������Ϊ��name����ֵΪ��name5���ļ�ֵ�ԣ�Ҳ����Ϊ����������ֵ�����ݣ�
 4��query(selectSql, paramMap, new RowCallbackHandler()����)��������JdbcTemplate�н��ܵģ�Ψһ��ͬ����Ҫ����paramMap��Ϊ����������ֵ��
 5��update(deleteSql, paramSource)�������ڡ�update(insertSql, paramMap)������ʹ��SqlParameterSource������Ϊ����������ֵ���˴�ʹ��MapSqlParameterSourceʵ�֣�����Ǽ򵥷�װJava.util.Map��


 NamedParameterJdbcTemplate��Ϊ����������ֵ�����ַ�ʽ��java.util.Map��SqlParameterSource��
 1��java.util.Map��ʹ��Map������������������������Mapֵ����������ֵ��
 2��SqlParameterSource������ʹ��SqlParameterSourceʵ����Ϊ��ʵ��Ϊ����������ֵ��Ĭ����MapSqlParameterSource��BeanPropertySqlParameterSourceʵ�֣�MapSqlParameterSourceʵ�ַǳ��򵥣�ֻ�Ƿ�װ��java.util.Map����BeanPropertySqlParameterSource��װ��һ��JavaBean����ͨ��JavaBean������������������������ֵ��



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
     * ���Կ���BeanPropertySqlParameterSourceʹ���ܼ��ٺܶ๤���������������������JavaBean�����������Ӧ�ſ��ԡ�
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
    /**����in*/
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
 * ������õ�NamedParameterJdbcTemplate�����ô���
 * 1������һ������Ϊ������ֵ��
 * 2���������׵ĵõ������Զ�����ֵ
 */

    @Test
    public void add() {
        String sql = "INSERT INTO springuser(name,age) VALUES(:name,:age)";
        //:��������Ʊ����user��������һ��
        SpringUser springUser = new SpringUser();
        springUser.setAge(22 );
        springUser.setName("add" );
        SqlParameterSource ps=new BeanPropertySqlParameterSource(springUser);
        KeyHolder keyholder=new GeneratedKeyHolder();
        namedParameterJdbcTemplate.update(sql, ps,keyholder);
        //����KeyHolder����������Եõ���Ӻ�������ֵ
        int m=keyholder.getKey().intValue();
        System.out.println(m);
        //Map map=keyholder.getKeys();//�������Եõ�����������ֵ
        //keyholder.getKeyList();//�������Եõ�һЩ������ֵ����һ����Ӻü�����¼
    }


    @Test
    public void count() {
        String sql="select count(*) from springuser";
        //����ͨ��NamedParameterJdbcTemplate�õ�JdbcTemplate
        int m=namedParameterJdbcTemplate.getJdbcOperations().queryForInt(sql);
        System.out.println("m = " + m);
    }


    /*
    * ������õ�NamedParameterJdbcTemplate��һ���ô���
    * λ�ò���
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


