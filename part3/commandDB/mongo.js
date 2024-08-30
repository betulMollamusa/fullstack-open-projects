const mongoose = require('mongoose');

const [,, password, name, number] = process.argv;

// MongoDB bağlantı
const url = `mongodb+srv://user-791:${password}@cluster0.zdfda.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Mongoose şeması
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

// MongoDB'ye bağlanma
mongoose.connect(url)
  .then(() => {
    if (name && number) {
      // Yeni kişi ekleme
      const person = new Person({
        name,
        number,
      });
      return person.save();
    } else {
      // Tüm kişileri listeleme
      return Person.find({});
    }
  })
  .then(result => {
    if (name && number) {
      console.log(`added ${name} number ${number} to phonebook`);
    } else {
      console.log('phonebook:');
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`);
      });
    }
    mongoose.connection.close();
  })
  .catch(error => {
    console.error('Error:', error.message);
    mongoose.connection.close();
  });
