/* eslint-env mocha */
import React from 'react';
import PropTypes from 'prop-types';
import {shallow} from 'enzyme';
import {assert} from 'chai';
import getMuiTheme from '../styles/getMuiTheme';
import TableBody from './TableBody';
import TableRow from './TableRow';
import TableRowColumn from './TableRowColumn';

describe('<TableBody />', () => {
  const muiTheme = getMuiTheme();
  const shallowWithContext = (node) => shallow(node, {
    context: {muiTheme},
    childContextTypes: {muiTheme: PropTypes.object},
  });

  describe('a11y tests', () => {
    it('Should have a role specified', () => {
      const wrapper = shallowWithContext(
        <TableBody>
          <TableRow>
            <TableRowColumn>Test</TableRowColumn>
          </TableRow>
        </TableBody>
      );
      assert.isOk(wrapper.find('tbody').prop('role'));
    });
  });
});
