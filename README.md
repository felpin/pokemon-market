# Pokemon Market

Pagarme application test

## Considerations

### HTTPS

This project runs a HTTPS server, so you will need a certificate
You can generate a self signed certificate to your localhost on [http://www.selfsignedcertificate.com/](http://www.selfsignedcertificate.com/)

### Environment variables

Below there is a list of the environment variables needed for this project:

```
APP_PORT=<Port on where to run the server>

PAGARME_API_KEY=<Pagarme API key>

SSL_CRT=<Location of the self signed certificate crt file>
SSL_KEY=<Location of the self signed certificate key file>
```

*Remember that you can use [dotenv](https://yarnpkg.com/pt-BR/package/dotenv)*

## Running the application

To install dependencies run the command

```
yarn
```

To run the application, execute the command

```
yarn start
```

To run the tests, execute the command

```
yarn test
```