package cn.fengyu.frame.study.jdbc.springjdbc.dao.impl;

import cn.fengyu.frame.study.jdbc.springjdbc.dao.ISpringUserDao;
import cn.fengyu.frame.study.jdbc.springjdbc.po.SpringUser;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.support.JdbcDaoSupport;



import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 *
 * springjdbc
 * Created by fengyu on 2016-08-26.
 */
public class SpringUserDaoImpl extends JdbcDaoSupport implements ISpringUserDao{

    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public NamedParameterJdbcTemplate getNamedParameterJdbcTemplate() {
        return namedParameterJdbcTemplate;
    }

    public void setNamedParameterJdbcTemplate(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }

    class SpringUserRowMapper implements RowMapper<SpringUser> {
        //实现ResultSet到SpringUser实体的转换
        public SpringUser mapRow(ResultSet rs, int rowNum) throws SQLException {
            SpringUser m = new SpringUser();
            m.setId(rs.getLong("id"));
            m.setName(rs.getString("name"));
            m.setAge(rs.getInt("age"));
            return m;
        }
    };

    public void save(SpringUser user) {
        getJdbcTemplate().update("insert into springuser(name,age) values(?,?)",user.getName(),user.getAge());

    }

    public List<SpringUser> query(String sql, Object[] args) {
          return getJdbcTemplate().query(sql, args, new SpringUserRowMapper());
    }


    public int getCount() {
  return getJdbcTemplate().queryForObject("SELECT COUNT(*) FROM user", Integer.class);
    }

    public JdbcTemplate getSpringJdbcTemplate() {
        return getJdbcTemplate();
    }
  public NamedParameterJdbcTemplate getSpringNameJdbcTemplate() {
        return getNamedParameterJdbcTemplate();
    }



}
