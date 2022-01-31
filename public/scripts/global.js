

var SShop = SShop || {};


String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, '');
}



SShop.init = function() {
	var me = this;

	me.searchBar();
	me.searchKeyPressEvent([]);
	me.expandContent();
	me.editProfilePopup();
	me.profilePopupAction();
	me.editUserNameAction();
	me.editProfilePassword();
	me.validateProfileForm();
    me.wallSocial();
    me.submenu_alignment();
    me.loginPopup();
}
SShop.loginPopup = function() {
	$('.close').click(function(){
		if($('body').hasClass('signin-popup')){
			$('body').removeClass('signin-popup');
		}
	})
	$('.login-link').click(function(){
		$('.login-popup #login').css('display','block');
		$('.login-popup #signupf').css('display','block');
		$('.popup-list').removeClass('signup-window')
		$('.popup-list').addClass('login-window');

	});
	$('.signup-link').click(function(){
		$('.login-popup #login').css('display','block');
		$('.login-popup #signupf').css('display','block');
		$('.popup-list').removeClass('login-window')
		$('.popup-list').addClass('signup-window');
	})
}

/*
* We have a plus icon on mobile, clicks on it to collapse or expand content
*/
SShop.expandContent = function() {
	/*Toggle Element: Plus and Minus Icon*/
	var toggleAction = $('.toggle-plus-action');
	if (toggleAction.length > 0) {
		toggleAction.on('click', function() {
			var that = $(this),
				plus = that.data('plus'),
				minus = that.data('minus'),
				toggleElement = $(that.data('element'));
			toggleElement.slideToggle(500, function() {
				if (plus.length <= 0 && minus.length <= 0) {
					return false;
				}
				if (that.hasClass(plus) === true) {
					that.addClass(minus).removeClass(plus);
				} else {
					that.addClass(plus).removeClass(minus);
				}
			});
		})
	}
}

/*
* Focus on the search input and show Search Popup
*/
SShop.searchBar = function() {
	/*Search Bar Header*/
	var searchBar = $('.box-search-global'), searchInput, that,
		searchSuggestionEl = $('.search-suggestion-wrapper'),
		searchInput = searchBar.find('.search-input-element'),
		searchCancelEl = searchBar.find('.search-cancel-button');

	var searchBar2 = $('.search-box-mobile'), searchInput, that,
		searchSuggestionEl = $('.search-suggestion-wrapper'),
		searchInput = searchBar2.find('.search-input-element'),
		searchCancelEl = searchBar2.find('.search-cancel-button');

	if (searchBar.length > 0) {
	    searchInput.on('focus', function() {
	    	if (searchInput.val().length < 1) {
	        	searchBar.addClass('expand').removeClass('suggest');
	        } else {
	        	searchBar.removeClass('expand').addClass('suggest');
	        }
	    });
	}

	if (searchBar2.length > 0) {
	    searchInput.on('focus', function() {
	    	if (searchInput.val().length < 1) {
	        	searchBar2.addClass('expand').removeClass('suggest');
	        } else {
	        	searchBar2.removeClass('expand').addClass('suggest');
	        }
	    });
	}

	$('body').on('click', function(evt) {
	    var target = $(evt.target);
	    if (target.hasClass('.search-category-wrapper') ||
	        target.hasClass('.search-result-condition') ||
	        target.hasClass('.box-search-global') ||
	        target.hasClass('.search-box-mobile') ||
	        target.closest('.search-category-wrapper').length > 0 ||
	        target.closest('.search-result-condition').length > 0 ||
	        target.closest('.search-box-mobile').length > 0 ||
	        target.closest('.box-search-global').length > 0 ) {
	        return false;
	    }
	    searchInput.val('');
	    searchBar.removeClass('expand').removeClass('suggest');
	    searchBar2.removeClass('expand').removeClass('suggest');
	});

	searchCancelEl.on('click', function() {
		searchBar.removeClass('expand').removeClass('suggest');
		searchBar2.removeClass('expand').removeClass('suggest');
	});
}


/*
* Show comments popup on the wall page
*/
SShop.wallSocial = function() {
    $(".my-wall .item-icons").on("click", "li", function(e){
        e.preventDefault();

        if($(this).index() == 0 || $(this).index() == 1){
            if($("a", $(this)).hasClass("selected")){
                $(".my-wall .item-icons a").removeClass("active").removeClass("selected");
                $(".my-wall-popup").hide();
                return;
            }

            $(".my-wall .item-icons a").removeClass("active").removeClass("selected");
            $(".my-wall-popup").hide();
            $("a", $(this)).addClass("active").addClass("selected");

            if($(this).index() == 0){
              $(this).parent().parent().children(".heart-popup").show();
            }

            if($(this).index() == 1){
              $(this).parent().parent().children(".comment-popup").show();
            }
        }
    });
}

