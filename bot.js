require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  EmbedBuilder,
} = require('discord.js');
const express = require('express');

// Discord 봇 클라이언트 설정
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const activePolls = new Map();

const commands = [
  new SlashCommandBuilder()
    .setName('사다리')
    .setDescription('사다리 타기 게임을 시작합니다.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('타기')
        .setDescription('사다리 타기 게임을 시작합니다.')
        .addStringOption((option) =>
          option
            .setName('참가자')
            .setDescription('참가자 목록 (쉼표로 구분)')
            .setRequired(true)
        )
    ),
  new SlashCommandBuilder()
    .setName('투표')
    .setDescription('새로운 투표를 시작합니다.')
    .addStringOption((option) =>
      option.setName('제목').setDescription('투표의 제목').setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('선택지')
        .setDescription('쉼표로 구분된 투표 선택지')
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('투표종료')
    .setDescription('진행 중인 투표를 종료합니다.')
    .addStringOption((option) =>
      option
        .setName('제목')
        .setDescription('종료할 투표의 제목')
        .setRequired(true)
    ),
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('슬래시 명령어를 등록하는 중...');
    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    });
    console.log('슬래시 명령어 등록 완료');
  } catch (error) {
    console.error(error);
  }
})();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  if (
    interaction.commandName === '사다리' &&
    interaction.options.getSubcommand() === '타기'
  ) {
    const participantsString = interaction.options.getString('참가자');
    const participants = participantsString.split(',').map((p) => p.trim());

    if (participants.length < 2) {
      return interaction.reply('최소 2명 이상의 참가자가 필요합니다.');
    }

    const result = generateLadderResult(participants);

    let resultMessage = '사다리 타기 결과:\n';
    result.forEach((rank, index) => {
      resultMessage += `${participants[index]} - ${rank}\n`;
    });

    await interaction.reply(resultMessage);
  } else if (interaction.commandName === '투표') {
    const title = interaction.options.getString('제목');
    const options = interaction.options
      .getString('선택지')
      .split(',')
      .map((option) => option.trim());

    if (options.length < 2 || options.length > 10) {
      return interaction.reply(
        '투표 선택지는 2개 이상 10개 이하로 입력해주세요.'
      );
    }

    const embed = new EmbedBuilder()
      .setTitle(`📊 ${title}`)
      .setDescription(
        options.map((option, index) => `${index + 1}. ${option}`).join('\n')
      )
      .setColor('#00FFFF');

    const message = await interaction.reply({
      embeds: [embed],
      fetchReply: true,
    });
    for (let i = 0; i < options.length; i++) {
      await message.react(`${i + 1}️⃣`);
    }

    activePolls.set(title, { message, options });
  } else if (interaction.commandName === '투표종료') {
    const title = interaction.options.getString('제목');
    const poll = activePolls.get(title);

    if (!poll) {
      return interaction.reply('해당 제목의 투표를 찾을 수 없습니다.');
    }

    const message = poll.message;
    const results = await Promise.all(
      poll.options.map(async (option, index) => {
        const reaction = message.reactions.cache.get(`${index + 1}️⃣`);
        const count = reaction ? reaction.count - 1 : 0;
        return `${option}: ${count} 표`;
      })
    );

    const resultEmbed = new EmbedBuilder()
      .setTitle(`📊 투표 결과: ${title}`)
      .setDescription(results.join('\n'))
      .setColor('#00FFFF');

    await interaction.reply({ embeds: [resultEmbed] });
    activePolls.delete(title);
  }
});

function generateLadderResult(participants) {
  const result = Array.from({ length: participants.length }, (_, i) => i + 1);
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Express 웹 서버 설정
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('봇이 작동 중입니다!');
});

app.listen(port, () => {
  console.log(`웹 서버가 포트 ${port}에서 작동 중입니다.`);
});

client.login(TOKEN);
