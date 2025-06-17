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
