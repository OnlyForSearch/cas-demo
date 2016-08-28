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
     * ���Ա���,
     */
    @Test
    public void testSave() {
        ISpringUserService service = content.getBean("springUserService", ISpringUserService.class);
        service.saveUser();

    }

    /**
     * ���Ա���,��������ع�
     * ����̨����쳣:java.lang.Exception ���鿴���ݿⷢ�ֵ�һ�����ݲ��룬���ڶ�������û�в��룬˵������û�н����˻ع���
     */

    @Test
    public void testSaveThrowException() throws Exception {
        ISpringUserService service = content.getBean("springUserService", ISpringUserService.class);
        service.saveUserThrowException();

    }

    /**
     * ���Ա���,��������ع�
     * ����̨����쳣:java.lang.RuntimeException���鿴���ݿⷢ������û�в��룬˵����������˻ع���
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
     * //jdbcTemplate.update�ʺ���insert ��update��delete������
     * /**
     * ��һ������Ϊִ��sql
     * �ڶ�������Ϊ��������
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
     * ��һ������Ϊִ��sql
     * �ڶ�������Ϊ��������
     * ����������Ϊ��������
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
     * //����sqlע��
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
     * //���ز��������
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
     * �޸�
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


    /*class�ǽ�����ݵ�java����  ʵ���������������䣬����ѯ�Ľ����User���ж�Ӧ����  */
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

    /*class�ǽ�����ݵ�java����  ʵ���������������䣬����ѯ�Ľ����User���ж�Ӧ����  */
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
    //ͨ��RowCallbackHandler��Select���õ���ÿ�м�¼���н�������Ϊ�䴴��һ��User���ݶ���ʵ�����ֶ���ORӳ�䡣
    public void queryUserById4() {
        String id = "65";
        final SpringUser user = new SpringUser();

        //�÷�������ֵΪvoid
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
        //  SpringUser springUser = jdbcTemplate.queryForObject(sql, mapper, 1);//��ѯ�����׳�һ��EmptyResultDataAccessException
        System.out.println("springUser = " + springUser);


    }


    /**
     * ��JdbcTemplate��ʹ�ú����в�ѯ
     * 1�������Ĳ�ѯ
     * JDBCģ����Spring JDBCģ������Ҫ��API�����ṩ�˳��������ݿ���ʹ��ܣ�
     */
    @Test
    public void testBaseQuery() {

        Integer integer = jdbcTemplate.queryForObject("SELECT count(*) FROM user", Integer.class);
        System.out.println(integer);
        Integer integer2 = jdbcTemplate.queryForObject("SELECT count(*) FROM user WHERE id>30", Integer.class);
        System.out.println(integer2);
    }

    /**
     * �򵥵Ĳ��빦�ܣ�
     */
    @Test
    public void testSimpleInsert() {
        //�ṩ�����ı�׼�﷨����ʹ�á������ַ�
        int testSimpleInsert = jdbcTemplate.update("INSERT INTO springuser(name,age) VALUES(?,?)", "testSimpleInsert", 22);
        System.out.println("testSimpleInsert = " + testSimpleInsert);

    }

    /**
     * Ҫ�������������֧�֣�������Ҫʹ��Spring JDBC�ṩ������JDBCģ�塪��NamedParameterJdbcTemplate��
     * �����װ��JbdcTemplate�����ṩ��ʹ�á����������ָ�������Ĵ�ͳ�﷨����ʹ�ô��ݵĲ������滻ռλ������������ִ�д��εĲ�ѯ��
     */
    @Test
    public void testNameParameters() {
        SqlParameterSource parameterSource = new MapSqlParameterSource().addValue("id", 77);
        String s = namedParameterJdbcTemplate.queryForObject("SELECT name FROM user WHERE id=:id", parameterSource, String.class);
        System.out.println("s = " + s);


    }

    /**
     * ʹ��bean���������ȷ����������������
     */
    @Test
    public void testBeanNameParameter() {
//�����ڵ������ѯ�����
        SpringUser user = new SpringUser();
        user.setName("testBeanNameParameter");
        String select = "SELECT COUNT(*) FROM springuser WHERE NAME = :name";

        SqlParameterSource namedParameters = new BeanPropertySqlParameterSource(user);
        Integer integer = namedParameterJdbcTemplate.queryForObject(select, namedParameters, Integer.class);
        System.out.println("integer = " + integer);


        //���ڲ�ѯ�����
        SpringUser user2 = new SpringUser();
        user.setName("springjdbc");
        String select2 = "SELECT COUNT(*) FROM springuser WHERE NAME = :name";

        Integer hasCount = namedParameterJdbcTemplate.queryForObject(select, namedParameters, Integer.class);
        System.out.println("hasCount = " + hasCount);


    }

    /**
     * �Ѳ�ѯ���ӳ�䵽Java����
     * ����һ���ǳ����õĹ����ǰѲ�ѯ���ӳ�䵽Java���󡪡�ͨ��ʵ��RowMapper�ӿڡ�
     * ���磬���ڲ�ѯ���ص�ÿһ�н����Spring��ʹ�ø���ӳ�������Java bean��
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
     * �塢ʹ��SimpleJdbc��ʵ��JDBC����
     * SimpleJdbc���ṩ�򵥵ķ��������ú�ִ��SQL��䡣��Щ��ʹ�����ݿ��Ԫ���������������Ĳ�ѯ�� SimpleJdbcInsert���SimpleJdbcCall���ṩ�˸��򵥵ķ�ʽ��ִ�в���ʹ洢���̵ĵ��á�
     * 1��SimpleJdbcInsert��
     * ���棬������������ִ�м򵥵Ĳ�������������ã�����SimpleJdbcInsert������ò�����INSERT��䡣
     * ��������Ҫ�ṩ���ǣ�������������ֵ���������ȴ���SimpleJdbcInsert��
     */
/*SimpleJdbcInsert��
���棬������������ִ�м򵥵Ĳ�������������ã�����SimpleJdbcInsert������ò�����INSERT��䡣
��������Ҫ�ṩ���ǣ�������������ֵ���������ȴ���SimpleJdbcInsert��*/
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
     * Ϊ�������ݿ��������������ǿ���ʹ��executeAndReturnKey() API�����ǻ���Ҫ���õ�ʵ���Զ����ɵ��У�
     */
    @Test
    public void testSimpleJDBCInsert() {

        SimpleJdbcInsert simpleJdbcInsert = new SimpleJdbcInsert(jdbcTemplate).withTableName("springuser")//
                .usingGeneratedKeyColumns("id");//�Զ���������
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
     * SimpleJdbcCall���ô洢����
     * �����ǿ������ִ�д洢���̡�������ʹ��SimpleJdbcCall�ĳ���
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
     * �������������
     * ��һ���򵥵����������Ѷ��ֲ�������һ��ʵ��������
     * 1��ʹ��JdbcTemplateִ�л��������������
     * ʹ��JdbcTemplate�࣬ͨ��batchUpdate() API��ִ�л����������������
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
     * ʹ��NamedParameterJdbcTemplateִ�����������
     * ���������������������ѡ��ʹ��NamedParameterJdbcTemplate��batchUpdate() API��ִ�С�
     * ��API����ǰ�ĸ��򵥡�������ʵ���κζ���Ľӿ������ò�������Ϊ����һ���ڲ���Ԥ׼������setter������Ԥ��Ĳ���ֵ��
     * ����ֵ����ͨ��batchUpdate()�������ݸ�SqlParameterSource�����顣
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
