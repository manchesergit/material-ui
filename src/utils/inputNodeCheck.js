import React from 'react';
import warning from 'warning';

export const HtmlForTagName = 'htmlFor';
export const InputTypeName = 'input';
export const a11yButtonTagsToTest = [HtmlForTagName, 'aria-labelledby', 'aria-describedby'];

/*
 * Check if the children have an input node.
 * If there is an input node, check that it meets the a11y tag requirements :
 * Must have all of the tags listed in the a11yTagsToTest array.
 * If any of the tags are missing a warning will be output.
 * Input : componentId - the ID of the component being checked or null.
 *         children    - the child nodes of the component being checked or null.
 *         excludeTag  - any tag of which the tests should be expcitly ignored.
 */
export function checkChildrenInputWitha11y(componentId, children, excludeTag) {
  if (children !== null) {
    // tags to test for in the children
    const elementId = componentId !== null ? `Element [id: ${componentId}]:` : '';
    const identity = `Material-UI: ${elementId}`;

    React.Children.forEach(children, (child) => {
      if (child !== null) {
        if (child.type === InputTypeName) {
          for (let index = 0; index < a11yButtonTagsToTest.length; index++) {
            const tagToTest = a11yButtonTagsToTest[index];
            if (((tagToTest !== excludeTag)) && (!child.props.hasOwnProperty(tagToTest))) {
              const message = `${identity} Buttons with a child <input> element should should contain the property '${tagToTest}' inside the input tag.`;
              warning(false, message);
            }
          }
        }
      }
    });
  }
};