// Change submenu alignment dynamically depending on submenu position
SShop.submenu_alignment = function() {
	var total_li = $('.nav-ul .nav-li').length;
	$('.nav-ul .nav-li').each(function(){
		var nav_cur_index = $(this).index();
		if( nav_cur_index > total_li/2 ){
			$(this).find('.subnav-content').addClass('alignright');
		}

	})
}










/*
* Get text from the search input and call to returned json object and return the result of search action
*/
SShop.searchProcess = function(jsonResult, query) {
	var me = this, searchBar = $('.box-search-global');
	if (query.length > 0 && query.trim().length >= 1) {
		me.searchSuggestion(jsonResult, query);
	}

	if (query.length < 1) {
    	searchBar.addClass('expand').removeClass('suggest');
    }
}


/*
* User enters text into the search input
*/
SShop.searchKeyPressEvent = function(jsonResult) {
	var me = this,
		searchInputEl = $('.search-input-element');
	searchInputEl.on('keypress paste focus', function() {
		var query = $(this).val();

		me.searchProcess(jsonResult, query);
	}).on ('keyup', function(e) {
		var query = $(this).val();
		//backspace and delete key
		if (e.keyCode == 8 || e.keyCode == 46) {
            me.searchProcess(jsonResult, query);
        } else {
            e.preventDefault();
        }
	});
}

/*
* Do search suggestion in case user enters something in the search box
*/
SShop.searchSuggestion = function(jsonResult, query) {
	jsonResult = [
		[
			{
				'url_key': 'camera',
				'name': 'Camera'
			},
			{
				'url_key': 'long-dresses',
				'name': 'Long Dresses'
			},
			{
				'url_key': 't-shirt',
				'name': 'T-Shirt'
			},
			{
				'url_key': 'laptop-and-desktop',
				'name': 'Laptop And Desktop'
			},
			{
				'url_key': 'house-and-life',
				'name': 'House And Life'
			}
		],
		{
			"iphon": {
			  "url_key": "",
			  "total": 743
			}
		}
	];

	var me = this, _html = '',
		searchListEl = $('.search-suggestion-list'),
		searchBox = $('.box-search-global'),
		liEl = '',
		result = jsonResult[0];

	if (jsonResult.length > 0 && result.length > 0) {
		for (var i = 0; i < result.length; i++) {
			if (result[i].name.toLowerCase().indexOf(query.toLowerCase()) > -1) {
				liEl = ['<li class="search-item"><a href="', result[i].url_key ,'">', result[i].name, '</a></li>'].join('');
				_html = _html + liEl;
			}
		}
	}
	if (_html.length > 0) {
		searchBox.removeClass('expand').addClass('suggest');;
		searchListEl.html(_html);
		me.searchSuggestionElAction(searchBox, searchListEl);
	} else {
		searchBox.removeClass('suggest');
	}
}

SShop.searchSuggestionElAction = function(searchBox, searchListEl) {
	if (searchListEl.length > 0 && searchBox.length > 0) {
		var searchItem = searchListEl.find('.search-item').find('a'),
		searchInputEl = searchBox.find('.search-input-element');
		searchItem.on('click', function() {
			var that = $(this);
			searchInputEl.val(that.html());
			searchBox.removeClass('suggest');
		});
	}
}

/*
* User clicks on 'Edit' link, it shows an Edit Profile popup
*/
SShop.editProfilePopup = function() {
	/*Begin Click on edit to show preview popup*/
	var previewEdit = $('.preview-edit-link'), previewAccount=$('.top-header-right .account-info'),
		previewPopup = $('.preview-content .preview-popup');
	if (previewEdit.length > 0) {
		previewEdit.on('click', function(evt) {
			evt.preventDefault();
			evt.stopPropagation();
			$('.preview-edit-popup').removeClass('hide');
		});
	}
	/*if (previewAccount.length > 0) {

		previewAccount.on('click', function(evt) {
			evt.preventDefault();
			evt.stopPropagation();
			$('.top-header-right .preview-popup').removeClass('hide');
		});
	}*/
	$('body').on('click', function(evt) {
		var target = $(evt.target),
			parent = target.closest('.preview-popup:visible');
		if (target.hasClass('preview-popup:visible') === false && parent.length <= 0) {
			previewPopup.addClass('hide');
		}
	});
	/*End Click on edit to show preview popup*/
}

