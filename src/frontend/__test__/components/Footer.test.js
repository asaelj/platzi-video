import React from 'react';
import { mount } from 'enzyme';
import { create } from 'react-test-renderer';
import Footer from '../../components/Footer';

describe('<Footer />', () => {
  const footer = mount(<Footer />);
  //Comprueba que exista el componente
  test('Render Footer Component', () => {
    expect(footer.length).toEqual(1);
  });

  //Comprueba que contenga los 3 enlaces
  test('Footer haves 3 anchors', () => {
    expect(footer.find('a')).toHaveLength(3);
  });

  test('Footer snapshot', () => {
    const footer = create(<Footer />);
    expect(footer.toJSON()).toMatchSnapshot();
  });

});
