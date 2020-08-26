import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { addFavorite, removeFavorite } from '../actions';
import '../assets/styles/components/CarouselItem.scss';
//Imagenes
import playIcon from '../assets/static/play-icon.png';
import plusIcon from '../assets/static/plus-icon.png';
import removeIcon from '../assets/static/remove-icon.png';

const CarouselItem = (props) => {
  const { _id, id, cover, title, year, contentRating, duration, userMovieId, isList } = props;

  const handleSetFavorite = () => {
    props.addFavorite(
      {
        _id, id, cover, title, year, contentRating, duration, userMovieId,
      },
    );
  };

  const handleDeleteFavorite = () => {
    props.removeFavorite(userMovieId, id);
  };

  return (
    <div className='carousel-item'>
      <img className='carousel-item__img' src={cover} alt={title} />
      <div className='carousel-item__details'>
        <div>
          <Link to={`/player/${id}`}>
            <img
              className='carousel-item__details--img'
              src={playIcon}
              alt='Play Icon'
            />
          </Link>
          {isList ? (
            <img
              className='carousel-item__details--img'
              src={removeIcon}
              alt='Remove Icon'
              onClick={handleDeleteFavorite}
            />
          ) :
            (
              <img
                className='carousel-item__details--img'
                src={plusIcon}
                alt='Plus Icon'
                onClick={handleSetFavorite}
              />
            )}
        </div>
        <p className='carousel-item__details--title'>{title}</p>
        <p className='carousel-item__details--subtitle'>
          {`${year} ${contentRating} ${duration}`}
        </p>
      </div>
    </div>
  );
};

CarouselItem.propTypes = {
  _id: PropTypes.string,
  id: PropTypes.string,
  cover: PropTypes.string,
  title: PropTypes.string,
  year: PropTypes.number,
  contentRating: PropTypes.string,
  duration: PropTypes.number,
};

const mapDispachToProps = {
  addFavorite,
  removeFavorite,
};

export default connect(null, mapDispachToProps)(CarouselItem);
