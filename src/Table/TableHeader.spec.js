/* eslint-env mocha */
import React from 'react';
import PropTypes from 'prop-types';
import {shallow} from 'enzyme';
import {assert} from 'chai';
import getMuiTheme from '../styles/getMuiTheme';
import TableHeader from './TableHeader';
import TableHeaderColumn from './TableHeaderColumn';

describe('<TableHeader />', () => {
  const muiTheme = getMuiTheme();
  const shallowWithContext = (node) => shallow(node, {
    context: {muiTheme},
    childContextTypes: {muiTheme: PropTypes.object},
  });

  describe('a11y tests', () => {
    it('Should have a role specified', () => {
      const wrapper = shallowWithContext(
        <TableHeader>
          <TableHeaderColumn>Test</TableHeaderColumn>
        </TableHeader>
      );
      assert.isOk(wrapper.prop('role'));
    });
  });
});
