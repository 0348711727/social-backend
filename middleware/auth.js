const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        // const token = req.headers.authorization.split(' ')[1];

        const token = req.header("Authorization");
        console.log(token);
        const isDecoded = token.length < 500 //<500 là token tự tạo, >500 là của gg auth

        let decodedData;

        if(token && isDecoded)
        {
            decodedData = jwt.verify(token, 'test')

            req.userId = decodedData?.id;
        }
        else
        {
            decodedData = jwt.decode(token);

            req.userId = decodedData?.sub;
        }

        next();
    } catch (error) {
        console.log(error);
    }
}
module.exports = auth;