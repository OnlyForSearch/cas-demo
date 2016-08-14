/*
 * Copyright 2002-2005 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package cn.feng.web.ssm.excel.controller;

import org.apache.log4j.Logger;
import org.dom4j.Document;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.XMLWriter;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Miscellaneous string utility methods. Mainly for internal use within the
 * framework; consider Jakarta's Commons Lang for a more comprehensive suite of
 * string utilities.
 * 
 * <p>
 * This class delivers some simple functionality that should really be provided
 * by the core Java String and StringBuffer classes, such as the ability to
 * replace all occurrences of a given substring in a target string. It also
 * provides easy-to-use methods to convert between delimited strings, such as
 * CSV strings, and collections and arrays.
 * 
 * @author Rod Johnson
 * @author Juergen Hoeller
 * @author Keith Donald
 * @since 16 April 2001
 */
public abstract class StringUtils
{
	private final static Logger log = Logger.getLogger(StringUtils.class.getName());
	
	private static final String	NEAD_TO_CONVERT_CHAR	= "([/:()!])";	
	
    private static final String FOLDER_SEPARATOR         = "/";         // folder

    // separator

    private static final String WINDOWS_FOLDER_SEPARATOR = "\\";        // Windows

    // folder
    // separator

    private static final String TOP_PATH                 = "..";        // top

    // folder

    private static final String CURRENT_PATH             = ".";         // current

    private static final Random ran                      = new Random();

    private static final String REG_POSTFIX              = ".*(?=\\.)";

    // folder

    /**
     * Check if a String has length.
     * <p>
     * 
     * <pre>
     *       StringUtils.hasLength(null) = false
     *       StringUtils.hasLength(&quot;&quot;) = false
     *       StringUtils.hasLength(&quot; &quot;) = true
     *       StringUtils.hasLength(&quot;Hello&quot;) = true
     * </pre>
     * 
     * @param str
     *            the String to check, may be null
     * @return <code>true</code> if the String is not null and has length
     */
    public static boolean hasLength(String str)
    {
        return (str != null && str.length() > 0);
    }

    /**
     * Check if a String has text. More specifically, returns <code>true</code>
     * if the string not <code>null<code>, it's <code>length is > 0</code>, and
     * it has at least one non-whitespace character.
     * <p><pre>
     *       StringUtils.hasText(null) = false
     *       StringUtils.hasText(&quot;&quot;) = false
     *       StringUtils.hasText(&quot; &quot;) = false
     *       StringUtils.hasText(&quot;12345&quot;) = true
     *       StringUtils.hasText(&quot; 12345 &quot;) = true
     * </pre>
     * @param str the String to check, may be null
     * @return <code>true</code> if the String is not null, length > 0,
     * and not whitespace only
     * @see Character#isWhitespace
     */
    public static boolean hasText(String str)
    {
        int strLen;
        if (str == null || (strLen = str.length()) == 0) { return false; }
        for (int i = 0; i < strLen; i++)
        {
            if (!Character.isWhitespace(str.charAt(i))) { return true; }
        }
        return false;
    }

    /**
     * Trim leading whitespace from the given String.
     * 
     * @param str
     *            the String to check
     * @return the trimmed String
     * @see Character#isWhitespace
     */
    public static String trimLeadingWhitespace(String str)
    {
        if (str.length() == 0) { return str; }
        StringBuffer buf = new StringBuffer(str);
        while (buf.length() > 0 && Character.isWhitespace(buf.charAt(0)))
        {
            buf.deleteCharAt(0);
        }
        return buf.toString();
    }

    /**
     * Trim trailing whitespace from the given String.
     * 
     * @param str
     *            the String to check
     * @return the trimmed String
     * @see Character#isWhitespace
     */
    public static String trimTrailingWhitespace(String str)
    {
        if (str.length() == 0) { return str; }
        StringBuffer buf = new StringBuffer(str);
        while (buf.length() > 0
            && Character.isWhitespace(buf.charAt(buf.length() - 1)))
        {
            buf.deleteCharAt(buf.length() - 1);
        }
        return buf.toString();
    }

