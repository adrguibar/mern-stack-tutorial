import {
  create,
  findAll,
  topNews,
  findById,
  searchByTitle,
  findByUser,
  update,
  erase,
  likeNews,
  addComment,
  deleteComment
} from "../controllers/news.controller.js";
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { validNews } from "../middlewares/global.middlewares.js";

const router = Router();

router.post("/", authMiddleware, validNews, create);
router.get("/", findAll);
router.get("/top", topNews);
router.get("/search", searchByTitle);
router.get("/byUser", authMiddleware, findByUser);
router.get("/:id", authMiddleware, findById);
router.patch("/:id", authMiddleware, update);
router.delete("/:id", authMiddleware, erase);
router.patch("/like/:id", authMiddleware, likeNews);
router.patch("/comment/:id", authMiddleware, addComment);
router.patch("/comment/:idNews/:idComment", authMiddleware, deleteComment);

export default router;
