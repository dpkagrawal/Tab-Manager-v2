import React from 'react'
import classNames from 'classnames'

export default (props) => {
  const { onClick, disabled, ...restProps } = props
  return (
    <button
      {...restProps}
      {...{
        onClick,
        disabled
      }}
      className={classNames(
        'inline-flex items-center justify-center w-8 h-8 m-2 text-xl text-red-200 bg-transparent rounded-full disabled:opacity-75',
        {
          'hover:text-red-500 hover:bg-red-100 focus:outline-none focus:shadow-outline active:bg-red-300 active:text-red-700': !disabled,
          'cursor-not-allowed': disabled
        }
      )}
    >
      x
    </button>
  )
}
