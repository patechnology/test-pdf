function convertSeconds(seconds) {
    var output = '';
    var days = Math.floor(seconds / (3600*24));
    output += appendToTime(days, ' days');

    seconds  -= days * 3600 * 24;
    var hrs   = Math.floor(seconds / 3600);
    output += appendToTime(hrs, ' hours');
    
    seconds  -= hrs*3600;
    var mnts = Math.floor(seconds / 60);
    output += appendToTime(mnts, ' minutes');

    return output;
  }

  function appendToTime(value, appendStr) {
    if (value) {
      return ' ' + value + ' ' + appendStr;
    }
    return '';
  }
