
function pega_mon(){
    nome=document.getElementById("nomepokemon").value
    const pokemon = procuramon(nome)
    console.log(pokemon)
    pokemon.then((dados)=>{
        var nomepoke= dados.nome
        var urlimg  = dados.img
        var tip0 = dados.tipos[0]
        var tip1 = dados.tipos[1]
        text = `<div id='pokeapi'> <ul><li><img src='${urlimg}'> </li>`
        text += `<li>nome: ${nomepoke} </li>`
        if (tip1){
            text += ` <li>tipos: ${tip0}, ${tip1} </li></ul>`
        }else{
            text += ` <li>tipo: ${tip0} </li> </ul>`
        }
        escrita = `<form>Nome do SEU Pokemon <input  type="text" id='nomedado'>`;
        nomedado = document.getElementById('nomedado')
        escrita += ` <button type='submit'onclick='addpoke("${nomepoke}",getNomedadoValue(),"${tip0}","${tip1}","${urlimg}")'>Adicionar</button></form>`
        divi = document.getElementById("local");
        divi.innerHTML = text;
        divi.innerHTML += escrita
        
        
    })
    
}
//pega_mon("mamoswine")

async function procuramon(pokemonName) {
      const informacoes = await fetch("https://pokeapi.co/api/v2/pokemon/"+pokemonName,
      );
      if (!informacoes.ok) {
        throw new Error(`Erro na solicitação: ${response.status}`);
      }
      const jason = await informacoes.json();
      console.log(jason);
      console.log(jason.forms[0].url);
      urlpokemon = jason.forms[0].url
      const pokevdd = await fetch(urlpokemon);
      const jspokevdd= await pokevdd.json();
      console.log(jspokevdd)
      if (jspokevdd.types.length == 2){
        return pokemon={"nome":jspokevdd.name,"tipos":[jspokevdd.types[0].type.name,jspokevdd.types[1].type.name],"img":jspokevdd.sprites.front_default}
      }else{
        return pokemon={"nome":jspokevdd.name,"tipos":[jspokevdd.types[0].type.name],"img":jspokevdd.sprites.front_default}
      }
      
  }
  function addpoke(pokemon,nomedad,tipo0,tipo1,img){
    //alert("Chegou aqui")
    tipo= tipo0+','+tipo1
    ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
            alert(pokemon+" Adicionado com Sucesso!")
        }else if(this.readyState == 4) {
            alert( this.status + " \n " + this.responseText );
        }
    }

    ajax.open("POST", "http://localhost:8001/addpokemon", true );
    ajax.setRequestHeader( "Content-type" ,"application/x-www-form-urlencoded" );
    ajax.send("nomedado="+nomedad+"&nome="+pokemon+"&tipo="+tipo+"&img="+img);
  }
  
function getNomedadoValue() {
  const nomedado = document.getElementById('nomedado');
  return nomedado ? nomedado.value : ''; 
}

function logar(){
    nom = document.getElementById("nomeL").value;
    //senha = document.getElementById("senhaL").value;
    ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function(){
        if( this.readyState == 4 && this.status == 200){
            alert("Voce esta Logado!")
            window.location.href = "registrado.html"
            };
        }
        ajax.open("GET", "http://localhost:8001/login/"+nom, true);
        ajax.send();
        window.location.href = "registrado.html"
    };

function mostrapoke(){
    //cod = document.getElementById("mostrar").value
    ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function(){
        if( this.readyState == 4 && this.status == 200){
            obj = JSON.parse(this.responseText)
            text = "<div id='meupok'><ul>"
            obj.forEach(pokemon => {
                text += `<li><img  src="${pokemon.img}"> </li>`
                text += `<li>id: &nbsp;${pokemon.id} </li>`
                text += `<li>pokemon: &nbsp;${pokemon.nome} </li>`
                text += `<li>nome:&nbsp;&nbsp;${pokemon.nomedado} </li>`
                text += `<li>tipo:&nbsp;&nbsp;${pokemon.tipo} </li>`
                text += `<li>treinador: &nbsp;${pokemon.idtreinador} </li></ul>`

            },text = "</div>");
            div = document.getElementById("last")
            div.innerHTML = text;
            div.style.color= "black;";
            div.style.backgroundcolor= "beige";
            
            
            };
    }        
    ajax.open("GET", "http://localhost:8001/verpoke/"/*+cod*/, true);
    ajax.send();

    }

function addtreinador(){
    nome= document.getElementById("nomeC").value
    email= document.getElementById("emailC").value
    senha= document.getElementById("senhaC").value
    ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
            alert(Nome+" Cadastrado com Sucesso!")
        }else if(this.readyState != 4) {
            alert( this.status + " \n " + this.responseText );
        }
    }
    ajax.open("POST", "http://localhost:8001/addtreinador", true );
    ajax.setRequestHeader( "Content-type" ,"application/x-www-form-urlencoded" );
    ajax.send("nome="+nome+"&email="+email+"&senha="+senha);
}
function Lgoogle(){
    window.location.href = 'http://localhost:8001/auth/google';
   // window.location.href = "registrado.html"
}
function delpokemon() {
    id = window.prompt("Qual Id do pokemon que deseja Excluir?")
    ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function(){
        if( this.readyState == 4 && this.status == 200){
           alert("pokemon Solto á natureza! ")
           mostrapoke();
        }
    };
    ajax.open("DELETE", "http://localhost:8001/pokemon/"+id,true);
    ajax.send();
}    
function mudanome() {
    id = Number(window.prompt("Qual Id do pokemon que deseja Modificar o Nome?"))
    nam = window.prompt("Novo Nome do Pokemon? ")
    ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function(){
        if( this.readyState == 4 && this.status == 200){
           mostrapoke();
        }
    };
    ajax.open("PUT", "http://localhost:8001/pokemon/"+id+"/"+nam,true);
    ajax.send();
}    
