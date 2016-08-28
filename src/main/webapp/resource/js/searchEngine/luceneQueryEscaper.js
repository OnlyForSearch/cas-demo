// Special characters are + - && || ! ( ) { } [ ] ^ " ~ * ? : \
// Special words are (case-sensitive) AND NOT OR
// We escape the common ones, i.e. ! ? * ( ) " :

// escapes a lucene query.
// @param Form field that contains the query, or the query string
function doEscapeQuery(queryArg)
{
  //var query = getQueryValue(queryArg);
  var query = queryArg;
  query = escapeAsterisk(query);//ת���Ǻ� -- *
  query = escapeQuotes(query);//ת������ -- "
  query = escapeColon(query);//ת��ð�� -- :
  query = escapeQuestionMark(query);//ת���ʺ� -- ?
  query = escapeExclamationMark(query);//ת��̾�� -- !
  query = escapeParentheses(query);//ת��԰���� -- ()
  query = escapeSquareBrackets(query);//ת�ⷽ���� -- []
  query = escapeBraces(query);//ת������� -- {}
  query = escapeCaret(query);//ת�����ַ��� -- ^
  query = escapeSquiggle(query);//ת�⻨�� -- ~
  query = escapeDoubleAmpersands(query);//ת��˫��� -- &&
  query = escapeDoubleBars(query);//ת��˫���� -- ||
  return query;
}

function getQueryValue(queryArg)
{
  var query;
  // check if its a form field
  if(typeof(queryArg.form) != "undefined")
  {
    query = queryArg.value;
  }
  else
  {
    query = queryArg;
  }
  return query;
}

function escapeAsterisk(query)
{
  return query.replace(/[\*]/g, "\\*");
}

function escapeQuotes(query)
{
  return query.replace(/[\"]/g, "\\\"");
}

function escapeColon(query)
{
  return query.replace(/[\:]/g, "\\:");
}

function escapeQuestionMark(query)
{
  return query.replace(/[?]/g, "\\?");
}

function escapeExclamationMark(query)
{
  return query.replace(/[!]/g, "\\!");
}

function escapeParentheses(query)
{
  return query.replace(/[(]/g, "\\(").replace(/[)]/g, "\\)");
}

function escapeSquareBrackets(query)
{
  return query.replace(/[\[]/g, "\\[").replace(/[\]]/g, "\\]");
}

function escapeBraces(query)
{
  return query.replace(/[{]/g, "\\{").replace(/[}]/g, "\\}");
}

function escapeCaret(query)
{
  return query.replace(/[\^]/g, "\\^");
}

function escapeSquiggle(query)
{
  return query.replace(/[~]/g, "\\~");
}

function escapeDoubleAmpersands(query)
{
  return query.replace(/[&]{2}/g, "\\&\\&");
}

function escapeDoubleBars(query)
{
  return query.replace(/[\|]{2}/g, "\\|\\|");
}