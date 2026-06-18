const express = require('express');
const app = express();
const aiRoutes = require('./routes/aiRoutes');

app.use(express.json());


app.use('/api/ai', aiRoutes);

app.get('/',  (req, res) => {
    res.send('Celine AI Assistant Server is Running!');
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is live on port ${PORT}`);
});