    /**
     * Test if the given String starts with the specified prefix, ignoring
     * upper/lower case.
     * 
     * @param str
     *            the String to check
     * @param prefix
     *            the prefix to look for
     * @see String#startsWith
     */
    public static boolean startsWithIgnoreCase(String str, String prefix)
    {
        if (str == null || prefix == null) { return false; }
        if (str.startsWith(prefix)) { return true; }
        if (str.length() < prefix.length()) { return false; }
        String lcStr = str.substring(0, prefix.length()).toLowerCase();
        String lcPrefix = prefix.toLowerCase();
        return lcStr.equals(lcPrefix);
    }

    /**
     * Count the occurrences of the substring in string s.
     * 
     * @param str
     *            string to search in. Return 0 if this is null.
     * @param sub
     *            string to search for. Return 0 if this is null.
     */
    public static int countOccurrencesOf(String str, String sub)
    {
        if (str == null || sub == null || str.length() == 0
            || sub.length() == 0) { return 0; }
        int count = 0, pos = 0, idx = 0;
        while ((idx = str.indexOf(sub, pos)) != -1)
        {
            ++count;
            pos = idx + sub.length();
        }
        return count;
    }

    /**
     * Replace all occurences of a substring within a string with another
     * string.
     * 
     * @param inString
     *            String to examine
     * @param oldPattern
     *            String to replace
     * @param newPattern
     *            String to insert
     * @return a String with the replacements
     */
    public static String replace(String inString, String oldPattern,
            String newPattern)
    {
        if (inString == null) { return null; }
        if (oldPattern == null || newPattern == null) { return inString; }

        StringBuffer sbuf = new StringBuffer();
        // output StringBuffer we'll build up
        int pos = 0; // our position in the old string
        int index = inString.indexOf(oldPattern);
        // the index of an occurrence we've found, or -1
        int patLen = oldPattern.length();
        while (index >= 0)
        {
            sbuf.append(inString.substring(pos, index));
            sbuf.append(newPattern);
            pos = index + patLen;
            index = inString.indexOf(oldPattern, pos);
        }
        sbuf.append(inString.substring(pos));

        // remember to append any characters to the right of a match
        return sbuf.toString();
    }

    /**
     * Delete all occurrences of the given substring.
     * 
     * @param pattern
     *            the pattern to delete all occurrences of
     */
    public static String delete(String inString, String pattern)
    {
        return replace(inString, pattern, "");
    }

    /**
     * Delete any character in a given string.
     * 
     * @param chars
     *            a set of characters to delete. E.g. "az\n" will delete 'a's,
     *            'z's and new lines.
     */
    public static String deleteAny(String inString, String chars)
    {
        if (inString == null || chars == null) { return inString; }
        StringBuffer out = new StringBuffer();
        for (int i = 0; i < inString.length(); i++)
        {
            char c = inString.charAt(i);
            if (chars.indexOf(c) == -1)
            {
                out.append(c);
            }
        }
        return out.toString();
    }

    /**
     * Tokenize the given String into a String array via a StringTokenizer.
     * Trims tokens and omits empty tokens.
     * <p>
     * The given delimiters string is supposed to consist of any number of
     * delimiter characters. Each of those characters can be used to separate
     * tokens. A delimiter is always a single character; for multi-character
     * delimiters, consider using <code>delimitedListToStringArray</code>
     * 
     * @param str
     *            the String to tokenize
     * @param delimiters
     *            the delimiter characters, assembled as String (each of those
     *            characters is individually considered as delimiter).
     * @return an array of the tokens
     * @see StringTokenizer
     * @see String#trim
     * @see #delimitedListToStringArray
     */
    public static String[] tokenizeToStringArray(String str, String delimiters)
    {
        return tokenizeToStringArray(str, delimiters, true, true);
    }

