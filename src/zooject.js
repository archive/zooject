(function (context) {

	var Zooject = function () {
		this._repository = {};
	};

	var z = Zooject.prototype;

	z.register = function (className, TheClass) {
		this._register(className, TheClass, false);
	};

	z.registerSingleton = function (className, TheClass) {
		this._register(className, TheClass, true);
	};

	z._register = function function_name (className, TheClass, singleton) {
		dependencyName = this._formatDependencyName(className);
		this._repository[dependencyName] = {
			'TheClass': TheClass,
			'singleton' : singleton,
			'singletonInstance': null
		};
	};

	z._formatDependencyName = function (className) {
		return className.charAt(0).toLowerCase() + className.slice(1);
	};

	z.resolve = function (classNameOrClass) {
		if (typeof classNameOrClass === 'string') {
			var dependencyName = this._formatDependencyName(classNameOrClass);
			return this._resolveByDependencyName(dependencyName);
		}
		var TheClass = classNameOrClass;
		return this._resolveByClass(TheClass);
	};

	z._resolveByDependencyName = function (dependencyName) {
		var TheClass = this._repository[dependencyName].TheClass;
		return this._resolveByClass(TheClass);
	};

	z._resolveByClass = function (TheClass) {
		var dependencies = this._resolveDependencies(TheClass);
		return this._instantiate(TheClass, dependencies);
	};

	z._resolveDependencies = function (TheClass) {
		var dependencyNames = this._getDependencies(TheClass);
		var dependencies = [];
		Array.prototype.forEach.call(dependencyNames, function eachArgument (dependencyName) {
			var dependency = {};

			var dependencyItem = this._repository[dependencyName];
			if (dependencyItem.singleton) {
				
				if (dependencyItem.singletonInstance) {
					dependency = dependencyItem.singletonInstance;
				} else {
					dependency = this.resolve(dependencyName);
					dependencyItem.singletonInstance = dependency;
				}

			} else {
				dependency = this.resolve(dependencyName);
			}

			dependencies.push(dependency);
		}.bind(this));	
		return dependencies;
	};

	z._instantiate = function (TheClass, dep) {
		// http://jsperf.com/apply-vs-call-vs-invoke
		var instance = {};
		switch (TheClass.length) {
			case 0: instance = new TheClass(); break;
			case 1: instance = new TheClass(dep[0]); break;
			case 2: instance = new TheClass(dep[0], dep[1]); break;
			case 3: instance = new TheClass(dep[0], dep[1], dep[2]); break;
			case 4: instance = new TheClass(dep[0], dep[1], dep[2], dep[3]); break;
			case 5: instance = new TheClass(dep[0], dep[1], dep[2], dep[3], dep[4]); break;
			case 6: instance = new TheClass(dep[0], dep[1], dep[2], dep[3], dep[4], dep[5]); break;
			case 7: instance = new TheClass(dep[0], dep[1], dep[2], dep[3], dep[4], dep[5], dep[6]); break;
			case 8: instance = new TheClass(dep[0], dep[1], dep[2], dep[3], dep[4], dep[5], dep[6], dep[7]); break;
			case 9: instance = new TheClass(dep[0], dep[1], dep[2], dep[3], dep[4], dep[5], dep[6], dep[7], dep[8]); break;
			default: throw 'You have more than 9 dependencies, you must be crazy';
		}
		return instance;
	};

	z._getDependencies = function (TheClass) {
		var argsRegexp = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
		var argsString = TheClass.toString().match(argsRegexp)[1];
		return argsString ? argsString.split(',') : [];
	};

	context.Zooject = Zooject;

	// possibility to resolve container?

})(window); // add exports || window for none browser env