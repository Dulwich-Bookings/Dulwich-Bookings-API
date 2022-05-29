// export default function auth(tokenType = 'accessToken') {
//   return (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (authHeader) {
//       try {
//         const [bearer, token] = authHeader.split(' ');
//         if (bearer.toLowerCase() !== 'bearer' || !token) {
//           throw Error;
//         }
//       } catch (err) {
//         return res
//           .status(401)
//           .send({success: false, message: 'Bearer token malformed'});
//       }
//     } else {
//       return res
//         .status(401)
//         .send({success: false, message: 'Authorization header not found'});
//     }
//   };
// }
