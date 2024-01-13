import Hero from "./ModelHero.js";
import path from "path";
import fs from "fs";

export const createHero = (req, res) => {
  if (req.files === null)
    return res.status(400).json({ msg: "No File Uploaded" });

  const title = req.body.title;

  const hero = req.files.hero;
  const fileSize = hero.data.length;
  const ext = path.extname(hero.name);
  const convertName = hero.md5 + ext;
  let checkItem = true;
  let fileName = "";
  for (let i = 1; checkItem !== false; i++) {
    const checkIterasi = fs.existsSync(`./public/hero/${i}-${convertName}`);
    if (checkIterasi === false) {
      checkItem = false;
      fileName = `${i}-${convertName}`;
    }
  }
  console.log(fileName);

  const url = `${req.protocol}://${req.get("host")}/hero/${fileName}`;
  const allowedType = [".png", ".jpg", ".svg", ".jpeg"];
  if (!title) return res.status(400).json({ msg: "Must be a title" });
  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "Invalid Images" });
  if (fileSize > 5000000)
    return res.status(422).json({ msg: "Max image size 5MB" });

  hero.mv(`./public/hero/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    await Hero.create({
      title: title,
      hero: fileName,
      url: url,
    });
    res.status(201).json({ msg: "Hero uploaded" });
    // try {
    // } catch (error) {
    //   res.status(500).json({ msg: error.message });
    // }
  });
};

export const getAllHero = async (req, res) => {
  try {
    const response = await Hero.findAll({
      attributes: ["id", "title", "url"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const displayHero = async (req, res) => {
  try {
    const response = await Hero.findAll({
      attributes: ["id", "url"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteHero = async (req, res) => {
  const heroes = await Hero.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!heroes) return res.status(404).json({ msg: "Hero not found" });

  try {
    const filePath = `./public/hero/${heroes.hero}`;
    fs.unlinkSync(filePath);
    await Hero.destroy({
      where: {
        id: heroes.id,
      },
    });
    res.status(200).json({ msg: "Hero deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
