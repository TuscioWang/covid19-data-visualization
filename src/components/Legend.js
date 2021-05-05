import React from 'react';
import { scaleOrdinal } from '@visx/scale';
import { DATA_COLORS, CHECKBOX_DATA } from './AppConfig';
import {
    LegendOrdinal,
    LegendItem,
    LegendLabel,
} from '@visx/legend';

export default function Legend(props) {
    const selected = props.selected;
    const legendGlyphSize = 15;

    const ordinalScale = scaleOrdinal({
        domain: selected.map((key) => CHECKBOX_DATA[key].label),
        range: selected.map((key) => DATA_COLORS[key]),
    });

    return (
        <div className="legend">

            <LegendOrdinal scale={ordinalScale} labelFormat={label => `${label.toUpperCase()}`}>
                {labels => (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {labels.map((label, i) => (
                            <LegendItem
                                key={`legend-ordinal-${i}`}
                                margin="3px 10px 3px 10px"
                            >
                                <svg width={legendGlyphSize} height={legendGlyphSize}>
                                    <rect style={{strokeWidth: "2", stroke: "black" }} fill={label.value} width={legendGlyphSize} height={legendGlyphSize} />
                                </svg>
                                <LegendLabel align="left" margin="0 5px">
                                    {label.text}
                                </LegendLabel>
                            </LegendItem>
                        ))}
                    </div>
                )}
            </LegendOrdinal>

            <style jsx>
                {`
        .legend {
          font-family: arial;
          font-weight: bold;
          background-color: trasparent;
          border-radius: 14px;
          padding: 10px 10px 10px 10px;
          overflow-y: auto;
          flex-grow: 1;
          border:black 1px solid;
        }

      `}</style>
        </div>
    );
}