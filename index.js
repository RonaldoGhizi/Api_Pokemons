const restify = require("restify");
const errors = require("restify-errors");

const corsMiddleware = require('restify-cors-middleware2');

const cors = corsMiddleware({
   origins: ['*'],
});
logado=[]
const servidor = restify.createServer({
    name : 'Pokeapi' ,
    version : '1.0.0'
});
var logado = []

servidor.get( '/' , (req, res, next) => {
    res.send('Bem vindo a apiPokedex');
 });

servidor.use( restify.plugins.acceptParser(servidor.acceptable) );
servidor.use( restify.plugins.queryParser());
servidor.use( restify.plugins.bodyParser());

servidor.pre(cors.preflight);
servidor.use(cors.actual);

servidor.listen( 8001 , function(){
    console.log("%s funcionando no link http://localhost:8001", 
    servidor.name);
});

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
                     console.log(logado)
                }else{
                    logado = [dados.nome,dados.id]
                    console.log(logado)
                }
            }}, next) ;
});

servidor.get( '/agua' , (req, res, next) => {
    if (logado.length >= 1){
        knex('pokemon').select("*").where("idtreinador",logado[1]).then( (dados) =>{
            res.send( dados );
            //res.send(logado);
        }, next) ; 
    }else{
        res.send(new errors.BadRequestError('Voce não esta logado!'))
    }
});

servidor.post( '/addpokemon' , (req, res, next) => {
    if (logado.length >= 1){
    knex('pokemon')
        .insert( req.body,logado[1])
        .then( (dados) =>{
            res.send( dados );
        },next) ;}else{
            res.send(new errors.BadRequestError('Voce não esta logado!'))
        }
});

servidor.get( '/verpoke/:id' , (req, res, next) => {
    const idtrei= req.params.id;
    knex('pokemon')
        .where('idtreinador',idtrei)
        .then( (dados) =>{
            if( !dados || dados =="" ){
                return res.send(
                    new errors.BadRequestError('Treinador não Cadastrado!'));
            }
            else{
                res.send( dados );
            }}, next) ;
});

servidor.post( '/addtreinador' , (req, res, next) => {
    knex('treinador')
        .insert( req.body)
        .then( (dados) =>{
            res.send( dados );
        },next) ; 
});