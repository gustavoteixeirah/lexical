# Aula 3 - Arquitetura de um Editor de Texto

Antes de escrevermos qualquer linha de código, precisamos compreender como um editor de texto funciona por baixo dos panos. Essa visão facilita a resolução de bugs e a criação de funcionalidades mais complexas.

## Tópicos abordados
1. **`contenteditable`**: apresente a propriedade nativa do HTML que permite transformar um elemento em área editável. Explique seus limites e por que muitas bibliotecas preferem manter um estado interno ao invés de manipular o DOM diretamente.
2. **Modelo de estado**: mostre como o Lexical representa o documento em uma árvore de nós. Cada nó (parágrafo, link, imagem) conhece suas próprias regras de renderização.
3. **Seleção e cursor**: discorra sobre a dificuldade de controlar a seleção do usuário, principalmente em contextos de rich text. Mostre exemplos de caret perdido quando manipulamos o DOM manualmente e como o Lexical lida com isso.
4. **Undo/Redo e histórico**: explique a importância de manter um histórico de mudanças coerente para que o usuário possa desfazer ações com segurança.
5. **Performance e acessibilidade**: cite que editores podem ficar pesados se renderizarem tudo de uma vez. O Lexical atualiza apenas o que mudou e possui utilidades para leitores de tela.

Finalize reforçando que entender essa arquitetura nos dará base para aproveitar o Lexical de forma eficiente nas próximas aulas.

## Desenhando a estrutura de dados
Um editor moderno geralmente utiliza uma árvore de nós para representar o conteúdo. No Lexical, cada nó possui informações sobre seu tipo, conteúdo textual e atributos específicos. Apresente um desenho simplificado:
```
Root
 ├─ Paragraph
 │   ├─ Text("Olá mundo")
 │   └─ Bold("!")
 └─ List
     ├─ ListItem
     │   └─ Text("Primeiro")
     └─ ListItem
         └─ Text("Segundo")
```
Esse modelo facilita operações como inserir, remover ou mover trechos do documento de forma previsível.

## Lifecycle do editor
Explique que o editor do Lexical passa por etapas de inicialização, atualização e destruição:
1. **Inicialização**: criamos uma instância do editor com `createEditor()` ou pelo `LexicalComposer`, definindo plugins e nós personalizados.
2. **Atualizações**: a cada modificação do usuário, o Lexical gera um novo estado de editor e dispara eventos para plugins reagirem.
3. **Destruição**: quando o componente é desmontado, é importante limpar listeners para evitar vazamentos de memória.

## Plugins e dispatch
O Lexical utiliza o conceito de comandos e listeners. Plugins podem registrar comandos como `FORMAT_TEXT_COMMAND` e reagir a eventos de teclado, clique ou seleção. Esse padrão evita manipulação direta do DOM e torna o fluxo previsível.

## Desafios comuns
- **Sincronização com frameworks**: mostrar como frameworks reagem a mudanças no editor sem gerar conflitos.
- **Colaboração**: comentar que múltiplos usuários exigem controle de conflitos e que veremos soluções na aula específica.
- **Persistência de histórico**: para editores complexos, salvar o histórico pode se tornar custoso. Dicas para mitigar usando limites de pilha e checkpoints.

## Recomendações de leitura
Inclua links para artigos ou trechos da documentação do Lexical sobre como funciona seu sistema de nós e reconciliador.

Com essa base teórica, estaremos prontos para montar nosso primeiro editor na próxima aula.

## Exemplos na prática
No vídeo, abra o console do navegador e mostre um elemento `contenteditable` simples. Digite algum texto e demonstre como o valor se comporta ao inspecionar o DOM. Depois, explique que bibliotecas como o Lexical mantêm uma representação paralela para evitar inconsistências.

Podemos também mostrar um snippet de código comparando manipulação direta do DOM com o uso de uma API de nós:
```javascript
// Exemplo simplificado
const paragraph = editor.update(() => {
  const root = $getRoot();
  const p = $createParagraphNode();
  p.append($createTextNode('Exemplo'));
  root.append(p);
});
```
Reforce que esse padrão garante melhor controle sobre o que é renderizado.

## Considerações sobre acessibilidade
- Explique a importância de definir corretamente os atributos ARIA.
- Mostre que o Lexical implementa navegação de caret consistente para leitores de tela.
- Comente boas práticas para atalhos de teclado, para que o editor seja usado por usuários com deficiências motoras.

## Conclusão
Feche a aula ressaltando que, com essa visão interna, será mais simples entender as futuras implementações. Peça para que os alunos experimentem criar um pequeno protótipo usando `contenteditable` puro antes de seguirem para a próxima aula.

### Exercício sugerido
Crie uma pequena página HTML com um elemento `div` configurado como `contenteditable`. Tente implementar, em JavaScript puro, a inserção de um parágrafo programaticamente e a movimentação do cursor. Em seguida, reflita sobre as dificuldades encontradas. Compartilhe suas conclusões no fórum do curso.

Com isso, encerramos nossa imersão teórica. Prepare-se para colocar a mão na massa no próximo vídeo.

### Leituras complementares
- [Documentação oficial do Lexical](https://lexical.dev)
- [Artigo: Como o Lexical lida com updates eficientes](https://lexical.dev/docs/concepts/updates)
- [Discussão sobre modelos de edição em rich text](https://example.com/artigo-modelos)

Agora seguimos para a prática com a criação do editor.
