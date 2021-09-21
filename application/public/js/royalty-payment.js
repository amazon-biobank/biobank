$(document).ready(function() {
  $('.royalty-payment-select').change(function() {
    let valueInput = $(this).parents('.royalty-payment').find('.royalty-payment-value')
    clearRoyaltyPaymentValue(valueInput)

    if(this.value == 'no_royalties'){
      valueInput.prop("disabled", true)
    }
    else if( ['proportional_one_time_fee', 'proportional_periodic_fee', 'profit_proportional_periodic_fee'].includes(this.value)){
      valueInput.mask('##0.00%', { reverse: true })
    }
    else if( ['fixed_one_time_fee', 'fixed_periodic_fee'].includes(this.value)){
      valueInput.keypress(function(){
        this.value = parseFloat(this.value.replace(/(.*){1}/, '0$1').replace(/[^\d]/g, '').replace(/(\d\d\d\d\d\d\d\d?)$/, '.$1')).toFixed(8);
      });
    }
  })

  function clearRoyaltyPaymentValue(valueInput){
    valueInput.prop("disabled", false)
    valueInput.val('')
    valueInput.unbind("keypress");
    valueInput.unmask()
  }
});