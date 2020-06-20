var jwt = require("jsonwebtoken");
const Motoboy = require("./../models/Motoboy");

module.exports = {
  async signin(request, response) {
    // const thumbnail = request.file.filename;
    const { name, phoneNumber, googleUID } = request.body;

    try {
      const motoboy = await Motoboy.create({
        googleUID,
        name,
        phoneNumber,
        firebaseNotificationToken: "",
      });

      const _id = motoboy._id;

      const token = jwt.sign({ _id }, "@SUDDEN#1012platform");

      const formattedMotoboy = { ...motoboy._doc };
      formattedMotoboy.token = token;

      return response.json(formattedMotoboy);
    } catch (err) {
      if (err.code === 11000) {
        const motoboy = await Motoboy.findOne({ phoneNumber, googleUID });

        if (motoboy !== null) {
          const _id = motoboy._id;

          const token = jwt.sign({ _id }, "@SUDDEN#1012platform");

          const formattedMotoboy = { ...motoboy._doc };
          formattedMotoboy.token = token;

          return response.json(formattedMotoboy);
        }
        // User unauthorized
        else return response.status(401).json("User authenticated");
      }
    }
  },

  async updateLocation(request, response) {
    const { _id, latitude, longitude, heading } = request.body;

    try {
      const motoboy = await Motoboy.updateOne(
        { _id },
        { latitude, longitude, heading, online: true }
      );
      return response.json(motoboy);
    } catch (err) {
      return response.status(500);
    }
  },

  async setMotoboyConnection(request, response) {
    const { _id, online } = request.body;

    try {
      const motoboy = await Motoboy.updateOne({ _id }, { online });
      return response.json(motoboy);
    } catch (err) {
      return response.status(500);
    }
  },

  async getOnlineMotoboys(request, response) {
    try {
      const connectedMotoboys = await Motoboy.find({ online: true });
      return response.json(connectedMotoboys);
    } catch (err) {
      return response.status(500);
    }
  },
};
