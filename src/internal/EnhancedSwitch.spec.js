/* eslint-env mocha */
import React from 'react';
import {shallow} from 'enzyme';
import {assert} from 'chai';
import EnhancedSwitch from './EnhancedSwitch';
import getMuiTheme from '../styles/getMuiTheme';

describe('<EnhancedSwitch />', () => {
  const muiTheme = getMuiTheme();
  const shallowWithContext = (node) => shallow(node, {context: {muiTheme}});
  const switchElement = (
    <div />
  );
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
