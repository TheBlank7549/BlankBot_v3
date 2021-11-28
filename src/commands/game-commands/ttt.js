const { MessageCollector, MessageEmbed } = require('discord.js');

module.exports.info = {
  name: 'ttt',
  aliases: ['tictactoe', 'tic-tac-toe'],
  category: "game",
  description: 'Play a game of tic tac toe',
  usage: 'ttt [@opponent]'
};

module.exports.run = async (client, msg, args) => {
  const playerId = msg.author.id;

  if (msg.mentions.users.size < 1) return msg.channel.send({
    content: 'You need an opponent to play this game against'
  });

  if (msg.mentions.users.size > 1) return msg.channel.send({
    content: 'You can only play this game against a single opponent'
  });

  const opponent = msg.mentions.users.first();

  if (opponent.bot) return msg.channel.send({
    content: 'You cannot play this game against a bot'
  });

  if (opponent.id === playerId) return msg.channel.send({
    content: 'You cannot play this game against yourself'
  });

  const opponentId = opponent.id;

  msg.channel.send({
    content: `<@${opponentId}>, you have been invited to a game of tic-tac-toe by <@${playerId}>.\nDo you accept? (y/n)`,
  });

  const confirmationFilter = m => m.author.id === opponentId;
  const gameFilter = m => m.author.id === opponentId || m.author.id === playerId;
  const collector = new MessageCollector(msg.channel, {
    filter: confirmationFilter,
    idle: 30 * 1000,
    max: 5
  });

  const game = {
    started: false,
    cancelled: false,
    aborted: { status: false, by: null },
    currentPlayer: playerId,
    currentMarker: ':x:',
    currentTurn: 0,
    p1: playerId,
    p2: opponentId,
    board: {
      a1: null, a2: null, a3: null,
      b1: null, b2: null, b3: null,
      c1: null, c2: null, c3: null,
    },
    winner: null
  };

  collector.on('collect', msg => {
    // Handles game abortion
    if (msg.content.trim().toLowerCase() === 'ttt abort') {
      game.aborted.status = true;
      game.aborted.by = msg.author.id;
      collector.stop('Game aborted');
      return;
    };

    // Handles help requests
    if (msg.content.trim().toLowerCase() === 'ttt rules') {
      const rulesEmbed = new MessageEmbed()
        .setColor('#ffffff')
        .setTitle('Tic-Tac-Toe rules')
        .addFields({
          name: 'How to make moves:',
          value: 'Send the name of the tile you want to place your marker on in the `<row><column>` format, i.e, `a1`,`b3`\nThe values `a,b,c` represent rows and `1,2,3` represent columns'
        }, {
          name: 'Winning patterns:',
          value: '1) Vertical\n2)Horizontal\n3)Diagonal'
        }, {
          name: 'Markers:',
          value: 'The person who sent out the game invite plays with the :x: cross, the other person plays with :o: circle'
        });

      msg.channel.send({
        embeds: [rulesEmbed]
      });
      return;
    };

    // Handles opponent's confirmation
    if (!game.started) {
      if (msg.author.id !== game.p2) return;
      if (msg.content.trim().toLowerCase() === 'y' || msg.content.trim().toLowerCase() === 'yes') {
        game.started = true;
        collector.filter = gameFilter;
        collector.options.max = 50
        sendBoard(game, msg.channel);
        return;
      };
      if (msg.content.trim().toLowerCase() === 'n' || msg.content.trim().toLowerCase() === 'no') {
        game.cancelled = true;
        collector.stop('Game cancelled by opponent');
        return;
      };
    };

    // The actual game
    if (msg.author.id !== game.currentPlayer) return;
    const move = msg.content.trim().toLowerCase();

    updateBoard(game, move, msg.channel);
    testForWin(game);
    sendBoard(game, msg.channel);

    if (game.winner) collector.stop('The game came to a conclusion');
  });

  collector.on('end', () => {
    if (game.winner) return;
    // If game is aborted
    if (game.aborted.status) return msg.channel.send({
      content: `The game was aborted by <@${game.aborted.by}>`
    });

    // If there's no msges for 30sec after game starts
    if (game.started) return msg.channel.send({
      content: 'The game ended due to inactivity'
    });

    // If invite is cancelled
    if (game.cancelled) return msg.channel.send({
      content: `The invitation to play tic-tac-toe was declined by <@${opponentId}>`
    });

    // If invite is ignored
    if (!game.winner) return msg.channel.send({
      content: `<@${playerId}>, your opponent did not accept the invitation to play tic-tac-toe, make sure they're online`
    });
  });
};

