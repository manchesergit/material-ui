/* eslint-env mocha */

import React from 'react';
import {assert} from 'chai';
import {shallow, mount} from 'enzyme';
import RadioButtonGroup from './RadioButtonGroup';
import RadioButton from './RadioButton';
import getMuiTheme from '../styles/getMuiTheme';

describe('<RadioButtonGroup />', () => {
  const muiTheme = getMuiTheme();
  const shallowWithContext = (node) => shallow(node, {context: {muiTheme}});
  const mountWithContext = (node) => mount(node, {
    context: {muiTheme},
  });

  describe('initial state', () => {
    it('should accept string valueSelected prop and set to state', () => {
      const wrapper = shallowWithContext(<RadioButtonGroup name="testGroup" valueSelected={'value'} />);
      assert.strictEqual(wrapper.state('selected'), 'value');
    });
    it('should accept truthy valueSelected prop and set to state', () => {
      const wrapper = shallowWithContext(<RadioButtonGroup name="testGroup" valueSelected={true} />);
      assert.strictEqual(wrapper.state('selected'), true);
    });
    it('should accept falsy valueSelected prop and set to state', () => {
      const wrapper = shallowWithContext(<RadioButtonGroup name="testGroup" valueSelected={false} />);
      assert.strictEqual(wrapper.state('selected'), false);
    });
    it('should accept string defaultSelected prop and set to state', () => {
      const wrapper = shallowWithContext(<RadioButtonGroup name="testGroup" defaultSelected={'value'} />);
      assert.strictEqual(wrapper.state('selected'), 'value');
    });
    it('should accept truthy defaultSelected prop and set to state', () => {
      const wrapper = shallowWithContext(<RadioButtonGroup name="testGroup" defaultSelected={true} />);
      assert.strictEqual(wrapper.state('selected'), true);
    });
    it('should accept falsy defaultSelected prop and set to state', () => {
      const wrapper = shallowWithContext(<RadioButtonGroup name="testGroup" defaultSelected={false} />);
      assert.strictEqual(wrapper.state('selected'), false);
    });
  });
  describe('a11y checks', () => {
    const wrapper = mountWithContext(
      <RadioButtonGroup name="testGroup" defaultSelected="test1">
        <RadioButton value="test1" label="test1" />
        <RadioButton value="test2" label="test2" />
      </RadioButtonGroup>
    );
    it('aria-checked should be true when rb checked by default', () => {
      const input = wrapper.find('input').at(0);

      assert.ok(input.prop('aria-checked'), 'Should be true');
    });
    it('aria-checked should be false when rb not checked', () => {
      const input = wrapper.find('input').at(1);

      assert.isNotOk(input.prop('aria-checked'), 'Should be false');
    });
    it('aria-checked should reflect state change', () => {
      const input0 = wrapper.find('input').at(0);
      const input1 = wrapper.find('input').at(1);
      assert.ok(input0.prop('aria-checked'), 'Should be true');
      assert.isNotOk(input1.prop('aria-checked'), 'Should be false');
      // simulate check of rb 1
      input1.node.checked = !input1.node.checked;
      input1.simulate('change');
      assert.ok(input1.prop('aria-checked'), 'Should be true');
      assert.isNotOk(input0.prop('aria-checked'), 'Should be false');
    });
  });
});
