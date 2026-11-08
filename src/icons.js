/*
Custom icons
*/

import {html} from 'lit'
import {
  CaretLeft,
  CaretRight,
  ChartPie,
  CirclesThreePlus,
  Hourglass,
  TreeStructure,
  X,
} from './icons/phosphor.js'

export const ringsIconPath = CirclesThreePlus
export const closeIcon = html`<svg height="24" width="24" viewBox="0 0 256 256">
  <path fill="var(--grampsjs-body-font-color-100)" d="${X}" />
</svg>`
export const chevronLeftIcon = html`<svg
  height="24"
  width="24"
  viewBox="0 0 256 256"
>
  <path fill="var(--grampsjs-body-font-color-100)" d="${CaretLeft}" />
</svg>`
export const chevronRightIcon = html`<svg
  height="24"
  width="24"
  viewBox="0 0 256 256"
>
  <path fill="var(--grampsjs-body-font-color-100)" d="${CaretRight}" />
</svg>`
export const chartFanIconPath = ChartPie

export const hourglassIconPath = Hourglass

export const relationshipGraphIconPath = TreeStructure

export function renderIcon(path, color = 'var(--grampsjs-body-font-color-40)') {
  return html`<i
    ><svg height="24" width="24" viewBox="0 0 256 256">
      <path fill="${color}" d="${path}" /></svg
  ></i>`
}

export function renderIconSvg(
  path,
  color = 'var(--grampsjs-body-font-color-40)',
  rotate = 0,
  slot = ''
) {
  return html`<svg
    height="24"
    width="24"
    viewBox="0 0 256 256"
    slot="${slot}"
    transform="rotate(${rotate})"
  >
    <path fill="${color}" d="${path}" />
  </svg>`
}
