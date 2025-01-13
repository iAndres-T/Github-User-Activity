const axios = require('axios');
const readline = require('readline-sync'); // readline module is used to read input from the user

const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'User-Agent': 'GitHub API Console App',
  },
});

// Función principal
async function main() {
  console.log('=== Aplicación de Consola para la API de GitHub ===');

  const username = readline.question('Introduce el nombre de usuario de GitHub: ');

  try {
    const response = await githubApi.get(`/users/${username}/events`);

    console.log(`\nInformación del usuario:\n`);
    displayEvents(response.data);

  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error.message);
  }
}

async function displayEvents(events) {

  if(events.length === 0) {
    console.log('No se encontraron eventos para el usuario');
    return;
  }

events.forEach((event) => {
  let action;

  switch (event.type) {
    case 'PushEvent':
      const commitCount = event.payload.commits.length;
      action = `Pushed ${commitCount} commit(s) to ${event.repo.name}`;
      break;
    case 'IssuesEvent':
      action = `${event.payload.action.charAt(0) + event.payload.action.slice(1)} an issue in ${event.repo.name}`;
      break;
    case 'WatchEvent':
      action = `Starred ${event.repo.name}`;
      break;
    case 'ForkEvent':
      action = `Forked ${event.repo.name}`;
      break;
    case 'CreateEvent':
      action = `Created ${event.payload.ref_type} ${event.payload.ref} in ${event.repo.name}`;
      break;
    default:
      action = `${event.type.replace('Event', '')} in ${event.repo.name}`;
  }

  console.log(`- ${action}`);

  });

}

main();