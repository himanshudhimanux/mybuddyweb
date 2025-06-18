import axios from 'axios';

export const fetchBatches = async () => {
  const response = await axios.get('/batches');
  return response.data; // Adjust according to your API structure
};

export const fetchTeachers = async () => {
  const response = await axios.get('/teachers');
  return response.data;
};

export const fetchSubjects = async () => {
  const response = await axios.get('/subjects');
  return response.data;
};
