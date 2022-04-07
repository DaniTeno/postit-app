const handleHttpError = (res, msg = 'ERROR?', code = 403) => {
    res.status(code)
    res.send({error: msg})
}

module.exports = {handleHttpError} 