import path from "path";
import { promises as fs } from 'fs';

export default async (req, res) => {
    // Desestructurando de "req"
    let { url, method } = req;

    console.log(`📣 CLIENT-REQUEST: ${req.url} ${req.method}`);

    // Enrutando peticiones
    switch (url) {
        case '/':
            const inde = path.join(__dirname, 'index.html');
            const ind = await fs.readFile(inde);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            console.log(`📣 Respondiendo: 200 ${req.url} ${req.method}`);
            // Estableciendo codigo de respuesta
            res.statusCode = 200;
            res.end(ind);
            break;
        //caso author
        case '/author':
            // Peticion raiz
            const auth = path.join(__dirname, 'author.html');
            const aut = await fs.readFile(auth);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            console.log(`📣 Respondiendo: 200 ${req.url} ${req.method}`);
            // Estableciendo codigo de respuesta
            res.statusCode = 200;
            res.end(aut);
            break;
        case "/favicon.ico":
            const fav = await fs.readFile("favicon.ico");
            res.writeHead(200, { 'Content-Type': 'image/x-icon' });
            res.end(fav);
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
                const dat = path.join(__dirname, '404.html');
                const data = await fs.readFile(dat);
                res.writeHead(200, { 'Content-Type': 'text/html' });
                console.log(`📣 Respondiendo: 404 ${req.url} ${req.method}`);
                // Estableciendo codigo de respuesta
                res.statusCode = 404;
                res.end(data);
            }
            break;
        default:
            // Estableciendo cabeceras
            const err = path.join(__dirname, '404.html');
            const err404 = await fs.readFile(err);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            console.log(`📣 Respondiendo: 404 ${req.url} ${req.method}`);
            // Estableciendo codigo de respuesta
            res.statusCode = 404;
            res.end(err404);
            break;
    }
};
