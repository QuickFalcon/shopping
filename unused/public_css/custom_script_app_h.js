$.mCustomScrollbar.defaults.scrollButtons.enable=true;

(function(){
        $('[data-toggle="tooltip"]').tooltip();
        
	var shopLike = $('.shop-like-pro a');
	if (shopLike.length > 0) {
		shopLike.click(function(){
			$('html, body').animate({scrollTop : 0},800);
			return false;
		});
	}
	
	var country = $("#countries");
	if (country.length > 0) {
		country.msDropdown({ });
	}
	

	$(".see-items").on("click", function () {
		var $parent = $(this).closest("li"),
			$childItems = $parent.find(".child-items");
		if ($childItems.data("show")) {
			$childItems.slideUp(function () {
				$childItems.data("show", false);
			});
		}
		if (!$childItems.data("show")) {
			$childItems.slideDown(function () {
				$childItems.data("show", true);
			});
		}
	});

})();


	/*Login function*/
	function focusfield(field,defaultval,defaultcol)
	{
		defaultcol = typeof(defaultcol) != 'undefined' ? defaultcol : '#231f20' ;
		$("#"+field).css('color',defaultcol);
		if ($("#"+field).val() == defaultval ) {$("#"+field).val('');}
	}
	function blurfield(field,defaultval)
	{
		if ($("#"+field).val() == '' ) {$("#"+field).val(defaultval);}
	}
	function changetype(field,typeval,defaultval)
	{
		defaultval = typeof(defaultval) != 'undefined' ? defaultval : "" ;
		if(defaultval=="" || defaultval == $("#"+field).val())
		{
			$("#"+field).get(0).type=typeval;
		}
	}
	function sign_in()
	{
		$("#login").show();
		goto('#login', this);
	}
	function back_to_sign_home()
	{
		goto('#signup1', this);
		setTimeout(function(){
		$("#login").hide();
                $("button.close").show();
                $('#login-popup').off('hide.bs.modal');
		$("#signup2").hide();$("#cboxClose").show();},600);
	}
	function back_to_signup2()
	{
		
		goto('#signup2', this);
		setTimeout(function(){
		$("#login").hide();
		
		},600);
	}
	function check_signup1()
	{
		$("#email_id").val($("#email_id").val().toLowerCase());
		if(!isValidateEmail($("#email_id").val()) )
		{	
                    var options = {direction: 'left',distance: 5,times: 5};			
                    $( "#email_id" ).effect( "shake", options , 100, function(){setTimeout(function(){
                        if($("#email_id").val() == 'enter your email' || $("#email_id").val() == 'ENTER YOUR EMAIL'  )
                        {
                            $("#email_id").val($("#email_id").val().toUpperCase());
                        }	
                    }, 300);} );
                    $("#email_id").css('color','red').focus();
                    $(".input-email_id-error").addClass("error");
		}
		else
		{
                    $(".input-email_id-error").removeClass("error");
                    //check_email_exist($("#email_id").val());
                    $("#login-popup").unbind('click');
                    $("button.close").hide();
                    $('#login-popup').on('hide.bs.modal', function (e) {
                        e.preventDefault();
                        return false;
                    })
                    $("#signup2").show();
                    goto('#signup2', this);
                    $("#signup").hide();
		}
	}
	function check_email_exist(email_id)
	{
		$.ajax({//Make the Ajax Request
	
			type: "POST",
	
			url: "./ajax_files/check_email_exist.php",
	
			data: "email="+email_id,
	
			beforeSend:  function() {
	
			},
	
			success: function(html){//html = the server response html code
			//$("#pre_load").hide();
			if(html == 202)
			{
				//signup2();
				//$("html").unbind('click');
				$("#cboxOverlay").unbind('click');
				$("#cboxClose").hide();
				$("#signup2").show();
				goto('#signup2', this);
				$("#signup").hide();
			}
			else
			{
				var options = {direction: 'left',distance: 5,times: 5};			
				$( "#email_id" ).effect( "shake", options , 100, function(){setTimeout(function(){alert("A user has already registered with this email. Please re-enter a new email address to sign up or choose sign-in");}, 300);} );
				$("#email_id").css('color','red');
			}
			}
		});	
	}
	function check_signup2()
	{	/*
		if($("#conf_email").val() != "CONFIRM YOUR EMAIL")$("#conf_email").val($("#conf_email").val().toLowerCase());
		if(!isValidateEmail($("#conf_email").val()) )
		{	
			var options = {direction: 'left',distance: 5,times: 5};			
			$( "#conf_email" ).effect( "shake", options , 100, function(){setTimeout(function(){alert("Invalid Email ID");}, 300);}  );
			$("#conf_email").css('color','red');
			return false;
		}
		if( $.trim($("#conf_email").val().toLowerCase()) !=  $.trim($("#email_id").val().toLowerCase()) )
		{	
			var options = {direction: 'left',distance: 5,times: 5};			
			$( "#conf_email" ).effect( "shake", options , 100, function(){setTimeout(function(){alert("Email ID Mismatch");}, 300);}  );
			$("#conf_email").css('color','red');
			return false;
		}
		if( $.trim($("#fname").val()) == "" || $("#fname").val() == "FIRST NAME" )
		{	
			var options = {direction: 'left',distance: 5,times: 5};			
			$( "#fname" ).effect( "shake", options , 100, function(){setTimeout(function(){alert("Should Not Be Null");}, 300);}  );
			$("#fname").css('color','red');
			return false;
		}
		if( /^[a-zA-Z\s]+$/i.test($.trim($("#fname").val()))==false)
		{	
			var options = {direction: 'left',distance: 5,times: 5};			
			$( "#fname" ).effect( "shake", options , 100, function(){setTimeout(function(){alert("Only Letters and Space Allowed for First Name");}, 300);}  );
			$("#fname").css('color','red');
			return false;
		}
		if( $.trim($("#lname").val()) == "" || $("#lname").val() == "LAST NAME"  )
		{	
			var options = {direction: 'left',distance: 5,times: 5};			
			$( "#lname" ).effect( "shake", options , 100, function(){setTimeout(function(){alert("Should Not Be Null");}, 300);}  );
			$("#lname").css('color','red');
			return false;
		}
		if( /^[a-zA-Z\-]+$/i.test(($("#lname").val()))==false)
		{	
			var options = {direction: 'left',distance: 5,times: 5};			
			$( "#lname" ).effect( "shake", options , 100, function(){setTimeout(function(){alert("Only Letters and Hyphen Allowed for Last Name");}, 300);}  );
			$("#lname").css('color','red');
			return false;
		}
		if( $.trim($("#pass").val()) == "" || $("#pass").val() == "CREATE PASSWORD"  )
		{	
			var options = {direction: 'left',distance: 5,times: 5};			
			$( "#pass" ).effect( "shake", options , 100, function(){setTimeout(function(){alert("Should Not Be Null");}, 300);}  );
			$( "#pass" ).get(0).type='text';
			$("#pass").css('color','red');
			return false;
		}
		if ((!/\d/.test($("#pass").val()) || !/[a-zA-Z]/.test($("#pass").val()))) 
		{
			var options = {direction: 'left',distance: 5,times: 5};			
			$( "#pass" ).effect( "shake", options , 100, function(){setTimeout(function(){alert("Must Have a Minimum of 5 Characters. At Least One Letter And One Number. ");}, 300);}  );
			$("#pass").css('color','red');
			return false;
		}
		if(/^[a-zA-Z0-9]*$/.test($("#pass").val()) == false) {
			var options = {direction: 'left',distance: 5,times: 5};			
			$( "#pass" ).effect( "shake", options , 100, function(){setTimeout(function(){alert("Special Characters Are Not Allowed In Password ");}, 300);}  );
			$("#pass").css('color','red');
			return false;
		}		
		if (($("#pass").val().length < 5) ) 
		{
			var options = {direction: 'left',distance: 5,times: 5};			
			$( "#pass" ).effect( "shake", options , 100, function(){setTimeout(function(){alert("Length Should Be A Minimum Of 5");}, 300);}  );
			$("#pass").css('color','red');
			return false;
		}
		if( $.trim($("#cpass").val()) == ""  || $("#cpass").val() == "CONFIRM PASSWORD" )
		{	
			var options = {direction: 'left',distance: 5,times: 5};			
			$( "#cpass" ).effect( "shake", options , 100, function(){setTimeout(function(){alert("Should Not Be Null ");}, 300);}   );
			$( "#cpass" ).get(0).type='text';
			$("#cpass").css('color','red');
			return false;
		}
		if( $.trim($("#cpass").val()) !=  $("#pass").val() )
		{	
			var options = {direction: 'left',distance: 5,times: 5};			
			$( "#cpass" ).effect( "shake", options , 100, function(){setTimeout(function(){alert("Password Mismatch");}, 300);}    );
			$("#cpass").css('color','red');
			return false;
		}
		if( $.trim($("#zip").val()) == "" || $("#zip").val() == "ZIP CODE")
		{	
			var options = {direction: 'left',distance: 5,times: 5};			
			$( "#zip" ).effect( "shake", options , 100, function(){setTimeout(function(){alert("Should Not Be Null");}, 300);}   );
			$("#zip").css('color','red');
			return false;
		}
		if(!/^[0-9a-zA-Z\s]{5,12}$/.test($("#zip").val()))
		{	
			var options = {direction: 'left',distance: 5,times: 5};			
			$( "#zip" ).effect( "shake", options , 100, function(){setTimeout(function(){alert("Invalid Zip Code");}, 300);}   );
			$("#zip").css('color','red');
			return false;
		}
		if($("#drop_sex").val()=="")
		{	
			var options = {direction: 'left',distance: 5,times: 5};			
			$( "#drop_sex" ).effect( "shake", options , 100, function(){setTimeout(function(){alert("Select Your Sex");}, 300);}   );
			$("#drop_sex").css('color','red');
			return false;
		}*/
		save_registration();
	}
	function save_registration()
	{/*
		$sex = $("#drop_sex_title > .ddlabel").text();
		$blog = ($("#subscribe").is(":checked")?1:0);
		$.ajax({//Make the Ajax Request

		type: "POST",

		url: "./ajax_files/registration.php",

		data: "email="+$("#conf_email").val()+"&fname="+$.trim($("#fname").val())+"&lname="+$.trim($("#lname").val())+"&pass="+$("#cpass").val()+"&zip="+$("#zip").val()+"&sex="+$sex+"&blogsub="+$blog,


		
		beforeSend:  function() {

		//$("#pre_load").show();
		//$('#pre_load').html('<img src="http://www.sociallyshoppablestyle.com/images/ajax-loader.gif" />');//Loading image during the Ajax Request
		

		},

		success: function(html){//html = the server response html code
        //$("#pre_load").hide();
		if(html==1 || html==2 )
		{
			$("#signupf").show();
			goto('#signupf', this);

		}
		}
		});
		
		*/
		
		$("#signupf").show();
		goto('#signupf', this);
	}
	function check_login()
	{
		if(!isValidateEmail($("#login_email").val()) )
		{	
			var options = {direction: 'left',distance: 5,times: 5};			
			$( "#login_email" ).effect( "shake", options , 100 );
			$("#login_email").css('color','red');
			return false;
		}
		if( $.trim($("#login_pass").val()) == "" || $("#login_pass").val() == "ENTER YOUR PASSWORD" )
		{	
			var options = {direction: 'left',distance: 5,times: 5};			
			$( "#login_pass" ).effect( "shake", options , 100 );
			$("#login_pass").css('color','red');
			return false;
		}
		login_user();
	}
	function tlogin()
	{
		window.open('http://www.sociallyshoppablestyle.com/login_twitter','Twitter_Login', 'height=500px,width=500px,scrollbars=1', false);
		//window.location="./login_twitter";

	}
	function seeterms()
	{
		window.open('http://www.sociallyshoppablestyle.com/terms.php','Terms', 'height=500px,width=500px', false);
		//window.location="./login_twitter";

	}
	
	function login_user()
	{
		$rememb = ($("#login_rememb").is(":checked")?1:0);
		$.ajax({//Make the Ajax Request

		type: "POST",

		url: "./ajax_files/login.php",

		data: "email="+$("#login_email").val()+"&pass="+$("#login_pass").val()+"&remember="+$rememb,


		
		beforeSend:  function() {

		//$("#pre_load").show();
		//$('#pre_load').html('<img src="http://www.sociallyshoppablestyle.com/images/ajax-loader.gif" />');//Loading image during the Ajax Request
		

		},

		success: function(html){//html = the server response html code
        //$("#pre_load").hide();
		if( html==3 )
		{
			window.location.reload();
		}
		else if(html==1)
		{
			var options = {direction: 'left',distance: 5,times: 5};			
			$( "#login_email" ).effect( "shake", options , 100 );
			$("#login_email").css('color','red');
			$( "#login_pass" ).effect( "shake", options , 100 );
			$("#login_pass").css('color','red');
			return false;
		}
		
		

		
		}

		});
	}
	$('#email_id').keyup(function(){
		//if(this.)
                $(".input-email_id-error").removeClass("error");
		this.value = this.value.toLowerCase();
	});
	$('#conf_email').keyup(function(){
		this.value = this.value.toLowerCase();
	});
	
	function goto(id, t){	
		//animate to the div id.
		$(".popup-list").animate({"left": -($(id).position().left)}, 600);
	}

	/*End login function*/

