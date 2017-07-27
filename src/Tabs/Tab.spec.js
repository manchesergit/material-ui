/* eslint-env mocha */
import React from 'react';
import {shallow} from 'enzyme';
import {assert} from 'chai';
import Tab from './Tab';
import getMuiTheme from '../styles/getMuiTheme';

describe('<Tab />', () => {
  const muiTheme = getMuiTheme();
  const shallowWithContext = (node) => shallow(node, {context: {muiTheme}});
  Tab.muiName = 'Tab';

  describe('aria-controls pouplation', () => {
    it('should have no default', () => {
      const wrapper = shallowWithContext(<Tab />);
      assert.strictEqual(wrapper.prop('aria-controls'), undefined,
        'aria-controls should not be assigned to anything by default');
    });

    it('should have the given value', () => {
      const controlValue = 'sengin';
      const wrapper = shallowWithContext(<Tab tabContainerId={controlValue} />);
      assert.strictEqual(wrapper.prop('aria-controls'), controlValue,
        'aria-controls should be the same as the container ID provided');
    });
  });
});
