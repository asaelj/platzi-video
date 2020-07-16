import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { getVideoSearch } from '../actions';
import SearchList from './SearchList';
import '../assets/styles/components/Search.scss';

const Search = (props, { isHome }) => {
  const { search } = props;
  const inputStyle = classNames('input', {
    isHome,
  });

  const handleSearch = (event) => {
    const iValue = event.target.value;
    props.getVideoSearch(iValue);
  };

  return (
    <section className='main'>
      <h2 className='main__title'>¿Qué quieres ver hoy?</h2>
      <input
        type='text'
        className={inputStyle}
        placeholder='Buscar...'
        onInput={handleSearch}
        // eslint-disable-next-line no-param-reassign
        onBlur={(event) => { event.target.value = ''; }}
      />
      {
        search.length > 0 && (
          <div className='search-result'>
            <ul>
              {// eslint-disable-next-line react/jsx-props-no-spreading
                search.map((item) => (<SearchList key={item.id} {...item} />))
              }
            </ul>
          </div>
        )
      }
    </section>
  );
};

const mapDispatchToProps = {
  getVideoSearch,
};

const mapStateToProps = (state) => {
  return {
    search: state.search,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
