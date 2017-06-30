import { SheratoneAppPage } from './app.po';

describe('sheratone-app App', function() {
  let page: SheratoneAppPage;

  beforeEach(() => {
    page = new SheratoneAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
