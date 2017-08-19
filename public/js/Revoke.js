(function() {
							this.Revoke = function(){
								
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
									_that.options.s.emit('adduser', _that.options.u,_that.options.u,1);
								});
								_that.options.s.on('initCustomerView', function (target,data){
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
							
							Revoke.prototype.record = function(){
								var _that = this;
								_that.options.s.on('newSession', function (data,user){
									if(user==_that.options.u)
									{
									_that.options.a(data);	
									}
									
								});	
							}
							Revoke.prototype.remove = function(){
								var _that = this;
								_that.options.s.on('removeSession', function (id){
									_that.options.r(id);
								});	
							}
							Revoke.prototype.closeSession = function(data){
								 var _that = this;
								_that.options.s.emit('endsession',_that.options.u,data);	
							}
							
						}());