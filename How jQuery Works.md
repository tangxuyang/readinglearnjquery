jQuery使用起来很简单，只需要在页面上引入jQuery.js就可以了。
jQuery提供了ready方法，让我们在页面dom加载完成后做一些事情。而不需要像以前一样使用onload事件。onload和ready还是有些许不同的。ready是在dom加载完成后触发的，而onload是页面内容加载完成后触发的。

```
$(document).ready(function(){
....
});

$().ready(function(){

	...
});

$(function(){

	....
});
```



添加/移除class  
addClass/removeClass

hide/show  
fadeOut/fadeIn
slideUp/slideDown

