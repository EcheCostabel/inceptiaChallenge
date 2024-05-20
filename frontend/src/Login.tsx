import React, { useState } from 'react';
import { Col, Container, Row, Form, FormGroup, Label, Button } from 'reactstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import logoIceptIA from './assets/inceptia.png';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import axiosInstance from './axios';

export default function Login() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Ingrese un email válido').required('El campo email es requerido'),
    password: Yup.string().required('El campo contraseña es requerido')
  });

  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  return (
    isAuthenticated()
    ? <Navigate to='/' />
    :
    <Container fluid className='vh-100 d-flex flex-column align-items-center justify-content-center'>
      <Row className='w-100 justify-content-center'>
        <Col xs={12} md={6} className='text-center'>
          <Link target='_blank' to='https://www.inceptia.ai/'>
            <img src={logoIceptIA} alt='banner inceptia' className='img-fluid' />
          </Link>
        </Col>
      </Row>
      <Row className='col-6 d-flex justify-content-center pt-5'>
        <Col xs={12} md={6}>
          <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={LoginSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const response = await axiosInstance.post(`/api/v1/login/`, values);
                  localStorage.setItem('token', response.data.token);
                  navigate('/');
                } catch (error) {
                  setError('El email o la contraseña son incorrectos');
                  setSubmitting(false);
                }
              }}
            >
              {({ handleSubmit, isSubmitting }) => (
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label for='email'>Email</Label>
                    <Field
                      name='email'
                      type='email'
                      className='form-control'
                    />
                    <ErrorMessage name='email' component='div' className='text-danger' />
                  </FormGroup>
                  <FormGroup>
                    <Label for='password'>Contraseña</Label>
                    <Field
                      name='password'
                      type='password'
                      className='form-control'
                    />
                    <ErrorMessage name='password' component='div' className='text-danger' />
                  </FormGroup>
                  {error && <div className='text-danger mb-3'>{error}</div>}
                  <Button type='submit' outline={true} color='primary' disabled={isSubmitting}>
                    {isSubmitting ? 'Cargando...' : 'Login'}
                  </Button>
                </Form>
              )}
          </Formik>
        </Col>
      </Row>
      <Col className='d-flex flex-grow align-items-end pb-3'>
        <Label>Developed by <Link className='text-primary text-decoration-none' target='_blank' to='https://www.linkedin.com/in/exequiel-costabel-2b09b2239/'>Exequiel Costabel</Link></Label> 
      </Col>
    </Container>
  );
}
