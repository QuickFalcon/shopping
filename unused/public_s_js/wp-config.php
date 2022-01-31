<?php
# Database Configuration
define( 'DB_NAME', 'wp_ssstyle' );
define( 'DB_USER', 'ssstyle' );
define( 'DB_PASSWORD', 'EPxmMM5j1AW15U8l' );
define( 'DB_HOST', '127.0.0.1' );
define( 'DB_HOST_SLAVE', '127.0.0.1' );
define( 'DB_CHARSET', 'utf8' );
define( 'DB_COLLATE', 'utf8_unicode_ci' );
$table_prefix = 'wp_';



# Security Salts, Keys, Etc
define( 'AUTH_KEY', '@]L&0]!F6/Kp5A;( s2F&QJmxSarDK^.oqZ#5<|%l_)tH9,(]k?A;*z+V_NI9XVz' );
define( 'SECURE_AUTH_KEY', 'UlGlQx<Xd{m,`t&tP=^ba5-Qslt{m8dTr[,0%y|90 Vh)EwNGnNS=6p489ct7)qG' );
define( 'LOGGED_IN_KEY', '3Zw]Jw|&MR@>,9hj%#-Gh&0@7h%Fwnh`Tlo%er3Ds[<),amO:LPm)by3y =-Ct&]' );
define( 'NONCE_KEY', 'ZeVg*8)fl-v*d`lWzK,;^LzVa{~TN6nb&x{Dnp;c-mF ,*bR$D|qNbCW-ALPD}4+' );
define( 'AUTH_SALT', 'G"Mi%ri)Uqj}R0vsjqPI^(>G6jv~Ws-Hjt/sE1U}mOtJ/()yk+q22b8hSS{0z]([' );
define( 'SECURE_AUTH_SALT', 'b0rP_b?;bW<xoRAGU;i(=<DE8W/8NO5d<@5O$](S}.FRa]bDo9bMX!q[/KNn-!"3' );
define( 'LOGGED_IN_SALT', '8Fj*8?G>X/^scT{([<iw%a*tljR,wJK9=24wNCy@l|2o,K1m+t/y=,>Koi305Lti' );
define( 'NONCE_SALT', 'L3LPa_4yKt]f9g!?[q2oM`FXZLr"9U428mxQ}|ZB/}5B"R`7sPNiU!< Q[N{D@R~' );



# Localized Language Stuff

define( 'WP_CACHE', TRUE );

define( 'WP_AUTO_UPDATE_CORE', false );

define( 'PWP_NAME', 'ssstyle' );

define( 'FS_METHOD', 'direct' );

define( 'FS_CHMOD_DIR', 0775 );

define( 'FS_CHMOD_FILE', 0664 );

define( 'PWP_ROOT_DIR', '/nas/wp' );

define( 'WPE_APIKEY', '3088ea9cbb2e958d37cf64d417b75c6701c56dcd' );

define( 'WPE_FOOTER_HTML', "" );

define( 'WPE_CLUSTER_ID', '33611' );

define( 'WPE_CLUSTER_TYPE', 'pod' );

define( 'WPE_ISP', true );

define( 'WPE_BPOD', false );

define( 'WPE_RO_FILESYSTEM', false );

define( 'WPE_LARGEFS_BUCKET', 'largefs.wpengine' );

define( 'WPE_SFTP_PORT', 2222 );

define( 'WPE_LBMASTER_IP', '' );

define( 'WPE_CDN_DISABLE_ALLOWED', false );

define( 'DISALLOW_FILE_EDIT', FALSE );

define( 'DISALLOW_FILE_MODS', FALSE );

define( 'DISABLE_WP_CRON', false );

define( 'WPE_FORCE_SSL_LOGIN', false );

define( 'FORCE_SSL_LOGIN', false );

/*SSLSTART*/ if ( isset($_SERVER['HTTP_X_WPE_SSL']) && $_SERVER['HTTP_X_WPE_SSL'] ) $_SERVER['HTTPS'] = 'on'; /*SSLEND*/

define( 'WPE_EXTERNAL_URL', false );

define( 'WP_POST_REVISIONS', FALSE );

define( 'WPE_WHITELABEL', 'wpengine' );

define( 'WP_TURN_OFF_ADMIN_BAR', false );

define( 'WPE_BETA_TESTER', false );

umask(0002);

$wpe_cdn_uris=array ( );

$wpe_no_cdn_uris=array ( );

$wpe_content_regexs=array ( );

$wpe_all_domains=array ( 0 => 'sociallyshoppable.com', 1 => 'ssstyle.wpengine.com', 2 => 'www.sociallyshoppable.com', );

$wpe_varnish_servers=array ( 0 => 'pod-33611', );

$wpe_special_ips=array ( 0 => '104.239.231.91', );

$wpe_ec_servers=array ( );

$wpe_largefs=array ( );

$wpe_netdna_domains=array ( 1 =>  array ( 'match' => 'www.sociallyshoppable.com', 'secure' => false, 'dns_check' => '0', 'zone' => '1vecu54z7v31hwj84nkmm0ac', ), );

$wpe_netdna_domains_secure=array ( );

$wpe_netdna_push_domains=array ( );

$wpe_domain_mappings=array ( );

$memcached_servers=array ( );
define( 'WPLANG', '' );



# WP Engine Settings
































/*SSLSTART*/
if ( isset( $_SERVER['HTTP_X_WPE_SSL'] ) && $_SERVER['HTTP_X_WPE_SSL'] ) $_SERVER['HTTPS'] = 'on';
/*SSLEND*/



# Custom Settings












$_wpe_preamble_path = null;



# That's It. Pencils down
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', dirname(__FILE__) . '/' );
}
require_once( ABSPATH . 'wp-settings.php' );

$_wpe_preamble_path = null; if(false){}
