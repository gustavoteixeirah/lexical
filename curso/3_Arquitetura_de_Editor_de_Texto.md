# Aula 3 - Arquitetura de um Editor de Texto

Antes de escrevermos qualquer linha de código, precisamos compreender como um editor de texto funciona por baixo dos panos. Essa visão facilita a resolução de bugs e a criação de funcionalidades mais complexas.

## Tópicos abordados
1. **`contenteditable`**: apresente a propriedade nativa do HTML que permite transformar um elemento em área editável. Explique seus limites e por que muitas bibliotecas preferem manter um estado interno ao invés de manipular o DOM diretamente.
2. **Modelo de estado**: mostre como o Lexical representa o documento em uma árvore de nós. Cada nó (parágrafo, link, imagem) conhece suas próprias regras de renderização.
3. **Seleção e cursor**: discorra sobre a dificuldade de controlar a seleção do usuário, principalmente em contextos de rich text. Mostre exemplos de caret perdido quando manipulamos o DOM manualmente e como o Lexical lida com isso.
4. **Undo/Redo e histórico**: explique a importância de manter um histórico de mudanças coerente para que o usuário possa desfazer ações com segurança.
5. **Performance e acessibilidade**: cite que editores podem ficar pesados se renderizarem tudo de uma vez. O Lexical atualiza apenas o que mudou e possui utilidades para leitores de tela.

Finalize reforçando que entender essa arquitetura nos dará base para aproveitar o Lexical de forma eficiente nas próximas aulas.
