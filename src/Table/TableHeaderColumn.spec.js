/* eslint-env mocha */
import React from 'react';
import PropTypes from 'prop-types';
import {shallow} from 'enzyme';
import {assert} from 'chai';
import getMuiTheme from '../styles/getMuiTheme';
import TableHeaderColumn from './TableHeaderColumn';

describe('<TableHeaderColumn />', () => {
  const muiTheme = getMuiTheme();
  const shallowWithContext = (node) => shallow(node, {
    context: {muiTheme},
    childContextTypes: {muiTheme: PropTypes.object},
  });

  describe('a11y tests', () => {
    it('Should render as td if no children', () => {
      const wrapper = shallowWithContext(
        <TableHeaderColumn />
      );
      assert.equal(wrapper.type(), 'td', 'empty TableHeaderColumn should be td');
      assert.equal(wrapper.prop('role'), 'presentation', 'should have role of presentation');
    });
    it('Should render as th if has children', () => {
      const wrapper = shallowWithContext(
        <TableHeaderColumn>
          some test textColor
        </TableHeaderColumn>
      );
      assert.equal(wrapper.type(), 'th', 'TableHeaderColumn should render as th');
      assert.equal(wrapper.prop('role'), 'columnheader', 'should have role of columnHeader');
    });
    it('Should render as td if its a selectAll header', () => {
      const wrapper = shallowWithContext(
        <TableHeaderColumn isSelectAll={true}>
          some test textColor
        </TableHeaderColumn>
      );
      assert.equal(wrapper.type(), 'td', 'TableHeaderColumn should render as td');
    });
    it('Should render as th if it isSelectAll is false', () => {
      const wrapper = shallowWithContext(
        <TableHeaderColumn isSelectAll={false}>
          some test textColor
        </TableHeaderColumn>
      );
      assert.equal(wrapper.type(), 'th', 'TableHeaderColumn should render as th');
    });
  });
});
