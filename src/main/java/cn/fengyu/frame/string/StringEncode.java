package cn.fengyu.frame.string;

import org.junit.Test;

import java.io.UnsupportedEncodingException;

/**
 * Created by fengyu on 2016-08-26.
 */
public class StringEncode {

    /**
     * Java中String 的相关方法

     getBytes有四个重载方法，有一个是过时的，总的说来就是两种，指定了编码的和没有指定编码的，没有指定编码，它会使用平台的缺省编码，这个平台是指JVM，如果JVM启动时没有指定编码，那么这个缺省编码也就是操作系统的缺省编码了。这个方法的作用是把字符串按指定的编码方式编码为字节数组，其实质应该就是将内存中存储的UTF-16的编码数组转换为其它编码方式的字节数组。

     length方法，这个方法是常用的一个方法，它返回字符串的长度，这个长度不是字符的个数，而是码元的个数，在Java里也就是UTF-16的码元个数了。像charAt, substring这些方法，其参数实际也是基于码元的概念而不是字符。不过呢，大多的字符在BMP平面就能表示了，所以平时接触到的可能这个码元个数和字符个数都是对应的。
     * @throws UnsupportedEncodingException
     */
    @Test
    public void testCharacterEncode() throws UnsupportedEncodingException {





        final String interesting = "hi你好";
        System.out.println(interesting.length()); // 4

        final byte[] utf8Bytes = interesting.getBytes("UTF-8");
// 输出8，每个英文字母占一个字节，每个汉字3个字节
        System.out.println(utf8Bytes.length);
//68 69 E4 BD A0 E5 A5 BD
        System.out.println(toHex(utf8Bytes));
        System.out.println(utf8Bytes.length);
        final byte[] utf16Bytes = interesting.getBytes("UTF-16");
// 输出10，每个字符2个字节，外加BOM两个字节
        System.out.println(utf16Bytes.length);
//输出中开头的FE FF就是传说中的BOM(Byte Order Marker用来表明大端还是小端的)了，其实就是U+FEFF码点
//EF BB BF 是这一码点在UTF-8下的编码，UTF-8只有大端，没有大小端之分，所以不建议保存时带BOM，对于不支持BOM的软件会带来未知问题
//FE FF 00 68 00 69 4F 60 59 7D
        System.out.println(toHex(utf16Bytes));
        final byte[] utf16beBytes = interesting.getBytes("UTF-16BE");
// 输出8，每个字符2个字节，UTF-16大端编码，可以看到后面输出的结果除了没有BOM标记之外和UTF-16是一样的。
        System.out.println(utf16beBytes.length);
//00 68 00 69 4F 60 59 7D
        System.out.println(toHex(utf16beBytes));
        final byte[] utf32Bytes = interesting.getBytes("UTF-32");
// 输出16，每个字符4个字节，UTF-32其实也是可以有大小端之分的
        System.out.println(utf32Bytes.length);
//00 00 00 68 00 00 00 69 00 00 4F 60 00 00 59 7D
        System.out.println(toHex(utf32Bytes));
        final byte[] isoBytes = interesting.getBytes("ISO-8859-1");
// 输出4，两个汉字超出它的表示范围，它不认识，然后就被编程`?`了
        System.out.println(isoBytes.length);
//68 69 3F 3F
        System.out.println(toHex(isoBytes));
        final byte[] gb2312Bytes = interesting.getBytes("GB2312");
// 输出6
        System.out.println(gb2312Bytes.length);
//68 69 C4 E3 BA C3
        System.out.println(toHex(gb2312Bytes));
        final byte[] gbkBytes = interesting.getBytes("GBK");
// 输出6， 是对GB2312的扩展，所以这个编码一样
        System.out.println(gbkBytes.length);
// 68 69 C4 E3 BA C3
        System.out.println(toHex(gbkBytes));

//s是增补平面的一个字符，UTF-16需要四个字节存，这里如果给char类型赋值，会报错，char总是两个字节的，很显然它存不下
// char c = '?';
        String s = "?";
//Returns the length of this string. The length is equal to the number of Unicode code units in the string.
//上面是length方法的注释，可以看到这个字符串长度，实际是码元的个数，而Java是用UTF-16存储字符串的，所以这里就是UTF-16的码元个数了，即2
        System.out.println(s.length()); //2  输出的是码元数目，也就是UTF-16码元的数目
//下面的两个方法其实也是针对码元的，如果是按字符算的话，s只有一个字符，下面两个方法可就都越界了，事实上它们并没有
        System.out.println(s.charAt(1));
        System.out.println(s.substring(1));
        System.out.println(s.equals("\uD869\uDEA5"));//s的转义表示，就是UTF-16的代理对
        System.out.println(s.codePointAt(0) == 0x2A6A5);//s码点是U+2A6A5
        System.out.println(toHex(s.getBytes("utf-16be"))); //D8 69 DE A5
//下面是一个组合字符，神一样的存在
        s = "???????????????????????????????????????";
        System.out.println(s.length()); //39,意味着有39个码元！但是显示的确实是一个字符
//0E 2A 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49 0E 49
        System.out.println(toHex(s.getBytes("utf-16be")));

//两个汉字变成了三个字符，因为UTF-8对汉字编码是三字节，而GBK是两个字节，其实就是六个字节的两种组合
        System.out.println(new String(interesting.getBytes("UTF-8"),"GBK"));
//两个汉字变成了六个字符，因为UTF-8对汉字编码是三字节，而ISO-8859-1是单字节编码，两个三字节被当做六个单字节来解了
        System.out.println(new String(interesting.getBytes("UTF-8"),"ISO-8859-1"));
//两个汉字变成了两个'?'，因为ISO-8859-1是单字节编码，不认识的都按3F也就是'?'编码，解码时GBK也就当是问号了
        System.out.println(new String(interesting.getBytes("ISO-8859-1"),"GBK"));
//两个汉字变成了四个字符，因为GBK对汉字编码是两字节，而ISO-8859-1是单字节编码，两个双字节被当做四个单字节来解了
        System.out.println(new String(interesting.getBytes("GBK"),"ISO-8859-1"));
// 68 69 C4 E3 BA C3 -> 68 69 3F 3F 3F 3F
        System.out.println(toHex(new String(interesting.getBytes("GBK"),"ISO-8859-1").getBytes("GBK")));
//两个汉字变成了四个'?'，涉及两次编解码，这里有个疑问，第一次按GBK编码再按ISO-8859-1解码，字节数没变每个字节里存储的内容没变还是68 69 C4 E3 BA C3
//为什么再拿GBK编码后面就变成3F了，GBK不是按照C4E3 BAC3这么分组编码的？我觉得应该跟字符串的存储有关系，getBytes这个方法其实还是从UTF-16到其它编码的一个转换过程
//C4 E3 BA C3 存储可能是00C4 00E3 00BA 00C3然后00C4是什么GBK没有对应的编码，然后就又3F了
        System.out.println(new String(new String(interesting.getBytes("GBK"),"ISO-8859-1").getBytes("GBK"),"GBK"));
//下面这个结果就是正确的了，第二次编码时，数组的内容还是68 69 C4 E3 BA C3 再按GBK解码自然能够把C4E3 BAC3转为对应的汉字
        System.out.println(new String(new String(interesting.getBytes("GBK"),"ISO-8859-1").getBytes("ISO-8859-1"),"GBK"));
    }

