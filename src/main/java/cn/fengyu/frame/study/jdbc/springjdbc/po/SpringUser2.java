package cn.fengyu.frame.study.jdbc.springjdbc.po;

import java.io.Serializable;

/**
 * Created by fengyu on 2016-08-26.
 */
public class SpringUser2  {

    private Long sid;
    private String sname=null;
    private Integer sage;

    public Long getSid() {
        return sid;
    }

    public void setSid(Long sid) {
        this.sid = sid;
    }

    public String getSname() {
        return sname;
    }

    public void setSname(String sname) {
        this.sname = sname;
    }

    public Integer getSage() {
        return sage;
    }

    public void setSage(Integer sage) {
        this.sage = sage;
    }

    @Override
    public String toString() {
        return "SpringUser2{" +
                "sid=" + sid +
                ", sname='" + sname + '\'' +
                ", sage=" + sage +
                '}';
    }
}
