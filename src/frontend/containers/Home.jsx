import React from 'react';
import { connect } from 'react-redux';
import Header from '../components/Header';
import Search from '../components/Search';
import Categories from '../components/Categories';
import Carousel from '../components/Carousel';
import CarouselItem from '../components/CarouselItem';
//import useInitialState from '../hooks/useInitialState';
import '../assets/styles/App.scss';

//const API = 'http://localhost:3000/initalState';

const Home = ({ myList, trends, originals }) => {
  //const initialState = useInitialState(API);
  return (
    <>
      <Header />

      <Search isHome />
      {myList.length > 0 && (
        <Categories title='Mi lista'>
          <Carousel>
            {
              // eslint-disable-next-line react/jsx-props-no-spreading
              myList.map((item) => <CarouselItem key={item.id} isList {...item} />)
            }
          </Carousel>
        </Categories>
      )}
      <Categories title='Tendencias'>
        <Carousel>
          {
            // eslint-disable-next-line react/jsx-props-no-spreading
            trends.map((item) => <CarouselItem key={item.id} {...item} />)
          }
        </Carousel>
      </Categories>

      <Categories title='Originales de Paltzi Video'>
        <Carousel>
          {
            // eslint-disable-next-line react/jsx-props-no-spreading
            originals.map((item) => <CarouselItem key={item.id} {...item} />)
          }
        </Carousel>
      </Categories>
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    myList: state.myList,
    trends: state.trends,
    originals: state.originals,
  };
};

export default connect(mapStateToProps, null)(Home);
