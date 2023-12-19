const restify = require("restify");
const errors = require("restify-errors");
const passport = require('passport');
const axios = require('axios');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const corsMiddleware = require('restify-cors-middleware2');
const session = require('express-session');

const cors = corsMiddleware({
   origins: ['*'],
});
logado=[]
const servidor = restify.createServer({
    name : 'Pokeapi' ,
    version : '1.0.0'
});

servidor.get( '/' , (req, res, next) => {
    res.send('Bem vindo a apiPokedex');
 });
 
servidor.use( restify.plugins.acceptParser(servidor.acceptable) );
servidor.use( restify.plugins.queryParser());
servidor.use( restify.plugins.bodyParser());
//servidor.use(restify.plugins.serveStaticFiles);
servidor.use(session({ secret: 'dogs', resave: false, saveUninitialized: true }));
servidor.use(passport.initialize());
servidor.use(passport.session());



servidor.pre(cors.preflight);
servidor.use(cors.actual);
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});
passport.use(new GoogleStrategy({
    clientID: '460125493114-clmd5guupgklbavtmn57thldighf6g8j.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:8001/auth/google/callback'
},
    function (request,token, tokenSecret, profile, done) {
        // Aqui você deve verificar se o usuário está autorizado a acessar sua aplicação
        return done(null, profile);
    }
));
var logado = [];
async function logando(nome,email, senha) {
    try {
      // Consultar o banco de dados para obter o ID do usuário
      const cod = await knex('treinador').select('id').where({
        email: email,
        senha: senha
      }).first();

      if (cod) {
        if (logado != null) {
            logado = null
            logado = [cod.id,nome,email,senha]
        }else{
            logado = [cod.id,nome,email,senha]
        }
        console.log(logado);
        console.log(`Usuário ${logado[1]} conectado.`);
      } else {
        console.log('Usuário não encontrado no banco de dados.');
      }
    } catch (error) {
      console.error('Erro ao consultar o banco de dados:', error);
    }
  }
// Rotas de autenticação
servidor.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login','email'] })
);
servidor.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    async function (req, res) {
        const email = req.user._json.email;  
        const nome = req.user.displayName;
        const senha = req.user._json.sub;
        //console.log(req)
        const treinadorexiste = await knex('treinador').select('nome').where('nome', nome);
        if (treinadorexiste.length > 0) {
              console.log("Este Login já existe");
              logando(nome,email,senha)
            } else {
              await knex('treinador').insert({
                nome: nome,
                email: email,
                senha: senha
              });
              logando(nome,email,senha)
            }
        res.setHeader('Location', 'http://127.0.0.1:5501/registrado.html');
        res.send(302);
    }
);



var knex = require('knex')({
    client : 'mysql' ,
    connection : {
        host : 'localhost' ,
        user : 'root' ,
        password : '' ,
        database : 'pokedex'
    }
});

servidor.get( '/login/:name' , (req, res, next) => {
    const nometre= req.params.name;
    knex('treinador')
        .where('nome',nometre)
        .first()
        .then( (dados) =>{
            if( !dados || dados =="" ){
                return res.send(
                    new errors.BadRequestError('Treinador não Cadastrado!'));
            }
            else{
                res.send( dados );
                if (logado.length > 2){
                     logado= []
                     logado= [dados.nome,dados.id]
                     //console.log(logado)
                }else{
                    logado = [dados.nome,dados.id]
                    //console.log(logado)
                }
            }}, next) ;
});
/*
server.get('/public/*',
     restify.plugins.serveStaticFiles('./documentation/v1', {
     maxAge: 3600000, // this is in millisecs
     etag: false,
     setHeaders: function setCustomHeaders(response,'registrado.html', true) {
             response.setHeader('restify-plugin-x', 'awesome');
         }
     })
);*/
servidor.get( '/ar' , (req, res, next) => {
    knex('treinador').select("*").then( (dados) =>{
        res.send( dados );
        //res.send(logado);
    }, next) ; 
});
servidor.get( '/terra' , (req, res, next) => {
        knex('pokemon').select("*").then( (dados) =>{
            res.send( dados );
            //res.send(logado);
        }, next) ; 
});
servidor.get( '/agua' , (req, res, next) => {
    if (logado.length >= 1){
        knex('pokemon').select("*").where("idtreinador",logado[0]).then( (dados) =>{
            res.send( dados );
            //res.send(logado);
        }, next) ; 
    }else{
        res.send(new errors.BadRequestError('Voce não esta logado!'))
    }
});

servidor.post( '/addpokemon' , (req, res, next) => {
    if (logado.length >= 1){
        console.log(req.body)
        req.body.idtreinador = logado[0];
        console.log(req.body)
        knex('pokemon')
        .insert(req.body)
        .then( (dados) =>{
            res.send( dados );
        },next) ;}else{
            res.send(new errors.BadRequestError('Voce não esta logado!'))
        }
});

servidor.get( '/verpoke/:id' , (req, res, next) => {
    if (logado.length >= 1){
    //const idtrei= req.params.id;
    knex('pokemon')
        .where('idtreinador',logado[0])
        .then( (dados) =>{
            if( !dados || dados =="" ){
                return res.send(
                    new errors.BadRequestError('Treinador não Cadastrado!'));
            }
            else{
                res.send( dados );
            }}, next)}
            else{
                res.send(new errors.BadRequestError('Voce não esta logado!'))
            };
});

servidor.post( '/addtreinador' , (req, res, next) => {
    knex('treinador')
        .insert( req.body)
        .then( (dados) =>{
            res.send( dados );
        },next) ; 
});
servidor.del( '/pokemon/:idPoke' , (req, res, next) => {
    const idpokemon = req.params.idPoke;
    knex('pokemon')
        .where( 'id' , idpokemon)
        .delete()
        .then( (dados) =>{
            if( !dados ){
                return res.send(
                    new errors.BadRequestError('Pokemon não encontrado'));
            }
            else{
                res.send( "Pokemon Soltado!" );
            }
        }, next) ; 
});
servidor.put( '/pokemon/:idpoke/:nome' , (req, res, next) => {
    const idPokemon = req.params.idpoke;
    const nomenov = req.params.nome;
    req.body = nomenov
    knex('pokemon')
        .where( 'id' , idPokemon)
        .update('nomedado',req.body )
        .then( (dados) =>{
            if( !dados ){
                return res.send(
                    new errors.BadRequestError('Pokemon não encontrado'));
            }
            res.send( "Pokemon Atualizado" );
        }, next) ; 
});
servidor.listen( 8001 , function(){
    console.log("%s funcionando no link http://localhost:8001", 
    servidor.name);
});