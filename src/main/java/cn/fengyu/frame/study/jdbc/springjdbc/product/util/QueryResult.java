package cn.fengyu.frame.study.jdbc.springjdbc.product.util;

import java.util.List;

/**
 * ��ҳ�Ĺ����ࣺ
 * @param <T>
 */
public class QueryResult<T> {

    private List<T> list; // �����
    private int totalRow; // �ܼ�¼��

    public QueryResult() {
    }

    public QueryResult(List<T> list, int totalRow) {
        this.list = list;
        this.totalRow = totalRow;
    }

    public List<T> getList() {
        return list;
    }

    public void setList(List<T> list) {
        this.list = list;
    }

    public int getTotalRow() {
        return totalRow;
    }

    public void setTotalRow(int totalRow) {
        this.totalRow = totalRow;
    }

    //getter and setter

}