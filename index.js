'use strict';

const PORT = process.env['PORT'] || 3010;

const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

app.set('view engine', 'ejs');

const { createClient } = require('@supabase/supabase-js')

const sbURL = process.env['SUPABASE_URL'];
const sbKEY = process.env['SUPABASE_KEY'];
const supabase = createClient(sbURL, sbKEY);

app.get('/', home);
app.post('/update', update);
app.use('*', routeNotFound);
app.use(bigError);

function home(req, res) {
  const main = async () => {
    let { data, error } = await supabase
      .from('candles')
      .select('*')

    if (error) {
      console.error(error)
      return
    }
    res.status(200).render('pages/home', { output: data })
  }

  main()
}

function update(req, res) {
  let input = req.body
  if (input.column === 'num') {
    const main = async () => {
      let { data, error } = await supabase
      .from('candles')
      .update({ other_column: input.name })
      .eq(input.name, input.value)
    }
  
res.redirect('/');
  }
}

//----------404 Error
function routeNotFound(req, res) {
  res.status(404).send('Route NOT Be Found!');
}

//----------All Errors minus 404
function bigError(error, res) {
  console.log(error);
  res.status(error).send('BROKEN!');
}

//----------Connect to Server and Database
app.listen(PORT, () => console.log(`WORKING!: ${PORT}`));
