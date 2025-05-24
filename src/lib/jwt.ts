import jwt from 'jsonwebtoken'

const JWT_SECRET = import.meta.env.JWT_SECRET
const JWT_ALGORITHM = import.meta.env.JWT_ALGORITHM

export const createJWT = (payload: any) => {
  return jwt.sign(payload, JWT_SECRET, {
    algorithm: JWT_ALGORITHM as jwt.Algorithm
  })
}
