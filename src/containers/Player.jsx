import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getVideosSource, getVideoSearch } from '../actions';
import '../assets/styles/components/Player.scss';

const Player = (props) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { id } = props.match.params;
  // eslint-disable-next-line react/destructuring-assignment
  const hasPlaying = Object.keys(props.playing).length > 0;

  useEffect(() => {
    props.getVideosSource(id);
    props.getVideoSearch('');
  },
  []);

  return hasPlaying ? (
    <div className='Player'>
      <video controls autoPlay>
        {/*eslint-disable-next-line react/destructuring-assignment*/}
        <source src={props.playing.source} type='video/mp4' />
      </video>
      <div className='Player-back'>
        <button
          type='button'
          onClick={() => props.history.goBack()}
        >
          Regresar
        </button>
      </div>
    </div>
  ) : setTimeout(() => {
    <Redirect to='/404/' />;
  }, 0);
};

const mapStateToProps = (state) => {
  return {
    playing: state.playing,
  };
};

const mapDispatchToPops = {
  getVideosSource,
  getVideoSearch,
};

export default connect(mapStateToProps, mapDispatchToPops)(Player);
