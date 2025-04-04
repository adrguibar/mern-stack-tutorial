import {
  createService,
  findAllService,
  countNews,
  topNewsService,
  findByIdService,
  searchByTitleService,
  findByUserIdService,
  updateService,
  eraseService,
} from "../services/news.service.js";

export const create = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const { title, text, banner } = req.body;

    if (!authorization) {
      return res.send(401);
    }

    await createService({ title, text, banner, user: { _id: req.userId } });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
  res.status(201).send("News created!");
};

export const findAll = async (req, res) => {
  try {
    let { limit, offset } = req.query;

    limit = Number(limit);
    offset = Number(offset);

    if (!limit) {
      limit = 5;
    }
    if (!offset) {
      offset = 0;
    }

    const news = await findAllService(limit, offset);
    const total = await countNews();
    const currentUrl = req.baseUrl;

    const next = offset + limit;
    const nextUrl =
      next < total ? `${currentUrl}?limit=${limit}&offset${next}` : null;

    const previous = offset - limit < 0 ? null : offset - limit;
    const previousUrl =
      previous != null
        ? `${currentUrl}?limit=${limit}&offset${previous}`
        : null;

    if (news.length === 0) {
      return res.status(404).send({ message: "News not found" });
    }

    return res.status(200).send({
      nextUrl,
      previousUrl,
      limit,
      offset,
      total,

      results: news.map((newsItem) => ({
        id: newsItem._id,
        title: newsItem.title,
        text: newsItem.text,
        banner: newsItem.banner,
        likes: newsItem.likes,
        comments: newsItem.comments,
        name: newsItem.user.name,
        userName: newsItem.user.username,
        avatar: newsItem.user.avatar,
      })),
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const topNews = async (req, res) => {
  try {
    const news = await topNewsService();

    if (!news) {
      return res.status(401).send({ message: "There are no posts!" });
    }

    res.send({
      news: {
        id: news._id,
        title: news.title,
        text: news.text,
        banner: news.banner,
        likes: news.likes,
        comments: news.comments,
        name: news.user.name,
        userName: news.user.username,
        avatar: news.user.avatar,
      },
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

export const findById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const news = await findByIdService(id);
    console.log(news);
    return res.status(200).send({
      news: {
        id: news._id,
        title: news.title,
        text: news.text,
        banner: news.banner,
        likes: news.likes,
        comments: news.comments,
        name: news.user.name,
        userName: news.user.username,
        avatar: news.user.avatar,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Can't find news by id: " + err.message });
  }
};

export const searchByTitle = async (req, res) => {
  try {
    const { title } = req.query;
    console.log(title);
    const news = await searchByTitleService(title);
    console.log(news);
    if (news.length === 0) {
      return res
        .status(400)
        .send({ message: "There are no news with this title" });
    }

    return res.send({
      news: news.map((newsItem) => ({
        id: newsItem._id,
        title: newsItem.title,
        text: newsItem.text,
        banner: newsItem.banner,
        likes: newsItem.likes,
        comments: newsItem.comments,
        name: newsItem.user.name,
        userName: newsItem.user.username,
        avatar: newsItem.user.avatar,
      })),
    });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "erro ao procurar noticia: " + err.message });
  }
};

export const findByUser = async (req, res) => {
  try {
    const id = req.userId;
    const news = await findByUserIdService(id);

    return res.send({
      news: news.map((newsItem) => ({
        id: newsItem._id,
        title: newsItem.title,
        text: newsItem.text,
        banner: newsItem.banner,
        likes: newsItem.likes,
        comments: newsItem.comments,
        name: newsItem.user.name,
        userName: newsItem.user.username,
        avatar: newsItem.user.avatar,
      })),
    });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Error searching for news: " + err.message });
  }
};

export const update = async (req, res) => {
  try {
    const { title, text, banner } = req.body;
    const { id } = req.params;

    if (!title && !text && !banner) {
      return res
        .status(400)
        .send({ message: "Submit at least one field to upde news." });
    }

    const news = await findByIdService(id);

    if (String(news.user._id) !== req.userId) {
      return res
        .status(400)
        .send({ message: "You are not the owner of this news." });
    }

    await updateService(id, title, text, banner);

    return res.status(200).send({ message: "News updated!" });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Error updating news: " + err.message });
  }
};

export const erase = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await findByIdService(id);

    if (String(news.user._id) !== req.userId) {
      return res.status(400).send({
        message:
          "You can't delete it because you are not the owner of this post.",
      });
    }

    await eraseService(id);

    return res.status(200).send({ message: "News deleted!" });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Error deleting news: " + err.message });
  }
};
