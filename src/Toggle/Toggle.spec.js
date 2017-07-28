/* eslint-env mocha */
import React from 'react';
import {shallow} from 'enzyme';
import {render} from 'enzyme';
import {assert} from 'chai';
import Toggle from './Toggle';
import getMuiTheme from '../styles/getMuiTheme';

describe('<Toggle />', () => {
  const muiTheme = getMuiTheme();
  const shallowWithContext = (node) => shallow(node, {context: {muiTheme}});
  const renderWithContext = (node) => render(node, {context: {muiTheme}});
  Toggle.muiName = 'toggle';

  describe('Check the internal state is correct', () => {
    function getRenderedCheckBox(checkbox) {
      return checkbox.get(0).children[0].children[0];
    }

    function getAriaCheckedValueFromRenderedCheckBox(renderedCheckbox) {
      return renderedCheckbox.attribs['aria-checked'] === 'true';
    }

    it('should be unchecked by default', () => {
      const wrapper = renderWithContext(<Toggle />);
      assert.isFalse(getAriaCheckedValueFromRenderedCheckBox(getRenderedCheckBox(wrapper)),
        'inital state should be false');
    });

    it('should be checked by default if set that way', () => {
      const wrapper = renderWithContext(<Toggle defaultToggled={true} />);
      assert.isTrue(getAriaCheckedValueFromRenderedCheckBox(getRenderedCheckBox(wrapper)),
        'inital state should be true due to default toggle');
    });
  });
});
