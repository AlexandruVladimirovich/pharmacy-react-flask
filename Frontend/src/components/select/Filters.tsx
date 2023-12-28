import React, { useState } from 'react'

interface FilterParameters {
    item: string;
    header: string;
    handler: (e: any) => void;
    options: string[];
}

export default function Filters(params: FilterParameters) {
    const { item, header, handler, options } = params;

  return (
    <>
        <h3>{header}</h3>
        <select id={ header } name={ header } value={item} onChange={handler}>
            { options.map(opt => (
                <option value={ opt }>{ opt }</option>
            )) }
        </select>
    </>
  )
}
