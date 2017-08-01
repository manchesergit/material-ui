/* eslint-env mocha */
import React from 'react';
import {shallow} from 'enzyme';
import {assert} from 'chai';
import EnhancedSwitch from './EnhancedSwitch';
import getMuiTheme from '../styles/getMuiTheme';

describe('<EnhancedSwitch />', () => {
  const muiTheme = getMuiTheme();
  const shallowWithContext = (node) => shallow(node, {context: {muiTheme}});
  const switchElement = (<div />);

  describe('IDs are handled correctly', () => {
    const enhancedSwitchProps = {
      ref: 'enhancedSwitch',
      inputType: 'checkbox',
      switched: true,
      switchElement: switchElement,
    };

    it('should apply supplied id to base container without overriding', () => {
      const enhancedSwitchId = 'test-enhancedSwitchId';
      const wrapper = shallowWithContext(
        <EnhancedSwitch id={enhancedSwitchId} {...enhancedSwitchProps} />
      );
      assert.strictEqual(wrapper.prop('id'), enhancedSwitchId,
        'base id should be as given');
    });

    it('should generate a unique id when one not supplied', () => {
      const wrapper = shallowWithContext(
        <EnhancedSwitch {...enhancedSwitchProps} />
      );
      assert.ok(wrapper.prop('id'), 'base id should be generated');
    });
  });

  describe('Checked state is correctly updated', () => {
    const enhancedSwitchProps = {
      ref: 'enhancedSwitch',
      inputType: 'switch',
      switchElement: switchElement,
    };

    it('should have the correct is checked state', () => {
      const switched = true;
      const wrapper = shallowWithContext(<EnhancedSwitch switched={switched} {...enhancedSwitchProps} />);
      assert.strictEqual(wrapper.state('isChecked'), switched,
          'the checked state should be the same as the switched field');
    });

    it('should update its internal state when checked', () => {
      const wrapper = shallowWithContext(<EnhancedSwitch switched={false} {...enhancedSwitchProps} />);
      assert.strictEqual(wrapper.state('isChecked'), false,
          'the checked state should false intially');
      wrapper.setProps({checked: true});
      wrapper.update();
      assert.strictEqual(wrapper.state('isChecked'), true,
          'the checked state should have changed');
    });
  });
});
