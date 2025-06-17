# Aula 17 - Integração com Kekule.js para Química

Algumas áreas, como química e biologia, demandam a inserção de estruturas moleculares. A biblioteca Kekule.js fornece componentes para desenhar e visualizar moléculas em 2D ou 3D.

## Passos de integração
1. Instale o pacote `kekule` com `npm install kekule` ou inclua o script CDN no HTML.
2. Crie um componente `MoleculePlugin` que abre o editor do Kekule em um modal quando o usuário clica em "Inserir Molécula" na toolbar.
3. Após desenhar a estrutura, o Kekule permite exportar a representação em SVG. Insira esse SVG como um `DecoratorNode` dentro do Lexical.
4. Guarde também a string SMILES ou outra representação em texto para permitir edição posterior.
5. Ao clicar na molécula já inserida, reabra o modal carregando a estrutura salva para que o usuário possa modificá-la.

Mostre a utilização em um exemplo de publicação científica, ressaltando como o Lexical é flexível para comportar diferentes tipos de conteúdo.
