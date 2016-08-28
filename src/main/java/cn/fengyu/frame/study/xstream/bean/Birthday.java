package cn.fengyu.frame.study.xstream.bean;

import java.util.Date;

/**
 *
 *
 * Created by fengyu on 2016-08-25.
 */
public class Birthday {
    private String birthday;

    public String getBirthday() {
        return birthday;
    }

    public void setBirthday(String birthday) {
        this.birthday = birthday;
    }

    @Override
    public String toString() {
        return "Birthday{" +
                "birthday=" + birthday +
                '}';
    }
}
