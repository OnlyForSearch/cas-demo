package cn.fengyu.frame.study.jdbc.Base.dao;

/**�׳�����ʱ���쳣,
 * Created by fengyu on 2016-08-25.
 */
public class DaoException extends RuntimeException {

    public DaoException() {
        super();
    }

    public DaoException(String message) {
        super(message);
    }

    public DaoException(String message, Throwable cause) {
        super(message, cause);
    }

    public DaoException(Throwable cause) {
        super(cause);
    }


}
