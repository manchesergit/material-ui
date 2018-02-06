/* eslint-env mocha */
import React from 'react';
import PropTypes from 'prop-types';
import {mount, shallow} from 'enzyme';
import {assert} from 'chai';
import EnhancedTextarea from './EnhancedTextarea';
import getMuiTheme from '../styles/getMuiTheme';

describe('<EnhancedTextArea />', () => {
  const muiTheme = getMuiTheme();
  const rowHeight = 24;
  const shallowWithContext = (node) => shallow(node, {context: {muiTheme}});
  const mountWithContext = (node) => mount(node, {
    context: {muiTheme},
    childContextTypes: {muiTheme: PropTypes.object},
  });

  it('renders with no arguments', () => {
    const wrapper = mountWithContext(
      <EnhancedTextarea />
    );
    assert.isAbove(wrapper.find('div').length, 0);
  });

  it('has one row initial height', () => {
    const wrapper = mountWithContext(
      <EnhancedTextarea />
    );
    assert.strictEqual(wrapper.state().height, rowHeight);
  });

  // This test will not succeed due to
  // jsdom limitations
  // https://github.com/tmpvar/jsdom/issues/1013
  /* eslint mocha/no-skipped-tests: 0 */
  it.skip('has zero initial height', () => {
    const wrapper = mountWithContext(
      <EnhancedTextarea
        value="A really long string that should go over multiple lines and should trigger more rows than one"
      />
    );
    assert.isAbove(wrapper.state().height, rowHeight);
  });

  describe('ID handeling and generation', () => {
    it('should use the supplied id without overriding', () => {
      const id = '12345';
      const wrapper = mountWithContext(
        <EnhancedTextarea id={id} />
      );

      assert.strictEqual(wrapper.prop('id'), id, 'should use provided id');
    });

    it('should generate an id if one not supplied', () => {
      const classname = 'abcde';
      const wrapper = shallowWithContext(
        <EnhancedTextarea name={classname} />
      );

      assert.ok(wrapper.prop('id').length > 0, 'should generate an id if not supplied');
    });
  });
});