/* Start - Validity Check */
function isvalid(strValidChars,strString)
{
	var strChar;
	var blnResult = true;
	if (strString.length == 0) return false;
		for (i = 0; i < strString.length && blnResult == true; i++)
		{
			strChar = strString.charAt(i);
			if(strValidChars.indexOf(strChar) == -1)
			{
				blnResult = false;
			}
		}
	return blnResult;
}

function isValidateEmail(emil_address){
	var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	return reg.test(emil_address);
}

function isValidatePhone(txtPhone) {
    var filter = /^[0-9-+]+$/;
	if( txtPhone.length == 10 )
	{
        return filter.test(txtPhone);
	}
	else
	{
		return false;
	}
}
/* End - Validity Check */



/* Start - Data Manupulation */
String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}

function linkGenerate(linkstr){
	var pattern = /(HTTP:\/\/|HTTPS:\/\/)([a-zA-Z0-9.\/&?_=!*,\(\)+-]+)/i;
	var replace = "<a href='$1$2' target='_blank'>$1$2</a>";
	linkstr = linkstr.replace(pattern,replace);
	linkstr = linkstr.replace(/&/g,'%26');
	return linkstr;
}

var sort_field="";
var sort_field_type="";
function sort_process(a,b){
	if(sort_field_type=="number")
		return a[sort_field] - b[sort_field];
	else
		return ((a[sort_field].toLowerCase() < b[sort_field].toLowerCase()) ? -1 : ((a[sort_field].toLowerCase() > b[sort_field].toLowerCase()) ? 1 : 0));
}
function sort_custom(arr,field,type,order){
	var order = (typeof(order)!=='undefined')?order:"asc";
	var type = (typeof(type)!=='undefined')?type:"text";
	sort_field=field;
	sort_field_type=type;
	arr.sort(sort_process);
	if(order=="desc")
		return arr.reverse();
	else
		return arr;
}

