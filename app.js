import path from "path";
import http from "http";
import { promises as fs } from 'fs';

export default async (req, res) => {
    // Desestructurando de "req"
    let { url, method } = req;

    console.log(`📣 CLIENT-REQUEST: ${req.url} ${req.method}`);

    // Enrutando peticiones
    switch (url) {
        case '/':
            try {
                const data = await fs.readFile("Index.html");
                res.writeHead(200, { 'Content-Type': 'text/html' });
                console.log(`📣 Respondiendo: 200 ${req.url} ${req.method}`);
                // Estableciendo codigo de respuesta
                res.statusCode = 200;
                res.end(data);
            } catch (err) {
                console.error(err);
                // Peticion raiz
                // Estableciendo cabeceras
                res.setHeader('Content-Type', 'text/html');
                // Escribiendo la respuesta
                res.write(`500.html `);
                console.log(`📣 Respondiendo: 500 ${req.url} ${req.method}`);
                console.log(`📣Error:500 ${err.message}`);
                // Estableciendo codigo de respuesta
                res.statusCode = 500;
                // Cerrando la comunicacion
                res.end();
            }

            break;
        //caso author
        case '/author':
            // Peticion raiz
            const data = await fs.readFile("author.html");
            res.writeHead(200, { 'Content-Type': 'text/html' });
            console.log(`📣 Respondiendo: 200 ${req.url} ${req.method}`);
            // Estableciendo codigo de respuesta
            res.statusCode = 200;
            res.end(data);
            break;
        case "/favicon.ico":
            try {
                const data = await fs.readFile("favicon.ico");
                res.writeHead(200, { 'Content-Type': 'image/x-icon' });
                res.end(data);
            } catch (err) {
                console.error(err);
                // Peticion raiz
                // Estableciendo cabeceras
                const data = await fs.readFile("author.html");
                res.setHeader('Content-Type', 'text/html');
                // Escribiendo la respuesta
                res.write(`500.html `);
                console.log(`📣 Respondiendo: 500 ${req.url} ${req.method}`);
                console.log(`📣Error:500 ${err.message}`);
                // Estableciendo codigo de respuesta
                res.statusCode = 500;
                // Cerrando la comunicacion
                res.end(data);
            }
            break

        case "/message":
            // Verificando si es post
            if (method === "POST") {
                // Se crea una variable para almacenar los
                // Datos entrantes del cliente
                let body = "";
                // Se registra un manejador de eventos
                // Para la recepción de datos
                req.on("data", (data => {
                    body += data;
                    if (body.length > 1e6) return req.socket.destroy();
                }));
                // Se registra una manejador de eventos
                // para el termino de recepción de datos
                req.on("end", async () => {
                    // Procesa el formulario

                    // Mediante URLSearchParams se extraen
                    // los campos del formulario
                    const params = new URLSearchParams(body);
                    // Se construye un objeto a partir de los datos
                    // en la variable params
                    const parsedParams = Object.fromEntries(params);
                    // Almacenar el mensaje en un archivo
                    await fs.writeFile('message.txt', parsedParams.message);
                    // Establecer codigo de respuesta para redirecciónamiento (302)
                    res.statusCode = 302;
                    // Estableciendo el redireccionamiento
                    res.setHeader('Location', '/');
                    // Se termina la conexion
                    return res.end();
                })
            } else {
                const data = await fs.readFile("author.html");
                res.writeHead(200, { 'Content-Type': 'text/html' });
                console.log(`📣 Respondiendo: 404 ${req.url} ${req.method}`);
                // Estableciendo codigo de respuesta
                res.statusCode = 404;
                res.end(data);
            }
            break;
        default:
            // Peticion raiz
            // Estableciendo cabeceras
            const err404 = await fs.readFile("404.html");
            res.writeHead(200, { 'Content-Type': 'text/html' });
            console.log(`📣 Respondiendo: 404 ${req.url} ${req.method}`);
            // Estableciendo codigo de respuesta
            res.statusCode = 404;
            res.end(err404);
            break;
    }
};
