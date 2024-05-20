import React from 'react';
import { Col, Container, Row, Form, FormGroup, Label, Button } from 'reactstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import logoIceptIA from './assets/inceptia.png';
import { useNavigate, Navigate  } from 'react-router-dom';
import axiosInstance from './axios';

export default function Login() {
  const navigate = useNavigate();
  
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Ingrse un mail válido').required('El campo email es requerido'),
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
          <img src={logoIceptIA} alt='banner inceptia' className='img-fluid' />
        </Col>
      </Row>
      <Row className='col-6 d-flex justify-content-center pt-3'>
        <Col xs={12} md={6}>
          <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={LoginSchema}
              onSubmit={async(values) =>{
                try {
                  const response = await axiosInstance.post(`/api/v1/login/`, values)
                  localStorage.setItem('token', response.data.token)
                  navigate('/')
                } catch (error) {
                  console.error(error)
                }
              }}
            >
              {({ handleSubmit }) => (
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
                  <Button type='submit' color='primary'>Login</Button>
                </Form>
              )}
          </Formik>
        </Col>
      </Row>
      <Col className='d-flex flex-grow  align-items-end pb-3'>
        <Label>Developed by Exequiel Costabel</Label>
      </Col>
    </Container>
  );
}
