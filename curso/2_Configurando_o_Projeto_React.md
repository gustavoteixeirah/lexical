# Aula 2 - Configurando o Projeto React

Começaremos criando a base do nosso projeto em React. Use o terminal para executar cada comando enquanto explica no vídeo.

## Passo a passo
1. **Criar o projeto**: execute `npm create vite@latest lexical-editor` e escolha `React` com `TypeScript`. Caso prefira CRA, use `npx create-react-app lexical-editor --template typescript`.
2. **Entrar na pasta**: `cd lexical-editor`.
3. **Instalar dependências do Lexical**:
   ```bash
   npm install lexical @lexical/react
   ```
4. **Abrir o projeto em seu editor de código** (VS Code, por exemplo) e apresentar a estrutura inicial de arquivos.
5. **Limpar arquivos desnecessários** da criação padrão, como logos e estilos genéricos.
6. Criar um componente `Editor.tsx` vazio, onde iremos montar o editor nas próximas aulas.
7. Ajustar o arquivo `App.tsx` para renderizar o novo componente `Editor`.
8. Rodar `npm run dev` (ou `npm start` no CRA) e mostrar a aplicação em funcionamento na porta indicada.

Explique que o projeto ainda não possui o editor, mas já está pronto para receber os plugins do Lexical. Reforce a importância de deixar o ambiente funcional para evitar problemas nas aulas futuras.
