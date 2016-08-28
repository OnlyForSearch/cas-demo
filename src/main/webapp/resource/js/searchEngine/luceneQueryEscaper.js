// Special characters are + - && || ! ( ) { } [ ] ^ " ~ * ? : \
// Special words are (case-sensitive) AND NOT OR
// We escape the common ones, i.e. ! ? * ( ) " :

// escapes a lucene query.
// @param Form field that contains the query, or the query string
function doEscapeQuery(queryArg)
{
  //var query = getQueryValue(queryArg);
  var query = queryArg;
  query = escapeAsterisk(query);//转意星号 -- *
  query = escapeQuotes(query);//转意引号 -- "
  query = escapeColon(query);//转意冒号 -- :
  query = escapeQuestionMark(query);//转意问号 -- ?
  query = escapeExclamationMark(query);//转意叹号 -- !
  query = escapeParentheses(query);//转意园括号 -- ()
  query = escapeSquareBrackets(query);//转意方括号 -- []
  query = escapeBraces(query);//转意大括号 -- {}
  query = escapeCaret(query);//转意脱字符号 -- ^
  query = escapeSquiggle(query);//转意花体 -- ~
  query = escapeDoubleAmpersands(query);//转意双与号 -- &&
  query = escapeDoubleBars(query);//转意双竖杠 -- ||
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