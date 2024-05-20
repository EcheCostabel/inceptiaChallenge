2.1) ¿Cómo implementarías las acciones del frontend utilizando redux? (por ejemplo autenticación, solicitud de clientes activos para el usuario y solicitud de casos por cliente)

  Para este punto lo que yo haría es:
    En primer lugar crear y configurar el Store. El Store es un objeto que contiene el estado global de la aplicación.

    En segundo lugar tendria que crear las actions. Se utilizan para enviar datos que luego se usaran para actualizar el estado de la aplicación.

    En tercer lugar viene la creación de los reducers. Estos se encargan de manejar los cambios de estado a partir de las actions.

    




2.2) Si quisiéramos agregar una ruta nueva a la app, ¿cómo reestructurarías el index.js?

  En primer lugar pienso si la ruta va a ser pública o privada.
  Si la ruta va a ser privada puedo colocarla dentro de un componente (en mi caso DefaultLayout.tsx). Dentro de este componente puedo crear un enrutamiento exclusivo de rutas privadas. Luego se busca la forma lógica para no llegar a las rutas públicas estando logeado, o viceversa.

  Si la ruta va a ser publica, simplemente la agrego dentro del App.tsx, estableciendo el path y el elemendo a renderizar. 

  Siempre teniendo en cuenta el uso de react-router-dom para el enrutamiento