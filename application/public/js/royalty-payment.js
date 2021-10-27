$(document).ready(function() {
  $('.royalty-payment-select').change(function() {
    let valueInput = $(this).parents('.royalty-payment').find('.royalty-payment-value')
    let periodInput = $(this).parents('.royalty-payment').find('.royalty-payment-period')
    clearRoyaltyPaymentValue(valueInput)
    clearRoyaltyPaymentValue(periodInput)

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

    if( ['no_royalties', 'proportional_one_time_fee', 'fixed_one_time_fee'].includes(this.value)){
      periodInput.prop("disabled", true)
    }
  })

  function clearRoyaltyPaymentValue(input){
    input.prop("disabled", false)
    input.val('')
    input.unbind("keypress");
    input.unmask()
  }
});