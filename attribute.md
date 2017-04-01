## attr
jQuery使用.attr来获取元素的属性，设置元素的属性。jQuery中好多方法都是这样，getter和setter是同一个。根据传递的值得数量来区分是setter还是getter。  
.attr(),没有参数，就是getter  
.attr(key,value)就是setter  
还可以写成
```
.attr({
	key1:value1,
	key2:value2
})
```来批量设置属性