# Aula 15 - Inserindo Equações com KaTeX

Muitos editores precisam de suporte a fórmulas matemáticas. O KaTeX é uma biblioteca rápida para renderizar expressões em LaTeX.

## Instalação
1. Rode `npm install katex @types/katex` e importe o CSS principal em `index.css`:
   ```css
   @import 'katex/dist/katex.min.css';
   ```

## Criando o EquationNode
1. Crie uma classe `EquationNode` estendendo `DecoratorNode` para armazenar a expressão em texto.
2. No método `decorate`, utilize `katex.renderToString(value)` e exiba o resultado dentro de um `span` ou `div`.
3. Registre o node usando `editor.registerNode(EquationNode)` no `Editor`.

## Plugin de inserção
1. Construa um plugin com um pequeno formulário permitindo digitar a expressão em LaTeX.
2. Ao submeter, crie uma instância de `EquationNode` e insira no editor no ponto da seleção.
3. Permita a edição posterior abrindo novamente o formulário ao clicar duas vezes sobre a equação.

Com esse plugin, seus usuários poderão escrever fórmulas matemáticas de forma simples e com excelente performance.
