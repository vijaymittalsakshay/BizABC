
function menuresponsive1() {
	
	
/*creo l'elemento menu dove al click si visualizzera il menu nascosto*/
$('<div id="menumobile">Menu1</div>').appendTo('#wrapper');

	
/*copio il menu	*/
 var copy = $('.menu').clone();
 
 if($(window).width() < 1024){

 /*inserisco il menu copiato prima del wrap */	
$(copy).addClass('mobile').insertBefore('#wrapper');

	
/*rimuovo il menu dopo il wrap*/	
 $('#wrapper .menu').remove();
	
 $('#menumobile').on('click', function() {
		
		/*effetto toggle jqeury ui*/
		/***************************************/
      //  $('.menu').delay(400).toggle('slide', 1500);
	  /***************************************/
	   
		/*invece per farlo comparire direttamente sotto tipo facebook*/
		$('.menu').show();
		
		/*ottengo tramite variabile il width del menu*/
		var menuw = $('.menu').width();
		
		/*sposto wrap*/
		if($('#wrapper').hasClass('inizio')){
			
			$('#wrapper').animate({left:'0'},500)
				$('#wrapper').removeClass('inizio')
			
			} 
			else
			
			{
				$('#wrapper').animate({left:menuw+'px'}, 500)
				
				$('#wrapper').addClass('inizio')
				
				
				}
  
	});// chiusura onclick	
	
 }
 else{
	 
	 /*controllo se il menu è mobile*/
	 var menucell = $('ul').hasClass('mobile');
	 
	 /*se è presente il menumobile prima del wrap */
	 if(menucell){
		 
	/*sposto il menu nel wrap*/	 
	$(copy).appendTo('#wrapper'); 
	
	/*rimuovo il menu prima del wrap altrimenti ci sarebbe una copia*/
	 $(menucell).remove();
	
	 }
	 
 } // CHIUDO L IF
 

} 



function menuresponsive2() {
	
	
/*creo l'elemento menu dove al click si visualizzera il menu nascosto*/
$('<div id="menumobile">Menu2</div>').appendTo('#wrapper');

	
/*copio il menu	*/
 var copy = $('.menu').clone();
 
 

 /*inserisco il menu copiato prima del wrap */	
$(copy).removeClass('menu').addClass('mobile').appendTo('body');


/*ottengo tramite variabile il width del menu*/

 $('#menumobile').bind('click', function() {
		
		/*effetto toggle jqeury ui*/
		/***************************************/
      //  $('.mobile').delay(400).toggle('slide', 1500);
	  /***************************************/
	var mause_out = false;
		var menuw = $('.mobile').width()
		
		/*sposto wrap*/
		if($('#wrapper').hasClass('inizio')){
			
			$('#wrapper').animate({left:'0'},600)
				$('#wrapper').removeAttr('style').removeClass('inizio')
				
				


			
			} else
			
			
			{ 
				$('#wrapper').animate({
					left:menuw+'px', 
					
					position:'fixed', 
					
					overflow:'hidden'
					
					}, 
					
					400)
					
					.addClass('inizio')
				
				
				
			
				
				
				}
			

  
	});// chiusura onclick	
	

 

} //chiusura funzione




//check mobile version




function menuresponsive3() {
	
	
	var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

	
	
/*creo l'elemento menu dove al click si visualizzera il menu nascosto*/
$('<div id="menumobile"></div>').appendTo('#menutops');

	
/*copio il menu	*/
 var copy = $('.menu').clone();
 
 

 /*inserisco il menu copiato prima del wrap */	
$(copy).removeClass('menu').addClass('mobile').appendTo('body');



/*variable for test close/open menu*/
var wrap_open = false;

/*get width menu with css*/

var menuw = $('.mobile').width()

/*ottengo tramite variabile il width del menu*/

 $('#menumobile').click(function() {
		
		/*effetto toggle jqeury ui*/
		/***************************************/
      //  $('.mobile').delay(400).toggle('slide', 1500);
	  /***************************************/
	  

/*get width menu with css*/	  
var menuw = $('.mobile').width();
		
if( wrap_open ){
			
			$('body , html').removeAttr('style');
			 $('#wrapper,#fullheds.act').animate({left:'0'},600, function (){wrap_open = false })
			return false;
			
				
		} else
			
			
			{ 
			
				$('body , html').css( {overflow :'hidden', position : 'relative'} );
				$('#wrapper,#fullheds.act').animate({ left: menuw + 'px'}, 400, function (){wrap_open = true })
					return false;
					
				
}
			
  
	});// chiusura onclick	
	
	
//$('#wrapper').bind('click', function() {
//	  
//	  if(wrap_open){
//		  $('body , html').removeAttr('style');
//		  $('#wrapper').animate({left:'0'},600, function (){wrap_open = false })
//			return false;
//		  
//		  
//		  }
//});//click fuori dal menu per chiudere il wrap
  
	
	
/*********************************
if device like iphone or ipad

****************************************/


	
 

//carica jqury mobile
	
//$.getScript("http://code.jquery.com/mobile/1.3.1/jquery.mobile-1.3.1.min.js");

//$.getScript("http://code.jquery.com/mobile/1.3.1/jquery.mobile-1.3.1.min.js", function(){


 //  alert("Script loaded and executed.");
  

//});



//hide loading text
	
	
	$('.ui-page-active').on('swipeleft', function(){
		
		
		
		
		
		if( wrap_open ){
			
			$('body, html').removeAttr('style');
			
			$('#wrapper').animate({left:'0'}, 400, function (){wrap_open = false })
			return false;
				
		}
		
		});//chiudi swipe
		
		
	$('.ui-page-active').on('swiperight', function(){ 
		
		if( !wrap_open ){
			
			
			$('body , html').css( {overflow :'hidden', position : 'relative'} );
			$('#wrapper').animate({ left: menuw + 'px'}, 400, function (){wrap_open = true })
			return false;
				
		}
		
		});// chiudo swipe
	


} //chiusura funzione







$(document).ready(function(){
	
		
		//	menuresponsive1();
		//	menuresponsive2();
			menuresponsive3();
		
		

	
	
	})