    /**
     * Tokenize the given String into a String array via a StringTokenizer.
     * <p>
     * The given delimiters string is supposed to consist of any number of
     * delimiter characters. Each of those characters can be used to separate
     * tokens. A delimiter is always a single character; for multi-character
     * delimiters, consider using <code>delimitedListToStringArray</code>
     * 
     * @param str
     *            the String to tokenize
     * @param delimiters
     *            the delimiter characters, assembled as String (each of those
     *            characters is individually considered as delimiter)
     * @param trimTokens
     *            trim the tokens via String's <code>trim</code>
     * @param ignoreEmptyTokens
     *            omit empty tokens from the result array (only applies to
     *            tokens that are empty after trimming; StringTokenizer will not
     *            consider subsequent delimiters as token in the first place).
     * @return an array of the tokens
     * @see StringTokenizer
     * @see String#trim
     * @see #delimitedListToStringArray
     */
    public static String[] tokenizeToStringArray(String str, String delimiters,
            boolean trimTokens, boolean ignoreEmptyTokens)
    {

        StringTokenizer st = new StringTokenizer(str, delimiters);
        List tokens = new ArrayList();
        while (st.hasMoreTokens())
        {
            String token = st.nextToken();
            if (trimTokens)
            {
                token = token.trim();
            }
            if (!ignoreEmptyTokens || token.length() > 0)
            {
                tokens.add(token);
            }
        }
        return (String[]) tokens.toArray(new String[tokens.size()]);
    }

    /**
     * Take a String which is a delimited list and convert it to a String array.
     * <p>
     * A single delimiter can consists of more than one character: It will still
     * be considered as single delimiter string, rather than as bunch of
     * potential delimiter characters - in contrast to
     * <code>tokenizeToStringArray</code>.
     * 
     * @param str
     *            the input String
     * @param delimiter
     *            the delimiter between elements (this is a single delimiter,
     *            rather than a bunch individual delimiter characters)
     * @return an array of the tokens in the list
     * @see #tokenizeToStringArray
     */
    public static String[] delimitedListToStringArray(String str,
            String delimiter)
    {
        if (str == null) { return new String[0]; }
        if (delimiter == null) { return new String[] { str }; }

        List result = new ArrayList();
        int pos = 0;
        int delPos = 0;
        while ((delPos = str.indexOf(delimiter, pos)) != -1)
        {
            result.add(str.substring(pos, delPos));
            pos = delPos + delimiter.length();
        }
        if (str.length() > 0 && pos <= str.length())
        {
            // Add rest of String, but not in case of empty input.
            result.add(str.substring(pos));
        }

        return (String[]) result.toArray(new String[result.size()]);
    }

    /**
     * Convert a CSV list into an array of Strings.
     * 
     * @param str
     *            CSV list
     * @return an array of Strings, or the empty array if s is null
     */
    public static String[] commaDelimitedListToStringArray(String str)
    {
        return delimitedListToStringArray(str, ",");
    }

    /**
     * Convenience method to convert a CSV string list to a set. Note that this
     * will suppress duplicates.
     * 
     * @param str
     *            CSV String
     * @return a Set of String entries in the list
     */
    public static Set commaDelimitedListToSet(String str)
    {
        Set set = new TreeSet();
        String[] tokens = commaDelimitedListToStringArray(str);
        for (int i = 0; i < tokens.length; i++)
        {
            set.add(tokens[i]);
        }
        return set;
    }

    /**
     * Convenience method to return a String array as a delimited (e.g. CSV)
     * String. E.g. useful for toString() implementations.
     * 
     * @param arr
     *            array to display. Elements may be of any type (toString will
     *            be called on each element).
     * @param delim
     *            delimiter to use (probably a ",")
     */
    public static String arrayToDelimitedString(Object[] arr, String delim)
    {
        if (arr == null)
        {
            return "";
        }
        else
        {
            StringBuffer sb = new StringBuffer();
            for (int i = 0; i < arr.length; i++)
            {
                if (i > 0)
                {
                    sb.append(delim);
                }
                sb.append(arr[i]);
            }
            return sb.toString();
        }
    }

