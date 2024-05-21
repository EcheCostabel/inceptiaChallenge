import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Input, Label, Row, Spinner, Table } from "reactstrap";
import axiosInstance from "../axiosConfig/axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { MdLogout } from "react-icons/md";
import "../App.css";
import { Client, ClientData } from "../interfaces";



export default function Dashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientData, setClientData] = useState<ClientData[]>([]);
  const [botId, setBotId] = useState<number | undefined>(undefined);
  const [isLoading, setisLoading] = useState(false);
  const [emptyResults, setEmptyResults] = useState('')
  const navigate = useNavigate();

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
    setisLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/v1/inbound-case/?bot=${id}`
      );
      setClientData(response.data.results);
      setBotId(id);
    } catch (error) {
      console.error(error);
    } finally {
      setisLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

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
          <Button
            color="transparent"
            className="d-flex gap-2 align-items-center"
            onClick={() => logout()}
          >
            Cerrar sesión
            <MdLogout className="fs-3" />
          </Button>
        </Col>
        <Formik
          initialValues={{ desde: "", hasta: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setisLoading(true);
            const { desde, hasta } = values;
            const url = `/api/v1/inbound-case/?bot=${botId}&local_updated__date__gte=${desde}&local_updated__date__lte=${hasta}`;
            try {
              const response = await axiosInstance.get(url);
              console.log(response)
              if(response.data.results.length === 0) {
                setClientData([]);
                setEmptyResults('No existen datos en este rango de fechas')
              } else {
                setClientData(response.data.results);
                setEmptyResults('')
              }
            } catch (error) {
              console.error(error);
            } finally {
              setisLoading(false);
              setSubmitting(false);
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
                  {isSubmitting ? (
                    <div className="d-flex align-items-center gap-2">
                      <span>Buscando...</span>
                      <Spinner size="sm" />
                    </div>
                  ) : (
                    "Buscar"
                  )}
                </Button>
              </Col>
            </Form>
          )}
        </Formik>
        <Col>
          {!botId ? (
            <h3>Seleccione un cliente...</h3>
          ) : isLoading ? (
            <Col className="d-flex justify-content-center">
              <Spinner color="primary" />
            </Col>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>Gestionado</th>
                  <th>ID Caso</th>
                  <th>Teléfono</th>
                  <th>Dni</th>
                  <th>Grupo</th>
                  <th>Orden</th>
                  <th>Llamada</th>
                  <th className="text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {clientData &&
                  clientData.map((row) => (
                    <tr key={row.case_uuid}>
                      <td>{row.last_updated}</td>
                      <td>{row.case_uuid}</td>
                      <td>{row.phone}</td>
                      <td>{row.extra_metadata.dni}</td>
                      <td>{row.extra_metadata.grupo}</td>
                      <td>{row.extra_metadata.orden}</td>
                      <td>{row.case_duration}</td>
                      <td className="text-center">{row.case_result.name}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          )}
          {emptyResults && <Label>{emptyResults}</Label>}
        </Col>
      </Col>
    </Row>
  );
}
