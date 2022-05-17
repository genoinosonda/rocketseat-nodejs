const express = require('express');

const app = express();


app.get("/cursos", (request, response) => {
    return response.json(["Curso 1", "Curso 02", "Curso 03"]);
})

app.post("/cursos", (req, res) => {
    return res.json(["Curso 1", "Curso 02", "Curso 03"]);
})

app.put("/cursos/:id", (req, res) => {
    return res.json(["Curso 1", "Curso 02", "Curso 03"]);
})

app.patch("/cursos/:id", (req, res) => {
    return res.json(["Curso 1", "Curso 02", "Curso 03"]);
})

app.delete("/cursos/:id", (req, res) => {
    return res.json(["Curso 1", "Curso 02", "Curso 03"]);
})

app.listen(3333);