    /**
     * Convenience method to return a Collection as a delimited (e.g. CSV)
     * String. E.g. useful for toString() implementations.
     * 
     * @param coll
     *            Collection to display
     * @param delim
     *            delimiter to use (probably a ",")
     * @param prefix
     *            string to start each element with
     * @param suffix
     *            string to end each element with
     */
    public static String collectionToDelimitedString(Collection coll,
            String delim, String prefix, String suffix)
    {
        if (coll == null) { return ""; }
        StringBuffer sb = new StringBuffer();
        Iterator it = coll.iterator();
        int i = 0;
        while (it.hasNext())
        {
            if (i > 0)
            {
                sb.append(delim);
            }
            sb.append(prefix).append(it.next()).append(suffix);
            i++;
        }
        return sb.toString();
    }

    /**
     * Convenience method to return a Collection as a delimited (e.g. CSV)
     * String. E.g. useful for toString() implementations.
     * 
     * @param coll
     *            Collection to display
     * @param delim
     *            delimiter to use (probably a ",")
     */
    public static String collectionToDelimitedString(Collection coll,
            String delim)
    {
        return collectionToDelimitedString(coll, delim, "", "");
    }

    /**
     * Convenience method to return a String array as a CSV String. E.g. useful
     * for toString() implementations.
     * 
     * @param arr
     *            array to display. Elements may be of any type (toString will
     *            be called on each element).
     */
    public static String arrayToCommaDelimitedString(Object[] arr)
    {
        return arrayToDelimitedString(arr, ",");
    }

    /**
     * Convenience method to return a Collection as a CSV String. E.g. useful
     * for toString() implementations.
     * 
     * @param coll
     *            Collection to display
     */
    public static String collectionToCommaDelimitedString(Collection coll)
    {
        return collectionToDelimitedString(coll, ",");
    }

    /**
     * Append the given String to the given String array, returning a new array
     * consisting of the input array contents plus the given String.
     * 
     * @param arr
     *            the array to append to
     * @param str
     *            the String to append
     * @return the new array
     */
    public static String[] addStringToArray(String[] arr, String str)
    {
        String[] newArr = new String[arr.length + 1];
        System.arraycopy(arr, 0, newArr, 0, arr.length);
        newArr[arr.length] = str;
        return newArr;
    }

    /**
     * Turn given source String array into sorted array.
     * 
     * @param source
     *            the source array
     * @return the sorted array (never null)
     */
    public static String[] sortStringArray(String[] source)
    {
        if (source == null) { return new String[0]; }
        Arrays.sort(source);
        return source;
    }

    /**
     * Unqualify a string qualified by a '.' dot character. For example,
     * "this.name.is.qualified", returns "qualified".
     * 
     * @param qualifiedName
     *            the qualified name
     */
    public static String unqualify(String qualifiedName)
    {
        return unqualify(qualifiedName, '.');
    }

    /**
     * Unqualify a string qualified by a separator character. For example,
     * "this:name:is:qualified" returns "qualified" if using a ':' separator.
     * 
     * @param qualifiedName
     *            the qualified name
     * @param separator
     *            the separator
     */
    public static String unqualify(String qualifiedName, char separator)
    {
        return qualifiedName
                .substring(qualifiedName.lastIndexOf(separator) + 1);
    }

    /**
     * Capitalize a <code>String</code>, changing the first letter to upper
     * case as per {@link Character#toLowerCase(char)}. No other letters are
     * changed.
     * 
     * @param str
     *            the String to capitalize, may be null
     * @return the capitalized String, <code>null</code> if null
     */
    public static String capitalize(String str)
    {
        return changeFirstCharacterCase(true, str);
    }

    /**
     * Uncapitalize a <code>String</code>, changing the first letter to lower
     * case as per {@link Character#toLowerCase(char)}. No other letters are
     * changed.
     * 
     * @param str
     *            the String to uncapitalize, may be null
     * @return the uncapitalized String, <code>null</code> if null
     */
    public static String uncapitalize(String str)
    {
        return changeFirstCharacterCase(false, str);
    }

