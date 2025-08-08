import express from "express"

const app = express();

app.get("/", (req, res) => {
    res.send("Prueba");
});

app.listen(5005, () => {
    console.log("Servidor abierto en el puerto 5005");
});