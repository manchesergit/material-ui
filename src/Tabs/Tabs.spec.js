/* eslint-env mocha */
import React from 'react';
import {shallow} from 'enzyme';
import {render} from 'enzyme';
import {assert} from 'chai';
import Tabs from './Tabs';
import getMuiTheme from '../styles/getMuiTheme';

describe('<Tabs />', () => {
  const muiTheme = getMuiTheme();
  const shallowWithContext = (node) => shallow(node, {context: {muiTheme}});
  const renderWithContext = (node) => render(node, {context: {muiTheme}});
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
      assert.strictEqual(wrapper.find('Tab').at(0).prop('selected'), true);
      assert.strictEqual(wrapper.find('Tab').at(1).prop('selected'), false);
      assert.strictEqual(wrapper.find('InkBar').prop('left'), '0%');
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
      assert.strictEqual(wrapper.find('Tab').at(0).prop('selected'), false);
      assert.strictEqual(wrapper.find('Tab').at(1).prop('selected'), true);
      assert.strictEqual(wrapper.find('InkBar').prop('left'), '50%');
    });

    it('should still use the value prop even after another tab is selected if value stays the same', () => {
      const wrapper = shallowWithContext(
        <Tabs value="2">
          <Tab value="1" />
          <Tab value="2" />
        </Tabs>
      );

      wrapper.setState({selectedIndex: 0});

      assert.strictEqual(wrapper.state().selectedIndex, 0);
      assert.strictEqual(wrapper.find('Tab').at(0).prop('selected'), false);
      assert.strictEqual(wrapper.find('Tab').at(1).prop('selected'), true);
      assert.strictEqual(wrapper.find('InkBar').prop('left'), '50%');
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
      assert.strictEqual(wrapper.find('Tab').at(0).prop('selected'), true);
      assert.strictEqual(wrapper.find('Tab').at(1).prop('selected'), false);
      assert.strictEqual(wrapper.find('InkBar').prop('left'), '0%');
    });
  });

  describe('aria-hidden correctly set', () => {
    // get the aria-hidden attibute as a boolean from the given tab's attibutes
    function getTabAriaHiddenValue(tab) {
      return tab.attribs['aria-hidden'] === 'true';
    }

    // get the required tab from the wrapper thats contains the generated cheerio structures
    function getTabByNumber(tabs, tabNumber) {
      const childTabObject = 0;
      const firstChild = 0;
      const tabDetails = 2;
      const tabObjects = tabs.get(childTabObject).children[firstChild].children[tabDetails];
      return tabObjects.children[tabNumber];
    }

    // make the wrapper for the tabs that can be tested, activating a given tab (1-3)
    function getRenderedTabsWithInitalSelectionSet(initalTabSelection) {
      return renderWithContext(
        <Tabs value={String(initalTabSelection)}>
          <Tab value="1" id="tab1">
            <p>stuff</p>
          </Tab>
          <Tab value="2" id="tab2">
            <p>things</p>
          </Tab>
          <Tab value="3" id="tab3">
            <p>unicorns</p>
          </Tab>
        </Tabs>
      );
    }

    // tests from here on, these should just be setting states, but i can't see a way to do that in cheerio
    // so i've resorted to just setting the state at build time and checking from that
    // we are checking using 3 tabs so we can prove that we aren't passing just by 50/50 chance
    it('should set tabs 2 and 3 to hidden', () => {
      const wrapper = getRenderedTabsWithInitalSelectionSet(1);
      const tab1 = getTabByNumber(wrapper, 0);
      const tab2 = getTabByNumber(wrapper, 1);
      const tab3 = getTabByNumber(wrapper, 2);

      assert.isFalse(getTabAriaHiddenValue(tab1), 'tab 1 is hidden');
      assert.isTrue(getTabAriaHiddenValue(tab2), 'tab 2 is not hidden');
      assert.isTrue(getTabAriaHiddenValue(tab3), 'tab 3 is not hidden');
    });

    it('should set tabs 1 and 3 to hidden', () => {
      const wrapper = getRenderedTabsWithInitalSelectionSet(2);
      const tab1 = getTabByNumber(wrapper, 0);
      const tab2 = getTabByNumber(wrapper, 1);
      const tab3 = getTabByNumber(wrapper, 2);

      assert.isTrue(getTabAriaHiddenValue(tab1), 'tab 1 is not hidden');
      assert.isFalse(getTabAriaHiddenValue(tab2), 'tab 2 is hidden');
      assert.isTrue(getTabAriaHiddenValue(tab3), 'tab 3 is not hidden');
    });

    it('should set tabs 1 and 2 to hidden', () => {
      const wrapper = getRenderedTabsWithInitalSelectionSet(3);
      const tab1 = getTabByNumber(wrapper, 0);
      const tab2 = getTabByNumber(wrapper, 1);
      const tab3 = getTabByNumber(wrapper, 2);

      assert.isTrue(getTabAriaHiddenValue(tab1), 'tab 1 is not hidden');
      assert.isTrue(getTabAriaHiddenValue(tab2), 'tab 2 is not hidden');
      assert.isFalse(getTabAriaHiddenValue(tab3), 'tab 3 is hidden');
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
