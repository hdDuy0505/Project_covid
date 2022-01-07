const express = require('express'),
      app = express(),
      port =  process.env.PORT || 3000,
      path = require('path');

require('./middlewares/handlebars')(app);
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'images')));
app.use('/', require('./controllers/home.C'));
app.use('/admin', require('./controllers/admin/main.C'));
app.use('/manager', require('./controllers/manager/main.C'));
app.use('/user', require('./controllers/user/main.C'));

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
