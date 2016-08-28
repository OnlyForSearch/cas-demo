package cn.fengyu.frame.string;

import org.junit.Test;

import java.io.UnsupportedEncodingException;

/**
 * Created by fengyu on 2016-08-26.
 */
public class StringEncode {

    /**
     * Java��String ����ط���

     getBytes���ĸ����ط�������һ���ǹ�ʱ�ģ��ܵ�˵���������֣�ָ���˱���ĺ�û��ָ������ģ�û��ָ�����룬����ʹ��ƽ̨��ȱʡ���룬���ƽ̨��ָJVM�����JVM����ʱû��ָ�����룬��ô���ȱʡ����Ҳ���ǲ���ϵͳ��ȱʡ�����ˡ���������������ǰ��ַ�����ָ���ı��뷽ʽ����Ϊ�ֽ����飬��ʵ��Ӧ�þ��ǽ��ڴ��д洢��UTF-16�ı�������ת��Ϊ�������뷽ʽ���ֽ����顣

     length��������������ǳ��õ�һ���������������ַ����ĳ��ȣ�������Ȳ����ַ��ĸ�����������Ԫ�ĸ�������Java��Ҳ����UTF-16����Ԫ�����ˡ���charAt, substring��Щ�����������ʵ��Ҳ�ǻ�����Ԫ�ĸ���������ַ��������أ������ַ���BMPƽ����ܱ�ʾ�ˣ�����ƽʱ�Ӵ����Ŀ��������Ԫ�������ַ��������Ƕ�Ӧ�ġ�
     * @throws UnsupportedEncodingException
     */
    @Test
    public void testCharacterEncode() throws UnsupportedEncodingException {





        final String interesting = "hi���";
        System.out.println(interesting.length()); // 4

        final byte[] utf8Bytes = interesting.getBytes("UTF-8");
// ���8��ÿ��Ӣ����ĸռһ���ֽڣ�ÿ������3���ֽ�
        System.out.println(utf8Bytes.length);
//68 69 E4 BD A0 E5 A5 BD
        System.out.println(toHex(utf8Bytes));
        System.out.println(utf8Bytes.length);
        final byte[] utf16Bytes = interesting.getBytes("UTF-16");
// ���10��ÿ���ַ�2���ֽڣ����BOM�����ֽ�
        System.out.println(utf16Bytes.length);
//����п�ͷ��FE FF���Ǵ�˵�е�BOM(Byte Order Marker����������˻���С�˵�)�ˣ���ʵ����U+FEFF���
//EF BB BF ����һ�����UTF-8�µı��룬UTF-8ֻ�д�ˣ�û�д�С��֮�֣����Բ����鱣��ʱ��BOM�����ڲ�֧��BOM����������δ֪����
//FE FF 00 68 00 69 4F 60 59 7D
        System.out.println(toHex(utf16Bytes));
        final byte[] utf16beBytes = interesting.getBytes("UTF-16BE");
// ���8��ÿ���ַ�2���ֽڣ�UTF-16��˱��룬���Կ�����������Ľ������û��BOM���֮���UTF-16��һ���ġ�
        System.out.println(utf16beBytes.length);
//00 68 00 69 4F 60 59 7D
        System.out.println(toHex(utf16beBytes));
        final byte[] utf32Bytes = interesting.getBytes("UTF-32");
// ���16��ÿ���ַ�4���ֽڣ�UTF-32��ʵҲ�ǿ����д�С��֮�ֵ�
        System.out.println(utf32Bytes.length);
//00 00 00 68 00 00 00 69 00 00 4F 60 00 00 59 7D
        System.out.println(toHex(utf32Bytes));
        final byte[] isoBytes = interesting.getBytes("ISO-8859-1");
// ���4���������ֳ������ı�ʾ��Χ��������ʶ��Ȼ��ͱ����`?`��
        System.out.println(isoBytes.length);
//68 69 3F 3F
        System.out.println(toHex(isoBytes));
        final byte[] gb2312Bytes = interesting.getBytes("GB2312");
// ���6
        System.out.println(gb2312Bytes.length);
//68 69 C4 E3 BA C3
        System.out.println(toHex(gb2312Bytes));
        final byte[] gbkBytes = interesting.getBytes("GBK");
// ���6�� �Ƕ�GB2312����չ�������������һ��
        System.out.println(gbkBytes.length);
// 68 69 C4 E3 BA C3
        System.out.println(toHex(gbkBytes));

//s������ƽ���һ���ַ���UTF-16��Ҫ�ĸ��ֽڴ棬���������char���͸�ֵ���ᱨ��char���������ֽڵģ�����Ȼ���治��
// char c = '?';
        String s = "?";
//Returns the length of this string. The length is equal to the number of Unicode code units in the string.
//������length������ע�ͣ����Կ�������ַ������ȣ�ʵ������Ԫ�ĸ�������Java����UTF-16�洢�ַ����ģ������������UTF-16����Ԫ�����ˣ���2
        System.out.println(s.length()); //2  ���������Ԫ��Ŀ��Ҳ����UTF-16��Ԫ����Ŀ
//���������������ʵҲ�������Ԫ�ģ�����ǰ��ַ���Ļ���sֻ��һ���ַ����������������ɾͶ�Խ���ˣ���ʵ�����ǲ�û��
        System.out.println(s.charAt(1));
        System.out.println(s.substring(1));
        System.out.println(s.equals("\uD869\uDEA5"));//s��ת���ʾ������UTF-16�Ĵ����
        System.out.println(s.codePointAt(0) == 0x2A6A5);//s�����U+2A6A5
        System.out.println(toHex(s.getBytes("utf-16be"))); //D8 69 DE A5
//������һ������ַ�����һ���Ĵ���
        s = "???????????????????????????????????????";
        System.out.println(s.length()); //39,��ζ����39����Ԫ��������ʾ��ȷʵ��һ���ַ�
//0E 2A 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49
        System.out.println(toHex(s.getBytes("utf-16be")));

//�������ֱ���������ַ�����ΪUTF-8�Ժ��ֱ��������ֽڣ���GBK�������ֽڣ���ʵ���������ֽڵ��������
        System.out.println(new String(interesting.getBytes("UTF-8"),"GBK"));
//�������ֱ���������ַ�����ΪUTF-8�Ժ��ֱ��������ֽڣ���ISO-8859-1�ǵ��ֽڱ��룬�������ֽڱ������������ֽ�������
        System.out.println(new String(interesting.getBytes("UTF-8"),"ISO-8859-1"));
//�������ֱ��������'?'����ΪISO-8859-1�ǵ��ֽڱ��룬����ʶ�Ķ���3FҲ����'?'���룬����ʱGBKҲ�͵����ʺ���
        System.out.println(new String(interesting.getBytes("ISO-8859-1"),"GBK"));
//�������ֱ�����ĸ��ַ�����ΪGBK�Ժ��ֱ��������ֽڣ���ISO-8859-1�ǵ��ֽڱ��룬����˫�ֽڱ������ĸ����ֽ�������
        System.out.println(new String(interesting.getBytes("GBK"),"ISO-8859-1"));
// 68 69 C4 E3 BA C3 -> 68 69 3F 3F 3F 3F
        System.out.println(toHex(new String(interesting.getBytes("GBK"),"ISO-8859-1").getBytes("GBK")));
//�������ֱ�����ĸ�'?'���漰���α���룬�����и����ʣ���һ�ΰ�GBK�����ٰ�ISO-8859-1���룬�ֽ���û��ÿ���ֽ���洢������û�仹��68 69 C4 E3 BA C3
//Ϊʲô����GBK�������ͱ��3F�ˣ�GBK���ǰ���C4E3 BAC3��ô�������ģ��Ҿ���Ӧ�ø��ַ����Ĵ洢�й�ϵ��getBytes���������ʵ���Ǵ�UTF-16�����������һ��ת������
//C4 E3 BA C3 �洢������00C4 00E3 00BA 00C3Ȼ��00C4��ʲôGBKû�ж�Ӧ�ı��룬Ȼ�����3F��
        System.out.println(new String(new String(interesting.getBytes("GBK"),"ISO-8859-1").getBytes("GBK"),"GBK"));
//����������������ȷ���ˣ��ڶ��α���ʱ����������ݻ���68 69 C4 E3 BA C3 �ٰ�GBK������Ȼ�ܹ���C4E3 BAC3תΪ��Ӧ�ĺ���
        System.out.println(new String(new String(interesting.getBytes("GBK"),"ISO-8859-1").getBytes("ISO-8859-1"),"GBK"));
    }

