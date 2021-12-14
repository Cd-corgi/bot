const mongoose = require('mongoose')

module.exports = async() => {
    const { MONGO } = require('../public/config.json')
    try {
        await mongoose.connect(MONGO);
        console.log("[MONGO-DB] the connection have been done!")
    } catch(e) {
        console.log("[❌ ERROR DB] an error have been ocurred: "+ e)
    }
}