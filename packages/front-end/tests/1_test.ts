import { expect } from 'chai';

import SeleniumTestUtils from './util';

const cy = SeleniumTestUtils.getDriver();

describe('Homepage', () => {
  beforeEach(async () => {
    console.log('Running test...');
  });

  it('Should successfully go to homepage', async () => {
    await cy.get(SeleniumTestUtils.BASE_URL);
    await SeleniumTestUtils.sleep(5000);
    expect(await cy.getCurrentUrl()).to.include(SeleniumTestUtils.BASE_URL);
  });
});
