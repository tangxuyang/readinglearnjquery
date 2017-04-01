QUnit.module("attributes",{
	before:function(){},
	after:function(){},
	beforeEach:function(){},
	afterEach:function(){}
});



/*
	url: http://api.jquery.com/category/attributes/	
*/

QUnit.test("addClass method",function(assert){
	/*
		给元素添加class
		1) 类名字符串
			可以是单个类，也可是以空格分割的多个类，比如
			class1
			class2 class3		
		2) 函数
			(index,className)
			选择符中的元素会依次执行
	*/
	assert.expect(3);
	
	
	$('#qunit-fixture').addClass('class1 class2');
	assert.strictEqual($('#qunit-fixture')[0].className,"class1 class2","qunit-fixture添加了class1 class2");
	
	$('#qunit-fixture').append('<p class="class1">hello</p>').append('<p class="class2">hello</p>');
	$('#qunit-fixture p').addClass(function(index,className){
		return className + " " + index+"-"+className;
	});
	assert.strictEqual($('#qunit-fixture p:eq(0)')[0].className,"class1 0-class1","第一个p的类是class1 0-class1");
	assert.strictEqual($('#qunit-fixture p:eq(1)')[0].className,"class2 1-class2","第二个p的类是class2 1-class2");
	
	
});


QUnit.test("attr method",function(assert){
	/*
		获取第一个选中元素的属性
		设置所有选中元素的属性
			1)attrName,value
			2){attrName:value,....}
			3)attrName,function(index,attrValue)
	*/
	assert.expect(5);
	
	$('#qunit-fixture').attr('title','hello');
	assert.strictEqual($('#qunit-fixture').attr('title'),'hello',"qunit-fixture title attribute is set hello");
	
	$('#qunit-fixture').attr({
		title:"world",
		alt:"hello"
	});
	assert.strictEqual($('#qunit-fixture').attr('title'),"world","qunit-fixture title attribute is set world");
	assert.strictEqual($('#qunit-fixture').attr('alt'),"hello","qunit-fixture alt attribute is set hello");
	
	
	
	$('#qunit-fixture').append("<p title='hello'>hello</p>").append("<p title='world'>world</p>");
	$('#qunit-fixture p').attr('title',function(index,attr){
		return attr + "-"+index;
	});
	assert.strictEqual($('#qunit-fixture p:eq(0)').attr('title'),"hello-0","第一个p的title是hello-0");
	assert.strictEqual($('#qunit-fixture p:eq(1)').attr('title'),"world-1","第二个p的title是world-1");
	
	
});


QUnit.test("hasClass method",function(assert){
	/*
		判断元素是否具有指定的类名
	*/
	
	assert.expect(2);
	
	$('#qunit-fixture').append("<p class='class1'>Hello</p>").append("<p class='class2'>world</p>");
	
	assert.ok($('#qunit-fixture p:eq(0)').hasClass('class1'),"第一个p具有class1的类");
	
	//这是我没有想到的，我以为只有选中的元素都具有了指定类才会返回true，结果却是只要有一个选中元素具有这个类就会返回true
	assert.ok($('#qunit-fixture p').hasClass('class1'),"选中元素是多个的话，只要有一个有class1，就会返回true");
	
});


QUnit.test("html method",function(assert){
	assert.expect(2);
	$('#qunit-fixture').append('<p>hell world</p>');
	assert.strictEqual($('#qunit-fixture').html(),"<p>hell world</p>","html获取元素内的html内容");
	
	$('#qunit-fixture').html("<span>haha</span>");
	assert.strictEqual($('#qunit-fixture').html(),"<span>haha</span>","html修改了元素内的html内容");
	
});