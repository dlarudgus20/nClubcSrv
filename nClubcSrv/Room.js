var Logger = require('./Logger.js');

var roomList = [];
var defaultRoom = null;

exports.getDefaultRoom = function() {
	if (defaultRoom == null)
	{
		defaultRoom = exports.createRoom('광장');
	}
	return defaultRoom;
}

exports.getRoomList = function() {
	return roomList;
}

exports.createRoom = function(name, owner) {
	if (owner === undefined)
		owner = null;

	var room = roomList.find(function(r) { return r.name == name; });
	if (room === undefined)
	{
		if (name != '')
			Logger.log('RoomList', 'Create Room', 'Name(' + name + ')');
		else
			Logger.log('RoomList', 'Create Default Room');

		if (owner != null)
		{
			room.owner = owner;
			room.users.push(owner);
		}

		return room;
	}
	else
	{
		return null;
	}
}

exports.getRoomByName = function(name) {
	var room = roomList.find(function(r) { return r.name == name });
	return (room !== undefined) ? room : null;
}

function Room(name)
{
	this.name = name;
	this.notice = '';
	this.owner = null;
	this.users = [];
}

Room.prototype.toString = function() {
	return (this.name != '') ? ('(Room) ' + this.name) : '(Default Room)';
}

Room.prototype.getName = function() {
	return this.name;
}

Room.prototype.getNotice = function() {
	return this.notice;
}

Room.prototype.getUsers = function() {
	return this.users;
}

Room.prototype.getOwner = function() {
	return this.owner;
}

Room.prototype.addUser = function() {
	
}

Room.prototype.removeUser = function() {

}

Room.prototype.changeNotice = function() {
	
}

Room.prototype.sayToRoom = function() {
	
}
