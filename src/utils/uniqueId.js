/*
 * Make a unique id for an element, comprising of its name and random number.
 * Any spaces in the name will be removed.
 * input : element - the element to make the unique id for
 * return : the unique id for the element or a blank string if the input is null.
 */
export default function makeUniqueIdForElement(element) {
  if (element === null) {
    return '';
  }

  const inputType = ({}).toString.call(element).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  let name = 'undefinedElement';

  if (inputType === 'string') {
    name = element;
  } else if (inputType === 'object') {
    name = element.constructor.name;
  }

  const uniqueId = `${name}-${Math.floor(Math.random() * 0xFFFF)}`;
  return uniqueId.replace(/[^A-Za-z0-9-]/gi, '');
};
