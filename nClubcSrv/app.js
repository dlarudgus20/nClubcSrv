var Server = require('./Server.js');

var argv = require('minimist')(process.argv.slice(2));

// TODO: use minimist or another argv library
if (process.argv.length == 2)
{
	new Server(35729).start();
}

// https://nodejs.org/api/buffer.html
// http://substack.net/binary_stream_parsing_in_node
