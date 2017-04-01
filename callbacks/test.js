QUnit.module("Callbacks",{
	before:function(){
		this.foo = function(){};
		this.bar = function(){};
		this.baz = function(){};
	},
	after:function(){
		delete this.foo;
		delete this.bar;
		delete this.baz;
	},
	beforeEach:function(){
		this.callbacks = $.Callbacks();
	},
	afterEach:function(){
		delete this.callbacks;
	}			 
});
/*
	用来管理回调列表的回调列表对象
	方法：
	## add
		add把方法加入到回调列表中。可接收的参数格式，我好想总结一下，可是我竟然不能用语言说明白！或许这就是jQuery的强大吧！！
		说下实现思路：
		jQuery.each遍历方法参数列表arguments,对每一个参数判断是否function，如果是则加入回调列表，如果是非string类型，则递归调用add方法。从这个实现中国我看到了添加回调函数的强大之处。
		1)foo
		2)foo,bar,baz
		3)[foo,bar,baz]
		4) {foo,bar,baz}
		5) [foo,{bar,baz}]
		6) {foo,[bar,{baz}]}
		.....
	
	## remove
		把函数从回调列表中删除。只有具名的函数才能删除，如果你加进去的是匿名函数，没办法删除的！！
		它能接收的参数就相对简单点，fn...
	fire
		调用回调列表中的函数
	
	fireWith
		调用回调列表中的函数，可传入context，绑定this
	has
		1)参数中的函数是否在回调列表中
		2)空参数，回调列表是否有函数		
	empty
		清空回调列表
	lock
		锁定
	disable
		
	locked
	
	disabled
	
	fired
		是否调用过
		
		
	disabled的一定是locked。locked不一定是disabled的。
*/


QUnit.test("增加单个方法",function(assert){
	/*
	
	*/
	var callbacks = this.callbacks;
	//#0 
	assert.notOk(callbacks.has(),"没有函数");
	var foo = this.foo;
	
	//#1. 添加单个方法	
	callbacks.add(foo);
	assert.ok(callbacks.has(),"回调列表中有回调函数");
	assert.ok(callbacks.has(foo),"回调列表中有回调函数foo");
	
	
	//#2. 移除回调函数
	callbacks.remove(foo);
	assert.notOk(callbacks.has(foo),"foo被从回调函数列表中移除了");
	
});

QUnit.test("增加多个方法",function(assert){
	var callbacks = this.callbacks;
	var foo = this.foo, bar = this.bar, baz = this.baz;
	
	//#0
	assert.notOk(callbacks.has(),"没有函数");
	
	
	//#1
	callbacks.add(foo,bar,baz);
	assert.ok(callbacks.has(foo),"回调列表中有回调函数foo");
	assert.ok(callbacks.has(bar),"回调列表中有回调函数bar");
	assert.ok(callbacks.has(baz),"回调列表中有回调函数baz");
	
	
	//#2 错误的删除方式
	callbacks.remove([foo,bar,baz]);
	assert.ok(callbacks.has(foo),"foo没被删掉");
	assert.ok(callbacks.has(bar),"bar没被删掉");
	assert.ok(callbacks.has(baz),"baz没被删掉");
	
	//#3 删除
	callbacks.remove(foo);
	assert.notOk(callbacks.has(foo),"foo被删掉了");
	assert.ok(callbacks.has(bar),"bar还在");
	assert.ok(callbacks.has(baz),"baz还在");
	
	callbacks.remove(bar,baz);
	assert.notOk(callbacks.has(bar),"bar被删掉了");
	assert.notOk(callbacks.has(baz),"baz被删掉了");
});

QUnit.test("触发方法",function(assert){
	var callbacks = this.callbacks;
	
	var str = "";
	callbacks.add(function(){
		str = "hello ";
	});
	callbacks.add(function(){
		str += "world"
	});

	callbacks.fire();
	
	assert.equal(str,"hello world","多个方法被依次调用");
	
});

QUnit.test("锁定回调列表",function(assert){
	var callbacks = this.callbacks;
	var foo = this.foo;
	var bar = this.bar;
	var baz = this.baz;
	
	callbacks.add(foo,bar);
	callbacks.fire();
	callbacks.lock();
	assert.notOk(callbacks.has(),"没有memory的回调函数列表调用lock方法，列表被清空了");
	assert.ok(callbacks.locked(),"没有memory的回调函数列表调用lock方法，变成了locked状态");
	assert.ok(callbacks.disabled(),"没有memory的回调函数列表调用lock方法，变成了disabled状态");
	
	callbacks = $.Callbacks({memory:true});
	callbacks.add(foo,bar);
	callbacks.fire();
	callbacks.lock();
	assert.ok(callbacks.has(),"有memory的回调函数列表调用lock方法，列表没有被清空了");
	assert.ok(callbacks.locked(),"有memory的回调函数列表调用lock方法，变成了locked状态");
	assert.notOk(callbacks.disabled(),"有memory的回调函数列表调用lock方法，没有变成了disabled状态");

});