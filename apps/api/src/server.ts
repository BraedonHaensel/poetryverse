import 'dotenv/config'

import app from './app'
import config from './lib/config'

app.listen(config.port, () => {
  console.log(`API server running on http://localhost:${config.port}`)
})
