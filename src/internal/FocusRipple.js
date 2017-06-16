import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import shallowEqual from 'recompose/shallowEqual';
import autoPrefix from '../utils/autoPrefix';
import transitions from '../styles/transitions';
import ScaleInTransitionGroup from './ScaleIn';

const pulsateDuration = 750;

class FocusRipple extends Component {
  static propTypes = {
    id: PropTypes.string,
    color: PropTypes.string,
    innerStyle: PropTypes.object,
    opacity: PropTypes.number,
    show: PropTypes.bool,
    style: PropTypes.object,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  componentWillMount() {
    const uniqueId = `${this.constructor.name}-${Math.floor(Math.random() * 0xFFFF)}`;
    this.uniqueId = uniqueId.replace(/[^A-Za-z0-9-]/gi, '');
  }

  componentDidMount() {
    if (this.props.show) {
      this.setRippleSize();
      this.pulsate();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    );
  }

  componentDidUpdate() {
    if (this.props.show) {
      this.setRippleSize();
      this.pulsate();
    } else {
      if (this.timeout) clearTimeout(this.timeout);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  getRippleElement(props, idBase) {
    const {
      color,
      innerStyle,
      opacity,
    } = props;

    const {prepareStyles, ripple} = this.context.muiTheme;

    const innerStyles = Object.assign({
      position: 'absolute',
      height: '100%',
      width: '100%',
      borderRadius: '50%',
      opacity: opacity ? opacity : 0.16,
      backgroundColor: color || ripple.color,
      transition: transitions.easeOut(`${pulsateDuration}ms`, 'transform', null, transitions.easeInOutFunction),
    }, innerStyle);

    const innerCircleId = idBase + '-innerCircle';

    return <div id={innerCircleId} ref="innerCircle" style={prepareStyles(Object.assign({}, innerStyles))} />;
  }

  pulsate = () => {
    const innerCircle = ReactDOM.findDOMNode(this.refs.innerCircle);
    if (!innerCircle) return;

    const startScale = 'scale(1)';
    const endScale = 'scale(0.85)';
    const currentScale = innerCircle.style.transform || startScale;
    const nextScale = currentScale === startScale ? endScale : startScale;

    autoPrefix.set(innerCircle.style, 'transform', nextScale);
    this.timeout = setTimeout(this.pulsate, pulsateDuration);
  };

  setRippleSize() {
    const el = ReactDOM.findDOMNode(this.refs.innerCircle);
    const height = el.offsetHeight;
    const width = el.offsetWidth;
    const size = Math.max(height, width);

    let oldTop = 0;
    // For browsers that don't support endsWith()
    if (el.style.top.indexOf('px', el.style.top.length - 2) !== -1) {
      oldTop = parseInt(el.style.top);
    }
    el.style.height = `${size}px`;
    el.style.top = `${(height / 2) - (size / 2 ) + oldTop}px`;
  }

  render() {
    const {
      id,
      show,
      style,
    } = this.props;

    const mergedRootStyles = Object.assign({
      height: '100%',
      width: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
    }, style);

    const baseId = id || this.uniqueId;
    const ripple = show ? this.getRippleElement(this.props, baseId) : null;

    return (
      <ScaleInTransitionGroup
        id={baseId}
        maxScale={0.85}
        style={mergedRootStyles}
      >
        {ripple}
      </ScaleInTransitionGroup>
    );
  }
}

export default FocusRipple;