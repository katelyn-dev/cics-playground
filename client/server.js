const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000
const REACT_APP_HOST = process.env.REACT_APP_HOST || "https://cics-playground-3c82391e5815.herokuapp.com"
const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL || "https://cics-playground-3c82391e5815.herokuapp.com"

app.use(express.static('build'))
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))
app.listen(REACT_APP_HOST, () => console.log(`Listening on PORT ${REACT_APP_HOST}`))
app.listen(REACT_APP_BASE_URL, () => console.log(`Listening on PORT ${REACT_APP_BASE_URL}`))