define( function() {
	"use strict";

	// Only count HTML whitespace
	// Other whitespace should count in values
	// https://html.spec.whatwg.org/multipage/infrastructure.html#space-character
	return ( /[^\x20\t\r\n\f]+/g );
} );


/*
这个文件的名字是rnothtmlwhite.js，之所以以r开头应该是想告诉我们它返回的是一个正则(reg)吧。

*/
