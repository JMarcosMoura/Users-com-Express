# Servidor Express

### O que faz?
Esse **Servidor Express** armazena informações de clientes ou deleta aqueles através dos métodos HTTP ( `POST` e `DELETE` )

##

### Pré-requisitos
Este projeto utiliza o framework **Express** para gerenciar o backend. Siga os passos abaixo para configurá-lo:
1. Certifique-se de que você está na pasta raiz do projeto.
2. Instale as dependências necessárias executando o seguinte comando: `npm install express`
3. Tenha o *Node.js* instalado

---

## Funções e como usar

### Inicie o Servidor
Para iniciar o servidor:
1. Abra o terminal
2. Digite: `node server.js`

##

### Adicione ou remova usuários
Os comandos para adiconar e remover usuarios do Servidor estão listadas no arquivo `requests.http`

É necessário que:
1. Instale a extensão *REST Client* no seu **VSCode**
2. Faça a alteração que desejar
3. Clique em `Send Request` para atualizar o Servidor

##

### Parar o Servidor
O Servidor desse repositório armazena as informações dos usuários antes de fechar. Então para **parar** o Servidor e armazenar as informações dos usuários tenha a extensão `requests.http` instalada e execute o comando `Send Request` no campo 
especificado
