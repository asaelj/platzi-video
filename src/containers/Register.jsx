import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { registerRequest } from '../actions';
import '../assets/styles/components/Login.scss';

const Register = (props) => {

  const [form, setValues] = useState({
    email: '',
    name: '',
    password: '',
  });

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSumbmit = (event) => {
    event.preventDefault();
    props.registerRequest(form);
    props.history.push('/');
  };

  return (
    <>
      <Header isRegister />
      <section className='login'>
        <section className='login__container'>
          <h2 className=''>Regístrate</h2>
          <form className='login__container--form' onSubmit={handleSumbmit}>
            <input
              name='name'
              type='text'
              className='input'
              placeholder='Nombre'
              onChange={handleInput}
            />
            <input
              name='email'
              type='text'
              className='input'
              placeholder='Correo'
              onChange={handleInput}
            />
            <input
              name='password'
              type='password'
              className='input'
              placeholder='Contraseña'
              onChange={handleInput}
            />
            <button className='button' type='submit'>Registrarme</button>
          </form>
          <p className='login__container--register center-text'>
            <Link to='/login'>Iniciar sesión</Link>
          </p>
        </section>
      </section>
    </>
  );
};

const mapDispatchToProps = {
  registerRequest,
};

export default connect(null, mapDispatchToProps)(Register);
