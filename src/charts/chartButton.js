import {select} from 'd3-selection'
import {CaretDown, CaretLeft, CaretRight, CaretUp} from '../icons/phosphor.js'
// The chevron buttons of the charts. Their radius, in pixels.
export const buttonRadius = 20
// Radius of the backdrop around the chevron, in pixels
const backdropRadius = 12
// The size of the chevron glyph, in pixels.
const iconSize = 24
/*
 * Phosphor draws its icons on a 256x256 grid, while the chart canvas works
 * in screen pixels with one viewBox unit to one pixel. The path therefore
 * has to be scaled down to the icon's size before it is positioned, or the
 * chevron renders at 256 units — a huge arrow across the chart.
 *
 * The chart buttons used to hold Material Design Icons, whose paths are on
 * a 24-unit grid and needed no scaling. Swapping the icon set without
 * scaling is what produced the oversized arrow.
 */
const iconScale = iconSize / 256

const chevrons = {
  left: CaretLeft,
  right: CaretRight,
  top: CaretUp,
  bottom: CaretDown,
}

// Appends buttons to the `enter` selection that call `activate(event, d)`
// when clicked or on Enter or Space. A button is a chevron in a round area of
// `buttonRadius` that is shaded while the pointer is on it or it has focus.
// With `backdrop`, a disc in the background colour fades lines that run under
// the chevron.
export function enterChartButtons(enter, activate, {backdrop = true} = {}) {
  function onActivate(e, d) {
    activate.call(this, e, d)
    e.stopPropagation()
    e.preventDefault()
  }
  function shade() {
    select(this)
      .select('.shade')
      .attr('fill-opacity', this.matches(':hover, :focus') ? 1 : 0)
  }
  const button = enter
    .append('g')
    .attr('role', 'button')
    .attr('tabindex', 0)
    .style('cursor', 'pointer')
    .on('click', onActivate)
    .on('keydown', function (e, d) {
      if (e.key === 'Enter' || e.key === ' ') {
        onActivate.call(this, e, d)
      }
    })
    .on('mouseenter mouseleave focus blur', shade)
  if (backdrop) {
    button
      .append('circle')
      .attr('class', 'backdrop')
      .attr('r', backdropRadius)
      .attr('fill-opacity', 0.8)
  }
  button
    .append('circle')
    .attr('class', 'shade')
    .attr('r', buttonRadius)
    .attr('fill-opacity', 0)
  // The icon is scaled to its size and centred on the button
  button
    .append('path')
    .attr(
      'transform',
      `translate(${-iconSize / 2},${-iconSize / 2}) scale(${iconScale})`
    )
  return button
}

// Colours the buttons from `palette` and points the chevron of each to
// `side(d)`: 'left', 'right', 'top' or 'bottom'
export function styleChartButtons(buttons, palette, side) {
  buttons.select('.backdrop').attr('fill', palette.background)
  buttons.select('.shade').attr('fill', palette.triangleHover)
  buttons
    .select('path')
    .attr('d', d => chevrons[side(d)])
    .attr('fill', palette.triangle)
}
