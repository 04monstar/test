const bcrypt = require('bcrypt');

const hashed = async(password) => {
  try{
    const salt = await bcrypt.genSalt(12)
    const hashPass = await bcrypt.hash(password,salt);
    return hashPass
  }
  catch(err){
    throw new Error(err.message)
  }
};

const comparePass = async (password,hashed) =>{
    try{
       const isMatch = await bcrypt.compare(password,hashed)
       return isMatch
    }
    catch(err){
        throw new Error(err.message)
    }
};

module.exports = {
    hashed,
    comparePass
}