function fnattr_split(strattr){
	var arr_temp_attr=strattr.split('=');
	var arr_attr=new Array();
	var i, temp_rev, temp_pos_start, temp_pos_end, temp_attr, temp_attr_val;
	for(i=0;i<(arr_temp_attr.length-1);i++){
		temp_rev=arr_temp_attr[i].split('').reverse().join('');
		temp_pos_start=0;
		temp_pos_end=temp_rev.indexOf(' ');
		temp_attr=(temp_rev.substring(temp_pos_start,((temp_pos_end>=temp_pos_start)?temp_pos_end:(temp_rev.length)))).split('').reverse().join('');

		temp_rev=arr_temp_attr[i+1].split('').reverse().join('');
		temp_pos_start=temp_rev.indexOf(' ')+1;
		temp_pos_end=temp_rev.length;
		temp_attr_val=(temp_rev.substring((((i+1)<(arr_temp_attr.length-1))?temp_pos_start:0),temp_pos_end)).split('').reverse().join('');
		temp_attr_val=temp_attr_val.substring(1,temp_attr_val.length-1);

		arr_attr[temp_attr]=temp_attr_val;
	}
	return(arr_attr);
}

function fndate_rangeToarray(date_start,date_end){
	var temp_range = Array();
	var temp_From=new Date(date_start);
	var temp_To=new Date(date_end);
	for(i=temp_From, k=0;i<=temp_To;i=new Date(i.getTime()+86400000), k++){
		var old_date = i.getDate('dd');
		var old_month = i.getMonth('mm') + 1; //months are zero based
		var old_year = i.getFullYear('yyyy');
		var new_date = old_year+"-"+((old_month<10)?"0"+old_month:old_month)+"-"+((old_date<10)?"0"+old_date:old_date);
		temp_range[k]=new_date;
	}
	
	return temp_range;
}

