(function(){
  'use strict';

  $(document).ready(init);


  function init(){
    $('#filter').click(filter);
    $('#showAll').click(showAll);
    $('#clear').click(clearMessage);
  }

  function clearMessage(e){
    $('#message-to').val('');
    $('#message-subject').val('');
    $('#message-content').val('');

    e.preventDefault();
  }


  function filter(e){
    var age = $('#age').serialize();

  ajax('/search', 'POST', age, res=>{
    console.log('RESSSSS');
    console.log(res);
    $('#searchResults').empty().append(res);
    console.log(res);
  });

    e.preventDefault();
  }

  function showAll(){
    ajax('/search/all', 'GET', null, res=>{
      $('#searchResults').empty().append(res);
    });
  }


  function ajax(url, type, data={}, success=r=>console.log(r), dataType='html'){
  $.ajax({url:url, type:type, dataType:dataType, data:data, success:success});
}



})();
