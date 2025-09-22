import { validateToken } from '../utils/jwt.js' 

export const auth = (req, res, next) => {
  const token = req.cookies.access_cookie
  req.session = { userData: null }
  
  try {
    const data = validateToken(token)
    req.session.userData = data
  } catch (e) {
    // Token is invalid or expired
    req.session.userData = null
  }
  
  next()
}