/* eslint-env mocha */

import React from 'react';
import {shallow} from 'enzyme';
import {assert} from 'chai';
import getMuiTheme from '../styles/getMuiTheme';
import {dateTimeFormat} from './dateUtils';
import DayButton from './DayButton';

describe('<DayButton />', () => {
  const muiTheme = getMuiTheme();
  const shallowWithContext = (node) => shallow(node, {context: {muiTheme}});

  // make a button with nothing fancy in it, for the date provided
  function makeButtonUsingDate(date) {
    return shallowWithContext(
      <DayButton
        date={date}
        DateTimeFormat={dateTimeFormat}
        locale="en-US"
      />);
  }

  describe('i18n', () => {
    it('should format the day correctly', () => {
      const date = new Date(1448967059892); // Tue, 01 Dec 2015 10:50:59 GMT
      const wrapper = makeButtonUsingDate(date);

      assert.strictEqual(wrapper.find('span').text(), '1');
    });
  });

  describe('Day namimg should have the correct postfix', () => {
    // the year and month dosen't matter for all these test, they are checking the day numbers only
    it('should end in st', () => {
      const test1 = makeButtonUsingDate(new Date('1970-jan-01'));
      const test2 = makeButtonUsingDate(new Date('1970-feb-01')); // just incase 1st test was a fluke
      const test3 = makeButtonUsingDate(new Date('1970-jan-21'));
      const test4 = makeButtonUsingDate(new Date('1970-jan-31'));

      assert.strictEqual(test1.prop('id'), '1st');
      assert.strictEqual(test2.prop('id'), '1st');
      assert.strictEqual(test3.prop('id'), '21st');
      assert.strictEqual(test4.prop('id'), '31st');
    });

    it('should end in nd', () => {
      const test1 = makeButtonUsingDate(new Date('1970-jan-02'));
      const test2 = makeButtonUsingDate(new Date('1970-jan-22'));

      assert.strictEqual(test1.prop('id'), '2nd');
      assert.strictEqual(test2.prop('id'), '22nd');
    });

    it('should end in rd', () => {
      const test1 = makeButtonUsingDate(new Date('1970-jan-03'));
      const test2 = makeButtonUsingDate(new Date('1970-jan-23'));

      assert.strictEqual(test1.prop('id'), '3rd');
      assert.strictEqual(test2.prop('id'), '23rd');
    });

    // basically everything not covered in the previous tests are here
    it('should end in th', () => {
      const test1 = makeButtonUsingDate(new Date('1970-jan-04'));
      const test2 = makeButtonUsingDate(new Date('1970-jan-05'));
      const test3 = makeButtonUsingDate(new Date('1970-jan-06'));
      const test4 = makeButtonUsingDate(new Date('1970-jan-07'));
      const test5 = makeButtonUsingDate(new Date('1970-jan-08'));
      const test6 = makeButtonUsingDate(new Date('1970-jan-09'));
      const test7 = makeButtonUsingDate(new Date('1970-jan-10'));
      const test8 = makeButtonUsingDate(new Date('1970-jan-11'));
      const test9 = makeButtonUsingDate(new Date('1970-jan-12'));
      const test10 = makeButtonUsingDate(new Date('1970-jan-13'));
      const test11 = makeButtonUsingDate(new Date('1970-jan-14'));
      const test12 = makeButtonUsingDate(new Date('1970-jan-15'));
      const test13 = makeButtonUsingDate(new Date('1970-jan-16'));
      const test14 = makeButtonUsingDate(new Date('1970-jan-17'));
      const test15 = makeButtonUsingDate(new Date('1970-jan-18'));
      const test16 = makeButtonUsingDate(new Date('1970-jan-19'));
      const test17 = makeButtonUsingDate(new Date('1970-jan-20'));
      const test18 = makeButtonUsingDate(new Date('1970-jan-24'));
      const test19 = makeButtonUsingDate(new Date('1970-jan-25'));
      const test20 = makeButtonUsingDate(new Date('1970-jan-26'));
      const test21 = makeButtonUsingDate(new Date('1970-jan-27'));
      const test22 = makeButtonUsingDate(new Date('1970-jan-28'));
      const test23 = makeButtonUsingDate(new Date('1970-jan-29'));
      const test24 = makeButtonUsingDate(new Date('1970-jan-30'));

      assert.strictEqual(test1.prop('id'), '4th');
      assert.strictEqual(test2.prop('id'), '5th');
      assert.strictEqual(test3.prop('id'), '6th');
      assert.strictEqual(test4.prop('id'), '7th');
      assert.strictEqual(test5.prop('id'), '8th');
      assert.strictEqual(test6.prop('id'), '9th');
      assert.strictEqual(test7.prop('id'), '10th');
      assert.strictEqual(test8.prop('id'), '11th');
      assert.strictEqual(test9.prop('id'), '12th');
      assert.strictEqual(test10.prop('id'), '13th');
      assert.strictEqual(test11.prop('id'), '14th');
      assert.strictEqual(test12.prop('id'), '15th');
      assert.strictEqual(test13.prop('id'), '16th');
      assert.strictEqual(test14.prop('id'), '17th');
      assert.strictEqual(test15.prop('id'), '18th');
      assert.strictEqual(test16.prop('id'), '19th');
      assert.strictEqual(test17.prop('id'), '20th');
      assert.strictEqual(test18.prop('id'), '24th');
      assert.strictEqual(test19.prop('id'), '25th');
      assert.strictEqual(test20.prop('id'), '26th');
      assert.strictEqual(test21.prop('id'), '27th');
      assert.strictEqual(test22.prop('id'), '28th');
      assert.strictEqual(test23.prop('id'), '29th');
      assert.strictEqual(test24.prop('id'), '30th');
    });
  });
});
