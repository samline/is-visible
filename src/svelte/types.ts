export interface VisibilityActionReturn<TParameter = undefined> {
  update?: (parameter: TParameter) => void
  destroy?: () => void
}

export type VisibilityAction<
  TElement extends Element = HTMLElement,
  TParameter = undefined
> = (
  node: TElement,
  parameter?: TParameter
) => void | VisibilityActionReturn<TParameter>
