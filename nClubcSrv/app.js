// argument parse

var argv = require('minimist')(process.argv.slice(2));
var options = {
	port: 35729
};
var argf = {
	help: function(par) {
		console.log('nClubcSrv 3.0');
		console.log();
		console.log('Usage: nodejs app.js (--port [port:int])');
		return true;
	},
	port: function(par) {
		if (par.length == 1)
		{
			/^(\-|+)?([0-9])+|Infinity)$/.test("");
			var port = filterInt(par[0]);
			if (port != NaN)
			{
				options.port = port;
				return true;
			}
			else
			{
				console.error('error: invalid port number');
			}
		}
		else
		{
			console.error('error: multiple \'port\' opt');
		}
		return false;
	},
	_: function(par) {
		if (par.length == 0)
		{
			return true;
		}
		else
		{
			console.error('error: invalid parameter');
			return false;
		}
	}
};
for (var arg in argv)
{
	var fn = argf[arg];
	if (!(fn !== undefined && fn(argv[arg])))
		process.exit(-1);
}

// run server

var Server = require('./Server.js');
new Server(options.port).start();

// strict parseInt function
// https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/parseInt
function filterInt(value)
{
	if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value))
		return Number(value);
	return NaN;
}
