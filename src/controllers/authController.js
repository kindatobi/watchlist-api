import { prisma } from "../config/db.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    return res
      .status(400)
      .json({ error: "user already exists with this email" });
  }
};

export { register };
