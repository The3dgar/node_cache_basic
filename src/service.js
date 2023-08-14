import axios from 'axios';

const baseURL = 'https://rickandmortyapi.com/api';
const api = axios.create({
  baseURL,
});

export const getCharacter = async () => {
  const { data } = await api.get('/character');
  return data;
};

export const getCharacterById = async (id = "") => {
  const { data } = await api.get(`/character/${id}`);
  return data;
}
