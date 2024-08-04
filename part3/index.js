const express = require("express");
const morgan = require("morgan");

morgan.token("body", function getBody(req) {
    return JSON.stringify(req.body);
});

const app = express();
app.use(express.json());
app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :body"
    )
);

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

app.get("/api/persons", (request, response) => {
    response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    const person = persons.find((p) => p.id === id);
    if (person) response.json(person);
    else response.status(404).end();
});

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    persons = persons.filter((p) => p.id !== id);
    response.status(204).end();
});

app.post("/api/persons", (request, response) => {
    const body = request.body;
    if (!body.name || !body.number) {
        return response
            .status(400)
            .json({ error: "name or number is missing" });
    }
    if (persons.find((p) => p.name === body.name))
        return response.status(400).json({ error: "name must be unique" });

    const id = Math.floor(1000000000 * Math.random()).toString();
    const person = {
        id: id,
        name: body.name,
        number: body.number,
    };
    persons.push(person);
    response.json(person);
    response.status(400).end();
});

app.get("/info", (request, response) => {
    const message = `Phonebook has info for ${persons.length} people
    <br/>${new Date()}`;
    response.send(message);
});

const PORT = 3001;
app.listen(PORT);
