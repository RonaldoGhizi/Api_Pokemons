
function pega_mon(){
    nome=document.getElementById("nomepokemon").value

    const pokemon = procuramon(nome)
    console.log(pokemon)
    pokemon.then((dados)=>{
        var nomepoke= dados.nome
        var urlimg  = dados.img
        var tip0 = dados.tipos[0]
        var tip1 = dados.tipos[1]
        text = `<ul> <li>nome: ${nomepoke} </li>`
        text += ` <li>tipo: ${tip0} </li>`
        if (tip1){
            text += ` <li>tipo02: ${tip1} </li>`
        }
        text += ` <li><img src='${urlimg}'> </li><ul>`
        escrita = `<form>Nome do SEU Pokemon <input  type="text" id='nomedado'>`;
        nomedado = document.getElementById('nomedado')
        escrita += ` <button type='submit'onclick='addpoke("${nomepoke}",getNomedadoValue(),"${tip0}","${tip1}")'>Adicionar</button></form>`
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
  function addpoke(pokemon,nomedad,tipo0,tipo1){
    //alert("Chegou aqui")
    tipo= tipo0+tipo1
    ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
            alert(pokemon+" Adicionado com Sucesso!")
        }else if(this.readyState == 4) {
            alert( this.status + " \n " + this.responseText );
        }
    }
    //alert(pokemon+" KAKAKAKAK")
    ajax.open("POST", "http://localhost:8001/addpokemon", true );
    ajax.setRequestHeader( "Content-type" ,"application/x-www-form-urlencoded" );
    ajax.send("nomedado="+nomedad+"&nome="+pokemon+"&tipo="+tipo+"&idtreinador="+2);
  }
  
function getNomedadoValue() {
  const nomedado = document.getElementById('nomedado');
  return nomedado ? nomedado.value : ''; // Retorna o valor se o elemento existir, senão retorna uma string vazia
}
function funcao(){
    window.location.href = "registrado.html"
}

function logar(){
    nom = document.getElementById("nomeL").value;
    //senha = document.getElementById("senhaL").value;
    ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function(){
        if( this.readyState == 4 && this.status == 200){
            alert("Voce esta Logado!")
            funcao()
            };
        }
        
        ajax.open("GET", "http://localhost:8001/login/"+nom, true);
        ajax.send();
        funcao()
    };

function mostrapoke(){
    cod = document.getElementById("mostrar").value
    ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function(){
        if( this.readyState == 4 && this.status == 200){
            obj = JSON.parse(this.responseText)
            text = "<ul>"
            obj.forEach(pokemon => {
                text += `<li>${pokemon.id} </li>`
                text += `<li>${pokemon.nome} </li>`
                text += `<li>${pokemon.nomedado} </li>`
                text += `<li>${pokemon.tipo} </li>`
                text += `<li>${pokemon.idtreinador} </li> <br>`

            },text = "</ul>");
            div = document.getElementById("last")
            div.innerHTML = text;
            div.style.color= "black"
            };
    }        
    ajax.open("GET", "http://localhost:8001/verpoke/"+cod, true);
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