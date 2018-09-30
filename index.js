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
    var price = parseInt($(this).val().replace(/\,/g, ''));
    if (price > 0) {
      var calcresult = calc(price, getHourlyRate());
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

var currencies = ['euro', 'dollar', 'pound', 'yen', 'ruble', 'rupee', 'rial'];

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

$(document).on('click', '.rateunit', function() {
  if ($(this).is('[readonly]')) return;
  var current = getRateUnit();
  if (current == 'monthly') setRateUnit('hourly');
  else setRateUnit('monthly');
});

var updateRate = function() {
  setRate(parseInt($(this).val().replace(/\,/g, '')), true);
}

var updateWorkingHours = function() {
  setWorkingHours(parseInt($(this).val()), true);
}

var getRate = function() { return localStorage['rate'] || 10; }
var setRate = function(rate, skipInput) {
  localStorage['rate'] = rate;
  showRate(skipInput);
}

var getRateUnit = function() { return localStorage['rateUnit'] || 'hourly'; }
var setRateUnit = function(unit) {
  localStorage['rateUnit'] = unit;
  $('body').attr('rateunit', unit);
}

var getWorkingHours = function() { return localStorage['workingHours'] || 160; }
var setWorkingHours = function(hours, skipInput) {
  localStorage['workingHours'] = hours;
  $('#rateedit #monthly-hint #workinghours').html(hours);
  if (!skipInput) $('#hoursedit input#hours').val(hours);
}

var getHourlyRate = function() {
  var rateUnit = getRateUnit();
  if (rateUnit == 'monthly') {
    return getRate() / getWorkingHours();
  }
  else if (rateUnit == 'hourly') {
    return getRate();
  }
}

var showRate = function(skipInput) {
  $('#rate #rateamount').html(getRate());
  if (!skipInput)
    $('#rateedit input#rate').val(getRate());
}

var setState = function(state) {
  $('#holder').attr('state', state);
}

var bindInput = function(input, handler) {
  $(input).keyup(handler);
  $(input).keydown(handler);
  $(input).keypress(handler);
  $(input).click(handler);
  $(input).focus(handler);
  $(input).blur(handler);
}

var addCurrencyElements = function() {
  $('.currency').html(
                '<span euro>&euro;</span>'
                +'<span dollar>$</span>'
                +'<span pound>&pound;</span>'
                +'<span yen>&yen;</span>'
                +'<span rupee>&#8377;</span>'
                +'<span ruble>&#8381;</span>'
                +'<span rial>ریال</span>'
                );
}

var addRateUnitElements = function() {
  $('.rateunit').html(
    '<span hourly>per hour</span>'
    + '<span monthly>per month</span>'
  );
}

$(document).ready(function() {
  addCurrencyElements();
  addRateUnitElements();
  bindInput('#main input#cost', show);
  bindInput('#rateedit input#rate', updateRate);
  bindInput('#hoursedit input#hours', updateWorkingHours);

  updateCurrency(localStorage['currency']);
  setRateUnit(getRateUnit());
  setRate(getRate());
  setWorkingHours(getWorkingHours());

  $('[tostate]').click(function(){ setState($(this).attr('tostate')); });

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