    private static String changeFirstCharacterCase(boolean capitalize,
            String str)
    {
        int strLen;
        if (str == null || (strLen = str.length()) == 0) { return str; }
        StringBuffer buf = new StringBuffer(strLen);
        if (capitalize)
        {
            buf.append(Character.toUpperCase(str.charAt(0)));
        }
        else
        {
            buf.append(Character.toLowerCase(str.charAt(0)));
        }
        buf.append(str.substring(1));
        return buf.toString();
    }

    /**
     * Extract the filename from the given path, e.g. "mypath/myfile.txt" ->
     * "myfile.txt".
     * 
     * @param path
     *            the file path
     * @return the extracted filename
     */
    public static String getFilename(String path)
    {
        int separatorIndex = path.lastIndexOf(FOLDER_SEPARATOR);
        return (separatorIndex != -1 ? path.substring(separatorIndex + 1)
                : path);
    }

    /**
     * Apply the given relative path to the given path, assuming standard Java
     * folder separation (i.e. "/" separators);
     * 
     * @param path
     *            the path to start from (usually a full file path)
     * @param relativePath
     *            the relative path to apply (relative to the full file path
     *            above)
     * @return the full file path that results from applying the relative path
     */
    public static String applyRelativePath(String path, String relativePath)
    {
        int separatorIndex = path.lastIndexOf(FOLDER_SEPARATOR);
        if (separatorIndex != -1)
        {
            String newPath = path.substring(0, separatorIndex);
            if (!relativePath.startsWith("/"))
            {
                newPath += "/";
            }
            return newPath + relativePath;
        }
        else
        {
            return relativePath;
        }
    }

    /**
     * Normalize the path by suppressing sequences like "path/.." and inner
     * simple dots folders.
     * <p>
     * The result is convenient for path comparison. For other uses, notice that
     * Windows separators ("\") are replaced by simple dashes.
     * 
     * @param path
     *            the original path
     * @return the normalized path
     */
    public static String cleanPath(String path)
    {
        String pathToUse = replace(path, WINDOWS_FOLDER_SEPARATOR,
                FOLDER_SEPARATOR);
        String[] pathArray = delimitedListToStringArray(pathToUse,
                FOLDER_SEPARATOR);
        List pathElements = new LinkedList();
        int tops = 0;
        for (int i = pathArray.length - 1; i >= 0; i--)
        {
            if (CURRENT_PATH.equals(pathArray[i]))
            {
                // do nothing
            }
            else if (TOP_PATH.equals(pathArray[i]))
            {
                tops++;
            }
            else
            {
                if (tops > 0)
                {
                    tops--;
                }
                else
                {
                    pathElements.add(0, pathArray[i]);
                }
            }
        }
        return collectionToDelimitedString(pathElements, FOLDER_SEPARATOR);
    }

    /**
     * Compare two paths after normalization of them.
     * 
     * @param path1
     *            First path for comparizon
     * @param path2
     *            Second path for comparizon
     * @return True if the two paths are equivalent after normalization
     */
    public static boolean pathEquals(String path1, String path2)
    {
        return cleanPath(path1).equals(cleanPath(path2));
    }

    /**
     * Parse the given locale string into a <code>java.util.Locale</code>.
     * This is the inverse operation of Locale's <code>toString</code>.
     * 
     * @param localeString
     *            the locale string, following <code>java.util.Locale</code>'s
     *            toString format ("en", "en_UK", etc). Also accepts spaces as
     *            separators, as alternative to underscores.
     * @return a corresponding Locale instance
     */
    public static Locale parseLocaleString(String localeString)
    {
        String[] parts = tokenizeToStringArray(localeString, "_ ", false, false);
        String language = parts.length > 0 ? parts[0] : "";
        String country = parts.length > 1 ? parts[1] : "";
        String variant = parts.length > 2 ? parts[2] : "";
        return (language.length() > 0 ? new Locale(language, country, variant)
                : null);
    }

    /**
     * ��nullת��Ϊ�մ�
     * 
     * @param str
     *            ��ת�����ַ���
     * @return ת������ַ���
     */
    public static String toNoNull(String str)
    {
        return (str == null) ? "" : str;
    }

    public static String getUniqueID()
    {
        return Long.toString(System.currentTimeMillis()) + "_" + Integer.toString(ran.nextInt());
    }

