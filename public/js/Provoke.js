(function() {
							this.Porvogue = function(){
								
								var p = io;
								var w = window;
								var l = w.location;
								var defaults =  {
									u : '',
									id : '',
									url : 'http://localhost:3000',
									a : '',
									r : ''
								};
								if (arguments[0] && typeof arguments[0] === "object") {
									  this.options = extendDefaults(defaults, arguments[0]);
									}
								var _that = this;
								this.options.s = p.connect(this.options.url);
								
								this.options.s.on('connect', function(){
									_that.options.s.emit('adduser', _that.options.u,_that.options.v,2);
								});
								_that.options.s.on('initView', function (target,data){
									if(target=='/#'+_that.options.s.id){
									 _that.options.a(data);
									}	
								});	
								this.record();
								this.remove();
							}
							
							function extendDefaults(source, properties) {
								var property;
								for (property in properties) {
								  if (properties.hasOwnProperty(property)) {
									source[property] = properties[property];
								  }
								}
								return source;
							  }
							
							Porvogue.prototype.record = function(){
								console.log('-----Recording-----');
								var _that = this;
								_that.options.s.on('newrecord', function (data){
									 console.log(data);
									_that.options.a(data);
								});	
							}
							Porvogue.prototype.remove = function(){
								console.log('-----Removing Too-----');
								var _that = this;
								_that.options.s.on('removerecord', function (id){
									 console.log(id);
									_that.options.r(id);
								});	
							}
							
						}());