/* eslint-env mocha */
import React from 'react';
import {shallow} from 'enzyme';
import {assert} from 'chai';
import Tabs from './Tabs';
import getMuiTheme from '../styles/getMuiTheme';

describe('<Tabs />', () => {
  const muiTheme = getMuiTheme();
  const shallowWithContext = (node) => shallow(node, {context: {muiTheme}});
  const Tab = () => <div />;
  Tab.muiName = 'Tab';

  describe('uncontrolled', () => {
    it('should set the right tab active', () => {
      const wrapper = shallowWithContext(
        <Tabs>
          <Tab />
          <Tab />
        </Tabs>
      );

      assert.strictEqual(wrapper.state().selectedIndex, 0);
    });
  });

  describe('prop: value', () => {
    it('should set the right tab active', () => {
      const wrapper = shallowWithContext(
        <Tabs value="2">
          <Tab value="1" />
          <Tab value="2" />
        </Tabs>
      );

      assert.strictEqual(wrapper.state().selectedIndex, 1);
    });

    it('should set the right tab active when the children change', () => {
      const wrapper = shallowWithContext(
        <Tabs value="2">
          <Tab value="1" />
          <Tab value="2" />
        </Tabs>
      );

      wrapper.setProps({
        children: [
          <Tab value="2" />,
          <Tab value="3" />,
        ],
      });

      assert.strictEqual(wrapper.state().selectedIndex, 0);
    });
  });

  describe('ID handling', () => {
    it('should produce an ID when one has not been provided', () => {
      const wrapper = shallowWithContext(
        <Tabs value="2">
          <Tab value="1" />
          <Tab value="2" />
        </Tabs>
      );

      assert.ok(wrapper.find('div > div').get(0).props.id, 'an ID value should be generated');
      assert.ok(wrapper.find('div > div').get(0).props.id.length > 0, 'an ID value should be generated');
    });

    it('should use the given ID', () => {
      const id = '12345';
      const wrapper = shallowWithContext(
        <Tabs value="2" id={id}>
          <Tab value="1" />
          <Tab value="2" />
        </Tabs>
      );

      assert.strictEqual(wrapper.prop('id'), id, 'the provided id ${id} was not used');
    });
  });
});
