import config from "./lib/config";
import app from './app';

app.listen(config.port, () => {
  console.log(`API server running on http://localhost:${config.port}`);
});
