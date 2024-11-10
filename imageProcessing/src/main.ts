import express from 'express';
import imageProcessRoutes from './utilities';

const app = express();
const port: number = 3000;

imageProcessRoutes(app);

app.listen(port, (): void => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