/*
* Edit user's password
*/
SShop.editProfilePassword = function() {
	var profileForm = $('.form-profile-preview'),
		passwordEl = profileForm.find('.input-password'),
		confirmPassEl = profileForm.find('.input-confirm-password'),
		previewEditPassword = profileForm.find('.password-edit-link');

	previewEditPassword.on('click', function(evt) {
		evt.preventDefault();
		var that = $(this),
			action = that.data('action');

		if (action === 1) {
			that.html('Cancel').data('action', 0);
			passwordEl.prop('disabled', false);
			confirmPassEl.prop('disabled', false);
		}

		if (action === 0) {
			that.html('Edit').data('action', 1);
			passwordEl.prop('disabled', true);
			confirmPassEl.prop('disabled', true);
		}
	});
}

/*
* profilePopupAction: User clicks on links on Edit Profile popup, then website shows a form that enables user update username and profile picture
*/
SShop.profilePopupAction = function() {
	var me = this, previewPopup  = $('.preview-content .preview-popup'),
		previewUserForm = $('.preview-user-form-wrapper'),
		previewLinkAction = previewPopup.find('.preview-li').find('a');

	previewLinkAction.on('click', function(evt) {
		evt.preventDefault();

		var that = $(this),
			action = that.data('action');

		/*User clicks on 'Cancel' link*/
		if (action === 'cancel') {
			previewPopup.addClass('hide');
			me.hideContent(false);
		}

		/*User clicks on 'Edit Username' and 'Edit Profile Picture' link*/
		if (action === 'name' || action === 'picture') {
			me.hideContent(true);
			previewUserForm.removeClass('hide');
			previewPopup.addClass('hide');
		}
	});
}

/*
* editUserNameAction: In case user clicks on 'Submit' button, we * have a validation
*/
SShop.editUserNameAction = function() {
	var me = this, previewUserForm = $('.preview-user-form-wrapper'),
		inputUsername = previewUserForm.find('.input-preview-user-name'),
		previewButton = previewUserForm.find('.preview-submit-button'),
		errEl = '<span id="input-preview-user-name-error" class="error input-preview-user-name-error">Please enter user name.</span>';

	previewButton.on('click', function() {
		if (inputUsername.val().trim().length <= 0) {
			var groupEl = inputUsername.closest('.form-group-by');
			if (previewUserForm.find('.input-preview-user-name-error').length <= 0) {
				$(errEl).insertAfter(groupEl);
			}
		} else {
			previewUserForm.find('.input-preview-user-name-error').remove();
			me.hideContent(false);
			previewUserForm.addClass('hide');
		}
	});
}

/*
* Hide or show 'Edit' link
*/
SShop.hideContent = function(hide) {
	var previewContent = $('.preview-content'),
		title = previewContent.find('.preview-title'),
		edit = previewContent.find('.preview-edit');

	if (hide === true) {
		title.addClass('hide');
		edit.addClass('hide');
	} else {
		title.removeClass('hide');
		edit.removeClass('hide');
	}
}


/*
* Validation for Edit Profile form
*/
SShop.validateProfileForm = function() {
	var me = this,
	profileFormRules = {
		rules: {
			'input-firstname': {
				required: true
			},
			'input-lastname': {
				required: true
			},
			'input-email': {
				required: true,
				email: true
			},
			'input-zipcode': {
				required: true
			},
			'input-gender': {
				required: true
			}
		},
		messages: {
			'input-firstname': {
				required: 'Please enter first name.'
			},
			'input-lastname': {
				required: 'Please enter last name.'
			},
			'input-email': {
				required: 'Please enter email address.',
				email: 'Your email is not correct.'
			},
			'input-zipcode': {
				required: 'Please enter zip code.'
			},
			'input-gender': {
				required: 'Please select gender.'
			}
		},
		errorElement: 'span',
		errorPlacement: function(error, element) {
			var parent = element.closest('.form-group-by');
			error.addClass(error.attr('id'));
			error.insertAfter(parent);
		}
	};
	if ($(".form-profile-preview").length > 0) {
		//$(".form-profile-preview").validate(profileFormRules);
	}
}


