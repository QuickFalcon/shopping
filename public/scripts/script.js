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