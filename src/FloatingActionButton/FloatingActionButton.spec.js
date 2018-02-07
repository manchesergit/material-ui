/* eslint-env mocha */
import React from 'react';
import PropTypes from 'prop-types';
import {shallow, mount} from 'enzyme';
import {assert} from 'chai';
import FloatingActionButton from './FloatingActionButton';
import FontIcon from '../FontIcon';
import getMuiTheme from '../styles/getMuiTheme';
import ContentAdd from '../svg-icons/content/add';
import mute from 'mute';

describe('<FloatingActionButton />', () => {
  const muiTheme = getMuiTheme();
  const shallowWithContext = (node) => shallow(node, {context: {muiTheme}});
  const mountWithContext = (node) => mount(node, {
    context: {muiTheme},
    childContextTypes: {muiTheme: PropTypes.object},
  });

  describe('hover state', () => {
    it('should reset the hover state when disabled', () => {
      const wrapper = shallowWithContext(
        <FloatingActionButton>
          <ContentAdd />
        </FloatingActionButton>
      );
      wrapper.setState({
        hovered: true,
      });
      wrapper.setProps({
        disabled: true,
      });
      assert.strictEqual(wrapper.state().hovered, false, 'should reset the state');
    });
  });

  describe('prop: iconClassName', () => {
    it('should add a FontIcon element when using the iconClassName property', () => {
      const iconClassName = 'foo';
      const wrapper = shallowWithContext(
        <FloatingActionButton iconClassName={iconClassName} />
      );

      assert.strictEqual(wrapper.find(FontIcon).props().className, iconClassName);
    });
  });

  describe('style', () => {
    it('should apply children style', () => {
      const wrapper = shallowWithContext(
        <FloatingActionButton>
          <FontIcon
            className="material-icons"
            style={{
              transform: 'scale(1.5)',
            }}
          >
            add
          </FontIcon>
        </FloatingActionButton>
      );
      assert.strictEqual(
        wrapper.find(FontIcon).props().style.transform,
        'scale(1.5)',
        'should apply inline style'
      );
    });

    it('should work with two children', () => {
      const wrapper = shallowWithContext(
        <FloatingActionButton>
          <ContentAdd />
          <ContentAdd />
        </FloatingActionButton>
      );

      const children = wrapper.find(ContentAdd);

      assert.strictEqual(children.length, 2);
      assert.strictEqual(children.at(0).props().style.fill,
        '#ffffff',
        'should use the default style'
      );
    });
  });

  describe('a11y warning checks', () => {
    it('throws an error if no for attribute on input', () => {
      const inputId = 'test-input-htmlFor';
      const buttonId = 'test-button-htmlFor';
      const unmute = mute(); // turn off the stdout and stderr so the warning isn't shown on the console output

      assert.throws(() => mountWithContext(
        <FloatingActionButton label="test-button" id={buttonId}>
          <input type="text" id={inputId} />
        </FloatingActionButton>
      ), Error);

      unmute(); // stdout and error back on again
    });

    it('throws error for no aria-labelledby', () => {
      const inputId = 'test-input-labbelledby';
      const buttonId = 'test-button-labbelledby';
      const unmute = mute(); // turn off the stdout and stderr so the warning isn't shown on the console output

      assert.throws(() => mountWithContext(
        <FloatingActionButton label="test-button" id={buttonId} htmlFor={inputId}>
          <input type="text" id={inputId} />
        </FloatingActionButton>
      ), Error);

      unmute(); // stdout and error back on again
    });

    it('throws error for no aria-describedby', () => {
      const inputId = 'test-input-describedby';
      const buttonId = 'test-button-describedby';
      const unmute = mute(); // turn off the stdout and stderr so the warning isn't shown on the console output

      assert.throws(() => mountWithContext(
        <FloatingActionButton label="test-button" id={buttonId} htmlFor={inputId}>
          <input type="text" id={inputId} aria-labelledby={buttonId} />
        </FloatingActionButton>
      ), Error);

      unmute(); // stdout and error back on again
    });

    it('No a11y check errors', () => {
      const inputId = 'test-input-noError';
      const buttonId = 'test-button-noError';
      const wrapper = mountWithContext(
        <FloatingActionButton label="test-button" id={buttonId} htmlFor={inputId}>
          <input
            type="text"
            id={inputId}
            aria-labelledby={buttonId}
            aria-describedby={buttonId}
          />
        </FloatingActionButton>
      );

      assert.ok(wrapper.find(buttonId));
    });
  });

  describe('ID handeling and generation', () => {
    it('should use the supplied id without overriding', () => {
      const id = '12345';
      const wrapper = shallowWithContext(
        <FloatingActionButton id={id} label="idPassthough" />
      );

      assert.strictEqual(wrapper.children().prop('id'), id, 'should use provided id');
    });

    it('should generate an id if one not supplied', () => {
      const classname = 'abcde';
      const wrapper = shallowWithContext(
        <FloatingActionButton name={classname} label="idGeneration" />
      );

      assert.ok(wrapper.children().prop('id'), 'should generate an id if not supplied');
    });
  });
});
