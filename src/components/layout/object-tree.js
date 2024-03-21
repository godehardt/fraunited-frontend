import React, { useState } from 'react'

const ObjectTree = ({ object, title, first }) => {
  const [show, setShow] = useState(false)

  function objectRendering (ob) {
    const content = []
    for (const key in object) {
      const element = object[key]

      switch (typeof element) {
        case 'string':
        case 'number':
          content.push((
            <div>
              <i className='bi bi-caret-down-fill me-1 invisible' />{key}: <span className='text-primary'>{element}</span>
            </div>
          ))
          break
        case 'boolean':
          content.push((
            <div>
              <i className='bi bi-caret-down-fill me-1 invisible' />{key}: <span className='text-primary'>{element ? 'true' : 'false'}</span>
            </div>
          ))
          break
        case 'object':
          if (element === null) {
            content.push((
              <div>
                <i className='bi bi-caret-down-fill me-1 invisible' />{key}: <span className='text-muted'>null</span>
              </div>
            ))
            break
          }
          content.push((
            <>
              <ObjectTree title={key} object={element} />
            </>
          ))
          break
        default:
          content.push((
            <div>
              <i className='bi bi-caret-down-fill me-1 invisible' /> {key}: {typeof element} rendering not supported
            </div>
          ))
          break
      }
    }
    if (ob && !Object.keys(ob).length) {
      content.push((
        <div className='text-danger'>
          <i className='bi bi-caret-down-fill me-1 invisible' /> Empty
        </div>
      ))
    }
    return (
      <div className='ps-2'>
        {content}
      </div>
    )
  }

  return (
    <div>
      {
        first
          ? (objectRendering(object))
          : (
            <>
              <div onClick={() => setShow(!show)}>
                {show ? (<i className='bi bi-caret-down-fill me-1' />) : (<i className='bi bi-caret-right-fill me-1' />)}
                {title}
              </div>
              {show ? objectRendering(object) : ''}
            </>
            )
      }
    </div>
  )
}

export default ObjectTree
