import React from 'react'
import { Animated } from 'React-native'

export interface GradientPropsMandatory {
  primaryColor: string
  secondaryColor: string
  duration: number
  width: number | string
  height: number | string
  x1: string,
  y1: string,
  x2: string,
  y2: string,
  useNativeDriver: bool,
}
export type GradientProps = Partial<GradientPropsMandatory>

export default class SvgAnimatedLinearGradient extends React.Component {
  state: {
    initialOffsetValues: [number, number, number]
    offsetValues: [string, string, string]
    offsets: [string, string, string]
    frequence: number
  }

  _isMounted: boolean
  _animate: Animated.Value

  static propTypes: Record<keyof GradientPropsMandatory, any>
  static defaultProps: GradientPropsMandatory

  constructor(props: GradientProps)

  offsetValueBound(x: number | string): number | string
  componentDidMount(props: GradientProps): void
  componentWillUnmount(): void
  loopAnimation(): void
  render(): JSX.Element
}
