var ShopBag = ShopBag || {};

$(function() {
	
	ShopBag.navbar = {

		init: function() {
		  ShopBag.navbar.menu();
		  ShopBag.navbar.ripple();
		},
		menu: function(){
			
		},
		ripple: function() {
			
		},

	};
	
	ShopBag.header = {

		init: function() {
		  ShopBag.header.menu();
		  ShopBag.header.ripple();
		},
		findAndInitCustomSelects: function (){

		
		var $customSelectInputArr = $('select.aanSelect')


		if($customSelectInputArr.length){
		    	

			$customSelectInputArr.each(function(i){
				ShopBag.header.handleCustomSelectIssues( $(this), i );
				if(i>10)
					window.alert(i);

			})
		}
	}, // findAndInitCustomSelects() ends
	handleCustomSelectIssues: function ( $customSelectInput, customInputItemNo){
		var selectOptions = ''
		$customSelectInput.find('option').each(function(i){
			$(this).data('index',i)
			selectOptions+='<li'+ (($(this).attr('selected') == true ) ? ' class="selected"' : '') +'>'+$(this).text()+'</li>'
		})

		$customSelectInput.after('<div class="customDropdown"><div class="ul-head"><div class="txtContainer">'+$('select.aanSelect:eq('+customInputItemNo+') option:selected').text()+'</div><div class="customDropdownArrow"></div></div>'+((selectOptions != '') ? ('<ul>'+selectOptions+'</ul>') : '')+'</div>')

		// To add customscrollbar
		if($customSelectInput.find('option').length > 6){
			$customSelectInput.each(function () {$(this).siblings('.customDropdown').find('ul').addClass('mCustomScrollbar')})
		}
		
		var $customSelectDiv = $('div.customDropdown').eq(customInputItemNo)
		var $customSelectDiv_ul = $customSelectDiv.find('ul')
		$customSelectDiv.find('div.ul-head').click(function(e){
			e.stopPropagation();
			$customSelectDiv_ul.hasClass('opened') ? $customSelectDiv_ul.removeClass('opened') : $customSelectDiv_ul.addClass('opened');
			$('div.ul-head').not(this).siblings('ul').removeClass('opened');
		})
		
		$customSelectDiv.find('li').each(function(i){
			var $this_li = $(this);
			$this_li.click(function(e){
				e.stopPropagation()
				// remove and add the selected class
				$customSelectDiv_ul.find('li.selected').removeClass('selected');
				$this_li.addClass('selected');
				// Remove previously selected option and set the newly selected option
				$customSelectInput.find('option[selected="selected"]').removeAttr('selected');
				$customSelectInput.find('option:eq('+i+')').attr('selected', true);
				// hide the open options
				$customSelectDiv_ul.removeClass('opened');
				// Replacing the selected text of the upper span
				$customSelectDiv.find('div.txtContainer').html( $this_li.text());

				// Only for Add heart with favorite in sort by
				addHeartInDropdown($('.select_product_cat.with_favorite'))

			})
		})

		$(document).click(function() { $(".customDropdown ul").removeClass("opened") })

	}, // Ending Function handleCustomSelectIssues
	// Custom Select Ends
		menu: function(){
		window.alert("yes");
             
			 ////////////////
			 
			 
			 
	
	
			 
			 
			 /////////////////
			 
			 
		
		},
		ripple: function() {
			
		},

	};

});

//ShopBag.header.menu();
