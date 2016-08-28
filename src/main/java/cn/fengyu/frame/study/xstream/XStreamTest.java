package cn.fengyu.frame.study.xstream;

import cn.fengyu.frame.study.xstream.bean.Birthday;
import cn.fengyu.frame.study.xstream.bean.Student;
import com.thoughtworks.xstream.XStream;
import com.thoughtworks.xstream.converters.javabean.BeanProvider;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.Date;

/**
 *
 * Java�����XML�ַ������໥ת��
 * Created by fengyu on 2016-08-25.
 */
public class XStreamTest {

    private XStream xstream = null;

    private ObjectOutputStream  out = null;

    private ObjectInputStream in = null;



    private Student bean = null;



    /**

     * <b>function:</b>��ʼ����Դ׼��

     * @author hoojo

     * @createDate Nov 27, 2010 12:16:28 PM

     */

    @Before

    public void init() {

        try {

            xstream = new XStream();

            //xstream = new XStream(new DomDriver()); // ��Ҫxpp3 jar

        } catch (Exception e) {

            e.printStackTrace();

        }

        bean = new Student();

        bean.setAddress("china");

        bean.setEmail("jack@email.com");

        bean.setId(1);

        bean.setName("jack");

        Birthday day = new Birthday();

        day.setBirthday("2010-11-22");

        bean.setBirthday(day);

    }



    /**

     * <b>function:</b>�ͷŶ�����Դ

     * @author hoojo

     * @createDate Nov 27, 2010 12:16:38 PM

     */

    @After

    public void destory() {

        xstream = null;

        bean = null;

        try {

            if (out != null) {

                out.flush();

                out.close();

            }

            if (in != null) {

                in.close();

            }

        } catch (IOException e) {

            e.printStackTrace();

        }

        System.gc();

    }



    public final void fail(String string) {

        System.out.println(string);

    }



    public final void failRed(String string) {

        System.err.println(string);

    }


    /**

     * <b>function:</b>Java����ת����XML�ַ���

     * @author hoojo

     * @createDate Nov 27, 2010 12:19:01 PM

     */

    @Test

    public void writeBean2XML() {

        try {

            fail("------------Bean->XML------------");

            fail(xstream.toXML(bean));

            fail("���������XML");

            //��������

            //xstream.alias("account", Student.class);

            //xstream.alias("����", Birthday.class);

            //xstream.aliasField("����", Student.class, "birthday");

            //xstream.aliasField("����", Birthday.class, "birthday");

            //fail(xstream.toXML(bean));

            //����������

        /*    xstream.aliasField("�ʼ�", Student.class, "email");

            //��������

            xstream.aliasPackage("hoo", "com.hoo.entity");*/

//            fail(xstream.toXML(bean));

        } catch (Exception e) {

            e.printStackTrace();

        }

    }

    /**

     * <b>function:</b>��Java��List����ת����XML����

     * @author hoojo

     * @createDate Nov 27, 2010 12:20:07 PM

     */



}
