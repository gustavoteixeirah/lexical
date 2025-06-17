# Aula 12 - Histórico e Atalhos de Teclado

Para que o usuário tenha uma experiência fluida, vamos habilitar a navegação por atalhos e o famoso desfazer/refazer.

## Histórico
1. Já adicionamos o `HistoryPlugin` anteriormente, mas agora explique suas opções: limite de itens, delay e comandos disponibilizados (`UNDO_COMMAND` e `REDO_COMMAND`).
2. Mostre no código como é simples usar `editor.dispatchCommand(UNDO_COMMAND)` a partir de um botão ou atalho.

## Atalhos de teclado
1. No plugin `MyShortcutPlugin` criado na aula 6, registre atalhos para formatação: `Ctrl+B` para negrito, `Ctrl+I` para itálico, `Ctrl+U` para sublinhado.
2. Utilize `editor.registerCommand(KEY_MODIFIER_COMMAND, callback, priority)` para capturar combinações envolvendo `Ctrl` ou `Cmd`.
3. Explique como evitar conflitos com atalhos do navegador, retornando `true` quando o evento for tratado pelo Lexical.
4. Adicione também atalhos para `undo` (`Ctrl+Z`) e `redo` (`Ctrl+Shift+Z`).

Ao final da aula, demonstre a edição de um texto aplicando estilos via teclado e utilizando undo/redo para reverter as mudanças.

## Configurações avançadas de histórico
É possível ajustar o intervalo de salvamento de estados usando `new HistoryPlugin({delay: 1000})`. Assim, o editor não cria uma entrada de histórico a cada digitação, mas sim a cada segundo de inatividade. Explique como isso reduz a quantidade de memória usada e ainda oferece uma boa experiência.

### Desabilitando atalhos específicos
Caso algum atalho conflite com outro recurso do seu aplicativo, use `event.preventDefault()` dentro do callback para impedir o comportamento padrão. Em seguida, decida se o comando do Lexical será disparado ou não.

### Exercício prático
1. Crie um botão "Desfazer" que chama `editor.dispatchCommand(UNDO_COMMAND)`.
2. Crie um botão "Refazer" para `REDO_COMMAND`.
3. Mostre que ambos funcionam em sincronia com os atalhos de teclado.

## Atalhos customizados
Você pode registrar quantos comandos desejar. Para organizações maiores, centralize a configuração em um arquivo de constantes. Isso facilita a manutenção e evita duplicações.

Terminamos a parte de histórico e atalhos. Avance para o módulo de colaboração.

### Dica de UX
Mostre mensagens de atalho ao usuário em tooltips ou no texto do botão: "Ctrl+Z para desfazer". Assim ele aprende as combinações mais rapidamente.

### Monitorando o histórico
Podemos inspecionar o tamanho da pilha de histórico através de `history.state.undoStack.length`. Use isso para criar limites ou alertar o usuário se houver muitas mudanças pendentes.

### Undo/Redo programático
O Lexical permite criar checkpoints. Chame `editor.getEditorState().clone()` antes de uma operação arriscada e, se necessário, restaure o estado antigo com `editor.setEditorState(clone)`.

### Registrando atalhos globais
Se o editor estiver em uma página com muitos outros componentes, talvez você queira escutar atalhos no nível do `window`. Explique como adicionar um listener global e redirecionar o evento para o editor quando apropriado.

### Exercício de fixação
Crie um plugin que registra `Ctrl+S` para salvar o documento no `localStorage`. Mostre que o evento do navegador é bloqueado e um aviso de "Documento salvo" aparece na tela.

### Organização do código
Para um projeto grande, crie uma pasta `shortcuts` e registre cada atalho em um arquivo separado. Importe esses módulos no plugin principal para centralizar a definição de teclas.

### Ferramentas recomendadas
- [hotkeys-js](https://github.com/jaywcjlove/hotkeys) para gerenciamento de atalhos de maneira simples.
- [immer](https://github.com/immerjs/immer) pode auxiliar a manipular estados imutáveis se combinar com outros plugins.

### Modo de edição simplificado
Em aplicações com vários modos (visualização, edição, revisão), talvez seja necessário habilitar ou desabilitar atalhos conforme o contexto. Mostre um exemplo com `useEffect` observando uma variável `isEditing` e registrando os comandos somente quando ativo.

### Consideração final
Treine bastante os atalhos e incentive os usuários a fazer o mesmo. Isso torna a experiência com o editor muito mais fluida.

### Referências
- [Docs do HistoryPlugin](https://lexical.dev/docs/plugins/history)
- [Exemplo de custom shortcut](https://lexical.dev/docs/how-to/#handling-keyboard-commands)

Agora vamos implementar colaboração em tempo real.

Obrigado por acompanhar esta aula.
Pratique bastante!
Até a próxima aula!
Linha extra 1.
Linha extra 2.
Linha extra 3.
Linha extra 4.
Linha extra 5.
Linha extra 6.
Linha extra 7.
Linha extra 8.
Linha extra 9.
Linha extra 10.
Linha extra final.
