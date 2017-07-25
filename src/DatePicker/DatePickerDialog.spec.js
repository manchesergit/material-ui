/* eslint-env mocha */
import React from 'react';
import {shallow} from 'enzyme';
import {assert} from 'chai';
import DatePickerDialog from './DatePickerDialog';
import getMuiTheme from '../styles/getMuiTheme';

describe('<DatePickerDialog />', () => {
  const muiTheme = getMuiTheme();
  const shallowWithContext = (node) => shallow(node, {context: {muiTheme}});

  describe('ID values', () => {
    it('should produce an ID when one has not been provided', () => {
      const wrapper = shallowWithContext(
        <DatePickerDialog />
      );

      assert.ok(wrapper.prop('id'), 'an ID value should be generated');
    });

    it('should use the given ID', () => {
      const id = 'methuselah';
      const wrapper = shallowWithContext(
        <DatePickerDialog
          id={id}
        />
      );

      assert.strictEqual(wrapper.prop('id'), id, `the provided id ${id} was not used`);
    });
  });
});
