'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {

  browser.get('');

  it('should automatically redirect to /#!/" when location hash/fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/#!/");
  });


  describe('list articles', function() {

    beforeEach(function() {
      browser.get('#!/articles');
    });


    it('should render articles list', function() {
      expect(element.all(by.css('section.content h1')).first().getText()).
        toMatch(/Articles/);
    });

  });


  describe('create article', function() {

    beforeEach(function() {
      browser.get('#!/articles/create');
    });


    it('should render article create form', function() {
      expect(element.all(by.css('section.content h1')).first().getText()).
        toMatch(/New Article/);
    });

  });
});
