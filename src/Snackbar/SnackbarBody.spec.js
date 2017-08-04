/* eslint-env mocha */
import React from 'react';
import {shallow} from 'enzyme';
import {assert} from 'chai';
import {SnackbarBody} from './SnackbarBody';
import getMuiTheme from '../styles/getMuiTheme';
import {SMALL} from '../utils/withWidth';

describe('<SnackbarBody />', () => {
  const muiTheme = getMuiTheme();
  const shallowWithContext = (node) => shallow(node, {context: {muiTheme}});

  describe('props: open', () => {
    it('should be hidden when open is false', () => {
      const wrapper = shallowWithContext(
        <SnackbarBody open={false} message="Message" width={SMALL} />
      );

      assert.strictEqual(
        wrapper.find('div').at(1).node.props.style.opacity,
        0,
        'The element should be hidden.'
      );
    });

    it('should be visible when open is true', () => {
      const wrapper = shallowWithContext(
        <SnackbarBody open={true} message="Message" width={SMALL} />
      );

      assert.strictEqual(
        wrapper.find('div').at(1).node.props.style.opacity,
        1,
        'The element should be visible.'
      );
    });
  });

  describe('ID handling', () => {
    it('should use the supplied ID without overriding', () => {
      const id = '12345';
      const wrapper = shallowWithContext(
        <SnackbarBody
          contentId={id} open={true} message="Message"
          width={SMALL}
        />
      );
      assert.strictEqual(wrapper.props().children.props.children[0].props.id,
      id, 'contentId provided should be the same id value for message');
    });
  });
});
