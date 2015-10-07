var Logger = require('./Logger.js');

var roomList = [];
var defaultRoom = null;
var handleCounter = 0;

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
		Logger.log((owner != null) ? owner : '(none)',
			'Create Room', 'Name(' + name + ')');

		room = new Room(name);

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
	this.handle = handleCounter;
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

Room.prototype.addUser = function(usr) {
	var that = this;

	this.users.forEach(function(other) {
		other.onAddedRoomUser(that, usr);
	});

	this.users.push(usr);

	if (this.owner == null)
		this.owner = usr;
}

Room.prototype.removeUser = function(usr) {
	var that = this;

	if (this.owner == usr)
	{
		if (this.users.length > 1)
		{
			this.changeOwner(
				this.users.find(function(u) { return u != usr; })
				);
		}
		else
		{
			this.owner = null;
		}
	}

	this.users.splice(this.users.indexOf(usr), 1);

	this.users.forEach(function(other) {
		other.onRemovedRoomUser(that, usr);
	});
}

Room.prototype.changeNotice = function(requester, notice) {
	var that = this;

	this.notice = notice;

	this.users.forEach(function(other) {
		other.onChangedRoomNotice(that, requester);
	});
}

Room.prototype.changeOwner = function(usr) {
	// TODO: notify owner changed
	this.owner = usr;
}

Room.prototype.sayToRoom = function(requester, saying) {
	var that = this;
	this.users.forEach(function(other) {
		if (other != requester)
			other.onRecvFromSayToRoom(that, requester, saying);
	});
}
