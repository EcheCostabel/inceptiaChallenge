import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Input, Label, Row, Table } from "reactstrap";
import axiosInstance from "./axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { MdLogout } from "react-icons/md";
import "./App.css";

interface Client {
  id: number;
  name: string;
  alias: string;
}

interface ClientData {
  last_updated: string;
  case_uuid: string;
  phone: number;
  case_duration: string;
  status: string;
}
export default function Dashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientData, setClientData] = useState<ClientData[]>([]);
  const [botId, setBotId] = useState<number | undefined>(undefined);

  const navigate = useNavigate()

  const validationSchema = Yup.object().shape({
    desde: Yup.date(),
    hasta: Yup.date().min(
      Yup.ref("desde"),
      'La fecha debe ser posterior a "Desde"'
    ),
  });

  useEffect(() => {
    try {
      axiosInstance
        .get("/api/v1/clients/")
        .then((response) => setClients(response.data));
    } catch (error) {
      console.error(error);
    }
  }, []);

  const getBotData = async (id: number) => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/inbound-case/?bot=${id}`
      );
      setClientData(response.data.results);
      setBotId(id);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login')
  }

  return (
    <Row className="vh-100 d-flex">
      <Col md={2} className="sidebar bg-primary">
        <Label className="px-3 pt-4 fs-4 text-white">Cliente</Label>
        {clients &&
          clients.map((client) => (
            <Button
              className="w-100 text-start"
              onClick={() => getBotData(client.id)}
              color="info"
              key={client.id}
            >
              {client.name}
            </Button>
          ))}
      </Col>
      <Col md={10} className="main-content bg-light pt-4 px-4">
        <Col className="d-flex justify-content-between">
          <Label>Reportes</Label>
          <Button color="transparent" className="d-flex gap-2 align-items-center" onClick={() => logout()}>
            Cerrar sesión
            <MdLogout className="fs-3" />
          </Button>
        </Col>
        <Formik
          initialValues={{ desde: "", hasta: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            const { desde, hasta } = values;
            const url = `/api/v1/inbound-case/?bot=${botId}&local_updated__date__gte=${desde}&local_updated__date__lte=${hasta}`;
            try {
              axiosInstance.get(url).then((response) => {
                setClientData(response.data.results);
                setSubmitting(false);
              });
            } catch (error) {
              setSubmitting(false);
              console.error(error);
            }
          }}
        >
          {({ isSubmitting, resetForm }) => (
            <Form>
              <Col
                xs={12}
                className="d-flex justify-content-between align-items-center"
              >
                <Label>Detalle</Label>
                <Col md={5} className="d-flex gap-3">
                  <Col className="d-flex flex-column">
                    <Label>Desde</Label>
                    <Field type="date" name="desde" as={Input} />
                    <ErrorMessage
                      name="desde"
                      component="div"
                      className="text-danger"
                    />
                  </Col>
                  <Col className="d-flex flex-column">
                    <Label>Hasta</Label>
                    <Field type="date" name="hasta" as={Input} />
                    <ErrorMessage
                      name="hasta"
                      component="div"
                      className="text-danger"
                    />
                  </Col>
                </Col>
              </Col>
              <Col className="d-flex justify-content-end pt-3 pe-3 gap-3">
                <Button
                  type="button"
                  color="secondary"
                  outline={true}
                  onClick={() => resetForm()}
                  disabled={isSubmitting}
                >
                  Limpiar filtro
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  outline={true}
                  disabled={isSubmitting || !botId}
                >
                  {isSubmitting ? "Buscando..." : "Buscar"}
                </Button>
              </Col>
            </Form>
          )}
        </Formik>
        <Col>
          {!botId ? (
            <h3>Seleccione un cliente...</h3>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>Gestionado</th>
                  <th>ID Caso</th>
                  <th>Teléfono</th>
                  <th>Llamada</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {clientData &&
                  clientData.map((row) => (
                    <tr key={row.case_uuid}>
                      <td>{row.last_updated}</td>
                      <td>{row.case_uuid}</td>
                      <td>{row.phone}</td>
                      <td>{row.case_duration}</td>
                      <td>{row.status}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Col>
    </Row>
  ) 
}
