var events = require('events');

var emitter = new events.EventEmitter();
emitter.on('log', function(str) {
	console.log(str);
});

exports.log = function(obj, topic, detail) {
	var str = '<' + obj.toString() + '> ' + topic;
	if (typeof detail !== 'undefined')
	{
		str += ' : ' + detail;
	}
	str += ' [' + getNowDateStr() + ']';
	emitter.emit('log', str);
}

function getNowDateStr()
{
    var date = new Date();

	var strization = function(num) {
		return (num < 10 ? '0' : '') + num;	
	};

    return date.getFullYear()
		+ '-' + strization(date.getMonth() + 1)
		+ '-' + strization(date.getDate())
		+ ' ' + strization(date.getHours())
		+ ':' + strization(date.getMinutes())
		+ ':' + strization(date.getSeconds());
}
