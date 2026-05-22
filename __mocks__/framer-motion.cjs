const React = require('react');

const AnimatePresence = ({ children }) => children;

const motion = new Proxy(
  {},
  {
    get: (_, tag) =>
      React.forwardRef(({ children, initial, animate, exit, transition, variants, ...rest }, ref) =>
        React.createElement(tag, { ...rest, ref }, children)
      ),
  }
);

module.exports = { AnimatePresence, motion };
