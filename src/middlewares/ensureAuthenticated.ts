import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken"

interface IPayload {
  sub: string
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({
      message: "Token missing!"
    })
  }

  // Bearer 9494819519511-16516841
  const [, token] = authHeader.split(" ")
  // [0] - Bearer --> ignorar / [1] - 9494819519511-16516841 "token" --> esse é o que precisa 

  try {
    const { sub } = verify(token, "da810830ccf26cc3fcfd19370bdb9c4b") as IPayload

    request.id_user = sub

    return next()
  } catch (error) {
    return response.status(401).json({
      message: "Invalid Token!"
    })
  }
}
