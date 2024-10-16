import React from 'react';
import renderer from 'react-test-renderer';
import Button from '../Button';

test('it renders correctly with a label', () => {
  const tree = renderer
    .create(<Button label="Click Me" />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
