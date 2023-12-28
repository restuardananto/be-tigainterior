import Promo from "./ModelPromo.js";
import path from "path";
import fs from "fs";

export const createPromo = (req, res) => {
  if (req.files === null)
    return res.status(400).json({ msg: "No File Uploaded" });

  const title = req.body.title;

  const promo = req.files.promo;
  const fileSize = promo.data.length;
  const ext = path.extname(promo.name);
  const convertName = promo.md5 + ext;
  let checkItem = true;
  let fileName = "";
  for (let i = 1; checkItem !== false; i++) {
    const checkIterasi = fs.existsSync(`./public/promo/${i}-${convertName}`);
    if (checkIterasi === false) {
      checkItem = false;
      fileName = `${i}-${convertName}`;
    }
  }

  const url = `${req.protocol}://${req.get("host")}/promo/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];
  if (!title) return res.status(400).json({ msg: "Must be a title" });
  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "Invalid Images" });
  if (fileSize > 5000000)
    return res.status(422).json({ msg: "Max image size 5MB" });

  promo.mv(`./public/promo/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      await Promo.create({
        title: title,
        promo: fileName,
        url: url,
      });
      res.status(201).json({ msg: "promo uploaded" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  });
};

export const getAllPromo = async (req, res) => {
  try {
    const response = await Promo.findAll({
      attributes: ["id", "title", "url"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const displayPromo = async (req, res) => {
  try {
    const response = await Promo.findAll({
      attributes: ["id", "url"],
      order: [["id", "DESC"]],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deletePromo = async (req, res) => {
  const promos = await Promo.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!promos) return res.status(404).json({ msg: "Hero not found" });

  try {
    const filePath = `./public/hero/${promos.promo}`;
    fs.unlinkSync(filePath);
    await Promo.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Promo deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
