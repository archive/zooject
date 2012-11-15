describe('Zooject specifications', function () {
	
	describe('with a registered dependency', function () {

		it('should be able to resolve by class name', function () {
			var zooject = new Zooject();
			var TheDependency = function () {};
			var TheClass = function (theDependency) {
				this.theDependency = theDependency;
			};

			zooject.register('TheDependency', TheDependency);
			zooject.register('TheClass', TheClass);

			var theClass = zooject.resolve('TheClass');

			expect(theClass.theDependency).toBeDefined();
		});

		it('should be able to resolve by class', function () {
			var zooject = new Zooject();
			var TheDependency = function () {};
			var TheClass = function (theDependency) {
				this.theDependency = theDependency;
			};

			zooject.register('TheDependency', TheDependency);

			var theClass = zooject.resolve(TheClass);

			expect(theClass.theDependency).toBeDefined();
		});

		it('should be able to resolve by anonymous function', function () {
			var zooject = new Zooject();
			var TheDependency = function () {};

			zooject.register('TheDependency', TheDependency);

			var theClass = zooject.resolve(function (theDependency) {
				this.theDependency = theDependency;
			});

			expect(theClass.theDependency).toBeDefined();
		});		

		it('should be able to resolve complex structures', function () {
			var zooject = new Zooject();
			var TheDependencyA = function () {};
			var TheDependencyB = function (theDependencyA) {
				this.theDependencyA = theDependencyA;
			};
			var TheClass = function (theDependencyB) {
				this.theDependencyB = theDependencyB;
			};

			zooject.register('TheDependencyA', TheDependencyA);
			zooject.register('TheDependencyB', TheDependencyB);

			var theClass = zooject.resolve(TheClass);

			expect(theClass.theDependencyB.theDependencyA).toBeDefined();
		});

		describe('singleton resolve', function () {

			it('should be a new object resolved', function () {
				var zooject = new Zooject();
				var TheDependency = function () {};

				zooject.registerSingleton('TheDependency', TheDependency);

				var theClass1 = zooject.resolve(function (theDependency) {
					this.theDependency = theDependency;
				});

				var theClass2 = zooject.resolve(function (theDependency) {
					this.theDependency = theDependency;
				});

				expect(theClass1.theDependency).toBe(theClass2.theDependency);
			});

		});

		describe('non-singleton resolve', function () {

			it('should be a new object resolved', function () {
				var zooject = new Zooject();
				var TheDependency = function () {};

				zooject.register('TheDependency', TheDependency);

				var theClass1 = zooject.resolve(function (theDependency) {
					this.theDependency = theDependency;
				});

				var theClass2 = zooject.resolve(function (theDependency) {
					this.theDependency = theDependency;
				});

				expect(theClass1.theDependency).not.toBe(theClass2.theDependency);
			});
			
		});

	});

});