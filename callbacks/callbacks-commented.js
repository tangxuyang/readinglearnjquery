define( [
	"./core",
	"./var/rnothtmlwhite"
], function( jQuery, rnothtmlwhite ) {

"use strict";

// Convert String-formatted options into Object-formatted ones
/*
	1.options是字符串
	2.以空格拆分options
	3.拆分结果是一个数组，以该数组中的元素值为key，value为TRUE创建一个键值对对象
	
	这个方式挺巧妙的，不过同样，它的用途也很有限，只能是值为布尔类型的时候才能这样做，否则就老老实实的用对象吧！
*/
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = options.once;//如果配置是只执行一次，那么直接锁定，下次就不会执行了，以为Callbacks中的fireWith是先判断locked的

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {
						//只会终止当前数据在回调函数列表中的执行，后续的执行数据还是会被执行的！！
						
						// Jump to end and forget the data so .add doesn't re-fire
						//当前执行数据不会再被后续的回调函数执行了，while会跳出，进入下次for
						firingIndex = list.length;
//						memory = false;//不太明白此处的用意！！？
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {//配置中不要求memory，所以不记录最后一次执行数据
				memory = false;
			}
			
			/*
			总结一下memroy被置为false的情况
			1.配置中options.memory为false
			2.回调执行过程中有回调函数返回了false并且配置中options.stopOnFalse配置了true

			memory被置为false后，会有以下影响：
			1.
			2.
			*/

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {//只执行一次

				// Keep an empty list if we have data for future add calls
				if ( memory ) {//配置中没有配memory为flase，并且回调过程中没有返回FALSE且配置中没有stopOnFalse（TRUE）
					list = [];//清空回调列表

				// Otherwise, this object is spent
				} else {
					list = "";//置为disabled
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				/*
					list有两种值——空串和数组
					空串被用来标志disabled状态
				*/
				if ( list ) {//diabled的回调列表对象不能添加回调函数了

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );//删除index处的回调函数

						// Handle firing indexes
						if ( index <= firingIndex ) {//调整firingIndex
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				/*
				判断回调列表中是否存在fn,如果fn没传值，就判断回调列表中是否有回调函数
				*/
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {//list可能是空串（disabled的时候），这里的判断就是为了这个。
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				/*
				list被置为空串，后续用它来判断是否disabled。
				
				同时清空执行数据队列。都disabled了，还要执行数据干啥呢？
				同样的也清空了最后一次执行数据对象，置为空串了。
				
				disabled的回调列表对象被认为是锁定的。想来也正常！
				*/
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				/*
				list有两种类型的值——空串和数组
				
				在调用disable时会把list置为空串。
				list使用这两种不同的类型来隐式地标志当前回调列表是不是disabled的，这样节省了一个变量。
				
				不过在我看来这样会把看代码的人看糊涂的。虽然js是动态类型的语言，但是我们还是希望一个变量从始至终只有一种类型！！
				*/
				return !list;//disable时会把list置为空串
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				/*
				locked应该是布尔值，没事你赋值[]干啥，有病呀！！
				这种方法是可行的
				
				置locked为true，清空执行数据队列数组
				
				如果没有调用过fire方法，momery就是undefined，此时调用lock方法，就会变成disabled!!不论options中的memory是true还是false！！！
				*/
				locked = queue = [];
				if ( !memory && !firing ) {//咋就搞成了disabled了？？
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				/*
				因为locked会是[],所以只能两次取反，转换成布尔值。
				*/
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {//没有锁定才触发
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];//保证第二个元素是数组，数组才具有slice方法
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};

return jQuery;
} );