function updateBoard(game, spot, channel) {
  const possibleMoves = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3'];
  if (game.board[spot]) return channel.send({
    content: `<@${game.currentPlayer}>, there is already a marker there!`
  });

  if (!possibleMoves.includes(spot)) return channel.send({
    content: `<@${game.currentPlayer}>, that is not a valid move!`
  });

  game.board[spot] = game.currentMarker;
  game.currentTurn++;

  if (game.currentMarker === ':x:') game.currentMarker = ':o:'
  else game.currentMarker = ':x:';

  if (game.currentPlayer === game.p1) game.currentPlayer = game.p2
  else game.currentPlayer = game.p1;
};

function testForWin(game) {
  if (game.currentTurn === 9) game.winner = 'none';

  const a1 = game.board.a1 || Math.random();
  const a2 = game.board.a2 || Math.random();
  const a3 = game.board.a3 || Math.random();
  const b1 = game.board.b1 || Math.random();
  const b2 = game.board.b2 || Math.random();
  const b3 = game.board.b3 || Math.random();
  const c1 = game.board.c1 || Math.random();
  const c2 = game.board.c2 || Math.random();
  const c3 = game.board.c3 || Math.random();

  if (
    a1 === a2 && a2 === a3 ||
    b1 === b2 && b2 === b3 ||
    c1 === c2 && c2 === c3 ||
    a1 === b1 && b1 === c1 ||
    a2 === b2 && b2 === c2 ||
    a3 === b3 && b3 === c3 ||
    a1 === b2 && b2 === c3 ||
    a3 === b2 && b2 === c1
  ) {
    if (game.currentPlayer === game.p1) game.winner = game.p2
    else game.winner = game.p1
  };
};

// Sends the board to the channel
function sendBoard(game, channel) {
  const a1 = game.board.a1 || ':black_large_square:';
  const a2 = game.board.a2 || ':black_large_square:';
  const a3 = game.board.a3 || ':black_large_square:';
  const b1 = game.board.b1 || ':black_large_square:';
  const b2 = game.board.b2 || ':black_large_square:';
  const b3 = game.board.b3 || ':black_large_square:';
  const c1 = game.board.c1 || ':black_large_square:';
  const c2 = game.board.c2 || ':black_large_square:';
  const c3 = game.board.c3 || ':black_large_square:';
  let desc = `:black_large_square::one::two::three:\n<:letter_a:913073765120872500>${a1}${a2}${a3}\n<:letter_b:913074034885943366>${b1}${b2}${b3}\n<:letter_c:913074116637098064>${c1}${c2}${c3}`;

  if (game.winner) {
    if (game.winner !== 'none') desc += `\nThe game was won by <@${game.winner}>`;
    else desc += '\nThe game ended in a tie';
  } else {
    desc += `\n<@${game.currentPlayer}>'s Turn (${game.currentMarker})`;
  };

  const boardEmbed = new MessageEmbed()
    .setColor('#ffffff')
    .setTitle(`Tic-Tac-Toe`)
    .setDescription(desc)
    .setTimestamp();

  channel.send({
    content: 'See rules with `ttt rules` and abort game with `ttt abort`',
    embeds: [boardEmbed]
  });
};