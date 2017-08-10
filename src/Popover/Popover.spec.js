/* eslint-env mocha */

import React from 'react';
import {assert} from 'chai';
import {shallow, mount} from 'enzyme';
import Popover from './Popover';
import PopoverAnimationDefault from './PopoverAnimationDefault';
import Paper from '../Paper';
import getMuiTheme from '../styles/getMuiTheme';
import Menu from '../Menu';
import MenuItem from '../MenuItem';
import RaisedButton from '../RaisedButton';
import TestUtils from 'react-dom/test-utils';
import keycode from 'keycode';
import PropTypes from 'prop-types';
import {spy} from 'sinon';

describe('<Popover />', () => {
  const muiTheme = getMuiTheme();
  const shallowWithContext = (node) => shallow(node, {context: {muiTheme}});
  const mountWithContext = (node) => mount(node, {
    context: {muiTheme},
    childContextTypes: {muiTheme: PropTypes.object},
  });

  describe('state: closing', () => {
    it('should not create new timeout when popover is already closing', () => {
      const wrapper = shallowWithContext(<Popover open={true} />);

      wrapper.setProps({open: false});
      const timeout = wrapper.instance().timeout;

      wrapper.setProps({open: false});
      const nextTimeout = wrapper.instance().timeout;

      assert.strictEqual(timeout, nextTimeout);
    });
  });

  describe('unmounting', () => {
    it('should stop listening correctly', (done) => {
      const wrapper = mountWithContext(<Popover open={true} />);

      // Ensure layering has been set up correctly before simulation
      setTimeout(() => {
        wrapper.instance().handleScroll();
        wrapper.instance().handleScroll();
        wrapper.unmount();
      }, 10);

      setTimeout(() => {
         // Wait for the end of the throttle. Makes sure we don't crash.
        done();
      }, 100);
    });
  });

  describe('prop: animated', () => {
    it('should use a Paper when animated if false', () => {
      const wrapper = shallowWithContext(<Popover open={true} animated={false} />);
      const Layer = () => wrapper.instance().renderLayer();
      const layerWrapper = shallowWithContext(<Layer />);

      assert.strictEqual(layerWrapper.find(Paper).length, 1);
    });

    it('should use an animation when animated if true', () => {
      const wrapper = shallowWithContext(<Popover open={true} animated={true} />);
      const Layer = () => wrapper.instance().renderLayer();
      const layerWrapper = shallowWithContext(<Layer />);

      assert.strictEqual(layerWrapper.find(PopoverAnimationDefault).length, 1);
    });
  });

  describe('IOS detection', () => {
    // skip tests on PhantomJS because __defineGetter__ method seems not working
    if (/PhantomJS/.test(window.navigator.userAgent)) {
      return;
    }

    let input;

    beforeEach(() => {
      input = document.createElement('input');
      document.body.appendChild(input);
      input.focus();
    });

    afterEach(() => {
      input.remove();
    });

    const getBoundingClientRect = () => ({
      x: 10,
      y: 10,
      width: 10,
      height: 10,
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    });

    const el = {
      offsetHeight: 10,
      offsetWidth: 10,
      offsetParent: {
        offsetTop: 10,
        offsetParent: null,
      },
      offsetTop: 10,
      getBoundingClientRect,
    };
    /* eslint-disable max-len */
    const userAgents = [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53',
      'Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53',
      'Mozilla/5.0 (iPod; U; CPU like Mac OS X; en) AppleWebKit/420.1 (KHTML, like Gecko) Version/3.0 Mobile/3A101a Safari/419.3',
      'Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0)',
      'Mozilla/5.0 (Linux; Android 4.4.4; Nexus 7 Build/KTU84Q) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/33.0.0.0 Safari/537.36',
      'Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.1.0.346 Mobile Safari/534.11+',
    ];
    /* eslint-enable max-len */

    userAgents.forEach((agent) => {
      it(`should use normal positioning for ${agent}`, () => {
        window.navigator.__defineGetter__('userAgent', () => agent); // eslint-disable-line no-underscore-dangle,max-len
        const wrapper = mountWithContext(<Popover open={true} animated={true} />);
        const result = wrapper.instance().getAnchorPosition(el);
        const expected = {bottom: 10, top: 10, center: 10, left: 10, right: 10, middle: 10, height: 10, width: 10};
        assert.deepEqual(result, expected);
      });
    });

    after(() => {
      window.navigator.__defineGetter__('userAgent', function getUserAgent() { // eslint-disable-line no-underscore-dangle,max-len
        return `${this.appCodeName}/${this.appVersion}`;
      });
    });
  });
  describe('a11y tests', () => {
    const keycodeEvent = (key) => ({keyCode: keycode(key)});
    it('esc key should request close ', () => {
      const escSpy = spy();
      const wrapper = mountWithContext(
        <Popover
          open={true}
          onRequestClose={escSpy}
        >
          <Menu>
            <MenuItem id="test-menu-item" primaryText="menu 1" />
            <MenuItem primaryText="menu 2" />
          </Menu>
        </Popover>
      );

      // popover reneders directly into document... so find a component on
      // our popover to simulate the esc against
      const node = document.getElementById('test-menu-item');
      // simulate a key being pressed
      TestUtils.Simulate.keyDown(node, keycodeEvent('down'));
      // check our onRequestClose handler was not called
      assert.isNotOk(escSpy.called);
      // simulate our esc key being pressed
      TestUtils.Simulate.keyDown(node, keycodeEvent('esc'));
      // check our onRequestClose handler was called
      assert.isOk(escSpy.called);
      // unmount our component since we are done
      wrapper.unmount();
    });
    it('should return focus when dismissed ', () => {
      class TestPopover1 extends React.Component {

        constructor(props) {
          super(props);

          this.state = {
            open: false,
          };
        }

        handleTouchTap = (event) => {
          // This prevents ghost click.
          event.preventDefault();

          this.setState({
            open: true,
            anchorEl: event.currentTarget,
          });
        };

        handleRequestClose = () => {
          this.setState({
            open: false,
          });
        };

        render() {
          return (
            <div id="mak">
              <RaisedButton
                onClick={this.handleTouchTap}
                label="Click me"
                id="test-button"
              />
              <Popover
                open={this.state.open}
                anchorEl={this.state.anchorEl}
                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                onRequestClose={this.handleRequestClose}
              >
                <Menu>
                  <MenuItem id="test-menu-item" primaryText="menu item 1" />
                </Menu>
              </Popover>
            </div>
          );
        }
      }
      // render our test component
      const wrapper = mountWithContext(
        <TestPopover1 />
      );

      // make sure our button has focus to start with
      const origin = wrapper.find('button').getDOMNode();
      origin.focus();
      assert.equal(origin.id, document.activeElement.id);

      // click our button to open our popover
      TestUtils.Simulate.click(origin);

      // check our popover is open and has focus
      const pop = document.activeElement;
      assert.notEqual(pop.id, origin.id);
      assert.equal(pop.id, 'test-menu-item');

      // simulate our esc key being pressed to dismiss the popover
      TestUtils.Simulate.keyDown(pop, keycodeEvent('esc'));
      // check focus has returned to our button, need to wait on it closing!!
      setTimeout(() => {
        assert.equal(origin.id, document.activeElement.id);
        // unmount our component since we are done
        wrapper.unmount();
      }, 100);
    });
  });
});
