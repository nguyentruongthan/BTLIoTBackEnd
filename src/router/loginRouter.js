import express from "express";

let router = express.Router();
//get login
router.get('/', (req, res) => {
  console.log("recv login request");
  return res.status(200).json({ message: 'Login page' });
});

export default router;