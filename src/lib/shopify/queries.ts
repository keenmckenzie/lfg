import {
  CART_FRAGMENT,
  IMAGE_FRAGMENT,
  MONEY_FRAGMENT,
  PRODUCT_FRAGMENT,
  PRODUCT_SUMMARY_FRAGMENT,
  VARIANT_FRAGMENT,
} from './fragments'

export const GET_PRODUCTS_QUERY = /* GraphQL */ `
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PRODUCT_SUMMARY_FRAGMENT}
  query GetProducts($first: Int!) {
    products(first: $first, sortKey: BEST_SELLING) {
      edges {
        node {
          ...ProductSummaryFields
        }
      }
    }
  }
`

export const GET_PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${VARIANT_FRAGMENT}
  ${PRODUCT_SUMMARY_FRAGMENT}
  ${PRODUCT_FRAGMENT}
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
`

export const GET_PRODUCT_HANDLES_QUERY = /* GraphQL */ `
  query GetProductHandles($first: Int!) {
    products(first: $first) {
      edges {
        node {
          handle
        }
      }
    }
  }
`

export const GET_CART_QUERY = /* GraphQL */ `
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${CART_FRAGMENT}
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
`
