/* eslint-env mocha */
import React from 'react';
import PropTypes from 'prop-types';
import {shallow} from 'enzyme';
import {mount} from 'enzyme'
import {assert} from 'chai';

import DatePicker from './DatePicker';
import getMuiTheme from '../styles/getMuiTheme';
import TextField from '../TextField';
import keycode from 'keycode';
import {spy} from 'sinon';

describe('<DatePicker />', () => {
  const muiTheme = getMuiTheme();
  const mountWithContext = (node) => mount(node, {
    context: {muiTheme},
    childContextTypes: {muiTheme: PropTypes.object},
  });
  const shallowWithContext = (node) => shallow(node, {
    context: {muiTheme},
    childContextTypes: {muiTheme: PropTypes.object},
  });

  describe('formatDate', () => {
    it('should use the default format', () => {
      const date = new Date(1448967059892); // Tue, 01 Dec 2015 10:50:59 GMT
      const wrapper = shallowWithContext(
        <DatePicker value={date} />
      );

      assert.strictEqual(wrapper.find(TextField).props().value, '2015-12-01',
        'should format the date to ISO 8601 (YYYY-MM-DD)');
    });
  });

  describe('id handling', () => {
    it('should use the supplied id without overridding', () => {
      const date = new Date(1448967059892); // Tue, 01 Dec 2015 10:50:59 GMT
      const datePickerId = 'test-datePickerId';
      const wrapper = shallowWithContext(
        <DatePicker value={date} id={datePickerId} />
      );

      assert.strictEqual(wrapper.prop('id'), datePickerId,
        'should use supplied id');
    });
    it('should generate an id if one not supplied', () => {
      const date = new Date(1448967059892); // Tue, 01 Dec 2015 10:50:59 GMT
      const wrapper = shallowWithContext(
        <DatePicker value={date} />
      );

      assert.ok(wrapper.prop('id'),
        'should generate an id if one not supplied');
    });
  });

  describe('opening date picker', () => {
    describe('check the dialog actually opens', () => {
      it('should open when the mouse button is pressed on it', () => {
        const callback = spy();
        const wrapper = mountWithContext(<DatePicker id="bob" onShow={callback} />);

        // this has to be in a timeout as the click event is delayed and will not be registered properly by spy
        setTimeout(() => {
          wrapper.simulate('click');
          assert.strictEqual(callback.callCount, 1,
              'expected the onShow event to fire when the mouse button is pressed');
        }, 10);
      });

      it('should open when space is pressed', () => {
        const spaceBar = keycode('space');
        const callback = spy();
        const wrapper = mountWithContext(<DatePicker onShow={callback} />);
        wrapper.simulate('keyDown', {keyCode: spaceBar});

        assert.strictEqual(callback.callCount, 1, 'expected the onShow event to fire when the space bar is pressed');
      });

      it('should open when enter is pressed', () => {
        const enter = keycode('enter');
        const callback = spy();
        const wrapper = mountWithContext(<DatePicker onShow={callback} />);
        wrapper.simulate('keyDown', {keyCode: enter});

        assert.strictEqual(callback.callCount, 1, 'expected the onShow event to fire when enter is pressed');
      });

      it('should not open when space is pressed and its disabled', () => {
        const spaceBar = keycode('space');
        const callback = spy();
        const wrapper = mountWithContext(<DatePicker onShow={callback} disabled={true} />);
        wrapper.simulate('keyDown', {keyCode: spaceBar});

        assert.strictEqual(callback.callCount, 0,
          'expected the onShow event to not fire when the space is pressed as it should be disabled');
      });

      it('should not open when enter is pressed and its disabled', () => {
        const enter = keycode('enter');
        const callback = spy();
        const wrapper = mountWithContext(<DatePicker onShow={callback} disabled={true} />);
        wrapper.simulate('keyDown', {keyCode: enter});

        assert.strictEqual(callback.callCount, 0,
          'expected the onShow event to not fire when the enter is pressed as it should be disabled');
      });
    });

    describe('check the dialog will not open', () => {
      it('should not open when a key pressed', () => {
        const key = keycode('a');
        const callback = spy();
        const wrapper = mountWithContext(<DatePicker onShow={callback} />);
        wrapper.simulate('keyDown', {keyCode: key});

        assert.strictEqual(callback.callCount, 0, 'expected nothing to fire when the [a] is pressed');
      });

      it('should not open when escape is pressed', () => {
        const key = keycode('esc');
        const callback = spy();
        const wrapper = mountWithContext(<DatePicker onShow={callback} />);
        wrapper.simulate('keyDown', {keyCode: key});

        assert.strictEqual(callback.callCount, 0, 'expected nothing to fire when escape is pressed');
      });
    });
  });
});
