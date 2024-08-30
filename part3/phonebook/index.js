require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person'); // Person Mongoose modelini içe aktar
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

// Morgan logger ile HTTP isteklerini loglama
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// GET: Tüm kişileri getir
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons);
    })
    .catch(error => next(error));
});

// GET: Tek bir kişiyi ID ile getir
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

// DELETE: Bir kişiyi ID ile sil
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id) 
    .then(result => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).send({ error: 'person not found' });
      }
    })
    .catch(error => next(error));
});

// POST: Yeni bir kişi ekle
app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body;

  const person = new Person({ name, number });

  person.save()
    .then(savedPerson => {
      response.json(savedPerson);
    })
    .catch(error => next(error));
});

// PUT: Var olan bir kişiyi güncelle
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body;

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson);
      } else {
        response.status(404).send({ error: 'person not found' });
      }
    })
    .catch(error => next(error));
});

// INFO: Uygulama bilgilerini getir
app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      const info = `<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`;
      response.send(info);
    })
    .catch(error => next(error));
});

// Error Handler Middleware
app.use((error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
});

// Sunucuyu dinlemeye başlat
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
