import axios from 'axios';

const baseUrl = '/api/persons';

const create = newObject => {
  return axios.post(baseUrl, newObject)
    .then(response => response.data)
    .catch(error => {
      console.error('Error creating person:', error.response.data.error);
      throw error; // Hata iletisini üst bileşene iletmek için hata fırlatılır
    });
};

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating person:', error.response.data.error);
      throw error;
    });
};

export default { create, update };
