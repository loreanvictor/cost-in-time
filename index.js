var unitval = function(value, unit, plural) {
  plural = plural || unit + 's';
  if (value <= 0) return '';
  if (value == 1) return '<span class="num">' + value + '</span> ' + unit;
  return '<span class="num">' + value + '</span> ' + plural;
}

var nonempty = function(str) { return str && str.length > 0; }

var calc = function(price, income) {
  var float = price / income;
  var totalhours = Math.floor(float);

  var minutes = Math.floor((float - totalhours) * 60);
  var days = Math.floor(totalhours / 24);
  var hours = totalhours - days * 24;

  var unitvals = [unitval(days, 'day'), unitval(hours, 'hour'), unitval(minutes, 'minute')]
              .filter(nonempty);

  var workingdays = Math.floor(totalhours / 8);
  var workinghours = totalhours - workingdays * 8;

  var workingvals = [unitval(workingdays, 'day'), unitval(workinghours, 'hour'), unitval(minutes, 'minute')]
              .filter(nonempty);

  return {
    general: unitvals.join(' and '),
    working: workingvals.join(' and '),
  };
}

var show = function() {
  try {
    var price = parseInt($(this).val());
    if (price > 0) {
      var calcresult = calc(price, 10);
      $('#main #result').addClass('active');
      $('#main #result #amount').html(calcresult.general);

      if (calcresult.general != calcresult.working) {
        $('#main #result #working').addClass('active');
        $('#main #result #workingamount').html(calcresult.working);
      }
      else
        $('#main #result #working').removeClass('active');
    }
    else
      $('#main #result').removeClass('active');
  } catch(error) {
    $('#main #result').removeClass('active');
  }

};

var currencies = ['euro', 'dollar', 'pound', 'yen', 'ruble', 'rupee'];

var updateCurrency = function(currency) {
  var index = currencies.indexOf(currency);
  if (index != -1) {
    $('body').attr('currency', currency);

    localStorage.setItem('currency', currency);

    for (var ind = 0; ind < index; ind++) $('.currency span[' + currencies[ind] + ']').addClass('passed');
    for (var ind = index; ind < currencies.length; ind++) $('.currency span[' + currencies[ind] + ']').removeClass('passed');
  }
}

$(document).on('click', '.currency', function() {
  var current = $('body').attr('currency');
  var index = currencies.indexOf(current);
  if (index >= currencies.length - 1 || index == -1)
    updateCurrency(currencies[0]);
  else
    updateCurrency(currencies[index + 1]);
});

$(document).ready(function() {
  $('#main input#cost').keyup(show);
  $('#main input#cost').keydown(show);
  $('#main input#cost').keypress(show);
  $('#main input#cost').click(show);
  $('#main input#cost').focus(show);
  $('#main input#cost').blur(show);

  updateCurrency(localStorage['currency']);

  var colors = [
    'default', 'black',
    'green', 'green-inv',
    'blue', 'blue-inv',
    'purple', 'purple-inv',
    'orange', 'orange-inv',
    'yellow', 'yellow-inv'];
  var randompick = colors[Math.floor(Math.random() * colors.length)];
  $('body').addClass(randompick);
});
