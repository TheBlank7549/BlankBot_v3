const { MessageCollector, MessageEmbed } = require('discord.js');

module.exports.info = {
  name: 'connect4',
  aliases: ['connectfour', 'c4', 'cfour'],
  category: "game",
  description: 'Play a game of connect four',
  usage: 'connect4 [@opponent]'
};

module.exports.run = async (client, msg, args) => {
  const playerId = msg.author.id;

  // Prevents playing against 0 opponents
  if (msg.mentions.users.size < 1) return msg.channel.send({
    content: 'You need an opponent to play this game against'
  });

  // Prevents playing against 2+ opponents
  if (msg.mentions.users.size > 1) return msg.channel.send({
    content: 'You can only play this game against a single opponent'
  });

  const opponent = msg.mentions.users.first();

  // Prevents playing against bots
  // if (opponent.bot) return msg.channel.send({
  //   content: 'You cannot play this game against a bot'
  // });

  const opponentId = opponent.id;

  // Prevents playing against own account
  if (opponentId === playerId) return msg.channel.send({
    content: 'You cannot play this game against yourself'
  });

  // Lets the opponent know he's been invited to a game
  msg.channel.send({
    content: `<@${opponentId}>, you have been invited to a game of connect-4 by <@${playerId}>.\nDo you accept? (y/n)`,
  });

  // Creates the message collector
  const confirmationFilter = m => m.author.id === opponentId;
  const gameFilter = m => m.author.id === opponentId || m.author.id === playerId;
  const collector = new MessageCollector(msg.channel, {
    filter: confirmationFilter,
    idle: 30 * 1000,
    max: 5
  });

  // Creates the game object
  const game = {
    started: false,
    cancelled: false,
    aborted: { status: false, by: null },
    currentPlayer: playerId,
    currentSign: 'r',
    currentPiece: ':red_circle:',
    currentTurn: 0,
    p1: playerId,
    p2: opponentId,
    // game.board is used for taking inputs
    board: {
      a: [],
      b: [],
      c: [],
      d: [],
      e: [],
      f: [],
      g: []
    },
    // game.display is used for sending the board
    display: [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null]
    ],
    winner: null
  };

  // Responses to collected messages
  collector.on('collect', msg => {
    // Handles game abortion
    if (msg.content.trim().toLowerCase() === 'c4 abort') {
      game.aborted.status = true;
      game.aborted.by = msg.author.id;
      collector.stop('Game aborted');
      return;
    };

    // Handles help requests
    if (msg.content.trim().toLowerCase() === 'c4 rules') {
      const rulesEmbed = new MessageEmbed()
        .setColor('#ffffff')
        .setTitle('Connect-4 rules')
        .addFields({
          name: 'How to make moves:',
          value: 'Send the number of the column in which you want to drop your piece, i.e, `1`, `2`'
        }, {
          name: 'Winning patterns:',
          value: '1) Vertical\n2)Horizontal\n3)Diagonal'
        }, {
          name: 'Pieces:',
          value: 'The person who sent out the game invite plays with the :red_circle: red, the other person plays with :blue_circle: blue'
        });

      msg.channel.send({
        embeds: [rulesEmbed]
      });
      return;
    };

    // Handles opponent's confirmation
    if (!game.started) {
      // Handles agreeing to the game
      if (msg.content.trim().toLowerCase() === 'y' || msg.content.trim().toLowerCase() === 'yes') {
        game.started = true;
        collector.filter = gameFilter;
        collector.options.max = 100;
        sendBoard(game, msg.channel);
        return;
        // Handles rejecting the game
      } else if (msg.content.trim().toLowerCase() === 'n' || msg.content.trim().toLowerCase() === 'no') {
        game.cancelled = true;
        collector.stop('Game cancelled by opponent');
        return;
      }
      // Handles random msges
      else return;
    };

    // The actual game
    // Ignores msges from other players
    if (msg.author.id !== game.currentPlayer) return;

    // Creates the move object
    const move = {
      column: null,
      valid: true,
      freeCol: true
    };

    // Gets the column to which to drop the piece
    move.column = Number(msg.content.trim());

    // Handles if the move is invalid, i.e, not a column number
    const col = getCol(move);
    if (!move.valid) return msg.channel.send({
      content: `<@${game.currentPlayer}>, that is not a valid move!`
    });

    // Handles if the move target column is full
    move.freeCol = checkCol(game, col);
    if (!move.freeCol) return msg.channel.send({
      content: `<@${game.currentPlayer}>, that column is already full!`
    });

    // Updates the board to include the new move
    updateBoard(game, col, move);

    // Tests to see if a winning pattern has been reached
    testForWin(game);

    // Sends the updated board
    sendBoard(game, msg.channel);

    // Stops the collector when the game has ended
    if (game.winner) collector.stop('The game came to a conclusion');
  });

  // Handles the end of the game
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

function getCol(move) {
  // Makes the move invalid the move's target column isn't a number
  if (!move.column) {
    move.valid = false;
    return;
  };

  // Handles numbers representing columns outside the board
  if (move.column < 1 || move.column > 7) {
    move.valid = false;
    return;
  };

  switch (move.column) {
    case 1:
      return 'a';
    case 2:
      return 'b';
    case 3:
      return 'c';
    case 4:
      return 'd';
    case 5:
      return 'e';
    case 6:
      return 'f';
    default:
      return 'g';
  };
};

