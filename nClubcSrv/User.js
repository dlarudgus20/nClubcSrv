var Logger = require('./Logger.js');
var Room = require('./Room.js');
var ServerErrorCode = require('./ServerErrorCode.js');

function User(usrdb, handle, id, nick)
{
	this.userDb = usrdb;
	this.handle = handle;
	this.id = id;
	this.nick = nick;
	this.clients = [];
	this.joinedRooms = [];
}

User.prototype.toString = function() {
	return '(User) ' + this.nick;
}

User.prototype.getId = function() {
	return this.id;
}

User.prototype.getNick = function() {
	return this.nick;
}

User.prototype.getHandle = function() {
	return this.handle;
}

User.prototype.addClient = function(client) {
	this.clients.push(client);
}

User.prototype.removeClient = function(client) {
	this.clients.splice(this.clients.indexOf(client), 1);
}

User.prototype.getJoinedRooms = function() {
	return this.joinedRooms;
}

User.prototype.joinRoom = function(client, room) {
	if (this.joinedRooms.indexOf(room) != -1)
		return ServerErrorCode.AlreadyExist;

	this.joinedRooms.push(room);
	room.addUser(this);

	for (var c in this.clients)
	{
		c.onJoinedRoom(room, (c != client));
	}
	
	Logger.log(this, 'Join Room', room.name);
	return ServerErrorCode.Succeeded;
}

User.prototype.createRoom = function(client, name) {
	var room = Room.createRoom(name, this);
	if (room == null)
		return ServerErrorCode.AlreadyExist;

	this.joinedRooms.push(room);

	for (var c in this.clients)
	{
		c.onJoinedRoom(room, (c != client));
	}

	Logger.log(this, 'Create Room', room.name);
	return ServerErrorCode.Succeeded;
}

User.prototype.exitRoom = function(client, room, reason) {
	var i = this.joinedRooms.indexOf(room);
	if (i == -1)
		return ServerErrorCode.InvalidParam;

	room.removeUser(this);
	this.joinedRooms.splice(i, 1);

	for (var c in this.clients)
	{
		c.onExitedRoom(room, reason, (c != client));
	}

	Logger.log(this, 'Exit Room', room.name);
	return ServerErrorCode.Succeeded;
}

User.prototype.onAddedRoomUser = function(room, user) {
	for (var c in this.clients)
	{
		c.onAddedRoomUser(room, user);
	}
}

User.prototype.onRemovedRoomUser = function(room, user) {
	for (var c in this.clients)
	{
		c.onRemovedRoomUser(room, user);
	}
}

User.prototype.onChangedRoomNotice = function(room, requester) {
	for (var c in this.clients)
	{
		c.onChangedRoomNotice(room, requester);
	}
}

User.prototype.onRecvFromSayToRoom = function(room, requester, saying) {
	for (var c in this.clients)
	{
		c.onRecvFromSayToRoom(room, requester, saying);
	}
}

module.exports = User;
