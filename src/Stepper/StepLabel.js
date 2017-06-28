import React from 'react';
import PropTypes from 'prop-types';
import CheckCircle from '../svg-icons/action/check-circle';
import SvgIcon from '../SvgIcon';

const getStyles = ({active, completed, disabled}, {muiTheme, stepper}) => {
  const {
    textColor,
    disabledTextColor,
    iconColor,
    inactiveIconColor,
  } = muiTheme.stepper;
  const {baseTheme} = muiTheme;
  const {orientation} = stepper;

  const styles = {
    root: {
      height: orientation === 'horizontal' ? 72 : 64,
      color: textColor,
      display: 'flex',
      alignItems: 'center',
      fontFamily: baseTheme.fontFamily,
      fontSize: 14,
      paddingLeft: 14,
      paddingRight: 14,
    },
    icon: {
      color: iconColor,
      display: 'block',
      fontSize: 24,
      width: 24,
      height: 24,
    },
    iconContainer: {
      paddingRight: 8,
    },
  };

  if (active) {
    styles.root.fontWeight = 500;
  }

  if (!completed && !active) {
    styles.icon.color = inactiveIconColor;
  }

  if (disabled) {
    styles.icon.color = inactiveIconColor;
    styles.root.color = disabledTextColor;
    styles.root.cursor = 'default';
  }

  return styles;
};

const renderIcon = (completed, icon, styles, baseId) => { // eslint-disable-line no-unused-vars
  const iconType = typeof icon;

  if (iconType === 'number' || iconType === 'string') {
    if (completed) {
      const circleId = `${baseId}-${iconType}-CheckCircle`;
      return (
        <CheckCircle
          id={circleId}
          color={styles.icon.color}
          style={styles.icon}
        />
      );
    }

    const svgIconId = `${baseId}-Icon`;
    const textId = `${baseId}-Text`;
    const circleId = `${baseId}-circle`;

    return (
      <SvgIcon id={svgIconId} color={styles.icon.color} style={styles.icon}>
        <circle
          id={circleId}
          cx="12"
          cy="12"
          r="10"
        />
        <text
          id={textId}
          x="12"
          y="16"
          textAnchor="middle"
          fontSize="12"
          fill="#fff"
        >
          {icon}
        </text>
      </SvgIcon>
    );
  }

  return icon;
};

const StepLabel = (props, context) => {
  const {
    active, // eslint-disable-line no-unused-vars
    children,
    completed,
    id,
    icon: userIcon,
    iconContainerStyle,
    labelledById,
    last, // eslint-disable-line no-unused-vars
    style,
    ...other
  } = props;

  const uniqueIdBase = `StepLabel-${Math.floor(Math.random() * 0xFFFF)}`;
  const uniqueId = uniqueIdBase.replace(/[^A-Za-z0-9-]/gi, '');
  const baseId = id || uniqueId;

  const {prepareStyles} = context.muiTheme;
  const styles = getStyles(props, context);
  const icon = renderIcon(completed, userIcon, styles, baseId);

  const rootSpanId = `${baseId}-labelRootSpan`;
  const iconSpanId = `${baseId}-labelIconSpan`;
  const labelledBy = labelledById || `${baseId}-label`;

  return (
    <span
      id={rootSpanId}
      aria-labelledby={labelledBy}
      style={prepareStyles(Object.assign(styles.root, style))}
      {...other}
    >
      {icon && (
        <span id={iconSpanId} style={prepareStyles(Object.assign(styles.iconContainer, iconContainerStyle))}>
          {icon}
        </span>
      )}
      <div id={labelledBy}>
        {children}
      </div>
    </span>
  );
};

StepLabel.muiName = 'StepLabel';

StepLabel.propTypes = {
  /**
   * Sets active styling. Overrides disabled coloring.
   */
  active: PropTypes.bool,
  /**
   * The label text node
   */
  children: PropTypes.node,
  /**
   * Sets completed styling. Overrides disabled coloring.
   */
  completed: PropTypes.bool,
  /**
   * Sets disabled styling.
   */
  disabled: PropTypes.bool,
  /**
   * The icon displayed by the step label.
   */
  icon: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.number,
  ]),
  /**
   * Override the inline-styles of the icon container element.
   */
  iconContainerStyle: PropTypes.object,
  /**
   * The id value used for the component.
   * This will be used as a base for all child components also.
   * If not provided the class name along with appropriate properties and a random number will be used.
   */
  id: PropTypes.string,
  /**
  * The id to use for the text in children.
  * If this is not provided a value will be generated based on the ID for this object.
  */
  labelledById: PropTypes.string,
  /**
   * @ignore
   */
  last: PropTypes.bool,
  /**
   * Override the inline-style of the root element.
   */
  style: PropTypes.object,
};

StepLabel.contextTypes = {
  muiTheme: PropTypes.object.isRequired,
  stepper: PropTypes.object,
  id: PropTypes.string,
};

export default StepLabel;
