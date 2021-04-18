import React from "react";
import checkPropTypes from "check-prop-types";

import { shallow } from "enzyme";

/**
 * Factory function to create a ShallowWrapper for the App component.
 * @function setup
 * @param {ReactElement} Component - A React component [class | functional].
 * @param {object} props - Component props specific to this setup.
 * @param {object} state - Initial state for setup.
 * @returns {ShallowWrapper}
 */
export const setup = (Component, props = {}, state = null) => {
  const wrapper = shallow(<Component {...props} />);
  // setState is for class component only
  if (state) wrapper.setState(state);
  return wrapper;
};

/**
 * Return ShallowWrapper containing node(s) with the given data-test value.
 * @function findByTestAttr
 * @param {ShallowWrapper} wrapper - Enzyme shallow wrapper to search within.
 * @param {string} val - Value of data-test attribute to be found.
 * @returns {ShallowWrapper}
 */
export const findByTestAttr = (wrapper, val) => {
  return wrapper.find(`[data-test="${val}"]`);
};

/**
 * @function checkProps
 * @param {ReactElement} Component - React Component.
 * @param {any} confirmingProps - props to be confirmed.
 */
export const checkProps = (Component, confirmingProps) => {
  const propError = checkPropTypes(
    Component.propTypes,
    confirmingProps,
    "prop",
    Component.name
  );

  expect(propError).toBeUndefined();
};
