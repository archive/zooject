/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, indent:2, maxerr:50 */
/*global describe:false, it:false, expect:false, Zooject:false, beforeEach:false */

describe('Zooject specifications', function () {
  
  'use strict';

  describe('with a registered dependency', function () {

    var zooject = {};

    beforeEach(function () {
      zooject = new Zooject();

      var TheDependency = function () {};
      zooject.register('TheDependency', TheDependency);
    });

    it('should be able to resolve by class name', function () {
      var TheClass = function (theDependency) {
        this.theDependency = theDependency;
      };

      zooject.register('TheClass', TheClass);

      var theClass = zooject.resolve('TheClass');

      expect(theClass.theDependency).toBeDefined();
    });

    it('should be able to resolve by class', function () {
      var TheClass = function (theDependency) {
        this.theDependency = theDependency;
      };

      var theClass = zooject.resolve(TheClass);

      expect(theClass.theDependency).toBeDefined();
    });

    it('should be able to resolve by anonymous function', function () {
      var theClass = zooject.resolve(function (theDependency) {
        this.theDependency = theDependency;
      });

      expect(theClass.theDependency).toBeDefined();
    });   

    it('should be able to resolve complex structures', function () {
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