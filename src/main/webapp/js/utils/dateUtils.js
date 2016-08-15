



/**
 * 获取半年之间的时间
 * */
function getBeforeHalfYear(date) {

    date.setMonth( date.getMonth()-6 );
    console.log(date);
    return date;

}

/**
 * 获取一个月之前的时间
 * */
function getBeforeOneMonth(date) {

    date.setMonth( date.getMonth()-1 );
    console.log(date);
    return date;

}


/**
 * 获取一周之前的时间
 * */
function getBeforeOneWeek(date) {

    date.setDate(date.getDate()+7);
    console.log(date);
    return date;

}