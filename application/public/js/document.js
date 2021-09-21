$(document).ready(function() {
  $('[data-toggle="tooltip"]').tooltip();

  // input biocoins field mask
  $('.bio-money-input').keypress(function(){
    this.value = parseFloat(this.value.replace(/(.*){1}/, '0$1').replace(/[^\d]/g, '').replace(/(\d\d\d\d\d\d\d\d?)$/, '.$1')).toFixed(8);
  });

  // percentage mask
  $('.percentage').mask('##0.00%', { reverse: true })

  // sidebar active behavior
  var pathname = window.location.pathname
  const active = $('.navbar-nav > li a[href="' + pathname + '"]').parents('li')
  active.addClass('active');
})

