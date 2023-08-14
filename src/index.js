import express from 'express';
import { getCharacter, getCharacterById } from './service.js';
import responseTime from 'response-time';
import client, { CACHE_CHARACTER_KEY } from './cache.js';

const app = express();
const PORT = 3000;

app.use(responseTime());

app.get('/ping', (req, res) => res.json('pong'));

app.get('/character', async (req, res) => {
  try {
    await client.connect();
    const currentCharacters = await client.get(CACHE_CHARACTER_KEY);

    if (currentCharacters) {
      await client.disconnect();
      return res.json(JSON.parse(currentCharacters));
    }

    const character = await getCharacter();
    await client.set(CACHE_CHARACTER_KEY, JSON.stringify(character));

    await client.disconnect();
    res.json(character);
  } catch (error) {
    await client.disconnect();
    console.log('error', error);
    res.status(500).json('See server logs');
  }
});

app.get('/character/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const key = "character" + '-' + id;
    await client.connect();
    const currentCharacter = await client.get(key);

    if (currentCharacter) {
      await client.disconnect();
      return res.json(JSON.parse(currentCharacter));
    }

    const character = await getCharacterById(id);
    await client.set(key, JSON.stringify(character));

    await client.disconnect();
    res.json(character);
  } catch (error) {
    console.log(typeof error);
    await client.disconnect();
    console.log('error', error);
    res.status(500).json('See server logs');
  }
});

app.listen(PORT, async () => {
  // await client.connect();
  console.log('Server on PORT:', 3000);
});