    public static String getUniqueFileName(String fileName)
    {
        Pattern p = Pattern.compile(REG_POSTFIX);
        Matcher m = p.matcher(fileName);
        String uniqueFileName = getUniqueID();
        uniqueFileName = (m.find()) ? m.replaceFirst(uniqueFileName) : uniqueFileName;
        return uniqueFileName;
    }

    public static String encodeString(String sourceString, String sysCharset,
            String charset) throws UnsupportedEncodingException
    {
        if (sourceString == null || sourceString.length() == 0) return sourceString;
        return new String(sourceString.getBytes(sysCharset), "GB2312");
    }

    public static String[] encodeArray(String[] sourceArray, String sysCharset,
            String charset) throws UnsupportedEncodingException
    {
        if (sourceArray == null || sourceArray.length == 0) return sourceArray;
        String[] result = new String[sourceArray.length];
        for (int i = 0; i < sourceArray.length; i++)
        {
            result[i] = encodeString(sourceArray[i], sysCharset, charset);
        }
        return result;
    }

    public static String gbToUtf8(String src)
    {
        byte[] b = src.getBytes();
        char[] c = new char[b.length];
        for (int x = 0; x < b.length; x++)
        {
            c[x] = (char) (b[x] & 0x00FF);
        }
        return new String(c);
    }
    
    public static String byte2hex(byte[] src)
    {
        String tmp;
        int iLen = src.length;
        StringBuffer str = new StringBuffer(iLen * 2);
        for (int i = 0; i < iLen; i++)
        {
            tmp = (Integer.toHexString(src[i] & 0XFF));
            if (tmp.length() == 1)
            {
                str.append("0");
                str.append(tmp);
            }
            else
            {
                str.append(tmp);
            }
        }
        return (str.toString()).toUpperCase();
    }

    public static byte[] hex2byte(String src)
    {
        byte[] bytes = src.getBytes();
        int iLen = bytes.length;
        byte[] arrOut = new byte[iLen / 2];
        for (int i = 0; i < iLen; i = i + 2)
        {
            String strTmp = new String(bytes, i, 2);
            arrOut[i / 2] = (byte) Integer.parseInt(strTmp, 16);
        }
        return arrOut;
    }
    
    public static byte[] hex2byte(String src,String encodeType) throws UnsupportedEncodingException
    {
        byte[] bytes = src.getBytes(encodeType);
        int iLen = bytes.length;
        byte[] arrOut = new byte[iLen / 2];
        for (int i = 0; i < iLen; i = i + 2)
        {
            String strTmp = new String(bytes, i, 2);
            arrOut[i / 2] = (byte) Integer.parseInt(strTmp, 16);
        }
        return arrOut;
    }
    /**
     * ���� aaa:bbb:ccc:ddd:eee ��ʽ���ַ���ת���� map ����洢
     * @param param
     * @return Map
     * @author chenxunxin
     */
    public static void param2Map(Map<String, Object>paramMap, String param, String value) {
    	if(!(param==null || "".equals(param) || value==null)) {
    		if(param.indexOf(":")==-1) {
    			paramMap.put(param, value);
    		}else {
    	        String key = param.substring(0, param.indexOf(":"));
    	        Map<String, Object> map = null;
    	        if(paramMap.containsKey(key)) {
    	        	map = (Map<String, Object>)paramMap.get(key);
    	        }else {
    	        	map = new HashMap<String, Object>();
    	        	paramMap.put(key, map);
    	        }
	        	param = param.substring(param.indexOf(":")+1, param.length());
	        	param2Map(map, param, value);	    	        
    		}
    	}
    }
    
