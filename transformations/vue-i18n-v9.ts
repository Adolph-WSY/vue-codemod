import wrap from '../src/wrapAstTransformation'
import type { ASTTransformation } from '../src/wrapAstTransformation'

import { transformAST as addImport } from './add-import'

/**
 * import VueI18n from 'vue-i18n' -> import { createI18n } from 'vue-i18n'
 * new VueI18n() -> createI18n()
 * @param context
 */
export const transformAST: ASTTransformation = context => {
  const { root, j } = context

  // import VueI18n from 'vue-i18n' -> import { createI18n } from 'vue-i18n'
  const vueI18nImportDecls = root.find(j.ImportDeclaration, {
    specifiers: [
      {
        local: {
          name: 'VueI18n'
        }
      }
    ],
    source: {
      value: 'vue-i18n'
    }
  })
  if (vueI18nImportDecls) {
    vueI18nImportDecls.remove()
    addImport(context, {
      specifier: { type: 'named', imported: 'createI18n' },
      source: 'vue-i18n'
    })
  }

  // new VueI18n() -> createI18n()
  const newVueI18n = root.find(j.NewExpression, {
    callee: {
      type: 'Identifier',
      name: 'VueI18n'
    }
  })
  if (newVueI18n) {
    newVueI18n.replaceWith(({ node }) => {
      return j.callExpression(j.identifier('createI18n'), node.arguments)
    })
  }
}

export default wrap(transformAST)
export const parser = 'babylon'
