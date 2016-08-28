package cn.fengyu.frame.study.jdbc.Base;

import cn.fengyu.frame.study.jdbc.util.JdbcUtils;
import org.junit.Test;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Savepoint;
import java.sql.Statement;

/**
 * 
 * 2008-12-7
 * 
 * @author <a href="mailto:liyongibm@gmail.com">liyong</a>
 * 
 */
public class SavePointTest {

	/**
	 * @param args
	 * @throws SQLException
	 */
	public static void main(String[] args) throws SQLException {
		test();
	}

	@Test
	static void test() throws SQLException {
		Connection conn = null;
		Statement st = null;
		ResultSet rs = null;
		Savepoint sp = null;
		try {
			conn = JdbcUtils.getConnection();
			conn.setAutoCommit(false);			
			st = conn.createStatement();
			String sql = "update user set money=money-10 where id=1";
			st.executeUpdate(sql);
			sp = conn.setSavepoint();//设置保存点//前面的数据可以保存进数据库,只会滚一部分

			sql = "update user set money=money-10 where id=3";
			st.executeUpdate(sql);

			sql = "select money from user where id=2";
			rs = st.executeQuery(sql);
			float money = 0.0f;
			if (rs.next()) {
				money = rs.getFloat("money");
			}
			if (money > 300)
				throw new RuntimeException("已经超过最大值！");

			sql = "update user set money=money+10 where id=2";
			st.executeUpdate(sql);

			conn.commit();
		} catch (RuntimeException e) {
			if (conn != null && sp != null) {
				conn.rollback(sp);
				conn.commit();
			}
			throw e;
		} catch (SQLException e) {
			if (conn != null)
				conn.rollback();
			throw e;
		} finally {
			JdbcUtils.free(rs, st, conn);
		}
	}
}
