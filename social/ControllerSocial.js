import Social from "./ModelSocial.js";

export const createSocial = async (req, res) => {
  const { media, content } = req.body;
  try {
    await Social.create({
      media: media,
      content: content,
    });
    res.status(201).json({ msg: "Content Social uploaded" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const allSocial = async (req, res) => {
  try {
    const response = await Social.findAll({
      attributes: ["id", "media", "content"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getSocial = async (req, res) => {
  try {
    const response = await Social.findOne({
      attributes: ["id", "media", "content"],
      where: {
        media: req.params.media,
      },
    });
    if (!response)
      return res.status(404).json({ msg: "Social media not Found" });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateSocial = async (req, res) => {
  const response = await Social.findOne({
    attributes: ["id", "media", "content"],
    where: {
      id: req.params.id,
    },
  });
  if (!response) return res.status(404).json({ msg: "Social media not Found" });
  let content = req.body.content;
  try {
    await Social.update(
      {
        media: response.media,
        content: content,
      },
      {
        where: {
          id: response.id,
        },
      }
    );
    res.status(200).json({ msg: "Social updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteSocial = async (req, res) => {
  const response = await Social.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!response) return res.status(404).json({ msg: "No Data Found" });

  try {
    await Social.destroy({
      where: {
        id: response.id,
      },
    });
    res.status(200).json({ msg: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
