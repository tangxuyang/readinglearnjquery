jQuery使用$作为jQuery的别名。我们已经习惯了。不过$也会被别的库用做关键字。那么如果同一个项目中使用了别的以$为关键字的库，咋办呢？真是很尴尬呀！！  
jQuery提供了解决冲突的方法。有以下几种方式可以选：  
1.调用$.noConflict()重新选一个关键字为jQuery
	var $$ = $.noConflict();
	实现机制其实很简单，jQuery库在占用$是会先把之前$的内容保存起来，如果我们调用了noConflict方法，它就会把原先的$内容重新赋值给$。这样$就回到了原来的库的控制了。
	
2.使用jQuery代替$
3.使用IIFE
+function($){
.....
}(jQuery);
此时方法体中的$只能是jQuery.
4.ready函数参数
jQuery(document).ready(function($){
.....
});

以上内容都是，你先引入了别的库，再引入jQuery。如果jQuery在前的话，解决冲突的责任就不在jQuery了。要另外一个库提供了。不过我觉得实现方式也无外乎上面就介绍的。
