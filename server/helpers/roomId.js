const generateRoomId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const roomIdLength = Math.floor(Math.random() * 6) + 10; // Generate a random length between 10 and 15
    let roomId = '';
    for (let i = 0; i < roomIdLength; i++) {
        roomId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return roomId;
};

module.exports = {generateRoomId};
