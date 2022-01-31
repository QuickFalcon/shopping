/*
* Description: Checkbox with custom styles
* Author: binhnguyenvanctk28@gmail.com
* Date: 01 February, 2015
*/
(function($) {

	$.fn.checkboxCustomPlugin = function(options) {
		var plugin = this;
		plugin.settings = $.extend($.fn.checkboxCustomPlugin.defaults, options);

		var element = $(this);

		if(element.is(':checkbox') === true || element.find('input').is(':checkbox') === true) {
			element.on('click', function() {
				var that = $(this),
					hiddenEl = that.find('input:checkbox');
				that.toggleClass('icon-checkbox-with-checked');
				if (that.hasClass(plugin.settings.checked)) {
					hiddenEl.val('1');
				} else {
					hiddenEl.val('0');
				}
			});
		}
	}
	
	$.fn.checkboxCustomPlugin.defaults = {
		checked: 'icon-checkbox-with-checked',
		unchecked: 'icon-checkbox-unchecked',
		disabled:	false,
		disabledChecked:	false,
		selectAll:  null
	};


	$.fn.checkAllPlugin = function(options) {
		//this.options = $.extend($.fn.checkAllPlugin.defaults, options);

		var element = $(this);

		//if(element.is(':checkbox') === true || element.find('input').is(':checkbox') === true) {
		

/*		var innerMethod = {

		};*/
		var plugin = this;
		plugin.settings = {};

		//element = '.checkbox-wrapper'
		element.on('click', function() {
			plugin.settings = $.extend($.fn.checkAllPlugin.defaults, options);
			var that = $(this),
				elementWrapper = that.closest(plugin.settings.elementWrapper),
				allCheckboxes = elementWrapper.find(plugin.settings.checkboxList).find(plugin.settings.checboxItemClass),
				hiddenCheckboxes = allCheckboxes.find('input:checkbox');

			if (plugin.settings.clear === true) {
				allCheckboxes = elementWrapper.find(plugin.settings.checboxItemClass);
				allCheckboxes.removeClass(plugin.settings.checked);
				hiddenCheckboxes.val('0');
				return false;
			}
			if (allCheckboxes.length <= 0) {
				return false;
			}
			if (that.hasClass(plugin.settings.checked)) {
				allCheckboxes.addClass(plugin.settings.checked);
				hiddenCheckboxes.val('1');
			} else {
				allCheckboxes.removeClass(plugin.settings.checked);
				hiddenCheckboxes.val('0');
			}
		});
	}
	
	$.fn.checkAllPlugin.defaults = {
		idPrefix: '#',
		classPrefix: '.',
		checboxItemClass: '.checkbox-style',
		elementWrapper: '.search-result-right',
		checkboxList: '.search-content-condition',
		checked: 'icon-checkbox-with-checked',
		unchecked: 'icon-checkbox-unchecked',
		clear: false
	};

})(jQuery);