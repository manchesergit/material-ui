/* eslint-env mocha */
import React from 'react';
import {render} from 'enzyme';
import {assert} from 'chai';
import YearButton from './YearButton';
import {defaultUtils} from './dateUtils';
import getMuiTheme from '../styles/getMuiTheme';

describe('<YearButton />', () => {
  const muiTheme = getMuiTheme();
  const renderWithContext = (node) => render(node, {context: {muiTheme}});
  YearButton.muiName = 'YearButton';

  describe('Id is handled correctly', () => {
    // the button is rendered out using an enhanced button so the id is burried in that
    function getButtonIdValue(button) {
      return button.get(0).children[0].attribs.id;
    }

    it('Should auto generate an ID when none is given', () => {
      const wrapper = renderWithContext(
        <YearButton
          year={2017}
          utils={defaultUtils}
        >
          <span>2017</span>
        </YearButton>
      );

      assert.isTrue(getButtonIdValue(wrapper).length > 0, 'expected an auto generated ID');
    });

    it('Should auto generate an ID when null is given', () => {
      const wrapper = renderWithContext(
        <YearButton
          year={2017}
          utils={defaultUtils}
          id={null}
        >
          <span>2017</span>
        </YearButton>
      );

      assert.isTrue(getButtonIdValue(wrapper).length > 0, 'expected an auto generated ID');
    });

    it('Should auto generate an ID when an empty string is given', () => {
      const wrapper = renderWithContext(
        <YearButton
          year={2017}
          utils={defaultUtils}
          id=""
        >
          <span>2017</span>
        </YearButton>
      );

      assert.isTrue(getButtonIdValue(wrapper).length > 0, 'expected an auto generated ID');
    });

    it('Should keep the given ID', () => {
      const id = 'gerald';
      const wrapper = renderWithContext(
        <YearButton
          year={2017}
          utils={defaultUtils}
          id={id}
        >
          <span>2017</span>
        </YearButton>
      );

      assert.strictEqual(getButtonIdValue(wrapper), id, 'expected the same ID as was provided');
    });
  });
});
