const express = require("express");
const fs = require("fs");
const app = express();

// Middleware para processar JSON
app.use(express.json());

// Array para armazenar os usuários (em memória)
let usuarios = [];

// Função para salvar os usuários em um arquivo JSON
const salvarUsuariosEmArquivo = () => {
  fs.writeFileSync("usuarios.json", JSON.stringify(usuarios, null, 2), "utf-8");
  console.log("Usuários salvos no arquivo usuarios.json");
};

// Função para carregar os usuários de um arquivo JSON
const carregarUsuariosDeArquivo = () => {
  if (fs.existsSync("usuarios.json")) {
    const dados = fs.readFileSync("usuarios.json", "utf-8");
    usuarios = JSON.parse(dados);
    console.log("Usuários carregados do arquivo usuarios.json");
  }
};

// Carregar dados de usuários ao iniciar o servidor
carregarUsuariosDeArquivo();

// Middleware para logar requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rota para listar os usuários
app.get("/usuarios", (req, res) => {
  res.status(200).json({
    sucesso: true,
    usuarios,
  });
});

// Rota para buscar um usuário específico pelo ID
app.get("/usuarios/:id", (req, res) => {
  const { id } = req.params;
  const usuario = usuarios.find((u) => u.id === parseInt(id));

  if (!usuario) {
    return res.status(404).json({
      sucesso: false,
      mensagem: "Usuário não encontrado!",
    });
  }

  res.status(200).json({
    sucesso: true,
    usuario,
  });
});

// Rota para adicionar um novo usuário
app.post("/usuarios", (req, res) => {
  const { nome, email } = req.body;
  if (!nome || !email) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Nome e email são obrigatórios!",
    });
  }

  const novoUsuario = { id: usuarios.length + 1, nome, email };
  usuarios.push(novoUsuario);
  salvarUsuariosEmArquivo(); // Salva após a adição

  res.status(201).json({
    sucesso: true,
    mensagem: "Usuário adicionado com sucesso!",
    usuario: novoUsuario,
  });
});

// Rota para adicionar múltiplos usuários
app.post("/usuarios/multiple", (req, res) => {
  const novosUsuarios = req.body; // Espera um array de usuários
  if (!Array.isArray(novosUsuarios)) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "É necessário enviar um array de usuários.",
    });
  }

  // Validação de cada usuário no array
  novosUsuarios.forEach((usuario) => {
    if (!usuario.nome || !usuario.email) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Nome e email são obrigatórios para todos os usuários!",
      });
    }
  });

  // Adiciona os novos usuários ao array
  const usuariosAdicionados = novosUsuarios.map((usuario, index) => ({
    id: usuarios.length + index + 1, // Garantir que os IDs sejam únicos
    ...usuario,
  }));

  usuarios = [...usuarios, ...usuariosAdicionados];
  salvarUsuariosEmArquivo(); // Salva após a adição

  res.status(201).json({
    sucesso: true,
    mensagem: "Usuários adicionados com sucesso!",
    usuarios: usuariosAdicionados,
  });
});

// Rota para deletar um usuário pelo ID
app.delete("/usuarios/:id", (req, res) => {
  const { id } = req.params;
  const index = usuarios.findIndex((usuario) => usuario.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({
      sucesso: false,
      mensagem: "Usuário não encontrado!",
    });
  }

  // Remove o usuário do array
  usuarios.splice(index, 1);
  salvarUsuariosEmArquivo(); // Salva os dados após a exclusão

  res.status(200).json({
    sucesso: true,
    mensagem: "Usuário excluído com sucesso!",
  });
});

// Rota para deletar múltiplos usuários (deletar todos)
app.delete("/usuarios", (req, res) => {
  usuarios = []; // Limpa todos os usuários
  salvarUsuariosEmArquivo(); // Salva os dados após a exclusão de todos

  res.status(200).json({
    sucesso: true,
    mensagem: "Todos os usuários foram excluídos com sucesso!",
  });
});

// Função para pausar o servidor
const pausarServidor = () => {
  console.log("Servidor pausado. Salvando usuários...");
  salvarUsuariosEmArquivo(); // Salva os usuários antes de pausar

  setTimeout(() => {
    console.log("Servidor sendo desligado...");
    process.exit(); // Desliga o servidor
  }, 2000); // Tempo de espera antes de desligar o servidor (2 segundos)
};

// Comando para parar o servidor via requisição
app.post("/parar", (req, res) => {
  res.status(200).json({
    sucesso: true,
    mensagem: "Servidor será pausado e desligado.",
  });
  pausarServidor(); // Chama a função para pausar e salvar dados antes de parar o servidor
});

// Inicializando o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