    /**
     * 
     * ��dom4j���ĵ�ת����ָ�������ʽ���ַ��� 
     * @param document
     * @return
     */
    public static String document2str(Document document, String chartset) {
        String result = "";
        OutputFormat format;
        ByteArrayOutputStream out;
        try {
            format = OutputFormat.createPrettyPrint();
            format.setEncoding(chartset);            
            out = new ByteArrayOutputStream(); 
            XMLWriter writer = new XMLWriter(out, format); 
            writer.write(document);
            writer.flush();
            writer.close();
            result = out.toString(format.getEncoding());
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result;
    }
    
    public static boolean isNull(String str) {
    	if(str==null || str.equals("") || str.toLowerCase().equals("null"))
    		return true;
    	else
    		return false;
    }

    /**
     * �Ƚ������ַ��������ƶ�
     * @param str
     * @param target
     * @return
     */
	private static int compare(String str, String target) {
   	    int d[][]; // ����
   	    int n = str.length();
   	    int m = target.length();
   	    int i; // ����str��
   	    int j; // ����target��
   	    char ch1; // str��
   	    char ch2; // target��
   	    int temp; // ��¼��ͬ�ַ�,��ĳ������λ��ֵ������,����0����1
   	    if (n == 0) {
   	       return m;
   	    }
   	    if (m == 0) {
   	       return n;
   	    }
   	    d = new int[n + 1][m + 1];
   	    for (i = 0; i <= n; i++) { // ��ʼ����һ��
   	        d[i][0] = i;
   	    }
   	    for (j = 0; j <= m; j++) { // ��ʼ����һ��
   	        d[0][j] = j;
   	    }
   	    for (i = 1; i <= n; i++) { // ����str
   	        ch1 = str.charAt(i - 1);
      	    // ȥƥ��target
   	        for (j = 1; j <= m; j++) {
   	          ch2 = target.charAt(j - 1);
   	          if (ch1 == ch2) {
   	             temp = 0;
   	          } else {
   	             temp = 1;
   	          }
       	    //���+1,�ϱ�+1, ���Ͻ�+tempȡ��С
   	          d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + temp);
   	        }
   	    }
   	    return d[n][m];
   	}

   	private static int min(int one, int two, int three) {
   	    return (one = one < two ? one : two) < three ? one : three;
   	}

   	/**
   	 * ���������ַ��������ƶ�
   	 * @param str
   	 * @param target
   	 * @return
   	 */
   	public static float getSimilarityRatio(String str, String target) {
   	    return 1 - (float)compare(str, target)/Math.max(str.length(), target.length());
   	}
   	
    /**
     * ��XML�ĵ�������ָ����ǩ��Ԫ��, ���ط���������Ԫ������.
     */
    public static String[] getElementsByTag(String xmlDocument, String tagName){
        Pattern p = Pattern.compile("<"+tagName+"[^>]*?((>.*?</"+tagName+">)|(/>))");
        Matcher m = p.matcher(xmlDocument);
        ArrayList<String> al = new ArrayList<String>();
        while(m.find()) al.add(m.group());
        String[] arr = al.toArray(new String[al.size()]);
        al.clear();
        return arr;
    }


    /**
     * ��XML�ĵ�����xpathģʽ��ȡԪ��,��#Ϊ�ָ���
     * �� ROOT#PARENT#CHILD��ʾ��ȡROOTԪ���µ�PARENTԪ���µ�CHILDԪ��
     */
    public static String getElementBySinglePath(String xmlDocument, String singlePath){
        String[] path = singlePath.split("#");
        String lastTag = path[path.length-1];
        String tmp = "(<"+lastTag+"[^>]*?((>.*?</"+lastTag+">)|(/>)))"; //���һ��Ԫ��,������<x>v</x>��ʽ��<x/>��ʽ
        for(int i=path.length-2;i >=0;i--){
            lastTag = path[i];
            tmp = "<"+lastTag+">.*"+tmp + ".*</"+lastTag+">";
        }
        Pattern p = Pattern.compile(tmp);
        Matcher m = p.matcher(xmlDocument);
        if(m.find()) return m.group(1);
        return "";
    }

    /**
     * ��ȡָ��Ԫ�ص��ı�����
     * @param elementString String
     * @return String
     */
    public static String getElementText(String elementString){
        Pattern p = Pattern.compile(">([^<>]*)<");
        Matcher m = p.matcher(elementString);
        if(m.find()) return m.group(1);
        return "";
    }
    
