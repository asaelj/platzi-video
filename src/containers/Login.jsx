import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { loginRequest } from '../actions';
import '../assets/styles/components/Login.scss';
//Imagenes
import googleIcon from '../assets/static/google-icon.png';
import twitterIcon from '../assets/static/twitter-icon.png';

//De comoponente presentacional a su forma funcional
const Login = (props) => {
  const [form, setValues] = useState({
    email: '',
  });

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.loginRequest(form);
    props.history.push('/');
  };

  return (
    <>
      <Header isLogin />
      <section className='login'>
        <section className='login__container'>
          <h2 className=''>Inicia sesión</h2>
          <form className='login__container--form' action='' onSubmit={handleSubmit}>
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
            <button type='submit' className='button'>
              Iniciar sesión
            </button>
            <div className='login__container--remember-me'>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label>
                <input type='checkbox' id='cbox1' value='checkbox' />
                Recuerdame
              </label>
              <a href='/'>Olvide mi contraseña</a>
            </div>
          </form>
          <section className='login__container--social-media'>
            <div>
              <img src={googleIcon} alt='Google icon' />
              Inicia sesión con google
            </div>
            <div>
              <img src={twitterIcon} alt='Twitter icon' />
              Inicia sesión con Twitter
            </div>
          </section>
          <p className='login__container--register'>
            No tienes ninguna cuenta
            {' '}
            <Link to='/register'>Regístrate</Link>
          </p>
        </section>
      </section>
    </>
  );
};

const mapDispatchToProps = {
  loginRequest,
};

export default connect(null, mapDispatchToProps)(Login);
