import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";
import { generateToken } from "../utils/generateToken.js";
import { setTokenCookie } from "../utils/setTokenCookie.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await prisma.user.findUnique({
    where: { email: email },
  });

  if (userExists) {
    return res
      .status(400)
      .json({ error: "user already exists with this email" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  const token = generateToken(user.id);
  setTokenCookie(res, token);

  res.status(201).json({
    message: "User successfully created",
    user: { id: user.id, name: user.name, email: user.email },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    return res.status(401).json({ error: "invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ error: "invalid email or password" });
  }

  const token = generateToken(user.id);
  setTokenCookie(res, token);

  return res.json({
    message: "login successful",
    user: { id: user.id, name: user.name, email: user.email },
    token,
  });
};

const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ message: "logged out successfully" });
};

export { register, login, logout };
