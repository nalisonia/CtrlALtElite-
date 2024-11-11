// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import 'mutationobserver-shim';
// setupTests.js
//import '@testing-library/jest-dom/extend-expect';

// Polyfill for MutationObserver if it's undefined
if (global.MutationObserver === undefined) {
  global.MutationObserver = class {
    constructor(callback) {}
    disconnect() {}
    observe(element, initObject) {}
  };
}

const root = document.createElement('div');
root.setAttribute('id', 'root');
document.body.appendChild(root); // Add this line for MutationObserver support
