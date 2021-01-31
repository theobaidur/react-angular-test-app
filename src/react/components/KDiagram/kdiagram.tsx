/* 
NOTE : This library is under construction, please do not modify or change
*/

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

import { getXYDomains } from './kdiagram_helpers';
import { extractData } from './kdiagram_extractor';
import { useTranslation } from 'react-i18next';
import { KDiagramHolder } from './kdiagram_styles';
import showNum from '../../utils/showNum';

interface KDiagram_Props {
  data: any;

  width?: number;
  height?: number;

  aspectRatio?: number;
  hideAxis?: boolean;
  disableEvents?: boolean;
  disableZoom?: boolean;
  labels?: boolean;
}

const KDiagram: React.FC<KDiagram_Props> = ({
  data,

  width,
  height,

  aspectRatio = 0,
  hideAxis = false,
  disableEvents = false,
  disableZoom = false,
  labels = true,
  ...props
}) => {
  const { t } = useTranslation('module_analyzer');

  // Classify and identify
  const id = (0 | (Math.random() * 6.04e7)).toString(36);
  const klass = `kDiagram-${id}-`;

  // States
  const [dimensions, setDimensions] = useState({
    width: width || 0,
    height: height || 0
  });

  const [isResized, setResized] = useState(false);

  /* const [layout, setLayout] = useState( 'L' ); */
  // Ref
  const divRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Mount and update
  useEffect(() => {
    // Base dimensions
    const kWidth = dimensions.width,
      kHeight = dimensions.height,
      margin = {
        top: hideAxis ? 0 : 20,
        right: hideAxis ? 0 : 60,
        bottom: hideAxis ? 0 : 40,
        left: hideAxis ? 0 : 0
      },
      xWidth = kWidth - margin.right - margin.left,
      yHeight = kHeight - margin.bottom - margin.top,
      domains = getXYDomains(data),
      xDomain = domains.x,
      yDomain = domains.y,
      xMax = xDomain[1],
      yMax = yDomain[1],
      xOffset = Math.abs(xDomain[0]),
      labelOffsetX = 10,
      labelOffsetY = 10,
      labelHeight = 20,
      labelFontSize = 14,
      labelPadding = 10,
      labelColorMain = 'white',
      labelColorAlt = 'black';

    // Data
    const extract = extractData(xDomain, yDomain, xWidth, yHeight, data);
    // Block creator
    const createBlock = (
      elem: d3.Selection<SVGGElement, {}, null, undefined>,
      data: { [key: string]: any },
      noZoom: boolean = false,
      withLabel: boolean = false
    ) => {
      const blockLabel = t(`labels.${data.labelId}`) + ' ' + (data.labelExtra || '');
      elem
        .append('rect')
        .attr('class', `${klass}block ${data.id}`)
        .attr('connected', `${data.id}`)
        .attr('noZoom', noZoom)
        .attr('x', data.x)
        .attr('y', data.y)
        .attr('width', data.width)
        .attr('height', data.height)
        .attr('fill', data.fill)
        .attr('stroke', data.fill)
        .attr('stroke-width', '1px')
        .attr('baseColor', data.fill)
        .attr('labelText', blockLabel)
        .attr('labelValue', data.value)
        .attr('labelTime', data.time)
        .attr('labelMonth', data.month)
        .attr('labelFill', data.type > 42 ? labelColorAlt : labelColorMain);
      if (withLabel) {
        elem
          .append('g')
          .attr('class', `${klass}block-label label-${data.id}`)
          .attr('connected', `${data.id}`)
          .append('text')
          .text(blockLabel)
          .attr('x', data.x + labelOffsetX)
          .attr('y', data.y + labelOffsetY)
          .attr('dy', labelHeight)
          .attr('font-size', labelFontSize)
          .attr('fill', data.type > 42 ? labelColorAlt : labelColorMain);
      }
      return elem;
    };

    const getTextWidth = (main: d3.Selection<Element, {}, null, undefined>, textData: string[], fontSize: number) => {
      const textWidth: number[] = [];
      main
        .append('g')
        .selectAll('.dummyText')
        .data(textData)
        .enter()
        .append('text')
        .attr('font-size', fontSize)
        .text(function(d) {
          return d;
        })
        .each(function(d, i) {
          var thisWidth = this.getComputedTextLength();
          textWidth.push(thisWidth);
          if( this.remove ){
            this.remove();
          }else{
            this.parentNode && this.parentNode.removeChild(this);
          }
        });
      return textWidth;
    };

    // Inner helper functions
    /* function getY(d:number){ return yHeight-d; } */

    // Creator function
    const createDiagram = (svg: Element | null) => {
      if (svg === null || !(xWidth > 0) || !(yHeight > 0)) {
        return;
      }

      // Empty to recreate
      svg.innerHTML = '';
      svg.childNodes.forEach((node)=>{
        node.parentNode && node.parentNode.removeChild(node);
      });

      // SVG as main
      const main: d3.Selection<Element, {}, null, undefined> = d3.select(svg);

      // Setup clip path
      main
        .append('defs')
        .append('clipPath')
        .attr('id', `${klass}clip`)
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', xWidth)
        .attr('height', yHeight);

      // Setup scales and axis
      let xAxisTickList: string[] = [];
      const x = d3
          .scaleLinear()
          .domain(xDomain)
          .range([0, xWidth]),
        y = d3
          .scaleLinear()
          .domain(yDomain)
          .range([yHeight, 0]),
        xAxis = d3.axisBottom(x),
        yAxis = d3.axisRight(y),
        xAxisHolder = main.append('g'),
        yAxisHolder = main.append('g'),
        xAxisTicks = (n: number | { valueOf(): number }, ticks: string[]) => {
          const tick = Math.floor(domains.xMinTick + +n / 12).toString();
          if (ticks.indexOf(tick) === -1) {
            ticks.push(tick);
            return tick;
          } else {
            return '';
          }
        },
        xAxisFunc = () =>
          xAxisHolder.attr('transform', `translate( ${margin.left}, ${yHeight + margin.top} )`).call(
            xAxis
              .tickValues(extract.monthBreaks)
              .tickFormat((n) => {
                return xAxisTicks(n, xAxisTickList);
              })
              .tickSizeOuter(0)
          ),
        yAxisFunc = () =>
          yAxisHolder
            .attr('transform', `translate( ${xWidth + margin.left}, ${margin.top} )`)
            .call(yAxis.tickSizeOuter(0));

      xAxisHolder.call(xAxisFunc);
      yAxisHolder.call(yAxisFunc);
      if (hideAxis) {
        yAxisHolder.attr('display', 'none');
        xAxisHolder.attr('display', 'none');
      }

      function resetDomains() {
        x.domain(domains.x);
        y.domain(domains.y);
      }

      // Setup main zoom behaviors
      const mainZoom = d3
        .zoom<Element, any>()
        .scaleExtent([1, 32])
        .translateExtent([
          [0, 0],
          [kWidth, yHeight]
        ])
        .extent([
          [0, 0],
          [kWidth, yHeight]
        ])
        .on('zoom', mainZoomFunc);

      /*// Setup handle drag behavior
      const handleDrag = d3.drag<SVGRectElement, any>()
         .subject(function() { 
         const t = d3.select( this );
         return { x: t.attr('x'), y: t.attr('y') };
         })    
         .on( 'drag', handleDragFunc );*/

      // Setup container
      const frame = main
        .call(mainZoom)
        .append('g')
        .style('clip-path', `url(#${klass}clip)`)
        .attr('width', xWidth)
        .attr('height', yHeight)
        .attr('transform', `translate( ${margin.left}, ${margin.top} )`)
        .append('g')
        .attr('class', klass + 'frame')
        .attr('width', xWidth)
        .attr('height', yHeight);

      // Append constant
      const constants = frame.append('g').attr('class', 'constantsGroup'),
        incomeBlock = createBlock(constants, extract.income, true, labels);
      incomeBlock
        .select('text')
        .attr(
          'visibility',
          getTextWidth(main, [incomeBlock.select('rect').attr('labelText')], labelFontSize)[0] + labelOffsetX * 2 >
            +incomeBlock.select('rect').attr('width')
            ? 'hidden'
            : 'visible'
        );

      // Setup groups for types
      const groups: { [key: string]: d3.Selection<SVGGElement, {}, null, undefined> } = {};
      const groupWidths: any = {};
      extract.groups.forEach((k) => {
        groups[k] = frame.append('g').attr('class', `${klass}group group${k}`);
        groupWidths[k] = 0;
      });

      // Append data
      extract.steps.forEach((step, k) => {
        step.pos.forEach((pos, i) => {
          groupWidths[pos.type] += pos.width;
          const block = groups[pos.type].append('g');
          createBlock(block, pos);
        });
      });

      // Setup group labels
      const groupLabels: { [key: string]: any } = {};
      if (labels) {
        Object.keys(groups).forEach((k) => {
          if (!groups[k]) return false;
          const groupLabel = t(`labels.${data.groupLabels['type' + k]}`);
          const groupFirst = d3.select(`.group${k} g > rect:first-child`);
          if (!groupFirst) return false;
          groupLabels[k] = groups[k]
            .append('g')
            .attr('class', `${klass}group-label-holder label-group${k}`)
            .attr('connected', `group${k}`)
            .append('text')
            .attr('class', `${klass}group-label`)
            .attr('availableWidth', groupFirst.attr('width'))
            .attr('availableHeight', groupFirst.attr('height'))
            .attr('labelText', groupLabel)
            .text(groupLabel)
            .attr('x', +groupFirst.attr('x') + labelOffsetX)
            .attr('y', +groupFirst.attr('y') + labelOffsetY)
            .attr('dy', labelHeight)
            .attr('font-size', labelFontSize)
            .attr('fill', +k === 5 || +k > 42 ? labelColorAlt : labelColorMain);
        });
      }

      // handle tracker for drag
      /* let activeHandle = d3.select('.handle'); */

      // Mouse events
      let transitionToken = false;
      if (disableEvents === false) {
        d3.selectAll(`.${klass}block`)
          .on('mouseover', function() {
            const self = d3.select(this);
            if (!self.attr('zoomed') || self.attr('zoomed') === 'false') self.attr('opacity', '0.6');
          })
          .on('mouseout', function() {
            const self = d3.select(this);
            self.attr('opacity', '1');
          })
          .on('click', function() {
            blockZoom(d3.select(this));
          })
          .on('dblclick', null);
      }

      // blockzoom event
      let temporaryDisableZoom = false;
      function blockZoom(self: any) {
        if (self.attr('noZoom') === 'true') return;
        temporaryDisableZoom = true;
        if (transitionToken === true) return;
        transitionToken = true;

        if (self.attr('zoomed') === 'true') {
          self.attr('zoomed', 'false');
          d3.selectAll(`.${klass}block`).attr('stroke-width', '1px');

          xAxisTickList = [];
          resetDomains();
          xAxis.scale(x);
          yAxis.scale(y);

          frame
            .transition()
            .delay(100)
            .duration(700)
            .attr('transform', 'translate(' + 0 + ',' + 0 + ')scale(' + 1 + ',' + 1 + ')');

          xAxisHolder
            .transition()
            .duration(700)
            .call(xAxis);
          yAxisHolder
            .transition()
            .duration(700)
            .call(yAxis);

          main
            .select('.zoomedLabel')
            .transition()
            .duration(400)
            .attr('opacity', 0)
            .remove();
          setTimeout(function() {
            temporaryDisableZoom = false;
            adaptLabels(main);
          }, 800);
        } else {
          self.attr('zoomed', 'true').attr('opacity', '1');

          d3.selectAll(`.${klass}block`).attr('stroke-width', '0px');

          adaptLabels(main, true);

          const w = +self.attr('width'),
            h = +self.attr('height'),
            xx = +self.attr('x'),
            yy = +self.attr('y'),
            xScale = xWidth / w,
            yScale = yHeight / h,
            xTranslate = xWidth / 2 - xx * xScale - (w / 2) * xScale,
            yTranslate = yHeight / 2 - yy * yScale - (h / 2) * yScale;

          xAxisTickList = [];

          x.domain([xx / (xWidth / (xMax + xOffset)) - xOffset, (xx + w) / (xWidth / (xMax + xOffset)) - xOffset]);
          y.domain([(yHeight - yy - h) / (yHeight / yMax), (yHeight - yy) / (yHeight / yMax)]);

          xAxis.scale(x);
          yAxis.scale(y);

          frame
            .transition()
            .delay(100)
            .duration(700)
            .attr('transform', 'translate(' + xTranslate + ',' + yTranslate + ')scale(' + xScale + ',' + yScale + ')');

          xAxisHolder
            .transition()
            .duration(700)
            .call(xAxis);
          yAxisHolder
            .transition()
            .duration(700)
            .call(yAxis);

          const labelValue = t(`labelValue`) + ' ' + showNum(+self.attr('labelValue')),
            labelTime = self.attr('labelTime') + ' ' + t(`labelTime`),
            labelMonth = t(`labelMonth`) + ' ' + showNum(+self.attr('labelMonth'));
          const labelWidths = getTextWidth(main, [labelValue, labelTime, labelMonth], labelFontSize + 4);

          const zoomedLabel = main
            .append('g')
            .attr('class', 'zoomedLabel')
            .attr('opacity', 0);
          zoomedLabel
            .append('text')
            .text(self.attr('labelText'))
            .attr('x', labelOffsetX + margin.left)
            .attr('y', labelOffsetY + margin.top)
            .attr('dy', labelHeight)
            .attr('font-size', labelFontSize + 4)
            .attr('fill', self.attr('labelFill'));
          zoomedLabel
            .append('text')
            .text(labelValue)
            .attr('x', kWidth - margin.right - labelOffsetX - labelWidths[0])
            .attr('y', labelOffsetY + margin.top)
            .attr('dy', labelHeight)
            .attr('font-size', labelFontSize + 4)
            .attr('fill', self.attr('labelFill'));
          zoomedLabel
            .append('text')
            .text(labelTime)
            .attr('x', kWidth - margin.right - labelOffsetX - labelWidths[1])
            .attr('y', kHeight - labelHeight - labelOffsetY - margin.bottom)
            .attr('dy', labelHeight)
            .attr('font-size', labelFontSize + 4)
            .attr('fill', self.attr('labelFill'));
          zoomedLabel
            .append('rect')
            .attr('x', labelOffsetX + margin.left)
            .attr('y', labelOffsetY + margin.top + labelHeight * 1.5)
            .attr('width', labelWidths[2] + labelPadding * 2)
            .attr('height', labelHeight + labelPadding * 2)
            .attr('fill', self.attr('labelFill'));
          zoomedLabel
            .append('text')
            .text(labelMonth)
            .attr('x', labelOffsetX + margin.left + labelPadding)
            .attr('y', labelOffsetY + margin.top + labelHeight * 1.5 + labelPadding / 2)
            .attr('dy', labelHeight)
            .attr('font-size', labelFontSize + 4)
            .attr('fill', self.attr('baseColor'));

          zoomedLabel
            .transition()
            .delay(700)
            .duration(500)
            .attr('opacity', 1);
        }
        setTimeout(function() {
          transitionToken = false;
        }, 800);
      }

      // Main zoom function
      function mainZoomFunc() {
        if (disableZoom || temporaryDisableZoom) return;

        const t = d3.event.transform;

        resetDomains();
        const xNewScale = t.rescaleX(x);
        const yNewScale = t.rescaleY(y);

        frame.attr('transform', t);

        xAxis.scale(xNewScale);
        xAxisHolder.call(xAxisFunc);

        yAxis.scale(yNewScale);
        yAxisHolder.call(yAxisFunc);

        xAxisTickList = [];
        adaptLabels(main);
      }

      // Drag function for handles
      /* function handleDragFunc(){
         const handle = activeHandle;
         const con = handle.attr('connected');
         const hy = +handle.attr('y');
         const dragy = d3.select(`.${con}`);
         const h = +dragy.attr('height');
         // const yy = +dragy.attr('y');
         console.log(hy, d3.event.y);
         dragy.attr('height',h + (hy-d3.event.y) );
         dragy.attr('y', getY(h + (hy-d3.event.y)) );
         handle.attr('y',d3.event.y);
      } */
      return main;
    };

    // Adapt label visiblity
    const adaptLabels = (main: any, hide: boolean = false) => {
      d3.selectAll(`.${klass}group-label`).each(function() {
        const self = d3.select(this),
          aWidth = +self.attr('availableWidth'),
          aHeight = +self.attr('availableHeight'),
          aText = getTextWidth(main, [self.attr('labelText')], labelFontSize);
        if (hide || aHeight < labelHeight * 2 || aWidth < aText[0] + labelOffsetX * 2) {
          self.attr('visibility', 'hidden');
        } else {
          self.attr('visibility', 'visible');
        }
      });
    };

    // Resize function for listener
    const updateResize = () => {
      setResized(!isResized);
    };

    window.addEventListener('resize', updateResize);
    const newWidth = (divRef.current && divRef.current.getBoundingClientRect().width) || 0;
    const newHeight = aspectRatio
      ? newWidth * (2 / 3)
      : (divRef.current && divRef.current.getBoundingClientRect().height) || 0;
    if (newWidth !== dimensions.width || newHeight !== dimensions.height) {
      setDimensions({ width: width || newWidth, height: height || newHeight });
    }

    const main = createDiagram(svgRef.current);
    adaptLabels(main);

    return () => {
      window.removeEventListener('resize', updateResize);
    };
  }, [dimensions, isResized, data, aspectRatio, height, width, disableEvents, disableZoom, hideAxis, klass, labels, t]);

  return (
    <KDiagramHolder id={'kDiagram-' + id} ref={divRef}>
      <svg id={'kDiagram-SVG-' + id} ref={svgRef} width={dimensions.width} height={dimensions.height}></svg>
    </KDiagramHolder>
  );
};

export default KDiagram;
