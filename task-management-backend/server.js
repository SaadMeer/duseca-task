const { PORT } = require('./config');
const express = require('express');
console.log("here")
const app = express();
app.use(express.json());
//set cors
const cors = require('cors');
app.use(cors({
    origin: '*'
}));
//set helmet
const helmet = require('helmet');
app.use(helmet({
    contentSecurityPolicy: false,
}));

require('./config/db')

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