// Checks to make sure that the target column has space
function checkCol(game, col) {
  if (game.board[col].length >= 6) {
    return false;
  } else {
    return true;
  }
};

// Updates the board according to user input
function updateBoard(game, col, move) {
  game.board[col].push(game.currentSign);
  game.display[6 - game.board[col].length][move.column - 1] = game.currentPiece;
  game.currentTurn++;

  // Switches between red and blue circles
  if (game.currentPiece === ':red_circle:') game.currentPiece = ':blue_circle:'
  else game.currentPiece = ':red_circle:';

  // Switches between adding 'r' or 'b' to game.board
  if (game.currentSign === 'r') game.currentSign = 'b'
  else game.currentSign = 'r';

  // Switches the current player
  if (game.currentPlayer === game.p1) game.currentPlayer = game.p2
  else game.currentPlayer = game.p1;
};

function testForWin(game) {
  // Handles the entire board filling up
  if (game.currentTurn === 42) game.winner = 'none';

  // The horizontals
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 4; j++) {
      let slot1 = game.display[i][j] || Math.random();
      let slot2 = game.display[i][j + 1] || Math.random();
      let slot3 = game.display[i][j + 2] || Math.random();
      let slot4 = game.display[i][j + 3] || Math.random();

      if (slot1 === slot2 && slot2 === slot3 && slot3 === slot4) declareWinner(game, i, j);
    };
  };

  // The Verticals
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 7; j++) {
      let slot1 = game.display[i][j] || Math.random();
      let slot2 = game.display[i + 1][j] || Math.random();
      let slot3 = game.display[i + 2][j] || Math.random();
      let slot4 = game.display[i + 3][j] || Math.random();

      if (slot1 === slot2 && slot2 === slot3 && slot3 === slot4) declareWinner(game, i, j);
    };
  };

  // The LtR Diagonals
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      let slot1 = game.display[i][j] || Math.random();
      let slot2 = game.display[i + 1][j + 1] || Math.random();
      let slot3 = game.display[i + 2][j + 2] || Math.random();
      let slot4 = game.display[i + 3][j + 3] || Math.random();

      if (slot1 === slot2 && slot2 === slot3 && slot3 === slot4) declareWinner(game, i, j);
    };
  };

  // The RtL Diagonals
  for (let i = 0; i < 3; i++) {
    for (let j = 3; j < 7; j++) {

      let slot1 = game.display[i][j] || Math.random();
      let slot2 = game.display[i + 1][j - 1] || Math.random();
      let slot3 = game.display[i + 2][j - 2] || Math.random();
      let slot4 = game.display[i + 3][j - 3] || Math.random();

      if (slot1 === slot2 && slot2 === slot3 && slot3 === slot4) declareWinner(game, i, j);
    };
  };
};

function declareWinner(game, i, j) {
  if (game.currentPlayer === game.p1) game.winner = game.p2
  else game.winner = game.p1;

  game.display[i][j] = ':yellow_circle:';
  game.display[i + 1][j - 1] = ':yellow_circle:';
  game.display[i + 2][j - 2] = ':yellow_circle:';
  game.display[i + 3][j - 3] = ':yellow_circle:';
};

function sendBoard(game, channel) {
  // The initial boilerplate desc
  let desc = '|:one:|:two:|:three:|:four:|:five:|:six:|:seven:|';

  // Adds the board's slots to the desc
  for (let i = 0; i < 6; i++) {
    desc += '\n|';
    for (let j = 0; j < 7; j++) {
      let slot = game.display[i][j] || ':black_large_square:';
      desc += `${slot}|`;
    };
  };

  // Adds additional info about winner/ currentPlayer
  if (game.winner) {
    if (game.winner !== 'none') desc += `\nThe game was won by <@${game.winner}>`;
    else desc += '\nThe game ended in a tie';
  } else {
    desc += `\n<@${game.currentPlayer}>'s Turn (${game.currentPiece})`;
  };

  // Creates the msg embed
  const boardEmbed = new MessageEmbed()
    .setColor('#ffffff')
    .setTitle('Connect4')
    .setDescription(desc)
    .setTimestamp();

  // Sends the board
  channel.send({
    content: 'See rules with `c4 rules` and abort game with `c4 abort`',
    embeds: [boardEmbed]
  });
};

/**
 * O O O O O O O
 * O O O O O O O
 * O O O O O O O
 * O O O O O O O
 * O O O O O O O
 * O O O O O O O
 *
 * Horizontally ->
 * O O O O - - -
 * O O O O - - -
 * O O O O - - -
 * O O O O - - -
 * O O O O - - -
 * O O O O - - -
 *
 * Vertically ->
 * O O O O O O O
 * O O O O O O O
 * O O O O O O O
 * - - - - - - -
 * - - - - - - -
 * - - - - - - -
 *
 * LtR Diagonal ->
 * O O O O - - -
 * O O O O - - -
 * O O O O - - -
 * - - - - - - -
 * - - - - - - -
 * - - - - - - -
 *
 * RtL Diagonal ->
 * - - - O O O O
 * - - - O O O O
 * - - - O O O O
 * - - - - - - -
 * - - - - - - -
 * - - - - - - -
 */