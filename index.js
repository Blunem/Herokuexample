const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}


//Morgan Log
var morgan = require('morgan')
morgan.token('body', function getBody (req) {
    let body = 'No data'
    if (req.method === 'POST' )
        body = JSON.stringify(req.body)
    return body
  })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body' ))


///HTPP
app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
      response.json(person)
    })
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body)
      if (!body.name)
          return response.status(400).json({error: 'name missing'}) 
      
      if (!body.number)
          return response.status(400).json({error: 'number missing'}) 
  
      const person = new Person({
        name: body.name,
        number: body.number,
      })
      person.save().then(savedNote => {
        response.json(savedNote)
      })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if(person)
      response.json(person)
    else
      response.status(404).end()
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {response.status(204).end()})
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {response.json(updatedPerson)})
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
    Person.find({}).then(person => {
      response.send(`<div>the phonebook has info from ${person.length} people </div><hr> <div>${new Date ()}</div>`)
    })
  })

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})







// const express = require('express')
// const app = express()

// app.use(express.json())

// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }

// app.use(requestLogger)

// let notes = [
//   {
//     id: 1,
//     content: "HTML is easy",
//     date: "2020-01-10T17:30:31.098Z",
//     important: true
//   },
//   {
//     id: 2,
//     content: "Browser can execute only Javascript",
//     date: "2020-01-10T18:39:34.091Z",
//     important: false
//   },
//   {
//     id: 3,
//     content: "GET and POST are the most important methods of HTTP protocol",
//     date: "2020-01-10T19:20:14.298Z",
//     important: true
//   }
// ]

// app.get('/', (req, res) => {
//   res.send('<h1>Hello World!</h1>')
// })

// app.get('/api/notes', (req, res) => {
//   res.json(notes)
// })

// const generateId = () => {
//   const maxId = notes.length > 0
//     ? Math.max(...notes.map(n => n.id))
//     : 0
//   return maxId + 1
// }

// app.post('/api/notes', (request, response) => {
//   const body = request.body

//   if (!body.content) {
//     return response.status(400).json({ 
//       error: 'content missing' 
//     })
//   }

//   const note = {
//     content: body.content,
//     important: body.important || false,
//     date: new Date(),
//     id: generateId(),
//   }

//   notes = notes.concat(note)

//   response.json(note)
// })

// app.get('/api/notes/:id', (request, response) => {
//   const id = Number(request.params.id)
//   const note = notes.find(note => note.id === id)

//   if (note) {
//     response.json(note)
//   } else {
//     response.status(404).end()
//   }
// })

// app.delete('/api/notes/:id', (request, response) => {
//   const id = Number(request.params.id)
//   notes = notes.filter(note => note.id !== id)

//   response.status(204).end()
// })

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: 'unknown endpoint' })
// }

// app.use(unknownEndpoint)

// const PORT = 3001
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })


// Version 2

// const express = require('express')
// const app = express()
// const cors = require('cors')
// require('dotenv').config()


// app.use(express.static('build'))
// app.use(cors())
// app.use(express.json())

// var morgan = require('morgan')
// morgan.token('body', function getBody (req) {
//     let body = 'No data'
//     if (req.method === 'POST' )
//         body = JSON.stringify(req.body)
//     return body

//   })
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body' ))



// // const requestLogger = (request, response, next) => {
// //   console.log('Method:', request.method)
// //   console.log('Path:  ', request.path)
// //   console.log('Body:  ', request.body)
// //   console.log('---')
// //   next()
// // }

// // app.use(requestLogger)

// let persons = [ 
//     {
//       "name": "Arto Hellas",
//       "number": "040-123456",
//       "id": 1
//     },
//     {
//       "name": "Ada Lovelace",
//       "number": "39-44-5323523",
//       "id": 2
//     },
//     {
//       "name": "Dan Abramov",
//       "number": "12-43-234345",
//       "id": 3
//     },
//     {
//       "name": "Mary Poppendieck",
//       "number": "39-23-6423122",
//       "id": 4
//     }
// ]

// app.get('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     const person = persons.find(person => person.id === id)
//     person? response.json(person): response.status(404).end()
// })

// app.delete('/api/persons/:id', (request, response) => {
//     const id = Number(request.params.id)
//     const person = persons.filter(person => person.id === id)
//     persons = persons.filter(person => person.id !== id)
//     response.status(204).end()
//   })

// app.get('/', (request, response) => {
//   response.send('<h1>Hello World!</h1>')
// })

// app.get('/api/persons', (request, response) => {
//   response.json(persons)
// })

// const getRandomId = max => Math.floor(Math.random() * max)
// const isThere = (personSet, name) => {
//     const lowerPattern = name.toLowerCase()
//     const result = personSet.find(element =>  element.name.toLowerCase() === lowerPattern)
//     return result
//   }

// app.post('/api/persons', (request, response) => {

//     const body = request.body
//     // console.log("HTTP Content-Type", request.get('Content-Type'))
//     // console.log("Name:", person.name)

//     if (!body.name)
//         return response.status(400).json({error: 'name missing'}) 
    
//     if (!body.number)
//         return response.status(400).json({error: 'number missing'}) 

//     if (isThere(persons,body.name))
//         return response.status(400).json({error: 'The name already exists in the phonebook'}) 

//     const person = {
//       name: body.name,
//       number: body.number,
//       id: getRandomId(2000)
//     }
  
//     persons = persons.concat(person)
//     response.json(person)
//   })

// app.get('/info', (request, response) => {
//     response.send(`<div>the phonebook has info from ${persons.length} persons</div><hr> <div>${new Date ()}</div>`)
//     console.log(request.headers)
//   })

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: 'unknown endpoint' })
// }

// app.use(unknownEndpoint)
// const PORT = process.env.PORT
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })



