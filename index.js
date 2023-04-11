// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const contractorsRouter = require('./routes/contractorRoute');
const foodsRouter = require('./routes/foodRoute');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://127.0.0.1:27017/scanteen', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Middleware for parsing request body
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req,res) => {
  res.send('Helloworld')
});

// Mount the routers for the APIs
app.use('/api/contractors', contractorsRouter);
app.use('/api/foods', foodsRouter);

// Start the server
app.listen(PORT, () => console.log(`Server is running on http://localhost:3000`));
