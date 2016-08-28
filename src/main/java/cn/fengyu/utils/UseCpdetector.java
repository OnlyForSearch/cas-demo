package cn.fengyu.utils;


        import info.monitorenter.cpdetector.io.ASCIIDetector;
        import info.monitorenter.cpdetector.io.ByteOrderMarkDetector;
        import info.monitorenter.cpdetector.io.CodepageDetectorProxy;
        import info.monitorenter.cpdetector.io.JChardetFacade;
        import info.monitorenter.cpdetector.io.ParsingDetector;
        import info.monitorenter.cpdetector.io.UnicodeDetector;

        import java.net.MalformedURLException;
        import java.net.URL;

/**
 * ��������jar<br>
 * cpdetector_1.0.10.jar,antlr-2.7.4.jar,chardet-1.0.jar
 *
 * @author Chinaxiang
 * @date 2015-10-11
 *
 */
public class UseCpdetector {

    /**
     * ��ȡURL�ı���
     *
     * @param url
     * @return
     */
    public static String getUrlEncode(URL url) {
/*
 * detector��̽����������̽�����񽻸������̽��ʵ�����ʵ����ɡ�
 * cpDetector������һЩ���õ�̽��ʵ���࣬��Щ̽��ʵ�����ʵ������ͨ��add���� �ӽ�������ParsingDetector��
 * JChardetFacade��ASCIIDetector��UnicodeDetector��
 * detector���ա�˭���ȷ��طǿյ�̽���������Ըý��Ϊ׼����ԭ�򷵻�̽�⵽��
 * �ַ������롣ʹ����Ҫ�õ�����������JAR����antlr.jar��chardet.jar��cpdetector.jar
 * cpDetector�ǻ���ͳ��ѧԭ��ģ�����֤��ȫ��ȷ��
*/
        CodepageDetectorProxy detector = CodepageDetectorProxy.getInstance();
/*
 * ParsingDetector�����ڼ��HTML��XML���ļ����ַ����ı���,���췽���еĲ�������
 * ָʾ�Ƿ���ʾ̽����̵���ϸ��Ϣ��Ϊfalse����ʾ��
*/
        detector.add(new ParsingDetector(false));
        detector.add(new ByteOrderMarkDetector());
/*
 * JChardetFacade��װ����Mozilla��֯�ṩ��JChardet����������ɴ�����ļ��ı���
 * �ⶨ�����ԣ�һ���������̽�����Ϳ�����������Ŀ��Ҫ������㻹�����ģ�����
 * �ٶ�Ӽ���̽���������������ASCIIDetector��UnicodeDetector�ȡ�
*
 * �õ�antlr.jar��chardet.jar
*/
        detector.add(JChardetFacade.getInstance());
        // ASCIIDetector����ASCII����ⶨ
        detector.add(ASCIIDetector.getInstance());
        // UnicodeDetector����Unicode�������Ĳⶨ
        detector.add(UnicodeDetector.getInstance());


        java.nio.charset.Charset charset = null;
        try {
            charset = detector.detectCodepage(url);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        if (charset != null) {
            return charset.name();
        }
        return null;
    }

    public static void main(String[] args) {
        try {
            URL url = new URL("http://www.baidu.com");
            String encode = getUrlEncode(url);
            System.out.println(encode);// UTF-8
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
    }

}