function ReplaceInjection(str){
	if(typeof(str)=='string'){
		str = str.replace(/'/g,"%27");
		str = str.replace(/"/g,"%22");
		str = str.replace(/&/g,"%26");
	}
	return str;
}

function DecodeInjection(str){
	if(typeof(str)=='string'){
		str = str.replace(/%27/g,"'");
		str = str.replace(/%22/g,'"');
		str = str.replace(/%26/g,"&");
		str = str.replace(/</g,"&lt;");
		str = str.replace(/>/g,"&gt;");
	}
	return str;
}
/* End - Data Manupulation */

/* Start - View Manupulation */
function iframeResize(id){
    var newheight;
    var newwidth;

    if(document.getElementById){
        newheight=document.getElementById(id).contentWindow.document .body.scrollHeight;
        newwidth=document.getElementById(id).contentWindow.document .body.scrollWidth;
    }

    document.getElementById(id).height= (newheight) + "px";
    document.getElementById(id).width= (newwidth) + "px";
}
/* End - View Manupulation */

/* Start - Key stroke event */
function any_keystroke(evt)
{
    evt = evt || window.event;
    if ((evt.keyCode || evt.which || evt.charCode || 0)==13){
            return 'enter';
    }
    else if ((evt.keyCode || evt.which || evt.charCode || 0)==27){
            return 'escape';
    }
    else{
            return 'false';
    }
};
/* End - Key stroke event */

/* Start - Timezone */
function calculate_time_zone() {
    var rightNow = new Date();
    var jan1 = new Date(rightNow.getFullYear(), 0, 1, 0, 0, 0, 0);  // jan 1st
    var june1 = new Date(rightNow.getFullYear(), 6, 1, 0, 0, 0, 0); // june 1st
    var temp = jan1.toGMTString();
    var jan2 = new Date(temp.substring(0, temp.lastIndexOf(" ")-1));
    temp = june1.toGMTString();
    var june2 = new Date(temp.substring(0, temp.lastIndexOf(" ")-1));
    var std_time_offset = (jan1 - jan2) / (1000 * 60 * 60);
    var daylight_time_offset = (june1 - june2) / (1000 * 60 * 60);
    var dst;
    if (std_time_offset == daylight_time_offset) {
            dst = "0"; // daylight savings time is NOT observed
    } else {
            // positive is southern, negative is northern hemisphere
            var hemisphere = std_time_offset - daylight_time_offset;
            if (hemisphere >= 0)
                    std_time_offset = daylight_time_offset;
            dst = "1"; // daylight savings time is observed
    }
    var i;
    return(convertTimezone(std_time_offset)+","+dst);
}

function convertTimezone(value) {
    var hours = parseInt(value);
    value -= parseInt(value);
    value *= 60;
    var mins = parseInt(value);
    value -= parseInt(value);
    value *= 60;
    var secs = parseInt(value);
    var display_hours = hours;
    // handle GMT case (00:00)
    if (hours == 0) {
            display_hours = "00";
    } else if (hours > 0) {
            // add a plus sign and perhaps an extra 0
            display_hours = (hours < 10) ? "+0"+hours : "+"+hours;
    } else {
            // add an extra 0 if needed 
            display_hours = (hours > -10) ? "-0"+Math.abs(hours) : hours;
    }

    mins = (mins < 10) ? "0"+mins : mins;
    return display_hours+":"+mins;
}
/* End - Timezone */

/* Start - Cookie */
function setCookie(c_name,value,exdays)
{
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name)
{
    var i,x,y,ARRcookies=document.cookie.split(";");
    for(i=0;i<ARRcookies.length;i++){
            x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
            y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
            x=x.replace(/^\s+|\s+$/g,"");
            if(x==c_name)
                    return unescape(y);
    }
}
/* End - Cookie */


/* truncate  string */
String.prototype.trunc =
     function(n,useWordBoundary){
         var toLong = this.length>n,
             s_ = toLong ? this.substr(0,n-1) : this;
         s_ = useWordBoundary && toLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
         return  toLong ? s_ + '&hellip;' : s_;
      };
/* end truncate  string */

/* Single Product Image Carousel */


    
    var connector = function(itemNavigation, carouselStage) {
        return carouselStage.jcarousel('items').eq(itemNavigation.index());
    };

    $(function() {
        // Setup the carousels. Adjust the options for both carousels here.
        var carouselStage      = $('.carousel-stage').jcarousel();
        var carouselNavigation = $('.carousel-navigation').jcarousel();

        // We loop through the items of the navigation carousel and set it up
        // as a control for an item from the stage carousel.
        carouselNavigation.jcarousel('items').each(function() {
            var item = $(this);

            // This is where we actually connect to items.
            var target = connector(item, carouselStage);

            item
                .on('jcarouselcontrol:active', function() {
                    carouselNavigation.jcarousel('scrollIntoView', this);
                    item.addClass('active');
                })
                .on('jcarouselcontrol:inactive', function() {
                    item.removeClass('active');
                })
                .jcarouselControl({
                    target: target,
                    carousel: carouselStage
                });
        });

        // Setup controls for the stage carousel
        
        $('.prev-stage')
            .on('jcarouselcontrol:inactive', function() {
                $(this).addClass('inactive');
            })
            .on('jcarouselcontrol:active', function() {
                $(this).removeClass('inactive');
            })
            .jcarouselControl({
                target: '-=1'
            });

        $('.next-stage')
            .on('jcarouselcontrol:inactive', function() {
                $(this).addClass('inactive');
            })
            .on('jcarouselcontrol:active', function() {
                $(this).removeClass('inactive');
            })
            .jcarouselControl({
                target: '+=1'
            });
            

           


        // Setup controls for the navigation carousel
        $('.prev-navigation')
            .on('jcarouselcontrol:inactive', function() {
                $(this).addClass('inactive');
            })
            .on('jcarouselcontrol:active', function() {
                $(this).removeClass('inactive');
            })
            .jcarouselControl({
                target: '-=3'
            });

          

        $('.next-navigation')
            .on('jcarouselcontrol:inactive', function() {
                $(this).addClass('inactive');
            })
            .on('jcarouselcontrol:active', function() {
                $(this).removeClass('inactive');
            })
            .jcarouselControl({
                target: '+=3'
            });


            $('.prev-navigation-h')
            .on('jcarouselcontrol:inactive', function() {
                $(this).addClass('inactive');
            })
            .on('jcarouselcontrol:active', function() {
                $(this).removeClass('inactive');
            })
            .jcarouselControl({
                target: '-=4'
            });

          

        $('.next-navigation-h')
            .on('jcarouselcontrol:inactive', function() {
                $(this).addClass('inactive');
            })
            .on('jcarouselcontrol:active', function() {
                $(this).removeClass('inactive');
            })
            .jcarouselControl({
                target: '+=4'
            });
    });


$(function() {
	$('.recent_carousel').jcarousel({

	});
	$('.recent_carousel_prev').jcarouselControl({
		target: '-=1'
	});

	$('.recent_carousel_next').jcarouselControl({
		target: '+=1'
	});
});

$(function() {
	$('.recomended_slider').jcarousel({

	});
	$('.recomended_slider_prev').jcarouselControl({
		target: '-=1'
	});

	$('.recomended_slider_next').jcarouselControl({
		target: '+=1'
	});
});



$(function(){
    $('.nav-ul li.nav-li').each(function(e){
        $(this).width($(this).width()+46);
    })  
});


$(function(){
	//var limt_txt = 22;
	$('.jcarousel.blogspot').mouseover(function(){
		$('.top_social_fll').hide(200);
		$('.top_social_tiny').show(200);
		
		/*$('.top-header .top-header-left .blogspot').css('padding-top', '48px');
		$('.top-header .top-header-left .blogspot img').css('padding-left', '20px');*/
		//limt_txt = 50;
		//$('.top-header .top-header-left .blogspot p').show();
	});

	$('.jcarousel.blogspot').mouseleave(function(){
		//limt_txt = 22;
    	$('.top_social_tiny').hide(200);
		$('.top_social_fll').show(200);
    	//$('.blog-descr').hide();
			/*$('.top_social_tiny').css('padding-top', '0');*/
			/*$('.top_social_fll').fadeIn(400);*/
			/*$('.top-header .top-header-left .blogspot').css('padding-top', '14px');
			$('.top-header .top-header-left .blogspot img').css('padding-left', '0');*/
		});
		/* For Blog description header section */
		/*var blog_descr= $('.blog-title').text();
		if(blog_descr.length > limt_txt)
	    	$('.blog-title').text(blog_descr.substring(0,limt_txt) + '....');*/
		/* For Blog description header section */
});









$('.box-carousel-title').mouseover(function() {
        $('.box-carousel-popup').fadeIn(400);
    });
    $('.box-carousel-title').mouseleave(function() {
        $('.box-carousel-popup').fadeOut(300);
    });

    $('.top_show_flag').mouseover(function() {
        $('.top_hide_flag').fadeIn(400);
    });
    $('.top_show_flag').mouseleave(function() {
        $('.top_hide_flag').fadeOut(300);
    });

    $('.icon-logo-small').mouseover(function() {
        $('.share_popup').fadeIn(400);
    });
    $('.footer').mouseleave(function() {
        $('.share_popup').fadeOut(300);
    });

    $('.jcarousel').hover(function() {
        $(this).jcarouselAutoscroll('stop');
    }, function() {
        $(this).jcarouselAutoscroll('start');
    });



	$('h3.account-info').click(function() {
        $('.acc_div_hide').show();
        $('.after_clk_noti').hide();
    });

    $('.acc_div_hide').mouseleave(function() {
        $('.acc_div_hide').fadeOut(400);
        $('.after_clk_noti').show();
    });
   
		

/************************************************** For Search Funtionality ******************************************/
$('.s_select_stores').click(function(){
	$('ul.search-category-list > li').removeClass('active last');
	$('ul.search-category-list > li i').removeClass('icon-search-arrow-down');
	$(this).closest('li').addClass('active last');
	$(this).closest('li').find('i').addClass('icon-search-arrow-down');
	//$('ul.search-category-list > li > .s_select_stores').addClass('active last');
	$('.search-result-right').hide();
	$('.s_stores').fadeIn('500');
})

$('.s_select_categories').click(function(){
	$('ul.search-category-list > li').removeClass('active last');
	$('ul.search-category-list > li i').removeClass('icon-search-arrow-down');
	$(this).closest('li').addClass('active last');
	$(this).closest('li').find('i').addClass('icon-search-arrow-down');
	$('.search-result-right').hide();
	$('.s_categories').fadeIn('500');
})

$('.s_select_designer').click(function(){
	$('ul.search-category-list > li').removeClass('active last');
	$('ul.search-category-list > li i').removeClass('icon-search-arrow-down');
	$(this).closest('li').addClass('active last');
	$(this).closest('li').find('i').addClass('icon-search-arrow-down');
	$('.search-result-right').hide();
	$('.s_designer').fadeIn('500');
})

$('.s_all_products').click(function(){
	$('ul.search-category-list > li').removeClass('active last');
	$('ul.search-category-list > li i').removeClass('icon-search-arrow-down');
	$(this).closest('li').addClass('active last');
	$(this).closest('li').find('i').addClass('icon-search-arrow-down');
	$('.search-result-right').hide();
	// $('.s_designer').fadeIn('500');
})

//$(icon-checkbox-unchecked)
//var my_val = $("input[name='checkbox-subcribe']").value();
// var myCurrentSelection = "";

// $('.icon-checkbox-with-checked').each(function(){
//   myCurrentSelection += $(this).parent().parent().find('.checkbox-wrapper').html() + "<br>";
// })



 //$('#my_current_selection').html(my_val);

/************************************************** For Search Funtionality ******************************************/


/* For Social Account */

$('.social_icons ul li > .ss-button').click(function(event) {
	$('.iil-expend-p').removeClass('iil-expend-p');
	$('.iil-expend').removeClass('iil-expend');
	$(this).addClass('iil-expend-p');
	$(this).find('.icon-socially-shoppable-large').addClass('iil-expend');
	$('.following-social .social-form').hide();
	$('.s_icn_tb').hide();
	$('.s_icn_tb.sslgo').show();
	
});


$('.social_icons ul li > .fb-button').click(function(event) {
	$('.iil-expend-p').removeClass('iil-expend-p');
	$('.iil-expend').removeClass('iil-expend');
	$(this).addClass('iil-expend-p');
	$(this).find('.icon-fb-large').addClass('iil-expend');
	$('.following-social .social-form').hide();
	$('.s_icn_tb').hide();
	$('.s_icn_tb.tfb').show();
	$('.social-form.fb-form').show();
});
$('.social_icons ul li > .twitter-button').click(function(event) {
	$('.iil-expend-p').removeClass('iil-expend-p');
	$('.iil-expend').removeClass('iil-expend');
	$(this).addClass('iil-expend-p');
	$(this).find('.icon-twitter-large').addClass('iil-expend');
	$('.following-social .social-form').hide();
	$('.s_icn_tb').hide();
	$('.s_icn_tb.ttwiter').show();
	$('.social-form.twitter-form').show();
});
$('.social_icons ul li > .email-button').click(function(event) {
	$('.iil-expend-p').removeClass('iil-expend-p');
	$('.iil-expend').removeClass('iil-expend');
	$(this).addClass('iil-expend-p');
	$(this).find('.icon-email-large').addClass('iil-expend');
	$('.following-social .social-form').hide();
	$('.s_icn_tb').hide();
	$('.s_icn_tb.temail').show();
	$('.social-form.email-form').show();
});
$('.social_icons ul li > .invite-button').click(function(event) {
	$('.iil-expend-p').removeClass('iil-expend-p');
	$('.iil-expend').removeClass('iil-expend');
	$(this).addClass('iil-expend-p');
	$(this).find('.icon-invite-large').addClass('iil-expend');
	$('.following-social .social-form').hide();
	$('.s_icn_tb').hide();
	$('.s_icn_tb.tinvite').show();
	$('.social-form.invite-form').show();
});


/* For Social Account */

 /* For UPload Photo Pupup */

$('.pp_share_cont_det .upload_photo').click(function(event) {

	$('.upload_picture_popup').toggle();
	
});

 /* For UPload Photo Pupup */

	
	
/************************************************ This script for Homepage Slider **************************/
(function($) {
    var hConnector = function(itemNavigation, carouselStage) {
        return carouselStage.jcarousel('items').eq(itemNavigation.index());
    };
    $(function() {
        // Setup the carousels. Adjust the options for both carousels here.
        $('.carousel-stage').hover(function() {
    $(this).jcarouselAutoscroll('stop');
}, function() {
    $(this).jcarouselAutoscroll('start');
});
		$('.carousel-stage').on('jcarousel:create jcarousel:reload', function() {
        var element = $(this),
            width = element.innerWidth();

       

        element.jcarousel('items').css('width', width + 'px');
    }).jcarousel({
            wrap: 'circular'
        }).jcarouselAutoscroll({
                    interval: 6000,
                    target: '+=1',
                    autostart: true
                });
				
				
        var carouselStage = $('.carousel-stage').jcarousel();
        var carouselNavigation = $('.carousel-navigation').jcarousel();
        // We loop through the items of the navigation carousel and set it up
        // as a control for an item from the stage carousel.
        carouselNavigation.jcarousel('items').each(function() {
            var item = $(this);
            // This is where we actually connect to items.
            var target = hConnector(item, carouselStage);
            item.on('jcarouselcontrol:active', function() {
                carouselNavigation.jcarousel(
                    'scrollIntoView', this);
                item.addClass('active');
            }).on('jcarouselcontrol:inactive', function() {
                item.removeClass('active');
            }).jcarouselControl({
                target: target,
                carousel: carouselStage
            });
        });
        // Setup controls for the stage carousel
        $('.prev-stage').on('jcarouselcontrol:inactive', function() {
            $(this).addClass('inactive');
        }).on('jcarouselcontrol:active', function() {
            $(this).removeClass('inactive');
        }).jcarouselControl({
            target: '-=1'
        });
        $('.next-stage').on('jcarouselcontrol:inactive', function() {
            $(this).addClass('inactive');
        }).on('jcarouselcontrol:active', function() {
            $(this).removeClass('inactive');
        }).jcarouselControl({
            target: '+=1'
        });
        // Setup controls for the navigation carousel
        $('.prev-navigation').on('jcarouselcontrol:inactive',
            function() {
                $(this).addClass('inactive');
            }).on('jcarouselcontrol:active', function() {
            $(this).removeClass('inactive');
        }).jcarouselControl({
            target: '-=3'
        });
        $('.next-navigation').on('jcarouselcontrol:inactive',
            function() {
                $(this).addClass('inactive');
            }).on('jcarouselcontrol:active', function() {
            $(this).removeClass('inactive');
        }).jcarouselControl({
            target: '+=3'
        });
    });
})(jQuery);


/* For Sale Alert Hover */
$('.icn_all.sale_alert').mouseover(function() {
        $('.box-carousel-popup').fadeIn(400);
    });
    $('.box-carousel-popup').mouseleave(function() {
        $('.box-carousel-popup').fadeOut(300);
    });