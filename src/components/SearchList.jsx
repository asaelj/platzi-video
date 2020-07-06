import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/components/SearchList.scss';

const SearchList = (props) => {
  const { id, title } = props;
  return (
    <Link className='search-result__item' to={`/player/${id}`}>
      <li>{title}</li>
    </Link>
  );
};

export default SearchList;
