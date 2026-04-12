export const setTokenCookie = (res, token) => {
  res.cookie("jwt", token, {
    httpOnly: "true",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
};
