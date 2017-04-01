jQuery的功能通过两种形式提供：  
	1.jQuery对象的实例方法 $.fn.xxx
		所有操作都是先用选择操作选中元素，然后再调用方法。
		$.fn === $.prototype
	2.jQuery的方法 $.xxx
		直接调用jQuery上的方法。