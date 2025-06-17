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

## Estrutura de diretórios inicial
Após rodar o gerador de projeto, veremos algo parecido com:
```
lexical-editor/
├─ src/
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ index.css
├─ public/
│  └─ vite.svg
├─ package.json
└─ tsconfig.json
```
Comente brevemente a função de cada arquivo, lembrando que `main.tsx` é o ponto de entrada da aplicação. Explique também que o arquivo `vite.config.ts` (ou `webpack.config.js` no CRA) poderá ser ajustado caso adicionemos plugins de build no futuro.

## Configurações de lint e formatação
1. Instale o ESLint e o Prettier se desejar padronizar o código:
   ```bash
   npm install -D eslint prettier eslint-plugin-react eslint-config-prettier
   ```
2. Crie um arquivo `.eslintrc.json` com um conjunto de regras básico. Demonstre rapidamente como rodar `npx eslint src --fix` para corrigir problemas automaticamente.
3. Configure o Prettier criando `.prettierrc` e adicionando um script no `package.json` para `npm run format`.

## Preparando o editor
Antes de adicionarmos o Lexical, crie o componente `Editor.tsx` com o seguinte conteúdo base:
```tsx
import {LexicalComposer} from "@lexical/react/LexicalComposer";
import React from "react";

export default function Editor() {
  const initialConfig = {namespace: "MyEditor"};
  return (
    <LexicalComposer initialConfig={initialConfig}>
      {/* plugins virão aqui */}
    </LexicalComposer>
  );
}
```
Explique cada parte deste código: o `LexicalComposer` cuida do estado do editor, enquanto `initialConfig` guarda opções iniciais.

## Atualizando o `App.tsx`
Substitua o conteúdo padrão por:
```tsx
import Editor from "./Editor";

export default function App() {
  return (
    <div className="App">
      <h1>Editor Lexical</h1>
      <Editor />
    </div>
  );
}
```
Ressalte que estamos mantendo tudo simples para focar no editor.

## Rodando a aplicação
Execute `npm run dev` e abra o navegador no endereço indicado (geralmente `http://localhost:5173`). Deverá aparecer o título e a área onde o editor será renderizado.

Caso enfrente problemas, verifique permissões e se as dependências foram instaladas corretamente.

Na próxima aula veremos detalhes da arquitetura de um editor de texto e por que o Lexical facilita esse trabalho.