    private boolean toHex(byte[] bytes) {
    return true;
    }

/**
 *
 *Java Web 涉及到的编码
 URL中的编码
 *  +-----------------URL-------------------------+
 /                      +---------URI------------\
 /                          \
 http://localhost:8080/examples/servlets/servlet/你好?param=你好#h1
 ^       ^       ^     ^            ^            ^         ^
 |       |       |     |            |            |         |
 scheme domain  port context path  servlet path path info  query string


 Port 对应在 Tomcat 的 <Connector port="8080"/> 中配置，而 Context Path 在
 <Context path="/examples"/> 中配置，Servlet Path 在 Web 应用的 web.xml 中的
 <url-pattern> 中配置，PathInfo 是我们请求的具体的 Servlet，QueryString 是要传递的参数


 <servlet-mapping>
        <servlet-name>example</servlet-name>
        <url-pattern>/servlets/servlet/*</url-pattern>
 </servlet-mapping>

 tomcat服务器对URL解码使用的编码是由 <Connector URIEncoding="UTF-8"/>指定的，
 而对于QueryString 的解码字符集要么是 Header 中 ContentType 中定义的 Charset
 要么就是默认的 ISO-8859-1，要使用 ContentType 中定义的编码就要设置 connector
 的 <Connector URIEncoding="UTF-8" useBodyEncodingForURI="true"/> 中的
 useBodyEncodingForURI 设置为 true。

 Header中的编码

 对 Header 中的项进行解码是在调用 request.getHeader 是进行的，如果请求的 Header 项没有解码则调用 MessageBytes 的 toString 方法，这个方法将从 byte 到 char 的转化使用的默认编码也是 ISO-8859-1，而我们也不能设置 Header 的其它解码格式，所以如果你设置 Header 中有非 ASSIC 字符解码肯定会有乱码。

 我们在添加 Header 时也是同样的道理，不要在 Header 中传递非 ASSIC 字符，如果一定要传递的话，我们可以先将这些字符用 org.apache.catalina.util.URLEncoder 编码然后再添加到 Header 中。



 POST表单中的编码

 POST 表单提交的参数的解码是在第一次调用 request.getParameter 发生的，POST 表单
 参数传递方式与 QueryString 不同，它是通过 HTTP 的 BODY 传递到服务端的。当我们在页
 面上点击 submit 按钮时浏览器首先将根据 ContentType 的 Charset 编码格式对表单填的
 参数进行编码然后提交到服务器端，在服务器端同样也是用 ContentType 中字符集进行解码。
 所以通过 POST 表单提交的参数一般不会出现问题，而且这个字符集编码是我们自己设置的，可以
 通过 request.setCharacterEncoding(charset) 来设置，这个调用一定要在第一次调用 request.getParameter前调用。

 另外针对 multipart/form-data 类型的参数，也就是上传的文件编码同样也是使用 ContentType
 定义的字符集编码，值得注意的地方是上传文件是用字节流的方式传输到服务器的本地临时目录，
 这个过程并没有涉及到字符编码，而真正编码是在将文件内容添加到 parameters 中，如果用这个编码不能编码时将会用默认编码 ISO-8859-1 来编码。



 HTTP BODY 的编解码

 当用户请求的资源已经成功获取后，这些内容将通过 Response 返回给客户端浏览器，这个过程
 先要经过编码再到浏览器进行解码。这个过程的编解码字符集可以通过 response.setCharacterEncoding
 来设置，它将会覆盖 request.getCharacterEncoding 的值，并且通过 Header 的 Content-Type
 返回客户端，浏览器接受到返回的 socket 流时将通过 Content-Type 的 charset 来解码，
 如果返回的 HTTP Header 中 Content-Type 没有设置 charset，那么浏览器将根据 Html
 的
 <meta HTTP-equiv="Content-Type" content="text/html; charset=GBK" />
 中的 charset 来解码。如果也没有定义的话，那么浏览器将使用默认的编码来解码。

 * */
    @Test
    public void testWebURLEncode() {

    }

}
