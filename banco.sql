create database pokedex;

use pokedex;

create table treinador (
id int primary key auto_increment,
nome varchar(255) not null,
email varchar(255) not null,
senha varchar(255) not null
);

create table pokemon (
id int primary key auto_increment not null,
nomedado varchar(255) null,
nome varchar(255) not null,
tipo varchar(255) not null,
idtreinador int not null,
FOREIGN KEY (idtreinador) REFERENCES treinador(id)
);
drop table pokemon;

insert into treinador (nome,email,senha)  values ("Ash Ketchum","AshKetchum@gmail.com","pikachu123"),("Leon","Leon@hotmail.com","charizard");
insert into pokemon (nomedado,nome,tipo,idtreinador)  values ("Jean Luc","pikachu","electric",1),("char","charmander","fire",2),("foguin","torchic","fire",1);

select * from treinador;
select * from pokemon;
