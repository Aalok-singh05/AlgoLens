import React from "react"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`p-3.5 elevated-card rounded-lg transition-[border-color,background-color,transform] duration-200 ease-out min-w-0 max-w-full ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
