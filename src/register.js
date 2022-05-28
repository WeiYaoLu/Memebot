import { INVITE_COMMAND, MEME_COMMAND } from './commands.js';
import fetch from 'node-fetch';

/* eslint-disable no-undef */

const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.DISCORD_APPLICATION_ID;
const testGuildId = process.env.DISCORD_TEST_GUILD_ID;

if (!token) {
  throw new Error('The DISCORD_TOKEN environment variable is required.');
}
if (!applicationId) {
  throw new Error(
    'The DISCORD_APPLICATION_ID environment variable is required.'
  );
}

/**
 * Register all commands with a specific guild/server. */

async function registerGuildCommands() {
  if (!testGuildId) {
    throw new Error(
      'The DISCORD_TEST_GUILD_ID environment variable is required.'
    );
  }
  const url = `https://discord.com/api/v10/applications/${applicationId}/guilds/${testGuildId}/commands`;
  const res = await registerCommands(url);
  const json = await res.json();
  console.log(json);
  json.forEach(async (cmd) => {
    const response = await fetch(
      `https://discord.com/api/v10/applications/${applicationId}/guilds/${testGuildId}/commands/${cmd.id}`
    );
    if (!response.ok) {
      console.error(`Problem removing command ${cmd.id}`);
    }
  });
}

/**
 * Register all commands globally.
 */
async function registerGlobalCommands() {
  const url = `https://discord.com/api/v10/applications/${applicationId}/commands`;
  await registerCommands(url);
}

async function registerCommands(url) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${token}`,
    },
    method: 'PUT',
    body: JSON.stringify([AWW_COMMAND, INVITE_COMMAND, MEME_COMMAND]),
  });

  if (response.ok) {
    console.log('Registered all commands');
  } else {
    console.error('Error registering commands');
    const text = await response.text();
    console.error(text);
  }
  return response;
}

await registerGlobalCommands();
// await registerGuildCommands();