   	/**
   	 * ʹ��JQLParserУ��SQL���ʽ
   	 * @param
   	 * @return
   	 */

	public static String getProcessPID() {
		String pid = "";
		try {
			Properties props = System.getProperties();
			String separator = props.getProperty("file.separator");
			//File binDir = new File("").getAbsoluteFile();
			if("/".equals(separator)) {
		        RuntimeMXBean runtime = ManagementFactory.getRuntimeMXBean();  
		        String name = runtime.getName();
		        pid = name.substring(0, name.indexOf('@'));							
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return pid;
	}
   	

	
	/**��������ȡ�������õ�IP**/    
    public static String getLocalIp() 
    {
    	String localIp = "";
    	
    	try {
    		   localIp = InetAddress.getLocalHost().getHostAddress();
    	       if("/".equals(System.getProperties().getProperty("file.separator"))) {
    				Enumeration<?> netInterfaces = NetworkInterface.getNetworkInterfaces();
    				InetAddress ip = null;
    				while(netInterfaces.hasMoreElements())
    				{
    				    NetworkInterface ni = (NetworkInterface)netInterfaces.nextElement();
    				    //if(ni.getName().equals("eth0")) {
    					    Enumeration<?> e2 = ni.getInetAddresses();
    					    while (e2.hasMoreElements()) {
    					        ip = (InetAddress) e2.nextElement();
    						    if(!ip.isSiteLocalAddress() && !ip.isLoopbackAddress() && ip.getHostAddress().indexOf(":")==-1)
    						    {
    						        localIp = ip.getHostAddress();
    						        break;
    						    }else {
    						    	continue;
    						    }
    					    }			    	
    				    //}
    				}    	    	
    	       }
		} catch (SocketException e) {
			e.printStackTrace();
		} catch (UnknownHostException e){
			e.printStackTrace();
		}
    	return localIp;
    }
    
    public static String[] getListByReg(String input,Pattern reg)
    {
    	String[] values;
    	Matcher m = reg.matcher(input);
    	if(m.find())
    	{
    		int groupLength = m.groupCount();
    		values = new String[groupLength];
    		for(int i=0;i<groupLength;i++)
    		{
    			values[i] = m.group(i+1);
    		}
    	}
    	else
    	{
    		values = new String[0];
    	}
    	return values;
    }
    
    public static String getKeyByReg(String input,Pattern reg)
    {
    	String[] values = getListByReg(input, reg);
    	if(values.length>0)
    	{
    		return values[0];
    	}
    	else
    	{
    		return null;
    	}
    }
   	   	
	// solr query need to convert meaning
	public static String convertMeaningChar(String temp)
	{
		if (temp == null) return "";
		temp = temp.replaceAll(NEAD_TO_CONVERT_CHAR, "\\\\$1");
		return temp;
	}
	
	/**
   	 * �ж��ַ����Ƿ�Ϊ����
   	 * @param str ���ַ���Ĭ��������
   	 * @param  �����������ʽ [0-9]* �ж�������  -?[0-9]+.?[0-9]+ ��������
   	 * @return
   	 */
   	public static boolean isNumeric(String str, String regular){
   		if(!isNull(str)){
   			String rule = regular == null ? "[0-9]*" : regular;
   			Pattern pattern = Pattern.compile(rule); 
   			Matcher isNum = pattern.matcher(str);
   			return isNum.matches();
   		}else{
   			return true;
   		}  		 
   	}
	public static boolean isNumeric(String str){
		return StringUtils.isNumeric(str, null);
	}
	
	/**
	 * ��ʽ������������
	 */
	public static String formatFloatToStr(Float str) {
		return formatFloatToStr(str, null);		
	}
	
	public static String formatFloatToStr(Float str, String ftStr) {
		 ftStr = ftStr == null ? "0.0" : ftStr;		
		 String string = "";
			if(str == null) {
				string = "";
			} else {
				java.text.DecimalFormat df = new java.text.DecimalFormat(ftStr); 								
				string = df.format(str);
			}
			
			return string;
	}
    

   	
   
 
}