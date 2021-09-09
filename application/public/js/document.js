$(document).ready(function() {
  $('[data-toggle="tooltip"]').tooltip();
  $('.bio-money-input').keypress(function(){
    this.value = parseFloat(this.value.replace(/(.*){1}/, '0$1').replace(/[^\d]/g, '').replace(/(\d\d\d\d\d\d\d\d?)$/, '.$1')).toFixed(8);
});

})


