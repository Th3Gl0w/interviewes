module.exports = () => {
    const date = new Date()
    const twoWeeksFromCreationDate = date.setDate(date.getDate() + 14)
    const expiration = new Date(twoWeeksFromCreationDate).toDateString()
    console.log(expiration)
    return expiration
}

