import { CART_FRAGMENT, IMAGE_FRAGMENT, MONEY_FRAGMENT } from './fragments'

const CART_DEPS = `
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${CART_FRAGMENT}
`

export const CART_CREATE_MUTATION = /* GraphQL */ `
  ${CART_DEPS}
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`

export const CART_LINES_ADD_MUTATION = /* GraphQL */ `
  ${CART_DEPS}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`

export const CART_LINES_UPDATE_MUTATION = /* GraphQL */ `
  ${CART_DEPS}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`

export const CART_LINES_REMOVE_MUTATION = /* GraphQL */ `
  ${CART_DEPS}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`
