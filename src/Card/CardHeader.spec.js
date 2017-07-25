/* eslint-env mocha */
import React from 'react';
import {render} from 'enzyme';
import {assert} from 'chai';
import CardHeader from './CardHeader';
import getMuiTheme from '../styles/getMuiTheme';

describe('<CardHeader />', () => {
  const muiTheme = getMuiTheme();
  const renderedWithContext = (node) => render(node, {context: {muiTheme}});

  describe('Images have alt tags', () => {
    it('should have an alt tag for an avatar with an image', () => {
      const wrapper = renderedWithContext(
        <CardHeader
          title="avatar test"
          subtitle="the bit under"
          avatar="obidiah.png"
        />
      );
      const img = wrapper.find('img');
      const alt = img.get(0).attribs.alt;

      assert.ok(alt, 'there should have been an alt tag on the image in the avatar');
    });
  });
});