    private boolean toHex(byte[] bytes) {
    return true;
    }

/**
 *
 *Java Web �漰���ı���
 URL�еı���
 *  +-----------------URL-------------------------+
 /                      +---------URI------------\
 /                          \
 http://localhost:8080/examples/servlets/servlet/���?param=���#h1
 ^       ^       ^     ^            ^            ^         ^
 |       |       |     |            |            |         |
 scheme domain  port context path  servlet path path info  query string


 Port ��Ӧ�� Tomcat �� <Connector port="8080"/> �����ã��� Context Path ��
 <Context path="/examples"/> �����ã�Servlet Path �� Web Ӧ�õ� web.xml �е�
 <url-pattern> �����ã�PathInfo ����������ľ���� Servlet��QueryString ��Ҫ���ݵĲ���


 <servlet-mapping>
        <servlet-name>example</servlet-name>
        <url-pattern>/servlets/servlet/*</url-pattern>
 </servlet-mapping>

 tomcat��������URL����ʹ�õı������� <Connector URIEncoding="UTF-8"/>ָ���ģ�
 ������QueryString �Ľ����ַ���Ҫô�� Header �� ContentType �ж���� Charset
 Ҫô����Ĭ�ϵ� ISO-8859-1��Ҫʹ�� ContentType �ж���ı����Ҫ���� connector
 �� <Connector URIEncoding="UTF-8" useBodyEncodingForURI="true"/> �е�
 useBodyEncodingForURI ����Ϊ true��

 Header�еı���

 �� Header �е�����н������ڵ��� request.getHeader �ǽ��еģ��������� Header ��û�н�������� MessageBytes �� toString ����������������� byte �� char ��ת��ʹ�õ�Ĭ�ϱ���Ҳ�� ISO-8859-1��������Ҳ�������� Header �����������ʽ��������������� Header ���з� ASSIC �ַ�����϶��������롣

 ��������� Header ʱҲ��ͬ���ĵ�����Ҫ�� Header �д��ݷ� ASSIC �ַ������һ��Ҫ���ݵĻ������ǿ����Ƚ���Щ�ַ��� org.apache.catalina.util.URLEncoder ����Ȼ������ӵ� Header �С�



 POST���еı���

 POST ���ύ�Ĳ����Ľ������ڵ�һ�ε��� request.getParameter �����ģ�POST ��
 �������ݷ�ʽ�� QueryString ��ͬ������ͨ�� HTTP �� BODY ���ݵ�����˵ġ���������ҳ
 ���ϵ�� submit ��ťʱ��������Ƚ����� ContentType �� Charset �����ʽ�Ա����
 �������б���Ȼ���ύ���������ˣ��ڷ�������ͬ��Ҳ���� ContentType ���ַ������н��롣
 ����ͨ�� POST ���ύ�Ĳ���һ�㲻��������⣬��������ַ��������������Լ����õģ�����
 ͨ�� request.setCharacterEncoding(charset) �����ã��������һ��Ҫ�ڵ�һ�ε��� request.getParameterǰ���á�

 ������� multipart/form-data ���͵Ĳ�����Ҳ�����ϴ����ļ�����ͬ��Ҳ��ʹ�� ContentType
 ������ַ������룬ֵ��ע��ĵط����ϴ��ļ������ֽ����ķ�ʽ���䵽�������ı�����ʱĿ¼��
 ������̲�û���漰���ַ����룬�������������ڽ��ļ�������ӵ� parameters �У������������벻�ܱ���ʱ������Ĭ�ϱ��� ISO-8859-1 �����롣



 HTTP BODY �ı����

 ���û��������Դ�Ѿ��ɹ���ȡ����Щ���ݽ�ͨ�� Response ���ظ��ͻ�����������������
 ��Ҫ���������ٵ���������н��롣������̵ı�����ַ�������ͨ�� response.setCharacterEncoding
 �����ã������Ḳ�� request.getCharacterEncoding ��ֵ������ͨ�� Header �� Content-Type
 ���ؿͻ��ˣ���������ܵ����ص� socket ��ʱ��ͨ�� Content-Type �� charset �����룬
 ������ص� HTTP Header �� Content-Type û������ charset����ô����������� Html
 ��
 <meta HTTP-equiv="Content-Type" content="text/html; charset=GBK" />
 �е� charset �����롣���Ҳû�ж���Ļ�����ô�������ʹ��Ĭ�ϵı��������롣

 * */
    @Test
    public void testWebURLEncode() {

    }

}
