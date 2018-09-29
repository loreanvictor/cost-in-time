var unitval = function(value, unit, plural) {
  plural = plural || unit + 's';
  if (value <= 0) return '';
  if (value == 1) return '<span class="num">' + value + '</span> ' + unit;
  return '<span class="num">' + value + '</span> ' + plural;
}

var calc = function(price, income) {
  var float = price / income;
  var hours = Math.floor(float);

  var minutes = Math.floor((float - hours) * 60);
  var days = Math.floor(hours / 24);
  hours = hours - days * 24;

  var unitvals = [unitval(days, 'day'), unitval(hours, 'hour'), unitval(minutes, 'minute')]
              .filter(piece => piece);
  return unitvals.join(' and ');
}

var show = function() {
  try {
    var price = parseInt($(this).val());
    if (price > 0) {
      $('#main #result').addClass('active');
      $('#main #result #amount').html(calc(price, 10));
    }
    else
      $('#main #result').removeClass('active');
  } catch(error) {
    $('#main #result').removeClass('active');
  }

};

$(document).ready(function() {
  $('#main input#cost').keyup(show);
  $('#main input#cost').keydown(show);
  $('#main input#cost').keypress(show);
  $('#main input#cost').click(show);
  $('#main input#cost').focus(show);
  $('#main input#cost').blur(show);
});

var currencies = ['euro', 'dollar', 'pound', 'yen', 'ruble', 'rupee'];


var updateCurrencySpans = function() {
  var index = currencies.indexOf($('body').attr('currency'));
  for (var ind = 0; ind < index; ind++) $('.currency span[' + currencies[ind] + ']').addClass('passed');
  for (var ind = index; ind < currencies.length; ind++) $('.currency span[' + currencies[ind] + ']').removeClass('passed');
}

$(document).on('click', '.currency', function() {
  var current = $('body').attr('currency');
  var index = currencies.indexOf(current);
  if (index >= currencies.length - 1 || index == -1)
    $('body').attr('currency', currencies[0]);
  else
    $('body').attr('currency', currencies[index + 1]);

  updateCurrencySpans();
});
