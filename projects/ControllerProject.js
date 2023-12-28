import Project from "./ModelProject.js";
import path from "path";
import fs from "fs";
import { Op } from "sequelize";

export const createProject = (req, res) => {
  if (req.files === null)
    return res.status(400).json({ msg: "No File Uploaded" });

  const title = req.body.title;
  const deskripsi = req.body.deskripsi;
  const foto = req.files.foto;
  const kategori = req.body.kategori;

  const fileSize = foto.data.length;
  const ext = path.extname(foto.name);
  const convertName = foto.md5 + ext;
  // const check = fs.readdirSync("./public/projects").filter((file) => {
  //   return file.includes(`${convertName}`);
  // }).length;
  let checkItem = true;
  let fileName = "";
  for (let i = 1; checkItem !== false; i++) {
    const checkIterasi = fs.existsSync(`./public/projects/${i}-${convertName}`);
    if (checkIterasi === false) {
      checkItem = false;
      fileName = `${i}-${convertName}`;
    }
  }

  const url = `${req.protocol}://${req.get("host")}/projects/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];
  if (!title) return res.status(400).json({ msg: "Must be a title" });
  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "Invalid Images" });
  if (fileSize > 5000000)
    return res.status(422).json({ msg: "Max image size 5MB" });
  if (!kategori) return res.status(400).json({ msg: "Must be a category" });

  foto.mv(`./public/projects/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      await Project.create({
        title: title,
        deskripsi: deskripsi,
        foto: fileName,
        url: url,
        kategori: kategori,
      });
      res.status(201).json({ msg: "Project uploaded" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  });
};

export const getAllProject = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 50;
  const search = req.query.search || "";
  const offset = limit * page;
  const totalRows = await Project.count({
    where: {
      [Op.or]: [
        {
          title: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          deskripsi: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          kategori: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    },
  });
  const totalPage = Math.ceil(totalRows / limit);
  const result = await Project.findAll({
    attributes: ["id", "title", "deskripsi", "url", "kategori"],
    where: {
      [Op.or]: [
        {
          id: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          title: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          kategori: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    },
    offset: offset,
    limit: limit,
    order: [["id", "DESC"]],
  });
  if (result.length === 0)
    return res.status(422).json({ msg: "Page Not found!" });
  res.status(200).json({
    result: result,
    page: page,
    limit: limit,
    totalRows: totalRows,
    totalPage: totalPage,
  });
};

export const getProjectKategori = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 50;
  const search = req.query.search || "";
  const offset = limit * page;
  const totalRows = await Project.count({
    // where: {
    //   [Op.or]: [
    //     {
    //       kategori: {
    //         [Op.like]: "%" + search + "%",
    //       },
    //     },
    //   ],
    // },
    where: {
      kategori: {
        [Op.like]: "%" + search + "%",
      },
    },
  });
  const totalPage = Math.ceil(totalRows / limit);
  const result = await Project.findAll({
    attributes: ["id", "title", "deskripsi", "url"],
    // where: {
    //   [Op.or]: [
    //     {
    //       kategori: {
    //         [Op.like]: "%" + search + "%",
    //       },
    //     },
    //   ],
    // },
    where: {
      kategori: {
        [Op.like]: "%" + search + "%",
      },
    },
    offset: offset,
    limit: limit,
    order: [["id", "DESC"]],
  });
  if (result.length === 0)
    return res.status(422).json({ msg: "Page Not found!" });
  res.status(200).json({
    result: result,
    page: page,
    limit: limit,
    totalRows: totalRows,
    totalPage: totalPage,
  });
};

export const getLastProject = async (req, res) => {
  try {
    const response = await Project.findAll({
      limit: 5,
      attributes: ["id", "title", "deskripsi", "url"],
      order: [["id", "DESC"]],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getProjectId = async (req, res) => {
  try {
    const response = await Project.findOne({
      attributes: ["id", "title", "deskripsi", "url"],
      where: {
        id: req.params.id,
      },
    });
    if (!response) return res.status(404).json({ msg: "No Data Found" });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateProject = async (req, res) => {
  const project = await Project.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!project) return res.status(404).json({ msg: "No Data Found" });

  let fileName = "";
  if (req.files === null) {
    fileName = project.foto;
  } else {
    const foto = req.files.foto;
    const fileSize = foto.data.length;
    const ext = path.extname(foto.name);
    const convertName = foto.md5 + ext;
    let checkItem = true;
    for (let i = 1; checkItem !== false; i++) {
      const checkIterasi = fs.existsSync(
        `./public/projects/${i}-${convertName}`
      );
      if (checkIterasi === false) {
        checkItem = false;
        fileName = `${i}-${convertName}`;
      }
    }
    const allowedType = [".png", ".jpg", ".jpeg"];
    if (!allowedType.includes(ext.toLocaleLowerCase()))
      return res.status(422).json({ msg: "Invalid images" });
    if (fileSize > 5000000)
      return res.status(422).json({ msg: "Max image size 5MB" });

    const filePath = `./public/projects/${project.foto}`;
    fs.unlinkSync(filePath);

    foto.mv(`./public/projects/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }

  let title = req.body.title;
  if (!title) {
    title = project.title;
  }
  const deskripsi = req.body.deskripsi;
  const url = `${req.protocol}://${req.get("host")}/projects/${fileName}`;
  let kategori = req.body.kategori;
  if (!kategori) {
    kategori = project.kategori;
  }

  try {
    await Project.update(
      {
        title: title,
        deskripsi: deskripsi,
        foto: fileName,
        url: url,
        kategori: kategori,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: "Project updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteProject = async (req, res) => {
  const project = await Project.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!project) return res.status(404).json({ msg: "No Data Found" });

  try {
    const filePath = `./public/projects/${project.foto}`;
    fs.unlinkSync(filePath);
    await Project.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
